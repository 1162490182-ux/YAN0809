import React from "react";
import { UserRole } from "../types";
import { Home, Map, Layers, BarChart3, User } from "lucide-react";

interface BottomTabBarProps {
  currentRole: UserRole;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  isSeniorMode: boolean;
  unreadAlertsCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentRole,
  activeTab,
  onChangeTab,
  isSeniorMode,
  unreadAlertsCount,
}) => {
  const allNavItems = [
    { id: "home", label: "首页", icon: Home, show: true },
    { id: "map", label: "智慧地图", icon: Map, show: true },
    { id: "stools", label: "共享模块", icon: Layers, show: currentRole !== "admin" },
    {
      id: "cockpit",
      label: "数字监管",
      icon: BarChart3,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : null,
      show: currentRole === "admin",
    },
    {
      id: "credit",
      label: "我的",
      icon: User,
      show: true,
    },
  ];

  const visibleNavItems = allNavItems.filter((item) => item.show);

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 border-t transition-colors duration-200 ${
        isSeniorMode
          ? "bg-[#F6E9D3] border-t-2 border-[#184D97] text-[#184D97] shadow-xl"
          : "bg-white/98 backdrop-blur-md border-[#BEC7E1] text-[#184D97] shadow-lg"
      }`}
    >
      <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl relative transition-all active:scale-95 ${
                isActive
                  ? isSeniorMode
                    ? "bg-[#184D97] text-[#F6D081] font-black shadow-md border-2 border-[#184D97]"
                    : "bg-[#184D97] text-white font-extrabold shadow-sm"
                  : isSeniorMode
                  ? "text-[#184D97] hover:text-[#1888BF] font-bold"
                  : "text-[#184D97]/80 hover:text-[#184D97]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isSeniorMode ? "w-6 h-6" : ""}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-[#184D97] text-[#F6D081] font-extrabold text-[10px] px-1.5 py-0.2 rounded-full border border-[#F6D081] animate-bounce">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-0.5 tracking-tight ${
                  isSeniorMode ? "text-sm sm:text-base font-extrabold" : "text-[11px] font-bold"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

