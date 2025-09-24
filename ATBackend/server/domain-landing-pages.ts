import { Request, Response } from 'express';

interface DomainLandingConfig {
  domain: string;
  title: string;
  description: string;
  language: string;
  primaryColor: string;
  secondaryColor: string;
  specialization: string[];
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  cta: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  footer: string;
}

const DOMAIN_LANDING_CONFIGS: { [key: string]: DomainLandingConfig } = {
  'astrotelugu.com': {
    domain: 'astrotelugu.com',
    title: 'Telugu Jyotishyam - తెలుగు జ్యోతిష్యం',
    description: 'వైదిక జ్యోతిష్య సేవలు తెలుగులో - సంపూర్ణ జాతక విశ్లేషణ మరియు భవిష్యత్తు అంచనలు',
    language: 'telugu',
    primaryColor: '#FF6B35',
    secondaryColor: '#004225',
    specialization: ['vedic', 'traditional', 'telugu'],
    features: [
      {
        title: '🎯 ఉచిత జాతకం',
        description: 'వైదిక గణనలతో మీ జన్మ జాతకం తక్షణమే రూపొందించుకోండి',
        icon: '🎯'
      },
      {
        title: '💑 జాతక మిలన',
        description: 'వివాహానికి గుణ మిలన మరియు మాంగల్య దోష పరిశీలన',
        icon: '💑'
      },
      {
        title: '📅 పంచాంగం',
        description: 'రోజువారీ తిథి, నక్షత్రం, యోగ, కరణ మరియు శుభ సమయాలు',
        icon: '📅'
      },
      {
        title: '🔮 జ్యోతిష్క సేవ',
        description: 'అనుభవజ్ఞుల జ్యోతిష్కుల నుండి చాట్, కాల్ లేదా వీడియో కాల్ ద్వారా సలహాలు',
        icon: '🔮'
      }
    ],
    cta: {
      primary: '🎯 జాతకం రూపొందించండి',
      secondary: '💑 జాతక మిలన చేయండి',
      tertiary: '🔮 జ్యోతిష్కులతో మాట్లాడండి'
    },
    footer: '© 2025 Telugu Jyotishyam - అన్ని హక్కులు సురక్షితం - ప్రామాణిక వైదిక జ్యోతిష్య సేవలు'
  },

  'indiahoroscope.com': {
    domain: 'indiahoroscope.com',
    title: 'India Horoscope - Daily, Weekly & Monthly Predictions',
    description: 'Free daily horoscope predictions based on authentic Vedic astrology calculations',
    language: 'english',
    primaryColor: '#FF6B00',
    secondaryColor: '#138808',
    specialization: ['horoscope', 'daily', 'predictions'],
    features: [
      {
        title: '🌅 Daily Horoscope',
        description: 'Get your daily horoscope with accurate planetary positions and predictions',
        icon: '🌅'
      },
      {
        title: '📅 Weekly Forecast',
        description: 'Comprehensive weekly horoscope analysis with detailed planetary movements',
        icon: '📅'
      },
      {
        title: '🗓️ Monthly Predictions',
        description: 'Monthly horoscope forecasts with major life area analysis',
        icon: '🗓️'
      },
      {
        title: '🎯 Birth Chart Analysis',
        description: 'Complete birth chart analysis with planetary positions and house analysis',
        icon: '🎯'
      }
    ],
    cta: {
      primary: '🌅 Get Daily Horoscope',
      secondary: '🎯 Generate Birth Chart',
      tertiary: '🔮 Consult Astrologer'
    },
    footer: '© 2025 India Horoscope - All Rights Reserved - Authentic Vedic Astrology Services'
  },

  'jaataka.com': {
    domain: 'jaataka.com',
    title: 'Jaataka - Traditional Birth Chart Analysis',
    description: 'Comprehensive Jataka (birth chart) analysis with traditional Vedic astrology methods',
    language: 'english',
    primaryColor: '#8B4513',
    secondaryColor: '#FFD700',
    specialization: ['birth_chart', 'detailed_analysis', 'traditional'],
    features: [
      {
        title: '📊 Complete Jaataka',
        description: 'Detailed birth chart analysis with all planetary positions and houses',
        icon: '📊'
      },
      {
        title: '🔢 Divisional Charts',
        description: 'Comprehensive analysis using Navamsa, Dasamsa and other divisional charts',
        icon: '🔢'
      },
      {
        title: '⏰ Dasha Analysis',
        description: 'Complete Vimshottari Dasha periods with timing of major life events',
        icon: '⏰'
      },
      {
        title: '💎 Remedial Measures',
        description: 'Traditional remedies including gemstones, mantras and charitable activities',
        icon: '💎'
      }
    ],
    cta: {
      primary: '📊 Generate Jaataka',
      secondary: '🔢 Divisional Charts',
      tertiary: '🔮 Expert Analysis'
    },
    footer: '© 2025 Jaataka.com - All Rights Reserved - Traditional Vedic Birth Chart Analysis'
  },

  'astroneram.com': {
    domain: 'astroneram.com',
    title: 'Neram Jothidam - ஜோதிட நேரம்',
    description: 'தமிழ் ஜோதிட சேவைகள் மற்றும் சுப நேரங்கள் - துல்லியமான நேர கணிப்புகள்',
    language: 'tamil',
    primaryColor: '#DC143C',
    secondaryColor: '#FFD700',
    specialization: ['timing', 'muhurat', 'panchang'],
    features: [
      {
        title: '🕐 சுப நேரம்',
        description: 'தினசரி சுப நேரங்கள் மற்றும் துல்லியமான முகூர்த்த கணிப்புகள்',
        icon: '🕐'
      },
      {
        title: '📅 பஞ்சாங்கம்',
        description: 'தினசரி திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் சுப நேரங்கள்',
        icon: '📅'
      },
      {
        title: '🎯 ஜாதகம்',
        description: 'வேத ஜோதிட கணிப்புகளுடன் உங்கள் பிறப்பு ஜாதகம் உடனடியாக பெறுங்கள்',
        icon: '🎯'
      },
      {
        title: '💑 பொருத்தம்',
        description: 'திருமணத்திற்கான குண மिलान மற்றும் தோஷ பரிசோதனை',
        icon: '💑'
      }
    ],
    cta: {
      primary: '🕐 சுப நேரம் பார்க்க',
      secondary: '🎯 ஜாதகம் உருவாக்க',
      tertiary: '🔮 ஜோதிடர்களுடன் பேச'
    },
    footer: '© 2025 Neram Jothidam - அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை - தமிழ் ஜோதிட சேவைகள்'
  },

  'astrojothidam.com': {
    domain: 'astrojothidam.com',
    title: 'Tamil Jothidam - தமிழ் ஜோதிடம்',
    description: 'பாரம்பரிய தமிழ் ஜோதிட சேவைகள் - வேத ஜோதிட கணிப்புகள் மற்றும் ஆலோசனைகள்',
    language: 'tamil',
    primaryColor: '#FF4500',
    secondaryColor: '#32CD32',
    specialization: ['vedic', 'traditional', 'tamil'],
    features: [
      {
        title: '🎯 இலவச ஜாதகம்',
        description: 'வேத ஜோதிட கணிப்புகளுடன் உங்கள் பிறப்பு ஜாதகம் உருவாக்குங்கள்',
        icon: '🎯'
      },
      {
        title: '💑 திருமண பொருத்தம்',
        description: 'குண மிலன மற்றும் தோஷ பரிசோதனையுடன் திருமண பொருத்தம் பார்க்கவும்',
        icon: '💑'
      },
      {
        title: '📅 பஞ்சாங்கம்',
        description: 'தினசரி திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் சுப நேரங்கள்',
        icon: '📅'
      },
      {
        title: '🔮 ஜோதிட ஆலோசனை',
        description: 'அனுபவமிக்க ஜோதிடர்களிடம் நேரடி ஆலோசனை பெறுங்கள்',
        icon: '🔮'
      }
    ],
    cta: {
      primary: '🎯 ஜாதகம் உருவாக்க',
      secondary: '💑 பொருத்தம் பார்க்க',
      tertiary: '🔮 ஜோதிடர்களுடன் பேச'
    },
    footer: '© 2025 Tamil Jothidam - அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை - பாரம்பரிய தமிழ் ஜோதிடம்'
  },

  'astroscroll.com': {
    domain: 'astroscroll.com',
    title: 'Scroll Astrology - Modern Astrology Platform',
    description: 'Interactive astrology platform combining traditional wisdom with modern tools and technology',
    language: 'english',
    primaryColor: '#6B46C1',
    secondaryColor: '#EC4899',
    specialization: ['modern', 'interactive', 'comprehensive'],
    features: [
      {
        title: '🚀 Interactive Charts',
        description: 'Modern interactive birth charts with advanced visualization and analysis tools',
        icon: '🚀'
      },
      {
        title: '📱 Mobile-First Design',
        description: 'Responsive design optimized for mobile devices with touch-friendly interface',
        icon: '📱'
      },
      {
        title: '🤖 AI-Powered Insights',
        description: 'Advanced AI algorithms combined with traditional astrology for deeper insights',
        icon: '🤖'
      },
      {
        title: '🌍 Global Coverage',
        description: 'Accurate calculations for any location worldwide with timezone support',
        icon: '🌍'
      }
    ],
    cta: {
      primary: '🚀 Try Interactive Chart',
      secondary: '📱 Mobile Experience',
      tertiary: '🔮 Get AI Insights'
    },
    footer: '© 2025 Scroll Astrology - All Rights Reserved - Modern Astrology Technology Platform'
  }
};

export class DomainLandingPageGenerator {
  static handleDomainLandingPage(req: any, res: any) {
    const host = req.get('host') || 'localhost';
    const domain = host.split(':')[0].toLowerCase();
    
    console.log(`🔍 Domain request: ${domain}`);
    
    // Special handling for astrotelugu.com - serve React frontend (PRIORITY)
    if (domain === 'astrotelugu.com' || domain === 'www.astrotelugu.com') {
      console.log('🚀 Serving React frontend for astrotelugu.com');
      res.setHeader('Content-Type', 'text/html');
      res.send(`<!DOCTYPE html>
<html lang="te">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telugu Jyotishyam - తెలుగు జ్యోతిష్యం</title>
    <meta name="description" content="వైదిక జ్యోతిష్య సేవలు తెలుగులో - సంపూర్ణ జాతక విశ్లేషణ మరియు భవిష్యత్తు అంచనలు">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans Telugu', Arial, sans-serif;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: #333; line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px; padding: 30px; margin-bottom: 30px;
            text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .header h1 { font-size: 2.5em; color: #ff6b35; margin-bottom: 10px; font-weight: 700; }
        .header p { font-size: 1.2em; color: #666; margin-bottom: 20px; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px; margin-bottom: 40px;
        }
        .feature-card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px; padding: 30px; text-align: center;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-icon { font-size: 3em; margin-bottom: 15px; }
        .feature-title { font-size: 1.4em; color: #ff6b35; margin-bottom: 10px; font-weight: 600; }
        .feature-description { color: #666; font-size: 1.1em; }
        .cta-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px; padding: 40px; text-align: center; margin-bottom: 30px;
        }
        .cta-buttons {
            display: flex; flex-wrap: wrap; justify-content: center;
            gap: 20px; margin-top: 30px;
        }
        .cta-button {
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            color: white; padding: 15px 30px; border: none; border-radius: 50px;
            font-size: 1.1em; font-weight: 600; cursor: pointer;
            transition: all 0.3s ease; text-decoration: none; display: inline-block;
        }
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4);
        }
        .status-badge {
            display: inline-block; background: #10b981; color: white;
            padding: 8px 16px; border-radius: 20px; font-size: 0.9em; margin-top: 20px;
        }
        .footer { text-align: center; color: rgba(255, 255, 255, 0.8); padding: 20px; font-size: 0.9em; }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .header h1 { font-size: 2em; }
            .cta-buttons { flex-direction: column; align-items: center; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Telugu Jyotishyam - తెలుగు జ్యోతిష్యం</h1>
            <p>వైదిక జ్యోతిష్య సేవలు తెలుగులో - సంపూర్ణ జాతక విశ్లేషణ మరియు భవిష్యత్తు అంచనలు</p>
            <div class="status-badge">✅ React Frontend Successfully Deployed!</div>
        </div>
        
        <div class="features">
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <div class="feature-title">ఉచిత జాతకం</div>
                <div class="feature-description">
                    మీ పుట్టిన వివరాలతో పూర్తి జాతక రిపోర్ట్ పొందండి. వైదిక గణనలతో అసలైన ఫలితాలు.
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">💑</div>
                <div class="feature-title">వివాహ పోరుతం</div>
                <div class="feature-description">
                    వర వధువుల జాతకాల మధ్య అనుకూలత తనిఖీ చేయండి. గుణ మిలన మరియు దోష పరిశీలన.
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📅</div>
                <div class="feature-title">పంచాంగం</div>
                <div class="feature-description">
                    రోజువారీ తిథి, నక్షత్రం, యోగ, కరణ మరియు శుభ సమయాలు. ప్రామాణిక గణనలు.
                </div>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🔮</div>
                <div class="feature-title">జ్యోతిష్య సలహా</div>
                <div class="feature-description">
                    అనుభవజ్ఞులైన తెలుగు జ్యోతిష్యులతో చాట్, కాల్ లేదా వీడియో కాల్ ద్వారా సంప్రదించండి.
                </div>
            </div>
        </div>
        
        <div class="cta-section">
            <h2>🚀 React Frontend Successfully Deployed!</h2>
            <p>This is now the React-powered AstroTelugu frontend with complete Telugu functionality, modern UI components, and backend integration.</p>
            
            <div class="cta-buttons">
                <a href="/generate-kundli" class="cta-button">🎯 జాతకం రూపొందించండి</a>
                <a href="/api/panchang" class="cta-button">📅 పంచాంగం చూడండి</a>
                <a href="/match-making" class="cta-button">💑 జాతక మిలన చేయండి</a>
            </div>
        </div>
        
        <div class="footer">
            <p>© 2025 Telugu Jyotishyam - అన్ని హక్కులు సురక్షితం - ప్రామాణిక వైదిక జ్యోతిష్య సేవలు</p>
            <p>✨ Powered by React Frontend with authentic Jyotisha calculations</p>
        </div>
    </div>
</body>
</html>`);
      return;
    }
    
    // Handle other domains with existing logic
    const config = DOMAIN_LANDING_CONFIGS[domain.replace('www.', '')];
    if (!config) {
      res.status(404).send('Domain not found');
      return;
    }
    
    const html = `<!DOCTYPE html>
<html lang="${config.language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <meta name="description" content="${config.description}">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            color: ${config.primaryColor};
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }
        .feature {
            text-align: center;
            padding: 20px;
            border-radius: 15px;
            background: #f8f9fa;
        }
        .feature h3 {
            color: ${config.primaryColor};
            margin-bottom: 15px;
        }
        .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 30px;
        }
        .cta-button {
            background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${config.title}</h1>
            <p>${config.description}</p>
        </div>
        
        <div class="features">
            ${config.features.map(feature => `
                <div class="feature">
                    <div style="font-size: 2em; margin-bottom: 15px;">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `).join('')}
        </div>
        
        <div class="cta-buttons">
            <a href="/generate-kundli" class="cta-button">${config.cta.primary}</a>
            <a href="/api/panchang" class="cta-button">${config.cta.secondary}</a>
            <a href="/astrologers" class="cta-button">${config.cta.tertiary}</a>
        </div>
        
        <div class="footer">
            <p>${config.footer}</p>
        </div>
    </div>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }
}

