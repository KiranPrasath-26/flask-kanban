from distutils.command.build_scripts import first_line_re
from sqlalchemy import and_
from venv import create
from flask_restful import Resource, fields, marshal_with, reqparse, marshal
from application.database import db 
from application.models import *
from application.validation import *
from flask_security import auth_required


user_fields = {
    "id" : fields.Integer,
    "username" : fields.String,
    "email" : fields.String,
}

list_fields = {
    "list_id": fields.Integer,
    "user_id": fields.Integer,
    "list_name": fields.String,
    "list_date": fields.String,
    "score": fields.Integer
}

card_fields = {
    "card_id": fields.Integer,
    "list_id": fields.Integer,
    "title": fields.String,
    "content": fields.String,
    "created_time": fields.String,
    "deadline": fields.String,
    "completed_on": fields.String,
    "flag": fields.Integer
}

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('username')
create_user_parser.add_argument('email')

update_user_parser = reqparse.RequestParser()
update_user_parser.add_argument('username')
update_user_parser.add_argument('email')

create_list_parser = reqparse.RequestParser()
create_list_parser.add_argument("user_id")
create_list_parser.add_argument("list_name")
create_list_parser.add_argument("list_date")
create_list_parser.add_argument("score")

update_list_parser = reqparse.RequestParser()
update_list_parser.add_argument("list_name")
update_list_parser.add_argument("score")

create_card_parser = reqparse.RequestParser()
create_card_parser.add_argument("list_id")
create_card_parser.add_argument("title")
create_card_parser.add_argument("content")
create_card_parser.add_argument("created_time")
create_card_parser.add_argument("deadline")
create_card_parser.add_argument("completed_on")
create_card_parser.add_argument("flag")

update_card_parser = reqparse.RequestParser()
update_card_parser.add_argument("list_id")
update_card_parser.add_argument("title")
update_card_parser.add_argument("content")
update_card_parser.add_argument("deadline")
update_card_parser.add_argument("completed_on")
update_card_parser.add_argument("flag")


class UserAPI(Resource):
    @auth_required('token')
    @marshal_with(user_fields)
    def get(self, user_id):
        # Get the username
        print("In UserAPI GET method", user_id)

        # Get User from database based on username
        user = get_user(user_id)
        abort_if_not_found(user)
        return user

    @marshal_with(user_fields)
    def put(self, user_id):
        args = update_user_parser.parse_args()

        email = args.get("email", None)
        username = args.get("username", None)

        validate_email(email)
        validate_username(username)
        
        user = Users.query.filter(Users.email == email).first()
        if user:
            raise APIError(
                status_code=400,
                error_code="USER_ERR_03",
                error_message="email already exists"
            )
        
        user = Users.query.filter(Users.username == username).first()
        if user:
            raise APIError(
                status_code=400,
                error_code="USER_ERR_04",
                error_message="username already exists"
            )

        user = get_user(user_id)
        abort_if_not_found(user)

        user.email = email
        user.username = username
        db.session.add(user)
        db.session.commit()
        
        return user

    @auth_required('token')
    @marshal_with(user_fields)
    def delete(self, user_id):
        user = get_user(user_id)
        abort_if_not_found(user)
        db.session.delete(user)
        db.session.commit()
        return {"message" : "Successfully Deleted"}, 200

    @marshal_with(user_fields)    
    def post(self):
        args = create_user_parser.parse_args()
        username = args.get("username", None)
        email = args.get("email", None)

        if username is None:
            raise APIError(
                status_code=400,
                error_code="USER_ERR_03",
                error_message="username is required"
            )
        if email is None:
            raise APIError(
                status_code=400,
                error_code="USER_ERR_02",
                error_message="email is required"
            )
        
        user = db.session.query(Users).filter((Users.username == username) | (Users.email == email)).first()

        if user:
            raise APIError(
                status_code=400,
                error_code="USER_ERR_01",
                error_message="user already exists"
            )
        
        new_user = Users(username = username, email = email)
        db.session.add(new_user)
        db.session.commit()
        return new_user


class UserDataAPI(Resource):
    def get(self,user_id):
        user = get_user(user_id)
        abort_if_not_found(user)
        user_data = {}
        user_data["user"] = marshal(user, user_fields)
        user_data["lists"] = marshal(user.dlist, list_fields)
        user_data["cards"] = []
        for list in user.dlist:
            user_data["cards"].extend(marshal(list.dcard, card_fields))
        return user_data, 200

class UserListsAPI(Resource):
    @marshal_with(list_fields)
    def get(self, user_id):
        user = get_user(user_id)
        abort_if_not_found(user)
        lists = user.dlist
        return lists
    
class ListAPI(Resource):
    @auth_required('token')
    @marshal_with(list_fields)
    def get(self, list_id = None):
        list = get_list(list_id)
        abort_if_not_found(list)
        return list

    @auth_required('token')
    @marshal_with(list_fields)
    def put(self, list_id):
        list = get_list(list_id)
        abort_if_not_found(list)

        args = update_list_parser.parse_args()
        list_name = args.get("list_name", None)
        score = args.get("score", None)

        validate_listname(list_name)
        validate_listscore(score)

        list.list_name = list_name
        list.score = score

        db.session.add(list)
        db.session.commit()

        return list
    
    @auth_required('token')
    def delete(self, list_id):
        list = get_list(list_id)
        abort_if_not_found(list)
        db.session.delete(list)
        db.session.commit()
        return {"message": "Successfully Deleted"}, 200
    
    @auth_required('token')
    @marshal_with(list_fields)
    def post(self):
        args = create_list_parser.parse_args()
        user_id = args.get("user_id", None)
        list_name = args.get("list_name", None)
        list_date = args.get("list_date", None)
        score = args.get("score", None)

        validate_listname(list_name)
        validate_listdate(list_date)
        validate_listscore(score)

        user = get_user(user_id)
        if user is None:
            raise APIError(
                status_code=400,
                error_code="LIST_ERR_04",
                error_message="user does not exist"
            )

        list = Lists.query.filter(and_(Lists.list_name == list_name, Lists.user_id == user_id)).first()
        if list is not None:
            raise APIError(
                status_code=400,
                error_code="LIST_ERR_05",
                error_message="list already exists"
            )

        list = Lists(
            user_id=user_id,
            list_name=list_name,
            list_date=list_date,
            score=score
        )

        db.session.add(list)
        db.session.commit()
        list = Lists.query.filter(and_(Lists.list_name == list_name, Lists.user_id == user_id)).first()
        return list, 201

class ListCardsAPI(Resource):
    @auth_required('token')
    @marshal_with(card_fields)
    def get(self, list_id):
        list = get_list(list_id)
        abort_if_not_found(list)
        cards = list.dcard
        return cards

class CardAPI(Resource):
    @auth_required('token')
    @marshal_with(card_fields)
    def get(self, card_id):
        card = get_card(card_id)
        abort_if_not_found(card)
        return card

    @auth_required('token')
    @marshal_with(card_fields)
    def put(self, card_id):
        card = get_card(card_id)
        abort_if_not_found(card)

        args = update_card_parser.parse_args()
        title = args.get("title", None)
        content = args.get("content", None)
        deadline = args.get("deadline", None)
        completed_on = args.get("completed_on", None)
        flag = args.get("flag", 0)

        validate_title(title)
        validate_content(content)
        validate_deadline(deadline)
        validate_completed_on(completed_on)
        # validate_flag(flag)

        card.title = title
        card.content = content
        card.deadline = deadline
        card.completed_on = completed_on
        card.flag = flag

        db.session.add(card)
        db.session.commit()
        return card

    @auth_required('token')
    def delete(self, card_id):
        card = get_card(card_id)
        abort_if_not_found(card)
        db.session.delete(card)
        db.session.commit()
        return {"message": "Successfully Deleted"}, 200

    @auth_required('token')
    @marshal_with(card_fields)
    def post(self):
        args = create_card_parser.parse_args()
        list_id = args.get("list_id", None)
        title = args.get("title", None)
        content = args.get("content", None)
        created_time = args.get("created_time", None)
        deadline = args.get("deadline", None)
        completed_on = args.get("completed_on", None)
        flag = args.get("flag", None)

        validate_title(title)
        validate_content(content)
        validate_created_time(created_time)
        validate_deadline(deadline)
        validate_completed_on(completed_on)
        # validate_flag(flag)

        list = get_list(list_id)
        if list is None:
            raise APIError(
                status_code=400,
                error_code="CARD_ERR_07",
                error_message="list does not exist"
            )

        card = Cards(
            list_id = list_id,
            title = title,
            content = content,
            created_time = created_time,
            deadline = deadline,
            completed_on = completed_on,
            flag = flag
        )

        db.session.add(card)
        db.session.commit()
        return card, 201
