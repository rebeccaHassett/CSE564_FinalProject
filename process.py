from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
# from sklearn.manifold import MDS

import numpy as np
import pandas as pd

#drop the categorical variables
df = pd.read_csv("data/scores.csv")
# DROP 10 Attributes
new_df = df.copy()
new_df.drop('School ID', axis=1, inplace=True)
new_df.drop('School Name', axis=1, inplace=True)
new_df.drop('Building Code', axis=1, inplace=True)
new_df.drop('Street Address', axis=1, inplace=True)
new_df.drop('City', axis=1, inplace=True)
new_df.drop('State', axis=1, inplace=True)
new_df.drop('Latitude', axis=1, inplace=True)
new_df.drop('Longitude', axis=1, inplace=True)
new_df.drop('Phone Number', axis=1, inplace=True)
new_df.drop('Zip Code', axis=1, inplace=True)

#convert strings with % to a float number
new_df["Percent White"] = new_df["Percent White"].str.replace('%','').astype(float)
new_df["Percent Black"] = new_df["Percent Black"].str.replace('%','').astype(float) 
new_df["Percent Hispanic"] = new_df["Percent Hispanic"].str.replace('%','').astype(float) 
new_df["Percent Asian"] = new_df["Percent Asian"].str.replace('%','').astype(float) 
new_df["Percent Tested"] = new_df["Percent Tested"].str.replace('%','').astype(float) 

# fill the missing values using the attribute mean and drop 4 data items with no start/end time
new_df["Percent White"].fillna(round(new_df["Percent White"].mean(),2), inplace=True)
new_df["Percent Black"].fillna(round(new_df["Percent Black"].mean(),2), inplace=True)
new_df["Percent Hispanic"].fillna(round(new_df["Percent Hispanic"].mean(),2), inplace=True)
new_df["Percent Asian"].fillna(round(new_df["Percent Asian"].mean(),2), inplace=True)
new_df["Percent Tested"].fillna(round(new_df["Percent Tested"].mean(),2), inplace=True)

new_df["Student Enrollment"].fillna(round(new_df["Student Enrollment"].mean()), inplace=True)
new_df["Average Score (SAT Math)"].fillna(round(new_df["Average Score (SAT Math)"].mean()), inplace=True)
new_df["Average Score (SAT Reading)"].fillna(round(new_df["Average Score (SAT Reading)"].mean()), inplace=True)
new_df["Average Score (SAT Writing)"].fillna(round(new_df["Average Score (SAT Writing)"].mean()), inplace=True)

new_df.dropna(inplace=True)


def getData():
    dict_df = new_df.to_dict()
    result =  [new_df.columns.values.tolist()] + new_df.values.tolist()
    return result,dict_df;

def getBarPlotData():
    manhattan_sat = new_df[new_df["Borough"] == "Manhattan"]
    queens_sat = new_df[new_df["Borough"] == "Queens"]
    bronx_sat = new_df[new_df["Borough"] == "Bronx"]
    brooklyn_sat = new_df[new_df["Borough"] == "Brooklyn"]
    staten_island_sat = new_df[new_df["Borough"] == "Staten Island"]

    barplot_data = []
    barplot_data.append({"borough":"manhattan",
                    "SAT Math":round(manhattan_sat['Average Score (SAT Math)'].mean()),
                    "SAT Reading":round(manhattan_sat['Average Score (SAT Reading)'].mean()),
                    "SAT Writing":round(manhattan_sat['Average Score (SAT Writing)'].mean())})
    barplot_data.append({"borough":"queens",
                    "SAT Math":round(queens_sat['Average Score (SAT Math)'].mean()),
                    "SAT Reading":round(queens_sat['Average Score (SAT Reading)'].mean()),
                    "SAT Writing":round(queens_sat['Average Score (SAT Writing)'].mean())})
    barplot_data.append({"borough":"bronx",
                    "SAT Math":round(bronx_sat['Average Score (SAT Math)'].mean()),
                    "SAT Reading":round(bronx_sat['Average Score (SAT Reading)'].mean()),
                    "SAT Writing":round(bronx_sat['Average Score (SAT Writing)'].mean())})
    barplot_data.append({"borough":"brooklyn",
                    "SAT Math":round(brooklyn_sat['Average Score (SAT Math)'].mean()),
                    "SAT Reading":round(brooklyn_sat['Average Score (SAT Reading)'].mean()),
                    "SAT Writing":round(brooklyn_sat['Average Score (SAT Writing)'].mean())})
    barplot_data.append({"borough":"staten_island",
                    "SAT Math":round(staten_island_sat['Average Score (SAT Math)'].mean()),
                    "SAT Reading":round(staten_island_sat['Average Score (SAT Reading)'].mean()),
                    "SAT Writing":round(staten_island_sat['Average Score (SAT Writing)'].mean())})
    barplot_df = pd.DataFrame(barplot_data, columns = ["borough","SAT Math","SAT Reading","SAT Writing"])
    return barplot_data;

# def getHistogramData():
def getPCAData():
    numerical_df = new_df.drop(columns=['Borough', 'Start Time',"End Time"]) # drop categorical data, only numerical data for PCA
    df_standard =  StandardScaler().fit_transform(numerical_df) 
    pca = PCA() 
    new_pc = pca.fit_transform(df_standard)  
    exp_var = pca.explained_variance_ratio_.tolist() #vars
    cum_exp_var = np.cumsum(exp_var).tolist() # cum vars
    attribute = numerical_df.columns.tolist()
    eigenvector = pca.components_.tolist()
    pca_data = np.transpose(new_pc).tolist()

    return exp_var,cum_exp_var,attribute,eigenvector,pca_data

def KMeansClustering():
    copy_df = new_df.copy(deep=True)
    km = KMeans(n_clusters=6)
    km.fit(np.array(copy_df))
    copy_df['Class'] = km.labels_
    cluster_data = np.array(copy_df.iloc[:, -1:])
    return cluster_data

def getParallelCoordsData(cluster_data):
    cols = new_df.columns.values

    parallel_coords = []
    for index, row in new_df.iterrows():
        parallel_coord = {}
        for col in cols:
            parallel_coord[col] = row[col]
        parallel_coord["color"] = cluster_data[index][0]
        parallel_coords.append(parallel_coord)
    return parallel_coords
