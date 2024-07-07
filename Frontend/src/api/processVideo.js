import { config, getToken } from "./config";

export const processVideo = async (videoId) => {
  const formData = new FormData();
  formData.append("videoId", videoId);
  let data = [];
  try {
    const response = await fetch(config.url + "videoprocess", {
      method: "POST",
      body: formData,
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    if (response.ok) {
      data = await response.json();
      return data;
    } else {
      throw {
        message: "Video Could not be processed",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getProcessedVideo = async () => {
  let data = [];
  try {
    const response = await fetch(config.url + "getprocessed", {
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
export const deleteProcessedVideo = async (videoId) => {
  const formData = new FormData();
  formData.append("videoId", videoId);
  let data = [];
  try {
    const response = await fetch(config.url + "deleteprocessed", {
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

export const downloadProcessedVideo = async (videoId) => {
  let data = [];
  // try {
  //   const response = await fetch(
  //     config.url + `downloadvideo?video_id=${videoId}&is_processed=${1}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         token: localStorage.getItem("token"),
  //       },
  //     }
  //   );
  //   if (response.ok) {
  //     data = await response.json();
  //     console.log(data);
  //   } else {
  //     throw {
  //       message: "Videos Could Not Be Downloaded",
  //     };
  //   }
  // } catch (error) {
  //   console.log(error);
  //   throw error;
  // }
  const videoUrl =
    config.url + `downloadvideo?video_id=${videoId}&is_processed=${1}`;
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = videoUrl;
  link.download = "video.mp4"; // Set the filename for download
  // Add the link to the DOM and trigger the download
  document.body.appendChild(link);
  link.click();
  // Clean up
  document.body.removeChild(link);
  return data;
};
