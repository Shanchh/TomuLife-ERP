from flask import Blueprint, request, jsonify, g
from config.setting import db
from bson import ObjectId
import time

from utils.auth import login_required
from utils.tools import pop_objectId
from utils.user import get_user_with_uid
import utils.firebase_config

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
    
@admin_api.route("/modify_user_profile", methods=["POST"])
@login_required
def modify_user_profile():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        uid = data["uid"]
        data = data["data"]

        collection = db["Users"]
        r = collection.update_one({ "_id": ObjectId(uid) }, { "$set": data })

        result = {
            "code": 0,
            "modify_count": r.modified_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/delete_user_profile", methods=["POST"])
@login_required
def delete_user_profile():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        email = data["email"]

        firebase_account = utils.firebase_config.auth.get_user_by_email(email)
        utils.firebase_config.auth.delete_user(firebase_account.uid)

        collection = db["Users"]
        r = collection.delete_one({"email": email})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/modify_role", methods=["POST"])
@login_required
def modify_role():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        uid = data["uid"]
        values = data["values"]

        collection = db["Roles"]
        r = collection.update_one({ "_id": ObjectId(uid) }, { "$set": values })

        result = {
            "code": 0,
            "modify_count": r.modified_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/delete_role", methods=["POST"])
@login_required
def delete_role():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        uid = data["uid"]

        collection = db["Roles"]
        r = collection.delete_one({"_id": ObjectId(uid)})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/add_role", methods=["POST"])
@login_required
def add_role():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        values = data["values"]

        submitter = db["Users"].find_one({"email": g.curUser.email})

        insert_data = {
            **values,
            "creator": {
                "_id": str(submitter["_id"]),
                "nickname": submitter["nickname"],
                "email": submitter["email"]
            },
            "createAt": int(time.time())
        }

        collection = db["Roles"]
        r = collection.insert_one(insert_data)

        result = {
            "code": 0,
            "insert_data_id": str(r.inserted_id)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/get_customers", methods=["GET"])
@login_required
def get_customers():
    try:
        check_admin(g.curUser.email)

        collection = db["Customers"]
        customer_list = list(collection.find())

        result = {
            "code": 0,
            "message": "Customers data retrieved successfully",
            "data": pop_objectId(customer_list)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500    
    
@admin_api.route("/modify_customer", methods=["POST"])
@login_required
def modify_customer():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        uid = data["uid"]
        values = data["values"]

        collection = db["Customers"]
        r = collection.update_one({ "_id": ObjectId(uid) }, { "$set": values })

        result = {
            "code": 0,
            "modify_count": r.modified_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/delete_customer", methods=["POST"])
@login_required
def delete_customer():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        uid = data["uid"]

        collection = db["Customers"]
        r = collection.delete_one({"_id": ObjectId(uid)})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/add_customer", methods=["POST"])
@login_required
def add_customer():
    try:
        check_admin(g.curUser.email)
        
        data: dict = request.get_json()
        values = data["values"]

        submitter = db["Users"].find_one({"email": g.curUser.email})

        insert_data = {
            **values,
            "creator": {
                "_id": str(submitter["_id"]),
                "nickname": submitter["nickname"],
                "email": submitter["email"]
            },
            "createAt": int(time.time())
        }

        collection = db["Customers"]
        r = collection.insert_one(insert_data)

        result = {
            "code": 0,
            "insert_data_id": str(r.inserted_id)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@admin_api.route("/get_products", methods=["GET"])
@login_required
def get_products():
    try:
        check_admin(g.curUser.email)

        collection = db["Products"]
        product_list = list(collection.find())

        result = {
            "code": 0,
            "message": "Products data retrieved successfully",
            "data": pop_objectId(product_list)
        }

        return jsonify(result), 200
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500  