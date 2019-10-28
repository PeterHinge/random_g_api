//Session functions
function submit() {
	session.submitData(includePicture=true);
}

function clearCanvas() {
	session.clearDrawing();
}

//Drawing functions
function beginDraw(mousePosition) {
	session.isDrawing = true;
	session.timeStart = timeStart = Date.now()
}

function endDraw() {
	session.isDrawing = false;
	context.beginPath();
	if (session.currentX == []) return;
	session.xArray.push(session.currentX);
	session.yArray.push(session.currentY);
	session.tArray.push(session.currentT);
	session.currentX = [];
	session.currentY = [];
	session.currentT = [];
}

function draw(mousePosition) {
	session.draw(mousePosition);
}

//Main Program
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Resizing
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Instantiating drawing session
const session = new Session(canvas, context);

//Event listeners
canvas.addEventListener("mousedown", beginDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);
