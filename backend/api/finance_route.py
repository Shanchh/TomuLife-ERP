from flask import Blueprint, request, jsonify, g
from config.setting import db
from bson import ObjectId
import time

from utils.auth import login_required, admin_required
from utils.tools import pop_objectId

finance_api = Blueprint("finance_api", __name__)

@finance_api.route("/purchase_orders", methods=["POST"])
@login_required
@admin_required
def purchase_orders():
    try:
        data: dict = request.get_json()
        products = data.get("products")
        purchase_date = data.get("purchaseDate")
        remarks = data.get("remarks", "")
        total_amount = data.get("totalAmount")

        submitter = db["Users"].find_one({"email": g.curUser.email})

        # 檢查必要欄位是否存在
        missing_fields = [field for field in ["products", "purchaseDate", "totalAmount"] if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        product_details = {}
        countAmount = 0

        # 建構產品資料
        for product_id, product_data in products.items():
            product_info = db["Products"].find_one({"_id": ObjectId(product_id)})

            if not product_info:
                return jsonify({"error": f"Product ID {product_id} not found"}), 404

            quantity_bottles = int(product_data.get("purchaseQuantityBottles", 0))
            quantity_boxes = int(product_data.get("purchaseQuantityBoxes", 0))

            cost_per_bottle = int(product_info.get("costPerBottle", 0) or 0)
            cost_per_box = int(product_info.get("costPerBox", 0) or 0)

            item_amount = (cost_per_bottle * quantity_bottles) + (cost_per_box * quantity_boxes)

            product_details[product_id] = {
                "productID": product_id,
                "costPerBottle": cost_per_bottle,
                "purchaseQuantityBottles": quantity_bottles,
                "costPerBox": cost_per_box,
                "purchaseQuantityBoxes": quantity_boxes,
                "itemAmount": item_amount
            }

            countAmount += item_amount

        # 確保 totalAmount 與計算結果一致
        if countAmount != total_amount:
            return jsonify({"error": "Total amount mismatch: " + str(countAmount)})

        # 插入進貨訂單
        collection = db["PurchaseOrders"]
        insert_data = {
            "purchaseAt": purchase_date,
            "products": product_details,
            "totalAmount": total_amount,
            "remarks": remarks,
            "creator": {
                "_id": str(submitter["_id"]),
                "nickname": submitter["nickname"],
                "email": submitter["email"]
            },
            "createdAt": int(time.time())
        }

        result = collection.insert_one(insert_data)

        return jsonify({"message": "Purchase order created successfully", "orderID": str(result.inserted_id)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@finance_api.route("/get_purchase_orders", methods=["GET"])
@login_required
@admin_required
def get_purchase_orders():
    try:
        collection = db["PurchaseOrders"]
        role_list = list(collection.find().sort("purchaseAt", -1))

        result = {
            "code": 0,
            "message": "PurchaseOrders data retrieved successfully",
            "data": pop_objectId(role_list)
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500