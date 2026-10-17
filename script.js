// data kurs
const kursData = {
  labels: ['17 Sep 26', '16 Okt 26'],
  values: [17740, 18005]
};

// navbar
const navItems = document.querySelectorAll(".nav-link");
const allSectionLinks = document.querySelectorAll('a[href^="#"]');

function setActiveNav(targetId) {
  navItems.forEach(item => {
    item.classList.toggle(
      "active",
      item.getAttribute("href") === `#${targetId}`
    );
  });
}

const navSections = document.querySelectorAll(
  "#dashboard, #penyebab, #dampak, #solusi, #glosarium"
);

const sectionObserver = new IntersectionObserver(
  entries => {
    const visibleSections = [...entries]
      .filter(entry => entry.isIntersecting)
      .sort(
        (a, b) =>
          b.intersectionRatio - a.intersectionRatio
      );

    if (visibleSections.length > 0) {
      setActiveNav(visibleSections[0].target.id);
    }
  },
  {
    rootMargin: "-20% 0px -60% 0px",
    threshold: [0, 0.1, 0.25, 0.5]
  }
);

navSections.forEach(section => {
  sectionObserver.observe(section);
});


allSectionLinks.forEach(link => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");

    if (!href || href === "#") return;

    const targetId = href.slice(1);

    if (document.getElementById(targetId)) {
      setActiveNav(targetId);
    }
  });
});


// Saat link mana pun yang menuju section diklik
allSectionLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetId = link.getAttribute("href").slice(1);

    if (document.getElementById(targetId)) {
      setActiveNav(targetId);
    }
  });
});

// chart
const ctx = document.getElementById('rupiahChart').getContext('2d');

// gradient fill di bawah garis
const fillGradient = ctx.createLinearGradient(0, 0, 0, 220);
fillGradient.addColorStop(0, 'rgba(184, 84, 80, 0.14)');
fillGradient.addColorStop(1, 'rgba(184, 84, 80, 0)');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: kursData.labels,
    datasets: [{
      data: kursData.values,
      borderColor: '#B85450',
      backgroundColor: fillGradient,
      borderWidth: 2,
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#B85450',
      pointHoverBorderColor: '#FFFFFF',
      pointHoverBorderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: 'easeOutQuart'
    },
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'JetBrains Mono', size: 11 },
        bodyFont: { family: 'JetBrains Mono', size: 13, weight: '600' },
        displayColors: false,
        callbacks: {
          label: (context) => `Rp ${context.parsed.y.toLocaleString('id-ID')}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { family: 'JetBrains Mono', size: 10 },
          color: '#9A9A9A',
          padding: 8
        }
      },
      y: {
        grid: { color: '#F0EEE9', drawBorder: false },
        border: { display: false },
        ticks: { display: false }
      }
    }
  }
});

// scroll state
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// reveal (animasi)
const revealTargets = document.querySelectorAll(
  '.section-header, .card, .impact-card, .timeline-item, .glossary-item, .split-2 > *'
);

revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`; // stagger per 4 elemen
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => observer.observe(el));

// count up
const rateEl = document.getElementById('rateValue');
const finalRate = 18050;
let hasCounted = false;

function countUp(el, target, duration = 1400) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // easeOutQuart
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = Math.floor(eased * target);
    el.textContent = `Rp ${value.toLocaleString('id-ID')}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// count-up pas card masuk viewport
const rateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasCounted) {
      hasCounted = true;
      countUp(rateEl, finalRate);
      rateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

rateObserver.observe(rateEl);

// toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

// preferensi user
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  if (isDark) {
    root.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// search

 // Search
const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");

searchToggle.addEventListener("click", () => {
  searchBox.hidden = !searchBox.hidden;

  if (!searchBox.hidden) {
    searchInput.focus();
  } else {
    searchMessage.textContent = "";
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;

  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) {
    searchMessage.textContent = "Masukkan kata kunci terlebih dahulu.";
    return;
  }

  const sections = document.querySelectorAll("main section[id]");

  const result = [...sections].find((section) =>
    section.textContent.toLowerCase().includes(keyword)
  );

  if (result) {
    const heading = result.querySelector("h1, h2, h3");

    searchMessage.textContent =
      "Ditemukan: " + (heading?.textContent.trim() || result.id);

    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  } else {
    searchMessage.textContent =
      `Tidak ada materi yang cocok dengan "${searchInput.value.trim()}".`;
  }
});
