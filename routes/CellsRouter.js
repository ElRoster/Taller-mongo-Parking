import { Router } from 'express';
import {
    createCell,
    getCells,
    getCellByNumber,
    getCellsByStatus,
    updateCellByNumber,
    deleteCellByNumber,
    parkVehicle,
    calculatePayment,
    releaseVehicle
} from '../controllers/CellsController.js';
    
const router = Router();

router.post('/cells/', createCell);
router.get('/cells/', getCells);
router.get('/cells/:Number_Cell', getCellByNumber);
router.get('/cells/state/:State', getCellsByStatus);
router.put('/cells/:Number_Cell', updateCellByNumber);
router.delete('/cells/:Number_Cell', deleteCellByNumber);
router.post('/cells/parking', parkVehicle);
router.get('/cells/pay/:Number_Cell', calculatePayment);
router.post('/cells/out/:Number_Cell', releaseVehicle);

export default router;
