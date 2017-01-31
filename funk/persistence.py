import json

from funk.model import Graph, Node


def save_graph(graph_name: str, graph: str):
    graph_json = json.loads(graph)

    g, _ = Graph.get_or_create(name=graph_name)
    new_nodes_dict = {n['nodeid']: n for n in graph_json['nodes']}

    for n in Node.select().where(Node.graph == g):
        try:
            n.update(**new_nodes_dict[n.id])
            del new_nodes_dict[n.id]
        except KeyError:
            n.delete_instance()

    for n in new_nodes_dict.values():
        Node.create(graph=g, **n)
