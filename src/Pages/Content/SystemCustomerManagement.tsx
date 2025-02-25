import { Button, Card, Col, Flex, Form, Input, message, Row, Select } from 'antd'
import { ReloadOutlined, SearchOutlined, UserOutlined, ProfileOutlined, HomeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import AddCustomerBtn from '../../Component/Button/AddCustomerBtn';
import { get_customers } from '../../Api/AdminApi';
import CustomerListTable from '../../Component/Table/CustomerListTable';
import { Customer } from '../../../types';
import { locations } from '../../Constants/locations';

type Filter = {
  areaCode: string;
  bookkeeping: string;
  customerName: string;
  deliveryAddress: string;
};

const SystemCustomerManagement = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerData, setCustomerData] = useState<Customer[]>([]);

  const [areaCodeValue, setAreaCodeValue] = useState<string>("all");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Customer[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_customers();

      const sortedData = [...data].sort((a, b) => {
        return Number(a.bookkeeping) - Number(b.bookkeeping);
      });

      setFilteredData(sortedData);
      setCustomerData(sortedData);
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
    setFilteredData(filteredData.map(customer =>
      customer._id === id ? { ...customer, ...data } : customer
    ));
  };

  const handleDeleteCustomer = (id: string) => {
    setFilteredData(filteredData.filter(customer => customer._id !== id));
  };

  const onFinish = async (values: Filter) => {
    setSearchLoading(true);
    const { bookkeeping, customerName, deliveryAddress } = values;

    const filtered = customerData.filter((item) => {
      const matchAreaCode = areaCodeValue ? areaCodeValue == "all" || item.areaCode.includes(areaCodeValue) : true;
      const matchBookkeeping = bookkeeping ? item.bookkeeping.includes(bookkeeping) : true;
      const matchcustomerName = customerName ? item.customerName.includes(customerName) : true;
      const matchDeliveryAddress = deliveryAddress ? item.deliveryAddress.includes(deliveryAddress) : true;

      return matchAreaCode && matchBookkeeping && matchcustomerName && matchDeliveryAddress;
    });

    setFilteredData(filtered);
    setSearchLoading(false);
  };

  return (
    <Card style={{ height: "100%", width: '100%', overflow: "auto" }}>
      <Form
        form={form}
        name="customer_search"
        onFinish={onFinish}
        initialValues={{
          customerName: "",
          bookkeeping: "",
          deliveryAddress: "",
        }}
        style={{ width: '100%', marginBottom: 16 }}
      >
        <Row justify="start" gutter={[18, 18]}>
          <Col>
            <Form.Item name="areaCode">
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>縣市代碼:</span>
                <Select
                  showSearch
                  allowClear
                  placeholder="請輸入或選擇縣市"
                  value={areaCodeValue}
                  onChange={(v) => setAreaCodeValue(v)}
                  options={[
                    { label: "ALL-不限代碼", value: "all" },
                    ...Object.values(locations).map(e => ({
                      label: `${e.code} - ${e.name}`,
                      value: e.code,
                    })),
                  ]}
                  filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                  }
                  style={{ width: 280 }}
                />
              </Flex>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="customerName">
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>客戶名稱:</span>
                <Input placeholder="請輸入客戶名稱" prefix={<UserOutlined />} style={{ width: 280 }} />
              </Flex>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="bookkeeping">
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>會計科目:</span>
                <Input placeholder="請輸入會計科目" prefix={<ProfileOutlined />} style={{ width: 280 }} />
              </Flex>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="deliveryAddress">
              <Flex justify="start" align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>收貨地址:</span>
                <Input placeholder="請輸入收貨地址" prefix={<HomeOutlined />} style={{ width: 280 }} />
              </Flex>
            </Form.Item>
          </Col>
        </Row>
        <Flex justify="end" style={{ paddingTop: 10 }} gap={10}>
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />} loading={searchLoading}>
            條件查詢
          </Button>
          <Button htmlType="reset" type="default" onClick={() => setFilteredData(customerData)}>
            清除條件
          </Button>
        </Flex>
      </Form>

      <Flex gap={10} style={{ marginBottom: 15 }}>
        <Button color="primary" variant="solid" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>

        <AddCustomerBtn refreshData={refreshData} />
      </Flex>

      <CustomerListTable data={filteredData} isLoading={isLoading} handleModifyCustomer={handleModifyCustomer} handleDeleteCustomer={handleDeleteCustomer} />
    </Card>
  )
}

export default SystemCustomerManagement