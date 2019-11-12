class Session {
	constructor(canvas, context) {
		//Data storage
		this.xArray = [];
		this.yArray = [];
		this.tArray = [];
		this.currentX = []; 
		this.currentY = []; 
		this.currentT = []; 

		this.canvas = canvas;
		this.context = context;

		//Possible symbols
		this.symbolLabels = [["SFGPUCA-----", "Friendly Armored"], ["SFGPUCF-----", "Friendly Artillery"], ["SFGPUCI-----", "Friendly Infantry"], 
		["SFGPUCR-----", "Friendly Reconnaisance"], ["SHGPUCA-----", "Hostile Armored"], ["SHGPUCF-----", "Hostile Artillery"], 
		["SHGPUCI-----", "Hostile Infantry"], ["SHGPUCR-----", "Hostile Reconnaisance"]];

		//Drawing-size, Image and binary pixel array
		this.x1 = null;
		this.y1 = null;
		this.x2 = null;
		this.y2 = null;
		this.userDrawing = null;
		this.userDrawingArray = [];

		//Sets current symbol-values
		this.isDrawing = false;
		this.timeStart = null;
		this.currentSymbol = this.symbolLabels[Math.floor(this.symbolLabels.length * Math.random())];
		this.currentSymbolCode = this.currentSymbol[0]
		this.currentSymbolName = this.currentSymbol[1]
		this.currentSymbolImage = document.createElement("img");
		this.currentSymbolImage.src = this.currentSymbolCode + ".png";
		this.currentSymbolImage2 = document.createElement("img");
		this.currentSymbolImage2.src = this.currentSymbolCode + ".png";

		//Sends current symbol-values and drawings to HTML
		document.getElementById("postSessionScreenBody1").appendChild(this.currentSymbolImage);
		document.getElementById("preSessionScreenBody1").appendChild(this.currentSymbolImage2);
		document.getElementById("symbolToDraw1").innerHTML = this.currentSymbolName
		document.getElementById("symbolToDraw2").innerHTML = this.currentSymbolName
	}

	clearDrawing() {
		//Clearing canvas and data storage
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.xArray = [];
		this.yArray = [];
		this.tArray = [];
		this.x1 = null;
		this.y1 = null;
		this.x2 = null;
		this.y2 = null;
	}

	draw(mousePosition) {

		if (!this.isDrawing) return;

		//Drawing to canvas 
		this.context.lineWidth = 10;
		this.context.lineCap = "round";
		this.context.lineTo(mousePosition.clientX, mousePosition.clientY -55);
		this.context.stroke();
		this.context.beginPath();
		this.context.moveTo(mousePosition.clientX, mousePosition.clientY -55);

		//Collects data on drawing
		this.currentX.push(mousePosition.clientX);
		this.currentY.push(mousePosition.clientY);
		this.currentT.push(Date.now() - this.timeStart);

		//Resizing drawing-size
		if (!this.x1 || mousePosition.clientX < this.x1) {
			this.x1 = mousePosition.clientX
		}
		if (!this.y1 || mousePosition.clientY < this.y1) {
			this.y1 = mousePosition.clientY
		}
		if (!this.x2 || mousePosition.clientX > this.x2) {
			this.x2 = mousePosition.clientX
		}
		if (!this.y2 || mousePosition.clientY > this.y2) {
			this.y2 = mousePosition.clientY
		}

	}

	submitData(simpleData=true) {
		this.captureDrawing()

		//Preparing data
		if (simpleData) {
			for (let i=0; i<this.xArray.length; i++ ){
			    for (let j=0; j<this.xArray[i].length; j++){
			    	this.xArray[i][j] -= this.x1		     
			    }
			}
			for (let i=0; i<this.yArray.length; i++ ){
			    for (let j=0; j<this.yArray[i].length; j++){
			    	this.yArray[i][j] -= this.y1		     
			    }
			}
		}

		let dataToSend = [this.xArray.toString(), this.yArray.toString(), this.tArray.toString(), this.userDrawingArray.toString(), this.currentSymbolName.toString()];

		//google.script.run.submitToSheets(dataToSend)

		this.clearDrawing();

		//Shows current drawing on post drawing screen
		document.getElementById("symbolToDraw3").innerHTML = this.currentSymbolName

		//Removing the old symbol image and adding the one corresponding to the currently drawn symbol
		document.getElementById("postSessionScreenBody1").removeChild(this.currentSymbolImage);
		this.currentSymbolImage = document.createElement("img");
		this.currentSymbolImage.src = this.currentSymbolCode + ".png";
		document.getElementById("postSessionScreenBody1").appendChild(this.currentSymbolImage);

		//Updating the next symbol to draw and shows it on pre drawing screen
		this.currentSymbol = this.symbolLabels[Math.floor(this.symbolLabels.length * Math.random())];
		this.currentSymbolName = this.currentSymbol[1]
		this.currentSymbolCode = this.currentSymbol[0]
		document.getElementById("symbolToDraw1").innerHTML = this.currentSymbolName
		document.getElementById("symbolToDraw2").innerHTML = this.currentSymbolName

		document.getElementById("preSessionScreenBody1").removeChild(this.currentSymbolImage2);
		this.currentSymbolImage2 = document.createElement("img");
		this.currentSymbolImage2.src = this.currentSymbolCode + ".png";
		document.getElementById("preSessionScreenBody1").appendChild(this.currentSymbolImage2);

	}

	captureDrawing() {
		//Update user drawing
		if (this.userDrawing) {
			document.getElementById("postSessionScreenBody2").removeChild(this.userDrawing);
		}
		let newCanvas = document.createElement('canvas');
		newCanvas.width = 128;
		newCanvas.height = 128;
		newCanvas.getContext('2d').drawImage(this.canvas, this.x1-5, this.y1-55-5, this.x2-this.x1+10, this.y2-this.y1+10, 0, 0, newCanvas.width, newCanvas.height);
		this.userDrawing = new Image();
		this.userDrawing.src = newCanvas.toDataURL();
		document.getElementById("postSessionScreenBody2").appendChild(this.userDrawing);

		//Create pixel array of drawing
		let smallCanvas = document.createElement('canvas');
		smallCanvas.width = 64;
		smallCanvas.height = 64;
		smallCanvas.getContext('2d').drawImage(this.canvas, this.x1-5, this.y1-55-5, this.x2-this.x1+10, this.y2-this.y1+10, 0, 0, smallCanvas.width, smallCanvas.height);

		let allPixels = smallCanvas.getContext('2d').getImageData(0, 0, smallCanvas.width, smallCanvas.height).data;

		let binaryPixels = [];

		for (let i=3; i<allPixels.length; i+=4) {
			binaryPixels.push(allPixels[i])
		}

		this.userDrawingArray = binaryPixels

		console.log(JSON.stringify(binaryPixels))

	}

	async aiPrediction() {
		const model = await tf.loadLayersModel('https://www.dropbox.com/s/mllncpdzwjz0a28/model.json?dl=0');
		console.log(model)
		
		//Create pixel array of drawing
		let smallCanvas = document.createElement('canvas');
		smallCanvas.width = 128;
		smallCanvas.height = 128;
		smallCanvas.getContext('2d').drawImage(this.canvas, this.x1-5, this.y1-55-5, this.x2-this.x1+10, this.y2-this.y1+10, 0, 0, smallCanvas.width, smallCanvas.height);

		let allPixels = smallCanvas.getContext('2d').getImageData(0, 0, smallCanvas.width, smallCanvas.height).data;

		let binaryPixels = [];

		for (let i=3; i<allPixels.length; i+=4) {
			binaryPixels.push([allPixels[i]])
		}

		console.log(binaryPixels)

	}
}
