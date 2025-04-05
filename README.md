# MetaMask Backend Automation Prototype

This prototype demonstrates how to integrate backend systems with MetaMask wallet operations, allowing a server to programmatically initiate wallet operations on connected clients.

## Overview

In blockchain applications, there's often a need for backend systems to initiate wallet operations while maintaining proper security boundaries. This prototype demonstrates a pattern where:

1. A backend server can trigger MetaMask operations (like signing messages)
2. The user retains control by approving/rejecting each request in MetaMask
3. Results are reported back to the server for verification

## Architecture

The system consists of two main components:

- **Backend Server**: An Express.js server with WebSocket support through Socket.IO
- **Frontend Client**: A web application that integrates with MetaMask and communicates with the backend

Communication flow:
1. Client connects to the server via WebSocket
2. Server sends commands to the client
3. Client initiates MetaMask operations
4. User approves/rejects in MetaMask
5. Results are sent back to the server

## Features

- Real-time bidirectional communication using WebSockets
- Backend-triggered MetaMask signing
- Multiple client support with broadcast capability
- Support for various wallet operations:
  - Message signing
  - ETH transfers
  - ERC20 token transfers
  - Token approvals and swaps

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- MetaMask browser extension
- Modern web browser (Chrome, Firefox, Edge)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install dependencies
```bash
cd server
npm install
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev:js
```

2. Open your browser to `http://localhost:3000`

3. Connect MetaMask when prompted

## Usage Examples

### Backend-Triggered Signing

1. Connect your MetaMask wallet in the browser
2. Click the "Trigger Sign from Backend" button to simulate a backend request
3. Approve the signature request in MetaMask
4. View the signature results in both browser and server console

### API Integration

You can trigger MetaMask operations programmatically using the API:

```bash
# Trigger a signature request on all connected clients
curl -X GET http://localhost:3000/api/trigger-sign

# With a custom message
curl -X POST -H "Content-Type: application/json" -d '{"message":"Sign this custom message"}' http://localhost:3000/api/trigger-sign
```

## API Documentation

The server exposes the following endpoints:

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/status` | GET | Get server status and connected clients | N/A | `{status: "online", connectedClients: number}` |
| `/api/trigger-sign` | GET | Trigger sign message on all clients | N/A | `{success: true, message: string}` |
| `/api/trigger-sign` | POST | Trigger sign with custom message | `{message: string}` | `{success: true, message: string}` |

## Security Considerations

- This prototype demonstrates a pattern, not a production-ready solution
- In production, you would need to add:
  - Authentication for both WebSocket and HTTP endpoints
  - Message validation and verification
  - Rate limiting
  - Client targeting (vs broadcasting to all)

## Limitations

- MetaMask operations always require user approval in the popup
- The server cannot bypass this security measure (by design)
- CORS settings in the prototype allow all origins for simplicity

## Development Notes

- The backend server is implemented in plain JavaScript for simplicity
- TypeScript version is available but requires resolving type issues
- Frontend uses vanilla JavaScript with Web3.js for MetaMask interactions

## Future Enhancements

- Add authentication layer
- Implement nonce-based verification
- Support for custom contract interactions
- Target specific clients instead of broadcasting
- Add extensive error handling and retry logic

## License

MIT 