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
import jsonpickle
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv('processor.env')


DB_HOST = os.getenv("DB_HOST")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")

application = Flask(__name__)
# red = redis.StrictRedis()
application.config["REDIS_URL"] = "redis://localhost"
application.register_blueprint(sse, url_prefix='/stream')
application.
api = Api(application)
CORS(application)

engine = create_engine("mysql://"+DB_USER+":" +
                       DB_PASS+"@"+DB_HOST+":3306/"+DB_NAME, pool_size=100, max_overflow=40)
Base = automap_base()
Base.prepare(engine, reflect=True)
cameras = Base.classes.Cameras


@application.route('/send')
def send_message():
    sse.publish({"message": "Hello!"}, type='greeting')
    return "Message sent!"

# def event_stream():
#     pubsub = red.pubsub()
#     pubsub.subscribe('chat')
#     for message in pubsub.listen():
#         print(message)
#         yield 'data: %s\n\n' % message['data']


# @application.route('/post', methods=['POST'])
# def post():
#     message = request.form['message']
#     user = session.get('user', 'anonymous')
#     now = datetime.datetime.now().replace(microsecond=0).time()
#     red.publish('chat', u'[%s] %s: %s' % (now.isoformat(), user, message))
#     return Response('ok', status=200)


# @application.route('/stream')
# def stream():
#     return Response(event_stream(),
#                     mimetype="text/event-stream")


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
        with ThreadPoolWithAppContextExecutor(max_workers=1) as pool:
            future_url = pool.submit(findCameraUrl, [camera_id])
            url = future_url.result()

        gImg = generateImage(url)
        # response = {'Status': 'Success',
        #             'message': message, 'ImageBytes': gImg}
        # response_pickled = jsonpickle.encode(
        # response)

        response = Response(stream_with_context(gImg),
                            mimetype="multipart/x-mixed-replace; boundary=frame")
        # response = Response(
        #     response_pickled, content_type='application/json')
        # response.headers['custom'] = 'sss'
        return response

    def post(self, camera_id):
        with ThreadPoolWithAppContextExecutor(max_workers=1) as pool:
            future_url = pool.submit(findCameraUrl, [camera_id])
            url = future_url.result()

        gJson = generateJson(url)
        response = Response(stream_with_context(
            gJson), mimetype='multipart/x-mixed-replace; boundary=detection')
        # response.headers['custom'] = 'sss'
        return response


api.add_resource(Video, '/cameras/<camera_id>')


def generateJson(url):
    # start = timeit.default_timer()
    # vcap = cv.VideoCapture(url)
    # vcap = VideoCaptureThreading(url)
    detected = False
    # stop = timeit.default_timer()
    # print(stop-start, "capture camera")
    while True:
        detected = not detected
        # vcap.start()
        # ret, frame = vcap.read()
        # vcap.stop()
        # (flag, encodedImage) = cv.imencode(".jpg", frame)
        # print("Frame", datetime.datetime.now())
        # yield '{' + str(detected) + '}'
        time.sleep(1)
        yield (b'--detection\r\n' b'Content-Type: application/json\r\n\r\n' +
               jsonify({"detected": detected}).data + b'\r\n')
        # yield jsonify({url: detected}).data


def generateImage(url):
    start = timeit.default_timer()
    # vcap = cv.VideoCapture(url)
    vcap = VideoCaptureThreading(url)
    detected = False
    stop = timeit.default_timer()
    print(stop-start, "capture camera")
    while True:
        detected = not detected
        # sse.publish({"message": "Hello!"}, type='greeting')
        vcap.start()
        ret, frame = vcap.read()
        vcap.stop()
        (flag, encodedImage) = cv.imencode(".jpg", frame)

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')
        if(detected):
            yield (b'--detection\r\n' + b'\r\n')


# @application.route('/detect', methods=['POST'])
# def detect():
#     data = get_request_file(request)
#     if data is None:
#         "file", requests.codes.bad_request

#     rc, ret = ctrl.detect(data)
#     if not rc:
#         return jsonify({"error": ret}), requests.codes.bad_request
#     return jsonify(ret), requests.codes.ok


@application.route('/')
def slash():
    return Response("this is the slash page")


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True, threaded=True)
