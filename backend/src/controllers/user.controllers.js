

import User from "../models/user.models.js";
import { SafeAsync } from "../utils/safeAsync.js";
import { SafeError } from "../utils/safeError.js";
import Product from "../models/product.models.js";
import { SafeResponse } from "../utils/safeResponse.js";

const addProduct = SafeAsync(async (req, res) => {
  const { name, price, quantity, description, email, username } = req.body;
  const product = await Product.create({ name, price, quantity, description, email, username });
  if (!product) res.status(200).json(new SafeError(200, "product_not_created", { code: 200, message: "product_not_created" }))
  return res.status(201).json(new SafeResponse(201, product, "product_created_successfully"));
})

const getProductsWithPagination = async (req, res) => {
  try {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search_value?.trim() || "";

    const matchStage = search
      ? {
        $match: {
          $or: [
            { name: { $regex: search, $options: "i" } },
          ],
        },
      }
      : { $match: {} };

    const skip = (page - 1) * perPage;
    const aggregationPipeline = [
      matchStage,
      {
        $facet: {
          products: [
            { $skip: skip },
            { $limit: perPage },
          ],
          totalCount: [
            { $count: "count" }
          ],
        },
      },
    ];

    const result = await Product.aggregate(aggregationPipeline);

    const products = result[0]?.products || [];
    const totalUsers = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalUsers / perPage);

    res.status(200).json({
      success: true,
      products,
      pageInfo: {
        currentPage: page,
        perPage,
        totalPages,
        totalUsers,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = SafeAsync(async (req, res) => {
  const { items } = req.body;
  const { email } = req?.query;
  

  if (!email || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json(
      new SafeError(400, "invalid_request", {
        code: 400,
        message: "at least one cart item are required",
      })
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(
      new SafeError(404, "user_not_found", {
        code: 404,
        message: "User not found",
      })
    );
  }

  items.forEach((item) => {
    if (!item.name || !item.price || !item.quantity) {
      throw new SafeError(400, "invalid_product_data", {
        message: "Each item must have name, price, and quantity",
      });
    }
  });

  user.cartItems.push(...items);
  await user.save();

  return res.status(201).json(
    new SafeResponse(201, user.cart, "products_added_to_cart_successfully")
  );
});

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

 
    const newUser = await User.create({ username, email, password });


    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};








export { getProductsWithPagination, addProduct, addToCart, createUser };
