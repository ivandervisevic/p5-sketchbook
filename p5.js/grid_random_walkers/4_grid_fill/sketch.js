"use strict";

var lineX, lineY;
var angleIncrement;
var side, diagonal;
var xPositions, yPositions, colors, increments;
var numSnakes;
var gridWidth, gridHeight;

var quadrantMap;
var backgroundGrid;

function setup() {
    createCanvas(1000, 800);
    colorMode(HSB, 100);
    frameRate(20);
    background(0, 0, 100);

    numSnakes = 4;
    xPositions = [];
    yPositions = [];
    colors = [];
    increments = [];
    angleIncrement = PI/4;
    side = 10;
    gridWidth = Math.floor(width/side);
    gridHeight = Math.floor(height/side);
    backgroundGrid = new Array(gridWidth);
    for (var i = 0; i < gridWidth; ++i) {
        backgroundGrid[i] = []
        for (var j = 0; j < gridHeight; ++j) {
            backgroundGrid[i][j] = color(0, 0, 100);
            stroke(0, 0, 0, 20);
            noFill();
            ellipse(i*side, j*side, 5, 5);
        }
    }

    quadrantMap = initQuadrants();;
    
    for (var i = 0; i < numSnakes; i++) {
        colors[i] = color(Math.round(random(0, 100)), 100, 100, 30);
        xPositions[i] = Math.floor(random(gridWidth/4, 3*gridWidth/4));
        yPositions[i] = Math.floor(random(gridHeight/4, 3*gridHeight/4));
        increments[i] = getIncrement(Math.round(random(0, 7)), xPositions[i], yPositions[i], gridWidth, gridHeight, quadrantMap);
    }
    noFill();
}

function draw() {
    for (var i = 0; i < numSnakes; i++) {
        var inside = false;
        while(!inside) {
            increments[i] = getIncrement(increments[i], xPositions[i], yPositions[i], gridWidth, gridHeight, quadrantMap);
            var lineLen;
            var xPos, yPos;
            var angle = angleIncrement*increments[i];
            if (increments[i] % 2 == 0) {
                xPos = xPositions[i] + cos(angle);
                yPos = yPositions[i] + sin(angle);
                
            } else {
                xPos = xPositions[i] + Math.round(cos(angle));
                yPos = yPositions[i] + Math.round(sin(angle));
                
            }
            if (xPos < 0 || xPos > gridWidth || yPos < 0 || yPos > gridHeight) {
                inside = false;
            } else {
                inside = true;
            }
        }
        stroke(colors[i]);
        line(side*xPositions[i], side*yPositions[i], side*xPos, side*yPos);
        backgroundGrid[xPos, yPos] = colors[i];
        noStroke();
        fill(colors[i]);
        ellipse(side*xPos, side*yPos, 5, 5);
        xPositions[i] = xPos;
        yPositions[i] = yPos;
    }
}

// TODO: fix me up so that I return weighted directions
function getIncrement(prev, lineX, lineY, w, h, quadrantMap) {
    var res;
    var quadrant = getQuadrant(lineX, lineY, w, h);
    var dirs = quadrantMap[quadrant];
    do {
        if (random(0, 1) > 0.4) {
            res = Math.round(random(prev - 1, prev + 1));
        } else {
            res = Math.round(random(0, 8));
        }
        if (quadrant != 5) {
            if (random(0,1) > 0.65) {
                res = Math.round(random(dirs[0], dirs[1]));
            }
        }
    } while ((res-4) == prev || res + 4 == prev);
    return res;
}

function initQuadrants() {
    var quadrantMap = []
    quadrantMap[1] = [0, 2];
    quadrantMap[2] = [-2, 2]
    quadrantMap[3] = [-2, 0]
    quadrantMap[4] = [0, 4];
    quadrantMap[5] = [0, 8];
    quadrantMap[6] = [4, 8];
    quadrantMap[7] = [2, 4];
    quadrantMap[8] = [2, 6];
    quadrantMap[9] = [4, 6];
    return quadrantMap;
}

function getQuadrant(x, y, w, h) {
    var quadrant = 5;
    if (x < w/5) {
        if (y < h/5) {
            quadrant = 1;
        } else if (y > 4*h/5) {
            quadrant = 3;
        } else {
            quadrant = 2
        }
    } else if (x > 4*w/5) {
        if (y < h/5) {
            quadrant = 7;
        } else if (y > 4*h/5) {
            quadrant = 9;
        } else {
            quadrant = 8
        }
    } else if (y < h/5) {
        quadrant = 4
    } else if (y > 4*h/5) {
        quadrant = 6;
    }
    return quadrant;
}
