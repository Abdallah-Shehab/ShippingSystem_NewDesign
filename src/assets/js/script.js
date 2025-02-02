document.addEventListener("DOMContentLoaded", function () {
    const sidebarToggle = document.querySelector("#sidebar-toggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            document.querySelector("#sidebar").classList.toggle("collapsed");
            document.querySelector("#main").classList.toggle("expand");

        });
    }

    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            toggleLocalStorage();
            toggleRootClass();
        });
    }

    function toggleRootClass() {
        const current = document.documentElement.getAttribute('data-bs-theme');
        const inverted = current == 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', inverted);
    }

    function toggleLocalStorage() {
        if (isLight()) {
            localStorage.removeItem("light");
        } else {
            localStorage.setItem("light", "set");
        }
    }

    function isLight() {
        return localStorage.getItem("light");
    }

    if (isLight()) {
        toggleRootClass();
    }
});
