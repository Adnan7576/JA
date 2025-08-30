// ======== Fetch Courses ========
async function fetchCourses() {
  const res = await fetch("courses.json");
  const data = await res.json();
  return data.courses;
}

// ======== Render Home Page ========
async function renderHomePage() {
  const courses = await fetchCourses();
  const admissionContainer = document.getElementById("courses-container");
  const academicContainer = document.getElementById("academic-courses-container");

  admissionContainer.innerHTML = "";
  academicContainer.innerHTML = "";

  courses.forEach(course => {
    const card = document.createElement("div");
    card.className = `bg-white p-6 rounded-lg shadow text-center flex flex-col items-center hover:shadow-lg hover:scale-105 transition border border-transparent hover:border-2 hover:border-${course.color}-600`;
    
    card.innerHTML = `
      <img src="${course.logo}" alt="${course.title}" class="w-20 h-20 object-contain mb-4">
      <h4 class="text-xl font-semibold mb-2">${course.title}</h4>
      <p class="text-gray-600 mb-4">${course.subtitle}</p>
      <button class="bg-${course.color}-600 hover:bg-${course.color}-700 text-white px-4 py-2 rounded-md transition" onclick="window.location='${course.link}'">
        View Course
      </button>
    `;

    if(course.category === "admission") admissionContainer.appendChild(card);
    if(course.category === "academic") academicContainer.appendChild(card);
  });

  generateHeroSlides(courses);
}

// ======== Generate Hero Slides ========
function generateHeroSlides(courses) {
  const swiperWrapper = document.querySelector(".hero-swiper .swiper-wrapper");
  if(!swiperWrapper) return;

  swiperWrapper.innerHTML = "";

  courses.slice(0, 5).forEach(course => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide relative h-full bg-cover bg-center";
    slide.style.backgroundImage = `url('${course.thumbnail}')`;
    slide.dataset.url = course.link;
    slide.innerHTML = `
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">${course.title}</h1>
        <p class="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 mb-8">${course.subtitle}</p>
        <button onclick="window.location='${course.link}'" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg transition">
          View Course
        </button>
      </div>
    `;
    swiperWrapper.appendChild(slide);
  });

  document.querySelectorAll(".hero-swiper .swiper-slide").forEach(slide => {
    slide.addEventListener("click", () => {
      window.location.href = slide.dataset.url;
    });
  });

  new Swiper(".hero-swiper", {
    loop: true,
    speed: 1000,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    effect: "slide",
  });
}

// ======== Render Course Detail ========
async function renderCourseDetail() {
  const courses = await fetchCourses();
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const course = courses.find(c => c.id === id);

  if (!course) {
    document.body.innerHTML = "<h1 class='text-center text-3xl mt-20'>Course not found</h1>";
    return;
  }

  document.getElementById("course-title").textContent = course.title;
  document.getElementById("course-subtitle").textContent = course.subtitle;
  
  // Render multi-line description
  const courseDescription = document.getElementById("course-description");
  courseDescription.innerHTML = course.description
    .split("\n")
    .map(line => `<p class="mb-2">${line}</p>`)
    .join("");

  document.getElementById("course-thumbnail").src = course.thumbnail;
  document.getElementById("enrolled").textContent = course.enrolled;
  document.getElementById("course-duration").textContent = course.duration;
  document.getElementById("course-price-original").textContent = "৳" + course.price.original;
  document.getElementById("course-price-discount").textContent = "৳" + course.price.discounted;

  // Features
  const featuresContainer = document.getElementById("course-features");
  featuresContainer.innerHTML = "";
  course.features.forEach(feature => {
    const div = document.createElement("div");
    div.className = "flex items-center gap-3 rounded-xl bg-gray-50 p-4 shadow transition duration-300 hover:scale-[1.02] hover:shadow-lg";
    div.innerHTML = `<i class="fas fa-check-circle text-xl text-blue-600"></i> <span class="text-lg font-medium text-gray-700">${feature}</span>`;
    featuresContainer.appendChild(div);
  });

  // Enroll button
  const enrollBtn = document.querySelector(".enroll-btn");
  if (enrollBtn) {
    enrollBtn.addEventListener("click", () => {
      if (course.enrolledBtn) {
        window.open(course.enrolledBtn, "_blank");
      } else {
        openWhatsApp();
      }
    });
  }
}

// ======== Social Links ========
function openWhatsApp() { window.open("https://wa.me/8801571748528","_blank"); }
function openFacebook() { window.open("https://facebook.com/joynalacademy","_blank"); }
function openYouTube() { window.open("https://youtube.com/joynalacademy","_blank"); }

// ======== Initialize ========
document.addEventListener("DOMContentLoaded", () => {
  if(document.getElementById("courses-container")) renderHomePage();
  if(document.getElementById("course-title")) renderCourseDetail();
});


// ======== Navbar JS ========

const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
const navbar = document.getElementById("navbar");

// Open mobile drawer
menuBtn.addEventListener("click", () => {
  drawer.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("opacity-50"), 10);
});

// Close mobile drawer
function closeDrawer() {
  drawer.classList.add("translate-x-full");
  overlay.classList.remove("opacity-50");
  setTimeout(() => overlay.classList.add("hidden"), 300);
}

closeBtn.addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);

// Optional: Smooth scroll for drawer links
document.querySelectorAll("#drawer-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").replace("#", "");
    const targetSection = document.getElementById(targetId);
    if(targetSection) {
      e.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth" });
      closeDrawer();
    }
  });
});

// Optional: Change navbar background on scroll
window.addEventListener("scroll", () => {
  if(window.scrollY > 50) {
    navbar.classList.add("bg-white", "shadow");
    navbar.classList.remove("bg-transparent");
  } else {
    navbar.classList.remove("bg-white", "shadow");
    navbar.classList.add("bg-transparent");
  }
});
