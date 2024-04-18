# K-means Clustering Visualization Tool

## Overview

This interactive tool visualizes the K-means clustering algorithm, a popular unsupervised machine learning technique. It allows users to see how data points are iteratively assigned to clusters and how centroids (the center points of clusters) shift during the process. The visualization aims to provide intuitive insights into the clustering behavior of the K-means algorithm.

## Installation

### Prerequisites

- Python 3.6 or higher
- pip (Python package installer)

### Setup Instructions

1. **Clone the Repository**:
   To get started, clone this repository to your local machine using the following command:

`git clone [your-repository-url]`
`cd [repository-directory]`

2. **Install Dependencies**:
   Install the necessary Python packages specified in `requirements.txt`:
   `pip install -r requirements.txt`
3. **Run the Application**:
   Launch the application by running:
   `python app.py`
   This will start the Flask server, and the application should be accessible via a web browser at `http://localhost:5001` or another port as specified in your `app.py`.

## Usage

### Starting the Visualization

- **Open the Frontend**:
- Navigate to the directory where `index.html` is located and open it in a web browser. This file is not served by the Flask application and must be opened directly from the file system to interact with the backend.

- The interface will present options to upload data, generate random data, and set the number of clusters.

### Loading Data

- **Upload Data File (CSV)**: Click on "Upload Data File" and select a CSV file from your computer.
- **Generate Random Data**: Check the "Generate Random Data" box if you prefer to use synthetic data points generated by the server.

### Configuring Clustering

- **Set the Number of Clusters**: Enter the desired number of clusters in the "Number of Clusters (Centroids)" input field.

### Visualizing Clusters

- Click the "Start Clustering" button to begin the visualization.
- Watch as the algorithm iteratively assigns data points to centroids and updates centroids based on the mean of the points in each cluster.
- Use the "Toggle Table" button to view or hide detailed data about the clustering steps and centroids.

### Interpretation

- Each iteration is visualized on the canvas, showing data points and their respective centroids.
- Detailed tables below the visualization provide insight into the centroid positions and assignments of points to clusters.

## Features

- Dynamic data loading (CSV upload or random generation).
- Real-time visualization of the K-means clustering process.
- Adjustable number of clusters for flexibility in analysis.

## Support

For any technical issues or questions, please contact support me at:

- Email: [dwolela@gmail.com]

I appreciate your feedback and contributions to this project!