import * as API from './api.js';
import * as Playback from './playback.js';
import * as UI from './ui.js';

let currentPlaylistSongs = []; // Stores the names of songs in the current playlist
let currentAlbumFolder = ''; // Stores the folder path of the current album (e.g., "songs/punjabi")
let isShuffleActive = false; // State variable for shuffle functionality
let isRepeatActive = false; // State variable for repeat functionality

/**
 * Handles the time update event from the playback module.
 * Updates the UI with current song time and seekbar position.
 * @param {object} data - Contains currentTime, duration, formatted times, and seekPercent.
 */
function handleTimeUpdate(data) {
    // Extract song name from src and find matching song object
    const songName = decodeURIComponent(Playback.getPlaybackState().src.split('/').pop().replace(".mp3", ""));
    UI.updatePlayerDisplay(songName, data.formattedCurrentTime, data.formattedDuration);
    UI.updateSeekbarPosition(data.seekPercent);
    UI.updatePlayPauseIcon(Playback.getPlaybackState().isPaused); // Ensure icon is correct
}

/**
 * Handles the song ended event from the playback module.
 * Automatically plays the next song in the playlist or a random song if shuffle is active.
 * If repeat is active, reloads the current song instead of advancing to the next.
 */
function handleSongEnded() {
    const { src } = Playback.getPlaybackState();
    if (!src || currentPlaylistSongs.length === 0) return;

    // If repeat is active, reload the current song
    if (isRepeatActive) {
        const currentTrackNameWithExtension = src.split('/').pop();
        const currentTrackName = decodeURIComponent(currentTrackNameWithExtension.replace(".mp3", ""));
        Playback.loadAndPlay(currentTrackName, currentAlbumFolder);
        return;
    }

    const currentTrackNameWithExtension = src.split('/').pop();
    const currentTrackName = decodeURIComponent(currentTrackNameWithExtension.replace(".mp3", ""));

    let index;
    if (isShuffleActive) {
        // Select a random song from the playlist when shuffle is active
        index = Math.floor(Math.random() * currentPlaylistSongs.length);
    } else {
        // Find index based on song name and play next song in sequence
        let currentIndex = currentPlaylistSongs.findIndex(song => song.name === currentTrackName);
        index = (currentIndex + 1) % currentPlaylistSongs.length; // Loop to start if at end
    }
    Playback.loadAndPlay(currentPlaylistSongs[index].name, currentAlbumFolder);
}

/**
 * Handles a click on a song in the playlist.
 * @param {object} song - The song object with name and artist properties.
 */
function handleSongClick(song) {
    // song is now an object with name and artist properties
    Playback.loadAndPlay(song.name, currentAlbumFolder);
    UI.updatePlayPauseIcon(false); // Song is now playing
}

/**
 * Handles a click on an album card.
 * @param {string} folderPath - The full folder path of the clicked album.
 */
async function handleAlbumCardClick(folderPath) {
    currentAlbumFolder = folderPath;

    // Extract folder name from path (e.g., "songs/punjabi" -> "punjabi")
    const folderName = folderPath.split('/').pop();

    // Fetch album details
    const albumDetails = await API.fetchAlbumDetails(folderName);

    if (albumDetails && albumDetails.songs) {
        // Use songs from info.json
        currentPlaylistSongs = albumDetails.songs;
        UI.renderSongList(currentPlaylistSongs, currentAlbumFolder, handleSongClick);

        if (currentPlaylistSongs.length > 0) {
            // Pass the song name to loadAndPlay
            Playback.loadAndPlay(currentPlaylistSongs[0].name, currentAlbumFolder);
            UI.updatePlayPauseIcon(false); // Song is now playing
        } else {
            console.warn(`No songs found in folder: ${folderPath}`);
        }
    } else {
        console.warn(`Could not fetch album details for folder: ${folderPath}`);
        // Fallback to original method if info.json is not available
        currentPlaylistSongs = await API.fetchSongs(folderPath);
        UI.renderSongList(currentPlaylistSongs.map(song => ({ name: song, artist: "Unknown Artist" })), currentAlbumFolder, handleSongClick);

        if (currentPlaylistSongs.length > 0) {
            Playback.loadAndPlay(currentPlaylistSongs[0].name, currentAlbumFolder);
            UI.updatePlayPauseIcon(false);
        }
    }

    UI.closeSidebar(); // Close sidebar after selecting an album on mobile
}

/**
 * Handles click on the play/pause button in the player.
 */
function handlePlayPauseClick() {
    const isPlaying = Playback.togglePlayPause();
    UI.updatePlayPauseIcon(!isPlaying); // Update icon based on new state
}

/**
 * Handles click on the previous song button.
 */
function handlePreviousClick() {
    const { src } = Playback.getPlaybackState();
    if (!src || currentPlaylistSongs.length === 0) return;

    const currentTrackNameWithExtension = src.split('/').pop();
    const currentTrackName = decodeURIComponent(currentTrackNameWithExtension.replace(".mp3", ""));

    // Find index based on song name
    let index = currentPlaylistSongs.findIndex(song => song.name === currentTrackName);
    index = (index - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length; // Loop back to end if at start
    Playback.loadAndPlay(currentPlaylistSongs[index].name, currentAlbumFolder);
    UI.updatePlayPauseIcon(false); // Song is now playing
}

/**
 * Handles click on the next song button.
 * Plays the next song in sequence or a random song if shuffle is active.
 */
function handleNextClick() {
    const { src } = Playback.getPlaybackState();
    if (!src || currentPlaylistSongs.length === 0) return;

    const currentTrackNameWithExtension = src.split('/').pop();
    const currentTrackName = decodeURIComponent(currentTrackNameWithExtension.replace(".mp3", ""));

    let index;
    if (isShuffleActive) {
        // Select a random song from the playlist when shuffle is active
        index = Math.floor(Math.random() * currentPlaylistSongs.length);
    } else {
        // Find index based on song name and play next song in sequence
        let currentIndex = currentPlaylistSongs.findIndex(song => song.name === currentTrackName);
        index = (currentIndex + 1) % currentPlaylistSongs.length; // Loop to start if at end
    }
    Playback.loadAndPlay(currentPlaylistSongs[index].name, currentAlbumFolder);
    UI.updatePlayPauseIcon(false); // Song is now playing
}

/**
 * Handles click on the seekbar.
 * @param {number} percent - Percentage of the seekbar clicked (0 to 1).
 */

/**
 * Handles click on the shuffle button.
 * Toggles the shuffle state and updates the UI.
 */
function handleShuffleClick() {
    isShuffleActive = !isShuffleActive;
    UI.updateShuffleButton(isShuffleActive);
}
/**
 * Handles click on the repeat button.
 * Toggles the repeat state and updates the UI.
 */
function handleRepeatClick() {
    isRepeatActive = !isRepeatActive;
    UI.updateRepeatButton(isRepeatActive);
}

function handleSeekbarClick(percent) {
    Playback.seek(percent);
}

/**
 * Handles change in the volume slider.
 * @param {number} value - New volume value (0 to 1).
 */
function handleVolumeChange(value) {
    Playback.setVolume(value);
    const { volume, isMuted } = Playback.getPlaybackState();
    UI.updateVolumeControls(volume, isMuted);
}

/**
 * Handles click on the mute/unmute button.
 * @param {number} currentSliderValue - The value of the volume slider before the mute toggle.
 */
function handleMuteToggle(currentSliderValue) {
    const isMuted = Playback.toggleMute(currentSliderValue);
    const { volume } = Playback.getPlaybackState(); // Get the actual volume after toggle
    UI.updateVolumeControls(volume, isMuted);
}

/**
 * Main initialization function for the application.
 */
async function initApp() {
    // 1. Initialize Playback module listeners
    Playback.initPlaybackListeners(handleTimeUpdate, handleSongEnded);

    // 2. Load and display initial playlist (e.g., "punjabi")
    currentAlbumFolder = `${API.SONGS_ROOT_FOLDER}/punjabi`;
    const albumDetails = await API.fetchAlbumDetails("punjabi");

    if (albumDetails && albumDetails.songs) {
        currentPlaylistSongs = albumDetails.songs;
        UI.renderSongList(currentPlaylistSongs, currentAlbumFolder, handleSongClick);

        // Load the first song but keep it paused initially
        if (currentPlaylistSongs.length > 0) {
            Playback.loadAndPlay(currentPlaylistSongs[0].name, currentAlbumFolder, false);
            UI.updatePlayerDisplay(currentPlaylistSongs[0].name, "00:00", "00:00"); // Initial display
            UI.updatePlayPauseIcon(true); // Show play icon as it's paused
        } else {
            console.warn("No songs loaded initially. Check the default folder or server.");
        }
    } else {
        // Fallback to original method if info.json is not available
        currentPlaylistSongs = await API.fetchSongs(currentAlbumFolder);
        UI.renderSongList(currentPlaylistSongs.map(song => ({ name: song, artist: "Unknown Artist" })), currentAlbumFolder, handleSongClick);

        if (currentPlaylistSongs.length > 0) {
            Playback.loadAndPlay(currentPlaylistSongs[0].name, currentAlbumFolder, false);
            UI.updatePlayerDisplay(currentPlaylistSongs[0].name, "00:00", "00:00");
            UI.updatePlayPauseIcon(true);
        } else {
            console.warn("No songs loaded initially. Check the default folder or server.");
        }
    }

    // 3. Display all albums
    const albumFolderNames = await API.fetchAlbumFolders();

    // Fetch details for each album folder and combine with the folder name
    const albumDetailsPromises = albumFolderNames.map(async folderName => {
        const details = await API.fetchAlbumDetails(folderName);
        if (details) {
            return {
                ...details,
                // Correctly assign the full folder path using the folderName
                folder: `${API.SONGS_ROOT_FOLDER}/${folderName}`
            };
        }
        return null; // Return null for failed fetches
    });

    const albums = (await Promise.all(albumDetailsPromises)).filter(Boolean); // Filter out any nulls
    UI.renderAlbumCards(albums, handleAlbumCardClick);

    // 4. Attach global UI event listeners
    UI.attachGlobalListeners({
        onPlayPauseClick: handlePlayPauseClick,
        onPreviousClick: handlePreviousClick,
        onNextClick: handleNextClick,
        onSeekbarClick: handleSeekbarClick,
        onVolumeChange: handleVolumeChange,
        onMuteToggle: handleMuteToggle,
        onHamburgerClick: UI.openSidebar,
        onCloseClick: UI.closeSidebar,
        onShuffleClick: handleShuffleClick,
        onRepeatClick: handleRepeatClick
    });

    // 5. Set initial volume UI
    const { volume, isMuted } = Playback.getPlaybackState();
    UI.updateVolumeControls(volume, isMuted);

    // 6. Add keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        // Prevent default behavior for spacebar to avoid scrolling
        if (event.code === 'Space') {
            event.preventDefault();
            handlePlayPauseClick();
        } else if (event.code === 'ArrowRight') {
            handleNextClick();
        } else if (event.code === 'ArrowLeft') {
            handlePreviousClick();
        }
    });
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);