let weddingDate = new Date("Aug 6, 2022 10:00:00").getTime();
let googleSheetURL = "https://script.google.com/macros/s/AKfycbwVBBeQYkYkk00KbsAWlBEihrEfiuAvFIYVCwdT542Y_kqf633c9rdazKkOPcBBo2U6dg/exec";
let sendButton = document.getElementById("ucapan-send");
let homeNav = document.getElementById("home-btn");
let groupNav = document.getElementById("group-btn");
let agendaNav = document.getElementById("agenda-btn");
let angpaoNav = document.getElementById("angpao-btn");
let ucapanNav = document.getElementById("ucapan-btn");

let x = setInterval(() => {
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

homeNav.classList.add('text-white');

window.addEventListener('hashchange', () => {
    switch(window.location.hash) {
        case '#home':
            homeNav.classList.add('text-white');
            [groupNav, agendaNav, angpaoNav, ucapanNav].forEach((item) => item.classList.remove('text-white'));
            break;
        case '#pasangan':
            groupNav.classList.add('text-white');
            [homeNav, agendaNav, angpaoNav, ucapanNav].forEach((item) => item.classList.remove('text-white'));
            break;
        case '#agenda':
            agendaNav.classList.add('text-white');
            [homeNav, groupNav, angpaoNav, ucapanNav].forEach((item) => item.classList.remove('text-white'));
            break;
        case '#angpao':
            angpaoNav.classList.add('text-white');
            [homeNav, agendaNav, groupNav, ucapanNav].forEach((item) => item.classList.remove('text-white'));
            break;
        case '#ucapan':
            ucapanNav.classList.add('text-white');
            [homeNav, agendaNav, angpaoNav, groupNav].forEach((item) => item.classList.remove('text-white'));
            break;
    }
})

async function getUcapanData () {
    let ucapanInner = document.getElementById("ucapan-inner");
    await fetch(`${googleSheetURL}?action=get_all_greetings`)
        .then((res) => res.json())
        .then((res) => {
            res.data.forEach((item) => {
                ucapanInner.innerHTML += `
                    <article id="card-wishes" class="card hidden break-inside-avoid mb-4 rounded-xl bg-gray-200 text-primary flex flex-col items-start p-6">
                        <h1 class="text-xl font-bold font-title">
                            ${item.nama}
                        </h1>
                        <p class="my-4">
                            ${item.ucapan}
                        </p>
                    </article>
                `
            })
        })
}

sendButton.addEventListener('click', async (e) => {
    e.preventDefault();
    
    let nama = document.getElementById("ucapan-input").value;
    let ucapan = document.getElementById("ucapan-textarea").value;

    const form = new FormData();
    form.append('action', 'create_greeting');
    form.append('nama', nama);
    form.append('ucapan', ucapan);
    
    await fetch(googleSheetURL, {
        method: 'POST',
        body: form
    }).then((res) => res.json())
    .then((res) => console.log(res))

    setTimeout(() => {
        getUcapanData();
    }, 3000)
})

getUcapanData();



