const searchBar = document.getElementById("search");
const deleteButton = document.getElementById("delete");
const ul = document.getElementById("ul");

form = document.querySelector('form')

// obtener localStorage
let recentSearches;

if (localStorage.recentSearches && localStorage.recentSearches != "") {
  recentSearches = JSON.parse(localStorage.recentSearches);
} else {
  recentSearches = [];
}

const makeListItem = (text, parent) => {
  let listItem = document.createElement("li");
  listItem.textContent = text;
  listItem.className = "list-group-item";
  parent.appendChild(listItem);
};

recentSearches.forEach(element => {
  makeListItem(element, ul);
});

const isDuplicateValue = (arr, text) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == text) {
      return true;
    }
  }

  return false;
};

// form

form.addEventListener('submit', function(e) {
    e.preventDefault();
    inpValue = e.target.querySelector('input').value
    fetchData4mAPI(inpValue)
    if (
      searchBar.value == "" ||
      isDuplicateValue(recentSearches, searchBar.value)
    ) {
      return;
    } else {
      recentSearches.push(searchBar.value);
      makeListItem(searchBar.value, ul);
      localStorage.recentSearches = JSON.stringify(recentSearches);
      searchBar.value = "";
    }
})

async function fetchData4mAPI(inpVal) {
    app_id = 'd8feb9b1';
    app_key = 'cd9cb2390f98fe12e951f5df71d0b41e';
    baseURl = `https://api.edamam.com/search?q=${inpVal}&app_id=${app_id}&app_key=${app_key}&to=4`;
    result = await fetch(baseURl);
    datas = await result.json()
    console.log(datas)
    genrateHTML(datas.hits);
}

// borrar resultados
deleteButton.addEventListener("click", () => {
  localStorage.clear();
  recentSearches = [];
  searchBar.value = "";

  let arr = document.querySelectorAll("li");

  for (let i = 0; i < arr.length; i++) {
    arr[i].remove();
  }
});


// Generar resultados
function genrateHTML(results) {
    showINHTML = '';
    results.map(result => {
        showINHTML += `
        <div class="col-3 my-3">
        <div class="card">
            <div class="card-body">
                <img src="${result.recipe.image}" alt="" class='img-fluid'>
                <h6 class=' text-center my-2 text-truncate'>${result.recipe.label}</h6>
                <div class="d-flex justify-content-between align-items-center">
                    <h6 class=' align-self-stretch mx-auto my-auto'>Calorias: ${result.recipe.calories.toFixed(2)}</h6>
                    <a href='${result.recipe.url}' class='btn btn-link align-self-stretch'>Ver receta</a>
                </div>
            </div>
        </div>
    </div> 
        `
        document.querySelector('#mostrarReceta').innerHTML = showINHTML;

    })
}




