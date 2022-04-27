
let sha;
let canvas;
let pos;
let angle;
let vel = 0;

function preload(){
	sha = new p5.Shader(this.renderer, vert, frag);
	WebFont.load({google: {families:["Roboto:900"]}});
}

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	canvas = createGraphics(width, height, WEBGL);
	canvas.noStroke();
}

function draw() {
	background(255);
	
	if(frameCount<2){
		var myText = createGraphics(width, height);
		myText.textFont("Roboto");
		myText.textSize(200);
		myText.textAlign(CENTER, CENTER);
		myText.text("BEN :(", width/2, height/2);
		canvas.image(myText, -width/2, -height/2);
	}
	
	canvas.shader(sha);
	sha.setUniform('resolution', [width, height]);
	sha.setUniform('time', millis()/1000);
	sha.setUniform('mouse', [mouseX, mouseY]);
	sha.setUniform('tex', canvas);
	sha.setUniform('vel', vel);
	canvas.rect(-width/2, -height/2, width, height);
	image(canvas, -width/2, -height/2);
	
	vel *= 0.95;
	
	if(pos){
		fill(255, 0, 0);
		stroke(255, 0, 0);
		circle(pos.x, pos.y, 10);
		const radius = 1000;
		line(
			cos(angle) * radius + pos.x,
			sin(angle) * radius + pos.y,
			cos(angle) * -radius + pos.x,
			sin(angle) * -radius + pos.y
		);
	}
}

function mousePressed(){
	pos = createVector(mouseX-width/2, mouseY-height/2);
	angle = 0;
}

function mouseDragged(){
	if(pos)
		angle = atan2(mouseY-height/2 - pos.y, mouseX-width/2 - pos.x);
}

function mouseReleased(){
	if(pos){
		canvas.shader(sha);
		sha.setUniform('angle', angle);
		sha.setUniform('pos', [(pos.x+width/2)/width, (pos.y+height/2)/height]);
		vel = 1;
		pos = undefined;
	}
}