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
                title="發票"
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
                            <span style={{ fontSize: 16 }}>會計科目: {data.basicInfo.customerBookkeeping}</span>
                            <span style={{ fontSize: 16 }}>應收帳款-{data.basicInfo.customerName}</span>
                        </Flex>

                        <Flex style={{ width: '100%', borderTop: '2px solid black', borderBottom: '2px solid black' }}>
                            <span style={{ width: 100, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
                                出貨日期
                            </span>
                            <span style={{ flex: 1, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
                                品項
                            </span>
                            <span style={{ width: 100, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
                                數量
                            </span>
                            <span style={{ width: 130, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
                                金額(未稅)
                            </span>
                            <span style={{ width: 130, fontSize: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                備註
                            </span>
                        </Flex>

                        {Object.entries(data.productSection.products).map(([productId, productInfo]) => {
                            const product = productList.find(p => p._id === productId);
                            const productName = product?.productName || '未知商品';

                            return (
                                <Flex key={productId} style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
                                    <span style={{ width: 100, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #eee' }}>
                                        {numberDate}
                                    </span>
                                    <span style={{ flex: 1, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #eee' }}>
                                        {productName}
                                    </span>
                                    <span style={{ width: 100, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #eee' }}>
                                        {productInfo.quantity}
                                    </span>
                                    <span style={{ width: 130, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #eee' }}>
                                        {(Number(productInfo.price) * Number(productInfo.quantity)).toLocaleString()}
                                    </span>
                                    <span style={{ width: 130 }} />
                                </Flex>
                            );
                        })}

                        <Flex style={{ width: "100%", borderTop: '2px solid black' }}>
                            <span style={{ width: 387, fontSize: 16, display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                應該帳款總金額:
                            </span>
                            <span style={{ width: 130, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {`$${data.billing.receivableAmount?.toLocaleString() ?? '0'}`}
                            </span>
                            <span style={{ width: 130 }} />
                        </Flex>

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