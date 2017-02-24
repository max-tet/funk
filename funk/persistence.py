import json

from funk.model import Graph, Node, Connection


def save_graph(graph_name: str, graph: str):
    graph_json = json.loads(graph)

    graph, _ = Graph.get_or_create(name=graph_name)
    nodes_for_saving = {n['nodeid']: n for n in graph_json['nodes']}

    remaining_nodes_for_saving = _update_or_delete_existing_nodes(graph, nodes_for_saving)

    for n in remaining_nodes_for_saving.values():
        Node.create(graph=graph, **n)


def _update_or_delete_existing_nodes(g, nodes_for_saving):
    remaining_nodes_for_saving = nodes_for_saving.copy()
    for n in Node.select().where(Node.graph == g):
        try:
            n.update(**nodes_for_saving[n.id])
            del remaining_nodes_for_saving[n.id]
        except KeyError:
            n.delete_instance()
    return remaining_nodes_for_saving


def delete_graph(graph_name: str):
    g = Graph.select().where(Graph.name == graph_name).get()
    Node.delete().where(Node.graph == g).execute()
    Connection.delete().where(Connection.graph == g).execute()
    g.delete_instance()
