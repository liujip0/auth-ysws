import os
import json
import random
from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'PLEASE-CHANGE-THIS-IN-PROD'
DATA_FILE = 'data.json'

def load_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({'users': {}}, f)
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def generate_puzzle(secret_key):
    puzzle_types = [
        lambda k: (f"x × {k * 2} = ?", k * 2 * k),
        lambda k: (f"x × {k + 3} = ?", k * (k + 3)),
        lambda k: (f"x × {k - 1} = ?", k * (k - 1)) if k > 1 else (f"x × 2 = ?", k * 2),
        lambda k: (f"x + {k + 5} = ?", k + (k + 5)),
        lambda k: (f"x + {k * 2} = ?", k + (k * 2)),
        lambda k: (f"x - {k - 1} = ?", k - (k - 1)) if k > 1 else (f"x + 1 = ?", k + 1),
        lambda k: (f"(x × 2) + {k} = ?", k * 2 + k),
        lambda k: (f"(x × 3) + {k + 1} = ?", k * 3 + k + 1),
        lambda k: (f"(x + {k}) × 2 = ?", (k + k) * 2),
        lambda k: (f"(x + 1) × {k} = ?", (k + 1) * k),
        lambda k: (f"x² + {k} = ?", k * k + k),
        lambda k: (f"x² + {k + 2} = ?", k * k + k + 2),
    ]
    
    puzzle_func = random.choice(puzzle_types)
    return puzzle_func(secret_key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    data = load_data()
    if request.method == 'POST':
        username = request.form['username']
        try:
            secret_key = int(request.form['secret_key'])
        except ValueError:
            return render_template('signup.html', error='Secret key must be a number.')
        if username in data['users']:
            return render_template('signup.html', error='Username already exists.')
        data['users'][username] = {
            'secret_key': secret_key,
            'habits': {},
            'streak': 0
        }
        save_data(data)
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    data = load_data()
    if request.method == 'POST':
        username = request.form.get('username')
        if username and username not in data['users']:
            return render_template('login.html', error='User not found.')
        
        if username and 'answer' not in request.form:
            secret_key = data['users'][username]['secret_key']
            puzzle_text, correct_answer = generate_puzzle(secret_key)
            session['temp_answer'] = correct_answer
            return render_template('login.html', username=username, puzzle=puzzle_text)
        
        if 'answer' in request.form:
            username = request.form.get('username')
            try:
                answer = int(request.form['answer'])
            except ValueError:
                secret_key = data['users'][username]['secret_key']
                puzzle_text, correct_answer = generate_puzzle(secret_key)
                session['temp_answer'] = correct_answer
                return render_template('login.html', username=username, puzzle=puzzle_text, error='Answer must be a number.')
            
            correct_answer = session.get('temp_answer')
            if answer == correct_answer:
                session.pop('temp_answer', None)
                session['username'] = username
                return redirect(url_for('dashboard'))
            else:
                secret_key = data['users'][username]['secret_key']
                puzzle_text, correct_answer = generate_puzzle(secret_key)
                session['temp_answer'] = correct_answer
                return render_template('login.html', username=username, puzzle=puzzle_text, error='Incorrect answer. Try again.')
    
    return render_template('login.html')

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    data = load_data()
    username = session['username']
    user = data['users'][username]
    if request.method == 'POST':
        if 'add_habit' in request.form:
            habit = request.form['habit']
            if habit and habit not in user['habits']:
                user['habits'][habit] = {'done_today': False}
        elif 'done_habit' in request.form:
            habit = request.form['done_habit']
            if habit in user['habits'] and not user['habits'][habit]['done_today']:
                user['habits'][habit]['done_today'] = True
                user['streak'] += 1
        save_data(data)
    return render_template('dashboard.html', habits=user['habits'], streak=user['streak'])

@app.route('/leaderboard')
def leaderboard():
    data = load_data()
    users = [
        {'username': u, 'streak': info['streak']}
        for u, info in data['users'].items()
    ]
    users.sort(key=lambda x: x['streak'], reverse=True)
    return render_template('leaderboard.html', users=users)

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('temp_answer', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) 