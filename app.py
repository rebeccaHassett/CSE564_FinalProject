from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from flask import Flask,render_template,make_response
from process import getData  

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/api")
def get_data():
    test_data = getData()
    data = {
        "test_integer":test_data
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)
