import torch
import numpy as np 
import pandas as pd 
import torch.optim as optim

import torch.nn as nn
import torch.nn.functional as F

class LinkClassifier(nn.Module):
    def __init__(self,in_features, dropout = 0.2):
        super(LinkClassifier, self).__init__()
        self.input = nn.Linear(in_features, 32)
        self.hidden1 = nn.Linear(32, 16)
        self.hidden2 = nn.Linear(16,8)
        self.output = nn.Linear(8, 2)
        self.dropout = nn.Dropout(dropout)
        self.relu = nn.ReLU()
    def forward(self, x):
        x = self.input(x)
        x = self.relu(x)
        
        x = self.hidden1(x)
        x = self.relu(x)

        x = self.hidden2(x)
        x = self.relu(x)

        x = self.dropout(x)
        x = self.output(x)
        x = F.log_softmax(x)
        
        return x
    

        
        