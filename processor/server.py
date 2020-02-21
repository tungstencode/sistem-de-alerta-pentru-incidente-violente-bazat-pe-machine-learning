from flask import Flask, Response
from flask_restful import Resource, Api
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

app = Flask(__name__)
api = Api(app)


class Video(Resource):
    def get(self, camera_id):
        camera = session.query(cameras).filter(cameras.id == camera_id).one()
        return Response(generate(camera.url),
                        mimetype="multipart/x-mixed-replace; boundary=frame")

    # def put(self, todo_id):
    #     todos[todo_id] = request.form['data']
    #     return {todo_id: todos[todo_id]}


api.add_resource(Video, '/cameras/<camera_id>')


def generate(url):
    vcap = cv.VideoCapture(url)

    while True:
        ret, frame = vcap.read()
        (flag, encodedImage) = cv.imencode(".jpg", frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')


@app.route('/')
def slash():
    # return the response generated along with the specific media
    # type (mime type)
    return Response("this is the slash page")


if __name__ == '__main__':

    # print("mysql://"+DB_USER+":"+DB_PASS+"@"+DB_HOST+":3306/"+DB_NAME)
    engine = create_engine("mysql://"+DB_USER+":" +
                           DB_PASS+"@"+DB_HOST+":3306/"+DB_NAME)
    Base = automap_base()
    Base.prepare(engine, reflect=True)
    cameras = Base.classes.Cameras
    session = Session(engine)
    app.run(debug=True)
