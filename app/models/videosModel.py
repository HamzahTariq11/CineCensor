import mysql.connector
import mysql
import jwt
from datetime import datetime
from flask import make_response, current_app
from config import establish_connection, close_connection
import app.helpers.videosHelper as videoHelper
import threading


def addVideo(videoName, filePath, user):
    try:
        queryAddVideo = "INSERT INTO videos(video_name,uploaded_video_url,duration,uploaded_on,email) VALUES(%s,%s,%s,%s,%s)"
        duration = round(videoHelper.get_video_duration(filePath))

        cursor, connection = establish_connection()
        cursor.execute(
            queryAddVideo, (videoName, filePath, duration, datetime.now(), user)
        )
        connection.commit()
        return {"message": "Video Uploaded", "status": 200}
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def processVideo(videoId):
    try:
        queryGetUrl = "select uploaded_video_url from videos where video_id = %s"
        cursor, connection = establish_connection()
        cursor.execute(queryGetUrl, ([videoId]))
        videoUrl = cursor.fetchone()
        querySetPending = (
            "update videos set status = %s , IS_PROCESSED = '1' where video_id = %s"
        )
        cursor.execute(querySetPending, ("Pending", videoId))
        connection.commit()
        close_connection(cursor, connection)
        processing_thread = threading.Thread(
            target=videoHelper.process_video,
            args=(
                videoUrl,
                videoId,
            ),
        )
        processing_thread.start()
        return {"message": "Video processing started in background", "status": 200}

    except Exception as ex:
        raise Exception(ex)


def deleteUploaded(videoId):
    try:
        queryDeleteVideo = (
            "Update videos set uploaded_video_url = null where video_id = %s"
        )
        cursor, connection = establish_connection()
        cursor.execute(queryDeleteVideo, ([videoId]))
        connection.commit()
        return {"message": "Video Deleted"}
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def deleteProcessed(videoId):
    try:
        queryDeleteVideo = "Update videos set processed_video_url = null,is_processed = 0,rating = null,categories_detected = null,processed_on = null  where video_id = %s"
        cursor, connection = establish_connection()
        cursor.execute(queryDeleteVideo, ([videoId]))
        connection.commit()
        return {"message": "Video Deleted"}
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def getProcessed(user):
    try:
        queryGetVideo = "Select * from videos where STATUS <> '' and EMAIL = %s"
        cursor, connection = establish_connection()
        cursor.execute(queryGetVideo, ([user]))
        result = cursor.fetchall()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def getUploaded(user):
    try:
        print("uploaded")
        queryGetVideo = (
            "Select * from videos where uploaded_video_url <> '' and email = %s"
        )
        cursor, connection = establish_connection()
        cursor.execute(queryGetVideo, ([user]))
        result = cursor.fetchall()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def getVideo(videoId, isProcessed):
    try:

        if isProcessed == "0":
            queryGetVideo = "Select uploaded_video_url from videos where video_id = %s"
        elif isProcessed == "1":
            queryGetVideo = "Select PROCESSED_VIDEO_URL from videos where video_id = %s"

        cursor, connection = establish_connection()
        cursor.execute(queryGetVideo, ([videoId]))
        result = cursor.fetchone()
        print("YEH hai")
        print(result)
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)


def getOneVideo(videoId):
    try:
        queryGetVideo = "Select * from videos where video_id = %s"
        cursor, connection = establish_connection()
        cursor.execute(queryGetVideo, ([videoId]))
        result = cursor.fetchone()
        return result
    except Exception as ex:
        print(ex)
        raise Exception(ex)
