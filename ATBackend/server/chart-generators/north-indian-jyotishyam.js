// North Indian Chart Generator with Jyotishyam Integration
// Based on authentic Vedic astrology chart layout

function generateNorthIndianChartWithJyotishyam(chartData, birthData) {
  // House number mapping - 1st house at top center, anticlockwise
  const houseNumbers = [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
  
  // Define house polygons with exact coordinates - 180 degree flipped layout
  const housePolygons = [
    // H1 (1st House - Bottom Center) - flipped
    { points: [(100,225), (200,150), (300,225), (200,300)], center: (200, 225) },
    // H2 (2nd House - Bottom Center Right) - flipped
    { points: [(200,300), (300,225), (400,300)], center: (300, 275) },
    // H3 (3rd House - Bottom Right Corner) - flipped
    { points: [(300,225), (400,150), (400,300)], center: (366, 225) },
    // H4 (4th House - Bottom Right) - flipped
    { points: [(300,75), (200,150), (300,225), (400,150)], center: (300, 150) },
    // H5 (5th House - Right Side) - flipped
    { points: [(300,75), (400,0), (400,150)], center: (333, 75) },
    // H6 (6th House - Top Right) - flipped
    { points: [(200,0), (300,75), (400,0)], center: (300, 25) },
    // H7 (7th House - Center Diamond) - flipped
    { points: [(100,75), (200,0), (300,75), (200,150)], center: (200, 75) },
    // H8 (8th House - Top Left) - flipped
    { points: [(0,0), (100,75), (200,0)], center: (100, 25) },
    // H9 (9th House - Left Side) - flipped
    { points: [(0,0), (0,150), (100,75)], center: (33, 75) },
    // H10 (10th House - Top Left) - flipped
    { points: [(0,150), (100,225), (200,150), (100,75)], center: (100, 150) },
    // H11 (11th House - Bottom Left Corner) - flipped
    { points: [(0,150), (0,300), (100,225)], center: (66, 225) },
    // H12 (12th House - Bottom Center Left) - flipped
    { points: [(0,300), (100,225), (200,300)], center: (100, 275) }
  ];

  // House center coordinates for planet placement - 180 degree flipped
  const houseCenters = [
    (200, 225),  // 1st house (bottom center) - flipped
    (300, 275),  // 2nd house (bottom center right) - flipped
    (366, 225),  // 3rd house (bottom right corner) - flipped
    (300, 150),  // 4th house (bottom right) - flipped
    (333, 75),   // 5th house (right side) - flipped
    (300, 25),   // 6th house (top right) - flipped
    (200, 75),   // 7th house (center diamond) - flipped
    (100, 25),   // 8th house (top left) - flipped
    (33, 75),    // 9th house (left side) - flipped
    (100, 150),  // 10th house (top left) - flipped
    (66, 225),   // 11th house (bottom left corner) - flipped
    (100, 275)   // 12th house (bottom center left) - flipped
  ];

  // House number positions for display - 180 degree flipped
  const houseNumberPositions = [
    (195, 200),  // 1st house number (bottom center) - flipped
    (285, 290),  // 2nd house number (bottom center right) - flipped
    (350, 235),  // 3rd house number (bottom right corner) - flipped
    (285, 160),  // 4th house number (bottom right) - flipped
    (350, 85),   // 5th house number (right side) - flipped
    (285, 35),   // 6th house number (top right) - flipped
    (185, 85),   // 7th house number (center diamond) - flipped
    (85, 35),    // 8th house number (top left) - flipped
    (15, 85),    // 9th house number (left side) - flipped
    (85, 160),   // 10th house number (top left) - flipped
    (25, 235),   // 11th house number (bottom left corner) - flipped
    (67, 290)    // 12th house number (bottom center left) - flipped
  ];

  // Planet symbols and colors
  const planetInfo = {
    'Sun': { symbol: '☉', color: '#FFD700' },
    'Moon': { symbol: '☽', color: '#C0C0C0' },
    'Mars': { symbol: '♂', color: '#FF0000' },
    'Mercury': { symbol: '☿', color: '#008000' },
    'Jupiter': { symbol: '♃', color: '#0000FF' },
    'Venus': { symbol: '♀', color: '#FFFFFF' },
    'Saturn': { symbol: '♄', color: '#000000' },
    'Rahu': { symbol: '☊', color: '#708090' },
    'Ketu': { symbol: '☋', color: '#A52A2A' },
    'Ascendant': { symbol: 'Asc', color: '#800080' }
  };

  // Generate SVG content
  let svg = `
    <svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="houseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f3bf;stop-opacity:1" />
        </linearGradient>
      </defs>
  `;

  // Draw house polygons
  housePolygons.forEach((house, index) => {
    const pointsStr = house.points.map(p => `${p[0]},${p[1]}`).join(' ');
    svg += `
      <polygon points="${pointsStr}" 
               fill="url(#houseGradient)" 
               stroke="#333" 
               stroke-width="1"/>
    `;
  });

  // Add house numbers
  houseNumbers.forEach((houseNum, index) => {
    const pos = houseNumberPositions[index];
    svg += `
      <text x="${pos[0]}" y="${pos[1]}" 
            font-size="12" 
            fill="teal" 
            text-anchor="middle">${houseNum}</text>
    `;
  });

  // Place planets in houses based on chart data
  if (chartData && chartData.houses) {
    Object.keys(chartData.houses).forEach(houseKey => {
      const houseIndex = parseInt(houseKey) - 1; // Convert to 0-based index
      const planetsInHouse = chartData.houses[houseKey];
      
      if (planetsInHouse && planetsInHouse.length > 0) {
        const center = houseCenters[houseIndex];
        const radius = 15;
        
        planetsInHouse.forEach((planet, planetIndex) => {
          // Calculate position for multiple planets in same house
          const angle = (2 * Math.PI * planetIndex) / planetsInHouse.length;
          const x = center[0] + radius * Math.cos(angle);
          const y = center[1] + radius * Math.sin(angle);
          
          const planetData = planetInfo[planet] || { symbol: planet.substring(0, 2), color: '#000000' };
          
          svg += `
            <text x="${x}" y="${y}" 
                  font-size="11" 
                  fill="${planetData.color}" 
                  text-anchor="middle">${planetData.symbol}</text>
          `;
        });
      }
    });
  }

  // Add ascendant if available
  if (chartData && chartData.lagna_ascendant) {
    const ascendantSign = chartData.lagna_ascendant.sign || chartData.lagna_ascendant.rashi;
    if (ascendantSign) {
      // Place ascendant in 1st house
      const center = houseCenters[0];
      svg += `
        <text x="${center[0]}" y="${center[1] + 20}" 
              font-size="10" 
              fill="purple" 
              text-anchor="middle">Asc: ${ascendantSign}</text>
      `;
    }
  }

  // Add birth details in bottom section
  if (birthData) {
    svg += `
      <text x="200" y="320" 
            font-size="10" 
            fill="#333" 
            text-anchor="middle">
        ${birthData.name || 'Birth Chart'}
      </text>
      <text x="200" y="335" 
            font-size="8" 
            fill="#666" 
            text-anchor="middle">
        ${birthData.date || ''} ${birthData.time || ''} ${birthData.place || ''}
      </text>
    `;
  }

  svg += `</svg>`;
  
  return svg;
}

module.exports = { generateNorthIndianChartWithJyotishyam };