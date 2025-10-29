gsap.registerPlugin(ScrollTrigger, TextPlugin); // Daftarkan plugin di sini

document.addEventListener('DOMContentLoaded', () => {
    // --- HERO SECTION MULTI-LAYERED ANIMATION ---
    const sphereContainer = document.querySelector('.icon-sphere');
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        // 3. Animasi Bola Ikon 3D (Dikembalikan)
        if (sphereContainer) {
            const orbitingIcons = [
                'fa-lightbulb', 'fa-users', 'fa-trophy', 'fa-flag', 'fa-book-open',
                'fa-palette', 'fa-chart-line', 'fa-shield-alt', 'fa-futbol', 'fa-gavel',
                'fa-music', 'fa-camera', 'fa-laptop-code', 'fa-atom', 'fa-flask',
                'fa-comments', 'fa-bullhorn', 'fa-hands-helping', 'fa-seedling', 'fa-globe-asia',
                'fa-robot', 'fa-microscope', 'fa-cogs', 'fa-star', 'fa-heart',
                'fa-rocket', 'fa-puzzle-piece', 'fa-brain', 'fa-code', 'fa-paint-brush'
            ];

            // Buat Ikon Kepala Sekolah di Tengah
            const centralIconEl = document.createElement('div');
            centralIconEl.classList.add('sphere-icon', 'central-sphere-icon');
            const centralIcon = document.createElement('i');
            centralIcon.className = 'fas fa-school';
            centralIconEl.appendChild(centralIcon);
            sphereContainer.appendChild(centralIconEl);
            gsap.set(centralIconEl, { x: 0, y: 0, z: 0 });
            gsap.set(centralIconEl, { scale: 0, opacity: 0 }); // Atur keadaan awal
 
            const tl = gsap.timeline({ delay: 1 }); // Buat timeline dengan sedikit jeda awal
 
            // Animasi untuk memunculkan ikon pusat terlebih dahulu
            tl.to(centralIconEl, {
                duration: 0.8,
                scale: 1,
                opacity: 1,
                ease: 'back.out(1.7)'
            });

            // Buat Ikon-ikon yang Mengorbit
            const numIcons = orbitingIcons.length;
            const radius = 250; // Jari-jari orbit
            const iconElements = []; // Simpan elemen ikon untuk dianimasikan

            for (let i = 0; i < numIcons; i++) {
                const phi = Math.acos(-1 + (2 * (i + 1)) / (numIcons + 1));
                const theta = Math.sqrt((numIcons + 1) * Math.PI) * phi;

                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(phi);

                const iconEl = document.createElement('div');
                iconEl.classList.add('sphere-icon');

                const iconName = orbitingIcons[i].replace('fa-', '');

                // Buat elemen <i> baru untuk setiap ikon yang mengorbit
                const orbitingIcon = document.createElement('i');
                orbitingIcon.className = `fas ${orbitingIcons[i]}`;
                orbitingIcon.dataset.iconName = iconName; // Simpan nama ikon untuk data
                orbitingIcon.style.cursor = 'pointer';

                orbitingIcon.addEventListener('click', (e) => {
                    e.stopPropagation(); // Hentikan event agar tidak mengganggu parallax
                    openHeroIconModal(iconName);
                });

                iconEl.appendChild(orbitingIcon);
                sphereContainer.appendChild(iconEl);
                gsap.set(iconEl, { scale: 0, opacity: 0 }); // Atur keadaan awal
                gsap.set(iconEl, { x, y, z });
                iconElements.push(iconEl);
            }

            // Animasi untuk memunculkan ikon yang mengorbit setelah ikon pusat
            // Gunakan timeline baru yang dimulai setelah timeline pertama
            gsap.to(iconElements, {
                duration: 0.8,
                scale: 1,
                opacity: 1,
                stagger: 0.1, // Muncul satu per satu
                ease: 'power2.out',
                delay: 1.5 // Mulai setelah ikon pusat muncul
            });
        }

        // 4. Interaksi Parallax untuk semua lapisan
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPercent = (clientX / window.innerWidth - 0.5);
            const yPercent = (clientY / window.innerHeight - 0.5);

            // Bola Ikon (lebih cepat)
            gsap.to(sphereContainer, { rotationY: xPercent * 60, rotationX: -yPercent * 60, duration: 1.5, ease: 'power2.out' });
            // Konten (paling depan dan paling responsif)
            gsap.to('.hero-content', { rotationY: xPercent * 25, rotationX: -yPercent * 25, duration: 1, ease: 'power1.out' });
        });

        heroSection.addEventListener('mouseleave', () => {
            // Kembalikan semua ke posisi semula
            gsap.to('.hero-content, .icon-sphere', { rotationY: 0, rotationX: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' });
        });
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // --- Animasi Statistik Preloader ---
    const statusText = document.getElementById('status-text');
    const statusPercentage = document.getElementById('status-percentage');
    const statusMessages = [
        "Initializing System...",
        "Loading Assets...",
        "Verifying Data...",
        "Finalizing Setup..."
    ];

    // Mengubah teks status pada interval tertentu
    setTimeout(() => { if(statusText) statusText.textContent = statusMessages[1]; }, 800);
    setTimeout(() => { if(statusText) statusText.textContent = statusMessages[2]; }, 1600);
    setTimeout(() => { if(statusText) statusText.textContent = statusMessages[3]; }, 2400);

    // Menganimasikan persentase dari 0 ke 100
    const counter = { value: 0 };
    gsap.to(counter, {
        value: 100, 
        duration: 3.5, // Durasi dipercepat
        ease: 'power1.inOut',
        onUpdate: () => {
            if(statusPercentage) statusPercentage.textContent = `${Math.round(counter.value)}%`;
        }
    });

    // Jeda waktu disesuaikan dengan total durasi animasi preloader (4 detik)
    setTimeout(() => {
        // Memicu efek kilatan putih
        const flashOverlay = document.getElementById('flash-overlay');
        if (flashOverlay) {
            flashOverlay.classList.add('flash-active');
        }

        // Mulai animasi fade-out untuk preloader
        preloader.classList.add('preloader-hidden');
        document.body.style.overflow = 'auto'; // Kembalikan scroll lebih awal
        // Sembunyikan preloader sepenuhnya setelah transisi selesai
        setTimeout(() => {
            if (preloader) {
                preloader.style.display = 'none';
            }
        }, 600); // Sesuaikan dengan durasi transisi opacity di CSS
    }, 4000);
});

// --- Logika Modal Ikon Hero ---
const heroIconModalData = {
    'lightbulb': { title: 'Inovasi & Kreativitas', description: 'OSIS mendorong siswa untuk berpikir kreatif dan menghasilkan ide-ide inovatif untuk kemajuan sekolah.' },
    'users': { title: 'Kebersamaan', description: 'Membangun rasa kebersamaan dan solidaritas antar siswa melalui berbagai kegiatan sosial dan organisasi.' },
    'trophy': { title: 'Prestasi', description: 'Kami mendukung dan mengapresiasi setiap prestasi siswa, baik di bidang akademik maupun non-akademik.' },
    'flag': { title: 'Nasionalisme', description: 'Menanamkan rasa cinta tanah air dan semangat kebangsaan melalui kegiatan bela negara dan peringatan hari besar nasional.' },
    'book-open': { title: 'Pendidikan & Literasi', description: 'Meningkatkan minat baca dan kualitas pendidikan dengan program-program yang edukatif dan mencerahkan.' },
    'palette': { title: 'Seni & Budaya', description: 'Menjadi wadah bagi siswa untuk mengekspresikan bakat di bidang seni dan melestarikan budaya lokal.' },
    'chart-line': { title: 'Kewirausahaan', description: 'Melatih jiwa kewirausahaan dan kemandirian siswa sejak dini melalui program-program bisnis kreatif.' },
    'shield-alt': { title: 'Keamanan & Ketertiban', description: 'Menjaga lingkungan sekolah yang aman, nyaman, dan tertib untuk mendukung proses belajar mengajar.' },
    'futbol': { title: 'Olahraga & Kesehatan', description: 'Mengembangkan bakat olahraga, menjunjung tinggi sportivitas, dan mempromosikan gaya hidup sehat.' },
    'gavel': { title: 'Kepemimpinan & Keadilan', description: 'Melatih siswa untuk menjadi pemimpin yang adil, bertanggung jawab, dan mampu mengambil keputusan yang bijak.' },
    'music': { title: 'Musik & Ekspresi', description: 'Menyediakan panggung bagi siswa untuk menyalurkan bakat dan minat di dunia musik.' },
    'camera': { title: 'Dokumentasi & Jurnalistik', description: 'Mengabadikan setiap momen berharga dan menyebarkan informasi positif seputar kegiatan sekolah.' },
    'laptop-code': { title: 'Teknologi & Digital', description: 'Mendorong adaptasi dan inovasi teknologi di kalangan siswa untuk menghadapi era digital.' },
    'atom': { title: 'Sains & Penelitian', description: 'Membangkitkan rasa ingin tahu dan semangat penelitian ilmiah di kalangan siswa.' },
    'flask': { title: 'Eksperimen & Penemuan', description: 'Mendukung kegiatan praktikum dan eksperimen untuk pemahaman materi yang lebih mendalam.' },
    'comments': { title: 'Komunikasi & Aspirasi', description: 'Menjadi jembatan komunikasi antara siswa dan pihak sekolah untuk menyalurkan aspirasi.' },
    'bullhorn': { title: 'Informasi & Publikasi', description: 'Menyebarkan informasi penting dan pengumuman kepada seluruh warga sekolah secara efektif.' },
    'hands-helping': { title: 'Sosial & Kepedulian', description: 'Menumbuhkan rasa empati dan kepedulian terhadap sesama melalui kegiatan bakti sosial.' },
    'seedling': { title: 'Lingkungan Hidup', description: 'Mengajak seluruh warga sekolah untuk peduli dan berpartisipasi dalam menjaga kelestarian lingkungan.' },
    'globe-asia': { title: 'Wawasan Global', description: 'Membuka wawasan siswa terhadap isu-isu global dan mempersiapkan mereka menjadi warga dunia.' },
    'robot': { title: 'Robotika & Otomasi', description: 'Mengeksplorasi dunia robotika dan mempersiapkan siswa untuk masa depan teknologi.' },
    'microscope': { title: 'Penelitian Ilmiah', description: 'Mendalami ilmu pengetahuan melalui penelitian dan pengamatan yang mendetail.' },
    'cogs': { title: 'Mekanisme & Sistem', description: 'Memahami cara kerja sistem yang kompleks dan bagaimana setiap bagian saling berhubungan.' },
    'star': { title: 'Bakat & Keunggulan', description: 'Mengidentifikasi dan mengembangkan bakat-bakat terpendam untuk mencapai keunggulan.' },
    'heart': { title: 'Kesehatan & Kesejahteraan', description: 'Mempromosikan kesehatan fisik dan mental untuk kesejahteraan seluruh siswa.' },
    'rocket': { title: 'Ambisi & Cita-cita', description: 'Mendorong siswa untuk bermimpi besar dan bekerja keras untuk mencapai cita-cita mereka.' },
    'puzzle-piece': { title: 'Problem Solving', description: 'Melatih kemampuan analisis dan pemecahan masalah dalam menghadapi tantangan.' },
    'brain': { title: 'Kecerdasan & Pengetahuan', description: 'Menjadi pusat pengembangan intelektual dan pertukaran pengetahuan.' },
    'code': { title: 'Pemrograman', description: 'Mengasah logika dan keterampilan pemrograman sebagai bekal di era digital.' },
    'paint-brush': { title: 'Ekspresi Artistik', description: 'Memberikan ruang bagi siswa untuk berekspresi secara bebas melalui berbagai media seni.' }
};

const heroModalOverlay = document.getElementById('hero-icon-modal-overlay');
const heroModalCloseBtn = document.getElementById('hero-icon-modal-close');
const heroModalIcon = document.getElementById('hero-modal-icon');
const heroModalTitle = document.getElementById('hero-modal-title');
const heroModalDescription = document.getElementById('hero-modal-description');

function openHeroIconModal(iconName) {
    const data = heroIconModalData[iconName];
    if (!data || !heroModalOverlay) return;

    heroModalIcon.className = `fas fa-${iconName}`;
    heroModalTitle.textContent = data.title;
    heroModalDescription.textContent = data.description;

    heroModalOverlay.classList.add('active');
}

function closeHeroIconModal() {
    if (heroModalOverlay) {
        heroModalOverlay.classList.remove('active');
    }
}

if (heroModalOverlay) {
    heroModalCloseBtn.addEventListener('click', closeHeroIconModal);
    heroModalOverlay.addEventListener('click', (e) => {
        if (e.target === heroModalOverlay) {
            closeHeroIconModal();
        }
    });
}

// Animasi Navigasi Burger
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (!burger || !nav) return; // Keluar jika elemen tidak ditemukan

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}
navSlide();

// Efek Navigasi saat Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (header) {
        // Tambahkan kelas 'scrolled-nav' jika scroll lebih dari 50px, jika tidak, hapus
        if (window.scrollY > 50) {
            header.classList.add('scrolled-nav');
        } else {
            header.classList.remove('scrolled-nav');
        }
    }
});

// Progres Bar Gulir
gsap.to('.progress-bar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2
    }
});

// Mode Gelap
const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// Animasi Fade-in dan Penanda Link Aktif untuk semua section
gsap.utils.toArray('.section').forEach((section) => {
    const navLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);

    // Efek Parallax pada Latar Belakang Setiap Section
    // Gunakan pseudo-element ::after untuk paralaks yang lebih performan
    gsap.to(section, {
      backgroundPosition: `50% 100%`, // Jaga posisi background utama tetap statis
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    // Animasi Fade-in untuk konten di dalam section
    gsap.from(section.querySelectorAll('.container:not(.no-generic-fade)'), {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 70%',
            toggleActions: 'play none none reset',
            onEnter: () => {
                // Hapus kelas aktif dari semua link
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active-link'));
                // Tambahkan kelas aktif ke link yang sesuai
                if (navLink) {
                    navLink.classList.add('active-link');
                }
            },
            onEnterBack: () => {
                document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active-link'));
                if (navLink) {
                    navLink.classList.add('active-link');
                }
            }
        }
    });
});

// Animasi Spesifik
gsap.timeline({delay: 0.5}) // Tambahkan sedikit delay setelah preloader
    .from('.hero-content h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
    .from('.hero-content p', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
    .from('.cta-button', { y: 30, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, "-=0.5")
    .from('.scroll-down-indicator', { opacity: 0, duration: 1 }, "-=0.5");

// Animasi khusus untuk section "Tentang Kami" untuk menghindari konflik
// PENDEKATAN FINAL YANG STABIL: Satu Timeline untuk Semua Animasi
const tentangSection = document.querySelector('#tentang');
if (tentangSection) {    
    const highlightItems = gsap.utils.toArray('.highlight-item');

    // 1. Buat SATU timeline utama untuk mengontrol semua animasi di section ini
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: tentangSection,
            start: 'top 75%',
            toggleActions: 'play none none reset',
        }
    });
    
    // 2. Animasikan kemunculan konten utama (judul, paragraf, ikon samping)
    tl
        .from(tentangSection.querySelector('h2'), { opacity: 0, y: 20, duration: 0.5 })
        .from(tentangSection.querySelector('.tentang-content'), { opacity: 0, y: 20, duration: 0.6 }, "-=0.3")
        .from(tentangSection.querySelector('.tentang-side-animation'), { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.4");

    // 3. Animasikan kemunculan item statistik secara berurutan (stagger)
    tl.from(highlightItems, {
        opacity: 0,
        y: 20,
        stagger: 0.3,
        duration: 0.5
    }, "<"); // "<" berarti dimulai bersamaan dengan animasi sebelumnya

    // 4. Tambahkan animasi hitung angka ke timeline yang sama
    highlightItems.forEach(item => {
        const numberEl = item.querySelector('.highlight-number');
        const endValue = parseInt(numberEl.getAttribute('data-value'), 10);
        const suffix = numberEl.getAttribute('data-suffix') || '';
        const counter = { value: 0 }; // Objek untuk dianimasikan

        tl.to(counter, {
            value: endValue,
            duration: 2,
            ease: 'power1.inOut',
            onUpdate: () => {
                numberEl.textContent = Math.ceil(counter.value) + suffix;
            },
        }, "-=0.5"); // Mulai sedikit setelah item mulai muncul untuk efek yang lebih baik
    });
}

// --- Efek Tombol Magnetik ---
document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 50; // Kekuatan tarikan magnet

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = e;
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            x: x * 0.4,
            y: y * 0.4,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            x: 0,
            y: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});


// Efek ketik untuk subjudul di hero section
const heroSubtitle = document.getElementById('hero-subtitle');
if (heroSubtitle) {
    const phrases = [
        "Inovasi, Kreasi, Aksi.",
        "Mewujudkan Generasi Unggul.",
        "Dari Siswa, Oleh Siswa, Untuk Sekolah."
    ];
    let masterTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });

    phrases.forEach(phrase => {
        let tl = gsap.timeline({
            onComplete: () => masterTl.pause() // Jeda sebelum mengulang
        });
        tl.to(heroSubtitle, {
            text: phrase,
            duration: phrase.length * 0.08, // Durasi berdasarkan panjang teks
            ease: "none"
        }).to(heroSubtitle, { text: "", duration: 1.5, delay: 1 }); // Hapus teks setelah selesai
        masterTl.add(tl);
    });
}

// --- Animasi Ikon di Samping Visi Misi ---
gsap.to('.visimisi-side-icons .icon-card', {
    opacity: 1,
    x: 0,
    duration: 1,
    stagger: 0.3,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '#visi-misi',
        start: 'top 60%',
        toggleActions: 'play none none reset'
    }
});


// --- Interaktivitas Baru untuk Visi & Misi ---
const visiMisiIconCards = document.querySelectorAll('.visimisi-side-icons .icon-card');
visiMisiIconCards.forEach(iconCard => {
    iconCard.addEventListener('click', () => {
        // Jangan lakukan apa-apa jika sudah aktif
        if (iconCard.classList.contains('active')) return;

        // Hapus kelas 'active' dari semua ikon
        visiMisiIconCards.forEach(c => c.classList.remove('active'));
        // Tambahkan 'active' ke ikon yang diklik
        iconCard.classList.add('active');

        const targetId = iconCard.getAttribute('data-target');
        const allContentCards = document.querySelectorAll('.visimisi-content-card');
        
        allContentCards.forEach(contentCard => {
            if (contentCard.id === targetId) {
                // Tampilkan kartu target
                contentCard.classList.add('active');
            } else {
                // Sembunyikan kartu lain
                contentCard.classList.remove('active');
            }
        });
    });
});


// --- Efek 3D Tilt pada Kartu Visi & Misi ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    const maxTilt = 15; // Derajat maksimal kemiringan

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = (y - centerY) / centerY * -maxTilt;
        const tiltY = (x - centerX) / centerX * maxTilt;

        gsap.to(card, {
            duration: 0.5,
            rotationX: tiltX,
            rotationY: tiltY,
            transformPerspective: 1000,
            ease: 'power1.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.5,
            rotationX: 0,
            rotationY: 0,
            ease: 'power1.out'
        });
    });
});

// --- Logika Interaksi Divisi Card ---

// 1. Data untuk setiap divisi
const divisiData = {
    kerohanian: {
        title: "Divisi Kerohanian",
        programs: ["Peringatan Hari Besar Islam (PHBI)", "Kegiatan Pesantren Kilat", "Tadarus Al-Quran Bersama"],
        members: ["Pelajar"]
    },
    pendidikan: {
        title: "Divisi Pendidikan",
        programs: ["Kelas Tambahan Persiapan Ujian", "Lomba Cerdas Cermat", "Klub Debat Bahasa Inggris"],
        members: ["Pelajar"]
    },
    kreatif: {
        title: "Divisi Kreatif",
        programs: ["Pekan Kreativitas Siswa (Pensi)", "Workshop Desain Grafis", "Mading Sekolah Digital"],
        members: ["Pelajar"]
    },
    wirausaha: {
        title: "Divisi Wirausaha",
        programs: ["Bazar Sekolah", "Koperasi Siswa", "Pelatihan Produk Kreatif"],
        members: ["Pelajar"]
    },
    'bela-negara': {
        title: "Divisi Bela Negara",
        programs: ["Upacara Bendera Rutin", "Latihan PBB", "Seminar Wawasan Kebangsaan"],
        members: ["Pelajar"]
    },
    olahraga: {
        title: "Divisi Olahraga",
        programs: ["Pekan Olahraga Antar Kelas (PORKEL)", "Klub Futsal & Basket", "Jalan Sehat Bersama"],
        members: ["Pelajar"]
    },
    kedisiplinan: {
        title: "Divisi Kedisiplinan",
        programs: ["Razia Atribut Sekolah", "Piket Gerbang", "Sosialisasi Tata Tertib"],
        members: ["Pelajar"]
    },
    bendahara: {
        title: "Bendahara",
        programs: ["Pengelolaan Kas OSIS", "Laporan Keuangan Bulanan", "Penggalangan Dana Kegiatan"],
        members: ["Pelajar"]
    },
    sekretaris: {
        title: "Sekretaris",
        programs: ["Pengarsipan Surat Masuk & Keluar", "Pembuatan Proposal Kegiatan", "Notulensi Rapat"],
        members: ["Pelajar"]
    }
};

// 2. Elemen-elemen Modal
const divisiCards = document.querySelectorAll('.divisi-card');
const modalOverlay = document.getElementById('divisi-modal-overlay');
const modalCloseBtn = document.getElementById('divisi-modal-close');
const modalTitle = document.getElementById('modal-divisi-title');
const modalPrograms = document.getElementById('modal-divisi-programs');
const modalIcon = document.getElementById('modal-divisi-icon');
const modalMembers = document.getElementById('modal-divisi-members');

const openDivisiModal = (id) => {
    const data = divisiData[id];
    if (!data) return;

    modalTitle.textContent = data.title;
    // Ambil kelas ikon dari kartu yang diklik
    const cardIconClass = document.querySelector(`.divisi-card[data-divisi-id="${id}"] .divisi-icon`).className;
    modalIcon.className = cardIconClass;

    // Kosongkan list sebelum diisi
    modalPrograms.innerHTML = data.programs.map(p => `<li>${p}</li>`).join('');
    modalMembers.innerHTML = data.members.map(m => `<li>${m}</li>`).join('');

    modalOverlay.classList.add('active');

    // Animasi stagger untuk item list
    gsap.from(modalPrograms.querySelectorAll('li'), {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        delay: 0.3
    });
    gsap.from(modalMembers.querySelectorAll('li'), {
        opacity: 0,
        x: -30,
        stagger: 0.1,
        delay: 0.4
    });
};

const closeDivisiModal = () => {
    modalOverlay.classList.remove('active');
};

divisiCards.forEach(card => {
    card.addEventListener('click', () => {
        const divisiId = card.getAttribute('data-divisi-id');
        openDivisiModal(divisiId);
    });
});

modalCloseBtn.addEventListener('click', closeDivisiModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeDivisiModal();
    }
});

// --- Animasi Spotlight pada Timeline ---
gsap.utils.toArray('.timeline-item').forEach(item => {
    ScrollTrigger.create({
        trigger: item,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => item.classList.add('is-active'),
        onLeave: () => item.classList.remove('is-active'),
        onEnterBack: () => item.classList.add('is-active'),
        onLeaveBack: () => item.classList.remove('is-active'),
    });
});

// Efek redup pada timeline saat ada item yang aktif
ScrollTrigger.create({
    trigger: '.timeline-container',
    start: 'top 50%',
    end: 'bottom 50%',
    onToggle: self => document.querySelector('.timeline-container').classList.toggle('is-focused', self.isActive)
});

// Animasi Program Kerja
gsap.utils.toArray('.program-item').forEach((item) => {
    gsap.from(item, {
        y: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none reset'
        }
    });
});

// Animasi Timeline Baru yang Lebih Interaktif
const tlTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: '.timeline-container',
        start: 'top 50%',
        end: 'bottom 50%',
        scrub: 1 // Membuat animasi berjalan seiring scroll
    }
});

// 1. Animasikan garis vertikal utama
tlTimeline.to('.timeline-line', { scaleY: 1, duration: 10 });

// 2. Animasikan setiap item timeline
gsap.utils.toArray('.timeline-item').forEach(item => {
    const isEven = Array.from(item.parentNode.children).indexOf(item) % 2 !== 0;
    const xValue = isEven ? 100 : -100;

    gsap.from(item, {
        x: xValue,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reset' }
    });

    // 3. Animasikan titik di timeline
    gsap.from(item.querySelector('.timeline-dot'), {
        scale: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reset'
        }
    });

    // 4. Animasikan garis horizontal penghubung
    gsap.from(item.querySelector('.timeline-connector'), {
        scaleX: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reset'
        }
    });
});

// Animasi Struktur Organisasi
gsap.utils.toArray('.struktur-card').forEach((card) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reset'
        }
    });
});

// Animasi Garis Struktur Organisasi
const tlStruktur = gsap.timeline({
    scrollTrigger: {
        trigger: '#struktur-osis',
        start: 'top 60%',
        toggleActions: 'play none none reset'
    }
});

tlStruktur
    .to('.struktur-container .level:nth-child(2) .garis-vertikal', { scaleY: 1, duration: 0.3 }) // Kasek -> Waka
    .to('.struktur-container .level:nth-child(2) .garis-horizontal', { scaleX: 1, duration: 0.5 }) // Garis Waka
    .to('.struktur-container .level:nth-child(3) .garis-vertikal', { scaleY: 1, duration: 0.3 }) // Waka -> Pembina
    .to('.struktur-container .level:nth-child(4) .garis-vertikal', { scaleY: 1, duration: 0.3 }) // Pembina -> Ketua
    .to('.struktur-container .level:nth-child(5) .garis-vertikal', { scaleY: 1, duration: 0.3 }) // Ketua -> Baris Wakil
    .to('.struktur-container .level:nth-child(5) .garis-horizontal', { scaleX: 1, duration: 0.5 }) // Garis Baris Wakil
    .to('.struktur-container .level:nth-child(6) .garis-vertikal-divisi', { scaleY: 1, duration: 0.3 }) // Baris Wakil -> Divisi
    .to('.struktur-container .level:nth-child(6) .garis-horizontal-divisi', { scaleX: 1, duration: 0.7 }) // Garis Divisi
    .to('.garis-cabang', { 
        scaleY: 1, 
        duration: 0.5, 
        transformOrigin: 'top',
        stagger: 0.1 
    }, "-=0.5");

// --- Logika Galeri Modal ---
const modal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-image');
const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
const closeBtn = document.querySelector('.close-btn');

if (modal && modalImg && galleryItems.length > 0 && closeBtn) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const fullImgSrc = item.querySelector('img').getAttribute('data-full');
            modal.style.display = "block";
            modalImg.src = fullImgSrc;
        });
    });

    // Fungsi untuk menutup modal
    const closeModal = () => {
        modal.style.display = "none";
    };

    // Menutup modal saat tombol close diklik
    closeBtn.onclick = closeModal;

    // Menutup modal saat area di luar gambar diklik
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    };
}

// --- Animasi Kartu Info Kontak ---
gsap.to('.info-card', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'back.out(1.7)',
    scrollTrigger: {
        trigger: '.kontak-info-container',
        start: 'top 80%',
        toggleActions: 'play none none reset'
    }
});

// --- Logika Form Kontak ---
const contactForm = document.querySelector('.kontak-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Mencegah form dari submit default

        const nameInput = document.getElementById('nama');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('pesan');
        const submitBtn = this.querySelector('.submit-btn');
        const formContainer = document.querySelector('.kontak-form-container');
        let isValid = true;

        // Fungsi untuk menampilkan error
        const showError = (input, message) => {
            const errorDisplay = input.parentElement.querySelector('.error-message');
            errorDisplay.innerText = message;
            input.classList.add('error');
            isValid = false;
        };
        
        // Fungsi untuk membersihkan error
        const clearError = (input) => {
            const errorDisplay = input.parentElement.querySelector('.error-message');
            errorDisplay.innerText = '';
            input.classList.remove('error');
        };

        // Reset validasi
        [nameInput, emailInput, messageInput].forEach(clearError);

        // Validasi Nama
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Nama tidak boleh kosong.');
        }

        // Validasi Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email tidak boleh kosong.');
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, 'Format email tidak valid.');
        }

        // Validasi Pesan
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Pesan tidak boleh kosong.');
        }

        // Jika semua valid, kirim form
        if (isValid) {
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;
            // Simulasi pengiriman
            setTimeout(() => {
                if (formContainer) {
                    formContainer.innerHTML = `
                        <div class="form-success-message">
                            <h3>Terima Kasih!</h3>
                            <p>Pesan Anda telah berhasil disimulasikan. Pada website nyata, pesan ini akan terkirim ke email kami.</p>
                            <i class="fas fa-check-circle"></i>
                        </div>
                    `;
                }
            }, 2000);
        }
    });
}

// --- Logika Slider Testimoni (Tidak ada di HTML, jadi tidak akan berjalan) ---
const sliderContainer = document.querySelector('.testimoni-slider');
if (sliderContainer) {
    const cards = gsap.utils.toArray('.testimoni-card');
    const prevBtnTesti = document.querySelector('.prev-btn-testi');
    const nextBtnTesti = document.querySelector('.next-btn-testi');
    let currentIndex = 0;

    function showTestimonial(index) {
        const offset = -index * 100;
        gsap.to(sliderContainer, {
            xPercent: offset,
            duration: 0.7,
            ease: 'power3.inOut'
        });
    }

    if (nextBtnTesti && prevBtnTesti && cards.length > 0) {
        nextBtnTesti.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            showTestimonial(currentIndex);
        });

        prevBtnTesti.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            showTestimonial(currentIndex);
        });

        // Inisialisasi posisi awal
        showTestimonial(0);
    }
}
