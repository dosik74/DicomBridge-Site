/* DicomBridge site: 3D bg + GitHub live releases */
const REPO = "dosik74/DicomBridge";
const API = `https://api.github.com/repos/${REPO}/releases`;
const FALLBACK = {
  tag: "v1.0.4",
  name: "DicomBridge v1.0.4",
  date: "2026-10-04",
  size: 282220702,
  downloads: 2,
  url: `https://github.com/${REPO}/releases/latest/download/DicomBridge-Setup.exe`,
  body: "Инженер в «О программе» на старых установках + версия установщика из config.py.\n• Support migration fills engineer/phone\n• Installer version auto-synced (1.0.4)\n• RU Close button in About"
};

/* ---------- preloader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("preloader").classList.add("done"), 700);
});
setTimeout(() => document.getElementById("preloader").classList.add("done"), 3500);

/* ---------- nav / burger / cursor / reveal ---------- */
const nav = document.getElementById("nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });
const burger = document.getElementById("burger"), mMenu = document.getElementById("mobileMenu");
burger.onclick = () => mMenu.classList.toggle("open");
mMenu.querySelectorAll("a").forEach(a => a.onclick = () => mMenu.classList.remove("open"));

const cursor = document.getElementById("cursor");
addEventListener("mousemove", e => {
  cursor.style.opacity = 1;
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("vis"); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* tilt cards */
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-3px)`;
    card.style.setProperty("--mx", ((x + .5) * 100) + "%");
    card.style.setProperty("--my", ((y + .5) * 100) + "%");
  });
  card.addEventListener("mouseleave", () => card.style.transform = "");
});

/* fake terminal loop */
const termLines = [
  `<div><span class="t-dim">[watcher]</span> новый файл: <span class="t-blue">CT_2026_10_04_001.dcm</span></div>`,
  `<div><span class="t-dim">[fix]</span> cp1251 → ISO_IR 144 <span class="t-green">✓</span> UID <span class="t-green">✓</span></div>`,
  `<div><span class="t-dim">[send]</span> C-STORE → ORTHANC:4242 <span class="t-green">✓ 142 ms</span></div>`,
  `<div><span class="t-dim">[watcher]</span> новый файл: <span class="t-blue">MR_brain_002.dcm</span></div>`,
  `<div><span class="t-dim">[fix]</span> транслит ГОСТ 7.79 <span class="t-green">✓</span> аноним. <span class="t-dim">skip</span></div>`,
  `<div><span class="t-dim">[send]</span> C-STORE → PACS:11112 <span class="t-green">✓ 98 ms</span></div>`,
  `<div><span class="t-dim">[queue]</span> ошибок: 0 • seen-кэш: 1 284 <span class="t-green">✓</span></div>`
];
let ti = 3;
const termBody = document.getElementById("termBody");
setInterval(() => {
  termBody.insertAdjacentHTML("beforeend", termLines[ti % termLines.length]);
  ti++;
  while (termBody.children.length > 5) termBody.firstChild.remove();
}, 2200);

const hudFiles = ["IM_0042.dcm → <b>OK</b>", "CT_chest_117.dcm → <b>OK</b>", "XA_angio_09.dcm → <b>OK</b>", "MR_0344.dcm → <b>OK</b>"];
let hi = 0;
setInterval(() => {
  hi++;
  document.getElementById("hudFile").innerHTML = hudFiles[hi % hudFiles.length];
}, 2600);

/* ---------- THREE.JS black-blue 3D ---------- */
(function initBG() {
  if (!window.THREE) return;
  const canvas = document.getElementById("bg3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020610, 0.028);
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, .1, 200);
  camera.position.set(0, 0, 22);

  scene.add(new THREE.AmbientLight(0x3355ff, .7));
  const key = new THREE.PointLight(0x00d4ff, 90, 100); key.position.set(8, 6, 10); scene.add(key);
  const rim = new THREE.PointLight(0x2e7bff, 70, 100); rim.position.set(-10, -4, 6); scene.add(rim);

  // particles
  const N = 1600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const c1 = new THREE.Color(0x00d4ff), c2 = new THREE.Color(0x1a3faa);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 90;
    pos[i * 3 + 1] = (Math.random() - .5) * 55;
    pos[i * 3 + 2] = (Math.random() - .5) * 60;
    const c = Math.random() > .5 ? c1 : c2;
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const pg = new THREE.BufferGeometry();
  pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  pg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: .14, vertexColors: true, transparent: true, opacity: .9 }));
  scene.add(pts);

  // hero icosahedron wireframe (right side)
  const ico = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.2, 1),
    new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: .28 })
  );
  ico.position.set(11, 1, -4); scene.add(ico);
  const icoCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.2, 0),
    new THREE.MeshStandardMaterial({ color: 0x061a35, emissive: 0x0077ff, emissiveIntensity: .55, metalness: .8, roughness: .25, flatShading: true })
  );
  icoCore.position.copy(ico.position); scene.add(icoCore);

  // torus rings left
  const torus1 = new THREE.Mesh(new THREE.TorusGeometry(5.5, .07, 12, 120), new THREE.MeshBasicMaterial({ color: 0x2e7bff, transparent: true, opacity: .4 }));
  torus1.position.set(-13, -2, -8); torus1.rotation.x = 1.1; scene.add(torus1);
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(7.5, .04, 12, 120), new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: .25 }));
  torus2.position.set(-13, -2, -8); torus2.rotation.x = 1.3; scene.add(torus2);

  // floating cubes
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(.9, .9, .9);
  for (let i = 0; i < 26; i++) {
    const m = new THREE.Mesh(cubeGeo, new THREE.MeshStandardMaterial({
      color: 0x0a2547, emissive: 0x00aaff, emissiveIntensity: .25, metalness: .7, roughness: .3, transparent: true, opacity: .85
    }));
    m.position.set((Math.random() - .5) * 60, (Math.random() - .5) * 30, -6 - Math.random() * 18);
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    m.userData = { s: .3 + Math.random() * .8, o: Math.random() * 6.28 };
    cubes.push(m); scene.add(m);
  }

  // connecting lines grid (network feel)
  const lineMat = new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: .12 });
  for (let i = 0; i < 8; i++) {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-30 + i * 8, -8, -14), new THREE.Vector3(-22 + i * 8, 8, -14)
    ]);
    scene.add(new THREE.Line(g, lineMat));
  }

  let mx = 0, my = 0;
  addEventListener("mousemove", e => {
    mx = (e.clientX / innerWidth - .5) * 2;
    my = (e.clientY / innerHeight - .5) * 2;
  });

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    const mobile = innerWidth < 1000;
    ico.position.x = mobile ? 0 : 11; icoCore.position.x = ico.position.x;
    ico.position.y = mobile ? 4 : 1; icoCore.position.y = ico.position.y;
  }
  addEventListener("resize", resize); resize();

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    pts.rotation.y = t * .02;
    ico.rotation.y = t * .18; ico.rotation.x = t * .1;
    icoCore.rotation.y = -t * .3;
    torus1.rotation.z = t * .15; torus2.rotation.z = -t * .1;
    cubes.forEach(c => {
      c.rotation.x += .004 * c.userData.s; c.rotation.y += .006 * c.userData.s;
      c.position.y += Math.sin(t * .8 + c.userData.o) * .004;
    });
    camera.position.x += ((mx * 2.2) - camera.position.x) * .03;
    camera.position.y += ((-my * 1.4) - camera.position.y) * .03;
    camera.lookAt(0, 0, -4);
    renderer.render(scene, camera);
  })();
})();

/* ---------- GitHub releases: auto-sync ---------- */
const $ = id => document.getElementById(id);
const fmtMB = b => b ? (b / 1048576).toFixed(0) + " МБ" : "—";
const fmtDate = iso => { try { return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }); } catch { return iso; } };
const assetOf = r => (r.assets || []).find(a => /\.exe$/i.test(a.name)) || (r.assets || [])[0];

function applyLatest(r) {
  const a = assetOf(r);
  const tag = r.tag_name || FALLBACK.tag;
  const url = a ? a.browser_download_url : FALLBACK.url;
  const size = a ? a.size : FALLBACK.size;
  const totalDL = (r.assets || []).reduce((s, x) => s + (x.download_count || 0), 0);

  document.querySelector("[data-nav-ver]").textContent = tag;
  document.querySelector("[data-hero-ver]").textContent = tag;
  document.querySelector("[data-hero-size]").textContent = "Windows • ~" + fmtMB(size);
  document.querySelector("[data-stat-ver]").textContent = tag;

  $("latestName").textContent = r.name || ("DicomBridge " + tag);
  $("latestDate").textContent = fmtDate(r.published_at || r.created_at);
  $("latestBody").textContent = (r.body || FALLBACK.body).slice(0, 600);
  $("latestSize").textContent = "⬇ " + (a ? a.name : "Setup.exe") + " • " + fmtMB(size);
  $("latestCount").textContent = "∑ " + totalDL + " загрузок";
  document.querySelector("[data-stat-count]").textContent = totalDL;
  $("latestBtn").href = url;
  $("heroDownload").href = "#download";
  $("liveBadge").textContent = `LIVE • ${tag} • обновлено ${fmtDate(r.published_at || r.created_at)}`;
}

function renderList(releases) {
  $("relCount").textContent = releases.length + " релизов";
  $("releasesList").innerHTML = releases.map((r, i) => {
    const a = assetOf(r);
    const dl = (r.assets || []).reduce((s, x) => s + (x.download_count || 0), 0);
    return `<div class="rel">
      <div class="rel-top"><b>${r.name || r.tag_name}</b><span class="pill ${i === 0 ? "" : "old"}">${i === 0 ? "LATEST" : r.tag_name}</span></div>
      <div class="rel-meta mono">${fmtDate(r.published_at || r.created_at)} • ${a ? fmtMB(a.size) : ""} • ${dl} загрузок</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${a ? `<a class="dl" href="${a.browser_download_url}">⬇ ${a.name}</a>` : ""}
        <a class="dl ghost" href="${r.html_url}" target="_blank" rel="noopener">Страница релиза ↗</a>
      </div>
    </div>`;
  }).join("");
}

async function loadReleases() {
  $("liveBadge").textContent = "LIVE • проверяем GitHub-релизы…";
  try {
    const res = await fetch(API, { headers: { "Accept": "application/vnd.github+json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error("empty");
    applyLatest(data[0]);
    renderList(data);
  } catch (e) {
    console.warn("GitHub API fallback:", e);
    applyLatest({ tag_name: FALLBACK.tag, name: FALLBACK.name, published_at: FALLBACK.date, body: FALLBACK.body, assets: [{ name: "DicomBridge-Setup.exe", size: FALLBACK.size, download_count: FALLBACK.downloads, browser_download_url: FALLBACK.url }] });
    $("releasesList").innerHTML = `<div class="loading">GitHub API недоступен (лимит/офлайн). Показана версия ${FALLBACK.tag} — <a class="link" href="https://github.com/${REPO}/releases" target="_blank" rel="noopener">открыть релизы вручную ↗</a><br><br><button class="btn-ghost" onclick="loadReleases()" style="padding:10px 18px">⟳ Попробовать снова</button></div>`;
    $("relCount").textContent = "offline-режим";
    $("liveBadge").textContent = `CACHE • ${FALLBACK.tag} • нет связи с API`;
  }
}
document.getElementById("refreshBtn").onclick = loadReleases;
window.loadReleases = loadReleases;
loadReleases();
setInterval(loadReleases, 5 * 60 * 1000); // автообновление каждые 5 минут
