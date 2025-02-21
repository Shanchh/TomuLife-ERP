import { Flex } from 'antd'
import React, { useState } from 'react'
import MainHeader from './MainHeader'
import { isMobile } from "react-device-detect";

const Interface = () => {
  const [collapsed, setCollapsed] = useState<boolean>(isMobile);

  return (
    <Flex vertical={true} style={{ minHeight: "100vh" }}>
      <MainHeader
        onClickCollapsed={() => setCollapsed(!collapsed)}
      />

    </Flex>
  )
}

export default Interface