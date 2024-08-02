const landBiomes = [
    "Tropical Rainforest",
    "Tropical Savanna",
    "Desert",
    "Mediterranean Forest",
    "Temperate Grassland",
    "Temperate Deciduous Forest",
    "Temperate Coniferous Forest",
    "Boreal Forest (Taiga)",
    "Arctic Tundra",
    "Alpine Tundra",
    "Mangrove Forest",
    "Freshwater Swamp Forest",
    "Temperate Shrubland",
    "Temperate Woodland",
    "Montane Grassland",
    "Montane Shrubland",
    "Riparian Forest",
    "Prairie",
    "Steppe",
    "Xeric Shrubland"
  ];
  
  const waterBiomes = [
    "Coral Reef",
    "Kelp Forest",
    "Seagrass Meadow",
    "Estuary",
    "Intertidal Zone",
    "Deep Sea Coral Reef",
    "Hydrothermal Vent",
    "Abyssal Plain",
    "Epipelagic Zone",
    "Mesopelagic Zone",
    "Bathypelagic Zone",
    "Abyssopelagic Zone",
    "Hadopelagic Zone",
    "Continental Shelf",
    "Continental Slope",
    "Continental Rise",
    "Oceanic Trench",
    "Submarine Canyon",
    "Coastal Pelagic Zone",
    "Open Ocean"
  ];
  
  
  
  
  const adjectives = [
    // Positive adjectives
    "abundant", "adorable", "adventurous", "agile", "alert", "amazing", "ambitious", "angelic",
    "animated", "artistic", "astonishing", "athletic", "attractive", "auspicious", "authentic",
    "beautiful", "benevolent", "blissful", "bold", "brave", "breathtaking", "brilliant", "calm",
    "captivating", "carefree", "charming", "cheerful", "chic", "chivalrous", "classic", "classy",
    "clever", "colorful", "compassionate", "confident", "considerate", "cool", "courageous", "creative",
    "crisp", "cute", "dazzling", "delicate", "delightful", "determined", "dignified", "distinct", "divine",
    "dreamy", "dynamic", "eager", "elegant", "eloquent", "eminent", "enchanting", "energetic",
    "engaging", "enlightened", "enthralling", "enthusiastic", "epic", "ethereal", "euphoric", "evocative",
    "exquisite", "extraordinary", "exuberant", "fabulous", "fantastic", "fascinating", "fearless",
    "flawless", "flourishing", "formidable", "fragrant", "free", "fresh", "friendly", "fun", "gallant",
    "generous", "gentle", "glamorous", "gleaming", "glorious", "graceful", "grand", "great", "gritty",
    "groovy", "handsome", "happy", "harmonious", "heavenly", "heroic", "hilarious", "honest", "hopeful",
    "imaginative", "immaculate", "impeccable", "impressive", "incredible", "inspiring", "intelligent",
    "intrepid", "invincible", "inviting", "irresistible", "jovial", "joyful", "jubilant", "keen", "kind",
    "lively", "lovely", "luminous", "lustrous", "magical", "magnificent", "majestic", "marvelous",
    "memorable", "mesmerizing", "mighty", "miraculous", "mirthful", "modern", "mysterious", "natural",
    "noble", "notable", "nurturing", "optimistic", "original", "outgoing", "outstanding", "passionate",
    "patient", "peaceful", "perceptive", "perfect", "perky", "persistent", "philosophical", "picturesque",
    "playful", "poised", "polished", "popular", "positive", "powerful", "precious", "prestigious",
    "profound", "prominent", "prosperous", "proud", "radiant", "rare", "refined", "refreshing", "regal",
    "remarkable", "resilient", "resolute", "resourceful", "resplendent", "revered", "rich", "robust",
    "romantic", "safe", "sagacious", "sassy", "satisfied", "savvy", "scenic", "serene", "sharp",
    "shining", "sincere", "sleek", "slick", "smart", "sophisticated", "spectacular", "spirited", "splendid",
    "stately", "steadfast", "stellar", "striking", "strong", "stunning", "stylish", "successful", "superb",
    "superior", "supreme", "swanky", "sweet", "talented", "terrific", "thrilling", "tranquil", "trustworthy",
    "truthful", "ultimate", "unbelievable", "unique", "unmatched", "unparalleled", "unreal", "upbeat",
    "valiant", "vibrant", "victorious", "vigorous", "vivacious", "vivid", "warm", "wealthy", "whimsical",
    "wise", "witty", "wonderful", "wondrous", "zany", "zealous",
  
    // Negative adjectives
    "abysmal", "aggressive", "alarming", "angry", "annoying", "anxious", "appalling", "arrogant",
    "awful", "bad", "barbaric", "belligerent", "bizarre", "bleak", "blunt", "boring", "brash", "brutal",
    "callous", "careless", "chaotic", "clumsy", "coarse", "cold", "combative", "confused", "convoluted",
    "corrupt", "cowardly", "cruel", "crummy", "dangerous", "dark", "deceitful", "deceptive", "defiant",
    "deplorable", "depressed", "desolate", "destructive", "dismal", "disorganized", "disturbed", "dreary",
    "dubious", "dull", "egotistical", "embarrassing", "enraged", "erratic", "evil", "faint", "fearful",
    "ferocious", "foolish", "frightening", "frustrating", "gloomy", "greedy", "grim", "gross", "grumpy",
    "harsh", "hateful", "hideous", "horrible", "hostile", "idiotic", "ignorant", "immoral", "imperfect",
    "impossible", "inadequate", "inept", "inflexible", "infuriating", "insensitive", "intimidating", "jealous",
    "jittery", "lousy", "malicious", "mean", "menacing", "messy", "miserable", "moody", "morbid", "nasty",
    "negative", "negligent", "obnoxious", "offensive", "oppressive", "outrageous", "pathetic", "peculiar",
    "pessimistic", "pitiful", "poor", "precarious", "prejudiced", "problematic", "raging", "reckless", "repulsive",
    "rigid", "rough", "rude", "sad", "savage", "scary", "selfish", "shabby", "shocking", "sickening", "sinister",
    "sloppy", "sneaky", "spiteful", "stubborn", "suspicious", "tense", "terrible", "threatening", "tragic",
    "treacherous", "troubling", "ugly", "unacceptable", "uncomfortable", "unfair", "unfriendly", "unhappy",
    "unpleasant", "unreliable", "untrustworthy", "vicious", "vile", "villainous", "violent", "weary", "wicked",
    "worthless", "wretched",
  
    // Neutral adjectives
    "average", "basic", "common", "customary", "decent", "everyday", "familiar", "general", "indifferent",
    "mediocre", "moderate", "normal", "ordinary", "passable", "plain", "regular", "routine", "standard",
    "tolerable", "typical", "usual"
  ];
  
  
  
  
  //loreGPT
  
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
  
function generateBiomeDescription(number) {
    const biome = number === 0 ? getRandomElement(waterBiomes) : getRandomElement(landBiomes);
    const adjective1 = getRandomElement(adjectives);
    const adjective2 = getRandomElement(adjectives);
    
    return [biome, adjective1, adjective2];
}
  
  
export function lorePrompt(height) {
    let loreData = generateBiomeDescription(height);
    
    return `Come up with a lore for a place in 100 words based on these descriptions: 
    ${loreData[0]}, ${loreData[1]}, ${loreData[2]}`;
};
  
  

  
  
  //loreGPT end