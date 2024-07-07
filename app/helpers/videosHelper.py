from datetime import datetime
from moviepy.editor import VideoFileClip
import shutil
import os
import math
import cv2
import numpy as np
import concurrent.futures
from concurrent.futures import ThreadPoolExecutor
from collections import OrderedDict
import threading
import onnxruntime
import joblib
from sklearn.preprocessing import LabelEncoder
from moviepy.editor import VideoFileClip, AudioFileClip, afx
from config import establish_connection, close_connection


label_encoder = LabelEncoder()


def generate_unique_string():
    current_time = datetime.now()
    unique_string = current_time.strftime("%Y%m%d%H%M%S")
    return unique_string


def get_video_duration(file_path):
    try:
        video_clip = VideoFileClip(file_path)
        duration = video_clip.duration
        video_clip.close()
        return duration
    except Exception as e:
        print("Error:", e)
        raise Exception(e)


def store_data_in_database(filePath, rating, categoriesDetected, videoId):
    try:
        queryInsertProcessed = "UPDATE videos SET is_processed = %s, rating = %s, processed_on = %s, processed_video_url = %s,nudity = %s, rifles = %s, blood = %s, cigarette = %s, guns = %s, status = %s WHERE video_id = %s"
        cursor, connection = establish_connection()
        cursor.execute(
            queryInsertProcessed,
            (
                1,
                rating,
                datetime.now(),
                filePath,
                categoriesDetected[0],
                categoriesDetected[1],
                categoriesDetected[2],
                categoriesDetected[3],
                categoriesDetected[4],
                "Completed",
                videoId,
            ),
        )
        connection.commit()
        close_connection(cursor, connection)
        pass
    except Exception as ex:
        print("Error storing data in database:", ex)


def process_video(video_url, videoId):
    try:
        global nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag
        nudity_flag = 0
        rifle_flag = 0
        guns_flag = 0
        blood_flag = 0
        cig_flag = 0
        file_path_processed, rating, categoriesDetected = censoring(video_url[0])
        store_data_in_database(file_path_processed, rating, categoriesDetected, videoId)
    except Exception as ex:
        cursor, connection = establish_connection()
        querySetPending = (
            "update videos set status = %s , IS_PROCESSED = '0' where video_id = %s"
        )
        cursor.execute(querySetPending, ("Failed", videoId))
        connection.commit()
        raise Exception(ex)


__labels = []
skip = [
    "BUTTOCKS_EXPOSED",
    "FEMALE_BREAST_EXPOSED",
    "FEMALE_GENITALIA_EXPOSED",
    "MALE_BREAST_EXPOSED",
    "ANUS_EXPOSED",
    "BELLY_EXPOSED",
    "MALE_GENITALIA_EXPOSED",
    "FEMALE_BREAST_COVERED",
]
blood = ["blood", "bloodstain"]
gun = ["gun"]
rifle = ["Rifle"]
smoking = ["smoking"]
nudity = [
    "FEMALE_GENITALIA_COVERED",
    "FACE_FEMALE",
    "BUTTOCKS_EXPOSED",
    "FEMALE_BREAST_EXPOSED",
    "FEMALE_GENITALIA_EXPOSED",
    "MALE_BREAST_EXPOSED",
    "ANUS_EXPOSED",
    "FEET_EXPOSED",
    "BELLY_COVERED",
    "FEET_COVERED",
    "ARMPITS_COVERED",
    "ARMPITS_EXPOSED",
    "FACE_MALE",
    "BELLY_EXPOSED",
    "MALE_GENITALIA_EXPOSED",
    "ANUS_COVERED",
    "FEMALE_BREAST_COVERED",
    "BUTTOCKS_COVERED",
]

nudity_flag = 0
rifle_flag = 0
guns_flag = 0
blood_flag = 0
cig_flag = 0


def _read_image(img, target_size=320):

    img_height, img_width = img.shape[:2]
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    aspect = img_width / img_height

    if img_height > img_width:
        new_height = target_size
        new_width = int(round(target_size * aspect))
    else:
        new_width = target_size
        new_height = int(round(target_size / aspect))

    resize_factor = math.sqrt(
        (img_width**2 + img_height**2) / (new_width**2 + new_height**2)
    )

    img = cv2.resize(img, (new_width, new_height))

    pad_x = target_size - new_width
    pad_y = target_size - new_height

    pad_top, pad_bottom = [int(i) for i in np.floor([pad_y, pad_y]) / 2]
    pad_left, pad_right = [int(i) for i in np.floor([pad_x, pad_x]) / 2]

    img = cv2.copyMakeBorder(
        img,
        pad_top,
        pad_bottom,
        pad_left,
        pad_right,
        cv2.BORDER_CONSTANT,
        value=[0, 0, 0],
    )

    img = cv2.resize(img, (target_size, target_size))

    image_data = img.astype("float32") / 255.0  # normalize
    image_data = np.transpose(image_data, (2, 0, 1))
    image_data = np.expand_dims(image_data, axis=0)

    return image_data, resize_factor, pad_left, pad_top


def _postprocess(labels, model, output, resize_factor, pad_left, pad_top):
    global nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag

    outputs = np.transpose(np.squeeze(output[0]))
    rows = outputs.shape[0]
    boxes = []
    scores = []
    class_ids = []

    for i in range(rows):
        classes_scores = outputs[i][4:]
        max_score = np.amax(classes_scores)

        if max_score >= 0.2:
            class_id = np.argmax(classes_scores)
            x, y, w, h = outputs[i][0], outputs[i][1], outputs[i][2], outputs[i][3]
            left = int(round((x - w * 0.5 - pad_left) * resize_factor))
            top = int(round((y - h * 0.5 - pad_top) * resize_factor))
            width = int(round(w * resize_factor))
            height = int(round(h * resize_factor))
            class_ids.append(class_id)
            scores.append(max_score)
            boxes.append([left, top, width, height])

    indices = cv2.dnn.NMSBoxes(boxes, scores, 0.25, 0.45)

    detections = []
    for i in indices:
        box = boxes[i]
        score = scores[i]
        class_id = class_ids[i]
        if model == r"app\ml_models\nudenet.onnx":
            if labels[class_id] in skip:
                detections.append(
                    {"class": labels[class_id], "score": float(score), "box": box}
                )
                if (
                    labels[class_id] != "FEMALE_BREAST_COVERED"
                    or labels[class_id] != "BELLY_EXPOSED"
                ):
                    nudity_flag = 1
                    print("nudity")
            else:
                pass
        else:
            detections.append(
                {"class": labels[class_id], "score": float(score), "box": box}
            )
            if labels[class_id] in blood:
                blood_flag = 1
                print("blood")
            elif labels[class_id] in gun:
                guns_flag = 1
                print("guns")
            elif labels[class_id] in rifle:
                rifle_flag = 1
                print("riflr")
            elif labels[class_id] in smoking:
                cig_flag = 1
                print("cigg")
            else:
                nudity_flag = 0
                rifle_flag = 0
                guns_flag = 0
                blood_flag = 0
                cig_flag = 0

    if not detections:
        # If no detections, reset all flags to 0
        nudity_flag = 0
        rifle_flag = 0
        guns_flag = 0
        blood_flag = 0
        cig_flag = 0

    return detections, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag


fps = None


def video_to_frames(video_path, max_frames=None):
    global fps
    frames = []
    fps = None
    try:
        vidcap = cv2.VideoCapture(video_path)
        success, image = vidcap.read()
        count = 0

        # Get the original FPS
        fps = vidcap.get(cv2.CAP_PROP_FPS)

        while success:
            frames.append(image)
            count += 1

            if max_frames is not None and count >= max_frames:
                break

            success, image = vidcap.read()

        vidcap.release()
        return frames, fps
    except Exception as e:
        print(f"Error occurred while extracting frames: {e}")
        return [], None


def extract_audio_with_duration(video_path, audio_output_path):
    audio_clip = None
    video_clip = VideoFileClip(video_path)
    audio_clip = video_clip.audio
    if audio_clip != None:
        audio_clip.write_audiofile(audio_output_path, codec="aac")
        audio_clip.close()
        return 1
    video_clip.close()
    return 0


def frames_to_video(detected_frames, original_video_path, output_video_path, fps):
    video_path = generate_unique_string()
    audio_path = f"app/ProcessedVideos/{video_path}.aac"
    audio_flag = extract_audio_with_duration(original_video_path, audio_path)
    height, width, _ = detected_frames[0].shape
    video_fps = fps
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_video_path, fourcc, video_fps, (width, height))

    for frame in detected_frames:
        out.write(frame)

    out.release()

    # Add audio to the video using moviepy
    video_clip = VideoFileClip(output_video_path)
    video_fps = video_clip.fps  # Get fps from the video clip

    video_duration = video_clip.duration
    if audio_flag == 1:
        audio_clip = AudioFileClip(audio_path)
        audio_duration = audio_clip.duration

        if audio_duration > video_duration:
            # Trim audio if it's longer than the video
            audio_clip = audio_clip.subclip(0, video_duration)
        elif audio_duration < video_duration:
            # Loop the audio if it's shorter than the video
            audio_clip = afx.audio_loop(audio_clip, duration=video_duration)
        video_audio = output_video_path.replace(".mp4", "_with_audio.mp4")
        final_clip = video_clip.set_audio(audio_clip)
        final_clip.write_videofile(
            video_audio, codec="libx264", audio_codec="aac", fps=video_fps
        )
        return video_audio
    else:
        return output_video_path


def blur_detected_boxes(frames):
    for frame_index, boxes in global_boxes_dict.items():
        if boxes:  # Checking if there are detected boxes for this frame
            image_boxes = boxes
            for box in image_boxes:
                x, y, w, h = box
                frames[frame_index][y : y + h, x : x + w] = cv2.blur(
                    frames[frame_index][y : y + h, x : x + w], (80, 80)
                )

    return frames


def initialize_detector(model):
    return Detector(model)


global_boxes_lock = threading.Lock()
global_boxes_dict = {}


class Detector:

    def __init__(self, model, providers=None):
        self.onnx_session = onnxruntime.InferenceSession(
            model
            # ,providers=['CUDAExecutionProvider'],
        )
        model_inputs = self.onnx_session.get_inputs()
        input_shape = model_inputs[0].shape
        self.input_width = input_shape[2]  # 320
        self.input_height = input_shape[3]  # 320
        self.input_name = model_inputs[0].name
        self.model = model
        if model == r"app\ml_models\rifle.onnx":
            self.labels = ["Rifle"]
        elif model == r"app\ml_models\guns.onnx":
            self.labels = ["gun"]
        elif model == r"app\ml_models\blood.onnx":
            self.lables = ["blood", "bloodstain"]
        elif model == r"app\ml_models\cigg.onnx":
            self.labels = ["smoking"]
        elif model == r"app\ml_models\nudenet.onnx":
            self.labels = [
                "FEMALE_GENITALIA_COVERED",
                "FACE_FEMALE",
                "BUTTOCKS_EXPOSED",
                "FEMALE_BREAST_EXPOSED",
                "FEMALE_GENITALIA_EXPOSED",
                "MALE_BREAST_EXPOSED",
                "ANUS_EXPOSED",
                "FEET_EXPOSED",
                "BELLY_COVERED",
                "FEET_COVERED",
                "ARMPITS_COVERED",
                "ARMPITS_EXPOSED",
                "FACE_MALE",
                "BELLY_EXPOSED",
                "MALE_GENITALIA_EXPOSED",
                "ANUS_COVERED",
                "FEMALE_BREAST_COVERED",
                "BUTTOCKS_COVERED",
            ]

    def detect(self, image_path):
        preprocessed_image, resize_factor, pad_left, pad_top = _read_image(
            image_path, self.input_width
        )
        __labels = self.labels
        outputs = self.onnx_session.run(None, {self.input_name: preprocessed_image})
        detections, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag = (
            _postprocess(
                self.labels, self.model, outputs, resize_factor, pad_left, pad_top
            )
        )

        return detections, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag

    def censor(self, image_path, classes=[], output_path=None, frame_index=None):
        frames, fps = video_to_frames(image_path)
        final = []
        local_boxes = []  # Local list to store boxes for this detector

        for frame_number, frame in enumerate(frames):
            detections, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag = (
                self.detect(frame)
            )
            boxes_for_frame = []

            for detection in detections:
                box = detection.get("box", None)
                if box:
                    x, y, w, h = map(int, box)
                    if (
                        0 <= x < frame.shape[1]
                        and 0 <= y < frame.shape[0]
                        and w > 0
                        and h > 0
                    ):
                        # frame[y:y + h, x:x + w] = cv2.blur(frame[y:y + h, x:x + w], (50, 50))

                        # Appending boxes to the local list for this frame
                        local_boxes.append((frame_number, x, y, w, h))
                        boxes_for_frame.append((x, y, w, h))

            # Acquiring the lock before updating the global dictionary
            global_boxes_lock.acquire()
            if frame_number not in global_boxes_dict:
                global_boxes_dict[frame_number] = []
            global_boxes_dict[frame_number].extend(boxes_for_frame)
            global_boxes_lock.release()

            final.append(frame)
        frames = blur_detected_boxes(frames)

        return frames, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag


def censoring(video):

    models = [r"app\ml_models\cigg.onnx", r"app\ml_models\nudenet.onnx"]

    # Number of concurrent workers
    num_workers = len(models)

    # Creating a ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        detectors = list(executor.map(initialize_detector, models))
        # Process frames in parallel using each detector
        concurrent_results = []
        for detector in detectors:

            results, nudity_flag, rifle_flag, guns_flag, blood_flag, cig_flag = (
                detector.censor(video)
            )  # Performing detection on frames using each detector
            # concurrent_results.append(results)

    video_path = generate_unique_string()
    output_video_path = f"app/ProcessedVideos/{video_path}.mp4"

    output_video_audio = frames_to_video(results, video, output_video_path, fps)
    category_mapping = {
        "nudity_flag": "Nudity",
        "rifle_flag": "Rifle",
        "blood_flag": "Blood",
        "cig_flag": "Cigarettes",
        "guns_flag": "Guns",
    }
    clf2 = joblib.load(r"app\ml_models\rating.pkl")
    label_encoder = joblib.load(r"app\ml_models\label_encoder.pkl")
    user_input = [[nudity_flag, rifle_flag, blood_flag, cig_flag, guns_flag]]
    for i in user_input:
        print(i)
    predicted_rating = label_encoder.inverse_transform(clf2.predict(user_input))
    print(f"\nPredicted Age Rating: {predicted_rating[0]} \n")

    return (
        output_video_audio,
        predicted_rating[0],
        [nudity_flag, rifle_flag, blood_flag, cig_flag, guns_flag],
    )
