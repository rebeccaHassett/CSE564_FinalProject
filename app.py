from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd
from flask import Flask,render_template,make_response
from process import getData,getBarPlotData,getPCAData, getParallelCoordsData, getColumnNames, KMeansClustering

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route("/api")
def get_data():
    data_set,dict_df = getData()
    bar_plot_data = getBarPlotData()
    exp_var,cum_exp_var,attribute,eigenvector,pca_data = getPCAData()
    #cluster_data = KMeansClustering()
    parallel_coords_data = getParallelCoordsData()#cluster_data)
    column_names = getColumnNames()
    data = {
        "data_set":data_set,
        "dict_df":dict_df,
        "bar_plot_data":bar_plot_data,
        "exp_var":exp_var,
        "cum_exp_var":cum_exp_var,
        "attribute":attribute,
        "eigenvector":eigenvector,
        "pca_data":pca_data,
        "parallel_coords_data":parallel_coords_data,
        "column_names":column_names
    }
    return data

if __name__ == "__main__":
    app.run(debug=True)

