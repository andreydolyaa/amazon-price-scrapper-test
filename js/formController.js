


function renderItemData(data) {
    var section = document.querySelector('.item-data');
    if (data) {
        section.innerHTML = `
        <div class="item-data">
            <h5>${data.title}</h5>
            <img src="${data.img}">
            <h3>$${data.price}</h3>
        </div>
        `
    }
    else {
        section.innerHTML = `<img src="../assets/loading.gif"/>`
    }
}

function loadingScreen() {
    var section = document.querySelector('.item-data');
    section.innerHTML = `
    <div class="loading-container flex">
        <p>Loading item...</p>
        <img class="loading" src="../assets/loading.gif"/>
    </div>
    `
}

function subscribed(data){
    var section = document.querySelector('.item-data');
    section.innerHTML = `
    <div class="flex">
        <p>You have subscribed for price update!</p>
        <p>Your price - $${data.expectedPrice}</p>
        <p>Your Email - ${data.userEmail}</p>
    </div>
    `
}