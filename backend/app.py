from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from flask_restful import Api
from waitress import serve

from utils import config

import routes

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.debug = config.DEBUG

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        app.register_blueprint(blueprint, url_prefix="/api")

if __name__ == "__main__":
    if app.debug:
        app.run(host=config.HOST, port=config.PORT)
    else:
        serve(app, host=config.HOST, port=config.PORT)
