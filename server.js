import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import productsRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port =8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.set('port', port)
app.use('/api/productos', productsRouter)
app.use('/api/carritos', cartRouter)

const server = app.listen(port, () => {
    console.log(`servidor conectado en http://localhost:${port}`)
})

server.on('error', error =>
console.log(`Error en el servidor: ${error}`)
)

app.get('/api',(req,res) =>
    res.send('Estas en la api')
)
export default app