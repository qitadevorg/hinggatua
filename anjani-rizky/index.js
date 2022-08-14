const openButton = document.getElementById("openButton");
const modal = document.getElementById("modal");
const body = document.getElementById("body");

openButton.addEventListener('click', (e) => {
    e.preventDefault();

    modal.classList.add('hidden');
    body.classList.remove('overflow-hidden')
})

window.addEventListener('resize', (event) => {
    console.log(event)
})