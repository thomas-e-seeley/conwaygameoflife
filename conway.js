// conway.js
var conway = ( function() {
	var _iterState = 0;	// 0 or 1
	var _cellStates = new Array("dead", "live");
	var _rows = 6;	// default
	var _cols = 8;	// default
	var _brd0;
	var _brd1;
	var _thisBoard;
	var _nextBoard;
	
	function _createBoard(r,c) {
		var board = new Array();
		for (var i=0; i < r; ++i) {
			board[i] = new Array();
			for (var j=0; j < c; ++j) {
				board[i][j] = 0;	// all cells are dead
			}
		}
		return board;
	}
	
	function _getRowsFromView() {
		console.log("in Conway _getRowsFromView");
		return document.getElementById("_height").value || 6;
	}
	// used by Row input's callback
	function _updateModelRowsFromView() {
		console.log("in Conway _updateModelRowsFromView");
		var rows = _getRowsFromView();
		if (_rows != rows) {
			_rows = rows;
			_init();
		}
	}
	
	function _getColsFromView() {
		console.log("in Conway _getColsFromView");
		return document.getElementById("_width").value || 8;
	}
	// used by Column input's callback
	function _updateModelColsFromView() {
		console.log("in Conway _updateModelColsFromView");
		var cols = _getColsFromView();
		if (_cols != cols) {
			_cols = cols;
			_init();
		}
	}
	
	function _setIterState(s) {
		_iterState = s;
		if (_iterState == 0) {
			_thisBoard = _brd0;
			_nextBoard = _brd1;
		} else {
			_thisBoard = _brd1;
			_nextBoard = _brd0;
		}
		_updateViewFromModel(_thisBoard);
	}
	function _getIterState() {
		return _iterState;
	}
	function _flipIterState() {
		var newState = (_iterState != 0) ? 0 : 1;
		_setIterState(newState);
	}
	
	function _updateTableFromBoard() {
		for (var i=0; i < _rows; ++i) {
			for (var j=0; j < _cols; ++j) {
				var id = "td" + (i*_cols + j);
				var td = document.getElementById(id);
				var cs = _thisBoard[i][j];
				if (td.className != _cellStates[cs]) {
					td.className = _cellStates[cs];
				}
			}
		}
	}
	
	function _updateViewFromModel(board) {
		var gametable = document.getElementById("gameboard");
		gametable.innerHTML = "";
		for (var i=0; i < _rows; ++i) {
			var trow = document.createElement("tr");
			for (var j=0; j < _cols; ++j) {
				var tdat = document.createElement("td");
				var att1 = document.createAttribute("class");
				att1.value = _cellStates[board[i][j]];
				tdat.setAttributeNode(att1);
				var att2 = document.createAttribute("id");
				var tdid = "td" + (i*_cols + j);
				att2.value = tdid;
				tdat.setAttributeNode(att2);
				trow.appendChild(tdat);
			}
			gametable.appendChild(trow);
		}
	}
	
	function _flipCellState(index) {
		var col = index % _cols;
		var row = Math.floor(index / _cols);
		if (row < _rows) {
			var cellState = _thisBoard[row][col];
			cellState = (cellState != 0) ? 0 : 1;
			_thisBoard[row][col] = cellState;
			var tdid = "td" + index;
			var tdat = document.getElementById(tdid);
			tdat.className = _cellStates[cellState];
		}
	}
	
	function _getCellState(index) {
		var col = index % _cols;
		var row = Math.floor(index / _cols);
		if (row < _rows) {
			return _thisBoard[row][col];
		}
	}
	
	function _countLiveNeighbors(row, col) {
		var minrow = 0;
		var maxrow = _rows - 1;
		var mincol = 0;
		var maxcol = _cols - 1;
		var top = (row > minrow) ? row - 1 : minrow;
		var btm = (row < maxrow) ? row + 1 : maxrow;
		var lft = (col > mincol) ? col - 1 : mincol;
		var rgt = (col < maxcol) ? col + 1 : maxcol;
		var liveNeighbors = 0;
		for (var i=top; i <= btm; ++i) {
			for (var j=lft; j <= rgt; ++j) {
				if (_thisBoard[i][j] == 1)
					++liveNeighbors;
			}
		}
		liveNeighbors -= _thisBoard[row][col];
		return liveNeighbors;
	}

	// single mapping from old state to new state of Conway table
	function _iterate() {
		for (var i=0; i < _rows; ++i) {
			for (var j=0; j < _cols; ++j) {
				var alive = _countLiveNeighbors(i,j);
				if (_thisBoard[i][j] == 1) { // alive
					_nextBoard[i][j] = (2 <= alive && alive <= 3) ? 1 : 0;
				} else { // dead
					_nextBoard[i][j] = (alive == 3) ? 1 : 0;
				}
			}
		}
		_flipIterState();
	}
	
	function _countBoardLives(board) {
		var acc = 0;
		for (var i=0; i < _rows; ++i) {
			for (var j=0; j < _cols; ++j) {
				acc += board[i][j];
			}
		}	
		return acc;
	}

	function _countLives() {	
		return _countBoardLives(_thisBoard);
	}
	
	function _init() {
		_rows = _getRowsFromView();
		_cols = _getColsFromView();
		_brd0 = _createBoard(_rows, _cols);
		_brd1 = _createBoard(_rows, _cols);
		_setIterState(0);
	}
	
	return {
		flipCellState	: _flipCellState,
		getCellState	: _getCellState,
		updateModelRowsFromView	: _updateModelRowsFromView,
		updateModelColsFromView	: _updateModelColsFromView,
		countBoardLives	: _countBoardLives,
		countLives	: _countLives,
		createBoard	: _createBoard,
		getIterState	: _getIterState,
		setIterState	: _setIterState,
		iterate	: _iterate,
		init 	: _init
	}
})();		// end of Conway module