const { Client, MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js")
const SuggestionDB = require('../../db/Suggestion')
const DB = require('../../db/SuggestDB')
const ee = require('../../config/embed.json')
const em = require('../../config/emojis.json')
const db = require("quick.db")
module.exports = {
    name: "sugerir",
    description: "Sugerir algo",
  userperm: [],
    botperm: [],
    ownerOnly: false,
    
    options: [
        {
            name: "sugerencia",
            description: "La sugerencia",
            type: "STRING",
            required: true
        }
    ],
run: async(client, interaction, args ) => {

db.set(`userid_${interaction.guild.id}`, interaction.user.id)
  const { options, guild, channel, user } = interaction

        const suggestion = options.getString("sugerencia")

        const channelData = await SuggestionDB.findOne({ Guild: guild.id }).catch(err => { })

        if (channelData) {

            const Channel = guild.channels.cache.get(channelData.Channel)

            if (!Channel) return Error(interaction, "El canal de sugerencias aún no está")

            if (channel.id !== Channel.id) return Error(interaction, `${em.fail} Solo puedes sugerir en el Canal de Sugerencias`)

            const Embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle(`${em.dot} Sugerencia`)
                .addFields([
                    { name: "Sugerencia", value: `${suggestion}`, inline: false },
                    { name: "Sugerido por:", value: `${user}`, inline: true },
                    { name: "Estado", value: "Pendiente", inline: true },
                ])
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Los bottones de abajo solo son para administracion" })

            const Row = new MessageActionRow().addComponents(

                new MessageButton()
                    .setCustomId("sug-acc")
                    .setStyle("SECONDARY")
                    .setLabel("ACEPTAR"),

                new MessageButton()
                    .setCustomId("sug-dec")
                    .setStyle("SECONDARY")
                    .setLabel("DENEGAR"),
              new MessageButton()
              .setCustomId("sug-thr")
              .setStyle("SECONDARY")
              .setLabel("Crear hilo"),
              new MessageButton()
          .setCustomId('sug-up')
              .setStyle('PRIMARY')
              .setLabel('MODIFICAR')

            )
          
            

            const M = await interaction.followUp({ embeds: [Embed], components: [Row], fetchReply: true })

            const Data = new DB({
                Guild: guild.id,
                MessageID: M.id,
                Details: [
                    {
                        MemberID: user.id,
                        Suggestion: suggestion
                    }
                ]
              
            })
          M.react(em.like)
          M.react(em.equal)
          M.react(em.dislike)
          

            await Data.save()

        } else return Error(interaction, `${em.fail} El canal de sugerencias aún no está configurado`)
}

}
function Error(interaction, description) {

    interaction.followUp({
        embeds: [
            new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`${description}!`)
        ],
        ephemeral: true
    })

          }
