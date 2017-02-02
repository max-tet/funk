from flask import Flask, abort, request, Response
from flask.templating import render_template

from funk import nodetypes, model

app = Flask(__name__)

graphs = {}

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


@app.route('/graph/<graph_name>')
def graph(graph_name):
    return render_template('index.html')


@app.route('/api/nodetypes')
def types():
    return nodetypes.from_static('nodetypes.js')


@app.route('/api/graph/top_secret')
def get_top_secret():
    return Response(render_template('top_secret.json'), mimetype='application/json')


@app.route('/api/graph/<graph_name>')
def get_graph(graph_name):
    try:
        return Response(graphs[graph_name], mimetype='application/json')
    except KeyError:
        abort(404)


@app.route('/api/graph/<graph_name>', methods=['POST'])
def post_graph(graph_name):
    graphs[graph_name] = request.form['data']
    return ''
