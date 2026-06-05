// 1. Configuración de Temas de Tailwind CSS
tailwind.config = {
    theme: {
        extend: {
            colors: {
                brand: '#F79131',   // Naranja
                dark: '#7A2C8E',    // Morado
                accent: '#4DB748',  // Verde claro
            }
        }
    }
};

// 2. Cuenta Regresiva (Timer)
const targetDate = new Date("June 14, 2026 23:59:59").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "<span class='text-sm uppercase font-sans'>¡Inscripciones Cerradas!</span>";
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d < 10 ? "0" + d : d;
    document.getElementById("hours").innerText = h < 10 ? "0" + h : h;
    document.getElementById("minutes").innerText = m < 10 ? "0" + m : m;
    document.getElementById("seconds").innerText = s < 10 ? "0" + s : s;
}, 1000);


// 3. Integración con Google Sheets para Galería de Videos
const SHEET_ID = '1zC2Fuzg4avjnql-gENAb-qqXZgoZxsJJIV0gihzCbtA';
const SHEET_NAME = 'Hoja 1'; 
const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

fetch(URL)
    .then(res => res.text())
    .then(data => {
        // Formatear la respuesta string-JSON de Google API
        const json = JSON.parse(data.substr(47).slice(0, -2));
        const rows = json.table.rows;
        const contenedor = document.getElementById('contenedor-videos');
        contenedor.innerHTML = ''; 

        // Omitir cabecera y renderizar filas
        rows.slice(1).forEach(row => {
            const idVideo = row.c[0].v;
            const titulo = row.c[1] ? row.c[1].v : "Sin título";
            const descripcion = row.c[2] ? row.c[2].v : "";

            const thumbHD = `https://img.youtube.com/vi/${idVideo}/maxresdefault.jpg`;
            const thumbSD = `https://img.youtube.com/vi/${idVideo}/hqdefault.jpg`;

            const card = `
                <div class="bg-white rounded-2xl shadow-xl hover:scale-105 transition transform border-t-4 border-accent overflow-hidden flex flex-col">
                    <div class="aspect-video relative group cursor-pointer bg-black overflow-hidden" 
                        id="container-${idVideo}"
                        onclick="loadVideo('${idVideo}')">
                        
                        <img src="${thumbSD}" 
                            onerror="this.src='${thumbHD}'" 
                            alt="${titulo}" 
                            class="w-full h-full object-cover object-center transform scale-[1.02] transition">
                        
                        <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition">
                            <div class="bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition transform">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 ml-0.5">
                                    <path fill-rule="evenodd" d="M4.5 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 flex-grow">
                        <h3 class="text-xl font-bold mb-2 text-dark">${titulo}</h3>
                        <p class="text-slate-600 text-sm leading-relaxed">${descripcion}</p>
                    </div>
                </div>
            `;
            contenedor.innerHTML += card;
        });
    })
    .catch(err => {
        console.error(err);
        document.getElementById('contenedor-videos').innerHTML = '<p class="text-red-500 text-center col-span-full">Error al cargar los videos.</p>';
    });

// 4. Función global para reproducir los vídeos en iFrame al hacer clic
function loadVideo(id) {
    const container = document.getElementById(`container-${id}`);
    container.innerHTML = `
        <iframe 
            class="w-full h-full" 
            src="https://www.youtube.com/embed/${id}?autoplay=1" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>`;
}