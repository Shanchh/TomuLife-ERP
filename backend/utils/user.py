from config.setting import db
from bson import ObjectId

def get_user_with_uid(uid: str):
    """獲取指定用戶資料"""
    try:
        user = db['Users'].find_one({"_id": ObjectId(uid)})
        user["_id"] = str(user["_id"])
        return user
    except:
        return None