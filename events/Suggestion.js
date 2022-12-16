const client = require('../index');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageButton, MessageAttachment, ButtonInteraction, Client, Modal, TextInputComponent, ModalSubmitInteraction, ModalSubmitFieldsResolver } = require("discord.js");
const ee = require("../config/embed.json")
const em = require("../config/emojis.json")
const DB = require('../db/SuggestDB')
const db = require("quick.db")
 

client.on('interactionCreate', async interaction => {
  const userId = db.fetch(`userid_${interaction.guild.id}`)
	if (!interaction.isButton()) return;
  
  
const { guildId, customId, message, member } = interaction

        DB.findOne({ Guild: guildId, MessageID: message.id}, 
                 async (err, data) => {
          if(interaction.customId === 'sug-acc') {
            if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} No puedes usar este botón`, ephemeral: true })

                    if (!data) return interaction.reply({ content: `${em.fail} Lo siento, no pude encontrar ningún dato`, ephemeral: true })

                    const Embed = message.embeds[0]

                    if (!Embed) return

                    Embed.fields[2] = { name: "Estado", value: "Aceptado", inline: true }
                const ARow = new MessageActionRow().addComponents(

                new MessageButton()
                    .setCustomId("sug-accepted")
                    .setStyle("SUCCESS")
                    .setLabel("ACEPTADO")
                  .setDisabled(true),

                new MessageButton()
                    .setCustomId("sug-decline")
                    .setStyle("SECONDARY")
                    .setLabel("DENEGAR")
                 .setDisabled(true),
              new MessageButton()
              .setCustomId("sug-thread")
              .setStyle("SECONDARY")
              .setLabel("Crear hilo")
                  .setDisabled(true),
                   new MessageButton()
          .setCustomId('sug-update')
              .setStyle('PRIMARY')
              .setLabel('MODIFICAR')
                  .setDisabled(true)


          )

                    message.edit({ embeds: [Embed.setColor("GREEN")], components: [ARow]})

                    await data.delete()

                    interaction.reply({ content: `${em.success} Sugerencia aceptada`, ephemeral: true })
          }
         if(interaction.customId === 'sug-dec') 

          {
            
                    if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} No puedes usar este botón.`, ephemeral: true})

                    if (!data) return interaction.reply({content: `${em.fail} Lo siento, no pude encontrar ningún dato`, ephemeral: true})

                    const Embed = message.embeds[0]

                    if (!Embed) return

                    Embed.fields[2] = { name: "Estado", value: "Denegado", inline: true }
                 const DRow = new MessageActionRow().addComponents(

                new MessageButton()
                    .setCustomId("sug-accept")
                    .setStyle("SECONDARY")
                    .setLabel("ACEPTAR")
                  .setDisabled(true),

                new MessageButton()
                    .setCustomId("sug-declined")
                    .setStyle("DANGER")
                    .setLabel("DENEGADO")
                 .setDisabled(true),
              new MessageButton()
              .setCustomId("sug-threaded")
              .setStyle("SECONDARY")
              .setLabel("Crear hilo")
                  .setDisabled(true),
                    new MessageButton()
          .setCustomId('sug-upd')
              .setStyle('PRIMARY')
              .setLabel('MODIFICAR')
.setDisabled(true)

          )

                    message.edit({ embeds: [Embed.setColor("RED")], components: [DRow] })

                    await data.delete()


          }
          if(interaction.customId === 'sug-thr') {
            if (!member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: `${em.fail} No puedes usar este botón.`, ephemeral: true })

                    if (!data) return interaction.reply({ content: `${em.fail} Lo siento, no pude encontrar ningún dato`, ephemeral: true })
       await     message.startThread({
	name: 'Hilo sugerencis',
	autoArchiveDuration: 'MAX',
	reason: 'Sigerencia',
})
  interaction.reply({content: `${em.success} hilo creado`, ephemeral: true })
          }
         
                   if(interaction.customId === 'sug-up') {
            
                  if(!userId === interaction.user.id)   return;

			
            
            
            
            
            
            
            
          }
                   
          }
 
        
  )
  
                   }
)


