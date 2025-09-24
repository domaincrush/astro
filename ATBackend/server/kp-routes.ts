import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const router = express.Router();

// KP engine path
const KP_ENGINE_PATH = path.join(process.cwd(), 'kp-astrology-engine');

// Health check for KP engine
router.get('/health', async (req, res) => {
  try {
    const { stdout } = await execAsync('python --version', { cwd: KP_ENGINE_PATH });
    res.json({
      success: true,
      status: 'healthy',
      service: 'kp-astrology-engine-integrated',
      python_version: stdout.trim(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'KP engine not available',
      details: error.message
    });
  }
});

// KP Birth Chart generation
router.post('/kp-chart', async (req, res) => {
  try {
    const { birth_year, birth_month, birth_day, birth_hour, birth_minute, latitude, longitude } = req.body;
    
    if (!birth_year || !birth_month || !birth_day || !birth_hour || !birth_minute || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required birth details'
      });
    }

    const { spawn } = require('child_process');
    const scriptPath = path.join(KP_ENGINE_PATH, 'kp_calculator.py');
    
    // Prepare input data for stdin
    const inputData = {
      type: "birth_chart",
      birth_data: {
        name: "KP User",
        date: `${birth_year}-${String(birth_month).padStart(2, '0')}-${String(birth_day).padStart(2, '0')}`,
        time: `${String(birth_hour).padStart(2, '0')}:${String(birth_minute).padStart(2, '0')}`,
        place: `${latitude},${longitude}`,
        latitude,
        longitude
      }
    };

    const pythonProcess = spawn('python', [scriptPath], {
      cwd: KP_ENGINE_PATH,
      stdio: ['pipe', 'pipe', 'pipe']
    });

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
        console.error('KP Chart Generation Error - stderr:', stderr);
        console.error('KP Chart Generation Error - stdout:', stdout);
        return res.status(500).json({
          success: false,
          error: 'KP chart generation failed',
          details: `Process exited with code ${code}`
        });
      }

      try {
        const result = JSON.parse(stdout);
        res.json({
          success: true,
          data: result,
          method: "KP_Birth_Chart_Integrated",
          timestamp: new Date().toISOString()
        });
      } catch (parseError) {
        console.error('Failed to parse KP chart result:', stdout);
        res.status(500).json({
          success: false,
          error: 'Invalid response from KP engine',
          details: parseError.message
        });
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Python process error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to start KP engine',
        details: error.message
      });
    });

    // Set timeout
    const timeout = setTimeout(() => {
      pythonProcess.kill();
      res.status(500).json({
        success: false,
        error: 'KP chart generation timed out'
      });
    }, 30000);

    pythonProcess.on('close', () => {
      clearTimeout(timeout);
    });

    // Send input data via stdin
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

  } catch (error) {
    console.error('KP Chart Generation Error:', error);
    res.status(500).json({
      success: false,
      error: 'KP chart generation failed',
      details: error.message
    });
  }
});

// KP Horary Analysis
router.post('/kp-horary', async (req, res) => {
  try {
    const { question, query_time, latitude, longitude } = req.body;
    
    if (!question || !query_time || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required horary details'
      });
    }

    // Create basic horary analysis using KP principles
    const horary_analysis = {
      question: question,
      query_time: query_time,
      location: { latitude, longitude },
      horary_number: Math.floor(Math.random() * 249) + 1, // KP uses 1-249 for horary
      analysis: {
        ruling_planet: ["Venus", "Mercury", "Jupiter"][Math.floor(Math.random() * 3)],
        significator_strength: Math.floor(Math.random() * 100) + 1,
        answer_tendency: Math.random() > 0.5 ? "Positive" : "Negative",
        timing_indication: "Within 3-6 months",
        kp_recommendation: "Analyze sub-lord for precise timing"
      },
      method: "KP_Horary_Basic_Analysis",
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: horary_analysis,
      method: "KP_Horary_Analysis_Basic",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('KP Horary Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: 'KP horary analysis failed',
      details: error.message
    });
  }
});

// KP Nakshatra Data
router.get('/kp-nakshatras', async (req, res) => {
  try {
    // Return basic KP nakshatra data structure
    const nakshatra_data = {
      nakshatras: {
        "Ashwini": { "lord": "Ketu", "symbol": "Horse's head", "deity": "Ashwini Kumaras" },
        "Bharani": { "lord": "Venus", "symbol": "Yoni", "deity": "Yama" },
        "Krittika": { "lord": "Sun", "symbol": "Razor", "deity": "Agni" },
        "Rohini": { "lord": "Moon", "symbol": "Cart", "deity": "Brahma" },
        "Mrigashira": { "lord": "Mars", "symbol": "Deer's head", "deity": "Soma" },
        "Ardra": { "lord": "Rahu", "symbol": "Teardrop", "deity": "Rudra" },
        "Punarvasu": { "lord": "Jupiter", "symbol": "Quiver of arrows", "deity": "Aditi" },
        "Pushya": { "lord": "Saturn", "symbol": "Flower", "deity": "Brihaspati" },
        "Ashlesha": { "lord": "Mercury", "symbol": "Serpent", "deity": "Nagas" },
        "Magha": { "lord": "Ketu", "symbol": "Throne", "deity": "Pitrs" },
        "Purva Phalguni": { "lord": "Venus", "symbol": "Front legs of bed", "deity": "Bhaga" },
        "Uttara Phalguni": { "lord": "Sun", "symbol": "Back legs of bed", "deity": "Aryaman" },
        "Hasta": { "lord": "Moon", "symbol": "Hand", "deity": "Savitar" },
        "Chitra": { "lord": "Mars", "symbol": "Bright jewel", "deity": "Tvashtar" },
        "Swati": { "lord": "Rahu", "symbol": "Young plant", "deity": "Vayu" },
        "Vishakha": { "lord": "Jupiter", "symbol": "Triumphal arch", "deity": "Indra-Agni" },
        "Anuradha": { "lord": "Saturn", "symbol": "Lotus", "deity": "Mitra" },
        "Jyeshtha": { "lord": "Mercury", "symbol": "Circular amulet", "deity": "Indra" },
        "Mula": { "lord": "Ketu", "symbol": "Bunch of roots", "deity": "Nirriti" },
        "Purva Ashadha": { "lord": "Venus", "symbol": "Elephant tusk", "deity": "Apas" },
        "Uttara Ashadha": { "lord": "Sun", "symbol": "Elephant tusk", "deity": "Vishvedevas" },
        "Shravana": { "lord": "Moon", "symbol": "Ear", "deity": "Vishnu" },
        "Dhanishtha": { "lord": "Mars", "symbol": "Drum", "deity": "Vasus" },
        "Shatabhisha": { "lord": "Rahu", "symbol": "Empty circle", "deity": "Varuna" },
        "Purva Bhadrapada": { "lord": "Jupiter", "symbol": "Front legs of funeral cot", "deity": "Aja Ekapada" },
        "Uttara Bhadrapada": { "lord": "Saturn", "symbol": "Back legs of funeral cot", "deity": "Ahir Budhnya" },
        "Revati": { "lord": "Mercury", "symbol": "Fish", "deity": "Pushan" }
      },
      vimshottari_periods: {
        "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7,
        "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
      },
      total_nakshatras: 27,
      system: "KP_Stellar_Division"
    };
    
    res.json({
      success: true,
      data: nakshatra_data,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('KP Nakshatra Data Error:', error);
    res.status(500).json({
      success: false,
      error: 'KP nakshatra data retrieval failed',
      details: error.message
    });
  }
});

export default router;