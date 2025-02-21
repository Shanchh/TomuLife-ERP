import React from 'react';
import { Layout, Avatar, Dropdown, Space, MenuProps, Button, theme, Flex } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../../Auth/AuthProvider';
import { auth } from '../../Auth/FirebaseConfig';

const { Header } = Layout;

interface MyHeaderProps {
    onClickCollapsed: () => void
}

const MainHeader: React.FC<MyHeaderProps> = ({ onClickCollapsed }) => {
    const { userProfile, setUser } = useAuth();
    const { token } = theme.useToken();

    const handleLogout = () => {
        auth.signOut().then(() => {
            setUser(null);
            window.location.reload();
        }).catch((error) => {
            console.error("登出失敗: ", error);
        });
    };

    const userActionItems: MenuProps["items"] = [
        {
            key: 1,
            label: "登出",
            onClick: () => handleLogout()
        },
    ];

    return (
        <>
            <Header
                style={{
                    background: '#FFF',
                    padding: "0 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd"
                }}
            >
                <Flex justify="space-between" align="center" style={{ width: 230 }}>
                    <h1 style={{
                        fontSize: "25px",
                        fontWeight: "bold",
                        fontFamily: '"Lucida Console", "微軟正黑體", "新細明體", sans-serif',
                    }}>
                        TomuLifeERP
                    </h1>

                    <Flex justify="center" align="center">
                        <Button type="text" onClick={onClickCollapsed}>
                            <MenuOutlined />
                        </Button>
                    </Flex>
                </Flex>

                <Space>
                    <Dropdown menu={{ items: userActionItems }}>
                        <Button type='text' style={{ color: "#666", padding: 20 }}>
                            <Space>
                                <Avatar style={{ backgroundColor: token.colorPrimaryHover }} icon={<UserOutlined />} />
                                <span>{userProfile?.nickname}</span>
                            </Space>
                        </Button>
                    </Dropdown>
                </Space>
            </Header>
        </>
    );
};

export default MainHeader;
