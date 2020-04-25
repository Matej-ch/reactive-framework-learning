let root = document.querySelector('[m-data]');

let data = getInitialData();

function getInitialData() {
    let dataString = root.getAttribute('m-data');
    return eval('(`${dataString}`)');
}