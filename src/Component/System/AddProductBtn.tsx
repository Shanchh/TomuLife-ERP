import { PlusOutlined, ShopOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, message, Modal } from 'antd'
import React, { useState } from 'react'
import { add_product } from '../../Api/AdminApi';

interface AddProductBtnProps {
    refreshData: () => void;
}

const AddProductBtn: React.FC<AddProductBtnProps> = ({ refreshData }) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();

            const processedValues = {
                ...values,
                costPerBox: values.costPerBox === "" || values.costPerBox === undefined ? null : values.costPerBox,
                costPerBottle: values.costPerBottle === "" || values.costPerBottle === undefined ? null : values.costPerBottle,
            };
            await add_product(processedValues);

            message.success("新增資料成功");
            setModalOpen(false);
            form.resetFields();
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
                        <ShopOutlined />
                        <span>新增客戶</span>
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
                >
                    <Form.Item
                        label={"商品名稱"}
                        name={"productName"}
                        rules={[{ required: true }]}
                    >
                        <Input autoComplete="off" placeholder="請輸入商品名稱" />
                    </Form.Item>

                    <Form.Item
                        label={"箱入數 (一箱幾瓶)"}
                        name={"bottlesPerBox"}
                        rules={[{ required: true }]}
                    >
                        <Input type="number" autoComplete="off" placeholder="請輸入箱入數" />
                    </Form.Item>

                    <Form.Item
                        label={"零售價"}
                        name={"retailPrice"}
                        rules={[{ required: true }]}
                    >
                        <Input type="number" autoComplete="off" placeholder="請輸入零售價" />
                    </Form.Item>

                    <Flex gap={10}>
                        <Form.Item
                            label={"成本價(瓶)"}
                            name={"costPerBottle"}
                            style={{ width: '50%' }}
                        >
                            <Input type="number" autoComplete="off" placeholder="請輸入成本價(瓶)" />
                        </Form.Item>

                        <Form.Item
                            label={"成本價(箱)"}
                            name={"costPerBox"}
                            style={{ width: '50%' }}
                        >
                            <Input type="number" autoComplete="off" placeholder="請輸入成本價(箱)" />
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
    )
}

export default AddProductBtn