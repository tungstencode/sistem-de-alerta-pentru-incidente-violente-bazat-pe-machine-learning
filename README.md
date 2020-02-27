# SISTEM DE ALERTĂ PENTRU INCIDENTE VIOLENTE BAZAT PE MACHINE LEARNING

## Requirements to run the app
* python 3.6.x
* ubuntu 16.04 for cuda 9(needed for tensorflow-gpu 1.7.0 )
* Install dependencies
	* npm install on root directory
	* "cd backend" and "npm install" and create a certs folder and inside run "openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem"
	* "cd ../frontend" and "npm install"
	* "cd ../processor" and "python -m venv serverenv" and "source serverenv/bin/activate"
	* "cd ../processor" and "source serverenv/bin/activate" and "pip install requirements.txt"
	* "./run-redis.sh" - installs(for the first run only) the redis server and runs, required for server side events
* Start app
	* npm start or yarn start in root directory
