import os
from flask import Flask
from flask_restful import Resource, Api
from application.config import LocalDevelopmentConfig
from application.database import db
from application.api import *
from flask_sse import sse
from flask_cors import CORS
from application import workers
import flask_wtf
from flask_security import Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore
from application.models import Users, Role
from application.forms import MyRegisterForm

app = None
api = None  
celery = None

def create_app():
    app=Flask(__name__, template_folder="templates")
    if os.getenv('ENV', "development") == "production":
        raise Exception("Currently no production config is setup.")
    else:
        print("Starting Local Development")
        app.config.from_object(LocalDevelopmentConfig)
        app.app_context().push()
    app.app_context().push()    
    db.init_app(app)
    app.app_context().push()
    api = Api(app)
    app.app_context().push()
    db.create_all()
    app.app_context().push()
    user_datastore = SQLAlchemySessionUserDatastore(db.session, Users, Role)
    app.app_context().push()
    security = Security(app, user_datastore)
    app.app_context().push()
    app.app_context().push()
    # Create the celery instance
    celery = workers.celery
    app.app_context().push()
    
    # Update celery with the configuration
    celery.conf.update(
        broker_url = app.config["CELERY_BROKER_URL"],
        result_backend = app.config["CELERY_RESULT_BACKEND"],
        timezone = 'Asia/Kolkata',
        enable_utc = True
    )
    app.app_context().push()
    
    celery.Task = workers.ContextTask
    app.app_context().push()

    app.logger.info("APP setup complete")
    return app, api, celery

app, api, celery = create_app()

flask_wtf.CSRFProtect(app)

app.config['CORS_HEADERS'] = 'Content-Type'

app.register_blueprint(sse, url_prefix='/stream')

CORS(app, support_credentials=True)

#Import the controllers
from application.controllers import *

#Import the RESTFUL controllers
from application.api import UserAPI

api.add_resource(UserDataAPI, "/api/user_data/<int:user_id>")
api.add_resource(UserAPI, "/api/user","/api/user/<int:user_id>")
api.add_resource(UserListsAPI, "/api/list/user/<int:user_id>")
api.add_resource(ListAPI, "/api/list", "/api/list/<int:list_id>")
api.add_resource(ListCardsAPI, "/api/card/list/<int:list_id>")
api.add_resource(CardAPI, "/api/card", "/api/card/<int:card_id>")

if __name__ == "__main__":
    app.run('0.0.0.0', port=8080)