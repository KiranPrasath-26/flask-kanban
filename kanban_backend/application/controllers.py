from flask import Flask, render_template, request, current_app as app
from application.models import Users, Lists, Cards


@app.route('/', methods = ['GET','POST'])
def home():
    lists = Lists.query.all()
    return render_template("home.html", lists=lists)

@app.route("/lists_by/<user_name>", methods=['GET','POST'])
def list_by_user(user_name):
    lists = Lists.query.filter_by(user = user_name)
    return render_template("list_by_user.html", lists=lists)