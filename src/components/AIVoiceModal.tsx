import React, { useState, useEffect } from "react";
import { Mic, X, Sparkles, Volume2, CheckCircle2, ArrowRight, AlertTriangle, PhoneCall, Undo2, ShieldCheck } from "lucide-react";
import { UserRole, VoiceIntentResponse } from "../types";

interface AIVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  isSeniorMode: boolean;
  onExecuteAction: (intent: VoiceIntentResponse) => void;
}

export const AIVoiceModal: React.FC<AIVoiceModalProps> = ({
  isOpen,
  onClose,
  userRole,
  isSeniorMode,
  onExecuteAction,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // State machine: "idle" | "listening" | "typewriter" | "clarification" | "failed" | "confirmation" | "result"
  const [modalStage, setModalStage] = useState<"idle" | "listening" | "typewriter" | "clarification" | "failed" | "confirmation" | "result">("idle");
  
  const [aiResult, setAiResult] = useState<VoiceIntentResponse | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const [targetFullText, setTargetFullText] = useState("");

  // Preset voice prompt shortcuts
  const quickPrompts = [
    "我要租个折叠模块摆摊",
    "帮我找个喝茶晒太阳的地方",
    "找个地方坐下歇歇脚",
    "讲话声音太小吵闹杂音",
    "讲讲大马弄的历史故事",
    "开启长辈模式，字太小了",
  ];

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setIsListening(false);
    setTranscript("");
    setIsLoading(false);
    setModalStage("idle");
    setAiResult(null);
    setStreamingText("");
    setTargetFullText("");
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.9;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const togglePauseSpeech = () => {
    if (!("speechSynthesis" in window)) return;
    if (window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  // Typewriter streaming effect
  useEffect(() => {
    if (modalStage === "typewriter" && targetFullText) {
      setStreamingText("");
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < targetFullText.length) {
          setStreamingText(targetFullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          // Transition to next stage based on confidence / confirmation
          setTimeout(() => {
            if (aiResult?.confidence && aiResult.confidence < 0.60) {
              setModalStage("failed");
            } else if (aiResult?.confidence && aiResult.confidence >= 0.60 && aiResult.confidence < 0.80) {
              setModalStage("clarification");
            } else if (aiResult?.requiresConfirmation || aiResult?.action === "RENT_STOOL") {
              setModalStage("confirmation");
            } else {
              setModalStage("result");
            }
          }, 400);
        }
      }, 35);
      return () => clearInterval(interval);
    }
  }, [modalStage, targetFullText, aiResult]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    stopSpeech();
    setIsListening(true);
    setTranscript("");
    setAiResult(null);
    setModalStage("listening");

    // Simulate voice recording with audio reactivity
    setTimeout(() => {
      const samplePrompts = [
        "我要租个折叠模块",
        "找个喝茶歇脚的地方",
        "风太大杂音多听不清",
        "给我讲讲大马弄的历史",
      ];
      const randomPrompt = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
      setTranscript(randomPrompt);
      setIsListening(false);
      processIntent(randomPrompt);
    }, 2200);
  };

  const processIntent = async (textToProcess: string) => {
    setIsLoading(true);
    try {
      if (textToProcess.includes("杂音") || textToProcess.includes("听不清")) {
        // Trigger low confidence / fail
        const failData: VoiceIntentResponse = {
          action: "UNKNOWN",
          confidence: 0.45,
          replyText: "不好意思，没有听清，请再说一遍。",
        };
        setAiResult(failData);
        setTargetFullText(failData.replyText);
        setModalStage("typewriter");
        speakText(failData.replyText);
        setIsLoading(false);
        return;
      }

      if (textToProcess.includes("歇脚") || textToProcess.includes("地方")) {
        // Trigger multi-turn clarification (60%-80% confidence)
        const clarifyData: VoiceIntentResponse = {
          action: "NAVIGATE_TEA",
          confidence: 0.72,
          replyText: "大马弄有好几个歇脚好去处，AI 猜您可能是想：",
          candidates: [
            { label: "🪑 租个便携折叠板凳随处坐", action: "RENT_STOOL", targetTab: "stools" },
            { label: "🍵 去【太庙茶憩点】喝茶看景色", action: "NAVIGATE_TEA", targetTab: "map" },
            { label: "📜 边坐边听大马弄老街历史故事", action: "CULTURE_STORY", targetTab: "map" },
          ],
        };
        setAiResult(clarifyData);
        setTargetFullText(clarifyData.replyText);
        setModalStage("typewriter");
        speakText(clarifyData.replyText);
        setIsLoading(false);
        return;
      }

      const res = await fetch("/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: textToProcess, userRole }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiResult(data.data);
        setTargetFullText(data.data.replyText);
        setModalStage("typewriter");
        speakText(data.data.replyText);
      } else {
        throw new Error("Intent service fallback");
      }
    } catch (err) {
      console.error("Voice intent processing failed:", err);
      // Fallback
      const fallbackResult: VoiceIntentResponse = {
        action: textToProcess.includes("茶") ? "NAVIGATE_TEA" : "RENT_STOOL",
        confidence: 0.92,
        replyText: `已为您定位意图：“${textToProcess}”，正在启动智慧模块！`,
        targetTab: textToProcess.includes("茶") ? "map" : "stools",
        requiresConfirmation: true,
        confirmationDetails: {
          title: "大马弄微模块解锁确认",
          deposit: "1 元 (信用分745免押金)",
          item: "大马弄 01号 共享微模块",
        },
      };
      setAiResult(fallbackResult);
      setTargetFullText(fallbackResult.replyText);
      setModalStage("typewriter");
      speakText(fallbackResult.replyText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCandidate = (candidate: { action: any; targetTab?: any; label: string }) => {
    const selectedResult: VoiceIntentResponse = {
      action: candidate.action,
      confidence: 0.95,
      replyText: `好的！已为您选择【${candidate.label}】`,
      targetTab: candidate.targetTab,
      requiresConfirmation: candidate.action === "RENT_STOOL",
      confirmationDetails: {
        title: "大马弄微模块租赁确认",
        deposit: "1 元（蒲公英信用分745已免押）",
        item: "大马弄便携折叠板凳",
      },
    };
    setAiResult(selectedResult);
    if (selectedResult.requiresConfirmation) {
      setModalStage("confirmation");
    } else {
      setModalStage("result");
    }
  };

  const handleConfirmAction = () => {
    if (aiResult) {
      onExecuteAction(aiResult);
      onClose();
    }
  };

  // Determine glow color: Morandi Green (normal listening), Morandi Gray (fail), Morandi Orange (confirm/warning)
  const getGlowStyle = () => {
    if (modalStage === "failed") return "border-[#8B2525] bg-[#B59A9A]/15 text-[#8B2525]";
    if (modalStage === "confirmation") return "border-[#8B5A2B] bg-[#C2A88D]/20 text-[#8B5A2B]";
    if (isListening) return "border-[#2E5C31] bg-[#A3B19B]/20 text-[#2E5C31] animate-pulse";
    return isSeniorMode ? "border-[#5C5C4A] bg-[#F9F8F6] text-[#1C1E36]" : "border-[#A5A58D] bg-white text-[#2D312E]";
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#184D97]/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto my-auto rounded-3xl p-5 sm:p-6 shadow-2xl relative border-2 ${
          isSeniorMode
            ? "bg-[#F6E9D3] text-[#184D97] border-[#184D97]"
            : "bg-white text-[#184D97] border-[#BEC7E1]"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isSeniorMode
              ? "bg-[#eae8e3] text-[#1C1E36] hover:bg-[#d8d5cd] border border-[#5C5C4A]"
              : "bg-[#F9F8F6] text-[#4A5A6A] hover:bg-[#9CA8B3]/20"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              modalStage === "failed"
                ? "bg-[#8B2525] text-white"
                : modalStage === "confirmation"
                ? "bg-[#8B5A2B] text-white"
                : "bg-[#5C5C4A] text-white"
            }`}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-black tracking-tight ${isSeniorMode ? "text-2xl text-[#1C1E36]" : "text-lg text-[#2D312E]"}`}>
              长辈 AI 语音陪伴助手
            </h3>
            <p className="text-xs font-bold opacity-80">
              {modalStage === "failed"
                ? "深酒红降级保护"
                : modalStage === "confirmation"
                ? "深棕褐安全线 · 二次确认"
                : "莫兰迪橄榄灰语音感知 · 流式思考"}
            </p>
          </div>
        </div>

        {/* Dandelion Glowing Ring / Main Voice Feedback Display */}
        <div className={`my-4 p-5 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col items-center justify-center text-center ${getGlowStyle()}`}>
          {/* Voice Pause & Audio Controls when speaking */}
          {isSpeaking && (
            <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
              <button
                onClick={togglePauseSpeech}
                className="px-2.5 py-1 rounded-lg bg-[#184D97] text-[#F6D081] text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#1888BF]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPaused ? "继续播报" : "暂停播报"}</span>
              </button>
              <button
                onClick={stopSpeech}
                className="px-2 py-1 rounded-lg bg-gray-200 text-[#184D97] text-xs font-bold hover:bg-gray-300"
              >
                停止
              </button>
            </div>
          )}

          {isListening ? (
            <div className="space-y-3 py-2">
              {/* Dandelion breathing ring animation */}
              <div className="relative w-16 h-16 flex items-center justify-center mx-auto">
                <div className="absolute inset-0 rounded-full bg-[#A3B19B]/40 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-[#A3B19B]/60 animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-[#2E5C31] text-white flex items-center justify-center font-bold shadow-sm">
                  <Mic className="w-5 h-5" />
                </div>
              </div>
              <p className="font-extrabold text-lg text-[#2E5C31]">
                “蒲公英”正在倾听您的讲话...
              </p>
            </div>
          ) : modalStage === "typewriter" || streamingText ? (
            <div className="space-y-2 w-full text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A5A6A]">
                  <Volume2 className="w-4 h-4" /> AI 逐字思考播报中...
                </div>
                {isSpeaking && (
                  <button
                    onClick={togglePauseSpeech}
                    className="px-2.5 py-1 rounded-lg bg-[#184D97] text-[#F6D081] text-xs font-extrabold shadow-xs"
                  >
                    {isPaused ? "▶️ 继续" : "⏸️ 暂停播报"}
                  </button>
                )}
              </div>
              <p className={`font-extrabold leading-snug tracking-wide text-[#1C1E36] font-sans min-h-[60px] ${
                isSeniorMode ? "text-[24px]" : "text-lg sm:text-2xl"
              }`}>
                {streamingText}
                <span className="inline-block w-2.5 h-6 bg-[#5C5C4A] ml-1 animate-pulse" />
              </p>
            </div>
          ) : modalStage === "failed" ? (
            <div className="space-y-2 py-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8B2525]">
                <AlertTriangle className="w-4 h-4 text-[#8B2525]" /> 识别未通过
              </div>
              <p className="font-black text-lg text-[#8B2525]">
                “不好意思，没有听清，请再说一遍”
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {transcript && (
                <p className="text-xs font-bold opacity-75">您的讲话：“{transcript}”</p>
              )}
              <p className={`font-black ${isSeniorMode ? "text-[22px]" : "text-base sm:text-lg"}`}>
                长按或点击下方大按钮说话
              </p>
            </div>
          )}
        </div>

        {/* --- STAGE 1: MULTI-TURN CLARIFICATION (60%-80% Confidence Candidate Bubble) --- */}
        {modalStage === "clarification" && aiResult?.candidates && (
          <div className="space-y-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-[#C2A88D]/20 border border-[#8B5A2B]/40 rounded-2xl p-3 text-xs font-bold text-[#8B5A2B] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#8B5A2B]" />
              <span>智能识别多歧义：为您推测以下 2-3 个精准选项</span>
            </div>
            <div className="space-y-2">
              {aiResult.candidates.map((cand, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCandidate(cand)}
                  className={`w-full min-h-[64px] p-4 rounded-xl bg-white border-2 border-[#5C5C4A] text-[#1C1E36] font-black text-left hover:bg-[#F9F8F6] active:scale-98 transition-all flex items-center justify-between shadow-xs ${
                    isSeniorMode ? "text-[20px]" : "text-base sm:text-lg"
                  }`}
                >
                  <span>{cand.label}</span>
                  <ArrowRight className="w-5 h-5 text-[#5C5C4A] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STAGE 2: RECOGNITION FAILED (<60% or Timeout Fallback Entrances) --- */}
        {modalStage === "failed" && (
          <div className="space-y-3 mb-4 animate-in fade-in">
            <p className="text-xs font-bold text-[#4A5A6A]">
              降级快捷通道 (点击即享服务)：
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleSelectCandidate({ label: "我要租借便携折叠板凳", action: "RENT_STOOL", targetTab: "stools" })}
                className="min-h-[64px] px-4 py-3 rounded-xl bg-[#F9F8F6] border-2 border-[#2E5C31] text-[#1C1E36] font-black text-base flex items-center justify-between active:scale-98"
              >
                <span>🪑 我要租板凳摆摊 / 歇脚</span>
                <ArrowRight className="w-5 h-5 text-[#2E5C31]" />
              </button>
              <button
                onClick={() => handleSelectCandidate({ label: "前往太庙茶憩点休息", action: "NAVIGATE_TEA", targetTab: "map" })}
                className="min-h-[64px] px-4 py-3 rounded-xl bg-[#F9F8F6] border-2 border-[#4A5A6A] text-[#1C1E36] font-black text-base flex items-center justify-between active:scale-98"
              >
                <span>🍵 找休息区 / 茶馆</span>
                <ArrowRight className="w-5 h-5 text-[#4A5A6A]" />
              </button>
              <button
                onClick={() => {
                  alert("正在呼叫大马弄网格网接人工客服与社区志愿者...");
                  onClose();
                }}
                className="min-h-[64px] px-4 py-3 rounded-xl bg-[#8B5A2B]/10 border-2 border-[#8B5A2B] text-[#8B5A2B] font-black text-base flex items-center justify-between active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-[#8B5A2B]" />
                  <span>📞 呼叫社区人工客服</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#8B5A2B]" />
              </button>
            </div>
          </div>
        )}

        {/* --- STAGE 3: SAFETY RED LINE & SECONDARY CONFIRMATION CARD --- */}
        {modalStage === "confirmation" && (
          <div className="bg-[#C2A88D]/20 border-2 border-[#8B5A2B] rounded-2xl p-5 space-y-4 mb-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-[#8B5A2B] font-black text-sm">
              <ShieldCheck className="w-5 h-5 text-[#8B5A2B]" />
              <span>{aiResult?.confirmationDetails?.title || "资金与安全确认卡片"}</span>
            </div>
            <div className="space-y-1 text-[#8B5A2B]">
              <p className="text-sm font-bold">
                物品服务：<span className="font-extrabold text-[#1C1E36]">{aiResult?.confirmationDetails?.item || "大马弄共享微模块"}</span>
              </p>
              <p className="text-sm font-bold">
                费用说明：<span className="font-extrabold text-[#8B5A2B]">{aiResult?.confirmationDetails?.deposit || "1 元 (已免押金)"}</span>
              </p>
              <p className="text-xs opacity-80">
                支持语音确认：对手机回答“确认”或点击下侧按钮。
              </p>
            </div>

            {/* Massive Confirm & Cancel Buttons (>= 64px) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={resetState}
                className="min-h-[64px] rounded-xl bg-white border-2 border-[#9CA8B3] text-[#4A5A6A] font-black text-base sm:text-lg active:scale-95"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAction}
                className="min-h-[64px] rounded-xl bg-[#2E5C31] text-white font-black text-base sm:text-lg shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>确认支付 / 开启</span>
              </button>
            </div>
          </div>
        )}

        {/* --- STAGE 4: FINAL EXECUTION RESULT CARD WITH UNDO BUTTON --- */}
        {modalStage === "result" && aiResult && (
          <div className="bg-[#A3B19B]/20 border-2 border-[#2E5C31] rounded-2xl p-4 space-y-3 mb-4 animate-in fade-in">
            <div className="flex items-center gap-2 text-[#2E5C31] font-black text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#2E5C31]" />
              <span>解析完毕：准备执行</span>
            </div>
            <p className="text-base font-extrabold text-[#1C1E36] leading-relaxed">
              {aiResult.replyText}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleConfirmAction}
                className="min-h-[56px] w-full rounded-xl bg-[#2E5C31] text-white font-black text-lg flex items-center justify-center gap-2 shadow-sm active:scale-98"
              >
                <span>立即跳转处理</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Retry button if AI misunderstood */}
              <button
                onClick={handleStartRecording}
                className="min-h-[48px] w-full rounded-xl bg-[#F6D081] text-[#184D97] border-2 border-[#184D97] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-98 shadow-xs"
              >
                <Undo2 className="w-4 h-4 text-[#184D97]" />
                <span>理解不对，重新再说一次</span>
              </button>
            </div>
          </div>
        )}

        {/* Preset Voice Quick Prompts (When Idle) */}
        {modalStage === "idle" && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-extrabold text-[#4A5A6A]">
              点选高频语音快捷输入：
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(promptText);
                    processIntent(promptText);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-[#1C1E36] bg-[#eae8e3] hover:bg-[#d8d5cd] border border-[#9CA8B3]/40 active:scale-95 transition-transform"
                >
                  “{promptText}”
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Recording Button (Height >= 64px) */}
        {modalStage !== "confirmation" && modalStage !== "result" && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleStartRecording}
              disabled={isListening || isLoading}
              className={`w-full min-h-[64px] rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-transform active:scale-98 shadow-md ${
                isListening
                  ? "bg-[#2E5C31] text-white ring-4 ring-[#2E5C31]/40"
                  : "bg-[#5C5C4A] text-white hover:bg-[#4a4a3b] border-2 border-[#5C5C4A]"
              }`}
            >
              <Mic className="w-7 h-7" />
              <span>{isListening ? "正在按声纹接收中..." : "点击或按住说话"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
