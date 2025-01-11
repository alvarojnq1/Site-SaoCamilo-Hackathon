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
    login: {type: String, required: true, unique: true}, // login também é o email usado no perfil do usuário (modal)
    password: {type: String, required: true},
    nome: {type: String, required: true},
    tipo: {type: String, required: true},
    profissao: { type: String, default: null }, // Agora não é obrigatório
    idade: { type: Number, default: null, min: 0 } // Agora não é obrigatório
}))

const Medico = mongoose.model("Medico", mongoose.Schema({
    login: {type: String, required: true, unique: true}, // login também é o email usado no perfil do usuário (modal)
    password: {type: String, required: true},
    nome: {type: String, required: true},
    tipo: {type: String, required: true},
    profissao: {type: String, required: true},
    descricao: {type: String, required: true},
    idade: {type: Number, required: true, min: 0}
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
        const { login, password, nome, profissao, idade } = req.body;
    
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
            tipo: "paciente", // Aqui o tipo é fixado como paciente
            profissao: profissao || null, // Define como null caso não seja enviado
            idade: idade || null // Define como null caso não seja enviado
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

    usuario = await Paciente.findOne({ login }); // Verifica paciente
    if (usuario) {
        tipoUsuario = 'paciente';
    } else {
        usuario = await Medico.findOne({ login }); // Verifica médico
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
        process.env.JWT_SECRET, // Use a chave secreta do arquivo .env
        { expiresIn: "1h" }
    );

    // Retorna os dados relevantes
    const retorno = {
        token,
        tipo: tipoUsuario,
        nome: usuario.nome,
        profissao: usuario.profissao || null, // Inclui profissão
        idade: usuario.idade || null,        // Inclui idade
    };

    // Inclui descrição se o usuário for médico
    if (tipoUsuario === 'medico') {
        retorno.descricao = usuario.descricao || null;
    }

    res.status(200).json(retorno);
});


// Validação do Token
app.get("/validate-token", (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token não fornecido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ message: "token válido", user: decoded });
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
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