const getRandomCellIndices = (() => {
    const maxIndex = Math.pow(2, 13) - 1; // 8191
    const n = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6
    const result = new Set();
    
    while (result.size < n) {
      result.add(Math.floor(Math.random() * (maxIndex + 1)));
    }
    
    return Array.from(result);
  })();

console.log(getRandomCellIndices[0]);
console.log(getRandomCellIndices);