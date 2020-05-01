from flask import Flask, Response, jsonify, stream_with_context, request, session
import time
import cv2 as cv


application = Flask(__name__)

def generate(video):
    vcap = cv.VideoCapture(video)
    ret, frame = vcap.read()
    while True:
        ret, frame = vcap.read()
        time.sleep(0.05)

        (flag, encodedImage) = cv.imencode(".jpg", frame)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' +
               bytearray(encodedImage) + b'\r\n')


@application.route('/demo')
def slash():
    gImg = generate('V_789.mp4')

    response = Response(stream_with_context(gImg),
                        mimetype="multipart/x-mixed-replace; boundary=frame")
    return response


if __name__ == '__main__':
    application.run(host='0.0.0.0', debug=True, threaded=True, port=5001)
