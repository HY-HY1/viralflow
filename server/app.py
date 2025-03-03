from flask import Flask
from api.downloader import downloader_routes
from api.transcriber import transcriber_routes
from api.stats import stats_routes
from flask_cors import CORS  # Import the CORS class

# Initialize the Flask app
app = Flask(__name__)
CORS(app)


# Register the downloader blueprint with the app
app.register_blueprint(downloader_routes, url_prefix='/api/download')
app.register_blueprint(transcriber_routes, url_prefix='/api')
app.register_blueprint(stats_routes, url_prefix='/api')

# Run the Flask app
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
