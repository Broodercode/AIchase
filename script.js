document.addEventListener("DOMContentLoaded", function () {
    const grid = document.getElementById('grid');
    let s1Cell = [0, 0]; // Starting position of S1
    let s2Cell = [6, 6]; // Starting position of S2
    let s3Cell = [1, 1]; // Starting position of S3
    let s4Cell = [5, 5]; // Starting position of S4    
    let dCell = [3, 3]; // Starting position of D
    let obstacleCell = [6, 3]; // Starting position of the obstacle
    let movingUp = true; // Direction of movement for the obstacle
    let s1MoveDistance = 1; // Movement distance for S1
    let s2MoveDistance = 1; // Movement distance for S2
    let dMoveDistance = 2; // Movement distance for D
    let gameActive = true; // Tracks if the game is active

    // Initialize the grid
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
        }
    }

    updateObstacle(); // Initialize the obstacle's position
    updateCells();
    gameLoop();

    function gameLoop() {
        if (!gameActive) return;
    
        const initialDPosition = [...dCell];
        updateObstacle();
    
        moveS1AndCheck();
        setTimeout(() => {
            moveS2AndCheck();
            setTimeout(() => {
                moveS3AndCheck();
                setTimeout(() => {
                    moveS4AndCheck();
                    setTimeout(() => {
                        moveD();
                        setTimeout(() => {
                            moveD(initialDPosition);
                            setTimeout(gameLoop, 400);
                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    }
    


    function updateCells() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('s1', 's2', 's3', 's4', 'd', 'obstacle');
            cell.textContent = ''; // Clear previous numbers
    
            const row = parseInt(cell.dataset.row, 10);
            const col = parseInt(cell.dataset.col, 10);
    
            if (isObstacleCell(row, col)) {
                cell.classList.add('obstacle');
            } else {
                setCellBasedOnPosition(row, col, cell);
            }
        });
    }
    
    function setCellBasedOnPosition(row, col, cell) {
        if (isSameCell([row, col], s1Cell)) {
            cell.classList.add('s1');
            cell.textContent = 'C';
        } else if (isSameCell([row, col], s2Cell)) {
            cell.classList.add('s2');
            cell.textContent = 'C';
        } else if (isSameCell([row, col], s3Cell)) {
            cell.classList.add('s3');
            cell.textContent = 'C';
        } else if (isSameCell([row, col], s4Cell)) {
            cell.classList.add('s4');
            cell.textContent = 'C';
        } else if (isSameCell([row, col], dCell)) {
            cell.classList.add('d');
            cell.textContent = 'IT';
        }
    }
    
    function moveS1AndCheck() {
        moveS1();
        if (isSameCell(s1Cell, dCell)) {
            swapRoles(s1Cell, 's1');
        }
    }
    
    function moveS2AndCheck() {
        moveS2();
        if (isSameCell(s2Cell, dCell)) {
            swapRoles(s2Cell, 's2');
        }
    }
    
    function moveS3AndCheck() {
        moveS3();
        if (isSameCell(s3Cell, dCell)) {
            swapRoles(s3Cell, 's3');
        }
    }
    
    function moveS4AndCheck() {
        moveS4();
        if (isSameCell(s4Cell, dCell)) {
            swapRoles(s4Cell, 's4');
        }
    }
    

    function moveS1() {
        for (let i = 0; i < s1MoveDistance; i++) {
            s1Cell = moveTowards(s1Cell, dCell);
        }
        if (isSameCell(s1Cell, dCell)) {
            swapRoles(s1Cell, 's1');
        }
        updateCells();
    }
    
    function moveS2() {
        for (let i = 0; i < s2MoveDistance; i++) {
            s2Cell = moveTowards(s2Cell, dCell);
        }
        if (isSameCell(s2Cell, dCell)) {
            swapRoles(s2Cell, 's2');
        }
        updateCells();
    }

    
    function moveS3() {
        for (let i = 0; i < s1MoveDistance; i++) {
            s3Cell = moveTowards(s3Cell, dCell);
        }
        if (isSameCell(s3Cell, dCell)) {
            swapRoles(s3Cell, 's3');
        }
        updateCells();
    }

    function moveS4() {
        for (let i = 0; i < s2MoveDistance; i++) {
            s4Cell = moveTowards(s4Cell, dCell);
        }
        if (isSameCell(s4Cell, dCell)) {
            swapRoles(s4Cell, 's4');
        }
        updateCells();
    }

    function swapRoles(capturingCell, capturingBlock) {
        let formerDPosition = [...dCell]; // Store former D's (IT's) position
    
        // The capturing block becomes the new IT
        dCell = [...capturingCell];
    
        // Move the former IT (D) to a random empty cell
        let randomEmptyCell = getRandomEmptyCell();
    
        // Update positions of all single movers
        if (capturingBlock !== 's1') {
            s1Cell = (capturingBlock === 's2') ? formerDPosition : randomEmptyCell;
        }
        if (capturingBlock !== 's2') {
            s2Cell = (capturingBlock === 's1') ? formerDPosition : randomEmptyCell;
        }
        if (capturingBlock !== 's3') {
            s3Cell = (capturingBlock === 's4') ? formerDPosition : randomEmptyCell;
        }
        if (capturingBlock !== 's4') {
            s4Cell = (capturingBlock === 's3') ? formerDPosition : randomEmptyCell;
        }
    
        // Update classes and labels
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell'; // Reset all classes
            const row = parseInt(cell.dataset.row, 10);
            const col = parseInt(cell.dataset.col, 10);
            setCellBasedOnPosition(row, col, cell);
        });
    }

    

    
    function getRandomEmptyCell() {
        let emptyCells = [];
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                if (!isSameCell([row, col], s1Cell) && !isSameCell([row, col], s2Cell) && !isSameCell([row, col], dCell) && !isObstacleCell(row, col)) {
                    emptyCells.push([row, col]);
                }
            }
        }
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function moveD(avoidCell) {
        let previousPosition = [...dCell];
    
        for (let i = 0; i < dMoveDistance; i++) {
            let potentialPosition = moveAwayFrom(dCell, avoidCell, s1Cell, s2Cell);
    
            if (!isSameCell(potentialPosition, previousPosition) && !isOccupied(potentialPosition)) {
                dCell = potentialPosition;
                previousPosition = [...dCell];
            } else {
                // If the potential position is not valid, try a different direction
                potentialPosition = moveAwayFrom(dCell, previousPosition, s1Cell, s2Cell);
                if (!isOccupied(potentialPosition)) {
                    dCell = potentialPosition;
                }
            }
    
            updateCells();
        }
    }

    function moveTowards(currentCell, targetCell) {
        const rowDiff = targetCell[0] - currentCell[0];
        const colDiff = targetCell[1] - currentCell[1];
    
        let nextRow = currentCell[0] + Math.sign(rowDiff);
        let nextCol = currentCell[1] + Math.sign(colDiff);
    
        nextRow = Math.max(0, Math.min(6, nextRow));
        nextCol = Math.max(0, Math.min(6, nextCol));
    
        // Check if the next position is occupied by another single-mover or the obstacle
        if (isValidMove([nextRow, nextCol]) && !isOccupiedBySingleMover([nextRow, nextCol], currentCell)) {
            return [nextRow, nextCol];
        }
        return currentCell; // Stay in place if the next position is occupied
    }
    
    function isOccupiedBySingleMover(cell, excludingCell) {
        const otherCells = [s1Cell, s2Cell, s3Cell, s4Cell].filter(c => !isSameCell(c, excludingCell));
        return otherCells.some(c => isSameCell(c, cell));
    }
    
    

    function moveAwayFrom(currentCell, avoidCell, ...otherCells) {
        const potentialMoves = [
            [currentCell[0] + 1, currentCell[1]],
            [currentCell[0] - 1, currentCell[1]],
            [currentCell[0], currentCell[1] + 1],
            [currentCell[0], currentCell[1] - 1]
        ].filter(move => isValidMove(move) && (avoidCell == null || !isSameCell(move, avoidCell)));
    
        let bestMove = currentCell;
        let maxDistance = -Infinity;
        potentialMoves.forEach(move => {
            if (!isOccupied(move)) {
                const totalDistance = otherCells.reduce((sum, cell) => sum + calculateDistance(move, cell), 0);
                if (totalDistance > maxDistance) {
                    maxDistance = totalDistance;
                    bestMove = move;
                }
            }
        });
    
        return bestMove;
    }
    function isOccupied(cell) {
        return isSameCell(cell, s1Cell) || isSameCell(cell, s2Cell) || isSameCell(cell, dCell) || isObstacleCell(cell[0], cell[1]);
    }
    
    function updateObstacle() {
        if (obstacleCell[0] === 0) movingUp = false;
        if (obstacleCell[0] === 6) movingUp = true;
    
        obstacleCell[0] += movingUp ? -1 : 1;
    }

    function isObstacleCell(row, col) {
        return row === obstacleCell[0] && col === obstacleCell[1];
    }

    function calculateDistance(cell1, cell2) {
        return Math.pow(cell1[0] - cell2[0], 2) + Math.pow(cell1[1] - cell2[1], 2);
    }

    function isValidMove(move) {
        return move[0] >= 0 && move[0] < 7 && move[1] >= 0 && move[1] < 7 && !isObstacleCell(move[0], move[1]);
    }

    function isSameCell(cell1, cell2) {
        return cell1 && cell2 && cell1[0] === cell2[0] && cell1[1] === cell2[1];
    }
});
