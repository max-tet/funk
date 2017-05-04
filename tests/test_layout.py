import json

from funk.layout import load_graph, assign_layers


def _load_test_graph(graph_name: str):
    with open('tests/graph_test_{}.json'.format(graph_name)) as f:
        graph = json.load(f)
    with open('tests/nodetypes.json') as f:
        nodetypes = json.load(f)
    return load_graph(graph, nodetypes)


def test_height_left():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_5_left'].height == 7


def test_height_right():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_5_left'].height == 7


def test_height_small():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_empty'].height == 2


def test_width_name():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_20_name'].width > 6


def test_width_conns():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_20_conns'].width > 6


def test_width_typename():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_20_typename'].width > 6


def test_width_narrow():
    nodes = _load_test_graph('multiple_sized_nodes')
    assert nodes['n_empty'].width < 2


def test_connect():
    nodes = _load_test_graph('two_nodes')
    assert nodes['n0'] in nodes['n1'].get_left_connected_nodes()
    assert nodes['n1'] in nodes['n0'].get_right_connected_nodes()


def test_layer():
    nodes = _load_test_graph('two_nodes')
    assign_layers(nodes)
    assert all([n0.layer < n1.layer for n0 in nodes.values() for n1 in n0.get_right_connected_nodes()])
