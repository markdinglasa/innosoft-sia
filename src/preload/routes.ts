import type { WINDOW_ACTION, WINDOW_API } from "./index.ts";

declare global {
  interface Window {
    api: typeof WINDOW_API,
    action: typeof WINDOW_ACTION
  }
}

//export const API = () => { return  window.api };
//export const ACTION  = () => { return  window.action };

const ipc = window.api;
export default ipc;