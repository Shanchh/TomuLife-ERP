import React, { useEffect, useState } from 'react'
import { Customer, Product, SalesReport } from '../../../types'
import { get_sales_report } from '../../Api/FinanceApi';
import { Button, Card, Col, Flex, Form, message, Radio, Row, Select, Table, TableColumnsType, Tooltip } from 'antd';
import SalesStatusTags from '../../Component/SalesStatusTags';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import SalesReportDescriptionsBtn from '../../Component/Button/SalesReportDescriptionsBtn';
import { get_customers, get_products } from '../../Api/SystemApi';
import SalesPaymentDetailBtn from '../../Component/Button/SalesPaymentDetailBtn';
import TaxBadge from '../../Component/TaxBadge';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';
import ModifySalesReportBtn from '../../Component/Button/ModifySalesReportBtn';

const FinanceSalesDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [salesReportData, setSalesReportData] = useState<SalesReport[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentDataTotal, setCurrentDataTotal] = useState(0);

  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState({});

  const [productList, setProductList] = useState<Product[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);

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

  const handleDelete = async (_: any) => {
    refreshData();
  };

  const columns: TableColumnsType<SalesReport> = [
    {
      title: "狀態",
      align: "center",
      render: (_, record) => (
        <SalesStatusTags status={record.billing.paymentStatus} />
      ),
    },
    {
      title: "銷售日期",
      dataIndex: ["basicInfo", "purchaseDate"],
      align: "center",
      render: (timestamp: number) => (
        <span>{new Date(timestamp * 1000).toLocaleDateString()}</span>
      ),
    },
    {
      title: "客戶名稱",
      dataIndex: ["basicInfo", "customerName"],
      align: "center",
    },
    {
      title: "會計科目",
      dataIndex: ["basicInfo", "customerBookkeeping"],
      align: "center",
    },
    {
      title: "商品",
      align: "center",
      render: (data: SalesReport) => <SalesReportDescriptionsBtn data={data} productList={productList} />
    },
    {
      title: "價格備註",
      dataIndex: ["productSection", "remarks"],
      align: "center",
      render: (text: string) => text?.trim() ? text : "-"
    },
    {
      title: "是否含稅",
      dataIndex: ["billing", "isTaxIncluded"],
      align: "center",
      render: (isTaxIncluded: string) => <TaxBadge value={isTaxIncluded} />
    },
    {
      title: "應收金額",
      dataIndex: ["billing", "receivableAmount"],
      align: "center",
      render: (receivableAmount: string) => <span style={{ color: "green" }}>${Number(receivableAmount).toLocaleString()}</span>
    },
    {
      title: "發票號碼",
      dataIndex: ["billing", "invoiceNumber"],
      align: "center",
      render: (text: string) => text?.trim() ? text : "-"
    },
    {
      title: "配送",
      dataIndex: "delivery",
      align: "center",
      render: (delivery: any) => {
        const methodLabel = delivery?.deliveryMethod === "hsinchuLogistics" ? "新竹貨運" : "自送";
        const boxes = delivery?.deliveryBoxes ?? "-";
        return `${methodLabel} (${boxes}箱)`;
      },
    },
    {
      title: "付款明細",
      align: "center",
      render: (data: SalesReport) => {
        return data.billing.paymentStatus === "paid" ? (
          <SalesPaymentDetailBtn data={data} productList={productList} />
        ) : (
          "-"
        );
      },
    },
    {
      title: "備註",
      dataIndex: ["others", "remarks"],
      align: "center",
      render: (text: string) => text?.trim() ? text : "-"
    },
    {
      title: "操作",
      align: "center",
      render: (data: SalesReport) => (
        <Flex gap={10} justify="center" align="center">
          <Tooltip title="編輯銷售明細">
            <ModifySalesReportBtn initialData={data} refreshData={refreshData} products={productList} customers={customerList}/>
          </Tooltip>

          <Tooltip title="刪除銷售明細">
            <DeleteItemBtn type="sale_report" data={data} handleDelete={handleDelete} />
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Form
        form={form}
        name="salesReport_search"
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Row justify="start" gutter={[18, 18]}>
          <Col>
            <Form.Item name="paymentStatus" initialValue={'all'}>
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>銷售狀態:</span>
                <Radio.Group defaultValue="all">
                  <Radio.Button value="all">全選</Radio.Button>
                  <Radio.Button value="unpaid">未付款</Radio.Button>
                  <Radio.Button value="paid">已收款</Radio.Button>
                  <Radio.Button value="gift">贈送</Radio.Button>
                </Radio.Group>
              </Flex>
            </Form.Item>
          </Col>

          <Col>
            <Form.Item>
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>搜尋客戶:</span>
                <Select
                  size="middle"
                  defaultValue="none"
                  style={{ width: 120 }}
                />

                <Select
                  size="middle"
                  defaultValue="none"
                  style={{ width: 128 }}
                />
              </Flex>
            </Form.Item>
          </Col>
        </Row>

        <Flex justify="end" style={{ paddingTop: 10 }} gap={10}>
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

      <Table
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        loading={isLoading}
        bordered={true}
        columns={columns}
        dataSource={salesReportData}
        pagination={{
          current: currentPage,
          pageSize: currentPageSize,
          total: currentDataTotal,
          showSizeChanger: true,
          position: ["bottomLeft"],
          onChange(page, pageSize) {
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
          },
        }}
      />
    </Card>
  )
}

export default FinanceSalesDetails