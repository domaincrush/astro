
/**
 * Enhanced Panchang Routes - ProKerala Standard Alignment
 * Implements the standardized calculation system
 */

import { Router, Request, Response } from 'express';
import { SwissEphemerisEnhanced } from './swiss-ephemeris-enhanced';

const router = Router();

/**
 * Get enhanced daily Panchang with ProKerala-level accuracy
 */
router.post('/daily-enhanced', async (req: Request, res: Response) => {
  try {
    const { date, latitude, longitude, timezone } = req.body;

    if (!date || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, latitude, longitude'
      });
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    
    if (lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        error: 'Latitude must be between -90 and 90 degrees'
      });
    }

    if (lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        error: 'Longitude must be between -180 and 180 degrees'
      });
    }

    // Calculate enhanced Panchang
    const result = SwissEphemerisEnhanced.calculateEnhancedPanchang(
      date,
      lat,
      lon,
      timezone || 'Asia/Kolkata'
    );

    // Add calculation metadata
    const enhancedResult = {
      ...result,
      metadata: {
        calculationMethod: 'Swiss Ephemeris Enhanced',
        accuracy: 'ProKerala Standard',
        ayanamsa: 'Lahiri',
        calculatedAt: new Date().toISOString(),
        version: '2.0.0'
      }
    };

    res.json(enhancedResult);

  } catch (error) {
    console.error('Enhanced Panchang calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during Panchang calculation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get Panchang for multiple days with enhanced accuracy
 */
router.post('/range-enhanced', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, latitude, longitude, timezone } = req.body;

    if (!startDate || !endDate || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: startDate, endDate, latitude, longitude'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Limit range to prevent excessive computation
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 31) {
      return res.status(400).json({
        success: false,
        error: 'Date range cannot exceed 31 days'
      });
    }

    const results = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const panchang = SwissEphemerisEnhanced.calculateEnhancedPanchang(
        dateStr,
        lat,
        lon,
        timezone || 'Asia/Kolkata'
      );
      
      results.push(panchang);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      dateRange: { startDate, endDate },
      location: { latitude: lat, longitude: lon, timezone: timezone || 'Asia/Kolkata' },
      count: results.length,
      panchangData: results,
      metadata: {
        calculationMethod: 'Swiss Ephemeris Enhanced',
        accuracy: 'ProKerala Standard',
        calculatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Enhanced Panchang range calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during range calculation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get current Panchang for user's location
 */
router.get('/current-enhanced', async (req: Request, res: Response) => {
  try {
    const { lat, lon, tz } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Missing coordinates: lat and lon query parameters required'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    const timezone = (tz as string) || 'Asia/Kolkata';

    // Get current date in the specified timezone
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];

    const result = SwissEphemerisEnhanced.calculateEnhancedPanchang(
      currentDate,
      latitude,
      longitude,
      timezone
    );

    res.json({
      ...result,
      metadata: {
        calculationMethod: 'Swiss Ephemeris Enhanced',
        accuracy: 'ProKerala Standard',
        calculatedAt: now.toISOString(),
        currentTime: now.toLocaleString('en-IN', { timeZone: timezone })
      }
    });

  } catch (error) {
    console.error('Current enhanced Panchang error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Validate Panchang calculation against reference data
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { date, latitude, longitude, referenceData } = req.body;

    if (!date || !latitude || !longitude || !referenceData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for validation'
      });
    }

    const calculated = SwissEphemerisEnhanced.calculateEnhancedPanchang(
      date,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    // Compare with reference data
    const comparison = {
      tithi: {
        calculated: calculated.panchang.tithi.name,
        reference: referenceData.tithi,
        match: calculated.panchang.tithi.name === referenceData.tithi
      },
      nakshatra: {
        calculated: calculated.panchang.nakshatra.name,
        reference: referenceData.nakshatra,
        match: calculated.panchang.nakshatra.name === referenceData.nakshatra
      },
      yoga: {
        calculated: calculated.panchang.yoga.name,
        reference: referenceData.yoga,
        match: calculated.panchang.yoga.name === referenceData.yoga
      },
      timings: {
        sunrise: {
          calculated: calculated.timings.sunrise,
          reference: referenceData.sunrise,
          match: Math.abs(
            new Date(`1970-01-01T${calculated.timings.sunrise}:00`).getTime() -
            new Date(`1970-01-01T${referenceData.sunrise}:00`).getTime()
          ) <= 300000 // 5 minutes tolerance
        }
      }
    };

    res.json({
      success: true,
      validation: comparison,
      calculatedData: calculated,
      accuracy: {
        overall: Object.values(comparison).filter(item => 
          typeof item === 'object' && 'match' in item && item.match
        ).length / Object.keys(comparison).length * 100
      }
    });

  } catch (error) {
    console.error('Panchang validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
