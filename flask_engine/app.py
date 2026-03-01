# app.py (Flask Backend)
print("DEBUG: app.py is being loaded...", flush=True)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import uuid
from main import accident

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
STATIC_FOLDER = "static"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return "Siren Flask Backend is ALIVE! 🚀"

@app.before_request
def log_request_info():
    print(f"DEBUG: Received {request.method} request for {request.path}", flush=True)
    print(f"DEBUG: Headers: {dict(request.headers)}", flush=True)

@app.route('/upload', methods=['POST'])
def upload():
    print("DEBUG: /upload request received!", flush=True)
    coordinates_json = request.form.get('coordinates')
    import json
    coordinates = json.loads(coordinates_json) if coordinates_json else None
    
    video = request.files['video']
    location = request.form.get('location')
    filename = f"{uuid.uuid4()}.mp4"
    video_path = os.path.join(UPLOAD_FOLDER, filename)
    video.save(video_path)

    try:
        report, summary, image_paths = accident(video_path, location, coordinates)
        image_urls = [f"/static/{img.split('static/')[-1]}" for img in image_paths]

        return jsonify({
            "report": report,
            "summary": summary,
            "images": image_urls
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"DEBUG: Flask server is starting on 0.0.0.0:{port}...", flush=True)
    app.run(host='0.0.0.0', port=port, debug=True)
