"use strict";

var c = document.getElementById("pcb");
var ctx = c.getContext("2d");

c.width = 1366;
c.height = 768;
var gridSpacing = 6;
var lineWidth = 4;
var padSize = 4;

var width = Math.floor(c.width/gridSpacing);
var height = Math.floor(c.height/gridSpacing);

var gridState = [];
for (var x=0; x<width; x++) {
	gridState.push(Array(height));
}

var renderLine = function(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo((x1+0.5)*gridSpacing, (y1+0.5)*gridSpacing);
	ctx.lineTo((x2+0.5)*gridSpacing, (y2+0.5)*gridSpacing);
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';
	ctx.strokeStyle = '#4a4';
	ctx.stroke();
}

var renderPad = function(x, y) {
	ctx.beginPath();
	ctx.arc((x+0.5)*gridSpacing, (y+0.5)*gridSpacing, 3, 0, 2 * Math.PI, false);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#aaa';
	ctx.stroke();
}

var shuffle = function(array) {
	var counter = array.length;
	while (counter > 0) {
		var index = Math.floor(Math.random() * counter);
		counter--;
		var temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

var isEmpty = function(x, y) {
	return x>=0 && x<width && y>=0 && y<height && !gridState[x][y];
}

var getNeighbors = function(x, y) {
	return [[x-2, y-2], [x, y-2], [x+2, y-2], [x-2, y], [x+2, y], [x-2, y+2], [x, y+2], [x+2, y+2]];
}

var doLine = function(x0, y0, x1, y1) {
	var midX = (x0+x1)/2;
	var midY = (y0+y1)/2;
	if (!isEmpty(x1, y1) || !isEmpty(midX,midY)) return true;
	gridState[x1][y1] = true;
	gridState[midX][midY] = true;
	renderLine(x0, y0, x1, y1);
	var deadEnd = true;
	var angle = Math.atan2(x1-x0, y1-y0);
	
	[0, Math.PI/4, -Math.PI/4].forEach(function(da){
		var x2 = x1 + Math.round(Math.sin(angle + da))*2;
		var y2 = y1 + Math.round(Math.cos(angle + da))*2;
		if (Math.random() > 0.3) deadEnd &= doLine(x1, y1, x2, y2);
	});
	
	shuffle(getNeighbors(x1, y1)).forEach(function(pos){
		deadEnd &= doLine(x1, y1, pos[0], pos[1]);
	});
	
	if (deadEnd) renderPad(x1, y1);
}

doLine(0, 0, 0, 0);
