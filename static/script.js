var socket = io('http://127.0.0.1:5000')

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
}

function reset(array=[1,2,3,4,5,6,7,8,'&#8203;']) {
	let blocks = ''
	for(let i of array) {
		blocks += '<div id="' + (typeof i == 'number' ? i : '_') + '" class="col-4" draggable="true" ondragstart="drag(event)" ondrop="drop(event)" ondragover="allowDrop(event)">'+
			'<h2 class="card blocks shadow m-15">' + i + '</h2>'+
		'</div>'
	}
	document.getElementById('parent').innerHTML = blocks
}

function solve() {
	setDraggable(false)
	document.getElementById('newgame').disabled = true
	let board = []
	document.querySelectorAll('.blocks').forEach(block => {
		board.push(block.innerHTML)
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
		board: board.map(value => parseInt(value) || 0),
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
				document.getElementById('steps').innerHTML = '<ol>' + steps + '</ol>'
				halfmoon.toggleModal('solved')
				document.getElementById('newgame').disabled = false
				resetColor()
			})
		}
		else {
			const results = document.getElementById('results')
			results.innerHTML += '<span class="text-danger">NO SOLUTION FOUND!</span>'
			results.scrollTop = results.scrollHeight
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
	e.preventDefault();
	let dragindex
	let clone = e.target.parentNode.cloneNode(true)
	let data = e.dataTransfer.getData("text")
	if(data != e.target.innerHTML)
	{
		let nodelist=document.getElementById("parent").childNodes
		for(let i=0;i<nodelist.length;i++)
		{
			if(nodelist[i].id==data)
			{
				dragindex=i;
			}
		}
		document.getElementById("parent").replaceChild(document.getElementById(data),e.target.parentNode)
		document.getElementById("parent").insertBefore(clone,document.getElementById("parent").childNodes[dragindex])
	}
}

function allowDrop(e)
{
    e.preventDefault();
}