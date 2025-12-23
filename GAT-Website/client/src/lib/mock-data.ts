import { 
  type Player, 
  type ActivitySnapshot, 
  type ActivityEvent, 
  type MythicRun, 
  type RaidParse,
  type HeatmapData,
  type DashboardStats,
  WOW_CLASSES,
  GUILD_RANKS
} from "@shared/schema";

function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function randomFromArray<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number = 30): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

const PLAYER_NAMES = [
  "Thrallor", "Sylvannas", "Arthasdk", "Jainamage", "Illiadhan",
  "Garroshx", "Tyrande", "Malfurionx", "Voljinh", "Cairnebull",
  "Anduinpriest", "Greymane", "Lorthemar", "Talandraa", "Khadgarx",
  "Medivhx", "Gulldanx", "Chromie", "Alexstrasza", "Ysera",
  "Nozdormu", "Deathwingx", "Ragnarosx", "Cenariusx", "Maievshad"
];

const REALMS = ["Area-52", "Illidan", "Stormrage", "Tichondrius", "Mal'Ganis"];

const SPECS: Record<string, string[]> = {
  "Death Knight": ["Blood", "Frost", "Unholy"],
  "Demon Hunter": ["Havoc", "Vengeance"],
  "Druid": ["Balance", "Feral", "Guardian", "Restoration"],
  "Evoker": ["Devastation", "Preservation", "Augmentation"],
  "Hunter": ["Beast Mastery", "Marksmanship", "Survival"],
  "Mage": ["Arcane", "Fire", "Frost"],
  "Monk": ["Brewmaster", "Mistweaver", "Windwalker"],
  "Paladin": ["Holy", "Protection", "Retribution"],
  "Priest": ["Discipline", "Holy", "Shadow"],
  "Rogue": ["Assassination", "Outlaw", "Subtlety"],
  "Shaman": ["Elemental", "Enhancement", "Restoration"],
  "Warlock": ["Affliction", "Demonology", "Destruction"],
  "Warrior": ["Arms", "Fury", "Protection"]
};

const RACES = [
  "Human", "Dwarf", "Night Elf", "Gnome", "Draenei", "Worgen", "Pandaren",
  "Orc", "Undead", "Tauren", "Troll", "Blood Elf", "Goblin", "Nightborne",
  "Void Elf", "Lightforged Draenei", "Highmountain Tauren", "Mag'har Orc",
  "Dark Iron Dwarf", "Zandalari Troll", "Kul Tiran", "Vulpera", "Mechagnome",
  "Dracthyr", "Earthen"
];

const DUNGEONS = [
  "The Stonevault", "The Dawnbreaker", "Ara-Kara", "City of Threads",
  "Mists of Tirna Scithe", "The Necrotic Wake", "Siege of Boralus", "Grim Batol"
];

const BOSSES = [
  "Ulgrax the Devourer", "The Bloodbound Horror", "Sikran",
  "Rasha'nan", "Broodtwister Ovi'nax", "Nexus-Princess Ky'veza",
  "The Silken Court", "Queen Ansurek"
];

export function generateMockPlayers(count: number = 25): Player[] {
  return PLAYER_NAMES.slice(0, count).map((name, index) => {
    const wowClass = randomFromArray(WOW_CLASSES);
    const specs = SPECS[wowClass] || [];
    const isOnline = Math.random() > 0.7;
    
    return {
      id: randomId(),
      name,
      realm: randomFromArray(REALMS),
      class: wowClass,
      spec: randomFromArray(specs),
      race: randomFromArray(RACES),
      level: 80,
      itemLevel: 580 + Math.floor(Math.random() * 40),
      mythicScore: 1500 + Math.floor(Math.random() * 2000),
      guildRank: index === 0 ? "Guild Master" : index < 3 ? "Officer" : randomFromArray(GUILD_RANKS.slice(2)),
      isActive: Math.random() > 0.1,
      isOnline,
      lastSeen: isOnline ? new Date().toISOString() : randomDate(7),
      joinDate: randomDate(365),
      weeklyActivity: Math.floor(Math.random() * 40),
      messagesCount: Math.floor(Math.random() * 500),
    };
  });
}

export function generateMockHeatmap(): HeatmapData {
  const data: HeatmapData = [];
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      let baseValue = 0;
      
      if (hour >= 19 && hour <= 23) {
        baseValue = 10 + Math.floor(Math.random() * 15);
      } else if (hour >= 14 && hour < 19) {
        baseValue = 5 + Math.floor(Math.random() * 10);
      } else if (hour >= 10 && hour < 14) {
        baseValue = 2 + Math.floor(Math.random() * 5);
      } else {
        baseValue = Math.floor(Math.random() * 3);
      }
      
      if (day >= 4) {
        baseValue = Math.floor(baseValue * 1.3);
      }
      
      if (day === 1 || day === 3) {
        if (hour >= 20 && hour <= 23) {
          baseValue = Math.floor(baseValue * 1.5);
        }
      }
      
      data.push({ day, hour, value: baseValue });
    }
  }
  
  return data;
}

export function generateMockActivityEvents(players: Player[]): ActivityEvent[] {
  const eventTypes: ActivityEvent["type"][] = [
    "mythic_run", "raid_kill", "achievement", "io_milestone", "login"
  ];
  
  const events: ActivityEvent[] = [];
  
  for (let i = 0; i < 15; i++) {
    const player = randomFromArray(players);
    const type = randomFromArray(eventTypes);
    
    let title = "";
    let description = "";
    let value: number | undefined;
    
    switch (type) {
      case "mythic_run":
        const dungeon = randomFromArray(DUNGEONS);
        const keyLevel = 15 + Math.floor(Math.random() * 10);
        title = `Completed ${dungeon} +${keyLevel}`;
        value = 100 + Math.floor(Math.random() * 100);
        break;
      case "raid_kill":
        const boss = randomFromArray(BOSSES);
        title = `Defeated ${boss}`;
        description = "Heroic difficulty";
        break;
      case "achievement":
        title = "Earned Keystone Master";
        description = "Season 1";
        break;
      case "io_milestone":
        const newScore = 2000 + Math.floor(Math.random() * 1000);
        title = `Reached ${newScore} M+ Rating`;
        value = newScore;
        break;
      case "login":
        title = "Logged in";
        break;
    }
    
    events.push({
      id: randomId(),
      type,
      playerId: player.id,
      playerName: player.name,
      playerClass: player.class,
      title,
      description: description || undefined,
      value,
      timestamp: randomDate(3),
    });
  }
  
  return events.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function generateMockMythicRuns(playerId: string): MythicRun[] {
  return DUNGEONS.slice(0, 5).map((dungeon) => ({
    id: randomId(),
    playerId,
    dungeon,
    keyLevel: 15 + Math.floor(Math.random() * 10),
    completionTime: 1200000 + Math.floor(Math.random() * 600000),
    timerPercent: 80 + Math.floor(Math.random() * 40),
    score: 150 + Math.floor(Math.random() * 100),
    affixes: ["Fortified", "Bursting", "Spiteful"],
    timestamp: randomDate(14),
  }));
}

export function generateMockRaidParses(playerId: string): RaidParse[] {
  return BOSSES.slice(0, 6).map((bossName) => ({
    id: randomId(),
    playerId,
    bossName,
    difficulty: randomFromArray(["Heroic", "Mythic"] as const),
    spec: "Frost",
    dps: 800000 + Math.floor(Math.random() * 400000),
    parsePercent: 30 + Math.floor(Math.random() * 70),
    ilvlPercent: 40 + Math.floor(Math.random() * 60),
    timestamp: randomDate(30),
  }));
}

export function generateMockDashboardStats(players: Player[]): DashboardStats {
  const activePlayers = players.filter((p) => p.isActive);
  const onlinePlayers = players.filter((p) => p.isOnline);
  const avgScore = Math.floor(
    activePlayers.reduce((sum, p) => sum + p.mythicScore, 0) / activePlayers.length
  );
  
  return {
    activeMembers: activePlayers.length,
    onlineNow: onlinePlayers.length,
    avgMythicScore: avgScore,
    weeklyActivityChange: -5 + Math.floor(Math.random() * 20),
    topDungeon: randomFromArray(DUNGEONS),
    raidProgress: "7/8 Heroic",
  };
}

export const MOCK_BOSSES = BOSSES.map((name, index) => ({
  name,
  killed: index < 7,
  difficulty: index < 5 ? "Heroic" as const : index < 7 ? "Normal" as const : "Normal" as const,
  killCount: index < 7 ? Math.floor(Math.random() * 10) + 1 : 0,
}));
