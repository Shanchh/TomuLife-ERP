import { Card, Col, Flex, Row, Spin, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_sales_payment_summary } from '../../Api/FinanceApi';

type Props = {
    dateRange: { start: number | null, end: number | null },
}

const SalesPaymentSummaryCard = ({ dateRange }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [unpaidAmount, setUnpaidAmount] = useState<number | null>(null);
    const [paidAmount, setPaidAmount] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, [dateRange])

    const fetchData = async () => {
        if (dateRange.start == null || dateRange.end == null) return;
        setIsLoading(true);

        const data = await get_sales_payment_summary(dateRange.start, dateRange.end);

        setTotalCount(data.totalCount);
        setPaidAmount(data.paidAmount);
        setUnpaidAmount(data.unpaidAmount);
        setIsLoading(false);
    };

    return (
        <Card
            title="銷售收款概況"
            style={{ width: "50%" }}
        >
            <Flex justify="center" align="center" style={{ width: "100%" }}>
                {isLoading ? (
                    <Flex align="center" style={{height:65}}>
                        <Spin size="large" />
                    </Flex>
                ) : (
                    <Row gutter={16} style={{ height: 65, width: "100%" }}>
                        <Col span={8}>
                            <Statistic
                                title="訂單筆數"
                                value={`${totalCount ?? 0} 筆`}
                                valueStyle={{ fontWeight: 'bold' }}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="已收款金額"
                                value={paidAmount ?? 0}
                                valueStyle={{ fontWeight: 'bold', color: 'green' }}
                                formatter={(value) => `$${Number(value).toLocaleString()}`}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="未收款金額"
                                value={unpaidAmount ?? 0}
                                valueStyle={{ fontWeight: 'bold', color: 'orange' }}
                                formatter={(value) => `$${Number(value).toLocaleString()}`}
                            />
                        </Col>
                    </Row>
                )}
            </Flex>
        </Card>
    )
}

export default SalesPaymentSummaryCard