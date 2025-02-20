from flask import Blueprint, jsonify, g
from config.setting import db
from utils.auth import login_required

user_api = Blueprint("user_api", __name__)

@user_api.route("/get_my_profile", methods=["POST"])
@login_required
def get_my_profile():
    try:
        email = g.curUser.email
        if not email:
            return jsonify({"error": "User email not found"}), 400
        
        collection = db["Users"]
        user = collection.find_one({"email": email})
        user['_id'] = str(user['_id'])

        result = {
            "code": 0,
            "message": user
        }
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({ "error": str(e) }), 400