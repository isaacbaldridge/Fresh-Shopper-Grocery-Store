const express = require("express")
const ordersRouter = express.Router()
const chalk = require("chalk")
const morgan = require("morgan")

// ---- Loggin middleware ---- //
ordersRouter.use(morgan("tiny"))

const {requireUser} = require("./utils")

const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
} = require("../db/orders")

// ---- GET ALL ORDERS ---- //
// /api/orders/
ordersRouter.get("/", async (req, res, next) => {
    try {
        console.log("In order route:")
        const orders = await getAllOrders()
        res.send(orders)
    } catch({name, message}) {
        next({name, message})
    }
})


// ---- GET ORDER BY ID ---- //
// /api/orders/:id
ordersRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const order = await getOrderById(id)
        res.send(order)
    } catch (error) {
        console.error(chalk.red("Error GETTING order by Id: "), error)
        throw error
    }
})

// ---- GET ORDERS BY USER ID ---- //
// /api/orders/user/:id
ordersRouter.get("/user/:id", async (req, res) => {
    const { id } = req.params
    try {
        const orders = await getOrdersByUserId(id)
        res.send(orders)
    } catch (error) {
        console.error(chalk.red("Error GETTING orders by user id: "), error)
        throw error
    }
})

// ---- CREATE NEW ORDER ---- //
// /api/orders
ordersRouter.post("/", requireUser, async (req, res) => {
    // const { fulfilled} = req.body;
    const orderData = {};
    console.log(req.user)
    try {
        orderData.user_id = req.user.id;
        // orderData.fulfilled = fulfilled;
        
        const newOrder = await createOrder(orderData)
        res.send(newOrder)

    } catch (error) {
        console.error(chalk.red("Error POSTING new order: "), error)
        throw error
    }
})

module.exports = ordersRouter