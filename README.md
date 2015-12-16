# Vibes
Twitter sentiment analytics using IBM's Watson API.

- api folder - rails app
- app folder - react app


To use api you need to
- get bluemix api key for insights in twitter and place it in .env in /api
in following format to be subsituted by your particulars:
  username='...'
  password='...'

- bundle install
- rake db:setup/migrate
- execute database_dump as follows:
pg_restore --dbname=api_development --no-owner --create data.dump

more info: http://dba.stackexchange.com/questions/86386/how-do-i-use-pg-dump-and-pg-restore-to-move-a-large-database-to-another-machine

- Download latest postgresql
then run following in a tab: postgres -D /usr/local/var/postgres
- brew install redis
then redis-server /usr/local/etc/redis.conf in a separate tab
then rake resque:work QUEUE='*' in a separate tab

There are in total three routes that can be leveraged in following format:
/immediate/search?q=donald%20trump&stats=by_minutes:10&hours=3
  -Relays immediately to watson without checking the database
  -aggregates in intervals of 10 minutes

/cached/search?q=donald%20trump&stats=by_hours:1&hours=3
  -Check the database only for the query
  -Aggregates in this case in intervals of 1 hour

/gradual/search?q=donald%20trump&hours=50
  -Check the database to see what is missing
  -Whatever is missing, launch background job to mine the data from watson

  -This is not fully functional as yet.
  -Is supposed to provide meta data for amount of results
  -The actual results are directly cached to the database and to be obtained
   from the route: /cached/search where you repeat the original search
  -stats param has no meaning here but is not going to invalidate the query


