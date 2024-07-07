import { config } from "./config";
export const uploadVideo = async (file, fileName) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("videoName", fileName);
  let data = [];
  try {
    const response = await fetch(config.url + "videoupload", {
      method: "POST",
      body: formData,
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      data = await response.json();
      console.log(data);
      return data;
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
export const getUploadedVideo = async () => {
  let data = [];
  try {
    const response = await fetch(config.url + "getuploaded", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      data = await response.json();
      console.log(data);
    } else {
      throw {
        message: "Videos Not Found",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
};
export const deleteUploadedVideo = async (videoId) => {
  let data = [];
  const formData = new FormData();
  formData.append("videoId", videoId);
  try {
    const response = await fetch(config.url + "deleteuploaded", {
      method: "POST",
      body: formData,
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      data = await response.json();
      console.log(data);
    } else {
      throw {
        message: "Videos Not Deleted",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
};
export const getOneVideo = async (id) => {
  let data = [];
  try {
    const response = await fetch(config.url + "getonevideo?video_id=" + id, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      data = await response.json();
      console.log("One Video response", data);
    } else {
      console.log(response);
      throw {
        message: response.message,
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
  return data;
};
