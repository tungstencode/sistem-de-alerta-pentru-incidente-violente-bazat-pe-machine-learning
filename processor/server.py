from flask import Flask, Response
from flask_restful import Resource, Api
from flaskthreads import ThreadPoolWithAppContextExecutor
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
    session = Session(engine)
    camera = session.query(cameras).filter(cameras.id == camera_id).one()
    session.close()
    return camera.url


class Video(Resource):
    def get(self, camera_id):
        with ThreadPoolWithAppContextExecutor(max_workers=5) as pool:
            future = pool.submit(findCameraUrl, [camera_id])
            url = future.result()
        return Response(generate(url),
                        mimetype="multipart/x-mixed-replace; boundary=frame")


api.add_resource(Video, '/cameras/<camera_id>')


def generate(url):
    vcap = cv.VideoCapture(url)
    while True:
        ret, frame = vcap.read()
        (flag, encodedImage) = cv.imencode(".jpg", frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')


@application.route('/')
def slash():
    return Response("this is the slash page")


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True)
