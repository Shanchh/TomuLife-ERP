import { Card, Flex } from 'antd'
import React from 'react'
import PurchaseReportForm from '../../Component/Form/PurchaseReportForm';

const FinancePurchaseReport = () => {

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Flex vertical style={{ height: "100%", width: "100%", maxWidth: 600 }}>
          <PurchaseReportForm />
        </Flex>
      </Flex>
    </Card>
  )
}

export default FinancePurchaseReport