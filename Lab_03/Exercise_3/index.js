
const search = document.getElementById("searchInput");
const sortBy = document.getElementById("sortSelect");
const getBody = document.getElementById("productsTableBody");

let originalProducts = []; 
let currentProducts = [];

async function fetchProducts() {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    processData(data);
}

function processData(data) {
    const fetchedProducts = data.products.slice(0,30);
    originalProducts = fetchedProducts;
    currentProducts = [...originalProducts];
    renderTable(currentProducts);
}

function renderTable(products) {
    console.log("Gotowe do renderowania. Liczba produktów:", products.length);
    getBody.innerHTML = ''
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const row = document.createElement("tr");

        const imageCell = document.createElement("td");
        const imgElement = document.createElement("img");

        imgElement.src = product.thumbnail;
        imgElement.style.width = '80px';
        imageCell.appendChild(imgElement);
        

        const titleCell = document.createElement("td");
        titleCell.textContent = product.title;

        
        const dataCell = document.createElement("td");
        dataCell.textContent = product.description.substring(0, 150) + '...';
        
        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(dataCell);

        getBody.appendChild(row);
    }
}

fetchProducts();

search.addEventListener("input", handleFilter);


function handleFilter() {
    const searchText = search.value.toLowerCase()
    const filteredProducts = originalProducts.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(searchText);
        const descriptionMatch = product.description.toLowerCase().includes(searchText);
        return titleMatch || descriptionMatch;
    });
    currentProducts = filteredProducts;
    renderTable(currentProducts);
}

sortBy.addEventListener("change",handleSort);

function handleSort() {
    const sortFilter = sortBy.value;

    switch(sortFilter) {
        case "Rosnąco":
            currentProducts.sort((a,b) => a.title.localeCompare(b.title));
            break;

        case "Malejąco":
            currentProducts.sort((a,b) => b.title.localeCompare(a.title));
            break;

        case "Oryginalnie":
            currentProducts = [...originalProducts];
            break;
    }
    renderTable(currentProducts);
}