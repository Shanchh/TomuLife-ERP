import React, { useState } from 'react';
import { Layout, theme, Flex } from 'antd';
import { Outlet } from "react-router-dom";
import { isMobile } from "react-device-detect";
import MainHeader from './MainHeader';
import MainOption from './MainOption';
import MainBreadcrumb from './MainBreadcrumb';

const Interface = () => {
  const [collapsed, setCollapsed] = useState<boolean>(isMobile);
  const { token } = theme.useToken();

  return (
    <Flex vertical={true} style={{ minHeight: "100vh" }}>
      <MainHeader
        onClickCollapsed={() => setCollapsed(!collapsed)}
      />

      <Layout>
        <Layout.Sider
          trigger={null}
          collapsed={collapsed}
          width={isMobile ? "100%" : 260}
          collapsedWidth={isMobile ? 0 : 80}
          style={{
            background: token.colorBgContainer,
            paddingTop: 10,
            userSelect: "none"
          }}
        >
          <MainOption
            setCollapsed={setCollapsed}
          />
        </Layout.Sider>

        <Layout.Content
          style={{
            padding: isMobile ? 10 : 20,
            paddingBottom: 0,
            minHeight: 280,
            background: token.colorBgLayout,
          }}
        >
          <Flex style={{ width: "100%", height: "100%" }} vertical>
            <MainBreadcrumb />
            <Outlet />
          </Flex>
        </Layout.Content>
      </Layout>
    </Flex>
  )
}

export default Interface