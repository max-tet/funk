from flask import Flask, abort, request, Response
from flask.templating import render_template

from funk import nodetypes

app = Flask(__name__)

graphs = {}


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
