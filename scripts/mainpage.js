document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("petVideo");
  const link = document.getElementById("petVideoLink");

  const videos = [
    {
      src: "videos/lyla.mp4",
      linkHref: "pets/lyla.html",
      linkText: "Lyla →"
    },
    {
      src: "videos/max.mp4",
      linkHref: "pets/max.html",
      linkText: "Max →"
    }
  ];

  let currentIndex = 0;

  function loadVideo(index) {
    const selected = videos[index];
    video.querySelector("source").src = selected.src;
    video.load();
    video.play();

    link.href = selected.linkHref;
    link.textContent = selected.linkText;
  }

  video.addEventListener("ended", function () {
    currentIndex = (currentIndex + 1) % videos.length;
    loadVideo(currentIndex);
  });

  loadVideo(currentIndex);
});

