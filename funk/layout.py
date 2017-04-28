import json
from typing import List


def layout_graph(graph: str, nodetypes: str) -> str:
    graph_json = json.loads(graph)
    nodetypes_json = json.loads(nodetypes)
    nodetypes_dict = {nodetype['type']: nodetype for nodetype in nodetypes_json}
    nodes = {n['nodeid']: Node(n, nodetypes_dict[n['type']]) for n in graph_json['nodes']}
    for connection in graph_json['connections']:
        in_node = nodes[connection['in_node']]  # type: Node
        out_node = nodes[connection['out_node']]  # type: Node
        in_node.connect_node_on_connector(out_node, connection['in_connector'])
        out_node.connect_node_on_connector(in_node, connection['out_connector'])


class Node:
    def __init__(self, node_json: dict, nodetype_json: dict):
        self.original_json = node_json
        self.nodetype_json = nodetype_json
        self.id = node_json['nodeid']
        self.x = node_json['top']
        self.y = node_json['left']

        self.height = 2 + max(len(nodetype_json['connector_l']), len(nodetype_json['connector_r']))
        self.width = round(max(len(node_json['name']), len(nodetype_json['name']),
                               max(map(lambda t: len(t['name']), nodetype_json['connector_l'])) +
                               max(map(lambda t: len(t['name']), nodetype_json['connector_l']))) / 3)

        self.layer = 0
        self.left_nodes = []  # type: List[Node]
        self.right_nodes = []  # type: List[Node]

    def connect_node_on_connector(self, node, connector: str):
        if connector in [c['id'] for c in self.nodetype_json['connector_l']]:
            self.left_nodes.append(node)
        elif connector in [c['id'] for c in self.nodetype_json['connector_r']]:
            self.right_nodes.append(node)
        else:
            raise NameError('connector not found')
