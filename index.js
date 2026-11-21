function carregarCarros() {
    try {
        return JSON.parse(localStorage.getItem("carros")) || []
    } catch {
        return []
    }
}

const carros = carregarCarros()

function salvarCarros() {
    localStorage.setItem("carros", JSON.stringify(carros))
}

//CRIA (create)

function createCarro({modelo, marca, ano, cor, preco}) {

    const newCarro = {
        id: carros.length? carros[carros.length -1].id + 1 : 1,
        modelo,
        marca,
        ano: Number(ano),
        cor,
        preco: precoParaNumero(preco)
    }

    console.log(newCarro)

    carros.push(newCarro)
    salvarCarros()
    return newCarro

}

// LER (read)

function precoParaNumero(valor) {
  return Number(valor.replace(/\D/g, "")) / 100;
}

function aplicarMascaraPreco(input) {
  input.addEventListener("input", () => {
    const digitos = input.value.replace(/\D/g, "");
    input.value = digitos
      ? (Number(digitos) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "";
  });
}

aplicarMascaraPreco(document.getElementById("precoCarro"));
aplicarMascaraPreco(document.getElementById("atualiza-preco"));

function renderCarros(listaCarros = carros) {
    const lista = document.getElementById("lista-carros")

    if (listaCarros.length === 0) {
        lista.innerHTML = "<li>Nenhum carro cadastrado</li>"
        return
    }

    lista.innerHTML = [...listaCarros].sort((a, b) => b.preco - a.preco).map((carro) =>
        `<li>ID: ${carro.id} | Modelo: ${carro.modelo} | Marca: ${carro.marca} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: ${carro.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</li>`
    )
    .join("");
}

renderCarros()

const form = document.getElementById("form-carro");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const dados = Object.fromEntries(new FormData(form));
  createCarro(dados);

  renderCarros();
  form.reset();
});

// FILTRA POR MARCA

const inputFilter = document.getElementById("filtro-marca")
const btnFilter = document.getElementById("filtro-por-marca")

function filterByBrad() {
    const marca = inputFilter.value.trim().toLowerCase()

    if (marca === "") {
        renderCarros()
        return
    }

    const filtrados = carros.filter((carro) =>
        carro.marca.toLowerCase() === marca
    )

    renderCarros(filtrados)
}

btnFilter.addEventListener("click", filterByBrad)


// ATUALIZAR (update)

const inputAtualizaID = document.getElementById("atualiza-carro")
const btnFilterID = document.getElementById("selecao-id")

const pTitulo = document.getElementById("titulo-edicao")
const inputNovaCor = document.getElementById("atualiza-cor")
const inputNovoPreco = document.getElementById("atualiza-preco")
const btnAtualizar = document.getElementById("btn-atualizar")

let carroSelecionado = null

function mostrarEdicao(visivel) {
    const display = visivel ? "" : "none"

    pTitulo.style.display = display
    inputNovaCor.style.display = display
    inputNovoPreco.style.display = display
    btnAtualizar.style.display = display
}

mostrarEdicao(false)

function selecionaCarro() {

    const id = Number(inputAtualizaID.value.trim())

    const carro = carros.find((i) => {
       return i.id === id
    })

    if (!carro) {
        carroSelecionado = null
        mostrarEdicao(false)
        alert("ID não encontrado")
        return
    }

    carroSelecionado = carro
    mostrarEdicao(true)
}

btnFilterID.addEventListener("click", selecionaCarro)

function atualizarCarro() {
    if (!carroSelecionado) return

    const novaCor = inputNovaCor.value.trim()

    if (novaCor) carroSelecionado.cor = novaCor
    if (inputNovoPreco.value) carroSelecionado.preco = precoParaNumero(inputNovoPreco.value)

    salvarCarros()
    renderCarros()

    inputNovaCor.value = ""
    inputNovoPreco.value = ""
    inputAtualizaID.value = ""

    carroSelecionado = null
    mostrarEdicao(false)
}

btnAtualizar.addEventListener("click", atualizarCarro)


// DELETA (delete)

const inputDeleteID = document.getElementById("excluir")
const btnExcluir = document.getElementById("btn-excluir")

function deletarCarro() {
    const id = Number(inputDeleteID.value.trim())

    const posicao = carros.findIndex((carro) => carro.id === id)

    if (posicao === -1) {
        alert("Veículo não encontrado.")
        return
    }

    carros.splice(posicao, 1)

    salvarCarros()
    renderCarros()
    inputDeleteID.value = ""
}

btnExcluir.addEventListener("click", deletarCarro)