const SUPABASE_URL = "https://khnfwiumfxpqzmwoyhbx.supabase.co";
const SUPABASE_KEY = "sb_publishable_1Dc2DB9h1p3bKm4yrm6SVA_qA693feK";
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

const $registerForm = document.getElementById("registerForm");
const $registerNombre = document.getElementById("registerNombre");
const $registerEmail = document.getElementById("registerEmail");
const $registerPassword = document.getElementById("registerPassword");
const $loginForm = document.getElementById("loginForm");
const $loginEmail = document.getElementById("loginEmail");
const $loginPassword = document.getElementById("loginPassword");
const $authMsg = document.getElementById("authMsg");
const $goToLogin = document.getElementById("goToLogin");
const $goToRegister = document.getElementById("goToRegister");

function setAuthMessage(msg, isError = false) {
  $authMsg.textContent = msg || "";
  $authMsg.style.color = isError ? "#c82f2f" : "";
}

function setAuthMode(mode) {
  const toRegister = mode === "register";
  $loginForm.classList.toggle("hidden", toRegister);
  $registerForm.classList.toggle("hidden", !toRegister);
  setAuthMessage("");
}

$goToRegister.addEventListener("click", () => setAuthMode("register"));
$goToLogin.addEventListener("click", () => setAuthMode("login"));

$registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!supabaseClient) {
    setAuthMessage("Supabase Auth no está disponible.", true);
    return;
  }

  const nombre = $registerNombre.value.trim();
  const email = $registerEmail.value.trim().toLowerCase();
  const password = $registerPassword.value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { nombre } }
  });

  if (error) {
    setAuthMessage(error.message, true);
    return;
  }

  setAuthMode("login");
  setAuthMessage("Cuenta creada. Inicia sesión para entrar.");
  $registerForm.reset();
});

$loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!supabaseClient) {
    setAuthMessage("Supabase Auth no está disponible.", true);
    return;
  }

  const email = $loginEmail.value.trim().toLowerCase();
  const password = $loginPassword.value;
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    setAuthMessage(error.message, true);
    return;
  }

  setAuthMessage("Sesión iniciada. Redirigiendo...");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 450);
});

(async () => {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  if (data?.session?.user) {
    window.location.href = "index.html";
  }
})();
