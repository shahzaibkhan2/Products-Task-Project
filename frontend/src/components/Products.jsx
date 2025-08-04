import React, { useState } from 'react';
import './Products.css';
import ProductsApis from '../services/productsApis';

const Products = ({ products }) => {
    // const productList = [
    //     {
    //         id: 1,
    //         name: 'Wireless Headphones',
    //         description: 'Noise-cancelling over-ear headphones',
    //         price: 99.99,
    //         quantity: 15,
    //     },
    //     {
    //         id: 2,
    //         name: 'Bluetooth Speaker',
    //         description: 'Portable waterproof speaker',
    //         price: 49.99,
    //         quantity: 30,
    //     },
    //     {
    //         id: 3,
    //         name: 'Smartwatch',
    //         description: 'Fitness tracker with heart rate monitor',
    //         price: 129.99,
    //         quantity: 10,
    //     },
    // ];

    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart((prevCart) => [...prevCart, product]);
        alert(`${product.name} added to cart!`);
    };

    const handleCheckout = async () => {
        try {
            const response = ProductsApis.addToCart(cart,
                "shahzaibkhan@gmail.com"
            );
            alert("products added to cart successfully !")
        } catch (error) {

        }
    };



    return (
        <div className="products-container">
            <h1 className="products-heading">Product List</h1>
            <ul className="product-list">
                {products?.map((product, index) => (
                    <li key={index} className="product-item">
                        <h2>{product?.name}</h2>
                        <p>{product?.description}</p>
                        <div className="product-details">
                            <span className="price">Price: ${product?.price}</span>
                            <span className="quantity">Qty: {product?.quantity}</span>
                        </div>
                        <button
                            className="add-cart-button"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </li>
                ))}
            </ul>

            <div className="checkout-section">
                <p className="cart-status">Cart: {cart.length} item(s)</p>
                <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default Products;
