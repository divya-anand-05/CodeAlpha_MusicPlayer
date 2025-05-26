const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const lyricsModal = document.getElementById('lyricsModal');
const lyricsTitle = document.getElementById('lyricsTitle');
const lyricsText = document.getElementById('lyricsText');
const themeToggle = document.getElementById('themeToggle');
const fullscreenView = document.getElementById('fullscreenView');
const fullscreenSong = document.getElementById('fullscreenSong');

// 🌙 Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// 🔍 Search Songs from Deezer API
function searchSongs() {
  const query = searchInput.value || "tamil";
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const url = `${proxy}https://api.deezer.com/search?q=${query}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      currentSongList = data.data;

      data.data.forEach((song, index) => {
        const songDiv = document.createElement("div");
        songDiv.className = "song";

        const liked = isLiked(song.id);

        songDiv.innerHTML = `
          <img src="${song.album.cover_medium}" alt="Album Cover">
          <div class="song-details">
            <strong>${song.title}</strong><br>
            <em>${song.artist.name}</em>
          </div>
          
          <audio controls src="${song.preview}" id="audio-${song.id}"></audio>
          <input type="range" min="0" max="1" step="0.01" value="1" class="volume-slider"
                 oninput="document.getElementById('audio-${song.id}').volume = this.value">
                 
          <div>
            <button class="like-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${song.id}, this)">❤️</button>
            <button onclick="showLyrics('${song.artist.name}', '${song.title}')">📃 Lyrics</button>
            <button onclick='showFull(${JSON.stringify(song)}, ${index})'>🔍 Full View</button>
          </div>
        `;
        resultsDiv.appendChild(songDiv);
      });
    })
    .catch(error => {
      alert("CORS error or network issue. Enable access via: https://cors-anywhere.herokuapp.com/corsdemo");
      console.error(error);
    });
}

// ❤️ Like System
function isLiked(songId) {
  const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
  return likedSongs.includes(songId);
}

function toggleLike(songId, btn) {
  let likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");

  if (likedSongs.includes(songId)) {
    likedSongs = likedSongs.filter(id => id !== songId);
    btn.classList.remove("liked");
  } else {
    likedSongs.push(songId);
    btn.classList.add("liked");
  }

  localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
}

// 🎵 Lyrics Modal
function showLyrics(artist, title) {
  lyricsTitle.textContent = `${title} - ${artist}`;
  lyricsText.textContent = "Tamil lyrics not available via Deezer. Add your own or use a lyrics API like lyrics.ovh.";
  lyricsModal.style.display = "flex";
}

function closeLyrics() {
  lyricsModal.style.display = "none";
}

let currentSongList = [];
let currentSongIndex = 0;
let isRepeat = false;
let isShuffle = false;

// 🖥 Fullscreen View
function showFull(song, index) {
  currentSongIndex = index;

  fullscreenView.style.display = 'block';
  resultsDiv.style.display = 'none';

  

  fullscreenSong.innerHTML = `
    <img src="${song.album.cover_big}" id="fullscreenImage" alt="cover" class="spinning-image" style="border-radius:50%; width:300px; height:300px;" />
    <h2>${song.title}</h2>
    <h3>${song.artist.name}</h3>
    <audio controls id="fullscreenAudio" src="${song.preview}" style="width:100%"></audio>
    <div style="margin-top: 10px;">
      <button onclick="playPrev()">⏮ Prev</button>
      <button onclick="toggleShuffle()">🔀 Shuffle</button>
      <button onclick="playNext()">⏭ Next</button>
      <button onclick="toggleRepeat()">🔁 Repeat</button>
    </div>
    <button onclick="showLyrics('${song.artist.name}', '${song.title}')">📃 Lyrics</button>
    <button onclick="backToAll()">🔙 Back</button>
  `;

  const audio = document.getElementById("fullscreenAudio");
  audio.onended = () => {
    if (isRepeat) {
      audio.currentTime = 0;
      audio.play();
    } else {
      playNext();
    }
  };
}

function playPrev() {
  currentSongIndex = (currentSongIndex - 1 + currentSongList.length) % currentSongList.length;
  showFull(currentSongList[currentSongIndex], currentSongIndex);
}

function playNext() {
  if (isShuffle) {
    currentSongIndex = Math.floor(Math.random() * currentSongList.length);
  } else {
    currentSongIndex = (currentSongIndex + 1) % currentSongList.length;
  }
  showFull(currentSongList[currentSongIndex], currentSongIndex);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert(`Shuffle is now ${isShuffle ? "ON" : "OFF"}`);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  alert(`Repeat is now ${isRepeat ? "ON" : "OFF"}`);
}

function backToAll() {
  fullscreenView.style.display = 'none';
  resultsDiv.style.display = 'flex';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
});
document.body.setAttribute('data-theme', 'light'); // or 'dark'


// 📌 Run default search on load
document.addEventListener("DOMContentLoaded", searchSongs);


document.addEventListener('keydown', function (e) {
  switch (e.key.toLowerCase()) {
    case ' ': // Spacebar
      e.preventDefault(); // Prevent page scroll
      togglePlayPause();
      break;
    case 'arrowright':
      nextSong();
      break;
    case 'arrowleft':
      prevSong();
      break;
    case 's':
      toggleShuffle();
      break;
    case 'r':
      toggleRepeat();
      break;
    case 'arrowup':
      changeVolume(0.1);
      break;
    case 'arrowdown':
      changeVolume(-0.1);
      break;
    case 'm':
      toggleMute();
      break;
    case 'l':
      toggleLike(); // If you have a like feature
      break;
  }
});

function togglePlayPause() {
  const fullscreenAudio = document.querySelector("#fullscreenView audio");
const resultsAudio = document.querySelector("#results audio");
const activeAudio = fullscreenAudio || resultsAudio;

  if (activeAudio) {
    if (activeAudio.paused) {
      activeAudio.play();
    } else {
      activeAudio.pause();
    }
  }
}


function changeVolume(delta) {
  const fullscreenAudio = document.querySelector("#fullscreenView audio");
const resultsAudio = document.querySelector("#results audio");
const activeAudio = fullscreenAudio || resultsAudio;
  if (activeAudio) {
    activeAudio.volume = Math.min(1, Math.max(0, activeAudio.volume + delta));
  }
}

function toggleMute() {
  const fullscreenAudio = document.querySelector("#fullscreenView audio");
const resultsAudio = document.querySelector("#results audio");
const activeAudio = fullscreenAudio || resultsAudio;
  if (activeAudio) {
    activeAudio.muted = !activeAudio.muted;
  }
}

//mobile gestures

let touchStartX = 0;

const fullscreenSongs = document.getElementById("fullscreenSong");

fullscreenSong.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});

fullscreenSong.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const diffX = touchEndX - touchStartX;

  if (Math.abs(diffX) > 50) { // threshold to avoid accidental swipes
    if (diffX > 0) {
      prevSong(); // Swipe right
    } else {
      nextSong(); // Swipe left
    }
  }
});

let touchStartY = 0;

fullscreenSong.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

fullscreenSong.addEventListener("touchend", (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const diffY = touchEndY - touchStartY;

  if (diffY > 60) { // Swipe down threshold
    backToAll(); // Go back to song list
  }
});