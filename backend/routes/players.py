from flask import Blueprint
from flask_restful import Api

from resources import PlayersResource

PLAYERS_RESOURCE = Blueprint("players", __name__)

Api(PLAYERS_RESOURCE).add_resource(PlayersResource, "/players/<string:year>")
