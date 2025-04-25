import { Button, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { delete_customer, delete_product, delete_role, delete_user_profile } from '../../Api/SystemApi';
import { delete_activity_detail, delete_purchase_orders, delete_sales_report } from "../../Api/FinanceApi";

type ItemType = 'customer' | 'role' | 'user' | 'product' | 'purchase_orders' | 'sale_report' | 'activity_detail';

interface DeleteItemBtnProps<T> {
    type: ItemType;
    data: T;
    handleDelete: (id: string) => void;
}

const DeleteItemBtn = <T extends { _id: string } & Record<string, any>>({ type, data, handleDelete }: DeleteItemBtnProps<T>) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getDeleteConfig = () => {
        switch (type) {
            case 'customer':
                return {
                    api: () => delete_customer(data._id),
                    message: `請確認是否將 ${data.customerName} 這個客戶資料刪除？`,
                    successMsg: '成功刪除客戶！',
                    title: '刪除客戶'
                };
            case 'role':
                return {
                    api: () => delete_role(data._id),
                    message: `請確認是否將 ${data.tag} 這個角色刪除？`,
                    successMsg: '成功刪除角色！',
                    title: '刪除角色'
                };
            case 'user':
                return {
                    api: () => delete_user_profile(data.email),
                    message: `請確認是否將 ${data.nickname} 用戶資料刪除？`,
                    successMsg: '成功刪除用戶！',
                    title: '刪除用戶'
                };
            case 'product':
                return {
                    api: () => delete_product(data._id),
                    message: `請確認是否將 ${data.productName} 這個商品刪除？`,
                    successMsg: '成功刪除商品！',
                    title: '刪除商品'
                };
            case 'purchase_orders':
                return {
                    api: () => delete_purchase_orders(data._id),
                    message: `請確認是否將這筆總金額為 ${data.totalAmount} 的資料刪除？`,
                    successMsg: '成功刪除進貨明細！',
                    title: '刪除進貨明細'
                };
            case 'sale_report':
                return {
                    api: () => delete_sales_report(data._id),
                    message: (
                        <span>
                            請確認是否將這筆日期為
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                {new Date(data.basicInfo.purchaseDate * 1000).toLocaleDateString()}
                            </span>
                            ，金額為
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                ${Number(data.billing.receivableAmount).toLocaleString()}
                            </span>
                            的銷售明細刪除？
                        </span>
                    ),
                    successMsg: '成功刪除銷售明細！',
                    title: '刪除銷售明細'
                };
            case 'activity_detail':
                return {
                    api: () => delete_activity_detail(data._id),
                    message: `請確認是否將這筆活動名稱為 ${data.activityName} 的資料刪除？`,
                    successMsg: '成功刪除活動明細！',
                    title: '刪除活動明細'
                };
            default:
                throw new Error('未知類型');
        }
    };

    const { api, message: confirmMessage, successMsg, title } = getDeleteConfig();

    const submitDelete = async () => {
        setIsLoading(true);
        try {
            await api();
            message.success(successMsg);
            handleDelete(data._id);
        }
        catch (error: any) {
            message.error(`刪除時發生錯誤: ${error}`);
        }
        finally {
            setModalOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button variant="link" color="danger" onClick={() => setModalOpen(true)}>
                <DeleteOutlined />
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ExclamationCircleOutlined style={{ color: 'orange' }} />
                        <span>{title}</span>
                    </div>
                }
                open={modalOpen}
                width={300}
                onCancel={() => setModalOpen(false)}
                onOk={submitDelete}
                confirmLoading={isLoading}
                style={{ top: 100 }}
            >
                {confirmMessage}
            </Modal>
        </>
    );
};

export default DeleteItemBtn;