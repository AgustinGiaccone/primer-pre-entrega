import { Router } from 'express'
import { productController } from '../controller/productController.js'
const productsRouter = Router()

productsRouter.get('/:id?', productController.getProductById)
productsRouter.post('/', productController.saveProduct)
productsRouter.put('/:id', productController.updateProductById)
productsRouter.delete('/:id', productController.deleteProductById)

export default productsRouter;