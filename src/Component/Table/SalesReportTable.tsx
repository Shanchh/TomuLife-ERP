import React, { useState } from 'react';
import { Table, TableColumnsType, Flex, Tooltip, Modal } from 'antd';
import { SalesReport, Product, Customer } from '../../../types';
import SalesStatusTags from '../../Component/SalesStatusTags';
import SalesReportDescriptionsBtn from '../../Component/Button/SalesReportDescriptionsBtn';
import SalesPaymentDetailBtn from '../../Component/Button/SalesPaymentDetailBtn';
import TaxBadge from '../../Component/TaxBadge';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';
import ModifySalesReportBtn from '../../Component/Button/ModifySalesReportBtn';
import { locations } from '../../Constants/locations';
import ExportInvoiceBtn from '../Button/ExportInvoiceBtn';
import { TableRowSelection } from 'antd/es/table/interface';
import ExportMultipleInvoiceModal from '../ExportMultipleInvoiceModal';

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
  const [multiExportOpen, setMultiExportOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    const selectedData = data.filter((item) => newSelectedRowKeys.includes(item._id));
    const uniqueCustomers = new Set(selectedData.map((item) => item.basicInfo.customerBookkeeping));

    if (uniqueCustomers.size > 1) {
      Modal.warning({
        title: '只能選擇相同客戶的出貨單',
        content: '請重新勾選。',
      });
      return;
    }

    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<SalesReport> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: 60,
    selections: [
      Table.SELECTION_NONE,
      {
        key: 'multi-export',
        text: '批量收據明細',
        onSelect: () => {
          if (selectedRowKeys.length === 0) return;
          setMultiExportOpen(true);
        },
      },
    ],
  };
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
      title: "地區代號",
      dataIndex: ["basicInfo", "areaCode"],
      align: "center",
      render: (code: string) => locations[code]?.code + "-" + locations[code]?.name || code || "-"
    },
    {
      title: "客戶名稱",
      dataIndex: ["basicInfo", "customerName"],
      align: "center",
    },
    {
      title: "客戶編號",
      dataIndex: ["basicInfo", "customerBookkeeping"],
      align: "center",
    },
    {
      title: "商品",
      align: "center",
      render: (record) => <SalesReportDescriptionsBtn data={record} productList={productList} />,
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
      width: 100,
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
      width: 170,
      render: (record: SalesReport) => (
        <Flex gap={10} justify="center" align="center">
          <ExportInvoiceBtn data={record} productList={productList} />
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
    <>
      <Table
        rowSelection={rowSelection}
        rowKey={(record) => record._id}
        tableLayout="fixed"
        loading={loading}
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
        scroll={{ x: "max-content" }}
      />

      <ExportMultipleInvoiceModal
        open={multiExportOpen}
        onClose={() => setMultiExportOpen(false)}
        reports={data.filter((item) => selectedRowKeys.includes(item._id))}
        productList={productList}
      />
    </>
  );
};

export default SalesReportTable;