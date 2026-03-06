const THEME_STORAGE_KEY = "higueyshop_theme_mode_v1";
const THEME_MODES = ["auto", "dark", "light"];
const themeToggleBtn = document.getElementById("themeToggle");
const mediaDark = window.matchMedia("(prefers-color-scheme: dark)");

function readThemeMode() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_MODES.includes(saved) ? saved : "auto";
}

function writeThemeMode(mode) {
  localStorage.setItem(THEME_STORAGE_KEY, mode);
}

function setThemeButtonLabel(mode) {
  if (!themeToggleBtn) return;
  if (mode === "dark") themeToggleBtn.textContent = "Tema: Oscuro";
  else if (mode === "light") themeToggleBtn.textContent = "Tema: Claro";
  else themeToggleBtn.textContent = "Tema: Auto";
}

function applyTheme(mode) {
  if (mode === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (mode === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  setThemeButtonLabel(mode);
}

function nextMode(current) {
  const idx = THEME_MODES.indexOf(current);
  return THEME_MODES[(idx + 1) % THEME_MODES.length];
}

let activeThemeMode = readThemeMode();
applyTheme(activeThemeMode);

themeToggleBtn?.addEventListener("click", () => {
  activeThemeMode = nextMode(activeThemeMode);
  writeThemeMode(activeThemeMode);
  applyTheme(activeThemeMode);
});

mediaDark.addEventListener("change", () => {
  if (activeThemeMode === "auto") applyTheme("auto");
});
