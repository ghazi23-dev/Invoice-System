const express = require('express');
const ClientRouter = express.Router();

const ClientController = require('../controllers/ClientController');
const authenticateToken = require('../middleware/middleware');

ClientRouter.post('/api/V1/createClient', authenticateToken, ClientController.CreateClient);
ClientRouter.get('/api/V1/getAllClients', authenticateToken, ClientController.getAllClient);
ClientRouter.get('/api/V1/getClientByID/:Client_ID', authenticateToken, ClientController.GetClientByID);
ClientRouter.put('/api/V1/updateClient/:Client_ID', authenticateToken, ClientController.UpdateClient);







module.exports = ClientRouter;