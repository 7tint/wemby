from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from flask_restful import Api

# from resources.players import PlayersResource
# from routes.players import PLAYERS_RESOURCE
from utils import config

import routes

server = Flask(__name__)
api = Api(server)
cors = CORS(server, resources={r"/api/*": {"origins": "*"}})

server.debug = config.DEBUG

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        server.register_blueprint(blueprint, url_prefix="/api")

if __name__ == "__main__":
    server.run(host=config.HOST, port=config.PORT)
