import { Router } from "express"
import { cartController } from "../controller/cartControler.js"
const cartRouter = Router()

cartRouter.post('/', cartController.saveCart)
cartRouter.post('/:id/productos', cartController.saveProductByID) //postman = {"idProds":[1,2]}
cartRouter.get('/:id/productos', cartController.getProducts)
cartRouter.delete('/:id/productos/:id_producto', cartController.deleteCartProductByID)
cartRouter.delete('/:id', cartController.deleteCart)


export default cartRouter;