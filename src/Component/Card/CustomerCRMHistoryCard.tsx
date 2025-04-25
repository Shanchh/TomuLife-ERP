import { PlusOutlined, ReloadOutlined, ShopOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Flex, Form, Input, Modal, Table, TableProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { Customer, CustomerAnalyzeData } from '../../../types'

interface Props {
    analyzeData: CustomerAnalyzeData | null;
    customerList: Customer[];
}

const CustomerCRMHistoryCard: React.FC<Props> = ({ analyzeData, customerList }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const [currentCustomerName, setCurrentCustomerName] = useState<string>("未知客戶");

    useEffect(() => {
        const customer = customerList.find(c => c._id === analyzeData?.basic._id);
      
        if (customer) {
          const formattedName = `${customer.areaCode || ""}-${customer.bookkeeping || ""} ${customer.customerName || "未知客戶"}`;
          setCurrentCustomerName(formattedName);
        } else {
          setCurrentCustomerName("未知客戶");
        }
      }, [analyzeData, customerList]);

    const refreshData = () => {

    };

    const columns: TableProps["columns"] = [
        {

        }
    ];

    const handleSubmit = async () => {

    };

    return (
        <Card title="客戶追蹤紀錄">
            <Flex gap={10} style={{ marginBottom: 15 }}>
                <Button type="primary" onClick={refreshData}>
                    <ReloadOutlined />
                    刷新
                </Button>
                <>
                    <Button color="primary" variant="link" onClick={() => {
                        form.setFieldsValue({ customerName: currentCustomerName });
                        setModalOpen(true);
                    }}>
                        <PlusOutlined />
                        新增
                    </Button>
                    <Modal
                        centered={false}
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShopOutlined />
                                <span>新增聯絡紀錄</span>
                            </div>
                        }
                        open={modalOpen}
                        width={500}
                        onCancel={() => {
                            setModalOpen(false);
                            form.resetFields();
                        }}
                        style={{ top: 100 }}
                        footer={[
                            <Button key="cancel" onClick={() => {
                                setModalOpen(false);
                                form.resetFields();
                            }}>
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
                                label="客戶名"
                                name="customerName"
                                initialValue={currentCustomerName}
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                label="聯絡日期"
                                name="contactDate"
                                rules={[{ required: true }]}
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>
                            <Form.Item
                                label="聯絡主旨"
                                name="contactSubject"
                                rules={[{ required: true }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="聯絡備註"
                                name="contactNote"
                                rules={[{ required: true }]}
                            >
                                <Input.TextArea placeholder="備註內容" rows={2} allowClear />
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            </Flex>

            <Table
                tableLayout="fixed"
                scroll={{ x: "max-content" }}
                loading={isLoading}
                columns={columns}
                // dataSource={data}
                rowKey={(record) => record._id}
                pagination={{
                    position: ['bottomLeft'],
                    pageSize: pageSize,
                    pageSizeOptions: ['10', '20', '50', '100', '9999'],
                    showSizeChanger: true,
                    onShowSizeChange: (_, size) => setPageSize(size),
                }}
            />
        </Card>
    )
}

export default CustomerCRMHistoryCard