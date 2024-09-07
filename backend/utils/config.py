import os

from dotenv import load_dotenv

load_dotenv()

DEBUG = os.getenv("ENVIRONEMENT") == "DEV"
HOST = os.getenv("APPLICATION_HOST")
PORT = int(os.getenv("APPLICATION_PORT", "5000"))
FIREBASE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET")
FIREBASE_DATABASE_URL = os.getenv("FIREBASE_DATABASE_URL")
FIREBASE_URL = os.getenv("FIREBASE_URL")
