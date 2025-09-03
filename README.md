# 🎵 Web-Based Music Player

A fully functional **music player web application** with a modern UI inspired by popular streaming services like **Spotify**.  
Built with **HTML, CSS, and JavaScript**, this project demonstrates responsive design, dynamic playlists, and interactive player controls.

---
<img width="1853" height="940" alt="image" src="https://github.com/user-attachments/assets/73cf99c3-f720-49b5-b9cc-2a25db787f4e" />

## ✨ Features

- 🎶 Play music from different playlists
- 📱 Fully responsive design (desktop & mobile)
- 🎨 Modern UI with gradients & smooth animations
- 🔊 Volume control with adjustable slider
- ⏩ Progress bar with seeking support
- 🔀 Shuffle songs for random playback
- 🔁 Repeat a song endlessly

---

## 🔀 Shuffle Feature

### How to Use

1. Click the **shuffle button** (two crossing arrows) in the player controls.
2. Click again to toggle off.

### Behavior

- Songs play in **random order** instead of sequentially.
- Works for both automatic transitions and manual navigation.
- The **previous button** always returns to the last played song.

### Visual Indicator

- **Inactive**: Standard button appearance
- **Active**: Green background with a glowing effect (Spotify-style)

---

## 🔁 Repeat Feature

### How to Use

1. Click the **repeat button** (circular arrow).
2. Click again to toggle off.

### Behavior

- Replays the **current song** once it finishes.
- Overrides default next-song behavior.
- Manual **Next** button still works as usual.

### Visual Indicator

- **Inactive**: Standard button appearance
- **Active**: Green background with glowing effect

---

## 🎼 Shuffle + Repeat Together

- **Repeat takes precedence** → current song will loop until turned off.
- After disabling repeat or manually skipping, shuffle determines the next random track.
- This lets you loop a song endlessly but still jump to a random one when desired.

---

## 🛠️ Technical Implementation

- **HTML5** for structure
- **CSS3 (Flexbox, animations, gradients)** for design & responsiveness
- **JavaScript (DOM manipulation, event listeners)** for player logic
- **JSON** for playlist configuration

---

## 🚀 Getting Started

1. **Clone or download** this repository
   ```bash
   git clone https://github.com/your-username/music-player.git
   ```
2. Open index.html in your web browser
3. No additional setup or dependencies are required 🎉

## Project Structure

- `index.html` - Main HTML file containing the player interface
- `css/` - Contains all CSS stylesheets
- `js/` - Contains all JavaScript files for player functionality
- `img/` - Contains all image assets including icons and album art
- `songs/info.json` - Global configuration file listing all available album folders

## Contributing

This project is part of a tutorial series and is intended for educational purposes. Feel free to fork and modify it for your own learning.
