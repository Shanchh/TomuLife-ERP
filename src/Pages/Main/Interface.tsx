import { Button, message } from 'antd'
import React from 'react'

const Interface = () => {
  return (
    <Button onClick={() => message.success("成功")}>點擊顯示訊息</Button>
  )
}

export default Interface