from datetime import datetime
from calendar import monthrange

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

def sales_report_build_query(query: dict):
    query = {k: v for k, v in query.items() if v not in [None, ""]}

    mongo_query = {}

    for key, value in query.items():
        if key == "monthSelect":
            try:
                year, month = map(int, value.split('-'))
                start_date = datetime(year, month, 1)
                end_day = monthrange(year, month)[1]
                end_date = datetime(year, month, end_day, 23, 59, 59)

                mongo_query["basicInfo.purchaseDate"] = {
                    "$gte": int(start_date.timestamp()),
                    "$lte": int(end_date.timestamp())
                }
            except Exception as e:
                print("日期格式錯誤:", e)

        elif key == "paymentStatus":
            mongo_query["billing.paymentStatus"] = value

        elif key == "areaCode":
            mongo_query["basicInfo.areaCode"] = value

        elif key == "customer":
            mongo_query["basicInfo.customer"] = value

        elif key == "productSelect":
            mongo_query["$expr"] = {
                "$in": [value, {"$map": {
                    "input": { "$objectToArray": "$productSection.products" },
                    "as": "item",
                    "in": "$$item.k"
                }}]
            }

        elif key == "customerBookkeeping":
            mongo_query["basicInfo.customerBookkeeping"] = value

        elif key == "isTaxIncluded":
            mongo_query["billing.isTaxIncluded"] = value

        elif key == "paymentType":
            mongo_query["billing.paymentType"] = value

        elif key == "remitCode":
            mongo_query["billing.remitCode"] = value

        elif key == "invoiceNumber":
            mongo_query["billing.invoiceNumber"] = value

        elif key == "deliveryMethod":
            mongo_query["delivery.deliveryMethod"] = value

    return mongo_query