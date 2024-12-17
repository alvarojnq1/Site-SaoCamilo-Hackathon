const express = require("express")
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

// model paciente
const Paciente = mongoose.model("Paciente", mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nome: {type: String, required: true},
    tipo: {type: String, required: true}
}))

const Medico = mongoose.model("Medico", mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nome: {type: String, required: true},
    tipo: {type: String, required: true}
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
        const { login, password, nome } = req.body; // O tipo já não será enviado

        // Verifica se os campos obrigatórios estão preenchidos
        if (!login || !password || !nome) {
            return res.status(400).json({ error: "Preencha todos os campos obrigatórios!" });
        }

        // Criptografa a senha
        const senhaCriptografada = await bcrypt.hash(password, 10);

        // Cria um usuário do tipo paciente automaticamente
        const usuario = new Paciente({ 
            login: login, 
            password: senhaCriptografada,
            nome: nome,
            tipo: "paciente" // Aqui o tipo é fixado como paciente
        });

        // Salva no MongoDB
        const respMongo = await usuario.save();
        console.log("Usuário cadastrado:", respMongo);

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ error: "Erro ao cadastrar usuário." });
    }
});



// Login
app.post("/login", async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios!" });
    }

    // Verifica se o usuário existe e qual é o tipo
    let usuario;
    let tipoUsuario = '';

    usuario = await Paciente.findOne({ login });  // Verifica paciente
    if (usuario) {
        tipoUsuario = 'paciente';
    } else {
        usuario = await Medico.findOne({ login });  // Verifica médico
        if (usuario) {
            tipoUsuario = 'medico';
        }
    }

    // Se o usuário não for encontrado
    if (!usuario) {
        return res.status(401).json({ mensagem: "Login inválido" });
    }

    // Verifica se a senha está correta
    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: "Senha inválida" });
    }

    // Cria o token e inclui o tipo
    const token = jwt.sign(
        { login: usuario.login, tipo: tipoUsuario },
        "chave-secreta",
        { expiresIn: "1h" }
    );

    const nome = usuario.nome;

    // Retorna o token e o tipo de usuário
    res.status(200).json({ token, tipo: tipoUsuario, nome});
});



// http://localhost:3000/
app.listen(3000, () => {
    try {
        conectarAoMongoDB()
        console.log("up and running");
    } catch (e) {
        console.log("Error", e);
    }
})