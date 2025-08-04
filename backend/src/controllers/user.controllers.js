

import User from "../models/user.models.js";
import { SafeAsync } from "../utils/safeAsync.js";
import { SafeError } from "../utils/safeError.js";
import Product from "../models/product.models.js";
import { SafeResponse } from "../utils/safeResponse.js";

const signUp = SafeAsync(async (req, res) => {
  const { email, fullname, password } = req?.body;
  if (!email || !fullname || !password)
    return res.status(400).json(
      new SafeError(400, req.t("all_fields_required"), {
        code: 400,
        message: req.t("all_fields_required"),
      })
    );

  const isUserExists = await User.findOne({ email });
  if (isUserExists)
    return res.status(401).json(
      new SafeError(401, req.t("profile_already_exists"), {
        code: 401,
        message: req.t("profile_already_exists"),
      })
    );
  const newUser = await User.create({
    fullname,
    email,
    password,
  });
  if (newUser) {
    const accessToken = await generateAccessToken(newUser?._id);
    return res
      .status(201)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        samSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== "development",
      })
      .json(
        new SafeResponse(201, {
          code: 200,
          message: req.t("user_signup_successfully"),
          data: {
            id: newUser?._id,
            fullname: newUser?.fullname,
            email: newUser?.email,
            avatar: newUser?.avatar || "",
          },
        })
      );
  }
});

const login = SafeAsync(async (req, res) => {
  const { email, password } = req?.body;
  if (!email || !password || email.trim() === "" || password.trim() === "")
    return res.status(400).json(
      new SafeError(400, req.t("all_fields_required"), {
        code: 400,
        message: req.t("all_fields_required"),
      })
    );

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json(
      new SafeError(401, req.t("invalid_credentials"), {
        code: 401,
        message: req.t("invalid_credentials"),
      })
    );
  const isPassCorrect = await user.isPasswordCorrect(password);
  if (isPassCorrect) {
    const accessToken = await generateAccessToken(user?._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== "development",
      })
      .json(
        new SafeResponse(200, {
          code: 200,
          message: req.t("login_successful"),
          data: {
            id: user?._id,
            fullname: user?.fullname,
            email: user?.email,
            avatar: user?.avatar || "",
          },
        })
      );
  } else {
    return res.status(400).json(
      new SafeError(400, req.t("password_incorrect"), {
        code: 400,
        message: req.t("password_incorrect"),
      })
    );
  }
});

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

    // Optional: Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = await User.create({ username, email, password });

    // Optional: remove password before sending response
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








export { signUp, login, getProductsWithPagination, addProduct, addToCart, createUser };
