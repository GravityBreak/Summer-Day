var TITLE = "Untitled Summer Day Game"
var AUTHOR = "???"
var VERSION = "v1.0.0";
var ANGLED_BOXES = true; // Change to false if you don't want randomly angled boxes
var DEBUG_CLICKABLES = false; // Temporarily change to true if you need to see where your clickareas/examineareas are
//
var FRAMEWORK_VERSION = "v1.0.0";
console.log("☀️ SUMMER DAY " + FRAMEWORK_VERSION + "\nby Gravity Break Media");
//
document.title = TITLE;

var begun = false;

var currentChapter = 0; // You can change this to test different points in the script
var scriptPosition = 0;

var timers = [];

var uiAvailable = true;

var currentBgm;
var soundEnabled = true;
var musicPlaying = false;
var musicType;
var storedPlayerPosition = 0;
var starBlinkState = false;
var canBack = false;
var holdOpacity = false;
var fadeLineOnPrint = false;
var previousDialogueBox = 3;
var currentDialogueBox = 1;

var topPlayerPlaying = false;
var closedCaptionsOn = false;
var closedCaptions = [];

var numberOfClickareas = 0;
var clickareaDestinations = [ null, null, null, null, null, null, null, null ];

var examineActive = false;
var numberOfExamineareas = 0;
var examineDestinations = [ null, null, null, null, null, null, null, null ];
var examineareaSelectedTarget = null;
var examineFirstGrabbedPoint = { x: 0, y: 0 };
var examineGrabbedPoint = { x: 0, y: 0 };
var lastClickableLocation = { x: 0, y: 0 };
var lastClickableSoundPoint = { x: 0, y: 0 };
var timeExamineHeldDown = null;

var selectingChoice = false;
var isQuizStyle = false;
var currentChoice = null;
var numberOfChoices = 0;
var lastSelectedChoice = null;
var choiceTarget = 0;
var choicesCorrect = 0;
var choiceDestinations = [ null, null, null, null, null, null, null, null ];
var choiceResults = [ null, null, null, null, null, null, null, null ];
var choicesTried = [ null, null, null, null, null, null, null, null ];
var currentLine = null;
var canAdvance = false;
var currentChoiceIndex = 1;

var shakeIntensity = 0;
var shakeAngle = 0;

var DESKTOP = 0;
var MOBILE = 1;
var device;

var player;

var preventDefault = function(e) {
	e.preventDefault();
}

var Timer = function(callback, delay) { // Tim Down on StackOverflow (with corrections)
    this.timerID = null;
    this.lastTimerID = null;
    this.start = null;
    this.remaining = delay;
    this.paused = false;
    this.callbackFunction = callback.bind(this);

    this.pause = function() {
        window.clearTimeout(this.timerID);
        this.timerID = null;
        this.remaining -= Date.now() - this.start;
        this.paused = true;
    };

    this.destroy = function(self) {
    	if (self.timerID)
    		window.clearTimeout(self.timerID);

    	timers.splice(timers.indexOf(self), 1);
    }

    this.timeoutFunction = function(self) {
    	self.callbackFunction();
    	timers.splice(timers.indexOf(self), 1);
    }

    this.resume = function() {
        if (this.timerID) {
            return;
        }

        this.start = Date.now();
        this.timerID = window.setTimeout(this.timeoutFunction, this.remaining, this);
        this.lastTimerID = this.timerID;
        this.paused = false;
    };

    this.resume();
};

function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

function map(n, start1, stop1, start2, stop2, withinBounds = false) { // stolen from p5.js
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return clamp(newval, start2, stop2);
  } else {
    return clamp(newval, stop2, start2);
  }
}

function randomNumber(min, max) { // Lior Elrom on StackOverflow
	return Math.random() * (max - min) + min;
}

function pageLoad() {
	if (window.innerWidth > window.innerHeight)
		device = DESKTOP;
	else
		device = MOBILE;

	if (device == DESKTOP) {
		document.getElementById("mute-switch-label").style.display = "block";
		document.getElementById("back-button-label").style.display = "block";
	}

	window.addEventListener('resize', resize);
	
	if (document.getElementById("webaudio-initiator").canPlayType("audio/ogg"))	
		musicType = "ogg";
	else
		musicType = "mp3";

	document.body.onkeydown = function(e) {
		if (e.repeat)
			return;

		if (e.key == "m")
	    	preMute();

	    if (e.keyCode == 8)
	    	preBack();

	  	if (e.key == " " || e.code == "Space" || e.keyCode == 32)
	    	preAdvance();

	    if (e.key == "1" && selectingChoice)
	    	preSelectChoice(1);
	    if (e.key == "2" && selectingChoice)
	    	preSelectChoice(2);
	    if (e.key == "3" && selectingChoice)
	    	preSelectChoice(3);
	    if (e.key == "4" && selectingChoice)
	    	preSelectChoice(4);
	    if (e.key == "5" && selectingChoice)
	    	preSelectChoice(5);
	    if (e.key == "6" && selectingChoice)
	    	preSelectChoice(6);
	    if (e.key == "7" && selectingChoice)
	    	preSelectChoice(7);
	}
	document.body.onkeyup = function(e) {
		if (e.key == "m")
	    	mute();

	    if (e.key == "Enter" || e.keyCode == 13)
	    	confirmSelection();

	    if (e.keyCode == 8)
	    	back();

	  	if (e.key == " " || e.code == "Space" || e.keyCode == 32)
	    	tryToAdvance();

	    if (e.key == "1" && selectingChoice)
	    	selectChoice(1);
	    if (e.key == "2" && selectingChoice)
	    	selectChoice(2);
	    if (e.key == "3" && selectingChoice)
	    	selectChoice(3);
	    if (e.key == "4" && selectingChoice)
	    	selectChoice(4);
	    if (e.key == "5" && selectingChoice)
	    	selectChoice(5);
	    if (e.key == "6" && selectingChoice)
	    	selectChoice(6);
	    if (e.key == "7" && selectingChoice)
	    	selectChoice(7);
	}

	preloadElements();
	resize();
}

function resize() {
	resizeClickable();
	
	document.documentElement.style.setProperty('--window-inner-height', window.innerHeight + 'px');
	
	if (document.getElementById("dialogue-boxes").offsetWidth < 800) {
		document.getElementById("dialogue-boxes").classList.add("smaller-text");
	}
	else {
		document.getElementById("dialogue-boxes").classList.remove("smaller-text");
	}

	if (window.innerWidth < 800) {
		document.getElementById("choices").classList.add("smaller-text");
	}
	else {
		document.getElementById("choices").classList.remove("smaller-text");
	}

	document.getElementById("examine").style.left = "50%";
	document.getElementById("examine").style.top = "50%";
}

function begin(sound) {
	document.getElementById("sound-selector").style.display = "none";
	document.getElementById("version-label").innerHTML = VERSION;

	if (!sound)
		mute();

	begun = true;

	player = new Gapless5( { loop: true, singleMode: true } );
	player.onfinishedtrack = function() {
		if (player.loop == false)
			musicPlaying = false;
	}

	window.addEventListener('blur', function() {
		player.pause();

		if (document.getElementById("interactive-player-audio"))
			document.getElementById("interactive-player-audio").pause();

		timers.forEach(function(timer) {
			timer.pause();
		})
	});
	window.addEventListener('focus', function() {
		if (topPlayerPlaying)
			document.getElementById("interactive-player-audio").play();

		if (soundEnabled) {
			if (musicPlaying && !topPlayerPlaying)
				player.play();

			if (document.getElementById("interactive-player-audio") && topPlayerPlaying)
				document.getElementById("interactive-player-audio").play();
		}

		timers.forEach(function(timer) {
			timer.resume();
		})
	});
	window.setInterval(function() {
		starBlinkState = !starBlinkState;
		let bottom = 6;

		if (starBlinkState)
			bottom = 10;

		document.getElementById("advance-star-1").style.bottom = bottom + "px";
		document.getElementById("advance-star-2").style.bottom = bottom + "px";
		document.getElementById("advance-star-3").style.bottom = bottom + "px";
	}, 500);

	advanceScript();
}

function playWebaudioInitiator() {
	document.getElementById("webaudio-initiator").play();
}

function toggleChapterSelect() {
	if (document.getElementById("chapter-select-curtain").style.display == "none") {
		document.getElementById("chapter-select-curtain").style.display = "block";
	}
	else {
		document.getElementById("chapter-select-curtain").style.display = "none";
	}
}

function preMute() {
	playSfx("tap");
	document.getElementById("mute-switch").style.top = "26px";
	document.getElementById("mute-switch").style.left = "26px";
	document.getElementById("mute-switch").style.boxShadow = "2px 2px 0 black";
	document.getElementById("mute-switch").style.opacity = 1.0;
}

function mute() {
	document.getElementById("mute-switch").style.top = "20px";
	document.getElementById("mute-switch").style.left = "20px";
	document.getElementById("mute-switch").style.boxShadow = "8px 8px 0 black";
	document.getElementById("mute-switch").style.opacity = 0.75;

	soundEnabled = !soundEnabled;

	if (soundEnabled) {
		if (musicPlaying && !topPlayerPlaying) {
			player.setPosition(storedPlayerPosition);
			player.play();
		}

		if (document.getElementById("interactive-player-audio"))
			document.getElementById("interactive-player-audio").volume = 1;
		document.getElementById("mute-switch-img").style.display = "block";
	}
	else {
		if (document.getElementById("interactive-player-audio"))
			document.getElementById("interactive-player-audio").volume = 0;
		toggleClosedCaptions(true);
		document.getElementById("mute-switch-img")
		document.getElementById("mute-switch-img").style.display = "none";

		if (typeof player !== "undefined") {
			storedPlayerPosition = player.currentPosition();
			player.stop();
		}
	}
}

function playerPlay() {
	if (document.getElementById("interactive-player-audio").paused) { // resume
		document.getElementById("player-play-button").innerHTML = "&#10074;&#10074;";
		document.getElementById("interactive-player-audio").play();
		topPlayerPlaying = true;

		if (musicPlaying && soundEnabled)
			player.pause();
	}
	else { // pause
		document.getElementById("player-play-button").innerHTML = "&#x25B6;&#xFE0E;";
		document.getElementById("interactive-player-audio").pause();
		topPlayerPlaying = false;

		document.getElementById("closed-captions").style.display = "none";

		if (musicPlaying && soundEnabled)
			player.play();
	}
}

function playerStartOver() {
	document.getElementById("interactive-player-audio").currentTime = 0;

	document.getElementById("closed-captions").style.display = "none";

	if (document.getElementById("interactive-player-audio").paused)
		playerPlay();
}

function playerScrub(e) {
	var rect = document.getElementById("player-progress-container").getBoundingClientRect();

	document.getElementById("interactive-player-audio").currentTime = map(e.clientX, rect.left, rect.left + document.getElementById("player-progress-container").offsetWidth, 0, document.getElementById("interactive-player-audio").duration, true);
}

function toggleClosedCaptions(forceState = false) {
	closedCaptionsOn = !closedCaptionsOn;

	if (forceState)
		closedCaptionsOn = true;

	if (closedCaptionsOn) {
		document.getElementById("player-cc-button").classList.add("captions-on");
	}
	else {
		document.getElementById("closed-captions").style.display = "none";
		document.getElementById("player-cc-button").classList.remove("captions-on");
	}
}

function cancelMute() {
	document.getElementById("mute-switch").style.top = "20px";
	document.getElementById("mute-switch").style.left = "20px";
	document.getElementById("mute-switch").style.boxShadow = "8px 8px 0 black";
	document.getElementById("mute-switch").style.opacity = 0.75;
}

function preloadElements() {
	document.getElementById("loaded-images").innerHTML = "";
	document.getElementById("loaded-portraits").innerHTML = "";
	document.getElementById("loaded-sfx").innerHTML = "";
	document.getElementById("loaded-bgm").innerHTML = "";

	var loadedImages = [];
	var loadedPortraits = [];
	var loadedSfx = [];
	var loadedBgm = [];

	for (let position = 0; position < scripts[currentChapter].length; position++) {
		if (scripts[currentChapter][position].name == "COMMAND") {
			let commandName = scripts[currentChapter][position].commandName;
			if (typeof scripts[currentChapter][position].commandValue !== "undefined") {
				let commandValue = scripts[currentChapter][position].commandValue;

				switch (commandName) {
					case "BGMONCE":
					case "BGM":
						if (!loadedBgm.includes(commandValue)) {
							document.getElementById("loaded-bgm").innerHTML += "<audio preload='auto' id='bgm-" + commandValue + "'><source src='music/" + commandValue + ".ogg' type='audio/ogg'><source src='music/" + commandValue + ".mp3' type='audio/mp3'></audio>";
							loadedBgm.push(commandValue);
						}
						break;
					case "PLAYER":
					case "QUICKSFX":
					case "SFX":
						if (!loadedSfx.includes(commandValue)) {
							document.getElementById("loaded-sfx").innerHTML += "<audio preload='auto' id='sfx-" + commandValue + "'><source src='sfx/" + commandValue + ".ogg' type='audio/ogg'><source src='sfx/" + commandValue + ".mp3' type='audio/mp3'></audio>";
							loadedSfx.push(commandValue);
						}
						break;
					case "IMAGE":
					case "IMAGELEFT":
					case "IMAGERIGHT":
					case "BACKGROUND":
					case "CLICKABLE":
					case "EXAMINE":
					case "SPLASH":
					case "PANIMAGE":
						if (!loadedImages.includes(commandValue)) {
							document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue + "' />";
							loadedImages.push(commandValue);
						}
						break;
					case "IMAGETWO":
						{
							let commandValue2 = scripts[currentChapter][position].commandValue2;

							if (!loadedImages.includes(commandValue)) {
								document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue + "' />";
								loadedImages.push(commandValue);
							}
							if (!loadedImages.includes(commandValue2)) {
								document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue2 + "' />";
								loadedImages.push(commandValue2);
							}
						}
						break;
					case "IMAGETHREE":
						{
							let commandValue2 = scripts[currentChapter][position].commandValue2;
							let commandValue3 = scripts[currentChapter][position].commandValue3;
							if (!loadedImages.includes(commandValue)) {
								document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue + "' />";
								loadedImages.push(commandValue);
							}
							if (!loadedImages.includes(commandValue2)) {
								document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue2 + "' />";
								loadedImages.push(commandValue2);
							}
							if (!loadedImages.includes(commandValue3)) {
								document.getElementById("loaded-images").innerHTML += "<img src='" + commandValue3 + "' />";
								loadedImages.push(commandValue3);
							}
						}
						break;
					break;
				}
			}
		}
		else { // dialogue lines
			if (scripts[currentChapter][position].name !== "NOONE") {
				if (!loadedPortraits.includes(scripts[currentChapter][position].name.toLowerCase() + "/" + scripts[currentChapter][position].expression)) {
					document.getElementById("loaded-portraits").innerHTML += "<img src='portraits/" + scripts[currentChapter][position].name.toLowerCase() + "/" + scripts[currentChapter][position].expression + ".png' />";
					loadedPortraits.push(scripts[currentChapter][position].name.toLowerCase() + "/" + scripts[currentChapter][position].expression);
				}
			}
		}
	}
}

function loadChapterFromSelector(chapterIndex) {
	timers.forEach(function(timer) {
		timer.destroy(timer);
	})

	toggleChapterSelect();

	let loadChapterFunction = function() { loadChapter(chapterIndex) };

	document.getElementById("curtain").style.transition = "opacity 3s";
	document.getElementById("curtain").style.opacity = 1.0;
	document.getElementById("curtain").style.pointerEvents = "auto";

	document.getElementById("chapter-header").style.opacity = 0.0;
	document.getElementById("chapter-header").style.top = "55%";

	timers.push(new Timer(loadChapterFunction, 4000));
}

function loadChapter(chapterIndex) {
	document.getElementById("chapter-select-label").style.display = "none";
	document.getElementById("version-label").style.display = "none";

	document.getElementById("background-img").style.opacity = 0.0;
	document.getElementById("background-fader-img").style.opacity = 0.0;
	document.getElementById("dialogue-box-1").style.opacity = 0.0;
	document.getElementById("dialogue-box-2").style.opacity = 0.0;
	document.getElementById("dialogue-box-3").style.opacity = 0.0;
	document.getElementById("clickable").style.opacity = 0.0;
	document.getElementById("examine-container").style.opacity = 0.0;
	timers.push(new Timer(function() {
		document.getElementById("clickable").style.display = "none";
		document.getElementById('examine-container').style.display = "none";
		document.getElementById('examine-cursor').style.display = "none";
	}, 500));
	document.getElementById("image-left").classList.remove("active-image");
	document.getElementById("image-left").classList.remove("active-side-image");
	document.getElementById("image-center").classList.remove("active-image");
	document.getElementById("image-center").classList.remove("active-center-image");
	document.getElementById("image-right").classList.remove("active-image");
	document.getElementById("image-right").classList.remove("active-side-image");
	fadeBgmOut();

	currentChapter = chapterIndex;
	scriptPosition = 0;

	preloadElements();

	if (document.getElementById("curtain").style.opacity == 1) {
		document.getElementById("curtain").style.transition = "opacity 3s";
		document.getElementById("curtain").style.opacity = 0.0;

		timers.push(new Timer(function() {
			document.getElementById("curtain").style.pointerEvents = "none";
			advanceScript();
		}, 2000));
	}
	else {
		advanceScript();
	}
}

function playSfx(sfx) {
	document.getElementById("sfx-" + sfx).currentTime = 0;

	if (soundEnabled)
		document.getElementById("sfx-" + sfx).volume = 1;
	else
		document.getElementById("sfx-" + sfx).volume = 0;

	document.getElementById("sfx-" + sfx).play();
}

function playBgm(bgm) {
	if (musicPlaying && bgm == currentBgm)
		return;

	player.setVolume(1);
	player.addTrack(bgm);
	player.next();

	if (soundEnabled)
		player.play();

	if (player.getTracks().length > 1)
		player.removeTrack(currentBgm);

	currentBgm = bgm;
	musicPlaying = true;
}        

function fadeBgmOut() {
	var fadeAudio = setInterval(function () {
	    let newValue = player.gainNode.gain.value - 0.1;

    	if (newValue > 0)
        	player.setVolume(newValue);
        else {
        	player.stop();
        	clearInterval(fadeAudio);
        }
	}, 200);
	musicPlaying = false;
}

function goto(markerID) {
	let marker = markerSets[currentChapter].find( ({id}) => id === markerID);
	scriptPosition = marker.lineId;
	advanceScript();
}

function preSelectChoice(selectedChoice) {
	if (selectedChoice > numberOfChoices)
		return;

	let choice = document.getElementById("choice-" + selectedChoice);

	choice.style.top = "10px";
	choice.style.left = "10px";
	choice.style.boxShadow = "10px 4px 1px black";

	playSfx("tap");
}

function selectChoice(selectedChoice) {
	if (selectedChoice > numberOfChoices)
		return;

	selectingChoice = false;
	lastSelectedChoice = selectedChoice;

	if (choiceResults[selectedChoice] !== "none")
		choicesTried[selectedChoice] = choiceResults[selectedChoice];

	let choice = document.getElementById("choice-" + selectedChoice);
	document.getElementById("choice-" + selectedChoice).classList.add("selected-choice");

	playSfx("selectchoice");
	
	var timeToElapse = 500;

	document.getElementById("choice-menu-title").style.opacity = 0.0;
	document.getElementById("choice-subdescription").style.opacity = 0.0;

	for (let x = 1; x <= 7; x++) {
		document.getElementById("choice-" + x).style.pointerEvents = "none";
		document.getElementById("choice-" + x).style.top = "0px";
		document.getElementById("choice-" + x).style.left = "0px";
		document.getElementById("choice-" + x).style.boxShadow = "20px 14px 3px black";

		timers.push(new Timer(function() {
			if (document.getElementById("choice-" + x).style.display == "block")
				playSfx("choiceswipein");
			document.getElementById("choice-" + x).style.left = "150vw";
		}, 500 + (100 * x)));
	}

	timers.push(new Timer(function() {
		for (let x = 1; x <= 7; x++) {
			document.getElementById("choice-" + x).style.display = "none";
			document.getElementById("choice-" + x).style.left = "-150vw";
			document.getElementById("choice-" + x).classList.remove("selected-choice");
		}

		document.getElementById("confirm-button").style.display = "none";

		document.getElementById("choices").style.display = "none";

		goto(choiceDestinations[selectedChoice]);
	}, 1210));

	document.getElementById("dialogue-box-" + previousDialogueBox).style.opacity = 0.0;
	document.getElementById("confirm-button").style.opacity = 0.0;
}

function cancelChoice(selectedChoice) {
	let choice = document.getElementById("choice-" + selectedChoice);

	choice.style.top = "0px";
	choice.style.left = "0px";
	choice.style.boxShadow = "20px 14px 3px black";
}

function preBack() {
	if (canAdvance && canBack) {
		playSfx("tap");
		document.getElementById("back-button").style.top = "26px";
		document.getElementById("back-button").style.right = "14px";
		document.getElementById("back-button").style.boxShadow = "2px 2px 0 black";
		document.getElementById("back-button").style.opacity = 1.0;
		document.getElementById("dialogue-boxes").style.marginTop = "-4px";
	}
	else {
		document.getElementById("back-button").style.top = "22px";
		document.getElementById("back-button").style.right = "18px";
		document.getElementById("back-button").style.boxShadow = "6px 6px 0 black";
	}
}

function back() {
	if (canBack && canAdvance) {
		scriptPosition--;
		scriptPosition--;
		while (scripts[currentChapter][scriptPosition].name == "COMMAND") {
			reverseScript();
			scriptPosition--;
		}
		canBack = false;
		displayTextBox(true);
		scriptPosition++;

		playSfx("back");
	}
	
	document.getElementById("back-button").style.top = "20px";
	document.getElementById("back-button").style.right = "20px";
	document.getElementById("back-button").style.boxShadow = "8px 8px 0 black";
	if (canBack)
		document.getElementById("back-button").style.opacity = 0.75;
	else
		document.getElementById("back-button").style.opacity = 0.25;
	document.getElementById("dialogue-boxes").style.marginTop = "0px";
}

function cancelBack() {
	document.getElementById("back-button").style.top = "20px";
	document.getElementById("back-button").style.right = "20px";
	document.getElementById("back-button").style.boxShadow = "8px 8px 0 black";
	if (canBack)
		document.getElementById("back-button").style.opacity = 0.75;
	else
		document.getElementById("back-button").style.opacity = 0.25;
	document.getElementById("dialogue-boxes").style.marginTop = "0px";
}

function reverseScript() {
	if (scripts[currentChapter][scriptPosition].name == "COMMAND") {
		var backCheck;
		
		switch (scripts[currentChapter][scriptPosition].commandName) {
			case "IMAGELEFT":
				document.getElementById("image-left").classList.remove("active-side-image");
				document.getElementById("image-left").classList.remove("active-image");
				break;
			case "IMAGECENTER":
			case "IMAGE":
				document.getElementById("image-center").classList.remove("active-center-image");
				document.getElementById("image-center").classList.remove("active-image");
				break;
			case "IMAGERIGHT":
				document.getElementById("image-right").classList.remove("active-side-image");
				document.getElementById("image-right").classList.remove("active-image");
				break;
			case "IMAGETWO":
				document.getElementById("image-left").classList.remove("active-side-image");
				document.getElementById("image-left").classList.remove("active-image");
				document.getElementById("image-right").classList.remove("active-side-image");
				document.getElementById("image-right").classList.remove("active-image");
				break;
			case "IMAGETHREE":
				document.getElementById("image-left").classList.remove("active-side-image");
				document.getElementById("image-left").classList.remove("active-image");
				document.getElementById("image-center").classList.remove("active-center-image");
				document.getElementById("image-center").classList.remove("active-image");
				document.getElementById("image-right").classList.remove("active-side-image");
				document.getElementById("image-right").classList.remove("active-image");
				break;
			case "REMOVEIMAGELEFT":
				document.getElementById("image-left").onload = null;
				var command = "IMAGELEFT";

				var imageLeftExists = false;
				var imageTwoExists = false;
				var imageThreeExists = false;

				if (reverseScan("IMAGELEFT") !== null)
					imageLeftExists = true;
				if (reverseScan("IMAGETWO") !== null)
					imageTwoExists = true;
				if (reverseScan("IMAGETHREE") !== null)
					imageThreeExists = true;

				if (imageLeftExists) { // this logic tree is so ugly but i dunno how to do this better
					if (imageTwoExists) {
						if (imageThreeExists) {
							if (reverseScan("IMAGELEFT") < reverseScan("IMAGETHREE")) {
								if (reverseScan("IMAGELEFT") < reverseScan("IMAGETWO") && reverseScan("IMAGELEFT") < reverseScan("IMAGETHREE"))
									command = "IMAGELEFT";
								else if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
									command = "IMAGETWO";
								else
									command = "IMAGETHREE";
							}
							else {
								if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
									command = "IMAGETWO";
								else
									command = "IMAGETHREE";
							}
						}
						else {
							if (reverseScan("IMAGELEFT") < reverseScan("IMAGETWO"))
								command = "IMAGELEFT";
							else
								command = "IMAGETWO";
						}
					}
					else if (imageThreeExists) {
						if (reverseScan("IMAGELEFT") < reverseScan("IMAGETHREE"))
							command = "IMAGELEFT";
						else
							command = "IMAGETHREE";
					}
				}
				else if (imageTwoExists) {
					if (imageThreeExists) {
						if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
							command = "IMAGETWO";
						else
							command = "IMAGETHREE";
					}
					else
						command = "IMAGETWO";
				}
				else {
					command = "IMAGETHREE";
				}

				document.getElementById("image-left").src = reverseScan(command, 1);
				
				displayImageLeft(false);
				break;
			case "REMOVEIMAGE":
				document.getElementById("image-center").onload = null;
				var command = "IMAGE";

				if (reverseScan("IMAGECENTER") !== null) {
					command = reverseScan("IMAGE") < reverseScan("IMAGECENTER") ? "IMAGE" : "IMAGECENTER";
				}

				if (reverseScan("IMAGETHREE") == null || reverseScan(command) < reverseScan("IMAGETHREE")) {
					document.getElementById("image-center").src = reverseScan(command, 1);
				}
				else {
					document.getElementById("image-center").src = reverseScan("IMAGETHREE", 2);
				}
				displayImageCenter(false);
				break;
			case "REMOVEIMAGERIGHT":
				document.getElementById("image-right").onload = null;
				var command = "IMAGERIGHT";

				var imageRightExists = false;
				var imageTwoExists = false;
				var imageThreeExists = false;

				if (reverseScan("IMAGERIGHT") !== null)
					imageRightExists = true;
				if (reverseScan("IMAGETWO") !== null)
					imageTwoExists = true;
				if (reverseScan("IMAGETHREE") !== null)
					imageThreeExists = true;

				if (imageRightExists) { // this logic tree is so ugly but i dunno how to do this better
					if (imageTwoExists) {
						if (imageThreeExists) {
							if (reverseScan("IMAGERIGHT") < reverseScan("IMAGETHREE")) {
								if (reverseScan("IMAGERIGHT") < reverseScan("IMAGETWO") && reverseScan("IMAGERIGHT") < reverseScan("IMAGETHREE"))
									command = "IMAGERIGHT";
								else if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
									command = "IMAGETWO";
								else
									command = "IMAGETHREE";
							}
							else {
								if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
									command = "IMAGETWO";
								else
									command = "IMAGETHREE";
							}
						}
						else {
							if (reverseScan("IMAGELEFT") < reverseScan("IMAGETWO"))
								command = "IMAGERIGHT";
							else
								command = "IMAGETWO";
						}
					}
					else if (imageThreeExists) {
						if (reverseScan("IMAGERIGHT") < reverseScan("IMAGETHREE"))
							command = "IMAGELEFT";
						else
							command = "IMAGETHREE";
					}
				}
				else if (imageTwoExists) {
					if (imageThreeExists) {
						if (reverseScan("IMAGETWO") < reverseScan("IMAGETHREE"))
							command = "IMAGETWO";
						else
							command = "IMAGETHREE";
					}
					else
						command = "IMAGETWO";
				}
				else {
					command = "IMAGETHREE";
				}

				var valueNumber;
				switch (command) {
					case "IMAGERIGHT": valueNumber = 1; break;
					case "IMAGETWO": valueNumber = 2; break;
					case "IMAGETHREE": valueNumber = 3; break;
				}

				document.getElementById("image-right").src = reverseScan(command, valueNumber);
				displayImageRight(false);
				break;
			case "REVEALEXAMINE":
				if (reverseScan("EXAMINE") == null || reverseScan("REVEALEXAMINE") == null || reverseScan("REVEALEXAMINE") > reverseScan("REMOVEEXAMINE")) {
					document.getElementById('examine-container').style.opacity = 0.0;

					for (var x = 1; x <= 10; x++) {
						document.getElementById("examinearea-" + x).style.display = "none";
						document.getElementById("examinearea-" + x).style.left = "0px";
						document.getElementById("examinearea-" + x).style.top = "0px";
						document.getElementById("examinearea-" + x).style.backgroundColor = "transparent";
					}

					document.getElementById('examine-container').style.display = "none";
					document.getElementById('examine-cursor').style.display = "none";
				}
				break;
			case "REMOVEEXAMINE":
				document.getElementById('examine-container').style.display = "block";
				document.getElementById('examine-cursor').style.display = "block";
				document.getElementById('examine-container').style.opacity = 1.0;
				break;
			case "INSTANTBACKGROUND":
			case "BACKGROUND":
				if (reverseScan("BACKGROUND") !== null && reverseScan("BACKGROUND") < reverseScan("REMOVEBACKGROUND")) {
					document.getElementById("background-img").src = reverseScan("BACKGROUND", 1);
					document.getElementById("background-fader-img").onload = null;
					document.getElementById("background-fader-img").src = reverseScan("BACKGROUND", 1);
					document.getElementById("background-img").style.transition = "none";
					document.getElementById("background-fader-img").style.transition = "none";
					document.getElementById("background-img").style.opacity = 1.0;
					document.getElementById("background-fader-img").style.opacity = 0.0;
				}
				else {
					document.getElementById("background-img").style.opacity = 0.0;
					document.getElementById("background-fader-img").style.opacity = 0.0;
				}
				break;
			case "REMOVEBACKGROUND":
				document.getElementById("background-img").src = reverseScan("BACKGROUND", 1);
				document.getElementById("background-fader-img").onload = null;
				document.getElementById("background-fader-img").src = reverseScan("BACKGROUND", 1);
				document.getElementById("background-img").style.transition = "none";
				document.getElementById("background-fader-img").style.transition = "none";
				document.getElementById("background-img").style.opacity = 1.0;
				document.getElementById("background-fader-img").style.opacity = 0.0;
				break;
			case "TITLE":
				if (reverseScan("TITLE") == null || reverseScan("TITLE") < reverseScan("REMOVETITLE")) {
					document.getElementById("choice-menu-title").style.opacity = 0.0;
				}
				else {
					document.getElementById("choice-menu-title").innerHTML = reverseScan("TITLE", 1);
				}
				break;
			case "REMOVETITLE":
				document.getElementById("choice-menu-title").style.opacity = 1.0;
				document.getElementById("choice-menu-title").innerHTML = reverseScan("TITLE", 1);
				break;
			case "PLAYER":
				if (reverseScan("PLAYER") == null || reverseScan("PLAYER") < reverseScan("REMOVEPLAYER")) {
					document.getElementById("interactive-player-audio").pause();
					if (soundEnabled && musicPlaying)
						player.play();
					document.getElementById("interactive-player").style.height = "0px";
					topPlayerPlaying = false;
				}
				else {
					let lastPlayed = reverseScan("PLAYER", 1);
					document.getElementById("interactive-player-audio-container").innerHTML = "<audio id='interactive-player-audio' preload='auto'><source src='sfx/" + lastPlayed + ".ogg' type='audio/ogg'><source src='sfx/" + lastPlayed + ".mp3' type='audio/mp3'></audio>";
				}
				break;
		}
	}
}

function reverseScan(commandName, getValue = 0) {
	let stepsBack = 1;
	for (let checkPosition = scriptPosition - 1; checkPosition >= 0; checkPosition--) {
		if (scripts[currentChapter][checkPosition].name == "COMMAND") {
			if (scripts[currentChapter][checkPosition].commandName == commandName) {
				if (getValue > 0) {
					switch (getValue) {
						case 1: return scripts[currentChapter][checkPosition].commandValue;
						case 2: return scripts[currentChapter][checkPosition].commandValue2;
						case 3: return scripts[currentChapter][checkPosition].commandValue3;
					}
					
				}
				else
					return stepsBack;
			}
		}

		stepsBack++;
	}

	return null;
}

function displayImageLeft(playAudio = true) {
	if (!document.getElementById("image-left").classList.contains("active-image")) {
		if (playAudio)
			playSfx("image");
		document.getElementById("image-left").classList.add("active-image");
		document.getElementById("image-left").classList.add("active-side-image");
	}
}
function displayImageCenter(playAudio = true) {
	if (!document.getElementById("image-center").classList.contains("active-image")) {
		if (playAudio)
			playSfx("image");
		document.getElementById("image-center").classList.add("active-image");
		document.getElementById("image-center").classList.add("active-center-image");
	}
}
function displayImageRight(playAudio = true) {
	if (!document.getElementById("image-right").classList.contains("active-image")) {
		if (playAudio)
			playSfx("image");
		document.getElementById("image-right").classList.add("active-image");
		document.getElementById("image-right").classList.add("active-side-image");
	}
}
function removeImageLeft(playAudio = true) {
	if (document.getElementById("image-left").classList.contains("active-image")) {
		if (playAudio)
			playSfx("removeimage");

		document.getElementById("image-left").classList.remove("active-side-image");
		
		timers.push(new Timer(function() {
			document.getElementById("image-left").classList.remove("active-image");
		}, 250));
	}
}
function removeImageCenter(playAudio = true) {
	if (document.getElementById("image-center").classList.contains("active-image")) {
		if (playAudio)
			playSfx("removeimage");

		document.getElementById("image-center").classList.remove("active-center-image");
		
		timers.push(new Timer(function() {
			document.getElementById("image-center").classList.remove("active-image");
		}, 250));
	}
}
function removeImageRight(playAudio = true) {
	if (document.getElementById("image-right").classList.contains("active-image")) {
		if (playAudio)
			playSfx("removeimage");

		document.getElementById("image-right").classList.remove("active-side-image");
		
		timers.push(new Timer(function() {
			document.getElementById("image-right").classList.remove("active-image");
		}, 250));
	}
}

function fadePreviousLine() {
	if (currentDialogueBox == 1) {
		document.getElementById("dialogue-box-2").style.opacity = 0.0;
	}
	if (currentDialogueBox == 2) {
		document.getElementById("dialogue-box-3").style.opacity = 0.0;
	}
	if (currentDialogueBox == 3) {
		document.getElementById("dialogue-box-1").style.opacity = 0.0;
	}
}

function fadeAllLines() {
	document.getElementById("dialogue-box-1").style.opacity = 0.0;
	document.getElementById("dialogue-box-2").style.opacity = 0.0;
	document.getElementById("dialogue-box-3").style.opacity = 0.0;
}

function examineDown(e) {
    examineGrabbedPoint.x = Number.isInteger(e.clientX) ? e.clientX : e.touches[0].clientX;
    examineGrabbedPoint.y = Number.isInteger(e.clientY) ? e.clientY : e.touches[0].clientY;
    examineFirstGrabbedPoint.x = Number.isInteger(e.clientX) ? e.clientX : e.touches[0].clientX;
    examineFirstGrabbedPoint.y = Number.isInteger(e.clientY) ? e.clientY : e.touches[0].clientY;
    lastClickableLocation.x = document.getElementById("examine").offsetLeft;
    lastClickableLocation.y = document.getElementById("examine").offsetTop;
    lastClickableSoundPoint.x = document.getElementById("examine").offsetLeft;
    lastClickableSoundPoint.y = document.getElementById("examine").offsetTop;

    timeExamineHeldDown = new Date().getTime();
    
	document.getElementById("container").removeEventListener('pointermove', preventDefault, event);
	document.getElementById("container").removeEventListener('touchmove', preventDefault, event);
    
    document.onmousemove = function(e) {moveExamine(e)};
    document.ontouchmove = function(e) {moveExamine(e)};
    document.onmouseup = function(e) {releaseExamine(e)};
    document.ontouchend = function(e) {releaseExamine(e)};
}

function moveExamine(e) {
	var rect = document.getElementById("examine").getBoundingClientRect();
	var containerRect = document.getElementById("examine-container").getBoundingClientRect();
	var diffX = (Number.isInteger(e.clientX) ? e.clientX : e.touches[0].clientX) - examineGrabbedPoint.x;
	var diffY = (Number.isInteger(e.clientY) ? e.clientY : e.touches[0].clientY) - examineGrabbedPoint.y;
	examineGrabbedPoint.x = Number.isInteger(e.clientX) ? e.clientX : e.touches[0].clientX;
	examineGrabbedPoint.y = Number.isInteger(e.clientY) ? e.clientY : e.touches[0].clientY;

	let prevClickableX = document.getElementById("examine").offsetLeft;
	let prevClickableY = document.getElementById("examine").offsetTop;
	
	if (document.getElementById("examine").offsetWidth > document.getElementById("examine-container").offsetWidth) { // horizontal movement
		if (document.getElementById("examine").offsetLeft + diffX <= document.getElementById("examine").offsetWidth / 2 &&
			rect.right + diffX >= containerRect.right - 4) { // can move horizontally
			document.getElementById("examine").style.left = (document.getElementById("examine").offsetLeft + diffX) + "px";
			lastClickableLocation.x = document.getElementById("examine").offsetLeft;
		}
	}
	if (document.getElementById("examine").offsetHeight > document.getElementById("examine-container").offsetHeight) { // vertical movement
		if (document.getElementById("examine").offsetTop + diffY <= document.getElementById("examine").offsetHeight / 2 &&
			rect.bottom + diffY >= containerRect.bottom - 4) { // can move vertically
			document.getElementById("examine").style.top = (document.getElementById("examine").offsetTop + diffY) + "px";
			lastClickableLocation.y = document.getElementById("examine").offsetTop;
		}
	}

	if (Math.abs(prevClickableX - lastClickableSoundPoint.x) > 10 || Math.abs(prevClickableY - lastClickableSoundPoint.y) > 10) { // make a little noise
		lastClickableSoundPoint.x = document.getElementById("examine").offsetLeft;
		lastClickableSoundPoint.y = document.getElementById("examine").offsetTop;
		playSfx("moveexamine");
	}
}

function releaseExamine(e) {
	document.getElementById("container").addEventListener('pointermove', preventDefault, event);
	document.getElementById("container").addEventListener('touchmove', preventDefault, event);

	document.onmousemove = null;
    document.ontouchmove = null;
}

function clickareaUp(clickareaIndex) {
	if (clickareaDestinations[clickareaIndex] == null) {
		advanceScript();
	}
	else {
		goto(clickareaDestinations[clickareaIndex]);
	}
}

function resizeClickable() { // I hate this function.
	let startingWidth = document.getElementById("clickable-container").offsetWidth;
	let startingHeight = document.getElementById("clickable-container").offsetHeight;
	startingHeight -= parseFloat(getComputedStyle(document.getElementById("clickable-img")).marginTop);

	if (startingWidth <= 0 || startingHeight <= 0) {
		if (document.getElementById("clickable").style.display == "block")
			timers.push(new Timer(resizeClickable, 200));
		return;
	}

	if (window.innerWidth > window.innerHeight)
		document.getElementById("clickable-container").style.transformOrigin = "center top";
	else
		document.getElementById("clickable-container").style.transformOrigin = "left top";

	let heightGoal = (window.innerHeight * 0.75) - 170;
	let widthGoal = window.innerWidth;

	let currentScale = 1;
	let currentWidth = startingWidth * currentScale;
	let currentHeight = startingHeight * currentScale;

	//console.log("start, w: " + currentWidth + " / " + widthGoal + ", h: " + currentHeight + " / " + heightGoal);

	if (currentWidth < widthGoal && currentHeight < heightGoal) {
		while (currentWidth < widthGoal && currentHeight < heightGoal) {
			currentScale += 0.05;
			currentWidth = startingWidth * currentScale;
			currentHeight = startingHeight * currentScale;

			if (currentWidth > widthGoal || currentHeight > heightGoal)
				break;

			
			//console.log("up, w: " + currentWidth + " / " + widthGoal + ", h: " + currentHeight + " / " + heightGoal);

			document.getElementById("clickable-container").style.transform = "scale(" + (currentScale) + ")";
		}
	}
	else if (currentWidth > widthGoal || currentHeight > heightGoal) {
		while (currentWidth > widthGoal || currentHeight > heightGoal) {
			currentScale -= 0.05;
			currentWidth = startingWidth * currentScale;
			currentHeight = startingHeight * currentScale;

			if (currentWidth < widthGoal && currentHeight < heightGoal)
				break;

			
			//console.log("down, w: " + currentWidth + " / " + widthGoal + ", h: " + currentHeight + " / " + heightGoal);

			document.getElementById("clickable-container").style.transform = "scale(" + (currentScale) + ")";
		}
	}
}

function examineareaUp(e, examineareaIndex) {
	if (examineActive) {
		var rect = document.getElementById("examine").getBoundingClientRect();
		var clickedPosition = { x: e.clientX - rect.left, y: e.clientY - rect.top };

		if (new Date().getTime() - timeExamineHeldDown < 500) { // first condition: short tap
			if (Math.abs(e.clientX - examineFirstGrabbedPoint.x) < 5 && Math.abs(e.clientY - examineFirstGrabbedPoint.y) < 5) { // second condition: didn't move too much
				document.getElementById("examine-cursor").style.display = "block";
				document.getElementById("examine-cursor").style.left = clickedPosition.x + "px";
				document.getElementById("examine-cursor").style.top = clickedPosition.y + "px";

				examineareaSelectedTarget = examineDestinations[examineareaIndex];

				playSfx('selectexamine');

				document.getElementById("confirm-button").src = "icons/checkarrow.png";
				document.getElementById("confirm-button").style.display = "block";
				timers.push(new Timer(function () {
					document.getElementById("confirm-button").style.opacity = 1.0;
				}, 100));
			}
		}
	}
}

function confirmSelection() {
	if ((selectingChoice || examineActive) && document.getElementById("confirm-button").style.display == "block") {

		playSfx("confirm");
		document.getElementById("choice-menu-title").style.opacity = 0.0;
		document.getElementById("dialogue-box-" + previousDialogueBox).style.opacity = 0.0;
		document.getElementById("confirm-button").style.opacity = 0.0;

		if (selectingChoice) {
			choicesTried = [ null, null, null, null, null, null, null, null ];
			choicesCorrect = 0;

			document.getElementById("choice-subdescription").style.opacity = 0.0;

			for (let x = 1; x <= 7; x++) {
				document.getElementById("choice-" + x).style.pointerEvents = "none";
				document.getElementById("choice-" + x).style.top = "0px";
				document.getElementById("choice-" + x).style.left = "0px";
				document.getElementById("choice-" + x).style.boxShadow = "20px 14px 3px black";

				timers.push(new Timer(function() {
					if (document.getElementById("choice-" + x).style.display == "block")
						playSfx("choiceswipein");
					document.getElementById("choice-" + x).style.left = "150vw";
				}, 500 + (100 * x)));
			}

			timers.push(new Timer(function() {
				for (let x = 1; x <= 7; x++) {
					document.getElementById("choice-" + x).style.display = "none";
					document.getElementById("choice-" + x).style.left = "-150vw";
					document.getElementById("choice-" + x).classList.remove("selected-choice");
				}

				document.getElementById("choices").style.display = "none";
				document.getElementById("confirm-button").style.display = "none";

				document.getElementById("choice-menu-title").style.opacity = 0.0;
				advanceScript();
			}, 1210));
		}
		else if (examineActive) {
			if (examineareaSelectedTarget == null) {
				timers.push(new Timer(function() {
					document.getElementById("confirm-button").style.display = "none";
					advanceScript();
				}, 1000));
			}
			else {
				timers.push(new Timer(function() {
					document.getElementById("confirm-button").style.display = "none";
					goto(examineareaSelectedTarget);
				}, 1000));
			}
		}

		selectingChoice = false;
		examineActive = false;
	}
}

function preAdvance() {
	if (canAdvance) {
		playSfx("tap");
		document.getElementById("dialogue-boxes").style.marginTop = "4px";
	}
}

function tryToAdvance() {
	document.getElementById("dialogue-boxes").style.marginTop = "0px";

	if (canAdvance) {
		playSfx("advance");
		advanceScript();
	}
}

function advanceScript() {
	setCanAdvance(false);
	canBack = false;
	document.getElementById("back-button").style.opacity = 0.25;
	let autoAdvance = false;

	document.getElementById("advance-star-1").style.display = "none";
	document.getElementById("advance-star-2").style.display = "none";
	document.getElementById("advance-star-3").style.display = "none";

	if (scripts[currentChapter][scriptPosition].name == "COMMAND") {
		let commandValue = scripts[currentChapter][scriptPosition].commandValue;
		let commandValue2;
		let commandValue3;
		let box;

		switch(scripts[currentChapter][scriptPosition].commandName) { // execute commands
			case "DEBUGCLICKABLES":
				DEBUG_CLICKABLES = true;
				autoAdvance = true;
				break;
			case "CHAPTERINFO":
				autoAdvance = true;
				break;
			case "REMOVEUI":
				document.getElementById("opening-ui").style.opacity = 0.0;
				document.getElementById("opening-ui").style.pointerEvents = "none";
				autoAdvance = true;
				break;
			case "SPLASH":
				document.getElementById("splash-image").style.background = "url(" + commandValue + ") no-repeat center / contain";
				document.getElementById("splash-image").style.display = "block";
				autoAdvance = true;
				break;
			case "REMOVESPLASH":
				document.getElementById("splash-image").style.display = "none";
				autoAdvance = true;
				break;
			case "PANIMAGE":
				document.getElementById("panned-image").src = commandValue;
				document.getElementById("image-panner").style.display = "block";
				timers.push(new Timer(function() {
					document.getElementById("image-panner").style.bottom = "0vh";
				}, 100));
				autoAdvance = true;
				break;
			case "REMOVEPANIMAGE":
				document.getElementById("image-panner").style.opacity = 0.0;

				timers.push(new Timer(function() {
					document.getElementById("image-panner").style.display = "none";
					document.getElementById("image-panner").style.bottom = "100vh";
					document.getElementById("image-panner").style.opacity = 1.0;
				}, 500));
				
				autoAdvance = true;
				break;
			case "CLEAREVERYTHING":
				break;
			case "CUTTOBLACK":
				document.getElementById("curtain").style.transition = "none";
				document.getElementById("curtain").style.opacity = 1.0;
				document.getElementById("curtain").style.pointerEvents = "auto";
				autoAdvance = true;
				break;
			case "FADETOBLACK":
				document.getElementById("curtain").style.transition = "opacity 3s";
				document.getElementById("curtain").style.opacity = 1.0;
				document.getElementById("curtain").style.pointerEvents = "auto";

				timers.push(new Timer(advanceScript, 4000));
				break;
			case "FADEIN":
				document.getElementById("curtain").style.transition = "opacity 3s";
				document.getElementById("curtain").style.opacity = 0.0;
				document.getElementById("curtain").style.pointerEvents = "none";

				timers.push(new Timer(advanceScript, 4000));
				break;
			case "NEXTCHAPTER":
				loadChapter(++currentChapter);
				break;
			case "HEADER":
				commandValue2 = scripts[currentChapter][scriptPosition].commandValue2;

				document.getElementById("dialogue-box-1").style.opacity = 0.0;
				document.getElementById("dialogue-box-2").style.opacity = 0.0;
				document.getElementById("dialogue-box-3").style.opacity = 0.0;

				document.getElementById("chapter-title").innerHTML = commandValue;
				document.getElementById("chapter-subtitle").innerHTML = commandValue2;

				if (commandValue2 == "none")
					document.getElementById("chapter-subtitle").style.display = "none";
				else
					document.getElementById("chapter-subtitle").style.display = "block";

				playSfx("chapter");

				document.getElementById("chapter-header").style.opacity = 1.0;
				document.getElementById("chapter-header").style.top = "50%";

				timers.push(new Timer(function() {
					document.getElementById("chapter-header").style.opacity = 0.0;
					document.getElementById("chapter-header").style.top = "45%";
				}, 4000));

				timers.push(new Timer(function() {
					document.getElementById("chapter-header").style.top = "55%";
					advanceScript();
				}, 6000));
				break;
			case "PLAYER":
				document.getElementById("interactive-player").style.height = "100px";

				document.getElementById("interactive-player-audio-container").innerHTML = "<audio id='interactive-player-audio' preload='auto'><source src='sfx/" + commandValue + ".ogg' type='audio/ogg'><source src='sfx/" + commandValue + ".mp3' type='audio/mp3'></audio>";
				document.getElementById("player-play-button").innerHTML = "&#10074;&#10074;";

				topPlayerPlaying = true;
				player.pause();

				closedCaptions = [];

				if (soundEnabled)
					document.getElementById("interactive-player-audio").volume = 1;
				else
					document.getElementById("interactive-player-audio").volume = 0;

				document.getElementById("interactive-player-audio").play();
				document.getElementById("interactive-player-audio").ontimeupdate = function() {
					if (topPlayerPlaying && closedCaptionsOn) {
						let second = parseInt(document.getElementById("interactive-player-audio").currentTime);
						let caption = closedCaptions.find( ({time}) => time === second);
						if (typeof caption !== "undefined") {
							if (caption.caption == null) {
								document.getElementById("closed-captions").style.display = "none";
							}
							else {
								document.getElementById("closed-captions").innerHTML = caption.caption;
								document.getElementById("closed-captions").style.display = "block";
							}
						}
					}
					
					document.getElementById("player-progress-bar").style.width = map(document.getElementById("interactive-player-audio").currentTime, 0, document.getElementById("interactive-player-audio").duration, 0, 100) + "%";
				}

				document.getElementById("interactive-player-audio").addEventListener('ended', function playerListener() {
					if (musicPlaying && soundEnabled)
						player.play();

					document.getElementById("closed-captions").style.display = "none";

					topPlayerPlaying = false;
					document.getElementById("player-play-button").innerHTML = "&#x25B6;&#xFE0E;";
				});

				document.getElementById("interactive-player-audio").addEventListener('ended', function playerFirstTimeListener() {
					topPlayerPlaying = false;
					advanceScript();
				    document.getElementById("interactive-player-audio").removeEventListener('ended', playerFirstTimeListener);
				});

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "CC" || scripts[currentChapter][scriptPosition + 1].commandName == "CLEARCC") {
						autoAdvance = true;
					}
				}
				break;
			case "CC":
				commandValue2 = scripts[currentChapter][scriptPosition].commandValue2;
				closedCaptions.push( { time: parseInt(commandValue), caption: commandValue2 } );

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "CC" || scripts[currentChapter][scriptPosition + 1].commandName == "CLEARCC") {
						autoAdvance = true;
					}
				}
				break;
			case "CLEARCC":
				closedCaptions.push( { time: parseInt(commandValue), caption: null } );

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "CC" || scripts[currentChapter][scriptPosition + 1].commandName == "CLEARCC") {
						autoAdvance = true;
					}
				}
				break;
			case "REMOVEPLAYER":
				document.getElementById("interactive-player-audio").pause();
				if (soundEnabled && musicPlaying)
					player.play();
				document.getElementById("interactive-player").style.height = "0px";
				topPlayerPlaying = false;
				timers.push(new Timer(advanceScript, 500));
				break;
			case "BGM":
				player.loop = true;
				playBgm('music/' + commandValue + "." + musicType);
				autoAdvance = true;
				break;
			case "BGMONCE":
				player.loop = false;
				playBgm('music/' + commandValue + "." + musicType);
				autoAdvance = true;
				break;
			case "FADEBGM":
				fadeBgmOut();
				autoAdvance = true;
				break;
			case "PAUSEBGM":
				player.pause();
				musicPlaying = false;
				autoAdvance = true;
				break;
			case "RESUMEBGM":
				if (soundEnabled)
					player.play();
				musicPlaying = true;
				autoAdvance = true;
				break;
			case "SFX":
				playSfx(commandValue);
				document.getElementById("sfx-" + commandValue).addEventListener('ended', function sfxListener() {
					advanceScript();
				    document.getElementById("sfx-" + commandValue).removeEventListener('ended', sfxListener);
				});
				break;
			case "QUICKSFX":
				playSfx(commandValue);
				autoAdvance = true;
				break;
			case "BACKGROUND":
				document.getElementById("background-fader-img").src = commandValue;
				document.getElementById("background-fader-img").style.transition = "opacity 1s";
				document.getElementById("background-img").style.transition = "opacity 1s";

				document.getElementById("background-fader-img").onload = function() {
					timers.push(new Timer(function() {
						document.getElementById("background-fader-img").style.opacity = 1.0;
					}, 100));

					timers.push(new Timer(function() {
						document.getElementById("background-img").style.opacity = 0.0;
					}, 800));

					timers.push(new Timer(function() {
						document.getElementById("background-img").style.transition = "none";
						document.getElementById("background-img").src = commandValue;
					}, 1000));

					timers.push(new Timer(function() {
						document.getElementById("background-img").style.opacity = 1.0;
						document.getElementById("background-fader-img").style.transition = "none";
					}, 1100));

					timers.push(new Timer(function() {
						document.getElementById("background-fader-img").style.opacity = 0.0;
					}, 1200));

					timers.push(new Timer(advanceScript, 1700));
				};
				
				break;
			case "INSTANTBACKGROUND":
				document.getElementById("background-img").src = commandValue;
				document.getElementById("background-img").style.transition = "none";
				document.getElementById("background-img").style.opacity = 1.0;
				autoAdvance = true;
				break;
			case "REMOVEBACKGROUND":
				document.getElementById("background-img").style.transition = "opacity 1s";
				document.getElementById("background-fader-img").style.transition = "opacity 1s";
				document.getElementById("background-img").style.opacity = 0.0;
				document.getElementById("background-fader-img").style.opacity = 0.0;
				timers.push(new Timer(advanceScript, 1200));
				break;
			case "FADEINIMAGE":
				break;
			case "OVERLAPIMAGEFADE":
				break;
			case "IMAGELEFT":
				document.getElementById("image-left").src = commandValue;
				document.getElementById("image-left").onload = function() {
					displayImageLeft();
					timers.push(new Timer(advanceScript, 500));
				}
				

				break;
			case "IMAGE":
				document.getElementById("image-center").src = commandValue;
				document.getElementById("image-center").onload = function() {
					displayImageCenter();
					timers.push(new Timer(advanceScript, 500));
				}

				break;
			case "IMAGERIGHT":
				document.getElementById("image-right").src = commandValue;
				document.getElementById("image-right").onload = function() {
					displayImageRight();
					timers.push(new Timer(advanceScript, 500));
				}

				break;
			case "IMAGETWO":
				document.getElementById("image-left").src = commandValue;
				commandValue2 = scripts[currentChapter][scriptPosition].commandValue2;

				document.getElementById("image-left").onload = function() {
					displayImageLeft();

					

					timers.push(new Timer(function() {
						document.getElementById("image-right").src = commandValue2;
						document.getElementById("image-right").onload = function() {
							displayImageRight();

							timers.push(new Timer(advanceScript, 500));
						}
					}, 250));
				}

				break;
			case "IMAGETHREE":
				commandValue2 = scripts[currentChapter][scriptPosition].commandValue2;
				commandValue3 = scripts[currentChapter][scriptPosition].commandValue3;

				document.getElementById("image-left").src = commandValue;
				document.getElementById("image-left").onload = function() {
					displayImageLeft();

					timers.push(new Timer(function() {
						document.getElementById("image-center").src = commandValue2;
						document.getElementById("image-center").onload = function() {
							displayImageCenter();
						}
					}, 250));

					timers.push(new Timer(function() {
						document.getElementById("image-right").src = commandValue3;
						document.getElementById("image-right").onload = function() {
							displayImageRight();

							timers.push(new Timer(advanceScript, 500));
						}
					}, 500));
				}

				break;
			case "REMOVEIMAGELEFT":
				removeImageLeft();
				timers.push(new Timer(function() {
					advanceScript();
				}, 250));
				break;
			case "REMOVEIMAGE":
				removeImageCenter();
				timers.push(new Timer(function() {
					advanceScript();
				}, 250));
				break;
			case "REMOVEIMAGERIGHT":
				removeImageRight();
				timers.push(new Timer(function() {
					advanceScript();
				}, 250));
				break;
			case "REVEALEXAMINE":
				document.getElementById("examine-img").src = commandValue;
				document.getElementById("examine").style.left = "50%";
				document.getElementById("examine").style.top = "50%";
				document.getElementById("examine-container").style.display = "block";
				document.getElementById("examine-cursor").style.display = "none";
				timers.push(new Timer(function() {
					document.getElementById("examine-container").style.opacity = 1.0;
				}, 100));

				autoAdvance = true;
				break;
			case "TITLE":
				document.getElementById("choice-menu-title").innerHTML = commandValue;
				document.getElementById("choice-menu-title").style.opacity = 1.0;
				autoAdvance = true;
				break;
			case "REMOVETITLE":
				document.getElementById("choice-menu-title").style.opacity = 0.0;
				autoAdvance = true;
				break;
			case "CLICKABLE": // MUST BE FOLLOWED BY CLICKAREAS
				fadePreviousLine();

				clickareaDestinations = [ null, null, null, null, null, null, null, null ];

				document.getElementById("clickable-img").src = commandValue;
				document.getElementById("clickable").style.display = "block";

				document.getElementById("clickarea-1").style.display = "none";
				document.getElementById("clickarea-2").style.display = "none";
				document.getElementById("clickarea-3").style.display = "none";
				document.getElementById("clickarea-4").style.display = "none";
				document.getElementById("clickarea-5").style.display = "none";
				document.getElementById("clickarea-6").style.display = "none";
				document.getElementById("clickarea-7").style.display = "none";

				document.getElementById("clickable-img").onload = function() {
					timers.push(new Timer(function() {
						document.getElementById("clickable-img").style.marginTop = "0px";
						document.getElementById("clickable-img").style.opacity = 1.0;
						resizeClickable();
					}, 100));
				};

				numberOfClickareas = 0;

				autoAdvance = true;
				break;
			case "CLICKAREA":
				numberOfClickareas++;

				document.getElementById("clickarea-" + numberOfClickareas).style.display = "block";

				clickareaDestinations[numberOfClickareas] = scripts[currentChapter][scriptPosition].markerTarget;

				if (scripts[currentChapter][scriptPosition].full) {
					document.getElementById("clickarea-" + numberOfClickareas).style.left = "0px";
					document.getElementById("clickarea-" + numberOfClickareas).style.top = "0px";
					document.getElementById("clickarea-" + numberOfClickareas).style.width = "100%";
					document.getElementById("clickarea-" + numberOfClickareas).style.height = "100%";

					if (DEBUG_CLICKABLES) {
						document.getElementById("clickarea-" + numberOfClickareas).style.backgroundColor = "rgba(0, 255, 0, 0.25)";
					}
				}
				else {
					document.getElementById("clickarea-" + numberOfClickareas).style.left = scripts[currentChapter][scriptPosition].x + "px";
					document.getElementById("clickarea-" + numberOfClickareas).style.top = scripts[currentChapter][scriptPosition].y + "px";
					document.getElementById("clickarea-" + numberOfClickareas).style.width = scripts[currentChapter][scriptPosition].width + "px";
					document.getElementById("clickarea-" + numberOfClickareas).style.height = scripts[currentChapter][scriptPosition].height + "px";

					if (DEBUG_CLICKABLES) {
						document.getElementById("clickarea-" + numberOfClickareas).style.backgroundColor = "rgba(255, 0, 0, 0.25)";
					}
				}

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "CLICKAREA") {
						autoAdvance = true;
					}
				}
				break;
			case "REMOVECLICKABLE":
				document.getElementById('clickable-img').style.opacity = 0.0;

				document.getElementById("clickarea-1").style.display = "none";
				document.getElementById("clickarea-2").style.display = "none";
				document.getElementById("clickarea-3").style.display = "none";
				document.getElementById("clickarea-4").style.display = "none";
				document.getElementById("clickarea-5").style.display = "none";
				document.getElementById("clickarea-6").style.display = "none";
				document.getElementById("clickarea-7").style.display = "none";

				timers.push(new Timer(function() {
					document.getElementById("clickable").style.display = "none";
					advanceScript();
				}, 500));
				break;
			case "EXAMINE":
				fadePreviousLine();

				examineActive = true;

				document.getElementById("examine-img").src = commandValue;
				if (document.getElementById("examine-container").style.opacity != 1) {
					document.getElementById("examine").style.left = "50%";
					document.getElementById("examine").style.top = "50%";
				}
				document.getElementById("examine-container").style.display = "block";
				document.getElementById("examine-cursor").style.display = "none";
				timers.push(new Timer(function() {
					document.getElementById("examine-container").style.opacity = 1.0;
				}, 100));

				examineDestinations = [ null, null, null, null, null, null, null, null ];

				numberOfExamineareas = 0;
				examineareaSelectedTarget = null;

				document.getElementById("choice-menu-title").innerHTML = "DRAG TO MOVE";

				document.getElementById("choice-menu-title").style.opacity = 1.0;

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "EXAMINEAREA") {
						if (device == DESKTOP)
							document.getElementById("choice-menu-title").innerHTML = "DRAG TO MOVE, CLICK TO SELECT";
						else if (device == MOBILE)
							document.getElementById("choice-menu-title").innerHTML = "DRAG TO MOVE, TAP TO SELECT";

						autoAdvance = true;
					}
				}

				if (!autoAdvance) {
					document.getElementById("confirm-button").src = "icons/moveonarrow.png";
					document.getElementById("confirm-button").style.display = "block";
					document.getElementById("confirm-button").style.opacity = 1.0;
				}
				break;
			case "EXAMINEAREA":
				numberOfExamineareas++;

				document.getElementById("examinearea-" + numberOfExamineareas).style.display = "block";

				

				if (scripts[currentChapter][scriptPosition].full) {
					document.getElementById("examinearea-" + numberOfExamineareas).style.left = "0px";
					document.getElementById("examinearea-" + numberOfExamineareas).style.top = "0px";
					document.getElementById("examinearea-" + numberOfExamineareas).style.width = "100%";
					document.getElementById("examinearea-" + numberOfExamineareas).style.height = "100%";

					if (DEBUG_CLICKABLES) {
						document.getElementById("examinearea-" + numberOfExamineareas).style.backgroundColor = "rgba(0, 255, 0, 0.25)";
					}
				}
				else {
					document.getElementById("examinearea-" + numberOfExamineareas).style.left = scripts[currentChapter][scriptPosition].x + "px";
					document.getElementById("examinearea-" + numberOfExamineareas).style.top = scripts[currentChapter][scriptPosition].y + "px";
					document.getElementById("examinearea-" + numberOfExamineareas).style.width = scripts[currentChapter][scriptPosition].width + "px";
					document.getElementById("examinearea-" + numberOfExamineareas).style.height = scripts[currentChapter][scriptPosition].height + "px";

					if (DEBUG_CLICKABLES) {
						document.getElementById("examinearea-" + numberOfExamineareas).style.backgroundColor = "rgba(255, 0, 0, 0.25)";
					}
				}

				examineDestinations[numberOfExamineareas] = scripts[currentChapter][scriptPosition].markerTarget;

				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "EXAMINEAREA") {
						autoAdvance = true;
					}
				}
				break;
			case "REMOVEEXAMINE":

				document.getElementById('examine-container').style.opacity = 0.0;

				for (var x = 1; x <= 10; x++) {
					document.getElementById("examinearea-" + x).style.display = "none";
					document.getElementById("examinearea-" + x).style.left = "0px";
					document.getElementById("examinearea-" + x).style.top = "0px";
					document.getElementById("examinearea-" + x).style.backgroundColor = "transparent";
				}

				timers.push(new Timer(function() {
					document.getElementById('examine-container').style.display = "none";
					document.getElementById('examine-cursor').style.display = "none";
					advanceScript();
				}, 500));
				break;
			case "QUIZ": // JUST A CHOICE WITH DIFFERENT STYLING
				isQuizStyle = true;

				document.getElementById("choices").classList.add("quiz");
				document.getElementById("choice-1").classList.add("quiz");
				document.getElementById("choice-2").classList.add("quiz");
				document.getElementById("choice-3").classList.add("quiz");
				document.getElementById("choice-4").classList.add("quiz");
				document.getElementById("choice-5").classList.add("quiz");
				document.getElementById("choice-6").classList.add("quiz");
				document.getElementById("choice-7").classList.add("quiz");
			case "CHOICE": // MUST BE FOLLOWED BY OPTIONS
				fadePreviousLine();

				currentChoiceIndex = 1;
				autoAdvance = true;

				choiceDestinations = [ null, null, null, null, null, null, null, null ];
				choiceResults = [ null, null, null, null, null, null, null, null ];

				if (!isQuizStyle) {
					document.getElementById("choices").classList.remove("quiz");
					document.getElementById("choice-1").classList.remove("quiz");
					document.getElementById("choice-2").classList.remove("quiz");
					document.getElementById("choice-3").classList.remove("quiz");
					document.getElementById("choice-4").classList.remove("quiz");
					document.getElementById("choice-5").classList.remove("quiz");
					document.getElementById("choice-6").classList.remove("quiz");
					document.getElementById("choice-7").classList.remove("quiz");
				}

				document.getElementById("choices").style.display = "flex";

				document.getElementById("choice-2").style.display = "none";
				document.getElementById("choice-3").style.display = "none";
				document.getElementById("choice-4").style.display = "none";
				document.getElementById("choice-5").style.display = "none";
				document.getElementById("choice-6").style.display = "none";
				document.getElementById("choice-7").style.display = "none";

				var timeToElapse = 100;
				let scriptChecker = scriptPosition + 1;

				while (scripts[currentChapter][scriptChecker].name == "COMMAND") {
					if (scripts[currentChapter][scriptChecker].commandName == "OPTION") {
						let time = timeToElapse;
						let choice = currentChoiceIndex;

						timers.push(new Timer(function() {
							playSfx("choiceswipein");
							document.getElementById("choice-" + choice).style.left = "0vw";
						}, time));

						timeToElapse += 100;
						scriptChecker++;
						currentChoiceIndex++;
					}
					else {
						break;
					}
				}

				currentChoiceIndex = 1;
				numberOfChoices = 0;
				choicesCorrect = 0;
				choiceTarget = scripts[currentChapter][scriptPosition].goal;

				if (scripts[currentChapter][scriptPosition].subdescription == "none")
					document.getElementById("choice-subdescription").innerHTML = "";
				else
					document.getElementById("choice-subdescription").innerHTML = scripts[currentChapter][scriptPosition].subdescription;

				timers.push(new Timer(function() {
					document.getElementById("choice-1").style.pointerEvents = "auto";
					document.getElementById("choice-2").style.pointerEvents = "auto";
					document.getElementById("choice-3").style.pointerEvents = "auto";
					document.getElementById("choice-4").style.pointerEvents = "auto";
					document.getElementById("choice-5").style.pointerEvents = "auto";
					document.getElementById("choice-6").style.pointerEvents = "auto";
					document.getElementById("choice-7").style.pointerEvents = "auto";

					selectingChoice = true;
				}, timeToElapse));

				document.getElementById("choice-menu-title").innerHTML = scripts[currentChapter][scriptPosition].description;
				document.getElementById("choice-menu-title").style.opacity = 1.0;
				if (!isQuizStyle)
					document.getElementById("choice-subdescription").style.opacity = 1.0;

				isQuizStyle = false;
				
				break;
			case "OPTION":
				document.getElementById("choice-" + currentChoiceIndex).style.display = "block";
				document.getElementById("choice-" + currentChoiceIndex + "-mark").style.display = "none";
				document.getElementById("choice-" + currentChoiceIndex + "-text").innerHTML = scripts[currentChapter][scriptPosition].label;

				let optionIndex = currentChoiceIndex;
				let target = scripts[currentChapter][scriptPosition].markerTarget;

				choiceDestinations[currentChoiceIndex] = target;

				choiceResults[currentChoiceIndex] = scripts[currentChapter][scriptPosition].result;

				if (choicesTried[currentChoiceIndex] !== null) {
					if (choicesTried[currentChoiceIndex] == "X") {
						document.getElementById("choice-" + currentChoiceIndex + "-x").style.display = "block";
						document.getElementById("choice-" + currentChoiceIndex + "-mark").style.display = "none";
					}
					else {
						if (choiceResults[currentChoiceIndex] == "PLAUSIBLE" || choiceResults[currentChoiceIndex] == "CORRECT" || choiceResults[currentChoiceIndex] == "?")
							choicesCorrect++;

						document.getElementById("choice-" + currentChoiceIndex + "-x").style.display = "none";
						document.getElementById("choice-" + currentChoiceIndex + "-mark").style.display = "block";
						document.getElementById("choice-" + currentChoiceIndex + "-mark").innerHTML = choicesTried[currentChoiceIndex];
					}
				}
				else {
					document.getElementById("choice-" + currentChoiceIndex + "-mark").style.display = "none";
					document.getElementById("choice-" + currentChoiceIndex + "-x").style.display = "none";
				}

				document.getElementById("choice-" + currentChoiceIndex).onclick = function() { selectChoice(optionIndex) };
				document.getElementById("choice-" + currentChoiceIndex).ontouchend = function() { selectChoice(optionIndex) };

				if (choicesCorrect == choiceTarget) {
					choicesCorrect++; // just to make sure it only happens once
					document.getElementById("confirm-button").style.display = "block";
					document.getElementById("confirm-button").src = "icons/moveonarrow.png";

					timers.push(new Timer(function() {
						document.getElementById("confirm-button").style.opacity = 1.0;
					}, 100));
				}


				if (scripts[currentChapter][scriptPosition + 1].name == "COMMAND") {
					if (scripts[currentChapter][scriptPosition + 1].commandName == "OPTION") {
						autoAdvance = true;
					}
				}

				currentChoiceIndex++;
				numberOfChoices++;
				break;
			case "GOTO": // goes to a specified marker ID
				goto(commandValue);
				return;
			case "MARKER":
				autoAdvance = true;
				break;
			case "FADEPREVLINE":
				fadeLineOnPrint = true;
				autoAdvance = true;
				break;
			case "FADEALLLINES":
				fadeAllLines();
				autoAdvance = true;
				break;
			case "DRAMATICLINE":
				document.getElementById("dramatic-lines").innerHTML = commandValue;
				document.getElementById("dramatic-lines").style.display = "block";

				timers.push(new Timer(function() {
					document.getElementById("dramatic-lines").style.display = "none";
					timers.push(new Timer(advanceScript, 2000));
				}, 4000));
				break;
			case "AUTOLINE":
				displayTextBox();
				break;
			case "SHAKEBOX":
				box = currentDialogueBox;
				shakeIntensity = 500;

				var shakeBox = setInterval(function () {
					let newAngle = shakeAngle + Math.PI + randomNumber(-1, 1);

					document.getElementById("dialogue-box-" + box).style.left = (Math.sin(newAngle) * shakeIntensity) + "px";
					document.getElementById("dialogue-box-" + box).style.bottom = ((Math.cos(newAngle) * shakeIntensity) + 20) + "px";

					shakeAngle = newAngle;

					shakeIntensity *= 0.85;

					if (shakeIntensity < 1) {
						document.getElementById("dialogue-box-" + box).style.left = "0px";
						document.getElementById("dialogue-box-" + box).style.bottom = "20px";

						document.getElementById("advance-star-" + box).style.display = "block";

						shakeIntensity = 0;
						setCanAdvance(true);
						clearInterval(shakeBox);
					}
				}, 50);

				autoAdvance = true;
				break;
			case "ARRIVELEFT":
				box = currentDialogueBox;

				autoAdvance = true;
				holdOpacity = true;
				setCanAdvance(false);

				document.getElementById("dialogue-box-" + currentDialogueBox).style.left = "-100vw";

				var waitTimer = timers.push(new Timer(function() {
					document.getElementById("dialogue-box-" + box).style.opacity = 1.0;
					document.getElementById("dialogue-box-" + box).style.left = "0vw";
					setCanAdvance(true);
				}, 500));
				break;
			case "ARRIVERIGHT":
				box = currentDialogueBox;

				autoAdvance = true;
				holdOpacity = true;
				setCanAdvance(false);

				document.getElementById("dialogue-box-" + currentDialogueBox).style.left = "100vw";

				var waitTimer = timers.push(new Timer(function() {
					document.getElementById("dialogue-box-" + box).style.opacity = 1.0;
					document.getElementById("dialogue-box-" + box).style.left = "0vw";
					setCanAdvance(true);
				}, 500));
				break;
			case "LEAVELEFT":
				if (currentDialogueBox == 1)
					box = 3;
				else if (currentDialogueBox == 2)
					box = 1;
				else if (currentDialogueBox == 3)
					box = 2;

				document.getElementById("dialogue-box-" + box).style.left = "-100vw";
				document.getElementById("dialogue-box-" + box).style.opacity = 0.0;

				var waitTimer = timers.push(new Timer(function() {
					document.getElementById("dialogue-box-" + box).style.left = "0vw";
				    advanceScript();
				}, 500));
				break;
			case "LEAVERIGHT":
				if (currentDialogueBox == 1)
					box = 3;
				else if (currentDialogueBox == 2)
					box = 1;
				else if (currentDialogueBox == 3)
					box = 2;

				document.getElementById("dialogue-box-" + box).style.left = "100vw";
				document.getElementById("dialogue-box-" + box).style.opacity = 0.0;

				var waitTimer = timers.push(new Timer(function() {
					document.getElementById("dialogue-box-" + box).style.left = "0vw";
				    advanceScript();
				}, 500));
				break;
			case "WAIT":
				timers.push(new Timer(advanceScript, parseInt(commandValue)));
				break;
			case "END":

				break;
			default:
				document.getElementById("dramatic-lines").innerHTML = "INVALID COMMAND: " + scripts[currentChapter][scriptPosition].commandName;
				document.getElementById("dramatic-lines").style.display = "block";
				break;
		}
	}
	else {
		displayTextBox();
	}

	scriptPosition++;

	if (autoAdvance)
		advanceScript();
}

function cancelAdvance() {
	document.getElementById("dialogue-boxes").style.marginTop = "0px";
}

function displayTextBox(reverse = false) {
	setCanAdvance(false);

	document.getElementById("advance-star-1").style.display = "none";
	document.getElementById("advance-star-2").style.display = "none";
	document.getElementById("advance-star-3").style.display = "none";

	currentLine = scripts[currentChapter][scriptPosition];

	let name;
	let bypassLoading = false;

	if (reverse) {
		currentDialogueBox--;
		if (currentDialogueBox < 1)
			currentDialogueBox = 3;

		previousDialogueBox = currentDialogueBox + 1;
		if (previousDialogueBox > 3)
			previousDialogueBox = 1;

		var previousLine;
		let positionCheck = scriptPosition - 1;

		while (positionCheck > 0 && scripts[currentChapter][positionCheck].name == "COMMAND") {
			if (scripts[currentChapter][positionCheck].commandName == "MARKER" || scripts[currentChapter][positionCheck].commandName == "HEADER")
				break;

			positionCheck--;
		}

		if (scripts[currentChapter][positionCheck].name == "COMMAND") {
			previousLine = null;
		}
		else {
			previousLine = scripts[currentChapter][positionCheck];
		}

		if (previousLine !== null)
			document.getElementById("dialogue-box-" + previousDialogueBox + "-text").innerHTML = previousLine.line;
	}
	else {
		document.getElementById("dialogue-box-" + currentDialogueBox + "-text").innerHTML = currentLine.line;
	}

	if (!reverse) {
		name = currentLine.name;

		if (currentLine.name == "NOONE") { // blank dialogue boxes
			bypassLoading = true;
			document.getElementById("dialogue-box-" + currentDialogueBox + "-name").innerHTML = "";
			document.getElementById("dialogue-box-" + currentDialogueBox + "-box").classList.add("no-one-talking");
			document.getElementById("dialogue-box-" + currentDialogueBox + "-portrait").classList.add("no-one-talking");
		}
		else {
			if (document.getElementById("dialogue-box-" + currentDialogueBox + "-portrait-img").src == "portraits/" + name.toLowerCase() + "/" + currentLine.expression + ".png")
				bypassLoading = true;
			else
				document.getElementById("dialogue-box-" + currentDialogueBox + "-portrait-img").src = "portraits/" + name.toLowerCase() + "/" + currentLine.expression + ".png";

			if (currentLine.alias !== null)
				name = currentLine.alias;

			document.getElementById("dialogue-box-" + currentDialogueBox + "-name").innerHTML = name; // This doesn't have to be all-caps if you don't want it to be!
			document.getElementById("dialogue-box-" + currentDialogueBox + "-box").classList.remove("no-one-talking");
			document.getElementById("dialogue-box-" + currentDialogueBox + "-portrait").classList.remove("no-one-talking");
			
		}
	}
	if (reverse && previousLine !== null) {
		name = previousLine.name;

		if (previousLine.name == "NOONE") { // blank dialogue boxes
			bypassLoading = true;
			document.getElementById("dialogue-box-" + previousDialogueBox + "-name").innerHTML = "";
			document.getElementById("dialogue-box-" + previousDialogueBox + "-box").classList.add("no-one-talking");
			document.getElementById("dialogue-box-" + previousDialogueBox + "-portrait").classList.add("no-one-talking");
		}
		else {
			if (document.getElementById("dialogue-box-" + previousDialogueBox + "-portrait-img").src == "portraits/" + name.toLowerCase() + "/" + previousLine.expression + ".png")
				bypassLoading = true;
			else
				document.getElementById("dialogue-box-" + previousDialogueBox + "-portrait-img").src = "portraits/" + name.toLowerCase() + "/" + previousLine.expression + ".png";

			if (previousLine.alias !== null)
				name = previousLine.alias;

			document.getElementById("dialogue-box-" + previousDialogueBox + "-name").innerHTML = name; // This doesn't have to be all-caps if you don't want it to be!
			document.getElementById("dialogue-box-" + previousDialogueBox + "-box").classList.remove("no-one-talking");
			document.getElementById("dialogue-box-" + previousDialogueBox + "-portrait").classList.remove("no-one-talking");
			
		}
	}

	let workingDialogueBox;

	if (reverse)
		workingDialogueBox = previousDialogueBox;
	else
		workingDialogueBox = currentDialogueBox;

	document.getElementById("dialogue-box-" + workingDialogueBox + "-portrait-img").onload = function() {
		let targetLine;
		let targetBox;

		if (reverse && previousLine !== null) {
			targetLine = previousLine;
			targetBox = previousDialogueBox;
		}
		else {
			targetLine = currentLine;
			targetBox = currentDialogueBox;
		}

		switch (targetLine.direction) {
			case "flipl":
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.transform = "scaleX(-1)";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.left = "30px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.right = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.right = "0px";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.left = "60px";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.right = "auto";
				break;
			case "l":
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.transform = "scaleX(1)";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.left = "30px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.right = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.left = "0px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.right = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.left = "60px";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.right = "auto";
				break;
			case "flipr":
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.transform = "scaleX(1)";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.right = "30px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.left = "0px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.right = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.right = "60px";
				break;
			case "r":
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.transform = "scaleX(-1)";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait").style.right = "30px";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-portrait-img").style.right = "0px";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.left = "auto";
				document.getElementById("dialogue-box-" + targetBox + "-name").style.right = "60px";
				break;
		}

		var randomRotation;

		if (ANGLED_BOXES)
			randomRotation = randomNumber(-2, 2); // Set the global to false if you don't want crooked text boxes
		else
			randomRotation = 0;

		document.getElementById("dialogue-box-" + currentDialogueBox + "-box").style.transform = "rotate(" + randomRotation + "deg)";
		document.getElementById("dialogue-box-" + currentDialogueBox + "-text").style.transform = "rotate(" + (-randomRotation) + "deg)";

		for (var x = 1; x <= 3; x++) {
			document.getElementById("dialogue-box-" + x).style.pointerEvents = "none";
		}

		previousDialogueBox = currentDialogueBox;
		let lastBox;

		if (currentDialogueBox == 1) {
			if (reverse) {
				if (previousLine !== null) {
					document.getElementById("dialogue-box-2").style.opacity = 0.7;
					document.getElementById("dialogue-box-2").style.bottom = "25vh";
				}
				lastBox = 2;
				document.getElementById("dialogue-box-3").style.opacity = 1.0;
				document.getElementById("dialogue-box-3").style.bottom = "20px";

				document.getElementById("dialogue-box-1").style.opacity = 0.0;
				document.getElementById("dialogue-box-1").style.bottom = "-50vh";

				document.getElementById("dialogue-box-3").style.order = 3;
				document.getElementById("dialogue-box-3").style.zIndex = 7;
				document.getElementById("dialogue-box-2").style.order = 2;
				document.getElementById("dialogue-box-2").style.zIndex = 6;
				document.getElementById("dialogue-box-1").style.order = 1;
				document.getElementById("dialogue-box-1").style.zIndex = 5;
			}
			else {
				document.getElementById("dialogue-box-2").style.opacity = 0.0;
				document.getElementById("dialogue-box-2").style.bottom = "30vh";
				lastBox = 2;
				if (document.getElementById("dialogue-box-3").style.opacity == 1.0) {
					if (fadeLineOnPrint) {
						document.getElementById("dialogue-box-3").style.opacity = 0.0;
					}
					else {
						document.getElementById("dialogue-box-3").style.opacity = 0.7;
					}
					document.getElementById("dialogue-box-3").style.bottom = "25vh";
				}

				document.getElementById("dialogue-box-1").style.order = 3;
				document.getElementById("dialogue-box-1").style.zIndex = 7;
				document.getElementById("dialogue-box-3").style.order = 2;
				document.getElementById("dialogue-box-3").style.zIndex = 6;
				document.getElementById("dialogue-box-2").style.order = 1;
				document.getElementById("dialogue-box-2").style.zIndex = 5;
			}
		}
		if (currentDialogueBox == 2) {
			if (reverse) {
				if (previousLine !== null) {
					document.getElementById("dialogue-box-3").style.opacity = 0.7;
					document.getElementById("dialogue-box-3").style.bottom = "25vh";
				}
				lastBox = 3;
				document.getElementById("dialogue-box-1").style.opacity = 1.0;
				document.getElementById("dialogue-box-1").style.bottom = "20px";

				document.getElementById("dialogue-box-2").style.opacity = 0.0;
				document.getElementById("dialogue-box-2").style.bottom = "-50vh";

				document.getElementById("dialogue-box-1").style.order = 3;
				document.getElementById("dialogue-box-1").style.zIndex = 7;
				document.getElementById("dialogue-box-3").style.order = 2;
				document.getElementById("dialogue-box-3").style.zIndex = 6;
				document.getElementById("dialogue-box-2").style.order = 1;
				document.getElementById("dialogue-box-2").style.zIndex = 5;
			}
			else {
				document.getElementById("dialogue-box-3").style.opacity = 0.0;
				document.getElementById("dialogue-box-3").style.bottom = "30vh";
				lastBox = 3;
				if (document.getElementById("dialogue-box-1").style.opacity == 1.0) {
					if (fadeLineOnPrint) {
						document.getElementById("dialogue-box-1").style.opacity = 0.0;
					}
					else {
						document.getElementById("dialogue-box-1").style.opacity = 0.7;
					}
					document.getElementById("dialogue-box-1").style.bottom = "25vh";
				}

				document.getElementById("dialogue-box-2").style.order = 3;
				document.getElementById("dialogue-box-2").style.zIndex = 7;
				document.getElementById("dialogue-box-1").style.order = 2;
				document.getElementById("dialogue-box-1").style.zIndex = 6;
				document.getElementById("dialogue-box-3").style.order = 1;
				document.getElementById("dialogue-box-3").style.zIndex = 5;
			}
			
		}
		if (currentDialogueBox == 3) {
			if (reverse) {
				if (previousLine !== null) {
					document.getElementById("dialogue-box-1").style.opacity = 0.7;
					document.getElementById("dialogue-box-1").style.bottom = "25vh";
				}
				lastBox = 1;
				document.getElementById("dialogue-box-2").style.opacity = 1.0;
				document.getElementById("dialogue-box-2").style.bottom = "20px";

				document.getElementById("dialogue-box-3").style.opacity = 0.0;
				document.getElementById("dialogue-box-3").style.bottom = "-50vh";

				document.getElementById("dialogue-box-2").style.order = 3;
				document.getElementById("dialogue-box-2").style.zIndex = 7;
				document.getElementById("dialogue-box-1").style.order = 2;
				document.getElementById("dialogue-box-1").style.zIndex = 6;
				document.getElementById("dialogue-box-3").style.order = 1;
				document.getElementById("dialogue-box-3").style.zIndex = 5;
			}
			else {
				document.getElementById("dialogue-box-1").style.opacity = 0.0;
				document.getElementById("dialogue-box-1").style.bottom = "30vh";
				lastBox = 1;
				if (document.getElementById("dialogue-box-2").style.opacity == 1.0) {
					if (fadeLineOnPrint) {
						document.getElementById("dialogue-box-2").style.opacity = 0.0;
					}
					else {
						document.getElementById("dialogue-box-2").style.opacity = 0.7;
					}
					document.getElementById("dialogue-box-2").style.bottom = "25vh";
				}

				document.getElementById("dialogue-box-3").style.order = 3;
				document.getElementById("dialogue-box-3").style.zIndex = 7;
				document.getElementById("dialogue-box-2").style.order = 2;
				document.getElementById("dialogue-box-2").style.zIndex = 6;
				document.getElementById("dialogue-box-1").style.order = 1;
				document.getElementById("dialogue-box-1").style.zIndex = 5;
			}
		}

		fadeLineOnPrint = false;

		let currentBox = currentDialogueBox;

		if (reverse) {
			currentBox--;
			if (currentBox < 1)
				currentBox = 3;

			timers.push(new Timer(function() {
				setCanAdvance(true);
				document.getElementById("advance-star-" + currentBox).style.display = "block";
			}, 250));
		}
		else {
			timers.push(new Timer(function() {
				document.getElementById("dialogue-box-" + lastBox).style.bottom = "-50vh";
			}, 250));

			if (holdOpacity) { // longer actions
				timers.push(new Timer(function() {
					setCanAdvance(true);
					document.getElementById("advance-star-" + currentBox).style.display = "block";
				}, 500));
			}
			else if (shakeIntensity == 0) {
				timers.push(new Timer(function() {
					setCanAdvance(true);
					document.getElementById("advance-star-" + currentBox).style.display = "block";
				}, 250));
			}

			document.getElementById("dialogue-box-" + currentDialogueBox).style.bottom = "20px";

			if (!holdOpacity)
				document.getElementById("dialogue-box-" + currentDialogueBox).style.opacity = 1.0;

			document.getElementById("dialogue-box-" + currentDialogueBox).style.pointerEvents = "auto";
		}

		holdOpacity = false;

		if (!reverse) {
			currentDialogueBox++;
			if (currentDialogueBox > 3)
				currentDialogueBox = 1;
		}

		// check if the player can go back

		let position;

		if (reverse)
			position = scriptPosition - 1;
		else
			position = scriptPosition - 2;

		while (position > 0) {
			if (scripts[currentChapter][position].name == "COMMAND") {
				if (scripts[currentChapter][position].commandName == "MARKER" || scripts[currentChapter][position].commandName == "HEADER")
					break;
			}
			else {
				canBack = true;
				document.getElementById("back-button").style.opacity = 0.75;
				break;
			}

			position--;
		}

		if (!canBack)
			document.getElementById("back-button").style.opacity = 0.25;
	}

	if (bypassLoading || (reverse && previousLine == null))
		document.getElementById("dialogue-box-" + workingDialogueBox + "-portrait-img").onload();
}

function setCanAdvance(can) {
	canAdvance = can;
	if (canAdvance)
		document.getElementById("dialogue-boxes").style.cursor = "pointer";
	else
		document.getElementById("dialogue-boxes").style.cursor = "default";
}