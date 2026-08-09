export type UserRole = "vendor" | "resident" | "admin";

export type TimeSlot = "morning" | "afternoon";

export interface StoolModule {
  id: string;
  name: string;
  code: string; // e.g. "DND-001"
  hubName: string; // e.g. "大马弄1号堆放点"
  x: number; // Percentage on map 0-100
  y: number; // Percentage on map 0-100
  status: "idle" | "rented" | "locked" | "warning";
  currentRoleAllowed: TimeSlot; // 'morning' for vendor, 'afternoon' for tea/resident
  renterName?: string;
  batteryLevel: number; // 0 - 100
  depositAmount: number; // e.g. 1
  minCreditScore: number; // e.g. 600 for free deposit
  lastReturnTime?: string;
  locationDescription: string;
  isFolded: boolean;
}

export interface CulturalSpot {
  id: string;
  name: string;
  category: "market" | "tea" | "food" | "history";
  x: number;
  y: number;
  operatingHours: string;
  timeMode: TimeSlot | "all";
  crowdDensity: "low" | "medium" | "high";
  crowdPercentage: number; // e.g. 85
  summary: string;
  historicalStory: string;
  audioDuration: string;
  tags: string[];
  imageUrl?: string;
  recommendedRoute?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  role: UserRole;
  phone: string;
  creditScore: number; // 蒲公英信用分, e.g. 745
  creditTier: "极好" | "优秀" | "良好" | "一般";
  depositBalance: number;
  rentedStoolId?: string;
  rentalStartTime?: string;
  rentalDurationMinutes?: number;
  isSeniorMode: boolean;
  totalRentalsCount: number;
  totalSavedCo2Kg: number;
}

export interface SystemAlert {
  id: string;
  stoolId: string;
  stoolCode: string;
  type: "overdue" | "illegal_parking" | "low_battery";
  severity: "high" | "medium" | "low";
  location: string;
  timestamp: string;
  renterName: string;
  resolved: boolean;
}

export interface VoiceIntentResponse {
  action: "RENT_STOOL" | "NAVIGATE_TEA" | "NAVIGATE_MARKET" | "CULTURE_STORY" | "TOGGLE_SENIOR" | "VIEW_HEATMAP" | "UNKNOWN";
  replyText: string;
  targetTab?: "home" | "map" | "stools" | "cockpit" | "credit";
  parameters?: Record<string, any>;
  confidence?: number;
  candidates?: Array<{
    label: string;
    action: "RENT_STOOL" | "NAVIGATE_TEA" | "NAVIGATE_MARKET" | "CULTURE_STORY" | "TOGGLE_SENIOR" | "VIEW_HEATMAP" | "UNKNOWN";
    targetTab?: "home" | "map" | "stools" | "cockpit" | "credit";
  }>;
  requiresConfirmation?: boolean;
  confirmationDetails?: {
    title: string;
    deposit: string;
    item: string;
  };
}
