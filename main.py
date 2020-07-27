from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from tictactoe import main_driver
import os


# Flask app setup.
app = Flask(__name__, static_folder='build', template_folder='build')

# Cors setup.
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'



# Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")



@app.route('/api/move', methods=['POST'])
@cross_origin()
def send_move():
    data = request.get_json()
    board = data['board']
    streak = data['streak']
    depth = data['depth']

    assert streak is not None

    r, c, conclusion = main_driver(
        board=board,
        depth=int(depth) if depth is not None else None,
        streak=int(streak) if streak is not None else len(
        board)
    ).split(' ')
    return jsonify({'result': conclusion, 'col': int(c), 'row': int(r)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
