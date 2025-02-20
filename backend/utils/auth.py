from flask import request, jsonify, g
from functools import wraps
from utils.firebase_config import auth
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
        result = auth.verify_id_token(token)
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