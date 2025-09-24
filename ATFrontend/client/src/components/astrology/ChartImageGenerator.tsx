import React, { useState, useEffect } from "react";
import { VedicBirthChart } from "src/lib/vedic-astrology";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
}

interface ChartImageGeneratorProps {
  chart: VedicBirthChart;
  birthData: {
    name?: string;
    date: string;
    time: string;
    location: string;
    latitude?: number;
    longitude?: number;
  };
  style?: "north" | "south";
  chartType?: "rashi" | "navamsa";
}

export function ChartImageGenerator({
  chart,
  birthData,
  style = "north",
  chartType = "rashi",
}: ChartImageGeneratorProps) {
  const [navamsaChart, setNavamsaChart] = useState<VedicBirthChart | null>(
    null,
  );
  const [navamsaLoading, setNavamsaLoading] = useState(false);
  const [navamsaError, setNavamsaError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Debug: Log the birthData to see what's being passed
  console.log("ChartImageGenerator received birthData:", birthData);

  // Calculate navamsa chart data directly from birth chart when chartType is navamsa
  useEffect(() => {
    if (chartType === "navamsa" && chart && chart.planets) {
      calculateNavamsaChart();
    }
  }, [chartType, chart]);

  const calculateNavamsaChart = () => {
    console.log("🔯 Calculating navamsa chart from birth chart data");
    setNavamsaLoading(true);
    setNavamsaError(null);

    try {
      // Calculate navamsa positions for each planet
      const navamsaPlanets = chart.planets.map((planet) => {
        const longitude = (planet as any).longitude || 0;
        const navamsaPosition = calculateNavamsaPosition(longitude);
        
        return {
          ...planet,
          longitude: navamsaPosition.longitude,
          sign: navamsaPosition.sign,
          house: navamsaPosition.house,
          rashi: navamsaPosition.sign,
        };
      });

      // Calculate navamsa ascendant
      const birthAscendantLongitude = (chart.ascendant as any)?.longitude || 0;
      const navamsaAscendantLongitude = (birthAscendantLongitude * 9) % 360;
      const navamsaAscendantSign = Math.floor(navamsaAscendantLongitude / 30) + 1;
      
      const signNames = [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
      ];

      const navamsaChartData = {
        ...chart,
        planets: navamsaPlanets,
        ascendant: {
          longitude: navamsaAscendantLongitude,
          sign: signNames[navamsaAscendantSign - 1],
          house: 1
        },
        chartType: "D9 Navamsa",
        description: "Marriage, dharma, and spiritual fortune analysis"
      };

      setNavamsaChart(navamsaChartData);
      console.log("🔯 Navamsa chart calculated successfully:", navamsaChartData);
    } catch (error) {
      console.error("Error calculating navamsa chart:", error);
      setNavamsaError("Failed to calculate navamsa positions");
    } finally {
      setNavamsaLoading(false);
    }
  };

  // Calculate navamsa position for a given longitude
  const calculateNavamsaPosition = (longitude: number) => {
    const signNumber = Math.floor(longitude / 30) + 1;
    const degreeInSign = longitude % 30;
    const navamsaPart = Math.floor(degreeInSign / 3.333333); // Each navamsa = 3°20'
    
    const navamsaSignNumber = ((9 * (signNumber - 1) + navamsaPart) % 12) + 1;
    
    const signNames = [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ];
    
    return {
      longitude: (navamsaSignNumber - 1) * 30 + degreeInSign,
      sign: signNames[navamsaSignNumber - 1],
      house: navamsaSignNumber
    };
  };

  // Use navamsa chart data if available, otherwise use birth chart
  const activeChart =
    chartType === "navamsa" && navamsaChart ? navamsaChart : chart;

  // Planet abbreviation and color functions
  const getPlanetAbbreviation = (planetName: string): string => {
    const abbreviations: { [key: string]: string } = {
      Sun: "SU",
      Moon: "MO",
      Mars: "MA",
      Mercury: "ME",
      Jupiter: "JU",
      Venus: "VE",
      Saturn: "SA",
      Rahu: "RA",
      Ketu: "KE",
    };
    return (
      abbreviations[planetName] || planetName.substring(0, 2).toUpperCase()
    );
  };

  const getPlanetColor = (planetName: string): string => {
    const colors: { [key: string]: string } = {
      Sun: "#FF6B35",
      Moon: "#4A90E2",
      Mars: "#E74C3C",
      Mercury: "#2ECC71",
      Jupiter: "#F39C12",
      Venus: "#9B59B6",
      Saturn: "#34495E",
      Rahu: "#8E44AD",
      Ketu: "#D35400",
    };
    return colors[planetName] || "#333";
  };

  const generateNorthIndianChart = () => {
    const size = 600;
    const offsetX = 0;
    const offsetY = 0;

    // Get ascendant sign for house numbering
    const ascendantSign = activeChart.ascendant
      ? Math.floor(
          (typeof activeChart.ascendant === "string"
            ? 0
            : (activeChart.ascendant as any).longitude || 0) / 30,
        ) + 1
      : 1;

    const signNames = [
      "Mesha",
      "Vrishabha",
      "Mithuna",
      "Karka",
      "Simha",
      "Kanya",
      "Tula",
      "Vrishchika",
      "Dhanu",
      "Makara",
      "Kumbha",
      "Meena",
    ];
    const englishSignNames = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];
    const signSymbols = [
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
    ];

    // Fixed North Indian chart structure based on authentic layout
    // Main outline - rectangular frame with internal divisions
    const chartOutline = [
      // Main rectangle
      {
        points: [
          [50 + offsetX, 100 + offsetY],
          [350 + offsetX, 100 + offsetY],
          [350 + offsetX, 300 + offsetY],
          [50 + offsetX, 300 + offsetY],
        ],
      },
      // Diagonal lines
      {
        points: [
          [50 + offsetX, 100 + offsetY],
          [350 + offsetX, 300 + offsetY],
        ],
      },
      {
        points: [
          [50 + offsetX, 300 + offsetY],
          [350 + offsetX, 100 + offsetY],
        ],
      },
      // Central horizontal line
      {
        points: [
          [50 + offsetX, 200 + offsetY],
          [350 + offsetX, 200 + offsetY],
        ],
      },
      // Central vertical line
      {
        points: [
          [200 + offsetX, 100 + offsetY],
          [200 + offsetX, 300 + offsetY],
        ],
      },
    ];

    // House positions using exact Python/SVG North Indian chart logic
    // Based on authentic svgwrite implementation with precise coordinates
    const housePositions = {
      1: { x: 190 + offsetX, y: 75 + offsetY }, // 1st house center
      2: { x: 100 + offsetX, y: 30 + offsetY }, // 2nd house center
      3: { x: 30 + offsetX, y: 75 + offsetY }, // 3rd house center
      4: { x: 90 + offsetX, y: 150 + offsetY }, // 4th house center
      5: { x: 30 + offsetX, y: 225 + offsetY }, // 5th house center
      6: { x: 90 + offsetX, y: 278 + offsetY }, // 6th house center
      7: { x: 190 + offsetX, y: 225 + offsetY }, // 7th house center
      8: { x: 290 + offsetX, y: 278 + offsetY }, // 8th house center
      9: { x: 360 + offsetX, y: 225 + offsetY }, // 9th house center
      10: { x: 290 + offsetX, y: 150 + offsetY }, // 10th house center
      11: { x: 360 + offsetX, y: 75 + offsetY }, // 11th house center
      12: { x: 290 + offsetX, y: 30 + offsetY }, // 12th house center
    };

    // Create house number positions and planet centers
    const houseNumberPositions = Object.entries(housePositions).map(
      ([house, pos]) => ({
        house: parseInt(house),
        x: pos.x,
        y: pos.y,
      }),
    );

    const planetCenters = Object.entries(housePositions).map(
      ([house, pos]) => ({
        house: parseInt(house),
        x: pos.x,
        y: pos.y,
      }),
    );

    // Group planets by house
    const planetsByHouse: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) planetsByHouse[i] = [];

    activeChart.planets?.forEach((p) => {
      if (p.house) {
        const abbr = getPlanetAbbreviation(p.name);
        planetsByHouse[p.house].push(abbr);
      }
    });

    // Add Ascendant to house 1
    planetsByHouse[1].unshift("ASC");

    return (
      <div className="w-full flex flex-col items-center space-y-4">
        {/* Chart Header Information */}
        <div className="text-center space-y-2">
          <h2 className="text-sm md:text-xl font-bold text-amber-800">
            {chartType === "navamsa"
              ? "Navamsa Chart (D-9)"
              : "Birth Chart (Rashi Chart)"}
          </h2>
          <div className="text-lg font-semibold text-gray-700">
            {birthData?.name ||
              (chartType === "navamsa" ? "Navamsa Chart" : "Birth Chart")}
          </div>
          <div className="text-sm text-gray-600">
            {birthData?.date} {birthData?.time} | {birthData?.location}
          </div>
          <div className="text-sm font-medium text-amber-700">
            Lagna: {signNames[ascendantSign - 1]} (
            {englishSignNames[ascendantSign - 1]}){" "}
            {signSymbols[ascendantSign - 1]}
          </div>
        </div>

        {/* Chart SVG */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 400 300"
          className="bg-white border border-gray-300 rounded-lg shadow-lg max-w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          key={`chart-${Date.now()}`}
        >
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="white" />
              <stop offset="100%" stopColor="#f0f3bf" />
            </linearGradient>
          </defs>

          <rect width={size} height={size} fill="white" />

          {/* Authentic North Indian Diamond Chart using exact Python/SVG polygon coordinates */}

          {/* House 1 - Center Diamond */}
          <polygon
            points={`${100 + offsetX},${225 + offsetY} ${200 + offsetX},${300 + offsetY} ${300 + offsetX},${225 + offsetY} ${200 + offsetX},${150 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="2"
          />

          {/* House 2 */}
          <polygon
            points={`${100 + offsetX},${225 + offsetY} ${0 + offsetX},${300 + offsetY} ${200 + offsetX},${300 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 3 */}
          <polygon
            points={`${0 + offsetX},${150 + offsetY} ${0 + offsetX},${300 + offsetY} ${100 + offsetX},${225 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 4 */}
          <polygon
            points={`${0 + offsetX},${150 + offsetY} ${100 + offsetX},${225 + offsetY} ${200 + offsetX},${150 + offsetY} ${100 + offsetX},${75 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 5 */}
          <polygon
            points={`${0 + offsetX},${0 + offsetY} ${0 + offsetX},${150 + offsetY} ${100 + offsetX},${75 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 6 */}
          <polygon
            points={`${0 + offsetX},${0 + offsetY} ${100 + offsetX},${75 + offsetY} ${200 + offsetX},${0 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 7 */}
          <polygon
            points={`${100 + offsetX},${75 + offsetY} ${200 + offsetX},${150 + offsetY} ${300 + offsetX},${75 + offsetY} ${200 + offsetX},${0 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 8 */}
          <polygon
            points={`${200 + offsetX},${0 + offsetY} ${300 + offsetX},${75 + offsetY} ${400 + offsetX},${0 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 9 */}
          <polygon
            points={`${300 + offsetX},${75 + offsetY} ${400 + offsetX},${150 + offsetY} ${400 + offsetX},${0 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 10 */}
          <polygon
            points={`${300 + offsetX},${75 + offsetY} ${200 + offsetX},${150 + offsetY} ${300 + offsetX},${225 + offsetY} ${400 + offsetX},${150 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 11 */}
          <polygon
            points={`${300 + offsetX},${225 + offsetY} ${400 + offsetX},${300 + offsetY} ${400 + offsetX},${150 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* House 12 */}
          <polygon
            points={`${300 + offsetX},${225 + offsetY} ${200 + offsetX},${300 + offsetY} ${400 + offsetX},${300 + offsetY}`}
            fill="url(#chartGradient)"
            stroke="#8B4513"
            strokeWidth="1.5"
          />

          {/* Add house numbers - smaller and positioned away from planet areas */}
          {houseNumberPositions.map(({ house, x, y }) => {
            // Adjust positions to corner areas to avoid planet overlaps
            let adjustedX = x;
            let adjustedY = y;

            // Position numbers in corners of each house to avoid planet overlap
            switch (house) {
              case 1:
                adjustedX = x + 25;
                adjustedY = y - 20;
                break; // Top right of center
              case 2:
                adjustedX = x - 25;
                adjustedY = y + 20;
                break; // Bottom left
              case 3:
                adjustedX = x - 25;
                adjustedY = y - 20;
                break; // Top left
              case 4:
                adjustedX = x - 25;
                adjustedY = y - 20;
                break; // Top left
              case 5:
                adjustedX = x - 25;
                adjustedY = y + 20;
                break; // Bottom left
              case 6:
                adjustedX = x + 25;
                adjustedY = y + 20;
                break; // Bottom right
              case 7:
                adjustedX = x - 25;
                adjustedY = y + 20;
                break; // Bottom left
              case 8:
                adjustedX = x + 25;
                adjustedY = y + 20;
                break; // Bottom right
              case 9:
                adjustedX = x + 25;
                adjustedY = y - 20;
                break; // Top right
              case 10:
                adjustedX = x + 25;
                adjustedY = y - 20;
                break; // Top right
              case 11:
                adjustedX = x + 25;
                adjustedY = y + 20;
                break; // Bottom right
              case 12:
                adjustedX = x + 25;
                adjustedY = y - 20;
                break; // Top right
            }

            return (
              <text
                key={`house-${house}`}
                x={adjustedX}
                y={adjustedY}
                fontSize="9"
                fontWeight="bold"
                fill="#666666"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {house}
              </text>
            );
          })}

          {/* Center Ascendant marker (Python/SVG coordinates - house 1 center) */}
          <text
            x={190 + offsetX}
            y={75 + offsetY}
            fontSize="14"
            fontWeight="bold"
            fill="#B8860B"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            ASC
          </text>

          {/* Add planets to houses */}
          {planetCenters.map(({ house, x, y }) => {
            const planets = planetsByHouse[house] || [];
            const radius = 20;

            return planets.map((planet, j) => {
              const angle =
                planets.length > 1 ? (2 * Math.PI * j) / planets.length : 0;
              const planetX =
                x + (planets.length > 1 ? radius * Math.cos(angle) : 0);
              const planetY =
                y + (planets.length > 1 ? radius * Math.sin(angle) : 0);
              const color = getPlanetColor(
                planet === "ASC" ? "Ascendant" : planet,
              );

              // Skip rendering ASC again if it's already in center
              if (planet === "ASC") return null;

              return (
                <text
                  key={`${house}-${planet}-${j}`}
                  x={planetX}
                  y={planetY}
                  fontSize="11"
                  fontWeight="bold"
                  fill={color}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {planet}
                </text>
              );
            });
          })}
        </svg>
      </div>
    );
  };

  const generateSouthIndianChart = () => {
    const size = 320;
    const cellSize = 80;
    const startX = 40;
    const startY = 40;

    // Responsive canvas - Mobile: one by one, Desktop: side by side
    const chartWidth = isMobile ? Math.min(size, 320) : size;
    const chartHeight = isMobile ? Math.min(size, 320) : size;

    // South Indian chart: Fixed zodiac signs layout (signs stay in same position always)
    // House numbering starts from ascendant sign
    const zodiacSigns = [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ];

    // Authentic South Indian Chart Layout (Fixed Sign Positions from reference image)
    // Layout exactly as shown: Pisces(12)-Aries(1)-Taurus(2)-Gemini(3) in top row
    const signPositions = [
      { row: 0, col: 0, sign: "Pisces", signNum: 12 }, // Top row, 1st position (Pisces)
      { row: 0, col: 1, sign: "Aries", signNum: 1 }, // Top row, 2nd position (Aries)
      { row: 0, col: 2, sign: "Taurus", signNum: 2 }, // Top row, 3rd position (Taurus)
      { row: 0, col: 3, sign: "Gemini", signNum: 3 }, // Top row, 4th position (Gemini)
      { row: 1, col: 0, sign: "Aquarius", signNum: 11 }, // Left side, 1st position (Aquarius)
      { row: 1, col: 3, sign: "Cancer", signNum: 4 }, // Right side, 1st position (Cancer)
      { row: 2, col: 0, sign: "Capricorn", signNum: 10 }, // Left side, 2nd position (Capricorn)
      { row: 2, col: 3, sign: "Leo", signNum: 5 }, // Right side, 2nd position (Leo)
      { row: 3, col: 0, sign: "Sagittarius", signNum: 9 }, // Bottom row, 1st position (Sagittarius)
      { row: 3, col: 1, sign: "Scorpio", signNum: 8 }, // Bottom row, 2nd position (Scorpio)
      { row: 3, col: 2, sign: "Libra", signNum: 7 }, // Bottom row, 3rd position (Libra)
      { row: 3, col: 3, sign: "Virgo", signNum: 6 }, // Bottom row, 4th position (Virgo)
    ];

    // Get ascendant sign
    const getAscendantSign = () => {
      // Check if ascendant has longitude data (from API response)
      if (
        (activeChart.ascendant as any)?.longitude !== undefined &&
        (activeChart.ascendant as any)?.longitude !== null
      ) {
        return Math.floor((activeChart.ascendant as any).longitude / 30) + 1;
      }
      // Fallback: check by sign name if longitude not available
      if ((activeChart.ascendant as any)?.sign) {
        const signNames = [
          "Aries",
          "Taurus",
          "Gemini",
          "Cancer",
          "Leo",
          "Virgo",
          "Libra",
          "Scorpio",
          "Sagittarius",
          "Capricorn",
          "Aquarius",
          "Pisces",
        ];
        const ascendantSignIndex = signNames.indexOf(
          (activeChart.ascendant as any).sign,
        );
        return ascendantSignIndex !== -1 ? ascendantSignIndex + 1 : 1;
      }
      // Check if ascendant is a string (sign name directly)
      if (typeof activeChart.ascendant === "string") {
        const signNames = [
          "Aries",
          "Taurus",
          "Gemini",
          "Cancer",
          "Leo",
          "Virgo",
          "Libra",
          "Scorpio",
          "Sagittarius",
          "Capricorn",
          "Aquarius",
          "Pisces",
        ];
        const ascendantSignIndex = signNames.indexOf(activeChart.ascendant);
        return ascendantSignIndex !== -1 ? ascendantSignIndex + 1 : 1;
      }
      return 1; // Default to Aries if not available
    };

    const ascendantSign = getAscendantSign();

    // Calculate house number from ascendant (South Indian format)
    const getHouseNumber = (signNum: number) => {
      // In South Indian format: Ascendant sign = House 1, then clockwise progression
      // Example: If ascendant is Pisces (12), then Pisces=House1, Aries=House2, Taurus=House3, etc.
      let houseNum = ((signNum - ascendantSign) % 12) + 1;
      if (houseNum <= 0) houseNum += 12;
      return houseNum;
    };

    // Get planets in each sign (not house)
    const getPlanetsInSign = (signNum: number) => {
      return activeChart.planets.filter((planet) => {
        // Check if planet has longitude data (from API response)
        if (
          (planet as any).longitude !== undefined &&
          (planet as any).longitude !== null
        ) {
          // Convert planet longitude to sign (1-12)
          const planetSign = Math.floor((planet as any).longitude / 30) + 1;
          return planetSign === signNum;
        }
        // Fallback: check by rashi name (from VedicPlanetPosition)
        if (planet.rashi) {
          const signNames = [
            "Aries",
            "Taurus",
            "Gemini",
            "Cancer",
            "Leo",
            "Virgo",
            "Libra",
            "Scorpio",
            "Sagittarius",
            "Capricorn",
            "Aquarius",
            "Pisces",
          ];
          const planetSignIndex = signNames.indexOf(planet.rashi);
          return planetSignIndex !== -1 && planetSignIndex + 1 === signNum;
        }
        return false;
      });
    };

    return (
      <div
        className={`w-full ${isMobile ? "space-y-6" : "flex gap-6 justify-center items-start"}`}
      >
        {/* Birth Chart (Rashi Chart) */}
        <div className={`${isMobile ? "w-full" : "flex-1 max-w-md"}`}>
          <h4 className="text-lg font-semibold mb-3 text-orange-900 text-center">
            Birth Chart (Rashi Chart)
          </h4>
          <svg
            viewBox={`0 0 ${chartWidth + 80} ${chartHeight + 80}`}
            width="100%"
            height="auto"
            className="border border-orange-200 bg-white max-w-full mx-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Ancient palm leaf background */}
            <defs>
              <linearGradient
                id="palmLeafGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F5F5DC" />
                <stop offset="25%" stopColor="#F0E68C" />
                <stop offset="50%" stopColor="#DEB887" />
                <stop offset="75%" stopColor="#D2B48C" />
                <stop offset="100%" stopColor="#CD853F" />
              </linearGradient>

              <pattern
                id="palmTexture"
                patternUnits="userSpaceOnUse"
                width="20"
                height="20"
              >
                <rect width="20" height="20" fill="#F5F5DC" />
                <circle cx="5" cy="5" r="0.5" fill="#DEB887" opacity="0.3" />
                <circle cx="15" cy="10" r="0.3" fill="#CD853F" opacity="0.2" />
                <circle cx="8" cy="15" r="0.4" fill="#D2B48C" opacity="0.25" />
              </pattern>
            </defs>

            {/* Palm leaf background with texture */}
            <rect
              width={chartWidth + 80}
              height={chartHeight + 80}
              fill="url(#palmLeafGradient)"
            />
            <rect
              width={chartWidth + 80}
              height={chartHeight + 80}
              fill="url(#palmTexture)"
              opacity="0.3"
            />

            {/* Outer boundary with enhanced styling */}
            <rect
              x={startX}
              y={startY}
              width={cellSize * 4}
              height={cellSize * 4}
              fill="none"
              stroke="#B8860B"
              strokeWidth="3"
            />

            {/* Grid lines for authentic South Indian chart */}
            {[1, 2, 3].map((i) => (
              <g key={i}>
                <line
                  x1={startX + i * cellSize}
                  y1={startY}
                  x2={startX + i * cellSize}
                  y2={startY + cellSize * 4}
                  stroke="#B8860B"
                  strokeWidth="2"
                />
                <line
                  x1={startX}
                  y1={startY + i * cellSize}
                  x2={startX + cellSize * 4}
                  y2={startY + i * cellSize}
                  stroke="#B8860B"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* Chart title */}
            <text
              x={chartWidth / 2 + 40}
              y={30}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#8B4513"
            >
              South Indian Rasi Chart
            </text>

            {/* Birth details in center */}
            <rect
              x={startX + cellSize}
              y={startY + cellSize}
              width={cellSize * 2}
              height={cellSize * 2}
              fill="#f8f8f8"
              stroke="#000"
              strokeWidth="1"
            />
            <text
              x={startX + cellSize * 2}
              y={startY + cellSize + 30}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#000"
            >
              {birthData?.name}
            </text>
            <text
              x={startX + cellSize * 2}
              y={startY + cellSize + 50}
              textAnchor="middle"
              fontSize="9"
              fill="#666"
            >
              {birthData?.date}
            </text>
            <text
              x={startX + cellSize * 2}
              y={startY + cellSize + 70}
              textAnchor="middle"
              fontSize="9"
              fill="#666"
            >
              {birthData?.location}
            </text>

            {/* Sign positions and planets */}
            {signPositions.map((pos) => {
              const x = startX + pos.col * cellSize;
              const y = startY + pos.row * cellSize;

              // Skip center cells
              if (
                (pos.row === 1 && pos.col === 1) ||
                (pos.row === 1 && pos.col === 2) ||
                (pos.row === 2 && pos.col === 1) ||
                (pos.row === 2 && pos.col === 2)
              ) {
                return null;
              }

              const houseNumber = getHouseNumber(pos.signNum);
              const planetsInSign = getPlanetsInSign(pos.signNum);
              const isLagna = pos.signNum === ascendantSign;

              return (
                <g key={pos.signNum}>
                  {/* House number */}
                  <text
                    x={x + 8}
                    y={y + 18}
                    fontSize="10"
                    fontWeight="bold"
                    fill="#666"
                  >
                    {houseNumber}
                  </text>

                  {/* Sign name */}
                  <text
                    x={x + cellSize / 2}
                    y={y + 18}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#333"
                    textAnchor="middle"
                  >
                    {pos.sign.substring(0, 3)}
                  </text>

                  {/* Lagna marker */}
                  {isLagna && (
                    <text
                      x={x + cellSize - 8}
                      y={y + 18}
                      fontSize="8"
                      fontWeight="bold"
                      fill="#E74C3C"
                      textAnchor="end"
                    >
                      ASC
                    </text>
                  )}

                  {/* Planets */}
                  {planetsInSign.map((planet, pIndex) => {
                    const planetSpacing = Math.min(
                      14,
                      (cellSize - 45) / Math.max(planetsInSign.length, 1),
                    );
                    const offsetY = y + 35 + pIndex * planetSpacing;

                    return (
                      <text
                        key={planet.name}
                        x={x + cellSize / 2}
                        y={offsetY}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={getPlanetColor(planet.name)}
                      >
                        {getPlanetAbbreviation(planet.name)}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Navamsa Chart */}
        <div className={`${isMobile ? "w-full" : "flex-1 max-w-md"}`}>
          <h4 className="text-lg font-semibold mb-3 text-orange-900 text-center">
            Navamsa Chart (D-9)
          </h4>
          <svg
            viewBox={`0 0 ${chartWidth + 80} ${chartHeight + 80}`}
            width="100%"
            height="auto"
            className="border border-orange-200 bg-white max-w-full mx-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Reuse same background patterns */}
            <defs>
              <linearGradient
                id="navPalmLeafGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F5F5DC" />
                <stop offset="25%" stopColor="#F0E68C" />
                <stop offset="50%" stopColor="#DEB887" />
                <stop offset="75%" stopColor="#D2B48C" />
                <stop offset="100%" stopColor="#CD853F" />
              </linearGradient>
              <pattern
                id="navPalmTexture"
                patternUnits="userSpaceOnUse"
                width="20"
                height="20"
              >
                <rect width="20" height="20" fill="#F5F5DC" />
                <circle cx="5" cy="5" r="0.5" fill="#DEB887" opacity="0.3" />
                <circle cx="15" cy="10" r="0.3" fill="#CD853F" opacity="0.2" />
                <circle cx="8" cy="15" r="0.4" fill="#D2B48C" opacity="0.25" />
              </pattern>
            </defs>

            {/* Background */}
            <rect
              width={chartWidth + 80}
              height={chartHeight + 80}
              fill="url(#navPalmLeafGradient)"
            />
            <rect
              width={chartWidth + 80}
              height={chartHeight + 80}
              fill="url(#navPalmTexture)"
              opacity="0.3"
            />

            {/* Navamsa grid */}
            <rect
              x={40}
              y={40}
              width={cellSize * 4}
              height={cellSize * 4}
              fill="none"
              stroke="#B8860B"
              strokeWidth="3"
            />

            {/* Navamsa grid lines */}
            {[1, 2, 3].map((i) => (
              <g key={i}>
                <line
                  x1={40 + i * cellSize}
                  y1={40}
                  x2={40 + i * cellSize}
                  y2={40 + cellSize * 4}
                  stroke="#B8860B"
                  strokeWidth="2"
                />
                <line
                  x1={40}
                  y1={40 + i * cellSize}
                  x2={40 + cellSize * 4}
                  y2={40 + i * cellSize}
                  stroke="#B8860B"
                  strokeWidth="2"
                />
              </g>
            ))}

            {/* Navamsa center */}
            <rect
              x={40 + cellSize}
              y={40 + cellSize}
              width={cellSize * 2}
              height={cellSize * 2}
              fill="#f8f8f8"
              stroke="#000"
              strokeWidth="1"
            />
            <text
              x={40 + cellSize * 2}
              y={40 + cellSize + 30}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="#000"
            >
              Navamsa
            </text>
            <text
              x={40 + cellSize * 2}
              y={40 + cellSize + 50}
              textAnchor="middle"
              fontSize="9"
              fill="#666"
            >
              D-9 Chart
            </text>

            {/* Navamsa chart sign positions and planets */}
            {signPositions.map((pos) => {
              const x = 40 + pos.col * cellSize;
              const y = 40 + pos.row * cellSize;

              // Skip center cells
              if (
                (pos.row === 1 && pos.col === 1) ||
                (pos.row === 1 && pos.col === 2) ||
                (pos.row === 2 && pos.col === 1) ||
                (pos.row === 2 && pos.col === 2)
              ) {
                return null;
              }

              // Get navamsa planets in this sign
              const navamsaPlanetsInSign = navamsaChart && navamsaChart.planets 
                ? navamsaChart.planets.filter((planet: any) => {
                    const planetSign = Math.floor((planet.longitude || 0) / 30) + 1;
                    return planetSign === pos.signNum;
                  })
                : [];

              const navamsaAscendantSign = navamsaChart && navamsaChart.ascendant
                ? Math.floor(((navamsaChart.ascendant as any)?.longitude || 0) / 30) + 1
                : 1;

              const houseNumber = ((pos.signNum - navamsaAscendantSign + 12) % 12) || 12;
              const isLagna = pos.signNum === navamsaAscendantSign;

              return (
                <g key={`nav-${pos.signNum}`}>
                  {/* House number */}
                  <text
                    x={x + 8}
                    y={y + 18}
                    fontSize="10"
                    fontWeight="bold"
                    fill="#666"
                  >
                    {houseNumber}
                  </text>

                  {/* Sign name */}
                  <text
                    x={x + cellSize / 2}
                    y={y + 18}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#333"
                    textAnchor="middle"
                  >
                    {pos.sign.substring(0, 3)}
                  </text>

                  {/* Lagna marker */}
                  {isLagna && (
                    <text
                      x={x + cellSize - 8}
                      y={y + 18}
                      fontSize="8"
                      fontWeight="bold"
                      fill="#E74C3C"
                      textAnchor="end"
                    >
                      ASC
                    </text>
                  )}

                  {/* Navamsa Planets */}
                  {navamsaPlanetsInSign.map((planet: any, pIndex: number) => {
                    const planetSpacing = Math.min(
                      14,
                      (cellSize - 45) / Math.max(navamsaPlanetsInSign.length, 1),
                    );
                    const offsetY = y + 35 + pIndex * planetSpacing;

                    return (
                      <text
                        key={`nav-planet-${planet.name}`}
                        x={x + cellSize / 2}
                        y={offsetY}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill={getPlanetColor(planet.name)}
                      >
                        {getPlanetAbbreviation(planet.name)}
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {style === "north" && (
        <div>
          <h4 className="text-lg font-semibold mb-3 text-orange-900">
            Birth Chart (Rashi Chart)
          </h4>
          {generateNorthIndianChart()}
        </div>
      )}
      {style === "south" && generateSouthIndianChart()}
    </div>
  );
}

export default ChartImageGenerator;
