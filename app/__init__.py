from flask import Flask
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app=app, resources={r"*": {"origins": "*"}})
    from app import routes

    routes.setup_routes(app)
    return app
