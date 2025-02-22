import React from "react";
import { Breadcrumb } from "antd";
import { useLocation, Link } from "react-router-dom";

const breadcrumbNameMap: Record<string, string> = {
    "/": "首頁",
    "/finance": "帳務",
    "/finance/purchase-management": "進貨管理",
    "/finance/purchase-management/statistics": "進貨統計",
    "/finance/purchase-management/report": "進貨申報",
    "/finance/purchase-management/details": "進貨明細",
    "/finance/sales-management": "銷售管理",
    "/finance/sales-management/statistics": "銷售統計",
    "/finance/sales-management/report": "銷售申報",
    "/finance/sales-management/details": "銷售明細",
    "/finance/activity-management": "活動管理",
    "/finance/activity-management/overview": "活動總覽",
    "/finance/activity-management/report": "活動申報",
    "/system": "系統",
    "/system/customer-management": "客戶管理",
    "/system/product-management": "商品管理",
    "/system/role-management": "角色管理",
    "/system/user-management": "用戶管理",
};

const MainBreadcrumb: React.FC = () => {
    const location = useLocation();

    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const breadcrumbItems = [
        {
            title: <Link to="/">首頁</Link>,
            key: "home",
        },
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSnippets.length - 1;
            return {
                title: isLast ? breadcrumbNameMap[url] || url : <Link to={url}>{breadcrumbNameMap[url] || url}</Link>,
                key: url,
            };
        }),
    ];

    return (
        <>
            <Breadcrumb items={breadcrumbItems} />
            <span style={{ fontWeight: "bold", fontSize: 20, margin: "10px 0px" }}>{breadcrumbNameMap[location.pathname]}</span>
        </>
    );
};

export default MainBreadcrumb;
