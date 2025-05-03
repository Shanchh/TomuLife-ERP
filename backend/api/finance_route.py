from flask import Blueprint, request, jsonify, g
from config.setting import db
from bson import ObjectId
import time
from datetime import datetime

from utils.auth import login_required, admin_required
from utils.tools import pop_objectId, build_query, sales_report_build_query

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
            bottles_per_box = int(product_data.get("bottlesPerBox", 0))

            cost_per_bottle = int(product_info.get("costPerBottle", 0) or 0)
            cost_per_box = int(product_info.get("costPerBox", 0) or 0)

            item_amount = (cost_per_bottle * quantity_bottles) + (cost_per_box * quantity_boxes)

            product_details[product_id] = {
                "productID": product_id,
                "costPerBottle": cost_per_bottle,
                "purchaseQuantityBottles": quantity_bottles,
                "costPerBox": cost_per_box,
                "purchaseQuantityBoxes": quantity_boxes,
                "bottlesPerBox": bottles_per_box,
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
        values = data.get("values", {})

        submitter = db["Users"].find_one({"email": g.curUser.email})

        # 轉換商品數據為整數
        raw_products = values.get("productSection", {}).get("products", {})
        transformed_products = {}
        for product_id, item in raw_products.items():
            transformed_products[product_id] = {
                "quantity": int(item.get("quantity", 0)),
                "price": int(item.get("price", 0))
            }

        values["productSection"]["products"] = transformed_products

        if values["billing"]["paymentStatus"] == "gift":
            values["billing"]["receivableAmount"] = 0
            values["billing"]["isTaxIncluded"] = None
        else:
            values["billing"]["receivableAmount"] = int(values["billing"]["receivableAmount"])

        # 插入進貨訂單
        collection = db["SalesReport"]
        insert_data = {
            **values,
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
    
@finance_api.route("/update_sales_reports", methods=["POST"])
@login_required
@admin_required
def update_sales_reports():
    try:
        data = request.get_json()
        data_id = data["dataId"]
        values = data.get("values", {})

        # 轉換商品數據為整數
        raw_products = values.get("productSection", {}).get("products", {})
        transformed_products = {}
        for product_id, item in raw_products.items():
            transformed_products[product_id] = {
                "quantity": int(item.get("quantity", 0)),
                "price": int(item.get("price", 0))
            }

        values["productSection"]["products"] = transformed_products

        if values["billing"]["paymentStatus"] == "gift":
            values["billing"]["receivableAmount"] = 0
            values["billing"]["isTaxIncluded"] = None
        else:
            values["billing"]["receivableAmount"] = int(values["billing"]["receivableAmount"])

        collection = db["SalesReport"]

        result = collection.update_one(
            {"_id": ObjectId(data_id)},
            {"$set": values}
        )

        return jsonify({"message": "Sales report updated successfully", "orderID": data_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_sales_report", methods=["POST"])
@login_required
@admin_required
def get_sales_report():
    try:
        data: dict = request.get_json()
        page = data.get("page", 1)
        page_size = data.get("page_size", 1)
        query: dict = data.get("query", {})
        skip = (page - 1) * page_size

        collection = db["SalesReport"]
        query = sales_report_build_query(query)
        total = collection.count_documents(query)
        sales_report_list = list(collection.find(query).sort("basicInfo.purchaseDate", -1).skip(skip).limit(page_size))

        result = {
            "code": 0,
            "message": "SalesReport data retrieved successfully",
            "data": pop_objectId(sales_report_list),
            "total": total
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/delete_sales_report", methods=["POST"])
@login_required
@admin_required
def delete_sales_report():
    try:
        data: dict = request.get_json()
        _id = data["_id"]

        collection = db["SalesReport"]
        r = collection.delete_one({"_id": ObjectId(_id)})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_sales_payment_summary", methods=["POST"])
@login_required
@admin_required
def get_sales_payment_summary():
    try:
        data: dict = request.get_json()
        start_time = int(data["startTime"] / 1000)
        end_time = int(data["endTime"] / 1000)

        collection = db["SalesReport"]
        orders = list(collection.find({
            "basicInfo.purchaseDate": {
                "$gte": start_time,
                "$lte": end_time
            }
        }))

        total_count = len(orders)
        paid_total = 0
        paid_count = 0
        unpaid_total = 0
        unpaid_count = 0

        for order in orders:
            billing = order.get("billing", {})
            status = billing.get("paymentStatus")
            amount = billing.get("receivableAmount", 0)

            if status == "paid":
                paid_count += 1
                paid_total += amount
            elif status == "unpaid":
                unpaid_count += 1
                unpaid_total += amount

        result = {
            "code": 0,
            "totalCount": total_count,
            "paidCount": paid_count,
            "paidAmount": paid_total,
            "unpaidCount": unpaid_count,
            "unpaidAmount": unpaid_total
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_payment_method_summary", methods=["POST"])
@login_required
@admin_required
def get_payment_method_summary():
    try:
        data: dict = request.get_json()
        start_time = int(data["startTime"] / 1000)
        end_time = int(data["endTime"] / 1000)

        collection = db["SalesReport"]
        orders = list(collection.find({
            "basicInfo.purchaseDate": {
                "$gte": start_time,
                "$lte": end_time
            }
        }))

        cash = 0
        e_sun = 0
        yuan_ta = 0

        for order in orders:
            billing = order.get("billing", {})
            status = billing.get("paymentStatus")
            payment_type = billing.get("paymentType")
            amount = billing.get("receivableAmount", 0)

            if status != "paid":
                continue
            
            if payment_type == "cash":
                cash += amount
            elif payment_type == "eSunBank":
                e_sun += amount
            elif payment_type == "yuantaBank":
                yuan_ta += amount

        result = {
            "code": 0,
            "cashAmount": cash,
            "eSunAmount": e_sun,
            "yuantaAmount": yuan_ta
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_products_sales_statistics", methods=["POST"])
@login_required
@admin_required
def get_products_sales_statistics():
    try:
        data: dict = request.get_json()
        start_time = int(data["startTime"] / 1000)
        end_time = int(data["endTime"] / 1000)

        product_collection = db["Products"]
        product_docs = list(product_collection.find())
        product_map = {str(p["_id"]): p["productName"] for p in product_docs}

        statistics = {}

        sales_collection = db["SalesReport"]
        sales_reports = sales_collection.find({
            "basicInfo.purchaseDate": {
                "$gte": start_time,
                "$lte": end_time
            }
        })

        for report in sales_reports:
            product_section = report.get("productSection", {})
            products = product_section.get("products", {})

            for product_id, p in products.items():
                quantity = p.get("quantity", 0)
                price = p.get("price", 0)

                if product_id not in statistics:
                    statistics[product_id] = {
                        "productId": product_id,
                        "productName": product_map.get(product_id, "未知產品"),
                        "totalQuantity": 0,
                        "totalRevenue": 0
                    }

                statistics[product_id]["totalQuantity"] += quantity
                statistics[product_id]["totalRevenue"] += quantity * price

        result = {
            "code": 0,
            "data": list(statistics.values())
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/add_activity_detail", methods=["POST"])
@login_required
@admin_required
def add_activity_detail():
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

        collection = db["ActivityDetails"]


        result = collection.insert_one(insert_data)

        return jsonify({"message": "Activity detail created successfully", "detailID": str(result.inserted_id)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_activity_detail", methods=["GET"])
@login_required
@admin_required
def get_activity_detail():
    try:
        collection = db["ActivityDetails"]
        activity_detail_list = list(collection.find())

        result = {
            "code": 0,
            "message": "Activity Detail data retrieved successfully",
            "data": pop_objectId(activity_detail_list)
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500  
    
@finance_api.route("/delete_activity_detail", methods=["POST"])
@login_required
@admin_required
def delete_activity_detail():
    try:
        data: dict = request.get_json()
        _id = data["_id"]

        collection = db["ActivityDetails"]
        r = collection.delete_one({"_id": ObjectId(_id)})

        result = {
            "code": 0,
            "delete_count": r.deleted_count
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/update_activity_detail", methods=["POST"])
@login_required
@admin_required
def update_activity_detail():
    try:
        data = request.get_json()
        data_id = data["dataId"]
        values = data.get("values", {})

        collection = db["ActivityDetails"]

        result = collection.update_one(
            {"_id": ObjectId(data_id)},
            {"$set": values}
        )

        return jsonify({"message": "Activity detail updated successfully", "orderID": data_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@finance_api.route("/get_inventory_details", methods=["GET"])
@login_required
@admin_required
def get_inventory_details():
    try:
        product_collection = db["Products"]
        purchase_collection = db["PurchaseOrders"]
        sales_collection = db["SalesReport"]

        products = list(product_collection.find({}))

        inventory_data = {}

        for product in products:
            product_id = str(product["_id"])
            inventory_data[product_id] = {
                "productId": product_id,
                "productName": product.get("productName", "未知商品"),
                "retailPrice": product.get("retailPrice", 0),
                "inventoryQty": 0,
                "lastPurchaseDate": None,
            }

        # 處理進貨資料
        purchases = list(purchase_collection.find({}))
        for purchase in purchases:
            purchase_date = purchase.get("purchaseAt", 0)
            for product_id, detail in purchase.get("products", {}).items():
                if product_id not in inventory_data:
                    continue

                # 更新最近一次進貨時間
                current_last_purchase = inventory_data[product_id]["lastPurchaseDate"]
                if current_last_purchase is None or purchase_date > current_last_purchase:
                    inventory_data[product_id]["lastPurchaseDate"] = purchase_date

                # 把箱數轉成瓶數
                purchase_bottles = int(detail.get("purchaseQuantityBottles", 0))
                purchase_boxes = int(detail.get("purchaseQuantityBoxes", 0))
                
                bottles_per_box = int(product_collection.find_one({"_id": ObjectId(product_id)}).get("bottlesPerBox", 1))
                total_bottles = purchase_bottles + (purchase_boxes * bottles_per_box)

                inventory_data[product_id]["inventoryQty"] += total_bottles

        # 處理銷售資料扣除已售出的數量
        sales = list(sales_collection.find({}))
        for sale in sales:
            products_in_sale = sale.get("productSection", {}).get("products", {})
            for product_id, detail in products_in_sale.items():
                if product_id not in inventory_data:
                    continue

                quantity = int(detail.get("quantity", 0))
                inventory_data[product_id]["inventoryQty"] -= quantity

        product_numbers = { str(p["_id"]): p.get("number", 0) for p in products }
        result = sorted(inventory_data.values(), key=lambda x: product_numbers.get(x["productId"], 0))

        return jsonify({
            "code": 0,
            "message": "success",
            "data": result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500