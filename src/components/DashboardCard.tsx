
import { cn } from "@/lib/utils";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
}) => {
  const getTrendColor = () => {
    if (trend === undefined) return "";
    if (trend > 0) return "text-green-500";
    if (trend < 0) return "text-red-500";
    return "text-gray-500";
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return "↑";
    if (trend < 0) return "↓";
    return "→";
  };

  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div className={cn("text-2xl font-semibold", valueClassName)}>
          {value}
        </div>
        {trend !== undefined && (
          <div className={cn("text-sm flex items-center", getTrendColor())}>
            <span>{getTrendIcon()}</span>
            <span className="ml-1">{Math.abs(trend)}%</span>
            {trendLabel && <span className="ml-1 text-gray-500 text-xs">{trendLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
