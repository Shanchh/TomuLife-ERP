import { Button, Modal, Form, Input, Flex, InputNumber, ColorPicker, message } from 'antd'
import { EditOutlined, SafetyOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Role } from '../../../types';
import { modify_role } from '../../Api/AdminApi';

interface ModifyRoleBtnProps {
    data: Role;
    handleModifyRole: (id: string, data: { tag: string, name: string, level: number, color: string }) => void;
}

const ModifyRoleBtn: React.FC<ModifyRoleBtnProps> = ({ data, handleModifyRole }) => {
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
            await modify_role(data._id, values);

            message.success("更新資料成功");
            setModalOpen(false);
            handleModifyRole(data._id, values);
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
                        <SafetyOutlined />
                        <span>編輯身分組</span>
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
                        tag: data.tag,
                        name: data.name,
                        level: data.level,
                        color: data.color
                    }}
                >
                    <Form.Item
                        label="創建者"
                    >
                        <Input defaultValue={`${data.creator.nickname} [${data.creator.email}]`} disabled />
                    </Form.Item>

                    <Form.Item
                        label={"身分名"}
                        name={"tag"}
                        rules={[{ required: true }]}
                    >
                        <Input autoComplete="off" placeholder="請輸入身分名" />
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

export default ModifyRoleBtn