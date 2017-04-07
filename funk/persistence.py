import json

from peewee import IntegrityError, DoesNotExist

from funk.model import Graph, Node, Connection, NodeProp


def create_empty_graph(graph_name: str):
    try:
        Graph.create(name=graph_name)
    except IntegrityError as e:
        raise GraphAlreadyExistsError('graph {} already exist'.format(graph_name)) from e


def save_graph(graph_name: str, graph_json):
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    _update_nodes(graph, graph_json)
    _update_connections(graph, graph_json)


def _update_nodes(graph, graph_json):
    nodes_for_saving = {n['nodeid']: n for n in graph_json['nodes']}

    for node_in_db in Node.select().where(Node.graph == graph):
        try:
            node_for_saving = nodes_for_saving[node_in_db.nodeid]
        except KeyError:
            node_in_db.delete_instance()
            continue

        try:
            props_of_node = node_for_saving['props']
            del node_for_saving['props']
        except KeyError:
            props_for_saving = {}
        else:
            props_for_saving = {prop['propid']: prop for prop in props_of_node}
        for prop_in_db in node_in_db.props:
            prop_in_db.update(**(props_for_saving[prop_in_db.propid])).execute()

        node_in_db.update(**node_for_saving).execute()

        del nodes_for_saving[node_in_db.nodeid]

    for node_for_saving in nodes_for_saving.values():

        try:
            props_for_saving = node_for_saving['props']
        except KeyError:
            props_for_saving = []
        node = Node.create(graph=graph, **node_for_saving)
        for prop_in_db in props_for_saving:
            NodeProp.create(node=node, **prop_in_db)


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
    return json.dumps(graph.to_json())


class GraphDoesNotExistError(Exception):
    pass


class GraphAlreadyExistsError(Exception):
    pass
