var Commands = require('./lib/commands.js');
var config;
var irc      = require('irc');
var fs       = require('fs');

// TODO:
// cleanup config generation/loading
// nodemailer integration config/toggle
// !notifyme opt-in
// autocommands structure

// TEMP!
// create config if it doesn't exist
try {
    fs.statSync(__dirname + '/config.json');
    config = require('./config.json');
} catch(e) {
    if (e.code === 'ENOENT') {
        console.log("No config file found, one has been created for you. Fill it out and run again: ./config.json");
        var config = {
            server: "",
            channel: "",
            nick: "",
            master: "",
        };
        fs.writeFileSync(__dirname + '/config.json', JSON.stringify(config, 4, null));
        return;
    }
}

// create irc client
var client = new irc.Client(config.server, config.nick, {
    channels: [ config.channel ],
    floodProtection: true,
});

var commands = new Commands(__dirname + '/db.sqlite', config, client);

function error(err, target) {
    console.error(err);
    if (typeof target !== 'undefined') client.say(target, err);
}

// listen for all messages in irc
client.addListener('message', function (from, to, message) {

    commands.autoCommands("onmessage", message, from, function (err, response) {
        if (err) return error(err);
        console.log('(' + config.nick + '): ' + response);
        client.action(config.channel, ": " + response);
    });

    commands.parseCommand(from, to, message, function (err, cmd) {
        if (err) return error(err, cmd.sender);

        // valid command, log attempt
        console.log('(' + from + '): ' + message);

        commands.isPermitted(cmd, function (err, permit) {
            if (err) return error(err, cmd.sender);

            if (!permit)
                return error("You are not permitted to perform this command.", cmd.sender);

            // if help
            if (cmd.prefix === "?") client.say(cmd.sender, cmd.template.help + "\n\t" + cmd.template.syntax);

            // if command
            if (cmd.prefix === "!") {
                // parameter check?

                // **********************************************
                // Dude, clean this up! D:
                if (typeof cmd.template.call !== 'undefined') {
                    commands.calls[cmd.template.call].call(commands, cmd, function (err, args) {
                        if (err) return error(err, cmd.sender);

                        cmd.args = args;
                        commands.parseReply(cmd, function (err, response) {
                            if (err) return error(err, cmd.sender);
                            client.say(cmd.target, response);
                        });
                    });
                } else {
                    commands.parseReply(cmd, function (err, response) {
                        if (err) return error(err, cmd.sender);
                        client.say(cmd.target, response);
                    });
                }
            }
        });
    });
});

client.on('join', function (channel, user) {
    commands.autoCommands("onjoin", "", user, function (err, response) {
        if (err) return error(err);
        console.log('(' + config.nick + '): ' + response);
        client.action(config.channel, ": " + response);
    });
});

// irc client errors
client.on('error', function (err) {
    error(err, config.master);
});
