import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const datosCarrito = path.join(__dirname, '../database/cart.json')
const vehiculos = path.join(__dirname, '../database/products.json')

const readFile = async(file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) =>{
            if(err) throw err
            return data
        })
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

const getMaxId = async() => {
    try {
        const leeCarrito = await readFile(datosCarrito)
        const ids = leeCarrito.map(item => item.id)
        if (ids.length === 0){
            return 0
        }
        return Math.max(...ids)
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}


// Creamos un carrito nuevo
const saveCart = async(req, res) => {
    try {
        const leeCarrito = await readFile(datosCarrito)
        const id = await getMaxId() + 1
        const cart = {
            id: id,
            timestamp: Date.now(),
            products: []
        }
        leeCarrito.push(cart)
        await fs.promises.writeFile(datosCarrito, JSON.stringify(leeCarrito, null, 2), err => {
            if(err) throw err
        })
        res.status(200).json({message: `Carrito creado, id: ${cart.id}`})
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}


// Elimina un carrito atraves del id que se le determina
const deleteCart = async(req, res) => {
    const { id } = req.params
    try {
        const leeCarrito = await readFile(datosCarrito)
        const indexCart = leeCarrito.findIndex(cart => cart.id == id)
        if(indexCart != -1){
            leeCarrito.splice(indexCart, 1)
            await fs.promises.writeFile(datosCarrito, JSON.stringify(leeCarrito, null, 2), err => {
                if(err) throw err
            })
            res.status(200).json({message: `Carrito con id: ${id} borrado!`})
        } else {
            res.status(400).json({error: 'El carrito no existe'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

// Traemos todos los productos del carrito
const getProducts = async(req, res) => {
    const {id} = req.params
    try {
        const leeCarrito = await readFile(datosCarrito)
        const cartWanted = await leeCarrito.find(cart => cart.id == id)
        if(cartWanted != undefined){
            res.send(cartWanted.products)
        } else {
            res.status(400).json({error: `El carrito de numero: ${id} no existe`})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}


// Agregamos productos al carrito desde el id idicado
const saveProductByID = async (req, res) => {
    const {id} = req.params
    const {idProds} = req.body  //postman = {"idProds":[1,2]}

    try {
        const leeCarritoCart = await readFile(datosCarrito)
        const cartIndex = leeCarritoCart.findIndex(cart => cart.id == id)
        if(cartIndex != -1){
            const leeCarritoProducts = await readFile(vehiculos)
            const dataProducts = []
            leeCarritoProducts.forEach(product => {
                idProds.forEach(id => {
                    if(product.id == id){
                        dataProducts.push(product)
                    }
                })
            })
            if(dataProducts.length != 0){
                let concatData = leeCarritoCart[cartIndex].products.concat(dataProducts)
                leeCarritoCart[cartIndex].products = concatData
                await fs.promises.writeFile(datosCarrito, JSON.stringify(leeCarritoCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Vehiculo agregados!'})
            } else {
                res.status(400).json({error: 'No se encontraron vehiculo'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

// Eliminamos un producto especifico de un carrito especifico mediante id
const deleteCartProductByID = async(req, res) => {
    const {id, id_producto} = req.params
    try {
        const leeCarritoCart = await readFile(datosCarrito)
        const cartData = leeCarritoCart.find(cart => cart.id == id)
        if(cartData){
            const productIndex = cartData.products.findIndex(product => product.id == id_producto)
            if(productIndex != -1){
                cartData.products.splice(productIndex, 1)
                await fs.promises.writeFile(datosCarrito, JSON.stringify(leeCarritoCart, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Vehiculo borrado'})
            } else {
                res.status(400).json({error: 'Vehiculo no encontrado'})
            }
        } else {
            res.status(400).json({error: 'Carrito no encontrado'})
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

export const cartController = {
    saveCart, deleteCart, getProducts, saveProductByID, deleteCartProductByID
}