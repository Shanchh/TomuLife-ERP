import { Card, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_all_customer_tier } from '../../Api/AnalyzeApi';
import { TableProps } from 'antd/lib';
import { CustomerTierStats } from '../../../types';

const CustomerTierOverview = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tierData, setTierData] = useState<CustomerTierStats[]>([]);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        setIsLoading(true);
        const data = await get_all_customer_tier();
        setTierData(data);
        setIsLoading(false);
    };

    const getCustomerLevel = (sumOfTop3: number): string => {
        if (sumOfTop3 >= 100000) return 'A';
        if (sumOfTop3 >= 60000) return 'B';
        if (sumOfTop3 >= 30000) return 'C';
        if (sumOfTop3 >= 10000) return 'D';
        if (sumOfTop3 > 0) return 'E';
        return 'F';
    };

    const columns: TableProps<CustomerTierStats>['columns'] = [
        {
            title: '客戶名稱',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '地區代號',
            dataIndex: 'areaCode',
            align: 'center',
        },
        {
            title: '客戶編號',
            dataIndex: 'bookkeeping',
            align: 'center',
        },
        {
            title: '客戶等級',
            key: 'level',
            align: 'center',
            render: (_, record) => {
                const amount = record.threeMonth?.amount ?? 0;
                const level = getCustomerLevel(amount);

                const colorMap: Record<string, string> = {
                    A: '#FFD700',
                    B: '#52c41a',
                    C: '#1890ff',
                    D: '#13c2c2',
                    E: '#8c8c8c',
                    F: '#f5222d',
                };

                return (
                    <span style={{ color: colorMap[level], fontWeight: 'bold' }}>
                        {level}
                    </span>
                );
            },
        },
        {
            title: '近一個月金額',
            dataIndex: ['oneMonth', 'amount'],
            align: 'center',
            render: (value: number) => `$${value.toLocaleString()}`,
        },
        {
            title: '近一個月筆數',
            dataIndex: ['oneMonth', 'count'],
            align: 'center',
        },
        {
            title: '近三個月金額',
            dataIndex: ['threeMonth', 'amount'],
            align: 'center',
            render: (value: number) => (
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                    ${value.toLocaleString()}
                </span>
            ),
        },
        {
            title: '近三個月筆數',
            dataIndex: ['threeMonth', 'count'],
            align: 'center',
        },
        {
            title: '近六個月金額',
            dataIndex: ['sixMonth', 'amount'],
            align: 'center',
            render: (value: number) => `$${value.toLocaleString()}`,
        },
        {
            title: '近六個月筆數',
            dataIndex: ['sixMonth', 'count'],
            align: 'center',
        },
    ];

    return (
        <Card style={{ height: '100%', overflow: 'auto' }}>
            <Table
                tableLayout="fixed"
                scroll={{ x: 'max-content' }}
                loading={isLoading}
                columns={columns}
                dataSource={tierData}
                rowKey={(record) => record._id}
            />
        </Card>
    );
};

export default CustomerTierOverview;