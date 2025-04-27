import { PlusOutlined, ReloadOutlined, ShopOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Empty, Flex, Form, Input, message, Modal, Spin, Table, TableProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { Customer, CustomerAnalyzeData, CustomerTracking } from '../../../types'
import { add_customer_trackings, get_customer_trackings } from '../../Api/AnalyzeApi';

interface Props {
    analyzeData: CustomerAnalyzeData | null;
    customerList: Customer[];
    isLoading: boolean
}

const CustomerCRMHistoryCard: React.FC<Props> = ({ analyzeData, customerList, isLoading }) => {
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState(10);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [trackingData, setTrackingData] = useState<CustomerTracking[]>([]);

    const [currentCustomerName, setCurrentCustomerName] = useState<string>("未知客戶");

    const customer = customerList.find(c => c._id === analyzeData?.basic._id);
    useEffect(() => {

        if (customer) {
            const formattedName = `${customer.areaCode || ""}-${customer.bookkeeping || ""} ${customer.customerName || "未知客戶"}`;
            setCurrentCustomerName(formattedName);
        } else {
            setCurrentCustomerName("未知客戶");
        }
    }, [analyzeData, customerList]);

    const refreshData = async () => {
        if (!customer?._id) return;
        setIsDataLoading(true);

        try {
            const data = await get_customer_trackings(customer._id);
            setTrackingData(data);
        } catch {
            message.error("載入客戶追蹤紀錄時發生錯誤！");
        }
        setIsDataLoading(false);
    };

    useEffect(() => {
        refreshData();
    }, [analyzeData]);

    const columns: TableProps["columns"] = [
        {
            title: "聯絡日期",
            align: "center",
            dataIndex: "contactDate",
            render: (timestamp: number) => (
              <span>{new Date(timestamp * 1000).toLocaleDateString()}</span>
            ),
        },
        {
            title: "追蹤主旨",
            dataIndex: "contactSubject",
            align: "center",
        },
        {
            title: "追蹤說明",
            dataIndex: "contactNote",
            align: "center",
        },
        {
            title: "創建者",
            align: "center",
            render: (data: CustomerTracking) => <a>{data.creator.nickname ?? "未知"}</a>
        },
        {
          title: "創建日期",
          dataIndex: "createAt",
          align: "center",
          render: (timestamp: number) => (
            <span>{new Date(timestamp * 1000).toLocaleDateString()}</span>
          ),
        },
    ];

    const handleSubmit = async () => {
        setSubmitLoading(true);
        const values = form.getFieldsValue();

        values.customer = customer?._id;
        values.contactDate = Math.floor(values.contactDate.valueOf() / 1000);

        try {
            await add_customer_trackings(values);

            form.resetFields();
            setModalOpen(false);
            refreshData();
        }
        catch {
            message.error("客戶備註處理時發生錯誤！");
        }
        finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Card title="客戶追蹤紀錄">
            {analyzeData === null ? (
                <Flex justify="center" align="center" style={{ height: 150, width: '100%' }}>
                    <Empty />
                </Flex>
            ) : isLoading ? (
                <Flex justify="center" align="center" style={{ height: 150, width: '100%' }}>
                    <Spin size="large" />
                </Flex>
            ) : (
                <>
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
                        loading={isDataLoading}
                        columns={columns}
                        dataSource={trackingData}
                        rowKey={(record) => record._id}
                        pagination={{
                            position: ['bottomLeft'],
                            pageSize: pageSize,
                            pageSizeOptions: ['10', '20', '50', '100', '9999'],
                            showSizeChanger: true,
                            onShowSizeChange: (_, size) => setPageSize(size),
                        }}
                    />
                </>
            )}
        </Card >
    )
}

export default CustomerCRMHistoryCard