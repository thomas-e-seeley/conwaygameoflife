// callbacks.js
var aniframe = null;
var running = false;
var start = null;
var iteration = 0;
var itercount = 0;
var hintelmt = document.getElementById('_hint');

function sleep(delay) {
	var start = new Date().getTime();
	while (new Date().getTime() < start + delay)
		/*wait*/;
}
	
function clearChildren(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}		
}
// reset the hint after iterations have completed
function resetHint() {		
	var hint = "Click on squares below to change their state";
	clearChildren(hintelmt);
	hintelmt.appendChild(document.createTextNode(hint));
}
function setHint() {
	var hint = "Iteration(" + (iteration+1) + ")";
	clearChildren(hintelmt);
	hintelmt.appendChild(document.createTextNode(hint));
}

function setAniframe(frame) {
	if (frame == null) { // reset aniframe
		cancelAnimationFrame(aniframe);
		running = false;
		iteration = 0;
		document.getElementById("startstop").value = "Start";
	} else /* non-null */ {
		running = true;
		document.getElementById("startstop").value = "Cancel";
	}
	aniframe = frame;
}

function step(timestamp) {
	if (!start) {
		iteration = 0;
		start = timestamp;
	} else {
		++iteration;
	}
	conway.iterate();	// update the view
	setHint();
	sleep(500);
	if (iteration < (itercount-1)) {
		aniframe = window.requestAnimationFrame(step);
	} else {
		resetHint();
		start = null;
		setAniframe(null);
	}
}		

// callback for Start button
function runIterations() {
	if (conway.countLives() == 0) {
alert("Please click on some tiles to enliven them before clicking the Start button");
	} else if (running) { // cancel running
		setAniframe(null);
	} else { // start running
		itercount = document.getElementById("_steps").value;
		setAniframe( window.requestAnimationFrame(step) );
	}
}

// callback for Conway table
function flipCellState(event) {
	var elmtid = event.target.id;
	var elmttype = elmtid.substring(0,2);
	if (elmttype === "td") {
		var elmtindex = elmtid.substring(2);
		conway.flipCellState(elmtindex);
	}
}

// callback for Rows input
function updateRows() {
	console.log("in updateRows");
	conway.updateModelRowsFromView();
}

// callback for Columns input
function updateCols() {
	console.log("in updateCols");
	conway.updateModelColsFromView();
}

function ConwayOnload() {
	conway.init();
}