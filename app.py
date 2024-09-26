from flask import Flask, request, send_file, jsonify, render_template
import os
from pytube import YouTube

app = Flask(__name__)

# Ensure the downloads directory exists
if not os.path.exists('downloads'):
    os.makedirs('downloads')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    data = request.get_json()
    video_url = data.get('url')
    quality = data.get('quality')  # e.g., '720p', '1080p', etc.
    
    # Validate input
    if not video_url or not quality:
        return jsonify({"error": "Please provide both video URL and quality."}), 400

    try:
        # Create YouTube object
        yt = YouTube(video_url)

        # Filter streams based on quality
        stream = yt.streams.filter(res=quality).first()
        
        if stream is None:
            return jsonify({"error": f"No available stream for quality: {quality}"}), 404

        # Download video
        video_file = stream.download(output_path='downloads')
        
        return send_file(video_file, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=False)
