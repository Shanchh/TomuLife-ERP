import { Button, message, Modal } from 'antd'
import React, { useState } from 'react'
import { DeleteOutlined } from '@ant-design/icons';
import { User } from '../../../types';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { delete_user_profile } from '../../Api/AdminApi';

interface DeleteUserBtnProps {
  data: User;
  handleDeleteUser: (id: string) => void;
}

const DeleteUserBtn: React.FC<DeleteUserBtnProps> = ({ data, handleDeleteUser }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitDeleteUser = async () => {
    setIsLoading(true);
    try {
      await delete_user_profile(data.email);
      message.success("成功刪除用戶！");
      handleDeleteUser(data._id);
    }
    catch (error: any) {
      message.error(`刪除用戶時發生錯誤: ${error}`);
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
            <span>刪除用戶</span>
          </div>
        }
        open={modalOpen}
        width={300}
        onCancel={() => setModalOpen(false)}
        onOk={() => submitDeleteUser()}
        confirmLoading={isLoading}
        style={{ top: 100 }}
      >
        請確認是否將 {data.nickname} 用戶資料刪除？
      </Modal>
    </>
  )
}

export default DeleteUserBtn