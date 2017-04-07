from flask import Flask, Response
from flask.globals import request

from funk import nodetypes, model, persistence
from funk.persistence import GraphDoesNotExistError, create_empty_graph, GraphAlreadyExistsError, save_graph

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


@app.errorhandler(GraphDoesNotExistError)
def handle_graph_does_not_exist_error(e: GraphDoesNotExistError):
    return str(e), 404


@app.errorhandler(GraphAlreadyExistsError)
def handle_graph_already_exists_error(e: GraphAlreadyExistsError):
    return str(e), 409


@app.route('/graph/<graph_name>')
def graph(graph_name):
    with open('funk/static/index.html') as f:
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
    create_empty_graph(graph_name)
    return ''


@app.route('/api/graph/<graph_name>', methods=['PUT'])
def update_graph(graph_name):
    save_graph(graph_name, request.get_json())
    return ''
