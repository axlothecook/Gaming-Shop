// VARIABLES
const alphaErr = 'containts one or more forbidden character(s)';
const lengthErr = 'must be between';

// ARRAYS
const navLinks = [
    { 
        id: 0,
        href: '/',
        text: 'Home'
    },
    {
        id: 1,
        href: '/games',
        text: 'Games',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg1.jpg)',
        txtClr: '#000'
    },
    {
        id: 2,
        href: '/genres',
        text: 'Genres',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg3.jpg)',
        txtClr: '#fff'
    },
    {
        id: 3,
        href: '/developers',
        text: 'Developers',
        imgPath: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/basic-page-files/bg2.jpg)',
        txtClr: '#fff'
    }
];

const alphabetArray = [
    {
        id: 0,
        name: 'A'
    },
    {
        id: 1,
        name: 'B'
    },
    {
        id: 2,
        name: 'C'
    },
    {
        id: 3,
        name: 'D'
    },
    {
        id: 4,
        name: 'E'
    },
    {
        id: 5,
        name: 'F'
    },
    {
        id: 6,
        name: 'G'
    },
    {
        id: 7,
        name: 'H'
    },
    {
        id: 8,
        name: 'I'
    },
    {
        id: 9,
        name: 'J'
    },
    {
        id: 10,
        name: 'K'
    },
    {
        id: 11,
        name: 'L'
    },
    {
        id: 12,
        name: 'L'
    },
    {
        id: 13,
        name: 'M'
    },
    {
        id: 14,
        name: 'N'
    },
    {
        id: 15,
        name: 'O'
    },
    {
        id: 16,
        name: 'P'
    },
    {
        id: 17,
        name: 'Q'
    },
    {
        id: 18,
        name: 'R'
    },
    {
        id: 19,
        name: 'S'
    },
    {
        id: 20,
        name: 'T'
    },
    {
        id: 21,
        name: 'U'
    },
    {
        id: 22,
        name: 'V'
    },
    {
        id: 23,
        name: 'W'
    },
    {
        id: 24,
        name: 'X'
    },
    {
        id: 25,
        name: 'Y'
    },
    {
        id: 26,
        name: 'Z'
    },
];

const priceArray = [
    {
        id: 0,
        name: 'Price',
        value: 'null'
    },
    {
        id: 1,
        name: 'Price',
        value: '0 - 9'
    },
    {
        id: 2,
        name: 'Price',
        value: '10 - 19'
    },
    {
        id: 3,
        name: 'Price',
        value: '20 - 29'
    },
    {
        id: 4,
        name: 'Price',
        value: '30 - 39'
    },
    {
        id: 5,
        name: 'Price',
        value: '40 - 49'
    },
    {
        id: 6,
        name: 'Price',
        value: '50 - 59'
    },
    {
        id: 7,
        name: 'Price',
        value: '60 - 69'
    },
    {
        id: 8,
        name: 'Price',
        value: '70 - 79'
    },
    {
        id: 9,
        name: 'Price',
        value: '80 - 89'
    },
    {
        id: 10,
        name: 'Price',
        value: '90 - 99'
    },
];

const ratingArray = [
    {
        id: 0,
        name: 'null'
    },
    {
        id: 1,
        name: '0'
    },
    {
        id: 2,
        name: '1'
    },
    {
        id: 3,
        name: '2'
    },
    {
        id: 4,
        name: '3'
    },
    {
        id: 5,
        name: '4'
    },
    {
        id: 6,
        name: '5'
    },
    {
        id: 7,
        name: '6'
    },
    {
        id: 8,
        name: '7'
    },
    {
        id: 9,
        name: '8'
    },
    {
        id: 10,
        name: '9'
    },
    {
        id: 11,
        name: '10'
    },
];

const genreArr = [
    {
        name: 'Action',
        numberOfGames: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/action.jpg)',
        isDefault: true
    },
    {
        name: 'Adventure',
        numberOfGames: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/adventure.jpg)',
        isDefault: true
    },
    {
        name: 'Fighting',
        numberOfGames: 4,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/fighting.jpg)',
        isDefault: true
    },
    {
        name: 'Horror',
        numberOfGames: 2,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/horror.jpg)',
        isDefault: true
    },
    {
        name: 'Indie',
        numberOfGames: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/indie.jpg)',
        isDefault: true
    },
    {
        name: 'Live Service',
        numberOfGames: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/liveService.jpg)',
        isDefault: true
    },
    {
        name: 'MOBA',
        numberOfGames: 2,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/moba.jpg)',
        isDefault: true
    },
    {
        name: 'Platform',
        numberOfGames: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/platform.jpg)',
        isDefault: true
    },
    {
        name: 'Puzzle',
        numberOfGames: 4,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/puzzle.jpg)',
        isDefault: true
    },
    {
        name: 'Racing',
        numberOfGames: 2,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/racing.png)',
        isDefault: true
    },
    {
        name: 'Role-Playing',
        numberOfGames: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/rpg.jpg)',
        isDefault: true
    },
    {
        name: 'Simulation',
        numberOfGames: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/simulator.jpg)',
        isDefault: true
    },
    {
        name: 'Sports',
        numberOfGames: 2,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/sports.jpg)',
        isDefault: true
    },
    {
        name: 'Strategy',
        numberOfGames: 6,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/genres-default-photos/strategy.jpg)',
        isDefault: true
    },
];

const devArr = [
    {
        name: 'Electronic Arts',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/ea.jpg)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Square Enix',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/square.jpg)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Sony PlayStation Studios',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/sony.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Kojima Productions',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/kojima.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Capcom',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/capcom.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Take-Two Interactive',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/takeTwo.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'SEGA',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/sega.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Nintendo',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/Nintendo.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'iRacing Studios',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/iracing.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Xbox Game Studios',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/xbox.jpg)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'CD Project Red',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/cd.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Rockstar Games',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/rockstar.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'FromSoftware Inc.',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/fromsoftware.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Valve Corporation',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/valve.jpg)',
        numberOfGames: 2,
        isDefault: true
    },
    {
        name: 'Wube Software',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/wube.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Riot Games',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/riot.jpg)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'BlueTwelve Studio',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/bluetwelve.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Hypergryph',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/hypergryph.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Ubisoft',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/ubisoft.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Epic Games',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/epic.png)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Digital Extremes',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/digitalExtremes.jpg)',
        numberOfGames: 1,
        isDefault: true
    },
    {
        name: 'Bloober Team',
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/devs-default-photos/bloober.png)',
        numberOfGames: 1,
        isDefault: true
    }
];

const gamesArr = [
    {
        name: 'Death Stranding 2: On the Beach',
        genres: ['Action', 'Adventure', 'Fighting', 'Role-Playing', 'Strategy'],
        developers: ['Kojima Productions'],
        price: 69,
        description: `The player controls Sam Porter Bridges, a freelance porter, as he and his companions set out on an expedition across the Australian continent to connect isolated survivors and colonies to the wireless communications "chiral" network in order to save humanity from extinction.`,
        rating: 9,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/deathStranding.jpg)',
        isDefault: true
    },
    {
        name: 'Kingdom Hearts HD 1.5 + 2.5 ReMIX',
        genres: ['Action', 'Role-Playing'],
        developers: ['Square Enix'],
        price: 49,
        description: `KINGDOM HEARTS HD 1.5+2.5 ReMIX is an essential collection of the first six stories in the KINGDOM HEARTS series, a collaboration between Disney and SQUARE ENIX. Wield the legendary Keyblade and unlock the true power of friendship as you explore Disney worlds and defend them from darkness.`,
        rating: 9,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/kingdomHearts.jpg)',
        isDefault: true 
    },
    {
        name: 'EA SPORTS FC 25',
        genres: ['Sports'],
        developers: ['Electronic Arts'],
        price: 69,
        description: `EA Sports FC 25 is a football simulation video game published by EA Sports. It is the second installment in the EA Sports FC series and the 32nd overall installment of EA Sports' football simulation games.`,
        rating: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/fifa.jpg)',
        isDefault: true
    },
    {
        name: 'God of War Ragnarök',
        genres: ['Action', 'Adventure', 'Role-playing', 'Fighting'],
        developers: ['Sony PlayStation Studios'],
        price: 59,
        description: `God of War Ragnarök is a 2022 action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. Loosely based on Norse mythology, the game is set in mythical ancient Scandinavia and features series protagonist, Kratos, and his now teenage son, Atreus. Concluding the Norse era of the series, the story follows Kratos and Atreus' efforts to prevent the nine realms from being destroyed by Ragnarök, the eschatological event which is central to Norse mythology and was foretold to happen in the previous game after Kratos killed the Aesir god Baldur.`,
        rating: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/godOfWar.jpg)',
        isDefault: true
    },
    {
        name: 'Street Fighter 6',
        genres: ['Fighter'],
        developers: ['Capcom'],
        price: 39,
        description: `Street Fighter 6 is a 2023 fighting game developed and published by Capcom. It is the seventh main entry in the Street Fighter franchise, following Street Fighter V (2016), and was released worldwide on June 2, 2023.  It offers three overarching game modes and three control options. The game features a real-time commentary system, providing a tournament-style feel and the option to cheer on the player. The game continues the "2.5D" style introduced in Street Fighter IV. Street Fighter 6 received critical acclaim for its open world, control options, characters, gameplay, graphics and voice acting, though its story received some minor criticism.`,
        rating: 6,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/streetFighter.jpg)',
        isDefault: true
    },
    {
        name: 'NBA 2K26',
        genres: ['Sports'],
        developers: ['Take-Two Interactive'],
        price: 69,
        description: `NBA 2K26 is a 2025 basketball video game developed by Visual Concepts and published by 2K. Based on the National Basketball Association (NBA), it is the 27th installment in the NBA 2K series and is the successor to NBA 2K25 (2024).`,
        rating: 7,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/nba.jpg)',
        isDefault: true
    },
    {
        name: 'Sonic Rumble',
        genres: ['Platform', 'Racing'],
        developers: ['SEGA'],
        price: 0,
        description: `Sonic Rumble is an online party game in which numerous players compete against each other in various mini-games and challenges, with the goal of collecting the most rings. The game supports up to 32 players in the first round, with half of the players being eliminated afterwards. The second round features the remaining 16 players, and again, half of them are eliminated. The final round then consists of the remaining 8 players, who compete in a final round to determine the winner.`,
        rating: 6,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/sonic.jpg)',
        isDefault: true 
    },
    {
        name: 'Super Mario Bros.',
        genres: ['Platform', 'Action', 'Adventure'],
        developers: ['Nintendo'],
        price: 15,
        description: `Super Mario Bros. is a 1985 platform game developed and published by Nintendo for the Nintendo Entertainment System (NES). Directed and produced by Shigeru Miyamoto, it is the successor to the 1983 arcade game Mario Bros. and the first game in the Super Mario series. Players control Mario, or his brother Luigi in the multiplayer mode, to traverse the Mushroom Kingdom to rescue Princess Toadstool from King Koopa (later named Bowser). They traverse side-scrolling stages while avoiding hazards such as enemies and pits and collecting power-ups such as the Super Mushroom, Fire Flower and Starman.`,
        rating: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/superMario.jpg)',
        isDefault: true 
    },
    {
        name: 'NASCAR 25',
        genres: ['Simulation', 'Racing'],
        developers: ['iRacing Studios'],
        price: 59,
        description: `NASCAR 25 is a sim racing game published and developed by iRacing Studios that was released on October 14, 2025, for PlayStation 5 and Xbox Series X/S. The game was released for Windows on November 11, 2025. In the career mode feature of the game players will begin in the ARCA Menards Series, working in their backyard garage and work themselves up through the top 3 series of NASCAR. Players will also be able to hire staff, and upgrade components of their car. The official gameplay trailer was released on September 18.`,
        rating: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/NASCAR.jpg)',
        isDefault: true 
    },
    {
        name: 'Microsoft Flight Simulator 2024',
        genres: ['Simulation'],
        developers: ['Xbox Game Studios'],
        price: 69,
        description: `Microsoft Flight Simulator 2024 is a flight simulation video game developed by Asobo Studio and published by Xbox Game Studios. New mission types include aerial firefighting, air search and rescue, helicopter cargo hook transport, air ambulance, cropdusting, mountain rescue, skydiving, commercial aviation, aerial crane construction, outsize cargo transport with the Airbus Beluga, and more.`,
        rating: 6,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/flight.jpg)',
        isDefault: true 
    },
    {
        name: 'Cyberpunk 2077',
        genres: ['Action', 'Adventure', 'Role-playing', 'Fighting'],
        developers: ['CD Project Red'],
        price: 59,
        description: `Cyberpunk 2077 is a 2020 action role-playing game developed by CD Projekt Red and published by CD Projekt. Based on Mike Pondsmith's Cyberpunk tabletop game series, the plot is set in the fictional metropolis of Night City in California, within the dystopian Cyberpunk universe. The player assumes the role of V (voiced by Gavin Drea or Cherami Leigh depending on the player's choice of gender), a mercenary who gets reluctantly imbued with a cybernetic "bio-chip" containing an engram of legendary rockstar and terrorist Johnny Silverhand (voiced by Keanu Reeves). As Johnny's consciousness begins overwriting V's own, the two must work together to separate from each other and save V's life.`,
        rating: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/cyberpunk.jpg)',
        isDefault: true 
    },
    {
        name: 'GTA 5',
        genres: ['Action', 'Adventure'],
        developers: ['Rockstar Games'],
        price: 29,
        description: `Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the seventh main entry in the Grand Theft Auto series, following 2008's Grand Theft Auto IV, and the fifteenth instalment overall. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three protagonists—retired bank robber Michael De Santa (Ned Luke), street gangster Franklin Clinton (Shawn Fonteno), and drug dealer and gunrunner Trevor Philips (Steven Ogg)—and their attempts to commit heists while under pressure from a corrupt government agency and powerful criminals. Players freely roam San Andreas's open world countryside and fictional city of Los Santos, based on Los Angeles.`,
        rating: 9,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/gta.jpg)',
        isDefault: true 
    },
    {
        name: 'Bloodborne',
        genres: ['Action', 'Adventure', 'Role-playing', 'Fighting', 'Horror'],
        developers: ['FromSoftware Inc.' ],
        price: 19,
        description: `Bloodborne is a 2015 action role-playing game developed by FromSoftware and published by Sony Computer Entertainment for the PlayStation 4. The game follows a Hunter through the decrepit Gothic, Victorian-era inspired city of Yharnam, whose inhabitants are afflicted with a blood-borne disease which transforms the residents into horrific beasts. Attempting to find the source of the plague, the player's character unravels the city's mysteries while fighting a variety of enemies.`,
        rating: 9,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/bloodborn.jpg)',
        isDefault: true 
    },
    {
        name: 'Portal',
        genres: ['Puzzle', 'Platform'],
        developers: ['Valve Corporation'],
        price: 9,
        description: `Portal is a 2007 puzzle-platform game developed and published by Valve. Portal consists primarily of a series of puzzles that must be solved by teleporting the player's character and simple objects using the "Aperture Science Handheld Portal Device", also referred to as the "portal gun", a device that can create intra-dimensional portals between two flat planes. The player-character, Chell, is challenged and taunted by an artificial intelligence construct named GLaDOS (Genetic Lifeform and Disk Operating System) to complete each puzzle in the Aperture Science Enrichment Center using the portal gun with the promise of receiving cake when all the puzzles are completed. The Source Engine's physics system allows kinetic energy to be retained through portals, requiring creative use of portals to maneuver through the test chambers.`,
        rating: 9,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/portal.jpg)',
        isDefault: true 
    },
    {
        name: 'Factorio',
        genres: ['Puzzle', 'Indie', 'Strategy'],
        developers: ['Wube Software'],
        price: 35,
        description: `Factorio is a construction and management simulation game developed and published by Czech studio Wube Software. The game follows an engineer who crash-lands on an alien planet and must harvest resources and create automated industry to build a rocket; players can continue the game after achieving the end goal. There are both single-player and multiplayer modes, as well as eight additional game scenarios. The game was announced via a crowdfunding campaign on Indiegogo in 2013 and released for Windows, macOS, and Linux on 14 August 2020 following an early access phase, which was made available on 25 February 2016. A major paid expansion called Space Age was released on 21 October 2024, adding 4 new planets and extending the game past the rocket launch.`,
        rating: 10,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/factorio.jpg)',
        isDefault: true 
    },
    {
        name: 'League of Legends',
        genres: ['MOBA', 'Strategy', 'Role-playing'],
        developers: ['Riot Games'],
        price: 0,
        description: `League of Legends (LoL), commonly referred to as League, is a multiplayer online battle arena video game developed and published by Riot Games. Inspired by Defense of the Ancients, a custom map for Warcraft III, Riot's founders sought to develop a stand-alone game in the same genre. In the game's main mode, Summoner's Rift, two teams of five players battle in player-versus-player combat. Each player controls a character, known as a "champion", with unique abilities and styles of play. During a match, champions become more powerful by collecting experience points, earning gold, and purchasing items to defeat the opposing team. Teams defend their base and win by pushing toward the enemy base and destroying a large structure within it, the "Nexus".`,
        rating: 5,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/lol.jpg)',
        isDefault: true 
    },
    {
        name: 'Deadlock',
        genres: ['MOBA', 'Strategy', 'Role-playing'],
        developers: ['Valve Corporation'],
        price: NaN,
        description: `Deadlock is an upcoming third-person shooter and multiplayer online battle arena (MOBA) game developed and published by Valve. Initially known as Neon Prime, Deadlock was first leaked to the public in May 2024 while its Steam page was published in August. It has since remained an invite-only game, reaching a concurrent player count of over 160,000 in September 2024. The game features two teams with six players who battle each other. In each match, the twelve players control characters who split across three lanes in a large map. To win, one team has to advance their "troopers", a category of non-player characters (NPCs) who fight alongside players, towards the enemy "patron", a floating orb entity, by defeating the other's team troopers and players who respawn in waves. Before defeating the patron, a team has to take down "guardians" and "walkers", entities which are located on the lanes and protect the patron. Its style of gameplay has been described as a mix of Overwatch, Dota 2, and Team Fortress 2.`,
        rating: NaN,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/deadlock.jpg)',
        isDefault: true
    },
    {
        name: 'Undertale',
        genres: ['Indie', 'Role-playing'],
        developers: ['Toby Fox'],
        price: 9,
        description: `Undertale is a 2015 role-playing video game created by American indie developer Toby Fox. The player controls a child who has fallen into the Underground: a large, secluded region under the surface of the Earth, separated by a magical barrier. The player meets various monsters during the journey back to the surface, some of which may engage in combat. The combat system involves the player navigating through mini–bullet hell attacks by the opponent. They can opt to appease monsters in order to spare them instead of killing them. These choices affect the game, with the dialogue, characters, and story changing based on outcomes.`,
        rating: 10,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/undertale.jpg)',
        isDefault: true 
    },
    {
        name: 'Stray',
        genres: ['Indie', 'Adventure'],
        developers: ['BlueTwelve Studio'],
        price: 17,
        description: `Stray is a 2022 adventure game developed by BlueTwelve Studio and published by Annapurna Interactive. The story follows a stray cat who falls into a walled city populated by robots, machines, and mutant bacteria; the cat sets out to return to the surface with the help of a drone companion, B-12. The game is presented through a third-person perspective. The player traverses the game world by leaping across platforms and climbing up obstacles, and can interact with the environment to open new paths. Using B-12, they can store items found throughout the world and hack technology to solve puzzles. Throughout the game, the player must evade the antagonistic Zurks and Sentinels, which attempt to kill them.`,
        rating: 10,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/stray.jpg)',
        isDefault: true
    },
    {
        name: 'Arknights',
        genres: ['Strategy', 'Live Service', 'Puzzle'],
        developers: ['Hypergryph'],
        price: 0,
        description: `Arknights is a free-to-play tactical RPG/tower defense mobile game developed by Hypergryph. The core gameplay is that of a tower defense game, with a number of characters ("operators") as towers. Because there is often a limited number of viable solutions, especially at high difficulties, Arknights has also been described as a puzzle game. As the player progresses through the game, they unlock more stages, operators and resources, and are also introduced to new types of enemies and gameplay mechanics. The game also has a base-building aspect, which allows players to construct facilities and assign operators to them. It features the usual array of free-to-play, gacha game mechanics, such as daily login rewards and randomized character acquisition through virtual currency which can be obtained by playing the game, through limited-time events, or optional in-app purchases using real currency. Arknights players have created a number of internet resources and tools to assist in the effort of aquiring limited resources by farming.`,
        rating: 7,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/arknights.png)',
        isDefault: true 
    },
    {
        name: 'Anno 1800',
        genres: ['Strategy', 'Simulation'],
        developers: ['Ubisoft'],
        price: 59,
        description: `Anno 1800 is a city-building real-time strategy video game, developed by Ubisoft Blue Byte and published by Ubisoft, and launched on April 16, 2019. It is the seventh game in the Anno series, and returns to the use of a historical setting, following the previous futuristic titles Anno 2070 and Anno 2205, taking place during the Industrial Revolution in the 19th century. Following the previous installment, the game returns to the series' traditional city-building and ocean combat mechanics, but introduces new aspects of gameplay, such as tourism, blueprinting, and the effects of industrialisation influences on island inhabitants.`,
        rating: 3,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/anno.jpg)',
        isDefault: true 
    },
    {
        name: 'Fortnite',
        genres: ['Live Service'],
        developers: ['Epic Games'],
        price: 0,
        description: `Fortnite is a 2017 online video game and game platform developed and released by Epic Games. It is available in seven distinct game mode versions that otherwise share the same general gameplay and game engine: Fortnite Battle Royale, a battle royale game in which up to 100 players fight to be the last person standing; Fortnite: Save the World, a cooperative hybrid tower defense-shooter and survival game in which up to four players fight off zombie-like creatures and defend objects with traps and fortifications they can build; Fortnite Creative, in which players are given complete freedom to create worlds and battle arenas, and more.`,
        rating: 2,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/fortnite.jpg)',
        isDefault: true 
    },
    {
        name: 'Warframe',
        genres: ['Live Service'],
        developers: ['Digital Extremes'],
        price: 0,
        description: `Warframe is a free-to-play action role-playing third-person shooter multiplayer online game developed and published by Digital Extremes. In Warframe, players control members of the Tenno, a caste of ancient warriors who have awoken from centuries of suspended animation far into Earth's future to find themselves at war with different factions in the Origin System.`,
        rating: 10,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/warframe.jpg)',
        isDefault: true 
    },
    {
        name: 'Cronos: The New Dawn',
        genres: ['Horror', 'Puzzle', 'Action', 'Adventure'],
        developers: ['Bloober Team'],
        price: 59,
        description: `Cronos: The New Dawn is a 2025 survival horror game developed and published by Bloober WTeam. Cronos: The New Dawn is a survival horror game played from a third-person perspective. The player character, the Traveler, can use both melee abilities and a variety of firearms such as pistols and shotguns to defeat enemies. If defeated enemies are not properly disposed by using fire, a surviving enemy can merge with the undead corpses, absorbing their abilities and becoming more powerful in the process.`,
        rating: 8,
        url: 'url(https://qyuaermixhugwrlhhvkr.supabase.co/storage/v1/object/public/games-default-photos/cronos.png)',
        isDefault: true 
    },
];

module.exports = {
    alphabetArray,
    priceArray,
    ratingArray,
    navLinks,
    alphaErr,
    lengthErr
};