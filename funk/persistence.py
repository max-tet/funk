import json

from peewee import IntegrityError, DoesNotExist

from funk.model import Graph, Node, Connection


def create_empty_graph(graph_name: str):
    try:
        Graph.create(name=graph_name)
    except IntegrityError as e:
        raise GraphAlreadyExistsError('graph {} already exist'.format(graph_name)) from e


def save_graph(graph_name: str, graph: str):
    graph_json = json.loads(graph)
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    _update_nodes(graph, graph_json)
    _update_connections(graph, graph_json)


def _update_nodes(graph, graph_json):
    nodes_for_saving = {n['nodeid']: n for n in graph_json['nodes']}
    remaining_nodes_for_saving = nodes_for_saving.copy()

    for n in Node.select().where(Node.graph == graph):
        try:
            n.update(**nodes_for_saving[n.id])
            del remaining_nodes_for_saving[n.id]
        except KeyError:
            n.delete_instance()

    for n in remaining_nodes_for_saving.values():
        Node.create(graph=graph, **n)


def _update_connections(graph, graph_json):
    connections_for_saving = graph_json['connections']
    Connection.delete().where(Connection.graph == graph).execute()
    for connection_for_saving in connections_for_saving:
        out_node = Node.select().where(Node.nodeid == connection_for_saving['out_node']).get()
        in_node = Node.select().where(Node.nodeid == connection_for_saving['in_node']).get()
        Connection.create(graph=graph, out_node=out_node, in_node=in_node,
                          out_connector=connection_for_saving['out_connector'],
                          in_connector=connection_for_saving['in_connector'])


def delete_graph(graph_name: str):
    try:
        g = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    Node.delete().where(Node.graph == g).execute()
    Connection.delete().where(Connection.graph == g).execute()
    g.delete_instance()


def load_graph(graph_name: str) -> str:
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    nodes = Node.select().where(Node.graph == graph).execute()
    connections = Connection.select().where(Connection.graph == graph).execute()
    return json.dumps({
        'nodes': [node.to_json() for node in nodes],
        'connections': [connection.to_json() for connection in connections]
    })


class GraphDoesNotExistError(Exception):
    pass


class GraphAlreadyExistsError(Exception):
    pass
