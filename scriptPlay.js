const playlist = [
    { name: 'Tribalistas', author: 'Gedeão & Stefhany', img: 'imagem/imag music/ima.music3.jpg', audio: 'Musica/musica3.mp3' },
    { name: 'Arctic monkeys', author: 'Gedeão & Stefhany', img: 'imagem/imag music/ima.music1.jpg', audio: 'Musica/musica1.mp3' },
    { name: 'Edith Whiskers', author: 'Gedeão & Stefhany', img: 'imagem/imag music/ima.music2.jpg', audio: 'Musica/musica2.mp3' },
    { name: 'OUTROEU', author: 'Gedeão & Stefhany', img: 'imagem/imag music/ima.music4.jpg', audio: 'Musica/musica4.mp3' },
    { name: 'Rodrigo Alarcon', author: 'Gedeão & Stefhany', img: 'imagem/imag music/ima.music5.jpg', audio: 'Musica/musica5.mp3' }

];

let currentIndex = 0;
const audioPlayer = document.getElementById('audio-player');
const currentImg = document.getElementById('current-img');
const currentName = document.getElementById('current-name');
const currentAuthor = document.getElementById('current-author');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const tracks = document.querySelectorAll('.track');
const currentTimeDisplay = document.getElementById('current-time');
const endTimeDisplay = document.getElementById('end-time');
const timeline = document.getElementById('timeline');
const playhead = document.getElementById('playhead');

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function loadTrack(index) {
    const track = playlist[index];
    console.log(`[Load] Tentando carregar: ${track.audio}`);
    audioPlayer.src = track.audio;
    currentImg.src = track.img;
    currentName.textContent = track.name;
    currentAuthor.textContent = track.author;
    tracks.forEach(t => t.classList.remove('active'));
    tracks[index].classList.add('active');
    playhead.style.width = '0%';

    audioPlayer.load();
    audioPlayer.addEventListener('loadedmetadata', () => {
        endTimeDisplay.textContent = formatTime(audioPlayer.duration);
        console.log(`[Load] Sucesso: ${track.name} carregada. Duração: ${audioPlayer.duration}s`);
    }, { once: true });

    audioPlayer.addEventListener('error', (e) => {
        console.error(`[Load] Erro ao carregar ${track.audio}:`, e);
    }, { once: true });
}

function playAudio() {
    console.log(`[Play] Tentando tocar: ${playlist[currentIndex].name}`);
    audioPlayer.play()
        .then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            console.log(`[Play] Sucesso: ${playlist[currentIndex].name} tocando`);
        })
        .catch(error => {
            console.error(`[Play] Erro ao reproduzir ${playlist[currentIndex].audio}:`, error);
        });
}

function pauseAudio() {
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    console.log(`[Pause] Pausado: ${playlist[currentIndex].name}`);
}

function playPause() {
    console.log('[Click] Botão Play/Pause clicado');
    if (audioPlayer.paused) {
        playAudio();
    } else {
        pauseAudio();
    }
}

function updateProgress() {
    if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playhead.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    }
}

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('ended', () => {
    console.log('[End] Música terminou');
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    playAudio();
});

playBtn.addEventListener('click', playPause);

prevBtn.addEventListener('click', () => {
    console.log('[Click] Botão Anterior clicado');
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    playAudio();
});

nextBtn.addEventListener('click', () => {
    console.log('[Click] Botão Próximo clicado');
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    playAudio();
});

tracks.forEach(track => {
    track.addEventListener('click', () => {
        const trackName = track.querySelector('.track-name').textContent;
        console.log(`[Click] Música clicada: ${trackName}`);
        currentIndex = parseInt(track.getAttribute('data-index'));
        loadTrack(currentIndex);
        playAudio();
    });
});

timeline.addEventListener('click', (e) => {
    if (!isNaN(audioPlayer.duration)) {
        const timelineWidth = timeline.offsetWidth;
        const clickPosition = e.offsetX;
        const percent = clickPosition / timelineWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
        console.log(`[Timeline] Novo tempo: ${audioPlayer.currentTime}s`);
    }
});

// Carrega a primeira música ao iniciar
console.log('[Init] Inicializando playlist');
loadTrack(currentIndex);

// Controle de volume
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

// Define o volume inicial como máximo (1)
audioPlayer.volume = 1;

// Atualiza o volume do áudio, o efeito neon e o ícone
function updateVolume(volume) {
    audioPlayer.volume = volume;
    volumeSlider.value = volume; // Sincroniza o slider com o volume
    console.log(`[Volume] Volume ajustado para: ${volume}`);

    // Atualiza a cor neon e o ícone com base no volume
    volumeSlider.classList.remove('low', 'medium', 'high');
    volumeIcon.classList.remove('fa-volume-down', 'fa-volume-up', 'fa-volume-mute');
    if (volume === 0) {
        volumeSlider.classList.add('low');
        volumeIcon.classList.add('fa-volume-mute'); // Ícone de mudo
        volumeIcon.style.color = '#ff0000'; // Vermelho neon
    } else if (volume <= 0.33) {
        volumeSlider.classList.add('low');
        volumeIcon.classList.add('fa-volume-down'); // Ícone de volume baixo
        volumeIcon.style.color = '#ff0000'; // Vermelho neon
    } else if (volume <= 0.66) {
        volumeSlider.classList.add('medium');
        volumeIcon.classList.add('fa-volume-up'); // Ícone de volume médio
        volumeIcon.style.color = '#ff7f00'; // Laranja neon
    } else {
        volumeSlider.classList.add('high');
        volumeIcon.classList.add('fa-volume-up'); // Ícone de volume alto
        volumeIcon.style.color = '#00f'; // Azul neon
    }
}

// Evento para ajustar o volume com o slider
volumeSlider.addEventListener('input', () => {
    const volume = parseFloat(volumeSlider.value);
    updateVolume(volume);
});

// Evento para mutar o áudio ao clicar no ícone
volumeIcon.addEventListener('click', () => {
    updateVolume(0); // Define o volume como 0 (mudo)
    console.log('[Mute] Volume mutado ao clicar no ícone');
});

// Inicializa a classe e o ícone com base no volume inicial
updateVolume(1); // Começa com volume máximo


