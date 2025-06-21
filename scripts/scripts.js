
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
