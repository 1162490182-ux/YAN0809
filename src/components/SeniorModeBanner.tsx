import React from "react";
import { Mic, Layers, Coffee, Sparkles } from "lucide-react";

interface SeniorModeBannerProps {
  onOpenVoiceModal: () => void;
  onQuickRent: () => void;
  onFindTea: () => void;
  onOpenWarningModal?: () => void;
  hasActiveWarning?: boolean;
}

export const SeniorModeBanner: React.FC<SeniorModeBannerProps> = ({
  onOpenVoiceModal,
  onQuickRent,
  onFindTea,
  onOpenWarningModal,
  hasActiveWarning,
}) => {
  return (
    <div className="bg-[#F6E9D3] border-b-2 border-[#184D97] p-4 sm:p-5 text-[#184D97] shadow-sm">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Simplified Header Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap max-w-full">
            <span className="bg-[#184D97] text-[#F6D081] text-xs sm:text-sm px-3.5 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5 shadow-xs border-2 border-[#184D97] max-w-full">
              <Sparkles className="w-4 h-4 fill-current text-[#F6D081] shrink-0" />
              <span>长辈关怀模式（特大清晰字号与对比度）</span>
            </span>
            {hasActiveWarning && onOpenWarningModal && (
              <button
                onClick={onOpenWarningModal}
                className="bg-[#184D97] text-[#F6D081] text-xs sm:text-sm px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1 border-2 border-[#F6D081] animate-bounce shadow-xs max-w-full text-left"
              >
                <span>⚠️ 收到一条温情提醒（点击查看）</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Concise Big Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {/* AI Voice Assistant Primary Button */}
          <button
            onClick={onOpenVoiceModal}
            className="bg-[#184D97] text-[#F6D081] hover:bg-[#1888BF] border-2 border-[#184D97] rounded-2xl py-3.5 px-3 sm:px-4 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl font-black active:scale-95 transition-transform shadow-md max-w-full"
          >
            <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-[#F6D081] shrink-0" />
            <span>AI 语音助手（点击说话）</span>
          </button>

          {/* Quick Rent */}
          <button
            onClick={onQuickRent}
            className="bg-white border-2 border-[#184D97] text-[#184D97] hover:bg-[#F6D081] rounded-2xl py-3.5 px-3 sm:px-4 flex items-center justify-center gap-2 sm:gap-2.5 text-base sm:text-lg md:text-xl font-extrabold active:scale-95 transition-transform shadow-sm max-w-full"
          >
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-[#1888BF] shrink-0" />
            <span>一键扫码租借</span>
          </button>

          {/* Quick Tea */}
          <button
            onClick={onFindTea}
            className="bg-white border-2 border-[#184D97] text-[#184D97] hover:bg-[#F6D081] rounded-2xl py-3.5 px-3 sm:px-4 flex items-center justify-center gap-2 sm:gap-2.5 text-base sm:text-lg md:text-xl font-extrabold active:scale-95 transition-transform shadow-sm max-w-full"
          >
            <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#34B8C5] shrink-0" />
            <span>找歇脚饮茶点</span>
          </button>
        </div>
      </div>
    </div>
  );
};
