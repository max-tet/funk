import json
import re
from itertools import islice

from flask import Flask, Response
from flask.globals import request

from funk import nodetypes, model, persistence, graphlayout

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


@app.route('/api/nodetypes/<search_term>')
def get_dynamic_types(search_term):
    regex = re.compile(search_term)
    with open('names.txt') as file:
        matched_names = islice((name for name in file.readlines() if regex.search(name)), 10)

    items = [{
        'type': 'abstract_user',
        'defaultNodeName': name[:-1],
    } for name in matched_names]
    return Response(json.dumps(items), mimetype='application/json')


@app.route('/api/nodetypes')
def types():
    """
    Returns a list of available datatypes and nodetypes in json format.
    The top-level json element is an object and it contains two elements:
    *datatypes* and *nodetypes*. Both are lists.

    A datatype is an object like this::

        {
          "id": "boolean",  # snake-case identifier for referencing
          "name": "Boolean",  # Normal Case name for display in UI
          "color": "#D66326"  # Color of connectors and connections
        }

    A nodetype is an object like this::

        {
            "type": "some_nodetype",  # snake-case identifier for referencing
            "name": "Some Nodetype",  # Normal Case name that is displayed in small font beneath the node's name
            "defaultNodeName": "Some Special Nodetype",  # Name for a newly instantiated node, defaults to *name* if omitted
            "isAbstract": true,  # If true, the nodetype is not listed and can therefore not be instantiated
            "isStatic": true,  # If true, editing of the node is not allowed
            "color": "#A58DD2",  # Color of the node
            "categories": ["Example", "Static"],  # List of category strings under which the UI displays the node
            "connector_l": [  # List of connectors on the node's left side
                {
                    "id": "in",  # snake-case identifier for referencing; must be unique in the scope of the node
                    "name": "In",  # Normal Case name for display
                    "type": "string",  # Connector's datatype; must reference an existing datatype from the previous list
                    "direction": "in"  # Direction of information flow; can be *in* or *out*
                }
            ],
            "connector_r": [  # List of connectors on the node's left side, see *connector_l* for reference on the fields
                {
                    "id": "out",
                    "name": "Out",
                    "type": "resource",
                    "direction": "out"
                }
            ],
            "props": [  # List of properties for the user to edit via the UI
                {
                    "propid": "value",  # snake-case identifier for referencing; must be unique in the scope of the node
                    "name": "Value",  # Normal Case name for display
                    "type": "string",  # Prop's datatype; must reference an existing datatype from the previous list
                    "value": ""  # Default value
                }
            ]
        }

    :return: Json object containing datatypes and nodetypes.
    """
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
    return ''


@app.route('/api/trigger/layout/<graph_name>', methods=['POST'])
def layout_graph(graph_name):
    graph = persistence.load_graph(graph_name)
    with open('funk/static/nodetypes.json') as f:
        nodetypes = '\n'.join(f.readlines())
    new_graph = graphlayout.layout_graph(graph, nodetypes)
    persistence.save_graph(graph_name, json.loads(new_graph))
    return ''
