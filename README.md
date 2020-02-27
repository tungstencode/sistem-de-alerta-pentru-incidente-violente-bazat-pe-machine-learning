# SISTEM DE ALERTĂ PENTRU INCIDENTE VIOLENTE BAZAT PE MACHINE LEARNING

## Requirements to run the app
* python 3.6.x
* ubuntu 16.04 for cuda 9(needed for tensorflow-gpu 1.7.0 )
* Install dependencies
	* npm install on root directory
	* "cd backend" and "npm install"
	* "cd ../frontend" and "npm install"
	* "cd ../processor" and "python -m venv serverenv" and "source serverenv/bin/activate"
	* "cd ../processor" and "source serverenv/bin/activate" and "pip install requirements.txt"
	* "./run-redis.sh" - installs(for the first run only) the redis server and runs, required for server side events
* Start app
	* npm start or yarn start in root directory
