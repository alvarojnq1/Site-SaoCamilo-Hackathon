// ------------------------------------------ Código Front-End com o Back-End ------------------------------------------------

const protocolo = `http://`
const baseURL = `localhost:3000`

// Signup Users
async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector("#usuarioCadastroInput");
    let passwordCadastroInput = document.querySelector("#usuarioPasswordInput");
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value 
    let nomePaciente = usuarioNomeInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = "/signup"
            const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            // Remover o tipo e sempre cadastrar como paciente
            await axios.post(URLCompleta, {
                login: usuarioCadastro, 
                password: passwordCadastro,
                nome: nomePaciente
            }) 
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            usuarioNomeInput.value = ""
            exibirAlerta(".alert-modal-cadastro", "Usuário cadastrado com sucesso", ["show", "alert-success"], ["d-none", "alert-danger"], 2000);
            // ocultartModal("#cadastroModal", 1000)
        } catch (error) {
            exibirAlerta(".alert-modal-cadastro", "Erro ao cadastrar usuário", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        }
    } else {
        exibirAlerta(".alert-modal-cadastro", "Preencha todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
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

            console.log(response.data);
            usuarioLoginInput.value = "";
            passwordLoginInput.value = "";

            // Exibe o ícone para pacientes após login bem-sucedido
            if (response.data && response.data.token) {
                // Verifica se o tipo de usuário é paciente
                if (response.data.tipo === "paciente") {
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
                }else if (response.data.tipo === "medico"){
                    // tratar fisioterapeuta da nav-bar
                    document.getElementById("icone-medico").style.display = "inline"; // Torna o ícone visível
                    document.getElementById("botao-logout").style.display = "inline";
                    document.getElementById("botao-login").style.display = "none";
                    document.getElementById("gerenciamento-nav").style.display="inline";
                }
            }

            exibirAlerta(".alert-modal-login", "Login efetuado com sucesso!", ["show", "alert-success"], ["d-none", "alert-danger"], 2000);
            ocultartModal("#loginModal", 1000);
        } catch (e) {
            exibirAlerta(".alert-modal-login", "Erro ao fazer login", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
        }
    } else {
        exibirAlerta(".alert-modal-login", "Preencha todos os campos", ["show", "alert-danger"], ["d-none", "alert-success"], 2000);
    }
}


function logout() {
    // Remover o token de autenticação do localStorage
    localStorage.removeItem('token');  // Ou sessionStorage, dependendo de onde você armazena o token

    // Ocultar o ícone do paciente e médico, e o botão de logout
    document.getElementById("icone-paciente").style.display = "none";
    document.getElementById("icone-medico").style.display = "none";
    document.getElementById("botao-logout").style.display = "none";

    // Mostrar o botão de login
    document.getElementById("botao-login").style.display = "inline";

    

    // Opcional: Exibir um alerta de sucesso
    exibirAlerta(".alert-modal-login", "Deslogado com sucesso!", ["show", "alert-success"], ["d-none", "alert-danger"], 2000);

    // Redirecionar para a página de login
    window.location.href = './index.html';  // Ou para qualquer outra URL que seja a página de login do seu site
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