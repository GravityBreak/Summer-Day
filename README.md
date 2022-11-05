# Summer Day
A browser-based visual novel system created by Gravity Break Media. When you take these files and upload them to a webserver, your scripts (txt files found in the scripts folder) will send instructions to create an interactive experience featuring talking characters.

No knowledge of HTML, Javascript, or CSS is necessary to use this, but at the top of game.js, make sure to change the values of TITLE, AUTHOR, and VERSION to your liking. You should also experiment with CSS values to make your game look more unique; just search for "change me" for objects I recommend changing the styles of.

To load in new assets, simply add them to the folders provided. You can also replace the existing assets with ones of your own. For images, you can create whatever folders you want to make organization easier. Sound files must be either .ogg or .mp3, preferably both.

The scripts are read in numerical order, starting with the first line of 0.txt. The script position will advance line-by-line under various conditions depending on what came before, and will either move to the next numbered txt file once it reaches a line saying `COMMAND|NEXTCHAPTER` or end completely when it reaches one saying `COMMAND|END`.

There are two types of lines to be read: Dialogue and commands. Both of them use parameters that are separated with the vertical pipe ( `|` ) character.

# DIALOGUE

A dialogue line looks like this:

`characterName|expression|direction|dialogue`

or

`characterName*alias|expression|direction|dialogue`

Example: `TILDE|happy|l|I'm talking now!`

When the game prints dialogue, the game's progress will sit still until the player either presses the space bar or clicks/taps on the active dialogue box. This advances the script to the next line.

### characterName
The name of your character. However you capitalize this will be how it's capitalized in the text box. To get the character's portrait to show, create a folder with the character's name (in all-lowercase) in the "portraits" folder.

If `NOONE` is set as the character name, it'll show a differently-styled box with no portrait. This is good for things like narration.

### alias
Optional. The name you want the displayed on the character's text box instead of their actual name. This is good, for example, if you have a character whose name is used to grab their portrait, but want it to show as "???" or "Mysterious Person" until their name is revealed in the story.

### expression

The name of the specific portrait that will be used for the character on this line. This will search for `portraits/characterName/expression.png`.

### direction

One of the following: `l`, `r`, `flipl`, or `flipr`.

This decides which part of the text box to place the character portrait on - "l" meaning left and "r" meaning right. `l` is considered the default direction, so portraits placed on `r` will be flipped horizontally by default.

`flipl` and `flipr` still place the portrait on the left and right respectively, but they flip the image so that they're facing the way opposite the one they would.

### dialogue

Whatever you want the character's dialogue box to say. You can also fill this space with HTML tags to further customize the text, if you're creative. It's all up to you.

When the program has just printed a dialogue line, the script position will advance to the next line when the player presses the space bar or clicks/taps the current dialogue box.

# COMMANDS

Commands always start with `COMMAND` in all-caps, followed by `|COMMANDNAME`, and then usually some parameters if they're required. Here's a list of all of em.

## CHAPTERINFO
`COMMAND|CHAPTERINFO|chapterName|chapterDescription`

Example: `COMMAND|CHAPTERINFO|The Hole|The protagonist slips and falls into a hole.`

This creates an entry in the chapter select menu, available at the beginning of the game on the bottom-left. This only works once per chapter. If a chapter doesn't use this command, it won't show up in the list. Auto-advances.

An accompanying image will show next to the chapter name in the chapter select menu if it's added to the chapterimages folder with the filename "[chapter number].png". So, for example, if 4.txt has a CHAPTERINFO entry, the image at chapterimages/4.png will show next to it in the chapter select.

### chapterName

The name of the chapter as shown in the chapter select menu.

### chapterDescription

A smaller description of the chapter shown underneath the name in the chapter select menu. If this is set to `none`, this will be blank.

## REMOVEUI
`COMMAND|REMOVEUI`

Fades out the text at the bottom of the screen showing the chapter select link and version number. This also disappears on a chapter change. Auto-advances.

## CUTTOBLACK
`COMMAND|CUTTOBLACK`

This sets the entire scene to black by raising the Curtain's opacity to 1.0. The Curtain is a black rectangle that covers the entire screen. Auto-advances.

## FADETOBLACK
`COMMAND|FADETOBLACK`

Slowly raises the Curtain's opacity to 1.0, setting the entire scene to black. Advances after 4 seconds.

## FADEIN

Slowly reduces the Curtain's opacity to 0.0, making it possible to see the scene beneath it again. Advances after 4 seconds.

## SPLASH
`COMMAND|SPLASH|imageUrl`

Example: `COMMAND|SPLASH|images/logo.png`

An image that covers as much of the screen as it can, appearing instantly. This image is visible on top of the Curtain (the black rectangle covering the entire screen that can be called by either CUTTOBLACK or FADETOBLACK). Auto-advances, so use WAIT commands to time your script changes if necessary.

### imageUrl

The relative URL of the image to display.

## REMOVESPLASH
`COMMAND|REMOVESPLASH`

Instantly disappears the image called by SPLASH. Auto-advances.

## PANIMAGE
`COMMAND|PANIMAGE|imageUrl`

Example: `COMMAND|PANIMAGE|photos/vacationslides.png`

An image that covers as much of the screen as it can, and comes down from above the top of the screen, making its way to the bottom. This image is visible on top of the Curtain (the black rectangle covering the entire screen that can be called by either CUTTOBLACK or FADETOBLACK). Auto-advances, so use WAIT commands to time your script changes if necessary.

### imageUrl

The relative URL of the image to bring down from the top.

## REMOVEPANIMAGE
`COMMAND|REMOVEPANIMAGE`

Instantly disappears the image called by PANIMAGE. Auto-advances.

## NEXTCHAPTER
`COMMAND|NEXTCHAPTER`

Stops reading from the current text file and moves on to the next numbered one, starting from the first line. If that txt file doesn't exist, just create it!

## HEADER
`COMMAND|HEADER|chapterTitle|chapterSubtitle`

Example: `COMMAND|HEADER|The Story of Two Men|Whomst both ate Lunchables`

A flair that (optionally) announces the beginning of a new chapter. Displays chapterTitle and chapterSubtitle in huge text on top of a graphic(graphics/starboom.png), and also plays the "chapter" sound file found in the "sfx" folder. Advances after 6 seconds.

### chapterTitle

The large text to display.

### chapterSubtitle

Smaller text to display underneath the larger one. If this is set to `none`, it won't appear, and the larger text will fill all the space.

## PLAYER
`COMMAND|PLAYER|soundName`

Example: `COMMAND|PLAYER|audiobookentry`

Opens a sound player at the top of the screen. The player can restart the sound and click on the progress bar to navigate to different points in the audio. This player has an option for closed-captioning, which is controlled using the commands below. Advances as soon as the sound file is done playing (or when the player clicks past the end of it on the progress bar). After this advances, the player continues staying at the top of the screen to be listened to until `REMOVEPLAYER` is called. If this is followed by CC and/or CLEARCC commands, it will auto-advance up to the last one of those commands.

### soundName

The name of the sound file without extensions, which must be placed in the sfx folder. You don't have to put "sfx/" here, it's implied.

## CC
`COMMAND|CC|timestamp|caption`

Example:
`COMMAND|CC|3|Hello!`
`COMMAND|CC|5|The closed captioning has begun.`
`COMMAND|CC|9|I'll keep the captions close to my pace of speech.`

Sets a closed caption to play during a sound activated by the `PLAYER` command. I recommend having at least two seconds between aech caption for readability. The caption will persist until another one is queued up or a timestamp declared by `CLEARCC` is reached. Auto-advances until the last CC or CLEARCC command in a chain, at which point the script will next advance when the audio player reaches the end of its duration.

### timestamp

The number of seconds at which to show the caption. Must be a whole number.

### caption

The caption to display. Don't make this too long; the text is pretty big on-screen.

## CLEARCC
`COMMAND|CLEARCC|timestamp`

Example:
`COMMAND|CC|9|I'll keep the captions close to my pace of speech.`
`COMMAND|CLEARCC|11`
`COMMAND|CC|13|Luckily, I can give myself time to breathe.`

Sets a point at which the subtitles created by `CC` should disappear until the next one is called. Can make for better presentation. Auto-advances until the last CC or CLEARCC command in a chain, at which point the script will next advance when the audio player reaches the end of its duration.

### timestamp

The number of seconds at which to clear the current caption. Must be a whole number.

## REMOVEPLAYER
`COMMAND|REMOVEPLAYER`

Removes the audio player at the top of the screen that was previously called by `PLAYER`. Advances after half a second.

# STILL GOTTA FINISH THIS
