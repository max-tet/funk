from funk.model import Graph, Node
from funk.persistence import save_graph


def test_save_graph(database):
    with open('graph0.json') as f:
        test_json = ' '.join(f.readlines())
    graph_name = 'test_graph'
    save_graph(graph_name, test_json)

    assert Graph.select().where(Graph.name == graph_name).count() == 1
    g = Graph.select().where(Graph.name == graph_name).get()
    assert Node.select().where(Node.graph == g).count() == 2
    assert len(g.nodes) == 2


def test_empty_db(database):
    assert Graph.select().count() == 0
