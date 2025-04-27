from flask import Blueprint, request, jsonify, g
from config.setting import db
from bson import ObjectId
from datetime import datetime, timedelta
import time

from utils.auth import login_required, admin_required
from utils.tools import pop_objectId

analyze_api = Blueprint("analyze_api", __name__)

@analyze_api.route("/get_customer_analyze", methods=["POST"])
@login_required
@admin_required
def get_customer_analyze():
    try:
        data: dict = request.get_json()
        customer_id = data["_id"]

        basic_data = analyze_customer_sales(customer_id)
        calculate_discount = calculate_customer_avg_discount(customer_id)
        customer_monthly_retail_summary = calculate_customer_monthly_retail_summary(customer_id)

        return jsonify({
            "code": 0,
            "message": "success",
            "data": {
                **basic_data,
                "calculateDiscount": calculate_discount,
                "monthlyData": customer_monthly_retail_summary
            }
        }), 200
    except Exception as e:
        return jsonify({ "error": str(e) }), 400
    
def analyze_customer_sales(customer_id):
    collection = db["SalesReport"]
    pipeline = [
        {
            "$match": {
                "basicInfo.customer": customer_id
            }
        },
        {
            "$group": {
                "_id": "$basicInfo.customer",
                "totalAmount": {"$sum": {"$ifNull": ["$billing.receivableAmount", 0]}},
                "orderCount": {"$sum": 1},
                "lastPurchase": {"$max": "$basicInfo.purchaseDate"},
                "firstPurchase": {"$min": "$basicInfo.purchaseDate"}
            }
        },
        {
            "$project": {
                "totalAmount": 1,
                "orderCount": 1,
                "lastPurchase": 1,
                "firstPurchase": 1,
                "averageAmount": {
                    "$cond": {
                        "if": {"$gt": ["$orderCount", 0]},
                        "then": {"$divide": ["$totalAmount", "$orderCount"]},
                        "else": 0
                    }
                },
                "purchaseFrequencyDays": {
                    "$cond": {
                        "if": {"$gt": ["$lastPurchase", 0]},
                        "then": {
                            "$floor": {
                                "$divide": [
                                    {"$subtract": [int(time.time()), "$lastPurchase"]},
                                    86400
                                ]
                            }
                        },
                        "else": None
                    }
                }
            }
        }
    ]

    result = list(collection.aggregate(pipeline))
    if not result:
        return {
            "basic": {
                "_id": customer_id,
                "totalAmount": 0,
                "orderCount": 0,
                "averageAmount": 0,
                "lastPurchase": None,
                "firstPurchase": None,
                "purchaseFrequencyDays": None
            }
        }
    
    return {
        "basic": result[0]
    }
    
def calculate_customer_avg_discount(customer_id: str) -> float:
    orders = list(db["SalesReport"].find({
        "basicInfo.customer": customer_id,
        "billing.paymentStatus": { "$in": ["paid", "unpaid"] }
    }))

    product_collection = db["Products"]
    total_discount_ratio = 0
    total_product_count = 0

    for order in orders:
        products = order.get("productSection", {}).get("products", {})
        for product_id, product_detail in products.items():
            actual_price = int(product_detail.get("price", 0))
            quantity = int(product_detail.get("quantity", 0))

            product_info = product_collection.find_one({ "_id": ObjectId(product_id) })
            if not product_info:
                continue

            retail_price = int(product_info.get("retailPrice", 0))
            if retail_price == 0:
                continue

            discount_ratio = actual_price / retail_price
            total_discount_ratio += discount_ratio * quantity
            total_product_count += quantity

    if total_product_count == 0:
        return 0.0

    avg_discount = total_discount_ratio / total_product_count
    return round(avg_discount, 2)

def calculate_customer_total_retail_amount(customer_id: str) -> float:
    orders = list(db["SalesReport"].find({
        "basicInfo.customer": customer_id
    }))

    product_collection = db["Product"]
    total_amount = 0.0

    for order in orders:
        products = order.get("productSection", {}).get("products", {})
        for product_id, product_detail in products.items():
            try:
                quantity = float(product_detail.get("quantity", 0))
            except (ValueError, TypeError):
                continue

            # 找出商品原價
            product_info = product_collection.find_one({ "_id": ObjectId(product_id) })
            if not product_info:
                continue

            try:
                retail_price = float(product_info.get("retailPrice", 0))
            except (ValueError, TypeError):
                continue

            # 計算商品總額
            total_amount += quantity * retail_price

    return round(total_amount, 2)

def get_month_key(ts: int):
    dt = datetime.fromtimestamp(ts)
    return dt.strftime("%Y-%m")

def calculate_customer_monthly_retail_summary(customer_id: str) -> dict:
    product_collection = db["Products"]
    sales_collection = db["SalesReport"]

    now = datetime.now()
    start_date = now.replace(day=1) - timedelta(days=30 * 6)
    start_timestamp = int(start_date.timestamp())

    orders = list(sales_collection.find({
        "basicInfo.customer": customer_id,
        "basicInfo.purchaseDate": { "$gte": start_timestamp }
    }))

    monthly_summary = {}

    for order in orders:
        purchase_ts = order["basicInfo"]["purchaseDate"]
        month_key = get_month_key(purchase_ts)

        if month_key not in monthly_summary:
            monthly_summary[month_key] = {
                "total": 0.0,
                "items": {}
            }

        products = order.get("productSection", {}).get("products", {})
        for product_id, detail in products.items():
            try:
                quantity = float(detail.get("quantity", 0))
            except (ValueError, TypeError):
                continue

            # 查商品原價
            product = product_collection.find_one({ "_id": ObjectId(product_id) })
            if not product:
                continue

            try:
                unit_price = float(product.get("retailPrice", 0))
            except (ValueError, TypeError):
                continue

            subtotal = quantity * unit_price

            item_summary = monthly_summary[month_key]["items"].get(product_id, {
                "productId": str(product_id),
                "name": product.get("productName", "未知商品"),
                "quantity": 0,
                "unitPrice": unit_price,
                "subtotal": 0.0
            })

            item_summary["quantity"] += quantity
            item_summary["subtotal"] += subtotal

            monthly_summary[month_key]["items"][product_id] = item_summary
            monthly_summary[month_key]["total"] += subtotal

    for month in monthly_summary:
        monthly_summary[month]["items"] = list(monthly_summary[month]["items"].values())

    for i in range(7):
        target_month = now.replace(day=1) - timedelta(days=30 * i)
        key = target_month.strftime("%Y-%m")
        if key not in monthly_summary:
            monthly_summary[key] = {
                "total": 0.0,
                "items": []
            }

    return dict(sorted(monthly_summary.items(), reverse=True))

@analyze_api.route("/add_customer_trackings", methods=["POST"])
@login_required
@admin_required
def add_customer_trackings():
    try:
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

        collection = db["CustomerTrackings"]

        result = collection.insert_one(insert_data)

        return jsonify({"message": "Customer tracking data created successfully", "detailID": str(result.inserted_id)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@analyze_api.route("/get_customer_trackings", methods=["POST"])
@login_required
@admin_required
def get_customer_trackings():
    try:
        data: dict = request.get_json()
        _id = data["_id"]

        collection = db["CustomerTrackings"]

        trackings = list(collection.find({
            "customer": _id
        }).sort("contactDate", -1))

        result = {
            "code": 0,
            "message": "success",
            "data": pop_objectId(trackings)
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500