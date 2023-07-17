// Helper function to read the selected file
function readSelectedFile(fileInput, callback) {
    const file = fileInput.files[0];
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const content = event.target.result;
      callback(content);
    };
  
    reader.readAsText(file);
  }
  
  // Function to handle file selection
  function fileSelected(event) {
    const fileInput = event.target;
    const outputArea = document.getElementById("outputArea");
    const fileName = fileInput.files[0].name;
    outputArea.value = `Selected File: ${fileName}`;
  }
  
  // Function to compress the text using Huffman coding
  function compress() {
    const fileInput = document.getElementById("fileInput");
    const outputArea = document.getElementById("outputArea");
  
    readSelectedFile(fileInput, function (content) {
      const compressedOutput = huffmanCompress(content);
      outputArea.value = compressedOutput;
      downloadFile('compressed.txt', compressedOutput);
    });
  }
  
  // Function to decompress the text using Huffman coding
  function decompress() {
    const fileInput = document.getElementById("fileInput");
    const outputArea = document.getElementById("outputArea");
  
    readSelectedFile(fileInput, function (content) {
      const decompressedOutput = huffmanDecompress(content);
      outputArea.value = decompressedOutput;
      downloadFile('decompressed.txt', decompressedOutput);
    });
  }
  
  // Function to create and download a file
  function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  
  // Huffman coding implementation
  
  // Step 1: Create frequency table of characters in the input text
  function createFrequencyTable(text) {
    const frequencyTable = {};
    for (const char of text) {
      frequencyTable[char] = (frequencyTable[char] || 0) + 1;
    }
    return frequencyTable;
  }
  
  // Step 2: Create a priority queue of nodes (characters and frequencies)
  function createPriorityQueue(frequencyTable) {
    const queue = [];
    for (const char in frequencyTable) {
      queue.push({ char, freq: frequencyTable[char] });
    }
    return queue.sort((a, b) => a.freq - b.freq);
  }
  
  // Step 3: Build the Huffman tree from the priority queue
  function buildHuffmanTree(queue) {
    while (queue.length > 1) {
      const left = queue.shift();
      const right = queue.shift();
      const newNode = {
        char: null,
        freq: left.freq + right.freq,
        leftNode: left,
        rightNode: right,
      };
      queue.push(newNode);
      queue.sort((a, b) => a.freq - b.freq);
    }
    return queue[0];
  }
  
  // Step 4: Generate Huffman codes for characters
  function generateHuffmanCodes(tree, currentCode = "", codeMap = {}) {
    if (!tree.leftNode && !tree.rightNode) {
      codeMap[tree.char] = currentCode;
      return;
    }
  
    generateHuffmanCodes(tree.leftNode, currentCode + "0", codeMap);
    generateHuffmanCodes(tree.rightNode, currentCode + "1", codeMap);
  }
  
  let huffmanTree = null; // Global variable to store the Huffman tree
  
  // Step 5: Compress the input text using the Huffman codes
  function huffmanCompress(inputText) {
    const frequencyTable = createFrequencyTable(inputText);
    const priorityQueue = createPriorityQueue(frequencyTable);
    huffmanTree = buildHuffmanTree(priorityQueue);
    const codeMap = {};
    generateHuffmanCodes(huffmanTree, "", codeMap);
  
    let compressedOutput = "";
    for (const char of inputText) {
      compressedOutput += codeMap[char];
    }
  
    return compressedOutput;
  }
  
  // Step 6: Decompress the compressed input using the Huffman tree
  function huffmanDecompress(compressedInput) {
    let decompressedOutput = "";
    let currentNode = huffmanTree;
  
    for (const bit of compressedInput) {
      if (bit === "0") {
        currentNode = currentNode.leftNode;
      } else if (bit === "1") {
        currentNode = currentNode.rightNode;
      }
  
      if (!currentNode.leftNode && !currentNode.rightNode) {
        decompressedOutput += currentNode.char;
        currentNode = huffmanTree;
      }
    }
  
    return decompressedOutput;
  }
  