import React, { useState } from 'react'
import { PurchaseOrder, PurchaseProduct } from "../../../types";
import { Button, Flex, Table, TableProps, theme, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, FileTextOutlined } from "@ant-design/icons";
import DeleteItemBtn from "../System/DeleteItemBtn";

interface SeletcPurchaseDetailsTableProps {
    productId: string;
    productName: string;
    isLoading: boolean;
    data: PurchaseOrder[];
    handleDelete: (id: string) => void;
}

const SelectPurchaseDetailsTable: React.FC<SeletcPurchaseDetailsTableProps> = ({ productId, productName, isLoading, data, handleDelete }) => {
    const { token } = theme.useToken();

    const [pageSize, setPageSize] = useState(10);

    const columns: TableProps["columns"] = [
        {
            title: "進貨日期",
            align: "center",
            dataIndex: "purchaseAt",
            render: (date: number) => <span>{new Date(date * 1000).toLocaleDateString()}</span>,
        },
        {
            title: "商品名",
            align: "center",
            render: () => <span style={{ color: token.colorPrimary, fontWeight: "bold" }}>{productName}</span>,
        },
        {
            title: "單商品金額",
            align: "center",
            render: (record: PurchaseOrder) => {
                const amount = record.products[productId]?.itemAmount ?? 0;
                return (
                    <span style={{ color: amount >= 0 ? "green" : "red", fontWeight: "bold" }}>
                        {amount.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })}
                    </span>
                );
            },
        },
        {
            title: "進貨數(瓶)",
            align: "center",
            render: (data: PurchaseOrder) => {
                const value = data.products[productId]?.purchaseQuantityBottles ?? 0;
                return (
                    <span>{value}</span>
                );
            },
        },
        {
            title: "成本價(瓶)",
            align: "center",
            render: (data: PurchaseOrder) => {
                const value = data.products[productId]?.costPerBottle ?? 0;
                return (
                    <span>{value}</span>
                );
            },
        },
        {
            title: "進貨數(箱)",
            align: "center",
            render: (data: PurchaseOrder) => {
                const value = data.products[productId]?.purchaseQuantityBoxes ?? 0;
                return (
                    <span>{value}</span>
                );
            },
        },
        {
            title: "成本價(箱)",
            align: "center",
            render: (data: PurchaseOrder) => {
                const value = data.products[productId]?.costPerBox ?? 0;
                return (
                    <span>{value}</span>
                );
            },
        },
        {
            title: "備註說明",
            dataIndex: "remarks",
            align: "center",
        },
        {
            title: "創建者",
            align: "center",
            render: (data: PurchaseOrder) => <a>{data.creator.nickname ?? "未知"}</a>
        },
        {
            title: "操作",
            align: "center",
            render: (data: PurchaseOrder) => (
                <Flex gap={10} justify="center" align="center">
                    <Tooltip title="編輯進貨明細">
                        <Button variant="link" color="default">
                            <EditOutlined />
                        </Button>
                    </Tooltip>

                    <Tooltip title="刪除進貨明細">
                        <DeleteItemBtn type="purchase_orders" data={data} handleDelete={handleDelete} />
                    </Tooltip>
                </Flex>
            )
        }
    ];

    return (
        <Table
            tableLayout="fixed"
            scroll={{ x: "max-content" }}
            loading={isLoading}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
            pagination={{
                position: ['bottomLeft'],
                pageSize: pageSize,
                pageSizeOptions: ['10', '20', '50', '100', '9999'],
                showSizeChanger: true,
                onShowSizeChange: (_, size) => setPageSize(size),
            }}
        />
    )
}

export default SelectPurchaseDetailsTable