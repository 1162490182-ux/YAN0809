import React, { useState } from "react";
import { UserRole, UserProfile } from "../types";
import { demoProfiles } from "../data/dandelionData";
import { Sparkles, QrCode, ShieldCheck, Eye, Store, Coffee, BarChart3, HelpCircle, Layers, UserCheck, ChevronDown } from "lucide-react";

interface HeaderNavbarProps {
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  userProfile: UserProfile;
  onSelectProfile: (profile: UserProfile) => void;
  onToggleSeniorMode: () => void;
  onOpenScanModal: () => void;
  onOpenVoiceModal: () => void;
  onOpenCover?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentRole,
  onChangeRole,
  userProfile,
  onSelectProfile,
  onToggleSeniorMode,
  onOpenScanModal,
  onOpenVoiceModal,
  onOpenCover,
}) => {
  const isSenior = userProfile.isSeniorMode;
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        isSenior
          ? "bg-[#F6E9D3] border-2 border-[#184D97] text-[#184D97] shadow-md"
          : "bg-[#F6E9D3]/95 backdrop-blur-md border-[#BEC7E1] text-[#184D97] shadow-xs"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-1.5">
        {/* Row 1: Brand Logo & Title + Primary Actions */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Name (Static Dandelion Logo) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                isSenior
                  ? "bg-[#184D97] text-[#F6D081] shadow-xs border-2 border-[#184D97]"
                  : "bg-[#184D97] text-[#F6D081] shadow-xs"
              }`}
            >
              {/* Dandelion Logo Vector */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2a1 1 0 0 1 1 1v2.071a7.002 7.002 0 0 1 5.657 5.657H21a1 1 0 1 1 0 2h-2.071A7.002 7.002 0 0 1 13 18.357V21a1 1 0 1 1-2 0v-2.643A7.002 7.002 0 0 1 5.343 12.714H3a1 1 0 1 1 0-2h2.343A7.002 7.002 0 0 1 11 5.071V3a1 1 0 0 1 1-1zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
              </svg>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <h1
                className={`font-extrabold tracking-tight leading-none ${
                  isSenior ? "text-base sm:text-lg text-[#184D97]" : "text-xs sm:text-sm text-[#184D97]"
                }`}
              >
                蒲公英微空间
              </h1>
              <span
                className={`px-1.5 py-0.5 rounded-md font-extrabold leading-none shrink-0 ${
                  isSenior
                    ? "bg-[#1888BF] text-white text-xs border border-[#1888BF]"
                    : "bg-[#BEC7E1]/50 text-[#184D97] text-[9px] sm:text-[10px] border border-[#BEC7E1]"
                }`}
              >
                大马弄街区
              </span>
            </div>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Senior Mode Toggle Button */}
            <button
              onClick={onToggleSeniorMode}
              className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1 transition-transform active:scale-95 ${
                isSenior
                  ? "bg-[#184D97] text-[#F6D081] text-xs sm:text-sm shadow-md border-2 border-[#184D97]"
                  : "bg-[#1888BF] text-white text-[10px] sm:text-xs hover:bg-[#184D97]"
              }`}
              title="一键切换长辈关怀模式"
            >
              <Eye className="w-4 h-4" />
              <span>{isSenior ? "退出长辈模式" : "长辈关怀"}</span>
            </button>

            {/* WeChat Scan Quick Button (Full visibility) */}
            <button
              onClick={onOpenScanModal}
              className={`px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1 transition-transform active:scale-95 shrink-0 ${
                isSenior
                  ? "bg-[#34B8C5] text-[#184D97] text-xs sm:text-sm shadow-md border-2 border-[#184D97]"
                  : "bg-[#34B8C5] text-[#184D97] text-[10px] sm:text-xs hover:bg-[#1888BF] hover:text-white shadow-xs"
              }`}
            >
              <QrCode className="w-4 h-4 shrink-0" />
              <span>扫码解锁</span>
            </button>
          </div>
        </div>

        {/* Row 2: Identity Badge & Return to Login Button */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#BEC7E1]">
          {/* Current Active User Profile Badge (Static info display) */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full border min-w-0 shrink ${
                isSenior
                  ? "bg-white border-2 border-[#184D97] text-[#184D97] shadow-sm"
                  : "bg-white border-[#BEC7E1] text-[#184D97]"
              }`}
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-[#184D97] shrink-0"
              />
              <div className="flex items-center gap-1 text-left min-w-0">
                <span className={`font-extrabold truncate max-w-[80px] sm:max-w-[140px] ${isSenior ? "text-sm sm:text-base" : "text-xs"}`}>
                  {userProfile.name}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                  userProfile.role === "vendor"
                    ? "bg-[#1888BF] text-white"
                    : userProfile.role === "admin"
                    ? "bg-[#184D97] text-[#F6D081]"
                    : "bg-[#A7D9C7] text-[#184D97]"
                }`}>
                  {userProfile.role === "vendor" ? "店主/摊主" : userProfile.role === "admin" ? "社区管理" : "居民/游客"}
                </span>
              </div>
            </div>

            {/* Return to Login Button */}
            {onOpenCover && (
              <button
                onClick={onOpenCover}
                className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] sm:text-xs shrink-0 border border-[#184D97] transition-transform active:scale-95 ${
                  isSenior
                    ? "bg-[#184D97] text-[#F6D081]"
                    : "bg-[#F6D081] text-[#184D97] hover:bg-[#34B8C5]"
                }`}
                title="返回登录界面选择角色"
              >
                返回登录
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Credit Score Pill */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-extrabold shrink-0 ${
                isSenior
                  ? "bg-[#184D97] text-[#F6D081] border-2 border-[#184D97] text-xs sm:text-sm"
                  : "bg-[#A7D9C7] text-[#184D97] border border-[#A7D9C7] text-[10px] sm:text-xs"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>蒲公英信用: {userProfile.creditScore}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

