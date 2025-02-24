import { Button } from 'antd'
import React from 'react'
import { DeleteOutlined } from '@ant-design/icons';

const DeleteUserBtn = () => {
  return (
    <Button variant="link" color="danger">
      <DeleteOutlined />
    </Button>
  )
}

export default DeleteUserBtn