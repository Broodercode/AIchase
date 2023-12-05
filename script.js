
document.addEventListener("DOMContentLoaded", function () {
        const grid = document.getElementById('grid');
        const GRID_ROWS = 8; // Adjust the number of rows here
        const GRID_COLS = 8; // Adjust the number of columns here
    
        // Dynamically set the grid layout based on the constants
        grid.style.gridTemplateRows = `repeat(${GRID_ROWS}, 50px)`;
        grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 50px)`;
        
        let entities = [
            { cell: [0, 0], isIt: false, moveDistance: 2, name: 'blue', score: 0 },
            { cell: [6, 6], isIt: false, moveDistance: 2, name: 'green', score: 0 },
            { cell: [1, 1], isIt: false, moveDistance: 2, name: 'orange', score: 0 },
            { cell: [5, 5], isIt: false, moveDistance: 1, name: 'purple', score: 0 },
            { cell: [3, 3], isIt: true, moveDistance: 3, name: 'red', score: 0 }
        ];
        
    let obstacleCell = [6, 3];
    let movingUp = true;
    let gameActive = true;
    let transferCounter = 0;

    // Initialize the grid
    for (let i = 0; i < GRID_ROWS; i++) {
        for (let j = 0; j < GRID_COLS; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
        }
    }

    

    function gameLoop() {
        if (!gameActive) return;

        entities.forEach(entity => {
            moveEntity(entity);
            checkForCapture(entity);
        });

        updateObstacle();
        updateCells();
        setTimeout(gameLoop, 300);
    }
    function moveEntity(entity) {
        if (entity.isIt) {
            // "IT" entity takes two consecutive moves
            for (let i = 0; i < entity.moveDistance; i++) {
                makeItMove(entity);
            }
        } else {
            // Non-"IT" entities move towards the "IT" entity
            for (let i = 0; i < entity.moveDistance; i++) {
                moveToCaptureIt(entity);
            }
            
        }
    }
    
    function makeItMove(entity) {
        let potentialMoves = [
            [entity.cell[0] + 1, entity.cell[1]],
            [entity.cell[0] - 1, entity.cell[1]],
            [entity.cell[0], entity.cell[1] + 1],
            [entity.cell[0], entity.cell[1] - 1]
        ];
    
        // Filter out invalid moves
        potentialMoves = potentialMoves.filter(move => isValidMove(move, entity));
    
        // If there are no valid moves, the "IT" entity is stuck and doesn't move
        if (potentialMoves.length === 0) return;
    
        // Choose the move that maximizes the distance from the closest non-"IT" entity
        let farthestMove = entity.cell;
        let maxDistance = -Infinity;
    
        potentialMoves.forEach(move => {
            let minDistanceToNonIt = Math.min(...entities.filter(e => !e.isIt).map(e => calculateDistance(move, e.cell)));
            if (minDistanceToNonIt > maxDistance) {
                maxDistance = minDistanceToNonIt;
                farthestMove = move;
            }
        });
    
        entity.cell = farthestMove;
    }
    
    function moveToCaptureIt(entity) {
        let itEntity = entities.find(e => e.isIt);
        let potentialMoves = [
            [entity.cell[0] + 1, entity.cell[1]],
            [entity.cell[0] - 1, entity.cell[1]],
            [entity.cell[0], entity.cell[1] + 1],
            [entity.cell[0], entity.cell[1] - 1]
        ];
    
        // Filter out invalid moves
        potentialMoves = potentialMoves.filter(move => isValidMove(move, entity));
    
        // Choose the move that gets closest to the "IT" entity
        let closestMove = entity.cell;
        let minDistance = calculateDistance(entity.cell, itEntity.cell);
    
        potentialMoves.forEach(move => {
            let distance = calculateDistance(move, itEntity.cell);
            if (distance < minDistance) {
                minDistance = distance;
                closestMove = move;
            }
        });
    
        entity.cell = closestMove;
    }
    
    
    function calculateDistance(cell1, cell2) {
        return Math.abs(cell1[0] - cell2[0]) + Math.abs(cell1[1] - cell2[1]);
    }
    
    

    function checkForCapture(entity) {
        if (entity.isIt) return;
    
        let itEntity = entities.find(e => e.isIt);
        if (isSameCell(entity.cell, itEntity.cell)) {
            swapRoles(itEntity.name, entity.name); // Swapping roles and updating score
            transferItStatus(itEntity, entity);    // Additional logic if needed
        }
    }
    

function transferItStatus(fromEntity, toEntity) {
    // Transfer 'isIt' status and movement distance
    fromEntity.isIt = false;
    toEntity.isIt = true;
    let tempMoveDistance = fromEntity.moveDistance;
    fromEntity.moveDistance = toEntity.moveDistance;
    toEntity.moveDistance = tempMoveDistance;

    // Move the old "IT" to a random open position
    moveEntityToRandomOpenPosition(fromEntity);

    //increase transfer counter
    transferCounter++
    console.log(transferCounter)
}
function moveEntityToRandomOpenPosition(entity) {
    let openPositions = [];

    // Find all open positions on the grid
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            let position = [i, j];
            if (isPositionOpen(position)) {
                openPositions.push(position);
            }
        }
    }

    // Choose a random open position
    if (openPositions.length > 0) {
        let randomPosition = openPositions[Math.floor(Math.random() * openPositions.length)];
        entity.cell = randomPosition;
    }
}
function swapRoles(currentIt, newIt) {
    entities.forEach(entity => {
        if (entity.name === currentIt) {
            entity.isIt = false;
        }
        if (entity.name === newIt) {
            entity.isIt = true;
            entity.score += 1; // Increment score for the entity that becomes 'it'
        }
    });

    updateScoreDisplay(); // Update the score display
}
function updateScoreDisplay() {
    entities.forEach(entity => {
        let scoreElement = document.getElementById(entity.name + '-score');
        if (scoreElement) {
            scoreElement.textContent = `${entity.name.toUpperCase()} - Score: ${entity.score}, Movement Range: ${entity.moveDistance}`;
        }
    });
}


function isPositionOpen(position) {
    for (let entity of entities) {
        if (isSameCell(entity.cell, position)) {
            return false;
        }
    }
    return true;
}
function updateCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('blue', 'green', 'orange', 'purple', 'red', 'it');
        entities.forEach(entity => {
            if (isSameCell([parseInt(cell.dataset.row), parseInt(cell.dataset.col)], entity.cell)) {
                cell.classList.add(entity.name);
                if (entity.isIt) {
                    cell.classList.add('it');
                }
            }
        });
    });

    // Update the score display after updating cells
    updateScoreDisplay();
}


    function getEntityClass(entity) {
        // Utilize the 'name' property of the entity for the class
        return entity.name;
    }

    function isSameCell(cell1, cell2) {
        return cell1[0] === cell2[0] && cell1[1] === cell2[1];
    }

    function updateObstacle() {
        if (obstacleCell[0] === 0) movingUp = false;
        if (obstacleCell[0] === 6) movingUp = true;

        obstacleCell[0] += movingUp ? -1 : 1;
        // Ensure the obstacle doesn't go out of bounds
        obstacleCell[0] = Math.max(0, Math.min(obstacleCell[0], 6));
    }

    function isValidMove(move, entity) {
        // Check grid boundaries and obstacles
        if (move[0] < 0 || move[0] >= 7 || move[1] < 0 || move[1] >= 7 || isObstacleCell(move[0], move[1])) {
            return false;
        }
    
        // Check collision with other entities
        for (let other of entities) {
            if (other !== entity && isSameCell(move, other.cell)) {
                // Allow moving into the cell if the other entity is "IT" and the current entity is not
                if (other.isIt && !entity.isIt) {
                    return true;
                }
                return false;
            }
        }
    
        return true;
    }
    
    

    function isObstacleCell(row, col) {
        return row === obstacleCell[0] && col === obstacleCell[1];
    }

    updateObstacle(); // Initialize the obstacle's position
    updateCells();    // Update cells initially
    gameLoop();       // Start the game loop
});
