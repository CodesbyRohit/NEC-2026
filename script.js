const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const teamGrid = $("#team-grid");
siteData.team.forEach((member, index) => {
  const card = document.createElement("button");
  card.className = `team-card reveal ${index % 2 ? "card-offset" : ""}`;
  card.dataset.member = member.id;
  card.innerHTML = `<div class="member-photo photo-${index + 1}"><span>${member.photoLabel}</span><b>↗</b></div><div class="member-meta"><span>${member.role}</span><h3>${member.name}</h3><small>${member.department}</small></div>`;
  teamGrid.append(card);
});

const timeline = $("#timeline");
timeline.innerHTML = siteData.milestones.map((item, index) => `<article class="timeline-item ${item.status} reveal"><div class="timeline-marker"><span>${item.number}</span></div><div class="timeline-card"><span class="mono">${item.date}</span><h3>${item.title}</h3><p>${item.description}</p><button class="text-link timeline-more" data-milestone="${index}">View milestone <span>↗</span></button></div></article>`).join("");

const categories = ["All", ...new Set(siteData.gallery.map((item) => item.category))];
$("#gallery-filters").innerHTML = categories.map((category, index) => `<button class="${index === 0 ? "active" : ""}" data-filter="${category}">${category}</button>`).join("");
const renderGallery = (filter = "All") => {
  const items = siteData.gallery.filter((item) => filter === "All" || item.category === filter);
  $("#gallery-grid").innerHTML = items.map((item, index) => `<button class="gallery-item tone-${item.tone} reveal ${index === 1 ? "gallery-tall" : ""}" data-gallery="${item.id}"><span class="gallery-placeholder">${item.title.toUpperCase()}<small>IMAGE PLACEHOLDER</small></span><span class="gallery-caption"><b>${item.title}</b><small>${item.date} · ${item.category}</small></span><i>↗</i></button>`).join("");
  $$("#gallery-grid .gallery-item").forEach((item) => item.addEventListener("click", () => openLightbox(siteData.gallery.find((gallery) => gallery.id === item.dataset.gallery))));
  observeReveals();
};
renderGallery();

const eventMarkup = (event, compact = false) => `<article class="event-card ${compact ? "event-compact" : ""}"><div class="event-poster"><span>EVENT<br /><b>POSTER</b></span><small>${event.status}</small></div><div class="event-info"><span class="mono">${event.date} · ${event.time}</span><h3>${event.title}</h3><p>${event.description}</p><small>${event.location} · ${event.organizer}</small>${compact ? "" : `<a class="button button-small" href="${event.registrationUrl === "[REGISTRATION URL]" ? "#" : event.registrationUrl}" target="_blank" rel="noopener">Register now <span>↗</span></a>`}</div></article>`;
const upcomingEvents = siteData.events.filter((event) => event.status === "UPCOMING");
$("#upcoming-preview").innerHTML = upcomingEvents.map((event) => eventMarkup(event, true)).join("");
$("#upcoming-grid").innerHTML = upcomingEvents.length ? upcomingEvents.map((event) => eventMarkup(event)).join("") : `<div class="empty-state"><span>✦</span><p>Upcoming events will appear here.</p></div>`;

const modal = $("#profile-modal");
const openProfile = (member) => {
  $("#modal-content").innerHTML = `<div class="modal-photo photo-${siteData.team.indexOf(member) + 1}">${member.photoLabel}</div><div class="modal-copy"><span class="section-kicker">${member.role}</span><h2>${member.name}</h2><p class="mono">${member.department}</p><p>${member.bio}</p><div class="skill-list">${member.skills.map((skill) => `<span>${skill}</span>`).join("")}</div><a class="text-link" href="${member.linkedin === "[LINKEDIN URL]" ? "#" : member.linkedin}" target="_blank" rel="noopener">LinkedIn profile <span>↗</span></a></div>`;
  modal.showModal();
};
teamGrid.addEventListener("click", (event) => { const card = event.target.closest("[data-member]"); if (card) openProfile(siteData.team.find((member) => member.id === card.dataset.member)); });
$(".modal-close", modal).addEventListener("click", () => modal.close());

const lightbox = $("#lightbox");
const openLightbox = (item) => { $("#lightbox-content").innerHTML = `<div class="lightbox-art tone-${item.tone}">${item.title.toUpperCase()}<small>IMAGE PLACEHOLDER</small></div><div><span class="section-kicker">${item.category}</span><h2>${item.title}</h2><p>${item.caption}</p><span class="mono">${item.date}</span></div>`; lightbox.showModal(); };
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

$("#contact-form").addEventListener("submit", (event) => { event.preventDefault(); const message = $(".form-message"); message.textContent = "Thanks — your message is ready to be connected to the team inbox."; message.classList.add("success"); event.target.reset(); });
