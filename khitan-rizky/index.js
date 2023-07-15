const audio = document.getElementById('audio');
const bukaBtn = document.getElementById('buka-btn');
const petaBtn = document.getElementById('peta-btn');
const lainnyaBtn = document.getElementById('lainnya-btn');
const sendBtn = document.getElementById('send-btn');
const homeBtn = document.getElementById('home-btn');
const profileBtn = document.getElementById('profile-btn');
const agendaBtn = document.getElementById('agenda-btn');
const ucapanBtn = document.getElementById('ucapan-btn');
const discButton = document.getElementById('disc-btn');
const body = document.getElementById('body');
const modal = document.getElementById('modal-cover');

bukaBtn.addEventListener('click', () => {
  modal.classList.add('animate__animated');
  modal.classList.add('animate__fadeOutLeft');
  body.classList.remove('overflow-y-hidden');
  discButton.classList.add('animate-spin-slow');
  audio.autoplay = true;
  audio.loop = true;
  audio.volume = 0.2;
  audio.play();
});

discButton.addEventListener('click', (e) => {
  if (audio.paused) {
    discButton.classList.add('animate-spin-slow');
    audio.play();
  } else {
    discButton.classList.remove('animate-spin-slow');
    audio.pause();
  }
});

homeBtn.addEventListener('click', () => {
  document.getElementById('banner-part').scrollIntoView();
});

profileBtn.addEventListener('click', () => {
  document.getElementById('profile-part').scrollIntoView();
});

agendaBtn.addEventListener('click', () => {
  document.getElementById('agenda-part').scrollIntoView();
});

ucapanBtn.addEventListener('click', () => {
  document.getElementById('pray-words-part').scrollIntoView();
});


let x = setInterval(() => {
  const dayTimer = document.getElementById('day-timer');
  const hourTimer = document.getElementById('hour-timer');
  const minuteTimer = document.getElementById('minute-timer');
  const secTimer = document.getElementById('sec-timer');
  let eventDate = new Date("Aug 5, 2023 10:00:00").getTime();
  let currentDate = new Date().getTime();
  let diff = eventDate - currentDate;

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  dayTimer.innerHTML = days < 10 ? "0"+days : days;
  hourTimer.innerHTML = hours < 10 ? "0"+hours : hours;
  minuteTimer.innerHTML = minutes < 10 ? "0"+minutes : minutes;
  secTimer.innerHTML = seconds < 10 ? "0"+seconds : seconds;
  
  if (diff < 0) {
      clearInterval(x);
      dayTimer.innerHTML = "00";
      hourTimer.innerHTML = "00";
      minuteTimer.innerHTML = "00";
      secTimer.innerHTML = "00";
  }
}, 1000);