/* DicomBridge — минимализм: легкий 3D фон + live релизы с GitHub */
const REPO = "dosik74/DicomBridge";
const API = `https://api.github.com/repos/${REPO}/releases`;
const FALLBACK = {
  tag: "v1.0.4", name: "DicomBridge v1.0.4",
  size: 282220702,
  url: `https://github.com/${REPO}/releases/latest/download/DicomBridge-Setup.exe`
};

/* --- легкий 3D фон: частицы + параллакс --- */
(function bg() {
  if (!window.THREE) return;
  const canvas = document.getElementById("bg3d");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, .1, 200);
  camera.position.set(0, 0, 24);

  scene.add(new THREE.AmbientLight(0x4488ff, .8));
  const p1 = new THREE.PointLight(0x00c2ff, 80, 120); p1.position.set(10, 8, 10); scene.add(p1);

  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - .5) * 100;
    pos[i * 3 + 1] = (Math.random() - .5) * 60;
    pos[i * 3 + 2] = -5 - Math.random() * 30;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x00b4e6, size: .16, transparent: true, opacity: .7 }));
  scene.add(pts);

  // пара больших колец по бокам — «3D-объекты», но ненавязчиво
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(7, .08, 10, 100),
    new THREE.MeshBasicMaterial({ color: 0x2e7bff, transparent: true, opacity: .35 }));
  ring1.position.set(-16, 2, -10); ring1.rotation.x = 1.2; scene.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(9, .05, 10, 100),
    new THREE.MeshBasicMaterial({ color: 0x00c2ff, transparent: true, opacity: .22 }));
  ring2.position.set(17, -3, -12); ring2.rotation.x = 1.1; scene.add(ring2);

  let mx = 0, my = 0;
  addEventListener("mousemove", e => {
    mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
  });
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", resize); resize();

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    pts.rotation.y = t * .015;
    ring1.rotation.z = t * .12; ring2.rotation.z = -t * .08;
    camera.position.x += (mx * 3 - camera.position.x) * .03;
    camera.position.y += (-my * 2 - camera.position.y) * .03;
    camera.lookAt(0, 0, -10);
    renderer.render(scene, camera);
  })();
})();

/* --- live релизы: новый релиз на GitHub = новая кнопка здесь --- */
const $ = id => document.getElementById(id);
const fmtMB = b => (b / 1048576).toFixed(0) + " МБ";

async function load() {
  try {
    const r = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw 0;
    const d = await r.json();
    if (!d.length) throw 0;
    const latest = d[0];
    const exe = (latest.assets || []).find(a => /\.exe$/i.test(a.name)) || latest.assets[0];
    const tag = latest.tag_name || FALLBACK.tag;
    $("verPill").textContent = `${tag} • бесплатно • open source`;
    $("dlName").textContent = latest.name || ("DicomBridge " + tag);
    $("dlMeta").textContent = `Windows • ${exe ? exe.name + " • " + fmtMB(exe.size) : ""}`;
    $("dlBtn").href = exe ? exe.browser_download_url : FALLBACK.url;
    $("dlSub").textContent = `Последняя версия ${tag} — качай, она уже здесь.`;
    if (d.length > 1) {
      const prev = d[1];
      const pa = (prev.assets || [])[0];
      $("dlAlt").innerHTML = pa
        ? `Предыдущая: <a href="${pa.browser_download_url}" style="color:var(--blue)">${prev.tag_name}</a>`
        : "";
    }
  } catch {
    $("verPill").textContent = `${FALLBACK.tag} • бесплатно • open source`;
    $("dlName").textContent = FALLBACK.name;
    $("dlMeta").textContent = "Windows • DicomBridge-Setup.exe • ~269 МБ";
    $("dlBtn").href = FALLBACK.url;
    $("dlSub").textContent = "GitHub API недоступен — даём прямую ссылку на последний установщик.";
  }
}
load();
setInterval(load, 5 * 60 * 1000);
