import Swiper from "https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.esm.browser.min.js";
import PhotoSwipeLightbox from "https://unpkg.com/photoswipe/dist/photoswipe-lightbox.esm.js";

const body = document.querySelector("body");
const modal = document.getElementById("modal");
const openButton = document.getElementById("openButton");
const bankSelect = document.getElementById("bank-select");
const bankTitle = document.getElementById("bank-title");
const bankNumber = document.getElementById("bank-number");
const bankName = document.getElementById("bank-name");
const bankQr = document.getElementById("bank-qr");
const audio = document.querySelector("audio");
const discButton = document.getElementById("discButton");
const guestTo = document.getElementById("guestTo");

// Navbar Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// DOM EVENT
document.addEventListener("DOMContentLoaded", () => {
  if (bankSelect) {
    if (bankSelect.value === "bca") {
      bankTitle.innerText = "Bank BCA";
      bankNumber.innerText = "Account Number: 8691474861";
      bankName.innerText = "a.n Ardiansyah";
      bankQr.src = "./assets/img/qr-bca.jpg";
    } else {
      bankTitle.innerText = "Bank BNI";
      bankNumber.innerText = "Account Number: 1051726230";
      bankName.innerText = "a.n Dewi Ratnawati";
      bankQr.src = "./assets/img/qr-bni.jpeg";
    }
  }
});

// onload event
window.onload = () => {
  getUcapanData();

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let guestName = params.tamu;

  if (guestName) {
    fetch(`${SHEET_URL}?action=check_guest&tamu=${guestName}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.data !== null) {
          guestTo.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i:<br>${res.data.nama}`;
          guestTo.classList.add("animate__animated");
          guestTo.classList.add("animate__fadeIn");
          openButton.classList.remove("hidden");
          openButton.classList.add("animate__animated");
          openButton.classList.add("animate__fadeIn");
          openButton.classList.add("animate__delay-1s");
        } else {
          openButton.classList.remove("hidden");
          openButton.classList.add("animate__animated");
          openButton.classList.add("animate__fadeIn");
          openButton.classList.add("animate__delay-1s");
        }
      });
  } else {
    guestTo?.classList.add("hidden");
    openButton?.classList.remove("hidden");
  }
};

discButton?.addEventListener("click", function () {
  if (audio.paused) {
    discButton.classList.add("animate-spin-slow");
    audio.play();
  } else {
    discButton.classList.remove("animate-spin-slow");
    audio.pause();
  }
});

// Countdown date
let x = setInterval(() => {
  let weddingDate = new Date(COUNTDOWN_TIME).getTime();
  let currentDate = new Date().getTime();
  let diff = weddingDate - currentDate;

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerHTML =
    minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerHTML =
    seconds < 10 ? "0" + seconds : seconds;

  if (diff < 0) {
    clearInterval(x);
    document.getElementById("days").innerHTML = "00";
    document.getElementById("hours").innerHTML = "00";
    document.getElementById("minutes").innerHTML = "00";
    document.getElementById("seconds").innerHTML = "00";
  }
}, 1000);

// UCAPAN
let greetings = [];
let maxGreetings = 6;
async function getUcapanData() {
  await fetch(`${SHEET_URL}?action=get_all_greetings`)
    .then((res) => res.json())
    .then((res) => {
      greetings = res.data;
      renderGreetings();
    });
}

function renderGreetings() {
  let ucapanInner = document.getElementById("ucapan-inner");
  let template = "";
  let i = 0;
  greetings.forEach((item) => {
    if (i < maxGreetings) {
      template += templateUcapan({ name: item.nama, message: item.ucapan });
    }
    i++;
  });
  if (greetings.length <= maxGreetings) {
    document.getElementById("viewMoreGreetings")?.classList.add("hidden");
  }
  ucapanInner.innerHTML = template;
}

document.getElementById("viewMoreGreetings")?.addEventListener("click", () => {
  maxGreetings += 3;
  renderGreetings();
});

document.getElementById("sendUcapan")?.addEventListener("click", (e) => {
  e.preventDefault();

  let nama = document.getElementById("namaUcapan").value;
  let ucapan = document.getElementById("pesanUcapan").value;

  if (nama === "" && ucapan === "") {
    document.getElementById("error-nama-ucapan").classList.remove("hidden");
    document.getElementById("error-pesan-ucapan").classList.remove("hidden");
  } else if (nama !== "" && ucapan === "") {
    document.getElementById("error-nama-ucapan").classList.add("hidden");
    document.getElementById("error-pesan-ucapan").classList.remove("hidden");
  } else if (nama === "" && ucapan !== "") {
    document.getElementById("error-nama-ucapan").classList.remove("hidden");
    document.getElementById("error-pesan-ucapan").classList.add("hidden");
  } else {
    document.getElementById("namaUcapan").value = "";
    document.getElementById("pesanUcapan").value = "";

    document.getElementById("textUcapan").classList.remove("hidden");
    document.getElementById("error-nama-ucapan").classList.add("hidden");
    document.getElementById("error-pesan-ucapan").classList.add("hidden");

    const form = new FormData();
    form.append("action", "create_greeting");
    form.append("nama", nama);
    form.append("ucapan", ucapan);

    fetch(SHEET_URL, {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then(() => {
        getUcapanData();
        setTimeout(() => {
          document.getElementById("textUcapan").classList.add("hidden");
        }, 2000);
      })
      .catch((e) => console.log(e.message));
  }
});

// BANK
document.getElementById("sendHadiah")?.addEventListener("click", () => {
  let nama = document.getElementById("namaHadiah").value;
  let pengirim = document.getElementById("bankPengirim").value;
  let jumlah = document.getElementById("jumlahHadiah").value;
  let pesan = document.getElementById("pesanHadiah").value;

  if (nama === "") {
    document.getElementById("error-nama-hadiah").classList.remove("hidden");
  } else {
    document.getElementById("error-nama-hadiah").classList.add("hidden");
  }
  if (pengirim === "") {
    document.getElementById("error-bank-hadiah").classList.remove("hidden");
  } else {
    document.getElementById("error-bank-hadiah").classList.add("hidden");
  }
  if (jumlah === "") {
    document.getElementById("error-jumlah-hadiah").classList.remove("hidden");
  } else {
    document.getElementById("error-jumlah-hadiah").classList.add("hidden");
  }
  hadiah;
  if (pesan === "") {
    document.getElementById("error-pesan-hadiah").classList.remove("hidden");
  } else {
    document.getElementById("error-pesan-hadiah").classList.add("hidden");
  }

  if (nama !== "" && pengirim !== "" && jumlah !== "" && pesan !== "") {
    document.getElementById("namaHadiah").value = "";
    document.getElementById("bankPengirim").value = "";
    document.getElementById("jumlahHadiah").value = "";
    document.getElementById("pesanHadiah").value = "";

    document.getElementById("text-hadiah").classList.remove("hidden");

    const form = new FormData();
    form.append("action", "create_gift");
    form.append("bank", "BCA");
    form.append("nama", nama);
    form.append("bank_pengirim", pengirim);
    form.append("jumlah", jumlah);
    form.append("pesan", pesan);

    fetch(SHEET_URL, {
      method: "POST",
      body: form,
    })
      .then((res) => res.json())
      .then(() => {
        setTimeout(() => {
          document.getElementById("text-hadiah").classList.add("hidden");
        }, 2000);
      })
      .catch((e) => console.log(e.message));
  }
});

// BANK CHANGE
bankSelect?.addEventListener("input", (e) => {
  let bank = e.target.value;

  if (bank === "bca") {
    bankTitle.innerText = "Bank BCA";
    bankNumber.innerText = "Account Number: 8691474861";
    bankName.innerText = "a.n Ardiansyah";
    bankQr.src = "./assets/img/qr-bca.jpg";
  } else {
    bankTitle.innerText = "Bank BNI";
    bankNumber.innerText = "Account Number: 1051726230";
    bankName.innerText = "a.n Dewi Ratnawati";
    bankQr.src = "./assets/img/qr-bni.jpeg";
  }
});

openButton?.addEventListener("click", (e) => {
  modal.classList.add("animate__animated");
  modal.classList.add("animate__fadeOutUp");
  body.classList.remove("overflow-y-hidden");
  discButton.classList.add("animate-spin-slow");
  audio.autoplay = true;
  audio.loop = true;
  audio.volume = 0.5;
  audio.play();
});

new Swiper(".mySwiper", {
  autoHeight: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".swiper-pagination",
  },
});

const lightbox = new PhotoSwipeLightbox({
  gallery: "#my-gallery",
  children: "a",
  pswpModule: () => import("https://unpkg.com/photoswipe"),
});

lightbox.init();
