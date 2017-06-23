import json
from datetime import datetime
from json.decoder import JSONDecodeError

from peewee import IntegrityError, DoesNotExist

from funk.model import Graph


def create_empty_graph(graph_name: str):
    try:
        Graph.create(name=graph_name, time_created=datetime.now(), time_modified=datetime.now(), graph_json='{}')
    except IntegrityError as e:
        raise GraphAlreadyExistsError('graph {} already exist'.format(graph_name)) from e


def save_graph(graph_name: str, graph_json):
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    _validate_graph_json(graph_json)
    graph.graph_json = json.dumps(graph_json)
    graph.time_modified = datetime.now()
    graph.save()


def delete_graph(graph_name: str):
    try:
        g = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    g.delete_instance()


def load_graph(graph_name: str) -> str:
    try:
        graph = Graph.select().where(Graph.name == graph_name).get()
    except DoesNotExist as e:
        raise GraphDoesNotExistError('graph {} does not exist'.format(graph_name)) from e
    return graph.graph_json


def get_graphs() -> list:
    return json.dumps([{
        'name': graph.name,
        'time_created': graph.time_created.timestamp(),
        'time_modified': graph.time_modified.timestamp()
    } for graph in Graph.select()])


def _validate_graph_json(graph):
    pass

class InvalidGraphError(Exception):
    pass


class GraphDoesNotExistError(Exception):
    pass


class GraphAlreadyExistsError(Exception):
    pass
