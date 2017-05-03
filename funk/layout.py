import json
from enum import Enum, auto
from typing import Dict
from typing import List


def layout_graph(graph: str, nodetypes: str) -> str:
    graph_json = json.loads(graph)
    nodetypes_json = json.loads(nodetypes)
    nodetypes_dict = {nodetype['type']: nodetype for nodetype in nodetypes_json}
    nodes = {n['nodeid']: Node(n, nodetypes_dict[n['type']]) for n in graph_json['nodes']}  # type: Dict[Node]
    for connection in graph_json['connections']:
        connect_nodes(nodes, *connection.values())


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

        self.left_connectors = {
            c['id']:
                Connector(self,
                          c['id'],
                          ConnDirection[c['direction'].upper()],
                          ConnSide.LEFT) for c in nodetype_json['connector_l']
        }  # type: Dict[Connector]
        self.right_connectors = {
            c['id']:
                Connector(self,
                          c['id'],
                          ConnDirection[c['direction'].upper()],
                          ConnSide.RIGHT) for c in nodetype_json['connector_r']
        }  # type: Dict[Connector]

    def get_connector(self, name: str):
        return {**self.left_connectors, **self.right_connectors}[name]

    def get_left_connected_nodes_dict(self):
        return {rem_conn.node.id: rem_conn.node
                for this_conns in self.left_connectors.values()
                for rem_conn in this_conns.connectors}

    def get_right_connected_nodes_dict(self):
        return {rem_conn.node.id: rem_conn.node
                for this_conns in self.right_connectors.values()
                for rem_conn in this_conns.connectors}


class Connector:
    def __init__(self, node: Node, name: str, direction: ConnDirection, side: ConnSide):
        self.node = node
        self.name = name
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
