# Summer Day
A browser-based visual novel system created by Gravity Break Media. When you take these files and upload them to a webserver, your scripts (txt files found in the scripts folder) will send instructions to create an interactive experience featuring talking characters.

No knowledge of HTML, Javascript, or CSS is necessary to use this, but at the top of game.js, make sure to change the values of TITLE, AUTHOR, and VERSION to your liking. You should also experiment with CSS values to make your game look more unique; just search for "change me" in style.css for objects I recommend changing the styles of.

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

## DRAMATICLINE
`COMMAND|DRAMATICLINE|textToDisplay`

Example: `COMMAND|DRAMATICLINE|But the world refused to change.`

Large text that appears near the bottom of the screen. This text is visible on top of the Curtain summoned by `FADETOBLACK` or `CUTTOBLACK`. This text stays on screen for four seconds, then advances the script two seconds after that.

### textToDisplay

Whatever you want the text to display. The text gets pretty big, so don't make it too long or it might overflow off the screen.

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
```
COMMAND|CC|3|Hello!
COMMAND|CC|5|The closed captioning has begun.
COMMAND|CC|9|I'll keep the captions close to my pace of speech.
```

Sets a closed caption to play during a sound activated by the `PLAYER` command. I recommend having at least two seconds between each caption for readability. The caption will persist until another one is queued up or a timestamp declared by `CLEARCC` is reached. Auto-advances until the last CC or CLEARCC command in a chain, at which point the script will next advance when the audio player reaches the end of its duration.

### timestamp

The number of seconds at which to show the caption. Must be a whole number.

### caption

The caption to display. Don't make this too long; the text is pretty big on-screen.

## CLEARCC
`COMMAND|CLEARCC|timestamp`

Example:
```
COMMAND|CC|9|I'll keep the captions close to my pace of speech.
COMMAND|CLEARCC|11
COMMAND|CC|13|Luckily, I can give myself time to breathe.
```

Sets a point at which the subtitles created by `CC` should disappear until the next one is called. Can make for better presentation. Auto-advances until the last CC or CLEARCC command in a chain, at which point the script will next advance when the audio player reaches the end of its duration.

### timestamp

The number of seconds at which to clear the current caption. Must be a whole number.

## REMOVEPLAYER
`COMMAND|REMOVEPLAYER`

Removes the audio player at the top of the screen that was previously called by `PLAYER`. Advances after half a second.

## BGM
`COMMAND|BGM|soundFile`

Example: `COMMAND|BGM|freebird`

Plays background music from a .ogg or .mp3 in the "music" folder. This music will loop endlessly until `FADEBGM` or `PAUSEBGM` are played. Auto-advances.

### soundFile

The filename, without extensions, of the file in the "music" folder. You don't have to put in "music/", it's implied.

## BGMONCE
`COMMAND|BGMONCE|soundFile`

Example: `COMMAND|BGMONCE|propanenightmares`

Plays background music from a .ogg or .mp3 in the "music" folder. This music play until it finishes, and then it won't loop. Auto-advances.

### soundFile

The filename, without extensions, of the file in the "music" folder. You don't have to put in "music/", it's implied.

## FADEBGM
`COMMAND|FADEBGM`

Fades out the currently playing music called from either `BGM` or `BGMONCE`. Once its volume reaches 0, it'll stop playing. Auto-advances.

## PAUSEBGM
`COMMAND|PAUSEBGM`

Instantly stops the currently playing music called from either `BGM` or `BGMONCE`, but keeps its place. If `RESUMEBGM` is called after this, it'll pick up where it left off. Auto-advances.

## RESUMEBGM
`COMMAND|RESUMEBGM`

Resumes a music track that was originally called with either `BGM` or `BGMONCE` and then paused using either `FADEBGM` or `PAUSEBGM`.

## SFX
`COMMAND|SFX|soundFile`

Example: `COMMAND|SFX|headexploding`

Plays a .ogg or .mp3 sound file located in the "sfx" folder. Advances once the sound file is finished playing.

### soundFile

The filename, without extensions, of the file in the "sfx" folder. You don't have to put in "sfx/", it's implied.

## QUICKSFX
`COMMAND|QUICKSFX|soundFile`

Example: `COMMAND|QUICKSFX|tincanbeingshook`

Plays a .ogg or .mp3 sound file located in the "sfx" folder. Identical to SFX, except it auto-advances instead of waiting for the sound to be finished.

### soundFile

The filename, without extensions, of the file in the "sfx" folder. You don't have to put in "sfx/", it's implied.

## BACKGROUND
`COMMAND|BACKGROUND|imageUrl`

Example: `COMMAND|BACKGROUND|backgrounds/momshouse.jpg`

Sets the background image and slowly fades it in. This will cover as much of the screen as it can. Any previous background will be faded out as this one fades in. Advances 1.7 seconds after the image properly loads in.

### imageUrl

The full relative URL of the image file to use as the background.

## INSTANTBACKGROUND
`COMMAND|INSTANTBACKGROUND|imageUrl`

Example: `COMMAND|BACKGROUND|images/adumpster.png`

Sets the background image. Identical to `BACKGROUND`, except it happens immediately instead of fading in and auto-advances.

### imageUrl

The full relative URL of the image file to use as the background.

## REMOVEBACKGROUND
`COMMAND|REMOVEBACKGROUND`

Slowly fades out the current background image. Advances after 1.2 seconds.

## IMAGELEFT
`COMMAND|IMAGELEFT|imageUrl`

Example: `COMMAND|IMAGELEFT|images/mylefthand.gif`

There are three spots to show images on the game screen. This command makes an image pop up on the left side and plays the sound found at "sfx/image.ogg" or "sfx/image.mp3". Advances half a second after the image loads in properly.

### imageUrl

The full relative URL of the image file to display.

## IMAGECENTER
`COMMAND|IMAGECENTER|imageUrl`

An alias for `IMAGE`.

## IMAGE
`COMMAND|IMAGE|imageUrl`

Example: `COMMAND|IMAGE|images/mycenterhand.jpg`

There are three spots to show images on the game screen. This command makes an image pop up in the center and plays the sound found at "sfx/image.ogg" or "sfx/image.mp3". Will usually display bigger than the left and right image slots. Advances half a second after the image loads in properly.

### imageUrl

The full relative URL of the image file to display.

## IMAGERIGHT
`COMMAND|IMAGERIGHT|imageUrl`

Example: `COMMAND|IMAGELEFT|images/myrighthand.png`

There are three spots to show images on the game screen. This command makes an image pop up on the right side and plays the sound found at "sfx/image.ogg" or "sfx/image.mp3". Advances half a second after the image loads in properly.

### imageUrl

The full relative URL of the image file to display.

## IMAGETWO
`COMMAND|IMAGETWO|imageUrl1|imageUrl2`

Example: `COMMAND|IMAGETWO|images/myleftfoot.png|images/myrightfoot.png`

A faster version of `IMAGELEFT` followed by `IMAGERIGHT`. Advances half a second after the second image displays.

### imageUrl1, imageUrl2

The full relative URLs of the image files to display.

## IMAGETHREE
`COMMAND|IMAGETHREE|imageUrl1|imageUrl2|imageUrl3`

Example: `COMMAND|IMAGETWO|friends/jeff.png|friends/ben.png|friends/fred.png`

A faster version of `IMAGELEFT` followed by `IMAGE` and then `IMAGERIGHT`. Advances half a second after the final image displays.

### imageUrl1, imageUrl2, imageUrl3

The full relative URLs of the image files to display.

## REMOVEIMAGELEFT
`COMMAND|REMOVEIMAGELEFT`

Removes the image on the left side that was displayed through `IMAGELEFT`, `IMAGETWO`, or `IMAGETHREE`. Advances after half a second.

## REMOVEIMAGECENTER
`COMMAND|REMOVEIMAGECENTER`

An alias for `REMOVEIMAGE`.

## REMOVEIMAGE
`COMMAND|REMOVEIMAGE`

Removes the image in the center that was displayed through `IMAGE`/`IMAGECENTER` or `IMAGETHREE`. Advances after half a second.

## REMOVEIMAGERIGHT
`COMMAND|REMOVEIMAGERIGHT`

Removes the image on the right side that was displayed through `IMAGERIGHT`, `IMAGETWO`, or `IMAGETHREE`. Advances after half a second.

## TITLE
`COMMAND|TITLE|titleToDisplay`

Example: `COMMAND|TITLE|This part is a spoiler`

Displays a message on the top of the screen. This is the same spot text will be displayed during commands like `EXAMINE`, `CHOICE`, etc., so those commands will overwrite whatever you wrote. Auto-advances.

### titleToDisplay

Whatever you want the title at the top of the screen to say.

## REMOVETITLE
`COMMAND|REMOVETITLE`

Fades away the text that was made visible by `TITLE`. Auto-advances.

## MARKER
`COMMAND|MARKER|markerId`

EXAMPLE: `COMMAND|MARKER|1`

Markers are extremely important for navigating your script. They're points that other commands can navigate to by referencing the `markerId`. A user can't rewind the script past the point where a marker began. Auto-advances.

### markerId

The name of the marker to be referenced by other commands. I recommend using simple numbers(1, 2, 3, etc.), but you might find it more useful to use descriptive names. Case-sensitive.

## CLICKABLE
`COMMAND|CLICKABLE|imageUrl`

A Clickable is an image with areas that the user can click on to reach Markers associated with the `CLICKAREA` (invisible portions of the image that lead to new script positions) they clicked. It automatically resizes to cover as much space as the screen will allow without covering the top area with the mute and reverse buttons. This command MUST be followed with at least one `CLICKAREA`. Auto-advances until the last `CLICKAREA` in the chain. The only way to move the script at this point is to click on a Clickarea.

### imageUrl1

The full relative URL of the image file to use as the Clickable.

## CLICKAREA
`COMMAND|CLICKAREA|x|y|width|height|markerId`

or

`COMMAND|CLICKAREA|full|markerId`

Example:
```
COMMAND|CLICKABLE|backgrounds/beachpicture.png
COMMAND|CLICKAREA|full|1
COMMAND|CLICKAREA|40|49|235|562|2
COMMAND|CLICKAREA|63|389|42|90|3
```

A Clickarea is a portion of a Clickable that you can click on to instantly go to the specified Marker.

Clickareas draw on top of each other in the order provided, meaning later ones will take priority if they overlap. You can have multiple Clickareas going to the same marker. Auto-advances until the last Clickarea in the chain, at which point the script will stop until the player clicks on a Clickarea.

An easy way to figure out the x/y/width/height values of a Clickarea you want to create is to take the picture you're using as a Clickable into MS Paint and use the rectangular selection tool, then pay attention to the numbers at the bottom of the window.

### full

Using `full` in the second syntax above will set the Clickarea to cover the entire Clickable. That means clicking anywhere will lead to the `markerId` provided. Remember that if you place additional Clickareas after this, they'll exist on top of this one, meaning they will take priority. This is good if you want an "incorrect" marker to go to.

### x

The number of pixels past the leftmost part of the Clickable where this Clickarea begins. Setting this to 100 means it's 100 pixels from the left side.

### y

The number of pixels past the topmost part of the Clickable where this Clickarea begins. Setting this to 100 means it's 100 pixels down from the top.

### width

The width of the Clickarea in pixels. Clickareas start from the top-left.

### height

The height of the Clickarea in pixels. Clickareas start from the top-left.

### markerId

The name of the Marker that the script will jump to when this Clickarea is clicked.

## REMOVECLICKABLE
`COMMAND|REMOVECLICKABLE`

Fades away the image called by `CLICKABLE` and deactivates its Clickareas. Advances after half a second.

## EXAMINE
`COMMAND|EXAMINE|imageUrl`

An Examine is an image placed in a special examination window that allows the player to drag the image around (assuming it's larger than the window). If this is followed by at least one `EXAMINEAREA` command, then the player can click on the area specified followed by the "check" button in order to go to its associated Marker. Advances until the last EXAMINEAREA in the chain, or doesn't advance if there aren't any. The player has to click the "move on" button if no Examineareas exist (which makes the script advance by one step), or select an Examinearea and click the "check" button if there are(which goes to the marker specified by the Examinearea).

### imageUrl1

The full relative URL of the image file to place in the examination window.

## EXAMINEAREA
`COMMAND|EXAMINEAREA|x|y|width|height|markerId`

or

`COMMAND|EXAMINEAREA|full|markerId`

Example:
```
COMMAND|EXAMINE|images/crimescene.png
COMMAND|EXAMINEAREA|full|nothinghere
COMMAND|EXAMINEAREA|40|49|235|562|clue1
COMMAND|EXAMINEAREA|63|389|42|90|clue2
```

An Examinearea is a portion of the image used in `EXAMINE` that you can select in the examination window. Clicking the "check" button afterwards will go to the specified Marker.

Examinearea draw on top of each other in the order provided, meaning later ones will take priority if they overlap. You can have multiple Examinearea going to the same marker. Auto-advances until the last Examinearea in the chain, at which point the script will stop until the player selects an Examinearea and clicks the "check" button.

An easy way to figure out the x/y/width/height values of an Examinearea you want to create is to take the picture you're using for `EXAMINE` into MS Paint and use the rectangular selection tool, then pay attention to the numbers at the bottom of the window.

### full

Using `full` in the second syntax above will set the Examinearea to cover the entire Examine image. That means selecting any spot and then clicking the "check" button will lead to the `markerId` provided. Remember that if you place additional Examineareas after this, they'll exist on top of this one, meaning they will take priority. This is good if you want an "incorrect" marker to go to.

### x

The number of pixels past the leftmost part of the Examine image where this Examinearea begins. Setting this to 100 means it's 100 pixels from the left side.

### y

The number of pixels past the topmost part of the Examine image where this Examinearea begins. Setting this to 100 means it's 100 pixels down from the top.

### width

The width of the Examinearea in pixels. Examineareas start from the top-left.

### height

The height of the Examinearea in pixels. Examineareas start from the top-left.

### markerId

The name of the Marker that the script will jump to when this Examinearea is selected and then the player clicks the "check" button.

## REMOVEEXAMINE
`COMMAND|REMOVEEXAMINE`

Fades away the examination window called by `EXAMINE` and deactivates its Examineareas. Advances after half a second.

## DEBUGCLICKABLES
`COMMAND|DEBUGCLICKABLES`

This sets the DEBUG_CLICKABLES constant to true, which allows you to easily see where your Clickareas and Examineareas are when they appear. Just remove this line from the script when you're done with it. Auto-advances.

## CHOICE
`COMMAND|CHOICE|title|subdescription|numberOfCorrectOptions`

Example:
```
COMMAND|CHOICE|What’s the pattern in the 3 attacks?|1 plausible option|1
COMMAND|OPTION|PLAUSIBLE|The locations of the attacks|13
COMMAND|OPTION|X|The victims of the attacks|14
COMMAND|OPTION|X|The areas surrounding the attacks|15
COMMAND|OPTION|X|The names of the places attacked|16
COMMAND|OPTION|X|The times of the attacks|17
COMMAND|OPTION|none|( CHECK MAP AGAIN )|11
COMMAND|GOTO|18
```

A Choice is a menu of Options that the player can select, with each one leading to a different Marker.

This must always be followed by at least one `OPTION`, with a max of 7.

If an `OPTION` that the player selected has a value other than `none`, that value will be remembered if the player goes back to this `CHOICE` by using a `GOTO`. `CHOICE` has a system of "correct" answers that must be revealed before you can click the "move on" button and advance the script past the last `OPTION`. However, you don't have to use Choices this way. You can just have the different options go to different spots in the script without an expectation that you'll return to the `CHOICE`. Auto-advances to the last `OPTION` in the chain.

### title

The title that appears at the top of the screen when the Options appear.

### subdescription

A small blurb that appears below the Options. This can say whatever you want, but one possible use is to specify how many correct Options there are. If this is set to `none`, it won't appear.

### numberOfCorrectOptions

The number of Options with a value of `CORRECT`, `PLAUSIBLE`, or `?` that must be selected by the player for the "move on" arrow to appear, which will allow them to advance the script by one place (usually into a `GOTO` line). Set this to 0 if you want the "move on" button to be available immediately, or to a number higher than the number of Options if you don't want it to appear at all.

## QUIZ
`COMMAND|QUIZ|title`

A Quiz is simply a Choice with different styling, no `subdescription`, and no `numberOfCorrectAnswers` (and therefore will never generate the "move on" button). Otherwise, it's the same thing and still has to be followed up with up to 7 `OPTION`s.

### title

The title that appears at the top of the screen when the Options appear.

## OPTION
`COMMAND|OPTION|value|label|markerId`
Example: `COMMAND|OPTION|X|The victims of the attacks|14`

Up to 7 Options can be placed under a `CHOICE` or `QUIZ`, each leading to a different marker.

If an Option has a `value`, that will be remembered and displayed when the player returns to the same `CHOICE` or `QUiZ` (but forgotten when the player clicks the "move on" arrow).

### value

A value that's remembered if this Option is selected and the player returns to the same `CHOICE` or `QUIZ`.

`X`: A special graphic that appears on the Option, found at "icons/x.png".
`PLAUSIBLE`: Counts toward the `numberOfCorrectOptions` in a `CHOICE` in order to make the "move on" button appear.
`CORRECT`: Counts toward the `numberOfCorrectOptions` in a `CHOICE` in order to make the "move on" button appear.
Anything else: Is printed underneath the Option.

### label

What the Option says. Remember not to make this too long.

### markerId

The name of the Marker within this chapter to jump to when the Option is clicked on.

## FADEPREVLINE
`COMMAND|FADEPREVLINE`

During dialogue, two lines are always visible at once: The current one, and the previous one, which hovers above it and appears semitransparent. This command makes the previous line fade away completely. Auto-advances.

## FADEALLLINES
`COMMAND|FADEALLLINES`

Makes all current dialogue boxes visible on screen fade away. Auto-advances.

## SHAKEBOX
`COMMAND|SHAKEBOX`

Shake the next dialogue box. Auto-advances. The player will be able to advance through the dialogue once the box stops shaking.

## ARRIVELEFT
`COMMAND|ARRIVELEFT`

Makes the next dialogue box swipe in from the left side. Auto-advances.

## ARRIVERIGHT
`COMMAND|ARRIVERIGHT`

Makes the next dialogue box swipe in from the right side. Auto-advances.

## LEAVELEFT
`COMMAND|LEAVELEFT`

Makes the dialogue box on the previous line exit toward the left side, then advances.

## LEAVERIGHT
`COMMAND|LEAVERIGHT`

Makes the dialogue box on the previous line exit toward the right side, then advances.

## GOTO
`COMMAND|GOTO|markerId`

Jump to the marker specified in the current chapter.

### markerId

The name of the marker to jump to.

## WAIT
`COMMAND|WAIT|timeToWait`

Example: `COMMAND|WAIT|5000`

Pauses the script for the number of milliseconds specified, then advances.

### timeToWait

The time to wait for the script advances in milliseconds. 1000 is one second.

## END
`COMMAND|END`

Stops the script. Put this at the end. Does not advance.
