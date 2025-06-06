from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
from datetime import datetime
import os
import base64

app = Flask(__name__)
CORS(app)

# Initialize data storage and upload directories
DATA_FILE = 'posts.json'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_posts():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_posts(posts):
    with open(DATA_FILE, 'w') as f:
        json.dump(posts, f, indent=2)

# Initialize posts if file doesn't exist
if not os.path.exists(DATA_FILE):
    initial_posts = []
    save_posts(initial_posts)

@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = load_posts()
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    posts = load_posts()
    new_post = request.json
    new_post['id'] = len(posts)
    new_post['created_at'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_post['likes'] = 0
    new_post['comments'] = []
    
    # Handle image data if present
    if 'image' in new_post and new_post['image']:
        try:
            # Extract the base64 data after the comma
            image_data = new_post['image'].split(',')[1]
            image_binary = base64.b64decode(image_data)
            
            # Generate unique filename
            filename = f"post_{new_post['id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            
            # Save the image
            with open(filepath, 'wb') as f:
                f.write(image_binary)
            
            # Store the image path in the post
            new_post['image'] = f"/api/uploads/{filename}"
        except Exception as e:
            print(f"Error saving image: {e}")
            new_post['image'] = None
    
    posts.append(new_post)
    save_posts(posts)
    return jsonify(new_post), 201

@app.route('/api/uploads/<filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    posts = load_posts()
    if 0 <= post_id < len(posts):
        update_data = request.json
        
        # Handle image update if present
        if 'image' in update_data and update_data['image'] and update_data['image'].startswith('data:'):
            try:
                # Extract the base64 data after the comma
                image_data = update_data['image'].split(',')[1]
                image_binary = base64.b64decode(image_data)
                
                # Generate unique filename
                filename = f"post_{post_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                
                # Save the image
                with open(filepath, 'wb') as f:
                    f.write(image_binary)
                
                # Update the image path
                update_data['image'] = f"/api/uploads/{filename}"
            except Exception as e:
                print(f"Error updating image: {e}")
                update_data['image'] = posts[post_id].get('image')
        
        posts[post_id].update(update_data)
        save_posts(posts)
        return jsonify(posts[post_id])
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    posts = load_posts()
    if 0 <= post_id < len(posts):
        deleted_post = posts.pop(post_id)
        # Update remaining post IDs
        for i, post in enumerate(posts):
            post['id'] = i
        save_posts(posts)
        return jsonify(deleted_post)
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
def toggle_like(post_id):
    posts = load_posts()
    if 0 <= post_id < len(posts):
        current_likes = posts[post_id].get('likes', 0)
        action = request.json.get('action')
        if action == 'like':
            posts[post_id]['likes'] = current_likes + 1
        elif action == 'unlike':
            posts[post_id]['likes'] = max(0, current_likes - 1)
        save_posts(posts)
        return jsonify(posts[post_id])
    return jsonify({"error": "Post not found"}), 404

@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    posts = load_posts()
    if 0 <= post_id < len(posts):
        comment = request.json
        comment['id'] = len(posts[post_id].get('comments', []))
        comment['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if 'comments' not in posts[post_id]:
            posts[post_id]['comments'] = []
        posts[post_id]['comments'].append(comment)
        save_posts(posts)
        return jsonify(comment), 201
    return jsonify({"error": "Post not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001) 