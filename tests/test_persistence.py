from funk.model import Graph, Node
from funk.persistence import save_graph


def test_save_graph(database):
    with open('graph0.json') as f:
        test_json = ' '.join(f.readlines())
    save_graph('test_graph', test_json)

    assert Graph.select().count() == 1
    assert Node.select().count() == 2
