let dados = [];

// Carrega o CSV e obtém a data real de modificação
fetch("dados.csv")
  .then(response => {
    const dataArquivo = new Date(response.headers.get("Last-Modified"));
    if (!isNaN(dataArquivo)) {
      const opcoes = { 
        day: "2-digit", month: "2-digit", year: "numeric", 
        hour: "2-digit", minute: "2-digit" 
      };
      document.getElementById("ultimaAtualizacao").textContent =
        "Última atualização: " + dataArquivo.toLocaleString("pt-BR", opcoes);
    } else {
      document.getElementById("ultimaAtualizacao").textContent =
        "Última atualização: (não disponível)";
    }
    return response.text();
  })
  .then(text => {
    dados = text.split("\n").slice(1).map(linha => {
      const [cidade, transportadora, uf, prazo, tipo] = linha.split(",");
      return { cidade, transportadora, uf, prazo, tipo };
    });
  });

// Elementos
const tbody = document.querySelector("#results tbody");

// Função de sugestões
function configurarPesquisa(campoInput, campoSugestoes, propriedade) {
  campoInput.addEventListener("input", () => {
    const termo = campoInput.value.toLowerCase();
    campoSugestoes.innerHTML = "";
    if (termo.length > 0) {
      const filtrados = dados.filter(d => d[propriedade]?.toLowerCase().includes(termo));
      const unicos = [...new Set(filtrados.map(d => d[propriedade]))]; // evitar repetições
      unicos.slice(0, 5).forEach(valor => {
        const li = document.createElement("li");
        li.textContent = valor;
        li.onclick = () => {
          campoInput.value = valor;
          campoSugestoes.innerHTML = "";
          mostrarResultados(valor, propriedade);
        };
        campoSugestoes.appendChild(li);
      });
    }
  });

// Enter para pesquisar
search.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    mostrarResultados(campoInput.value, propriedade);
    suggestions.innerHTML = "";
  }
});

// Mostrar tabela
function mostrarResultados(cidade) {
  tbody.innerHTML = "";
  const filtrados = dados.filter(d => d.cidade.toLowerCase() === cidade.toLowerCase());
  filtrados.forEach(d => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.cidade}</td>
      <td>${d.transportadora}</td>
      <td>${d.uf}</td>
      <td>${d.prazo}</td>
      <td>${d.tipo}</td>
    `;
    tbody.appendChild(tr);
  });
}
