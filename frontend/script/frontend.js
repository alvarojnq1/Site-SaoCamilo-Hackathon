// ------------------------------------------ Código Front-End com o Back-End ------------------------------------------------

const protocolo = `http://`
const baseURL = `localhost:3000`

// Função para verificar se o usuário está logado e configurar a navbar após o refresh
window.onload = () => {
    const token = localStorage.getItem('token'); // Recupera o token armazenado no localStorage
    const tipo = localStorage.getItem('tipo'); // Recupera o tipo de usuário armazenado no localStorage

    if (token && tipo) {
        // Se o token e o tipo estiverem presentes, o usuário está logado
        configurarNavbar(tipo); // Função que configura a navbar com base no tipo de usuário
        
        // Atualiza o perfil do usuário no modal
        // Verificar prof, descr... / if (nomeUsuario && profUsuario && descrUsuario...)
        const nomeUsuario = localStorage.getItem('nome');
        if (nomeUsuario) {
            const tituloModal = document.getElementById('perfilModalLabel');
            tituloModal.textContent = `Olá, ${nomeUsuario}!`;  // Atualiza o nome no modal

            // Separa médico e paciente
            if (tipo === "paciente") {
                const nomeModal = document.getElementById('nomeModalLabel');
                nomeModal.textContent = `${nomeUsuario}`;  // Atualiza o nome no modal
            }
            if (tipo === "medico") {
                const nomeModal = document.getElementById('nomeModalLabel');
                nomeModal.textContent = `Dr(a). ${nomeUsuario}`;  // Atualiza o nome no modal
            }
        }

        // Se houver outros dados como profissão, idade, etc, atualize da mesma forma
        // const profUsuario = localStorage.getItem('profissao');
        // const descricaoUsuario = localStorage.getItem('descricao');
        // const idadeUsuario = localStorage.getItem('idade');
    } else {
        // Se não estiver logado, exibe o botão de login
        document.getElementById("botao-login").classList.remove("d-none");
        document.getElementById("botao-login").classList.add("show");
    }
};

async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector("#usuarioCadastroInput");
    let passwordCadastroInput = document.querySelector("#usuarioPasswordInput");
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value 
    let nomePaciente = usuarioNomeInput.value

    // Função para capitalizar o nome (primeira letra de cada palavra maiúscula)
    const formatarNome = (nome) => {
        return nome
            .split(" ") // Separa o nome em partes (por espaço)
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()) // Capitaliza cada palavra
            .join(" "); // Junta as palavras de volta com espaços
    }

    // Capitaliza o nome do paciente antes de enviar ao backend
    nomePaciente = formatarNome(nomePaciente);

    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = "/signup";
            const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`;

            // Envia o nome já formatado (com a primeira letra de cada palavra maiúscula)
            await axios.post(URLCompleta, {
                login: usuarioCadastro, 
                password: passwordCadastro,
                nome: nomePaciente
            }); 

            // Limpa os campos
            usuarioCadastroInput.value = "";
            passwordCadastroInput.value = "";
            usuarioNomeInput.value = "";

            // Exibe alerta de sucesso
            exibirAlerta(".alert-modal-cadastro", "Usuário cadastrado com sucesso", ["show", "alert-success"], ["d-none", "alert-danger"], 2000);
            ocultartModal("#cadastroModal", 1000);
        } catch (error) {
            exibirAlerta(".alert-modal-cadastro", "Erro ao cadastrar usuário", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        }
    } else {
        exibirAlerta(".alert-modal-cadastro", "Preencha todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        ocultartModal("#cadastroModal", 1000);
    }
}


const tipoUsuario = response.data.tipo;

// Função para personalizar a nav-bar
function customizarNavBar(tipoUsuario) {
    if (tipoUsuario === 'pacientes') {
      document.getElementById('pacientes').style.display = 'none'; // Esconde "Pacientes"
      document.getElementById('lembretes').textContent = 'Exercícios'; // Altera "Lembretes"
    } else if (tipoUsuario === 'medico') {
      document.getElementById('fisioterapeutas').style.display = 'none'; // Esconde "Fisioterapeutas"
      document.getElementById('lembretes').textContent = 'Criar Lembretes'; // Altera "Lembretes"
    }
  }
  
// Chama a função passando o tipo de usuário
customizarNavBar(userType);

// Login Users
async function fazerLogin() {
    let usuarioLoginInput = document.querySelector("#usuarioLoginInput");
    let passwordLoginInput = document.querySelector("#passwordLoginInput");
    let usuarioLogin = usuarioLoginInput.value;
    let passwordLogin = passwordLoginInput.value;

    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndPoint = "/login";
            const URLCompleta = `${protocolo}${baseURL}${loginEndPoint}`;
            // Envia somente login e senha
            const response = await axios.post(URLCompleta, {
                login: usuarioLogin,
                password: passwordLogin
            });

            usuarioLoginInput.value = "";
            passwordLoginInput.value = "";

            // Se a resposta contiver o token, armazene o token no localStorage
            if (response.data && response.data.token) {
                const { nome, tipo } = response.data;
                // Armazenar token e outras informações no localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('tipo', tipo); // Armazenando o tipo de usuário
                localStorage.setItem('nome', nome); // Armazenando o nome do usuário
                console.log("Token armazenado com sucesso!");

                // Alterar o título do modal para incluir o nome do usuário. 
                const tituloModal = document.getElementById('perfilModalLabel');
                tituloModal.textContent = `Olá, ${nome}!`;  // Atualiza com o nome do usuário

                // Separa se for paciente ou médico
                if (tipo === "paciente") {
                    const nomeModal = document.getElementById('nomeModalLabel');
                    nomeModal.textContent = `${nome}`;
                }

                // Chama a função para configurar a navbar com base no tipo de usuário
                configurarNavbar(tipo);
            }

            exibirAlerta(".alert-modal-login", "Login efetuado com sucesso!", ["show", "alert-success"], ["d-none", "alert-danger"], 2000);
            ocultartModal("#loginModal", 1000);
        } catch (e) {
            exibirAlerta(".alert-modal-login", "Erro ao fazer login", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        }
    } else {
        exibirAlerta(".alert-modal-login", "Preencha todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        ocultartModal("#loginModal", 1000);
    }
}


function configurarNavbar(tipo) {
    if (tipo === "paciente") {
        // Exibe o elemento fisioterapeutas
        document.getElementById("fisioterapeutas-nav").classList.add("show");
        document.getElementById("fisioterapeutas-nav").classList.remove("d-none");
        // Exibir icone paciente
        document.getElementById("icone-paciente").classList.add("show");
        document.getElementById("icone-paciente").classList.remove("d-none");
        // Exibir botão de logout
        document.getElementById("botao-logout").classList.add("show");
        document.getElementById("botao-logout").classList.remove("d-none");
        // Esconder botão de login
        document.getElementById("botao-login").classList.add("d-none");
        document.getElementById("botao-login").classList.remove("show");
        // Exibir o perfil
        document.getElementById("perfil-nav").classList.add("show");
        document.getElementById("perfil-nav").classList.remove("d-none");
        // Exibir exercicios
        document.getElementById("exercicios-nav").classList.add("show");
        document.getElementById("exercicios-nav").classList.remove("d-none");
    } else if (tipo === "medico") {
        // Exibe o elemento pacientes
        document.getElementById("pacientes-nav").classList.add("show");
        document.getElementById("pacientes-nav").classList.remove("d-none");
        // Exibir icone medico
        document.getElementById("icone-medico").classList.add("show");
        document.getElementById("icone-medico").classList.remove("d-none");
        // Exibir botão de logout
        document.getElementById("botao-logout").classList.add("show");
        document.getElementById("botao-logout").classList.remove("d-none");
        // Esconder botão de login
        document.getElementById("botao-login").classList.add("d-none");
        document.getElementById("botao-login").classList.remove("show");
        // Exibir o perfil
        document.getElementById("perfil-nav").classList.add("show");
        document.getElementById("perfil-nav").classList.remove("d-none");
        // Exibir exercicios
        document.getElementById("criar-lembretes-nav").classList.add("show");
        document.getElementById("criar-lembretes-nav").classList.remove("d-none");
        // Exibir aba pacientes
        document.getElementById("pacientes-nav").classList.add("show");
        document.getElementById("pacientes-nav").classList.remove("d-none");
    }
}

// Função para realizar logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    localStorage.removeItem('nome');
    
    // Exibir o botão de login novamente e esconder o conteúdo do perfil
    document.getElementById("botao-login").classList.remove("d-none");
    document.getElementById("botao-login").classList.add("show");
    
    document.getElementById("botao-logout").classList.add("d-none");
    document.getElementById("botao-logout").classList.remove("show");

    // Você pode redirecionar o usuário para a página de login ou para uma página inicial
    window.location.href = "../../index.html"; // Por exemplo, redirecionar para o login
}




// função de exibir alerta
function exibirAlerta(seletor, mensagem, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = mensagem
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.remove("show")
        alert.classList.add("d-none")
    }, timeout);
}

// função para fechar o modal
function ocultartModal(seletor, timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout);
}


// --------------------------------------------- Outras Funcionalidades ---------------------------------------------------


function alternarVisualizacaoSenha(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);
    
    // Verifica o tipo atual do campo de senha
    if (passwordInput.type === 'password') {
        // Se for "password", torna visível a senha
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');  // Remove o ícone de olho fechado
        eyeIcon.classList.add('fa-eye-slash');  // Adiciona o ícone de olho aberto
    } else {
        // Se for "text", torna a senha oculta novamente
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');  // Remove o ícone de olho aberto
        eyeIcon.classList.add('fa-eye');  // Adiciona o ícone de olho fechado
    }
}




function editarImagem() {
    document.getElementById('editImageSection').style.display = 'block';
    document.getElementById('btnEditarImagem').style.display = 'none';
}

function salvarImagem() {
    const inputImagem = document.getElementById('inputImagemPerfil');
    const imagemPerfil = document.getElementById('imagemPerfil');

    if (inputImagem.files && inputImagem.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagemPerfil.src = e.target.result;
        };
        reader.readAsDataURL(inputImagem.files[0]);
    }

    document.getElementById('editImageSection').style.display = 'none';
    document.getElementById('btnEditarImagem').style.display = 'block';
}

function editarPerfil() {
    document.getElementById('visualizacaoPerfil').style.display = 'none';
    document.getElementById('edicaoPerfil').style.display = 'block';
    document.getElementById('btnEditarPerfil').style.display = 'none';
}

function salvarEdicao() {
    document.getElementById('nome').innerText = document.getElementById('inputNome').value;
    document.getElementById('especialidade').innerText = document.getElementById('inputEspecialidade').value;
    document.getElementById('descricao').innerText = document.getElementById('inputDescricao').value;
    document.getElementById('email').innerText = document.getElementById('inputEmail').value;
    document.getElementById('idade').innerText = `${document.getElementById('inputIdade').value} anos`;

    document.getElementById('visualizacaoPerfil').style.display = 'block';
    document.getElementById('edicaoPerfil').style.display = 'none';
    document.getElementById('btnEditarPerfil').style.display = 'block';
}

// Ao fechar o modal de login, abra o modal de cadastro
$('#loginModal').on('hidden.bs.modal', function () {
    $('#cadastroModal').modal('show');
});