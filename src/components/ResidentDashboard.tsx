import React, { useState } from "react";
import { CulturalSpot, StoolModule, TimeSlot } from "../types";
import {
  Volume2,
  Sparkles,
  Coffee,
  Play,
  Pause,
  Compass,
} from "lucide-react";

interface ResidentDashboardProps {
  spots: CulturalSpot[];
  stools: StoolModule[];
  activeTimeMode: TimeSlot;
  onChangeTimeMode: (mode: TimeSlot) => void;
  onSelectSpot: (spot: CulturalSpot) => void;
  onOpenVoiceModal: () => void;
  isSeniorMode: boolean;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  spots,
  stools,
  activeTimeMode,
  onChangeTimeMode,
  onSelectSpot,
  onOpenVoiceModal,
  isSeniorMode,
}) => {
  const [playingSpotId, setPlayingSpotId] = useState<string | null>(null);

  const togglePlayStory = (spot: CulturalSpot, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingSpotId === spot.id) {
      setPlayingSpotId(null);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } else {
      setPlayingSpotId(spot.id);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(spot.historicalStory);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;
        utterance.onend = () => setPlayingSpotId(null);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const filteredSpots = spots.filter(
    (s) => s.timeMode === "all" || s.timeMode === activeTimeMode
  );

  return (
    <div className="space-y-5">
      {/* Resident Header Card */}
      <div
        className={`rounded-3xl border shadow-xs relative overflow-hidden ${
          isSeniorMode
            ? "p-6 bg-[#F9F8F6] text-[#1C1E36] border-[#5C5C4A]"
            : "p-5 sm:p-6 bg-[#2D312E] text-white border-[#4A5A6A]"
        }`}
      >
        <div className="relative z-10 space-y-2">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold border ${
            isSeniorMode
              ? "bg-[#5C5C4A] text-white border-[#5C5C4A]"
              : "bg-[#4A5A6A] text-white border-[#9CA8B3]/30"
          }`}>
            <Compass className="w-4 h-4 text-[#A3B19B]" />
            <span>居民 / 游客智慧导览</span>
            <span>·</span>
            <span>大马弄老街文化伴游</span>
          </div>
          <h2 className={`font-extrabold tracking-tight ${isSeniorMode ? "text-3xl sm:text-4xl text-[#1C1E36]" : "text-2xl sm:text-3xl text-white"}`}>
            探索大马弄 · 烟火与文化共生
          </h2>
          <p className={`font-normal max-w-2xl ${isSeniorMode ? "text-base sm:text-lg text-[#334155] font-bold" : "text-xs sm:text-sm text-[#9CA8B3]"}`}>
            早市品尝现炸爆鱼与年糕，午后太庙古樟树下喝茶晒太阳。共享模块随取随坐。
          </p>
        </div>
      </div>

      {/* Cultural Spots Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-base sm:text-lg flex items-center gap-2 ${isSeniorMode ? "text-[#1C1E36]" : "text-[#2D312E]"}`}>
            <Sparkles className="w-5 h-5 text-[#5C5C4A]" />
            <span>
              {activeTimeMode === "morning"
                ? "早市美食与文化地标"
                : "午后茶憩与打卡空间"}
            </span>
          </h3>
          {isSeniorMode && (
            <button
              onClick={onOpenVoiceModal}
              className="text-xs sm:text-sm font-bold text-white bg-[#5C5C4A] hover:bg-[#4a4a3b] px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Volume2 className="w-4 h-4" />
              <span>长辈 AI 语音向导</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className={`rounded-2xl border transition-all cursor-pointer hover:shadow-2xs ${
                isSeniorMode
                  ? "p-6 bg-[#F9F8F6] border-[#5C5C4A] text-[#1C1E36]"
                  : "p-4 bg-white border-[#9CA8B3]/30 hover:border-[#A5A58D]"
              }`}
            >
              <div className="flex gap-3">
                {spot.imageUrl && (
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-[#9CA8B3]/30"
                  />
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold truncate ${isSeniorMode ? "text-xl sm:text-2xl text-[#1C1E36]" : "text-xs sm:text-sm text-[#2D312E]"}`}>
                      {spot.name}
                    </h4>
                    <span className={`font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      isSeniorMode ? "bg-[#5C5C4A] text-white text-xs border-[#5C5C4A]" : "bg-[#9CA8B3]/20 text-[#2D312E] text-[10px] sm:text-xs border-[#9CA8B3]/30"
                    }`}>
                      {spot.operatingHours}
                    </span>
                  </div>
                  <p className={`line-clamp-2 ${isSeniorMode ? "text-base sm:text-lg font-bold text-[#2C3E50]" : "text-xs sm:text-sm text-[#4A5A6A]"}`}>
                    {spot.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-wrap gap-1">
                      {spot.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-[10px] sm:text-xs px-2 py-0.5 rounded font-bold ${
                            isSeniorMode ? "bg-[#eae8e3] text-[#1C1E36]" : "bg-[#F9F8F6] text-[#4A5A6A]"
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Audio story button */}
                    <button
                      onClick={(e) => togglePlayStory(spot, e)}
                      className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-transform active:scale-90 ${
                        playingSpotId === spot.id
                          ? "bg-[#2E5C31] text-white animate-pulse"
                          : isSeniorMode
                          ? "bg-[#5C5C4A] text-white hover:bg-[#4a4a3b]"
                          : "bg-[#A5A58D] text-white hover:bg-[#8e8e78]"
                      }`}
                      title="点击倾听语音讲解故事"
                    >
                      {playingSpotId === spot.id ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span className="pr-1 text-[10px]">暂停</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="pr-1 text-[10px]">语音解说</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

