const ROWS = 20;
const COLS = 30;

let grid = [];
let startNode = null;
let endNode = null;
let currentMode = 'start';
let isDrawing = false;
let animationSpeed = 10;
let visitedHistory = [];
let pathHistory = [];
let isAnimating = false;

const gridElement = document.getElementById('grid');
const statusElement = document.getElementById('status');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

function initGrid() {
  grid = [];
  gridElement.innerHTML = '';
  gridElement.style.gridTemplateColumns = `repeat(${COLS}, 25px)`;
  gridElement.style.gridTemplateRows = `repeat(${ROWS}, 25px)`;
  
  for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      
      cell.addEventListener('mousedown', handleMouseDown);
      cell.addEventListener('mouseenter', handleMouseEnter);
      
      gridElement.appendChild(cell);
      grid[row][col] = {
        row,
        col,
        isWall: false,
        isStart: false,
        isEnd: false,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
        element: cell
      };
    }
  }
  
  document.addEventListener('mouseup', () => isDrawing = false);
}

function handleMouseDown(e) {
  if (isAnimating) return;
  isDrawing = true;
  handleCellInteraction(e.target);
}

function handleMouseEnter(e) {
  if (isAnimating || !isDrawing) return;
  handleCellInteraction(e.target);
}

function handleCellInteraction(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  const node = grid[row][col];
  
  clearVisualization();
  
  switch (currentMode) {
    case 'start':
      if (node.isWall || node.isEnd) return;
      if (startNode) {
        startNode.isStart = false;
        startNode.element.classList.remove('start');
      }
      node.isStart = true;
      node.element.classList.add('start');
      startNode = node;
      statusElement.textContent = `起点已设置 (${row}, ${col})`;
      break;
      
    case 'end':
      if (node.isWall || node.isStart) return;
      if (endNode) {
        endNode.isEnd = false;
        endNode.element.classList.remove('end');
      }
      node.isEnd = true;
      node.element.classList.add('end');
      endNode = node;
      statusElement.textContent = `终点已设置 (${row}, ${col})`;
      break;
      
    case 'wall':
      if (node.isStart || node.isEnd) return;
      node.isWall = true;
      node.element.classList.add('wall');
      statusElement.textContent = `绘制障碍物中...`;
      break;
      
    case 'erase':
      if (node.isStart) {
        node.isStart = false;
        startNode = null;
      }
      if (node.isEnd) {
        node.isEnd = false;
        endNode = null;
      }
      node.isWall = false;
      node.element.classList.remove('start', 'end', 'wall', 'visited', 'path');
      statusElement.textContent = `擦除中...`;
      break;
  }
}

function clearVisualization() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const node = grid[row][col];
      node.element.classList.remove('visited', 'path');
      node.g = 0;
      node.h = 0;
      node.f = 0;
      node.parent = null;
    }
  }
  visitedHistory = [];
  pathHistory = [];
}

function heuristic(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getNeighbors(node) {
  const neighbors = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < ROWS - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < COLS - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors;
}

function aStar() {
  if (!startNode || !endNode) {
    statusElement.textContent = '请先设置起点和终点！';
    return null;
  }
  
  clearVisualization();
  
  const openSet = [startNode];
  const closedSet = [];
  
  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.g + startNode.h;
  
  while (openSet.length > 0) {
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    
    const current = openSet[lowestIndex];
    
    if (current === endNode) {
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        temp = temp.parent;
      }
      return { path, visited: [...closedSet, current] };
    }
    
    openSet.splice(lowestIndex, 1);
    closedSet.push(current);
    visitedHistory.push(current);
    
    const neighbors = getNeighbors(current);
    
    for (const neighbor of neighbors) {
      if (closedSet.includes(neighbor) || neighbor.isWall) continue;
      
      const tentativeG = current.g + 1;
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= neighbor.g) {
        continue;
      }
      
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, endNode);
      neighbor.f = neighbor.g + neighbor.h;
      neighbor.parent = current;
    }
  }
  
  return { path: null, visited: closedSet };
}

async function animateVisited() {
  for (let i = 0; i < visitedHistory.length; i++) {
    const node = visitedHistory[i];
    if (!node.isStart && !node.isEnd) {
      node.element.classList.add('visited');
    }
    await delay(animationSpeed);
  }
}

async function animatePath() {
  for (let i = 0; i < pathHistory.length; i++) {
    const node = pathHistory[i];
    if (!node.isStart && !node.isEnd) {
      node.element.classList.add('path');
    }
    await delay(animationSpeed * 2);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startFinding() {
  if (isAnimating) return;
  
  const result = aStar();
  if (!result) return;
  
  isAnimating = true;
  
  statusElement.textContent = '正在搜索路径...';
  
  await animateVisited();
  
  if (result.path) {
    pathHistory = result.path;
    statusElement.textContent = `找到路径！长度: ${result.path.length} 步`;
    await animatePath();
  } else {
    statusElement.textContent = '无法找到路径！';
  }
  
  isAnimating = false;
}

async function replayPath() {
  if (isAnimating || pathHistory.length === 0) {
    statusElement.textContent = '没有可回放的路径，请先执行寻路！';
    return;
  }
  
  isAnimating = true;
  statusElement.textContent = '正在回放路径...';
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      grid[row][col].element.classList.remove('visited', 'path');
    }
  }
  
  await delay(300);
  
  for (let i = 0; i < visitedHistory.length; i++) {
    const node = visitedHistory[i];
    if (!node.isStart && !node.isEnd) {
      node.element.classList.add('visited');
    }
    await delay(animationSpeed / 2);
  }
  
  await delay(200);
  
  for (let i = 0; i < pathHistory.length; i++) {
    const node = pathHistory[i];
    if (!node.isStart && !node.isEnd) {
      node.element.classList.add('path');
    }
    await delay(animationSpeed);
  }
  
  statusElement.textContent = '回放完成！';
  isAnimating = false;
}

function clearGrid() {
  if (isAnimating) return;
  
  startNode = null;
  endNode = null;
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const node = grid[row][col];
      node.isWall = false;
      node.isStart = false;
      node.isEnd = false;
      node.element.classList.remove('start', 'end', 'wall', 'visited', 'path');
    }
  }
  
  visitedHistory = [];
  pathHistory = [];
  statusElement.textContent = '网格已清空，请重新设置起点和终点';
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${mode}`).classList.add('active');
  
  const modeNames = {
    start: '设置起点',
    end: '设置终点',
    wall: '绘制障碍物',
    erase: '擦除模式'
  };
  statusElement.textContent = `当前模式: ${modeNames[mode]}`;
}

document.getElementById('btn-start').addEventListener('click', () => setMode('start'));
document.getElementById('btn-end').addEventListener('click', () => setMode('end'));
document.getElementById('btn-wall').addEventListener('click', () => setMode('wall'));
document.getElementById('btn-erase').addEventListener('click', () => setMode('erase'));
document.getElementById('btn-start-find').addEventListener('click', startFinding);
document.getElementById('btn-replay').addEventListener('click', replayPath);
document.getElementById('btn-clear').addEventListener('click', clearGrid);

speedSlider.addEventListener('input', (e) => {
  animationSpeed = 51 - parseInt(e.target.value);
  speedValue.textContent = `${animationSpeed}ms`;
});

initGrid();
statusElement.textContent = '请先设置起点和终点，然后绘制障碍物，最后点击"开始寻路"';
