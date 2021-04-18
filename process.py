from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
# from sklearn.manifold import MDS

import numpy as np
import pandas as pd
def getData():
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

    #covert strings with % to a float number
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
    new_df =  [new_df.columns.values.tolist()] + new_df.values.tolist()
    return new_df;

