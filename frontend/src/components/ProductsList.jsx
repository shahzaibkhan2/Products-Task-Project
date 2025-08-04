import { useEffect, useState } from "react";
import ProductsApis from "../services/productsApis";
import Products from "./Products"


const ProductsList = () => {
    const [products, setProducts] = useState([]);
    const getProductsList = async () => {
        try {
            const response = await ProductsApis.getProductsList();
            console.log(response);

            if (response) {
                setProducts(response?.products);
            }
        } catch (error) {
            return error;
        }
    }

    useEffect(() => {
        getProductsList();
    }, [])
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", fontSize: "30px" }}>
                <h1>Products List</h1>
                <p>This is the products list</p>
            </div>
            <Products products={products} />
        </div>
    )
}

export default ProductsList
