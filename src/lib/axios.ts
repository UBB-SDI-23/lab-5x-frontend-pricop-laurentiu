import axiosLib from "axios";
import { config } from "./config";

export const axios = axiosLib.create({
  baseURL: config.apiBase,
});