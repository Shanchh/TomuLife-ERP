import { Button, Card, Flex, message, Table, TableProps } from 'antd'
import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Product } from '../../../types';
import { get_products } from '../../Api/SystemApi';
import ModifyProductBtn from '../../Component/System/ModifyProductBtn';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';
import AddProductBtn from '../../Component/System/AddProductBtn';

const SystemProductManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productData, setProductData] = useState<Product[]>([]);

  const [pageSize, setPageSize] = useState(10);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_products();
      setProductData(data);
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

  const handleModifyProduct = (id: string, data: Partial<Product>) => {
    setProductData(productData.map(product =>
      product._id === id ? { ...product, ...data } : product
    ));
  };

  const handleDeleteProduct = (id: string) => {
    setProductData(productData.filter(product => product._id !== id));
  };

  const columns: TableProps["columns"] = [
    {
      title: "資料編號",
      dataIndex: "number",
      align: "center",
    },
    {
      title: "商品名稱",
      dataIndex: "productName",
      align: "center",
    },
    {
      title: "箱入數",
      dataIndex: "bottlesPerBox",
      align: "center",
    },
    {
      title: "零售價",
      dataIndex: "retailPrice",
      align: "center",
    },
    {
      title: "成本價(瓶)",
      dataIndex: "costPerBottle",
      align: "center",
      render: (value) => (value !== null && value !== undefined ? value : "未設定"),
    },
    {
      title: "成本價(箱)",
      dataIndex: "costPerBox",
      align: "center",
      render: (value) => (value !== null && value !== undefined ? value : "未設定"),
    },
    {
      title: "創建者",
      align: "center",
      render: (data: Product) => <a>{data.creator.nickname ?? "未知"}</a>
    },
    {
      title: "創建時間",
      align: "center",
      render: (data: Product) => <span>{new Date(data.createAt * 1000).toLocaleString()}</span>
    },
    {
      title: "操作",
      align: "center",
      render: (data: Product) => (
        <Flex justify='center' align='center' gap={10}>
          <ModifyProductBtn data={data} handleModifyProduct={handleModifyProduct} />
          <DeleteItemBtn type='product' data={data} handleDelete={handleDeleteProduct} />
        </Flex>
      )
    }
  ];

  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <Flex gap={10} style={{ marginBottom: 15 }}>
        <Button type="primary" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>
        <AddProductBtn refreshData={refreshData} />

      </Flex>
      <Table
        columns={columns}
        dataSource={productData}
        loading={isLoading}
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
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

export default SystemProductManagement