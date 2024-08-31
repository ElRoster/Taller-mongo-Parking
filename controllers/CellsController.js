import bcrypt from 'bcryptjs';
import Cell from '../models/cells.js';

export const createCell = async (req, res) => {
    try {
        const cell = new Cell({ State: req.body.State || 'available' });
        await cell.save();
        res.status(201).json(cell);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCells = async (req, res) => {
    try {
        const cells = await Cell.find();
        res.json(cells);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getCellsById = async (req, res) => {
    try {
        const cell = await Cell.findOne({ Number_Cell: req.params.Number_Cell });
        if (!cell) return res.status(404).send('Cell not found');
        res.json(cell);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getCellsByStatus = async (req, res) => {
    try {
        const cells = await Cell.find({ State: req.params.State });
        res.json(cells);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCells = async (req, res) => {
    try {
        const cell = await Cell.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cell) return res.status(404).send('Cell not found');
        res.json(cell);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteCells = async (req, res) => {
    try {
        const cell = await Cell.findByIdAndDelete(req.params.id);
        if (!cell) return res.status(404).send('Cell not found');
        res.send('Cell deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};

export const parkVehicle = async (req, res) => {
    const { Plate } = req.body;
    try {
        const cell = await Cell.findOne({ State: 'available' });
        if (!cell) return res.status(404).send('No available cell');
        cell.Plate = Plate;
        cell.DateEntry = new Date();
        cell.State = 'no available';
        
        const pin = `${cell.Number_Cell}-${Plate}`;
        cell.pin = bcrypt.hashSync(pin, 10);
        
        await cell.save();
        res.json(cell);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const calculatePayment = async (req, res) => {
    try {
        const cell = await Cell.findById(req.params.id);
        if (!cell) return res.status(404).send('Cell not found');
        if (!cell.DateEntry || !cell.DateDep) return res.status(400).send('Incomplete data');

        const hours = Math.max(Math.floor((cell.DateDep - cell.DateEntry) / (1000 * 60 * 60)), 1);
        const payment = hours * 5000;
        
        res.json({ payment });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const releaseVehicle = async (req, res) => {
    try {
        const cell = await Cell.findById(req.params.id);
        if (!cell) return res.status(404).send('Cell not found');
        if (cell.estado !== 'no available') return res.status(400).send('Cell is not occupied');

        cell.State = 'available';
        cell.Plate = null;
        cell.DateEntry = null;
        cell.DateDep = null;
        cell.pin = null;
        
        await cell.save();
        res.json(cell);
    } catch (error) {
        res.status(500).send(error);
    }
};
