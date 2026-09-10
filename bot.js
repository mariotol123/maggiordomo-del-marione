require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

// ======================================================
// CLIENT DISCORD
// ======================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// ======================================================
// RUOLI SELEZIONABILI
// ======================================================

const ROLE_CONFIG = [
    {
        name: "🎮 Gamer",
        customId: "role_gamer",
        emoji: "🎮"
    },
    {
        name: "⚔️ League of Legends",
        customId: "role_lol",
        emoji: "⚔️"
    },
    {
        name: "🌙 Creatura Notturna",
        customId: "role_notturno",
        emoji: "🌙"
    },
    {
        name: "📺 Live del Marione",
        customId: "role_live",
        emoji: "📺"
    }
];

// ======================================================
// CREA RUOLO SE NON ESISTE
// ======================================================

async function getOrCreateRole(guild, roleName) {
    let role = guild.roles.cache.find(
        r => r.name === roleName
    );

    if (!role) {
        role = await guild.roles.create({
            name: roleName,
            reason: "Ruolo creato dal Maggiordomo del Marione"
        });

        console.log(`✅ Creato ruolo: ${roleName}`);
    }

    return role;
}

// ======================================================
// SACRE SCRITTURE
// ======================================================

async function setupRulesChannel(guild) {

    const channel = guild.channels.cache.find(
        c => c.name === "📜・le-sacree-scritture"
    );

    if (!channel) {
        console.log("❌ Canale le-sacree-scritture non trovato.");
        return;
    }

    // Tutti possono leggere ma non scrivere
    await channel.permissionOverwrites.edit(
        guild.roles.everyone,
        {
            ViewChannel: true,
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            AddReactions: true
        }
    );

    const messages = await channel.messages.fetch({
        limit: 50
    });

    // Evita di pubblicare le regole ogni volta
    const existing = messages.find(
        m =>
            m.author.id === client.user.id &&
            m.content.includes("LE SACRE SCRITTURE")
    );

    if (existing) {
        console.log("📜 Regole già presenti.");
        return;
    }

    await channel.send(`
# 📜 LE SACRE SCRITTURE

Benvenuto nel **Regno del Marione**. 👑

Varcando queste porte accetti gli antichi comandamenti.

**I. Rispetta gli altri sudditi.**
Si scherza, si percula e si cazzeggia, ma senza trasformare tutto in insulti seri o attacchi personali.

**II. Niente discriminazioni o comportamenti tossici.**
Il Regno deve essere un posto in cui tutti possano stare tranquilli.

**III. Niente spam o pubblicità selvaggia.**
Link, server, canali e autopromozione vanno condivisi con buon senso.

**IV. Ogni luogo ha il suo scopo.**
Cerca di utilizzare i canali appropriati. Il caos è ammesso, ma almeno organizziamolo.

**V. Niente contenuti NSFW o illegali.**
Non fate chiudere il Regno per una vostra genialata.

**VI. Non rompere intenzionalmente le palle al prossimo.**
Questa in realtà poteva essere l'unica regola.

**VII. Rispetta le decisioni dello staff.**
Se qualcosa non ti sta bene, se ne parla tranquillamente.

**VIII. Divertiti.**
Siamo qui per giocare, parlare, guardare le live e degenerare insieme.

### 👑 Il Marione osserva.
### 👑 Il Marione giudica.
### 🔨 E, quando necessario, il Marione banna.
    `);

    console.log("📜 Regole pubblicate.");
}

// ======================================================
// SCEGLI LA TUA CLASSE
// ======================================================

async function setupRolesChannel(guild) {

    const channel = guild.channels.cache.find(
        c => c.name === "🎭・scegli-la-tua-classe"
    );

    if (!channel) {
        console.log("❌ Canale scegli-la-tua-classe non trovato.");
        return;
    }

    // Gli utenti possono vedere ma non scrivere
    await channel.permissionOverwrites.edit(
        guild.roles.everyone,
        {
            ViewChannel: true,
            SendMessages: false,
            SendMessagesInThreads: false,
            CreatePublicThreads: false,
            CreatePrivateThreads: false,
            AddReactions: true
        }
    );

    // Crea i ruoli se non esistono
    for (const roleData of ROLE_CONFIG) {
        await getOrCreateRole(
            guild,
            roleData.name
        );
    }

    const messages = await channel.messages.fetch({
        limit: 50
    });

    // Evita duplicati
    const existing = messages.find(
        m =>
            m.author.id === client.user.id &&
            m.content.includes("SCEGLI LA TUA CLASSE")
    );

    if (existing) {
        console.log("🎭 Messaggio ruoli già presente.");
        return;
    }

    // Pulsanti
    const row = new ActionRowBuilder();

    for (const roleData of ROLE_CONFIG) {

        const button = new ButtonBuilder()
            .setCustomId(roleData.customId)
            .setLabel(
                roleData.name
                    .replace(roleData.emoji, "")
                    .trim()
            )
            .setEmoji(roleData.emoji)
            .setStyle(ButtonStyle.Secondary);

        row.addComponents(button);
    }

    await channel.send({
        content: `
# 🎭 SCEGLI LA TUA CLASSE

Ogni suddito deve scegliere il proprio destino.

🎮 **Gamer**
Per chi vive davanti a un monitor.

⚔️ **League of Legends**
Per chi ha volontariamente rinunciato alla serenità.

🌙 **Creatura Notturna**
Per chi alle 4 del mattino scrive ancora:
*"ultima e poi stacco"*

📺 **Live del Marione**
Per ricevere il richiamo quando Sua Maestà va in live.

### 👑 Nobiltà Marionica

Questa non si sceglie.

**Si conquista.**
        `,
        components: [row]
    });

    console.log("🎭 Messaggio ruoli pubblicato.");
}

// ======================================================
// BOT ONLINE
// ======================================================

client.once("ready", async () => {

    console.log(
        `👑 Maggiordomo online come ${client.user.tag}`
    );

    const guild = client.guilds.cache.first();

    if (!guild) {
        console.log(
            "❌ Il bot non è in nessun server."
        );
        return;
    }

    console.log(
        `🏰 Server trovato: ${guild.name}`
    );

    try {

        await setupRulesChannel(guild);

        await setupRolesChannel(guild);

        console.log("");
        console.log(
            "👑 Il Regno è configurato."
        );

        console.log(
            "🤵 Il Maggiordomo è in servizio."
        );

        console.log(
            "🚪 Sistema di benvenuto attivo."
        );

    } catch (error) {

        console.error(
            "❌ Errore durante il setup:",
            error
        );
    }
});

// ======================================================
// PULSANTI RUOLI
// ======================================================

client.on(
    "interactionCreate",
    async interaction => {

        if (!interaction.isButton()) {
            return;
        }

        const roleData = ROLE_CONFIG.find(
            r =>
                r.customId ===
                interaction.customId
        );

        if (!roleData) {
            return;
        }

        const role =
            interaction.guild.roles.cache.find(
                r => r.name === roleData.name
            );

        if (!role) {

            await interaction.reply({
                content:
                    "❌ Ruolo non trovato.",
                ephemeral: true
            });

            return;
        }

        try {

            const member =
                await interaction.guild.members.fetch(
                    interaction.user.id
                );

            // Se ha già il ruolo → rimuovilo
            if (
                member.roles.cache.has(
                    role.id
                )
            ) {

                await member.roles.remove(
                    role
                );

                await interaction.reply({
                    content:
                        `❌ Hai rimosso il ruolo **${role.name}**.`,
                    ephemeral: true
                });

            }

            // Altrimenti → aggiungilo
            else {

                await member.roles.add(
                    role
                );

                await interaction.reply({
                    content:
                        `✅ Ora fai parte di **${role.name}**.`,
                    ephemeral: true
                });

            }

        } catch (error) {

            console.error(
                "❌ Errore assegnazione ruolo:",
                error
            );

            if (!interaction.replied) {

                await interaction.reply({
                    content:
                        "❌ Non riesco ad assegnare il ruolo. Controlla i permessi del Maggiordomo.",
                    ephemeral: true
                });

            }
        }
    }
);

// ======================================================
// BENVENUTO NUOVI MEMBRI
// ======================================================

client.on(
    "guildMemberAdd",
    async member => {

        const guild = member.guild;

        const welcomeChannel =
            guild.channels.cache.find(
                c =>
                    c.name ===
                    "🚪・sei-entrato"
            );

        if (!welcomeChannel) {

            console.log(
                "❌ Canale sei-entrato non trovato."
            );

            return;
        }

        try {

            const rulesChannel =
                guild.channels.cache.find(
                    c =>
                        c.name ===
                        "📜・le-sacree-scritture"
                );

            const rolesChannel =
                guild.channels.cache.find(
                    c =>
                        c.name ===
                        "🎭・scegli-la-tua-classe"
                );

            const rulesMention =
                rulesChannel
                    ? `<#${rulesChannel.id}>`
                    : "📜 le Sacre Scritture";

            const rolesMention =
                rolesChannel
                    ? `<#${rolesChannel.id}>`
                    : "🎭 scegli la tua classe";

            // Numero attuale di membri
            const memberNumber =
                guild.memberCount;

            await welcomeChannel.send(`
# 👑 UN NUOVO SUDDITO È ARRIVATO!

Benvenuto ${member} nel **Regno del Marione**! 🏰

Sei ufficialmente il **suddito n° ${memberNumber}**.

📜 Prima consulta ${rulesMention}

🎭 Poi passa da ${rolesMention} e scegli il tuo destino.

Cerca di comportarti bene.

**O almeno cerca di non farti bannare nelle prime 24 ore. 💀**

👑 *Sua Maestà ti osserva.*
            `);

            console.log(
                `🚪 Benvenuto inviato a ${member.user.tag}`
            );

        } catch (error) {

            console.error(
                "❌ Errore nel messaggio di benvenuto:",
                error
            );

        }
    }
);

// ======================================================
// LOGIN
// ======================================================

client.login(
    process.env.DISCORD_TOKEN
);