from funk.model import Graph, Node, Connection
from funk.persistence import save_graph, delete_graph


def test_save_graph(database):
    with open('graph0.json') as f:
        test_json = ' '.join(f.readlines())
    graph_name = 'test_graph'
    save_graph(graph_name, test_json)

    assert Graph.select().count() == 1
    assert Node.select().count() == 2
    g = Graph.select().where(Graph.name == graph_name).get()
    assert len(g.nodes) == 2


def test_update_graph(database):
    with open('graph0.json') as f:
        graph0_json = ' '.join(f.readlines())
    with open('graph1.json') as f:
        graph1_json = ' '.join(f.readlines())
    graph_name = 'test_graph'
    save_graph(graph_name, graph0_json)
    save_graph(graph_name, graph1_json)

    assert Graph.select().count() == 1
    assert Node.select().count() == 2
    g = Graph.select().where(Graph.name == graph_name).get()
    nodes = list(Node.select().where(Node.graph == g))
    assert len(nodes) == 2
    node_ids = [n.nodeid for n in nodes]
    assert 'node_id_0' in node_ids
    assert 'node_id_2' in node_ids


def test_two_graphs(database):
    with open('graph0.json') as f:
        graph_json = ' '.join(f.readlines())
    graph0_name = 'test_graph_0'
    graph1_name = 'test_graph_1'
    save_graph(graph0_name, graph_json)
    save_graph(graph1_name, graph_json)

    assert Graph.select().count() == 2
    assert Node.select().count() == 4
    g0 = Graph.select().where(Graph.name == graph0_name).get()
    g1 = Graph.select().where(Graph.name == graph1_name).get()
    assert Node.select().where(Node.graph == g0).count() == 2
    assert Node.select().where(Node.graph == g1).count() == 2


def test_delete_graph(database):
    with open('graph0.json') as f:
        graph0_json = ' '.join(f.readlines())
    graph_name = 'test_graph'
    save_graph(graph_name, graph0_json)

    delete_graph(graph_name)
    assert Graph.select().count() == 0
    assert Node.select().count() == 0
    assert Connection.select().count() == 0


def test_empty_db(database):
    assert Graph.select().count() == 0
