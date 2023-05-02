export interface PaginatedData<T> {
  data: T[];
  total: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  userProfile?: UserProfile;
}

export interface UserProfile {
  birthDate: Date;
  bio: string;
  gender: string;
  location: string;
  website: string;
}

export interface Garage {
  id: number;
  name: string;
  location: string;
  buses?: any[];
  startingLines?: any[];
  endingLines?: any[];
}

export interface BiggestGarage {
  id: number;
  name: string;
  location: string;
  busCount: number;
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
  garage?: Garage;
}

export interface Line {
  id: number;
  name: string;
  startName: string;
  endName: string;
  monthlyRidership: number;
  startGarageId: number;
  endGarageId: number;
  startGarage?: Garage;
  endGarage?: Garage;
  lineStops?: LineStop[];
}

export interface Station {
  id: number;
  name: string;

  lineStops?: LineStop[];
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
  station?: Station;
  line?: Line;
}
