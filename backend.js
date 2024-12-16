const express = require("express")
const axios = require('axios')
const cors = require("cors")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const app = express()

// .env
require('dotenv').config();

// middleware json
app.use(express.json())
app.use(cors())

// model Usuario
const Usuario = mongoose.model("Usuario", mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}))

// Connecting to mondoDB
async function conectarAoMongoDB() {
    const DB_PASSWORD = process.env.DB_PASSWORD
    try {
        await mongoose.connect(`mongodb+srv://admin:${DB_PASSWORD}@hackathon.yz7ah.mongodb.net/?retryWrites=true&w=majority&appName=hackathon`)
        console.log("Conectado ao MongoDB");
    } catch (error) {
        console.log("Erro ao contectar ao mongoDB", error);
    }
}

// signup
app.post("/signup", async (req, res) => {
    try {
        const { login } = req.body
        const { password } = req.body
        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({
            login: login,
            password: criptografada
        })
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    } catch (error) {
        console.log(error);
        res.status(409).end()
    }
})

// login
app.post("/login", async (req, res) => {
    const { login } = req.body    
    const { password } = req.body
    const u = await Usuario.findOne({ login })
    if (!u) {
        return res.status(401).json({mensagem: "login inválido"})
    }
    const senhaValida = await bcrypt.compare(password, u.password)
    if (!senhaValida) {
        return res.status(401).json({mensagem: "senha inválida"}) 
    }
    const token = jwt.sign(
        {login: login},
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})

// http://localhost:port/
app.listen(3000, () => {
    try {
        conectarAoMongoDB()
        console.log("up and running");
    } catch (e) {
        console.log("Error", e);
    }
})