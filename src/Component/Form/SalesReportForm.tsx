import { message, Spin, Typography, Form, Card, Row, Col, DatePicker, Select, Flex, Button, Input, Radio, Space, Divider } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { get_customers, get_products } from '../../Api/SystemApi';
import { Customer, Product } from '../../../types';
import { locations } from '../../Constants/locations';
import { DeleteOutlined } from '@ant-design/icons';
import { create_sales_reports } from '../../Api/FinanceApi';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const SalesReportForm = () => {
    const [form] = Form.useForm();
    const watchedProducts = Form.useWatch(["productSection", "products"], form);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    const [productList, setProductList] = useState<Product[]>([]);
    const [customersList, setCustomersList] = useState<Customer[]>([]);

    const [areaCodeValue, setAreaCodeValue] = useState<string>("all");
    const [areaCustomers, setAreaCustomers] = useState<Customer[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<string>("unpaid");
    const [isTaxIncluded, setIsTaxIncluded] = useState<string | null>(null);
    const [paymentType, setPaymentType] = useState<string | null>(null);
    const [deliveryMethod, setDeliveryMethod] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const products: Product[] = await get_products();
            const customers: Customer[] = await get_customers();

            setProductList(products);
            setCustomersList(customers);
        }
        catch {
            message.error("預先載入資料時發生錯誤！");
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        form.setFieldsValue({ customer: undefined });
        if (areaCodeValue === "all") {
            setAreaCustomers(customersList);
        } else {
            setAreaCustomers(customersList.filter(c => c.areaCode === areaCodeValue));
        }
    }, [areaCodeValue, customersList]);

    const handleAddProduct = () => {
        if (!selectedProductId) return;

        const productToAdd = productList.find(p => p._id === selectedProductId);
        if (productToAdd && !selectedProducts.some(p => p._id === productToAdd._id)) {
            setSelectedProducts([...selectedProducts, productToAdd]);
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p._id !== productId));

        // 清除表單欄位資料
        const currentValues = form.getFieldsValue();
        if (currentValues.products && currentValues.products[productId]) {
            delete currentValues.products[productId];
            form.setFieldsValue({ products: currentValues.products });
        }
    };

    const totalAmount = useMemo(() => {
        if (!watchedProducts) return 0;
        let total = 0;

        Object.values(watchedProducts).forEach((item: any) => {
            const quantity = parseFloat(item?.quantity) || 0;
            const price = parseFloat(item?.price) || 0;
            total += quantity * price;
        });

        return total;
    }, [watchedProducts]);

    const handleSubmit = async () => {
        setIsSubmitLoading(true);
        const values = form.getFieldsValue();

        if (selectedProducts.length === 0) {
            message.error("請至少選擇一個產品");
            setIsSubmitLoading(false);
            return;
        }

        const customer = customersList.find(c => c._id === values.basicInfo.customer);
        const transformed = {
            ...values,
            basicInfo: {
                ...values.basicInfo,
                customerName: customer?.customerName ?? "",
                customerBookkeeping: customer?.bookkeeping ?? "",
                purchaseDate: values.basicInfo.purchaseDate
                    ? new Date(values.basicInfo.purchaseDate).getTime() / 1000
                    : null,
            },
            billing: {
                ...values.billing,
                paymentDate: values.billing?.paymentDate
                    ? new Date(values.billing.paymentDate).getTime() / 1000
                    : null,
            },
        };

        try {
            await create_sales_reports(transformed);
            message.success("成功創建進貨訂單");

            form.resetFields();
            navigate("/finance/sales-management/details");
        }
        catch {
            message.error("進貨訂單處理時發生錯誤！");
        }
        finally {
            setIsSubmitLoading(false);
        }
    };

    return (
        <Spin spinning={isLoading}>
            <Title level={3} style={{ marginTop: 0, marginBottom: 20 }}>
                🛒 新增銷貨訂單
            </Title>
            <Form size={"small"} form={form} layout="vertical" onFinish={handleSubmit}>
                {/* 銷貨資訊 */}
                <Card title="銷貨資訊" style={{ marginBottom: 16 }}>
                    <Form.Item
                        label="銷貨日期"
                        name={["basicInfo", "purchaseDate"]}
                        rules={[{ required: true }]}
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                    <Row gutter={[16, 12]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="縣市"
                                name={["basicInfo", "areaCode"]}
                                rules={[{ required: true }]}
                                initialValue={"all"}
                            >
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
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="客戶"
                                name={["basicInfo", "customer"]}
                                rules={[{ required: true }]}
                            >
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 銷售品項 */}
                <Card title="銷售品項" style={{ marginBottom: 20 }}>
                    <Form.Item label="選擇銷貨商品">
                        <Row gutter={16}>
                            <Col span={18}>
                                <Select
                                    placeholder="請選擇商品"
                                    style={{ width: "100%" }}
                                    onChange={value => setSelectedProductId(value)}
                                    options={productList.map(product => ({
                                        label: product.productName,
                                        value: product._id
                                    }))}
                                />
                            </Col>
                            <Col span={6}>
                                <Button type="primary" onClick={handleAddProduct} block>
                                    新增
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>

                    {selectedProducts.map((product) => (
                        <Card
                            key={product._id}
                            type="inner"
                            title={product.productName}
                            style={{ marginBottom: 12 }}
                            extra={
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemoveProduct(product._id)}
                                />
                            }
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="數量"
                                        name={["productSection", "products", product._id, "quantity"]}
                                        rules={[{ required: true, message: '請輸入數量' }]}
                                    >
                                        <Input type="number" min={0} placeholder="輸入數量" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="價格"
                                        name={["productSection", "products", product._id, "price"]}
                                        rules={[{ required: true, message: '請輸入價格' }]}
                                        initialValue={productList.find(p => p._id === product._id)?.retailPrice ?? 0}
                                    >
                                        <Input type="number" min={0} placeholder="輸入價格" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    ))}

                    <Form.Item label="價格備註說明" name={["productSection", "remarks"]}>
                        <Input.TextArea placeholder="價格備註說明" rows={2} allowClear />
                    </Form.Item>
                </Card>

                {/* 帳務區塊 */}
                <Card title="帳務" style={{ marginTop: 20 }}>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="付款狀態"
                                name={["billing", "paymentStatus"]}
                                rules={[{ required: true, message: '請選擇付款狀態' }]}
                                initialValue="unpaid"
                            >
                                <Radio.Group value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                                    <Space size="large">
                                        <Radio value="unpaid">未付款</Radio>
                                        <Radio value="paid">已收款</Radio>
                                        <Radio value="gift">贈送</Radio>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            {paymentStatus !== "gift" && (
                                <Form.Item
                                    label="金額是否含稅"
                                    name={["billing", "isTaxIncluded"]}
                                    rules={[{ required: true, message: '請選擇是否含稅' }]}
                                >
                                    <Radio.Group value={isTaxIncluded} onChange={(e) => setIsTaxIncluded(e.target.value)}>
                                        <Space size="large">
                                            <Radio value="excluded">未稅</Radio>
                                            <Radio value="included">含稅</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={24} md={12}>
                            {paymentStatus !== "gift" && (
                                <Form.Item
                                    label="應收金額"
                                    name={["billing", "receivableAmount"]}
                                    rules={[{ required: true, message: '請填寫應收金額' }]}
                                    initialValue={0}
                                >
                                    <Input type="number" min={0} placeholder="金額" />
                                </Form.Item>
                            )}
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            {paymentStatus !== "gift" && isTaxIncluded === "included" && (
                                <Form.Item
                                    label="發票號碼"
                                    name={["billing", "invoiceNumber"]}
                                    rules={[{ required: true, message: '請填寫發票號碼' }]}
                                >
                                    <Input placeholder="發票號碼" />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    {paymentStatus === "paid" && (
                        <>
                            <Divider style={{ margin: "0 0 22px 0" }} />

                            <Form.Item
                                label="收/匯款日"
                                name={["billing", "paymentDate"]}
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Row gutter={[16, 12]}>
                                <Col xs={24} sm={24} md={12}>
                                    <Form.Item
                                        label="收款方式"
                                        name={["billing", "paymentType"]}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            placeholder="請選擇收款方式"
                                            style={{ width: "100%" }}
                                            value={paymentType}
                                            onChange={(value) => setPaymentType(value)}
                                            options={[
                                                { label: "現金付款", value: "cash" },
                                                { label: "匯款玉山帳戶", value: "eSunBank" },
                                                { label: "匯款元大帳戶", value: "yuantaBank" },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12}>
                                    {["eSunBank", "yuantaBank"].includes(paymentType ?? '') && (
                                        <Form.Item
                                            label="匯款後五碼"
                                            name={["billing", "remitCode"]}
                                            rules={[{ required: true, message: '請輸入匯款後五碼' }]}
                                        >
                                            <Input placeholder="輸入匯款後五碼" />
                                        </Form.Item>
                                    )}
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>

                {/* 配送區塊 */}
                <Card title="運送資料" style={{ marginTop: 20 }}>
                    <Row gutter={[16, 12]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="配送方式"
                                name={["delivery", "deliveryMethod"]}
                                rules={[{ required: true }]}
                            >
                                <Select
                                    placeholder="請選擇配送方式"
                                    style={{ width: "100%" }}
                                    value={deliveryMethod}
                                    onChange={(value) => setDeliveryMethod(value)}
                                    options={[
                                        { label: "自送", value: "selfDelivery" },
                                        { label: "新竹貨運", value: "hsinchuLogistics" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12}>
                            {deliveryMethod === "hsinchuLogistics" && (
                                <Form.Item
                                    label="配送箱數"
                                    name={["delivery", "deliveryBoxes"]}
                                    rules={[{ required: true, message: '請輸入配送箱數' }]}
                                    initialValue={0}
                                >
                                    <Input type="number" min={0} placeholder="輸入配送箱數" />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>
                </Card>

                {/* 提交區塊 */}
                <Card title="提交表單" style={{ marginTop: 20 }}>
                    <Form.Item label="其他備註" name={["others", "remarks"]}>
                        <Input.TextArea placeholder="其他備註" rows={2} allowClear />
                    </Form.Item>
                    <Flex justify='space-between' align="center">
                        <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                            商品總金額: ${totalAmount.toLocaleString()}
                        </span>
                        <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
                            提交
                        </Button>
                    </Flex>
                </Card>
            </Form>
        </Spin >
    );
};

export default SalesReportForm;