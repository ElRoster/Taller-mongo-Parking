import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const CellSchema = new mongoose.Schema({
    Number_Cell: {
        type: Number,
        unique: [true, "The number of cells must be unique"]
    },
    State: {
        type: String,
        enum: ['available', 'busy'],
        default: 'available'
    },
    Plate: {
        type: String,
        maxlength: [6, "The maximum number of characters is 6"],
        required: false
    },
    DateEntry: {
        type: Date,
        default: Date.now
    },
    DateDep: {
        type: Date
    },
    pin: {
        type: String,
    }
});

CellSchema.plugin(AutoIncrement, { inc_field: 'Number_Cell' });

const Cell = mongoose.model('Cell', CellSchema, 'Cells');

export default Cell;