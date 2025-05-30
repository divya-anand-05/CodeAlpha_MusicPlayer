const likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];
    const htmlElement = document.documentElement;
    let allSongsData = [];
    let currentIndex = 0;
    let isShuffle = false;
let isRepeat = false;

    function isLiked(id) {
      return likedSongs.includes(id);
    }

    function toggleLike(id, btn) {
      if (isLiked(id)) {
        likedSongs.splice(likedSongs.indexOf(id), 1);
        btn.classList.remove("liked");
      } else {
        likedSongs.push(id);
        btn.classList.add("liked");
      }
      localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    }

    function showLyrics(artist, title) {
      const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          document.getElementById("lyricsTitle").textContent = `${title} - ${artist}`;
          document.getElementById("lyricsText").textContent = data.lyrics || "❌ Lyrics not found!";
          document.getElementById("lyricsModal").style.display = "flex";
        })
        .catch(() => {
          document.getElementById("lyricsText").textContent = "❌ Error fetching lyrics.";
          document.getElementById("lyricsModal").style.display = "flex";
        });
    }

    function closeLyrics() {
      document.getElementById("lyricsModal").style.display = "none";
    }

    function setTheme(theme) {
      htmlElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    }

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    (function () {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) setTheme(savedTheme);
      else setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    })();

    function backToAll() {
      document.getElementById("fullscreenView").style.display = "none";
      document.getElementById("results").style.display = "grid";
    }

    function showFullScreen(index) {
      document.querySelectorAll("audio").forEach(aud => aud.pause()); // ⛔ Stop all audios

      currentIndex = index;
      const song = allSongsData[index];
      const liked = isLiked(song.id);
      const container = document.getElementById("fullscreenSong");

      container.innerHTML = `
        <img id="fullscreenImg" src="${song.album.cover_medium}" alt="Album Cover">
        <div class="song-details">
          <strong>${song.title}</strong>
          <em>${song.artist.name}</em>
        </div>
        <audio controls src="${song.preview}" id="audio-full" onended="handleSongEnd()"></audio>
        <input type="range" min="0" max="1" step="0.01" value="1" class="volume-slider"
               oninput="document.getElementById('audio-full').volume = this.value">
                <div class="fullscreen-controls">
              <button onclick="toggleShuffle()">🔀 Shuffle</button>
      <button onclick="prevSong()">⏮</button>
      <button onclick="nextSong()">⏭</button>
      <button onclick="toggleRepeat()">🔁 Repeat</button>
    </div>

        <div>
          <button class="like-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${song.id}, this)">❤️</button>
          <button onclick="showLyrics('${song.artist.name}', '${song.title}')">📃 Lyrics</button>
        </div>
      `;

      document.getElementById("fullscreenView").style.display = "block";
      document.getElementById("results").style.display = "none";

      const audio = document.getElementById("audio-full");
const img = document.getElementById("fullscreenImg");

audio.addEventListener("play", () => {
  img.classList.add("spin");
});

audio.addEventListener("pause", () => {
  img.classList.remove("spin");
});

    }

    function searchSongs() {
      const query = document.getElementById('searchInput').value || "tamil";
      const proxy =  "https://cors-anywhere-cz61.onrender.com/";
;
      const url = `${proxy}https://api.deezer.com/search?q=${query}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          allSongsData = data.data;
          const resultsDiv = document.getElementById("results");
          resultsDiv.innerHTML = "";

          allSongsData.forEach((song, index) => {
            const songDiv = document.createElement("div");
            songDiv.className = "song";

            const liked = isLiked(song.id);

            songDiv.innerHTML = `
              <img src="${song.album.cover_medium}" alt="Album Cover">
              <div class="song-details">
                <strong>${song.title}</strong>
                <em>${song.artist.name}</em>
              </div>
              <audio controls src="${song.preview}" id="audio-${song.id}"></audio>
              <input type="range" min="0" max="1" step="0.01" value="1" class="volume-slider"
                     oninput="document.getElementById('audio-${song.id}').volume = this.value">

                     
              <div>
                <button class="like-btn ${liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${song.id}, this)">❤️</button>
                <button onclick="event.stopPropagation(); showLyrics('${song.artist.name}', '${song.title}')">📃 Lyrics</button>
              </div>
            `;

            songDiv.addEventListener("click", () => showFullScreen(index));
            resultsDiv.appendChild(songDiv);
          });
        })
        .catch(error => {
          alert("CORS error or network issue. Visit: https://cors-anywhere.herokuapp.com/corsdemo");
          console.error(error);
        });
    }

    function nextSong() {
  if (currentIndex < allSongsData.length - 1) {
    showFullScreen(currentIndex + 1);
  }
}

function prevSong() {
  if (currentIndex > 0) {
    showFullScreen(currentIndex - 1);
  }
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert(`Shuffle ${isShuffle ? 'enabled' : 'disabled'}`);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  alert(`Repeat ${isRepeat ? 'enabled' : 'disabled'}`);
}

function handleSongEnd() {
  if (isRepeat) {
    showFullScreen(currentIndex); // Replay current
  } else if (isShuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * allSongsData.length);
    } while (randomIndex === currentIndex && allSongsData.length > 1);
    showFullScreen(randomIndex);
  } else {
    nextSong(); // Play next in list
  }
}
function toggleShuffle() {
  isShuffle = !isShuffle;
  const btn = document.querySelector("button[onclick='toggleShuffle()']");
  btn.style.backgroundColor = isShuffle ? '#4caf50' : '';
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  const btn = document.querySelector("button[onclick='toggleRepeat()']");
  btn.style.backgroundColor = isRepeat ? '#2196f3' : '';
}
document.addEventListener("keydown", function (e) {
  if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
    return; // Stop here, don't do anything else
  }
  const audio = document.getElementById("audio-full");

  switch (e.key.toLowerCase()) {
    case " ": // Spacebar: Play/Pause
      e.preventDefault();
      if (audio) {
        if (audio.paused) {
          audio.play();
        } else {
          audio.pause();
        }
      }
      break;
    case "n": // Next song
      nextSong();
      break;
    case "p": // Previous song
      prevSong();
      break;
    case "s": // Toggle Shuffle
      toggleShuffle();
      break;
    case "r": // Toggle Repeat
      toggleRepeat();
      break;
    case "t": // Toggle Theme
      toggleTheme();
      break;
    case "arrowup": // Volume up
      if (audio && audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1);
      break;
    case "arrowdown": // Volume down
      if (audio && audio.volume > 0) audio.volume = Math.max(0, audio.volume - 0.1);
      break;
      case "arrowright":
  nextSong();
  break;
case "arrowleft":
  prevSong();
  break;

  }
});

let showingFavorites = false;

function renderSongs(songsArray) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  
  if (!songsArray || songsArray.length === 0) {
    resultsDiv.innerHTML = "<p style='color: var(--accent-color); text-align: center;'>No songs found.</p>";
    return;
  }

  songsArray.forEach((song, index) => {
    const songDiv = document.createElement("div");
    songDiv.className = "song";

    const liked = isLiked(song.id);

    // Build download link only if preview is available
    const downloadLink = song.preview ? `<a href="${song.preview}" download="${song.title}.mp3" style="color: var(--accent-color); text-decoration:none; margin-left:8px;">⬇️</a>` : "";

    songDiv.innerHTML = `
      <img src="${song.album.cover_medium}" alt="Album Cover">
      <div class="song-details">
        <strong>${song.title}</strong>
        <em>${song.artist.name}</em>
      </div>
      <audio controls src="${song.preview}" id="audio-${song.id}"></audio>
      <input type="range" min="0" max="1" step="0.01" value="1" class="volume-slider"
             oninput="document.getElementById('audio-${song.id}').volume = this.value">
      <div>
        <button class="like-btn ${liked ? 'liked' : ''}" onclick="event.stopPropagation(); toggleLike(${song.id}, this);">${liked ? '❤️' : '🤍'}</button>
        <button onclick="event.stopPropagation(); showLyrics('${song.artist.name}', '${song.title}')">📃 Lyrics</button>
        ${downloadLink}
      </div>
    `;

    songDiv.addEventListener("click", () => {
      document.querySelectorAll("audio").forEach(aud => aud.pause());
      if (!showingFavorites) {
        showFullScreen(index);
      } else {
        // When showing favorites, index relates to filtered list
        showFullScreen(allSongsData.findIndex(s => s.id === songsArray[index].id));
      }
    });
    resultsDiv.appendChild(songDiv);
  });
}

function searchSongs() {
  showingFavorites = false;
  setActiveTab('allTab');
  const query = document.getElementById('searchInput').value || "tamil";
  const proxy =  "https://cors-anywhere-cz61.onrender.com/";
  const url = `${proxy}https://api.deezer.com/search?q=${query}`;

  // Show loading spinner
  document.getElementById('loadingSpinner').style.display = 'block';
  document.getElementById('results').style.display = 'none';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      allSongsData = data.data;
      renderSongs(allSongsData);
    })
    .catch(error => {
      alert("CORS error or network issue. Visit: https://cors-anywhere.herokuapp.com/corsdemo");
      console.error(error);
    })
    .finally(() => {
      document.getElementById('loadingSpinner').style.display = 'none';
      document.getElementById('results').style.display = 'grid';
    });
}

function showFavorites() {
  showingFavorites = true;
  setActiveTab('favoritesTab');
  const favoriteSongs = allSongsData.filter(song => isLiked(song.id));
  renderSongs(favoriteSongs);
}

function showAllSongs() {
  showingFavorites = false;
  setActiveTab('allTab');
  renderSongs(allSongsData);
}

function setActiveTab(tabId) {
  const tabs = ['allTab', 'favoritesTab'];
  tabs.forEach(id => {
    const btn = document.getElementById(id);
    if (id === tabId) {
      btn.style.backgroundColor = 'var(--accent-color)';
      btn.style.color = '#fff';
    } else {
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }
  });
}

// Initialize on page load to do a search automatically
window.onload = () => {
  searchSongs();
};

document.addEventListener("play", function(e) {
  const audios = document.querySelectorAll("audio");
  audios.forEach(audio => {
    if (audio !== e.target) {
      audio.pause();
      audio.currentTime=0;
    }
  });
}, true);
