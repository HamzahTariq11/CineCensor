import { config, getToken } from "./config";

export const getDashboard = async () => {
  let data = [];
  try {
    const response = await fetch(config.url + "dashboard", {
      method: "GET",
      headers: {
        token: getToken,
      },
    });
    data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
};
