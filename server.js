// server.js - Backend Implementation using Node.js with WebSocket

const WebSocket = require('ws');
const { Web3 } = require('web3');

// Initialize Web3 instance (connect to your preferred Ethereum node)
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on port 8080');

// Minimum transaction amount in ETH
const MIN_TRANSACTION_AMOUNT = 0.001;

// Client connections
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Handle messages from clients
  ws.on('message', async (message) => {
    try {
      const request = JSON.parse(message);
      
      switch(request.type) {
        case 'validate_transaction':
          await validateTransaction(ws, request.data);
          break;
        case 'transaction_submitted':
          recordTransaction(ws, request.data);
          break;
        default:
          sendError(ws, 'Unknown request type');
      }
    } catch (error) {
      console.error('Error processing message:', error);
      sendError(ws, 'Invalid request format');
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'transaction_status',
    status: 'info',
    message: 'Connected to transaction validation server'
  }));
});

// Validate transaction request
async function validateTransaction(ws, data) {
  console.log('Validating transaction:', data);
  
  try {
    const { amount, receiverAddress } = data;
    
    // Convert amount to number
    const amountValue = parseFloat(amount);
    
    // Validate amount
    if (isNaN(amountValue) || amountValue <= 0) {
      return sendValidationResult(ws, false, 'Invalid amount');
    }
    
    if (amountValue < MIN_TRANSACTION_AMOUNT) {
      return sendValidationResult(ws, false, `Amount too small (minimum: ${MIN_TRANSACTION_AMOUNT} ETH)`);
    }
    
    // Validate address format
    if (!web3.utils.isAddress(receiverAddress)) {
      return sendValidationResult(ws, false, 'Invalid Ethereum address');
    }
    
    // Optional: Check for blacklisted addresses
    if (isBlacklisted(receiverAddress)) {
      return sendValidationResult(ws, false, 'Address is blacklisted');
    }
    
    // Optional: Additional custom validation logic here
    // ...
    
    // All validations passed
    sendValidationResult(ws, true, null, {
      amount: amount,
      receiverAddress: receiverAddress
    });
    
  } catch (error) {
    console.error('Validation error:', error);
    sendValidationResult(ws, false, 'Validation error');
  }
}

// Send validation result to client
function sendValidationResult(ws, isValid, errorMessage, data = null) {
  ws.send(JSON.stringify({
    type: 'validation_result',
    isValid,
    errorMessage,
    data
  }));
}

// Send error message to client
function sendError(ws, message) {
  ws.send(JSON.stringify({
    type: 'transaction_status',
    status: 'error',
    message
  }));
}

// Check if address is blacklisted
function isBlacklisted(address) {
  // Example blacklist check
  const blacklistedAddresses = [
    // Add known scam addresses or other addresses you want to block
    '0x0000000000000000000000000000000000000000'
  ];
  
  return blacklistedAddresses.includes(address.toLowerCase());
}

// Record transaction submission (optional)
function recordTransaction(ws, data) {
  const { txHash, amount, receiverAddress } = data;
  
  console.log('Transaction submitted:', {
    hash: txHash,
    amount: amount,
    to: receiverAddress,
    timestamp: new Date().toISOString()
  });
  
  // Optional: Store transaction in database
  
  // Confirm receipt to client
  ws.send(JSON.stringify({
    type: 'transaction_status',
    status: 'success',
    message: 'Transaction recorded'
  }));
}

// Error handling for the server
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});