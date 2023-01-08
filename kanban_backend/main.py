import os
from flask import Flask
from flask_restful import Resource, Api
from application.config import LocalDevelopmentConfig
from application.database import db
from application.api import *
from flask_cors import CORS
import flask_wtf
from flask_security import Security, SQLAlchemySessionUserDatastore, SQLAlchemyUserDatastore
from application.models import Users, Role
from application.forms import ExtendedRegisterForm

app = None
api = None
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
    app.logger.info("APP setup complete")
    return app, api

app, api = create_app()

flask_wtf.CSRFProtect(app)

app.config['CORS_HEADERS'] = 'Content-Type'

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
# api.add_resource(DeckLastReviewTimeAPI, "/api/deck/update_lrt/<int:deck_id>")
# api.add_resource(CardDifficultyAPI,"/api/card/update_difficulty/<int:card_id>")
# api.add_resource(DeckTotalScoreAPI,"/api/deck/update_ts/<int:deck_id>")
# api.add_resource(WebhookUrlAPI,"/api/update_webhook_url/<int:user_id>")

if __name__ == "__main__":
    app.run('0.0.0.0', port=8080)