import { Button, Card, Flex, message, Table, TableProps, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { ActivityDetail } from '../../../types';
import { get_activity_detail } from '../../Api/FinanceApi';
import { ReloadOutlined } from '@ant-design/icons';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';
import ModifyActivityDetailBtn from '../../Component/Button/ModifyActivityDetailBtn';

const FinanceActivityOverview = () => {
  const { token } = theme.useToken();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);

  const [activityDetailsData, setActivityDetailsData] = useState<ActivityDetail[]>([]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_activity_detail();
      setActivityDetailsData(data);
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

  const columns: TableProps["columns"] = [
    {
      title: "活動開始日期",
      align: "center",
      dataIndex: ["time", "activityStartAt"],
      render: (date: number) => <span>{new Date(date * 1000).toLocaleDateString()}</span>,
    },
    {
      title: "活動天數",
      align: "center",
      render: ({ time: { activityStartAt, activityEndAt } }: ActivityDetail) => (
        <span>{(activityEndAt - activityStartAt) / 86400 + 1}</span>
      ),
    },
    {
      title: "活動名稱",
      align: "center",
      dataIndex: "activityName",
    },
    {
      title: "預計銷售額",
      align: "center",
      dataIndex: ["summary", "totalProductRevenue"],
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>
          ${Number(amount).toLocaleString()}
        </span>
      )
    },
    {
      title: "預計成本",
      align: "center",
      dataIndex: ["summary", "totalProductCost"],
      render: (amount: number) => (
        <span style={{ fontWeight: 'bold' }}>
          ${Number(amount).toLocaleString()}
        </span>
      )
    },
    {
      title: "收款金額",
      align: "center",
      dataIndex: ["summary", "totalManualIncome"],
      render: (amount: number) => (
        <span style={{ color: "green", fontWeight: 'bold' }}>
          ${Number(amount).toLocaleString()}
        </span>
      )
    },
    {
      title: "支出金額",
      align: "center",
      dataIndex: ["summary", "totalManualExpense"],
      render: (amount: number) => (
        <span style={{ color: token.colorPrimary, fontWeight: 'bold' }}>
          ${Number(amount).toLocaleString()}
        </span>
      )
    },
    {
      title: "毛利率",
      align: "center",
      render: (_, record) => {
        const income = record.summary?.totalManualIncome ?? 0;
        const expense = record.summary?.totalManualExpense ?? 0;
        const grossMargin = income > 0 ? ((income - expense) / income) * 100 : 0;
        return (
          <span style={{ fontWeight: 'bold' }}>
            {grossMargin.toFixed(2)}%
          </span>
        );
      }
    },
    {
      title: "操作",
      align: "center",
      render: (data: ActivityDetail) => (
        <Flex justify='center' align='center' gap={10}>
          <ModifyActivityDetailBtn initialData={data} refreshData={refreshData} />
          <DeleteItemBtn type='activity_detail' data={data} handleDelete={handleDeleteActivity} />
        </Flex>
      )
    }
  ];

  const handleDeleteActivity = (id: string) => {
    setActivityDetailsData(activityDetailsData.filter(detail => detail._id !== id));
  };

  return (
    <Card style={{ overflow: "hidden", height: "100%" }}>
      <Flex style={{ marginBottom: 15 }} gap={15}>
        <Button variant="text" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>
      </Flex>

      <Table
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        loading={isLoading}
        columns={columns}
        dataSource={activityDetailsData}
        rowKey={(record) => record._id}
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

export default FinanceActivityOverview