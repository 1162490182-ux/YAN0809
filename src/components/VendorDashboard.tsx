import React from "react";
import { StoolModule, TimeSlot, UserProfile } from "../types";
import {
  Clock,
  Zap,
  CheckCircle2,
  MapPin,
  Battery,
  Store,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface VendorDashboardProps {
  stools: StoolModule[];
  userProfile: UserProfile;
  activeTimeMode: TimeSlot;
  onOpenScanModal: () => void;
  onReturnStool: (stoolId: string) => void;
  isSeniorMode: boolean;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({
  stools,
  userProfile,
  activeTimeMode,
  onOpenScanModal,
  onReturnStool,
  isSeniorMode,
}) => {
  const rentedStool = stools.find((s) => s.id === userProfile.rentedStoolId);
  const idleStoolsCount = stools.filter((s) => s.status === "idle").length;

  return (
    <div className="space-y-5">
      {/* Vendor Header Card */}
      <div
        className={`rounded-3xl border shadow-xs relative overflow-hidden ${
          isSeniorMode
            ? "p-6 bg-[#F9F8F6] text-[#1C1E36] border-[#5C5C4A]"
            : "p-5 sm:p-6 bg-[#2D312E] text-white border-[#4A5A6A]"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border ${
              isSeniorMode
                ? "bg-[#5C5C4A] text-white border-[#5C5C4A]"
                : "bg-[#4A5A6A] text-white border-[#9CA8B3]/30"
            }`}>
              <Store className="w-4 h-4 text-[#A5A58D]" />
              <span>摊贩 / 店主工作台</span>
              <span>·</span>
              <span>{activeTimeMode === "morning" ? "早市摆摊" : "午后茶憩"}</span>
            </div>
            <h2 className={`font-extrabold tracking-tight ${isSeniorMode ? "text-2xl sm:text-3xl text-[#1C1E36]" : "text-xl sm:text-2xl text-white"}`}>
              欢迎您，{userProfile.name}
            </h2>
            <p className={`font-normal ${isSeniorMode ? "text-base text-[#4A5A6A]" : "text-xs sm:text-sm text-[#9CA8B3]"}`}>
              大马弄微空间分时租赁 · 上午摆摊临时座 · 午后门前茶憩延展
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenScanModal}
              className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-md flex items-center gap-2 active:scale-95 transition-transform ${
                isSeniorMode
                  ? "bg-[#2E5C31] text-white hover:bg-[#254b28]"
                  : "bg-[#A5A58D] text-white hover:bg-[#8e8e78]"
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>扫码锁定可用模块</span>
            </button>
          </div>
        </div>
      </div>

      {/* Current Active Rented Stool Status Box */}
      {rentedStool ? (
        <div className="bg-[#e8ece7] border border-[#c2ccc0] p-5 rounded-3xl space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#384a39] font-bold text-base sm:text-lg">
              <CheckCircle2 className="w-5 h-5 text-[#586856]" />
              <span>当前正在租用：{rentedStool.name}</span>
            </div>
            <span className="px-3 py-1 bg-[#788876] text-[#fafaf7] font-semibold text-xs rounded-full">
              已租用 {userProfile.rentalDurationMinutes} 分钟
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm bg-[#fafaf7] p-3.5 rounded-2xl border border-[#d8e0d7] text-[#383d39] font-medium shadow-2xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#586856]" />
              <span>位置：{rentedStool.locationDescription}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-[#586856]" />
              <span>电量：{rentedStool.batteryLevel}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#4e5c4d] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#586856]" />
              <span>按时归还加信用分 +5</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onReturnStool(rentedStool.id)}
              className="px-5 py-2.5 bg-[#383d39] text-[#e8d2b8] hover:bg-[#2b2e2c] font-semibold rounded-2xl text-xs sm:text-sm shadow-2xs active:scale-95 transition-transform"
            >
              归还至附近堆放点
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#fafaf7] border border-[#e2ddd5] p-4 rounded-3xl text-center space-y-2 shadow-2xs">
          <p className="font-semibold text-[#383d39] text-sm">
            您当前暂未租用共享模块。附近有 {idleStoolsCount} 个可租模块等待使用。
          </p>
          <button
            onClick={onOpenScanModal}
            className="text-xs font-semibold text-[#586856] hover:underline"
          >
            点击一键扫码开锁
          </button>
        </div>
      )}

      {/* Time-slot Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morning Scenario Card */}
        <div
          className={`p-5 rounded-3xl border space-y-3 transition-colors ${
            activeTimeMode === "morning"
              ? "bg-[#f7f3ee] border-[#dcd1c4]"
              : "bg-[#fafaf7] border-[#e2ddd5] opacity-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#e8ded3] text-[#6e5a48] border border-[#dcd1c4]">
              早市时段 (06:00 - 12:00)
            </span>
            <span className="text-xs font-normal text-[#787d78]">摊贩优先</span>
          </div>
          <h3 className="text-base font-bold text-[#383d39]">
            流动摊贩临时座位租赁
          </h3>
          <p className="text-xs text-[#585e58] leading-relaxed">
            专为摆摊大叔大妈设计，无须携带笨重木凳。直接在指定堆放点扫码拎取，摆摊结束归还，不占主街公共通道。
          </p>
          <ul className="text-xs text-[#484e48] space-y-1.5 font-medium">
            <li className="flex items-center gap-1.5 text-[#384a39]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#586856]" />
              <span>免押金使用（蒲公英信用分 ≥ 650）</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#384a39]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#586856]" />
              <span>符合大马弄摆摊准入规范</span>
            </li>
          </ul>
        </div>

        {/* Afternoon Scenario Card */}
        <div
          className={`p-5 rounded-3xl border space-y-3 transition-colors ${
            activeTimeMode === "afternoon"
              ? "bg-[#e8ece7] border-[#c2ccc0]"
              : "bg-[#fafaf7] border-[#e2ddd5] opacity-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d8e2d7] text-[#384a39] border border-[#c2ccc0]">
              午后茶憩 (12:00 - 20:00)
            </span>
            <span className="text-xs font-normal text-[#787d78]">固定门店优先</span>
          </div>
          <h3 className="text-base font-bold text-[#383d39]">
            门店外部微空间茶憩延展
          </h3>
          <p className="text-xs text-[#585e58] leading-relaxed">
            下午菜市歇业后，固定门店可申请租用共享模块在檐下摆设茶座，接纳晒太阳喝茶的游客与居民，提高商业转化率。
          </p>
          <ul className="text-xs text-[#484e48] space-y-1.5 font-medium">
            <li className="flex items-center gap-1.5 text-[#384a39]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#586856]" />
              <span>激活街区午后微经济</span>
            </li>
            <li className="flex items-center gap-1.5 text-[#384a39]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#586856]" />
              <span>统一合规堆放，避免占用消防道</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

