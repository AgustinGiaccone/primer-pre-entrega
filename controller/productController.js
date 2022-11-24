import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const vehiculos = path.join(__dirname, '../database/products.json')
const administrador = true

const readFile = async(file) => {
    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {
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
        const leeProductos = await readFile(vehiculos)
        const ids = leeProductos.map(item => item.id)
        if (ids.length === 0){
            return 0
        }
        return Math.max(...ids)
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

// creamos y guardamos un producto
const saveProduct = async(req, res) => {
    if(administrador == true){
        const {name, price, image, description, code, stock} = req.body
        if(!name || !price || !image || !description || !code || !stock){
            res.status(400).json({error: 'Por favor ingrese TODOS los datos'})
        } else {
            const product = req.body
            try {
                const leeProductos = await readFile(vehiculos)
                product.id = await getMaxId() + 1
                product.timestamp = Date.now()
                leeProductos.push(product)
                await fs.promises.writeFile(vehiculos, JSON.stringify(leeProductos, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Vehiculo agregado!'})
            } catch (error) {
                console.error(`Error: ${error}`)
            }
        }
    } else {
        res.status(400).json({message: 'Solo los administradores pueden realisar esta accion'});
    }
}

// Obtenemos todos los productos o un solo producto desde su id
const getProductById = async(req, res) => {
    const {id} = req.params
    try {
        const leeProductos = await readFile(vehiculos);
        if(!id){
            res.send(leeProductos)
        }else{
            const info = leeProductos.find(product => product.id == id)
            if (info){
                res.send(info)
            }else{
                res.status(400).json({error: 'Vehiculo no encontrado'})
            }
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

// Actualiza un producto
const updateProductById = async(req, res) => {
    if(administrador == true){
        const {id} = req.params
        const {name, price, image, description, code, stock} = req.body

        if(!name||!price||!image||!description||!code||!stock){
            res.status(400).json({error: 'Por favor ingrese TODOS los datos'})
        } else {
            try {
                const leeProductos = await readFile(vehiculos)
                let wasUpdated = false;
                for(let index = 0; index < leeProductos.length; index++){
                    if(leeProductos[index].id == id){
                        leeProductos[index].name = name
                        leeProductos[index].price = price
                        leeProductos[index].image = image
                        leeProductos[index].description = description
                        leeProductos[index].code = code
                        leeProductos[index].stock = stock
                        leeProductos[index].timestamp = Date.now()
                        wasUpdated = true
                        break
                    }
                }
                if(wasUpdated){
                    await fs.promises.writeFile(vehiculos, JSON.stringify(leeProductos, null, 2), err => {
                        if(err) throw err
                    })
                    res.status(200).json({message: 'Vehiculo actualizado!'})
                } else {
                    res.status(400).json({error: 'Vehiculo no encontrado'})
                }
            } catch (error) {
                console.error(`Error: ${error}`)
            }
        }
    } else {
        res.status(400).json({message: 'Solo los administradores pueden realisar esta accion'})
    }
}

// Eliminamos un producto desde su ID
const deleteProductById = async(req, res) => {
    if(administrador == true){
        const {id} = req.params
        try {
            const leeProductos = await readFile(vehiculos)
            const index = leeProductos.findIndex(product => product.id == id)
            if(index != -1){
                leeProductos.splice(index, 1)
                await fs.promises.writeFile(vehiculos, JSON.stringify(leeProductos, null, 2), err => {
                    if(err) throw err
                })
                res.status(200).json({message: 'Vehiculo borrado!'})
            } else {
                res.status(400).json({error: 'Vehiculo no encontrado'})
            }
        } catch (error) {
            console.error(`Error: ${error}`)
        }
    } else {
        res.status(400).json({message: 'Solo los administradores pueden realisar esta accion'})
    }
}

export const productController = {
    getProductById, saveProduct, deleteProductById, updateProductById
}