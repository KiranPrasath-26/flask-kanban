from main import Cards, Lists, Users, db

# user = Users(username = 'kiran', email='kiran@gmail.com')
# db.session.add(user)
# db.session.commit()

list = Lists(list_name='iitmod', user_id=1, list_date='12-11-22', score=10)
db.session.add(list)
db.session.commit()

card = Cards(title='mad 2 project', content='kanban app', list_id=1, completed_on="13-12-22", deadline="14-12-22", created_time="12-11-22")
db.session.add(card)
db.session.commit()


# card = Cards.query.filter_by(list = 'iitmod').first()
# db.session.delete(card)
# db.session.commit()

# list = Lists.query.filter_by(user = 'kiran', id = 1).first()
# db.session.delete(list)
# db.session.commit()