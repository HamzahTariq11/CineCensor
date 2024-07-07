import { config } from "./config";

export const signup = async (firstName, lastName, email, password, gender) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("firstName", firstName);
  formData.append("gender", gender);
  formData.append("lastName", lastName);
  let data = [];
  try {
    console.log(config.url);
    const response = await fetch(config.url, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      data = await response.json();
      console.log(data);
      return (window.location.href = "/");
    } else {
      throw {
        message: "Incorrect Credentials",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
