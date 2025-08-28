// Spotify Clone JavaScript Functionality

class SpotifyPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentSongIndex = 0;
        this.volume = 0.7;
        this.songs = this.createSampleSongs();
        
        this.initializePlayer();
        this.setupEventListeners();
        this.loadSong(this.currentSongIndex);
    }

    createSampleSongs() {
        return [
            {
                title: "Top 50 - Global",
                artist: "Various Artists",
                image: "./card1img.jpeg",
                duration: 312, // 5:12 in seconds
                audio: this.createDummyAudio()
            },
            {
                title: "Mahiya Jinna Sohna",
                artist: "Darshan Raval",
                image: "./card2img.jpeg",
                duration: 240,
                audio: this.createDummyAudio()
            },
            {
                title: "Jaanman (From 'Bad News')",
                artist: "Vishal Mishra",
                image: "./card 3.jpeg",
                duration: 210,
                audio: this.createDummyAudio()
            },
            {
                title: "Maiyya",
                artist: "Sachet-Parampara",
                image: "./card  4.jpeg",
                duration: 180,
                audio: this.createDummyAudio()
            }
        ];
    }

    createDummyAudio() {
        // Create a silent audio buffer for demo purposes
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0; // Silent
        
        return oscillator;
    }

    initializePlayer() {
        // Set initial volume
        this.audio.volume = this.volume;
        
        // Update volume slider
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.volume * 100;
        }
    }

    setupEventListeners() {
        // Play/Pause button
        const playButton = document.querySelector('.player-control-icon[src*="player_icon3"]');
        if (playButton) {
            playButton.addEventListener('click', () => this.togglePlay());
        }

        // Previous button
        const prevButton = document.querySelector('.player-control-icon[src*="player_icon2"]');
        if (prevButton) {
            prevButton.addEventListener('click', () => this.previousSong());
        }

        // Next button
        const nextButton = document.querySelector('.player-control-icon[src*="player_icon4"]');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextSong());
        }

        // Progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('input', (e) => this.seekTo(e.target.value));
            progressBar.addEventListener('change', (e) => this.seekTo(e.target.value));
        }

        // Volume control
        const volumeSlider = document.querySelector('.volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        }

        // Song cards
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.addEventListener('click', () => this.playSong(index));
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('ended', () => this.nextSong());
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.isPlaying = true;
        this.audio.play();
        this.updatePlayButton();
    }

    pause() {
        this.isPlaying = false;
        this.audio.pause();
        this.updatePlayButton();
    }

    updatePlayButton() {
        const playButton = document.querySelector('.player-control-icon[src*="player_icon3"]');
        if (playButton) {
            if (this.isPlaying) {
                playButton.style.opacity = '1';
                playButton.style.transform = 'scale(1.1)';
            } else {
                playButton.style.opacity = '0.7';
                playButton.style.transform = 'scale(1)';
            }
        }
    }

    loadSong(index) {
        if (index < 0 || index >= this.songs.length) return;
        
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        // Update UI
        this.updateSongInfo(song);
        this.updateProgressBar();
        
        // Reset playback state
        this.isPlaying = false;
        this.updatePlayButton();
    }

    playSong(index) {
        this.loadSong(index);
        this.play();
    }

    nextSong() {
        const nextIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.playSong(nextIndex);
    }

    previousSong() {
        const prevIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.playSong(prevIndex);
    }

    updateSongInfo(song) {
        // Update album art and song info
        const albumSection = document.querySelector('.album');
        if (albumSection) {
            albumSection.innerHTML = `
                <div class="current-song">
                    <img src="${song.image}" alt="${song.title}">
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                </div>
            `;
        }

        // Update total time
        const totalTime = document.querySelectorAll('.curr-time')[1];
        if (totalTime) {
            totalTime.textContent = this.formatTime(song.duration);
        }
    }

    updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const currentTime = document.querySelectorAll('.curr-time')[0];
        
        if (progressBar && currentTime) {
            const progress = (this.audio.currentTime / this.songs[this.currentSongIndex].duration) * 100;
            progressBar.value = progress;
            currentTime.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.value = 0;
        }
        
        const currentTime = document.querySelectorAll('.curr-time')[0];
        if (currentTime) {
            currentTime.textContent = '00:00';
        }
    }

    seekTo(percentage) {
        const song = this.songs[this.currentSongIndex];
        this.audio.currentTime = (percentage / 100) * song.duration;
    }

    setVolume(volume) {
        this.volume = volume;
        this.audio.volume = volume;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new SpotifyPlayer();
    
    // Add volume control to the player
    const controlsSection = document.querySelector('.controls');
    if (controlsSection) {
        controlsSection.innerHTML = `
            <div class="volume-control">
                <i class="fa-solid fa-volume-high"></i>
                <input type="range" min="0" max="100" value="70" class="volume-slider">
            </div>
        `;
    }

    // Update TODO: Mark setup as complete
    console.log('Spotify Player initialized successfully!');
});

// Additional interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Navigation hover effects
    const navOptions = document.querySelectorAll('.nav-option');
    navOptions.forEach(option => {
        option.addEventListener('mouseenter', () => {
            option.style.opacity = '1';
        });
        option.addEventListener('mouseleave', () => {
            if (!option.style.opacity || option.style.opacity !== '1') {
                option.style.opacity = '0.7';
            }
        });
    });

    // Search functionality placeholder
    const searchOption = document.querySelector('.nav-option:nth-child(2)');
    if (searchOption) {
        searchOption.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Search functionality coming soon!');
        });
    }

    // Library buttons
    const createPlaylistBtn = document.querySelector('.box:first-child .badge');
    const browsePodcastBtn = document.querySelector('.box:nth-child(2) .badge');
    
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', () => {
            alert('Create Playlist functionality coming soon!');
        });
    }
    
    if (browsePodcastBtn) {
        browsePodcastBtn.addEventListener('click', () => {
            alert('Browse Podcasts functionality coming soon!');
        });
    }
});
