const songArray = Array.from(document.querySelectorAll("#song-list li"));
const mainImage = document.getElementById("main-image");
const audioPlayer = document.getElementById("audio-player");
const rightImage = document.querySelector(".album-cover img");
const rightTitle = document.querySelector(".song-title");
const rightArtist = document.querySelector(".artist");

const playBtn = document.getElementById("playPause");
const speedUp = document.getElementById("speed-up");
const speedDown = document.getElementById("speed-down");
const speedDisplay = document.getElementById("playback-speed");
const favoriteBtn = document.getElementById("favorite");
const addToPlaylistBtn = document.getElementById("add-to-playlist");
const removeFromPlaylistBtn = document.getElementById("remove-from-playlist");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const totalDurationEl = document.getElementById("total-duration");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSongIndex = -1;
let currentSpeed = 1.0;
let currentSong = null;
const favoriteSongs = new Set(); 

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function loadAndPlaySong(songData, index) {
    currentSongIndex = index;
    currentSong = songData;

    const { imageSrc, songSrc, title, artist } = songData;
    mainImage.src = imageSrc;
    rightImage.src = imageSrc;
    rightTitle.innerHTML = `${title} <span>🎵</span>`;
    rightArtist.innerHTML = `<b>By:</b> ${artist}`;
    audioPlayer.src = songSrc;
    audioPlayer.play();
    playBtn.textContent = "⏸️";
    favoriteBtn.classList.toggle("active", favoriteSongs.has(index));
}

songArray.forEach((song, index) => {
    // Add favorite icon placeholder
    const favIcon = document.createElement("span");
    favIcon.classList.add("favorite-icon");
    favIcon.innerHTML = "♡";
    favIcon.style.marginLeft = "10px";
    favIcon.style.cursor = "pointer";
    song.appendChild(favIcon);

    song.addEventListener("click", function () {
        const songData = {
            imageSrc: this.getAttribute("data-image"),
            songSrc: this.getAttribute("data-song"),
            title: this.innerText.trim().replace("♡", "").replace("❤️", "").trim(),
            artist: this.getAttribute("data-artist"),
        };
        loadAndPlaySong(songData, index);
    });
});

// Toggle Play/Pause
playBtn.addEventListener("click", () => {
    if (!audioPlayer.src) return alert("No song loaded!");
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
});
audioPlayer.addEventListener("play", () => (playBtn.textContent = "⏸️"));
audioPlayer.addEventListener("pause", () => (playBtn.textContent = "▶️"));

// Playback Speed
function updateSpeed(delta) {
    currentSpeed = Math.max(0.5, Math.min(currentSpeed + delta, 2.0));
    audioPlayer.playbackRate = currentSpeed;
    speedDisplay.innerText = `${currentSpeed.toFixed(1)}x`;
}
speedUp.addEventListener("click", () => updateSpeed(0.1));
speedDown.addEventListener("click", () => updateSpeed(-0.1));

// Favorite Toggle
favoriteBtn.addEventListener("click", () => {
    if (currentSongIndex === -1) return alert("No song selected!");

    const isFavorite = favoriteSongs.has(currentSongIndex);
    if (isFavorite) {
        favoriteSongs.delete(currentSongIndex);
        alert("Unmarked Favorite");
    } else {
        favoriteSongs.add(currentSongIndex);
        alert("Marked as Favorite 🎵");
    }
    favoriteBtn.classList.toggle("active", !isFavorite);
    const icon = songArray[currentSongIndex].querySelector(".favorite-icon");
    if (icon) icon.innerHTML = isFavorite ? "♡" : "❤️";
});

// Add to Playlist
addToPlaylistBtn.addEventListener("click", () => {
    if (!currentSong) return alert("No song selected");
    const playlist = document.querySelector(".playlist");

    const li = document.createElement("li");
    li.classList.add("song");
    li.setAttribute("data-src", currentSong.songSrc);
    li.innerHTML = `
        <img src="${currentSong.imageSrc}" alt="${currentSong.title}">
        <div><span>${currentSong.title}</span><p>${currentSong.artist}</p></div>
        <span>3:00</span>
    `;
    li.addEventListener("click", () => loadAndPlaySong(currentSong, currentSongIndex));
    playlist.appendChild(li);
});

// Remove Last from Playlist
removeFromPlaylistBtn.addEventListener("click", () => {
    const playlist = document.querySelector(".playlist");
    const lastSong = playlist.querySelector("li:last-child");
    if (lastSong) {
        playlist.removeChild(lastSong);
    } else {
        alert("No songs in playlist to remove.");
    }
});

audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.value = percent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        totalDurationEl.textContent = formatTime(audioPlayer.duration);
    }
});
progress.addEventListener("input", (e) => {
    if (audioPlayer.duration) {
        audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
    }
});

// Next / Prev
prevBtn.addEventListener("click", () => {
    if (currentSongIndex > 0) songArray[currentSongIndex - 1].click();
});
nextBtn.addEventListener("click", () => {
    if (currentSongIndex < songArray.length - 1) songArray[currentSongIndex + 1].click();
});
const playlistItems = document.querySelectorAll(".playlist .song");
    const audio = new Audio();

    playlistItems.forEach(item => {
        item.addEventListener("click", () => {
            const src = item.getAttribute("data-src");
            if (src) {
                audio.src = src;
                audio.play();
            }
        });
    });