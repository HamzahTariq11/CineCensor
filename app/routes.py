from flask import (
    Flask,
    jsonify,
    request,
    redirect,
    url_for,
    current_app,
    send_file,
    Response,
)
from app.decorators import token_required
from app.helpers.videosHelper import generate_unique_string
from app.models.usersModel import loginCheck, addUser
from app.models.videosModel import (
    addVideo,
    deleteUploaded,
    deleteProcessed,
    getProcessed,
    getUploaded,
    getVideo,
    processVideo,
    getOneVideo,
)
from app.models.dashboardModel import (
    getTotalProcessed,
    getTotalVideo,
    getExplicitContent,
    getGraphContent,
)
from app.models.usersModel import loginCheck, addUser
from app.models.videosModel import (
    addVideo,
    deleteUploaded,
    deleteProcessed,
    getProcessed,
    getUploaded,
    getVideo,
    processVideo,
)
from app.models.dashboardModel import (
    getTotalProcessed,
    getTotalVideo,
    getExplicitContent,
    getGraphContent,
)
import shutil
import os
from functools import partial


def generate_video(video_file_path):
    # Replace 'video_file_path' with the path to your video file
    with open(video_file_path, "rb") as video_file:
        for chunk in iter(partial(video_file.read, 1024), b""):
            yield chunk


def setup_routes(app):
    @app.route("/", methods=["POST"])
    def login():
        try:
            if request.method == "POST":
                authEmail = [request.form["email"]]
                authPassword = [request.form["password"]]
                token = loginCheck(authEmail, authPassword)
                if token != 0:
                    return (
                        jsonify({"token": token}),
                        200,
                    )
                else:
                    return (
                        jsonify({"message": "Incorrect Credentials"}),
                        401,
                    )

        except (NameError, TypeError) as error:
            # print(error)
            return jsonify({error}), 400

    @app.route("/signup", methods=["POST"])
    def addUserData():
        try:

            if request.method == "POST":
                userData = request.form
                userFirstName = userData["firstName"]
                userLastName = userData["lastName"]
                userEmail = userData["email"]
                userPassword = userData["password"]
                userGender = userData["gender"]
                response = addUser(
                    userFirstName, userLastName, userEmail, userPassword, userGender
                )

                return jsonify(response)

        except Exception as ex:
            print(ex)
            return jsonify({"error in signup module": str(ex)}), 400

    @app.route("/videoupload", methods=["POST"])
    @token_required
    def videoupload(user):
        try:

            if request.method == "POST":
                file = request.files["file"]
                if file.filename == "":
                    raise Exception("No file selected")
                fileName = "video.mp4"
                file.save(fileName)
                videoData = request.form
                videoName = videoData["videoName"]
                video_url = generate_unique_string()
                file_path = f"app/UploadedVideos/{video_url}.mp4"
                shutil.copy(fileName, file_path)
                response = addVideo(videoName, file_path, user)

                return jsonify({"message": "Video Uploaded"})

        except Exception as ex:
            print(f"Error during file upload: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/videoprocess", methods=["POST"])
    @token_required
    def videoprocess(user):
        try:

            if request.method == "POST":
                videoData = request.form
                videoId = videoData["videoId"]
                response = processVideo(videoId)

                return response

        except Exception as ex:
            print(f"Error during file upload: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/getprocessed", methods=["GET"])
    @token_required
    def getprocessed(user):
        try:
            if request.method == "GET":

                data = getProcessed(user)
                return jsonify(data)

        except Exception as ex:
            print(f"Error during getting videos: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/getuploaded", methods=["GET"])
    @token_required
    def getuploaded(user):
        try:
            if request.method == "GET":

                data = getUploaded(user)
                return jsonify(data)

        except Exception as ex:
            print(f"Error during getting videos: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/deleteuploaded", methods=["POST"])
    @token_required
    def deleteuploaded(user):
        try:
            if request.method == "POST":

                videoData = request.form
                videoId = videoData["videoId"]
                response = deleteUploaded(videoId)
                return response

        except Exception as ex:
            print(f"Error during file delete: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/deleteprocessed", methods=["POST"])
    @token_required
    def deleteprocessed(user):
        try:
            if request.method == "POST":

                videoData = request.form
                videoId = videoData["videoId"]
                response = deleteProcessed(videoId)
                return response

        except Exception as ex:
            print(f"Error during file delete: {ex}")
            return jsonify({"message": str(ex)}), 400

        # later

    @app.route("/streamvideo", methods=["GET", "HEAD"])
    def streamvideo():
        try:
            if request.method == "GET" or request.method == "HEAD":
                videoId = request.args.get("video_id")
                isProcessed = request.args.get("is_processed")
                print(isProcessed)

                video_url = getVideo(videoId, isProcessed)
                if not video_url or not os.path.isfile(video_url[0]):
                    return jsonify({"message": "Video not found"}), 404
                if request.method == "GET":
                    return send_file(
                        video_url[0][4:], as_attachment=False, mimetype="video/mp4"
                    )
                else:
                    # For a HEAD request, return headers without sending the actual file
                    response = app.response_class(status=200, mimetype="video/mp4")
                    response.headers["Content-Length"] = os.path.getsize(video_url[0])
                    return response
            # if request.method == "GET":
            #     videoId = request.args.get("video_id")
            #     isProcessed = request.args.get("is_processed")

            #     video_url = getVideo(videoId, isProcessed)
            #     print(video_url[0])
            #     if not os.path.isfile(video_url[0]):
            #         return jsonify({"message": "video not found"})
            #     print(video_url)
            #     return send_file(
            #         video_url[0][4:], as_attachment=False, mimetype="video/mp4"
            #     )
            # return Response(
            #     generate_video(video_url[0]),
            #     mimetype="video/mp4",
            # )

        except Exception as ex:
            print(f"Error during stream videos: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/downloadvideo", methods=["GET"])
    def donwloadvideo():
        try:
            if request.method == "GET":
                videoId = request.args.get("video_id")
                isProcessed = request.args.get("is_processed")

                video_url = getVideo(videoId, isProcessed)
                print(video_url[0])
                if not os.path.isfile(video_url[0]):
                    return jsonify({"message": "video not found"})

                return send_file(
                    video_url[0][4:], as_attachment=True, mimetype="video/mp4"
                )

        except Exception as ex:
            print(f"Error during download videos: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/dashboard", methods=["GET"])
    @token_required
    def dashboard(user):
        try:
            if request.method == "GET":

                totalVideos = getTotalVideo(user)
                processedVideos = getTotalProcessed(user)
                explicitContent = getExplicitContent(user)
                graphContent = getGraphContent(user)
                return jsonify(
                    totalVideos, processedVideos, explicitContent, graphContent
                )

        except Exception as ex:
            print(f"Error during getting videos: {ex}")
            return jsonify({"message": str(ex)}), 400

    @app.route("/getonevideo", methods=["GET"])
    @token_required
    def getonevideo(user):
        try:
            if request.method == "GET":
                videoId = request.args.get("video_id")

                result = getOneVideo(videoId)

                return jsonify(result)

        except Exception as ex:
            print(f"Error during get one videos: {ex}")
            return jsonify({"message": str(ex)}), 400
