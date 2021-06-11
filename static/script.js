// Global variables
var socket, _letmetry = false
var backgroundThemes = [
	'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
	'linear-gradient(0deg, rgba(0,166,255,1) 0%, rgba(0,255,117,1) 100%)',
	'linear-gradient(0deg, rgba(74,36,194,1) 0%, rgba(252,70,107,1) 100%)',
	'linear-gradient(0deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,242,69,1) 100%)',
]
var boardThemes = [
	'radial-gradient(1.5em 6.28571em at 1.95em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(1.5em 6.28571em at -0.45em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 1.5em 5.5em, radial-gradient(2.3em 4.57143em at 2.99em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(2.3em 4.57143em at -0.69em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 2.3em 4em, radial-gradient(3.5em 6.28571em at 4.55em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(3.5em 6.28571em at -1.05em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 3.5em 5.5em, radial-gradient(#E2A9E5, #632C65)',
	'radial-gradient(1.5em 6.28571em at 1.95em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(1.5em 6.28571em at -0.45em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 1.5em 5.5em, radial-gradient(2.3em 4.57143em at 2.99em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(2.3em 4.57143em at -0.69em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 2.3em 4em, radial-gradient(3.5em 6.28571em at 4.55em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(3.5em 6.28571em at -1.05em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 3.5em 5.5em, radial-gradient(#0BC066, #529082)',
	'radial-gradient(1.5em 6.28571em at 1.95em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(1.5em 6.28571em at -0.45em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 1.5em 5.5em, radial-gradient(2.3em 4.57143em at 2.99em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(2.3em 4.57143em at -0.69em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 2.3em 4em, radial-gradient(3.5em 6.28571em at 4.55em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(3.5em 6.28571em at -1.05em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 3.5em 5.5em, radial-gradient(#CFECA3, #C9D218)',
	'radial-gradient(1.5em 6.28571em at 1.95em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(1.5em 6.28571em at -0.45em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 1.5em 5.5em, radial-gradient(2.3em 4.57143em at 2.99em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(2.3em 4.57143em at -0.69em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.3) 55%, rgba(255, 255, 255, 0) 55%) 2.3em 4em, radial-gradient(3.5em 6.28571em at 4.55em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 0 0, radial-gradient(3.5em 6.28571em at -1.05em, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.25) 55%, rgba(255, 255, 255, 0) 55%) 3.5em 5.5em, radial-gradient(#0F49A0, #45B0E8)',
]
var blockThemes = [
	'radial-gradient(circle, lightgray 0%, white 100%)',
	'radial-gradient(circle, lightgreen 0%, white 100%)',
	'radial-gradient(circle, lightpink 0%, white 100%)',
	'radial-gradient(circle, lightsteelblue 0%, white 100%)',
]

// Set Themes in LocalStorage if not already set
if(localStorage.getItem('currentThemes') == null) {
	localStorage.setItem('currentThemes', JSON.stringify([ 0, 0, 0 ]))
}

// Initialize Socket Connection and Themes
initialize()

function initialize() {
	socket = io('http://127.0.0.1:5000')
	const currentThemes = JSON.parse(localStorage.getItem('currentThemes'))
	document.querySelector('body').style.background = backgroundThemes[currentThemes[0]]
	document.querySelector('#parent').style.background = boardThemes[currentThemes[1]]
	document.querySelector('#parent').style.backgroundSize = '1.5em 11em, 1.5em 11em, 2.3em 8em, 2.3em 8em, 3.5em 11em, 3.5em 11em, 100% 100%'
	document.querySelector('#parent').style.backgroundRepeat = 'repeat'
	document.querySelectorAll('.blocks').forEach(block => {
		block.style.background = blockThemes[currentThemes[2]]
	})
}

function backgroundTheme() {
	let currentThemes = JSON.parse(localStorage.getItem('currentThemes'))
	currentThemes[0] = (currentThemes[0]+1)%4
	localStorage.setItem('currentThemes', JSON.stringify(currentThemes))
	document.querySelector('body').style.background = backgroundThemes[currentThemes[0]]
}

function boardTheme() {
	let currentThemes = JSON.parse(localStorage.getItem('currentThemes'))
	currentThemes[1] = (currentThemes[1]+1)%4
	localStorage.setItem('currentThemes', JSON.stringify(currentThemes))
	document.querySelector('#parent').style.background = boardThemes[currentThemes[1]]
	document.querySelector('#parent').style.backgroundSize = '1.5em 11em, 1.5em 11em, 2.3em 8em, 2.3em 8em, 3.5em 11em, 3.5em 11em, 100% 100%'
	document.querySelector('#parent').style.backgroundRepeat = 'repeat'
}

function blockTheme() {
	let currentThemes = JSON.parse(localStorage.getItem('currentThemes'))
	currentThemes[2] = (currentThemes[2]+1)%4
	localStorage.setItem('currentThemes', JSON.stringify(currentThemes))
	document.querySelectorAll('.blocks').forEach(block => {
		block.style.background = blockThemes[currentThemes[2]]
	})
}

function solver(direction) {
	const emptyIndex = [...document.getElementById('parent').children].indexOf(document.getElementById('_'))
	let replaceIndex
	switch(direction) {
		case 'up':
			replaceIndex = emptyIndex - 3
			break
		case 'down':
			replaceIndex = emptyIndex + 3
			break
		case 'left':
			replaceIndex = emptyIndex - 1
			break
		case 'right':
			replaceIndex = emptyIndex + 1
			break
	}
	let flag = false
	if(direction == 'left' || direction == 'right') {
		if([0,1,2].includes(replaceIndex) && [0,1,2].includes(emptyIndex) || [3,4,5].includes(replaceIndex) && [3,4,5].includes(emptyIndex) || [6,7,8].includes(replaceIndex) && [6,7,8].includes(emptyIndex)) {
			flag = true
		}
	}
	else {
		if(replaceIndex > -1 && replaceIndex < 9) {	
			flag = true
		}
	}
	if(flag) {
		let clone = document.getElementById("parent").children[replaceIndex]
		document.getElementById("parent").replaceChild(document.getElementById("parent").children[emptyIndex], document.getElementById("parent").children[replaceIndex])
		document.getElementById("parent").insertBefore(clone, document.getElementById("parent").children[emptyIndex])
		document.getElementById("parent").children[emptyIndex].style.backgroundColor = 'gold'
		document.getElementById("parent").children[replaceIndex].style.backgroundColor = 'gold'
	}
}

function resetColor() {
	document.querySelectorAll('.blocks').forEach(block => {
		block.parentNode.style.backgroundColor = 'transparent'
	})
}

function setDraggable(toggle) {
	[...document.getElementById('parent').children].forEach(block => {
		block.setAttribute('draggable', toggle)
	})
	document.querySelectorAll('.blocks').forEach(block => {
		if(toggle) {
			block.classList.add('hover')
		}
		else {
			block.classList.remove('hover')
		}
	})
}

function reset(array=[1,2,3,4,5,6,7,8,'&#8203;']) {
	let blocks = ''
	for(let i of array) {
		blocks += '<div id="' + (typeof i == 'number' ? i : '_') + '" class="col-4" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)">'+
			'<h2 class="card blocks shadow m-15">' + i + '</h2>'+
		'</div>'
	}
	document.getElementById('parent').innerHTML = blocks
	const currentThemes = JSON.parse(localStorage.getItem('currentThemes'))
	document.querySelectorAll('.blocks').forEach(block => {
		block.style.background = blockThemes[currentThemes[2]]
	})
}

function showModal(title, steps, isSolved) {
	document.getElementById('modal-title').innerHTML = '<span class="text-' + (isSolved ? 'primary' : 'danger') + '">' + title + '</span>'
	document.getElementById('modal-steps').innerHTML = steps
	halfmoon.toggleModal('outcome')
	document.getElementById('newgame').disabled = false
}

function letmetry() {
	document.querySelectorAll('.input').forEach(input => {
		input.classList.add('d-none')
	})
	document.querySelectorAll('.output').forEach(output => {
		output.classList.remove('d-none')
	})
	document.querySelectorAll('.letmetry').forEach(letmetry => {
		letmetry.classList.remove('d-none')
	})
	setDraggable(false)
	document.querySelector('#_').setAttribute('draggable', true)
	document.querySelector('#_').querySelector('h2').classList.add('hover')
	_letmetry = true
}

function solve() {
	setDraggable(false)
	document.getElementById('newgame').disabled = true
	let board = []
	document.querySelectorAll('.blocks').forEach(block => {
		board.push(parseInt(block.innerHTML) || 0)
	})
	document.querySelectorAll('.input').forEach(input => {
		input.classList.add('d-none')
	})
	document.querySelectorAll('.output').forEach(output => {
		output.classList.remove('d-none')
	})
	socket.emit('solve', {
		POPULATION_SIZE: parseFloat(document.getElementById('POPULATION_SIZE').value),
		MAX_GENERATION: parseFloat(document.getElementById('MAX_GENERATION').value),
		board: board,
	}, (response) => {
		if(response) {
			const results = document.getElementById('results')
			results.innerHTML += '<span class="text-primary">SOLUTION: </span>' + response
			results.scrollTop = results.scrollHeight
			promises = response.reduce((promise, move, index) => {
				return [ ...promise,
					new Promise((resolve, reject) => setTimeout(function() {
						resetColor()
						solver(move)
						resolve()
					}, 500*index))
				]
			}, [])
			Promise.all(promises).then(() => { 
				const steps = response.reduce((orderedlist, step) => { return orderedlist + '<li>' + step + '</li>' }, '')
				showModal('SOLVED!', '<ol>' + steps + '</ol>', true)
				resetColor()
			})
		}
		else {
			const results = document.getElementById('results')
			results.innerHTML += '<span class="text-danger">NO SOLUTION FOUND!</span>'
			results.scrollTop = results.scrollHeight
			showModal('UNSOLVED!', "Algorithm wasn't able to solve the Puzzle", false)
		}
	})
	socket.on('solver', (iteration) => {
		const results = document.getElementById('results')
		results.innerHTML += iteration
		results.scrollTop = results.scrollHeight
	})
}

function newgame() {
	document.querySelectorAll('.input').forEach(input => input.classList.remove('d-none'))
	document.querySelectorAll('.output').forEach(output => output.classList.add('d-none'))
	document.getElementById('results').innerHTML = ''
	document.querySelectorAll('.letmetry').forEach(letmetry => {
		letmetry.classList.add('d-none')
	})
	_letmetry = false
	reset()
	setDraggable(true)
}

function shuffle() {
	let n = Math.random() * (100 - 10) + 10
	const choices = ['up', 'down', 'left', 'right']
	while(n>0) {
		solver(choices[Math.floor(Math.random() * choices.length)])
		--n;
	}
	resetColor()
}

function drag(e)
{
	e.dataTransfer.setData("text", e.target.id)
}

function drop(e)
{
	let data = e.dataTransfer.getData("text")
	const move = () => {
		let clone = e.target.parentNode.cloneNode(true)
		let dragindex, nodelist = document.getElementById("parent").childNodes
		for(let i=0;i<nodelist.length;i++)
		{
			if(nodelist[i].id == data)
			{
				dragindex=i;
			}
		}
		if(data != e.target.parentNode.id)
		{
			document.getElementById("parent").replaceChild(document.getElementById(data),e.target.parentNode)
			document.getElementById("parent").insertBefore(clone,document.getElementById("parent").childNodes[dragindex])
		}
	}
	e.preventDefault()
	if(_letmetry) {
		let board = [], children = [...document.getElementById('parent').children]
		let target = children.indexOf(e.target.parentNode)
		let source = children.reduce((acc, child, index) => { return child.id == '_' ? index : acc })
		let direction
		switch(target - source) {
			case 1:
				direction = 'right'
				break
			case -1:
				direction = 'left'
				break
			case 3:
				direction = 'down'
				break
			case -3:
				direction = 'up'
				break
			default:
				direction = null
		}
		document.querySelectorAll('.blocks').forEach(block => {
			board.push(parseInt(block.innerHTML) || 0)
		})
		if(direction) {
			socket.emit('letmetry', {
				board: board,
				direction: direction,
			}, (response) => {
				if(response !== false) {
					if(response === '0') {
						document.getElementById('results').innerHTML = '<span class="text-success">You Won!</span>'
						showModal('You Solved It!', 'You did it all by Yourself!', true)
					}
					setDraggable(false)
					move()
				}
			})
		}
	}
	else {
		move()
	}
}

function allowDrop(e)
{
    e.preventDefault();
}