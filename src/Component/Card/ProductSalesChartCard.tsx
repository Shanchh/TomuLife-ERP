import React, { useEffect, useState } from 'react'
import { Card, Flex } from 'antd'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts'
import { get_products_sales_statistics } from '../../Api/FinanceApi'

type Statistic = {
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
}

type Props = {
    dateRange: { start: number | null, end: number | null },
}

const ProductSalesChartCard = ({ dateRange }: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [statisticData, setStatisticData] = useState<Statistic[]>([])
    const [chartHeight, setChartHeight] = useState<number>(200);

    useEffect(() => {
        fetchData();
    }, [dateRange])

    const fetchData = async () => {
        if (dateRange.start == null || dateRange.end == null) return
        setIsLoading(true);

        const data = await get_products_sales_statistics(dateRange.start, dateRange.end);
        setStatisticData(data);

        const value = data.length * 40 + 40;
        setChartHeight(value);
        
        setIsLoading(false);
    }

    return (
        <Card title="商品銷售金額 / 數量概況" loading={isLoading}>
            <Flex justify="center" style={{ marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>已銷售金額</h3>
            </Flex>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={statisticData}
                    layout="vertical"
                    barCategoryGap="15%"
                    barGap={20}
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                    <XAxis
                        type="number"
                        tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <YAxis type="category" dataKey="productName" width={80} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#fa8c16" name="已銷售金額">
                        <LabelList
                            dataKey="totalRevenue"
                            position="right"
                            formatter={(value: number) => `$${value.toLocaleString()}`}
                            style={{ fill: '#333', fontWeight: 'bold', fontSize: 12 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <Flex justify="center" style={{ margin: '20px 0 12px 0' }}>
                <h3 style={{ margin: 0 }}>銷售瓶數</h3>
            </Flex>
            <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                    data={statisticData}
                    layout="vertical"
                    barCategoryGap="15%"
                    barGap={20}
                    margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
                >
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="productName" width={80} />
                    <Tooltip formatter={(value: number) => `${value} 瓶`} />
                    <Legend />
                    <Bar dataKey="totalQuantity" fill="#13c2c2" name="銷售瓶數">
                        <LabelList
                            dataKey="totalQuantity"
                            position="right"
                            formatter={(value: number) => `${value} 瓶`}
                            style={{ fill: '#333', fontWeight: 'bold', fontSize: 12 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}

export default ProductSalesChartCard