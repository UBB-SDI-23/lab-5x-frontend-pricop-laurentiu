import axiosLib from "axios";
import { config } from "./config";
import { toast } from "react-toastify";
import CookieManager from "./cookie-manager";

export let axios = axiosLib.create({
  baseURL: config.apiBase,
});

const userToken = CookieManager.get("token");
if (userToken) {
  updateAxiosWithToken(userToken);
}

export function updateAxiosWithToken(token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function handleError(err: any) {
  console.log({ err });

  if (err.response.data.message) {
    const { message } = err.response.data;
    if (Array.isArray(message) && message.length > 1) {
      message.forEach(m => toast.error(m));
      return;
    }
    toast.error(message);
    return;
  }
  toast.error(err.message ?? err.toString());
}
