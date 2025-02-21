import express from "express";
const router = express.Router();
import {createOrder, getAllOrders, getUserOrders,  countTotalOrders, calcTotalSales, calcTotalSalesByDate, findOrderById, updateOrderToPaid, updateOrderToDelivered, deleteOrder} from "../controllers/orderController.js";
import {authenticate, admin} from "../middlewares/authMiddleware.js";

router.route('/')
    .post(authenticate, createOrder)
    .get(authenticate, admin, getAllOrders);

router.route('/mine').get(authenticate, getUserOrders);
router.route('/total-orders').get(countTotalOrders);
router.route('/total-sales').get(calcTotalSales);
router.route('/total-sales-by-date').get(calcTotalSalesByDate);
router.route('/:id').get(authenticate, findOrderById);
router.route('/:id/pay').put(authenticate, updateOrderToPaid);
router.route('/:id/deliver').put(authenticate, admin, updateOrderToDelivered);
router.route('/:id').delete(authenticate, admin, deleteOrder);

export default router;