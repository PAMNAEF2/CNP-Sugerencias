const client = require("..");
const { MessageEmbed } = require('discord.js')
const ee = require("../config/embed.json")
const em = require("../config/emojis.json")

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd)
            return interaction.followUp({ content: "Ha ocurrido un error " });

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        const userperm = interaction.member.permissions.has(cmd.userperm || []);

        if (!userperm) {
            let userperm = new MessageEmbed().setDescription(
                `*${em.fail} Necesita el permiso **${cmd.userperm}** !*`
              );
         return interaction.followUp({embeds : [userperm]}); }

        const botperm = interaction.guild.me.permissions.has(cmd.botperm || []);
        if (!botperm) {
            let perms = new MessageEmbed().setDescription(
                `*${em.fail} Necesito **${cmd.botperm}** !*`
              );
         return interaction.followUp({embeds : [perms]}); }

     const { owners } = require("../config/config.json");
     if (cmd) {
      if (cmd.ownerOnly) {
     if (!owners.includes(interaction.user.id)) {
     let ownerOnly = new MessageEmbed()
      .setDescription( "*${em.fail} Solo el desarrollador del bot puede usar este comando!*" )
    return interaction.followUp({embeds : [ownerOnly] })
    }}
    }
       

        interaction.member = interaction.guild.members.cache.get(interaction.user.id);

        cmd.run(client, interaction, args);
    }
}); 
