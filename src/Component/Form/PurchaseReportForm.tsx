import { Button, Card, Col, DatePicker, Flex, Form, Input, message, Row, Select, Spin } from 'antd';
import React, { useEffect, useState, useMemo } from 'react';
import { Product } from '../../../types';
import { get_products } from '../../Api/SystemApi';
import { purchase_orders } from "../../Api/FinanceApi";
import { useNavigate } from "react-router-dom";

const PurchaseReportForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        get_products()
            .then((value: Product[]) => setProductList(value))
            .finally(() => setIsLoading(false));
    }, []);

    const handleAddProduct = () => {
        if (!selectedProductId) return;

        const productToAdd = productList.find(p => p._id === selectedProductId);
        if (productToAdd && !selectedProducts.some(p => p._id === productToAdd._id)) {
            setSelectedProducts([...selectedProducts, productToAdd]);
            setAmounts(prev => ({ ...prev, [productToAdd._id]: 0 }));
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev => {
            const updatedProducts = prev.filter(p => p._id !== productId);

            const newProductData = updatedProducts.map((product, idx) => ({
                purchaseQuantityBottles: form.getFieldValue(["products", idx, "purchaseQuantityBottles"]) || 0,
                purchaseQuantityBoxes: form.getFieldValue(["products", idx, "purchaseQuantityBoxes"]) || 0,
            }));

            form.setFieldsValue({
                products: newProductData
            });

            return updatedProducts;
        });

        setAmounts(prev => {
            const updated = { ...prev };
            delete updated[productId];
            return updated;
        });

        const values = form.getFieldsValue();
        if (values.products) {
            const updatedProducts = values.products.filter((_: any, index: number) =>
                selectedProducts[index]._id !== productId
            );
            form.setFieldsValue({ products: updatedProducts });
        }
    };


    const handleCalculateAmount = (index: number, product: Product) => {
        const values = form.getFieldsValue();
        const bottles = parseInt(values.products?.[index]?.purchaseQuantityBottles || 0, 10);
        const boxes = parseInt(values.products?.[index]?.purchaseQuantityBoxes || 0, 10);

        const bottleAmount = product.costPerBottle ? bottles * product.costPerBottle : 0;
        const boxAmount = product.costPerBox ? boxes * product.costPerBox : 0;
        const totalAmount = bottleAmount + boxAmount;

        setAmounts(prev => ({
            ...prev,
            [product._id]: totalAmount,
        }));

        form.setFieldsValue({
            products: {
                ...values.products,
                [index]: {
                    ...values.products?.[index],
                    purchaseAmount: totalAmount,
                }
            }
        });
    };

    const totalAmount = useMemo(() => {
        return Object.values(amounts).reduce((sum, value) => sum + value, 0);
    }, [amounts]);

    const handleSubmit = async () => {
        setIsSubmitLoading(true);
        const values = form.getFieldsValue();

        if (selectedProducts.length === 0) {
            message.error("請至少選擇一個產品");
            setIsSubmitLoading(false);
            return;
        }

        const transformedData: Record<string, any> = {};
        if (values.products) {
            values.products.forEach((item: any, index: number) => {
                const product = selectedProducts[index];
                if (product) {
                    transformedData[product._id] = {
                        purchaseQuantityBottles: parseInt(item.purchaseQuantityBottles || 0, 10),
                        purchaseQuantityBoxes: parseInt(item.purchaseQuantityBoxes || 0, 10),
                    };
                }
            });
        }

        const timestamp = new Date(values.purchaseDate).getTime() / 1000;
        try {
            await purchase_orders(timestamp, transformedData, totalAmount, values.remarks || "");
            message.success("成功創建進貨訂單");
            form.resetFields();
            navigate("/finance/purchase-management/details");
        }
        catch {
            message.error("創建進貨訂單發生錯誤！");
        }
        finally {
            setIsSubmitLoading(false);
        }
    };    

    return (
        <Spin spinning={isLoading}>
            <Form size={"small"} form={form} layout="vertical" onFinish={handleSubmit}>
                <Card style={{ padding: "16px 0", marginBottom: 16, borderRadius: 8 }}>
                    <Row gutter={24}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="進貨日期"
                                name={"purchaseDate"}
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="選擇進貨產品">
                                <Row gutter={[10, 10]} align="middle" wrap>
                                    <Col span={18}>
                                        <Select
                                            placeholder="請選擇產品"
                                            style={{ width: "100%" }}
                                            onChange={value => setSelectedProductId(value)}
                                            options={productList.map(product => ({
                                                label: product.productName,
                                                value: product._id
                                            }))}
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Button type="primary" style={{ width: "100%" }} onClick={handleAddProduct}>
                                            新增
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {selectedProducts.map((product, index) => (
                    <Card key={product._id} style={{ marginBottom: 15 }}>
                        <Flex vertical gap={10}>
                            <Flex justify="space-between">
                                <span style={{ fontSize: 16, fontWeight: 'bold' }}>{product.productName}</span>
                                <Button danger size="small" onClick={() => handleRemoveProduct(product._id)}>移除</Button>
                            </Flex>
                            <Row gutter={16}>
                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item
                                        label="進貨數量 (瓶)"
                                        name={["products", index, "purchaseQuantityBottles"]}
                                        initialValue={0}
                                    >
                                        <Input
                                            type='number'
                                            min={0}
                                            style={{ width: "100%" }}
                                            disabled={product.costPerBottle === null}
                                            onChange={() => handleCalculateAmount(index, product)}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item
                                        label="進貨數量 (箱)"
                                        name={["products", index, "purchaseQuantityBoxes"]}
                                        initialValue={0}
                                    >
                                        <Input
                                            type='number'
                                            min={0}
                                            style={{ width: "100%" }}
                                            disabled={product.costPerBox === null}
                                            onChange={() => handleCalculateAmount(index, product)}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={24} md={8}>
                                    <Form.Item label="金額">
                                        <Input type='number' value={amounts[product._id] || 0} disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Flex>
                    </Card>
                ))}

                <Card style={{ marginTop: 20 }}>
                    <Form.Item
                        label="進貨備註說明"
                        name="remarks"
                    >
                        <Input.TextArea
                            placeholder="備註內容"
                            rows={3}
                            allowClear
                        />
                    </Form.Item>
                </Card>

                <Card style={{ marginTop: 20 }}>
                    <Flex justify='space-between' align="center">
                        <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                            總金額: ${totalAmount.toLocaleString()}
                        </span>
                        <Button type="primary" htmlType="submit" loading={isSubmitLoading}>提交</Button>
                    </Flex>
                </Card>
            </Form>
        </Spin>
    );
};

export default PurchaseReportForm;