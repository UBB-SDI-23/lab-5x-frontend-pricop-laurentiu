export interface PaginatedData<T> {
  data: T[];
  total: number;
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
