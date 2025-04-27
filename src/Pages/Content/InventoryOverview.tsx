import { Button, Card, Flex, message, Table, TableProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { get_inventory_details } from '../../Api/FinanceApi';
import { ReloadOutlined } from '@ant-design/icons';
import { InventoryData } from '../../../types';
import dayjs from "dayjs";

const InventoryOverview = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [inventoryData, setInventoryData] = useState<InventoryData[]>([]);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const data = await get_inventory_details();
            setInventoryData(data);
        }
        catch {
            message.error("資料載入錯誤！");
        }
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        refreshData();
    }, []);

    const columns: TableProps<InventoryData>["columns"] = [
        {
            title: "商品名稱",
            dataIndex: "productName",
            align: "center",
        },
        {
            title: "零售價",
            dataIndex: "retailPrice",
            align: "center",
            render: (value) => `$${Number(value).toLocaleString()}`,
        },
        {
            title: "庫存數量",
            dataIndex: "inventoryQty",
            align: "center",
        },
        {
            title: "最近進貨日",
            dataIndex: "lastPurchaseDate",
            align: "center",
            render: (timestamp) => timestamp ? dayjs.unix(timestamp).format('YYYY/MM/DD') : '-',
        },
    ];

    return (
        <Card style={{ height: "100%", overflow: "auto" }}>
            <Flex gap={10} style={{ marginBottom: 15 }}>
                <Button color="primary" variant="solid" onClick={refreshData}>
                    <ReloadOutlined />
                    刷新
                </Button>
            </Flex>

            <Table
                tableLayout="fixed"
                scroll={{ x: "max-content" }}
                loading={isLoading}
                columns={columns}
                dataSource={inventoryData}
                rowKey={(record) => record.productId}
            />
        </Card>
    )
}

export default InventoryOverview