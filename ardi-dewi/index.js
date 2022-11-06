const modal = document.getElementById("modal");
const body = document.getElementById("body");

// Navbar Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Music
const audio = document.querySelector("audio");
const discButton = document.getElementById('discButton');

// DOM EVENT
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bank-select').value === 'bca') {
        document.getElementById('bank-title').innerText = 'Bank BCA'
        document.getElementById('bank-number').innerText = 'Account Number: 8691474861'
        document.getElementById('bank-name').innerText = 'a.n Ardiansyah'
        document.getElementById('bank-qr').src = './assets/img/qr-bca.jpg'
    } else {
        document.getElementById('bank-title').innerText = 'Bank BNI'
        document.getElementById('bank-number').innerText = 'Account Number: 1051726230'
        document.getElementById('bank-name').innerText = 'a.n Dewi Ratnawati'
        document.getElementById('bank-qr').src = './assets/img/qr-bni.jpeg'
    } 
})

// onload event 
window.onload = async () => {
    // audio.play();
    // audio.volume = 0.3
    // discButton.classList.add('animate-spin-slow');
    await getUcapanData();

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop)
    })
    let guestName = params.tamu;
    
    await fetch(`${SHEET_URL}?action=check_guest&tamu=${guestName}`)
        .then((res) => res.json())
        .then((res) => {
            if (res.data !== null) {
                document.getElementById("guestTo").innerText = 'Kepada Yth Bapak/Ibu/Saudara/i:';
                document.getElementById("guestTo").classList.add('animate__animated');
                document.getElementById("guestTo").classList.add('animate__fadeIn');
                document.getElementById("guestName").innerText = res.data.nama;
                document.getElementById("guestName").classList.add('animate__animated');
                document.getElementById("guestName").classList.add('animate__fadeIn');
                document.getElementById("guestName").classList.add('animate__slow');
                openButton.classList.remove('hidden');
                openButton.classList.add('animate__animated');
                openButton.classList.add('animate__fadeIn');
                openButton.classList.add('animate__delay-1s');
            } else {
                openButton.classList.remove('hidden');
                openButton.classList.add('animate__animated');
                openButton.classList.add('animate__fadeIn');
                openButton.classList.add('animate__delay-1s');
            }
        })
}

discButton.addEventListener('click', function () {
    if (audio.paused) {
        discButton.classList.add('animate-spin-slow');
        audio.play();
    } else {
        discButton.classList.remove('animate-spin-slow');
        audio.pause();
    }
});

// Countdown date
let x = setInterval(() => {
    let weddingDate = new Date("Nov 19, 2022 09:00:00").getTime();
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

// SPREADSHEET API
const SHEET_URL = "https://script.google.com/macros/s/AKfycbz1kYLmQuvFLWi_9jr3_WehxMqF5YcqzyZKzBUEDkADVzQ5OCYh2zWM8cua9_-FYyex3g/exec"

// UCAPAN
async function getUcapanData () {
    let ucapanInner = document.getElementById("ucapan-inner");
    let template = '';
    await fetch(`${SHEET_URL}?action=get_all_greetings`)
        .then((res) => res.json())
        .then((res) => {
            res.data.forEach((item) => {
                template += `
                    <article id="card-wishes" class="rounded-lg bg-white p-6 text-gray-700">
                        <h1 class="text-xl font-brand text-brand-dark-blue">
                            ${item.nama}
                        </h1>
                        <p class="mt-4">
                            ${item.ucapan}
                        </p>
                    </article>
                `;
            })
            ucapanInner.innerHTML = template;
        })
}

document.getElementById('sendUcapan').addEventListener('click', (e) => {
    e.preventDefault();
    
    let nama = document.getElementById("namaUcapan").value;
    let ucapan = document.getElementById("pesanUcapan").value;

    if (nama === "" && ucapan === "") {
        document.getElementById('error-nama-ucapan').classList.remove('hidden')
        document.getElementById('error-pesan-ucapan').classList.remove('hidden')
    } else if (nama !== "" && ucapan === "") {
        document.getElementById('error-nama-ucapan').classList.add('hidden')
        document.getElementById('error-pesan-ucapan').classList.remove('hidden')
    } else if (nama === "" && ucapan !== "") {
        document.getElementById('error-nama-ucapan').classList.remove('hidden')
        document.getElementById('error-pesan-ucapan').classList.add('hidden')
    } else {
        document.getElementById("namaUcapan").value = '';
        document.getElementById("pesanUcapan").value = '';

        document.getElementById("textUcapan").classList.remove('hidden');
        document.getElementById('error-nama-ucapan').classList.add('hidden')
        document.getElementById('error-pesan-ucapan').classList.add('hidden')
        
        const form = new FormData();
        form.append('action', 'create_greeting');
        form.append('nama', nama);
        form.append('ucapan', ucapan);
        
        fetch(SHEET_URL, {
            method: 'POST',
            body: form
        }).then((res) => res.json())
        .then(() => {
            getUcapanData();
            setTimeout(() => {
                document.getElementById("textUcapan").classList.add('hidden');
            }, 2000)
        })
        .catch((e) => console.log(e.message))
    }
})

// BANK
document.getElementById('sendHadiah').addEventListener('click', () => {
    let nama = document.getElementById('namaHadiah').value
    let pengirim = document.getElementById('bankPengirim').value
    let jumlah = document.getElementById('jumlahHadiah').value
    let pesan = document.getElementById('pesanHadiah').value

    if (nama === "") {
        document.getElementById('error-nama-hadiah').classList.remove('hidden')
    } else {
        document.getElementById('error-nama-hadiah').classList.add('hidden')
    }
    if (pengirim === "") {
        document.getElementById('error-bank-hadiah').classList.remove('hidden')
    } else {
        document.getElementById('error-bank-hadiah').classList.add('hidden')
    }
    if (jumlah === "") {
        document.getElementById('error-jumlah-hadiah').classList.remove('hidden')
    } else {
        document.getElementById('error-jumlah-hadiah').classList.add('hidden')
    }hadiah
    if (pesan === "") {
        document.getElementById('error-pesan-hadiah').classList.remove('hidden')
    } else {
        document.getElementById('error-pesan-hadiah').classList.add('hidden')
    }

    if (nama !== "" && pengirim !== "" && jumlah !== "" && pesan !== "") {
        document.getElementById('namaHadiah').value = ''
        document.getElementById('bankPengirim').value = ''
        document.getElementById('jumlahHadiah').value = ''
        document.getElementById('pesanHadiah').value = ''

        document.getElementById('text-hadiah').classList.remove('hidden')
    
        const form = new FormData();
        form.append('action', 'create_gift');
        form.append('bank', 'BCA');
        form.append('nama', nama);
        form.append('bank_pengirim', pengirim);
        form.append('jumlah', jumlah);
        form.append('pesan', pesan);
        
        fetch(SHEET_URL, {
            method: 'POST',
            body: form
        }).then((res) => res.json())
        .then(() => {
            setTimeout(() => {
                document.getElementById('text-hadiah').classList.add('hidden')
            }, 2000)
        })
        .catch((e) => console.log(e.message))
    }
})

// BANK CHANGE 
document.getElementById('bank-select').addEventListener('input', (e) => {
    let bank = e.target.value
    
    if (bank === 'bca') {
        document.getElementById('bank-title').innerText = 'Bank BCA'
        document.getElementById('bank-number').innerText = 'Account Number: 8691474861'
        document.getElementById('bank-name').innerText = 'a.n Ardiansyah'
        document.getElementById('bank-qr').src = './assets/img/qr-bca.jpg'
    } else {
        document.getElementById('bank-title').innerText = 'Bank BNI'
        document.getElementById('bank-number').innerText = 'Account Number: 1051726230'
        document.getElementById('bank-name').innerText = 'a.n Dewi Ratnawati'
        document.getElementById('bank-qr').src = './assets/img/qr-bni.jpeg'
    }
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