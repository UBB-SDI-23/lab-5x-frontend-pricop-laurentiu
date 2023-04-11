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
