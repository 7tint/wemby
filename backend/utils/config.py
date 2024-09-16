import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("ENVIRONEMENT") == "DEV"
HOST = os.getenv("APPLICATION_HOST", "0.0.0.0")
PORT = int(os.getenv("APPLICATION_PORT", "5000"))
