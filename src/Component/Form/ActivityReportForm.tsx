import {
  Button, Card, Col, DatePicker, Divider, Flex, Form, Input, InputNumber,
  message,
  Row, Spin, Table, Typography
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_products } from '../../Api/SystemApi';
import FinanceItemsCard from '../Card/FinanceItemsCard';
import { add_activity_detail } from '../../Api/FinanceApi';

const { Title } = Typography;

interface Product {
  _id: string;
  productName: string;
  retailPrice: number;
}

const ActivityReportForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);

  const [total, setTotal] = useState<number>(0);
  const [cost, setCost] = useState<number>(0);
  const [manualIncomeTotal, setManualIncomeTotal] = useState<number>(0);
  const [manualExpenseTotal, setManualExpenseTotal] = useState<number>(0);

  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await get_products();
    setProducts(data);
    setIsLoading(false);
  };

  const calcTotal = () => {
    const salesObj = form.getFieldValue('sales') || {};
    const totalPrice = products.reduce((sum, product) => {
      const item = salesObj[product._id] || {};
      const quantity = item.quantity || 0;
      const discountAmount = item.discountAmount || 0;
      const subtotal = (quantity * product.retailPrice) + discountAmount;
      return sum + subtotal;
    }, 0);

    setTotal(totalPrice);
  };

  const calcCost = () => {
    const costObj = form.getFieldValue('costs') || {};
    const totalCost = products.reduce((sum, product) => {
      const item = costObj[product._id] || {};
      const unitCost = item.unitCost || 0;
      const sold = item.soldTotal || 0;
      const tasting = item.tastingQty || 0;
      const gift = item.giftQty || 0;
      const totalQty = sold + tasting + gift;
      return sum + (totalQty * unitCost);
    }, 0);

    setCost(totalCost);
  };

  const calcSalesFields = (allValues: any) => {
    const sales = allValues.sales || {};
    const updatedSales = { ...sales };

    products.forEach((product) => {
      const item = sales[product._id] || {};
      const quantity = item.quantity || 0;
      const discountQty = item.discountQty || 0;
      const trialQty = item.trialQty || 0;
      const discountAmount = item.discountAmount || 0;
      const gift = item.giftQty || 0;

      const totalQty = quantity + discountQty + trialQty + gift;
      const totalPrice = quantity * product.retailPrice + discountAmount;

      updatedSales[product._id] = {
        ...item,
        totalQty,
        totalPrice,
      };
    });

    form.setFieldsValue({ sales: updatedSales });
    calcTotal();
  };

  const calcCostFields = (allValues: any) => {
    const costs = allValues.costs || {};
    const updatedCosts = { ...costs };

    products.forEach((product) => {
      const item = costs[product._id] || {};
      const sold = item.soldTotal || 0;
      const tasting = item.tastingQty || 0;
      const gift = item.giftQty || 0;
      const unitCost = item.unitCost || 0;

      const totalQty = sold + tasting + gift;
      const totalCost = totalQty * unitCost;

      updatedCosts[product._id] = {
        ...item,
        totalQty,
        totalCost,
      };
    });

    form.setFieldsValue({ costs: updatedCosts });
    calcCost();
  };

  const handleFormChange = (_: any, allValues: any) => {
    calcSalesFields(allValues);
    calcCostFields(allValues);

    const incomes = allValues.incomes || [];
    const expenses = allValues.expenses || [];

    const incomeSum = incomes.reduce((sum: number, item: any) => sum + (item?.amount || 0), 0);
    const expenseSum = expenses.reduce((sum: number, item: any) => sum + (item?.amount || 0), 0);

    setManualIncomeTotal(incomeSum);
    setManualExpenseTotal(expenseSum);
  };

  const columns = [
    { title: '品項', dataIndex: 'productName', width: 130 },
    { title: '單價', dataIndex: 'retailPrice', render: (price: number) => `$${price}`, width: 65 },
    {
      title: '銷售數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'quantity']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 120
    },
    {
      title: '折扣數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'discountQty']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 120
    },
    {
      title: '折扣金額',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'discountAmount']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 120
    },
    {
      title: '試飲數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'trialQty']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 120
    },
    {
      title: '贈送數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'giftQty']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 120
    },
    {
      title: '合計數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'totalQty']} noStyle initialValue={0} rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber disabled style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 100
    },
    {
      title: '合計價格',
      render: (_: any, record: Product) => (
        <Form.Item name={['sales', record._id, 'totalPrice']} noStyle initialValue={0} rules={[{ required: true, message: '請輸入數字' }]}>
          <Input disabled style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 100
    }
  ];

  const columns2 = [
    { title: '品項', dataIndex: 'productName', width: 130 },
    {
      title: '產品成本(含盒裝)',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'unitCost']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      ),
      width: 160
    },
    {
      title: '販賣總數',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'soldTotal']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      ),
      width: 130
    },
    {
      title: '試飲數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'tastingQty']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      ),
      width: 130
    },
    {
      title: '贈送數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'giftQty']} initialValue={0} noStyle rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber min={0} style={{ width: 120 }} />
        </Form.Item>
      ),
      width: 130
    },
    {
      title: '總數量',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'totalQty']} noStyle initialValue={0} rules={[{ required: true, message: '請輸入數字' }]}>
          <InputNumber disabled style={{ width: 100 }} />
        </Form.Item>
      ),
      width: 100
    },
    {
      title: '成本試算',
      render: (_: any, record: Product) => (
        <Form.Item name={['costs', record._id, 'totalCost']} noStyle initialValue={0} rules={[{ required: true, message: '請輸入數字' }]}>
          <Input disabled style={{ width: 140 }} />
        </Form.Item>
      ),
      width: 140
    }
  ];

  const handleSubmit = async () => {
    setIsSubmitLoading(true);
    const values = form.getFieldsValue();
  
    const incomes = values.incomes || [];
    const expenses = values.expenses || [];
  
    const totalProductRevenue = total;
    const totalProductCost = cost;
    const totalManualIncome = incomes.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const totalManualExpense = expenses.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  
    const time = {
      ...values.time,
      activityStartAt: values.time?.activityStartAt ? Math.floor(values.time.activityStartAt.valueOf() / 1000) : null,
      activityEndAt: values.time?.activityEndAt ? Math.floor(values.time.activityEndAt.valueOf() / 1000) : null,
    };
  
    const result = {
      ...values,
      time,
      summary: {
        totalProductRevenue,
        totalProductCost,
        totalManualIncome,
        totalManualExpense,
      },
    };
  
    try {
      await add_activity_detail(result);
      message.success("成功創建活動明細");
  
      form.resetFields();
      navigate("/finance/activity-management/overview");
    } catch {
      message.error("活動明細處理時發生錯誤！");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Title level={3} style={{ marginTop: 0, marginBottom: 20 }}>
        🏷️ 新增活動明細
      </Title>
      <Form
        size="small"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFormChange}
      >
        <Card title="活動基本資訊">
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Flex align="center" style={{ width: "100%" }} gap={16}>
                <Form.Item
                  label="活動開始日期"
                  name={["time", "activityStartAt"]}
                  rules={[{ required: true }]}
                  style={{ width: "100%" }}
                >
                  <DatePicker placeholder="請選擇" style={{ width: "100%" }} inputReadOnly />
                </Form.Item>
                <span>~</span>
                <Form.Item
                  label="活動結束日期"
                  name={["time", "activityEndAt"]}
                  rules={[{ required: true }]}
                  style={{ width: "100%" }}
                >
                  <DatePicker placeholder="請選擇" style={{ width: "100%" }} inputReadOnly />
                </Form.Item>
              </Flex>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label="活動名稱"
                name={"activityName"}
                rules={[{ required: true }]}
                style={{ width: "100%" }}
              >
                <Input placeholder="請填寫活動名稱" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="銷售明細" style={{ marginTop: 20 }}>
          <Table columns={columns} dataSource={products} rowKey="_id" pagination={false} scroll={{ x: "max-content" }} />
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Title level={5}>總收入：${total.toLocaleString()}</Title>
          </div>
        </Card>

        <Card title="成本明細" style={{ marginTop: 20 }}>
          <Table columns={columns2} dataSource={products} rowKey="_id" pagination={false} scroll={{ x: "max-content" }} />
          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Title level={5}>總成本：${cost.toLocaleString()}</Title>
          </div>
        </Card>

        <FinanceItemsCard title="銷售收入紀錄" fieldName="incomes" />
        <FinanceItemsCard title="開支項目紀錄" fieldName="expenses" />

        <Card title="報表總結" style={{ marginTop: 20 }}>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <strong>商品總收入：</strong>
              <span style={{ color: 'green', fontWeight: 'bold' }}>
                ${total.toLocaleString()}
              </span>
            </Col>
            <Col span={12}>
              <strong>商品總成本：</strong>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                ${cost.toLocaleString()}
              </span>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          <Row gutter={[16, 8]}>
            <Col span={12}>
              <strong>銷售收入紀錄總和：</strong>
              <span style={{ color: 'green', fontWeight: 'bold' }}>
                ${manualIncomeTotal.toLocaleString()}
              </span>
            </Col>
            <Col span={12}>
              <strong>開支項目紀錄總和：</strong>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                ${manualExpenseTotal.toLocaleString()}
              </span>
            </Col>
          </Row>

          <Flex justify="end" style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit" loading={isSubmitLoading}>提交</Button>
          </Flex>
        </Card>
      </Form>
    </Spin>
  );
};

export default ActivityReportForm;