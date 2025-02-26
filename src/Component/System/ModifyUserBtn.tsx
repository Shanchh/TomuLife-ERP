import { Button, Modal, Form, Input, Select, message } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { Role, User } from '../../../types';
import axios from "axios";

interface ModifyUserBtnProps {
    data: User;
    roleData: Role[];
    handleModifyUser: (id: string, data: { nickname: string; role: string }) => void;
}

const ModifyUserBtn: React.FC<ModifyUserBtnProps> = ({ data, roleData, handleModifyUser }) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitLoading(true);

            await axios.post("/system/modify_user_profile", {
                data: values,
                uid: data._id
            });

            message.success("更新資料成功");
            setModalOpen(false);
            handleModifyUser(data._id, values);
        } catch (error) {
            message.error("更新資料時出錯");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            <Button variant="link" color="default" onClick={() => setModalOpen(true)}>
                <EditOutlined />
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserOutlined />
                        <span>用戶資料</span>
                    </div>
                }
                open={modalOpen}
                width={400}
                onCancel={() => setModalOpen(false)}
                style={{ top: 100 }}
                footer={[
                    <Button key="cancel" onClick={() => setModalOpen(false)}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" loading={submitLoading} onClick={handleSubmit}>
                        確認
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        nickname: data.nickname,
                        role: data.role
                    }}
                >
                    <Form.Item label="信箱">
                        <Input defaultValue={data.email} disabled />
                    </Form.Item>

                    <Form.Item label="名稱" name="nickname" rules={[{ required: true }]}>
                        <Input placeholder="請輸入名稱" />
                    </Form.Item>

                    <Form.Item label="角色" name="role" rules={[{ required: true }]}>
                        <Select
                            options={roleData.map(e => ({ label: e.tag, value: e.name }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default ModifyUserBtn;