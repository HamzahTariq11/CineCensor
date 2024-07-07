from functools import wraps
from flask import request, jsonify, redirect, url_for
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        secret_key = 'thisisecretkey'
        from . import create_app  # Importing create_app function
        app = create_app()  # Creating app instance
        
        try:
            if "token" in request.headers or "token" in request.args:
                token = request.headers.get("token") or request.args.get("token")
                data = jwt.decode(token, secret_key, algorithms=["HS256"])
                user = data.get("user")
                if user is None:
                    return jsonify({"message": "Invalid token: user not found"}), 401

                kwargs["user"] = user
            else:
                return redirect(url_for("login"), code=307)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        return f(*args, **kwargs)

    return decorated
