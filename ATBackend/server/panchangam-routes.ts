import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Calculate Panchangam using authentic Jyotisha calculations
 */
export const calculatePanchangam = async (req: Request, res: Response) => {
  try {
    const { date, time, latitude, longitude, timezone = 'Asia/Kolkata' } = req.body;

    // Validate input
    if (!date || !time || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: date, time, latitude, longitude'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid time format. Use HH:MM'
      });
    }

    // Validate coordinates
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180'
      });
    }

    // Execute Python Jyotisha calculator
    const pythonScript = path.join(__dirname, 'jyotisha-panchangam.py');
    const args = [pythonScript, date, time, latitude.toString(), longitude.toString(), timezone];

    const pythonProcess = spawn('python3', args);
    
    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', stderr);
        return res.status(500).json({
          success: false,
          error: `Calculation failed: ${stderr}`,
          code
        });
      }

      try {
        const result = JSON.parse(stdout);
        res.json(result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({
          success: false,
          error: 'Failed to parse calculation results',
          raw_output: stdout
        });
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Process error:', error);
      res.status(500).json({
        success: false,
        error: `Process execution failed: ${error.message}`
      });
    });

  } catch (error) {
    console.error('Panchangam calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

/**
 * Calculate Panchangam for multiple days
 */
export const calculateMultipleDaysPanchangam = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date, time = '06:00', latitude, longitude, timezone = 'Asia/Kolkata' } = req.body;

    // Validate input
    if (!start_date || !end_date || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: start_date, end_date, latitude, longitude'
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date must be before end date'
      });
    }

    // Limit to 31 days maximum
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 31) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 31 days allowed'
      });
    }

    const results = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      try {
        // Calculate for each day
        const pythonScript = path.join(__dirname, 'jyotisha-panchangam.py');
        const args = [pythonScript, dateStr, time, latitude.toString(), longitude.toString(), timezone];

        const result = await new Promise((resolve, reject) => {
          const pythonProcess = spawn('python3', args);
          let stdout = '';
          let stderr = '';

          pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
          });

          pythonProcess.on('close', (code) => {
            if (code !== 0) {
              reject(new Error(`Python script failed: ${stderr}`));
              return;
            }

            try {
              const parsed = JSON.parse(stdout);
              resolve(parsed);
            } catch (parseError) {
              reject(new Error(`JSON parse error: ${parseError}`));
            }
          });

          pythonProcess.on('error', (error) => {
            reject(error);
          });
        });

        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          date: dateStr,
          error: error instanceof Error ? error.message : 'Calculation failed'
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      start_date,
      end_date,
      total_days: results.length,
      results
    });

  } catch (error) {
    console.error('Multiple days Panchangam calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};