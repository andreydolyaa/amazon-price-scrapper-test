

const BASE_URL = 'http://localhost:3001'




async function submitForm(event) {
    event.preventDefault();
    var data = {
        page: document.querySelector('.item-url').value,
        expectedPrice: document.querySelector('.expected').value,
        userEmail: document.querySelector('.email').value
    }
    await axios.post(`${BASE_URL}/subscribe`, data);
    subscribed(data);
}

async function getData(URL) {
    var isLoading = true;
    if (isLoading) loadingScreen();
    var data = { URL }
    var res = await axios.post(`${BASE_URL}/item`, data);
    isLoading = false;
    renderItemData(res.data);
    return res.data;
}

