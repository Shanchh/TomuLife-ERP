def pop_objectId(dataList):
    for data in dataList:
        data["_id"] = str(data["_id"])
    return dataList

def build_query(query: dict):
    """構建查詢參數"""
    # 過濾無效查詢條件
    query = {k: v for k, v in query.items() if v not in [None, ""]}

    # 處理模糊搜索條件
    for key, value in query.items():
        if isinstance(value, str):
            query[key] = {"$regex": value, "$options": "i"}

    return query