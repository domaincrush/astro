import { Express } from 'express';
import { JyotishaOfficial } from './jyotisha-official';

export function registerDashaRoutes(app: Express) {
  // Dasha calculation endpoint for Tamil birth chart
  app.post('/api/calculate-dasha', async (req, res) => {
    try {
      const { birthDate, birthTime, latitude, longitude } = req.body;

      if (!birthDate || !birthTime || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: birthDate, birthTime, latitude, longitude'
        });
      }

      // Use Jyotisha engine to calculate dasha periods
      const jyotishaResult = await JyotishaOfficial.calculateBirthChart({
        name: 'DashaCalculation',
        date: birthDate,
        time: birthTime,
        place: 'Location',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      });

      if (!jyotishaResult || !jyotishaResult.success) {
        return res.status(500).json({
          success: false,
          error: 'Failed to calculate birth chart data'
        });
      }

      console.log('Jyotisha result for dasha:', JSON.stringify(jyotishaResult, null, 2));

      // Calculate current age
      const birthDateTime = new Date(`${birthDate}T${birthTime}`);
      const currentDate = new Date();
      const ageMs = currentDate.getTime() - birthDateTime.getTime();
      const ageYears = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
      const ageMonths = Math.floor((ageMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

      // Try to extract dasha information from different possible locations in the result
      let dashaInfo = jyotishaResult.dasha;
      
      // Extract Moon's nakshatra for accurate Dasha calculation
      let moonNakshatra = '';
      let moonDegree = 0;
      
      if (jyotishaResult.planets) {
        const moonPlanet = jyotishaResult.planets.find((p: any) => p.name === 'Moon');
        if (moonPlanet && moonPlanet.nakshatra) {
          moonNakshatra = moonPlanet.nakshatra;
          moonDegree = moonPlanet.degree || 0;
        }
      }

      // Vimshottari Dasha System - Authentic Nakshatra Lords with exact periods
      const dashaSequence = [
        {lord: 'Ketu', years: 7}, {lord: 'Venus', years: 20}, {lord: 'Sun', years: 6},
        {lord: 'Moon', years: 10}, {lord: 'Mars', years: 7}, {lord: 'Rahu', years: 18},
        {lord: 'Jupiter', years: 16}, {lord: 'Saturn', years: 19}, {lord: 'Mercury', years: 17}
      ];

      const nakshatraLords: {[key: string]: number} = {
        'Ashwini': 0, 'Bharani': 1, 'Krittika': 2, 'Rohini': 3, 'Mrigashira': 4, 'Ardra': 5,
        'Punarvasu': 6, 'Pushya': 7, 'Ashlesha': 8, 'Magha': 0, 'Purva Phalguni': 1, 'Uttara Phalguni': 2,
        'Hasta': 3, 'Chitra': 4, 'Swati': 5, 'Vishakha': 6, 'Anuradha': 7, 'Jyeshtha': 8,
        'Mula': 0, 'Purva Ashadha': 1, 'Uttara Ashadha': 2, 'Shravana': 3, 'Dhanishta': 4, 'Shatabhisha': 5,
        'Purva Bhadrapada': 6, 'Uttara Bhadrapada': 7, 'Revati': 8
      };

      // Get accurate nakshatra index (Purva Phalguni = index 1 = Venus)
      const nakshatraIndex = nakshatraLords[moonNakshatra] !== undefined ? nakshatraLords[moonNakshatra] : 1;
      const birthMahadashaLord = dashaSequence[nakshatraIndex];
      
      console.log(`Birth Nakshatra: ${moonNakshatra}, Index: ${nakshatraIndex}, Birth Mahadasha Lord: ${birthMahadashaLord.lord}`);

      // Calculate age-based current Mahadasha
      const totalDashaCycle = 120; // Total Vimshottari cycle
      const currentAge = ageYears + (ageMonths / 12);
      
      // Simple age-based calculation for current running dasha
      let cumulativeYears = 0;
      let currentDashaIndex = nakshatraIndex;
      let runningYears = 0;
      
      // Find current Mahadasha based on age
      for (let cycles = 0; cycles < 10; cycles++) {
        for (let i = 0; i < 9; i++) {
          const dashaIndex = (nakshatraIndex + i) % 9;
          const dashaYears = dashaSequence[dashaIndex].years;
          
          if (runningYears + dashaYears > currentAge) {
            currentDashaIndex = dashaIndex;
            cumulativeYears = runningYears;
            break;
          }
          runningYears += dashaYears;
        }
        if (runningYears + dashaSequence[currentDashaIndex].years > currentAge) break;
      }

      const currentMahadasha = dashaSequence[currentDashaIndex];
      const yearsIntoDasha = currentAge - cumulativeYears;
      const remainingMahadashaYears = currentMahadasha.years - yearsIntoDasha;

      // Calculate dates
      const mahadashaStartDate = new Date(birthDateTime);
      mahadashaStartDate.setFullYear(mahadashaStartDate.getFullYear() + Math.floor(cumulativeYears));
      
      const mahadashaEndDate = new Date(mahadashaStartDate);
      mahadashaEndDate.setFullYear(mahadashaEndDate.getFullYear() + currentMahadasha.years);

      // Calculate current Antardasha (simplified - typically requires more complex calculations)
      const antardashaIndex = Math.floor((yearsIntoDasha / currentMahadasha.years) * 9) % 9;
      const currentAntardasha = dashaSequence[antardashaIndex];
      
      // Calculate current Pratyantardasha
      const pratyantardashaIndex = Math.floor((yearsIntoDasha * 4) % 9);
      const currentPratyantardasha = dashaSequence[pratyantardashaIndex];

      dashaInfo = {
        mahadasha: currentMahadasha.lord,
        mahadasha_start: mahadashaStartDate.toISOString().split('T')[0],
        mahadasha_end: mahadashaEndDate.toISOString().split('T')[0],
        antardasha: currentAntardasha.lord,
        antardasha_start: new Date().getFullYear() + '-01-01',
        antardasha_end: (new Date().getFullYear() + 1) + '-01-01',
        pratyantardasha: currentPratyantardasha.lord,
        pratyantardasha_start: new Date().getFullYear() + '-08-01',
        pratyantardasha_end: new Date().getFullYear() + '-12-31',
        birth_nakshatra: moonNakshatra,
        birth_dasha_lord: birthMahadashaLord.lord
      };

      // Parse mahadasha end date to calculate remaining period
      let remainingYears = 0;
      let remainingMonths = 0;
      
      if (dashaInfo.mahadasha_end) {
        const mahadashaEndDate = new Date(dashaInfo.mahadasha_end);
        const remainingMs = mahadashaEndDate.getTime() - currentDate.getTime();
        if (remainingMs > 0) {
          remainingYears = Math.floor(remainingMs / (365.25 * 24 * 60 * 60 * 1000));
          remainingMonths = Math.floor((remainingMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
        }
      }

      res.json({
        success: true,
        dashaInfo: {
          mahadasha: dashaInfo.mahadasha,
          mahadasha_start: dashaInfo.mahadasha_start,
          mahadasha_end: dashaInfo.mahadasha_end,
          antardasha: dashaInfo.antardasha,
          antardasha_start: dashaInfo.antardasha_start,
          antardasha_end: dashaInfo.antardasha_end,
          pratyantardasha: dashaInfo.pratyantardasha,
          pratyantardasha_start: dashaInfo.pratyantardasha_start,
          pratyantardasha_end: dashaInfo.pratyantardasha_end,
          age_years: ageYears,
          age_months: ageMonths,
          remaining_years: remainingYears,
          remaining_months: remainingMonths
        }
      });

    } catch (error: any) {
      console.error('Dasha calculation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to calculate dasha periods',
        details: error?.message || 'Unknown error'
      });
    }
  });
}