import json
from flask import jsonify, make_response
from flask_restful import Resource


class PlayersResource(Resource):
    def __init__(self):
        pass

    @staticmethod
    def get():
        with open("data/players.json") as f:
            players_data = json.load(f)
        return make_response(jsonify(players_data), 200)
