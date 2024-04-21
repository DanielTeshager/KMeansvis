# import the relevant libraries
from flask import Flask, jsonify, render_template, request
import numpy as np
from flask_cors import CORS
import pandas as pd
from sklearn.datasets import make_blobs

# initialize the app object
app = Flask(__name__)
# allow requests from all origins
CORS(app, cors_allowed_origins='*')

# handle root endpoint request


@app.route('/')
def index():
    return render_template('index.html')

# handle /kmeans endpoint POST request


@app.route('/kmeans', methods=['POST'])
def kmeans():
    # try to get the value for key 'generate_random' from the request object if it doesn't exist set it to false and compare whether it's true
    generate_random = request.form.get('generate_random', 'false') == 'true'
    # get the number of centroids
    num_clusters = int(request.form['num_centroids'])
    # set the maximum iteration to 100
    max_iters = 100

    if generate_random:
        data, _ = make_blobs(
            n_samples=200, centers=num_clusters, n_features=2, random_state=0)
        labels = np.arange(data.shape[0]).tolist()  # Convert labels to list
    else:
        data_file = request.files['data_file']

        # Read the data file
        if data_file.filename.endswith('.csv'):
            data = pd.read_csv(data_file, header=0, index_col=0)
        elif data_file.filename.endswith('.xlsx') or data_file.filename.endswith('.xls'):
            data = pd.read_excel(data_file, header=0, index_col=0)
        else:
            return jsonify({"error": "Unsupported file format. Please upload a CSV or Excel file."}), 400

        # Extract labels from the first column
        labels = data.iloc[:, 0].tolist()

        # Convert remaining data to numpy array
        data = np.array(data.iloc[:, 1:], dtype=float)
    # randomly choose centroids based on the number of clusters and rows
    centroids = data[np.random.choice(
        data.shape[0], num_clusters, replace=False), :]
    # initialize iterations list that will contain iteration_data dicts
    iterations = []

    for i in range(max_iters):
        # calculate distances from each observation
        distances = np.linalg.norm(data[:, None] - centroids, axis=2)
        # assign observations to clusters based on minimum distance
        assignments = np.argmin(distances, axis=1)
        # create an object(dict) that captures each data points, labels, centroids and assignments
        iteration_data = {
            'points': data.tolist(),  # Convert points to list
            'labels': labels,
            'centroids': centroids.tolist(),  # Convert centroids to list
            'assignments': assignments.tolist(),  # Convert assignments to list
            'distances': distances.tolist()
        }
        iterations.append(iteration_data)
        # calculate the new centroids based on the mean values of each cluster members
        new_centroids = np.array(
            [data[assignments == j].mean(axis=0) for j in range(num_clusters)])
        # a condition that checks the similarity between the new centroids and the previous centroids
        # if there's no significant difference, then the iteration stops
        if np.allclose(centroids, new_centroids):
            break

        centroids = new_centroids

    return jsonify(iterations)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
