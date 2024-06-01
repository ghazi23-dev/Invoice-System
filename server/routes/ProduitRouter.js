const express = require('express');
const ProduitRouter = express.Router();

const ProduitController = require('../controllers/ProduitController');
const authenticateToken = require('../middleware/middleware');

ProduitRouter.post('/api/v1/createProduit', authenticateToken, ProduitController.createProduit);
ProduitRouter.get('/api/v1/getallProduit', authenticateToken, ProduitController.getallProduit);
ProduitRouter.delete('/api/v1/deleteProduit/:ProductID', authenticateToken, ProduitController.deleteProduit);







module.exports = ProduitRouter;