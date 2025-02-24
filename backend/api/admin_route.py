from flask import Blueprint, request, jsonify, g
from config.setting import db
import time

from utils.auth import login_required
from utils.tools import pop_objectId
from utils.user import get_user_with_uid

admin_api = Blueprint("admin_api", __name__)

def check_admin(email):
    adminList = ["admin"]
    collection = db["Users"]
    user = collection.find_one({"email": email})

    if user["role"] not in adminList:
        raise PermissionError("No administrator privileges")
    
@admin_api.route("/get_roles", methods=["GET"])
@login_required
def get_roles():
    try:
        check_admin(g.curUser.email)

        collection = db["Roles"]
        role_list = list(collection.find())

        for role in role_list:
            role["creator"] = get_user_with_uid(role["creator"])

        result = {
            "code": 0,
            "message": "Roles data retrieved successfully",
            "data": pop_objectId(role_list)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_api.route("/get_user_list", methods=["GET"])
@login_required
def get_user_list():
    try:
        check_admin(g.curUser.email)

        collection = db["Users"]
        user_list = list(collection.find())

        result = {
            "code": 0,
            "message": "User list retrieved successfully",
            "data": pop_objectId(user_list)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500