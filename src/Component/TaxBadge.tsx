import React from "react";
import { Badge } from "antd";

interface TaxBadgeProps {
  value: string | null | undefined;
}

const TaxBadge: React.FC<TaxBadgeProps> = ({ value }) => {
  if (value === "included") {
    return <Badge status="success" text="含稅" />;
  }
  if (value === "excluded") {
    return <Badge status="error" text="未稅" />;
  }
  if (value === null || value === undefined) {
    return <span>-</span>;
  }
  return <Badge status="default" text="加載中..." />;
};

export default TaxBadge;