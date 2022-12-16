const { MessageEmbed, Collection } = require("discord.js");
var config = require("../config/config.json");
var ee = require("../config/embed.json");
const client = require("../index");
const prefix = config.prefix;


client.on("messageCreate", async (message) => {
  const { escapeRegex, onCoolDown } = require("../utils/function");
  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(config.prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [, matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();
  // getting mention prefix
  if (cmd.length === 0) {
    if (matchedPrefix.includes(client.user.id)) {
      const mention = new MessageEmbed()
      .setDescription(`*To see all Commands* \ntype: \`/help\``)
      .setColor(ee.color)      
      message.reply({
        embeds: [mention],
        allowedMentions: {
         repliedUser: false
     }
     });
    }
  }
  
///starting commands & aliases
  const command = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd));

  if (!command) return;
  if (command) {
    let userperm = new MessageEmbed().setDescription(
      `*<a:wrong:885815677091454986> Necesita el permiso **${command.userperm}** *`
    );

    if (!message.member.permissions.has(command.userperm || []))
      return message.channel.send({ embeds: [userperm] });

     
     
    //Check if user is on cooldown with the cmd
    if (onCoolDown(message, command)) {
      let cool = new MessageEmbed()
      .setDescription(`*<a:wrong:885815677091454986> Espere **${onCoolDown(message, command)}** Segundo(s) despues de volver a usar ek comando*`)
      return message.channel.send({embeds : [cool]})
    }

    let botperm = new MessageEmbed().setDescription(
      `*<a:wrong:885815677091454986> Necesito **${command.botperm}** *`
    );
    if (!message.guild.me.permissions.has(command.botperm || []))
    return message.channel.send({ embeds: [botperm] });

    /// owner only command handler
    const { owners } = require("../config/config.json");
if (command) {
 if (command.ownerOnly) {
if (!owners.includes(message.author.id)) {
let ownerOnly = new MessageEmbed()
 .setDescription( "*<a:wrong:885815677091454986> Solo el desarrollador del bot puede usar este comando!*" )
return message.channel.send({ embeds: [ownerOnly]})
}}
}

 if (command) command.run(client, message, args, prefix);



  }

  // new start from here
});
