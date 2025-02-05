// Game.js test

class VoltorbFlip {
    constructor() {
        this.board = [];
        this.level = parseInt(localStorage.getItem('currentLevel')) || 1;
        this.totalCoins = parseInt(localStorage.getItem('totalCoins')) || 0;
        this.currentLevelCoins = 1;
        this.size = 5;
        this.gameBoard = document.getElementById('game-board');
        this.gameActive = true;
        
        this.initializeGame();
        
        // base64 encoded version of the Voltorb sprite
        const voltorbImageBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAWJJREFUOE+Nk71KA0EUhc/dzewm2WyIIQYTFBIRbMTCwkrBZ7AQX8FH8BF8BgtfwcZCsLGxEAQLEQQJKP6gYGJiflazs3eYWbKuEYxTDcy95/vOPTNL+C9wzlOc84xSqsEYy1JKGaV0Ryn1TSn9UEodKKV+AJwTQl4JIQdCiLemaV5ZlnXDGHuklK4BfAI4BXAhhDgWQiwZY+8AHhhjy5TSewAvUsptAHsALqWUO0qpHQCPhJA1pdQWgFsAG0KIdQD7jLFbznmLc/4M4APAupTyBcCxlHIJwEkURc0gCL5M0xwahvHFGBsD6AVB0I2iqCOl7ANoK6XalNIRIWRIKR1yzgeGYQw457dSylUp5QaANqV0EcB5kiRz/X5/No7jmTRNm3Ecz/d6vbkkSWbjOJ5SSs2naVrXWlc45xVKaY1zXqeUlhhjRQCFP1sKhUKOMVbSWpc552XOeY1SWtVaV7TWVa11DUCREPILhxqhhCT8YZ8AAAAASUVORK5CYII=`;

        // Create and add the Voltorb image to the document
        const voltorbImage = new Image();
        voltorbImage.src = voltorbImageBase64;
        voltorbImage.style.display = 'none';
        voltorbImage.id = 'voltorb-sprite';
        document.body.appendChild(voltorbImage);
    }

    initializeGame() {
        this.gameActive = true;
        this.createBoard();
        this.renderBoard();
        this.updateDisplay();
    }

    createBoard() {
        // Reset board
        this.board = [];
        
        // Create empty board
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = {
                    value: undefined,
                    revealed: false
                };
            }
        }

        // Place numbers based on level
        this.generateValidBoard();
    }

    generateValidBoard() {
        // Clear the board first
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = {
                    value: undefined,
                    revealed: false
                };
            }
        }

        // Set number of tiles based on level according to the original game
        let voltorbCount, oneCount, twoCount, threeCount;
        
        switch(this.level) {
            case 1:
                voltorbCount = 5;
                oneCount = 12;
                twoCount = 3;
                threeCount = 1;
                break;
            case 2:
                voltorbCount = 6;
                oneCount = 8;
                twoCount = 4;
                threeCount = 2;
                break;
            case 3:
                voltorbCount = 7;
                oneCount = 6;
                twoCount = 4;
                threeCount = 3;
                break;
            case 4:
                voltorbCount = 8;
                oneCount = 5;
                twoCount = 5;
                threeCount = 3;
                break;
            case 5:
                voltorbCount = 9;
                oneCount = 3;
                twoCount = 6;
                threeCount = 3;
                break;
            case 6:
                voltorbCount = 10;
                oneCount = 3;
                twoCount = 5;
                threeCount = 4;
                break;

        }
        
        // Place Voltorbs (0s)
        for (let i = 0; i < voltorbCount; i++) {
            this.placeRandomValue(0);
        }
        
        // Place 1s
        for (let i = 0; i < oneCount; i++) {
            this.placeRandomValue(1);
        }
        
        // Place 2s
        for (let i = 0; i < twoCount; i++) {
            this.placeRandomValue(2);
        }
        
        // Place 3s
        for (let i = 0; i < threeCount; i++) {
            this.placeRandomValue(3);
        }
        
        // Fill any remaining spaces with 1s
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].value === undefined) {
                    this.board[i][j].value = 1;
                }
            }
        }
    }

    placeRandomValue(value) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            if (this.board[row][col].value === undefined) {
                this.board[row][col].value = value;
                placed = true;
            }
        }
    }

    renderBoard() {
        // Clear the main game board
        this.gameBoard.innerHTML = '';
        
        // Calculate row and column totals
        const rowTotals = Array(this.size).fill().map(() => ({ sum: 0, voltorbs: 0 }));
        const colTotals = Array(this.size).fill().map(() => ({ sum: 0, voltorbs: 0 }));
        
        // Calculate sums and voltorb counts
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const value = this.board[i][j].value;
                rowTotals[i].sum += value;
                colTotals[j].sum += value;
                if (value === 0) {
                    rowTotals[i].voltorbs++;
                    colTotals[j].voltorbs++;
                }
            }
        }
        
        // Render the main game tiles
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tile = document.createElement('button');
                tile.className = 'tile';
                tile.dataset.row = i;
                tile.dataset.col = j;
                
                if (this.board[i][j].revealed) {
                    const value = this.board[i][j].value;
                    tile.classList.add('revealed');
                    
                    if (value === 0) {
                        // Create and add Voltorb image instead of text
                        const voltorbImg = document.createElement('img');
                        voltorbImg.src = 'images/voltorb.png';
                        voltorbImg.style.width = '85%';
                        voltorbImg.style.height = '60%';
                        tile.appendChild(voltorbImg);
                        tile.classList.add('voltorb');
                    } else {
                        tile.textContent = value;
                    }
                }
                
                tile.addEventListener('click', () => this.flipTile(i, j));
                this.gameBoard.appendChild(tile);
            }
        }

        // Render row and column indicators
        this.renderIndicators(rowTotals, colTotals);
    }

    renderIndicators(rowTotals, colTotals) {
        // Render row indicators
        const rowContainer = document.getElementById('row-indicators');
        rowContainer.innerHTML = '';
        rowTotals.forEach(({ sum, voltorbs }) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            
            // Sum display
            const sumDiv = document.createElement('div');
            sumDiv.textContent = sum;
            
            // Voltorb counter with icon
            const voltorbDiv = document.createElement('div');
            voltorbDiv.className = 'voltorb-counter';
            
            const voltorbIcon = document.createElement('div');
            voltorbIcon.className = 'voltorb-icon';
            
            const voltorbCount = document.createElement('span');
            voltorbCount.textContent = voltorbs;
            
            voltorbDiv.appendChild(voltorbIcon);
            voltorbDiv.appendChild(voltorbCount);
            
            indicator.appendChild(sumDiv);
            indicator.appendChild(voltorbDiv);
            rowContainer.appendChild(indicator);
        });

        // Similar update for column indicators
        const colContainer = document.getElementById('col-indicators');
        colContainer.innerHTML = '';
        colTotals.forEach(({ sum, voltorbs }) => {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            
            const sumDiv = document.createElement('div');
            sumDiv.textContent = sum;
            
            const voltorbDiv = document.createElement('div');
            voltorbDiv.className = 'voltorb-counter';
            
            const voltorbIcon = document.createElement('div');
            voltorbIcon.className = 'voltorb-icon';
            
            const voltorbCount = document.createElement('span');
            voltorbCount.textContent = voltorbs;
            
            voltorbDiv.appendChild(voltorbIcon);
            voltorbDiv.appendChild(voltorbCount);
            
            indicator.appendChild(sumDiv);
            indicator.appendChild(voltorbDiv);
            colContainer.appendChild(indicator);
        });
    }

    flipTile(row, col) {
        if (!this.gameActive || this.board[row][col].revealed) return;
        
        this.board[row][col].revealed = true;
        const value = this.board[row][col].value;
        
        if (value === 0) {
            // Hit a Voltorb
            this.gameActive = false;
            this.currentLevelCoins = 0;
            
            // Sequential reveal animation
            let currentTile = 0;
            const revealInterval = setInterval(() => {
                const currentRow = Math.floor(currentTile / this.size);
                const currentCol = currentTile % this.size;
                
                if (currentTile >= this.size * this.size) {
                    clearInterval(revealInterval);
                    
                    // After revealing all tiles, wait a moment then reset
                    setTimeout(() => {
                        // Go back one level unless at level 1
                        if (this.level > 1) {
                            this.level--;
                            localStorage.setItem('currentLevel', this.level);
                        }
                        this.initializeGame();
                    }, 1000);
                    
                    return;
                }
                
                // Reveal current tile
                this.board[currentRow][currentCol].revealed = true;
                this.renderBoard();
                
                currentTile++;
            }, 50); // Reveal a new tile every 50ms
            
        } else {
            // Multiply the current level coins by the tile value
            this.currentLevelCoins *= value;
            
            if (this.checkWinCondition()) {
                // Reveal all tiles
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {
                        this.board[i][j].revealed = true;
                    }
                }
                
                // Calculate total points on the board
                let boardTotal = 1;
                for (let i = 0; i < this.size; i++) {
                    for (let j = 0; j < this.size; j++) {
                        if (this.board[i][j].value > 0) {
                            boardTotal *= this.board[i][j].value;
                        }
                    }
                }
                
                // Add the board total to player's total coins
                this.totalCoins += boardTotal;
                localStorage.setItem('totalCoins', this.totalCoins);
                this.level = Math.min(7, this.level + 1);
                localStorage.setItem('currentLevel', this.level);
                
                // Update the board to show all tiles
                this.renderBoard();
                this.updateDisplay();
                
                setTimeout(() => {
                    alert(`Level Complete! You earned ${boardTotal} coins!`);
                    this.currentLevelCoins = 1;
                    this.initializeGame();
                }, 1000);
                
                return;
            }
        }
        
        this.renderBoard();
        this.updateDisplay();
    }

    checkWinCondition() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if ((this.board[i][j].value === 2 || this.board[i][j].value === 3) && 
                    !this.board[i][j].revealed) {
                    return false;
                }
            }
        }
        return true;
    }

    updateDisplay() {
        document.getElementById('total-coins').textContent = this.totalCoins;
        document.getElementById('level-coins').textContent = this.currentLevelCoins;
        document.getElementById('current-level').textContent = this.level;
        
        localStorage.setItem('totalCoins', this.totalCoins);
        localStorage.setItem('currentLevel', this.level);
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new VoltorbFlip();
});

// Modify the updateScore function to save to localStorage
function updateScore(points) {
    totalCoins += points;
    document.getElementById('total-coins').textContent = totalCoins;
    // Save to localStorage whenever the score changes
    localStorage.setItem('totalCoins', totalCoins);
}

// Add a function to reset the score if needed
function resetScore() {
    totalCoins = 0;
    localStorage.setItem('totalCoins', totalCoins);
    document.getElementById('total-coins').textContent = totalCoins;
}