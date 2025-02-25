import { Button, Card, Flex, message } from 'antd'
import { ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import AddCustomerBtn from '../../Component/Button/AddCustomerBtn';
import { get_customers } from '../../Api/AdminApi';
import CustomerListTable from '../../Component/Table/CustomerListTable';
import { Customer } from '../../../types';

const SystemCustomerManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customerData, setCustomerData] = useState<Customer[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_customers();
      setCustomerData(data);
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

  const handleModifyCustomer = (id: string, data: Partial<Customer>) => {
    setCustomerData(customerData.map(customer =>
      customer._id === id ? { ...customer, ...data } : customer
    ));
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomerData(customerData.filter(customer => customer._id !== id));
  };

  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <Flex gap={10} style={{ marginBottom: 15 }}>
        <Button color="primary" variant="solid" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>

        <AddCustomerBtn refreshData={refreshData} />
      </Flex>
      
      <CustomerListTable data={customerData} isLoading={isLoading} handleModifyCustomer={handleModifyCustomer} handleDeleteCustomer={handleDeleteCustomer} />
    </Card>
  )
}

export default SystemCustomerManagement