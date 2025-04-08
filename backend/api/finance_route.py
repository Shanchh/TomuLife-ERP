from flask import Blueprint, request, jsonify, g
from config.setting import db
from bson import ObjectId
import time
from datetime import datetime

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

@finance_api.route("/update_purchase_orders", methods=["POST"])
@login_required
@admin_required
def update_purchase_orders():
    try:
        data: dict = request.get_json()

        data_id = data.get("dataId")
        products = data.get("products")
        purchase_date = data.get("purchaseDate")
        remarks = data.get("remarks", "")
        total_amount = data.get("totalAmount")

        submitter = db["Users"].find_one({"email": g.curUser.email})

        # 檢查必要欄位是否存在
        if not data_id or not products or not purchase_date or total_amount is None:
            return jsonify({"error": "Missing required fields"}), 400

        collection = db["PurchaseOrders"]
        existing_order = collection.find_one({"_id": ObjectId(data_id)})

        if not existing_order:
            return jsonify({"error": f"Purchase order with ID {data_id} not found"}), 404

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
            return jsonify({"error": f"Total amount mismatch: expected {countAmount}, received {total_amount}"}), 400

        # 更新資料
        update_data = {
            "purchaseAt": purchase_date,
            "products": product_details,
            "totalAmount": total_amount,
            "remarks": remarks,
        }

        result = collection.update_one(
            {"_id": ObjectId(data_id)},
            {"$set": update_data}
        )
        print(result.modified_count)
        if result.modified_count == 0:
            return jsonify({"warning": "No changes were made"}), 200

        return jsonify({"message": "Purchase order updated successfully", "orderID": data_id}), 200

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
    
@finance_api.route("/delete_purchase_orders", methods=["POST"])
@login_required
@admin_required
def delete_purchase_orders():
    try:
        data: dict = request.get_json()
        uid = data["uid"]

        collection = db["PurchaseOrders"]
        r = collection.delete_one({"_id": ObjectId(uid)})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_purchase_statistics", methods=["POST"])
@login_required
@admin_required
def get_purchase_statistics():
    try:
        data = request.get_json()
        year = int(data["year"])

        # 取得該年的開始結束 timestamp
        start_timestamp = int(datetime(year, 1, 1).timestamp())
        end_timestamp = int(datetime(year + 1, 1, 1).timestamp())

        # 查詢該年份內的進貨訂單
        orders = list(db["PurchaseOrders"].find({
            "purchaseAt": {
                "$gte": start_timestamp,
                "$lt": end_timestamp
            }
        }))

        product_stats = {}
        total_bottles = 0
        total_boxes = 0
        total_amount = 0

        for order in orders:
            total_amount += order.get("totalAmount", 0)

            for pid, prod in order.get("products", {}).items():
                if pid not in product_stats:
                    product_stats[pid] = {
                        "productID": pid,
                        "bottles": 0,
                        "boxes": 0,
                        "subtotal": 0,
                        "count": 0
                    }

                product_stats[pid]["bottles"] += prod.get("purchaseQuantityBottles", 0)
                product_stats[pid]["boxes"] += prod.get("purchaseQuantityBoxes", 0)
                product_stats[pid]["subtotal"] += prod.get("itemAmount", 0)
                product_stats[pid]["count"] += 1

                total_bottles += prod.get("purchaseQuantityBottles", 0)
                total_boxes += prod.get("purchaseQuantityBoxes", 0)

        products = db["Products"].find({"_id": {"$in": [ObjectId(pid) for pid in product_stats.keys()]}})
        product_name_map = {str(p["_id"]): p["productName"] for p in products}

        for pid in product_stats:
            product_stats[pid]["productName"] = product_name_map.get(pid, pid)

        return jsonify({
            "year": year,
            "ordersCount": len(orders),
            "totalAmount": total_amount,
            "totalBottles": total_bottles,
            "totalBoxes": total_boxes,
            "productStats": list(product_stats.values())
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/create_sales_reports", methods=["POST"])
@login_required
@admin_required
def create_sales_reports():
    try:
        data = request.get_json()

        submitter = db["Users"].find_one({"email": g.curUser.email})

        # 插入進貨訂單
        collection = db["SalesReport"]
        insert_data = {
            **data["values"],
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