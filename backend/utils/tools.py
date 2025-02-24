def pop_objectId(dataList):
    for data in dataList:
        data["_id"] = str(data["_id"])
    return dataList