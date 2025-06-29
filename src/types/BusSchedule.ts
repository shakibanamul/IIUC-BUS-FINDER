export interface BusSchedule {
  id: string;
  time: string;
  startingPoint: string;
  route: string;
  endPoint: string;
  direction: 'CityToIIUC' | 'IIUCToCity' | 'ToUniversity' | 'FromUniversity';
  gender?: 'Male' | 'Female';
  busType?: string;
  remarks?: string;
  description?: string;
  scheduleType: 'Regular' | 'Friday';
}

export type Direction = 'CityToIIUC' | 'IIUCToCity' | 'ToUniversity' | 'FromUniversity' | 'All';
export type Gender = 'Male' | 'Female' | 'All';
export type BusType = 'IIUC Bus' | 'IIUC A&H B' | 'AC Bus' | 'Non-AC Bus' | 'All';
export type ScheduleType = 'Regular' | 'Friday' | 'All';
export type RouteFilter = string;