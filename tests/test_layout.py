import json

from funk.graphlayout import load_graph
from funk.graphlayout.topo_layout import apply_topo_layout


def _load_test_graph(graph_name: str):
    with open('graph_test_{}.json'.format(graph_name)) as f:
        graph = json.load(f)
    with open('nodetypes.json') as f:
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
    apply_topo_layout(nodes)
    assert all([n0.layer < n1.layer for n0 in nodes.values() for n1 in n0.get_right_connected_nodes()])


def test_layer_shifted_left_node():
    nodes = _load_test_graph('shifted_left_node')
    apply_topo_layout(nodes)
    assert nodes['n0'].layer == 1
    assert nodes['n1'].layer == 2
    assert nodes['n2'].layer == 0
    assert nodes['n3'].layer == 1


def test_x_values_by_layer():
    nodes = _load_test_graph('two_nodes')
    apply_topo_layout(nodes, step=2, offset=1)
    assert nodes['n0'].x == 1
    assert nodes['n1'].x == 3


def test_uplift():
    nodes = _load_test_graph('3_nodes_fork')
    apply_topo_layout(nodes)
    assert nodes['n1'].uplift > nodes['n2'].uplift


def test_y_values_by_uplift():
    nodes = _load_test_graph('3_nodes_fork')
    apply_topo_layout(nodes, step=2, offset=1)
    assert nodes['n1'].y == '1px'
    assert nodes['n2'].y == '3px'
