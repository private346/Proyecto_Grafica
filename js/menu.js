// cargar menu
fetch("menu.html")
.then(res => res.text())
.then(data => {
    document.getElementById("menu-container").innerHTML = data;
    iniciarMenu();
});

function iniciarMenu() {

    const menuBtn = document.getElementById("menuBtn");
    const sideMenu = document.getElementById("sideMenu");

    const homeBtn = document.getElementById("homeBtn");
    const aboutBtn = document.getElementById("aboutBtn");

    const blueLightBtn = document.getElementById("blueLightBtn");
    const redLightBtn = document.getElementById("redLightBtn");

    const soundToggle = document.getElementById("soundToggle");

    // abrir/cerrar menú
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sideMenu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        sideMenu.classList.remove("open");
    });

    sideMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // inicio
    homeBtn.addEventListener("click", () => {
        sessionStorage.removeItem("returnToTV");
window.location.href = "index.html";
    });

    // sobre proyecto
    aboutBtn.addEventListener("click", () => {
        window.location.href = "informacion.html";
    });

    // luces (para THREE.js)
    blueLightBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("setLightBlue"));
    });

    redLightBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("setLightRed"));
    });

    // sonido
    soundToggle.addEventListener("change", (e) => {
        if (e.target.checked) {
            window.dispatchEvent(new CustomEvent("soundOn"));
        } else {
            window.dispatchEvent(new CustomEvent("soundOff"));
        }
    });
}