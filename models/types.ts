// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  points: number;
  transportPreferences: TransportType[];
  co2Saved: number;
  caloriesBurned: number;
  moneySaved: number;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface UserStats {
  totalPoints: number;
  pointsByTransportType: Record<TransportType, number>;
  totalCo2Saved: number;
  totalCaloriesBurned: number;
  totalMoneySaved: number;
  streaks: {
    current: number;
    best: number;
    lastActive: Date;
  };
}

// Transport related types
export type TransportType = 
  | 'walking' 
  | 'cycling' 
  | 'bus' 
  | 'carpool' 
  | 'car' 
  | 'motorcycle' 
  | 'other';

export interface Trip {
  id: string;
  userId: string;
  transportType: TransportType;
  startLocation: GeoPoint;
  endLocation: GeoPoint;
  distance: number; // in meters
  duration: number; // in seconds
  startTime: Date;
  endTime: Date;
  pointsEarned: number;
  co2Saved: number;
  caloriesBurned: number;
  moneySaved: number;
  route: GeoPoint[];
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

// Posts and reports
export interface Post {
  id: string;
  userId: string;
  user?: User;
  content: string;
  mediaUrls: string[];
  location?: GeoPoint;
  likes: number;
  comments: number;
  createdAt: Date;
  isReport: boolean;
  reportType?: ReportType;
  status?: ReportStatus;
}

export type ReportType = 
  | 'traffic' 
  | 'infrastructure' 
  | 'safety' 
  | 'public_transport' 
  | 'other';

export type ReportStatus = 
  | 'pending' 
  | 'investigating' 
  | 'resolved' 
  | 'rejected';

// Rewards and businesses
export interface Reward {
  id: string;
  businessId: string;
  business?: Business;
  title: string;
  description: string;
  pointsCost: number;
  discount: string; // e.g., "20% off", "Buy 1 Get 1 Free"
  validUntil: Date;
  imageUrl?: string;
  category: RewardCategory;
  termsAndConditions: string;
  redemptionCode?: string;
}

export type RewardCategory = 
  | 'food' 
  | 'retail' 
  | 'entertainment' 
  | 'services' 
  | 'transportation' 
  | 'other';

export interface Business {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl?: string;
  address: string;
  location: GeoPoint;
  category: BusinessCategory;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  isPartner: boolean;
  partnerSince?: Date;
}

export type BusinessCategory = 
  | 'restaurant' 
  | 'cafe' 
  | 'retail' 
  | 'service' 
  | 'entertainment' 
  | 'other';

// Challenges and achievements
export interface Challenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  requiredAction: string;
  requiredCount: number;
  duration: number; // in days
  imageUrl?: string;
  startDate: Date;
  endDate: Date;
  participants: number;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  earnedAt: Date;
  pointsAwarded: number;
}

// Map related types
export interface MapElement {
  id: string;
  type: MapElementType;
  name: string;
  description?: string;
  location: GeoPoint;
  geometry?: GeoPoint[];
  properties?: Record<string, any>;
}

export type MapElementType = 
  | 'bike_lane' 
  | 'safe_sidewalk' 
  | 'bus_route' 
  | 'business_location' 
  | 'report_hotspot';