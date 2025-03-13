const apiKey = "csI32sVc583GPtovEETBf0Eb3BB7YeEVaZldVshFO2RH7RiBfeUyJPQI";
const btnBuscar = document.getElementById("btn-buscar");
const inputBusqueda = document.getElementById("caja");
const galeria = document.getElementById("galeria");
const favoritosContenedor = document.getElementById("favoritos-contenedor");

document.addEventListener("DOMContentLoaded", mostrarFavoritos);

btnBuscar.addEventListener("click", () => {
    const query = inputBusqueda.value.trim();
    if (query) {
        buscarImagenes(query);
    } else {
        alert("Por favor, ingresa una búsqueda.");
    }
});

async function buscarImagenes(query) {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=10`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: apiKey }
        });

        if (!response.ok) throw new Error("Error al obtener imágenes");

        const data = await response.json();
        mostrarImagenes(data.photos);
    } catch (error) {
        console.error("Error:", error);
        galeria.innerHTML = "<p>No se encontraron imágenes.</p>";
    }
}

function mostrarImagenes(photos) {
    galeria.innerHTML = "";

    photos.forEach(photo => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("imagen");

        const img = document.createElement("img");
        img.src = photo.src.medium;
        img.alt = photo.photographer;

        const btnDescargar = document.createElement("button");
        btnDescargar.innerText = "⬇️ Descargar";
        btnDescargar.classList.add("btn-descargar");
        btnDescargar.addEventListener("click", () => descargarImagen(photo.src.original));

        const btnFavorito = document.createElement("button");
        btnFavorito.innerText = "⭐ Favorito";
        btnFavorito.classList.add("btn-favorito");
        btnFavorito.addEventListener("click", () => agregarAFavoritos(photo));

        imgContainer.appendChild(img);
        imgContainer.appendChild(btnDescargar);
        imgContainer.appendChild(btnFavorito);
        galeria.appendChild(imgContainer);
    });
}

function descargarImagen(url) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const enlace = document.createElement("a");
            enlace.href = URL.createObjectURL(blob);
            enlace.download = "imagen.jpg";
            enlace.click();
        })
        .catch(error => console.error("Error al descargar la imagen:", error));
}

function agregarAFavoritos(photo) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    
    if (!favoritos.some(img => img.id === photo.id)) {
        favoritos.push(photo);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        mostrarFavoritos();
        mostrarNotificacion();
    }
}

function mostrarFavoritos() {
    favoritosContenedor.innerHTML = "";
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

    if (favoritos.length === 0) {
        favoritosContenedor.innerHTML = "<p>No hay imágenes en favoritos.</p>";
        return;
    }

    favoritos.forEach(photo => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("imagen");

        const img = document.createElement("img");
        img.src = photo.src.medium;
        img.alt = photo.photographer;

        const btnDescargar = document.createElement("button");
        btnDescargar.innerText = "⬇️ Descargar";
        btnDescargar.classList.add("btn-descargar");
        btnDescargar.addEventListener("click", () => descargarImagen(photo.src.original));

        const btnEliminar = document.createElement("button");
        btnEliminar.innerText = "Quitar";
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.addEventListener("click", () => eliminarDeFavoritos(photo.id));

        imgContainer.appendChild(img);
        imgContainer.appendChild(btnDescargar);
        imgContainer.appendChild(btnEliminar);
        favoritosContenedor.appendChild(imgContainer);
    });
}

function eliminarDeFavoritos(id) {
    let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos = favoritos.filter(img => img.id !== id);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
}

function mostrarNotificacion() {
    const notificacion = document.getElementById("notificacion");
    notificacion.classList.add("show");

    setTimeout(() => {
        notificacion.classList.remove("show");
    }, 3000);
}
