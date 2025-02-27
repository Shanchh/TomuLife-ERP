import { Button, Card, Flex, message, Form, Row, Col, DatePicker, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Product, PurchaseOrder } from "../../../types";
import { get_purchase_orders } from "../../Api/FinanceApi";
import PurchaseDetailsTable from "../../Component/Table/PurchaseDetailsTable";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { get_products } from "../../Api/SystemApi";
import SeletcPurchaseDetailsTable from "../../Component/Table/SelectPurchaseDetailsTable";

const FinancePurchaseDetails = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [purchaseData, setPurchaseData] = useState<PurchaseOrder[]>([]);
  const [filteredData, setFilteredData] = useState<PurchaseOrder[]>([]);

  const [yearSelect, setYearSelect] = useState<Date | null>(null);
  const [productSelect, setProductSelect] = useState<string | null>(null);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_purchase_orders();
      setPurchaseData(data);
      setFilteredData(data);
    } catch {
      message.error("資料載入錯誤！");
    } finally {
      setIsLoading(false);
    }
  };

  const initPage = () => {
    get_products()
      .then((value: Product[]) => setProductList(value))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    initPage();
    refreshData();
  }, []);

  const onFinish = () => {
    setSearchLoading(true);

    const selectedYear = yearSelect ? new Date(yearSelect).getFullYear() : null;

    const filtered = purchaseData.filter((order) => {
      const orderYear = new Date(order.purchaseAt * 1000).getFullYear();
      const matchYear = selectedYear ? orderYear === selectedYear : true;
      const matchProduct = productSelect ? productSelect in order.products : true;
      return matchYear && matchProduct;
    });

    setFilteredData(filtered);
    setSelectedProductId(productSelect);
    setSearchLoading(false);
  };

  const onReset = () => {
    setFilteredData(purchaseData);
    setYearSelect(null);
    setProductSelect(null);
    setSelectedProductId(null);
  };

  const handleDelete = (id: string) => {
    setFilteredData(filteredData.filter(data => data._id !== id));
  };

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Form
        form={form}
        name="purchase_search"
        onFinish={onFinish}
        style={{ width: "100%", marginBottom: 16 }}
      >
        <Row justify="start" gutter={[18, 18]}>
          <Col>
            <Form.Item name="yearSelect">
              <Flex align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>選擇年分:</span>
                <DatePicker
                  picker="year"
                  style={{ width: 280 }}
                  value={yearSelect}
                  onChange={(e) => setYearSelect(e)}
                />
              </Flex>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name="productSelect">
              <Flex align="center" gap={10}>
                <span style={{ whiteSpace: "nowrap" }}>指定商品:</span>
                <Select
                  placeholder="請選擇商品"
                  style={{ width: 280 }}
                  options={productList.map((product) => ({
                    label: product.productName,
                    value: product._id,
                  }))}
                  value={productSelect}
                  onChange={(e) => setProductSelect(e)}
                />
              </Flex>
            </Form.Item>
          </Col>
        </Row>

        <Flex justify="end" style={{ paddingTop: 10 }} gap={10}>
          <Button htmlType="submit" type="primary" icon={<SearchOutlined />} loading={searchLoading}>
            條件查詢
          </Button>
          <Button type="default" onClick={onReset}>
            清除條件
          </Button>
        </Flex>
      </Form>

      <Flex style={{ marginBottom: 15 }} gap={15}>
        <Button variant="text" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>
      </Flex>

      {selectedProductId ? (
        <SeletcPurchaseDetailsTable
          productId={selectedProductId}
          productName={productList.find((product) => product._id === selectedProductId)?.productName || ""}
          isLoading={isLoading}
          data={filteredData}
          handleDelete={handleDelete}
        />
      ) : (
        <PurchaseDetailsTable isLoading={isLoading} data={filteredData} productList={productList} handleDelete={handleDelete}/>
      )}
    </Card>
  );
};

export default FinancePurchaseDetails;