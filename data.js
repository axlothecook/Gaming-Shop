const navLinks = [
    { 
        href: '/',
        text: 'Home'
    },
    {
        href: '/products',
        text: 'Games',
        imgPath: 'url(/images/backgrounds/bg1.jpg)',
        txtClr: '#000'
    },
    {
        href: '/category',
        text: 'Categories',
        imgPath: 'url(/images/backgrounds/bg2.jpg)',
        txtClr: '#fff'
    },
];

const alphaErr = 'containts one or more forbidden character(s).';
const lengthErr = 'needs to be between';

const devsListArray = [
    {
        id: 1,
        name: 'Electronic Arts',
        url: 'url(/images/devs/ea.jpg)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 2,
        name: 'Square Enix',
        url: 'url(/images/devs/square.jpg)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 3,
        name: 'Sony PlayStation Studios',
        url: 'url(/images/devs/sony.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 4,
        name: 'Kojima Productions',
        url: 'url(/images/devs/kojima.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 5,
        name: 'Capcom',
        url: 'url(/images/devs/capcom.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 6,
        name: 'Take-Two Interactive',
        url: 'url(/images/devs/takeTwo.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 7,
        name: 'SEGA',
        url: 'url(/images/devs/sega.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 8,
        name: 'Nintendo',
        url: 'url(/images/devs/Nintendo.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 9,
        name: 'iRacing Studios',
        url: 'url(/images/devs/iracing.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 10,
        name: 'Xbox Game Studios',
        url: 'url(/images/devs/xbox.jpg)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 11,
        name: 'CD Project Red',
        url: 'url(/images/devs/cd.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 12,
        name: 'Rockstar Games',
        url: 'url(/images/devs/rockstar.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 13,
        name: 'FromSoftware Inc.',
        url: 'url(/images/devs/fromsoftware.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 14,
        name: 'Valve Corporation',
        url: 'url(/images/devs/valve.jpg)',
        numberOfGames: 2,
        checked: false,
        isDefault: true
    },
    {
        id: 15,
        name: 'Wube Software',
        url: 'url(/images/devs/wube.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 16,
        name: 'Riot Games',
        url: 'url(/images/devs/riot.jpg)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 17,
        name: 'BlueTwelve Studio',
        url: 'url(/images/devs/bluetwelve.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 18,
        name: 'Hypergryph',
        url: 'url(/images/devs/hypergryph.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 19,
        name: 'Ubisoft',
        url: 'url(/images/devs/ubisoft.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 20,
        name: 'Epic Games',
        url: 'url(/images/devs/epic.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 21,
        name: 'Digital Extremes',
        url: 'url(/images/devs/digitalExtremes.jpg)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    },
    {
        id: 22,
        name: 'Bloober Team',
        url: 'url(/images/devs/bloober.png)',
        numberOfGames: 1,
        checked: false,
        isDefault: true
    }
];

const genresListArray = [
    {
        id: 1,
        name: 'Action',
        numberOfGames: 9,
        url: 'url(/images/genres/action.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 2,
        name: 'Adventure',
        numberOfGames: 7,
        url: 'url(/images/genres/adventure.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 3,
        name: 'Fighting',
        numberOfGames: 4,
        url: 'url(/images/genres/fighting.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 4,
        name: 'Platform',
        numberOfGames: 2,
        url: 'url(/images/genres/platform.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 5,
        name: 'Puzzle',
        numberOfGames: 4,
        url: 'url(/images/genres/puzzle.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 6,
        name: 'Racing',
        numberOfGames: 2,
        url: 'url(/images/genres/racing.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 7,
        name: 'Role-Playing',
        numberOfGames: 5,
        url: 'url(/images/genres/rpg.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 8,
        name: 'Simulation',
        numberOfGames: 3,
        url: 'url(/images/genres/simulator.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 9,
        name: 'Sports',
        numberOfGames: 2,
        url: 'url(/images/genres/sports.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 10,
        name: 'MOBA',
        numberOfGames: 2,
        url: 'url(/images/genres/moba.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 11,
        name: 'Indie',
        numberOfGames: 2,
        url: 'url(/images/genres/indie.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 12,
        name: 'Strategy',
        numberOfGames: 5,
        url: 'url(/images/genres/strategy.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 13,
        name: 'Live Service',
        numberOfGames: 4,
        url: 'url(/images/genres/liveService.jpg)',
        checked: false,
        isDefault: true
    },
    {
        id: 14,
        name: 'Survival Horror',
        numberOfGames: 2,
        url: 'url(/images/genres/horror.jpg)',
        checked: false,
        isDefault: true
    }
];

const gamesInStoreArray = [
    {
        id: 1,
        name: 'Death Stranding 2: On the Beach',
        genre: ['Action', 'Adventure', 'Fighting', 'Role-Playing', 'Strategy'],
        developers: ['Kojima Productions'],
        price: 69,
        description: `The player controls Sam Porter Bridges, a freelance porter, as he and his companions set out on an expedition across the Australian continent to connect isolated survivors and colonies to the wireless communications "chiral" network in order to save humanity from extinction.`,
        rating: 9,
        url: 'url(/images/games/deathStranding.jpg)',
        isDefault: true
    },
    {
        id: 2,
        name: 'Kingdom Hearts HD 1.5 + 2.5 ReMIX',
        genre: ['Action', 'Role-Playing'],
        developers: ['Square Enix'],
        price: 49,
        description: `KINGDOM HEARTS HD 1.5+2.5 ReMIX is an essential collection of the first six stories in the KINGDOM HEARTS series, a collaboration between Disney and SQUARE ENIX. Wield the legendary Keyblade and unlock the true power of friendship as you explore Disney worlds and defend them from darkness.`,
        rating: 9,
        url: 'url(/images/games/kingdomHearts.jpg)',
        isDefault: true 
    },
    {
        id: 3,
        name: 'EA SPORTS FC 25',
        genre: ['Sports'],
        developers: ['Electronic Arts'],
        price: 69,
        description: `EA Sports FC 25 is a football simulation video game published by EA Sports. It is the second installment in the EA Sports FC series and the 32nd overall installment of EA Sports' football simulation games.`,
        rating: 3,
        url: 'url(/images/games/fifa.jpg)',
        isDefault: true
    },
    {
        id: 4,
        name: 'God of War Ragnarök',
        genre: ['Action', 'Adventure', 'Role-playing', 'Fighting'],
        developers: ['Sony PlayStation Studios'],
        price: 59,
        description: `God of War Ragnarök is a 2022 action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. Loosely based on Norse mythology, the game is set in mythical ancient Scandinavia and features series protagonist, Kratos, and his now teenage son, Atreus. Concluding the Norse era of the series, the story follows Kratos and Atreus' efforts to prevent the nine realms from being destroyed by Ragnarök, the eschatological event which is central to Norse mythology and was foretold to happen in the previous game after Kratos killed the Aesir god Baldur.`,
        rating: 8,
        url: 'url(/images/games/godOfWar.jpg)',
        isDefault: true
    },
    {
        id: 5,
        name: 'Street Fighter 6',
        genre: ['Fighter'],
        developers: ['Capcom'],
        price: 39,
        description: `Street Fighter 6 is a 2023 fighting game developed and published by Capcom. It is the seventh main entry in the Street Fighter franchise, following Street Fighter V (2016), and was released worldwide on June 2, 2023.  It offers three overarching game modes and three control options. The game features a real-time commentary system, providing a tournament-style feel and the option to cheer on the player. The game continues the "2.5D" style introduced in Street Fighter IV. Street Fighter 6 received critical acclaim for its open world, control options, characters, gameplay, graphics and voice acting, though its story received some minor criticism.`,
        rating: 6,
        url: 'url(/images/games/streetFighter.jpg)',
        isDefault: true
    },
    {
        id: 6,
        name: 'NBA 2K26',
        genre: ['Sports'],
        developers: ['Take-Two Interactive'],
        price: 69,
        description: `NBA 2K26 is a 2025 basketball video game developed by Visual Concepts and published by 2K. Based on the National Basketball Association (NBA), it is the 27th installment in the NBA 2K series and is the successor to NBA 2K25 (2024).`,
        rating: 7,
        url: 'url(/images/games/nba.jpg)',
        isDefault: true
    },
    {
        id: 7,
        name: 'Sonic Rumble',
        genre: ['Platform', 'Racing'],
        developers: ['SEGA'],
        price: '0',
        description: `Sonic Rumble is an online party game in which numerous players compete against each other in various mini-games and challenges, with the goal of collecting the most rings. The game supports up to 32 players in the first round, with half of the players being eliminated afterwards. The second round features the remaining 16 players, and again, half of them are eliminated. The final round then consists of the remaining 8 players, who compete in a final round to determine the winner.`,
        rating: 6,
        url: 'url(/images/games/sonic.jpg)',
        isDefault: true 
    },
    {
        id: 8,
        name: 'Super Mario Bros.',
        genre: ['Platform', 'Action', 'Adventure'],
        developers: ['Nintendo'],
        price: 15,
        description: `Super Mario Bros. is a 1985 platform game developed and published by Nintendo for the Nintendo Entertainment System (NES). Directed and produced by Shigeru Miyamoto, it is the successor to the 1983 arcade game Mario Bros. and the first game in the Super Mario series. Players control Mario, or his brother Luigi in the multiplayer mode, to traverse the Mushroom Kingdom to rescue Princess Toadstool from King Koopa (later named Bowser). They traverse side-scrolling stages while avoiding hazards such as enemies and pits and collecting power-ups such as the Super Mushroom, Fire Flower and Starman.`,
        rating: 8,
        url: 'url(/images/games/superMario.jpg)',
        isDefault: true 
    },
    {
        id: 9,
        name: 'NASCAR 25',
        genre: ['Simulation', 'Racing'],
        developers: ['iRacing Studios'],
        price: 59,
        description: `NASCAR 25 is a sim racing game published and developed by iRacing Studios that was released on October 14, 2025, for PlayStation 5 and Xbox Series X/S. The game was released for Windows on November 11, 2025. In the career mode feature of the game players will begin in the ARCA Menards Series, working in their backyard garage and work themselves up through the top 3 series of NASCAR. Players will also be able to hire staff, and upgrade components of their car. The official gameplay trailer was released on September 18.`,
        rating: 3,
        url: 'url(/images/games/NASCAR.jpg)',
        isDefault: true 
    },
    {
        id: 10,
        name: 'Microsoft Flight Simulator 2024',
        genre: ['Simulation'],
        developers: ['Xbox Game Studios'],
        price: 69,
        description: `Microsoft Flight Simulator 2024 is a flight simulation video game developed by Asobo Studio and published by Xbox Game Studios. New mission types include aerial firefighting, air search and rescue, helicopter cargo hook transport, air ambulance, cropdusting, mountain rescue, skydiving, commercial aviation, aerial crane construction, outsize cargo transport with the Airbus Beluga, and more.`,
        rating: 6,
        url: 'url(/images/games/flight.jpg)',
        isDefault: true 
    },
    {
        id: 11,
        name: 'Cyberpunk 2077',
        genre: ['Action', 'Adventure', 'Role-playing', 'Fighting'],
        developers: ['CD Project Red'],
        price: 59,
        description: `Cyberpunk 2077 is a 2020 action role-playing game developed by CD Projekt Red and published by CD Projekt. Based on Mike Pondsmith's Cyberpunk tabletop game series, the plot is set in the fictional metropolis of Night City in California, within the dystopian Cyberpunk universe. The player assumes the role of V (voiced by Gavin Drea or Cherami Leigh depending on the player's choice of gender), a mercenary who gets reluctantly imbued with a cybernetic "bio-chip" containing an engram of legendary rockstar and terrorist Johnny Silverhand (voiced by Keanu Reeves). As Johnny's consciousness begins overwriting V's own, the two must work together to separate from each other and save V's life.`,
        rating: 8,
        url: 'url(/images/games/cyberpunk.jpg)',
        isDefault: true 
    },
    {
        id: 12,
        name: 'GTA 5',
        genre: ['Action', 'Adventure'],
        developers: ['Rockstar Games'],
        price: 29,
        description: `Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the seventh main entry in the Grand Theft Auto series, following 2008's Grand Theft Auto IV, and the fifteenth instalment overall. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa (Ned Luke), street gangster Franklin Clinton (Shawn Fonteno), and drug dealer and gunrunner Trevor Philips (Steven Ogg)—and their attempts to commit heists while under pressure from a corrupt government agency and powerful criminals. Players freely roam San Andreas's open world countryside and fictional city of Los Santos, based on Los Angeles.`,
        rating: 9,
        url: 'url(/images/games/gta.jpg)',
        isDefault: true 
    },
    {
        id: 13,
        name: 'Bloodborne',
        genre: ['Action', 'Adventure', 'Role-playing', 'Fighting', 'Survival Horror'],
        developers: ['FromSoftware Inc.' ],
        price: 19,
        description: `Bloodborne is a 2015 action role-playing game developed by FromSoftware and published by Sony Computer Entertainment for the PlayStation 4. The game follows a Hunter through the decrepit Gothic, Victorian-era inspired city of Yharnam, whose inhabitants are afflicted with a blood-borne disease which transforms the residents into horrific beasts. Attempting to find the source of the plague, the player's character unravels the city's mysteries while fighting a variety of enemies.`,
        rating: 9,
        url: 'url(/images/games/bloodborn.jpg)',
        isDefault: true 
    },
    {
        id: 14,
        name: 'Portal',
        genre: ['Puzzle', 'Platform'],
        developers: ['Valve Corporation'],
        price: 9,
        description: `Portal is a 2007 puzzle-platform game developed and published by Valve. Portal consists primarily of a series of puzzles that must be solved by teleporting the player's character and simple objects using the "Aperture Science Handheld Portal Device", also referred to as the "portal gun", a device that can create intra-dimensional portals between two flat planes. The player-character, Chell, is challenged and taunted by an artificial intelligence construct named GLaDOS (Genetic Lifeform and Disk Operating System) to complete each puzzle in the Aperture Science Enrichment Center using the portal gun with the promise of receiving cake when all the puzzles are completed. The Source Engine's physics system allows kinetic energy to be retained through portals, requiring creative use of portals to maneuver through the test chambers.`,
        rating: 9,
        url: 'url(/images/games/portal.jpg)',
        isDefault: true 
    },
    {
        id: 15,
        name: 'Factorio',
        genre: ['Puzzle', 'Indie', 'Strategy'],
        developers: ['Wube Software'],
        price: '35.00',
        description: `Factorio is a construction and management simulation game developed and published by Czech studio Wube Software. The game follows an engineer who crash-lands on an alien planet and must harvest resources and create automated industry to build a rocket; players can continue the game after achieving the end goal. There are both single-player and multiplayer modes, as well as eight additional game scenarios. The game was announced via a crowdfunding campaign on Indiegogo in 2013 and released for Windows, macOS, and Linux on 14 August 2020 following an early access phase, which was made available on 25 February 2016. A major paid expansion called Space Age was released on 21 October 2024, adding 4 new planets and extending the game past the rocket launch.`,
        rating: 10,
        url: 'url(/images/games/factorio.jpg)',
        isDefault: true 
    },
    {
        id: 16,
        name: 'League of Legends',
        genre: ['MOBA', 'Strategy', 'Role-playing'],
        developers: ['Riot Games'],
        price: '0',
        description: `League of Legends (LoL), commonly referred to as League, is a multiplayer online battle arena video game developed and published by Riot Games. Inspired by Defense of the Ancients, a custom map for Warcraft III, Riot's founders sought to develop a stand-alone game in the same genre. In the game's main mode, Summoner's Rift, two teams of five players battle in player-versus-player combat. Each player controls a character, known as a "champion", with unique abilities and styles of play. During a match, champions become more powerful by collecting experience points, earning gold, and purchasing items to defeat the opposing team. Teams defend their base and win by pushing toward the enemy base and destroying a large structure within it, the "Nexus".`,
        rating: 5,
        url: 'url(/images/games/lol.jpg)',
        isDefault: true 
    },
    {
        id: 17,
        name: 'Deadlock',
        genre: ['MOBA', 'Strategy', 'Role-playing'],
        developers: ['Valve Corporation'],
        price: '0',
        description: `Deadlock is an upcoming third-person shooter and multiplayer online battle arena (MOBA) game developed and published by Valve. Initially known as Neon Prime, Deadlock was first leaked to the public in May 2024 while its Steam page was published in August. It has since remained an invite-only game, reaching a concurrent player count of over 160,000 in September 2024. The game features two teams with six players who battle each other. In each match, the twelve players control characters who split across three lanes in a large map. To win, one team has to advance their "troopers", a category of non-player characters (NPCs) who fight alongside players, towards the enemy "patron", a floating orb entity, by defeating the other's team troopers and players who respawn in waves. Before defeating the patron, a team has to take down "guardians" and "walkers", entities which are located on the lanes and protect the patron. Its style of gameplay has been described as a mix of Overwatch, Dota 2, and Team Fortress 2.`,
        rating: null,
        url: 'url(/images/games/deadlock.jpg)',
        isDefault: true
    },
    {
        id: 18,
        name: 'Undertale',
        genre: ['Indie', 'Role-playing'],
        developers: ['Toby Fox'],
        price: 9,
        description: `Undertale is a 2015 role-playing video game created by American indie developer Toby Fox. The player controls a child who has fallen into the Underground: a large, secluded region under the surface of the Earth, separated by a magical barrier. The player meets various monsters during the journey back to the surface, some of which may engage in combat. The combat system involves the player navigating through mini–bullet hell attacks by the opponent. They can opt to appease monsters in order to spare them instead of killing them. These choices affect the game, with the dialogue, characters, and story changing based on outcomes.`,
        rating: 10,
        url: 'url(/images/games/undertale.jpg)',
        isDefault: true 
    },
    {
        id: 19,
        name: 'Stray',
        genre: ['Indie', 'Adventure'],
        developers: ['BlueTwelve Studio'],
        price: 17,
        description: `Stray is a 2022 adventure game developed by BlueTwelve Studio and published by Annapurna Interactive. The story follows a stray cat who falls into a walled city populated by robots, machines, and mutant bacteria; the cat sets out to return to the surface with the help of a drone companion, B-12. The game is presented through a third-person perspective. The player traverses the game world by leaping across platforms and climbing up obstacles, and can interact with the environment to open new paths. Using B-12, they can store items found throughout the world and hack technology to solve puzzles. Throughout the game, the player must evade the antagonistic Zurks and Sentinels, which attempt to kill them.`,
        rating: 10,
        url: 'url(/images/games/stray.jpg)',
        isDefault: true
    },
    {
        id: 20,
        name: 'Arknights',
        genre: ['Strategy', 'Live Service', 'Puzzle'],
        developers: ['Hypergryph'],
        price: '0',
        description: `Arknights is a free-to-play tactical RPG/tower defense mobile game developed by Hypergryph. The core gameplay is that of a tower defense game, with a number of characters ("operators") as towers. Because there is often a limited number of viable solutions, especially at high difficulties, Arknights has also been described as a puzzle game. As the player progresses through the game, they unlock more stages, operators and resources, and are also introduced to new types of enemies and gameplay mechanics. The game also has a base-building aspect, which allows players to construct facilities and assign operators to them. It features the usual array of free-to-play, gacha game mechanics, such as daily login rewards and randomized character acquisition through virtual currency which can be obtained by playing the game, through limited-time events, or optional in-app purchases using real currency. Arknights players have created a number of internet resources and tools to assist in the effort of aquiring limited resources by farming.`,
        rating: 7,
        url: 'url(/images/games/arknights.png)',
        isDefault: true 
    },
    {
        id: 21,
        name: 'Anno 1800',
        genre: ['Strategy', 'Simulation'],
        developers: ['Ubisoft'],
        price: 59,
        description: `Anno 1800 is a city-building real-time strategy video game, developed by Ubisoft Blue Byte and published by Ubisoft, and launched on April 16, 2019. It is the seventh game in the Anno series, and returns to the use of a historical setting, following the previous futuristic titles Anno 2070 and Anno 2205, taking place during the Industrial Revolution in the 19th century. Following the previous installment, the game returns to the series' traditional city-building and ocean combat mechanics, but introduces new aspects of gameplay, such as tourism, blueprinting, and the effects of industrialisation influences on island inhabitants.`,
        rating: 3,
        url: 'url(/images/games/anno.jpg)',
        isDefault: true 
    },
    {
        id: 22,
        name: 'Fortnite',
        genre: ['Live Service'],
        developers: ['Epic Games'],
        price: '0',
        description: `Fortnite is a 2017 online video game and game platform developed and released by Epic Games. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas, and more.`,
        rating: 2,
        url: 'url(/images/games/fortnite.jpg)',
        isDefault: true 
    },
    {
        id: 23,
        name: 'Warframe',
        genre: ['Live Service'],
        developers: ['Digital Extremes'],
        price: '0',
        description: `Warframe is a free-to-play action role-playing third-person shooter multiplayer online game developed and published by Digital Extremes. In Warframe, players control members of the Tenno, a caste of ancient warriors who have awoken from centuries of suspended animation far into Earth's future to find themselves at war with different factions in the Origin System.`,
        rating: 10,
        url: 'url(/images/games/warframe.jpg)',
        isDefault: true 
    },
    {
        id: 24,
        name: 'Cronos: The New Dawn',
        genre: ['Survival Horror', 'Puzzle', 'Action', 'Adventure'],
        developers: ['Bloober Team'],
        price: 59,
        description: `Cronos: The New Dawn is a 2025 survival horror game developed and published by Bloober WTeam. Cronos: The New Dawn is a survival horror game played from a third-person perspective. The player character, the Traveler, can use both melee abilities and a variety of firearms such as pistols and shotguns to defeat enemies. If defeated enemies are not properly disposed by using fire, a surviving enemy can merge with the undead corpses, absorbing their abilities and becoming more powerful in the process.`,
        rating: 8,
        url: 'url(/images/games/cronos.png)',
        isDefault: true 
    },
];

module.exports = {
    navLinks,
    alphaErr,
    lengthErr,
    gamesInStoreArray,
    genresListArray,
    devsListArray
};