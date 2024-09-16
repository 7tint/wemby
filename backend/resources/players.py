import json
import os
from flask import jsonify, make_response, request
from flask_restful import Resource

available_years = ["2023", "2024"]


class PlayersResource(Resource):
    def __init__(self):
        pass

    @staticmethod
    def get(year):
        if year not in available_years:
            return make_response(jsonify({"error": "Invalid year"}), 400)

        dirname = os.path.dirname(__file__)
        players_file = os.path.join(dirname, "../data/players.json")
        with open(players_file) as f:
            data = json.load(f)
            players = data[year]
            category_stats_totals = data[f"{year}_category_stats_totals"]
            category_stats_per = data[f"{year}_category_stats_per"]
        return make_response(
            jsonify(
                {
                    f"{year}_players": players,
                    f"{year}_category_stats_total": category_stats_totals,
                    f"{year}_category_stats_per": category_stats_per,
                }
            ),
            200,
        )
