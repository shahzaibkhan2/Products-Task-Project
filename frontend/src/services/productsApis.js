import { axiosInstance } from "./instance/axiosInstance";


class ProductsApis {
  static async addProduct(formData) {
    try {
      const response = await axiosInstance.post("/add-product", formData);
      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }
  static async addToCart(items, email) {
    let url = "/add-to-cart";
    if (email) url += `?email=${email}`;

    try {
      const response = await axiosInstance.post(
        url,
        { items },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }

  static async getProductsList(formData) {
    try {
      const response = await axiosInstance.get("/get-products", formData);
      if (response) {
        return response.data;
      }
    } catch (error) {
      return error;
    }
  }

}

export default ProductsApis;
