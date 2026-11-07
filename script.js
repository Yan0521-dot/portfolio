
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
    initialiseRushTimeline();
    initialiseDocumentPopup();
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



// =========================================
// 1 YEAR RUSH - DYNAMIC TIMELINE
// =========================================

async function initialiseRushTimeline() {
    const timeline = document.getElementById("rush-timeline");
    const countdown = document.getElementById("rush-countdown");

    if (!timeline) return;

    // Real-time countdown until internship target
    function updateCountdown() {
        if (!countdown) return;

        const targetDate = new Date("2027-10-01T00:00:00+08:00");
        const now = new Date();

        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            countdown.textContent = "TARGET REACHED";
            return;
        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        const seconds = Math.floor(
            (difference / 1000) % 60
        );

        countdown.textContent =
            `${days}D ${String(hours).padStart(2, "0")}H ` +
            `${String(minutes).padStart(2, "0")}M ` +
            `${String(seconds).padStart(2, "0")}S`;
    }

    // Start countdown and refresh every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Load timeline events from JSON
    try {
        const response = await fetch("./updates/events.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const events = await response.json();

        if (!Array.isArray(events)) {
            throw new Error("Invalid timeline data format");
        }

        timeline.replaceChildren();

        if (events.length === 0) {
            timeline.textContent = "No milestones added yet.";
            timeline.classList.add("rush-empty");
            return;
        }

        // Sort events chronologically
        events.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        // Display each event
        events.forEach(event => {
            const article = document.createElement("article");
            article.className = "rush-event";

            const status = ["active", "upcoming", "completed"]
                .includes(event.status)
                ? event.status
                : "upcoming";

            article.dataset.status = status;

            const meta = document.createElement("div");
            meta.className = "rush-event-meta";

            const date = document.createElement("span");
            date.className = "rush-event-date";
            date.textContent = event.dateLabel || event.date || "";

            const category = document.createElement("span");
            category.className = "rush-event-category";
            category.textContent = event.category || "MILESTONE";

            const statusLabel = document.createElement("span");
            statusLabel.className = "rush-event-status";
            statusLabel.textContent = status;

            meta.append(date, category, statusLabel);

            const title = document.createElement("h4");
            title.textContent = event.title || "Untitled milestone";

            const description = document.createElement("p");
            description.textContent = event.description || "";

            article.append(meta, title, description);
            timeline.appendChild(article);
        });

    } catch (error) {
        console.error("1 YEAR RUSH timeline error:", error);

        timeline.textContent =
            "Unable to load the timeline. Please check updates/events.json.";

        timeline.classList.add("rush-error");
    }
}



// =========================================
// RESUME & CV AVAILABILITY POPUP
// =========================================

function initialiseDocumentPopup() {
    const popup = document.getElementById("document-popup");

    if (!popup) return;

    const title = document.getElementById("document-popup-title");
    const message = document.getElementById("document-popup-message");

    const closeButton = popup.querySelector(".document-popup-close");
    const okButton = document.getElementById("document-popup-ok");

    const documentButtons = document.querySelectorAll(".document-button");

    function openPopup(documentType) {
        title.textContent = `${documentType} Coming Soon`;

        message.textContent =
            `Thank you for your interest in me! My ${documentType} ` +
            `will be available approximately two months before my ` +
            `internship begins. Stay tuned!`;

        popup.classList.add("active");
        popup.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        closeButton.focus();
    }

    function closePopup() {
        popup.classList.remove("active");
        popup.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    documentButtons.forEach(button => {
        button.addEventListener("click", () => {
            openPopup(button.dataset.document);
        });
    });

    closeButton.addEventListener("click", closePopup);
    okButton.addEventListener("click", closePopup);

    popup.addEventListener("click", event => {
        if (event.target === popup) {
            closePopup();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
        }
    });
}
