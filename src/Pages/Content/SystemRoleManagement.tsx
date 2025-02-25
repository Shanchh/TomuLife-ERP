import { Badge, Button, Card, Flex, message, Table, TableProps } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Role } from '../../../types';
import { get_roles } from '../../Api/AdminApi';
import ModifyRoleBtn from '../../Component/System/ModifyRoleBtn';
import AddRoleBtn from '../../Component/System/AddRoleBtn';
import DeleteItemBtn from '../../Component/System/DeleteItemBtn';

const SystemRoleManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roleData, setRoleData] = useState<Role[]>([]);

  const [pageSize, setPageSize] = useState(10);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const data = await get_roles();
      setRoleData(data);
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

  const handleModifyRole = (id: string, data: { tag: string, name: string, level: number, color: string }) => {
    setRoleData(roleData.map(role => {
      if (role._id === id) {
        return { ...role, tag: data.tag, name: data.name, level: data.level, color: data.color };
      }
      return role;
    }));
  };

  const handleDeleteRole = (id: string) => {
    setRoleData(roleData.filter(role => role._id !== id));
  }

  const columns: TableProps["columns"] = [
    {
      title: "權限等級",
      dataIndex: "level",
      align: "center",
    },
    {
      title: "顏色",
      align: "center",
      render: (data: Role) => <Badge color={data.color} text={data.color} />
    },
    {
      title: "標誌",
      dataIndex: "tag",
      align: "center",
    },
    {
      title: "名稱",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "創建者",
      align: "center",
      render: (data: Role) => <a>{data.creator.nickname ?? "未知"}</a>
    },
    {
      title: "創建時間",
      align: "center",
      render: (data: Role) => <span>{new Date(data.createAt * 1000).toLocaleString()}</span>
    },
    {
      title: "操作",
      align: "center",
      render: (data: Role) => (
        <Flex justify='center' align='center' gap={10}>
          <ModifyRoleBtn data={data} handleModifyRole={handleModifyRole} />
          <DeleteItemBtn type='role' data={data} handleDelete={handleDeleteRole} />
        </Flex>
      )
    }
  ];

  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <Flex gap={10} style={{ marginBottom: 15 }}>
        <Button color="primary" variant="solid" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>

        <AddRoleBtn refreshData={refreshData}/>
      </Flex>

      <Table
        tableLayout="fixed"
        scroll={{ x: "max-content" }}
        loading={isLoading}
        columns={columns}
        dataSource={roleData}
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

export default SystemRoleManagement