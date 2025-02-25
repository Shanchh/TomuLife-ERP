import { Button, message, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Customer } from '../../../types';
import { delete_customer } from '../../Api/AdminApi';

interface DeleteCustomerBtnProps {
    data: Customer;
    handleDeleteCustomer: (id: string) => void;
}

const DeleteCustomerBtn: React.FC<DeleteCustomerBtnProps> = ({ data, handleDeleteCustomer }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const submitDeleteRole = async () => {
        setIsLoading(true);
        try {
            await delete_customer(data._id);
            message.success("成功刪除客戶！");
            handleDeleteCustomer(data._id);
        }
        catch (error: any) {
            message.error(`刪除客戶時發生錯誤: ${error}`);
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
                        <span>刪除客戶</span>
                    </div>
                }
                open={modalOpen}
                width={300}
                onCancel={() => setModalOpen(false)}
                onOk={() => submitDeleteRole()}
                confirmLoading={isLoading}
                style={{ top: 100 }}
            >
                請確認是否將 {data.customerName} 這個客戶資料刪除？
            </Modal>
        </>
    )
}

export default DeleteCustomerBtn