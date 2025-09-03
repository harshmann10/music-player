# Spotify Clone Project

This is a Spotify clone project created as part of Code with Harry's web development tutorial series. It's a fully functional music player web application with a modern UI design that mimics the Spotify interface.

## Features

- Play music from different playlists
- Responsive design that works on desktop and mobile devices
- Modern UI with gradient backgrounds and smooth animations
- Volume control
- Progress seeking
- Shuffle and Repeat functionality

## How to Use the Shuffle Feature

### Activating/Deactivating Shuffle

The shuffle feature allows you to play songs in a random order rather than sequentially. To toggle the shuffle feature:

1. Locate the shuffle button in the player controls (it looks like two arrows forming a cross)
2. Click the shuffle button to activate it
3. Click the shuffle button again to deactivate it

When shuffle is active, the button will change its appearance to indicate the active state.

### What Happens When Shuffle is Active

When shuffle is activated:
- Songs will play in a random order rather than sequentially
- This applies to both automatic song transitions (when a song finishes) and manual navigation (when you click the next button)
- The previous button will still take you to the previously played song, regardless of shuffle state

### Visual Indicators for Shuffle State

- When shuffle is inactive: The shuffle button appears with a standard background
- When shuffle is active: The shuffle button will have a green background with a glowing effect, matching the Spotify green theme

## How to Use the Repeat Feature

### Activating/Deactivating Repeat

The repeat feature allows you to continuously play the same song. To toggle the repeat feature:

1. Locate the repeat button in the player controls (it looks like a circular arrow)
2. Click the repeat button to activate it
3. Click the repeat button again to deactivate it

When repeat is active, the button will change its appearance to indicate the active state.

### What Happens When Repeat is Active

When repeat is activated:
- The current song will automatically replay from the beginning once it finishes
- This overrides the default behavior of advancing to the next song
- The next button will still advance to the next song in the playlist when clicked manually

### Visual Indicators for Repeat State

- When repeat is inactive: The repeat button appears with a standard background
- When repeat is active: The repeat button will have a green background with a glowing effect, matching the Spotify green theme

## How the Features Work Together

When both shuffle and repeat are active:
- The repeat feature takes precedence for the current song (it will replay the same song)
- After the repeated song finishes, shuffle will determine the next song if you manually click next or if the song ends naturally
- The combination allows you to repeat a song as many times as you want while still having the option to move to a random song from the playlist

## Technical Implementation

This project uses HTML, CSS, and JavaScript to create a responsive music player interface. The player controls are implemented with modern CSS features including gradients, animations, and flexbox layouts.

## Setup

To run this project locally:
1. Clone or download the repository
2. Open `index.html` in your web browser
3. No additional setup or dependencies are required

## Project Structure

- `index.html` - Main HTML file containing the player interface
- `css/` - Contains all CSS stylesheets
- `js/` - Contains all JavaScript files for player functionality
- `img/` - Contains all image assets including icons and album art

## Contributing

This project is part of a tutorial series and is intended for educational purposes. Feel free to fork and modify it for your own learning.

## License

This project is created for educational purposes as part of Code with Harry's tutorial series.