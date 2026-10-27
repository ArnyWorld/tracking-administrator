export interface Company {
  id: string;
  name: string;
  description: string;
  color: string;
  image: string;
  user_id: string;
  user_database_id: string;
  monitor_server_id: string;
  create_at: number;
  update_at: null;
  deleted: number;
  enabled: number;
  database: Database;
  monitor_server: MonitorServer;
}
export interface Database {
  id: string;
  codename: string;
  description: string;
  fullname: string;
  server_id: string;
  enabled: number;
}

export interface MonitorServer {
  id: string;
  name: string;
  type: string;
  environment: string;
  server_uuid: string;
  address: string;
  portUdp: number;
  portTcp: number;
  portWs: number;
  portHttp: number;
  apiPort: null;
  create_at: number;
  update_at: number;
}
