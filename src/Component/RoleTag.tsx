import { Tag } from "antd";
import React from "react";
import { Role } from "../../types";

interface RoleTagProps {
    roleData: Role[];
    role: string;
}

const RoleTag: React.FC<RoleTagProps> = ({ role, roleData }) => {
    const matchedRole = roleData.find(r => r.name === role);

    return (
        <Tag style={{ backgroundColor: matchedRole?.color || "#666", color: "#fff" }}>
            {matchedRole?.tag || role}
        </Tag>
    );
};

export default RoleTag;
