import { Button, message, Modal } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { delete_customer, delete_product, delete_role, delete_user_profile } from '../../Api/AdminApi';

type ItemType = 'customer' | 'role' | 'user' | 'product';

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