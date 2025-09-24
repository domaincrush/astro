import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Calculator, User, Calendar, Hash, Star, TrendingUp, Heart, Shield } from "lucide-react";

interface NumerologyProfile {
  lifePath: {
    number: number;
    meaning: string;
    traits: string[];
    challenges: string[];
    careerSuggestions: string[];
  };
  destiny: {
    number: number;
    meaning: string;
    purpose: string;
    talents: string[];
  };
  soulUrge: {
    number: number;
    meaning: string;
    desires: string[];
    motivation: string;
  };
  personality: {
    number: number;
    meaning: string;
    impression: string;
    strengths: string[];
  };
  birthDay: {
    number: number;
    meaning: string;
    specialTalents: string[];
  };
  maturity: {
    number: number;
    meaning: string;
    laterLifeThemes: string[];
  };
  personalYear: {
    number: number;
    theme: string;
    opportunities: string[];
    guidance: string[];
  };
  luckyNumbers: number[];
  compatibleNumbers: number[];
  challengeNumbers: number[];
}

export default function NumerologyCalculator() {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    currentYear: new Date().getFullYear().toString()
  });
  const [profile, setProfile] = useState<NumerologyProfile | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateNumerology = () => {
    if (!formData.fullName || !formData.birthDate) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const lifePath = calculateLifePath(formData.birthDate);
      const destiny = calculateDestiny(formData.fullName);
      const soulUrge = calculateSoulUrge(formData.fullName);
      const personality = calculatePersonality(formData.fullName);
      const birthDay = calculateBirthDay(formData.birthDate);
      const maturity = calculateMaturity(lifePath, destiny);
      const personalYear = calculatePersonalYear(formData.birthDate, parseInt(formData.currentYear));
      
      const mockProfile: NumerologyProfile = {
        lifePath: {
          number: lifePath,
          meaning: getLifePathMeaning(lifePath),
          traits: getLifePathTraits(lifePath),
          challenges: getLifePathChallenges(lifePath),
          careerSuggestions: getCareerSuggestions(lifePath)
        },
        destiny: {
          number: destiny,
          meaning: getDestinyMeaning(destiny),
          purpose: getDestinyPurpose(destiny),
          talents: getDestinyTalents(destiny)
        },
        soulUrge: {
          number: soulUrge,
          meaning: getSoulUrgeMeaning(soulUrge),
          desires: getSoulUrgeDesires(soulUrge),
          motivation: getSoulUrgeMotivation(soulUrge)
        },
        personality: {
          number: personality,
          meaning: getPersonalityMeaning(personality),
          impression: getPersonalityImpression(personality),
          strengths: getPersonalityStrengths(personality)
        },
        birthDay: {
          number: birthDay,
          meaning: getBirthDayMeaning(birthDay),
          specialTalents: getBirthDayTalents(birthDay)
        },
        maturity: {
          number: maturity,
          meaning: getMaturityMeaning(maturity),
          laterLifeThemes: getMaturityThemes(maturity)
        },
        personalYear: {
          number: personalYear,
          theme: getPersonalYearTheme(personalYear),
          opportunities: getPersonalYearOpportunities(personalYear),
          guidance: getPersonalYearGuidance(personalYear)
        },
        luckyNumbers: generateLuckyNumbers(lifePath, destiny),
        compatibleNumbers: getCompatibleNumbers(lifePath),
        challengeNumbers: getChallengeNumbers(lifePath)
      };
      
      setProfile(mockProfile);
      setIsCalculating(false);
    }, 2000);
  };

  // Numerology calculation functions
  const reduceNumber = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  };

  const calculateLifePath = (birthDate: string): number => {
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    const sum = day + month + year.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    return reduceNumber(sum);
  };

  const calculateDestiny = (fullName: string): number => {
    const letterValues: { [key: string]: number } = {
      A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
      J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
      S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    const sum = fullName.toUpperCase().replace(/[^A-Z]/g, '').split('')
      .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0);
    
    return reduceNumber(sum);
  };

  const calculateSoulUrge = (fullName: string): number => {
    const vowels = 'AEIOU';
    const letterValues: { [key: string]: number } = {
      A: 1, E: 5, I: 9, O: 6, U: 3
    };
    
    const sum = fullName.toUpperCase().split('')
      .filter(letter => vowels.includes(letter))
      .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0);
    
    return reduceNumber(sum);
  };

  const calculatePersonality = (fullName: string): number => {
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const letterValues: { [key: string]: number } = {
      B: 2, C: 3, D: 4, F: 6, G: 7, H: 8, J: 1, K: 2, L: 3, M: 4,
      N: 5, P: 7, Q: 8, R: 9, S: 1, T: 2, V: 4, W: 5, X: 6, Y: 7, Z: 8
    };
    
    const sum = fullName.toUpperCase().split('')
      .filter(letter => consonants.includes(letter))
      .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0);
    
    return reduceNumber(sum);
  };

  const calculateBirthDay = (birthDate: string): number => {
    const date = new Date(birthDate);
    return reduceNumber(date.getDate());
  };

  const calculateMaturity = (lifePath: number, destiny: number): number => {
    return reduceNumber(lifePath + destiny);
  };

  const calculatePersonalYear = (birthDate: string, currentYear: number): number => {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const sum = month + day + currentYear.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    return reduceNumber(sum);
  };

  // Meaning functions (simplified for demo)
  const getLifePathMeaning = (num: number): string => {
    const meanings: { [key: number]: string } = {
      1: "The Leader - Independent, pioneering, innovative",
      2: "The Cooperator - Diplomatic, peaceful, team-oriented",
      3: "The Communicator - Creative, expressive, optimistic",
      4: "The Builder - Practical, disciplined, hardworking",
      5: "The Adventurer - Freedom-loving, curious, dynamic",
      6: "The Nurturer - Caring, responsible, family-oriented",
      7: "The Seeker - Analytical, spiritual, introspective",
      8: "The Achiever - Ambitious, material success, leadership",
      9: "The Humanitarian - Compassionate, generous, wise",
      11: "The Intuitive - Spiritual messenger, inspirational",
      22: "The Master Builder - Visionary, practical idealist",
      33: "The Master Teacher - Spiritual teacher, healer"
    };
    return meanings[num] || "Unknown";
  };

  const getLifePathTraits = (num: number): string[] => {
    const traits: { [key: number]: string[] } = {
      1: ["Independent", "Pioneering", "Leadership", "Original", "Determined"],
      2: ["Cooperative", "Diplomatic", "Patient", "Supportive", "Peaceful"],
      3: ["Creative", "Expressive", "Optimistic", "Inspiring", "Artistic"],
      4: ["Practical", "Organized", "Reliable", "Hardworking", "Systematic"],
      5: ["Adventurous", "Free-spirited", "Curious", "Versatile", "Progressive"],
      6: ["Nurturing", "Responsible", "Caring", "Protective", "Healing"],
      7: ["Analytical", "Introspective", "Spiritual", "Mysterious", "Wise"],
      8: ["Ambitious", "Organized", "Practical", "Authoritative", "Efficient"],
      9: ["Humanitarian", "Generous", "Compassionate", "Wise", "Universal"]
    };
    return traits[num] || ["Unique", "Special", "Individual"];
  };

  const getLifePathChallenges = (num: number): string[] => {
    const challenges: { [key: number]: string[] } = {
      1: ["Avoid being too aggressive", "Learn to work with others", "Don't be overly critical"],
      2: ["Avoid being overly sensitive", "Build confidence", "Don't be indecisive"],
      3: ["Focus and discipline", "Avoid scattering energy", "Don't be superficial"],
      4: ["Avoid being too rigid", "Embrace change", "Don't overwork"],
      5: ["Avoid restlessness", "Commit to goals", "Don't be irresponsible"],
      6: ["Avoid being controlling", "Set boundaries", "Don't be self-sacrificing"],
      7: ["Avoid isolation", "Trust intuition", "Don't be overly analytical"],
      8: ["Balance material and spiritual", "Avoid power struggles", "Don't neglect family"],
      9: ["Let go of the past", "Avoid being judgmental", "Don't be a martyr"]
    };
    return challenges[num] || ["Work on balance", "Embrace growth", "Stay positive"];
  };

  const getCareerSuggestions = (num: number): string[] => {
    const careers: { [key: number]: string[] } = {
      1: ["Entrepreneur", "CEO", "Manager", "Inventor", "Pioneer"],
      2: ["Counselor", "Diplomat", "Teacher", "Mediator", "Team leader"],
      3: ["Artist", "Writer", "Actor", "Designer", "Entertainer"],
      4: ["Engineer", "Architect", "Accountant", "Manager", "Builder"],
      5: ["Travel agent", "Journalist", "Sales", "Promoter", "Explorer"],
      6: ["Teacher", "Doctor", "Counselor", "Chef", "Interior designer"],
      7: ["Researcher", "Analyst", "Scientist", "Philosopher", "Spiritual advisor"],
      8: ["Executive", "Banker", "Real estate", "Lawyer", "Business owner"],
      9: ["Social worker", "Teacher", "Artist", "Healer", "Philanthropist"]
    };
    return careers[num] || ["Creative fields", "Service industries", "Leadership roles"];
  };

  // Additional helper functions for other aspects...
  const getDestinyMeaning = (num: number): string => `Destiny number ${num} represents your life purpose and mission.`;
  const getDestinyPurpose = (num: number): string => `To fulfill your potential through ${num === 1 ? 'leadership' : num === 2 ? 'cooperation' : 'service'}.`;
  const getDestinyTalents = (num: number): string[] => ["Natural abilities", "Innate gifts", "Special skills"];
  
  const getSoulUrgeMeaning = (num: number): string => `Soul Urge ${num} reveals your inner motivations and desires.`;
  const getSoulUrgeDesires = (num: number): string[] => ["Inner fulfillment", "Spiritual growth", "Personal satisfaction"];
  const getSoulUrgeMotivation = (num: number): string => "Deep inner drive for meaningful experiences.";
  
  const getPersonalityMeaning = (num: number): string => `Personality ${num} shows how others perceive you.`;
  const getPersonalityImpression = (num: number): string => "First impressions and outer personality.";
  const getPersonalityStrengths = (num: number): string[] => ["Social skills", "Communication", "Charisma"];
  
  const getBirthDayMeaning = (num: number): string => `Birth day ${num} indicates special talents and abilities.`;
  const getBirthDayTalents = (num: number): string[] => ["Unique abilities", "Natural gifts", "Special skills"];
  
  const getMaturityMeaning = (num: number): string => `Maturity ${num} represents themes for later life.`;
  const getMaturityThemes = (num: number): string[] => ["Wisdom", "Experience", "Life mastery"];
  
  const getPersonalYearTheme = (num: number): string => {
    const themes: { [key: number]: string } = {
      1: "New Beginnings", 2: "Cooperation", 3: "Creativity", 4: "Foundation Building",
      5: "Freedom & Change", 6: "Responsibility", 7: "Spiritual Growth", 8: "Achievement",
      9: "Completion & Wisdom"
    };
    return themes[num] || "Transformation";
  };
  
  const getPersonalYearOpportunities = (num: number): string[] => ["Growth opportunities", "New possibilities", "Positive changes"];
  const getPersonalYearGuidance = (num: number): string[] => ["Focus on growth", "Embrace opportunities", "Stay positive"];
  
  const generateLuckyNumbers = (lifePath: number, destiny: number): number[] => {
    return [lifePath, destiny, lifePath + destiny].map(n => reduceNumber(n)).slice(0, 5);
  };
  
  const getCompatibleNumbers = (lifePath: number): number[] => {
    const compatible: { [key: number]: number[] } = {
      1: [3, 5, 6], 2: [4, 6, 8], 3: [1, 5, 9], 4: [2, 6, 8], 5: [1, 3, 7],
      6: [1, 2, 4], 7: [5, 9], 8: [2, 4, 6], 9: [3, 7]
    };
    return compatible[lifePath] || [1, 5, 9];
  };
  
  const getChallengeNumbers = (lifePath: number): number[] => {
    const challenges: { [key: number]: number[] } = {
      1: [4, 8], 2: [7, 9], 3: [4, 7], 4: [1, 3, 5], 5: [4, 6, 8],
      6: [5, 7], 7: [2, 3, 6], 8: [1, 5, 9], 9: [2, 8]
    };
    return challenges[lifePath] || [4, 8];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Professional Numerology Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Discover your life path, destiny, and personal numbers
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name (as on birth certificate)
              </Label>
              <Input
                id="fullName"
                placeholder="e.g., John Michael Smith"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Birth Date
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentYear">Current Year (for Personal Year calculation)</Label>
            <Input
              id="currentYear"
              type="number"
              value={formData.currentYear}
              onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
              className="w-32"
            />
          </div>

          <Button
            onClick={calculateNumerology}
            disabled={!formData.fullName || !formData.birthDate || isCalculating}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Hash className="h-4 w-4 mr-2" />
                Calculate Numerology Profile
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {profile && (
        <Tabs defaultValue="core" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="core">Core Numbers</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="guidance">Life Guidance</TabsTrigger>
            <TabsTrigger value="timing">Current Year</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Life Path Number
                    </span>
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {profile.lifePath.number}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-medium">{profile.lifePath.meaning}</p>
                  <div>
                    <h4 className="font-medium mb-2">Key Traits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.lifePath.traits.map((trait, index) => (
                        <Badge key={index} variant="secondary">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Destiny Number</span>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {profile.destiny.number}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{profile.destiny.meaning}</p>
                  <p className="font-medium">{profile.destiny.purpose}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>Soul Urge</span>
                      <Badge variant="outline">{profile.soulUrge.number}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profile.soulUrge.motivation}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span>Personality</span>
                      <Badge variant="outline">{profile.personality.number}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{profile.personality.impression}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Birth Day Number: {profile.birthDay.number}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{profile.birthDay.meaning}</p>
                  <div>
                    <h4 className="font-medium mb-2">Special Talents:</h4>
                    <ul className="space-y-1">
                      {profile.birthDay.specialTalents.map((talent, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-purple-600">•</span>
                          {talent}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maturity Number: {profile.maturity.number}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3">{profile.maturity.meaning}</p>
                  <div>
                    <h4 className="font-medium mb-2">Later Life Themes:</h4>
                    <ul className="space-y-1">
                      {profile.maturity.laterLifeThemes.map((theme, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-blue-600">•</span>
                          {theme}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guidance" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Career Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Recommended Career Paths:</h4>
                      <div className="flex flex-wrap gap-1">
                        {profile.lifePath.careerSuggestions.map((career, index) => (
                          <Badge key={index} variant="secondary">{career}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Life Challenges & Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {profile.lifePath.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Personal Year {formData.currentYear}
                  </span>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    {profile.personalYear.number}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Theme: {profile.personalYear.theme}</h3>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Opportunities This Year:</h4>
                  <ul className="space-y-1">
                    {profile.personalYear.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Guidance for This Year:</h4>
                  <ul className="space-y-1">
                    {profile.personalYear.guidance.map((guide, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Number Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Your Lucky Numbers:</h4>
                    <div className="flex gap-2">
                      {profile.luckyNumbers.map((num, index) => (
                        <Badge key={index} variant="default" className="px-3 py-1">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Most Compatible Life Path Numbers:</h4>
                    <div className="flex gap-2">
                      {profile.compatibleNumbers.map((num, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Challenge Numbers (require extra effort):</h4>
                    <div className="flex gap-2">
                      {profile.challengeNumbers.map((num, index) => (
                        <Badge key={index} variant="outline" className="px-3 py-1">
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}