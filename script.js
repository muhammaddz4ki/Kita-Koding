/* Menunggu hingga seluruh konten HTML (DOM) selesai dimuat */
document.addEventListener('DOMContentLoaded', function() {

    // --- FITUR 1: NAVIGASI HAMBURGER (HP) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Toggle kelas 'active' untuk memunculkan/menyembunyikan menu
            navMenu.classList.toggle('active');
        });
    }
    
    // Menutup menu jika salah satu link diklik (untuk pindah section)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // --- FITUR 2: MODAL (POP-UP) GABUNG SEKARANG ---
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalOverlay = document.getElementById('gabung-modal');

    if (openModalBtn && closeModalBtn && modalOverlay) {
        // Buka Modal
        openModalBtn.addEventListener('click', () => {
            modalOverlay.classList.add('show');
        });

        // Tutup Modal (via tombol X)
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('show');
        });

        // Tutup Modal (via klik di luar area konten)
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('show');
            }
        });
    }

    // --- FITUR 3: LOAD EVENT SECARA DINAMIS DARI data.json ---
    const eventListContainer = document.getElementById('event-list-container');

    // Buat fungsi 'async' untuk mengambil data
    async function loadEvents() {
        // Hanya jalankan jika container event-nya ada di halaman ini
        if (!eventListContainer) {
            return; 
        }

        try {
            // 1. Ambil data dari file data.json
            const response = await fetch('data.json');
            
            // 2. Cek jika pengambilan gagal
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // 3. Ubah data mentah menjadi format JSON
            const events = await response.json();

            // 4. Kosongkan isi container (hapus "Memuat event...")
            eventListContainer.innerHTML = '';

            // 5. Loop setiap event dan buat HTML-nya
            events.forEach(event => {
                const eventItemHTML = `
                    <div class="event-item">
                        <div class="event-date">
                            <span class="tanggal">${event.tanggal}</span>
                            <span class="bulan">${event.bulan}</span>
                        </div>
                        <div class="event-info">
                            <h3>${event.judul}</h3>
                            <p>${event.deskripsi}</p>
                        </div>
                    </div>
                `;
                // 6. Masukkan HTML baru ke dalam container
                eventListContainer.insertAdjacentHTML('beforeend', eventItemHTML);
            });

        } catch (error) {
            // 7. Tampilkan pesan error jika gagal load
            console.error("Gagal memuat event:", error);
            eventListContainer.innerHTML = '<p style="text-align: center; color: red;">Maaf, gagal memuat event saat ini.</p>';
        }
    }

    // Panggil fungsi untuk memuat event saat halaman dibuka
    loadEvents();


    // --- FITUR 4: VALIDASI FORMULIR KONTAK ---
    const contactForm = document.getElementById('contact-form');
    const namaInput = document.getElementById('nama');
    const emailInput = document.getElementById('email');
    const pesanInput = document.getElementById('pesan');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Hentikan pengiriman form sementara untuk validasi
            e.preventDefault();
            
            let isNamaValid = validateNama();
            let isEmailValid = validateEmail();
            let isPesanValid = validatePesan();

            // Jika semua valid, kirimkan form
            if (isNamaValid && isEmailValid && isPesanValid) {
                // Tampilkan pesan sukses (simulasi)
                alert('Pesan sedang dikirim... (Ini akan dikirim sungguhan jika Formspree dikonfigurasi)');
                // Kirim form-nya
                contactForm.submit();
            }
        });

        // Helper functions untuk validasi
        function validateNama() {
            if (namaInput.value.trim() === '') {
                showError(namaInput, 'Nama lengkap tidak boleh kosong.');
                return false;
            } else {
                clearError(namaInput);
                return true;
            }
        }
        
        function validatePesan() {
            if (pesanInput.value.trim() === '') {
                showError(pesanInput, 'Pesan tidak boleh kosong.');
                return false;
            } else {
                clearError(pesanInput);
                return true;
            }
        }

        function validateEmail() {
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === '') {
                showError(emailInput, 'Email tidak boleh kosong.');
                return false;
            } else if (!emailRegex.test(email)) {
                showError(emailInput, 'Format email tidak valid (contoh: email@domain.com)');
                return false;
            } else {
                clearError(emailInput);
                return true;
            }
        }

        // Fungsi untuk menampilkan error
        function showError(inputElement, message) {
            const formGroup = inputElement.parentElement;
            const errorElement = formGroup.querySelector('.error-message');
            
            inputElement.classList.add('invalid');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }

        // Fungsi untuk membersihkan error
        function clearError(inputElement) {
            const formGroup = inputElement.parentElement;
            const errorElement = formGroup.querySelector('.error-message');

            inputElement.classList.remove('invalid');
            errorElement.classList.remove('show');
        }
    }

}); // Akhir dari 'DOMContentLoaded'