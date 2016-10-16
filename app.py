from flask import Flask
from flask import render_template,request,flash,url_for,redirect,session,jsonify

import os
from flask_cors import CORS, cross_origin
import json
from pprint import pprint
import random
import nltk
# import speech_to_text
# import text_to_speech
import requests
from nltk.stem import SnowballStemmer
from nltk.corpus import stopwords
snowball_stemmer = SnowballStemmer("english")

app = Flask(__name__)
CORS(app)

final_data = []
data_to_process=[]
api_keys = ['d687a4bbd8b4a787b2f8c841db313763','806706827f427b6a77ff242b936ae973','9667ebccf1c18f24c76263a34352ca07','ef933fa89506062e98ba214165fdad5f','aba132076d484dcf8d0a69a299561c8e']

app.secret_key = "secret"
@app.route('/',methods=['GET','POST'])
def home():
    if request.method == 'POST':
        # data = json.loads(request.data)
        data = request.json
        # print data
        global data_to_process
        data_to_process = data['response']
        noun(data_to_process)
        print final_data,"final"
        return jsonify({"data":final_data})

@app.route('/index')
def index():
    return render_template('index.html')


def read_json(words):
    with open('data.json') as data_file:
        data = json.load(data_file)
        # pprint(data)

        keys = data.keys()
        print keys
        if len(words) == 0:
            print "Empty"

        global final_data
        result = []
        for j in words:
            val = random.randint(0, 4)
            print api_keys[val]
            new_url = "http://words.bighugelabs.com/api/2/" + \
                str(api_keys[val]) + "/" + j[0] + "/json"
            try:

                c = requests.get(new_url)
                print c.status_code

                if c.status_code == 200:

                    r = c.json()
                    # print result
                    # print result['noun']['syn']

                    try:
                        result = r['noun']['syn']
                        # print result+"-----------"
                        result = result + j
                        print result
                    except:
                        result = j[0]
                        print list(result)
                else:
                    print "wrong status"
            except:
                result = j

            for k in result:
                # print k,"k"
                for i in keys:
                    # print i,"i"
                    if k.lower() in i.lower():
                        # print i
                        # print k
                        final_data.append(data[i])
            print final_data
        if len(final_data) == 0:
            final_data = ["sry didn't understand "]


def noun(answer):
    # if "everything" in answer.lower():
    #     pass
    stop_words = set(stopwords.words('english'))
    text = nltk.word_tokenize(answer)

    filtered_sentence = [w for w in text if not w in stop_words]
    print filtered_sentence
    # stemmed = snowball_stemmer.stem(answer)
    # print stemmed

    tags = nltk.pos_tag(filtered_sentence)

    words = [[word] for word, tag in tags if tag in ('NN', 'NNP','NNS')]
    print words
    read_json(words)

# if len(words)==1:
#     text_to_speech.get_speech("Are you looking for"+ words[0])
#     answer = speech_to_text.stt()
#     print answer
#     if "yes" in answer.lower() or "ye" in answer.lower():
#         pass
# elif(len(words)>1):
#     a = ""
#     a = " or ".join(words)
#     print a
#
#     text_to_speech.get_speech("What are you looking for"+ a)
#     answer = speech_to_text.stt()
#     if answer in words:
#         pass


if __name__ == '__main__':
    # noun("show something for hair falling")
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
    # app.run(debug=True)
    # read_json()
    # nltk.help.upenn_tagset('NN')
    # nltk.help.upenn_tagset('NNP')
    # nltk.help.upenn_tagset('NNS')

    # noun("Hey allo so what do you have for my falling hair.")
    # noun("Hey allo my skin  is hair getting dry")
    # noun("Which soap are good to use")
    # noun("Hey allo How to keep my teeth shiny")
    # noun("i have skin sweating problems")
    # noun("ok so ariel i am having some Facial problems")
