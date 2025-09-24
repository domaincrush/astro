
// Test script for Jyotisha engine
const { spawn } = require('child_process');

async function testJyotishaEngine() {
  const testData = {
    name: "Test Person",
    date: "1990-01-15",
    time: "10:30",
    latitude: 13.0827,
    longitude: 80.2707,
    place: "Chennai"
  };

  console.log('Testing Jyotisha engine with data:', testData);

  const pythonProcess = spawn('python3', [
    'server/jyotisha-engine.py',
    JSON.stringify(testData)
  ]);

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
      console.error('Jyotisha engine failed:', stderr);
      return;
    }

    try {
      const result = JSON.parse(stdout);
      console.log('Jyotisha engine test successful!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (parseError) {
      console.error('Failed to parse Jyotisha output:', parseError);
      console.error('Raw output:', stdout);
    }
  });
}

testJyotishaEngine();
