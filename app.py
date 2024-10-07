from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

journal_entries = []
next_id = 1
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/journal', methods = ['POST'])
def create_entry():
    global next_id 
    data = request.get_json()
    new_entry = {
        'id': next_id, 
        'date': data['date'],
        'content': data['content']
    }
    journal_entries.append(new_entry)
    next_id +=1
    return jsonify(new_entry), 201


@app.route('/journal', methods = ['GET'])
def get_entries():
    return jsonify(journal_entries)

@app.route('/journal/<int:entry_id>', methods = ['PUT'])
def update_entry(entry_id):
    data = request.get_json()
    for entry in journal_entries:
        if entry['id'] == entry_id:
            entry['date'] = data.get('date', entry['date'])
            entry['content'] = data.get('content', entry['content'])
            return jsonify(entry)
        return jsonify({'error': 'Entry not found'}), 404
    
@app.route('/journal/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    global journal_entries
    journal_entries = [entry for entry in journal_entries if entry['id'] != entry_id]
    return jsonify({'message': 'Entry Deleted'}), 200

if __name__ == "__main__":
    app.run(debug = True, port=5500)