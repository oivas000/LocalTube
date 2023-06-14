// Created by @oivas000
console.log("Created by @oivas000");
console.log("WARNING: Do not use it in a production deployment!");
console.log("WARNING: May cause heavy data usage.");
function listenSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}

function loadVideo() {
  document.addEventListener('DOMContentLoaded', () => {
    fetch('videos.list').then(response => response.text()).then(data => {
      const container = document.getElementById('videoContainer');
      const videoFiles = data.split('\n').filter(line => !line.startsWith('#') && !line.startsWith('*') && line.trim() !== '');
      const limitedVideoFiles = videoFiles.slice(0, 10);
      const randomLimitedVideoFiles = shuffleArray(limitedVideoFiles);
      randomLimitedVideoFiles.forEach(file => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        const videoElement = document.createElement('video');
        const sourceElement = document.createElement('source');
        const downloadLink = document.createElement('a');
        const videoTitle = document.createElement('div');
        videoElement.controls = true;
        videoElement.crossOrigin = 'anonymous';
        videoElement.playsInline = true;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
          if (xhr.status === 200) {
            var videoBlob = xhr.response;
            var videoURL = window.URL.createObjectURL(videoBlob);
            videoElement.srcObject = null;
            videoElement.src = videoURL;
          }
        };
        xhr.onerror = function () {
          console.error('Failed to load the video file.');
        };
        xhr.send();
        sourceElement.type = `video/${file.split('.').pop()}`;
        downloadLink.href = file;
        downloadLink.download = file;
        downloadLink.textContent = 'Download';
        const fileName = file.split('/').pop().split('.').shift();
        videoTitle.classList.add('video-info');
        videoTitle.textContent = fileName;
        videoElement.appendChild(sourceElement);
        videoElement.appendChild(downloadLink);
        videoItem.appendChild(videoElement);
        videoItem.appendChild(videoTitle);
        container.appendChild(videoItem);
        const player = new Plyr(videoElement, {
          invertControls: true,
          classNames: {
            light: 'plyr--dark'
          },
          controls: ['play-large', 'play', 'progress', 'current-time', 'settings', 'fullscreen'],
          settings: ['captions', 'quality', 'speed'],
          volume: 1,
          seekTime: 10
        });
        player.on('play', event => {
          document.title = `Playing: ${fileName}`;
        });
        player.on('pause', () => {
          document.title = 'LocalTube';
        });
      });
    })
      .catch(error => {
        console.error('Failed to fetch video files:', error);
      });
  });
}

function performSearch() {
  showLoader();
  const searchInput = document.querySelector('.search-input');
  const searchQuery = searchInput.value.toLowerCase();
  const container = document.getElementById('videoContainer');
  const videoItems = container.querySelectorAll('.video-item');
  videoItems.forEach(videoItem => {
    const video = videoItem.querySelector('video');
    const fileName = video.querySelector('source').src.toLowerCase();
    const videoTitle = videoItem.querySelector('.video-info').textContent.toLowerCase();
    if (fileName.includes(searchQuery) || videoTitle.includes(searchQuery)) {
      hideLoader();
      videoItem.style.display = 'block';
    } else {
      setTimeout(() => {
        hideLoader();
      }, 1000);
      videoItem.style.display = 'none';
      const notFoundMessage = document.createElement('div');
      notFoundMessage.textContent = 'Video not found';
      notFoundMessage.classList.add('notFoundMessage');
      container.appendChild(notFoundMessage);
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showLoader() {
  const loader = document.querySelector('.loader');
  const container = document.querySelector('.container');
  loader.style.display = 'flex';
  container.style.display = 'none';
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  const container = document.querySelector('.container');
  loader.style.display = 'none';
  container.style.display = 'block';
}

showLoader();
listenSearch();
loadVideo();
hideLoader();