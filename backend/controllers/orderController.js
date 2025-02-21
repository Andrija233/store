import Order from "../models/orderModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// utility function 
function calcPrices (orderItems) {
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + parseFloat(taxPrice)).toFixed(2);
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice : shippingPrice.toFixed(2),
        taxPrice, 
        totalPrice
    };
}

const createOrder = asyncHandler(async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod} = req.body;

        if(orderItems && orderItems.length === 0){
            res.status(400);
            throw new Error("No order items");
        }

        const itemsFromDB = await Product.find({_id: {$in: orderItems.map(x => x._id)}});

        const dbOrderItems = orderItems.map(orderItem => {
            const dbProduct = itemsFromDB.find(x => x._id.toString() === orderItem._id.toString());
            if(!dbProduct){
                res.status(400);
                throw new Error(`Product ${orderItem._id} not found`);
            }
            return {
                ...orderItem,
                product: orderItem._id,
                price: dbProduct.price,
                _id: undefined
            }
        });
        const {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        } = calcPrices(dbOrderItems);

        const order = new Order({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id username");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


const countTotalOrders = asyncHandler(async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.json({totalOrders});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}); 

const calcTotalSales = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find();
        const totalSales = (orders.reduce((acc, order) => acc + order.totalPrice, 0)).toFixed(2);
        res.json({totalSales});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const calcTotalSalesByDate = asyncHandler(async (req, res) => {
    try {
        const salesByDate = await Order.aggregate([
            {
                $match: {
                    isPaid: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString : {
                            format: "%Y-%m-%d",
                            date: "$paidAt"
                        }
                    },
                    totalSales: { $sum: "$totalPrice" },
                }
            }
        ]);

        res.json(salesByDate);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const findOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "username email");
        if(order){
            res.json(order);
        }
        else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


const updateOrderToPaid = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address
            }
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        }
        else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        }
        else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if(order){
            await order.remove();
            res.json({message: "Order removed"});
        }
        else {
            res.status(404);
            throw new Error("Order not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

export { createOrder, getAllOrders, getUserOrders, countTotalOrders, calcTotalSales, calcTotalSalesByDate, findOrderById, updateOrderToPaid, updateOrderToDelivered, deleteOrder };