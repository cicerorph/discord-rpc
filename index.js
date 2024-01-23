// index.js
const WebSocket = require('ws');
const DiscordRPC = require('discord-rpc');

let rpc;

console.log("Ruby Devs Technology | Made by MubiLop")

function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: 6040 });
  console.log("RPC: Server Started")

  wss.on('connection', (ws) => {
    console.log("RPC: Connected")
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        if (data.applicationId && data.rpcData) {
          updateDiscordRPC(data.applicationId, data.rpcData);
          console.log(`RPC: ${data.rpcData}`)
        } else {
          console.error('Invalid WebSocket message format');
        }
      } catch (error) {
        console.error('Invalid JSON format');
      }
    });
  });

  wss.on('close', () => {
    console.log('WebSocket server closed. Restarting...');
    startWebSocketServer();
  });

  function updateDiscordRPC(applicationId, rpcData) {
    if (!rpc || rpc.applicationId !== applicationId) {
      DiscordRPC.register(applicationId);

      rpc = new DiscordRPC.Client({ transport: 'ipc' });
      rpc.login({ clientId: applicationId }).catch(console.error);
    }

    if (rpcData.state || rpcData.details) {
      rpc.setActivity({
        state: rpcData.state || undefined,
        details: rpcData.details || undefined,
      });
    }
  }

  wss.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });
}

startWebSocketServer();