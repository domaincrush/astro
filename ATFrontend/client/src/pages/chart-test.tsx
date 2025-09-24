import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import ChartImageGenerator from 'src/components/astrology/ChartImageGenerator';
import { VedicBirthChart } from 'src/lib/vedic-astrology';
import { Download, TestTube, CheckCircle } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';

export default function ChartTestPage() {
  const [testChart, setTestChart] = useState<VedicBirthChart | null>(null);
  const [chartStyle, setChartStyle] = useState<'north' | 'south'>('north');
  const [testResults, setTestResults] = useState<string[]>([]);

  // Sample birth chart data for testing
  const sampleChart: VedicBirthChart = {
    ascendant: { sign: 'Capricorn', degree: 15.5, house: 1 },
    planets: [
      { name: 'Sun', sign: 'Taurus', degree: 24.8, house: 5, nakshatra: 'Mrigashira', nakshatraLord: 'Mars' },
      { name: 'Moon', sign: 'Capricorn', degree: 4.7, house: 1, nakshatra: 'Uttara Ashadha', nakshatraLord: 'Sun' },
      { name: 'Mercury', sign: 'Pisces', degree: 8.5, house: 3, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn' },
      { name: 'Venus', sign: 'Pisces', degree: 7.9, house: 3, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn' },
      { name: 'Mars', sign: 'Pisces', degree: 9.7, house: 3, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn' },
      { name: 'Jupiter', sign: 'Pisces', degree: 6.5, house: 3, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn' },
      { name: 'Saturn', sign: 'Pisces', degree: 6.7, house: 3, nakshatra: 'Uttara Bhadrapada', nakshatraLord: 'Saturn' },
      { name: 'Rahu', sign: 'Capricorn', degree: 17.5, house: 1, nakshatra: 'Shravana', nakshatraLord: 'Moon' },
      { name: 'Ketu', sign: 'Cancer', degree: 17.5, house: 7, nakshatra: 'Pushya', nakshatraLord: 'Saturn' }
    ],
    houses: [
      { number: 1, sign: 'Capricorn', lord: 'Saturn', planets: ['Moon', 'Rahu'] },
      { number: 2, sign: 'Aquarius', lord: 'Saturn', planets: [] },
      { number: 3, sign: 'Pisces', lord: 'Jupiter', planets: ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'] },
      { number: 4, sign: 'Aries', lord: 'Mars', planets: [] },
      { number: 5, sign: 'Taurus', lord: 'Venus', planets: ['Sun'] },
      { number: 6, sign: 'Gemini', lord: 'Mercury', planets: [] },
      { number: 7, sign: 'Cancer', lord: 'Moon', planets: ['Ketu'] },
      { number: 8, sign: 'Leo', lord: 'Sun', planets: [] },
      { number: 9, sign: 'Virgo', lord: 'Mercury', planets: [] },
      { number: 10, sign: 'Libra', lord: 'Venus', planets: [] },
      { number: 11, sign: 'Scorpio', lord: 'Mars', planets: [] },
      { number: 12, sign: 'Sagittarius', lord: 'Jupiter', planets: [] }
    ],
    panchang: {
      tithi: 'Purnima',
      nakshatra: 'Uttara Ashadha',
      yoga: 'Shubha',
      karan: 'Bava',
      vara: 'Tuesday'
    },
    ayanamsa: 23.83
  };

  const sampleBirthData = {
    name: 'Test Native',
    date: '1990-05-15',
    time: '14:30',
    location: 'Mumbai, India'
  };

  useEffect(() => {
    setTestChart(sampleChart);
    addTestResult('Chart data loaded successfully');
  }, []);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const downloadChartAsSVG = () => {
    try {
      const svgElement = document.querySelector('svg');
      if (!svgElement) {
        addTestResult('❌ SVG element not found');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `test-chart-${chartStyle}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      
      addTestResult('✅ SVG download successful');
    } catch (error) {
      addTestResult(`❌ SVG download failed: ${error}`);
    }
  };

  const downloadChartAsPNG = () => {
    try {
      const svgElement = document.querySelector('svg');
      if (!svgElement) {
        addTestResult('❌ SVG element not found for PNG conversion');
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      canvas.width = parseInt(svgElement.getAttribute('width') || '500');
      canvas.height = parseInt(svgElement.getAttribute('height') || '500');
      
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx!.fillStyle = 'white';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = `test-chart-${chartStyle}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(pngUrl);
            addTestResult('✅ PNG download successful');
          }
        }, 'image/png');
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        addTestResult('❌ PNG conversion failed - image load error');
      };
      
      img.src = url;
    } catch (error) {
      addTestResult(`❌ PNG download failed: ${error}`);
    }
  };

  const testAllStyles = () => {
    const styles: ('north' | 'south')[] = ['north', 'south'];
    let index = 0;
    
    const testNextStyle = () => {
      if (index < styles.length) {
        setChartStyle(styles[index]);
        addTestResult(`Testing ${styles[index]} chart style`);
        index++;
        setTimeout(testNextStyle, 2000);
      } else {
        addTestResult('✅ All chart styles tested successfully');
      }
    };
    
    testNextStyle();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      <div className="container mx-auto p-6 space-y-6 pt-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Chart Image Generation Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Controls */}
          <div className="flex gap-3 flex-wrap">
            <Button onClick={testAllStyles} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Test All Styles
            </Button>
            <Button onClick={downloadChartAsSVG} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Test SVG Download
            </Button>
            <Button onClick={downloadChartAsPNG} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Test PNG Download
            </Button>
          </div>

          {/* Chart Style Selection */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Chart Style</h3>
            <div className="flex gap-3">
              {[
                { value: 'north', label: 'North Indian' },
                { value: 'south', label: 'South Indian' }
              ].map((style) => (
                <Button
                  key={style.value}
                  variant={chartStyle === style.value ? 'default' : 'outline'}
                  onClick={() => {
                    setChartStyle(style.value as any);
                    addTestResult(`Switched to ${style.label} style`);
                  }}
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Chart Display */}
          {testChart && (
            <div className="border rounded-lg p-4 bg-white">
              <ChartImageGenerator 
                chart={testChart}
                birthData={sampleBirthData}
                style={chartStyle}
              />
            </div>
          )}

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono p-2 bg-gray-50 rounded">
                    {result}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Data Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Chart Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Birth Details</h4>
                  <p>Date: {sampleBirthData.date}</p>
                  <p>Time: {sampleBirthData.time}</p>
                  <p>Location: {sampleBirthData.location}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Chart Features</h4>
                  <p>Ascendant: {testChart?.ascendant.sign}</p>
                  <p>Planets: {testChart?.planets.length}</p>
                  <p>Houses: {testChart?.houses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      </div>
      <Footer />
    </div>
  );
}