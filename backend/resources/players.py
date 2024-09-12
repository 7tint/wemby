import json
import os
from flask import jsonify, make_response
from flask_restful import Resource


class PlayersResource(Resource):
    def __init__(self):
        pass

    @staticmethod
    def get():
        dirname = os.path.dirname(__file__)
        players_file = os.path.join(dirname, "../data/players.json")
        with open(players_file) as f:
            players_data = json.load(f)
        return make_response(jsonify(players_data), 200)
