const carros = []

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

    carros.push(newCarro)
    return newCarro

}

// LER (read)

function precoParaNumero(valor) {
  return Number(valor.replace(/\D/g, "")) / 100;
}

const inputPreco = document.getElementById("precoCarro");

inputPreco.addEventListener("input", () => {
  const digitos = inputPreco.value.replace(/\D/g, "");
  inputPreco.value = digitos
    ? (Number(digitos) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "";
});

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
