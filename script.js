let filter = ''

function handleFilterChange() { //método para filtragem dos dados
  const { value } = document.getElementById('filter'); //Selecionando o class do html

  if (value) {
    filter = value.trim() //Remover espaços no inicio e fim do texto
  } else {
    filter = ''
  }

  fetchData()
}


function fetchData() { //método Fetch
  fetch("https://api.artic.edu/api/v1/artworks") //requisição
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
            <th >Id</th>
            <th >Título</th>
            <th >Nome do artista</th>
            <th >Ano de exibição</th>
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


        console.log('pode ser escrito:', canBeWrite);

        console.log(typeof id)

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
        if(date_display=='null'){
          canBeWrite = true;
        }

        if (date_display.toLowerCase().includes(filter.toLowerCase())){
          canBeWrite = true;
        }

        console.log('realmente pode ser escrito?', canBeWrite);

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

      console.log(html);

      document.getElementById("app").innerHTML = html;
    })
    .catch(error => console.log(error));
}

fetchData();