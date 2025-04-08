import React, { useEffect, useState } from 'react'
import { Product, SalesReport } from '../../../types'
import { get_sales_report } from '../../Api/FinanceApi';
import { Button, Card, Flex, Form, Table, TableColumnsType, Tooltip } from 'antd';
import SalesStatusTags from '../../Component/SalesStatusTags';
import {ReloadOutlined } from '@ant-design/icons';
import SalesReportDescriptionsBtn from '../../Component/Button/SalesReportDescriptionsBtn';
import { get_products } from '../../Api/SystemApi';
import SalesPaymentDetailBtn from '../../Component/Button/SalesPaymentDetailBtn';
import TaxBadge from '../../Component/TaxBadge';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';

const FinanceSalesDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [salesReportData, setSalesReportData] = useState<SalesReport[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [currentDataTotal, setCurrentDataTotal] = useState(0);

  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState({});

  const [productList, setProductList] = useState<Product[]>([]);

  const refreshData = () => {
    setIsLoading(true);
    get_sales_report(currentPage, currentPageSize, searchQuery)
      .then((res) => {
        setSalesReportData(res.data);
        setCurrentDataTotal(res.total);
      })
      .finally(() => setIsLoading(false));
  }

  const initPage = () => {
    get_products()
      .then((value: Product[]) => setProductList(value))
      .finally(() => setIsLoading(false));
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
            11
          </Tooltip>

          <Tooltip title="刪除銷售明細">
            <DeleteItemBtn type="sale_report" data={data} handleDelete={handleDelete}/>
          </Tooltip>
        </Flex>
      )
    }
  ];

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>

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