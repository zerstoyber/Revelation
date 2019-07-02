let capture;
let poseNet;
let poses = [];

var sun;

let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

/////Setup/////////////////////////////////////////////////

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  capture = createCapture(VIDEO);
  capture.size(windowWidth, windowHeight);
  capture.hide();

	poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on('pose', gotPoses);
  poseNet.on('pose', function(results) {
    poses = results;
  });

  sun = createImg('sun.png');
  sun.hide();
}

//////////////////////Distance///////////////////////////

function gotPoses(poses) {
	if (poses.length > 0) {
		let nX = poses[0].pose.keypoints[0].position.x;
		let nY = poses[0].pose.keypoints[0].position.y;
		let eX = poses[0].pose.keypoints[11].position.x;
		let eY = poses[0].pose.keypoints[11].position.y;
		noseX = lerp(noseX, nX, 0.05);
		noseY = lerp(noseY, nY, 0.05);
		eyelX = lerp(eyelX, eX, 0.05);
		eyelY = lerp(eyelY, eY, 0.05);
	}
}

function modelReady() {
	console.log('Revelation Ready');
}

/////////////Draw/////////////////////////////////////////

function draw() {
  background(0);

  let d = dist(noseX, noseY, eyelX, eyelY);

  let sunX = noseX + 250;
  //SunY -> Installation
  //let sunY = ((d / 220) * 1440) - 1400;
  //SunY -> HomesScreen
  let sunY = noseY;
  let sunSize = 500;

  image(sun, windowWidth - sunX,sunY - 300, sunSize, sunSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
