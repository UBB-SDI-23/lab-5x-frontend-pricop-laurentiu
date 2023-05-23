export interface PaginatedData<T> {
  data: T[];
  total: number;
}

export enum UserRole {
  regular = "regular",
  moderator = "moderator",
  admin = "admin",
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  email?: string;
  paginationPreference?: number;
  userProfile?: UserProfile;
}

export interface UserProfile {
  birthDate: string;
  bio: string;
  gender: string;
  location: string;
  website: string;
  ownerId: number;
  user?: User;
  _count?: {
    buses: number;
    garages: number;
    lineStops: number;
    lines: number;
    stations: number;
  };
}

export interface Garage {
  id: number;
  name: string;
  location: string;
  ownerId: number;
  buses?: any[];
  startingLines?: any[];
  endingLines?: any[];
  owner?: User;
}

export interface BiggestGarage {
  id: number;
  name: string;
  location: string;
  busCount: number;
  owner?: User;
}

export enum BusFuel {
  diesel = "DIESEL",
  batteryElectric = "BATTERY_ELECTRIC",
  cableElectric = "CABLE_ELECTRIC",
}

export const BusFuelHumanized: Record<BusFuel, string> = {
  BATTERY_ELECTRIC: "Battery Electric",
  CABLE_ELECTRIC: "Cable Electric",
  DIESEL: "Diesel",
};

export interface Bus {
  id: number;
  manufacturer: string;
  model: string;
  fuel: BusFuel;
  inventoryNum: string;
  licensePlate: string;
  garageId: number;
  ownerId: number;
  garage?: Garage;
  owner?: User;
}

export interface Line {
  id: number;
  name: string;
  startName: string;
  endName: string;
  monthlyRidership: number;
  startGarageId: number;
  endGarageId: number;
  ownerId: number;
  startGarage?: Garage;
  endGarage?: Garage;
  lineStops?: LineStop[];
  owner?: User;
}

export interface Station {
  id: number;
  name: string;
  ownerId: number;

  lineStops?: LineStop[];
  owner?: User;
}

export enum LineStopDirection {
  trip = "TRIP",
  roundTrip = "ROUND-TRIP",
}

export interface LineStop {
  id: number;
  stationId: number;
  lineId: number;
  direction: LineStopDirection;
  isServicedInWeekends: boolean;
  ownerId: number;
  station?: Station;
  line?: Line;
  owner?: User;
}

export interface ChatMessage {
  id: number;
  userId: number;
  nickname: string;
  text: string;
  timestamp: string | Date;
  user?: User;
}
