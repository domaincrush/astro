import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { ArrowLeft, Star, Heart, Calendar, Gem, Clock, Shield, Compass } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';

// Individual nakshatra data with detailed information
const nakshatraData = {
  ashwini: {
    name: 'Ashwini',
    symbol: 'Horse Head',
    deity: 'Ashwini Kumaras',
    element: 'Earth',
    gana: 'Deva',
    yoni: 'Horse',
    lucky: {
      color: 'Golden',
      day: 'Tuesday',
      number: '1, 8',
      stone: 'Ruby'
    },
    sounds: ['Chu', 'Che', 'Cho', 'La'],
    characteristics: 'Ashwini natives are known for their pioneering spirit, quick action, and healing abilities. They are natural leaders who rush to help others and possess strong healing powers.',
    career: 'Medical professionals, healers, surgeons, veterinarians, transportation industry, emergency services',
    strengths: 'Initiative, healing abilities, leadership, quick decision-making, adventurous spirit',
    challenges: 'Impatience, recklessness, difficulty completing projects, restlessness',
    compatibility: 'Best with Bharani, Pushya, Ashlesha. Challenging with Magha, Purva Phalguni',
    remedies: 'Worship Lord Ganesha, wear ruby gemstone, practice meditation, engage in physical activities'
  },
  bharani: {
    name: 'Bharani',
    symbol: 'Yoni (Womb)',
    deity: 'Yama',
    element: 'Earth',
    gana: 'Manushya',
    yoni: 'Elephant',
    lucky: {
      color: 'Red',
      day: 'Friday',
      number: '2, 7',
      stone: 'Diamond'
    },
    sounds: ['Li', 'Lu', 'Le', 'Lo'],
    characteristics: 'Bharani natives are creative, artistic, and possess strong willpower. They have the ability to bear heavy responsibilities and transform difficult situations.',
    career: 'Artists, creative professionals, judges, lawyers, politicians, publishers, fertility specialists',
    strengths: 'Creativity, determination, leadership, artistic talents, ability to handle responsibilities',
    challenges: 'Stubbornness, excessive materialism, jealousy, tendency to dominate others',
    compatibility: 'Best with Rohini, Hasta, Swati. Challenging with Vishakha, Jyeshtha',
    remedies: 'Worship Lord Yama, practice charity, wear diamond, engage in creative activities'
  },
  krittika: {
    name: 'Krittika',
    symbol: 'Razor/Flame',
    deity: 'Agni',
    element: 'Fire',
    gana: 'Rakshasa',
    yoni: 'Goat',
    lucky: {
      color: 'White',
      day: 'Sunday',
      number: '3, 6',
      stone: 'Pearl'
    },
    sounds: ['Aa', 'Ee', 'Oo', 'Ae'],
    characteristics: 'Krittika natives are sharp, determined, and have a burning desire for truth. They are natural purifiers who can cut through illusions and see reality clearly.',
    career: 'Critics, teachers, spiritual leaders, chefs, military personnel, researchers',
    strengths: 'Sharp intellect, determination, truthfulness, leadership abilities, spiritual inclination',
    challenges: 'Critical nature, impatience, tendency to be harsh, difficulty in relationships',
    compatibility: 'Best with Rohini, Mrigashirsha, Ardra. Challenging with Pushya, Ashlesha',
    remedies: 'Worship Lord Murugan, practice fire rituals, wear pearl, control anger through meditation'
  },
  rohini: {
    name: 'Rohini',
    symbol: 'Ox Cart/Chariot',
    deity: 'Brahma',
    element: 'Earth',
    gana: 'Manushya',
    yoni: 'Serpent',
    lucky: {
      color: 'Red',
      day: 'Thursday',
      number: '4, 9',
      stone: 'Emerald'
    },
    sounds: ['O', 'Va', 'Vi', 'Vu'],
    characteristics: 'Rohini natives are attractive, charming, and possess strong creative abilities. They are natural builders who can create beauty and harmony in their surroundings.',
    career: 'Artists, designers, architects, farmers, bankers, luxury goods, entertainment industry',
    strengths: 'Creativity, charm, stability, material success, artistic talents',
    challenges: 'Materialism, possessiveness, stubbornness, tendency to be overly indulgent',
    compatibility: 'Best with Mrigashirsha, Punarvasu, Pushya. Challenging with Swati, Vishakha',
    remedies: 'Worship Lord Krishna, practice gratitude, wear emerald, engage in artistic pursuits'
  },
  mrigashirsha: {
    name: 'Mrigashirsha',
    symbol: 'Deer Head',
    deity: 'Soma',
    element: 'Earth',
    gana: 'Deva',
    yoni: 'Serpent',
    lucky: {
      color: 'Green',
      day: 'Wednesday',
      number: '5, 8',
      stone: 'Coral'
    },
    sounds: ['Ve', 'Vo', 'Ka', 'Ki'],
    characteristics: 'Mrigashirsha natives are curious, seeking, and possess a gentle nature. They are natural explorers who are always searching for knowledge and new experiences.',
    career: 'Researchers, writers, travelers, musicians, spiritual seekers, gemstone dealers',
    strengths: 'Curiosity, gentleness, seeking nature, musical abilities, spiritual inclination',
    challenges: 'Restlessness, difficulty in making decisions, tendency to be suspicious',
    compatibility: 'Best with Ardra, Punarvasu, Hasta. Challenging with Chitra, Swati',
    remedies: 'Worship Lord Shiva, practice meditation, wear coral, engage in learning activities'
  },
  ardra: {
    name: 'Ardra',
    symbol: 'Teardrop/Diamond',
    deity: 'Rudra',
    element: 'Water',
    gana: 'Manushya',
    yoni: 'Dog',
    lucky: {
      color: 'Green',
      day: 'Saturday',
      number: '6, 4',
      stone: 'Emerald'
    },
    sounds: ['Ku', 'Gha', 'Nga', 'Chha'],
    characteristics: 'Ardra natives are emotional, transformative, and possess strong intuitive abilities. They have the power to bring about necessary changes and destruction for renewal.',
    career: 'Researchers, scientists, weather forecasters, social workers, psychologists, technology',
    strengths: 'Intuition, transformation abilities, emotional depth, research skills',
    challenges: 'Emotional instability, destructive tendencies, difficulty in relationships',
    compatibility: 'Best with Punarvasu, Pushya, Ashlesha. Challenging with Magha, Purva Phalguni',
    remedies: 'Worship Lord Shiva, practice emotional control, wear emerald, engage in charitable activities'
  },
  punarvasu: {
    name: 'Punarvasu',
    symbol: 'Bow and Quiver',
    deity: 'Aditi',
    element: 'Water',
    gana: 'Deva',
    yoni: 'Cat',
    lucky: {
      color: 'Yellow',
      day: 'Thursday',
      number: '7, 3',
      stone: 'Topaz'
    },
    sounds: ['Ke', 'Ko', 'Ha', 'Hi'],
    characteristics: 'Punarvasu natives are optimistic, adaptable, and possess strong protective instincts. They have the ability to return and renew, making them excellent at restoration and healing.',
    career: 'Teachers, counselors, spiritual leaders, architects, real estate, hospitality industry',
    strengths: 'Optimism, adaptability, protective nature, spiritual wisdom, renewal abilities',
    challenges: 'Over-idealism, tendency to be too trusting, difficulty in facing harsh realities',
    compatibility: 'Best with Pushya, Ashlesha, Magha. Challenging with Purva Phalguni, Uttara Phalguni',
    remedies: 'Worship Goddess Aditi, practice compassion, wear topaz, engage in teaching activities'
  },
  pushya: {
    name: 'Pushya',
    symbol: 'Cow Udder/Lotus',
    deity: 'Brihaspati',
    element: 'Water',
    gana: 'Deva',
    yoni: 'Goat',
    lucky: {
      color: 'Red',
      day: 'Saturday',
      number: '8, 1',
      stone: 'Pearl'
    },
    sounds: ['Hu', 'He', 'Ho', 'Da'],
    characteristics: 'Pushya natives are nurturing, spiritual, and possess strong protective qualities. They are natural providers who can nourish and support others with wisdom and resources.',
    career: 'Teachers, spiritual leaders, politicians, social workers, healthcare professionals, agriculture',
    strengths: 'Nurturing nature, spiritual wisdom, protective instincts, leadership abilities',
    challenges: 'Over-protectiveness, tendency to be controlling, difficulty in letting go',
    compatibility: 'Best with Ashlesha, Magha, Purva Phalguni. Challenging with Hasta, Chitra',
    remedies: 'Worship Lord Brihaspati, practice generosity, wear pearl, engage in spiritual practices'
  },
  ashlesha: {
    name: 'Ashlesha',
    symbol: 'Serpent',
    deity: 'Nagas',
    element: 'Water',
    gana: 'Rakshasa',
    yoni: 'Cat',
    lucky: {
      color: 'Black',
      day: 'Saturday',
      number: '7, 9',
      stone: 'Emerald'
    },
    sounds: ['Di', 'Du', 'De', 'Do'],
    characteristics: 'Ashlesha natives are mysterious, intuitive, and possess deep wisdom. They have the ability to see through illusions and understand hidden truths.',
    career: 'Psychologists, researchers, occultists, investigators, chemists, pharmacists',
    strengths: 'Intuition, wisdom, research abilities, psychological insight, healing powers',
    challenges: 'Secretiveness, tendency to manipulate, suspicion, difficulty trusting others',
    compatibility: 'Best with Punarvasu, Pushya, Magha. Challenging with Krittika, Rohini',
    remedies: 'Worship Lord Shiva, practice meditation, wear emerald, engage in charitable activities'
  },
  magha: {
    name: 'Magha',
    symbol: 'Throne/Palanquin',
    deity: 'Pitrs (Ancestors)',
    element: 'Water',
    gana: 'Rakshasa',
    yoni: 'Rat',
    lucky: {
      color: 'Ivory',
      day: 'Wednesday',
      number: '1, 3',
      stone: 'Pearl'
    },
    sounds: ['Ma', 'Mi', 'Mu', 'Me'],
    characteristics: 'Magha natives are royal, dignified, and possess strong leadership qualities. They have natural authority and are connected to their ancestral heritage.',
    career: 'Government officials, administrators, judges, politicians, historians, genealogists',
    strengths: 'Leadership, dignity, respect for traditions, administrative abilities, royal nature',
    challenges: 'Arrogance, tendency to be dictatorial, difficulty accepting criticism',
    compatibility: 'Best with Ashlesha, Purva Phalguni, Uttara Phalguni. Challenging with Hasta, Chitra',
    remedies: 'Honor ancestors, practice ancestral worship, wear pearl, engage in charitable activities'
  },
  purva_phalguni: {
    name: 'Purva Phalguni',
    symbol: 'Front Legs of Bed',
    deity: 'Bhaga',
    element: 'Water',
    gana: 'Manushya',
    yoni: 'Rat',
    lucky: {
      color: 'Light Brown',
      day: 'Friday',
      number: '9, 2',
      stone: 'Diamond'
    },
    sounds: ['Mo', 'Ta', 'Ti', 'Tu'],
    characteristics: 'Purva Phalguni natives are creative, artistic, and love luxury. They are pleasure-seeking individuals who enjoy the finer things in life.',
    career: 'Artists, entertainers, musicians, actors, fashion designers, luxury goods dealers',
    strengths: 'Creativity, artistic talents, charm, social skills, love for beauty',
    challenges: 'Self-indulgence, laziness, tendency to be materialistic, difficulty with discipline',
    compatibility: 'Best with Magha, Uttara Phalguni, Hasta. Challenging with Ashwini, Bharani',
    remedies: 'Worship Lord Bhaga, practice moderation, wear diamond, engage in creative activities'
  },
  uttara_phalguni: {
    name: 'Uttara Phalguni',
    symbol: 'Back Legs of Bed',
    deity: 'Aryaman',
    element: 'Fire',
    gana: 'Manushya',
    yoni: 'Cow',
    lucky: {
      color: 'Bright Blue',
      day: 'Sunday',
      number: '1, 4',
      stone: 'Ruby'
    },
    sounds: ['Te', 'To', 'Pa', 'Pi'],
    characteristics: 'Uttara Phalguni natives are generous, helpful, and possess strong organizational skills. They are natural leaders who can bring people together.',
    career: 'Social workers, organizers, union leaders, administrators, counselors, healers',
    strengths: 'Generosity, organizational skills, leadership, helpful nature, social awareness',
    challenges: 'Over-commitment, tendency to neglect personal needs, difficulty saying no',
    compatibility: 'Best with Purva Phalguni, Hasta, Chitra. Challenging with Punarvasu, Pushya',
    remedies: 'Worship Sun god, practice self-care, wear ruby, engage in social service'
  },
  hasta: {
    name: 'Hasta',
    symbol: 'Hand',
    deity: 'Savitar',
    element: 'Earth',
    gana: 'Deva',
    yoni: 'Buffalo',
    lucky: {
      color: 'Light Green',
      day: 'Wednesday',
      number: '2, 7',
      stone: 'Emerald'
    },
    sounds: ['Pu', 'Sha', 'Na', 'Tha'],
    characteristics: 'Hasta natives are skilled, hardworking, and possess excellent craftsmanship. They are detail-oriented and can work with their hands effectively.',
    career: 'Craftsmen, artists, surgeons, mechanics, engineers, skilled workers',
    strengths: 'Skill, craftsmanship, attention to detail, hard work, practical abilities',
    challenges: 'Perfectionism, tendency to be overly critical, difficulty delegating',
    compatibility: 'Best with Uttara Phalguni, Chitra, Swati. Challenging with Pushya, Ashlesha',
    remedies: 'Worship Lord Savitar, practice skill development, wear emerald, engage in handicrafts'
  },
  chitra: {
    name: 'Chitra',
    symbol: 'Bright Jewel/Pearl',
    deity: 'Vishvakarma',
    element: 'Fire',
    gana: 'Rakshasa',
    yoni: 'Tiger',
    lucky: {
      color: 'Black',
      day: 'Tuesday',
      number: '3, 5',
      stone: 'Red Coral'
    },
    sounds: ['Pe', 'Po', 'Ra', 'Ri'],
    characteristics: 'Chitra natives are artistic, creative, and possess strong aesthetic sense. They are natural builders and designers who can create beautiful things.',
    career: 'Architects, designers, artists, decorators, photographers, fashion designers',
    strengths: 'Creativity, artistic vision, aesthetic sense, building abilities, charisma',
    challenges: 'Ego, tendency to be superficial, difficulty with criticism of their work',
    compatibility: 'Best with Hasta, Swati, Vishakha. Challenging with Magha, Purva Phalguni',
    remedies: 'Worship Lord Vishvakarma, practice humility, wear red coral, engage in creative work'
  },
  swati: {
    name: 'Swati',
    symbol: 'Sword/Shoot of Plant',
    deity: 'Vayu',
    element: 'Fire',
    gana: 'Deva',
    yoni: 'Buffalo',
    lucky: {
      color: 'Black',
      day: 'Saturday',
      number: '6, 4',
      stone: 'Sapphire'
    },
    sounds: ['Ru', 'Re', 'Ro', 'Ta'],
    characteristics: 'Swati natives are independent, adaptable, and possess strong communication skills. They are natural diplomats who can navigate through different situations.',
    career: 'Diplomats, negotiators, traders, businesspeople, consultants, travel agents',
    strengths: 'Independence, adaptability, communication skills, diplomacy, business acumen',
    challenges: 'Restlessness, tendency to be indecisive, difficulty with commitment',
    compatibility: 'Best with Chitra, Vishakha, Anuradha. Challenging with Bharani, Krittika',
    remedies: 'Worship Lord Vayu, practice stability, wear sapphire, engage in meditation'
  },
  vishakha: {
    name: 'Vishakha',
    symbol: 'Triumphal Arch',
    deity: 'Indra-Agni',
    element: 'Fire',
    gana: 'Rakshasa',
    yoni: 'Tiger',
    lucky: {
      color: 'Golden',
      day: 'Thursday',
      number: '3, 9',
      stone: 'Yellow Sapphire'
    },
    sounds: ['Ti', 'Tu', 'Te', 'To'],
    characteristics: 'Vishakha natives are ambitious, determined, and possess strong willpower. They are natural achievers who can overcome obstacles to reach their goals.',
    career: 'Politicians, leaders, military officers, entrepreneurs, athletes, competitors',
    strengths: 'Ambition, determination, leadership, competitive spirit, goal-oriented',
    challenges: 'Jealousy, tendency to be ruthless, difficulty with cooperation',
    compatibility: 'Best with Swati, Anuradha, Jyeshtha. Challenging with Bharani, Rohini',
    remedies: 'Worship Lord Indra, practice cooperation, wear yellow sapphire, control jealousy'
  },
  anuradha: {
    name: 'Anuradha',
    symbol: 'Lotus/Triumphal Archway',
    deity: 'Mitra',
    element: 'Fire',
    gana: 'Deva',
    yoni: 'Deer',
    lucky: {
      color: 'Red',
      day: 'Tuesday',
      number: '8, 1',
      stone: 'Red Coral'
    },
    sounds: ['Na', 'Ni', 'Nu', 'Ne'],
    characteristics: 'Anuradha natives are devoted, loyal, and possess strong friendship qualities. They are natural organizers who can bring people together for common causes.',
    career: 'Organizers, coordinators, counselors, social workers, religious leaders, diplomats',
    strengths: 'Loyalty, devotion, organizational skills, friendship, diplomatic abilities',
    challenges: 'Tendency to be possessive, difficulty with change, over-dependence on others',
    compatibility: 'Best with Vishakha, Jyeshtha, Mula. Challenging with Krittika, Mrigashirsha',
    remedies: 'Worship Lord Mitra, practice independence, wear red coral, engage in group activities'
  },
  jyeshtha: {
    name: 'Jyeshtha',
    symbol: 'Circular Amulet/Earring',
    deity: 'Indra',
    element: 'Air',
    gana: 'Rakshasa',
    yoni: 'Deer',
    lucky: {
      color: 'Cream',
      day: 'Wednesday',
      number: '9, 6',
      stone: 'Emerald'
    },
    sounds: ['No', 'Ya', 'Yi', 'Yu'],
    characteristics: 'Jyeshtha natives are protective, responsible, and possess strong leadership qualities. They are natural protectors who take care of their family and community.',
    career: 'Administrators, managers, protectors, police officers, military personnel, security professionals',
    strengths: 'Protection, responsibility, leadership, administrative abilities, maturity',
    challenges: 'Tendency to be controlling, difficulty trusting others, over-responsibility',
    compatibility: 'Best with Anuradha, Mula, Purva Ashadha. Challenging with Bharani, Ardra',
    remedies: 'Worship Lord Indra, practice trust, wear emerald, delegate responsibilities'
  },
  mula: {
    name: 'Mula',
    symbol: 'Tied Roots/Lion\'s Tail',
    deity: 'Nirriti',
    element: 'Air',
    gana: 'Rakshasa',
    yoni: 'Dog',
    lucky: {
      color: 'Brown',
      day: 'Sunday',
      number: '9, 3',
      stone: 'Red Coral'
    },
    sounds: ['Ye', 'Yo', 'Bha', 'Bhi'],
    characteristics: 'Mula natives are investigative, philosophical, and possess strong research abilities. They are natural seekers who want to get to the root of things.',
    career: 'Researchers, investigators, philosophers, spiritual teachers, detectives, archaeologists',
    strengths: 'Research abilities, philosophical mind, investigative nature, spiritual inclination',
    challenges: 'Tendency to be destructive, difficulty with stability, restlessness',
    compatibility: 'Best with Jyeshtha, Purva Ashadha, Uttara Ashadha. Challenging with Punarvasu, Pushya',
    remedies: 'Worship Goddess Nirriti, practice stability, wear red coral, engage in spiritual practices'
  },
  purva_ashadha: {
    name: 'Purva Ashadha',
    symbol: 'Elephant Tusk/Fan',
    deity: 'Apas',
    element: 'Air',
    gana: 'Manushya',
    yoni: 'Monkey',
    lucky: {
      color: 'Black',
      day: 'Friday',
      number: '3, 7',
      stone: 'Diamond'
    },
    sounds: ['Bhu', 'Dha', 'Pha', 'Dha'],
    characteristics: 'Purva Ashadha natives are invincible, ambitious, and possess strong debating skills. They are natural fighters who never give up.',
    career: 'Debaters, lawyers, politicians, motivational speakers, sales professionals, warriors',
    strengths: 'Invincibility, ambition, debating skills, persuasive abilities, fighting spirit',
    challenges: 'Tendency to be aggressive, difficulty accepting defeat, stubbornness',
    compatibility: 'Best with Mula, Uttara Ashadha, Shravana. Challenging with Ashwini, Bharani',
    remedies: 'Worship water deities, practice patience, wear diamond, control aggression'
  },
  uttara_ashadha: {
    name: 'Uttara Ashadha',
    symbol: 'Elephant Tusk/Planks of Bed',
    deity: 'Vishvadevas',
    element: 'Air',
    gana: 'Manushya',
    yoni: 'Mongoose',
    lucky: {
      color: 'Copper',
      day: 'Sunday',
      number: '1, 10',
      stone: 'Ruby'
    },
    sounds: ['Bhe', 'Bho', 'Ja', 'Ji'],
    characteristics: 'Uttara Ashadha natives are righteous, virtuous, and possess strong moral values. They are natural leaders who can guide others on the right path.',
    career: 'Leaders, judges, teachers, preachers, social reformers, ethical consultants',
    strengths: 'Righteousness, moral values, leadership, teaching abilities, ethical nature',
    challenges: 'Tendency to be preachy, rigidity, difficulty with flexibility',
    compatibility: 'Best with Purva Ashadha, Shravana, Dhanishta. Challenging with Krittika, Rohini',
    remedies: 'Worship universal deities, practice flexibility, wear ruby, engage in teaching'
  },
  shravana: {
    name: 'Shravana',
    symbol: 'Ear/Three Footprints',
    deity: 'Vishnu',
    element: 'Air',
    gana: 'Deva',
    yoni: 'Monkey',
    lucky: {
      color: 'Light Blue',
      day: 'Monday',
      number: '2, 7',
      stone: 'Pearl'
    },
    sounds: ['Ju', 'Je', 'Jo', 'Gha'],
    characteristics: 'Shravana natives are wise, learned, and possess excellent listening skills. They are natural teachers and counselors who can guide others.',
    career: 'Teachers, counselors, advisors, therapists, radio personalities, linguists',
    strengths: 'Wisdom, learning abilities, listening skills, teaching talent, spiritual inclination',
    challenges: 'Tendency to be too theoretical, difficulty with practical matters',
    compatibility: 'Best with Uttara Ashadha, Dhanishta, Shatabhisha. Challenging with Mrigashirsha, Ardra',
    remedies: 'Worship Lord Vishnu, practice active listening, wear pearl, engage in learning'
  },
  dhanishta: {
    name: 'Dhanishta',
    symbol: 'Drum/Flute',
    deity: 'Vasus',
    element: 'Ether',
    gana: 'Rakshasa',
    yoni: 'Lion',
    lucky: {
      color: 'Silver',
      day: 'Tuesday',
      number: '8, 4',
      stone: 'Red Coral'
    },
    sounds: ['Ga', 'Gi', 'Gu', 'Ge'],
    characteristics: 'Dhanishta natives are wealthy, musical, and possess strong rhythmic abilities. They are natural entertainers who can create harmony.',
    career: 'Musicians, dancers, entertainers, sound engineers, percussionists, performers',
    strengths: 'Musical abilities, rhythm, entertainment skills, wealth attraction, harmony creation',
    challenges: 'Tendency to be materialistic, difficulty with emotional expression',
    compatibility: 'Best with Shravana, Shatabhisha, Purva Bhadrapada. Challenging with Punarvasu, Pushya',
    remedies: 'Worship Vasus, practice music, wear red coral, engage in artistic activities'
  },
  shatabhisha: {
    name: 'Shatabhisha',
    symbol: 'Empty Circle/1000 Flowers',
    deity: 'Varuna',
    element: 'Ether',
    gana: 'Rakshasa',
    yoni: 'Horse',
    lucky: {
      color: 'Blue Green',
      day: 'Saturday',
      number: '100, 7',
      stone: 'Sapphire'
    },
    sounds: ['Go', 'Sa', 'Si', 'Su'],
    characteristics: 'Shatabhisha natives are mysterious, healing, and possess strong intuitive abilities. They are natural healers who can work with subtle energies.',
    career: 'Healers, mystics, astrologers, researchers, alternative medicine practitioners, occultists',
    strengths: 'Healing abilities, intuition, mystical powers, research skills, independence',
    challenges: 'Tendency to be secretive, difficulty with emotional expression, isolation',
    compatibility: 'Best with Dhanishta, Purva Bhadrapada, Uttara Bhadrapada. Challenging with Ashwini, Bharani',
    remedies: 'Worship Lord Varuna, practice healing arts, wear sapphire, engage in meditation'
  },
  purva_bhadrapada: {
    name: 'Purva Bhadrapada',
    symbol: 'Swords/Two Front Legs of Bed',
    deity: 'Aja Ekapada',
    element: 'Ether',
    gana: 'Manushya',
    yoni: 'Lion',
    lucky: {
      color: 'Silver Grey',
      day: 'Thursday',
      number: '3, 4',
      stone: 'Yellow Sapphire'
    },
    sounds: ['Se', 'So', 'Da', 'Di'],
    characteristics: 'Purva Bhadrapada natives are passionate, intense, and possess strong transformative abilities. They are natural revolutionaries who can bring about change.',
    career: 'Revolutionaries, reformers, funeral directors, occultists, tantrics, researchers',
    strengths: 'Passion, intensity, transformative abilities, revolutionary spirit, depth',
    challenges: 'Tendency to be extreme, difficulty with moderation, destructive tendencies',
    compatibility: 'Best with Shatabhisha, Uttara Bhadrapada, Revati. Challenging with Krittika, Rohini',
    remedies: 'Worship Lord Shiva, practice moderation, wear yellow sapphire, control intensity'
  },
  uttara_bhadrapada: {
    name: 'Uttara Bhadrapada',
    symbol: 'Twins/Back Legs of Bed',
    deity: 'Ahir Budhnya',
    element: 'Ether',
    gana: 'Manushya',
    yoni: 'Cow',
    lucky: {
      color: 'Purple',
      day: 'Saturday',
      number: '8, 26',
      stone: 'Sapphire'
    },
    sounds: ['Du', 'Tha', 'Jha', 'Na'],
    characteristics: 'Uttara Bhadrapada natives are wise, spiritual, and possess deep compassion. They are natural healers who can provide comfort and wisdom.',
    career: 'Spiritual teachers, healers, counselors, philosophers, social workers, charitable workers',
    strengths: 'Wisdom, spirituality, compassion, healing abilities, depth of understanding',
    challenges: 'Tendency to be too idealistic, difficulty with practical matters, over-sacrifice',
    compatibility: 'Best with Purva Bhadrapada, Revati, Ashwini. Challenging with Mrigashirsha, Ardra',
    remedies: 'Worship serpent deities, practice compassion, wear sapphire, engage in service'
  },
  revati: {
    name: 'Revati',
    symbol: 'Fish/Pair of Fish',
    deity: 'Pushan',
    element: 'Ether',
    gana: 'Deva',
    yoni: 'Elephant',
    lucky: {
      color: 'Brown',
      day: 'Thursday',
      number: '27, 9',
      stone: 'Yellow Sapphire'
    },
    sounds: ['De', 'Do', 'Cha', 'Chi'],
    characteristics: 'Revati natives are nourishing, protective, and possess strong nurturing abilities. They are natural guardians who can guide others safely.',
    career: 'Guardians, protectors, guides, travel agents, shipping industry, animal care',
    strengths: 'Nurturing abilities, protection, guidance, safe travel, completion skills',
    challenges: 'Tendency to be over-protective, difficulty with independence, fear of change',
    compatibility: 'Best with Uttara Bhadrapada, Ashwini, Bharani. Challenging with Punarvasu, Pushya',
    remedies: 'Worship Lord Pushan, practice independence, wear yellow sapphire, engage in travel'
  }
};

// Get all nakshatra keys for navigation
const nakshatraKeys = Object.keys(nakshatraData);

export default function NakshatraDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const nakshatra = nakshatraData[slug as keyof typeof nakshatraData];

  if (!nakshatra) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nakshatra Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">The nakshatra you're looking for doesn't exist.</p>
            <Link href="/learn-astrology/nakshatras">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Nakshatras
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentIndex = nakshatraKeys.indexOf(slug);
  const prevNakshatra = currentIndex > 0 ? nakshatraKeys[currentIndex - 1] : null;
  const nextNakshatra = currentIndex < nakshatraKeys.length - 1 ? nakshatraKeys[currentIndex + 1] : null;

  return (
    <>
      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/learn-astrology/nakshatras">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Nakshatras
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">{nakshatra.name}</h1>
            <p className="text-2xl text-gray-600 mb-2">{nakshatra.symbol}</p>
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-2">
              Nakshatra #{currentIndex + 1} of 27
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-1">Deity</h4>
                    <p className="text-gray-700">{nakshatra.deity}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pink-700 mb-1">Element</h4>
                    <p className="text-gray-700">{nakshatra.element}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-700 mb-1">Gana</h4>
                    <p className="text-gray-700">{nakshatra.gana}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-700 mb-1">Yoni</h4>
                    <p className="text-gray-700">{nakshatra.yoni}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Gem className="h-5 w-5" />
                  Lucky Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-emerald-700 mb-1">Color</h4>
                    <p className="text-gray-700">{nakshatra.lucky.color}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-700 mb-1">Day</h4>
                    <p className="text-gray-700">{nakshatra.lucky.day}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-700 mb-1">Numbers</h4>
                    <p className="text-gray-700">{nakshatra.lucky.number}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-700 mb-1">Stone</h4>
                    <p className="text-gray-700">{nakshatra.lucky.stone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Name Syllables
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {nakshatra.sounds.map((sound, i) => (
                    <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                      {sound}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Characteristics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">{nakshatra.characteristics}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5" />
                  Career & Profession
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">{nakshatra.career}</p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{nakshatra.strengths}</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700">{nakshatra.challenges}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">{nakshatra.compatibility}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Remedies & Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">{nakshatra.remedies}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-gray-200">
          <div>
            {prevNakshatra && (
              <Link href={`/nakshatras/${prevNakshatra}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous: {nakshatraData[prevNakshatra as keyof typeof nakshatraData].name}
                </Button>
              </Link>
            )}
          </div>
          
          <div>
            {nextNakshatra && (
              <Link href={`/nakshatras/${nextNakshatra}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  Next: {nakshatraData[nextNakshatra as keyof typeof nakshatraData].name}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}