import React from "react";
import { UserProfile } from "../types";
import { demoProfiles } from "../data/dandelionData";
import { Store, Coffee, ShieldCheck, ArrowRight, Sparkles, Layers, Clock, UserCheck } from "lucide-react";

interface AppCoverProps {
  onSelectProfile: (profile: UserProfile) => void;
  isSeniorMode?: boolean;
}

export const AppCover: React.FC<AppCoverProps> = ({ onSelectProfile }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#184D97] text-[#F6E9D3] flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-in fade-in duration-300">
      <div className="max-w-xl w-full my-auto bg-[#184D97] border-2 border-[#BEC7E1] rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-3.5 max-h-[95vh] flex flex-col justify-between">
        {/* Decorative Monet impressionist glow using Palette */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#34B8C5]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#A7D9C7]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Tag - Palette Gold & Deep Cobalt Accent */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6D081] text-[#184D97] text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-[#184D97]" />
          <span>杭州上城 · 大马弄老街微空间改造实景工程</span>
        </div>

        {/* Main Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6E9D3] tracking-tight leading-tight">
            蒲公英微空间
          </h1>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#1888BF]/30 border border-[#BEC7E1] space-y-0.5">
            <Clock className="w-4 h-4 text-[#F6D081]" />
            <div className="text-xs font-bold text-white">分时使用</div>
            <div className="text-[10px] text-[#F6E9D3]/80 leading-tight">早市摊位<br />午后小歇</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1888BF]/30 border border-[#BEC7E1] space-y-0.5">
            <Layers className="w-4 h-4 text-[#34B8C5]" />
            <div className="text-xs font-bold text-white">折叠模块</div>
            <div className="text-[10px] text-[#F6E9D3]/80 leading-tight">扫码即用<br />统一归还</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1888BF]/30 border border-[#BEC7E1] space-y-0.5">
            <ShieldCheck className="w-4 h-4 text-[#A7D9C7]" />
            <div className="text-xs font-bold text-white">蒲公英信用</div>
            <div className="text-[10px] text-[#F6E9D3]/80 leading-tight">免押金<br />履约加分</div>
          </div>
        </div>

        {/* Select Role Entry */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm font-extrabold text-[#F6E9D3] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#F6D081]" />
              <span>请选择登录角色身份：</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Role 1: Vendor */}
            <button
              onClick={() => onSelectProfile(demoProfiles.find((p) => p.role === "vendor") || demoProfiles[1])}
              className="p-2.5 rounded-xl bg-[#F6E9D3] hover:bg-[#F6D081] text-[#184D97] border-2 border-[#BEC7E1] text-left transition-all group flex flex-col justify-between space-y-1.5 shadow-md active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-[#1888BF] text-white">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#1888BF] text-white">
                  店主 / 摊主
                </span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#184D97]">店主 / 摊主</div>
                <div className="text-[11px] text-[#184D97]/80 font-medium">门前扩展 & 摆摊租借</div>
              </div>
            </button>

            {/* Role 2: Resident */}
            <button
              onClick={() => onSelectProfile(demoProfiles.find((p) => p.role === "resident") || demoProfiles[0])}
              className="p-2.5 rounded-xl bg-[#F6E9D3] hover:bg-[#F6D081] text-[#184D97] border-2 border-[#BEC7E1] text-left transition-all group flex flex-col justify-between space-y-1.5 shadow-md active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-[#34B8C5] text-[#184D97]">
                  <Coffee className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#A7D9C7] text-[#184D97]">
                  居民 / 游客
                </span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#184D97]">居民 / 游客</div>
                <div className="text-[11px] text-[#184D97]/80 font-medium">时空导览 & 避堵歇脚</div>
              </div>
            </button>

            {/* Role 3: Admin */}
            <button
              onClick={() => onSelectProfile(demoProfiles.find((p) => p.role === "admin") || demoProfiles[2])}
              className="p-2.5 rounded-xl bg-[#F6E9D3] hover:bg-[#F6D081] text-[#184D97] border-2 border-[#BEC7E1] text-left transition-all group flex flex-col justify-between space-y-1.5 shadow-md active:scale-98"
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-[#184D97] text-[#F6D081]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#184D97] text-[#F6D081]">
                  社区管理
                </span>
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#184D97]">社区管理</div>
                <div className="text-[11px] text-[#184D97]/80 font-medium">巡检预警 & 信用干预</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
