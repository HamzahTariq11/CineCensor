import React, { useState, useEffect, useContext } from "react";
import { BaseLink } from "layouts/admin";
import { Flex } from "@chakra-ui/react";

const VideoPlayer = ({ heading, endPoint, isProcessed, takeParamFromUrl }) => {
  const [videoUrl, setVideoUrl] = useState("");
  let Link = useContext(BaseLink) || `http://127.0.0.1:5000/`;
  useEffect(() => {
    if (takeParamFromUrl) {
      const url = window.location.href;
      const [id, ...rest] = url.split("/").reverse();
      Link = `${Link}/streamvideo?video_id=${id}&is_processed=${isProcessed}`;
    } else {
      Link = `${Link}/streamvideo?video_id=${endPoint}&is_processed=${isProcessed}`;
    }
    console.log(Link);
    fetch(Link)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
          return;
        }
        return response.blob();
      })
      .then((blob) => {
        const videoObjectUrl = URL.createObjectURL(blob);
        setVideoUrl(videoObjectUrl);
      })
      .catch((error) => {
        // console.error("Error fetching video:", error);
      });
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, []);

  return (
    <Flex>
      {videoUrl && (
        <video controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Flex>
  );
};

export default VideoPlayer;
