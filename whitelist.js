require("dotenv").config();
const {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const fs = require("fs");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  // code

  client.on("interactionCreate", async (interaction) => {
    if (
      !interaction.isCommand() &&
      !interaction.isButton() &&
      !interaction.isModalSubmit() &&
      !interaction.showModal()
    )
      return;
    if (interaction.isCommand()) {
      if (interaction.commandName == "setup") {
        let applyChannel = client.channels.cache.get(process.env.ApplyChannel);
        if (!applyChannel) return;

        let hasRole = interaction.member.roles.cache.has(
          process.env.InteractionRole,
        );
        if (hasRole) {
          let btnrow = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setStyle(ButtonStyle.Primary)
              .setCustomId("ap_apply")
              .setLabel("Apply For PD")
              .setEmoji("📑"),
          ]);
          applyChannel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle(`HORIZON APPLICATIONS`)
                .setAuthor({
                  name: `${process.env.ServerName} | PD Application`,
                  iconURL: process.env.ServerLogo,
                })
                .setColor("#00e5ff")
                .setThumbnail(
                  "https://media.discordapp.net/attachments/1258517587705331712/1258523526613303416/profile.gif?ex=6689039e&is=6687b21e&hm=a11e7e8e50010b1b6bb70e26bab141af0d5e843370760e077c5530d2f2992222&=&width=320&height=320",
                )
                .setImage(
                  "https://media.discordapp.net/attachments/1258517587705331712/1258780985764614266/whitelist_final.gif?ex=66894aa6&is=6687f926&hm=a43fb7b4e94572da8717bf6f4a0e904aedf1c017a151bb1d0a673822fd4fa0a4&=&width=1177&height=662",
                )
                .setFooter({
                  text: "Test"
                    ? `${process.env.ServerName}`
                    : `${process.env.ServerName}`,
                })
                .setTimestamp(new Date()),
            ],
            components: [btnrow],
          });

          interaction.reply({
            content: `> Setup in ${applyChannel}`,
          });
        } else {
          interaction.reply({
            content: `You don't have the privilage to do this command contact Admins for more information`,
            ephemeral: true,
          });
        }
      } else if (interaction.commandName == "acceptwl") {
        await interaction.deferReply({ ephemeral: true });

        let hasRole = interaction.member.roles.cache.has(
          process.env.InteractionRole,
        );
        if (hasRole) {
          const user = interaction.options.getMember("user");

          let acceptchannel = interaction.guild.channels.cache.get(
            process.env.AcceptChannel,
          );

          const acceptEmbed = new EmbedBuilder()
            .setColor("#00d0ff")
            .setAuthor({
              name: "HORIZON",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setImage(
              "https://media.discordapp.net/attachments/1258517587705331712/1258784781382975549/ACCEPTED.gif?ex=66894e2e&is=6687fcae&hm=b032b05b6f92f345c896d3b1c3d32124b2d579aa813c6f9835d16387fbf7209c&=&width=687&height=386",
            )
            .addFields([
              {
                name: "\n\u200b\nServer Name ",
                value: `\`\`\`HORIZON\`\`\``,
                inline: false,
              },
              {
                name: "\n\u200b\nWhitelist Status",
                value: `\`\`\`✅ WHITELISTED\`\`\``,
                inline: true,
              },
            ])
            .setTimestamp()
            .setFooter({
              text: `${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            });
          try {
            await user.roles.add(process.env.WhiteListRole).catch((e) => {
              console.log(e);
            });
            await user.roles.remove(process.env.PendingRole).catch((e) => {
              console.log(e);
            });
            acceptchannel.send({
              content: `<@${user.user.id}>  ʏᴏᴜʀ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ʜᴀs ʙᴇᴇɴ ᴀᴄᴄᴇᴘᴛᴇᴅ.ᴇɴᴊᴏʏ ʜᴏʀɪᴢᴏɴ ʀᴏʟᴇᴘʟᴀʏ.`,
              embeds: [acceptEmbed],
            });
            await user.send({
              content: `<@${user.user.id}>  ʏᴏᴜʀ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ʜᴀs ʙᴇᴇɴ ᴀᴄᴄᴇᴘᴛᴇᴅ.ᴇɴᴊᴏʏ ʜᴏʀɪᴢᴏɴ ʀᴏʟᴇᴘʟᴀʏ.`,
              embeds: [acceptEmbed],
            });
            interaction.editReply({
              content: `The message has been send on <#${process.env.AcceptChannel}>`,
              ephemeral: true,
            });
            return;
          } catch (error) {
            if (error.code === 50007) {
              interaction.editReply({
                content: `The mentioned user has blocked their DMs. Don't worry, the role has been added.`,
                ephemeral: true,
              });
            } else {
              interaction
                .reply({
                  content: `An error occurred while processing your request.`,
                  ephemeral: true,
                })
                .catch((e) => {
                  interaction.editReply({
                    content: `An error occurred while processing your request.`,
                    ephemeral: true,
                  });
                });
            }
            return;
          }
        } else {
          interaction.reply({
            content: `You don't have the privilage to do this command contact <@813966990674493511> or other admins for more information`,
            ephemeral: true,
          });
        }
      }

      //For Form Opening were handled by here and other button events
    } else if (interaction.isButton()) {
      if (interaction.customId == "ap_apply") {
        let application_modal = new ModalBuilder()
          .setTitle(`Whitelist Applications`)
          .setCustomId(`application_modal`);

        const user_name = new TextInputBuilder()
          .setCustomId("ap_username")
          .setLabel(`What is your name ?`.substring(0, 45))
          .setMinLength(4)
          .setMaxLength(25)
          .setRequired(true)
          .setPlaceholder(`Enter you real name`)
          .setStyle(TextInputStyle.Short);

        const user_age = new TextInputBuilder()
          .setCustomId("ap_userage")
          .setLabel(`What is your real Age`.substring(0, 45))
          .setMinLength(1)
          .setMaxLength(2)
          .setRequired(true)
          .setPlaceholder(`Enter you Age`)
          .setStyle(TextInputStyle.Short);

        const user_ingameName = new TextInputBuilder()
          .setCustomId("ap_useringameName")
          .setLabel(`What is your in-game Name ?`.substring(0, 45))
          .setMinLength(4)
          .setMaxLength(30)
          .setRequired(true)
          .setPlaceholder(`Enter your in-game Name`)
          .setStyle(TextInputStyle.Short);

        const user_email = new TextInputBuilder()
          .setCustomId("ap_useremail")
          .setLabel(`What is your email-ID`.substring(0, 45))
          .setMinLength(10)
          .setMaxLength(50)
          .setRequired(true)
          .setPlaceholder(`Enter your email address`)
          .setStyle(TextInputStyle.Short);

        const user_exp = new TextInputBuilder()
          .setCustomId("ap_userexp")
          .setLabel(`What is your roleplay experince`.substring(0, 45))
          .setMinLength(6)
          .setMaxLength(1000)
          .setRequired(true)
          .setPlaceholder(`Enter your current roleplay experince`)
          .setStyle(TextInputStyle.Paragraph);

        let row_username = new ActionRowBuilder().addComponents(user_name);
        let row_userage = new ActionRowBuilder().addComponents(user_age);
        let row_useringameName = new ActionRowBuilder().addComponents(
          user_ingameName,
        );
        let row_useremail = new ActionRowBuilder().addComponents(user_email);
        let row_userexp = new ActionRowBuilder().addComponents(user_exp);
        application_modal.addComponents(
          row_username,
          row_userage,
          row_useringameName,
          row_useremail,
          row_userexp,
        );

        try {
          await interaction.showModal(application_modal);
        } catch (error) {
          console.error("Error Showing Modals:", error);
        }
      } else if (interaction.customId == "ap_pending") {
        let embed = new EmbedBuilder(interaction.message.embeds[0]).setColor(
          "Yellow",
        );

        interaction.message.edit({
          embeds: [embed],
          components: [],
        });

        let ap_user = interaction.guild.members.cache.get(
          embed.data.footer.text,
        );

        let pendingchannel = interaction.guild.channels.cache.get(
          process.env.PendingChannel,
        );

        enqcode = embed.data.fields[0].value;
        sliced_enq = enqcode.slice(3, 7);

        const pendingEmbed = new EmbedBuilder()
          .setColor("Yellow")
          .setAuthor({
            name: "HORIZON",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .addFields([
            {
              name: "\n\u200b\nServer Name ",
              value: `\`\`\`ʜᴏʀɪᴢᴏɴ\`\`\``,
              inline: false,
            },
            {
              name: "\n\u200b\nWhitelist Status",
              value: `\`\`\`⌛ Pending\`\`\``,
              inline: true,
            },
            {
              name: "\n\u200b\nEnquiry ID",
              value: `\`\`\`${sliced_enq}\`\`\``,
              inline: true,
            },
          ])

          .setImage(
            "https://media.discordapp.net/attachments/1258517587705331712/1258782818750955520/pending.gif?ex=66894c5b&is=6687fadb&hm=7548adcc741da6a6f789d6e1744bb2ef74a17f1246f7fa3405a2ace4d2b0c658&=&width=1177&height=662",
          )
          .setTimestamp()
          .setFooter({
            text: `${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          });

        try {
          await ap_user.roles.add(process.env.PendingRole).catch((e) => {});
          pendingchannel.send({
            content: `<@${ap_user.user.id}>  ʏᴏᴜʀ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ʜᴀs ʙᴇᴇɴ ᴀᴄᴄᴇᴘᴛᴇᴅ <#1262019716613148745> ᴊᴏɪɴ ᴡᴀɪᴛɪɴɢ ᴠᴄ ᴛᴏ ᴘʀᴏᴄᴇᴅ.`,
            embeds: [pendingEmbed],
          });
          ap_user.send({
            content: `<@${ap_user.user.id}>  ʏᴏᴜʀ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ʜᴀs ʙᴇᴇɴ ᴀᴄᴄᴇᴘᴛᴇᴅ <#1262019716613148745> ᴊᴏɪɴ ᴡᴀɪᴛɪɴɢ ᴠᴄ ᴛᴏ ᴘʀᴏᴄᴇᴅ.`,
            embeds: [pendingEmbed],
          });
        } catch (error) {
          if (error.code === 50007) {
            interaction.reply({
              content: `The mentioned user has blocked their DMs. Don't worry, the role has been added.`,
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: `An error occurred while processing your request.`,
              ephemeral: true,
            });
          }
          return;
        }
      } else if (interaction.customId == "ap_reject") {
        let reject_reason_modal = new ModalBuilder()
          .setTitle(`Whitelist Applications reject`)
          .setCustomId(`reject_reason_modal`);

        const reject_reason = new TextInputBuilder()
          .setCustomId("ap_reject_reason")
          .setLabel(`What is the reason for rejection ?`.substring(0, 45))
          .setMinLength(5)
          .setMaxLength(50)
          .setRequired(true)
          .setPlaceholder(`Enter rejection details`)
          .setStyle(TextInputStyle.Short);

        let row_reject_reason = new ActionRowBuilder().addComponents(
          reject_reason,
        );
        reject_reason_modal.addComponents(row_reject_reason);

        try {
          await interaction.showModal(reject_reason_modal);
        } catch (error) {
          console.error("Error showing Reject Modal:", error);

          // If you catch an error here, it might indicate that the user has blocked DMs
        }
      }

      //For Data Submition to the dedicated channel
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === "application_modal") {
        let user_name = interaction.fields.getTextInputValue("ap_username");
        let user_age = interaction.fields.getTextInputValue("ap_userage");
        let user_ingameName =
          interaction.fields.getTextInputValue("ap_useringameName");
        let user_email = interaction.fields.getTextInputValue("ap_useremail");
        let user_exp = interaction.fields.getTextInputValue("ap_userexp");
        let finishChannel = interaction.guild.channels.cache.get(
          process.env.LogChannel,
        );
        if (!finishChannel) return;
        let btnrow = new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId("ap_pending")
            .setLabel("Pending")
            .setEmoji("⌛"),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setCustomId("ap_reject")
            .setLabel("Reject")
            .setEmoji("✖️"),
        ]);

        const fileName = "Database.json";
        var rowdata = fs.readFileSync(fileName, "utf8"); // This will block the event loop, not recommended for non-cli programs.
        var data = JSON.parse(rowdata);
        var valueofwlid = data.id;

        finishChannel.send({
          content: `Pd Application From <@${interaction.user.id}> \n<@&1258470417845456948>`,
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: `${process.env.ServerName} | Server Application Log`,
                iconURL: process.env.ServerLogo,
              })
              .setColor("Blue")
              .setThumbnail(process.env.ServerLogo)
              .setFooter({
                text: "Test"
                  ? `${process.env.ServerName}`
                  : `${process.env.ServerName}`,
              })
              .setTimestamp(new Date())
              .setTitle(`HORIZON APPLICATIONS LOGS`)
              .addFields([
                {
                  name: "\n\u200b\nEnquiry ID",
                  value: `\`\`\`${valueofwlid}\`\`\``,
                  inline: false,
                },
                {
                  name: "\n\u200b\nWhat is your name?",
                  value: `\`\`\`${user_name}\`\`\``,
                  inline: false,
                },
                {
                  name: "\n\u200b\nWhat is your age?",
                  value: `\`\`\`${user_age}\`\`\``,
                  inline: false,
                },
                {
                  name: "\n\u200b\nWhat is your in-game Name ?",
                  value: `\`\`\`${user_ingameName}\`\`\``,
                  inline: false,
                },
                {
                  name: "\n\u200b\nWhat is your email-ID",
                  value: `\`\`\`${user_email}\`\`\``,
                  inline: false,
                },
                {
                  name: "\n\u200b\nWhat is your roleplay experince",
                  value: `\`\`\`${user_exp}\`\`\``,
                  inline: false,
                },
              ])

              .setFooter({
                text: `${interaction.user.id}`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              }),
          ],
          components: [btnrow],
        });

        interaction.reply({
          content: `Thank you for your application with code **#${valueofwlid}** ! We'll review it and be in touch.`,
          ephemeral: true,
        });

        let updateingvalue = {
          id: valueofwlid + 1,
        };
        let encryptdata = JSON.stringify(updateingvalue);
        fs.writeFileSync(fileName, encryptdata);

        interaction.user
          .send({
            content: `Thank you for your PD application. We'll review it and be in touch.`,
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: `${process.env.ServerName} | Server Application`,
                  iconURL: process.env.ServerLogo,
                })
                .setColor("Blue")
                .setThumbnail(process.env.ServerLogo)
                .setFooter({
                  text: "Test"
                    ? `${process.env.ServerName}`
                    : `${process.env.ServerName}`,
                })
                .setTimestamp(new Date())
                .setTitle(`HORIZON APPLICATIONS`)
                .addFields([
                  {
                    name: "\n\u200b\nMessage",
                    value: `\`\`\`Thank you for applying! \nWe will respond shortly.\`\`\``,
                    inline: true,
                  },
                  {
                    name: "\n\u200b\nEnquiry ID?",
                    value: `\`\`\`${valueofwlid}\`\`\``,
                    inline: false,
                  },
                ])

                .setFooter({
                  text: `${interaction.user.username}`,
                  iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                }),
            ],
          })
          .catch((e) => {});
      } else if (interaction.customId === "reject_reason_modal") {
        let reject_reasoninput =
          interaction.fields.getTextInputValue("ap_reject_reason");

        let embed = new EmbedBuilder(interaction.message.embeds[0]).setColor(
          "Red",
        );

        interaction.message.edit({
          embeds: [embed],
          components: [],
        });

        let ap_user = interaction.guild.members.cache.get(
          embed.data.footer.text,
        );

        try {
          ap_user.send(
            `Your  PD application has been rejected by ${interaction.user.tag}`,
          );
        } catch (error) {
          if (error.code === 50007) {
            interaction.reply({
              content: `The mentioned user has blocked their DMs. Don't worry, the role has been added.`,
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: `An error occurred while processing your request.`,
              ephemeral: true,
            });
          }
        }

        let rejectchannel = interaction.guild.channels.cache.get(
          process.env.RejectChannel,
        );

        const rejectEmbed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: "HORIZON",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(`${ap_user.user.avatarURL()}`)
          .addFields([
            {
              name: "\n\u200b\nServer Name ",
              value: `\`\`\`HORIZON\`\`\``,
              inline: false,
            },
            {
              name: "\n\u200b\nWhitelist Status",
              value: `\`\`\`❌ Rejected\`\`\``,
              inline: true,
            },
            {
              name: "\n\u200b\nReason",
              value: `\`\`\`${reject_reasoninput}\`\`\``,
              inline: true,
            },
          ])
          .setImage(
            "https://media.discordapp.net/attachments/1258517587705331712/1258786419799883786/REJECTED.gif?ex=66894fb5&is=6687fe35&hm=3896b71d745c9f0a488eec12bfbba7b178c0a25ab9aa4c7789832e8a77f81820&=&width=1177&height=662",
          )
          .setTimestamp()
          .setFooter({
            text: `${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
          });
        rejectchannel.send({
          content: `<@${ap_user.user.id}> ʏᴏᴜʀ PD ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ᴡᴀs ʀᴇᴊᴇᴄᴛᴇᴅ..`,
          embeds: [rejectEmbed],
        });
        ap_user.send({
          content: `<@${ap_user.user.id}> ʏᴏᴜʀ PD ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ᴡᴀs ʀᴇᴊᴇᴄᴛᴇᴅ..`,
          embeds: [rejectEmbed],
        });
        interaction.reply({
          content: `Reject Message has been sended to rejected channel`,
          ephemeral: true,
        });
      }
    }
  });
};
