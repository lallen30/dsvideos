const fs = require('fs');
const path = require('path');

// Modify these paths as needed
const inputFilePath = path.join(__dirname, 'dsvideos.json');  // Replace 'largeFile.json' with your actual JSON filename
const outputDir = path.join(__dirname, 'output');
const numberOfChunks = 20; // Number of files to split into

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Read the JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Check if it's an array or object with an array inside
    let recordsArray;
    
    if (Array.isArray(jsonData)) {
      // JSON is a simple array
      recordsArray = jsonData;
    } else if (typeof jsonData === 'object') {
      // JSON is an object containing an array
      recordsArray = jsonData.data || Object.values(jsonData)[0];  // Try 'data' key or first property
    } else {
      throw new Error("Unsupported JSON format");
    }

    // Calculate the size of each chunk
    const chunkSize = Math.ceil(recordsArray.length / numberOfChunks);

    // Split the data into chunks
    for (let i = 0; i < numberOfChunks; i++) {
      const chunk = recordsArray.slice(i * chunkSize, (i + 1) * chunkSize);
      const outputFilePath = path.join(outputDir, `chunk_${i + 1}.json`);
      
      // Write the chunk to a new JSON file
      fs.writeFile(outputFilePath, JSON.stringify(chunk, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log(`Chunk ${i + 1} written to ${outputFilePath}`);
        }
      });
    }
  } catch (err) {
    console.error('Error parsing JSON:', err);
  }
});
