import { db, auth } from '../../firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const movieForm = document.getElementById('movieForm');
const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');
const editIdField = document.getElementById('editId');

let movies = [];

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('adminPanel').classList.remove('hidden');
        load();
    } else {
        window.location.replace("/admin/login");
    }
});

// ฟังก์ชันป้องกัน XSS (Cross-Site Scripting)
function escapeHtml(text) {
    if (!text) return text;
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

movieForm.onsubmit = async (e) => {
    e.preventDefault();
    saveButton.disabled = true;
    const originalBtnText = saveButton.textContent;
    saveButton.textContent = 'กำลังบันทึก...';

    const yt = document.getElementById('ytId').value;
    const movieData = {
        title: document.getElementById('title').value,
        ytId: yt,
        category: document.getElementById('category').value,
        posterUrl: document.getElementById('posterUrl').value || `https://img.youtube.com/vi/${yt}/maxresdefault.jpg`,
    };

    const editId = editIdField.value;
    try {
        if (editId) {
            await updateDoc(doc(db, 'movies', editId), movieData);
            const movieIndex = movies.findIndex(m => m.id === editId);
            if (movieIndex > -1) {
                movies[movieIndex] = { ...movies[movieIndex], ...movieData };
            }
            alert("อัปเดตสำเร็จ!");
        } else {
            movieData.viewCount = 0;
            movieData.createdAt = serverTimestamp();
            const docRef = await addDoc(collection(db, 'movies'), movieData);
            movies.unshift({ id: docRef.id, ...movieData, createdAt: { toDate: () => new Date() } });
            alert("บันทึกสำเร็จ!");
        }
    
        resetForm();
        renderList();
    } catch (error) {
        console.error("Error saving:", error);
        alert("เกิดข้อผิดพลาด: " + error.message);
        saveButton.disabled = false;
        saveButton.textContent = originalBtnText;
    }
};

function resetForm() {
    movieForm.reset();
    editIdField.value = '';
    saveButton.textContent = 'เพิ่มวิดีโอ';
    saveButton.disabled = false;
    cancelButton.classList.add('hidden');
}

cancelButton.addEventListener('click', resetForm);

async function load() {
    try {
        const snap = await getDocs(query(collection(db, 'movies'), orderBy('createdAt', 'desc')));
        movies = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderList();
    } catch (error) {
        console.error("Error loading:", error);
        alert("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่");
    }
}

function renderList() {
    document.getElementById('list').innerHTML = movies.map(m => `
        <div class="bg-slate-950 p-3 rounded-xl flex justify-between items-center border border-transparent hover:border-slate-700 transition group">
            <div class="flex items-center gap-4 overflow-hidden">
                <img src="${escapeHtml(m.posterUrl)}" class="w-9 h-12 object-cover rounded-md flex-shrink-0">
                <div class="overflow-hidden">
                    <p class="font-bold text-sm truncate">${escapeHtml(m.title)}</p>
                    <p class="text-[10px] text-slate-500">${escapeHtml(m.category)}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button data-id="${m.id}" class="edit-btn text-slate-500 hover:text-sky-400 px-3 py-2 rounded-lg transition"><i class="fa-solid fa-pencil"></i></button>
                <button data-id="${m.id}" class="del-btn text-slate-500 hover:text-red-500 px-3 py-2 rounded-lg transition"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

document.getElementById('list').addEventListener('click', async (e) => {
    const delButton = e.target.closest('.del-btn');
    const editButton = e.target.closest('.edit-btn');

    if (delButton) {
        const movieId = delButton.dataset.id;
        if (confirm('ยืนยันการลบ?')) {
            try {
                await deleteDoc(doc(db, 'movies', movieId));
                movies = movies.filter(m => m.id !== movieId);
                renderList();
            } catch (error) {
                console.error("Error deleting document: ", error);
                alert("เกิดข้อผิดพลาดในการลบ");
            }
        }
    }

    if (editButton) {
        const movieId = editButton.dataset.id;
        const movieToEdit = movies.find(m => m.id === movieId);
        if (!movieToEdit) return;

        editIdField.value = movieToEdit.id;
        document.getElementById('title').value = movieToEdit.title;
        document.getElementById('ytId').value = movieToEdit.ytId;
        document.getElementById('category').value = movieToEdit.category;
        document.getElementById('posterUrl').value = movieToEdit.posterUrl.startsWith('https://img.youtube.com') ? '' : movieToEdit.posterUrl;

        saveButton.textContent = 'อัปเดตข้อมูล';
        cancelButton.classList.remove('hidden');
        window.scrollTo(0, 0);
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(auth);
});
