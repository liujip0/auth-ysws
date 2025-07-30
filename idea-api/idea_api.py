from flask import Flask, jsonify
import random, json, os

app = Flask(__name__)

IDEAS_FILE = "ideas.json"

def load_ideas():
    if os.path.exists(IDEAS_FILE):
        with open(IDEAS_FILE, "r") as f:
            return json.load(f)
    else:
        return []

def save_ideas(ideas):
    with open(IDEAS_FILE, "w") as f:
        json.dump(ideas, f, indent=4)

ideas = load_ideas()

@app.route('/random', methods=['GET'])
def get_random_idea():
    if not ideas:
        return jsonify({"message": "No more ideas left!"}), 404
    idea = random.choice(ideas)
    return jsonify(idea)

@app.route('/delete/<int:idea_id>', methods=['DELETE'])
def delete_idea(idea_id):
    global ideas
    idea = next((i for i in ideas if i["id"] == idea_id), None)
    if idea is None:
        return jsonify({"message": "Idea not found"}), 404
    
    ideas = [i for i in ideas if i["id"] != idea_id]
    save_ideas(ideas)
    return jsonify({"message": "Idea deleted", "deletedIdea": idea})

if __name__ == '__main__':
    app.run(debug=True)
