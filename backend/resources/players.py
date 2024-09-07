from flask import jsonify, make_response
from flask_restful import Resource


class PlayersResource(Resource):
    def __init__(self):
        pass

    @staticmethod
    def get():
        return make_response(jsonify({"message": "GET players"}), 200)
