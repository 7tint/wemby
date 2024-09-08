.DEFAULT_GOAL := help

lint: ## Lint python files with flake8
	flake8 .

format: ## Run black on every file
	black .
	isort .

install: ## Install dependencies
	python3 -m pip install -r requirements.txt

run: ## Run the server
	python3 app.py

setup_players: ## Set up players data
	PYTHONPATH=. python3 data/players.py
