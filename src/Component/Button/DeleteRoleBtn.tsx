import { Button, message, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Role } from '../../../types';
import { delete_role } from '../../Api/AdminApi';

interface DeleteRoleBtnProps {
    data: Role;
    handleDeleteRole: (id: string) => void;
}

const DeleteRoleBtn: React.FC<DeleteRoleBtnProps> = ({ data, handleDeleteRole }) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const submitDeleteRole = async () => {
        setIsLoading(true);
        try {
            await delete_role(data._id);
            message.success("成功刪除角色！");
            handleDeleteRole(data._id);
        }
        catch (error: any) {
            message.error(`刪除角色時發生錯誤: ${error}`);
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
                        <span>刪除角色</span>
                    </div>
                }
                open={modalOpen}
                width={300}
                onCancel={() => setModalOpen(false)}
                onOk={() => submitDeleteRole()}
                confirmLoading={isLoading}
                style={{ top: 100 }}
            >
                請確認是否將 {data.tag} 這個角色刪除？
            </Modal>
        </>
    )
}

export default DeleteRoleBtn