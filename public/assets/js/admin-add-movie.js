// ===============================
// 🎬 ADMIN ADD MOVIE SCRIPT
// ===============================

// Check admin access function
function checkAdminAccess() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginTime = localStorage.getItem('loginTime');

    if (!isLoggedIn || !loginTime) {
        console.log('❌ Not logged in, redirecting to login');
        window.location.href = '/login.html';
        return false;
    }

    const timeDiff = Date.now() - parseInt(loginTime);
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
        console.log('⏰ Session expired, logging out');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        window.location.href = '/login.html';
        return false;
    }

    console.log('✅ Admin access confirmed');
    return true;
}

// Check if Firebase is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 Admin add movie page loaded');

    // Check admin access
    if (!checkAdminAccess()) {
        console.log('❌ No admin access, redirecting to login');
        return;
    }

    console.log('✅ Admin access confirmed');

    // Initialize form
    try {
        initializeForm();
        console.log('✅ Form initialized');
    } catch (error) {
        console.error('❌ Error initializing form:', error);
    }

    // Setup preview
    try {
        setupPreview();
        console.log('✅ Preview setup complete');
    } catch (error) {
        console.error('❌ Error setting up preview:', error);
    }

    // Setup form submission
    try {
        setupFormSubmission();
        console.log('✅ Form submission setup complete');
    } catch (error) {
        console.error('❌ Error setting up form submission:', error);
    }

    // Setup validation
    try {
        setupValidation();
        console.log('✅ Validation setup complete');
    } catch (error) {
        console.error('❌ Error setting up validation:', error);
    }

    // Setup AI fetch functionality
    try {
        setupMovieFetch();
        console.log('✅ Movie fetch setup complete');
    } catch (error) {
        console.error('❌ Error setting up movie fetch:', error);
    }

    console.log('🎉 Admin page fully initialized');
});

// ===============================
// INITIALIZE FORM
// ===============================
function initializeForm() {
    console.log('🔍 Initializing admin form...');

    const form = document.getElementById('addMovieForm');
    if (!form) {
        console.log('❌ Add movie form not found');
        return;
    }

    console.log('✅ Add movie form found');

    // Clear form button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('ต้องการล้างข้อมูลทั้งหมดหรือไม่?')) {
                form.reset();
                clearPreview();
                showToast('ล้างฟอร์มเรียบร้อย');
            }
        });
    }

    console.log('✅ Form initialized');
}

// ===============================
// SETUP PREVIEW
// ===============================
function setupPreview() {
    // Real-time preview
    const titleInput = document.getElementById('movieTitle');
    const yearInput = document.getElementById('movieYear');
    const categorySelect = document.getElementById('movieCategory');
    const qualitySelect = document.getElementById('movieQuality');
    const descriptionTextarea = document.getElementById('movieDescription');
    const posterUrlInput = document.getElementById('moviePoster');
    const videoUrlInput = document.getElementById('movieVideo');
    const trailerUrlInput = document.getElementById('movieTrailer');

    // Update preview on input
    [titleInput, yearInput, categorySelect, qualitySelect, descriptionTextarea].forEach(input => {
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });

    // Poster preview
    if (posterUrlInput) {
        posterUrlInput.addEventListener('input', () => {
            updatePosterPreview(posterUrlInput.value);
        });
    }

    // Video info preview
    if (videoUrlInput) {
        videoUrlInput.addEventListener('input', () => {
            updateVideoInfo(videoUrlInput.value);
        });
    }

    // Trailer preview
    if (trailerUrlInput) {
        trailerUrlInput.addEventListener('input', () => {
            updateTrailerInfo(trailerUrlInput.value);
        });
    }
}

// ===============================
// UPDATE PREVIEW
// ===============================
function updatePreview() {
    const title = document.getElementById('movieTitle')?.value || 'หนังใหม่';
    const year = document.getElementById('movieYear')?.value || '2024';
    const category = document.getElementById('movieCategory')?.value || 'action';
    const quality = document.getElementById('movieQuality')?.value || 'HD';
    const description = document.getElementById('movieDescription')?.value || 'คำอธิบายหนัง';

    // Update preview elements
    const previewTitle = document.getElementById('previewTitle');
    const previewYear = document.getElementById('previewYear');
    const previewCategory = document.getElementById('previewCategory');
    const previewQuality = document.getElementById('previewQuality');
    const previewDescription = document.getElementById('previewDescription');

    if (previewTitle) previewTitle.textContent = title;
    if (previewYear) previewYear.textContent = year;
    if (previewCategory) previewCategory.textContent = category;
    if (previewQuality) previewQuality.textContent = quality;
    if (previewDescription) previewDescription.textContent = description;
}

// ===============================
// UPDATE POSTER PREVIEW
// ===============================
function updatePosterPreview(url) {
    const previewImg = document.getElementById('posterPreviewImg');
    const posterPreview = document.getElementById('posterPreview');

    if (!url) {
        if (posterPreview) posterPreview.style.display = 'none';
        return;
    }

    if (previewImg) {
        previewImg.onload = () => {
            if (posterPreview) posterPreview.style.display = 'block';
        };
        previewImg.onerror = () => {
            if (posterPreview) posterPreview.style.display = 'none';
            showToast('โปสเตอร์ไม่สามารถโหลดได้', 'error');
        };
        previewImg.src = url;
    }
}

// ===============================
// UPDATE VIDEO INFO
// ===============================
function updateVideoInfo(url) {
    const videoInfo = document.getElementById('videoInfo');
    const videoType = document.getElementById('videoType');

    if (!url) {
        if (videoInfo) videoInfo.style.display = 'none';
        return;
    }

    let type = 'Unknown';
    if (url.includes('youtube') || url.includes('youtu.be')) {
        type = 'YouTube';
    } else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
        type = 'Direct Video';
    } else if (url.includes('drive.google.com')) {
        type = 'Google Drive';
    }

    if (videoType) videoType.textContent = type;
    if (videoInfo) videoInfo.style.display = 'block';
}

// ===============================
// UPDATE TRAILER INFO
// ===============================
function updateTrailerInfo(url) {
    const trailerInfo = document.getElementById('trailerInfo');
    const trailerType = document.getElementById('trailerType');

    if (!url) {
        if (trailerInfo) trailerInfo.style.display = 'none';
        return;
    }

    let type = 'Unknown';
    if (url.includes('youtube') || url.includes('youtu.be')) {
        type = 'YouTube';
    } else if (url.includes('.mp4') || url.includes('.webm')) {
        type = 'Direct Video';
    }

    if (trailerType) trailerType.textContent = type;
    if (trailerInfo) trailerInfo.style.display = 'block';
}

// ===============================
// SETUP FORM SUBMISSION
// ===============================
function setupFormSubmission() {
    const form = document.getElementById('addMovieForm');
    if (!form) {
        console.log('❌ Add movie form not found');
        return;
    }

    console.log('✅ Setting up form submission');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('🎯 Form submission started');

        // Show loading
        showLoading(true);

        try {
            // Get form data
            const formData = getFormData();

            console.log('📊 Form data received:', {
                hasTitle: !!formData.title,
                hasVideo: !!formData.video,
                hasPoster: !!formData.poster,
                hasCategory: !!formData.category
            });

            // Validate
            const validation = validateFormData(formData);
            if (!validation.valid) {
                console.log('❌ Validation failed:', validation.error);
                showToast(validation.error, 'error');
                return;
            }

            console.log('✅ Form validation passed');

            // Save to Firebase
            const result = await saveMovieToFirebase(formData);

            if (result.success) {
                console.log('✅ Movie saved successfully');

                // Success
                showToast('เพิ่มหนังสำเร็จ!', 'success');

                // Reset form
                form.reset();
                clearPreview();

                // Redirect to admin page
                setTimeout(() => {
                    console.log('🔄 Redirecting to admin page');
                    window.location.href = '/admin-add-movie.html';
                }, 2000);
            } else {
                throw new Error('ไม่สามารถบันทึกข้อมูลได้');
            }

        } catch (error) {
            console.error('❌ Error adding movie:', error);
            showToast('เกิดข้อผิดพลาด: ' + error.message, 'error');
        } finally {
            showLoading(false);
        }
    });
}

// ===============================
// GET FORM DATA
// ===============================
function getFormData() {
    console.log('🔍 Getting form data...');

    const data = {
        title: document.getElementById('movieTitle')?.value || '',
        category: document.getElementById('movieCategory')?.value || 'ทั่วไป',
        description: document.getElementById('movieDescription')?.value || '',
        poster: document.getElementById('moviePoster')?.value || '',
        videoUrl: document.getElementById('movieVideoUrl')?.value || '',
        badge: document.getElementById('movieBadge')?.value || 'ทั่วไป',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        views: 0
    };

    console.log('📊 Form data collected:', {
        title: data.title,
        category: data.category,
        badge: data.badge,
        hasVideo: !!data.videoUrl,
        hasPoster: !!data.poster
    });

    return data;
}

// ===============================
// VALIDATE FORM DATA
// ===============================
function validateFormData(data) {
    if (!data.title.trim()) {
        return { valid: false, error: 'กรุณากรอกชื่อเรื่อง' };
    }

    if (!data.videoUrl.trim()) {
        return { valid: false, error: 'กรุณากรอกลิงก์วิดีโอ' };
    }

    if (!data.poster.trim()) {
        return { valid: false, error: 'กรุณากรอกลิงก์โปสเตอร์' };
    }

    if (!data.category) {
        return { valid: false, error: 'กรุณาเลือกหมวดหมู่' };
    }

    // Validate URL format
    try {
        new URL(data.videoUrl);
        new URL(data.poster);
    } catch {
        return { valid: false, error: 'URL ไม่ถูกต้อง' };
    }

    return { valid: true };
}

// ===============================
// SAVE MOVIE TO FIREBASE
// ===============================
async function saveMovieToFirebase(data) {
    console.log('🔍 Saving movie to Firebase...');

    try {
        // Check if Firebase is initialized
        if (!firebase || !firebase.firestore) {
            throw new Error('Firebase ยังไม่พร้อมใช้งาน');
        }

        const db = firebase.firestore();
        const movieRef = db.collection('movies');

        console.log('📊 Saving data:', {
            title: data.title,
            category: data.category,
            hasPoster: !!data.poster,
            hasVideo: !!data.video
        });

        // Add document
        const docRef = await movieRef.add(data);

        console.log('✅ Movie saved successfully with ID:', docRef.id);

        return {
            success: true,
            id: docRef.id
        };

    } catch (error) {
        console.error('❌ Error saving movie to Firebase:', error);

        // ตรวจสอบประเภทข้อผิดพลาด
        let errorMessage = 'เกิดข้อผิดพลาดในการบันทึก';

        if (error.code === 'permission-denied') {
            errorMessage = 'ไม่มีสิทธิ์ในการบันทึกข้อมูล';
        } else if (error.code === 'unavailable') {
            errorMessage = 'การเชื่อมต่อล้มเหลว กรุณาลองใหม่';
        } else if (error.code === 'unauthenticated') {
            errorMessage = 'ต้องล็อกอินก่อนบันทึกข้อมูล';
        } else if (error.message) {
            errorMessage = error.message;
        }

        throw new Error(errorMessage);
    }
}

// ===============================
// SETUP IMAGE UPLOAD
// ===============================
function setupImageUpload() {
    const posterInput = document.getElementById('moviePoster');
    const posterPreview = document.getElementById('posterPreview');

    if (posterInput && posterPreview) {
        posterInput.addEventListener('input', (e) => {
            const url = e.target.value;
            if (url) {
                posterPreview.innerHTML = `
                    <img src="${url}" alt="Poster Preview" style="max-width: 200px; max-height: 300px; object-fit: cover; border-radius: 8px;">
                `;
                posterPreview.style.display = 'block';
            } else {
                posterPreview.style.display = 'none';
            }
        });
    }
}

// ===============================
// SETUP VALIDATION
// ===============================
function setupValidation() {
    const form = document.getElementById('addMovieForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// ===============================
// VALIDATE FIELD
// ===============================
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'กรุณากรอกข้อมูลนี้';
    }

    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            isValid = false;
            message = 'URL ไม่ถูกต้อง';
        }
    }

    // Update UI
    if (isValid) {
        field.classList.remove('error');
        field.classList.add('valid');
        removeFieldError(field);
    } else {
        field.classList.remove('valid');
        field.classList.add('error');
        showFieldError(field, message);
    }

    return isValid;
}

// ===============================
// SHOW FIELD ERROR
// ===============================
function showFieldError(field, message) {
    removeFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e50914';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';

    field.parentNode.appendChild(errorDiv);
}

// ===============================
// REMOVE FIELD ERROR
// ===============================
function removeFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ===============================
// CLEAR PREVIEW
// ===============================
function clearPreview() {
    const previewImg = document.getElementById('posterPreviewImg');
    const posterPreview = document.getElementById('posterPreview');
    const videoInfo = document.getElementById('videoInfo');
    const trailerInfo = document.getElementById('trailerInfo');

    if (previewImg) previewImg.src = '';
    if (posterPreview) posterPreview.style.display = 'none';
    if (videoInfo) videoInfo.style.display = 'none';
    if (trailerInfo) trailerInfo.style.display = 'none';

    // Reset preview text
    const elements = ['previewTitle', 'previewYear', 'previewCategory', 'previewQuality', 'previewDescription'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = '';
    });
}

// ===============================
// SETUP MOVIE FETCH
// ===============================
function setupMovieFetch() {
    console.log('🔍 Setting up movie fetch functionality...');

    const sourceUrlInput = document.getElementById('movieSourceUrl');
    const fetchBtn = document.getElementById('fetchMovieBtn');
    const fetchStatus = document.getElementById('fetchStatus');

    if (!sourceUrlInput || !fetchBtn || !fetchStatus) {
        console.log('❌ Movie fetch elements not found');
        return;
    }

    console.log('✅ Movie fetch elements found');

    fetchBtn.addEventListener('click', async () => {
        const sourceUrl = sourceUrlInput.value.trim();

        if (!sourceUrl) {
            showFetchStatus('error', 'กรุณาใส่ลิงก์หนัง');
            return;
        }

        if (!isValidUrl(sourceUrl)) {
            showFetchStatus('error', 'ลิงก์ไม่ถูกต้อง');
            return;
        }

        console.log('🔍 Fetching movie data from:', sourceUrl);
        console.log('🔍 Calling fetchMovieData...');
        showFetchStatus('loading', 'กำลังดึงข้อมูล...');

        try {
            // จำลองการดึงข้อมูล (ในสถานการณ์จริงต้องใช้ API หรือ web scraping)
            const movieData = await fetchMovieData(sourceUrl);

            console.log('📊 Movie data received:', movieData);

            if (movieData) {
                console.log('🔍 Filling form with fetched data...');
                // กรอกข้อมูลที่ดึงได้ลงในฟอร์ม
                fillFormData(movieData);
                showFetchStatus('success', 'ดึงข้อมูลสำเร็จ!');
                console.log('✅ Movie data fetched and filled successfully');
            } else {
                console.log('❌ No movie data received');
                showFetchStatus('error', 'ไม่สามารถดึงข้อมูลได้');
            }
        } catch (error) {
            console.error('❌ Error fetching movie data:', error);
            showFetchStatus('error', 'เกิดข้อผิดพลาด: ' + error.message);
        }
    });
}

// FETCH MOVIE DATA
// ===============================
async function fetchMovieData(url) {
    console.log('🔍 Simulating movie data fetch from:', url);

    // จำลองการดึงข้อมูล (ในสถานการณ์จริงต้องใช้ API หรือ web scraping)
    // นี่คือตัวอย่างข้อมูลที่อาจได้จากการดึงข้อมูล
    // โครงสร้างข้อมูลจริงจาก Firebase:
    // - title (string)
    // - category (string) - "ทั่วไป"
    // - description (string)
    // - poster (string) - YouTube thumbnail URL
    // - videoUrl (string) - YouTube embed URL
    // - badge (string) - "ทั่วไป"
    // - createdAt (timestamp)
    // - updatedAt (timestamp)
    // - views (number)

    // ตรวจสอบว่าเป็นลิงก์หนังที่รู้จักหรือไม่
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // ดึงข้อมูลจาก YouTube
        const videoId = extractYouTubeId(url);
        return {
            title: extractTitleFromUrl(url),
            category: 'ทั่วไป',
            description: extractDescriptionFromUrl(url),
            poster: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            videoUrl: url.includes('embed') ? url : `https://www.youtube.com/embed/${videoId}`,
            badge: 'ทั่วไป'
        };
    }

    // สำหรับลิงก์อื่นๆ ให้สร้างข้อมูลตัวอย่าง
    return {
        title: generateTitleFromUrl(url),
        category: 'ทั่วไป',
        description: 'ดึงข้อมูลจากลิงก์สำเร็จ กรุณาแก้ไขข้อมูลตามต้องการ',
        poster: generatePosterUrl(url),
        videoUrl: url,
        badge: 'ทั่วไป'
    };
}

// ===============================
// YOUTUBE HELPER
// ===============================
function extractYouTubeId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : 'default';
}

// ===============================
// HELPER FUNCTIONS
// ===============================
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function extractTitleFromUrl(url) {
    // จำลองการดึงชื่อจาก URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    const title = lastPart.replace(/[-_]/g, ' ').replace(/\.(html|php|com)/g, '');
    return title || 'หนังใหม่';
}

function generateTitleFromUrl(url) {
    const domain = new URL(url).hostname;
    return `หนังจาก ${domain}`;
}

function extractDescriptionFromUrl(url) {
    return 'ดึงข้อมูลจากลิงก์สำเร็จ นี่คือคำอธิบายตัวอย่าง กรุณาแก้ไขตามความเหมาะสม';
}

function generatePosterUrl(url) {
    // สร้าง URL โปสเตอร์ตัวอย่าง
    const hash = btoa(url).substring(0, 8);
    return `https://picsum.photos/seed/${hash}/300/450.jpg`;
}

function extractVideoUrl(url) {
    // ในสถานการณ์จริงต้องดึง URL วิดีโอจากหน้านั้นๆ
    return url;
}

function extractTrailerUrl(url) {
    // ในสถานการณ์จริงต้องดึง URL ตัวอย่างจากหน้านั้นๆ
    return '';
}

function fillFormData(data) {
    console.log('🔍 Filling form with data:', data);

    // กรอกข้อมูลที่ดึงได้ลงในฟอร์ม
    const titleInput = document.getElementById('movieTitle');
    const categorySelect = document.getElementById('movieCategory');
    const descriptionTextarea = document.getElementById('movieDescription');
    const posterInput = document.getElementById('moviePoster');
    const videoUrlInput = document.getElementById('movieVideoUrl');
    const badgeSelect = document.getElementById('movieBadge');

    console.log('🔍 Form elements found:', {
        titleInput: !!titleInput,
        categorySelect: !!categorySelect,
        descriptionTextarea: !!descriptionTextarea,
        posterInput: !!posterInput,
        videoUrlInput: !!videoUrlInput,
        badgeSelect: !!badgeSelect
    });

    // กรอกข้อมูลทีละช่องพร้อม debug
    if (titleInput && data.title) {
        titleInput.value = data.title;
        console.log('✅ Title filled:', data.title);
    } else {
        console.log('❌ Title not filled - Input:', !!titleInput, 'Data:', !!data.title);
    }

    if (categorySelect && data.category) {
        categorySelect.value = data.category;
        console.log('✅ Category filled:', data.category);
    } else {
        console.log('❌ Category not filled - Input:', !!categorySelect, 'Data:', !!data.category);
    }

    if (descriptionTextarea && data.description) {
        descriptionTextarea.value = data.description;
        console.log('✅ Description filled');
    } else {
        console.log('❌ Description not filled - Input:', !!descriptionTextarea, 'Data:', !!data.description);
    }

    if (posterInput && data.poster) {
        posterInput.value = data.poster;
        console.log('✅ Poster filled');
    } else {
        console.log('❌ Poster not filled - Input:', !!posterInput, 'Data:', !!data.poster);
    }

    if (videoUrlInput && data.videoUrl) {
        videoUrlInput.value = data.videoUrl;
        console.log('✅ Video URL filled');
    } else {
        console.log('❌ Video URL not filled - Input:', !!videoUrlInput, 'Data:', !!data.videoUrl);
    }

    if (badgeSelect && data.badge) {
        badgeSelect.value = data.badge;
        console.log('✅ Badge filled:', data.badge);
    } else {
        console.log('❌ Badge not filled - Input:', !!badgeSelect, 'Data:', !!data.badge);
    }

    // อัปเดตพรีวิว
    try {
        updatePreview();
        console.log('✅ Preview updated');
    } catch (error) {
        console.error('❌ Error updating preview:', error);
    }

    console.log('🎉 Form filling completed');
}

function showFetchStatus(type, message) {
    const fetchStatus = document.getElementById('fetchStatus');
    if (!fetchStatus) return;

    fetchStatus.className = `fetch-status ${type}`;
    fetchStatus.style.display = 'flex';

    let icon = '';
    switch (type) {
        case 'loading':
            icon = '<i class="fas fa-spinner fa-spin"></i>';
            break;
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
    }

    fetchStatus.innerHTML = `${icon} ${message}`;

    // ซ่อนข้อความหลัง 5 วินาที
    if (type !== 'loading') {
        setTimeout(() => {
            fetchStatus.style.display = 'none';
        }, 5000);
    }
}
function showLoading(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const loadingText = document.getElementById('loadingText');

    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.textContent = show ? 'กำลังบันทึก...' : 'เพิ่มหนัง';
    }

    if (loadingText) {
        loadingText.style.display = show ? 'block' : 'none';
    }
}

// ===============================
// SHOW TOAST
// ===============================
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            toast.style.background = '#28a745';
            break;
        case 'error':
            toast.style.background = '#dc3545';
            break;
        default:
            toast.style.background = '#007bff';
    }

    // Add to DOM
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
const posterInput = document.getElementById('moviePoster');

// Update preview on input
titleInput?.addEventListener('input', updatePreview);
yearInput?.addEventListener('input', updatePreview);
categorySelect?.addEventListener('change', updatePreview);
qualitySelect?.addEventListener('change', updatePreview);
descriptionTextarea?.addEventListener('input', updatePreview);
posterInput?.addEventListener('input', updatePreview);

console.log('✅ Preview setup complete');
}

// ===============================
// UPDATE PREVIEW
// ===============================
function updatePreview() {
    const title = document.getElementById('movieTitle').value || 'ชื่อหนังจะแสดงที่นี่';
    const year = document.getElementById('movieYear').value || 'ปี';
    const category = document.getElementById('movieCategory').value || 'หมวดหมู่';
    const quality = document.getElementById('movieQuality').value || 'HD';
    const description = document.getElementById('movieDescription').value || 'คำอธิบายจะแสดงที่นี่...';
    const poster = document.getElementById('moviePoster').value;

    // Update preview elements
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewYear').textContent = year;
    document.getElementById('previewCategory').textContent = getCategoryName(category);
    document.getElementById('previewQuality').textContent = quality;
    document.getElementById('previewDescription').textContent = description;

    // Update poster
    const previewPoster = document.getElementById('previewPoster');
    if (poster && isValidUrl(poster)) {
        previewPoster.src = poster;
        previewPoster.onerror = () => {
            previewPoster.src = '/img/default.jpg';
        };
    } else {
        previewPoster.src = '/img/default.jpg';
    }
}

// ===============================
// SETUP FORM SUBMISSION
// ===============================
function setupFormSubmission() {
    const form = document.getElementById('addMovieForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Get form data
        const formData = getFormData();

        // Show loading
        showLoading(true);

        try {
            // Save to Firestore
            await saveMovieToFirestore(formData);

            // Show success
            showToast('เพิ่มหนังสำเร็จแล้ว!');

            // Reset form
            form.reset();
            clearPreview();

            // Redirect after delay
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            console.error('❌ Error saving movie:', error);
            showToast('เกิดข้อผิดพลาด: ' + error.message);
        } finally {
            showLoading(false);
        }
    });
}

// ===============================
// VALIDATE FORM
// ===============================
function validateForm() {
    const title = document.getElementById('movieTitle').value.trim();
    const year = document.getElementById('movieYear').value;
    const category = document.getElementById('movieCategory').value;
    const poster = document.getElementById('moviePoster').value.trim();
    const videoUrl = document.getElementById('movieVideoUrl').value.trim();

    if (!title) {
        showToast('กรุณากรอกชื่อหนัง');
        return false;
    }

    if (!year || year < 1900 || year > 2030) {
        showToast('กรุณากรอกปีที่ถูกต้อง (1900-2030)');
        return false;
    }

    if (!category) {
        showToast('กรุณาเลือกหมวดหมู่');
        return false;
    }

    if (!poster) {
        showToast('กรุณาใส่ลิงก์โปสเตอร์');
        return false;
    }

    if (!isValidUrl(poster)) {
        showToast('ลิงก์โปสเตอร์ไม่ถูกต้อง');
        return false;
    }

    if (!videoUrl) {
        showToast('กรุณาใส่ลิงก์วิดีโอ');
        return false;
    }

    if (!isValidUrl(videoUrl)) {
        showToast('ลิงก์วิดีโอไม่ถูกต้อง');
        return false;
    }

    return true;
}

// ===============================
// GET FORM DATA
// ===============================
function getFormData() {
    return {
        title: document.getElementById('movieTitle').value.trim(),
        year: parseInt(document.getElementById('movieYear').value),
        category: document.getElementById('movieCategory').value,
        quality: document.getElementById('movieQuality').value,
        description: document.getElementById('movieDescription').value.trim(),
        poster: document.getElementById('moviePoster').value.trim(),
        videoUrl: document.getElementById('movieVideoUrl').value.trim(),
        trailerUrl: document.getElementById('movieTrailerUrl').value.trim(),
        type: 'movie', // Default type
        views: 0, // Default views
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// ===============================
// SAVE TO FIRESTORE
// ===============================
async function saveMovieToFirestore(movieData) {
    if (!window.firebase || !window.firebase.firestore) {
        throw new Error('Firebase ไม่พร้อมใช้งาน');
    }

    const db = firebase.firestore();

    // Add document to movies collection
    const docRef = await db.collection('movies').add(movieData);

    console.log('✅ Movie saved with ID:', docRef.id);
    return docRef.id;
}

// ===============================
// HELPER FUNCTIONS
// ===============================
function getCategoryName(category) {
    const categories = {
        'action': 'แอคชัน',
        'comedy': 'ตลก',
        'drama': 'ดราม่า',
        'horror': 'สยองขวัญ',
        'romance': 'โรแมนติก',
        'sci-fi': 'ไซไฟ',
        'thriller': 'ระทึกขวัญ',
        'animation': 'การ์ตูน'
    };
    return categories[category] || category;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function clearPreview() {
    document.getElementById('previewTitle').textContent = 'ชื่อหนังจะแสดงที่นี่';
    document.getElementById('previewYear').textContent = 'ปี';
    document.getElementById('previewCategory').textContent = 'หมวดหมู่';
    document.getElementById('previewQuality').textContent = 'HD';
    document.getElementById('previewDescription').textContent = 'คำอธิบายจะแสดงที่นี่...';
    document.getElementById('previewPoster').src = '/img/default.jpg';
}

function showLoading(show) {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (show) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังบันทึก...';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> บันทึกหนัง';
    }
}

function showToast(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <i class="fas fa-${message.includes('สำเร็จ') ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;

    // Add to page
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===============================
// SECURITY CHECK
// ===============================
// Simple password protection (optional)
function checkAdminAccess() {
    const password = prompt('กรุณาใส่รหัสผ่านแอดมิน:');
    if (password !== 'duydoe123') {
        alert('รหัสผ่านไม่ถูกต้อง!');
        window.location.href = '/';
        return false;
    }
    return true;
}

// Uncomment to enable password protection
// if (!checkAdminAccess()) {
//     throw new Error('Access denied');
// }
