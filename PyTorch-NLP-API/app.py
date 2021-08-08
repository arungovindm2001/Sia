from flask import Flask, render_template, send_file, make_response, url_for, Response,request,redirect
from flask_restful import reqparse, abort, Api, Resource
import pickle
import numpy as np
import werkzeug
from Predictor import *
app = Flask(__name__)
api = Api(app)

predictor = Predictor()
parser = reqparse.RequestParser()
parser.add_argument('url')
parser.add_argument('text')

class PredictLink(Resource):
    def get(self):
        args = parser.parse_args()
        user_query = args['url']
        return {"url_type":predictor.predict(user_query)}
class PredictToxicness(Resource):
    def get(self):
        args = parser.parse_args()
        user_query = args['text']

        result = predictor.predictToxicComment(user_query)


        return {
            "toxicity" : str(result['toxicity']),
            "severe_toxicity": str(result['severe_toxicity']),
            "obscene" : str(result['obscene']),
            "threat" : str(result['threat']),
            "insult" : str(result["insult"]),
            "identity_hate" : str(result['identity_hate'])
        }
        
api.add_resource(PredictLink, '/predict')
api.add_resource(PredictToxicness, '/predict/toxic')
if __name__ == '__main__':
    app.run(debug=True)
