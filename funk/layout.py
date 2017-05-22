from enum import Enum, auto
from typing import Dict
from typing import List


class ConnDirection(Enum):
    IN = auto()
    OUT = auto()


class ConnSide(Enum):
    LEFT = auto()
    RIGHT = auto()


class Node:
    def __init__(self, node_json: dict, nodetype_json: dict):
        self.nodetype_json = nodetype_json
        self.id = node_json['nodeid']
        self.x = node_json['top']
        self.y = node_json['left']

        self.height = 2 + max(len(nodetype_json['connector_l']), len(nodetype_json['connector_r']))
        self.width = round(max(len(node_json['name']), len(nodetype_json['name']),
                               max([0, *map(lambda t: len(t['name']), nodetype_json['connector_l'])]) +
                               max([0, *map(lambda t: len(t['name']), nodetype_json['connector_l'])])) / 3)

        self.left_connectors = [
            Connector(self,
                      c['id'],
                      ConnDirection[c['direction'].upper()],
                      ConnSide.LEFT)
            for c in nodetype_json['connector_l']
        ]  # type: List[Connector]
        self.right_connectors = [
            Connector(self,
                      c['id'],
                      ConnDirection[c['direction'].upper()],
                      ConnSide.RIGHT)
            for c in nodetype_json['connector_r']
        ]  # type: List[Connector]

        self.layer = None  # type: int
        self.uplift = 0  # type: float

    def get_connector(self, name: str):
        try:
            return [c for c in self.left_connectors + self.right_connectors if c.id == name][0]
        except IndexError as e:
            raise KeyError from e

    def get_left_connected_nodes(self):
        return [rem_conn.node
                for this_conns in self.left_connectors
                for rem_conn in this_conns.connectors]

    def get_right_connected_nodes(self):
        return [rem_conn.node
                for this_conns in self.right_connectors
                for rem_conn in this_conns.connectors]

    def update_layer(self, new_layer: int):
        if not self.layer or new_layer > self.layer:
            self.layer = new_layer
            [n.update_layer(new_layer + 1) for n in self.get_right_connected_nodes()]


class Connector:
    def __init__(self, node: Node, id: str, direction: ConnDirection, side: ConnSide):
        self.node = node
        self.id = id
        self.direction = direction
        self.side = side
        self.connectors = []  # type: List[Connector]

    def is_full(self):
        return self.direction is ConnDirection.IN and len(self.connectors) > 0

    def get_connected_nodes_dict(self):
        return {c.node.id: c.node for c in self.connectors}

    def connect_with(self, other):
        if self.direction is other.direction:
            raise LayoutException('Cannot connect two {} connectors'.format(self.direction.name))
        if self.side is other.side:
            raise LayoutException('Cannot connect two {} connectors'.format(self.side.name))
        if self.is_full() or other.is_full():
            raise LayoutException('Cannot connect a full connector')

        self.connectors.append(other)
        other.connectors.append(self)


class LayoutException(Exception):
    pass


def layout_graph(graph: str, nodetypes: str):
    nodes = load_graph(graph, nodetypes)
    assign_layers(nodes)
    assign_uplift(nodes)
    set_x_values_by_layer(nodes)


def load_graph(graph, nodetypes) -> Dict:
    nodetypes_dict = {nodetype['type']: nodetype for nodetype in nodetypes}
    nodes = {n['nodeid']: Node(n, nodetypes_dict[n['type']]) for n in graph['nodes']}  # type: Dict[Node]
    for connection in graph['connections']:
        connect_nodes(nodes, *connection.values())
    return nodes


def connect_nodes(nodes, out_node, out_connector, in_node, in_connector):
    out_conn = nodes[out_node].get_connector(out_connector)  # type: Connector
    in_conn = nodes[in_node].get_connector(in_connector)  # type: Connector
    in_conn.connect_with(out_conn)


def assign_layers(nodes):
    leftmost_nodes = [n for n in nodes.values() if len(n.get_left_connected_nodes()) == 0]
    [n.update_layer(0) for n in leftmost_nodes]
    for node in leftmost_nodes:
        node.layer = min([n.layer for n in node.get_right_connected_nodes()]) - 1


def assign_uplift(nodes):
    for node in nodes.values():
        for connected_nodes in [node.get_left_connected_nodes(), node.get_right_connected_nodes()]:
            if len(connected_nodes) > 1:
                step = 1 / len(connected_nodes)
                current_uplift = 1
                for connected_node in connected_nodes:
                    connected_node.uplift += current_uplift
                    current_uplift -= step


def set_x_values_by_layer(nodes, step=50, offset=25):
    current_nodes = [n for n in nodes.values() if n.layer == 0]
    current_x = offset
    while len(current_nodes) > 0:
        for n in current_nodes:
            n.x = current_x
        current_nodes = [n for n in nodes.values() if n.layer == current_nodes[0].layer + 1]
        current_x += step
