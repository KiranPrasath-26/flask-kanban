from application.workers import celery
from datetime import datetime
# from main import app 
from flask_sse import sse
from application.models import Users, Lists, Cards
import os
import time 
# import requests

@celery.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # sender.add_periodic_task(10.0, print_current_time.s(), name = 'at every 10 seconds')
    sender.add_periodic_task(120.0, cleanup_exports.s(), name = 'remove all the export files')
    #sender.add_periodic_task(10.0, daily_remainder.s(), name = 'Send message to discord to revise daily')

@celery.task()
def print_current_time():
    print("START")
    now = datetime.now()
    print("now in task = ",now)
    dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
    print("date and time = ", dt_string)
    print("COMPLETE")
    return dt_string

@celery.task()
def just_say_hello(name):
    print("Inside Task")
    print("Hello {}".format(name))
    return "Hello {}".format(name)

@celery.task(bind=True)
def export_list(self,user_id,list_id):
    now = datetime.now()
    print("STARTING LIST EXPORT JOB ",now)
    print("Job id",self.request.id)
    list = Lists.query.filter(Lists.list_id == list_id).first()
    print(list)
    f = open(f'static/files/{self.request.id}.txt','w',encoding='utf-8')
    for card in list.dcard:
        f.write(card.title+','+card.content+','+str(card.deadline)+','+str(card.completed_on)+','+str(card.flag)+','+'\n')
    f.close()
    time.sleep(4)
    print("List EXPORT JOB COMPLETE")
    message = "Exported the List {}".format(list_id)
    export_url = 'http://localhost:8080/static/files/{}.txt'.format(self.request.id)
    sse.publish({"job_id":self.request.id,"message":message,"url":export_url}, type='Export', channel=str(user_id))
    return "EXPORT COMPLETED"

@celery.task(bind=True)
def export_card(self,user_id,card_id):
    now = datetime.now()
    print("STARTING CARD EXPORT JOB ",now)
    print("Job id",self.request.id)
    card = Cards.query.filter(Cards.card_id == card_id).first()
    print(card.title)
    f = open(f'static/files/{self.request.id}.txt','w',encoding='utf-8')
    f.write(card.title+','+card.content+','+str(card.deadline)+','+str(card.completed_on)+','+str(card.flag)+','+'\n')
    f.close()
    time.sleep(4)
    print("List EXPORT JOB COMPLETE")
    message = "Exported the Card {}".format(card_id)
    export_url = 'http://localhost:8080/static/files/{}.txt'.format(self.request.id)
    sse.publish({"job_id":self.request.id,"message":message,"url":export_url}, type='Export', channel=str(user_id))
    return "EXPORT COMPLETED"

@celery.task(bind=True)
def cleanup_exports(self):
    try:
        files = os.listdir('static/files')
        for file in files:
            os.remove(f'static/files/{file}')
    except:
        pass