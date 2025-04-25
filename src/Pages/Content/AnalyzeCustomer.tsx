import { Button, Card, Col, Flex, Form, message, Row, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { Customer, CustomerAnalyzeData } from '../../../types';
import { locations } from '../../Constants/locations';
import { get_customers } from '../../Api/SystemApi';
import { get_customer_analyze } from '../../Api/AnalyzeApi';
import CustomerPerformanceCard from '../../Component/Card/CustomerPerformanceCard';
import CustomerMonthlyPurchaseCard from '../../Component/Card/CustomerMonthlyPurchaseCard';
import CustomerCRMHistoryCard from '../../Component/Card/CustomerCRMHistoryCard';

const AnalyzeCustomer = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [customerList, setCustomerList] = useState<Customer[]>([]);

    const [areaCodeValue, setAreaCodeValue] = useState<string>("all");
    const [areaCustomers, setAreaCustomers] = useState<Customer[]>([]);

    const [analyzeData, setAnalyzeData] = useState<CustomerAnalyzeData | null>(null);

    const initPage = async () => {
        setIsLoading(true);
        try {
            const customers = await get_customers();

            setCustomerList(customers);
        }
        catch {
            message.error("初始化頁面時發生錯誤！");
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        initPage();
    }, []);

    useEffect(() => {
        form.setFieldsValue({ customer: undefined });
        if (areaCodeValue === "all") {
            setAreaCustomers(customerList);
        } else {
            setAreaCustomers(customerList.filter(c => c.areaCode === areaCodeValue));
        }
    }, [areaCodeValue, customerList]);

    const onFormSubmit = async () => {
        const values = form.getFieldsValue();
        if (!values.customer) {
            message.error("請選擇客戶！");
            return;
        }
        setIsLoading(true);

        const data = await get_customer_analyze(values.customer);
        setAnalyzeData(data);
        setIsLoading(false);
    };

    return (
        <Flex vertical gap={8}>
            <Card>
                <Form
                    form={form}
                    name="analyze_customer_search"
                    style={{ width: "100%" }}
                    onFinish={onFormSubmit}
                >
                    <Row justify="start" gutter={[18, 18]}>
                        <Col>
                            <Flex justify="start" align="center" gap={10}>
                                <span style={{ whiteSpace: "nowrap" }}>搜尋客戶:</span>

                                <Form.Item name="areaCode" initialValue="all" noStyle>
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder="請輸入或選擇縣市"
                                        value={areaCodeValue}
                                        onChange={(v) => setAreaCodeValue(v)}
                                        options={[
                                            { label: "ALL-不限代碼", value: "all" },
                                            ...Object.values(locations).map(e => ({
                                                label: `${e.code} - ${e.name}`,
                                                value: e.code,
                                            })),
                                        ]}
                                        filterOption={(input, option) =>
                                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: 160 }}
                                    />
                                </Form.Item>

                                <Form.Item name="customer" noStyle>
                                    <Select
                                        showSearch
                                        placeholder="請輸入或選擇客戶"
                                        options={areaCustomers.map(c => ({
                                            label: `${c.areaCode}-${c.bookkeeping} ${c.customerName}`,
                                            value: c._id
                                        }))}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: 200 }}
                                    />
                                </Form.Item>
                            </Flex>
                        </Col>

                        <Col>
                            <Button htmlType="submit" variant="solid">
                                送出查詢
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Row gutter={[8, 8]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <CustomerPerformanceCard
                        analyzeData={analyzeData}
                        isLoading={isLoading}
                    />
                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                    <CustomerMonthlyPurchaseCard
                        analyzeData={analyzeData}
                        isLoading={isLoading}
                    />
                </Col>
            </Row>

            <CustomerCRMHistoryCard analyzeData={analyzeData} customerList={customerList}/>
        </Flex>
    )
}

export default AnalyzeCustomer