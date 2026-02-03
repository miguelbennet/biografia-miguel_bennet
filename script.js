const MAINTENANCE = true; // true liga, false desliga

const isMaintenance = location.pathname.endsWith("manutencao.html");

// URLs absolutas calculadas a partir do lugar onde o site está (/biografia-miguel_bennet/)
const maintenanceUrl = new URL("manutencao.html", location.href).href;
const homeUrl = new URL("index.html", location.href).href;

if (MAINTENANCE && !isMaintenance) {
  location.replace(maintenanceUrl);
}

if (!MAINTENANCE && isMaintenance) {
  location.replace(homeUrl);
}

// Tema + toast + copiar + nav ativo + accordion (funcoes)

(() => {
  // ---------- TOAST ----------
  const showToast = (msg, ms = 1800) => {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.setAttribute("role", "status");
      t.setAttribute("aria-live", "polite");
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => t.classList.remove("show"), ms);
  };

  // ---------- NAV ATIVO ----------
  const page = document.querySelector(".page")?.getAttribute("data-page");
  if (page) {
    document.querySelectorAll(".nav a[data-nav]").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("data-nav") === page);
    });
  }

  // ---------- COPIAR (ROBUSTO) ----------
  const copyText = async (text) => {
    // Se o navegador permitir clipboard moderno
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback (file:// e navegadores chatos)
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.top = "-9999px";
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(input);
    return ok;
  };

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = (btn.getAttribute("data-copy") || "").trim();

      if (!text) {
        showToast("Nada pra copiar. Arruma o data-copy aí.", 2000);
        return;
      }

      try {
        const ok = await copyText(text);
        if (!ok) throw new Error("copy_failed");

        btn.classList.add("copied");
        showToast("Copiado ✅");
        setTimeout(() => btn.classList.remove("copied"), 900);
      } catch {
        showToast("Não consegui copiar. Teu navegador travou no serviço.", 2200);
      }
    });
  });

  // ---------- TEMA (persistência + ícone) ----------
  const themeBtn = document.getElementById("themeBtn");

  const applySavedTheme = () => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) document.documentElement.setAttribute("data-theme", saved);
    } catch {}
  };

  const updateThemeIcon = () => {
    if (!themeBtn) return;
    const t = document.documentElement.getAttribute("data-theme") || "dark";
    themeBtn.textContent = t === "light" ? "☾" : "☀";
  };

  applySavedTheme();
  updateThemeIcon();

  themeBtn?.addEventListener("click", () => {
    const curr = document.documentElement.getAttribute("data-theme") || "dark";
    const next = curr === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);

    try { localStorage.setItem("theme", next); } catch {}

    updateThemeIcon();
    showToast(next === "light" ? "Modo claro ligado." : "Modo escuro ligado.");
  });

  // ---------- ACCORDION (funcoes) ----------
  const accButtons = document.querySelectorAll(".acc-btn");
  if (accButtons.length) {
    accButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        if (!panel || !panel.classList.contains("acc-panel")) return;

        const isOpen = panel.classList.contains("open");

        // fecha tudo
        document.querySelectorAll(".acc-panel.open").forEach((p) => p.classList.remove("open"));
        document.querySelectorAll(".acc-btn[aria-expanded='true']").forEach((b) =>
          b.setAttribute("aria-expanded", "false")
        );

        // abre o clicado
        if (!isOpen) {
          panel.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }
})();




