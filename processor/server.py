import timeit
import datetime
import time
from flask_sse import sse
from VideoCaptureThreading import VideoCaptureThreading
from flask import Flask, Response, jsonify, stream_with_context, request, session
from flask_restful import Resource, Api
from flaskthreads import ThreadPoolWithAppContextExecutor, AppContextThread
import cv2 as cv
import os
import redis
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_cors import CORS
from dotenv import load_dotenv
import imutils
import numpy as np
from src.ViolenceDetector import *
import settings.DeploySettings as deploySettings
import settings.DataSettings as dataSettings
import src.data.ImageUtils as ImageUtils
from debounce import debounce

load_dotenv('processor.env')


DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")


application = Flask(__name__)
red = redis.StrictRedis()
api = Api(application)
CORS(application)

engine = create_engine("mysql://"+DB_USER+":" +
                       DB_PASS+"@"+DB_HOST+":3306/"+DB_NAME, pool_size=100, max_overflow=40)
Base = automap_base()
Base.prepare(engine, reflect=True)
cameras = Base.classes.Cameras


class Unprocessed(Resource):
    def get(self, camera_id):
        with ThreadPoolWithAppContextExecutor(max_workers=1) as pool:
            future_url = pool.submit(findCameraUrl, [camera_id])
            url = future_url.result()

        gImg = generateUnprocessedImage(url)

        response = Response(stream_with_context(gImg),
                            mimetype="multipart/x-mixed-replace; boundary=frame")
        return response


def generateUnprocessedImage(url):
    start = timeit.default_timer()
    # vcap = cv.VideoCapture(url)
    vcap = VideoCaptureThreading(url)
    stop = timeit.default_timer()
    print(stop-start, "capture camera")
    while True:
        vcap.start()
        ret, frame = vcap.read()
        vcap.stop()
        (flag, encodedImage) = cv.imencode(".jpg", frame)

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')


class Processed(Resource):
    def get(self, camera_id):
        with ThreadPoolWithAppContextExecutor(max_workers=1) as pool:
            future_url = pool.submit(findCameraUrl, [camera_id])
            url = future_url.result()
        gImg = generateProcessedImage(url, camera_id)

        response = Response(stream_with_context(gImg),
                            mimetype="multipart/x-mixed-replace; boundary=frame")
        return response


@debounce(15)
def publishFighting(isFighting, id):
    red.publish('detect'+str(id), str(isFighting))


def generateProcessedImage(url, id):
    violenceDetector = ViolenceDetector()
    # videoReader = VideoCaptureThreading(url)
    videoReader = cv.VideoCapture(url)
    # videoReader = Camera(url)
    start = timeit.default_timer()
    isCurrentFrameValid, currentImage = videoReader.read()
    stop = timeit.default_timer()
    print(stop-start, "frame time")

    while True:
        netInput = ImageUtils.ConvertImageFrom_CV_to_NetInput(currentImage)
        isFighting = violenceDetector.Detect(netInput)
        targetSize = deploySettings.DISPLAY_IMAGE_SIZE - 2*deploySettings.BORDER_SIZE
        # currentImage = cv.resize(currentImage, (targetSize, targetSize))
        currentImage = imutils.resize(currentImage, width=targetSize)
        if isFighting:
            publishFighting(isFighting, id)
            resultImage = cv.copyMakeBorder(currentImage, deploySettings.BORDER_SIZE, deploySettings.BORDER_SIZE,
                                            deploySettings.BORDER_SIZE, deploySettings.BORDER_SIZE, cv.BORDER_CONSTANT, value=deploySettings.FIGHT_BORDER_COLOR)
        else:
            resultImage = cv.copyMakeBorder(currentImage, deploySettings.BORDER_SIZE, deploySettings.BORDER_SIZE, deploySettings.BORDER_SIZE,
                                            deploySettings.BORDER_SIZE, cv.BORDER_CONSTANT, value=deploySettings.NO_FIGHT_BORDER_COLOR)

        isCurrentFrameValid, currentImage = videoReader.read()
        (flag, encodedImage) = cv.imencode(".jpg", resultImage)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')


class Detect(Resource):
    def get(self, camera_id):

        response = Response(event_stream(camera_id),
                            mimetype="text/event-stream")
        return response


def findCameraUrl(camera_id):
    start = timeit.default_timer()
    session = Session(engine)
    camera = session.query(cameras).filter(cameras.id == camera_id).one()
    session.close()
    stop = timeit.default_timer()
    print(stop-start, "camera url")
    return camera.url


api.add_resource(Unprocessed, '/unprocessed/<camera_id>')
api.add_resource(Processed, '/processed/<camera_id>')
api.add_resource(Detect, '/detect/<camera_id>')


@application.route('/post', methods=['POST'])
def post():
    message = request.form['message']
    id = request.form['id']
    red.publish('detect'+str(id), message)
    return Response('ok', status=200)


@application.route('/')
def slash():
    return Response("this is the slash page")


@application.route('/unsub/<camera_id>')
def unsub(camera_id):
    pubsub = red.pubsub()
    pubsub.unsubscribe('detect'+str(camera_id))
    return Response("unsubbed", 204)


def event_stream(camera_id):
    pubsub = red.pubsub()
    pubsub.subscribe('detect'+str(camera_id))
    for message in pubsub.listen():
        # print(message['data'])
        yield 'data: %s\n\n' % message['data']


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True, threaded=True)
