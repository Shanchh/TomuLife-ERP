import { Avatar, Button, Card, Flex, message, Table, TableProps } from 'antd'
import { ReloadOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { get_roles, get_user_list } from '../../Api/AdminApi';
import { Role, User } from '../../../types';
import RoleTag from '../../Component/RoleTag';
import DeleteUserBtn from '../../Component/Button/DeleteUserBtn';
import ModifyUserBtn from '../../Component/Button/ModifyUserBtn';

const SystemUserManagement = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [roleData, setRoleData] = useState<Role[]>([]);
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);

  const [pageSize, setPageSize] = useState(10);

  const refreshData = async () => {
    setDataIsLoading(true);
    try {
      const data1 = await get_user_list();
      const data2 = await get_roles();
      setUserData(data1);
      setRoleData(data2);
    }
    catch {
      message.error("資料載入錯誤！");
    }
    finally {
      setDataIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const columns: TableProps["columns"] = [
    {
      title: "用戶",
      dataIndex: "nickname",
      width: 200,
      render: (name: string, record: any) => (
        <Flex justify="centet" align="center" gap={10} >
          <Avatar style={{ backgroundColor: "#666" }} icon={<UserOutlined />} />
          <Flex vertical>
            <span style={{ fontWeight: "bold" }}>{name ?? "未知"}</span>
            <span style={{ color: "#999", fontSize: 12 }}>{record._id}</span>
          </Flex>
        </Flex>
      )
    },
    {
      title: "角色",
      dataIndex: "role",
      align: "center",
      render: (role: string) => <RoleTag roleData={roleData} role={role} />
    },
    {
      title: "信箱",
      align: "center",
      dataIndex: "email",
    },
    {
      title: "註冊時間",
      align: "center",
      dataIndex: "createAt",
      render: (time: number) => <span>{new Date(time * 1000).toLocaleString()}</span>,
    },
    {
      title: "操作",
      align: "center",
      render: (data: User) => (
        <Flex justify='center' align='center' gap={10}>
          <ModifyUserBtn data={data} roleData={roleData} refreshData={refreshData}/>
          <DeleteUserBtn />
        </Flex>
      )
    }
  ];

  return (
    <Card style={{ height: "100%", overflow: "auto" }}>
      <Flex style={{ marginBottom: 15 }}>
        <Button type="primary" onClick={refreshData}>
          <ReloadOutlined />
          刷新
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={userData}
        loading={dataIsLoading}
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

export default SystemUserManagement