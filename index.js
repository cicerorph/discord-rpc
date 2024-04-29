// index.js
const express = require('express');
const DiscordRPC = require('discord-rpc');

const app = express();
const port = 6040;

let rpc;

console.log("Ruby Devs Technology | Made by MubiLop");

app.use(express.json());

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

app.post('/rpc/change', (req, res) => {
    try {
        const { applicationId, rpcData } = req.body;
        if (applicationId && rpcData) {
            updateDiscordRPC(applicationId, rpcData);
            console.log(`RPC: ${rpcData}`);
            res.status(200).send('RPC updated successfully.');
        } else {
            throw new Error('Invalid request body format');
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send('Bad request.');
    }
});

app.get('/rpc/ping', (req, res) => {
    res.status(200).send('Pong!');
});

app.listen(port, () => {
    console.log(`RPC server listening at http://localhost:${port}`);
});

module.exports = app;