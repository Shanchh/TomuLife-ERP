import React, { useState } from 'react'
import { PurchaseOrder, PurchaseProduct } from "../../../types";
import { Button, Flex, Table, TableProps, theme, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, FileTextOutlined } from "@ant-design/icons";

interface PurchaseDetailsTableProps {
    isLoading: boolean;
    data: PurchaseOrder[];
}

const PurchaseDetailsTable: React.FC<PurchaseDetailsTableProps> = ({ isLoading, data }) => {
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
            title: "品項數",
            align: "center",
            dataIndex: "products",
            render: (data: PurchaseProduct[]) => (
                <span style={{ color: token.colorPrimary, fontWeight: "bold" }}>{data.length}</span>
            ),
        },
        {
            title: "進貨商品明細",
            align: "center",
            render: (data: PurchaseOrder) => (
                <Tooltip title="商品明細">
                    <Button variant="link" color="default">
                        <FileTextOutlined />
                    </Button>
                </Tooltip>
            ),
        },
        {
            title: "總金額",
            align: "center",
            dataIndex: "totalAmount",
            render: (amount: number) => (
                <span style={{ color: amount >= 0 ? "green" : "red", fontWeight: "bold" }}>
                    {amount.toLocaleString('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 })}
                </span>
            ),
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
                        <Button variant="link" color="danger">
                            <DeleteOutlined />
                        </Button>
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

export default PurchaseDetailsTable