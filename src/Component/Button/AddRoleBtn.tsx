import { Button, ColorPicker, Flex, Form, Input, InputNumber, message, Modal } from 'antd'
import React, { useState } from 'react'
import { PlusOutlined, SafetyOutlined } from '@ant-design/icons';
import { add_role } from '../../Api/AdminApi';

interface AddRoleBtnProps {
    refreshData: () => void;
}

const AddRoleBtn: React.FC<AddRoleBtnProps> = ({ refreshData }) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();

            if (typeof values.color === "object" && values.color.toHexString) {
                values.color = values.color.toHexString();
            }
            await add_role(values);

            message.success("新增資料成功");
            setModalOpen(false);
            refreshData();
        } catch (error) {
            message.error("新增資料時出錯");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <>
            <Button color="primary" variant="link" onClick={() => setModalOpen(true)}>
                <PlusOutlined />
                新增
            </Button>
            <Modal
                centered={false}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SafetyOutlined />
                        <span>新增角色</span>
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
                        送出
                    </Button>
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        tag: "",
                        name: "",
                        level: 0,
                        color: "#000000"
                    }}
                >
                    <Form.Item
                        label={"角色名"}
                        name={"tag"}
                        rules={[{ required: true }]}
                    >
                        <Input autoComplete="off" placeholder="請輸入角色名" />
                    </Form.Item>

                    <Form.Item
                        label={"英文名稱"}
                        name={"name"}
                        rules={[{ required: true }]}
                    >
                        <Input autoComplete="off" placeholder="請輸入英文名稱" />
                    </Form.Item>

                    <Flex gap={10}>
                        <Form.Item style={{ width: '50%' }}
                            label="權限等級 (0 ~ 5)"
                            name={"level"}
                            rules={[{ required: true }]}
                        >
                            <InputNumber min={0} max={5} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item style={{ width: '50%' }}
                            label="顏色"
                            name={"color"}
                            rules={[{ required: true }]}
                        >
                            <ColorPicker format="hex" showText disabledAlpha style={{ width: '100%' }} />
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
    )
}

export default AddRoleBtn