
/* =========================================
   AATHITYAN PORTFOLIO - JAVASCRIPT
========================================= */

// Automatically update copyright year
document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    initialiseScrollCards();
    initialiseImagePreview();
    initialiseNavigation();
});


// Smooth horizontal scrolling with mouse wheel
function initialiseScrollCards() {
    const tracks = document.querySelectorAll(".horizontal-track");

    tracks.forEach(track => {
        track.addEventListener("wheel", event => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                if (track.scrollWidth > track.clientWidth) {
                    event.preventDefault();
                    track.scrollLeft += event.deltaY;
                }
            }
        }, { passive: false });
    });
}


// Open certificate, project and education images
// in a larger preview when clicked
function initialiseImagePreview() {
    const images = document.querySelectorAll(
        ".image-card img, .timeline-content img"
    );

    const overlay = document.createElement("div");

    overlay.className = "image-preview";
    overlay.innerHTML = `
        <button class="preview-close" aria-label="Close preview">
            &times;
        </button>
        <img src="" alt="Image preview">
    `;

    document.body.appendChild(overlay);

    const previewImage = overlay.querySelector("img");
    const closeButton = overlay.querySelector(".preview-close");

    images.forEach(image => {
        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {
            previewImage.src = image.src;
            previewImage.alt = image.alt;

            overlay.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function closePreview() {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
        previewImage.src = "";
    }

    closeButton.addEventListener("click", closePreview);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closePreview();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closePreview();
        }
    });
}


// Highlight navigation link based on current section
function initialiseNavigation() {
    const navLinks = document.querySelectorAll(".navbar nav a");

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${entry.target.id}`
                    );
                });
            }
        });
    }, {
        threshold: 0.35
    });

    sections.forEach(section => observer.observe(section));
}
