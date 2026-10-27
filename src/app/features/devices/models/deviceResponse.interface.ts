interface DeviceResponse {
  id: string;
  info_brand: string | null;
  info_device: string | null;
  info_model: string | null;
  imei: number | null;
  phone_number: number | null;
  gpsspec_id: string | null;

  gpsspec?: {
    id: string;
    name: string;
    brand: string;
    model: string;
    gps_type_id: string;
    version: string;
    filename: string | null;
  };
}

interface DeviceTableRow {
  id: string;
  brand: string;
  model: string;
  imei: string;
  device: string;
  gpsspec: string;
  type: 'vehicle' | 'app';
}
