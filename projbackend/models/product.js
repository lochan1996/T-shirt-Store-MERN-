const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name:
    {
        type: String,
        require: true,
        trim: true,
        maxlength: 30,
    },
    description:
    {
        type: String,
        require: true,
        trim: true,
        maxlength: 3000
    },
    price:
    {
        type: Number,
        require: true,
        trim: true,
        maxlength: 30

    },
    category: {
        type: ObjectId,
        ref: "Catergory",
        required: true
    },
    stock: {
        type: Number
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);