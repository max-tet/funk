from flask import Flask, abort, request, Response
from flask.templating import render_template

from funk import nodetypes

app = Flask(__name__)

graphs = {}


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/api/nodetypes')
def types():
    return nodetypes.from_static('nodetypes.js')


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
