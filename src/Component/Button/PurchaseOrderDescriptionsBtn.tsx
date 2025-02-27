import { FileTextOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Descriptions, Modal, theme, Tooltip, Table } from "antd";
import React, { useState } from "react";
import { PurchaseOrder, Product } from "../../../types";
import { TableProps } from "antd/lib";

interface PurchaseOrderDescriptionsBtnProps {
    data: PurchaseOrder;
    productList: Product[];
}

const PurchaseOrderDescriptionsBtn: React.FC<PurchaseOrderDescriptionsBtnProps> = ({ data, productList }) => {
    const { token } = theme.useToken();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const productMap = productList.reduce((map, product) => {
        map[product._id] = product.productName;
        return map;
    }, {} as { [key: string]: string });

    const columns: TableProps["columns"] = [
        {
            title: "商品名稱",
            dataIndex: "productID",
            key: "productID",
            render: (productID: string) => productMap[productID] || "未知商品",
        },
        {
            title: "數量(瓶)",
            dataIndex: "purchaseQuantityBottles",
            key: "purchaseQuantityBottles",
            align: "right",
            render: (text: number) => <Tooltip title={text}>{text.toLocaleString()}</Tooltip>,
        },
        {
            title: "單價(瓶)",
            dataIndex: "costPerBottle",
            key: "costPerBottle",
            align: "right",
            render: (text: number) => `$${text.toLocaleString()}`,
        },
        {
            title: "數量(箱)",
            dataIndex: "purchaseQuantityBoxes",
            key: "purchaseQuantityBoxes",
            align: "right",
            render: (text: number) => <Tooltip title={text}>{text.toLocaleString()}</Tooltip>,
        },
        {
            title: "單價(箱)",
            dataIndex: "costPerBox",
            key: "costPerBox",
            align: "right",
            render: (text: number) => `$${text.toLocaleString()}`,
        },
        {
            title: "小計",
            dataIndex: "itemAmount",
            key: "itemAmount",
            align: "right",
            render: (text: number) => <span style={{ fontWeight: "bold", color: token.colorPrimary }}>${text.toLocaleString()}</span>,
        },
    ];

    const productData = Object.keys(data.products).map((productID) => ({
        ...data.products[productID],
        productID,
    }));

    return (
        <Tooltip title="進貨商品明細">
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <FileTextOutlined />
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ShoppingOutlined />
                        <span>進貨商品明細</span>
                    </div>
                }
                open={modalOpen}
                width={500}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={null}
            >
                <Descriptions size="small" bordered column={2}>
                    <Descriptions.Item label="進貨日期" span={2}>
                        {new Date(data.purchaseAt * 1000).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="品項數" span={2}>
                        <span style={{ color: token.colorPrimary, fontWeight: "bold" }}>
                            {Object.keys(data.products).length}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="總金額" span={2}>
                        <span style={{ color: data.totalAmount >= 0 ? "green" : "red", fontWeight: "bold" }}>${data.totalAmount.toLocaleString()}</span>
                    </Descriptions.Item>
                </Descriptions>

                <Table
                    columns={columns}
                    dataSource={productData}
                    pagination={false}
                    rowKey="productID"
                    size="small"
                    style={{ marginTop: 16 }}
                />
                <span style={{ color: "#999", fontSize: 12 }}>資料創建時間: {new Date(data.createdAt * 1000).toLocaleString()}</span>
            </Modal>
        </Tooltip>
    );
};

export default PurchaseOrderDescriptionsBtn;
