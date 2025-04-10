import { DollarCircleOutlined, ShoppingOutlined } from '@ant-design/icons'
import { Button, Descriptions, Modal, theme, Tooltip } from 'antd'
import React, { useState } from 'react'
import { Product, SalesReport } from '../../../types';
import SalesStatusTags from '../SalesStatusTags';
import TaxBadge from '../TaxBadge';

interface SalesPaymentDetailBtnProps {
    data: SalesReport;
    productList: Product[];
}

const SalesPaymentDetailBtn: React.FC<SalesPaymentDetailBtnProps> = ({ data, productList }) => {
    const { token } = theme.useToken();
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const paymentTran = (value: string) => {
        const map: Record<string, string> = {
            cash: "現金",
            eSunBank: "玉山銀行",
            yuantaBank: "元大銀行",
        };
        return map[value] ?? "-";
    };

    return (
        <Tooltip title="銷售商品明細">
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <DollarCircleOutlined style={{ fontSize: 16, color: "#1890ff" }} />
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <ShoppingOutlined />
                        <span>付款明細</span>
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
                        <span>{new Date(data.basicInfo.purchaseDate * 1000).toLocaleDateString()}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="客戶名稱" span={1}>
                        {data.basicInfo.customerName ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="會計科目" span={1}>
                        {data.basicInfo.customerBookkeeping ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="付款狀態" span={2}>
                        <SalesStatusTags status={data.billing.paymentStatus} />
                    </Descriptions.Item>
                    <Descriptions.Item label="收/匯款日" span={2}>
                        <span>{new Date((data.billing.paymentDate ?? 0) * 1000).toLocaleDateString()}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="應收金額" span={2}>
                        <span style={{ color: "green" }}>${Number(data.billing.receivableAmount).toLocaleString()}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="是否含稅" span={1}>
                        <TaxBadge value={data.billing.isTaxIncluded} />
                    </Descriptions.Item>
                    <Descriptions.Item label="發票號碼" span={1}>
                        {data.billing.invoiceNumber ?? "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="付款方式" span={1}>
                        {paymentTran(data.billing.paymentType ?? "")}
                    </Descriptions.Item>
                    <Descriptions.Item label="後五碼" span={1}>
                        {data.billing.remitCode ?? "-"}
                    </Descriptions.Item>
                </Descriptions>

                <span style={{ color: "#999", fontSize: 12 }}>資料創建時間: {new Date(data.createdAt * 1000).toLocaleString()}</span>
            </Modal>
        </Tooltip>
    )
}

export default SalesPaymentDetailBtn