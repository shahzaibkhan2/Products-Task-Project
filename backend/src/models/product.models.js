import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Product name is required"],
        },
        price: {
            type: Number,
            trim: true,
            required: [true, "Product price is required"],
        },
        quantity: {
            type: Number,
            trim: true,
            required: [true, "quantity price is required"],
        },
        description: {
            type: String,
            trim: true,
            required: [true, "Product description is required"],
        },
        username: {
            type: String,
            trim: true,
            required: [true, "Product username is required"],
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Email is required"],
        },
        cartItems: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
