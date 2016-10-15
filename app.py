from flask import Flask
from flask import render_template,request,flash,url_for,redirect,session
import os

app = Flask(__name__)
app.secret_key = "secret"
@app.route('/')
def index():
	return "hi"


if __name__ == '__main__' :
	# port = int(os.environ.get('PORT', 5000))
	# app.run(host='0.0.0.0',port=port)
	app.run(debug=True)
