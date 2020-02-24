import timeit
from VideoCaptureThreading import VideoCaptureThreading
from flask import Flask, Response
from flask_restful import Resource, Api
from flaskthreads import ThreadPoolWithAppContextExecutor, AppContextThread
import cv2 as cv
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from dotenv import load_dotenv
load_dotenv()


DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

application = Flask(__name__)
api = Api(application)

engine = create_engine("mysql://"+DB_USER+":" +
                       DB_PASS+"@"+DB_HOST+":3306/"+DB_NAME, pool_size=100, max_overflow=40)
Base = automap_base()
Base.prepare(engine, reflect=True)
cameras = Base.classes.Cameras


def findCameraUrl(camera_id):
    start = timeit.default_timer()
    session = Session(engine)
    camera = session.query(cameras).filter(cameras.id == camera_id).one()
    session.close()
    stop = timeit.default_timer()
    print(stop-start, "camera url")
    return camera.url


class Video(Resource):
    def get(self, camera_id):
        with ThreadPoolWithAppContextExecutor(max_workers=2) as pool:
            future_url = pool.submit(findCameraUrl, [camera_id])
            url = future_url.result()
        return Response(generate(url),
                        mimetype="multipart/x-mixed-replace; boundary=frame")


api.add_resource(Video, '/cameras/<camera_id>')


def generate(url):
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


@application.route('/')
def slash():
    return Response("this is the slash page")


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
