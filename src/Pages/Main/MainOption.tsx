import { Menu, MenuProps } from "antd";
import React from "react";
import { HomeOutlined, SettingOutlined, AccountBookOutlined, LineChartOutlined, ToolOutlined, ContainerOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useAuth } from "../../Auth/AuthProvider";

interface MyMenuProps {
    setCollapsed?: (collapsed: boolean) => void;
}

const MainOption: React.FC<MyMenuProps> = ({ setCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userProfile } = useAuth();

    const menuItems: MenuProps["items"] = [
        {
            key: "/",
            label: "首頁",
            icon: <HomeOutlined />
        },
        {
            key: "/finance",
            label: "帳務",
            icon: <AccountBookOutlined />,
            children: [
                {
                    key: "/finance/Inventory-overview",
                    label: "庫存總覽",
                },
                {
                    key: "/finance/purchase-management",
                    label: "進貨管理",
                    children: [
                        {
                            key: "/finance/purchase-management/statistics",
                            label: "進貨統計"
                        },
                        {
                            key: "/finance/purchase-management/report",
                            label: "進貨申報"
                        },
                        {
                            key: "/finance/purchase-management/details",
                            label: "進貨明細"
                        },
                    ]
                },
                {
                    key: "/finance/sales-management",
                    label: "銷售管理",
                    children: [
                        {
                            key: "/finance/sales-management/statistics",
                            label: "銷售統計"
                        },
                        {
                            key: "/finance/sales-management/report",
                            label: "銷售申報"
                        },
                        {
                            key: "/finance/sales-management/details",
                            label: "銷售明細"
                        },
                    ]
                },
                {
                    key: "/finance/activity-management",
                    label: "活動管理",
                    children: [
                        {
                            key: "/finance/activity-management/overview",
                            label: "活動總覽"
                        },
                        {
                            key: "/finance/activity-management/report",
                            label: "活動申報"
                        },
                    ]
                },
            ]
        },
        {
            key: "/analyze",
            label: "分析",
            icon: <LineChartOutlined />,
            children: [
                {
                    key: "/analyze/customer",
                    label: "客戶分析",
                },
            ]
        },
        {
            key: "/system",
            label: "系統",
            icon: <SettingOutlined />,
            children: [
                {
                    key: "/system/customer-management",
                    label: "客戶管理",
                },
                {
                    key: "/system/product-management",
                    label: "商品管理",
                },
                {
                    key: "/system/role-management",
                    label: "角色管理",
                },
                {
                    key: "/system/user-management",
                    label: "用戶管理",
                },
            ]
        },
        {
            key: "/setting",
            label: "設置",
            icon: <ToolOutlined />
        }
    ];

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        navigate(e.key);
        if (isMobile && setCollapsed) setCollapsed(true);
    };

    return (
        <Menu
            theme="light"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
            style={{ border: "none" }}
            items={menuItems}
        />
    );
};

export default MainOption;