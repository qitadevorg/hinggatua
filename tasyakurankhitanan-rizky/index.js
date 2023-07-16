const audio = document.getElementById('audio');
const bukaBtn = document.getElementById('buka-btn');
const petaBtn = document.getElementById('peta-btn');
const loadMoreBtn = document.getElementById('lainnya-btn');
const sendBtn = document.getElementById('send-btn');
const homeBtn = document.getElementById('home-btn');
const profileBtn = document.getElementById('profile-btn');
const agendaBtn = document.getElementById('agenda-btn');
const ucapanBtn = document.getElementById('ucapan-btn');
const discButton = document.getElementById('disc-btn');
const body = document.getElementById('body');
const modal = document.getElementById('modal-cover');
const greetingContainer = document.getElementById('ucapan-container');
const navContainer = document.getElementById('nav-container');

const SHEET_URL = 'https://script.google.com/macros/s/AKfycby1M7VO2UMwSpw37YApiP8Fi1nJ51BWuoTG7cd5Vj5RwdzrRuvqcsALNY1NplYIgmcT1A/exec';
let greetingsArray = [];
let defaultPagination = 6;

bukaBtn.addEventListener('click', () => {
  window.scrollTo(0, 0);
  modal.classList.add('animate__animated');
  modal.classList.add('animate__fadeOutLeft');
  navContainer.classList.remove('hidden');
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
  document.getElementById('banner-part').scrollIntoView({ behavior: 'smooth' });
});

profileBtn.addEventListener('click', () => {
  document.getElementById('profile-part').scrollIntoView({ behavior: 'smooth' });
});

agendaBtn.addEventListener('click', () => {
  document.getElementById('agenda-part').scrollIntoView({ behavior: 'smooth' });
});

ucapanBtn.addEventListener('click', () => {
  document.getElementById('pray-words-part').scrollIntoView({ behavior: 'smooth' });
});

loadMoreBtn.addEventListener('click', async () => {
  defaultPagination += 6;
  await renderGreetings();
});

petaBtn.addEventListener('click', () => {
  window.open('https://goo.gl/maps/PnfiDszKZHQnvrA7A', '_blank');
})

sendBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  
  const nameField = document.getElementById('name-input').value;
  const bodyField = document.getElementById('body-input').value;

  if ((nameField !== '' || nameField.length > 0) && (bodyField !== '' || bodyField.length > 0)) {
    document.getElementById("name-input").value = '';
    document.getElementById("body-input").value = '';
    document.getElementById("ucapanHandler").classList.remove('hidden');
    const form = new FormData();
    form.append('action', 'create_greeting');
    form.append('nama', nameField);
    form.append('ucapan', bodyField);
    
    await fetch(SHEET_URL, {
      method: 'POST',
      body: form
    }).then((res) => res.json())
    .then(async () => {
      await getGreetingsData();
      setTimeout(() => {
        document.getElementById("ucapanHandler").classList.add('hidden');
      }, 2000)
    })
    .catch((e) => console.log(e.message))
  } else {
    alert('Kolom nama dan ucapan tidak boleh kosong!');
  }
})

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

async function getGreetingsData() {
  await fetch(`${SHEET_URL}?action=get_all_greetings`, { method: 'GET' })
    .then((res) => res.json())
    .then(async (res) => {
      greetingsArray = [];
      res.data.forEach((item) => greetingsArray.push({ name: item.nama, greeting: item.ucapan }));
      await renderGreetings();
    });

  if (greetingsArray.length > 6) {
    loadMoreBtn.classList.remove('hidden');
  } else {
    loadMoreBtn.classList.add('hidden');
  }
}

async function renderGreetings() {
  if (greetingsArray.length > 0) {
    const slicedGreetings = greetingsArray.slice(0, defaultPagination);

    if (slicedGreetings.length === greetingsArray.length) loadMoreBtn.classList.add('hidden');
    else loadMoreBtn.classList.remove('hidden');

    let template = '';
    slicedGreetings.forEach((greet) => {
      template += `
        <div class="greet-card w-full p-5 rounded-md flex flex-col justify-start gap-1.5 bg-white">
          <h4 class="text-primary-red text-xl font-bold font-body">${greet.name}</h4>
          <p class="text-md text-primary-red font-normal font-body leading-6">
            ${greet.greeting}
          </p>
        </div>
      `;
    });
    greetingContainer.innerHTML = template;
  }
}

window.onload = async () => {
  await getGreetingsData();
}