from flask import Flask, jsonify, render_template, request
import numpy as np
from flask_cors import CORS
import pandas as pd
from sklearn.datasets import make_blobs

app = Flask(__name__)
CORS(app, cors_allowed_origins='*')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/kmeans', methods=['POST'])
def kmeans():
    generate_random = request.form.get('generate_random', 'false') == 'true'
    num_clusters = int(request.form['num_centroids'])
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

    centroids = data[np.random.choice(
        data.shape[0], num_clusters, replace=False), :]
    iterations = []

    for i in range(max_iters):
        distances = np.linalg.norm(data[:, None] - centroids, axis=2)
        assignments = np.argmin(distances, axis=1)

        iteration_data = {
            'points': data.tolist(),  # Convert points to list
            'labels': labels,
            'centroids': centroids.tolist(),  # Convert centroids to list
            'assignments': assignments.tolist()  # Convert assignments to list
        }
        iterations.append(iteration_data)

        new_centroids = np.array(
            [data[assignments == j].mean(axis=0) for j in range(num_clusters)])

        if np.allclose(centroids, new_centroids):
            break

        centroids = new_centroids

    return jsonify(iterations)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
