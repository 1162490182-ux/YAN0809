import React, { useState } from "react";
import {
  UserRole,
  TimeSlot,
  StoolModule,
  CulturalSpot,
  SystemAlert,
  UserProfile,
  VoiceIntentResponse,
} from "./types";
import {
  initialUserProfile,
  initialStoolModules,
  initialCulturalSpots,
  initialSystemAlerts,
} from "./data/dandelionData";

import { AppCover } from "./components/AppCover";
import { HeaderNavbar } from "./components/HeaderNavbar";
import { SeniorModeBanner } from "./components/SeniorModeBanner";
import { AIVoiceModal } from "./components/AIVoiceModal";
import { ScanUnlockModal } from "./components/ScanUnlockModal";
import { MapView } from "./components/MapView";
import { VendorDashboard } from "./components/VendorDashboard";
import { ResidentDashboard } from "./components/ResidentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { StoolsListModule } from "./components/StoolsListModule";
import { ProfileCreditModule } from "./components/ProfileCreditModule";
import { CultureDetailModal } from "./components/CultureDetailModal";
import { WarningBottomSheetModal } from "./components/WarningBottomSheetModal";
import { BottomTabBar } from "./components/BottomTabBar";

import {
  Mic,
  MapPin,
  Store,
  Users,
  Shield,
  Layers,
} from "lucide-react";

export default function App() {
  const [showCover, setShowCover] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<UserRole>("resident");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [activeTimeMode, setActiveTimeMode] = useState<TimeSlot>("morning");

  // Domain state
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [stools, setStools] = useState<StoolModule[]>(initialStoolModules);
  const [spots] = useState<CulturalSpot[]>(initialCulturalSpots);
  const [alerts, setAlerts] = useState<SystemAlert[]>(initialSystemAlerts);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedSpotForDetail, setSelectedSpotForDetail] = useState<CulturalSpot | null>(null);
  const [selectedAlertForWarning, setSelectedAlertForWarning] = useState<SystemAlert | null>(null);

  const toggleSeniorMode = () => {
    setUserProfile((prev) => ({
      ...prev,
      isSeniorMode: !prev.isSeniorMode,
    }));
  };

  const handleUnlockStoolSuccess = (stoolId: string) => {
    setStools((prev) =>
      prev.map((s) =>
        s.id === stoolId
          ? {
              ...s,
              status: "rented" as const,
              renterName: userProfile.name,
              isFolded: false,
            }
          : s
      )
    );
    setUserProfile((prev) => ({
      ...prev,
      rentedStoolId: stoolId,
      totalRentalsCount: prev.totalRentalsCount + 1,
    }));
  };

  const handleReturnStool = (stoolId: string) => {
    setStools((prev) =>
      prev.map((s) =>
        s.id === stoolId
          ? {
              ...s,
              status: "idle" as const,
              renterName: undefined,
              isFolded: true,
            }
          : s
      )
    );
    setUserProfile((prev) => ({
      ...prev,
      rentedStoolId: undefined,
      creditScore: prev.creditScore + 5, // Reward on-time return
    }));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleExecuteVoiceIntent = (intent: VoiceIntentResponse) => {
    if (intent.targetTab) {
      if (intent.targetTab === "cockpit" && currentRole !== "admin") {
        setActiveTab("home");
      } else {
        setActiveTab(intent.targetTab);
      }
    }

    if (intent.action === "TOGGLE_SENIOR") {
      setUserProfile((prev) => ({ ...prev, isSeniorMode: true }));
    } else if (intent.action === "RENT_STOOL") {
      setIsScanModalOpen(true);
    } else if (intent.action === "NAVIGATE_TEA") {
      setActiveTimeMode("afternoon");
      setActiveTab("map");
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole !== "admin" && activeTab === "cockpit") {
      setActiveTab("home");
    }
  };

  const isSenior = userProfile.isSeniorMode;

  const handleSelectProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentRole(profile.role);
    setShowCover(false);
  };

  if (showCover) {
    return (
      <AppCover
        onSelectProfile={handleSelectProfile}
        isSeniorMode={isSenior}
      />
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 overflow-x-hidden w-full transition-colors duration-300 font-sans ${
        isSenior ? "bg-[#F6E9D3] text-[#184D97]" : "bg-[#F6E9D3]/30 text-[#184D97]"
      }`}
    >
      {/* Top Navbar */}
      <HeaderNavbar
        currentRole={currentRole}
        onChangeRole={handleRoleChange}
        userProfile={userProfile}
        onSelectProfile={handleSelectProfile}
        onToggleSeniorMode={toggleSeniorMode}
        onOpenScanModal={() => setIsScanModalOpen(true)}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenCover={() => setShowCover(true)}
      />

      {/* Senior Mode Accessibility Banner */}
      {isSenior && (
        <SeniorModeBanner
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onQuickRent={() => setIsScanModalOpen(true)}
          onFindTea={() => {
            setActiveTimeMode("afternoon");
            setActiveTab("map");
          }}
          onOpenWarningModal={() =>
            setSelectedAlertForWarning(alerts.find((a) => !a.resolved) || alerts[0])
          }
          hasActiveWarning={alerts.some((a) => !a.resolved)}
        />
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
        {/* Role Cards Banner on Home Hub */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Single Current Workbench Banner */}
            <div
              className={`p-4 sm:p-5 rounded-3xl border-2 flex items-center justify-between gap-3 shadow-sm ${
                isSenior
                  ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]"
                  : "bg-white border-[#BEC7E1] text-[#184D97]"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#184D97] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-extrabold text-[#1888BF]">当前登录：</span>
                      <strong className="text-[#184D97] text-sm sm:text-base font-black">{userProfile.name}</strong>
                      <span className="text-xs text-[#184D97]/80 font-medium">({userProfile.title})</span>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                        userProfile.role === "vendor"
                          ? "bg-[#1888BF] text-white"
                          : userProfile.role === "admin"
                          ? "bg-[#184D97] text-[#F6D081]"
                          : "bg-[#A7D9C7] text-[#184D97]"
                      }`}
                    >
                      {currentRole === "vendor" ? "摊贩 / 店主" : currentRole === "resident" ? "居民 / 游客" : "社区管理"}
                    </span>
                  </div>
                  <h3 className={`font-extrabold ${isSenior ? "text-base sm:text-lg text-[#184D97]" : "text-sm sm:text-base text-[#184D97]"}`}>
                    {currentRole === "vendor" && "大马弄早市摊位与门前扩展租赁工作台"}
                    {currentRole === "resident" && "大马弄智慧时空地图与老街文化导览"}
                    {currentRole === "admin" && "大马弄微空间公共资产巡检与数字监管"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Quick AI Voice Banner on Homepage - ONLY in Senior Mode */}
            {isSenior && (
              <div
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-4 sm:p-5 rounded-2xl bg-white text-[#1c1e36] shadow-sm border-2 border-[#fdd85d] flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fdd85d] text-[#1c1e36] flex items-center justify-center shrink-0 font-bold">
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base sm:text-lg text-[#1c1e36]">
                        长辈 AI 语音助手
                      </span>
                    </div>
                    <p className="text-xs text-[#1c1e36]/80 font-bold mt-0.5">
                      点击按钮直接说话
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-[#fdd85d] text-[#1c1e36] px-3 py-1.5 rounded-xl hidden sm:inline">
                  按住说话
                </span>
              </div>
            )}

            {/* Render Role-based Workflow View */}
            {currentRole === "vendor" && (
              <VendorDashboard
                stools={stools}
                userProfile={userProfile}
                activeTimeMode={activeTimeMode}
                onOpenScanModal={() => setIsScanModalOpen(true)}
                onReturnStool={handleReturnStool}
                isSeniorMode={isSenior}
              />
            )}

            {currentRole === "resident" && (
              <ResidentDashboard
                spots={spots}
                stools={stools}
                activeTimeMode={activeTimeMode}
                onChangeTimeMode={setActiveTimeMode}
                onSelectSpot={setSelectedSpotForDetail}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                isSeniorMode={isSenior}
              />
            )}

            {currentRole === "admin" && (
              <AdminDashboard
                stools={stools}
                alerts={alerts}
                onResolveAlert={handleResolveAlert}
                isSeniorMode={isSenior}
                isHomeOnly={true}
              />
            )}
          </div>
        )}

        {/* Tab 2: Map View */}
        {activeTab === "map" && (
          <div className="space-y-4">
            <MapView
              stools={stools}
              spots={spots}
              activeTimeMode={activeTimeMode}
              onChangeTimeMode={setActiveTimeMode}
              onSelectStool={() => setIsScanModalOpen(true)}
              onSelectSpot={setSelectedSpotForDetail}
              isSeniorMode={isSenior}
            />
          </div>
        )}

        {/* Tab 3: Stools List */}
        {activeTab === "stools" && (
          <StoolsListModule
            stools={stools}
            userProfile={userProfile}
            onOpenScanModal={() => setIsScanModalOpen(true)}
            onSelectStool={() => setIsScanModalOpen(true)}
            isSeniorMode={isSenior}
          />
        )}

        {/* Tab 4: Admin Cockpit (Only accessible to Admin role) */}
        {activeTab === "cockpit" && currentRole === "admin" && (
          <AdminDashboard
            stools={stools}
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            isSeniorMode={isSenior}
          />
        )}

        {/* Tab 5: Profile & Credit */}
        {activeTab === "credit" && (
          <ProfileCreditModule
            userProfile={userProfile}
            onToggleSeniorMode={toggleSeniorMode}
            isSeniorMode={isSenior}
          />
        )}
      </main>

      {/* Floating AI Voice Mic Button for quick access - ONLY in Senior Mode */}
      {isSenior && (
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="fixed bottom-20 right-4 z-30 p-4 rounded-full shadow-2xl transition-transform active:scale-90 flex items-center justify-center bg-[#5C5C4A] text-white border-2 border-[#5C5C4A] ring-4 ring-[#5C5C4A]/30"
          title="长辈 AI 语音助手"
        >
          <Mic className="w-7 h-7" />
        </button>
      )}

      {/* Modals */}
      <AIVoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        userRole={currentRole}
        isSeniorMode={isSenior}
        onExecuteAction={handleExecuteVoiceIntent}
      />

      <ScanUnlockModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        stools={stools}
        userProfile={userProfile}
        onUnlockSuccess={handleUnlockStoolSuccess}
        isSeniorMode={isSenior}
      />

      <CultureDetailModal
        spot={selectedSpotForDetail}
        onClose={() => setSelectedSpotForDetail(null)}
        isSeniorMode={isSenior}
      />

      <WarningBottomSheetModal
        isOpen={!!selectedAlertForWarning}
        onClose={() => setSelectedAlertForWarning(null)}
        alertItem={selectedAlertForWarning}
        onResolve={handleResolveAlert}
        isSeniorMode={isSenior}
      />

      {/* Bottom Navigation Tab Bar */}
      <BottomTabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        currentRole={currentRole}
        isSeniorMode={isSenior}
        unreadAlertsCount={alerts.filter((a) => !a.resolved).length}
      />
    </div>
  );
}

