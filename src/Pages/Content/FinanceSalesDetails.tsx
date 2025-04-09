import React, { useEffect, useState } from 'react'
import { Customer, Product, SalesReport } from '../../../types'
import { get_sales_report } from '../../Api/FinanceApi';
import { Button, Card, Col, DatePicker, Divider, Flex, Form, Input, message, Radio, Row, Select } from 'antd';
import { DownOutlined, ReloadOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import { get_customers, get_products } from '../../Api/SystemApi';
import { locations } from '../../Constants/locations';
import SalesReportTable from '../../Component/Table/SalesReportTable';

const FinanceSalesDetails = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [salesReportData, setSalesReportData] = useState<SalesReport[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentDataTotal, setCurrentDataTotal] = useState(0);

  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState({});

  const [productList, setProductList] = useState<Product[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  const [areaCodeValue, setAreaCodeValue] = useState<string>("all");
  const [areaCustomers, setAreaCustomers] = useState<Customer[]>([]);

  const handleToggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  }

  const refreshData = () => {
    setIsLoading(true);
    get_sales_report(currentPage, currentPageSize, searchQuery)
      .then((res) => {
        setSalesReportData(res.data);
        setCurrentDataTotal(res.total);
      })
      .finally(() => setIsLoading(false));
  }

  const initPage = async () => {
    setIsLoading(true);
    try {
      const products = await get_products();
      const customers = await get_customers();

      setProductList(products);
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
    refreshData();
  }, [currentPage, currentPageSize, currentDataTotal, searchQuery]);

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
  
  const onFormSubmit = () => {
    const query = form.getFieldsValue();
    console.log(query);
  };

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Form
        form={form}
        name="salesReport_search"
        style={{ width: "100%", marginBottom: 16 }}
        onFinish={onFormSubmit}
        onValuesChange={(changed, all) => console.log("目前值:", all)} // 可移除，用於 debug
      >
        <Row justify="start" gutter={[18, 18]}>
          <Col>
            <Flex align="center" gap={10}>
              <span style={{ whiteSpace: "nowrap" }}>選擇月分:</span>
              <Form.Item name="monthSelect" noStyle>
                <DatePicker
                  picker="month"
                  format="YYYY-MM"
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Flex>
          </Col>

          <Col>
            <Form.Item name="paymentStatus" initialValue="all">
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>銷售狀態:</span>
                <Radio.Group>
                  <Radio.Button value="all">全選</Radio.Button>
                  <Radio.Button value="unpaid">未付款</Radio.Button>
                  <Radio.Button value="paid">已收款</Radio.Button>
                  <Radio.Button value="gift">贈送</Radio.Button>
                </Radio.Group>
              </Flex>
            </Form.Item>
          </Col>

          <Col>
            <Flex justify="start" align="center" gap={10}>
              <span style={{ whiteSpace: "nowrap" }}>搜尋客戶:</span>

              <Form.Item name="areaCode" noStyle>
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
            <Flex justify="start" align="center" gap={10}>
              <span style={{ whiteSpace: "nowrap" }}>搜尋商品:</span>
              <Form.Item name="productSelect" noStyle>
                <Select
                  placeholder="請選擇商品"
                  style={{ width: 220 }}
                  options={productList.map(product => ({
                    label: product.productName,
                    value: product._id
                  }))}
                />
              </Form.Item>
            </Flex>
          </Col>
        </Row>

        {
          isCollapsed == false &&
          <>
            <Divider style={{ margin: "16px 0" }}>
              <span style={{ color: "#999", fontSize: 15 }}>進階搜尋</span>
            </Divider>

            <Row justify="start" gutter={[18, 18]}>
              <Col>
                <Form.Item name="accountingSubject">
                  <Flex justify="start" align="center" gap={10}>
                    <span style={{ whiteSpace: "nowrap" }}>會計科目:</span>
                    <Input placeholder="請輸入會計科目" style={{ width: 175 }} />
                  </Flex>
                </Form.Item>
              </Col>

              <Col>
                <Flex justify="start" align="center" gap={10}>
                  <span style={{ whiteSpace: "nowrap" }}>是否含稅:</span>
                  <Form.Item name="isTaxIncluded" noStyle>
                    <Select
                      placeholder="請選擇是否含稅"
                      style={{ width: 175 }}
                      options={[
                        { label: "含稅", value: "included" },
                        { label: "未稅", value: "excluded" }
                      ]}
                    />
                  </Form.Item>
                </Flex>
              </Col>

              <Col>
                <Flex justify="start" align="center" gap={10}>
                  <span style={{ whiteSpace: "nowrap" }}>付款方式:</span>
                  <Form.Item name="paymentType" noStyle>
                    <Select
                      placeholder="請選擇付款方式"
                      style={{ width: 175 }}
                      options={[
                        { label: "現金", value: "cash" },
                        { label: "玉山銀行", value: "eSunBank" },
                        { label: "元大銀行", value: "yuantaBank" }
                      ]}
                    />
                  </Form.Item>
                </Flex>
              </Col>

              <Col>
                <Form.Item name="remitCode">
                  <Flex justify="start" align="center" gap={10}>
                    <span style={{ whiteSpace: "nowrap" }}>匯款後5碼:</span>
                    <Input placeholder="請輸入匯款後5碼" style={{ width: 175 }} />
                  </Flex>
                </Form.Item>
              </Col>
            </Row>

            <Row justify="start" gutter={[18, 18]} style={{ marginTop: 18 }}>
              <Col>
                <Form.Item name="invoiceNumber">
                  <Flex justify="start" align="center" gap={10}>
                    <span style={{ whiteSpace: "nowrap" }}>發票號碼:</span>
                    <Input placeholder="請輸入發票號碼" style={{ width: 175 }} />
                  </Flex>
                </Form.Item>
              </Col>

              <Col>
                <Flex justify="start" align="center" gap={10}>
                  <span style={{ whiteSpace: "nowrap" }}>配送方式:</span>
                  <Form.Item name="deliveryMethod" noStyle>
                    <Select
                      placeholder="請選擇配送方式"
                      style={{ width: 175 }}
                      options={[
                        { label: "自送", value: "selfDelivery" },
                        { label: "新竹貨運", value: "hsinchuLogistics" }
                      ]}
                    />
                  </Form.Item>
                </Flex>
              </Col>
            </Row>
          </>
        }

        <Flex justify="end" style={{ paddingTop: 10 }} gap={10}>
          {
            isCollapsed ?
              <a onClick={handleToggleCollapsed}>展開搜尋列&nbsp;<DownOutlined /></a>
              :
              <a onClick={handleToggleCollapsed}>收起搜尋列&nbsp;<UpOutlined /></a>
          }
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
            條件查詢
          </Button>
          <Button type="default">
            清除條件
          </Button>
        </Flex>
      </Form>

      <Flex style={{ marginBottom: 15 }} gap={15}>
        <Button variant="text" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>
      </Flex>

      <SalesReportTable
        data={salesReportData}
        loading={isLoading}
        productList={productList}
        customerList={customerList}
        currentPage={currentPage}
        currentPageSize={currentPageSize}
        total={currentDataTotal}
        onPageChange={(page, pageSize) => {
          setCurrentPage(page);
          setCurrentPageSize(pageSize);
        }}
        refreshData={refreshData}
      />
    </Card>
  )
}

export default FinanceSalesDetails