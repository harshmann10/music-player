let currentSong = new Audio();
let songs;
let cfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    cfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/javascript%20by%20code%20with%20harry/Spotify%20Clone%20(Tut%2084)/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replace(".mp3", ""));
        }
    }

    //show all the song in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML += ` <li>
                             <img class="invert" src="./img/music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>harsh</div>
                             </div>
                             <div class="playnow">
                                 <span>play now</span>
                                 <img class="invert" src="./img/play.svg" alt="">
                             </div>
                         </li>`;
    }

    //attach event listener to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerText.trim());
        });
    });

    return songs; // Return the updated songs array
}

const playMusic = (track, pause = false) => {
    // var audio = new Audio("songs/" + track +".mp3");
    currentSong.src = `${cfolder}/` + track + ".mp3";
    if (!pause) {
        currentSong.play();
        play.src = "./img/pause.svg";
    }
    document.querySelector(".songinfo").innerText = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    // console.log("Playing track:", track);
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/javascript%20by%20code%20with%20harry/Spotify%20Clone%20(Tut%2084)/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchor);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
            if (e.href.includes("songs")) {
                folder = e.href.split("/").slice(-2)[0];
                let a = await fetch(`http://127.0.0.1:3000/javascript%20by%20code%20with%20harry/Spotify%20Clone%20(Tut%2084)/songs/${folder}/info.json`);
                let response = await a.json();
                console.log(response);
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                            <div class="play">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                    color="#000000" fill="none">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <img src="songs/${folder}/cover.jpg" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
            }
        };

    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.currentTarget.dataset.folder);
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0], false); // Play the first song in the new playlist
        });
    })
    // console.log(anchor);
}

let previousVolume;
async function main() {

    // get all songs
    await getSongs("songs/punjabi");
    console.log(songs);
    playMusic(songs[0], true);

    //display all the albums on the page
    displayAlbums();

    // play the first song
    // var audio = new Audio(songs[0] + ".mp3");
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // });

    // attach an event listener to play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "./img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "./img/play.svg";
        }
    });

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    //add an event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        document.querySelector(".circle").style.left = `${(e.offsetX / e.target.offsetWidth) * 100}%`;
        currentSong.currentTime = (e.offsetX / e.target.offsetWidth) * currentSong.duration;
    });

    //add an event listener for hamburger menu
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    //add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });

    //add a event listner to previous and next button
    previous.addEventListener("click", () => {
        let currentSongName = currentSong.src.split(`${cfolder}`)[1].replace(".mp3", "").replace("/", "");
        let index = songs.indexOf(currentSongName);
        index = (index - 1 + songs.length) % songs.length;
        playMusic(songs[index]);
    });

    next.addEventListener("click", () => {
        let currentSongName = currentSong.src.split(`${cfolder}`)[1].replace(".mp3", "").replace("/", "");
        let index = songs.indexOf(currentSongName);
        index = (index + 1) % songs.length;
        playMusic(songs[index]);
    })

    //add an event listener for volume slider
    document.getElementById('volume-slider').addEventListener('input', (e) => {
        console.log(e.target.value);
        currentSong.volume = e.target.value;
        if(currentSong.volume === 0){
            document.getElementById('volumeButton').src = "./img/mute.svg";
        }
        if(currentSong.volume > 0){
            document.getElementById('volumeButton').src = "./img/volume.svg";
            currentSong.muted = false;
        }
    });

    //add event listener to mute the volume
    document.getElementById('volumeButton').addEventListener('click', () => {
        currentSong.muted = !currentSong.muted;
        if (currentSong.muted) {
            document.getElementById('volumeButton').src = "./img/mute.svg";
            previousVolume = document.getElementById('volume-slider').value;
            document.getElementById('volume-slider').value = 0;
        } else {
            document.getElementById('volumeButton').src = "./img/volume.svg";
            document.getElementById('volume-slider').value = previousVolume;
        }
    });
}

main();