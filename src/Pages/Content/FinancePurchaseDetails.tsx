import { Button, Card, Flex, message } from "antd"
import React, { useEffect, useState } from 'react'
import { PurchaseOrder } from "../../../types";
import { get_purchase_orders } from "../../Api/FinanceApi";
import PurchaseDetailsTable from "../../Component/Table/PurchaseDetailsTable";
import { AreaChartOutlined, ReloadOutlined } from "@ant-design/icons";

const FinancePurchaseDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [purchaseData, setPurchaseData] = useState<PurchaseOrder[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_purchase_orders();
      setPurchaseData(data);
    }
    catch {
      message.error("資料載入錯誤！");
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Flex style={{ marginBottom: 15 }} gap={15}>
        <Button variant="text" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>

        <Button variant="text">
          <AreaChartOutlined />
          生成報表
        </Button>
      </Flex>
      <PurchaseDetailsTable isLoading={isLoading} data={purchaseData} />
    </Card>
  )
}

export default FinancePurchaseDetails