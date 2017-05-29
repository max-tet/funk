import json
import re
from enum import Enum, auto
from typing import List, Dict

from funk.graphlayout.misc import apply_border_offset, randomize_positions
from funk.graphlayout.phys_layout import apply_phys_layout
from funk.graphlayout.topo_layout import assign_layers, assign_uplift, set_x_values_by_layer, apply_topo_layout


class ConnDirection(Enum):
    IN = auto()
    OUT = auto()


class ConnSide(Enum):
    LEFT = auto()
    RIGHT = auto()


pos_pattern = '^(-?[0-9]*(\.[0-9]*)?)px'


class Node:
    def __init__(self, node_json: dict, nodetype_json: dict):
        self.nodetype_json = nodetype_json
        self.id = node_json['nodeid']

        try:
            self.x = re.match(pos_pattern, node_json['top']).group(1)
            self.y = re.match(pos_pattern, node_json['left']).group(1)
        except AttributeError as e:
            raise AttributeError('failed to match {} or {}'.format(node_json['top'], node_json['left'])) from e

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

    def get_connected_nodes(self):
        return self.get_left_connected_nodes() + self.get_right_connected_nodes()

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


def layout_graph(graph: str, nodetypes: str) -> str:
    graph_json = json.loads(graph)
    nodetypes_json = json.loads(nodetypes)
    nodes = load_graph(graph_json, nodetypes_json)
    apply_topo_layout(nodes)
    randomize_positions(nodes.values(), 10.0)
    apply_phys_layout(nodes)
    apply_border_offset(nodes)

    apply_positions(graph_json, nodes)
    return json.dumps(graph_json)


def apply_positions(graph_json, nodes):
    for node_json in graph_json['nodes']:
        node = nodes[node_json['nodeid']]  # type: Node
        node_json['top'] = '{}px'.format(node.y)
        node_json['left'] = '{}px'.format(node.x)


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
