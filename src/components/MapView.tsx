import React, { useState } from "react";
import {
  StoolModule,
  CulturalSpot,
  TimeSlot,
} from "../types";
import {
  Sun,
  Coffee,
  Flame,
  Volume2,
  Armchair,
  Sparkles,
  Navigation,
  ShieldCheck,
  Compass,
  PhoneCall,
  MapPin,
  AlertCircle,
  ChevronRight,
  Info,
} from "lucide-react";

interface MapViewProps {
  stools: StoolModule[];
  spots: CulturalSpot[];
  activeTimeMode: TimeSlot;
  onChangeTimeMode: (mode: TimeSlot) => void;
  onSelectStool: (stool: StoolModule) => void;
  onSelectSpot: (spot: CulturalSpot) => void;
  isSeniorMode: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  stools,
  spots,
  activeTimeMode,
  onChangeTimeMode,
  onSelectStool,
  onSelectSpot,
  isSeniorMode,
}) => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showReroutePath, setShowReroutePath] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "stools" | "spots">("all");
  
  // LBS Vague Intent Clarification carousel toggle
  const [showClarificationCarousel, setShowClarificationCarousel] = useState(false);
  
  // Offline Fallback Mode toggle
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  // Requirement #5: GPS Auto-Narrate state for morning food & cultural landmarks
  const [isGpsAutoNarrate, setIsGpsAutoNarrate] = useState(true);
  const [currentGpsSpot, setCurrentGpsSpot] = useState<CulturalSpot | null>(
    spots[0] || null
  );
  const [isPlayingStory, setIsPlayingStory] = useState(false);

  const toggleGpsAudio = (spot: CulturalSpot | null) => {
    const target = spot || currentGpsSpot || spots[0];
    if (!target) return;

    if (isPlayingStory) {
      setIsPlayingStory(false);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingStory(true);
      setCurrentGpsSpot(target);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(target.historicalStory);
        utterance.lang = "zh-CN";
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlayingStory(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Candidate tea/rest spots for vague intent clarification
  const teaCandidates = [
    {
      id: "cand-1",
      name: "太庙古树茶憩点",
      distance: "距您 120m",
      crowdLabel: "人流较少 (28%)",
      crowdColor: "bg-[#edf4f1] text-[#2d5a27] border-[#7ea193]",
      desc: "太庙古樟树林荫下，免费提供便携板凳与热茶",
      spotId: "spot-03",
    },
    {
      id: "cand-2",
      name: "紫阳宋韵老茶室",
      distance: "距您 250m",
      crowdLabel: "适中 (45%)",
      crowdColor: "bg-[#fef3e7] text-[#92400e] border-[#f59e0b]",
      desc: "屋檐下晒太阳品九曲红梅，支持共享模块扩建",
      spotId: "spot-04",
    },
    {
      id: "cand-3",
      name: "察院前石凳憩息角",
      distance: "距您 310m",
      crowdLabel: "极空闲 (15%)",
      crowdColor: "bg-[#edf4f1] text-[#2d5a27] border-[#7ea193]",
      desc: "避开主街菜场人群的幽静巷子，墙绘打卡出片",
      spotId: "spot-05",
    },
  ];

  // Filter spots by time mode
  const visibleSpots = spots.filter(
    (s) => s.timeMode === "all" || s.timeMode === activeTimeMode
  );

  return (
    <div className="space-y-4">
      {/* Time-Space Dual Mode Selector & Heatmap Toolbar */}
      <div
        className={`p-3 sm:p-4 rounded-3xl border-2 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isSeniorMode
            ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]"
            : "bg-white border-[#BEC7E1] text-[#184D97]"
        }`}
      >
        {/* Dual Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className={`flex p-1 rounded-2xl border ${isSeniorMode ? "bg-[#BEC7E1]/30 border-[#184D97]" : "bg-[#F6E9D3] border-[#BEC7E1]"}`}>
            <button
              onClick={() => onChangeTimeMode("morning")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                activeTimeMode === "morning"
                  ? "bg-[#1888BF] text-white shadow-xs"
                  : "text-[#184D97] hover:bg-[#BEC7E1]/30"
              }`}
            >
              <Sun className="w-4 h-4 text-white" />
              <span>早市模式 (06:00-12:00)</span>
            </button>
            <button
              onClick={() => onChangeTimeMode("afternoon")}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all ${
                activeTimeMode === "afternoon"
                  ? "bg-[#184D97] text-[#F6D081] shadow-xs"
                  : "text-[#184D97] hover:bg-[#BEC7E1]/30"
              }`}
            >
              <Coffee className="w-4 h-4 text-[#F6D081]" />
              <span>午后茶憩 (12:00-20:00)</span>
            </button>
          </div>
        </div>

        {/* Filters & Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Requirement #5: GPS Auto-Narrate toggle */}
          <button
            onClick={() => {
              const nextVal = !isGpsAutoNarrate;
              setIsGpsAutoNarrate(nextVal);
              if (nextVal) {
                toggleGpsAudio(currentGpsSpot || spots[0]);
              } else {
                if ("speechSynthesis" in window) window.speechSynthesis.cancel();
                setIsPlayingStory(false);
              }
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all border-2 shadow-2xs ${
              isGpsAutoNarrate
                ? "bg-[#2E5C31] text-white border-[#2E5C31]"
                : "bg-white text-[#184D97] border-[#BEC7E1] hover:bg-[#F6E9D3]"
            }`}
          >
            <Volume2 className="w-4 h-4 text-[#F6D081] animate-pulse" />
            <span>{isGpsAutoNarrate ? "GPS自动解说已开启" : "开启GPS自动解说"}</span>
          </button>

          <button
            onClick={() => setShowClarificationCarousel(!showClarificationCarousel)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border-2 ${
              showClarificationCarousel
                ? "bg-[#34B8C5] text-[#184D97] border-[#184D97]"
                : "bg-white text-[#184D97] border-[#BEC7E1] hover:bg-[#F6E9D3]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1888BF]" />
            <span>{showClarificationCarousel ? "收起意图澄清" : "模糊意图智能分流"}</span>
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border-2 ${
              showHeatmap
                ? "bg-[#184D97] text-[#F6D081] border-[#184D97]"
                : "bg-white text-[#184D97] border-[#BEC7E1] hover:bg-[#F6E9D3]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#F6D081]" />
            <span>{showHeatmap ? "关闭人流热力" : "显示人流热力"}</span>
          </button>

          <button
            onClick={() => setShowReroutePath(!showReroutePath)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border-2 ${
              showReroutePath
                ? "bg-[#1888BF] text-white border-[#1888BF]"
                : "bg-white text-[#184D97] border-[#BEC7E1] hover:bg-[#F6E9D3]"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>智能避堵路线</span>
          </button>

          {/* Offline Hand-drawn Map Button */}
          <button
            onClick={() => setIsOfflineFallback(!isOfflineFallback)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all border-2 ${
              isOfflineFallback
                ? "bg-[#F6D081] text-[#184D97] border-[#184D97]"
                : "bg-[#F6E9D3] text-[#184D97] border-[#BEC7E1] hover:bg-[#F6D081]"
            }`}
            title="离线脱机/GPS手绘地图"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{isOfflineFallback ? "退出离线模式" : "离线手绘地图"}</span>
          </button>
        </div>
      </div>

      {/* Requirement #5: Active GPS Auto-Narrate Live Audio Banner */}
      {isGpsAutoNarrate && (
        <div className="bg-[#184D97] border-2 border-[#F6D081] text-white p-3.5 sm:p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F6D081] text-[#184D97] rounded-2xl shrink-0">
              <Volume2 className="w-6 h-6 animate-bounce" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#34B8C5] text-[#184D97] whitespace-nowrap">
                  GPS 地理围栏感应中
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#F6D081] truncate">
                  已感应到达：{currentGpsSpot?.name || "大马弄周萍油炸鱼"} (距您 8 米)
                </span>
              </div>
              <p className="text-xs text-[#F6E9D3] font-medium line-clamp-1">
                {currentGpsSpot?.historicalStory || "每天清晨开锅，现炸酥香爆鱼，油烟与烟火气共存的大马弄标志美食地标..."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleGpsAudio(currentGpsSpot)}
              className="px-4 py-2 rounded-xl bg-[#F6D081] hover:bg-[#34B8C5] text-[#184D97] font-black text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 whitespace-nowrap"
            >
              {isPlayingStory ? (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>暂停语音故事</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>自动播放解说</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- LBS VAGUE INTENT CLARIFICATION CAROUSEL CARD GROUP --- */}
      {showClarificationCarousel && (
        <div className="bg-[#F6E9D3] border-2 border-[#1888BF] p-4 rounded-3xl space-y-3 animate-in fade-in slide-in-from-top-2 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#184D97] font-black text-sm sm:text-base">
              <Compass className="w-5 h-5 text-[#34B8C5]" />
              <span>AI 语音询问：“找到了几个喝茶歇脚好去处，您看去哪个？”</span>
            </div>
            <span className="text-[10px] bg-[#184D97] text-[#F6D081] font-bold px-2.5 py-0.5 rounded-full">
              智能受控引导
            </span>
          </div>

          {/* Horizontal Carousel */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {teaCandidates.map((cand) => (
              <div
                key={cand.id}
                className="min-w-[260px] sm:min-w-[280px] bg-white border-2 border-[#BEC7E1] rounded-2xl p-3.5 shadow-xs flex flex-col justify-between space-y-2 shrink-0 hover:border-[#184D97] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-base text-[#184D97]">{cand.name}</h4>
                    <span className="text-xs font-black text-[#1888BF]">{cand.distance}</span>
                  </div>
                  <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border bg-[#A7D9C7] text-[#184D97] border-[#A7D9C7]">
                    {cand.crowdLabel}
                  </span>
                  <p className="text-xs text-[#184D97]/80 font-medium leading-relaxed">
                    {cand.desc}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const matchedSpot = spots.find((s) => s.id === cand.spotId);
                    if (matchedSpot) onSelectSpot(matchedSpot);
                  }}
                  className="w-full min-h-[44px] bg-[#34B8C5] text-[#184D97] rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 hover:bg-[#1888BF] hover:text-white active:scale-98"
                >
                  <span>开启精准指引</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- REROUTING ALERT WITH MANDATORY DISCLAIMER TAG --- */}
      {showReroutePath && (
        <div className="bg-[#184D97] text-[#F6E9D3] p-3.5 rounded-2xl border-2 border-[#F6D081] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F6D081] shrink-0 animate-pulse" />
            <div>
              <span className="font-black text-[#F6D081]">主街拥挤度 88%！</span>
              <span>建议走察院前巷子路线分流。</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mandatory Disclaimer Badge */}
            <span className="text-[10px] bg-[#1888BF] text-[#F6D081] px-2 py-1 rounded-md border border-[#F6D081]/50 font-extrabold">
              【基于当前人流算法预测】
            </span>
            <button
              onClick={() => setShowReroutePath(false)}
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1 rounded-lg"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* --- OFFLINE FALLBACK MODE OR INTERACTIVE MAP --- */}
      {isOfflineFallback ? (
        /* OFFLINE FALLBACK HAND-DRAWN MAP VIEW */
        <div className="relative w-full h-[420px] sm:h-[480px] bg-[#F6E9D3] rounded-3xl border-4 border-[#184D97] shadow-xl overflow-hidden p-6 flex flex-col justify-between">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="bg-[#184D97] text-[#F6D081] text-xs font-black px-2.5 py-1 rounded-lg">
                离线脱机地图模式
              </span>
              <span className="text-xs font-extrabold text-[#184D97]">
                GPS 信号微弱 · 已加载大马弄老街手绘地标图
              </span>
            </div>
            <p className="text-sm font-extrabold text-[#184D97]">
              大马弄为古老街巷结构，如您偏离路线，可前往下方核心地标处寻求帮忙：
            </p>
          </div>

          {/* Hand-drawn Map Landmarks Grid */}
          <div className="grid grid-cols-2 gap-3 relative z-10 my-auto">
            <div className="bg-white/90 border-2 border-[#BEC7E1] p-3 rounded-2xl shadow-xs text-center space-y-1">
              <MapPin className="w-6 h-6 text-[#1888BF] mx-auto" />
              <h5 className="font-extrabold text-sm text-[#184D97]">大马弄北牌坊</h5>
              <p className="text-[11px] text-[#1888BF]">早市入口 · 周萍油炸鱼旁</p>
            </div>
            <div className="bg-white/90 border-2 border-[#BEC7E1] p-3 rounded-2xl shadow-xs text-center space-y-1">
              <Coffee className="w-6 h-6 text-[#34B8C5] mx-auto" />
              <h5 className="font-extrabold text-sm text-[#184D97]">太庙遗址古树区</h5>
              <p className="text-[11px] text-[#1888BF]">午后茶憩 · 共享模块堆放点</p>
            </div>
            <div className="bg-white/90 border-2 border-[#BEC7E1] p-3 rounded-2xl shadow-xs text-center space-y-1">
              <Navigation className="w-6 h-6 text-[#184D97] mx-auto" />
              <h5 className="font-extrabold text-sm text-[#184D97]">察院前风情巷</h5>
              <p className="text-[11px] text-[#1888BF]">避人群通道 · 老街墙绘</p>
            </div>
            <div className="bg-white/90 border-2 border-[#BEC7E1] p-3 rounded-2xl shadow-xs text-center space-y-1">
              <Armchair className="w-6 h-6 text-[#34B8C5] mx-auto" />
              <h5 className="font-extrabold text-sm text-[#184D97]">酱鸭古作坊</h5>
              <p className="text-[11px] text-[#1888BF]">大马弄南段 · 摊贩集聚区</p>
            </div>
          </div>

          {/* Fallback Action Buttons (Call Admin & Nearby Landmarks) */}
          <div className="grid grid-cols-2 gap-3 relative z-10 pt-2 border-t border-[#BEC7E1]">
            <button
              onClick={() => {
                alert("正在为您直连【大马弄网格社区管理员】人工服务电话：0571-8706****");
              }}
              className="min-h-[56px] rounded-xl bg-[#184D97] text-[#F6D081] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <PhoneCall className="w-5 h-5" />
              <span>呼叫社区人工客服</span>
            </button>
            <button
              onClick={() => setIsOfflineFallback(false)}
              className="min-h-[56px] rounded-xl bg-white border-2 border-[#184D97] text-[#184D97] font-extrabold text-sm flex items-center justify-center gap-2 active:scale-95 shadow-sm"
            >
              <Compass className="w-5 h-5 text-[#1888BF]" />
              <span>查看附近地标路线</span>
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD ONLINE MAP CONTAINER */
        <div className="relative w-full h-[420px] sm:h-[480px] bg-[#184D97] rounded-3xl border-2 border-[#BEC7E1] shadow-2xl overflow-hidden select-none">
          {/* Map Background Illustration Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#BEC7E1_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-25" />

          {/* Map Street Paths SVG Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Main Street Dama Nong */}
            <path
              d="M 100 160 Q 250 200, 450 320 T 700 420"
              fill="none"
              stroke="#1888BF"
              strokeWidth="30"
              strokeLinecap="round"
              className="opacity-70"
            />
            <path
              d="M 100 160 Q 250 200, 450 320 T 700 420"
              fill="none"
              stroke="#F6D081"
              strokeWidth="12"
              strokeDasharray="10 6"
              strokeLinecap="round"
            />

            {/* Side Alley - Cha Yuan Qian */}
            <path
              d="M 450 320 Q 580 260, 780 280"
              fill="none"
              stroke="#34B8C5"
              strokeWidth="20"
              strokeLinecap="round"
              className="opacity-80"
            />
            <path
              d="M 450 320 Q 580 260, 780 280"
              fill="none"
              stroke="#A7D9C7"
              strokeWidth="8"
              strokeDasharray="6 4"
              strokeLinecap="round"
            />

            {/* Reroute Path highlight if enabled */}
            {showReroutePath && (
              <path
                d="M 100 160 C 200 80, 500 100, 780 280"
                fill="none"
                stroke="#F6D081"
                strokeWidth="6"
                strokeDasharray="8 4"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Heatmap Blobs Overlay */}
          {showHeatmap && (
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute w-44 h-44 rounded-full bg-[#F6D081]/30 blur-2xl animate-pulse"
                style={{ left: "15%", top: "25%" }}
              />
              <div
                className="absolute w-36 h-36 rounded-full bg-[#34B8C5]/30 blur-xl"
                style={{ left: "40%", top: "45%" }}
              />
              <div
                className="absolute w-32 h-32 rounded-full bg-[#A7D9C7]/30 blur-xl"
                style={{ left: "70%", top: "60%" }}
              />
            </div>
          )}

          {/* Street Labels */}
          <div className="absolute top-4 left-6 bg-[#F6E9D3] text-[#184D97] font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-md border-2 border-[#184D97] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#184D97] animate-ping" />
            <span>大马弄主街（早市/菜市）</span>
          </div>
          <div className="absolute top-12 right-12 bg-[#F6E9D3] text-[#184D97] font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-md border border-[#BEC7E1]">
            察院前风情巷（分流路线）
          </div>
          <div className="absolute top-1/4 right-1/3 bg-[#F6E9D3] text-[#184D97] font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-md border border-[#BEC7E1]">
            太庙遗址广场（午后茶憩）
          </div>

          {/* Map Pins: Stools */}
          {(selectedFilter === "all" || selectedFilter === "stools") &&
            stools.map((stool) => (
              <button
                key={stool.id}
                onClick={() => onSelectStool(stool)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-20"
                style={{ left: `${stool.x}%`, top: `${stool.y}%` }}
              >
                <div
                  className={`p-2.5 rounded-2xl shadow-lg border-2 flex items-center justify-center transition-all ${
                    stool.status === "idle"
                      ? "bg-[#A7D9C7] border-white text-[#184D97] ring-4 ring-[#A7D9C7]/40"
                      : stool.status === "rented"
                      ? "bg-[#34B8C5] border-white text-[#184D97] ring-2 ring-[#34B8C5]/40"
                      : "bg-[#F6D081] border-[#184D97] text-[#184D97] ring-4 ring-[#F6D081]/50 animate-bounce font-black"
                  }`}
                >
                  <Armchair className="w-5 h-5" />
                </div>
                <div className="hidden group-hover:block absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-[#F6E9D3] text-[#184D97] text-xs font-extrabold px-2.5 py-1 rounded-xl whitespace-nowrap z-30 shadow-xl border-2 border-[#184D97]">
                  {stool.name} · {stool.status === "idle" ? "空闲可租" : "使用中"}
                </div>
              </button>
            ))}

          {/* Map Pins: Cultural Spots */}
          {(selectedFilter === "all" || selectedFilter === "spots") &&
            visibleSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => {
                  setCurrentGpsSpot(spot);
                  if (isGpsAutoNarrate) {
                    toggleGpsAudio(spot);
                  }
                  onSelectSpot(spot);
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 z-20"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <div
                  className={`px-3 py-1.5 rounded-full shadow-lg border-2 flex items-center gap-1.5 text-xs font-extrabold transition-all ${
                    currentGpsSpot?.id === spot.id
                      ? "bg-[#184D97] text-[#F6D081] border-[#F6D081] ring-4 ring-[#F6D081]/50 scale-110"
                      : "bg-[#F6E9D3] text-[#184D97] border-[#1888BF]"
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#1888BF] animate-pulse" />
                  <span>{spot.name}</span>
                </div>
              </button>
            ))}

          {/* Map Legend Panel */}
          <div className="absolute bottom-3 left-3 bg-[#F6E9D3]/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-[#BEC7E1] text-xs font-extrabold text-[#184D97] flex items-center gap-3.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#A7D9C7] border border-[#184D97]" />
              <span>空闲模块</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#34B8C5] border border-[#184D97]" />
              <span>使用中</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#F6D081] border border-[#184D97]" />
              <span>人流密集</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
