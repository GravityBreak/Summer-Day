# Summer Day
A browser-based visual novel system created by Gravity Break Media. When you take these files and upload them to a webserver, your scripts (txt files found in the scripts folder) will send instructions to create an interactive experience featuring talking characters.

To load in new assets, simply add them to the folders provided. You can also replace the existing assets with ones of your own. For images, you can create whatever folders you want to make organization easier.

The scripts are read in numerical order, starting with the first line of 0.txt. The script position will advance line-by-line under various conditions depending on what came before, and will either move to the next numbered txt file once it reaches a line saying `COMMAND|NEXTCHAPTER` or end completely when it reaches one saying `COMMAND|END`.

There are two types of lines to be read: Dialogue and commands. Both of them use parameters that are separated with the vertical pipe ( `|` ) character.

# DIALOGUE

A dialogue line looks like this:

`characterName|expression|direction|dialogue`

or

`characterName*alias|expression|direction|dialogue`

Example: `TILDE|happy|l|I'm talking now!`

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

This creates an entry in the chapter select menu, available at the beginning of the game on the bottom-left. This only works once per chapter. If a chapter doesn't use this command, it won't show up in the list.

An accompanying image will show next to the chapter name in the chapter select menu if it's added to the chapterimages folder with the filename "[chapter number].png". So, for example, if 4.txt has a CHAPTERINFO entry, the image at chapterimages/4.png will show next to it in the chapter select.

### chapterName

The name of the chapter as shown in the chapter select menu.

### chapterDescription

A smaller description of the chapter shown underneath the name in the chapter select menu. If this is set to `none`, this will be blank.

# TO BE FINISHED

Javascript knowledge isn't required, but at the top of game.js, make sure to change TITLE, AUTHOR, and VERSION to your liking.
