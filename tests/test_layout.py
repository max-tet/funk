import json
import random

import pytest

from funk.layout import Node, load_graph


@pytest.fixture()
def node_and_type_factory():
    call_count = 0

    def make_node_and_type(nr_of_connectors_left: int, nr_of_connectors_right: int) -> tuple:
        node = {'nodeid': 'node_{}'.format(call_count),
                'name': 'Node {}'.format(call_count),
                'type': 'type_{}'.format(call_count),
                'top': '{}px'.format(random.randint(10, 500)),
                'left': '{}px'.format(random.randint(10, 500))}

        nodetype = {'type': 'type_{}'.format(call_count),
                    'name': 'Type {}'.format(call_count),
                    'color': '#ffffff',
                    'categories': ['Cat {}'.format(call_count)],
                    'connector_l': [],
                    'connector_r': []}
        for conn_left in range(nr_of_connectors_left):
            nodetype['connector_l'].append({
                'id': 'conn_l_{}'.format(conn_left),
                'name': 'Conn L {}'.format(conn_left),
                'type': 'string',
                'direction': 'in'
            })
        for conn_right in range(nr_of_connectors_right):
            nodetype['connector_r'].append({
                'id': 'conn_r_{}'.format(conn_right),
                'name': 'Conn R {}'.format(conn_right),
                'type': 'string',
                'direction': 'out'
            })

        return node, nodetype

    return make_node_and_type


def test_height(node_and_type_factory):
    n = Node(*node_and_type_factory(1, 3))
    assert n.height == 5


def test_width(node_and_type_factory):
    n = Node(*node_and_type_factory(1, 1))
    assert n.width >= 5


def test_connect():
    with open('tests/graph_test_layout_00.json') as f:
        graph = json.load(f)
    with open('funk/static/nodetypes.json') as f:
        nodetypes = json.load(f)
    nodes = load_graph(graph, nodetypes)
    assert nodes['source_rest_server'] in nodes['dest_rest_client'].get_left_connected_nodes_dict().values()
    assert nodes['dest_rest_client'] in nodes['source_rest_server'].get_right_connected_nodes_dict().values()
