import React, { useState } from "react";
import { UserProfile, UserRole } from "../types";
import {
  ShieldCheck,
  Wallet,
  History,
  CheckCircle2,
  Phone,
  Eye,
  Clock,
  Briefcase,
  AlertTriangle,
  Award,
  Heart,
  HelpCircle,
  Video,
  FileText,
  UserCheck,
  PhoneCall,
  User,
  Wrench,
  MapPin,
  Send,
  X,
  MessageSquare,
  LogOut,
} from "lucide-react";

interface ProfileCreditModuleProps {
  userProfile: UserProfile;
  onToggleSeniorMode: () => void;
  isSeniorMode: boolean;
  onSwitchUserRole?: (role: UserRole) => void;
}

export const ProfileCreditModule: React.FC<ProfileCreditModuleProps> = ({
  userProfile,
  onToggleSeniorMode,
  isSeniorMode,
  onSwitchUserRole,
}) => {
  // Modals state
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showTierRulesModal, setShowTierRulesModal] = useState(false);
  const [showSeniorCareModal, setShowSeniorCareModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);

  // Admin Tool Modals
  const [showClockInModal, setShowClockInModal] = useState(false);
  const [showViolationsModal, setShowViolationsModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);

  // Form states
  const [appealText, setAppealText] = useState("");
  const [appealSubmitted, setAppealSubmitted] = useState(false);

  // Phone & SMS Login Modal state
  const [loginPhone, setLoginPhone] = useState("13888889999");
  const [loginCode, setLoginCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedRoleForLogin, setSelectedRoleForLogin] = useState<UserRole>(userProfile.role);
  const [loginSuccessToast, setLoginSuccessToast] = useState(false);

  // Admin Repair Form
  const [repairStool, setRepairStool] = useState("stool-02");
  const [repairType, setRepairType] = useState("折叠结构卡顿/损坏");
  const [repairDesc, setRepairDesc] = useState("");
  const [repairSuccess, setRepairSuccess] = useState(false);

  // Admin Clock-In Form
  const [clockInShift, setClockInShift] = useState("早市巡检班 (06:00-12:00)");
  const [clockInSuccess, setClockInSuccess] = useState(false);

  const isAdmin = userProfile.role === "admin";

  // Calculate tier status based on 100-point 4-tier rules
  const getTierInfo = (score: number) => {
    if (score >= 90) {
      return {
        label: "优秀",
        color: "bg-[#2E5C31] text-white border-[#2E5C31]",
        desc: "免押金特权、热门茶馆优先预约、老街合作商户专属折扣",
      };
    } else if (score >= 75) {
      return {
        label: "良好",
        color: "bg-[#1888BF] text-white border-[#1888BF]",
        desc: "正常基础状态，享受共享服务，交基础押金（按时归还秒退）",
      };
    } else if (score >= 60) {
      return {
        label: "预警",
        color: "bg-[#F6D081] text-[#184D97] border-[#184D97]",
        desc: "押金上浮、App温和弹窗提醒归还、暂停免押金与优先预约特权",
      };
    } else {
      return {
        label: "较差",
        color: "bg-[#8B2525] text-white border-[#8B2525]",
        desc: "限制使用，暂停租赁功能，需通过观看视频答题“修复信用”恢复",
      };
    }
  };

  const currentTier = getTierInfo(userProfile.creditScore);

  const handleQuizComplete = () => {
    alert("恭喜完成大马弄共享微空间公约视频学习与答题！信用分 +5 分");
    setShowQuizModal(false);
  };

  return (
    <div className="space-y-5">
      {/* 1. Profile & Account Info Header Card */}
      <div
        className={`rounded-3xl border-2 shadow-xs ${
          isSeniorMode
            ? "p-6 bg-[#F6E9D3] border-[#184D97] text-[#184D97]"
            : "p-6 bg-white border-[#BEC7E1] text-[#184D97]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-[#184D97] shadow-xs shrink-0"
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <h2
                  className={`font-extrabold truncate max-w-[160px] sm:max-w-none ${
                    isSeniorMode ? "text-2xl sm:text-3xl text-[#184D97]" : "text-xl sm:text-2xl text-[#184D97]"
                  }`}
                >
                  {userProfile.name}
                </h2>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border shrink-0 whitespace-nowrap ${
                    userProfile.role === "vendor"
                      ? "bg-[#1888BF] text-white border-[#1888BF]"
                      : userProfile.role === "admin"
                      ? "bg-[#184D97] text-[#F6D081] border-[#184D97]"
                      : "bg-[#A7D9C7] text-[#184D97] border-[#A7D9C7]"
                  }`}
                >
                  {userProfile.role === "vendor"
                    ? "大马弄摊贩/店主"
                    : userProfile.role === "admin"
                    ? "社区管理网格员"
                    : "老街居民/游客"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#1888BF] truncate">
                {userProfile.title}
              </p>
              <p className="text-xs sm:text-sm font-bold flex items-center gap-1 text-[#184D97]/80">
                <Phone className="w-3.5 h-3.5 text-[#1888BF]" /> {userProfile.phone}
              </p>
            </div>
          </div>

          {/* Account Login Identity Switch Button */}
          <button
            onClick={() => setShowSwitchRoleModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#F6E9D3] border-2 border-[#184D97] text-[#184D97] font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#F6D081] active:scale-95 transition-all self-start sm:self-auto shadow-2xs whitespace-nowrap"
          >
            <User className="w-4 h-4 text-[#1888BF]" />
            <span>切换登录账号</span>
          </button>
        </div>
      </div>

      {/* 2. ADMIN PROFILE VIEW: WORK METRICS */}
      {isAdmin ? (
        <div className="space-y-4">
          <div
            className={`rounded-3xl border-2 p-6 shadow-md space-y-4 ${
              isSeniorMode ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "bg-[#184D97] text-white border-[#BEC7E1]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#F6D081] text-[#184D97]">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#34B8C5]">
                  网格管理履职档案
                </span>
                <h3 className={`font-black ${isSeniorMode ? "text-2xl text-[#184D97]" : "text-xl sm:text-2xl text-white"}`}>
                  大马弄微空间网格02责任岗
                </h3>
              </div>
            </div>

            {/* Admin Work Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center space-y-1">
                <span className="text-xs text-[#F6D081] font-bold block">本月网格巡检时长</span>
                <div className="text-2xl sm:text-3xl font-black text-white">128<span className="text-xs font-bold">小时</span></div>
                <span className="text-[10px] text-white/80 block">每日巡检3频次</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center space-y-1">
                <span className="text-xs text-[#F6D081] font-bold block">干预处置预警件数</span>
                <div className="text-2xl sm:text-3xl font-black text-white">42<span className="text-xs font-bold">件</span></div>
                <span className="text-[10px] text-white/80 block">违规占道100%结案</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center space-y-1">
                <span className="text-xs text-[#F6D081] font-bold block">网格巡检及时率</span>
                <div className="text-2xl sm:text-3xl font-black text-[#A7D9C7]">99.5%</div>
                <span className="text-[10px] text-white/80 block">无超期未响应</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 text-center space-y-1">
                <span className="text-xs text-[#F6D081] font-bold block">群众评价满意度</span>
                <div className="text-2xl sm:text-3xl font-black text-[#F6D081]">4.95<span className="text-xs font-bold">/5</span></div>
                <span className="text-[10px] text-white/80 block">老街满意好评</span>
              </div>
            </div>
          </div>

          {/* Admin Management Tools Card (Working Interactive Buttons) */}
          <div
            className={`rounded-3xl border-2 p-5 shadow-xs space-y-3 ${
              isSeniorMode ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "bg-white border-[#BEC7E1] text-[#184D97]"
            }`}
          >
            <h4 className="font-extrabold text-base flex items-center gap-2 text-[#184D97]">
              <UserCheck className="w-5 h-5 text-[#1888BF]" />
              <span>工作快捷通道</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Button 1: Clock In */}
              <button
                onClick={() => setShowClockInModal(true)}
                className="p-3.5 bg-[#184D97] hover:bg-[#1888BF] text-[#F6D081] rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-2xs"
              >
                <Clock className="w-4 h-4 text-[#F6D081]" />
                <span>网格打卡记工</span>
              </button>

              {/* Button 2: Violations */}
              <button
                onClick={() => setShowViolationsModal(true)}
                className="p-3.5 bg-[#1888BF] hover:bg-[#184D97] text-white rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-2xs"
              >
                <AlertTriangle className="w-4 h-4 text-[#F6D081]" />
                <span>查看待处理违规</span>
              </button>

              {/* Button 3: Equipment Repair */}
              <button
                onClick={() => setShowRepairModal(true)}
                className="p-3.5 bg-[#34B8C5] hover:bg-[#1888BF] text-[#184D97] hover:text-white rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-2xs"
              >
                <Wrench className="w-4 h-4" />
                <span>资产设备报修</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* REGULAR USER (RESIDENT / VENDOR): CREDIT SCORE & COMPACT MODALS */
        <div className="space-y-5">
          {/* Credit Score Display Box */}
          <div
            className={`rounded-3xl border-2 shadow-md space-y-4 ${
              isSeniorMode ? "p-6 bg-[#F6E9D3] text-[#184D97] border-[#184D97]" : "p-6 bg-[#184D97] text-[#F6E9D3] border-[#184D97]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#F6D081] text-[#184D97] shrink-0">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#34B8C5]">
                    蒲公英信用分体系（满分 100 分）
                  </span>
                  <h3 className={`font-black ${isSeniorMode ? "text-2xl sm:text-3xl text-[#184D97]" : "text-xl sm:text-2xl text-white"}`}>
                    我的信用分：<span className="text-[#F6D081]">{userProfile.creditScore}</span> 分（{currentTier.label}）
                  </h3>
                </div>
              </div>

              <div className={`px-4 py-1.5 rounded-full font-black text-xs shadow-xs self-start sm:self-auto border whitespace-nowrap ${currentTier.color}`}>
                当前等级：{currentTier.label}
              </div>
            </div>

            {/* Requirement #1 Fix: High contrast legible text box */}
            <div className="p-4 rounded-2xl bg-[#F6E9D3] border-2 border-[#184D97] text-[#184D97] text-xs sm:text-sm font-black leading-relaxed shadow-xs">
              💡 <strong>基础规则：</strong>所有人初始起步均为 <strong>80分</strong>。按时归还模块、参与社区服务可加分；超时不还、违规乱放会被扣分。
            </div>

            {/* Requirement #2 Fix: Compact ? Buttons for 4-Tier Rules & Senior Care Modal */}
            <div className="flex items-center gap-2.5 flex-wrap pt-1">
              <button
                onClick={() => setShowTierRulesModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#F6D081] text-[#184D97] font-black text-xs sm:text-sm border-2 border-[#184D97] hover:bg-[#34B8C5] transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
              >
                <HelpCircle className="w-4 h-4 text-[#184D97]" />
                <span>信用等级四级权益规则 ？</span>
              </button>

              <button
                onClick={() => setShowSeniorCareModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#A7D9C7] text-[#184D97] font-black text-xs sm:text-sm border-2 border-[#184D97] hover:bg-[#34B8C5] transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95"
              >
                <Heart className="w-4 h-4 text-red-600 fill-current" />
                <span>适老化服务与修复机制 ？</span>
              </button>
            </div>
          </div>

          {/* Wallet & Rental Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`rounded-3xl border-2 shadow-xs space-y-2 ${
                isSeniorMode ? "p-6 bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "p-5 bg-white border-[#BEC7E1] text-[#184D97]"
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
                <span className="flex items-center gap-1.5 text-[#184D97]">
                  <Wallet className="w-4 h-4 text-[#1888BF]" /> 押金与微支付钱包
                </span>
                <span className="text-[#34B8C5] font-extrabold">自动秒退保障</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#184D97]">
                ￥{userProfile.depositBalance.toFixed(2)}
              </div>
              <p className="text-xs text-[#184D97]/80 font-medium">
                归还至指定堆放点后，押金自动秒退回微信零钱。
              </p>
            </div>

            <div
              className={`rounded-3xl border-2 shadow-xs space-y-2 ${
                isSeniorMode ? "p-6 bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "p-5 bg-white border-[#BEC7E1] text-[#184D97]"
              }`}
            >
              <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold">
                <span className="flex items-center gap-1.5 text-[#184D97]">
                  <History className="w-4 h-4 text-[#1888BF]" /> 累计借用与减碳
                </span>
                <span className="text-[#34B8C5] font-extrabold">共享低碳履约</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#184D97]">
                {userProfile.totalRentalsCount} 次
              </div>
              <p className="text-xs text-[#184D97]/80 font-medium">
                已为大马弄老街减少 {userProfile.totalSavedCo2Kg}kg 碳排放量。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Requirement #6 Fix: Contact Community Admin / Grid Captain Card (Hide for Admin) */}
      {!isAdmin && (
        <div
          className={`rounded-3xl border-2 p-5 shadow-xs space-y-3 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "bg-white border-[#BEC7E1] text-[#184D97]"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-[#184D97] flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-[#1888BF]" />
                <span>联系社区网格管理员 / 直连网格长</span>
              </h4>
              <p className="text-xs text-[#184D97]/80 font-medium">
                遇到使用困难、定位偏移或求助，可随时呼叫大马弄网格责任队长（李队长）
              </p>
            </div>
            <button
              onClick={() => setShowContactAdminModal(true)}
              className="px-4 py-2.5 bg-[#184D97] hover:bg-[#1888BF] text-[#F6D081] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 text-[#F6D081]" />
              <span>呼叫网格长直连</span>
            </button>
          </div>
        </div>
      )}

      {/* Senior Mode Toggle Card */}
      <div
        className={`rounded-3xl flex items-center justify-between shadow-xs border-2 ${
          isSeniorMode
            ? "p-6 bg-[#F6E9D3] text-[#184D97] border-[#184D97]"
            : "p-5 bg-[#184D97] text-white border-[#184D97]"
        }`}
      >
        <div className="space-y-1">
          <h4 className="font-extrabold text-base text-[#F6D081] flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#F6D081]" />
            <span>长辈关怀无障碍模式</span>
          </h4>
          <p className="text-xs sm:text-sm text-[#F6E9D3]/90 font-medium">
            特大字号、高对比度蓝金与暖沙背景、视力友好与专属AI语音
          </p>
        </div>
        <button
          onClick={onToggleSeniorMode}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-transform active:scale-95 whitespace-nowrap ${
            isSeniorMode
              ? "bg-[#184D97] text-[#F6D081]"
              : "bg-[#F6D081] text-[#184D97] hover:bg-[#34B8C5]"
          }`}
        >
          {isSeniorMode ? "已开启 · 点击关闭" : "开启长辈模式"}
        </button>
      </div>

      {/* --- MODAL 1: 4-Tier Credit Rules Modal --- */}
      {showTierRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-lg w-full space-y-4 border-2 border-[#184D97] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <Award className="w-5 h-5 text-[#1888BF]" />
                <span>蒲公英信用分四级权益与约束规则</span>
              </h3>
              <button
                onClick={() => setShowTierRulesModal(false)}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#184D97]/80 font-medium">
              所有人初始起步均为 80 分。按时归还模块、参与社区服务可加分；超时不还、违规乱放会被扣分。
            </p>

            <div className="space-y-2.5">
              {/* Tier 1 */}
              <div className="p-3.5 rounded-2xl bg-[#2E5C31]/10 border-2 border-[#2E5C31] space-y-1">
                <div className="flex items-center justify-between font-extrabold text-sm">
                  <span className="text-[#2E5C31]">🌟 优秀级（90 - 100 分）</span>
                  <span className="text-[10px] bg-[#2E5C31] text-white px-2 py-0.5 rounded-md">专属特权</span>
                </div>
                <p className="text-xs font-medium text-[#184D97]">
                  享受免押金租赁特权、热门老街茶馆优先预约位、合作商户（如周萍油炸鱼、酱鸭店）专属 9 折优惠。
                </p>
              </div>

              {/* Tier 2 */}
              <div className="p-3.5 rounded-2xl bg-[#1888BF]/10 border-2 border-[#1888BF] space-y-1">
                <div className="flex items-center justify-between font-extrabold text-sm">
                  <span className="text-[#1888BF]">👍 良好级（75 - 89 分）</span>
                  <span className="text-[10px] bg-[#1888BF] text-white px-2 py-0.5 rounded-md">新用户初始</span>
                </div>
                <p className="text-xs font-medium text-[#184D97]">
                  新注册用户初始起点（80分），正常享受共享模块租赁服务，交基础押金（按时归还秒退至微信零钱）。
                </p>
              </div>

              {/* Tier 3 */}
              <div className="p-3.5 rounded-2xl bg-[#F6D081]/30 border-2 border-[#184D97] space-y-1">
                <div className="flex items-center justify-between font-extrabold text-sm">
                  <span className="text-[#184D97]">⚠️ 预警级（60 - 74 分）</span>
                  <span className="text-[10px] bg-[#F6D081] text-[#184D97] px-2 py-0.5 rounded-md">受限提醒</span>
                </div>
                <p className="text-xs font-medium text-[#184D97]">
                  租赁押金适度上浮，App弹出温和语音与文字提醒归还，暂停免押金与茶馆优先预约资格。
                </p>
              </div>

              {/* Tier 4 */}
              <div className="p-3.5 rounded-2xl bg-[#8B2525]/10 border-2 border-[#8B2525] space-y-1">
                <div className="flex items-center justify-between font-extrabold text-sm">
                  <span className="text-[#8B2525]">🚫 较差级（60 分以下）</span>
                  <span className="text-[10px] bg-[#8B2525] text-white px-2 py-0.5 rounded-md">暂停使用</span>
                </div>
                <p className="text-xs font-medium text-[#184D97]">
                  暂停共享模块租赁权限。必须通过观看老街文明使用视频并完成答题“修复信用”后方可恢复。
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTierRulesModal(false)}
                className="px-5 py-2.5 bg-[#184D97] text-[#F6D081] font-extrabold text-xs rounded-xl hover:bg-[#1888BF]"
              >
                了解并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Senior Care Service Modal --- */}
      {showSeniorCareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-lg w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span>适老化“温度”服务与修复机制</span>
              </h3>
              <button
                onClick={() => setShowSeniorCareModal(false)}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-[#F6E9D3] border border-[#184D97] space-y-1">
                <h4 className="font-extrabold text-[#184D97] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2E5C31]" />
                  <span>长辈每年 1 次“忘还免罚”豁免权</span>
                </h4>
                <p className="text-xs text-[#184D97]/80 font-medium">
                  针对 60 岁以上的老街长辈居民，因遗忘归还或定位漂移造成的超时，系统每年提供 1 次温馨豁免免扣分机会。
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6E9D3] border border-[#184D97] space-y-2">
                <h4 className="font-extrabold text-[#184D97] flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#1888BF]" />
                  <span>观看文明公约视频答题修复信用</span>
                </h4>
                <p className="text-xs text-[#184D97]/80 font-medium">
                  因误操作导致扣分的用户，可通过观看 15 秒老街公约短视频并完成 1 道简单选择题，立即可获得 +5 分信用修复。
                </p>
                <button
                  onClick={() => {
                    setShowSeniorCareModal(false);
                    setShowQuizModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1888BF] text-white text-xs font-extrabold hover:bg-[#184D97] transition-all"
                >
                  去观看视频答题 (+5分)
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F6E9D3] border border-[#184D97] space-y-2">
                <h4 className="font-extrabold text-[#184D97] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#34B8C5]" />
                  <span>系统误判一键提交申诉</span>
                </h4>
                <p className="text-xs text-[#184D97]/80 font-medium">
                  如对扣分有异议（如定位不准或已交还给网格员），可发起线上快速申诉，社区管理员将在 2 小时内复核修正。
                </p>
                <button
                  onClick={() => {
                    setShowSeniorCareModal(false);
                    setShowAppealModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#34B8C5] text-[#184D97] text-xs font-extrabold hover:bg-[#1888BF] hover:text-white transition-all"
                >
                  发起误判申诉
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSeniorCareModal(false)}
                className="px-5 py-2.5 bg-[#184D97] text-[#F6D081] font-extrabold text-xs rounded-xl hover:bg-[#1888BF]"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: Admin Clock-In Modal (网格打卡记工) --- */}
      {showClockInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <Clock className="w-5 h-5 text-[#1888BF]" />
                <span>网格员移动巡检考勤打卡记工</span>
              </h3>
              <button
                onClick={() => {
                  setShowClockInModal(false);
                  setClockInSuccess(false);
                }}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F6E9D3] border border-[#184D97] rounded-2xl space-y-1">
                <div className="font-extrabold text-[#184D97]">当前定位与网格责任区：</div>
                <div className="text-xs font-bold text-[#1888BF] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> 大马弄02号网格巡检站（GPS信号极佳）
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">选择打卡班次：</label>
                <select
                  value={clockInShift}
                  onChange={(e) => setClockInShift(e.target.value)}
                  className="w-full p-2.5 border-2 border-[#BEC7E1] rounded-xl text-xs font-bold text-[#184D97]"
                >
                  <option>早市巡检班 (06:00-12:00)</option>
                  <option>午后茶憩巡检班 (12:00-18:00)</option>
                  <option>晚间秩序巡检班 (18:00-22:00)</option>
                </select>
              </div>

              {clockInSuccess && (
                <div className="p-3 bg-[#A7D9C7] text-[#184D97] rounded-xl font-black text-xs">
                  ✅ 打卡成功！【{clockInShift}】考勤已实时记入大马弄网格员履职档案。
                </div>
              )}

              <button
                onClick={() => {
                  setClockInSuccess(true);
                  setTimeout(() => {
                    setShowClockInModal(false);
                    setClockInSuccess(false);
                  }, 1800);
                }}
                className="w-full p-3 bg-[#184D97] text-[#F6D081] rounded-xl font-extrabold text-xs hover:bg-[#1888BF] shadow-xs active:scale-98"
              >
                一键提交巡检考勤打卡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: Admin Violations Modal (查看待处理违规) --- */}
      {showViolationsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-lg w-full space-y-4 border-2 border-[#184D97] shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <AlertTriangle className="w-5 h-5 text-[#184D97]" />
                <span>实时待处理违规与占道事件</span>
              </h3>
              <button
                onClick={() => setShowViolationsModal(false)}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F6D081]/30 border-2 border-[#184D97] rounded-2xl space-y-1">
                <div className="flex items-center justify-between font-extrabold">
                  <span className="text-[#184D97]">⚠️ 违规占道（模块编号：stool-02）</span>
                  <span className="text-[10px] bg-[#184D97] text-[#F6D081] px-2 py-0.5 rounded-full">高优先度</span>
                </div>
                <p className="text-[#184D97] font-medium">
                  位置：周萍油炸鱼门口大马弄主干道中央 | 责任人：老王（摊贩）
                </p>
                <button
                  onClick={() => {
                    alert("已完成现场巡检处置，将模块归位至指定堆放点，责任人扣减10信用分。");
                    setShowViolationsModal(false);
                  }}
                  className="mt-1 px-3 py-1.5 bg-[#184D97] text-[#F6D081] rounded-xl font-extrabold text-xs hover:bg-[#1888BF]"
                >
                  现场干预并归位 (-10分)
                </button>
              </div>

              <div className="p-3.5 bg-[#BEC7E1]/30 border-2 border-[#1888BF] rounded-2xl space-y-1">
                <div className="flex items-center justify-between font-extrabold">
                  <span className="text-[#184D97]">⚡ 低电量预警（模块编号：stool-06）</span>
                  <span className="text-[10px] bg-[#1888BF] text-white px-2 py-0.5 rounded-full">设备提醒</span>
                </div>
                <p className="text-[#184D97] font-medium">
                  当前剩余电量 12%，请及时归位至共享充能站。
                </p>
                <button
                  onClick={() => {
                    alert("运维派单成功：电池班组将在一小时内进行电池更换。");
                    setShowViolationsModal(false);
                  }}
                  className="mt-1 px-3 py-1.5 bg-[#1888BF] text-white rounded-xl font-extrabold text-xs hover:bg-[#184D97]"
                >
                  一键派发换电工单
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowViolationsModal(false)}
                className="px-4 py-2 bg-gray-200 text-[#184D97] font-extrabold text-xs rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: Admin Equipment Repair Modal (资产设备报修) --- */}
      {showRepairModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <Wrench className="w-5 h-5 text-[#34B8C5]" />
                <span>蒲公英共享模块资产报修工单</span>
              </h3>
              <button
                onClick={() => {
                  setShowRepairModal(false);
                  setRepairSuccess(false);
                }}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">选择故障设备编号：</label>
                <select
                  value={repairStool}
                  onChange={(e) => setRepairStool(e.target.value)}
                  className="w-full p-2.5 border-2 border-[#BEC7E1] rounded-xl text-xs font-bold text-[#184D97]"
                >
                  <option value="stool-01">stool-01 (大马弄北牌坊折叠扩展模块)</option>
                  <option value="stool-02">stool-02 (周萍油炸鱼门前木凳组)</option>
                  <option value="stool-03">stool-03 (太庙遗址古树茶歇组合卡座)</option>
                  <option value="stool-04">stool-04 (察院前风情巷打卡折叠小椅)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">故障类型分类：</label>
                <select
                  value={repairType}
                  onChange={(e) => setRepairType(e.target.value)}
                  className="w-full p-2.5 border-2 border-[#BEC7E1] rounded-xl text-xs font-bold text-[#184D97]"
                >
                  <option>折叠结构卡顿/损坏</option>
                  <option>GPS定位坐标偏差</option>
                  <option>智能二维码磨损不清</option>
                  <option>模块配件缺损/涂鸦</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">故障详细描述：</label>
                <textarea
                  value={repairDesc}
                  onChange={(e) => setRepairDesc(e.target.value)}
                  placeholder="请输入报修具体情况（如：合页卡死，无法顺利展开...）"
                  className="w-full h-20 p-2.5 border-2 border-[#BEC7E1] rounded-xl text-xs font-bold focus:outline-none focus:border-[#184D97]"
                />
              </div>

              {repairSuccess && (
                <div className="p-3 bg-[#A7D9C7] text-[#184D97] rounded-xl font-black text-xs">
                  ✅ 报修工单已生成！紧急运维小组将在 2 小时内到场进行设备维修。
                </div>
              )}

              <button
                onClick={() => {
                  setRepairSuccess(true);
                  setTimeout(() => {
                    setShowRepairModal(false);
                    setRepairSuccess(false);
                    setRepairDesc("");
                  }, 1800);
                }}
                className="w-full p-3 bg-[#34B8C5] text-[#184D97] rounded-xl font-extrabold text-xs hover:bg-[#1888BF] hover:text-white shadow-xs active:scale-98"
              >
                提交运维报修单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 6: Contact Admin Modal (联系网格长) --- */}
      {showContactAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <PhoneCall className="w-5 h-5 text-[#1888BF]" />
                <span>大马弄社区网格责任队长（李队长）</span>
              </h3>
              <button
                onClick={() => setShowContactAdminModal(false)}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 bg-[#F6E9D3] border-2 border-[#184D97] rounded-2xl space-y-2">
                <div className="font-extrabold text-[#184D97] text-sm">直连电话：0571-8706****</div>
                <div className="text-xs text-[#184D97]/90 font-bold">责任岗位：大马弄 02 号网格巡检站</div>
                <div className="text-xs text-[#1888BF] font-extrabold">服务承诺：15 分钟内网格现场响应到场</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert("正在呼叫网格长电话：0571-8706****...")}
                  className="p-3 bg-[#184D97] text-[#F6D081] font-extrabold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>拨打电话</span>
                </button>
                <button
                  onClick={() => alert("直连微信消息已发送给李队长！")}
                  className="p-3 bg-[#34B8C5] text-[#184D97] font-extrabold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>在线发送求助</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowContactAdminModal(false)}
                className="px-4 py-2 bg-gray-200 text-[#184D97] font-extrabold text-xs rounded-xl"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 7: Switch Account / Login Modal with Phone & SMS Verification --- */}
      {showSwitchRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
              <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
                <User className="w-5 h-5 text-[#1888BF]" />
                <span>切换登录账号</span>
              </h3>
              <button
                onClick={() => {
                  setShowSwitchRoleModal(false);
                  setLoginSuccessToast(false);
                }}
                className="p-1 rounded-full bg-gray-100 text-[#184D97] hover:bg-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Phone number input */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">手机号码：</label>
                <input
                  type="tel"
                  maxLength={11}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="请输入手机号码（如：13888889999）"
                  className="w-full p-3 border-2 border-[#BEC7E1] rounded-xl font-bold text-xs text-[#184D97] focus:outline-none focus:border-[#184D97]"
                />
              </div>

              {/* Verification Code input + Get Code button */}
              <div className="space-y-1">
                <label className="font-extrabold text-[#184D97] block">短信验证码：</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={loginCode}
                    onChange={(e) => setLoginCode(e.target.value)}
                    placeholder="请输入验证码"
                    className="flex-1 p-3 border-2 border-[#BEC7E1] rounded-xl font-bold text-xs text-[#184D97] focus:outline-none focus:border-[#184D97]"
                  />
                  <button
                    disabled={countdown > 0}
                    onClick={() => {
                      if (!loginPhone || loginPhone.length < 11) {
                        alert("请输入正确的11位手机号码！");
                        return;
                      }
                      setCodeSent(true);
                      setLoginCode("8888");
                      setCountdown(60);
                      const timer = setInterval(() => {
                        setCountdown((prev) => {
                          if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                          }
                          return prev - 1;
                        });
                      }, 1000);
                    }}
                    className={`px-3.5 py-3 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all ${
                      countdown > 0
                        ? "bg-gray-200 text-gray-500"
                        : "bg-[#1888BF] hover:bg-[#184D97] text-white active:scale-95"
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重新获取` : "接受验证码"}
                  </button>
                </div>
              </div>

              {codeSent && (
                <div className="p-2.5 bg-[#A7D9C7]/40 border border-[#2E5C31] text-[#2E5C31] rounded-xl font-extrabold text-[11px] flex items-center justify-between">
                  <span>✅ 验证码已发送至 {loginPhone}，模拟验证码：<strong>8888</strong></span>
                </div>
              )}

              {/* Quick switch account identity preset selector */}
              <div className="pt-2 border-t border-[#BEC7E1]/60 space-y-1.5">
                <label className="font-extrabold text-[#184D97] block">选择关联账号角色身份：</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleForLogin("resident");
                      setLoginPhone("13888889999");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      selectedRoleForLogin === "resident"
                        ? "bg-[#184D97] text-[#F6D081] border-[#184D97] font-black"
                        : "bg-[#F6E9D3] text-[#184D97] border-[#BEC7E1] font-bold"
                    }`}
                  >
                    <div className="text-xs">老街居民</div>
                    <div className="text-[9px] opacity-80">138****9999</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleForLogin("vendor");
                      setLoginPhone("13966668888");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      selectedRoleForLogin === "vendor"
                        ? "bg-[#184D97] text-[#F6D081] border-[#184D97] font-black"
                        : "bg-[#F6E9D3] text-[#184D97] border-[#BEC7E1] font-bold"
                    }`}
                  >
                    <div className="text-xs">摊贩/店主</div>
                    <div className="text-[9px] opacity-80">139****8888</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleForLogin("admin");
                      setLoginPhone("15099998888");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                      selectedRoleForLogin === "admin"
                        ? "bg-[#184D97] text-[#F6D081] border-[#184D97] font-black"
                        : "bg-[#F6E9D3] text-[#184D97] border-[#BEC7E1] font-bold"
                    }`}
                  >
                    <div className="text-xs">社区网格员</div>
                    <div className="text-[9px] opacity-80">150****8888</div>
                  </button>
                </div>
              </div>

              {loginSuccessToast && (
                <div className="p-3 bg-[#A7D9C7] text-[#184D97] rounded-xl font-black text-xs text-center">
                  🎉 登录验证通过！已成功切换至【{
                    selectedRoleForLogin === "vendor"
                      ? "大马弄摊贩/店主"
                      : selectedRoleForLogin === "admin"
                      ? "社区管理网格员"
                      : "老街居民/游客"
                  }】账号。
                </div>
              )}

              {/* Submit Login Button */}
              <button
                onClick={() => {
                  if (!loginPhone || loginPhone.length < 11) {
                    alert("请输入正确的手机号码！");
                    return;
                  }
                  if (!loginCode) {
                    alert("请输入接受到的验证码（测试验证码为：8888）");
                    return;
                  }
                  setLoginSuccessToast(true);
                  if (onSwitchUserRole) {
                    onSwitchUserRole(selectedRoleForLogin);
                  }
                  setTimeout(() => {
                    setShowSwitchRoleModal(false);
                    setLoginSuccessToast(false);
                  }, 1200);
                }}
                className="w-full p-3.5 bg-[#184D97] hover:bg-[#1888BF] text-[#F6D081] rounded-xl font-extrabold text-xs sm:text-sm shadow-xs transition-transform active:scale-98"
              >
                确认登录并切换账号
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 8: Appeal Modal --- */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
              <HelpCircle className="w-5 h-5 text-[#34B8C5]" />
              <span>一键提交系统误判申诉</span>
            </h3>
            <p className="text-xs text-[#184D97]/80 font-medium">
              如因定位漂移或超时误扣，可在此提交说明，社区网格管理员（李队长）将在2小时内审核复核。
            </p>
            <textarea
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              placeholder="请输入申诉原因或说明（如：已按时放置在堆放点旁，系统定位延迟...）"
              className="w-full h-24 border-2 border-[#BEC7E1] rounded-2xl p-3 text-xs font-bold focus:outline-none focus:border-[#184D97]"
            />
            {appealSubmitted && (
              <div className="p-3 bg-[#A7D9C7] text-[#184D97] rounded-2xl text-xs font-black">
                ✅ 申诉已成功提交至大马弄网格管理组！正在加急核查中。
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAppealModal(false);
                  setAppealSubmitted(false);
                  setAppealText("");
                }}
                className="px-4 py-2 bg-gray-200 text-[#184D97] font-extrabold text-xs rounded-xl"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setAppealSubmitted(true);
                  setTimeout(() => {
                    setShowAppealModal(false);
                    setAppealSubmitted(false);
                    setAppealText("");
                  }, 1800);
                }}
                className="px-4 py-2 bg-[#184D97] text-[#F6D081] font-extrabold text-xs rounded-xl hover:bg-[#1888BF]"
              >
                提交申诉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 9: Quiz Modal --- */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-[#184D97] p-6 rounded-3xl max-w-md w-full space-y-4 border-2 border-[#184D97] shadow-xl">
            <h3 className="font-black text-lg flex items-center gap-2 text-[#184D97]">
              <Video className="w-5 h-5 text-[#1888BF]" />
              <span>观看文明公约答题 · 修复信用分</span>
            </h3>
            <div className="p-4 bg-[#184D97] text-white rounded-2xl space-y-2 text-center">
              <span className="text-xs text-[#F6D081] font-bold">老街文明使用导览（15秒）</span>
              <p className="text-sm font-extrabold">“用完归还堆放点，大马弄巷道更通畅”</p>
            </div>
            <div className="space-y-2 text-xs font-extrabold">
              <p>问题：使用完毕蒲公英共享模块后，应该摆放在哪里？</p>
              <button
                onClick={handleQuizComplete}
                className="w-full p-3 bg-[#F6E9D3] border-2 border-[#184D97] rounded-xl text-left hover:bg-[#F6D081]"
              >
                A. 归还至大马弄指定堆放点或茶馆门口共享站（正确）
              </button>
              <button
                onClick={() => alert("回答错误，请再想想看哦！")}
                className="w-full p-3 bg-gray-100 border rounded-xl text-left opacity-70"
              >
                B. 随意丢在大马弄道路中央
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-4 py-2 bg-gray-200 text-[#184D97] font-extrabold text-xs rounded-xl"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
