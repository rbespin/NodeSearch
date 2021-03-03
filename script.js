
// Globals
let isToggled = false;
let cancelAsync = false;

let setStartNodeButtonIsToggled = false;
let setGoalNodeButtonIsToggled = false;
let startNodeInitialized = false;
let goalNodeInitialized = false;
let startNode = null;
let goalNode = null;
let currentNode = null;

// Data structure to hold info about neighbors of grid cell divs
let neighbors = [];

let gridParent = document.getElementById("grid");
gridParent.addEventListener("mousedown",enableToggle);
gridParent.addEventListener("mouseup",disableToggle);

let gridParentColumnSize = 50;

let resetButton = document.getElementById("reset_grid");
resetButton.addEventListener("click",resetGrid);

let setStartNodeButton = document.getElementById("start_node");
setStartNodeButton.addEventListener("click",setStartNodeMode);

let setGoalNodeButton = document.getElementById("goal_node");
setGoalNodeButton.addEventListener("click",setGoalNodeMode);

let initiateSearchButton = document.getElementById("initiate_search_button1");
initiateSearchButton.addEventListener("click",dfsIterative);

let initiateSearchButton2 = document.getElementById("initiate_search_button2");
initiateSearchButton2.addEventListener("click",bfs);

function setStartNodeMode()
{
	if(setGoalNodeButtonIsToggled)
	{
		setGoalNodeButtonIsToggled = false;
		setGoalNodeButton.style.backgroundColor = '';
	}

	if(!setStartNodeButtonIsToggled && !startNodeInitialized)
	{
		setStartNodeButton.style.backgroundColor = 'red';
		setStartNodeButtonIsToggled = true;
	}
	else
	{
		setStartNodeButton.style.backgroundColor = '';
		setStartNodeButtonIsToggled = false;
		if(startNode != null)
		{
			startNode.style.backgroundColor = 'cadetblue';
			setStartNodeButtonIsToggled = false;
			startNodeInitialized = false;
			setStartNodeButton.style.backgroundColor = '';
			startNode = null;
		}
	}
}

function setStartNodeCell(e)
{
	if(e.target.style.backgroundColor != 'magenta' && 
		setStartNodeButtonIsToggled)
	{
		startNode = e.target;
		e.target.style.backgroundColor = 'red';
		startNodeInitialized = true;
		setStartNodeButtonIsToggled = false;
	}
}



function setGoalNodeMode()
{
	if(setStartNodeButtonIsToggled)
	{
		setStartNodeButtonIsToggled = false;
		setStartNodeButton.style.backgroundColor = '';
	}
	if(!setGoalNodeButtonIsToggled && !goalNodeInitialized)
	{
		setGoalNodeButton.style.backgroundColor = 'yellow';
		setGoalNodeButtonIsToggled = true;
	}
	else
	{
		setGoalNodeButton.style.backgroundColor = '';
		setGoalNodeButtonIsToggled = false;
		if(goalNode != null)
		{
			goalNode.style.backgroundColor = 'cadetblue';
			setGoalNodeButtonIsToggled = false;
			goalNodeInitialized = false;
			setGoalNodeButton.style.backgroundColor = '';
			goalNode = null;
		}
	}
}

function setGoalNodeCell(e)
{
	if(e.target.style.backgroundColor != 'magenta' && 
		setGoalNodeButtonIsToggled)
	{
		goalNode = e.target;
		e.target.style.backgroundColor = 'yellow';
		goalNodeInitialized = true;
		setGoalNodeButtonIsToggled = false;
	}
}

function resetGrid()
{
	cancelAsync = true;
	while(gridParent.firstChild)
	{
		gridParent.removeChild(gridParent.firstChild)
	}
	if(startNode != null)
	{
		startNode.style.backgroundColor = 'cadetblue';
		setStartNodeButtonIsToggled = false;
		startNodeInitialized = false;
		setStartNodeButton.style.backgroundColor = '';
		startNode = null;
	}
	if(goalNode != null)
	{
		goalNode.style.backgroundColor = 'cadetblue';
		goalStartNodeButtonIsToggled = false;
		goalNodeInitialized = false;
		setGoalNodeButton.style.backgroundColor = '';
		goalNode = null;
	}
	cancelAsync = false;
	add_cells(gridParent);
}

function removeAllPaints()
{
	cancelAsync = true;
	let children = gridParent.childNodes;
	children.forEach(function(item) {
		if(item.style.backgroundColor == 'grey' || 
			item.style.backgroundColor == 'black')
		{
			item.style.backgroundColor = 'cadetblue';
		}
	});
	cancelAsync = false;
}

function enableToggle(e)
{
	if(e.which == 1)
	{
		isToggled = true;
	}
}

function disableToggle(e)
{
	if(e.which == 1)
	{
		isToggled = false;
	}
}

function colorOnDrag(e)
{
	if(isToggled)
	{
		if(e.target != startNode)
		{
			e.target.style.backgroundColor = 'magenta';
		}
	}
}


function add_cells(grid)
{
	// 25x25 cells (for now)
	gridParent.style.gridTemplateColumns = 
	`repeat(${gridParentColumnSize},1fr)`;
	for(let i = 0; i < gridParentColumnSize**2; i++)
	{
		let gridCell = document.createElement("div");
		gridCell.classList = "gridCell";
		gridCell.id = i;
		// Border edge cases to prevent redundant borders
		if((i+1)%(gridParentColumnSize) == 0 && i > 0)
		{
			gridCell.style.borderRight = `1px solid black`;
		}
		if((i+1)>(gridParentColumnSize**2-gridParentColumnSize))
		{
			gridCell.style.borderBottom = `1px solid black`;
		}
		gridCell.addEventListener("mouseover",colorOnDrag);
		gridCell.addEventListener("click",setStartNodeCell);
		gridCell.addEventListener("click",setGoalNodeCell);
		gridParent.appendChild(gridCell);
	}
}

function initializeNeighborsStructure(gridParentColumnSize)
{
	neighbors = [];
	for(let i  = 0; i < gridParentColumnSize**2; i++)
	{
		let row = Math.floor(i/gridParentColumnSize);
		// top row edge case
		if( row == 0 )
		{
			// leftmost row edge case
			if( (i)%gridParentColumnSize == 0 )
			{
				neighbors[i] = {
					"right" : i+1,
					"bottom" : i+gridParentColumnSize,
				}
			}
			// rightmost row edge case
			else if( (i+1)%gridParentColumnSize == 0 )
			{
				neighbors[i] = {
					"left" : i-1,
					"bottom" : i+gridParentColumnSize,
				}

			}
			else
			{
				neighbors[i] = {
					"left" : i-1,
					"right" : i+1,
					"bottom" : i+gridParentColumnSize,
				}
			}
		}
		// bottom row 
		else if( row == gridParentColumnSize-1 )
		{
			// leftmost row edge case
			if( (i)%gridParentColumnSize == 0 )
			{
				neighbors[i] = {
					"right" : i+1,
					"top" : i-gridParentColumnSize,
				}
			}
			// rightmost row edge case
			else if( (i+1)%gridParentColumnSize == 0 )
			{
				neighbors[i] = {
					"left" : i-1,
					"top" : i-gridParentColumnSize,
				}

			}
			else
			{
				neighbors[i] = {
					"left" : i-1,
					"right" : i+1,
					"top" : i-gridParentColumnSize,
				}
			}
		}

		// leftmost row
		else if( (i)%gridParentColumnSize == 0 )
		{
			neighbors[i] = {
				"right" : i+1,
				"top" : i-gridParentColumnSize,
				"bottom" : i+gridParentColumnSize,
			}
		}

		// rightmost row
		else if( (i+1)%gridParentColumnSize == 0 )
		{
			neighbors[i] = {
				"left" : i-1,
				"top" : i-gridParentColumnSize,
				"bottom" : i+gridParentColumnSize,
			}

		}

		// every other element
		else
		{
			neighbors[i] = {
				"left" : i-1,
				"top" : i-gridParentColumnSize,
				"bottom" : i+gridParentColumnSize,
				"right" : i + 1,
			}

		}

	}
	return neighbors;
}

function delay(delayInms) {
	if(cancelAsync)
	{
		return;
	}
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(2);
		}, delayInms);
	});
}

async function propagateFromStart()
{
	let currentNode = startNode;
	// randomly spread through child nodes
	for(let i = 0; i < 10; i++)
	{
		if(currentNode != goalNode)
		{
			let nextNode = document.getElementById(
				(parseInt(currentNode.id)+1).toString());
			currentNode = document.getElementById(nextNode.id.toString());
			// color starting from startNode
			if(currentNode == goalNode)
			{
				currentNode.style.backgroundColor = 'blue';
			}
			else if(currentNode == startNode)
			{
				;
			}
			else if(currentNode.style.backgroundColor == 'magenta')
			{
				return;
			}
			else
			{
				currentNode.style.backgroundColor = 'black';
			}
			// getting neighbor...

			// wait one second
			let delayres = await delay(10);
			// change node	
		}
		else
		{
			break;
		}

	}
}

// iterative dfs
async function search()
{
	if( startNode == null || goalNode == null )
	{
		return;
	}
	//let delayres = await delay(500);
	visited = [];
	stack = [];
	// assumes neighbors will be populated
	stack = Object.values(neighbors[startNode.id]);
	let count = 0;
	let prev = null;
	while(stack.length != 0)
	{
		let vertex = stack.pop();
		if(vertex == parseInt(goalNode.id))
		{
			console.log("SOLUTION FOUND!");
			goalNode.style.backgroundColor = 'green';
			if(prev != null)
			{
				prev.style.backgroundColor = 'black';
			}
			return;
		}
		//console.log("stack.pop(): " + JSON.stringify(vertex));
		if( !visited.includes(vertex) && 
			vertex != parseInt(startNode.id) && 
			document.getElementById(vertex.toString()).style.backgroundColor != 'magenta')
		{
			visited.push(vertex);
			//console.log("unvisited vertex: " + JSON.stringify(vertex));
			let node = document.getElementById(vertex.toString());
			node.style.backgroundColor = 'white';
			if(prev != null)
			{
				prev.style.backgroundColor = 'black';
			}
			let vertexEdges = Object.values(
				neighbors[vertex.toString()]);
			shuffleArray(vertexEdges);
			//console.log(vertexEdges);
			for(let i = 0; i < vertexEdges.length; i++)
			{
				if(!visited.includes(vertexEdges[i]) && 
					!stack.includes(vertexEdges[i]) && 
					vertexEdges[i] != parseInt(startNode.id))
				{
					stack.push(vertexEdges[i]);
				}
			}
			prev = node;
		}
		let delayres = await delay(10);
	} 
}

function dfsRecursiveParent()
{
	let root = startNode;
	let goal = goalNode;

	let dfsToRecurse = Object.values(neighbors[root.id]);
	let visited3 = [];
	visited3.push(parseInt(root.id));
	// for all edges of root
	for(let i = 0; i < dfsToRecurse.length; i++)
	{
		// if vertex is not visited...
		console.log(visited3);
		if(!visited3.includes(dfsToRecurse[i]))
		{
			// dfsRecursive(vertex,)
			//let delayres = await delay(100);
			visited3.push(dfsToRecurse[i]);
			console.log("Starting parent recurse");
			if(dfsRecursive(dfsToRecurse[i],goal,visited3,parseInt(root.id)))
			{
				return;
			}

		}
	}
	return;
}

function dfsRecursive(vertex,goal,visited,prev)
{
	// if vertex == goal, return true
	if(vertex == parseInt(goal.id))
	{
		console.log("SOLUTION FOUND!!!!!")
		goal.style.backgroundColor = 'blue';
		if(prev != null)
		{
			node = document.getElementById(prev.toString());
			node.style.backgroundColor = 'black';
		}
		return true;
	}
	else
	{
		//visited.push(vertex);
		let dfsToRecurse = Object.values(neighbors[vertex.toString()]);
		let node = document.getElementById(vertex.toString());
		node.style.backgroundColor = 'white';

		node = document.getElementById(prev.toString());
		node.style.backgroundColor = 'black';

		for(let i = 0; i < dfsToRecurse.length; i++)
		{
			// if vertex is not visited...
			if(!visited.includes(dfsToRecurse[i]) && 
				dfsToRecurse[i] != parseInt(startNode.id) && 
				document.getElementById(
					dfsToRecurse[i].toString()).style.backgroundColor != 'magenta')
			{
			//	let delayres = await delay(100);
				// dfsRecursive(vertex,)
				visited.push(dfsToRecurse[i]);
				if(dfsRecursive(dfsToRecurse[i],goal,visited,vertex) == true)
				{
					return true;
				}
			}
		}
	}
}


async function dfsIterative()
{
	let root = startNode;
	let goal = goalNode;

	let dfsToRecurse = Object.values(neighbors[root.id]);
	let iterator = [];
	iterator.push(dfsToRecurse);
	let visited = [];
	let prev = null;
	let path = [];
	let current;
	let innerBreak = true;
	let count = 0;
	let pathCount = [];
	while(iterator.length != 0 && innerBreak)
	{
		let nextStack = iterator[iterator.length-1];
		let stackLength = nextStack.length;
		for(let i = 0; i < stackLength; i++)
		{
			let delayres = await delay(10);
			nextElement = nextStack[i];
			console.log(nextElement);
			if(nextElement == parseInt(goal.id))
			{
				console.log("SOLUTION FOUND!!");
				pathCount[nextElement] = count++;
				innerBreak = false;
				path[nextElement] = prev;
				goal.style.backgroundColor = 'blue';
				path[nextStack[i]] = prev;
				pathCount[nextStack[i]] = count++;
				if(prev != null)
				{
					node = document.getElementById(prev.toString());
					node.style.backgroundColor = 'black';
				}

				break;
			}
			if(!visited.includes(nextElement) && 
				nextElement != parseInt(root.id) && 
				document.getElementById(
					nextElement.toString()).style.backgroundColor != 'magenta')
			{
				let node = document.getElementById(nextStack[i].toString());
				node.style.backgroundColor = 'white';

				if(prev != null)
				{
					node = document.getElementById(prev.toString());
					node.style.backgroundColor = 'black';
				}
				path[nextElement] = prev;
				pathCount[nextElement] = count++;
				visited.push(nextElement);
				iterator.push(
					Object.values(neighbors[nextElement.toString()]));
				stackLength = iterator[iterator.length-1].length;
				nextStack = iterator[iterator.length -1];
				i = 0;
				prev = nextElement;
			}
		}
		iterator.pop();
	}
	console.log('goal id: ' + parseInt(goal.id));
	/*
		for(let i = 0; i < nextStack.length; i++)
		{
			if(nextStack[i] == parseInt(goal.id))
			š
				console.log("SOLUTION FOUND!!");
				goal.style.backgroundColor = 'blue';
				path[nextStack[i]] = prev;
				pathCount[nextStack[i]] = count++;
				if(prev != null)
				{
					node = document.getElementById(prev.toString());
					node.style.backgroundColor = 'black';
				}
				innerBreak = false;
				break;
			}
			if(!visited.includes(nextStack[i]) && 
				nextStack[i] != parseInt(root.id) && 
				document.getElementById(
					nextStack[i].toString()).style.backgroundColor != 'magenta')
			{
				path[nextStack[i]] = prev;
				pathCount[nextStack[i]] = count++;
				let delayres = await delay(500);
				let node = document.getElementById(nextStack[i].toString());
				node.style.backgroundColor = 'white';

				if(prev != null)
				{
					node = document.getElementById(prev.toString());
					node.style.backgroundColor = 'black';
				}
				visited.push(nextStack[i]);
				iterator.push(
					Object.values(neighbors[nextStack[i].toString()]));
				prev = nextStack[i];
			}
		}
	}
	*/
	// paint path
	let traversal = path[parseInt(goal.id)];
	while(traversal != null)
	{
		document.getElementById(
					traversal.toString()).style.backgroundColor = 'chartreuse';
		traversal = path[traversal];
	}
	startNode.style.backgroundColor = 'red'; 
}

async function bfs()
{
	if( startNode == null || goalNode == null )
	{
		return;
	}
	//let delayres = await delay(500);
	let root = startNode;
	queue = [];
	visited2 = [];
	let paths = []; // ancestors of nodes
	visited2.push(parseInt(root.id));
	queue.push(parseInt(root.id));
	let prev = null;
	let startCount = 0;
	while(queue.length != 0)
	{
		let vertex = queue.pop();
		if(vertex == parseInt(startNode.id))
		{
			startCount++;
		}
		if( vertex == parseInt(goalNode.id) )
		{
			goalNode.style.backgroundColor = 'blue';
			if(prev != null)
			{
				prev.style.backgroundColor = 'grey';
			}
			break;
		}
		// for all edges from v:
//		if( vertex != parseInt(startNode.id))
//		{
		let node = document.getElementById(vertex.toString());
		if(vertex != parseInt(startNode.id))
		{
			node.style.backgroundColor = 'white';
		}
//		}
		if(prev != null && prev.id != startNode.id)
		{
			prev.style.backgroundColor = 'grey';
		}
		let vertexEdges = Object.values(
				neighbors[vertex.toString()]);
		for(let i = 0; i < vertexEdges.length; i++)
		{
			if( !visited2.includes(vertexEdges[i]) && 
				 (vertexEdges[i] != parseInt(startNode.id) || 
				 (vertexEdges[i] == parseInt(startNode.id) && startCount == 1) ) && 
				document.getElementById(
					vertexEdges[i].toString()).style.backgroundColor != 'magenta') 
			{
				paths[vertexEdges[i]] = vertex;
				visited2.push(vertexEdges[i]);
				queue.unshift(vertexEdges[i]);
			}
		}		
		prev = node;
		let delayres = await delay(10);
	}
	// painting path
	traversal = paths[parseInt(goalNode.id)];
	while(traversal != paths[parseInt(startNode.id)])
	{
		document.getElementById(
					traversal.toString()).style.backgroundColor = 'cyan';
		traversal = paths[traversal];
	}
	startNode.style.backgroundColor = 'red';
}

add_cells(gridParent);
neighbors = initializeNeighborsStructure(gridParentColumnSize);

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

