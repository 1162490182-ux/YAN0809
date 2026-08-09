import React from "react";
import { StoolModule, SystemAlert } from "../types";
import {
  ShieldAlert,
  BarChart3,
  Activity,
  Layers,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Battery,
  UserCheck,
  Search,
  BellRing,
} from "lucide-react";

interface AdminDashboardProps {
  stools: StoolModule[];
  alerts: SystemAlert[];
  onResolveAlert: (alertId: string) => void;
  isSeniorMode: boolean;
  isHomeOnly?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stools,
  alerts,
  onResolveAlert,
  isSeniorMode,
  isHomeOnly = false,
}) => {
  const totalStools = stools.length;
  const rentedStools = stools.filter((s) => s.status === "rented").length;
  const idleStools = stools.filter((s) => s.status === "idle").length;
  const warningStools = stools.filter((s) => s.status === "warning").length;
  const pendingAlerts = alerts.filter((a) => !a.resolved);
  const utilizationRate = Math.round((rentedStools / totalStools) * 100);

  // If rendered on Homepage for Admin: ONLY display "待处理预警" as requested by user
  if (isHomeOnly) {
    return (
      <div className="space-y-4">
        {/* Admin Homepage Header */}
        <div
          className={`rounded-3xl border-2 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isSeniorMode
              ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]"
              : "bg-[#184D97] text-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#F6D081] text-[#184D97] shrink-0">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[#34B8C5] text-[#184D97]">
                  网格管理工作台
                </span>
                <span className="text-xs font-bold text-[#F6D081]">大马弄网格责任岗</span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white mt-0.5">
                实时待处理预警卡片
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center">
              <span className="text-[10px] text-[#F6D081] font-bold block">待处理预警数</span>
              <span className="text-xl font-black text-[#F6D081]">{pendingAlerts.length} 件</span>
            </div>
          </div>
        </div>

        {/* Pending Alerts Panel ONLY */}
        <div
          className={`p-5 rounded-3xl border-2 shadow-xs space-y-4 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#BEC7E1] pb-3">
            <h3 className="font-extrabold text-base sm:text-lg text-[#184D97] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#184D97]" />
              <span>待处理预警事件列表</span>
            </h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F6D081] text-[#184D97]">
              网络联动处置
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#1888BF] font-bold bg-[#F6E9D3]/40 rounded-2xl">
              ✅ 当前街区秩序井然，暂无待处理预警事件。
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    alert.resolved
                      ? "bg-[#BEC7E1]/20 border-[#BEC7E1] opacity-70"
                      : "bg-[#F6D081]/30 border-[#184D97]"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          alert.severity === "high"
                            ? "bg-[#184D97] text-[#F6D081]"
                            : "bg-[#1888BF] text-white"
                        }`}
                      >
                        {alert.type === "illegal_parking"
                          ? "违规占道"
                          : alert.type === "overdue"
                          ? "超时未还"
                          : "低电量预警"}
                      </span>
                      <span className="font-extrabold text-xs sm:text-sm text-[#184D97]">
                        模块编号：{alert.stoolCode}
                      </span>
                      <span className="text-xs text-[#1888BF] font-bold">
                        责任人：{alert.renterName}
                      </span>
                    </div>
                    <p className="text-xs text-[#184D97] font-medium">
                      位置：{alert.location} （发生时间：{alert.timestamp}）
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!alert.resolved ? (
                      <button
                        onClick={() => onResolveAlert(alert.id)}
                        className="px-4 py-2 bg-[#184D97] hover:bg-[#1888BF] text-[#F6D081] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-transform"
                      >
                        网格现场处置 (-10分扣减)
                      </button>
                    ) : (
                      <span className="text-xs text-[#184D97] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-[#A7D9C7]" /> 已处置完毕
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // FULL "数字监管" DASHBOARD VIEW (rendered under "数字监管" tab)
  return (
    <div className="space-y-5">
      {/* Admin Supervision Header */}
      <div
        className={`rounded-3xl border-2 shadow-md relative overflow-hidden ${
          isSeniorMode
            ? "p-6 bg-[#F6E9D3] text-[#184D97] border-[#184D97]"
            : "p-5 sm:p-6 bg-[#184D97] text-white border-[#BEC7E1]"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-extrabold border ${
                isSeniorMode
                  ? "bg-[#184D97] text-[#F6D081] border-[#184D97]"
                  : "bg-[#34B8C5] text-[#184D97] border-[#34B8C5]"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>大马弄微空间数字监管平台</span>
            </div>
            <h2
              className={`font-extrabold tracking-tight ${
                isSeniorMode ? "text-3xl sm:text-4xl text-[#184D97]" : "text-xl sm:text-2xl text-white"
              }`}
            >
              公共资产巡检 & 模块位置数字监管
            </h2>
            <p
              className={`font-normal ${
                isSeniorMode ? "text-lg text-[#184D97] font-bold" : "text-xs sm:text-sm text-[#F6E9D3]/90"
              }`}
            >
              【管理员权限】负责全街区 {totalStools} 组蒲公英模块位置/电量/巡检与违规干预
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`border-2 px-4 py-2.5 rounded-2xl text-center ${
                isSeniorMode ? "bg-white border-[#184D97]" : "bg-[#1888BF] border-[#BEC7E1]"
              }`}
            >
              <div className={`text-xs font-bold ${isSeniorMode ? "text-[#184D97]" : "text-[#F6E9D3]"}`}>
                空间利用率
              </div>
              <div
                className={`font-extrabold ${
                  isSeniorMode ? "text-2xl sm:text-3xl text-[#184D97]" : "text-xl sm:text-2xl text-[#F6D081]"
                }`}
              >
                {utilizationRate}%
              </div>
            </div>
            <div
              className={`border-2 px-4 py-2.5 rounded-2xl text-center ${
                isSeniorMode ? "bg-white border-[#184D97]" : "bg-[#1888BF] border-[#BEC7E1]"
              }`}
            >
              <div className={`text-xs font-bold ${isSeniorMode ? "text-[#184D97]" : "text-[#F6E9D3]"}`}>
                待处理预警
              </div>
              <div
                className={`font-extrabold ${
                  isSeniorMode ? "text-2xl sm:text-3xl text-[#184D97]" : "text-xl sm:text-2xl text-white"
                }`}
              >
                {pendingAlerts.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          className={`p-4 rounded-2xl border-2 shadow-xs space-y-1 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#184D97] text-xs font-bold">
            <span>资产总数</span>
            <Layers className="w-4 h-4 text-[#1888BF]" />
          </div>
          <div
            className={`font-extrabold text-[#184D97] ${
              isSeniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {totalStools} 组
          </div>
          <div className="text-[10px] sm:text-xs text-[#1888BF] font-extrabold">100% 物联网在线</div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 shadow-xs space-y-1 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#184D97] text-xs font-bold">
            <span>空闲在位</span>
            <CheckCircle2 className="w-4 h-4 text-[#A7D9C7]" />
          </div>
          <div
            className={`font-extrabold text-[#184D97] ${
              isSeniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {idleStools} 组
          </div>
          <div className="text-[10px] sm:text-xs text-[#1888BF] font-extrabold">堆放点折叠储藏</div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 shadow-xs space-y-1 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#184D97] text-xs font-bold">
            <span>使用周转中</span>
            <Activity className="w-4 h-4 text-[#34B8C5]" />
          </div>
          <div
            className={`font-extrabold text-[#184D97] ${
              isSeniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {rentedStools} 组
          </div>
          <div className="text-[10px] sm:text-xs text-[#1888BF] font-extrabold">早市/茶歇流转中</div>
        </div>

        <div
          className={`p-4 rounded-2xl border-2 shadow-xs space-y-1 ${
            isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
          }`}
        >
          <div className="flex items-center justify-between text-[#184D97] text-xs font-bold">
            <span>位置异常/预警</span>
            <AlertTriangle className="w-4 h-4 text-[#184D97]" />
          </div>
          <div
            className={`font-extrabold text-[#184D97] ${
              isSeniorMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
            }`}
          >
            {warningStools} 组
          </div>
          <div className="text-[10px] sm:text-xs text-[#1888BF] font-extrabold">需巡检网格员干预</div>
        </div>
      </div>

      {/* Module Location & Status Inspection Matrix */}
      <div
        className={`p-5 rounded-3xl border-2 shadow-xs space-y-4 ${
          isSeniorMode ? "bg-[#F6E9D3] border-[#184D97] text-[#184D97]" : "bg-white border-[#BEC7E1] text-[#184D97]"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#BEC7E1] pb-3">
          <div className="space-y-0.5">
            <h3
              className={`font-extrabold flex items-center gap-2 ${
                isSeniorMode ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
              }`}
            >
              <Search className="w-5 h-5 text-[#1888BF]" />
              <span>全街区蒲公英共享模块位置与实时状态监测</span>
            </h3>
            <p className={`text-xs ${isSeniorMode ? "text-sm font-bold text-[#184D97]" : "text-[#1888BF]"}`}>
              管理员实时巡检：掌控所有模块物理坐标 (X/Y)、电池电量、租用人与时段权限
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#A7D9C7] text-[#184D97] self-start sm:self-auto">
            {stools.length} 组设备联网正常
          </span>
        </div>

        {/* Stools Inspection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stools.map((stool) => (
            <div
              key={stool.id}
              className={`p-3.5 rounded-2xl border-2 space-y-2 relative transition-all ${
                stool.status === "warning"
                  ? "bg-[#F6D081]/30 border-[#184D97]"
                  : stool.status === "rented"
                  ? "bg-[#BEC7E1]/20 border-[#1888BF]"
                  : "bg-white border-[#BEC7E1]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs sm:text-sm text-[#184D97] font-mono">
                  {stool.code}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    stool.status === "idle"
                      ? "bg-[#A7D9C7] text-[#184D97]"
                      : stool.status === "rented"
                      ? "bg-[#34B8C5] text-[#184D97]"
                      : "bg-[#F6D081] text-[#184D97] border border-[#184D97]"
                  }`}
                >
                  {stool.status === "idle" ? "空闲在位" : stool.status === "rented" ? "使用中" : "异常干预"}
                </span>
              </div>

              <div className="space-y-1">
                <div
                  className={`font-bold truncate ${
                    isSeniorMode ? "text-base sm:text-lg" : "text-xs sm:text-sm"
                  }`}
                >
                  {stool.name}
                </div>
                <div className="text-[11px] sm:text-xs text-[#1888BF] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1888BF] shrink-0" />
                  <span className="truncate">{stool.locationDescription}</span>
                </div>
              </div>

              <div className="pt-1 border-t border-[#BEC7E1]/60 grid grid-cols-2 gap-1 text-[10px] sm:text-xs font-bold text-[#184D97]">
                <div className="flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-[#34B8C5]" />
                  <span>电量: {stool.batteryLevel}%</span>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <UserCheck className="w-3.5 h-3.5 text-[#1888BF]" />
                  <span className="truncate">{stool.renterName || "无租用人"}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#184D97]/80 flex justify-between items-center pt-0.5">
                <span>坐标: ({stool.x}%, {stool.y}%)</span>
                <span>时段: {stool.currentRoleAllowed === "morning" ? "早市" : "午后"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Alerts Section */}
      <div
        className={`p-5 rounded-3xl border-2 shadow-xs space-y-4 ${
          isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`font-extrabold text-[#184D97] flex items-center gap-2 ${
              isSeniorMode ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
            }`}
          >
            <ShieldAlert className="w-5 h-5 text-[#184D97]" />
            <span>数字监管与违规占用处置中心</span>
          </h3>
          <span className="text-xs text-[#1888BF] font-bold">网格干预扣减蒲公英信用分</span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.resolved
                  ? "bg-[#BEC7E1]/20 border-[#BEC7E1] opacity-70"
                  : "bg-[#F6D081]/30 border-[#184D97]"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      alert.severity === "high"
                        ? "bg-[#184D97] text-[#F6D081]"
                        : "bg-[#1888BF] text-white"
                    }`}
                  >
                    {alert.type === "illegal_parking"
                      ? "违规占道"
                      : alert.type === "overdue"
                      ? "超时未还"
                      : "低电量"}
                  </span>
                  <span className="font-extrabold text-xs sm:text-sm text-[#184D97]">
                    模块编号：{alert.stoolCode}
                  </span>
                  <span className="text-xs text-[#1888BF] font-bold">
                    责任人：{alert.renterName}
                  </span>
                </div>
                <p className="text-xs text-[#184D97] font-medium">
                  位置：{alert.location} （发生时间：{alert.timestamp}）
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!alert.resolved ? (
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="px-4 py-2 bg-[#184D97] hover:bg-[#1888BF] text-[#F6D081] font-extrabold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition-transform"
                  >
                    网格干预并扣信用分 (-10分)
                  </button>
                ) : (
                  <span className="text-xs text-[#184D97] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#A7D9C7]" /> 已处置完毕
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Data Visualizations */}
      <div
        className={`p-5 rounded-3xl border-2 shadow-xs space-y-4 ${
          isSeniorMode ? "bg-[#F6E9D3] border-[#184D97]" : "bg-white border-[#BEC7E1]"
        }`}
      >
        <h3
          className={`font-extrabold text-[#184D97] flex items-center gap-2 ${
            isSeniorMode ? "text-2xl sm:text-3xl" : "text-base sm:text-lg"
          }`}
        >
          <BarChart3 className="w-5 h-5 text-[#1888BF]" />
          <span>大马弄街区商业转化与空间利用率</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F6E9D3] border-2 border-[#BEC7E1] space-y-2">
            <div className="text-xs font-bold text-[#184D97]">早市 vs 午后周转率</div>
            <div className="h-20 flex items-end gap-3 pt-4">
              <div className="flex-1 bg-[#1888BF] h-[85%] rounded-t-lg relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-[#184D97]">
                  85% 早市
                </span>
              </div>
              <div className="flex-1 bg-[#34B8C5] h-[65%] rounded-t-lg relative group">
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-extrabold text-[#184D97]">
                  65% 午后
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#184D97]/80 font-medium">早市摊贩高频周转，午后茶客长时停留</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6E9D3] border-2 border-[#BEC7E1] space-y-2">
            <div className="text-xs font-bold text-[#184D97]">引流商业转化拉动</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#184D97]">+38%</div>
            <p className="text-xs text-[#184D97]/80 font-medium">
              共享模块带动老街茶室与周边酱鸭消费增加 38%。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6E9D3] border-2 border-[#BEC7E1] space-y-2">
            <div className="text-xs font-bold text-[#184D97]">蒲公英信用履约率</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#184D97]">97.8%</div>
            <p className="text-xs text-[#184D97]/80 font-medium">
              超 97% 用户按时归还至指定堆放点，无占道积压。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
