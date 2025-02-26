from flask import request, jsonify, g
from functools import wraps
from utils.firebase_config import auth
from config.setting import db
from firebase_admin._user_mgt import UserRecord

def getTokenWithHeaders():
    """獲取Token"""
    try:
        return str(request.headers["Authorization"]).split("Bearer ")[1]
    except:
        return ""
    
def getCurrentUser() -> UserRecord:
    """獲取當前User"""
    try:
        token = getTokenWithHeaders()
        result = auth.verify_id_token(token, clock_skew_seconds=60)
        g.token = token
        g.curUser = auth.get_user(result["user_id"])
        return g.curUser
    except:
        return None

def login_required(func):
    """登入裝飾器"""
    @wraps(func)
    def wrapper(*args, **kwags):
        user = getCurrentUser()
        if (user == None):
            return jsonify({"error": "please login!"}), 403
        return func(*args, *kwags)
    return wrapper

def auth_check():
    def wrapper(func):
        @wraps(func)
        def view(*args, **kwargs):
            if (True):
                return jsonify({"error": "404"}), 404
            return func(*args, **kwargs)
        return view
    return wrapper

def admin_required(f):
    """管理員權限檢查裝飾器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        email = g.curUser.email
        if not email:
            return jsonify({"error": "未提供 Email"}), 403

        user = db["Users"].find_one({"email": email})

        adminList = ["admin"]
        if not user or user["role"] not in adminList:
            return jsonify({"error": "無管理員權限"}), 403

        return f(*args, **kwargs)

    return decorated_function