import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("ENVIRONEMENT") == "DEV"
HOST = os.getenv("APPLICATION_HOST", "127.0.0.1")
PORT = int(os.getenv("APPLICATION_PORT", "5000"))
