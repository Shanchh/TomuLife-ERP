import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

json_path = os.path.join(BASE_DIR, "config", "firebase_config.json")

cred = credentials.Certificate(json_path)
firebase_admin.initialize_app(cred)

db = firestore.client()
auth = auth
