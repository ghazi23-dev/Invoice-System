const express = require('express');
const AgencyRouter = express.Router();

const AgencyController = require('../controllers/AgencyController');
const authenticateToken = require('../middleware/middleware');

AgencyRouter.post('/api/v1/createAgency', authenticateToken, AgencyController.createAgency);
AgencyRouter.get('/api/v1/getallAgencies', authenticateToken, AgencyController.getallAgencies);
AgencyRouter.get('/api/v1/getagencybyid/:Agency_ID', authenticateToken, AgencyController.GetAgencyByID);
AgencyRouter.post('/api/v1/createAchatReservation', authenticateToken, AgencyController.createAchatReservation);
AgencyRouter.get('/api/v1/getallAchatReservations', authenticateToken, AgencyController.getallAchatReservations);
AgencyRouter.put('/api/v1/updateAchatReservation/:AchatID', authenticateToken, AgencyController.updateAchatReservation);






module.exports = AgencyRouter;