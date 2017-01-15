from flask import Flask
from flask.templating import render_template

from funk import nodetypes

app = Flask(__name__)


@app.route('/')
def root():
    return render_template('index.html')


@app.route('/api/nodetypes')
def types():
    return nodetypes.from_static('nodetypes.js')
