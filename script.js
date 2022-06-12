const url = "https://api.artic.edu/api/v1/artworks"
let filter = ''

function handleFilterChange() { //método para filtragem dos dados
  const { value } = document.getElementById('filter'); //Selecionando o id do html

  if (value) {
    filter = value.trim() //Remover espaços no inicio e fim do texto
  } else {
    filter = ''
  }

  fetchData()
}

function sortTable(n) {
  let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.querySelector(".user");
  switching = true;
  dir = "asc"; // Direção como crescente

  while (switching) { //loop até não ter alteração feita.
    switching = false; // troca inicia como falsa
    rows = table.rows; // anda em todas as linhas
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;// inicialmente não tem troca

      // Compara a linha atual com a próxima
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      // verifica se as linhas podem trocar, levando em consideração asc ou desc
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {

          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // caso atenda, shouldSwitch é true e o loop é interrompido
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      // se shouldSwitch é true , faz o switch e o marcando, mostrando que a troca foi feita.
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;

      switchcount ++;// A cada troca feita é adicionado a contagem +1
    } else {
      //caso não houve mudança e a direção for "asc" a direção é "desc" e reproduz o loop novamente.
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


function fetchData() { //método Fetch
  fetch(url) //requisição
    .then((response) => { 
      if (!response.ok) { //verificando o status
          throw Error("Erro");
      }

      return response.json(); // converter a resposta para um objeto JSON
    })
    .then(({ data: paints }) => { // desestruturação de objeto
      let html = `
        <table class="user"> 
          <tr class="user2">
            <th onclick="sortTable(0)" >Id</th>
            <th onclick="sortTable(1)">Título</th>
            <th onclick="sortTable(2)">Nome do artista</th>
            <th onclick="sortTable(3)">Ano de exibição</th>
          </tr>
      `;
      
      paints.map(({ id, title, artist_title, date_display }) => { //pegando os campos

        let canBeWrite = false;

        
        if (!title) {
          title = 'null'
        }

        if (!artist_title) {
        artist_title = 'null'
        }

        if (!date_display) {
          date_display = 'null'
        }

        if(date_display=='null'){
          canBeWrite = true;
        }

        // isNaN = is not a number
        if (!isNaN(filter) && id == Number(filter)) {
          canBeWrite = true;
        }

        if (title.toLowerCase().includes(filter.toLowerCase())) {
          canBeWrite = true;
        }

        if (artist_title.toLowerCase().includes(filter.toLowerCase())) {
          canBeWrite = true;
        }

        if (date_display.toLowerCase().includes(filter.toLowerCase())){
          canBeWrite = true;
        }

        //escrevendo a resposta em html, extraindo da data os campos requeridos
        if (canBeWrite) {
          html += `
            <tr>
              <td>${id}</td>
              <td>${title}</td>
              <td>${artist_title}</td>
              <td>${date_display}</td>
            </tr>
          `;
        }
      })

      html += '</table>';

      document.getElementById("app").innerHTML = html;
      
    })
    .catch(error => console.log(error));
}

fetchData();
