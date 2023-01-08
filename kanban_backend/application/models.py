from application.database import db
from flask_security import UserMixin, RoleMixin

roles_users = db.Table('roles_users',
        db.Column('user_id', db.Integer, db.ForeignKey('user.id')),
        db.Column('role_id', db.Integer, db.ForeignKey('role.id')))

class Users(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key = True, autoincrement = True)
    username = db.Column(db.String)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String, nullable = False)
    active = db.Column(db.Boolean)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable = False)
    webhook_url = db.Column(db.String(255),unique=True)
    roles = db.relationship('Role', secondary = roles_users, backref = db.backref('user', lazy = 'dynamic'))
    dlist = db.relationship('Lists', cascade='all, delete-orphan', backref='list')

    def get_security_payload(self):
        return {
            "id":self.id,
            "username":self.username,
            "email":self.email,
            "webhook_url":self.webhook_url
        }

class Role(db.Model, RoleMixin):
    _tablename__='role'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String, unique = True)
    description = db.Column(db.String)

class Lists(db.Model):
    __tablename__ = 'list'
    list_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    list_name = db.Column(db.String, nullable=False, unique=True)
    list_date = db.Column(db.String)
    score = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dcard = db.relationship('Cards', cascade='all, delete-orphan', backref='card')

class Cards(db.Model):
    __tablename__ = 'card'
    card_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50), nullable = False)
    content = db.Column(db.String(512), nullable = False)
    created_time = db.Column(db.String)
    deadline = db.Column(db.String)
    completed_on = db.Column(db.String)
    flag = db.Column(db.Integer, default = 0)
    list_id = db.Column(db.Integer, db.ForeignKey('list.list_id'), nullable = False)