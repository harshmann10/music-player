// Base URL for fetching resources from the local server
// const BASE_API_URL = "http://127.0.0.1:3000"; // For a local development
const BASE_API_URL = ""; //production DEPLOYMENT SETTING

// Root folder where all song albums are located
const SONGS_ROOT_FOLDER = "songs";

/**
 * Fetches a list of MP3 song names from a specified folder.
 * @param {string} folderPath - The path to the folder containing the songs (e.g., "songs/punjabi").
 * @returns {Promise<string[]>} - A promise that resolves to an array of song names (without .mp3 extension).
 */
export async function fetchSongs(folderPath) {
    let responseText = "";
    try {
        let response = await fetch(`${BASE_API_URL}/${folderPath}/`);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status} for folder: ${folderPath}`);
            return [];
        }
        responseText = await response.text();
    } catch (error) {
        console.error("Error fetching songs directory:", error);
        return [];
    }

    const div = document.createElement("div");
    div.innerHTML = responseText;
    const anchorTags = div.getElementsByTagName("a");
    const songs = [];

    for (let i = 0; i < anchorTags.length; i++) {
        const element = anchorTags[i];
        if (element.href.endsWith(".mp3")) {
            const songNameWithExtension = element.href.split('/').pop();
            const songName = songNameWithExtension.replace(".mp3", "");
            songs.push(songName);
        }
    }
    return songs;
}

/**
 * Fetches the info.json file for a given album folder.
 * @param {string} folderName - The name of the album folder (e.g., "punjabi").
 * @returns {Promise<object|null>} - A promise that resolves to the album info object or null if not found/error.
 */
export async function fetchAlbumDetails(folderName) {
    const folderPath = `${SONGS_ROOT_FOLDER}/${folderName}`;
    try {
        let infoFetch = await fetch(`${BASE_API_URL}/${folderPath}/info.json`);
        if (!infoFetch.ok) {
            console.warn(`Could not fetch info.json for folder: ${folderName}. Status: ${infoFetch.status}`);
            return null;
        }
        return await infoFetch.json();
    } catch (error) {
        console.warn(`Error fetching info.json for folder ${folderName}:`, error);
        return null;
    }
}

/**
 * Fetches a list of all album folder names within the SONGS_ROOT_FOLDER.
 * @returns {Promise<string[]>} - A promise that resolves to an array of album folder names.
 */
export async function fetchAlbumFolders() {
    try {
        let response = await fetch(`${BASE_API_URL}/${SONGS_ROOT_FOLDER}/info.json`);
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status} for global info.json.`);
            return [];
        }
        const globalInfo = await response.json();
        return globalInfo.albums || [];
    } catch (error) {
        console.error("Error fetching global info.json:", error);
        return [];
    }
}

export { BASE_API_URL, SONGS_ROOT_FOLDER };