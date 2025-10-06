let dados = [];

// Carrega o CSV
fetch("dados.csv")
  .then(response => response.text())
  .then(text => {
    dados = text.split("\n").slice(1).map(linha => {
      const [cidade, transportadora, uf, prazo, tipo] = linha.split(",");
      return { cidade, transportadora, uf, prazo, tipo };
    });
  });

// Elementos
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const tbody = document.querySelector("#results tbody");

// Função de sugestões
search.addEventListener("input", () => {
  const termo = search.value.toLowerCase();
  suggestions.innerHTML = "";
  if (termo.length > 0) {
    const filtrados = dados.filter(d => d.cidade.toLowerCase().includes(termo));
    filtrados.slice(0, 5).forEach(d => {
      const li = document.createElement("li");
      li.textContent = d.cidade;
      li.onclick = () => {
        search.value = d.cidade;
        suggestions.innerHTML = "";
        mostrarResultados(d.cidade);
      };
      suggestions.appendChild(li);
    });
  }
});

// Enter para pesquisar
search.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    mostrarResultados(search.value);
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
