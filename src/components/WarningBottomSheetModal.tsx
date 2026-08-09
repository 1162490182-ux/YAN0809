import React, { useState } from "react";
import { AlertTriangle, PhoneCall, CheckCircle2, HelpCircle, X, ShieldAlert, Volume2 } from "lucide-react";
import { SystemAlert } from "../types";

interface WarningBottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertItem: SystemAlert | null;
  onResolve: (alertId: string) => void;
  isSeniorMode: boolean;
}

export const WarningBottomSheetModal: React.FC<WarningBottomSheetModalProps> = ({
  isOpen,
  onClose,
  alertItem,
  onResolve,
  isSeniorMode,
}) => {
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealReason, setAppealReason] = useState("");
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  if (!isOpen || !alertItem) return null;

  const handleSpeakCaringVoice = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text = `爷爷，您租用的蒲公英模块 ${alertItem.stoolCode} 好像忘记归还到堆放点了。别担心，如果有特殊情况您可以随时点击申诉或联系社区管理员帮助您。`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleConfirmResolve = () => {
    onResolve(alertItem.id);
    onClose();
  };

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    setAppealSubmitted(true);
    setTimeout(() => {
      onResolve(alertItem.id);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Bottom Sheet Container */}
      <div className={`w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto my-auto rounded-3xl p-5 sm:p-6 shadow-2xl relative border-2 animate-in slide-in-from-bottom duration-300 ${
        isSeniorMode
          ? "bg-[#F6E9D3] text-[#184D97] border-[#184D97]"
          : "bg-white text-[#184D97] border-[#BEC7E1]"
      }`}>
        {/* Handle bar for bottom sheet */}
        <div className="w-12 h-1.5 bg-[#9CA8B3]/50 rounded-full mx-auto mb-4" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#eae8e3] text-[#1C1E36] hover:bg-[#d8d5cd] border border-[#5C5C4A]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Caring Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C2A88D]/20 text-[#8B5A2B] border border-[#8B5A2B]/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-[#8B5A2B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#C2A88D]/20 text-[#8B5A2B] text-xs font-black px-2.5 py-0.5 rounded-md border border-[#8B5A2B]/40">
                AI 情绪关怀与智能预警 (置信度 78%)
              </span>
              <button
                onClick={handleSpeakCaringVoice}
                className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>播报关怀语</span>
              </button>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1C1E36] mt-1">
              蒲公英微模块温情提醒
            </h3>
            <p className="text-xs font-bold text-[#4A5A6A]">
              检测到模块 [{alertItem.stoolCode}] 超时或未平整折叠归还
            </p>
          </div>
        </div>

        {/* Caring Voice Bubble */}
        <div className="bg-[#C2A88D]/20 border-2 border-[#8B5A2B]/50 rounded-2xl p-4 mb-4 text-sm sm:text-base text-[#8B5A2B] font-extrabold leading-relaxed">
          “爷爷/奶奶，您的板凳好像忘记还了，需要帮忙吗？大马弄老街提醒您及时贴墙归还，保持街道顺畅哦。”
        </div>

        {/* Alert Details Card */}
        <div className="bg-[#eae8e3]/50 border border-[#9CA8B3]/40 rounded-2xl p-4 mb-4 text-xs sm:text-sm space-y-2">
          <div className="flex justify-between text-[#1C1E36] font-bold">
            <span>预警地点：</span>
            <span>{alertItem.location}</span>
          </div>
          <div className="flex justify-between text-[#1C1E36] font-bold">
            <span>预警时间：</span>
            <span>{alertItem.timestamp}</span>
          </div>
          <div className="flex justify-between text-[#8B2525] font-extrabold">
            <span>潜在信用扣分：</span>
            <span>-10 分 (可申请无扣分免责申诉)</span>
          </div>
        </div>

        {/* Appeal Form or Primary Equal Action Buttons */}
        {appealSubmitted ? (
          <div className="bg-[#A3B19B]/20 border-2 border-[#2E5C31] rounded-2xl p-4 text-center space-y-2 mb-3">
            <CheckCircle2 className="w-8 h-8 text-[#2E5C31] mx-auto" />
            <h4 className="font-extrabold text-base text-[#2E5C31]">申诉提交成功！</h4>
            <p className="text-xs font-bold text-[#1C1E36]">
              已为您冻结扣分，大马弄网格管理员将在 10 分钟内核实协助您！
            </p>
          </div>
        ) : showAppealForm ? (
          <form onSubmit={handleSubmitAppeal} className="space-y-3 mb-4 animate-in fade-in">
            <label className="block text-xs font-bold text-[#1C1E36]">
              请选择或输入申诉原因（支持误触/设备折叠卡顿）：
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAppealReason("设备卡顿无法关锁")}
                className={`p-2.5 rounded-xl border text-left ${appealReason === "设备卡顿无法关锁" ? "bg-[#5C5C4A] text-white border-[#5C5C4A]" : "bg-white text-[#1C1E36] border-gray-300"}`}
              >
                🔧 设备卡顿无法归还
              </button>
              <button
                type="button"
                onClick={() => setAppealReason("已被旁人误挪动")}
                className={`p-2.5 rounded-xl border text-left ${appealReason === "已被旁人误挪动" ? "bg-[#5C5C4A] text-white border-[#5C5C4A]" : "bg-white text-[#1C1E36] border-gray-300"}`}
              >
                🚶 被他人误挪位置
              </button>
            </div>
            <textarea
              value={appealReason}
              onChange={(e) => setAppealReason(e.target.value)}
              placeholder="请输入说明，或直接点击下方提交申诉"
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-bold focus:outline-none focus:border-[#5C5C4A]"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAppealForm(false)}
                className="w-1/3 min-h-[48px] rounded-xl border border-gray-300 font-bold text-xs"
              >
                返回
              </button>
              <button
                type="submit"
                className="w-2/3 min-h-[48px] rounded-xl bg-[#2E5C31] text-white font-black text-sm"
              >
                提交免责申诉
              </button>
            </div>
          </form>
        ) : (
          /* "我有疑问" and "我要申诉" as two separate buttons, plus "已按要求归还" */
          <div className="space-y-2.5 mb-4">
            <div className="grid grid-cols-2 gap-2.5">
              {/* Button 1: 我有疑问 */}
              <button
                onClick={() => {
                  alert("微空间助手FAQ：如有疑问，请直接提交免责申诉或呼叫线下管理员介入。");
                }}
                className="min-h-[54px] rounded-2xl bg-[#F6D081] border-2 border-[#184D97] text-[#184D97] font-black text-sm sm:text-base flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <HelpCircle className="w-5 h-5 text-[#184D97]" />
                <span>我有疑问</span>
              </button>

              {/* Button 2: 我要申诉 */}
              <button
                onClick={() => setShowAppealForm(true)}
                className="min-h-[54px] rounded-2xl bg-[#C2A88D]/30 border-2 border-[#8B5A2B] text-[#8B5A2B] font-black text-sm sm:text-base flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <ShieldAlert className="w-5 h-5 text-[#8B5A2B]" />
                <span>我要申诉</span>
              </button>
            </div>

            {/* Confirm resolve button: 已按要求归还 */}
            <button
              onClick={handleConfirmResolve}
              className="w-full min-h-[56px] rounded-2xl bg-[#2E5C31] text-white font-black text-base flex items-center justify-center gap-2 active:scale-95 shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>已按要求归还</span>
            </button>
          </div>
        )}

        {/* Human Admin Transfer Button */}
        <button
          onClick={() => {
            alert("正在为您直连【大马弄网格社区管理员】值班电话：0571-8706****，请稍候...");
          }}
          className="w-full min-h-[56px] rounded-2xl bg-[#184D97] text-[#F6D081] border-2 border-[#184D97] font-black text-base sm:text-lg flex items-center justify-center gap-2 active:scale-98 shadow-md"
        >
          <PhoneCall className="w-5 h-5 text-[#F6D081]" />
          <span>一键呼叫管理员</span>
        </button>
      </div>
    </div>
  );
};
