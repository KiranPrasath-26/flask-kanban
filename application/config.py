import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    SQLITE_DB_DIR = None
    SQLALCHEMY_DATABASE_URI = None
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"

class LocalDevelopmentConfig(Config):
    SQLITE_DB_DIR = os.path.join(basedir, "../db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "kanbandb.db")
    DEBUG = True
    SECRET_KEY = "idfqoiehjasDBt?9D8~J7!3AJOSIDFJM,ENfchuO[yKW8XU|{dlZ:k|ZTZI,BCg"
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = "8XMfZSjo*oep$4Yc&kaE7Jwgw"
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    SECURITY_UNAUTHORIZED_VIEW = None
    SECURITY_USERNAME_ENABLE = True
    SECURITY_REDIRECT_BEHAVIOR = 'spa'
    WTF_CSRF_CHECK_DEFAULT = False
    SECURITY_CSRF_PROTECT_MECHANISMS = ["session", "basic"]
    SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = True
    SECURITY_CSRF_COOKIE_NAME = "XSRF-TOKEN"
    WTF_CSRF_CHECK_DEFAULT = False
    WTF_CSRF_TIME_LIMIT = None
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "Authentication-Token"
    UPLOAD_FOLDER = os.path.join(basedir, '../static/files')
