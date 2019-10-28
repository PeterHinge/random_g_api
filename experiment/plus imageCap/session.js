class Session {
	constructor(canvas, context) {
		this.xArray = [];
		this.yArray = [];
		this.tArray = [];
		this.currentX = []; 
		this.currentY = []; 
		this.currentT = []; 

		this.canvas = canvas;
		this.context = context;

		this.types = ["Friendly", "Hostile"];
		this.labels = ["Armored Vehicle", "Infantry"];

		this.isDrawing = false;
		this.timeStart = null;
		this.currentSymbol = [this.types[Math.floor(this.types.length * Math.random())], this.labels[Math.floor(this.labels.length * Math.random())]]; 
		document.getElementById("symbolToDraw1").innerHTML = this.currentSymbol[0] + " - " + this.currentSymbol[1];
		document.getElementById("symbolToDraw2").innerHTML = this.currentSymbol[0] + " - " + this.currentSymbol[1];
	}

	clearDrawing() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	draw(mousePosition) {
		if (!this.isDrawing) return;
		this.context.lineWidth = 3;
		this.context.lineCap = "round";

		this.context.lineTo(mousePosition.clientX, mousePosition.clientY -55);
		this.context.stroke();
		this.context.beginPath();
		this.context.moveTo(mousePosition.clientX, mousePosition.clientY -55);

		this.currentX.push(mousePosition.clientX);
		this.currentY.push(mousePosition.clientY);
		this.currentT.push(Date.now() - this.timeStart);
	}

	submitData(includePicture=false) {
		if (includePicture) {
			let image = this.captureDrawing()
			let dataToSend = [this.xArray.toString(), this.yArray.toString(), this.tArray.toString(), this.currentSymbol.toString(), image.toString()];

			//google.script.run.submitToSheets(dataToSend)

			console.log(this.xArray);
			console.log(this.yArray);
			console.log(this.tArray);
			console.log(this.currentSymbol);
			console.log(dataToSend);

		} else {
			let dataToSend = [this.xArray.toString(), this.yArray.toString(), this.tArray.toString(), this.currentSymbol.toString()];
			
			//google.script.run.submitToSheets(dataToSend)
			
			console.log(this.xArray);
			console.log(this.yArray);
			console.log(this.tArray);
			console.log(this.currentSymbol);
			console.log(dataToSend);
		}

		this.clearDrawing();

		this.currentSymbol = [this.types[Math.floor(this.types.length * Math.random())], this.labels[Math.floor(this.labels.length * Math.random())]];
		document.getElementById("symbolToDraw1").innerHTML = this.currentSymbol[0] + " - " + this.currentSymbol[1];
		document.getElementById("symbolToDraw2").innerHTML = this.currentSymbol[0] + " - " + this.currentSymbol[1];
	}

	captureDrawing() {
		let x = null;
		let y = null;
		let w = null;
		let h = null;

		this.xArray.forEach(function(entry){ 
		    entry.forEach(function(value) {
		        if (!x || value < x) {
		      	  	x = value;
		      	}
		      	if (!w || value > w) {
		      		w = value;
		      	}
			});
		});

		this.yArray.forEach(function(entry){ 
		    entry.forEach(function(value) {
		        if (!y || value < y) {
		      	    y = value;
		      	}
		      	if (!h || value > h) {
		      		h = value;
		      	}
			});
		});

		x == x-3
		y == y-3
		w == w+3
		h == h+3

		let imageData = context.getImageData(x, y, w, h);
		let pixels = imageData.data;

	    console.log(pixels)
	    return pixels

	}
}
