import { Card, Col, DatePicker, Flex, Row, Spin, Statistic, Table, theme, Tooltip } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs';
import { get_purchase_statistics } from '../../Api/FinanceApi';
import { PurchaseStatistics } from '../../../types';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const FinancePurchaseStatistics = () => {
  const { token } = theme.useToken();
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs());
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [statisticsData, setStatisticsData] = useState<PurchaseStatistics | null>(null);

  const refreshData = async () => {
    setDataLoading(true);
    const selectedYear = selectedMonth.year();
    const data = await get_purchase_statistics(selectedYear);
    setStatisticsData(data);
    setDataLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [selectedMonth]);

  const chartData = useMemo(() => {
    if (!statisticsData) return [];
    return statisticsData.productStats.map(item => ({
      name: item.productName,
      total: item.subtotal
    }));
  }, [statisticsData]);

  return (
    <Flex vertical style={{ width: "100%" }} gap={8}>
      <Card style={{ height: 160 }}>
        <Flex align="center" gap={10} style={{ marginBottom: 16 }}>
          <span>選擇年份:</span>
          <DatePicker
            picker="year"
            value={selectedMonth}
            onChange={v => v && setSelectedMonth(v)}
          />
        </Flex>
        {dataLoading ? (
          <Flex justify="center" align="center" style={{ height: 65 }}>
            <Spin size="large" />
          </Flex>
        ) : (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic
                title="總金額"
                value={`$${statisticsData?.totalAmount.toLocaleString()}`}
                valueStyle={{ fontWeight: 'bold', color: token.colorPrimary }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="訂單筆數"
                value={statisticsData?.ordersCount}
                valueStyle={{ fontWeight: 'bold' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="總箱數"
                value={statisticsData?.totalBoxes}
                valueStyle={{ fontWeight: 'bold' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="總瓶數"
                value={statisticsData?.totalBottles}
                valueStyle={{ fontWeight: 'bold' }}
              />
            </Col>
          </Row>
        )}
      </Card>

      <Card title="進貨商品統計表">
        <Table
          loading={dataLoading}
          dataSource={statisticsData?.productStats}
          rowKey={(record) => record.productID}
          columns={[
            { title: '商品名稱', dataIndex: 'productName' },
            { title: '採購次數', dataIndex: 'count' },
            { title: '瓶數', dataIndex: 'bottles' },
            { title: '箱數', dataIndex: 'boxes' },
            { title: '金額小計', dataIndex: 'subtotal' }
          ]}
          pagination={false}
          style={{ marginBottom: 40 }}
        />
      </Card>

      <Card title="各商品採購金額圖表">
        <ResponsiveContainer width="100%" height={Math.max(250, chartData.length * 40)}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis
              width={100}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Bar
              dataKey="total"
              fill="#fa8c16"
              radius={[4, 4, 0, 0]}
              label={{ position: 'top', fill: '#333', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

    </Flex>
  )
}

export default FinancePurchaseStatistics