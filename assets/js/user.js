const SUPABASE_URL = "https://pmnxjnnhfvtexbcayzkj.supabase.co";
const SUPABASE_KEY = "sb_publishable_REEMPLAZAR_POR_ANON_KEY";
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
const $switchLogin = document.getElementById("switchLogin");
const $switchRegister = document.getElementById("switchRegister");
const $switchAdmin = document.getElementById("switchAdmin");
const $forgotPassword = document.getElementById("forgotPassword");
const $toggleLoginPassword = document.getElementById("toggleLoginPassword");
const $toggleRegisterPassword = document.getElementById("toggleRegisterPassword");

function setAuthMessage(msg, isError = false) {
  $authMsg.textContent = msg || "";
  $authMsg.style.color = isError ? "#c82f2f" : "";
}

function setAuthMode(mode) {
  const toRegister = mode === "register";
  $loginForm.classList.toggle("hidden", toRegister);
  $registerForm.classList.toggle("hidden", !toRegister);
  $switchLogin?.classList.toggle("active", !toRegister);
  $switchRegister?.classList.toggle("active", toRegister);
  setAuthMessage("");
}

$goToRegister.addEventListener("click", () => setAuthMode("register"));
$goToLogin.addEventListener("click", () => setAuthMode("login"));
$switchLogin?.addEventListener("click", () => setAuthMode("login"));
$switchRegister?.addEventListener("click", () => setAuthMode("register"));
$switchAdmin?.addEventListener("click", () => {
  window.location.href = "admin.html?mode=admin";
});

function togglePassword(inputEl, buttonEl) {
  if (!inputEl || !buttonEl) return;
  const isHidden = inputEl.type === "password";
  inputEl.type = isHidden ? "text" : "password";
  buttonEl.textContent = isHidden ? "Ocultar" : "Ver";
}

$toggleLoginPassword?.addEventListener("click", () => {
  togglePassword($loginPassword, $toggleLoginPassword);
});

$toggleRegisterPassword?.addEventListener("click", () => {
  togglePassword($registerPassword, $toggleRegisterPassword);
});

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

$forgotPassword?.addEventListener("click", async () => {
  if (!supabaseClient) {
    setAuthMessage("Supabase Auth no está disponible.", true);
    return;
  }

  const email = $loginEmail.value.trim().toLowerCase();
  if (!email) {
    setAuthMessage("Escribe tu correo para recuperar contraseña.", true);
    $loginEmail.focus();
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin
  });

  if (error) {
    setAuthMessage(error.message, true);
    return;
  }

  setAuthMessage("Revisa tu correo para recuperar la contraseña.");
});

(async () => {
  if (!supabaseClient) return;
  const { data } = await supabaseClient.auth.getSession();
  if (data?.session?.user) {
    window.location.href = "index.html";
  }
})();
