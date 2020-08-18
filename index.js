const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const colors = require("./colors.json");
const bot = new Discord.Client;
const token = process.env.token;
const ms = require("ms");
const fs = require("fs");
const moment = require("moment");

const { GiveawaysManager } = require("discord-giveaways");

const manager = new GiveawaysManager(bot, {
    updateCountdownEvery: 3000,
    default: {
        botsCanWin: false,
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

bot.giveawaysManager = manager;

bot.on("ready", async () => {
console.log("Bot is now online");
    bot.user.setStatus("online")
	
	let statuses = [
		'VizenMC.com',
		'ts.VizenMC.com',
		'discord.io/VizenMC'
	]
	
	setInterval(function() {
		let status = statuses[Math.floor(Math.random() * statuses.length)];
		bot.user.setActivity(status, {type: "PLAYING"});
}, 5000)})

bot.on('guildMemberAdd', member => {

member.guild.channels.find(channel => channel.name === "joins").send(`Welcome to the **VizenMC Network**, ${member}`);
	
});


bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}serverinfo`){
    let serverinfo = new Discord.RichEmbed()
    .setColor(colors.red)
    .setTitle("**Server Info**")
    .addField("**Discord Name**:", `${message.guild.name}`)
    .addField("**Discord Owner**:", `${message.guild.owner}`)
    .addField("**Member Count**:", `${message.guild.memberCount}`)
    .addField("**Role Count**:", `${message.guild.roles.size}`)
    message.channel.send({embed: serverinfo}).then(message.delete(0));
    }

    if(cmd === `${prefix}announce`){
                if(!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));
                let text = args.slice(0).join(" ")
    
                let announceembed = new Discord.RichEmbed()
                .setDescription(text)
                .setColor(colors.red)
		.setFooter(`${message.author.username}`, message.author.avatarURL)
                message.channel.send({embed: announceembed}).then(message.delete(0));
    }

    if(cmd === `${prefix}help`){
        let help = new Discord.RichEmbed()
        .setTitle('**Commands**')
        .addField("**/help**", 'Provides List Of Commands')
        .addField("**/suggest**", 'Provides a way to help give feedback.')
        .addField("**/report**", 'Provides a way to report someone without messaging staff.')
        .addField("**/bug**", 'Provides a way to report a bug to the owners.')
        .addField("**/serverip**", 'Provides the ip to the server.')
        .addField("**/serverinfo**", 'Provides a way to see the server information')
	.addField("**/userinfo**", 'Provides a way to see a users information')
	.addField("**/store**", 'Provides the store of the server.')
	.addField("**/forums**", 'Provides the website of the server.')
	.addField("**/teamspeak**", 'Provides the teamspeak ip.')
	.addField("**/new**", 'Provides a way to create a ticket.')
        .setColor(colors.red)
        message.channel.send({embed: help}).then(message.delete(0));
    }

    if(cmd === `${prefix}mod`){
            if(!message.member.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));

            let staffhelp = new Discord.RichEmbed()
            .setTitle('**Staff Permissions**')
            .addField("**/announce**", 'Allows you to announce something.')
            .addField("**/clear**", 'Allows you to delete a certain amount of messages.')
            .addField("**/ban**", 'Allows you to permanently remove someone from the discord.')
            .addField("**/mute**", 'Allows you to stop someone from sending messages on the server.')
            .addField("**/warn**", 'Allows you to warn a user.')
            .addField("**/tempmute**", 'Allows you to temporarily mute a user.')
	    .addField("**/unmute**", 'Allows you to unmute a user.')
	    .addField("**/unban**", 'Allows you to unban a user.')
            .addField("**/g!start**", 'Allows you to start a giveaway.')
            .addField("**/g!end**", 'Allows you to end a giveaway.')
            .addField("**/g!reroll**", 'Allows you to reroll a giveaway.')
	    .addField("**/close**", 'Allows you to close an open ticket.')
            .setColor(colors.red)
            message.channel.send({embed: staffhelp}).then(message.delete(0));
    }

    if(cmd === `${prefix}clear`){
            if(!message.member.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));
            message.channel.bulkDelete(args[0]);
    }

    if(cmd === `${prefix}kick`){
                if(!message.member.hasPermission(["KICK_MEMBERS"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));

                let kickMember = message.mentions.members.first() || message.guild.members.get(args[0])
                if(!kickMember) return message.channel.send("**Usage**: /kick <@user> <reason>.").then(message.delete(0))

                let reason = args.slice(1).join(" ")
                if(!reason) reason = "No reason given."

                kickMember.send(`Unfortunately, you have been kicked for: **${reason}**`).then(() =>
                kickMember.kick())

                let kicked = new Discord.RichEmbed()
                .setColor(colors.red)
                .setTitle("**Punishment | Kicked**")
                .addField("**Target**:", `${kickMember}`)
                .addField("**Issued By**:", `${message.author}`)
                .addField("**Issued Reason**:", `${reason}`)

                let sChannel = message.guild.channels.find(c => c.name === "logs")
                sChannel.send({embed: kicked}).then(message.delete(0))
    }

    if(cmd === `${prefix}ban`){
                if(!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));
        
                        let banMember = message.mentions.members.first() || message.guild.members.get(args[0])
                        if(!banMember) return message.channel.send("**Usage**: /ban <@user> <reason>.").then(message.delete(0))
        
                        let banreason = args.slice(1).join(" ")
                        if(!banreason) banreason = "No reason given."
        
                        banMember.send(`Unfortunately, you have been banned for: **${banreason}**`).then(() =>
                        banMember.ban())
        
                        let banned = new Discord.RichEmbed()
                        .setColor(colors.red)
                        .setTitle("**Punishment | Banned**")
                        .addField("**Target**:", `${banMember}`)
                        .addField("**Issued By**:", `${message.author}`)
                        .addField("**Issued Reason**:", `${banreason}`)
        
                        let bChannel = message.guild.channels.find(c => c.name === "logs")
                        bChannel.send({embed: banned}).then(message.delete(0))
    }

    if(cmd === `${prefix}warn`){
                if(!message.member.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));
                
                let warnMember = message.mentions.members.first() || message.guild.members.get(args[0])
                if(!warnMember) return message.channel.send("**Usage**: /warn <@user> <reason>.").then(message.delete(0))
                
                let wreason = args.slice(1).join(" ")
                if(!wreason) wreason = "No reason given."
                
                warnMember.send(`Unfortunately, you have been warned for: **${wreason}**`).then(() =>
                warnMember.warn())
                
                let warned = new Discord.RichEmbed()
                .setColor(colors.red)
                .setTitle("**Punishment | Warned**")
                .addField("**Target**:", `${warnMember}`)
                .addField("**Issued By**:", `${message.author}`)
                .addField("**Issued Reason**:", `${wreason}`)
                
                let wChannel = message.guild.channels.find(c => c.name === "logs")
                wChannel.send({embed: warned}).then(message.delete(0))
    }

    if(cmd === `${prefix}report`){
        let rMember = message.mentions.members.first() || message.guild.members.get(args[0])
                    
                    if (!args[1]) return message.channel.send("**Usage**: /report <@user> <reason>").then(message.delete(0));

                    let reportss = args.slice(1).join(" ")
                    if(!reportss) reportss = "No reason given."
                    
                    let channels = message.guild.channels.find(c => c.name === "reports")
            
                    let reporting = new Discord.RichEmbed()
                    .setColor(colors.red)
                    .setTitle("**Reports**")
                    .addField("**Target:**", `${rMember}`)
                    .addField("**Issued By:**", `${message.author}`)
                    .addField("**Issued Reason:**", `${reportss}`)
                    channels.send({embed: reporting}).then(message.delete(0))         
    }

    if(cmd === `${prefix}suggest`){
                        
                        if (!args[0]) return message.channel.send("**Usage**: /suggest <suggestion>.").then(message.delete(0));
                        let suggestion = args.slice(0).join(" ");

                        let suggestchannel = message.guild.channels.find(c => c.name === "suggestions")
                        
                        let suggest = new Discord.RichEmbed()
                        .setTitle('**Suggestion**')
                        .setColor(colors.red)
                        .addField("**Issued Suggestion:**", `${suggestion}`)
                        .addField('**Issued By:**', `${message.author}`)
                        suggestchannel.send({embed: suggest}).then(message.delete(0))
    }

    if(cmd === `${prefix}bug`){
                        
                        if (!args[0]) return message.channel.send("**Usage**: /bug <bug>.").then(message.delete(0));
                        let Bug = args.slice(0).join(" ")

                        let bugChannel = message.guild.channels.find(c => c.name === "bugs")
                        
                        let bugs = new Discord.RichEmbed()
                        .setTitle(`**Bug**`)
                        .setColor(colors.red)
                        .addField('**Issued Bug:**', `${Bug}`)
                        .addField('**Issued By:**', `${message.author}`)
                        bugChannel.send({embed: bugs}).then(message.delete(0))
    }

    if(cmd === `${prefix}serverip`){
        let ip = new Discord.RichEmbed()
        .setTitle("**Server IP**")
        .setDescription('VizenMC.com')
        .setColor(colors.red)
        message.channel.send({embed: ip}).then(message.delete(0))
    }
    
     if(cmd === `${prefix}g!start`){
 
        if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return message.channel.send('You need to have the manage messages permissions to start giveaways.');
    }


    let giveawayChannel = message.mentions.channels.first();

    if(!giveawayChannel){
        return message.channel.send('**Usage**: /g!start <#channel> <time> <winners> <prize>.');
    }


    let giveawayDuration = args[1];

    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send('**Usage**: /g!start <#channel> <time> <winners> <prize>.');
    }


    let giveawayNumberWinners = args[2];

    if(isNaN(giveawayNumberWinners)){
        return message.channel.send('**Usage**: /g!start <#channel> <time> <winners> <prize>.');
    }

    let giveawayPrize = args.slice(3).join(' ');

    if(!giveawayPrize){
        return message.channel.send('**Usage**: /g!start <#channel> <time> <winners> <prize>.');
    }


    bot.giveawaysManager.start(giveawayChannel, {

        time: ms(giveawayDuration),

        prize: giveawayPrize,

        winnerCount: giveawayNumberWinners,
        messages: {
            giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎉 to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, not enough users reacted.",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false
            }
        }
    });

    message.channel.send(`Giveaway started in ${giveawayChannel}!`);

};
        if(cmd === `${prefix}g!reroll`){
        let messageID = args[0];
        bot.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send("Giveaway rerolled.");
        }).catch((err) => {
            message.channel.send("No giveaway found, please check and try again");
        });
    }
       
    if(cmd === `${prefix}g!end`){
    let messageID = args[0];
        bot.giveawaysManager.delete(messageID).then(() => {
            message.channel.send("Giveaway ended.");
        }).catch((err) => {
            message.channel.send("No giveaway found, please check and try again").then(message.delete(0));
        });
 
};
    
    if(cmd === `${prefix}tempmute`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permissions to run this command.").then(message.delete(0));
  let muteUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!muteUser) return message.channel.send("**Usage:** /tempmute <@user> <time> <reason>").then(message.delete(0));
  if(muteUser.hasPermission("ADMINISTRATOR")) return message.channel.send("Cannot mute this user.").then(message.delete(0));
  let reason = args.slice(2).join(" ");
  if(!reason) return message.channel.send("**Usage:** /tempmute <@user> <time> <reason>").then(message.delete(0));

  let muterole = message.guild.roles.find(r => r.name === "Muted")
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "Muted",
        color: "#000000",
        permissions:[]
      });

      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
      
    }catch(e){
      console.log(e.stack);
    }
  }
  let length = args[1];
  if(!length) return message.channel.send("**Usage:** /tempmute <@user> <time> <reason>").then(message.delete(0));
  message.delete().catch();

  let muteLogEmbed = new Discord.RichEmbed()
  .setTitle("**Punishment | Mute**")
  .addField("**Target:**", `${muteUser}`)
  .addField("**Issued By:**", `${message.author}`)
  .addField("**Issued Reason:**", `${reason}`)
  .addField("**Issued Duration:**", `${length}`)
  .addField("**Issued In:**", `${message.channel}`)
  .setColor(colors.red)

  let channel = message.guild.channels.find(c => c.name === "logs");
  if(!channel) return message.reply("Log channel not found.");
  channel.send(muteLogEmbed).then(() => {
    message.delete()
    muteUser.send(`You've been **muted** in **${message.guild.name}** for reason: **${reason}**, and duration: **${length}**`).catch(err => console.log(err))
    message.channel.send(`${muteUser} has been **muted** for **${length}**.`)
})

  await(muteUser.addRole(muterole.id));

  setTimeout(function(){
    muteUser.removeRole(muterole.id);

    let unmuted = new Discord.RichEmbed()
    .setTitle(`**Punishment | Unmute**`)
    .addField("**Target:**", `${muteUser}`)
    .addField("**Removed By:**", `${bot.user}`)
    .addField("**Issued In:**", `Console`)
    .setColor(colors.red)

    channel.send(unmuted).then(() => {
      muteUser.send(`Your **mute** in **${message.guild.name}** has **expired**. You may now talk.`).catch(err => console.log(err))
  });

  }, ms(length));

};
    if(cmd === `${prefix}unban`){
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You have insufficient permissions to execute this command.");
	
	let search = args.join(" ");
	if(!search) return message.channel.send("**Usage**: /unban <@user>.");

	try {
		let bans = await message.guild.fetchBans();
		let banned = bans.get(search) || bans.find(u => u.tag.toLowerCase().includes(search.toLowerCase()));
		
		if(!banned) return message.channel.send("I could not find a banned user by this ID or name.");

		await message.guild.unban(banned);
        
     let logssschannel = message.guild.channels.find(c => c.name === "logs")
        const unbanned = new Discord.RichEmbed()
        .setTitle(`**Punishment | Unban**`)
        .addField("**Target:**", `${banned.tag}`)
        .addField("**Issued By:**", `${message.author}`)
        .setColor(colors.red)
        logssschannel.send(unbanned).then(message.delete(0));
	} catch(e) {
		message.channel.send(`Unban failed: ${reason}`)
	}
};
	
	if(cmd === `${prefix}unmute`){
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.");

	let target = message.mentions.members.first() || message.guild.members.get(args[0]);
	if(!target) return message.channel.send("**Usage**: /g!start <@user>.");

	let role = message.guild.roles.find(r => r.name === "Muted");
	if(!role || !target.roles.has(role.id)) return message.channel.send("This user is not muted.");

	try {
		await target.removeRole(role);
		
	let unmutechannel = message.guild.channels.find(c => c.name === "logs")
        const unmuted = new Discord.RichEmbed()
        .setTitle(`**Punishment | Unmute**`)
        .addField("**Target:**", `${target}`)
        .addField("**Issued By:**", `${message.author}`)
        .setColor(colors.red)
        unmutechannel.send(unmuted).then(message.delete(0)).then(target.send(`You have been **unmuted** in **${message.guild.name}**.`))
	} catch(e) {
		message.channel.send(`Error: ${e.message}`);
	}
};
	if(cmd === `${prefix}userinfo`) {
		
	let ment = message.mentions.users.first();
	const member = message.guild.member(ment);
		if(!ment) {
			message.channel.send('Please mention a user.').then(message.delete(0));
		}

		let userinfo = new Discord.RichEmbed()
		.setTitle("**Userinfo**")
		.setColor(colors.red)
		.addField("**Username:**", ment.tag)
		.addField("**Status:**", ment.presence.status)
		.addField("**Joined The Server On**:", `${moment.utc(member.joinedAt).format("dddd, MMMM Do YYYY")}`)
		.addField("**Account Created On**:", `${moment.utc(ment.createdAt).format("dddd, MMMM Do YYYY")}`) 
		message.channel.send({embed: userinfo}).then(message.delete(0));
	};
	
	if(cmd === `${prefix}tempban`) {
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have the correct permissions.").then(message.delete(0));


    let user = message.guild.member(message.mentions.users.first());

    if (!user) return message.channel.send("**Usage:** /tempban <@user> <duration> <reason>").then(message.delete(0));


    if (user.hasPermission("ADMINISTRATOR")) return message.channel.send("This user cannot be banned.").then(message.delete(0));


    let tempbanreason = args.join(" ").slice(23);
		
    let tempbanchannel = message.guild.channels.find(c => c.name === "logs");

    if (!tempbanreason) return message.channel.send("**Usage**: /tempban <@user> <duration> <reason>.").then(message.delete(0));

    
    let tempBanTime = args[1];
		
    let tempbanUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));


    if (ms(tempBanTime)) {

        await message.guild.member(user).ban(tempbanreason).then(tempbanUser.send(`You've been **tempbanned** in **${message.guild.name}**, for reason: **${tempbanreason}**, and duration: **${tempBanTime}**`))
	    
	    const tempban = new Discord.RichEmbed()
	    .setTitle("**Punishment | Tempban**")
	    .addField("**Target:**", `${user}`)
	    .addField("**Issued By:**", `${message.author}`)
	    .addField("**Issued Reason:**", `${tempbanreason}`)
	    .addField("**Issued Duration:**", `${tempBanTime}`)
	    .setColor(colors.red)
        tempbanchannel.send({embed: tempban}).then(message.delete(0));


        setTimeout(function () {
            

            message.guild.unban(user.id).then(message.delete(0)).then(tempbanUser.send(`You've been **unbanned** in **${message.guild.name}**`));
		
		const unbantemp = new Discord.RichEmbed()
		.setTitle("**Punishment | Unban**")
		.addField("**Target:**", `${user}`)
		.addField("**Removed By:**", `${bot.user}`)
		.setColor(colors.red)
            tempbanchannel.send({embed: unbantemp});

        }, ms(tempBanTime));

    } else {
        return message.channel.send("Please enter a valid time.").then(message.delete(0));
    }

};
		if(cmd === `${prefix}mute`) {

                            if(!message.member.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send('You do not have permissions').then(message.delete(0));


                            let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
                            
                            if(!tomute) return message.channel.send('**Usage**: /mute <@user> <reason>.');
                            
                            let muterole = message.guild.roles.find(`name`, "Muted");
                            let muteMember = message.mentions.members.first() || message.guild.members.get(args[0])
                            
                            let mutereason = args.slice(1).join(" ")
                            if(!mutereason) mutereason = "No reason given."
                          
                            const muted = new Discord.RichEmbed()
                            .setTitle("**Muted**")
                            .addField("**Target**:", `${muteMember}`)
                            .addField("**Issued By:**", `${message.author}`)
                            .addField("**Issued Reason:**", `${mutereason}`)
                            .setColor(colors.red)
                            let mChannel = message.guild.channels.find(c => c.name === "logs")
                            mChannel.send(muted).then(message.delete(0))
                          
                            tomute.addRole(muterole);
	};
		
		if(cmd === `${prefix}store`) {
			const store = new Discord.RichEmbed()
			.setTitle("**Store**")
			.setDescription("**Link:** http://store.hcdreams.com/")
			.setColor(colors.red)
			message.channel.send({embed: store}).then(message.delete(0));
		};
		
		if(cmd === `${prefix}forums`) {
			const store = new Discord.RichEmbed()
			.setTitle("**Website**")
			.setDescription("**Link:** https://vizenmc.com/")
			.setColor(colors.red)
			message.channel.send({embed: store}).then(message.delete(0));
		};
	
	 if(cmd === `${prefix}teamspeak`){
        let tsip = new Discord.RichEmbed()
        .setTitle("**Teamspeak IP**")
        .setDescription('ts.vizenmc.com')
        .setColor(colors.red)
        message.channel.send({embed: tsip}).then(message.delete(0))
    };

if(cmd === `${prefix}new`){
	
        message.delete(0);
	
        message.guild.createChannel(`ticket-${message.author.username}`, 'text').then(async channelsss => {
            let ticketreason = args.slice(0).join(" ")
		if(!ticketreason) ticketreason = "No reason given."
            if (message.guild.channels.find(channelsss => channelsss.name.toLowerCase() === 'tickets')) {
                if (message.guild.channels.find(channelsss => channelsss.name.toLowerCase() === 'tickets').type === 'category') {
                    channelsss.setParent(message.guild.channels.find(channelsss => channelsss.name.toLowerCase() === 'tickets').id)
                } else {
                    channelsss.setParent(message.guild.channels.find(channelsss => channelsss.name.toLowerCase() === 'tickets').id)
                }
                channelsss.overwritePermissions(message.guild.defaultRole, {
                    VIEW_CHANNEL: false
                })
                channelsss.overwritePermissions(message.member, {
                    VIEW_CHANNEL: true
                })
                channelsss.overwritePermissions(message.guild.roles.find(r => r.name.toLowerCase() === 'support team'), {
                    VIEW_CHANNEL: true
                })
                message.delete();
            }
		const ticketss = new Discord.RichEmbed()
		 .setTitle('**Ticket Created**')
		 .setDescription(`Thank you for creating a ticket. The support team will assist you soon!`)
		 .setColor(colors.red)
		 .addField('**Issued Reason**:', `${ticketreason}`)
		channelsss.send(ticketss)
        });
	
	let newticket = new Discord.RichEmbed()
                .setColor(colors.red)
                .setTitle("**Ticket | Created**")
                .addField("**Issued By**:", `${message.author}`)
                
                let closeChannel = message.guild.channels.find(c => c.name === "logs")
                closeChannel.send(newticket)
};
	if(cmd === `${prefix}close`){
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You do not have permission to do this.").then(message.delete(0));
    if (message.channel.name.startsWith("ticket-")) {
        message.channel.delete();
    } else {
        message.channel.send('That command can only be used in a ticket.').then(message.delete(0));
        return
    }
		let closed = new Discord.RichEmbed()
                .setColor(colors.red)
                .setTitle("**Ticket | Closed**")
                .addField("**Issued By**:", `${message.author}`)
                
                let closeChannel = message.guild.channels.find(c => c.name === "logs")
                closeChannel.send(closed)
    };					   
})
bot.login("NzQ1MTg1MzM0MzcwNzYyODQy.XzuF7A.GKuDy8Y5IoFO5qIX-rV0KjXRIKU");
