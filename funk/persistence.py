import copy
import json
from datetime import datetime

from peewee import IntegrityError, DoesNotExist

from funk.model import Graph, Node, Connection, NodeProp


def create_empty_graph(graph_name: str):
    try:
        Graph.create(name=graph_name, time_created=datetime.now(), time_modified=datetime.now())
    except IntegrityError as e:
        raise GraphAlreadyExistsError('graph {} already exist'.format(graph_name)) from e


def save_graph(graph_name: str, graph_json):
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    graph_json_copy = copy.deepcopy(graph_json)
    _update_nodes(graph, graph_json_copy)
    _update_connections(graph, graph_json_copy)
    graph.time_modified = datetime.now()
    graph.save()


def _update_nodes(graph, graph_json):
    new_nodeids = [node['nodeid'] for node in graph_json['nodes']]
    for node_to_delete in Node.select().where((Node.graph == graph) & (Node.nodeid.not_in(new_nodeids))):
        _delete_node(node_to_delete)

    for node in graph_json['nodes']:
        _update_or_create_node(graph, node)


def _delete_node(node: Node):
    NodeProp.delete().where(NodeProp.node == node).execute()
    node.delete_instance()


def _update_or_create_node(graph, node_json):
    try:
        props = node_json['props']
    except KeyError:
        props = []
    else:
        del node_json['props']

    try:
        node = Node.select() \
            .where((Node.graph == graph)
                   & (Node.nodeid == node_json['nodeid'])) \
            .get()
    except DoesNotExist:
        node = Node.create(graph=graph, **node_json)
    else:
        Node.update(**node_json) \
            .where((Node.graph == graph)
                   & (Node.nodeid == node_json['nodeid'])) \
            .execute()

    for prop_json in props:
        _update_or_create_prop(node, prop_json)


def _update_or_create_prop(node, prop_json):
    if prop_json['type'] == 'string':
        prop_json['valueString'] = prop_json['value']
    elif prop_json['type'] == 'integer':
        prop_json['valueInteger'] = prop_json['value']
    elif prop_json['type'] == 'float':
        prop_json['valueFloat'] = prop_json['value']
    elif prop_json['type'] == 'boolean':
        prop_json['valueBoolean'] = prop_json['value']
    del prop_json['value']

    try:
        NodeProp.select() \
            .where((NodeProp.node == node)
                   & (NodeProp.propid == prop_json['propid'])) \
            .get()
    except DoesNotExist:
        NodeProp.create(node=node, **prop_json)
    else:
        NodeProp.update(**prop_json) \
            .where((NodeProp.node == node)
                   & (NodeProp.propid == prop_json['propid'])) \
            .execute()


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

    for node_to_delete in Node.select().where(Node.graph == g):
        _delete_node(node_to_delete)
    Connection.delete().where(Connection.graph == g).execute()
    g.delete_instance()


def load_graph(graph_name: str) -> str:
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    return json.dumps(graph.to_json())


def get_graphs() -> list:
    return json.dumps([{
        'name': graph.name,
        'time_created': graph.time_created.timestamp(),
        'time_modified': graph.time_modified.timestamp()
    } for graph in Graph.select()])


class GraphDoesNotExistError(Exception):
    pass


class GraphAlreadyExistsError(Exception):
    pass
