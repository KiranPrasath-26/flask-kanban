# Local Setup
- Clone the project
- Change to kanban_backend directory
- run `bash local_setup.sh` to setup the python environment for flask
- run `bash local_run.sh` to run the app in development mode 
- run `bash local_workers.sh` and `bash local_beat.sh` to run redis and celery.


# Setup Vite app
- Change to kanban_frontend directory
- install Node
- run `npm install` to install all the dependancy reqired for the vite app
- run `npm run dev` to run the vite app in development mode

#port
- http://localhost:5173 - Enter this link to access the vite app
- http://localhost:8080 - Enter this link to access the flask app
