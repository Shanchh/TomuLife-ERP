import { Card, Flex } from 'antd'
import React from 'react'
import ActivityReportForm from '../../Component/Form/ActivityReportForm'

const FinanceActivityReport = () => {

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Flex justify="center" align="center" style={{ height: "100%" }}>
        <Flex vertical style={{ height: "100%", width: "100%", maxWidth: 1200 }}>
          <ActivityReportForm />
        </Flex>
      </Flex>
    </Card>
  )
}

export default FinanceActivityReport