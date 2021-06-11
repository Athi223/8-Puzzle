import numpy as np
from enum import Enum
from random import randint

goal = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 0]])

class Direction(Enum):
	up = 1
	right = 2
	down = 3
	left = 4

	def isEqual(self, direction):
		return self == direction

	def isOpposite(self, direction):
		return abs(self.value - direction.value) == 2

	def getOpposite(self):
		return Direction(self.value - 2) if self.value > 2 else Direction(self.value + 2)

	def getDifferent(self):
		enums = list(Direction)
		enums.remove(self)
		return enums[randint(0, 2)]

	def getDifferentAxis(self):
		enums = list(Direction)
		enums.remove(self)
		enums.remove(self.getOpposite())
		return enums[randint(0, 1)]


class Puzzle:

	def __init__(self, board):
		self.puzzle = np.reshape(board, (3,3))

	def move(self, direction):

		if not isinstance(direction, Direction):
			raise TypeError('direction must be an instance of Direction Enum')

		x, y = np.where(self.puzzle == 0)
		if direction == Direction.up:
			if x == 0:
				raise IndexError("the x coordinate cannot be a negative value")
			self.__swap([x, y], [x-1, y])
		elif direction == Direction.right:
			if y == 2:
				raise IndexError("the y coordinate exceeds the range of the puzzle.")
			self.__swap([x, y], [x, y+1])
		elif direction == Direction.down:
			if x == 2:
				raise IndexError("the x coordinate exceeds the range of the puzzle.")
			self.__swap([x, y], [x+1, y])
		elif direction == Direction.left:
			if y == 0:
				raise IndexError("the y coordinate cannot be a negative value")
			self.__swap([x, y], [x, y-1])

	def __swap(self, coordinate1, coordinate2):
		tmp = self.puzzle[coordinate1[0], coordinate1[1]]
		self.puzzle[coordinate1[0], coordinate1[1]] = self.puzzle[coordinate2[0], coordinate2[1]]
		self.puzzle[coordinate2[0], coordinate2[1]] = tmp

	def fitness(self):
		mdis = 0
		for i in range(3):
			for j in range(3):
				if (goal[i, j] == 0):
					continue
				x, y = np.where(self.puzzle == goal[i, j])
				mdis += abs(x[0]-i) + abs(y[0]-j)
		return mdis

	def __str__(self):
		return str(self.puzzle)

class Solver:
	def __init__(self, MAX_GENERATION, POPULATION_SIZE, board):
		self.board = board
		self.MAX_GENERATION = MAX_GENERATION
		self.POPULATION_SIZE = POPULATION_SIZE
		self.CHROMOSOME_LENGTH = 20
		self.NUMBER_OF_SELECTED_CHROMOSOME = 3
		self.INCREMENT_RANGE_FOR_CHROMOSOME_LENGTH = 50
		self.INCREMENT_SIZE_FOR_CHROMOSOME_LENGTH = 5
		self.bestSelection = None

	def createChromosome(self, length=20):
		enums = list(Direction)
		chromosome = [ enums[randint(0, 3)] for i in range(length) ]
		return chromosome


	def initializePopulation(self):
		population = [ self.createChromosome(self.CHROMOSOME_LENGTH) for i in range(self.POPULATION_SIZE) ]
		return population

	# <chromosome> (ie List <direction>) applies correction
	# - 3x3 puzzle also cannot be moved in the same direction 3 times
	# - Making opposite movements in the continuation is pointless / unnecessary 
	def mutation(self, chromosome):
		length = len(chromosome)

		if (length < 2):
			return chromosome

		if (length < self.CHROMOSOME_LENGTH):
			chromosome += self.createChromosome(self.CHROMOSOME_LENGTH-length)

		if (chromosome[0].isOpposite(chromosome[1])):
			chromosome[1] = chromosome[1].getDifferent()

		for i in range(2, length):
			# The same movement for next 3 times 
			if (chromosome[i].isEqual(chromosome[i-2]) and chromosome[i].isEqual(chromosome[i-1])):
				chromosome[i] = chromosome[i-1].getDifferentAxis()
			# opposite direction
			elif(chromosome[i].isOpposite(chromosome[i-1])):
				chromosome[i] = chromosome[i-1].getDifferent()

	# <chromosome> applies to the start puzzle.
	# If one of the directions is exiting Puzzle when applied to Puzzle
	# This direction is replaced by a different axis. 
	def applyChromosomeToPuzzle(self, chromosome):
		puzzle = Puzzle(self.board)
		i = 0
		while i < len(chromosome):
			try:
				if (puzzle.fitness() == 0):
					return [chromosome[:i], puzzle]
				puzzle.move(chromosome[i])
				i += 1
			except IndexError:
				chromosome[i] = chromosome[i].getDifferentAxis()
		return [chromosome, puzzle]

	def crossover(self, chromosomes, index=0):
		if (self.NUMBER_OF_SELECTED_CHROMOSOME == index+1):
			return
		for i in range(index+1, self.NUMBER_OF_SELECTED_CHROMOSOME):
			chromosomes += (self.crossing(chromosomes[index], chromosomes[i]))
		self.crossover(chromosomes, index+1)

	def crossing(self, chromosome1, chromosome2):
		i = randint(0, self.CHROMOSOME_LENGTH//2-1)
		j = randint(self.CHROMOSOME_LENGTH//2, self.CHROMOSOME_LENGTH)

		c1 = chromosome1[:i] + chromosome2[i:]
		c2 = chromosome2[:i] + chromosome1[i:]

		c3 = chromosome1[:j] + chromosome2[j:]
		c4 = chromosome2[:j] + chromosome1[j:]

		c5 = chromosome1[:i] + chromosome2[i:j] + chromosome1[j:]
		c6 = chromosome2[:i] + chromosome1[i:j] + chromosome2[j:]

		c7 = chromosome1[j:] + chromosome1[:i] + chromosome2[i:j]
		c8 = chromosome2[j:] + chromosome2[:i] + chromosome1[i:j]

		c9 = chromosome2[i:j] + chromosome1[:i] + chromosome1[j:]
		c10 = chromosome1[i:j] + chromosome2[:i] + chromosome2[j:]

		return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10]

	# Best chromosomes return.
	# RETURN: [[Chromosome, Puzzle], ...] 
	def selection(self, chromosomes):
		res = []
		for chromosome in chromosomes:
			tmp = self.applyChromosomeToPuzzle(chromosome)
			res.append([tmp[0], tmp[1]])
		# ranked selection
		res.sort(key=lambda x: x[1].fitness())
		return res[:self.NUMBER_OF_SELECTED_CHROMOSOME]

	def getStrOfChromosome(self, chromosome):
		return [x.name for x in chromosome]

	def solution(self):
		generation, numOfIncrement, bestmdis = 0, 0, 36
		bestSelection = []

		population = self.initializePopulation()
		while generation < self.MAX_GENERATION:

			generation += 1

			# mutation
			for item in (population):
				self.mutation(item)

			# selection
			slct = self.selection(population)
			mdis = slct[0][1].fitness()
			population = [item[0] for item in slct]

			# best choice 
			if (mdis < bestmdis):
				bestmdis = mdis
				bestSelection = slct[0]

			# increasing the length of chromosome 
			if (generation//self.INCREMENT_RANGE_FOR_CHROMOSOME_LENGTH > numOfIncrement):
				numOfIncrement += 1
				self.CHROMOSOME_LENGTH += self.INCREMENT_SIZE_FOR_CHROMOSOME_LENGTH

			yield f"generation: {generation} | fitness: {mdis}"

			# result found 
			if (mdis == 0):
				self.bestSelection = bestSelection
				break

			self.crossover(population)

if __name__ == "__main__":
	solver = Solver(1000, 20, [ 1, 2, 3, 4, 5, 6, 7, 0, 8 ])
	iterations = solver.solution()
	for iteration in iterations:
		print(iteration)
	bestSelection = solver.bestSelection
	print("---------------------------")
	print(goal)
	print("---------------------------")
	print(f"fitness: {bestSelection[1].fitness()}")
	print(f"best chromosome\n{solver.getStrOfChromosome(bestSelection[0])}")
	print(f"final status\n{bestSelection[1]}")
