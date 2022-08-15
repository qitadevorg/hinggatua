const audio = document.querySelector("audio");
const openButton = document.getElementById("openButton");
const modal = document.getElementById("modal");
const body = document.getElementById("body");
const discButton = document.getElementById('discButton');
const ucapanContainer = document.getElementById("ucapan-inner");
const loadMore = document.getElementById("loadMore");
const submitBtn = document.getElementById("submitBtn");

let ucapanArr = [];
let defaultPagination = 6;
let gsheetsUrl = 'https://script.google.com/macros/s/AKfycbyAFvjxyqtUs1t0Z6OtyygmnKmABFUdc2SXqIOR_RcdBx6BePWlA3WJdjDSDwpRn3kjpQ/exec';

let x = setInterval(() => {
    let weddingDate = new Date("Aug 21, 2022 09:00:00").getTime();
    let currentDate = new Date().getTime();
    let diff = weddingDate - currentDate;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days < 10 ? "0"+days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0"+hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0"+minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0"+seconds : seconds;
    
    if (diff < 0) {
        clearInterval(x);
        document.getElementById("days").innerHTML = "00";
        document.getElementById("hours").innerHTML = "00";
        document.getElementById("minutes").innerHTML = "00";
        document.getElementById("seconds").innerHTML = "00";
    }
}, 1000);

async function getUcapanData() {
    await fetch(`${gsheetsUrl}?action=get_all_greetings`)
        .then((res) => res.json())
        .then(async (res) => {
            ucapanArr = [];
            res.data.forEach((item) => ucapanArr.push({ name: item.nama, greeting: item.ucapan }))
            await renderUcapan(ucapanArr);
        });
    if (ucapanArr.length > 6) {
        loadMore.classList.remove('hidden');
    } else {
        loadMore.classList.add('hidden');
    }
}

async function renderUcapan(greetings, total = defaultPagination) {
    if (greetings && greetings !== []) {
        let greetArr = (greetings && greetings.length > 6) ? greetings.slice(0, total) : greetings;
        console.log(greetArr)
        if (greetArr.length === ucapanArr.length) loadMore.classList.add('hidden');
        else loadMore.classList.remove('hidden');

        let template = '';
        greetArr.forEach((item) => {
            template += `
                <article id="card-wishes" class="card mb-4 rounded-xl bg-gray-200 text-primary flex flex-col items-start p-6">
                    <h1 class="text-xl font-bold font-brand">
                        ${item.name}
                    </h1>
                    <p class="my-4">
                        ${item.greeting}
                    </p>
                </article>
            `
        })
        ucapanContainer.innerHTML = template;
    }
}

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    document.getElementById("ucapanHandler").classList.remove('hidden');
    
    let nama = document.getElementById("ucapan-input").value;
    let ucapan = document.getElementById("ucapan-textarea").value;
    
    document.getElementById("ucapan-input").value = '';
    document.getElementById("ucapan-textarea").value = '';
    
    const form = new FormData();
    form.append('action', 'create_greeting');
    form.append('nama', nama);
    form.append('ucapan', ucapan);
    
    await fetch(gsheetsUrl, {
        method: 'POST',
        body: form
    }).then((res) => res.json())
    .then(async () => {
        await getUcapanData();
        setTimeout(() => {
            document.getElementById("ucapanHandler").classList.add('hidden');
        }, 2000)
    })
    .catch((e) => console.log(e.message))
})

loadMore.addEventListener('click', async (e) => {
    defaultPagination += 6;
    await renderUcapan(ucapanArr);
})

openButton.addEventListener('click', (e) => {
    modal.classList.add('animate__animated');
    modal.classList.add('animate__fadeOutUp');
    body.classList.remove('overflow-hidden');
    discButton.classList.add('animate-spin-slow');
    audio.autoplay = true;
    audio.loop = true;
    audio.volume = 0.2;
    audio.play();
})

discButton.addEventListener('click', (e) => {
    if (audio.paused) {
        discButton.classList.add('animate-spin-slow');
        audio.play();
    } else {
        discButton.classList.remove('animate-spin-slow');
        audio.pause();
    }
})

window.onload = async () => {
    await getUcapanData();

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
    })
    let guestName = params.tamu;
    
    await fetch(`${gsheetsUrl}?action=check_guest&tamu=${guestName}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.data !== null) {
                document.getElementById("guestName").innerText = res.data.nama;
                document.getElementById("guestName").classList.add('animate__animated');
                document.getElementById("guestName").classList.add('animate__fadeIn');
                openButton.classList.remove('hidden');
                openButton.classList.add('animate__animated');
                openButton.classList.add('animate__fadeIn');
                openButton.classList.add('animate__delay-1s');
            } else {
                document.getElementById("guestName").innerText = "-";
                openButton.classList.remove('hidden');
                openButton.classList.add('animate__animated');
                openButton.classList.add('animate__fadeIn');
                openButton.classList.add('animate__delay-1s');
            }
        })
}