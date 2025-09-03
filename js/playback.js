import { secondsToMinutesSeconds } from './utils.js';
import { BASE_API_URL } from './api.js';

const currentAudio = new Audio();
let previousVolume = 0.5; // Default volume

/**
 * Initializes playback event listeners.
 * @param {function} onTimeUpdateCallback - Callback for timeupdate event.
 * @param {function} onSongEndedCallback - Callback for when a song ends.
 */
export function initPlaybackListeners(onTimeUpdateCallback, onSongEndedCallback) {
    currentAudio.addEventListener("timeupdate", () => {
        onTimeUpdateCallback({
            currentTime: currentAudio.currentTime,
            duration: currentAudio.duration,
            formattedCurrentTime: secondsToMinutesSeconds(currentAudio.currentTime),
            formattedDuration: secondsToMinutesSeconds(currentAudio.duration),
            seekPercent: (currentAudio.currentTime / currentAudio.duration) * 100
        });
    });

    currentAudio.addEventListener("ended", () => {
        onSongEndedCallback();
    });

    // Set initial volume
    currentAudio.volume = previousVolume;
}

/**
 * Loads a song and optionally plays it.
 * @param {string} trackName - The name of the track (e.g., "song_name").
 * @param {string} folderPath - The full path to the song's folder (e.g., "songs/punjabi").
 * @param {boolean} [autoPlay=true] - If true, the song will start playing immediately.
 */
export function loadAndPlay(trackName, folderPath, autoPlay = true) {
    currentAudio.src = `${BASE_API_URL}/${folderPath}/${trackName}.mp3`;
    if (autoPlay) {
        currentAudio.play();
    } else {
        currentAudio.pause();
    }
}

/**
 * Toggles play/pause state of the current song.
 * @returns {boolean} - True if playing, false if paused.
 */
export function togglePlayPause() {
    if (currentAudio.paused) {
        currentAudio.play();
        return true;
    } else {
        currentAudio.pause();
        return false;
    }
}

/**
 * Sets the volume of the current song.
 * @param {number} value - Volume level between 0 and 1.
 */
export function setVolume(value) {
    currentAudio.volume = value;
    if (value > 0) {
        currentAudio.muted = false;
        previousVolume = value; // Store only if not muted
    }
}

/**
 * Toggles mute state of the current song.
 * @param {number} currentSliderValue - The current value of the volume slider before muting.
 * @returns {boolean} - True if muted, false if unmuted.
 */
export function toggleMute(currentSliderValue) {
    if (currentAudio.muted) {
        currentAudio.muted = false;
        currentAudio.volume = previousVolume > 0 ? previousVolume : 0.5; // Restore previous volume or default
        return false;
    } else {
        currentAudio.muted = true;
        previousVolume = currentSliderValue; // Store current slider value before muting
        currentAudio.volume = 0;
        return true;
    }
}

/**
 * Seeks to a specific position in the song.
 * @param {number} percent - Percentage of the song duration (0 to 1).
 */
export function seek(percent) {
    if (currentAudio.duration) {
        currentAudio.currentTime = percent * currentAudio.duration;
    }
}

/**
 * Gets the current playback state.
 * @returns {object} - An object containing current playback properties.
 */
export function getPlaybackState() {
    return {
        currentTime: currentAudio.currentTime,
        duration: currentAudio.duration,
        isPaused: currentAudio.paused,
        volume: currentAudio.volume,
        isMuted: currentAudio.muted,
        src: currentAudio.src // Full URL of the current song
    };
}