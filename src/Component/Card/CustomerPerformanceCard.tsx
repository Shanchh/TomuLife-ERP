import React from 'react'
import { Card, Col, Divider, Flex, Row, Spin, Statistic, theme } from 'antd'
import dayjs from 'dayjs'
import { CustomerAnalyzeData } from '../../../types'

interface Props {
    analyzeData: CustomerAnalyzeData | null
    isLoading: boolean
}

const CustomerPerformanceCard: React.FC<Props> = ({ analyzeData, isLoading }) => {
    const { token } = theme.useToken()

    const discount = analyzeData?.calculateDiscount ?? 0
    const discountPercent = (discount * 100).toFixed(1)
    const discountColor = discount >= 0.8 ? 'green' : discount >= 0.6 ? 'orange' : 'red'

    return (
        <Card title="銷售表現" style={{ width: "100%", minHeight: 420 }}>
            <Flex justify="center" align="center" style={{ width: "100%" }}>
                {isLoading ? (
                    <Flex align="center" style={{ height: 300 }}>
                        <Spin size="large" />
                    </Flex>
                ) : (
                    <Flex vertical style={{ width: "100%" }} gap={40}>
                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic title="客戶等級" value={"A級"} valueStyle={{ fontWeight: 'bold' }} />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="平均購買折數"
                                    value={discountPercent}
                                    suffix="%"
                                    valueStyle={{ fontWeight: 'bold', color: discountColor }}
                                />
                            </Col>
                        </Row>

                        <Divider style={{ margin: 0 }} />

                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic
                                    title="第一次購買日期"
                                    value={analyzeData?.basic.firstPurchase
                                        ? dayjs.unix(analyzeData.basic.firstPurchase).format("YYYY/MM/DD")
                                        : "無資料"}
                                    valueStyle={{ fontWeight: 'bold' }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="總收款金額"
                                    value={analyzeData?.basic.totalAmount || 0}
                                    valueStyle={{ fontWeight: 'bold', color: 'green' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="總購買次數"
                                    value={analyzeData?.basic.orderCount || 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `${value}次`}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic
                                    title="最後一次購買日期"
                                    value={analyzeData?.basic.lastPurchase
                                        ? dayjs.unix(analyzeData.basic.lastPurchase).format("YYYY/MM/DD")
                                        : "無資料"}
                                    valueStyle={{ fontWeight: 'bold' }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="平均購買金額"
                                    value={analyzeData?.basic.averageAmount || 0}
                                    valueStyle={{ fontWeight: 'bold', color: 'green' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="距離上次購買"
                                    value={
                                        analyzeData?.basic?.purchaseFrequencyDays !== null &&
                                            analyzeData?.basic?.purchaseFrequencyDays !== undefined
                                            ? `${Math.floor(analyzeData.basic.purchaseFrequencyDays)} 天`
                                            : "無資料"
                                    }
                                    valueStyle={{ fontWeight: 'bold', color: token.colorPrimary }}
                                />
                            </Col>
                        </Row>
                    </Flex>
                )}
            </Flex>
        </Card>
    )
}

export default CustomerPerformanceCard