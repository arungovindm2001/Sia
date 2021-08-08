import numpy as np 
import pandas as pd 
import torch.optim as optim
from detoxify import Detoxify
import torch.nn as nn
import torch.nn.functional as F
from preprocessing_functions import *
from LinkClassifier import *

class Predictor():
    def __init__(self):
        self.model = LinkClassifier(in_features=15, dropout=0.3)
        self.model.load_state_dict(torch.load('malicious.pt'))
        self.model.eval()

    def predict(self, url):
        p_url, flag = preprocessing_pipeline(url)

        if(flag == 0):
            return "There was an error"
        try:
            output = self.model(p_url)
            pred = output.argmax(dim = 0, keepdim=True)
        except:
            return "error"
        if(pred == 0):
            return "Non Malicious"
        else:
            return "Malicious"

    def predictToxicComment(self, text):

        results = Detoxify('original').predict(text)
        return results

