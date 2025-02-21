import { Menu, MenuProps } from "antd";
import React from "react";
import { HomeOutlined, SettingOutlined, FileSearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

interface MyMenuProps {
    setCollapsed?: (collapsed: boolean) => void;
}

const MainOption: React.FC<MyMenuProps> = ({ setCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems: MenuProps["items"] = [
        {
            key: "/",
            label: "首頁",
            icon: <HomeOutlined />
        },
        {
            key: "/accounting",
            label: "帳務管理",
            icon: <FileSearchOutlined />,
            children: [
                {
                    key: "/accounting/submit-order",
                    label: "報帳"
                },
                {
                    key: "/accounting/order-manage",
                    label: "訂單管理"
                },
            ]
        },
        {
            key: "/setting",
            label: "設置",
            icon: <SettingOutlined />
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