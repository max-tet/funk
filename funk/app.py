import json

from flask import Flask, Response
from flask.globals import request

from funk import model, persistence, graphlayout, nodetypes

app = Flask(__name__)

db = model.init_db('graphs.db')
db.connect()
model.create_tables(db)
db.close()


@app.before_request
def _db_connect():
    model.database.connect()


@app.teardown_request
def _db_close(exc):
    if not model.database.is_closed():
        model.database.close()


@app.errorhandler(persistence.GraphDoesNotExistError)
def handle_graph_does_not_exist_error(e: persistence.GraphDoesNotExistError):
    return str(e), 404


@app.errorhandler(persistence.GraphAlreadyExistsError)
def handle_graph_already_exists_error(e: persistence.GraphAlreadyExistsError):
    return str(e), 409


@app.errorhandler(persistence.InvalidGraphError)
def handle_invalid_graph_error(e: persistence.InvalidGraphError):
    return str(e), 422


@app.route('/')
def graph_list():
    with open('funk/static/index.html') as f:
        return '\n'.join(f.readlines())


@app.route('/api/graphs')
def graphs():
    graphs = persistence.get_graphs()
    return Response(graphs, mimetype='application/json')


@app.route('/graph/<graph_name>')
def graph(graph_name):
    with open('funk/static/graph.html') as f:
        return '\n'.join(f.readlines())


@app.route('/api/nodetypes')
def types():
    return nodetypes.from_static('nodetypes.js')


@app.route('/api/graph/<graph_name>')
def get_graph(graph_name):
    graph = persistence.load_graph(graph_name)
    return Response(graph, mimetype='application/json')


@app.route('/api/graph/<graph_name>', methods=['POST'])
def post_graph(graph_name):
    persistence.create_empty_graph(graph_name)
    return Response(status=201)


@app.route('/api/graph/<graph_name>', methods=['DELETE'])
def del_graph(graph_name):
    persistence.delete_graph(graph_name)
    return Response(status=200)


@app.route('/api/graph/<graph_name>', methods=['PUT'])
def update_graph(graph_name):
    persistence.save_graph(graph_name, request.get_json())
    return Response(status=200)


@app.route('/api/trigger/layout/<graph_name>', methods=['POST'])
def layout_graph(graph_name):
    graph = persistence.load_graph(graph_name)
    with open('funk/static/nodetypes.json') as f:
        nodetypes = '\n'.join(f.readlines())
    new_graph = graphlayout.layout_graph(graph, nodetypes)
    persistence.save_graph(graph_name, json.loads(new_graph))
    return Response(status=200)
