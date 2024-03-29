from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from puzzle8 import Solver, Direction, Puzzle

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
	return render_template('index.html')

@socketio.on('solve')
def solve(data):
	MAX_GENERATION = data['MAX_GENERATION']
	POPULATION_SIZE = data['POPULATION_SIZE']
	board = data['board']
	solver = Solver(MAX_GENERATION, POPULATION_SIZE, board)
	iterations = solver.solution()
	for iteration in iterations:
		emit('solver', iteration + '<br />')
	try:
		return solver.getStrOfChromosome(solver.bestSelection[0])
	except TypeError:
		return None

@socketio.on('letmetry')
def letmetry(data):
	puzzle = Puzzle(data['board'])
	try:
		direction = Direction[data['direction']]
		puzzle.move(direction)
		return str(puzzle.fitness())
	except IndexError:
		return False

if __name__ == '__main__':
	socketio.run(app, debug=True)