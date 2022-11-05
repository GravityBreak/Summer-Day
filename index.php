<!DOCTYPE html>
<head>
	<link href='style.css' rel='stylesheet' type='text/css' />
	<script src="gapless5.js" language="JavaScript" type="text/javascript"></script>
	<script>
		<?php
			echo "var scripts = [];";
			echo "var markerSets = [];";
			$chapter_info = array();
			$num_scripts = count(glob("scripts/*")) - 1;
			for ($y = 0; $y <= $num_scripts; $y++) {
				$file_arr = file("scripts/".$y.".txt");
	            $num_lines = count($file_arr);
	            $markers = array();
	            echo "scripts[".$y."] = ["; // make this put every file into a single script
	                for ($x = 0; $x < $num_lines; $x++) {
	                	echo "{ ";
	                		$line = explode("|", $file_arr[$x]);
	                		$line = str_replace(array("\r", "\n"), '', $line);

	                		$alias = null;
	                		$name = explode("*", $line[0]);
	                		if (count($name) == 2)
	                			$alias = $name[1];

	                		echo "id: ".$x.", ";
	                		echo "name: '".$name[0]."', ";
	                		if ($line[0] == "COMMAND") {
	                			echo "commandName: '".$line[1]."', ";
	                			switch ($line[1]) {
		                			case "LOADBGM":
		                			case "LOADPLAYERAUDIO":
		                			case "LOADSFX":
		                			case "LOADIMAGE":
		                			case "SPLASH":
		                			case "PANIMAGE":
		                			case "BACKGROUND":
		                			case "INSTANTBACKGROUND":
		                			case "DRAMATICLINE":
		                			case "PLAYER":
		                			case "CLEARCC":
									case "BGM":
									case "BGMONCE":
									case "SFX":
									case "QUICKSFX":
									case "IMAGE":
									case "IMAGELEFT":
									case "IMAGERIGHT":
									case "REVEALCLICKABLE":
									case "CLICKABLE":
									case "REVEALEXAMINE":
									case "EXAMINE":
									case "TITLE":
									case "GOTO":
									case "WAIT":
										echo "commandValue: '".$line[2]."', ";
										break;
									case "HEADER":
									case "CC":
									case "IMAGETWO":
										echo "commandValue: '".addslashes($line[2])."', ";
										echo "commandValue2: '".addslashes($line[3])."', ";
										break;
									case "IMAGETHREE":
										echo "commandValue: '".addslashes($line[2])."', ";
										echo "commandValue2: '".addslashes($line[3])."', ";
										echo "commandValue3: '".addslashes($line[4])."', ";
										break;
									case "CLICKAREA":
									case "EXAMINEAREA":
										echo "full:" ;
										if ($line[2] == "full") {
											echo "true, ";

											if ($line[3] == "next")
												echo "markerTarget: null,";
											else
												echo "markerTarget: '".$line[3]."',";
										}
										else {
											echo "false, ";
											echo "x: ".$line[2].", ";
											echo "y: ".$line[3].", ";
											echo "width: ".$line[4].", ";
											echo "height: ".$line[5].", ";

											if ($line[6] == "next")
												echo "markerTarget: null, ";
											else
												echo "markerTarget: '".$line[6]."', ";
										}
										
										break;
									case "CHAPTERINFO":
										$chapter_info_piece = array();
										$chapter_info_piece['id'] = $y;
										$chapter_info_piece['name'] = $line[2];
										$chapter_info_piece['description'] = $line[3];
										array_push($chapter_info, $chapter_info_piece);
										break;
									case "MARKER":
										$marker = array();
										$marker['id'] = $line[2];
										$marker['line_id'] = $x;
										array_push($markers, $marker);
										echo "markerId: '".$line[2]."', ";
										break;
									case "CHOICE":
										echo "description: '".addslashes($line[2])."', ";
		                				echo "subdescription: '".addslashes($line[3])."', ";
		                				echo "goal: ".$line[4].", ";
										break;
									case "QUIZ":
										echo "description: '".addslashes($line[2])."', ";
										break;
									case "OPTION":
										echo "result: '".addslashes($line[2])."', ";
										echo "label: '".addslashes($line[3])."', ";
		                				echo "markerTarget: '".$line[4]."', ";
										break;
		                		}
	                		}
	                		else {
	                			echo "expression: '".$line[1]."', ";
	                			echo "direction: '".$line[2]."', ";
	                			echo "line: '".addslashes($line[3])."', ";
	                			if (!is_null($alias))
	                				echo "alias: '".$alias."', ";
	                			else
	                				echo "alias: null, ";
	                		}
	                			
	                	echo "},\n";
	                }
				echo "];\n";
				echo "markerSets[".$y."] = [";
					for ($x = 0; $x < count($markers); $x++) {
		            	echo "{ id: '".$markers[$x]['id']."', lineId: ".$markers[$x]['line_id']." },";
		            }
		        echo "];";
	    	}
		?>
	</script>
	<script src="game.js" type="text/javascript">document.title = TITLE;</script>
</head>

<body onload="pageLoad()" onTouchMove="preventDefault(event)">
	<div id="container">
	<div id="texture"></div>
	<div id="background">
			<img id="background-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
	</div>
	<div id="background-fader">
		<img id="background-fader-img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
	</div>
	<div id="curtain"></div>
	<div id="splash-image"></div>
	<div id="image-panner">
		<img id="panned-image" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
	</div>

	<div id="gapless5-player" style="display: none;"></div>

	<div id="sound-selector">
		<div id="sound-select" class='beginning' onclick='begin(1)' ontouchend='playWebaudioInitiator()' style='width: 100%; height: 50%; text-align: center; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fce00e;'><p style='flex: 1 1 auto;'>SOUND</p></div>
		<div id="no-sound-select" class='beginning' onclick='begin(0)' ontouchend='playWebaudioInitiator()' style='width: 100%; height: 50%; text-align: center; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fce00e;'><p style='flex: 1 1 auto;'>NO SOUND</p></div>
	</div>

	<div id="loaded-bgm"></div>
	<div id="loaded-base-sfx">
		<audio preload="auto" id="webaudio-initiator">
			<source src="data:audio/ogg;base64,T2dnUwACAAAAAAAAAAAyzN3NAAAAAGFf2X8BM39GTEFDAQAAAWZMYUMAAAAiEgASAAAAAAAkFQrEQPAAAAAAAAAAAAAAAAAAAAAAAAAAAE9nZ1MAAAAAAAAAAAAAMszdzQEAAAD5LKCSATeEAAAzDQAAAExhdmY1NS40OC4xMDABAAAAGgAAAGVuY29kZXI9TGF2YzU1LjY5LjEwMCBmbGFjT2dnUwAEARIAAAAAAAAyzN3NAgAAAKWVljkCDAD/+GkIAAAdAAABICI=" type="audio/ogg">
			<source src="data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDkAAAAAAAAAGw9wrNaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV" type="audio/mp3">
		</audio>
		<audio preload="auto" id="sfx-tap"><source src="sfx/tap.ogg" type="audio/ogg"><source src="sfx/tap.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-advance"><source src="sfx/advance.ogg" type="audio/ogg"><source src="sfx/advance.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-back"><source src="sfx/back.ogg" type="audio/ogg"><source src="sfx/back.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-image"><source src="sfx/image.ogg" type="audio/ogg"><source src="sfx/image.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-removeimage"><source src="sfx/removeimage.ogg" type="audio/ogg"><source src="sfx/removeimage.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-choiceswipein"><source src="sfx/choiceswipein.ogg" type="audio/ogg"><source src="sfx/choiceswipein.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-selectchoice"><source src="sfx/selectchoice.ogg" type="audio/ogg"><source src="sfx/selectchoice.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-moveexamine"><source src="sfx/moveexamine.ogg" type="audio/ogg"><source src="sfx/moveexamine.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-selectexamine"><source src="sfx/selectexamine.ogg" type="audio/ogg"><source src="sfx/selectexamine.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-confirm"><source src="sfx/confirm.ogg" type="audio/ogg"><source src="sfx/confirm.mp3" type="audio/mp3"></audio>
		<audio preload="auto" id="sfx-chapter"><source src="sfx/chapter.ogg" type="audio/ogg"><source src="sfx/chapter.mp3" type="audio/mp3"></audio>
	</div>
	<div id="loaded-sfx"></div>
	<div id="loaded-images"></div>
	<div id="loaded-portraits"></div>
	<div id="font-load-forcer">Hi!</div>

	<div id="chapter-header">
		<div id="chapter-title">CHAPTER TITLE</div>
		<div id="chapter-subtitle">CHAPTER SUBTITLE</div>
	</div>

	<table id="ui-table">
		<tr id="player-row">
			<td colspan=3 style="height: 0px">
				<div id="interactive-player-audio-container"></div>
				<div id="interactive-player">
					<div id="player-play-button" onclick="playerPlay()">&#10074;&#10074;</div>
					<div id="player-startover-button" onclick="playerStartOver()">&#x1F504;&#xFE0E;</div>
					<div id="player-progress" onclick="playerScrub(event)">
						<div id="player-progress-container">
							<div id="player-progress-bar"></div>
						</div>
					</div>
					<div id="player-cc-button" onclick="toggleClosedCaptions()">CC</div>
				</div>
			</td>
		</tr>
		<tr id="hud-row">
			<td style="position: relative; width: 150px;">
				<div id="mute-switch" onmousedown="preMute()" ontouchstart="preMute()" onclick="mute()" onmouseout="cancelMute()" ontouchcancel="cancelMute()">
					<img id="mute-switch-img" src="icons/soundon.png" draggable="false" />
					<img src="icons/soundoff.png" draggable="false" />
					<div id="mute-switch-label">M</div>
				</div>
			</td>
			<td>
				<div id="choice-menu-title">HERE'S THE CHOICE MENU?</div>
			</td>
			<td style="position: relative; width: 150px;">
				<div id="back-button" onmousedown="preBack()" ontouchstart="preBack()" onclick="back()" onmouseout="cancelBack()" ontouchcancel="cancelBack()">
					<img src="icons/backbutton.png" draggable="false" />
					<div id="back-button-label">BACKSPACE</div>
				</div>
			</td>
		</tr>
		<tr id="center-row">
			<td id="left-side">
				<div id="closed-captions"></div>
				<img class="displayed-image" id="image-left" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
				<div id="clickable" style="z-index: 12;">
					<div id="clickable-container" style="transform: scale(1);">
						<img id="clickable-img" />
						<div class="clickarea" id="clickarea-1" onclick="clickareaUp(1)"></div>
						<div class="clickarea" id="clickarea-2" onclick="clickareaUp(2)"></div>
						<div class="clickarea" id="clickarea-3" onclick="clickareaUp(3)"></div>
						<div class="clickarea" id="clickarea-4" onclick="clickareaUp(4)"></div>
						<div class="clickarea" id="clickarea-5" onclick="clickareaUp(5)"></div>
						<div class="clickarea" id="clickarea-6" onclick="clickareaUp(6)"></div>
						<div class="clickarea" id="clickarea-7" onclick="clickareaUp(7)"></div>
						<div class="clickarea" id="clickarea-8" onclick="clickareaUp(8)"></div>
						<div class="clickarea" id="clickarea-9" onclick="clickareaUp(9)"></div>
						<div class="clickarea" id="clickarea-10" onclick="clickareaUp(10)"></div>
					</div>
				</div>
				<div id="choice-subdescription"></div>
			</td>
			<td id="center-area" style="z-index: 10;">
				<ul id="choices">
					<li class="choice" style="z-index: 21" id="choice-1" onmousedown="preSelectChoice(1)" ontouchstart="preSelectChoice(1)" onmouseout="cancelChoice(1)" ontouchcancel="cancelChoice(1)">
						<div class="choice-text" id="choice-1-text">CHOICE</div>
						<div class="choice-mark" id="choice-1-mark"></div>
						<img class="choice-x" id="choice-1-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 20" id="choice-2" onmousedown="preSelectChoice(2)" ontouchstart="preSelectChoice(2)" onmouseout="cancelChoice(2)" ontouchcancel="cancelChoice(2)">
						<div class="choice-text" id="choice-2-text">CHOICE</div>
						<div class="choice-mark" id="choice-2-mark"></div>
						<img class="choice-x" id="choice-2-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 19" id="choice-3" onmousedown="preSelectChoice(3)" ontouchstart="preSelectChoice(3)" onmouseout="cancelChoice(3)" ontouchcancel="cancelChoice(3)">
						<div class="choice-text" id="choice-3-text">CHOICE</div>
						<div class="choice-mark" id="choice-3-mark"></div>
						<img class="choice-x" id="choice-3-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 18" id="choice-4" onmousedown="preSelectChoice(4)" ontouchstart="preSelectChoice(4)" onmouseout="cancelChoice(4)" ontouchcancel="cancelChoice(4)">
						<div class="choice-text" id="choice-4-text">CHOICE</div>
						<div class="choice-mark" id="choice-4-mark"></div>
						<img class="choice-x" id="choice-4-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 17" id="choice-5" onmousedown="preSelectChoice(5)" ontouchstart="preSelectChoice(5)" onmouseout="cancelChoice(5)" ontouchcancel="cancelChoice(5)">
						<div class="choice-text" id="choice-5-text">CHOICE</div>
						<div class="choice-mark" id="choice-5-mark"></div>
						<img class="choice-x" id="choice-5-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 16" id="choice-6" onmousedown="preSelectChoice(6)" ontouchstart="preSelectChoice(6)" onmouseout="cancelChoice(6)" ontouchcancel="cancelChoice(6)">
						<div class="choice-text" id="choice-6-text">CHOICE</div>
						<div class="choice-mark" id="choice-6-mark"></div>
						<img class="choice-x" id="choice-6-x" src="icons/x.png" />
					</li>
					<li class="choice" style="z-index: 15" id="choice-7" onmousedown="preSelectChoice(7)" ontouchstart="preSelectChoice(7)" onmouseout="cancelChoice(7)" ontouchcancel="cancelChoice(7)">
						<div class="choice-text" id="choice-7-text">CHOICE</div>
						<div class="choice-mark" id="choice-7-mark"></div>
						<img class="choice-x" id="choice-7-x" src="icons/x.png" />
					</li>
				</ul>

				<img class="displayed-image" id="image-center" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
				<div id="examine-container">
					<div id="examine" onmousedown="examineDown(event)" ontouchstart="examineDown(event)">
						<img id="examine-cursor" src="icons/examinecursor.png" />
						<img id="examine-img" />
						<div class="examinearea" id="examinearea-1" onclick="examineareaUp(event, 1)"></div>
						<div class="examinearea" id="examinearea-2" onclick="examineareaUp(event, 2)"></div>
						<div class="examinearea" id="examinearea-3" onclick="examineareaUp(event, 3)"></div>
						<div class="examinearea" id="examinearea-4" onclick="examineareaUp(event, 4)"></div>
						<div class="examinearea" id="examinearea-5" onclick="examineareaUp(event, 5)"></div>
						<div class="examinearea" id="examinearea-6" onclick="examineareaUp(event, 6)"></div>
						<div class="examinearea" id="examinearea-7" onclick="examineareaUp(event, 7)"></div>
						<div class="examinearea" id="examinearea-8" onclick="examineareaUp(event, 8)"></div>
						<div class="examinearea" id="examinearea-9" onclick="examineareaUp(event, 9)"></div>
						<div class="examinearea" id="examinearea-10" onclick="examineareaUp(event, 10)"></div>
					</div>
				</div>
			</td>
			<td id="right-side">
				<img id="confirm-button" src="icons/moveonarrow.png" onclick="confirmSelection()" />
				<img class="displayed-image" id="image-right" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
			</td>
		</tr>

	</table> <!-- ui-table -->

	<div id="dialogue-boxes" onmousedown="preAdvance()" onclick="tryToAdvance()" ontouchstart="preAdvance()" onmouseout="cancelAdvance()" ontouchcancel="cancelAdvance()">
		<div class="dialogue-box" id="dialogue-box-1">
			<div class="dialogue-box-box" id="dialogue-box-1-box">
				<div class="dialogue-box-name" id="dialogue-box-1-name"></div>
				<p class="dialogue-box-text" id="dialogue-box-1-text"></p>
				<img class="advance-star" id="advance-star-1" src="icons/advancestar.png" style="display: none;">
			</div>
			<div class="dialogue-box-portrait" id="dialogue-box-1-portrait">
				<img class="dialogue-box-portrait-img" draggable="false" id="dialogue-box-1-portrait-img" />
			</div>
		</div>
		<div class="dialogue-box" id="dialogue-box-2">
			<div class="dialogue-box-box" id="dialogue-box-2-box">
				<div class="dialogue-box-name" id="dialogue-box-2-name"></div>
				<p class="dialogue-box-text" id="dialogue-box-2-text"></p>
				<img class="advance-star" id="advance-star-2" src="icons/advancestar.png" style="display: none;">
			</div>
			<div class="dialogue-box-portrait" id="dialogue-box-2-portrait">
				<img class="dialogue-box-portrait-img" draggable="false" id="dialogue-box-2-portrait-img" />
			</div>
		</div>
		<div class="dialogue-box" id="dialogue-box-3">
			<div class="dialogue-box-box" id="dialogue-box-3-box">
				<div class="dialogue-box-name" id="dialogue-box-3-name"></div>
				<p class="dialogue-box-text" id="dialogue-box-3-text"></p>
				<img class="advance-star" id="advance-star-3" src="icons/advancestar.png" style="display: none;">
			</div>
			<div class="dialogue-box-portrait" id="dialogue-box-3-portrait">
				<img class="dialogue-box-portrait-img" draggable="false" id="dialogue-box-3-portrait-img" />
			</div>
		</div>
	</div>

	<div id="dramatic-lines"></div>

	<div id="opening-ui">
		<?php
			if (count($chapter_info) > 0)
				echo "<div id='chapter-select-label' onclick='toggleChapterSelect()'>CHAPTER SELECT</div>";
		?>
		<div id="version-label"></div>
	</div>
	</div>
	<div id="chapter-select-curtain" style="display: none;">
		<div id="chapter-select-container">
			<table id="chapter-select">
				<tr><td colspan=2 id="chapter-select-x"><span onclick="toggleChapterSelect()">X</span> SELECT A CHAPTER</td></tr>
				<?php
					for ($x = 0; $x < count($chapter_info); $x++) {
						echo "<tr class='selectable-chapter' onclick='loadChapterFromSelector(".$chapter_info[$x]['id'].")'>";
							echo "<td class='chapter-image'>";
								if (file_exists("chapterimages/".$chapter_info[$x]['id'].".png")) {
									echo "<img src='chapterimages/".$chapter_info[$x]['id'].".png' />";
								}
							echo "</td>";
							echo "<td class='chapter-info-field'>";
								echo "<div class='chapter-title'>".$chapter_info[$x]['name']."</div>";
								if ($chapter_info[$x]['description'] !== "none")
									echo "<div class='chapter-description'>".$chapter_info[$x]['description']."</div>";
							echo "</td>";
						echo "</tr>";
					}
				?>
			</table>
		</div>
	</div>
</body>
</html>