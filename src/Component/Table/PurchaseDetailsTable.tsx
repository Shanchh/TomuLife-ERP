import React, { useState } from 'react'
import { Product, PurchaseOrder, PurchaseProduct } from "../../../types";
import { Button, Flex, Table, TableProps, theme, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import PurchaseOrderDescriptionsBtn from "../Button/PurchaseOrderDescriptionsBtn";
import DeleteItemBtn from "../System/DeleteItemBtn";

interface PurchaseDetailsTableProps {
    isLoading: boolean;
    data: PurchaseOrder[];
    productList: Product[];
    handleDelete: (id: string) => void;
}

const PurchaseDetailsTable: React.FC<PurchaseDetailsTableProps> = ({ isLoading, data, productList, handleDelete }) => {
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
            render: (products: { [productId: string]: PurchaseProduct }) => {
                const productCount = Object.keys(products).length;
                return (
                    <span style={{ color: token.colorPrimary, fontWeight: "bold" }}>
                        {productCount}
                    </span>
                );
            },
        },
        {
            title: "進貨商品明細",
            align: "center",
            render: (data: PurchaseOrder) => (
                <PurchaseOrderDescriptionsBtn data={data} productList={productList}/>
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

export default PurchaseDetailsTable