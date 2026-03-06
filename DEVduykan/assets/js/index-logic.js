import { db } from '../../firebase-config.js';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let movies = [];

async function load() {
    const snap = await getDocs(query(collection(db, 'movies'), orderBy('createdAt', 'desc')));
    movies = snap.docs.map(d => ({id: d.id, ...d.data()}));
    display(movies);
}

function display(data) {
    document.getElementById('movieGrid').innerHTML = data.map(m => `
        <div class="group cursor-pointer movie-item" data-id="${m.id}" data-ytid="${m.ytId}" data-title="${m.title}">
            <div class="relative aspect-[2/3] rounded-2xl overflow-hidden mb-2 border border-slate-800 group-hover:border-red-600 transition">
                <img src="${m.posterUrl}" class="w-full h-full object-cover transition duration-300 group-hover:scale-110">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><i class="fa-solid fa-play text-3xl text-red-600"></i></div>
            </div>
            <p class="text-sm font-bold truncate">${m.title}</p>
            <p class="text-[10px] text-slate-500 uppercase">${m.category} • <i class="fa-solid fa-eye"></i> ${m.viewCount || 0}</p>
        </div>
    `).join('');
}

async function openP(dbId, ytId, t) {
    document.getElementById('mTitle').innerText = t;
    document.getElementById('player').src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
    document.getElementById('modal').classList.remove('hidden');
    // อัปเดตยอดวิวใน Firestore
    await updateDoc(doc(db, 'movies', dbId), { viewCount: increment(1) });
}

function closeP() {
    document.getElementById('player').src = "";
    document.getElementById('modal').classList.add('hidden');
}

function filterCat(category, clickedButton) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active-cat'));
    clickedButton.classList.add('active-cat', 'bg-red-600');
    display(category === 'all' ? movies : movies.filter(m => m.category === category));
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    load();

    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterCat(e.currentTarget.dataset.category, e.currentTarget));
    });

    document.getElementById('movieGrid').addEventListener('click', (e) => {
        const item = e.target.closest('.movie-item');
        if (item) {
            openP(item.dataset.id, item.dataset.ytid, item.dataset.title);
        }
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeP);
});

document.getElementById('search').addEventListener('input', () => {
    const t = document.getElementById('search').value.toLowerCase();
    display(movies.filter(m => m.title.toLowerCase().includes(t)));
});
