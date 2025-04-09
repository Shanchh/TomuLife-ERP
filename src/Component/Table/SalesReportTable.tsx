import React from 'react';
import { Table, TableColumnsType, Flex, Tooltip } from 'antd';
import { SalesReport, Product, Customer } from '../../../types';
import SalesStatusTags from '../../Component/SalesStatusTags';
import SalesReportDescriptionsBtn from '../../Component/Button/SalesReportDescriptionsBtn';
import SalesPaymentDetailBtn from '../../Component/Button/SalesPaymentDetailBtn';
import TaxBadge from '../../Component/TaxBadge';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';
import ModifySalesReportBtn from '../../Component/Button/ModifySalesReportBtn';

interface SalesReportTableProps {
  data: SalesReport[];
  loading: boolean;
  productList: Product[];
  customerList: Customer[];
  currentPage: number;
  currentPageSize: number;
  total: number;
  onPageChange: (page: number, pageSize: number) => void;
  refreshData: () => void;
}

const SalesReportTable: React.FC<SalesReportTableProps> = ({
  data,
  loading,
  productList,
  customerList,
  currentPage,
  currentPageSize,
  total,
  onPageChange,
  refreshData
}) => {
  const handleDelete = () => {
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
      render: (record) => <SalesReportDescriptionsBtn data={record} productList={productList} />,
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
      render: (isTaxIncluded: string) => <TaxBadge value={isTaxIncluded} />,
    },
    {
      title: "應收金額",
      dataIndex: ["billing", "receivableAmount"],
      align: "center",
      render: (amount: string) => <span style={{ color: "green" }}>${Number(amount).toLocaleString()}</span>,
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
      render: (record) => {
        return record.billing.paymentStatus === "paid" ? (
          <SalesPaymentDetailBtn data={record} productList={productList} />
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
      render: (record: SalesReport) => (
        <Flex gap={10} justify="center" align="center">
          <Tooltip title="編輯銷售明細">
            <ModifySalesReportBtn
              initialData={record}
              refreshData={refreshData}
              products={productList}
              customers={customerList}
            />
          </Tooltip>
          <Tooltip title="刪除銷售明細">
            <DeleteItemBtn type="sale_report" data={record} handleDelete={handleDelete} />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      tableLayout="fixed"
      scroll={{ x: "max-content" }}
      loading={loading}
      bordered
      columns={columns}
      dataSource={data}
      pagination={{
        current: currentPage,
        pageSize: currentPageSize,
        total,
        showSizeChanger: true,
        position: ["bottomLeft"],
        onChange: onPageChange,
      }}
    />
  );
};

export default SalesReportTable;