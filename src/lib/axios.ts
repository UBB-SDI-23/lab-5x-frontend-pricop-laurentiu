import axiosLib from "axios";
import { config } from "./config";
import { toast } from "react-toastify";

export const axios = axiosLib.create({
  baseURL: config.apiBase,
});

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
