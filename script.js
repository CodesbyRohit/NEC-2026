const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

$("#hero-tagline").textContent = siteData.tagline.toUpperCase();
$("#team-introduction").textContent = siteData.introduction;
$("#about-introduction").textContent = siteData.introduction;
$("#about-origin").textContent = siteData.about.origin;
$("#about-vision").textContent = siteData.about.vision;
$("#about-mission").textContent = siteData.about.mission;
$("#about-beliefs-detail").textContent = siteData.about.beliefs;

const setExternalLink = (selector, value, label) => {
  const link = $(selector);
  if (value.startsWith("https://") || value.startsWith("http://")) {
    link.href = value;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (label) link.innerHTML = `${label} <span>↗</span>`;
  } else {
    link.removeAttribute("href");
    link.setAttribute("aria-disabled", "true");
    if (label) link.textContent = value;
  }
};
setExternalLink("#instagram-social", siteData.social.instagram, "Instagram");
setExternalLink("#linkedin-social", siteData.social.linkedin, "LinkedIn");
setExternalLink("#instagram-contact", siteData.social.instagram, siteData.social.instagram);
setExternalLink("#linkedin-contact", siteData.social.linkedin, siteData.social.linkedin);
const emailLink = $("#team-email");
if (siteData.social.email.includes("@") && !siteData.social.email.includes("[")) {
  emailLink.href = `mailto:${siteData.social.email}`;
  emailLink.textContent = `${siteData.social.email} ↗`;
} else {
  emailLink.removeAttribute("href");
  emailLink.setAttribute("aria-disabled", "true");
  emailLink.textContent = siteData.social.email;
}

const teamGrid = $("#team-grid");
siteData.team.forEach((member, index) => {
  const card = document.createElement("button");
  card.className = `team-card reveal ${index % 2 ? "card-offset" : ""}`;
  card.dataset.member = member.id;
  const photo = member.photo ? `<img src="${member.photo}" alt="${member.name}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : `<span>${member.photoLabel}</span>`;
  card.innerHTML = `<div class="member-photo photo-${index + 1}">${photo}<b>↗</b></div><div class="member-meta"><span>${member.role}</span><h3>${member.name}</h3><small>${member.department}</small></div>`;
  teamGrid.append(card);
});

const timeline = $("#timeline");
timeline.innerHTML = siteData.milestones.map((item, index) => `<article class="timeline-item ${item.status} reveal"><div class="timeline-marker"><span>${item.number}</span></div><div class="timeline-card"><span class="mono">${item.date}</span><h3>${item.title}</h3><p>${item.description}</p><button class="text-link timeline-more" aria-expanded="false" aria-controls="milestone-details-${index}" data-milestone="${index}">Milestone details <span>↘</span></button><div class="milestone-details" id="milestone-details-${index}" hidden>${[
  ["Challenge activities", item.challengeActivities],
  ["NEC tasks", item.necTasks],
  ["Photos", item.images],
  ["Videos", item.videos],
  ["Certificates", item.certificates]
].map(([label, values]) => `<div><b>${label}</b>${values.length ? values.map((value) => label === "Photos" ? `<img src="${value}" alt="${item.title} milestone" loading="lazy" style="max-width:100%;height:auto">` : label === "Videos" ? `<video controls preload="none" style="max-width:100%"><source src="${value}"></video>` : label === "Certificates" ? `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>` : `<p>${value}</p>`).join("") : `<p>[ADD VERIFIED DETAILS WHEN AVAILABLE]</p>`}</div>`).join("")}</div></div></article>`).join("");
timeline.addEventListener("click", (event) => {
  const button = event.target.closest("[data-milestone]");
  if (!button) return;
  const details = $(`#milestone-details-${button.dataset.milestone}`);
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!expanded));
  details.hidden = expanded;
});

const categories = ["All", ...siteData.galleryCategories];
$("#gallery-filters").innerHTML = categories.map((category, index) => `<button class="${index === 0 ? "active" : ""}" data-filter="${category}">${category}</button>`).join("");
const renderGallery = (filter = "All") => {
  const items = siteData.gallery.filter((item) => filter === "All" || item.category === filter);
  $("#gallery-grid").innerHTML = items.length ? items.map((item, index) => `<button class="gallery-item tone-${item.tone} reveal ${index === 1 ? "gallery-tall" : ""}" data-gallery="${item.id}">${item.image ? `<img src="${item.image}" alt="${item.caption}" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">` : item.video ? `<video muted playsinline preload="none" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0"><source src="${item.video}"></video>` : `<span class="gallery-placeholder">${item.title.toUpperCase()}<small>IMAGE OR VIDEO PLACEHOLDER</small></span>`}<span class="gallery-caption"><b>${item.title}</b><small>${item.date} · ${item.category}</small></span><i>↗</i></button>`).join("") : `<div class="empty-state"><span>✦</span><p>Photos and videos for this category will appear here.</p></div>`;
  $$("#gallery-grid .gallery-item").forEach((item) => item.addEventListener("click", () => openLightbox(siteData.gallery.find((gallery) => gallery.id === item.dataset.gallery))));
  observeReveals();
};
renderGallery();

const eventMarkup = (event, compact = false) => {
  const registrationLink = /^https?:\/\//i.test(event.registrationUrl || "");
  return `<article class="event-card ${compact ? "event-compact" : ""}"><div class="event-poster">${event.image ? `<img src="${event.image}" alt="${event.title} poster" loading="lazy" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">` : "<span>EVENT<br /><b>POSTER</b></span>"}<small>${event.status}</small></div><div class="event-info"><span class="mono">${event.date} · ${event.time}</span><h3>${event.title}</h3><p>${event.description}</p><small>${event.location} · ${event.organizer}</small>${compact ? "" : registrationLink ? `<a class="button button-small" href="${event.registrationUrl}" target="_blank" rel="noopener noreferrer">Register now <span>↗</span></a>` : ""}</div></article>`;
};
const upcomingEvents = siteData.events.filter((event) => event.status === "UPCOMING");
$("#upcoming-indicator").hidden = upcomingEvents.length === 0;
$("#upcoming-preview").innerHTML = upcomingEvents.map((event) => eventMarkup(event, true)).join("");
$("#upcoming-grid").innerHTML = upcomingEvents.length ? upcomingEvents.map((event) => eventMarkup(event)).join("") : `<div class="empty-state"><span>✦</span><p>Upcoming events will appear here.</p></div>`;
if (!upcomingEvents.length) $("#upcoming-preview").innerHTML = `<div class="empty-state"><span>✦</span><p>No upcoming events announced yet.</p></div>`;

const eventFilters = ["All past activities", ...siteData.eventCategories];
$("#event-filters").innerHTML = eventFilters.map((category, index) => `<button class="${index === 0 ? "active" : ""}" data-event-filter="${category}">${category}</button>`).join("");
const renderPastEvents = (category = "All past activities") => {
  const events = siteData.events.filter((event) => event.status === "PAST" && (category === "All past activities" || event.category === category));
  $("#past-events").innerHTML = events.length ? events.map((event) => eventMarkup(event, true)).join("") : `<div class="empty-state"><span>✦</span><p>${category === "All past activities" ? "Your past events and team activities will appear here." : `${category} will appear here.`}</p></div>`;
};
renderPastEvents();
$("#event-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-event-filter]");
  if (!button) return;
  $$("#event-filters [data-event-filter]").forEach((filter) => filter.classList.remove("active"));
  button.classList.add("active");
  renderPastEvents(button.dataset.eventFilter);
});

const modal = $("#profile-modal");
const openProfile = (member) => {
  const photo = member.photo ? `<img src="${member.photo}" alt="${member.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : member.photoLabel;
  const linkedin = /^https?:\/\//i.test(member.linkedin);
  $("#modal-content").innerHTML = `<div class="modal-photo photo-${siteData.team.indexOf(member) + 1}">${photo}</div><div class="modal-copy"><span class="section-kicker">${member.role}</span><h2>${member.name}</h2><p class="mono">${member.department}</p><p>${member.bio}</p><div class="skill-list">${member.skills.map((skill) => `<span>${skill}</span>`).join("")}</div>${linkedin ? `<a class="text-link" href="${member.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn profile <span>↗</span></a>` : `<span class="text-link" aria-disabled="true">[LINKEDIN URL]</span>`}</div>`;
  modal.showModal();
};
teamGrid.addEventListener("click", (event) => { const card = event.target.closest("[data-member]"); if (card) openProfile(siteData.team.find((member) => member.id === card.dataset.member)); });
$(".modal-close", modal).addEventListener("click", () => modal.close());

const lightbox = $("#lightbox");
const openLightbox = (item) => { const media = item.image ? `<img src="${item.image}" alt="${item.caption}" style="width:100%;max-height:70vh;object-fit:contain">` : item.video ? `<video src="${item.video}" controls playsinline style="width:100%;max-height:70vh"></video>` : `<div class="lightbox-art tone-${item.tone}">${item.title.toUpperCase()}<small>IMAGE OR VIDEO PLACEHOLDER</small></div>`; $("#lightbox-content").innerHTML = `<div>${media}</div><div><span class="section-kicker">${item.category}</span><h2>${item.title}</h2><p>${item.caption}</p><span class="mono">${item.date}</span></div>`; lightbox.showModal(); };
$(".modal-close", lightbox).addEventListener("click", () => lightbox.close());

$$("[data-filter]").forEach((button) => button.addEventListener("click", () => { $$("[data-filter]").forEach((item) => item.classList.remove("active")); button.classList.add("active"); renderGallery(button.dataset.filter); }));

const menuToggle = $(".menu-toggle");
menuToggle.addEventListener("click", () => { const open = document.body.classList.toggle("menu-open"); menuToggle.setAttribute("aria-expanded", open); });
$$(".site-nav a").forEach((link) => link.addEventListener("click", () => document.body.classList.remove("menu-open")));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.12 });
function observeReveals() { $$(".reveal:not(.is-visible)").forEach((element) => observer.observe(element)); }
observeReveals();

const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { $$(".site-nav a").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)); } }), { rootMargin: "-35% 0px -55% 0px" });
$$("main section[id]").forEach((section) => navObserver.observe(section));
window.addEventListener("scroll", () => $(".site-header").classList.toggle("scrolled", window.scrollY > 24), { passive: true });

$("#contact-form").addEventListener("submit", (event) => { event.preventDefault(); const message = $(".form-message"); message.textContent = "The contact form is not connected yet. Please use the team email above."; message.classList.add("success"); });
