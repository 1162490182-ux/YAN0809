import React, { useState } from "react";
import { CulturalSpot } from "../types";
import { X, Volume2, Sparkles, Play, Pause, Clock } from "lucide-react";

interface CultureDetailModalProps {
  spot: CulturalSpot | null;
  onClose: () => void;
  isSeniorMode: boolean;
}

export const CultureDetailModal: React.FC<CultureDetailModalProps> = ({
  spot,
  onClose,
  isSeniorMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiCustomStory, setAiCustomStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  if (!spot) return null;

  const toggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } else {
      setIsPlaying(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const textToSpeak = aiCustomStory || spot.historicalStory;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const generateDeepAIStory = async () => {
    setIsGeneratingStory(true);
    try {
      const res = await fetch("/api/ai/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotName: spot.name }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setAiCustomStory(data.story);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div
        className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-xl relative border max-h-[90vh] overflow-y-auto ${
          isSeniorMode
            ? "bg-stone-900 text-amber-200 border-amber-300"
            : "bg-white text-stone-800 border-stone-200"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isSeniorMode
              ? "bg-[#383e3a] text-[#e8d2b8] hover:bg-[#444c47]"
              : "bg-[#f4f2ec] text-[#585e58] hover:bg-[#e2ddd5]"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {spot.imageUrl && (
          <img
            src={spot.imageUrl}
            alt={spot.name}
            className="w-full h-44 sm:h-52 object-cover rounded-2xl mb-4 border border-[#e2ddd5]"
          />
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f4f2ec] text-[#585e58] border border-[#e2ddd5]">
              {spot.category === "tea"
                ? "茶憩空间"
                : spot.category === "food"
                ? "早市美食"
                : "历史人文"}
            </span>
            <span className="text-xs text-[#787d78] font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {spot.operatingHours}
            </span>
          </div>

          <h3
            className={`font-bold text-xl sm:text-2xl ${
              isSeniorMode ? "text-[#e8d2b8] text-2xl" : "text-[#383d39]"
            }`}
          >
            {spot.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#585e58] font-normal leading-relaxed">
            {spot.summary}
          </p>

          {/* Audio Story Section */}
          <div className="bg-[#f4f2ec] border border-[#e2ddd5] p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#383d39] text-xs sm:text-sm flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#586856]" /> 老街故事语音解说
              </span>
              <button
                onClick={toggleAudio}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-transform active:scale-95 ${
                  isPlaying
                    ? "bg-[#b08b82] text-[#fafaf7] animate-pulse"
                    : "bg-[#788876] text-[#fafaf7] hover:bg-[#687866]"
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isPlaying ? "暂停" : "朗读"}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#383d39] leading-relaxed font-normal">
              {aiCustomStory || spot.historicalStory}
            </p>

            <div className="pt-1 flex justify-end">
              <button
                onClick={generateDeepAIStory}
                disabled={isGeneratingStory}
                className="text-xs text-[#384a39] font-semibold underline hover:text-[#586856] flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#788876]" />
                <span>{isGeneratingStory ? "AI 创作中..." : "重新生成 AI 故事"}</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-[#383d39] text-[#fafaf7] font-semibold rounded-xl text-xs sm:text-sm active:scale-95 transition-transform"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

