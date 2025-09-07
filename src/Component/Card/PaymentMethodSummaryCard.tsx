import { Card, Col, Flex, Row, Spin, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_payment_method_summary } from '../../Api/FinanceApi';

type Props = {
    dateRange: { start: number | null, end: number | null },
}

type SalesPaymentRequest = {
    code: number;
    cashAmount: number;
    eSunAmount: number;
    yuantaAmount: number;
    creditCard: number;
    linePay: number;
}

const PaymentMethodSummaryCard = ({ dateRange }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requestData, setRequestData] = useState<SalesPaymentRequest | null>(null);

    useEffect(() => {
        fetchData();
    }, [dateRange])

    const fetchData = async () => {
        if (dateRange.start == null || dateRange.end == null) return;
        setIsLoading(true);

        const data = await get_payment_method_summary(dateRange.start, dateRange.end);
        setRequestData(data);

        setIsLoading(false);
    };

    return (
        <Card
            title="付款方式概況"
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
                                    title="現金"
                                    value={requestData?.cashAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="玉山銀行"
                                    value={requestData?.eSunAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="元大銀行"
                                    value={requestData?.yuantaAmount ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16} style={{ height: 65, width: "100%" }}>
                            <Col span={8}>
                                <Statistic
                                    title="信用卡"
                                    value={requestData?.creditCard ?? 0}
                                    valueStyle={{ fontWeight: 'bold' }}
                                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="LinePay"
                                    value={requestData?.linePay ?? 0}
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

export default PaymentMethodSummaryCard