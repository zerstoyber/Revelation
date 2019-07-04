let capture;
let poseNet;
let poses = [];

var sun;

let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

const _toggleFullScreen = function _toggleFullScreen() {
	if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else {
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else {
				if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		}
	} else {
		const _element = document.documentElement;
		if (_element.requestFullscreen) {
			_element.requestFullscreen();
		} else {
			if (_element.mozRequestFullScreen) {
				_element.mozRequestFullScreen();
			} else {
				if (_element.webkitRequestFullscreen) {
					_element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			}
		}
	}
};

const userAgent = window.navigator.userAgent;

const iPadSafari =
	!!userAgent.match(/iPad/i) &&  		// Detect iPad first.
	!!userAgent.match(/WebKit/i) && 	// Filter browsers with webkit engine only
	!userAgent.match(/CriOS/i) &&		// Eliminate Chrome & Brave
	!userAgent.match(/OPiOS/i) &&		// Rule out Opera
	!userAgent.match(/FxiOS/i) &&		// Rule out Firefox
	!userAgent.match(/FocusiOS/i);		// Eliminate Firefox Focus as well!

const element = document.getElementById('fullScreenButton');

function iOS() {
	if (userAgent.match(/ipad|iphone|ipod/i)) {
		const iOS = {};
		iOS.majorReleaseNumber = +userAgent.match(/OS (\d)?\d_\d(_\d)?/i)[0].split('_')[0].replace('OS ', '');
		return iOS;
	}
}

if (element !== null) {
	if (userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
		element.className += ' hidden';
	} else if (userAgent.match(/iPad/i) && iOS().majorReleaseNumber < 12) {
		element.className += ' hidden';
	} else if (userAgent.match(/iPad/i) && !iPadSafari) {
		element.className += ' hidden';
	} else {
		element.addEventListener('click', _toggleFullScreen, false);
	}
}

/////Setup/////////////////////////////////////////////////

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();

  capture = createCapture(VIDEO);
  //capture.size(windowWidth, windowHeight);
  capture.size(320, 240);
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

  let sunX = noseX + 800;
//  let sunX = noseX + 250;

  //SunY -> Installation
  //let sunY = ((d / 220) * 1440) - 1400;
  //SunY -> HomesScreen
  let sunY = noseY;
  let sunSize = 500;
  sX = constrain(sunX, 0, 1536);
  sY = constrain(sunY, 0, 2048);

//  image(sun, windowWidth - sunX,sunY - 300, sunSize, sunSize);
  image(sun, windowWidth - sX,sY, sunSize, sunSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
