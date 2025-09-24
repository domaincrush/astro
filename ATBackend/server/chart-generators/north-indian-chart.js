/**
 * North Indian Style Vedic Astrology Chart Generator
 * Based on traditional diamond-shaped layout with SVG
 */

function generateNorthIndianChart(planets, houses, personalInfo) {
  // Create SVG string with proper structure
  const svgWidth = 400;
  const svgHeight = 300;
  
  let svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f3bf;stop-opacity:1" />
        </linearGradient>
      </defs>
  `;

  // House coordinates using exact Python/SVG North Indian chart logic
  // Based on authentic svgwrite implementation with precise polygon points and centers
  const houseDefinitions = [
    { points: "100,225 200,300 300,225 200,150", center: { x: 200, y: 225 }, house: 1 },   // 1st House - center (190, 75) in Python but polygon center is different
    { points: "100,225 0,300 200,300", center: { x: 100, y: 262 }, house: 2 },             // 2nd House  
    { points: "0,150 0,300 100,225", center: { x: 50, y: 225 }, house: 3 },                // 3rd House
    { points: "0,150 100,225 200,150 100,75", center: { x: 100, y: 150 }, house: 4 },     // 4th House
    { points: "0,0 0,150 100,75", center: { x: 50, y: 75 }, house: 5 },                    // 5th House
    { points: "0,0 100,75 200,0", center: { x: 100, y: 37 }, house: 6 },                   // 6th House
    { points: "100,75 200,150 300,75 200,0", center: { x: 200, y: 75 }, house: 7 },       // 7th House
    { points: "200,0 300,75 400,0", center: { x: 300, y: 37 }, house: 8 },                 // 8th House
    { points: "300,75 400,150 400,0", center: { x: 350, y: 75 }, house: 9 },               // 9th House
    { points: "300,75 200,150 300,225 400,150", center: { x: 300, y: 150 }, house: 10 },  // 10th House
    { points: "300,225 400,300 400,150", center: { x: 350, y: 225 }, house: 11 },          // 11th House
    { points: "300,225 200,300 400,300", center: { x: 300, y: 262 }, house: 12 }           // 12th House
  ];

  // Draw house polygons
  houseDefinitions.forEach((houseDef, index) => {
    svgContent += `
      <polygon points="${houseDef.points}" 
               fill="url(#grad)" 
               stroke="#333" 
               stroke-width="1.5"/>
    `;
    
    // Add house number
    svgContent += `
      <text x="${houseDef.center.x}" y="${houseDef.center.y - 15}" 
            font-family="Arial, sans-serif" 
            font-size="12" 
            fill="#2c5530" 
            text-anchor="middle" 
            font-weight="bold">${houseDef.house}</text>
    `;
  });

  // Planet colors and symbols
  const planetSymbols = {
    'Sun': { symbol: '☉', color: '#FFD700' },
    'Moon': { symbol: '☽', color: '#C0C0C0' },
    'Mars': { symbol: '♂', color: '#FF0000' },
    'Mercury': { symbol: '☿', color: '#008000' },
    'Jupiter': { symbol: '♃', color: '#0000FF' },
    'Venus': { symbol: '♀', color: '#FF69B4' },
    'Saturn': { symbol: '♄', color: '#000000' },
    'Rahu': { symbol: '☊', color: '#708090' },
    'Ketu': { symbol: '☋', color: '#A52A2A' }
  };

  // Group planets by house
  const planetsByHouse = {};
  planets.forEach(planet => {
    const houseNum = planet.house;
    if (!planetsByHouse[houseNum]) {
      planetsByHouse[houseNum] = [];
    }
    planetsByHouse[houseNum].push(planet);
  });

  // Add planets to houses
  Object.keys(planetsByHouse).forEach(houseNum => {
    const housePlanets = planetsByHouse[houseNum];
    const houseDef = houseDefinitions[parseInt(houseNum) - 1];
    
    if (houseDef && housePlanets.length > 0) {
      const numPlanets = housePlanets.length;
      const radius = 20;
      
      housePlanets.forEach((planet, index) => {
        let x, y;
        
        if (numPlanets === 1) {
          // Single planet in center
          x = houseDef.center.x;
          y = houseDef.center.y + 5;
        } else {
          // Multiple planets arranged in circle
          const angle = (2 * Math.PI * index) / numPlanets;
          x = houseDef.center.x + radius * Math.cos(angle);
          y = houseDef.center.y + radius * Math.sin(angle) + 5;
        }
        
        const planetInfo = planetSymbols[planet.name] || { symbol: planet.name.substring(0, 2), color: '#333' };
        
        svgContent += `
          <text x="${x}" y="${y}" 
                font-family="Arial, sans-serif" 
                font-size="14" 
                fill="${planetInfo.color}" 
                text-anchor="middle" 
                font-weight="bold">${planetInfo.symbol}</text>
        `;
      });
    }
  });

  // Add birth details in top corners
  svgContent += `
    <text x="10" y="15" font-family="Arial, sans-serif" font-size="10" fill="#333">
      ${personalInfo.name}
    </text>
    <text x="10" y="28" font-family="Arial, sans-serif" font-size="9" fill="#666">
      ${personalInfo.dateOfBirth} ${personalInfo.timeOfBirth}
    </text>
    <text x="10" y="41" font-family="Arial, sans-serif" font-size="9" fill="#666">
      ${personalInfo.placeOfBirth}
    </text>
  `;

  svgContent += `</svg>`;
  
  return svgContent;
}

export { generateNorthIndianChart };