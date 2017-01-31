import json

from funk.model import Graph, Node


def save_graph(graph_name: str, graph: str):
    graph_json = json.loads(graph)

    g = Graph.get_or_create(name=graph_name)
    new_nodes_dict = {n['id']: n for n in graph_json['nodes']}

    for nid, n in new_nodes_dict.items():
        Node.insert(graph=g, id=nid, name=n['name'], type=n['type'], top=n['top'], left=n['left']).upsert().execute()

    Node.delete().where(Node.graph == g and Node.id not in new_nodes_dict)
