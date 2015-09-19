#LaCroix
An IRC bot just as refreshing as the beverage it's named after.

##Install
1. Clone the repo
2. Edit the config.json:<br/>
<code>"server" : The IRC server for the bot to connect to</code><br/>
<code>"channel" : The channel for the bot to connect to</code><br/>
<code>"nick" : The nick the bot will have</code><br/>
<code>"master" : The hardcoded admin. This should be your nickserv account, not your nick!</code>
3. Run! <code>node index.js</code>

##Commands

####help
This will list all available commands, the response will be PM'd to you:<br/>
<code>!help</code>
To get help for a particular command, prefix that command with a <code>?</code><br/>
Ex: <code>?memo</code>

####memo
Leave a message for an offline user, the message will be delivered to them the next time they join the channel ("none" deletes the message):<br/>
<code>!memo \<nick\> \<message\>|none</code>

####notifyme
Allow yourself !poke(ed) by online users and notified by email if you are offline ("none" disables email notification):<br/>
<code>!notifyme \<"email address"\>|none</code>

####poke
Sends an email notification to an offline user. This will only work if the user has setup email notifications using !notifyme:<br/>
<code>!poke \<nick\> [message]</code>

####teach
Teaches the bot a new command. Refer to the Teaching Commands section below for more information:<br/>
<code>!teach \<verb\> \<"reply"\> [help] [syntax]</code>

####forget
Deletes a previously learned command:<br/>
<code>!forget \<verb\></code>

####role
Checks which user accounts have a particular permission level. Results list the nickserv account names of the user, NOT their nick:<br/>
<code>!role master|teacher</code>

####user
Adjusts a user's permission level. You must specify the user's nickserv account name, NOT their nick (none removes all permissions):<br/>
<code>!user \<account\> master|teacher|none</code>

##Permissions
There are two permission levels: masters and teachers. Masters have access to all commands, including the ability to adjust user permissions. Teachers can't adjust user permissions, but they can still teach the bot new commands.

All non-specified users have access to any learned command, and many of the basic communicative commands (!memo, !notifme, !poke, etc.)

##Teaching Commands
The syntax for teaching the bot a new command is:
<code>!teach \<verb\> \<"reply"\> [help] [syntax]</code>
- verb: The "trigger" word to call the command. For example, if my verb was <code>love</code>, then I would execute the command by typing <code>!love</code>
- reply: The reply that the bot will give to the issued command. Any reply with spaces must be wrapped in quotes. Replies can contain any number of variable placeholders or operators to extend their usefulness and functionality. See the Operators section below for more information.
- help / syntax: The help description and syntax example. These can be seen at any time by preceeding the verb with a "?" (Ex: <code>?love</code>). These fields are optional. Though it is recommended to leave help for more elaborate commands.

###Operators
There are three types of operators available to any reply:
####Variables
These are basic placeholders for additional arguments, designated by empty curly brackets: <code>{}</code><br/>
For Example:<br/>
Teaching: <code>!teach count "v'{}, {}, {}, ah-ah-ah"</code><br/>
Execution: <code>!count one two three</code><br/>
Result: <code>[LaCroix]: v'one, two, three, ah-ah-ah"</code><br/>

####Active Operators
These are basic functions requiring a single argument. They are designated with the name of the operator surrounded by curly brackets: <code>{operator}</code><br/>
For Example:<br/>
Teaching: <code>!teach findityourself "{}, learn to find things yourself: {lmddgtfy}"</code><br/>
Execution: <code>!findityourself noobie "how to use a search engine"</code><br/>
Result: <code>[LaCroix]: noobie, learn to find things yourself: http://lmddgtfy.net/?=how%20to%20use%20a%20search%20engine</code><br/>

####Passive Operators
These are basic functions requiring no arguments, but are simply replaced by a predefined value. They are designated with the name of the operator surrounded by square brackets: <code>[operator]</code><br/>
For Example:<br/>
Teaching: <code>!teach love "[bot] <3's [me]"</code><br/>
Execution: <code>!love</code><br/>
Result: <code>[LaCroix]: [LaCroix] <3's shizy</code><br/>

#Extensibility
... documentation to come
