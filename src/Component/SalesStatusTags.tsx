import { Tag } from "antd"
import React from 'react'

const SalesStatusTags = ({ status }: { status: string }) => {
    switch (status) {
        case "unpaid":
            return <Tag color="red">
                未付款
            </Tag>
        case "paid":
            return <Tag color="green">
                已收款
            </Tag>
        case "gift":
            return <Tag color="orange">
                贈送
            </Tag>
        default:
            return <Tag color="default">
                加載中..
            </Tag>
    }
}

export default SalesStatusTags