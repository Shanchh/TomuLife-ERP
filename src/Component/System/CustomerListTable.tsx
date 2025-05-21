import { Flex, Table, TableProps } from 'antd'
import React, { useState } from 'react'
import { Customer } from '../../../types';
import ModifyCustomerBtn from './ModifyCustomerBtn';
import { locations } from '../../Constants/locations';
import DeleteItemBtn from './DeleteItemBtn';

interface CustomerListTableProps {
    data: Customer[];
    isLoading: boolean;
    handleModifyCustomer: (id: string, data: Partial<Customer>) => void;
    handleDeleteCustomer: (id: string) => void;
}

const CustomerListTable: React.FC<CustomerListTableProps> = ({ data, isLoading, handleModifyCustomer, handleDeleteCustomer }) => {

    const [pageSize, setPageSize] = useState(10);

    const columns: TableProps["columns"] = [
        {
            title: "地區代號",
            align: "center",
            render: (data: Customer) => <span>{`${data.areaCode}-${locations[data.areaCode].name}`}</span>
        },
        {
            title: "客戶編號",
            dataIndex: "bookkeeping",
            align: "center",
            render: (bookkeeping: string) => bookkeeping || "-"
        },
        {
            title: "客戶名",
            dataIndex: "customerName",
            align: "center",
            render: (customerName: string) => customerName || "-"
        },
        {
            title: "收貨地址",
            dataIndex: "deliveryAddress",
            align: "center",
            render: (deliveryAddress: string) => deliveryAddress || "-"
        },
        {
            title: "聯絡人",
            dataIndex: "contactPerson",
            align: "center",
            render: (contactPerson: string) => contactPerson || "-"
        },
        {
            title: "聯繫方式",
            dataIndex: "contactMethod",
            align: "center",
            render: (contactMethod: string) => contactMethod || "-"
        },
        {
            title: "抬頭",
            dataIndex: "invoiceTitle",
            align: "center",
            render: (invoiceTitle: string) => invoiceTitle || "-"
        },
        {
            title: "統一編號",
            dataIndex: "taxId",
            align: "center",
            render: (taxId: string) => taxId || "-"
        },
        {
            title: "創建者",
            align: "center",
            render: (data: Customer) => <a>{data.creator.nickname ?? "未知"}</a>
        },
        {
            title: "創建日期",
            align: "center",
            render: (data: Customer) => <span>{new Date(data.createAt * 1000).toLocaleDateString()}</span>
        },
        {
            title: "操作",
            align: "center",
            render: (data: Customer) => (
                <Flex justify='center' align='center' gap={10}>
                    <ModifyCustomerBtn data={data} handleModifyCustomer={handleModifyCustomer} />
                    <DeleteItemBtn type='customer' data={data} handleDelete={handleDeleteCustomer} />
                </Flex>
            )
        }
    ];

    return (
        <Table
            tableLayout="fixed"
            scroll={{ x: "max-content" }}
            loading={isLoading}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
            pagination={{
                position: ['bottomLeft'],
                pageSize: pageSize,
                pageSizeOptions: ['10', '20', '50', '100', '9999'],
                showSizeChanger: true,
                onShowSizeChange: (_, size) => setPageSize(size),
            }}
        />
    )
}

export default CustomerListTable