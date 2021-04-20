from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from flask import Flask,render_template,make_response
from process import getData,getBarPlotData,getPCAData

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/api")
def get_data():
    data_set,dict_df = getData()
    bar_plot_data = getBarPlotData()
    exp_var,cum_exp_var,attribute,eigenvector,pca_data = getPCAData()
    data = {
        "data_set":data_set,
        "dict_df":dict_df,
        "bar_plot_data":bar_plot_data,
        "exp_var":exp_var,
        "cum_exp_var":cum_exp_var,
        "attribute":attribute,
        "eigenvector":eigenvector,
        "pca_data":pca_data
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)

