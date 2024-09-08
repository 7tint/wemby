import json
from data import scrape_projections, get_rosters


def main():
    # Get list of players from ESPN
    players = get_rosters()

    players_data = [player.__dict__ for player in players]

    with open("data/players.json", "w") as json_file:
        json.dump(players_data, json_file, indent=2)

    # players = scrape_projections()
    # # Process or save the players data as needed
    # for player in players:
    #     print(player.rank, player.adp, player.name)


if __name__ == "__main__":
    main()
