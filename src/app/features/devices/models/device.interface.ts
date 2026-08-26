import { Vehicle } from './vehicle.interface';

export interface GpsSpec {
  id: string;
  name: string;
  brand: string;
  model: string;
  gps_type_id: string;
  version: string;
  filename: string | null;
}

export interface Device {
  id: string;
  info_brand: string | null;
  info_device: string | null;
  info_manufacturer: string | null;
  info_model: string | null;
  info_product: string | null;
  info_serial: string | null;
  info_fingerprint: string | null;

  config_internettest: boolean | null;
  config_livecapture: boolean | null;
  config_paramupdate: boolean | null;
  config_saveoffline: boolean | null;
  config_saveonline: boolean | null;
  config_serverapi: boolean | null;
  config_servertrack: boolean | null;
  config_trackcapture: boolean | null;
  config_updatestatus: boolean | null;

  registred: boolean;
  registred_date: string | null;
  last_connect: string | null;
  first_connect: string | null;
  brand?: string;
  model?: string;
  device?: string;

  imei: number | string | null;
  phone_number: number | null;
  timezone: string | null;

  gpsspec_id: string | null;
  gpsspec: string | GpsSpec | null;
}

export interface Pagination {
  pages: number;
  rowsNumber: number;
}

export interface CreateDeviceRequest {
  vehicle_id: string;
  device_id: string;
  sensors: any[];
  observations: string;
  create_date: string;
  install_date: string;
}

export interface AssignmentResponse {
  id: string;
  vehicle_id: string;
  device_id: string;
  observations: string;
  create_date: number;
  install_date: number;
  vehicle: Vehicle;
  sensors: unknown[];
  device: Device;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: Pagination;
}
export interface DeviceRequest {
  info_brand: string;
  info_model: string;
  imei: string;
  phone_number: string;
  gpsspec_id: string;
  id: string;
  registred: boolean;
  registred_date: Date;
}
