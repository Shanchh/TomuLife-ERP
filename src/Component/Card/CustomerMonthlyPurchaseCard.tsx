import React from 'react'
import { Card, Empty, Flex, Spin } from 'antd'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { CustomerAnalyzeData } from '../../../types'
import { SmileOutlined } from '@ant-design/icons'

interface Props {
    analyzeData: CustomerAnalyzeData | null
    isLoading: boolean
}

const colors = [
    '#2F54EB', '#13C2C2', '#FA541C', '#722ED1', '#FAAD14',
    '#A0D911', '#531DAB', '#D4380D', '#08979C', '#1D39C4'
]

type StackedChartRow = {
    month: string;
    [productName: string]: number | string;
}

const formatStackedChartDataFromAnalyze = (
    monthlyData: CustomerAnalyzeData['monthlyData']
): StackedChartRow[] => {
    const chartData: Record<string, StackedChartRow> = {}

    for (const month in monthlyData) {
        if (!chartData[month]) {
            chartData[month] = { month }
        }

        const monthItems = monthlyData[month].items || []
        for (const item of monthItems) {
            chartData[month][item.name] = (chartData[month][item.name] as number || 0) + item.subtotal
        }
    }

    return Object.values(chartData).sort((a, b) =>
        (b.month).localeCompare(a.month)
    )
}

const CustomerMonthlyPurchaseCard: React.FC<Props> = ({ analyzeData, isLoading }) => {
    const monthlyData = analyzeData?.monthlyData || {}
    const chartData = formatStackedChartDataFromAnalyze(monthlyData)

    const productNames = Array.from(
        new Set(
            chartData.flatMap(item =>
                Object.keys(item).filter(key => key !== 'month')
            )
        )
    )

    return (
        <Card title="近六個月購買金額(零售價計算)" style={{ height: "100%", width: '100%', minHeight: 420 }}>
            <Flex justify="center" align="center" style={{ width: '100%', height: 300 }}>
                {analyzeData === null ? (
                    <div style={{ textAlign: 'center', color: "gray" }}>
                        <SmileOutlined style={{ fontSize: 20 }} />
                        <p>沒有銷售紀錄</p>
                    </div>
                ) : isLoading ? (
                    <Spin size="large" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            barGap={20}
                            margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                        >
                            <XAxis type="number" />
                            <YAxis
                                dataKey="month"
                                type="category"
                                tickFormatter={(month) => {
                                    const thisMonth = chartData.find(item => item.month === month);
                                    const total = thisMonth
                                        ? Object.keys(thisMonth)
                                            .filter(key => key !== 'month')
                                            .reduce((sum, key) => sum + Number(thisMonth[key]), 0)
                                        : 0;
                                    return `${month} (${total.toLocaleString()})`;
                                }}
                            />
                            <Tooltip />
                            <Legend />
                            {productNames.map((name, index) => (
                                <Bar
                                    key={name}
                                    dataKey={name}
                                    stackId="a"
                                    fill={colors[index % colors.length]}
                                    barSize={22}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Flex>
        </Card>
    )
}

export default CustomerMonthlyPurchaseCard