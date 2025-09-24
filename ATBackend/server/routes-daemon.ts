/**
 * Daemon Service Routes
 * High-performance API endpoints using Jyotisha daemon
 */

import { Router } from 'express';
import { daemonClient, calculateBirthChartDaemon, isDaemonServiceAvailable } from './daemon-client.js';

const router = Router();

// Health check for daemon service
router.get('/daemon/health', async (req, res) => {
  try {
    const isHealthy = await isDaemonServiceAvailable();
    res.json({
      success: true,
      daemon_available: isHealthy,
      message: isHealthy ? 'Daemon service operational' : 'Daemon service unavailable',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check daemon health',
      message: error.message
    });
  }
});

// High-performance birth chart generation
router.post('/daemon/birth-chart', async (req, res) => {
  try {
    const { name, date, time, location, latitude, longitude, timezone } = req.body;

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const birthDetails = {
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude,
      timezone: timezone || 'Asia/Kolkata'
    };

    const result = await calculateBirthChartDaemon(birthDetails);

    if (result) {
      res.json({
        success: true,
        ...result,
        performance_method: 'jyotisha_daemon_service'
      });
    } else {
      throw new Error('Daemon calculation failed');
    }
  } catch (error) {
    console.error('Daemon birth chart error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message,
      fallback_available: true
    });
  }
});

// High-performance dasha timeline
router.post('/daemon/dasha-timeline', async (req, res) => {
  try {
    const { name, date, time, latitude, longitude } = req.body;
    
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const birthDetails = {
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude
    };

    const result = await daemonClient.calculateDashaTimeline(birthDetails);

    if (result) {
      res.json({
        success: true,
        ...result,
        performance_method: 'jyotisha_daemon_service'
      });
    } else {
      throw new Error('Daemon dasha calculation failed');
    }
  } catch (error) {
    console.error('Daemon dasha timeline error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message
    });
  }
});

// High-performance nakshatra calculation
router.post('/daemon/nakshatra', async (req, res) => {
  try {
    const { date, time, latitude, longitude } = req.body;
    
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const birthDetails = {
      name: 'Nakshatra Query',
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude
    };

    const result = await daemonClient.calculateNakshatra(birthDetails);

    if (result) {
      res.json({
        success: true,
        ...result,
        performance_method: 'jyotisha_daemon_service'
      });
    } else {
      throw new Error('Daemon nakshatra calculation failed');
    }
  } catch (error) {
    console.error('Daemon nakshatra error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message
    });
  }
});

// High-performance premium report generation
router.post('/daemon/premium-report', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Use daemon service for initial calculations
    const { name, date, time, location, latitude, longitude, timezone } = req.body;
    
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const birthDetails = {
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude,
      longitude,
      timezone: timezone || 'Asia/Kolkata'
    };

    // Get high-performance birth chart from daemon
    const birthChart = await calculateBirthChartDaemon(birthDetails);
    
    if (!birthChart) {
      throw new Error('Failed to calculate birth chart via daemon');
    }

    // For now, return enhanced birth chart data
    // Premium report integration would be added here
    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      birth_chart: birthChart,
      performance_metrics: {
        response_time_ms: responseTime,
        calculation_method: 'jyotisha_daemon_service',
        memory_efficient: true
      },
      note: 'High-performance calculation via daemon service',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Daemon premium report error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message,
      fallback_recommendation: 'Use standard premium report API'
    });
  }
});

// High-performance premium report generation with intelligent fallback
router.post('/premium-report/generate', async (req, res) => {
  const startTime = Date.now();
  let calculationMethod = 'original_premium_report_fallback';
  
  try {
    // Support both parameter formats for compatibility
    const name = req.body.name;
    const dateOfBirth = req.body.dateOfBirth || req.body.date;
    const timeOfBirth = req.body.timeOfBirth || req.body.time;
    const placeOfBirth = req.body.placeOfBirth || req.body.location || req.body.place;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const template = req.body.template || req.body.reportType;
    const gender = req.body.gender;

    if (!dateOfBirth || !timeOfBirth) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters',
        message: 'Date and time are required'
      });
    }

    let inputData = {
      name,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      template: template || 'super_horoscope',
      gender: gender || 'male'
    };

    // Try daemon service first for enhanced performance
    try {
      const isDaemonAvailable = await isDaemonServiceAvailable();
      
      if (isDaemonAvailable) {
        console.log('Daemon service available - attempting high-performance premium report generation');
        
        // Parse date and time for daemon
        const [year, month, day] = dateOfBirth.split('-').map(Number);
        const [hour, minute] = timeOfBirth.split(':').map(Number);

        const birthDetails = {
          name,
          year,
          month,
          day,
          hour,
          minute,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone: 'Asia/Kolkata'
        };

        // Get high-performance birth chart from daemon
        const birthChart = await calculateBirthChartDaemon(birthDetails);
        
        if (birthChart) {
          inputData.daemon_birth_chart = birthChart;
          calculationMethod = 'jyotisha_daemon_service_premium';
          console.log('Daemon birth chart successfully obtained for premium report');
        } else {
          throw new Error('Daemon chart calculation failed');
        }
      } else {
        throw new Error('Daemon service not available');
      }
    } catch (daemonError) {
      console.log('Daemon service unavailable for premium report, using fallback:', daemonError.message);
      calculationMethod = 'original_premium_report_fallback';
    }

    // Call premium report engine (with daemon data if available, otherwise fallback)
    const { spawn } = await import('child_process');
    const pythonProcess = spawn('python3', ['server/premium-report-engine.py'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      const responseTime = Date.now() - startTime;
      
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          res.json({
            success: true,
            report: result.report || result,
            performance_metrics: {
              response_time_ms: responseTime,
              calculation_method: calculationMethod,
              memory_efficient: calculationMethod === 'jyotisha_daemon_service_premium',
              report_size: JSON.stringify(result.report || result).length
            },
            timestamp: new Date().toISOString()
          });
        } catch (parseError) {
          res.status(500).json({
            success: false,
            error: 'Report generation completed but response parsing failed',
            details: parseError.message,
            calculation_method: calculationMethod
          });
        }
      } else {
        res.status(500).json({
          success: false,
          error: 'Premium report generation failed',
          details: stderr || 'Unknown error',
          exit_code: code,
          calculation_method: calculationMethod
        });
      }
    });

  } catch (error) {
    console.error('Daemon premium report error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message,
      fallback_recommendation: 'Use standard premium report API'
    });
  }
});

// High-performance Kundli generation - NOW ACTIVE  
router.post('/ephemeris', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { name, date, time, latitude, longitude, place } = req.body;

    // Parse date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const birthDetails = {
      name,
      year,
      month,
      day,
      hour,
      minute,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone: 'Asia/Kolkata'
    };

    // Get high-performance birth chart from daemon
    const result = await calculateBirthChartDaemon(birthDetails);
    
    if (!result || !result.success) {
      throw new Error('Failed to calculate birth chart via daemon');
    }

    const responseTime = Date.now() - startTime;

    // Convert daemon format to expected API format
    const planets = [];
    if (result.planetary_positions) {
      for (const [planetName, planetData] of Object.entries(result.planetary_positions)) {
        planets.push({
          name: planetName,
          longitude: planetData.longitude,
          sign: planetData.sign,
          house: planetData.house,
          degree: planetData.degree,
          nakshatra: planetData.nakshatra || 'Unknown'
        });
      }
    }

    res.json({
      success: true,
      birth_details: result.birth_details,
      planets: planets,
      calculation_method: 'jyotisha_daemon_service',
      performance_metrics: {
        response_time_ms: responseTime,
        memory_efficient: true
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Daemon Kundli generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Daemon service error',
      message: error.message,
      fallback_recommendation: 'Use standard ephemeris API'
    });
  }
});

export { router as daemonRoutes };