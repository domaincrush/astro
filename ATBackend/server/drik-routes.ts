import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Execute Drik Panchang calculation
 */
async function executeDrikPanchang(date: string, latitude: number, longitude: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const enginePath = 'server/drik-panchang-corrected.py';
    
    // Execute Python engine with arguments
    const pythonProcess = spawn('python3', [enginePath, date, latitude.toString(), longitude.toString(), 'Asia/Kolkata'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    // Collect output
    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(stdout);
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse Drik Panchang output: ${parseError}`));
        }
      } else {
        reject(new Error(`Drik Panchang engine exited with code ${code}: ${stderr}`));
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Drik Panchang engine: ${error}`));
    });
  });
}

/**
 * Drik Panchang API endpoint handler
 */
export async function handleDrikPanchang(req: Request, res: Response) {
  try {
    const { date, latitude, longitude } = req.body;
    
    if (!date || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: date, latitude, longitude'
      });
    }
    
    const result = await executeDrikPanchang(date, latitude, longitude);
    
    // Check if hardcoded values were detected
    if (result && result.error === "HARDCODED_VALUES_DETECTED") {
      return res.status(400).json({
        success: false,
        error: "HARDCODED_VALUES_DETECTED",
        message: "Panchang calculation failed due to hardcoded values detected in the system",
        hardcoded_values: result.hardcoded_values,
        detection_report: result.detection_report,
        recommendation: "All astronomical calculations must use dynamic Swiss Ephemeris data. No hardcoded timing values are allowed."
      });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Drik Panchang calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate Drik Panchang',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}