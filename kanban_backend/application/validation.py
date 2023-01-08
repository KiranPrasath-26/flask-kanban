from werkzeug.exceptions import HTTPException
from flask import make_response, jsonify
from application.models import *
from application.database import db
from flask_restful import abort
import re


class APIError(HTTPException):
    def __init__(self,status_code, error_code, error_message):
        message = {"error_code":error_code, "error_message":error_message, "status":status_code}
        self.response = make_response(jsonify(message), status_code)

regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

#Helper Functions
def abort_if_not_found(obj):
    if obj is None:
        abort(404, message="Resource not found")

def get_user(user_id):
    user = Users.query.filter(Users.user_id == user_id).first()
    return user

def validate_email(email):
    if (email is None) or (not re.fullmatch(regex, email)):
        raise APIError(
            status_code=400,
            error_code="USER_ERR_02",
            error_message="valid email is required"
        )

def validate_username(username):
    if (username is None) or (username.isnumeric()) or (len(username) == 0):
        raise APIError(
            status_code=400,
            error_code="USER_ERR_01",
            error_message="valid username is required"
        )

# def validate_password(password):
#     if (password is None) or (password.isnumeric()) or (len(password) == 0):
#         raise APIError(
#             status_code=400,
#             error_code="USER_ERR_02",
#             error_message="valid password is required"
#         )

def get_list(list_id):
    list = Lists.query.filter(Lists.list_id == list_id).first()
    return list

def validate_listname(list_name):
    if (list_name is None) or (list_name.isnumeric()) or (len(list_name) == 0):
        raise APIError(
            status_code=400,
            error_code="LIST_ERR_01",
            error_message="valid list name is required"
        )

def validate_listdate(list_date):
    if list_date is None:
        return
    if (list_date.isnumeric()) or len(list_date) == 0:
        raise APIError(
            status_code=400,
            error_code="LIST_ERR_02",
            error_message="last review time should be either None or should be in valid datetime format"
        )

def validate_listscore(score):
    if score is None:
        return
    if not score.isnumeric():
        raise APIError(
            status_code=400,
            error_code="LIST_ERR_03",
            error_message="score should be either None or an integer"
        )

def get_card(card_id):
    card = Cards.query.filter(Cards.card_id == card_id).first()
    return card

def validate_title(title):
    if (title is None) or (len(title) == 0):
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_01",
            error_message="valid card title is required"
        )

def validate_content(content):
    if (content is None) or (len(content) == 0):
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_02",
            error_message="valid content is required"
        )

def validate_created_time(created_time):
    if created_time is None:
        return
    if (created_time.isnumeric()) or len(created_time) == 0:
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_03",
            error_message="created time should be either None or should be in valid datetime format"
        )

def validate_deadline(deadline):
    if deadline is None:
        return
    if (deadline.isnumeric()) or len(deadline) == 0:
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_04",
            error_message="deadline should be either None or should be in valid datetime format"
        )

def validate_completed_on(completed_on):
    if completed_on is None:
        return
    if (completed_on.isnumeric()) or len(completed_on) == 0:
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_05",
            error_message="completed_on should be either None or should be in valid datetime format"
        )

def validate_flag(flag):
    if flag is None:
        return
    if int(flag)!=0 and int(flag)!=1:
        raise APIError(
            status_code=400,
            error_code="CARD_ERR_06",
            error_message="flag can only take the values null/0/1"
        )