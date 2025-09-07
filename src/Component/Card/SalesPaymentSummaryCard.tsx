import { Card, Col, Flex, Row, Spin, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_sales_payment_summary } from '../../Api/FinanceApi';

type Props = {
    dateRange: { start: number | null, end: number | null },
}

type SalesPaymentRequest = {
    code: number;
    paidCount: number;
    paidAmount: number;
    taxAmount: number;
    unpaidCount: number;
    unpaidAmount: number;
    totalCount: number;
    totalAmount: number;
}

const SalesPaymentSummaryCard = ({ dateRange }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requestData, setRequestData] = useState<SalesPaymentRequest | null>(null);

    useEffect(() => {
        fetchData();
    }, [dateRange])

    const fetchData = async () => {
        if (dateRange.start == null || dateRange.end == null) return;
        setIsLoading(true);

        const data = await get_sales_payment_summary(dateRange.start, dateRange.end);
        setRequestData(data);
        setIsLoading(false);
    };

    return (
        <Card
            title="銷售收款概況"
            style={{ width: "100%" }}
        >
            <Flex vertical gap={12} justify="center" align="center" style={{ width: "100%" }}>
                {isLoading ? (
                    <Flex align="center" style={{ height: 65 }}>
                        <Spin size="large" />
                    </Flex>
                ) : (
                    <>
                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic
                                    title="總訂單筆數"
                                    value={`${requestData?.totalCount ?? 0} 筆`}
                                    valueStyle={{ fontWeight: 'bold', color: 'orange' }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="總訂單金額"
                                    value={requestData?.totalAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold', color: 'orange' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="未收款訂單數"
                                    value={`${requestData?.unpaidCount ?? 0} 筆`}
                                    valueStyle={{ fontWeight: 'bold' }}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic
                                    title="稅金金額"
                                    value={requestData?.taxAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="已收款金額"
                                    value={requestData?.paidAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="未收款金額"
                                    value={requestData?.unpaidAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                        </Row>
                    </>
                )}
            </Flex>
        </Card>
    )
}

export default SalesPaymentSummaryCard