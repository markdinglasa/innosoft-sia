import { DBConfig } from "@shared/types";
export interface Manager {
  activeWindow: string | null;
  activeLicense: string | null;
  activeDBConfig: DBConfig | null;
  activeKey: string | null;
}
