from flask import Flask, send_from_directory
import os

from api import auth_api, user_api, system_api

app = Flask(__name__, static_folder="build/static", template_folder="build")
app.secret_key = "9999"
port = 7720

app.register_blueprint(auth_api, url_prefix="/auth")
app.register_blueprint(user_api, url_prefix="/user")
app.register_blueprint(system_api, url_prefix="/system")

@app.route("/")
def index():
    return send_from_directory(app.template_folder, "index.html")

@app.route("/<path:path>")
def serve(path):
    if os.path.exists(os.path.join(app.template_folder, path)):
        return send_from_directory(app.template_folder, path)
    return send_from_directory(app.template_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)