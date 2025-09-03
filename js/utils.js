/**
 * Converts seconds into a formatted "MM:SS" string.
 * @param {number} seconds - The total number of seconds.
 * @returns {string} - Formatted time string (e.g., "03:45").
 */
export function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}