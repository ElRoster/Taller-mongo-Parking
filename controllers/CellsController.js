import bcrypt from 'bcryptjs';
import Cell from '../models/cells.js';

export const createCell = async (req, res) => {
    try {
        const cell = new Cell({
            State: req.body.State || 'available'
        });

        await cell.save();
        res.status(201).send(cell);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getCells = async (req, res) => {
    try {
        const cells = await Cell.find();
        res.send(cells);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getCellByNumber = async (req, res) => {
    try {
        const cell = await Cell.findOne({ Number_Cell: req.params.Number_Cell });
        if (!cell) return res.status(404).send('Cell not found');
        res.send(cell);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getCellsByStatus = async (req, res) => {
    try {

        const cells = await Cell.find({ State: req.params.State });
            res.send(cells);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateCellByNumber = async (req, res) => {
    try {
        const cell = await Cell.findOneAndUpdate({ Number_Cell: req.params.cellNumber }, req.body, { new: true });
        if (!cell) return res.status(404).send('Cell not found');
        res.send(cell);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteCellByNumber = async (req, res) => {
    try {
        const cell = await Cell.findOneAndDelete({Number_Cell: req.params.Number_Cell });
        if (!cell) return res.status(404).send('Cell not found');
        res.send('Cell deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};

export const parkVehicle = async (req, res) => {
    try {
        let cell = await Cell.findOne({ State: 'available' });
        if (!cell) return res.status(400).send('No available cells');

        const { Plate } = req.body;
        const pin = await bcrypt.hash(cell.Number_Cell + Plate, 6);

        cell.Plate = Plate;
        cell.DateEntry = new Date();
        cell.State = 'busy';
        cell.Pin = pin;

        await cell.save();
        res.send(cell);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const calculatePayment = async (req, res) => {
    try {
        const cell = await Cell.findOne({ Number_Cell: req.params.Number_Cell });
        if (!cell || !cell.DateEntry) {
            return res.status(400).send('Cell not valid for payment calculation');
        }

        if (!cell.DateDep) {
            cell.DateDep = new Date();
            await cell.save();
        }

        const hours = Math.floor((cell.DateDep - cell.DateEntry) / 3600000);
        const payment = hours < 1 ? 5000 : hours * 5000;

        res.send({ payment });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const releaseVehicle = async (req, res) => {
    try {
        let cell = await Cell.findOne({ Number_Cell: req.params.Number_Cell });
        if (!cell || cell.State === 'available') {
            return res.status(400).send('Cell not valid for release');
        }

        cell.DateDep = new Date();
        cell.State = 'available';
        cell.Plate = null;
        cell.DateEntry = null;
        cell.DateDep = null;
        cell.Pin = null;

        await cell.save();
        res.send(cell);
    } catch (error) {
        res.status(400).send(error);
    }
};
