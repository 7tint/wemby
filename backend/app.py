# from firebase_admin import credentials, initialize_app
from flasgger import Swagger
from flask import Flask
from flask.blueprints import Blueprint
from flask_cors import CORS
from utils import config
import routes

server = Flask(__name__)
cors = CORS(server, resources={r"/api/*": {"origins": "*"}})

# cred = credentials.Certificate("firebase.json")
# initialize_app(cred, {
#   "storageBucket": config.FIREBASE_STORAGE_BUCKET,
#   "databaseURL": config.FIREBASE_DATABASE_URL
# })

server.config["SWAGGER"] = {
    "swagger_version": "2.0",
    "title": "Application",
    "specs": [
        {
            "version": "1.0.0",
            "title": "Wemby Fantasy Basketball",
            "endpoint": "spec",
            "route": "/api/info",
        }
    ],
    "static_url_path": "/apidocs",
}

Swagger(server)

server.debug = config.DEBUG

for blueprint in vars(routes).values():
    if isinstance(blueprint, Blueprint):
        server.register_blueprint(blueprint, url_prefix="/api")

if __name__ == "__main__":
    server.run(host=config.HOST, port=config.PORT)
