import axios from "axios";

const API = axios.create({
  baseURL: "https://yappy-chiarra-altinv2-2dcd9f44.koyeb.app/api",
});

export const getProductMargins = () =>
  API.get("/product-margin");

export const updateProductMargin = (data) =>
  API.post("/product-margin", data);

export default API;