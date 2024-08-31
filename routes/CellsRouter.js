import { Router } from 'express';
import {
    createCell,
    getCells,
    getCellsById,
    getCellsByStatus,
    updateCells,
    deleteCells,
    parkVehicle,
    calculatePayment,
    releaseVehicle
} from '../controllers/CellsController.js';

const router = Router();

router.post('/cells', createCell);
router.get('/cells', getCells);
router.get('/cells/:Number_Cell', getCellsById);
router.get('/cells/State/:State', getCellsByStatus);
router.put('/cells/:id', updateCells);
router.delete('/cells/:id', deleteCells);
router.post('/cells/parking', parkVehicle);
router.get('/cells/:id/pay', calculatePayment);
router.post('/cells/:id/out', releaseVehicle);

export default router;
