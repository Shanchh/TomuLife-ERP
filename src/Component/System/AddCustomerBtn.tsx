import { Button, Flex, Form, Input, message, Modal, Select } from 'antd';
import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { locations } from '../../Constants/locations';
import { add_customer } from '../../Api/SystemApi';

interface AddCustomerBtnProps {
    refreshData: () => void;
}

const AddCustomerBtn: React.FC<AddCustomerBtnProps> = ({ refreshData }) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();
            console.log(values);

            if (typeof values.color === "object" && values.color.toHexString) {
                values.color = values.color.toHexString();
            }
            await add_customer(values);

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
                    initialValues={{
                        areaCode: "T",
                        deliveryAddress: "",
                        contactPerson: "",
                        contactMethod: "",
                        invoiceTitle: "",
                        taxId: "",
                    }}
                >

                    <Form.Item
                        label={"客戶名"}
                        name={"customerName"}
                        rules={[{ required: true }]}
                    >
                        <Input autoComplete="off" placeholder="請輸入客戶名" />
                    </Form.Item>

                    <Flex gap={10}>
                        <Form.Item
                            label={"地區代號"}
                            name={"areaCode"}
                            rules={[{ required: true }]}
                            style={{ width: '50%' }}
                        >
                            <Select
                                showSearch
                                allowClear
                                placeholder="請輸入或選擇縣市"
                                options={Object.values(locations).map(e => ({
                                    label: `${e.code} - ${e.name}`,
                                    value: e.code
                                }))}
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label={"客戶編號"}
                            name={"bookkeeping"}
                            rules={[{ required: true }]}
                            style={{ width: '50%' }}
                        >
                            <Input type="number" autoComplete="off" placeholder="請輸入客戶編號" />
                        </Form.Item>
                    </Flex>

                    <Form.Item
                        label={"收貨地址"}
                        name={"deliveryAddress"}
                    >
                        <Input autoComplete="off" placeholder="請輸入收貨地址" />
                    </Form.Item>

                    <Flex gap={10}>
                        <Form.Item
                            label={"聯絡人"}
                            name={"contactPerson"}
                            style={{ width: '50%' }}
                        >
                            <Input autoComplete="off" placeholder="請輸入聯絡人" />
                        </Form.Item>

                        <Form.Item
                            label={"聯繫方式"}
                            name={"contactMethod"}
                            style={{ width: '50%' }}
                        >
                            <Input autoComplete="off" placeholder="請輸入聯繫方式" />
                        </Form.Item>
                    </Flex>

                    <Flex gap={10}>
                        <Form.Item
                            label={"抬頭"}
                            name={"invoiceTitle"}
                            style={{ width: '50%' }}
                        >
                            <Input autoComplete="off" placeholder="請輸入抬頭" />
                        </Form.Item>

                        <Form.Item
                            label={"統編"}
                            name={"taxId"}
                            style={{ width: '50%' }}
                        >
                            <Input autoComplete="off" placeholder="請輸入統編" />
                        </Form.Item>
                    </Flex>
                </Form>
            </Modal>
        </>
    )
}

export default AddCustomerBtn