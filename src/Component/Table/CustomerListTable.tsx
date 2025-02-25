import { Flex, Table, TableProps } from 'antd'
import React, { useState } from 'react'
import { Customer } from '../../../types';
import ModifyCustomerBtn from '../Button/ModifyCustomerBtn';
import { locations } from '../../Constants/locations';
import DeleteCustomerBtn from '../Button/DeleteCustomerBtn';

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
            title: "縣市代號",
            align: "center",
            render: (data: Customer) => <span>{`${data.areaCode}-${locations[data.areaCode].name}`}</span>
        },
        {
            title: "會計科目",
            dataIndex: "bookkeeping",
            align: "center",
        },
        {
            title: "客戶名",
            dataIndex: "customerName",
            align: "center",
        },
        {
            title: "收貨地址",
            dataIndex: "deliveryAddress",
            align: "center",
        },
        {
            title: "聯絡人",
            dataIndex: "contactPerson",
            align: "center",
        },
        {
            title: "聯繫方式",
            dataIndex: "contactMethod",
            align: "center",
        },
        {
            title: "抬頭",
            dataIndex: "invoiceTitle",
            align: "center",
        },
        {
            title: "統一編號",
            dataIndex: "taxId",
            align: "center",
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
                    <DeleteCustomerBtn data={data} handleDeleteCustomer={handleDeleteCustomer} />
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