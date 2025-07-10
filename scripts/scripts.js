
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('petVideo');
    const timeline = document.getElementById('videoTimeline');
    const ctx = timeline.getContext('2d');
    const scrubber = document.querySelector('.timeline-scrubber');
    let isDragging = false;
    let tempVideo = null;

    // Initialize canvas
    function initCanvas() {
        timeline.width = timeline.offsetWidth;
        timeline.height = timeline.offsetHeight;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, timeline.width, timeline.height);
    }
    initCanvas();

    // Create fresh video element for each load
    function createTempVideo() {
        if (tempVideo) {
            tempVideo.onseeked = null;
            tempVideo.onerror = null;
        }

        tempVideo = document.createElement('video');
        tempVideo.setAttribute('crossorigin', 'anonymous');
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        return tempVideo;
    }

    // Generate filmstrip with cache busting
    function generateFilmstrip() {
        console.log('Generating filmstrip...');

        // Clear any existing filmstrip
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, timeline.width, timeline.height);

        if (!video.duration || isNaN(video.duration)) {
            console.error('Invalid video duration');
            setTimeout(generateFilmstrip, 500); // Retry after delay
            return;
        }

        const duration = video.duration;
        const frameCount = 20;
        const frameWidth = timeline.width / frameCount;
        const frameHeight = timeline.height;

        tempVideo = createTempVideo();
        tempVideo.src = video.currentSrc + '?cachebuster=' + Date.now();

        let framesCaptured = 0;
        let generationStart = Date.now();

        function captureNextFrame() {
            if (framesCaptured >= frameCount) {
                console.log('Filmstrip generation complete');
                return;
            }

            // Timeout after 15 seconds
            if (Date.now() - generationStart > 15000) {
                console.error('Filmstrip generation timeout');
                return;
            }

            const i = framesCaptured;
            const time = (i / frameCount) * duration;

            tempVideo.currentTime = time;

            tempVideo.onseeked = function() {
                try {
                    ctx.drawImage(tempVideo, i * frameWidth, 0, frameWidth, frameHeight); // Draw the frame

                    framesCaptured++;
                    captureNextFrame();
                } catch (e) {
                    console.error('Error drawing frame:', e);
                    framesCaptured++;
                    captureNextFrame();
                }
            };

            tempVideo.onerror = function() {
                console.error('Error seeking to time:', time);
                framesCaptured++;
                captureNextFrame();
            };
        }

        tempVideo.addEventListener('loadedmetadata', function() {
            captureNextFrame();
        });
    }

    // Reset video and setup event listeners, ensuring it reloads properly,
    // so we can generate the filmstrip after refreshing the page
    function setupVideo() {
        video.onseeked = null;
        video.onerror = null;
        video.load();

        video.addEventListener('loadedmetadata', function() {
            generateFilmstrip();
        });

        video.addEventListener('error', function() {
            console.error('Main video error', video.error);
            setTimeout(setupVideo, 1000);
        });
    }

    setupVideo();

    // Update scrubber position
    video.addEventListener('timeupdate', function() {
        if (video.duration > 0) {
            const progress = (video.currentTime / video.duration) * 100;
            scrubber.style.left = `${progress}%`;
        }
    });

    // Timeline interaction
    timeline.addEventListener('click', function(e) {
        if (video.duration > 0) {
            const rect = timeline.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        }
    });

    timeline.addEventListener('mousedown', function(e) {
        isDragging = true;
        handleTimelineMove(e);
    });

    video.addEventListener('click', togglePlay, false);

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }



    document.addEventListener('mousemove', function(e) {
        if (isDragging) handleTimelineMove(e);
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function handleTimelineMove(e) {
        if (video.duration > 0) {
            const rect = timeline.getBoundingClientRect();
            let pos = (e.clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            video.currentTime = pos * video.duration;
        }
    }

    // Handle window resize
    window.addEventListener('resize', function() {
        if (video.readyState > 0) {
            generateFilmstrip();
        }
    });
});

/*
----------------
----------------
ARROWS
----------------
----------------
*/
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section.screen-section");
  const scrollDownBtn = document.getElementById("scrollDown");
  const scrollUpBtn = document.getElementById("scrollUp");

  function getCurrentSectionIndex() {
    const scrollY = window.scrollY;
    const index = Array.from(sections).findIndex(section => {
      const offset = section.offsetTop;
      const height = section.offsetHeight;
      return scrollY >= offset - height * 0.25 && scrollY < offset + height * 0.75;
    });
    return index;
  }

  function updateArrowVisibility() {
    const currentIndex = getCurrentSectionIndex();

    if (currentIndex <= 0) {
      scrollUpBtn.classList.add("hidden");
    } else {
      scrollUpBtn.classList.remove("hidden");
    }

    if (currentIndex >= sections.length - 1) {
      scrollDownBtn.classList.add("hidden");
    } else {
      scrollDownBtn.classList.remove("hidden");
    }
  }

  scrollDownBtn.addEventListener("click", () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex < sections.length - 1) {
      sections[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
    }
  });

  scrollUpBtn.addEventListener("click", () => {
    const currentIndex = getCurrentSectionIndex();
    if (currentIndex > 0) {
      sections[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
    }
  });

  window.addEventListener("scroll", updateArrowVisibility);
  window.addEventListener("resize", updateArrowVisibility);
  updateArrowVisibility();
});

/*
----------------
----------------
3D MODEL
----------------
----------------
*/
document.addEventListener("DOMContentLoaded", () => {
  const hotspots = document.querySelectorAll("model-viewer .hotspot");
  const textos = document.querySelectorAll(".info-texto");
  const cuidadosSection = document.getElementById("cuidados-section");

  hotspots.forEach(hotspot => {
    hotspot.addEventListener("click", () => {
      const targetId = hotspot.getAttribute("data-target");
      textos.forEach(t => t.style.display = "none");

      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.style.display = "block";
      }

      cuidadosSection.classList.add("duas-colunas");
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const hotspots = document.querySelectorAll('.hotspot');
  const caresContainer = document.getElementById('cares-container');
  
  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      
      const targetElement = document.getElementById(targetId);

      if (targetElement) {

        caresContainer.scrollTo({
          top: targetElement.offsetTop - caresContainer.offsetTop - 20,
          behavior: 'smooth'
        });

         targetElement.classList.add("highlight-animate");
        // Remove class after animation to allow replaying
        setTimeout(() => {
          targetElement.classList.remove("highlight-animate");
        }, 800); // match the animation duration

      }
    });
  });
});

  document.addEventListener('DOMContentLoaded', () => {
    const modelViewer = document.querySelector('model-viewer');
    
    // Wait for the model to fully load
    modelViewer.addEventListener('load', () => {
      
      document.querySelectorAll('.care-section').forEach(section => {
        const hotspotSlot = "hotspot-" + section.id;
        
        if (hotspotSlot) {
          section.style.cursor = 'pointer';
          
          section.addEventListener('click', () => {
            const hotspot = document.querySelector(`button[slot="${hotspotSlot}"]`);
            if (hotspot) {
              const position = hotspot.dataset.position.split(' ').map(Number);
              
              const orbitTheta = '75deg'; // vertical angle
              const orbitPhi = '0deg';    // horizontal angle
              const radius = '1m';        // distance
              
              modelViewer.cameraTarget = `${position[0]}m ${position[1]}m ${position[2]}m`;
              modelViewer.cameraOrbit = `${orbitPhi} ${orbitTheta} ${radius}`;
              
              highlightHotspot(hotspot);
            }
          });
        }
      });
    });
  });
  
  function highlightHotspot(hotspot) {
    hotspot.classList.add('hotspot-highlight');
    setTimeout(() => {
      hotspot.classList.remove('hotspot-highlight');
    }, 1000);
  }


function updateImage(carouselImage, currentImageIndex, imagePath) {
  carouselImage.src = imagePath
  carouselImage.alt = currentImageIndex;
}

function getPath(path, animalName, index){
  return path + animalName + index + ".png"
}

function prevImage(path, animalName, length) {
  const carouselImage = document.getElementById('carousel-image');
  const index = carouselImage.alt - 0
  const newIndex = index === 1 ? length : index - 1;
  imagePath = getPath(path, animalName, newIndex)
  updateImage(carouselImage, newIndex, imagePath);
}

function nextImage(path, animalName, length) {
  const carouselImage = document.getElementById('carousel-image');
  const index = carouselImage.alt - 0
  const newIndex = index === length ? 1 : index + 1;
  imagePath = getPath(path, animalName, newIndex)
  updateImage(carouselImage, newIndex, imagePath);
}

//THUMBNAIL
function openModal(imageSrc, descriptionText) {
  const modal = document.getElementById("myModal");
  const modalImage = document.getElementById("modalImage");
  const modalDesc = document.getElementById("modalDesc");

  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  modalImage.src = imageSrc;
  modalDesc.textContent = descriptionText;
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
  document.body.classList.remove("modal-open");
}

/*
----------------
----------------
VIDEO
----------------
----------------
*/

// Timestamps -----------
// moved to respective html file for each personality topic

// Personality Topics -----------
document.addEventListener("DOMContentLoaded", () => {
  setupPersonalityHighlights();
});

function setupPersonalityHighlights() {
  const video = document.getElementById("petVideo");
  const items = document.querySelectorAll(".personality-item");

  if (!video || items.length === 0) return;

  // Highlight current topic
  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    highlightCurrentTopic(currentTime, items);
  });

  // each topic 
  items.forEach((item) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      const start = parseFloat(item.dataset.start);
      if (!isNaN(start)) {
        video.currentTime = start;
        video.play();
      }
    });
});
}

// aux - Highlight current topic
function highlightCurrentTopic(currentTime, items) {
  items.forEach((item) => {
    const start = parseFloat(item.dataset.start);
    const end = parseFloat(item.dataset.end);

    const isActive = currentTime >= start && currentTime < end;
    item.classList.toggle("active", isActive);
  });
}

// Overlayed Icon -----------
document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("petVideo");
  const overlayButton = document.getElementById("scrollToPhotos");
  const overlayImg = overlayButton.querySelector("img");
  const items = document.querySelectorAll(".personality-item");

  overlayButton.style.cursor = "pointer";

  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;
    let currentTopic = null;
    items.forEach((item) => {
      const start = parseFloat(item.dataset.start);
      const end = parseFloat(item.dataset.end);

      if (video.currentTime >= start && video.currentTime < end) {
        currentTopic = item;
      }
    });
    //set image and scroll to correct page section
    if (currentTopic) {
      const topicImg = currentTopic.querySelector("img");
      if (topicImg) {
        overlayImg.src = topicImg.src;
        overlayButton.style.display = "flex";

        overlayButton.onclick = () => {
          const section = document.querySelector(`.scroll-container#${currentTopic.id}`);
          if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            section.classList.add("highlight-animate");
            setTimeout(() => section.classList.remove("highlight-animate"), 800);
          }
        };
      }
    } else {
      overlayButton.style.display = "none";
    }
  });
});

//TImeline markers:
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("petVideo");
  const overlay = document.querySelector('.timeline-markers-overlay');

  video.addEventListener('loadedmetadata', () => {
    // get start times
    const items = document.querySelectorAll(".personality-item");
    const cueTimes = {};
    items.forEach(item => {
      const start = parseFloat(item.dataset.start);
      if (!isNaN(start)) {
        cueTimes[item.id] = start;
      }
    });

    createTimelineMarkers(video, overlay, cueTimes);
  });
});

function createTimelineMarkers(video, overlayContainer, cueTimes) {
  if (!video || !overlayContainer) return;

  const duration = video.duration;
  overlayContainer.innerHTML = '';
// defines marker positions + image (will always be the same icon as the topic)
  Object.entries(cueTimes).forEach(([key, startTime]) => {
    if (startTime > duration) return;

    const leftPercent = (startTime / duration) * 100;

    const marker = document.createElement('div');
    marker.classList.add('timeline-marker');
    marker.style.left = `${leftPercent}%`;

    const icon = document.createElement('img');
    icon.src = `../photos/${key}_icon.png`;
    icon.alt = key;

    marker.appendChild(icon);
    overlayContainer.appendChild(marker);

    console.log('Creating marker:', key, startTime, 'at', leftPercent + '%');
  });
}
