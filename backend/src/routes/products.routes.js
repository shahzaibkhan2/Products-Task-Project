import { Router } from "express";
import { addProduct, addToCart, createUser, getProductsWithPagination, login, signUp } from "../controllers/user.controllers.js";

const router = Router();

// router.route("/signup").post(signUp);
// router.route("/login").post(login);

router.route("/add-product").post(addProduct);
router.route("/get-products").get(getProductsWithPagination);
router.route("/add-to-cart").post(addToCart);
router.route("/add-user").post(createUser);
export default router;
