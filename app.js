/**
 * Inisialisasi Supabase
 */
const supabaseClient = supabase.createClient(
    'https://xgmsumukxuwjpztbeuwl.supabase.co/rest/v1', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnbXN1bXVreHV3anB6dGJldXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTE1MzYsImV4cCI6MjA5NTQyNzUzNn0.25t9t71O0O2D11l7GRXtpvOgC2sllXE3xB4nsRKK4oE'
);

// Variabel Utama
let allVideos = [];
let currentPage = 1;
const itemsPerPage = 3;

/**
 * Logika Tab Terbalik (Tab Baru = Modal, Tab Lama = Iklan)
 */
function handlePlay(id, type, url) {
    const urlIklan = 'https://braverybreezebinding.com/dyu6kzr44?key=703bc4908bfdd21b148e4fe03f9810cb';
    
    // 1. Buka Tab Baru berisi Modal
    const modalWindow = window.open(window.location.origin + window.location.pathname + '?play=' + id, '_blank');
    
    // 2. Tab Lama diarahkan ke Iklan
    window.location.replace(urlIklan);
}

/**
 * Mengambil data berdasarkan Slug
 */
async function fetchAndRenderVideos() {
    // Logika deteksi Slug (dari /d/slug atau ?id=slug)
    const urlParams = new URLSearchParams(window.location.search);
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const slug = pathParts.includes('d') ? pathParts[pathParts.indexOf('d') + 1] : urlParams.get('id');

    if (!slug) {
        console.error("Slug tidak ditemukan.");
        return;
    }

    // Mengambil data spesifik berdasarkan slug
    const { data, error } = await supabaseClient
        .from('videos_list')
        .select('*')
        .eq('slug', slug)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Gagal mengambil data:", error);
        return;
    }
    
    allVideos = data || [];
    renderPage();
}

/**
 * Render Daftar File & Paginasi
 */
function renderPage() {
    const container = document.getElementById('file-list-container');
    container.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = allVideos.slice(start, start + itemsPerPage);

    paginatedItems.forEach(video => {
        const type = video.url.includes('embed') ? 'embed' : 'mp4';
        const row = document.createElement('div');
        row.className = "flex items-center gap-6 p-5 border-b border-gray-700 hover:bg-gray-800 transition";
        row.innerHTML = `
            <div class="bg-black rounded-lg border-2 border-gray-600 cursor-pointer overflow-hidden flex items-center justify-center shrink-0 shadow-xl" 
                 style="width: 180px; height: 135px;" onclick="handlePlay('${video.id}', '${type}', '${video.url}')">
                 <video src="${video.url}" class="w-full h-full" style="object-fit: contain;"></video>
            </div>
            <div class="flex-1">
                <span class="block text-lg text-gray-100 font-semibold truncate">${video.name}</span>
                <span class="text-xs text-gray-500">${new Date(video.created_at).toLocaleDateString()}</span>
            </div>
            <button onclick="handlePlay('${video.id}', '${type}', '${video.url}')" class="text-blue-400 hover:text-white text-2xl pr-4"><i class="fas fa-play-circle"></i></button>
        `;
        container.appendChild(row);
    });

    renderPagination();

    // Otomatis buka modal jika ada parameter ?play=ID
    const params = new URLSearchParams(window.location.search);
    const playId = params.get('play');
    if (playId) {
        const video = allVideos.find(v => v.id == playId);
        if (video) showVideoModal(video.url, video.url.includes('embed') ? 'embed' : 'mp4');
    }
}

// (Fungsi renderPagination dan showVideoModal tetap sama seperti kode Anda sebelumnya)
function renderPagination() { /* ... kode pagination Anda ... */ }
function showVideoModal(url, type) { /* ... kode modal Anda ... */ }

document.addEventListener('DOMContentLoaded', fetchAndRenderVideos);
