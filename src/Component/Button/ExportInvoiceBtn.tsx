import { FileTextOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import { Product, SalesReport } from '../../../types';
import dayjs from 'dayjs'

interface ExportInvoiceBtnProps {
    data: SalesReport;
    productList: Product[];
}

const ExportInvoiceBtn: React.FC<ExportInvoiceBtnProps> = ({ data, productList }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const dateTitle = dayjs(data.basicInfo.purchaseDate * 1000).format('YYYY年MM月');
    const numberDate = dayjs(data.basicInfo.purchaseDate * 1000).format('YYYY/MM/DD');

    return (
        <Tooltip title="收據明細">
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <FileTextOutlined />
            </Button>
            <Modal
                centered={false}
                open={modalOpen}
                width={700}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100, minWidth: 700 }}
                footer={null}
                title="請款明細"
            >
                <Flex justify='center' style={{ width: "100%" }}>
                    <Flex vertical style={{ border: '1px solid black', padding: '10px 0', width: 650 }}>
                        <Flex vertical justify='center' align='center' style={{ width: "100%" }}>
                            <span style={{ fontSize: 24, fontWeight: 500 }}>
                                孩島計畫有限公司（望山穗）
                            </span>
                            <span style={{ fontSize: 20, fontWeight: 500 }}>
                                {dateTitle}
                            </span>
                        </Flex>
                        <Flex gap={20} style={{ padding: "0px 8px" }}>
                            <span style={{ fontSize: 16 }}>客戶編號: {data.basicInfo.customerBookkeeping}</span>
                            <span style={{ fontSize: 16 }}>應收帳款-{data.basicInfo.customerName}</span>
                        </Flex>

                        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ border: '1px solid black' }}>
                                    <th>出貨日期</th>
                                    <th>品項</th>
                                    <th>數量</th>
                                    <th>單價</th>
                                    <th>商品金額</th>
                                    <th>備註</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.productSection.products).map(([productId, productInfo]) => {
                                    const product = productList.find(p => p._id === productId);
                                    const productName = product?.productName || '未知商品';

                                    return (
                                        <tr style={{ border: '1px solid #ccc' }}>
                                            <td align='center'>{numberDate}</td>
                                            <td align='center'>{productName}</td>
                                            <td align='center'>{productInfo.quantity}</td>
                                            <td align='center'>{productInfo.price}</td>
                                            <td align='center'>{(Number(productInfo.price) * Number(productInfo.quantity)).toLocaleString()}</td>
                                            <td align='center'>{productInfo.note}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <span style={{ display: "block", textAlign: "right", fontSize: 16, padding: "0px 8px", }} >
                            應收帳款總金額: {`$${data.billing.receivableAmount?.toLocaleString() ?? "0"}`}
                        </span>

                        <div style={{ height: 30 }} />

                        <Flex style={{ padding: "0 8px" }}>
                            <Flex vertical style={{ width: "62%" }}>
                                <span style={{ fontSize: 16 }}>
                                    匯款抬頭: 孩島計畫有限公司
                                    <br />
                                    匯款銀行: 元大銀行 北投分行(806)
                                    <br />
                                    匯款帳號: 21212 0000 98889
                                    <br />
                                </span>
                            </Flex>
                            <Flex vertical style={{ width: "38%" }}>
                                <span style={{ fontSize: 16 }}>
                                    匯款日:
                                    <br />
                                    匯款金額:
                                    <br />
                                    後五碼:
                                    <br />
                                </span>
                            </Flex>
                        </Flex>

                        <span style={{ fontSize: 16, padding: "0 8px" }}>
                            註: 如蒙匯款 請
                            <span style={{ fontSize: 20, fontWeight: 550 }}>
                                備註貴寶號抬頭
                            </span>
                            及付款月份, 謝謝您
                        </span>
                    </Flex>
                </Flex>
            </Modal>
        </Tooltip>
    );
};

export default ExportInvoiceBtn;