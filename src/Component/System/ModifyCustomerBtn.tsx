import { Button, Flex, Form, Input, message, Modal, Select } from 'antd'
import React, { useState } from 'react'
import { EditOutlined, ShopOutlined } from '@ant-design/icons';
import { Customer } from '../../../types';
import { locations } from '../../Constants/locations';
import { modify_customer } from '../../Api/SystemApi';

interface ModifyRoleBtnProps {
    data: Customer;
    handleModifyCustomer: (id: string, data: Partial<Customer>) => void;
}

const ModifyCustomerBtn: React.FC<ModifyRoleBtnProps> = ({ data, handleModifyCustomer }) => {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        try {
            setSubmitLoading(true);
            const values = await form.validateFields();
            await modify_customer(data._id, values);

            message.success("更新資料成功");
            setModalOpen(false);
            handleModifyCustomer(data._id, values);
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
                        <ShopOutlined />
                        <span>編輯客戶</span>
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
                        areaCode: data.areaCode,
                        bookkeeping: data.bookkeeping,
                        customerName: data.customerName,
                        deliveryAddress: data.deliveryAddress,
                        contactPerson: data.contactPerson,
                        contactMethod: data.contactMethod,
                        invoiceTitle: data.invoiceTitle,
                        taxId: data.taxId
                    }}
                >
                    <Form.Item
                        label="創建者"
                    >
                        <Input defaultValue={`${data.creator.nickname} [${data.creator.email}]`} disabled />
                    </Form.Item>

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
                            <Input type="number" autoComplete="off" placeholder="請輸入會計科目" />
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

export default ModifyCustomerBtn