import { Card, Flex } from 'antd'
import React from 'react'
import SalesReportForm from '../../Component/Form/SalesReportForm'

const FinanceSalesReport = () => {
  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Flex vertical style={{ height: "100%", width: "100%", maxWidth: 600 }}>
          <SalesReportForm />
        </Flex>
      </Flex>
    </Card>
  )
}

export default FinanceSalesReport