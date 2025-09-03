import { BASE_API_URL } from './api.js';

// --- DOM Element References (cached for performance) ---
const songListUl = document.querySelector(".songlist ul");
const cardContainer = document.querySelector(".cardContainer");
const playButtonElement = document.getElementById('play'); // Renamed to avoid confusion
const playIcon = playButtonElement ? playButtonElement.querySelector('img') : null; // Get the img inside the button
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const volumeSlider = document.getElementById('volume-slider');
const volumeButton = document.getElementById('volumeButton');
const hamburger = document.querySelector(".hamburger");
const closeButton = document.querySelector(".close");
const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const songinfoDisplay = document.querySelector(".songinfo");
const songtimeDisplay = document.querySelector(".songtime");
const leftPanel = document.querySelector(".left");
const searchInput = document.getElementById('search-songs');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');

// Basic check for essential elements
if (!songListUl || !cardContainer || !playButtonElement || !playIcon || !previousButton || !nextButton || !volumeSlider || !volumeButton || !hamburger || !closeButton || !seekbar || !circle || !songinfoDisplay || !songtimeDisplay || !leftPanel || !searchInput) {
    console.error("One or more essential DOM elements not found. Please check your HTML structure.");
    // Potentially throw an error or disable parts of the UI
}

/**
 * Renders the list of songs in the playlist sidebar.
 * @param {string[]} songs - An array of song names.
 * @param {string} currentFolder - The current folder path (e.g., "songs/punjabi").
 * @param {function(string)} onSongClick - Callback function when a song is clicked.
 */
export function renderSongList(songs, currentFolder, onSongClick) {
    if (!songListUl) return;
    if (searchInput) searchInput.value = ""; // Clear search on new playlist
    songListUl.innerHTML = ""; // Clear existing songs

    const fragment = document.createDocumentFragment();
    songs.forEach(song => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img class="invert" src="./img/music.svg" alt="Music icon">
            <div class="info">
                <div>${song.name}</div>
                <div>${song.artist}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="./img/play.svg" alt="Play icon">
            </div>
        `;
        li.addEventListener("click", () => onSongClick(song));
        fragment.appendChild(li);
    });
    songListUl.appendChild(fragment);
}

/**
 * Renders album cards in the main content area.
 * @param {Array<object>} albums - An array of album objects (from info.json).
 * @param {function(string)} onCardClick - Callback function when an album card is clicked.
 */
export function renderAlbumCards(albums, onCardClick) {
    if (!cardContainer) return;
    cardContainer.innerHTML = ""; // Clear existing cards

    const fragment = document.createDocumentFragment();
    albums.forEach(album => {
        if (!album || !album.folder) return; // Ensure album and folder exist
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.dataset.folder = `${album.folder}`; // Store the full folder path

        cardDiv.innerHTML = `
            <div class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                    color="#000000" fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="${BASE_API_URL}/${album.folder}/cover.jpg" alt="Album cover">
            <h2>${album.title}</h2>
            <p>${album.description}</p>
        `;
        cardDiv.addEventListener("click", () => onCardClick(album.folder));
        fragment.appendChild(cardDiv);
    });
    cardContainer.appendChild(fragment);
}

/**
 * Updates the song information and time display in the player.
 * @param {string} songName - The name of the current song.
 * @param {string} formattedCurrentTime - Current time formatted as MM:SS.
 * @param {string} formattedDuration - Total duration formatted as MM:SS.
 */
export function updatePlayerDisplay(songName, formattedCurrentTime, formattedDuration) {
    if (songinfoDisplay) songinfoDisplay.innerText = decodeURIComponent(songName.replaceAll("%20", " "));
    if (songtimeDisplay) songtimeDisplay.innerHTML = `${formattedCurrentTime} / ${formattedDuration}`;
}

/**
 * Updates the play/pause button icon.
 * @param {boolean} isPaused - True if the song is paused, false otherwise.
 */
export function updatePlayPauseIcon(isPaused) {
    if (playIcon) { // Target the img element
        playIcon.src = isPaused ? "./img/play.svg" : "./img/pause.svg";
    }
}

/**
 * Updates the seekbar circle position.
 * @param {number} percent - Percentage of the song played (0 to 100).
 */
export function updateSeekbarPosition(percent) {
    if (circle) circle.style.left = `${percent}%`;
}

/**
 * Updates the volume slider and button icon.
 * @param {number} volume - Current volume level (0 to 1).
 * @param {boolean} isMuted - True if muted, false otherwise.
 */
export function updateVolumeControls(volume, isMuted) {
    if (volumeSlider) volumeSlider.value = volume;
    if (volumeButton) {
        const volumeIcon = volumeButton.querySelector('img');
        if (volumeIcon) {
            volumeIcon.src = isMuted || volume === 0 ? "./img/mute.svg" : "./img/volume.svg";
        }
    }
}

/**
 * Attaches all global UI event listeners.
 * @param {object} callbacks - An object containing callback functions for various UI interactions.
 * @param {function} callbacks.onPlayPauseClick
 * @param {function} callbacks.onPreviousClick
 * @param {function} callbacks.onNextClick
 * @param {function(number)} callbacks.onSeekbarClick - Takes percentage (0-1)
 * @param {function(number)} callbacks.onVolumeChange - Takes volume value (0-1)
 * @param {function(number)} callbacks.onMuteToggle - Takes current slider value
 * @param {function} callbacks.onHamburgerClick
 * @param {function} callbacks.onCloseClick
 * @param {function} callbacks.onShuffleClick
 * @param {function} callbacks.onRepeatClick
 */
export function attachGlobalListeners(callbacks) {
    if (playButtonElement) playButtonElement.addEventListener("click", callbacks.onPlayPauseClick);
    if (previousButton) previousButton.addEventListener("click", callbacks.onPreviousClick);
    if (nextButton) nextButton.addEventListener("click", callbacks.onNextClick);

    if (seekbar) {
        seekbar.addEventListener("click", (e) => {
            const percent = (e.offsetX / seekbar.offsetWidth);
            callbacks.onSeekbarClick(percent);
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            callbacks.onVolumeChange(parseFloat(e.target.value));
        });
    }

    if (volumeButton) {
        volumeButton.addEventListener('click', () => {
            callbacks.onMuteToggle(parseFloat(volumeSlider.value));
        });
    }

    if (hamburger) {
        hamburger.addEventListener("click", callbacks.onHamburgerClick);
    }

    if (closeButton) {
        closeButton.addEventListener("click", callbacks.onCloseClick);
    }

    if (searchInput) {
        searchInput.addEventListener('input', handleSongFilter);
    }
    
    if (shuffleButton) shuffleButton.addEventListener("click", callbacks.onShuffleClick);
    if (repeatButton) repeatButton.addEventListener("click", callbacks.onRepeatClick);
}

/**
 * Handles filtering the song list based on search input.
 */
function handleSongFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    const songs = songListUl.getElementsByTagName('li');

    for (const songLi of songs) {
        const songName = songLi.querySelector(".info div").textContent.toLowerCase();
        if (songName.includes(searchTerm)) {
            songLi.style.display = "flex";
        } else {
            songLi.style.display = "none";
        }
    }
}

/**
 * UI specific logic to open the left sidebar.
 */
export function openSidebar() {
    if (leftPanel) leftPanel.style.left = "0";
}

/**
 * UI specific logic to close the left sidebar.
 */

/**
 * Updates the shuffle button UI to reflect the active state.
 * @param {boolean} isActive - True if shuffle is active, false otherwise.
 */
export function updateShuffleButton(isActive) {
    if (shuffleButton) {
        if (isActive) {
            shuffleButton.classList.add('active');
        } else {
            shuffleButton.classList.remove('active');
        }
    }
}
/**
 * Updates the repeat button UI to reflect the active state.
 * @param {boolean} isActive - True if repeat is active, false otherwise.
 */
export function updateRepeatButton(isActive) {
    if (repeatButton) {
        if (isActive) {
            repeatButton.classList.add('active');
        } else {
            repeatButton.classList.remove('active');
        }
    }
}

export function closeSidebar() {
    if (leftPanel) leftPanel.style.left = "-110%";
}