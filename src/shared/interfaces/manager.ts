import { DBConfig, User } from "@shared/types";

export interface Manager {
  activeWindow: string | null;
  activeLicense: string | null;
  activeDBConfig: DBConfig | null;
  activeKey: string | null;
  activeToken: string | null;
  activeUser: User | null;
}
