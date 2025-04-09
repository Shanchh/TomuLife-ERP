import { Card, Col, Flex, Row, Spin, Statistic } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_payment_method_summary } from '../../Api/FinanceApi';

type Props = {
    dateRange: { start: number | null, end: number | null },
}

const PaymentMethodSummaryCard = ({ dateRange }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cashAmount, setCashAmount] = useState<number | null>(null);
    const [eSunBankAmount, setESunBankAmount] = useState<number | null>(null);
    const [yuantaBankAmount, setYuantaBankAmount] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, [dateRange])

    const fetchData = async () => {
        if (dateRange.start == null || dateRange.end == null) return;
        setIsLoading(true);

        const data = await get_payment_method_summary(dateRange.start, dateRange.end);

        setCashAmount(data.cashAmount);
        setESunBankAmount(data.eSunAmount);
        setYuantaBankAmount(data.yuantaAmount);
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
                                title="現金"
                                value={cashAmount ?? 0}
                                valueStyle={{ fontWeight: 'bold' }}
                                formatter={(value) => `$${Number(value).toLocaleString()}`}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="玉山銀行"
                                value={eSunBankAmount ?? 0}
                                valueStyle={{ fontWeight: 'bold' }}
                                formatter={(value) => `$${Number(value).toLocaleString()}`}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic
                                title="元大銀行"
                                value={yuantaBankAmount ?? 0}
                                valueStyle={{ fontWeight: 'bold' }}
                                formatter={(value) => `$${Number(value).toLocaleString()}`}
                            />
                        </Col>
                    </Row>
                )}
            </Flex>
        </Card>
    )
}

export default PaymentMethodSummaryCard