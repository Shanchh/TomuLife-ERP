import { FileTextOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Button, Descriptions, Modal, Table, theme, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Product, SalesReport } from '../../../types';
import { TableProps } from 'antd/lib';

interface SalesReportDescriptionsBtnProps {
    data: SalesReport;
    productList: Product[];
}

const SalesReportDescriptionsBtn: React.FC<SalesReportDescriptionsBtnProps> = ({ data, productList }) => {
    const { token } = theme.useToken();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const productsObj = data.productSection.products;

    const dataSource = Object.entries(productsObj).map(([productId, info]) => ({
        productId,
        ...info,
    }));

    const productMap = productList.reduce((map, product) => {
        map[product._id] = product.productName;
        return map;
    }, {} as { [key: string]: string });

    const columns: TableProps<any>["columns"] = [
        {
            title: "商品名稱",
            dataIndex: "productId",
            key: "productId",
            render: (productId: string) => productMap[productId] || "未知商品",
        },
        {
            title: "數量",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "價格",
            dataIndex: "price",
            key: "price",
            render: (price: string) => (
                <span>${Number(price).toLocaleString()}</span>
            ),
        },
        {
            title: "品項金額",
            key: "total",
            render: (_, record) => {
                const quantity = Number(record.quantity) || 0;
                const price = Number(record.price) || 0;
                const total = quantity * price;
                return <span style={{ fontWeight: "bold", color: token.colorPrimary }}>${total.toLocaleString()}</span>;
            },
        },
    ];

    return (
        <Tooltip title="銷售商品明細">
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <FileTextOutlined />
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ShoppingOutlined />
                        <span>銷售商品明細</span>
                    </div>
                }
                open={modalOpen}
                width={500}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={null}
            >
                <Descriptions size="small" bordered column={2}>
                    <Descriptions.Item label="銷售日期" span={2}>
                        {new Date(data.basicInfo.purchaseDate * 1000).toLocaleDateString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="品項數" span={2}>
                        <span style={{ color: token.colorPrimary, fontWeight: "bold" }}>
                            {Object.keys(data.productSection.products).length}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="總金額" span={2}>
                        <span
                            style={{
                                color: (data.billing.receivableAmount ?? 0) >= 0 ? "green" : "red",
                                fontWeight: "bold",
                            }}
                        >
                            ${data.billing.receivableAmount?.toLocaleString() ?? "-"}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="價格備註" span={2}>
                        <span>{data.productSection.remarks}</span>
                    </Descriptions.Item>
                </Descriptions>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="productID"
                    size="small"
                    style={{ marginTop: 16 }}
                />
                <span style={{ color: "#999", fontSize: 12 }}>資料創建時間: {new Date(data.createdAt * 1000).toLocaleString()}</span>
            </Modal>
        </Tooltip>
    )
}

export default SalesReportDescriptionsBtn