from flask import Blueprint, request, jsonify
from config.setting import db
import time

auth_api = Blueprint("auth_api", __name__)

@auth_api.route("/create_user", methods=["POST"])
def create_user():
    try:
        data: dict = request.get_json()
        email = data["email"]
        nickname = data["nickname"]
        role = "user"

        collection = db["Users"]
        
        existing_user = collection.find_one({"email": email})
        if existing_user:
            return jsonify({ "message": "信箱已註冊!" }), 400

        userData = {
            "email": email,
            "nickname": nickname,
            "role": role,
            "createAt": int(time.time())
        }

        collection.insert_one(userData)
        
        result = {
            "code": 0,
            "message": "User registered successfully"
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({ "error": str(e) }), 400