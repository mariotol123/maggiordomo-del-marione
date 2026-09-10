require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    ChannelType
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const struttura = [
    {
        nome: "👑・IL REGNO DEL MARIONE",
        canali: [
            ["📜・le-sacree-scritture", ChannelType.GuildText],
            ["📢・il-marione-annuncia", ChannelType.GuildText],
            ["🚪・sei-entrato", ChannelType.GuildText],
            ["🎭・scegli-la-tua-classe", ChannelType.GuildText]
        ]
    },
    {
        nome: "🏛️・PIAZZA MARIONICA",
        canali: [
            ["💬・il-bar-del-marione", ChannelType.GuildText],
            ["💀・delirio-collettivo", ChannelType.GuildText],
            ["📸・prove-compromettenti", ChannelType.GuildText],
            ["🎵・passami-la-canzone", ChannelType.GuildText],
            ["🌙・le-3-di-notte", ChannelType.GuildText],
            ["🤡・fuori-contesto", ChannelType.GuildText]
        ]
    },
    {
        nome: "🎮・REPARTO GAMING",
        canali: [
            ["🎮・chi-gioca", ChannelType.GuildText],
            ["⚔️・ranked-e-bestemmie", ChannelType.GuildText],
            ["💀・skill-issue", ChannelType.GuildText],
            ["📺・clip-del-marione", ChannelType.GuildText]
        ]
    },
    {
        nome: "🦔・LA TANA DEL MARIONE",
        canali: [
            ["🛋️ Salotto del Marione", ChannelType.GuildVoice],
            ["🎮 Ranked & Disperazione", ChannelType.GuildVoice],
            ["🌙 Le 4 del mattino", ChannelType.GuildVoice],
            ["❤️ Terapia di gruppo", ChannelType.GuildVoice]
        ]
    },
    {
        nome: "👑・NOBILTÀ MARIONICA",
        canali: [
            ["💎・salotto-della-nobilta", ChannelType.GuildText],
            ["🗳️・decidete-voi", ChannelType.GuildText],
            ["🎁・roba-per-i-sub", ChannelType.GuildText],
            ["👑 Tavola Rotonda", ChannelType.GuildVoice]
        ]
    },
    {
        nome: "🗑️・IL SOTTOSCALA",
        canali: [
            ["💩・shitposting", ChannelType.GuildText],
            ["🔥・hot-takes", ChannelType.GuildText],
            ["🚪・non-entrare", ChannelType.GuildText]
        ]
    }
];

client.once("ready", async () => {
    console.log(`👑 Il Marione è entrato come ${client.user.tag}`);

    const guild = client.guilds.cache.first();

    if (!guild) {
        console.log("❌ Il bot non è in nessun server.");
        process.exit();
    }

    console.log(`🏰 Configuro: ${guild.name}`);

    try {
        for (const sezione of struttura) {

            // Crea la categoria
            const categoria = await guild.channels.create({
                name: sezione.nome,
                type: ChannelType.GuildCategory
            });

            console.log(`📁 ${sezione.nome}`);

            // Crea i canali
            for (const [nome, tipo] of sezione.canali) {
                await guild.channels.create({
                    name: nome,
                    type: tipo,
                    parent: categoria.id
                });

                console.log(`   ✅ ${nome}`);
            }
        }

        console.log("");
        console.log("👑 IL REGNO DEL MARIONE È STATO CREATO.");
        console.log("Puoi spegnere il bot.");

    } catch (error) {
        console.error("❌ Errore:", error);
    }

    process.exit();
});

client.login(process.env.DISCORD_TOKEN);