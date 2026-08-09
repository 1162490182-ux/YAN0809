import React, { useState } from "react";
import { X, QrCode, ShieldCheck, Zap, Unlock } from "lucide-react";
import { StoolModule, UserProfile } from "../types";

interface ScanUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stools: StoolModule[];
  userProfile: UserProfile;
  onUnlockSuccess: (stoolId: string) => void;
  isSeniorMode: boolean;
}

export const ScanUnlockModal: React.FC<ScanUnlockModalProps> = ({
  isOpen,
  onClose,
  stools,
  userProfile,
  onUnlockSuccess,
  isSeniorMode,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [selectedStool, setSelectedStool] = useState<StoolModule | null>(
    stools.find((s) => s.status === "idle") || stools[0]
  );
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (stool: StoolModule) => {
    setSelectedStool(stool);
    setIsScanning(false);
  };

  const handleConfirmUnlock = () => {
    if (!selectedStool) return;

    // Simulate beep audio
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High beep
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // ignore
    }

    setIsUnlocked(true);
    setTimeout(() => {
      onUnlockSuccess(selectedStool.id);
      setIsUnlocked(false);
      setIsScanning(true);
      onClose();
    }, 1800);
  };

  const isFreeDeposit = userProfile.creditScore >= 650;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className={`w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-xl relative border ${
          isSeniorMode
            ? "bg-stone-900 text-amber-200 border-amber-300"
            : "bg-white text-stone-900 border-stone-200"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isSeniorMode
              ? "bg-stone-800 text-amber-300 hover:bg-stone-700"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#e8ece7] text-[#384a39] border border-[#c2ccc0] flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#384a39] bg-[#e8ece7] border border-[#c2ccc0] px-2 py-0.5 rounded">
              微信开锁 API 极速互联
            </span>
            <h3
              className={`font-bold text-lg ${
                isSeniorMode ? "text-[#e8d2b8] text-xl" : "text-[#383d39]"
              }`}
            >
              蒲公英模块 · 扫码解锁
            </h3>
          </div>
        </div>

        {/* Scanning Viewfinder simulation */}
        {isScanning ? (
          <div className="space-y-4">
            <div className="relative w-full h-52 bg-[#2e3330] rounded-2xl overflow-hidden border border-[#586856] flex flex-col items-center justify-center">
              {/* Laser Line */}
              <div className="absolute inset-x-4 h-0.5 bg-[#a2beaa] shadow-[0_0_15px_#a2beaa] animate-pulse top-1/2" />
              <div className="w-32 h-32 border border-dashed border-[#a2beaa]/60 rounded-xl flex items-center justify-center relative">
                <QrCode className="w-16 h-16 text-[#a2beaa]/50 animate-pulse" />
              </div>
              <p className="text-[#d4e0d2] text-xs font-medium mt-3">
                对准折叠模块二维码 或在下方选择点位
              </p>
            </div>

            <p
              className={`text-xs font-semibold ${
                isSeniorMode ? "text-[#e8d2b8]" : "text-[#787d78]"
              }`}
            >
              请选择附近空闲可租模块一键开锁：
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {stools
                .filter((s) => s.status === "idle")
                .map((stool) => (
                  <div
                    key={stool.id}
                    onClick={() => handleSimulateScan(stool)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSeniorMode
                        ? "bg-[#383e3a] border-[#c8b6a2]/60 hover:bg-[#444c47]"
                        : "bg-[#f4f2ec] border-[#e2ddd5] hover:bg-[#e8ece7]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-[#383d39]">{stool.name}</span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#d8e2d7] text-[#384a39]">
                          空闲可租
                        </span>
                      </div>
                      <p className="text-xs text-[#787d78] mt-0.5">{stool.locationDescription}</p>
                    </div>
                    <button className="px-3 py-1 bg-[#788876] text-[#fafaf7] font-semibold text-xs rounded-lg shadow-2xs">
                      对准扫码开锁
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ) : isUnlocked ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-[#e8ece7] text-[#384a39] rounded-full flex items-center justify-center mx-auto">
              <Unlock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-[#384a39]">共享模块开锁成功</h4>
            <p className="text-xs sm:text-sm font-medium text-[#585e58]">
              {selectedStool?.name} 已解锁，使用完毕后请归还至指定堆放点。
            </p>
            <div className="text-xs text-[#383d39] bg-[#f4f2ec] p-2.5 rounded-xl border border-[#e2ddd5]">
              蒲公英信用分 +5 分奖励预发放中
            </div>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="space-y-4">
            <div
              className={`p-4 rounded-2xl border ${
                isSeniorMode ? "bg-[#383e3a] border-[#c8b6a2]" : "bg-[#f4f2ec] border-[#e2ddd5]"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2 mb-2 border-[#e2ddd5]">
                <span className="font-bold text-base text-[#383d39]">{selectedStool?.name}</span>
                <span className="text-xs font-mono text-[#8c918c]">{selectedStool?.code}</span>
              </div>
              <p className="text-xs font-normal text-[#585e58] mb-3">
                位置：{selectedStool?.locationDescription}
              </p>

              {/* Deposit & Credit Rules */}
              <div className="bg-[#fafaf7] p-3 rounded-xl space-y-2 text-[#383d39] border border-[#e2ddd5]">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#788876]" />
                    蒲公英信用分 ({userProfile.creditScore}分):
                  </span>
                  {isFreeDeposit ? (
                    <span className="text-[#384a39] font-bold bg-[#e8ece7] px-2 py-0.5 rounded">
                      达成 650 分 · 极速免押金
                    </span>
                  ) : (
                    <span className="text-[#383d39]">押金 ￥1.00</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#787d78]">
                  <span>归还规则：</span>
                  <span>归还至任意大马弄堆放点后秒退/归零</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsScanning(true)}
                className="w-1/3 py-2.5 border border-[#e2ddd5] rounded-xl font-medium text-xs sm:text-sm text-[#585e58] hover:bg-[#f4f2ec]"
              >
                返回重新选
              </button>
              <button
                onClick={handleConfirmUnlock}
                className="w-2/3 py-2.5 bg-[#788876] hover:bg-[#687866] text-[#fafaf7] rounded-xl font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>确认解锁并开启</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

