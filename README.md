# 🎵 Music Player 

A modern music player built with **HTML**, **CSS**, and **JavaScript** that uses the **Deezer API** to search and stream song previews. Includes lyrics support, themes, likes, and fullscreen mode – all optimized for a clean user experience.

---

## ✨ Features

- 🔍 **Search Tamil Songs** using the **Deezer API**
- ❤️ **Like Button** – Save favorite songs with `localStorage`
- 🎼 **Lyrics Modal** – Fetches lyrics from Lyrics.ovh API
- 🌙 **Theme Toggle** – Switch between Light and Dark mode
- 🔊 **Audio Preview** – Listen to 30-second previews via Deezer
- 🖼️ **Fullscreen Mode** – Enlarged album art + song info
- 🔁 **Shuffle & Repeat** – Song loop and random play
- ⏮️⏭️ **Prev/Next Buttons** – Navigate playlist
- 🚀 **Responsive Design** – Mobile & Desktop ready
- 🌀 **Loading Spinner** – Indicates when fetching data

---

## 🌐 APIs Used

- 🎧 [**Deezer API**](https://developers.deezer.com/api)
- 📝 [**Lyrics.ovh API**](https://lyricsovh.docs.apiary.io)

> 🛡️ **CORS Proxy**: A custom [Render](https://render.com/) proxy is used to bypass CORS issues for the Deezer API.

---

## 📁 Folder Structure

```
tamil-music-player/
│
├── index.html            
├── assets/
│   ├── style.css          
│   └── script.js          
├── proxy/ (hosted on Render)
└── README.md              
```

---

## ⚙️ Setup & Run

1. Clone this repo or download the files  
2. Host `index.html` locally or online  
3. Ensure the **CORS proxy** on Render is running  
4. Open in browser and start listening 🎶  

---

## 🔧 Technologies

- HTML5  
- CSS3 (Flexbox, Grid, Variables)  
- JavaScript (ES6+)  
- Deezer API (with proxy)  
- Lyrics.ovh API  
- LocalStorage  

---

## ❤️ Credits

    Deezer API

    Render for hosting the proxy

---





