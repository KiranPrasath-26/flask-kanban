from flask import Flask, render_template, request, current_app as app
from application.models import Users, Lists, Cards
from application import tasks

@app.route('/', methods = ['GET','POST'])
def home():
    lists = Lists.query.all()
    return render_template("home.html", lists=lists)

@app.route("/lists_by/<user_name>", methods=['GET','POST'])
def list_by_user(user_name):
    lists = Lists.query.filter_by(user = user_name)
    return render_template("list_by_user.html", lists=lists)

@app.route('/export_list/<user_id>/<list_id>')
def export_deck(user_id,list_id):
    job = tasks.export_list.delay(user_id,list_id)
    return {"job_id":str(job)},200

@app.route('/export_card/<user_id>/<card_id>')
def export_card(user_id,card_id):
    job = tasks.export_card.delay(user_id,card_id)
    return {"job_id":str(job)},200


@app.route('/hello/<user_name>', methods = ['GET','POST'])
def hello(user_name):
    job = tasks.just_say_hello.delay(user_name)
    result = job.wait()
    return str(result), 200