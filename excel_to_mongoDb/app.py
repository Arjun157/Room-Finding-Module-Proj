from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['WtMiniDB']
    collection = db['students']

    if 'file' not in request.files:
        return redirect(url_for('index'))

    file = request.files['file']

    if file.filename == '':
        return redirect(url_for('index'))

    if file:
        # Read Excel file into a DataFrame
        excel_data = pd.read_excel(file)

        # Convert DataFrame to a list of dictionaries
        data_dict = excel_data.to_dict(orient='records')

        # Insert data into MongoDB
        collection.insert_many(data_dict)

        # Close MongoDB connection
        client.close()

        return 'Data uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True)
