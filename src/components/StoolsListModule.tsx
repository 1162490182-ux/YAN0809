import React, { useState } from "react";
import { StoolModule, UserProfile } from "../types";
import { Battery, Zap, Search, Layers, MapPin } from "lucide-react";

interface StoolsListModuleProps {
  stools: StoolModule[];
  userProfile: UserProfile;
  onOpenScanModal: () => void;
  onSelectStool: (stool: StoolModule) => void;
  isSeniorMode: boolean;
}

export const StoolsListModule: React.FC<StoolsListModuleProps> = ({
  stools,
  userProfile,
  onOpenScanModal,
  onSelectStool,
  isSeniorMode,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStools = stools.filter((stool) => {
    const matchesStatus =
      filterStatus === "all" || stool.status === filterStatus;
    const matchesSearch =
      stool.name.includes(searchQuery) ||
      stool.hubName.includes(searchQuery) ||
      stool.locationDescription.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header & Scan Callout */}
      <div
        className={`rounded-3xl border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isSeniorMode
            ? "p-6 bg-[#F9F8F6] border-[#5C5C4A] text-[#1C1E36]"
            : "p-5 bg-white border-[#9CA8B3]/30 text-[#2D312E]"
        }`}
      >
        <div>
          <h2
            className={`font-extrabold tracking-tight ${
              isSeniorMode ? "text-2xl sm:text-3xl text-[#1C1E36]" : "text-xl sm:text-2xl text-[#2D312E]"
            }`}
          >
            蒲公英共享模块资源库
          </h2>
          <p className={`font-normal mt-0.5 ${isSeniorMode ? "text-base text-[#4A5A6A]" : "text-xs text-[#4A5A6A]"}`}>
            分布在大马弄牌坊、太庙广场与察院前巷子等核心堆放点
          </p>
        </div>

        <button
          onClick={onOpenScanModal}
          className={`px-5 py-3 rounded-2xl font-bold text-sm shadow-xs flex items-center gap-2 active:scale-95 transition-transform ${
            isSeniorMode
              ? "bg-[#2E5C31] text-white hover:bg-[#254b28]"
              : "bg-[#A5A58D] text-white hover:bg-[#8e8e78]"
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>扫码解锁可用模块</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className={`flex p-1 rounded-2xl border w-full sm:w-auto ${
          isSeniorMode ? "bg-[#F9F8F6] border-[#5C5C4A]" : "bg-[#F9F8F6] border-[#9CA8B3]/30"
        }`}>
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterStatus === "all"
                ? isSeniorMode ? "bg-[#5C5C4A] text-white" : "bg-[#A5A58D] text-white"
                : "text-[#4A5A6A]"
            }`}
          >
            全部 ({stools.length})
          </button>
          <button
            onClick={() => setFilterStatus("idle")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterStatus === "idle"
                ? isSeniorMode ? "bg-[#2E5C31] text-white" : "bg-[#A3B19B] text-white"
                : "text-[#4A5A6A]"
            }`}
          >
            空闲可租 ({stools.filter((s) => s.status === "idle").length})
          </button>
          <button
            onClick={() => setFilterStatus("rented")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterStatus === "rented"
                ? isSeniorMode ? "bg-[#4A5A6A] text-white" : "bg-[#9CA8B3] text-white"
                : "text-[#4A5A6A]"
            }`}
          >
            使用中 ({stools.filter((s) => s.status === "rented").length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#4A5A6A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索堆放点或编号..."
            className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border text-xs sm:text-sm font-medium focus:outline-none focus:border-[#5C5C4A] ${
              isSeniorMode
                ? "bg-[#F9F8F6] border-[#5C5C4A] text-[#1C1E36] placeholder-[#4A5A6A]"
                : "bg-white border-[#9CA8B3]/30 text-[#2D312E] placeholder-[#4A5A6A]"
            }`}
          />
        </div>
      </div>

      {/* Stool Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredStools.map((stool) => (
          <div
            key={stool.id}
            onClick={() => {
              if (stool.status !== "idle") {
                alert(`该模块【${stool.code}】当前已被其他用户租用中（租用人：${stool.renterName || "老街居民"}），无法点击扫码。`);
                return;
              }
              onSelectStool(stool);
            }}
            className={`rounded-2xl border transition-all space-y-3 ${
              stool.status === "idle" ? "cursor-pointer hover:shadow-xs hover:border-[#184D97]" : "cursor-not-allowed opacity-80 bg-gray-50/50"
            } ${
              isSeniorMode
                ? "p-6 bg-[#F6E9D3] border-[#184D97] text-[#184D97]"
                : "p-4 bg-white border-[#BEC7E1]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    stool.status === "idle"
                      ? isSeniorMode ? "bg-[#2E5C31] text-white" : "bg-[#A3B19B]/30 text-[#2E5C31]"
                      : stool.status === "rented"
                      ? isSeniorMode ? "bg-[#4A5A6A] text-white" : "bg-[#9CA8B3]/30 text-[#4A5A6A]"
                      : isSeniorMode ? "bg-[#8B2525] text-white" : "bg-[#B59A9A]/30 text-[#8B2525]"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`font-bold ${isSeniorMode ? "text-xl sm:text-2xl text-[#1C1E36]" : "text-xs sm:text-sm text-[#2D312E]"}`}>
                    {stool.name}
                  </h4>
                  <span className={`font-mono ${isSeniorMode ? "text-xs sm:text-sm font-bold text-[#4A5A6A]" : "text-[10px] text-[#4A5A6A]"}`}>
                    {stool.code}
                  </span>
                </div>
              </div>

              <span
                className={`font-bold rounded-full shrink-0 whitespace-nowrap inline-flex items-center justify-center ${
                  stool.status === "idle"
                    ? isSeniorMode ? "bg-[#2E5C31] text-white text-xs sm:text-sm px-3 py-1" : "bg-[#A3B19B]/30 text-[#2E5C31] text-[10px] sm:text-xs px-2.5 py-1"
                    : stool.status === "rented"
                    ? isSeniorMode ? "bg-[#4A5A6A] text-white text-xs sm:text-sm px-3 py-1" : "bg-[#9CA8B3]/30 text-[#4A5A6A] text-[10px] sm:text-xs px-2.5 py-1"
                    : isSeniorMode ? "bg-[#8B2525] text-white text-xs sm:text-sm px-3 py-1 animate-pulse" : "bg-[#B59A9A]/30 text-[#8B2525] text-[10px] sm:text-xs px-2.5 py-1 animate-pulse"
                }`}
              >
                {stool.status === "idle"
                  ? "空闲可租"
                  : stool.status === "rented"
                  ? "使用中"
                  : "违规预警"}
              </span>
            </div>

            <p className={`line-clamp-2 flex items-center gap-1 ${isSeniorMode ? "text-base sm:text-lg font-bold text-[#1C1E36]" : "text-xs sm:text-sm text-[#4A5A6A]"}`}>
              <MapPin className="w-4 h-4 text-[#2E5C31] shrink-0" />
              <span>{stool.locationDescription}</span>
            </p>

            <div className={`flex items-center justify-between pt-2 border-t text-xs font-bold ${
              isSeniorMode ? "border-[#5C5C4A] text-[#1C1E36]" : "border-[#9CA8B3]/30 text-[#4A5A6A]"
            }`}>
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-[#2E5C31]" /> 电量{" "}
                {stool.batteryLevel}%
              </span>
              <span className={`font-extrabold ${isSeniorMode ? "text-[#2E5C31]" : "text-[#A5A58D]"}`}>
                {userProfile.creditScore >= 650 ? "免押金" : "押金￥1"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

