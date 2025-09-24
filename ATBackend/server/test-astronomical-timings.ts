
import { Router, Request, Response } from 'express';
import { EnhancedAstronomicalTimings } from './enhanced-astronomical-timings';

const router = Router();

/**
 * Test astronomical timings for any date and location
 */
router.get('/test-timings', (req: Request, res: Response) => {
  try {
    const { date, lat, lon } = req.query;
    
    if (!date || !lat || !lon) {
      return res.status(400).json({
        error: 'Missing required parameters: date, lat, lon'
      });
    }
    
    const testDate = new Date(date as string);
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    
    // Calculate timings
    const timings = EnhancedAstronomicalTimings.calculateAllTimings(testDate, latitude, longitude);
    
    // Validate against known sources
    const validation = EnhancedAstronomicalTimings.validateTimings(testDate, latitude, longitude);
    
    res.json({
      success: true,
      date: date,
      location: { latitude, longitude },
      timings,
      validation,
      comparison: {
        prokerala: "Compare with ProKerala for validation",
        astrosage: "Compare with AstroSage for validation",
        drikPanchang: "Compare with Drik Panchang for validation"
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Calculation failed',
      details: error.message
    });
  }
});

/**
 * Chennai specific timing test (for easy validation)
 */
router.get('/chennai-timings/:date', (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const testDate = new Date(date);
    
    const timings = EnhancedAstronomicalTimings.getChennaiTimings(testDate);
    
    res.json({
      success: true,
      date,
      location: "Chennai, Tamil Nadu, India",
      coordinates: { latitude: 13.0827, longitude: 80.2707 },
      timings,
      note: "Compare these values with ProKerala Chennai data for validation"
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Chennai timing calculation failed',
      details: error.message
    });
  }
});

export default router;
