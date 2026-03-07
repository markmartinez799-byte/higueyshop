    const STORAGE_KEY = "catalogo_articulos_v1";
    const SUPABASE_URL = "https://pmnxjnnhfvtexbcayzkj.supabase.co";
    const SUPABASE_KEY = "sb_publishable_REEMPLAZAR_POR_ANON_KEY";
    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    const PLACEHOLDER_IMG = "https://dummyimage.com/800x600/f0f0f0/777&text=Sin+imagen";
    const MAX_IMAGES = 50;
    const MAX_VIDEO_BYTES = 3 * 1024 * 1024;
    const ADMIN_EMAIL = "markmartinez799@gmail.com";
    const ADMIN_PASSWORD = "Marcos1807";
    const ADMIN_SESSION_KEY = "higüeyshop_admin_session_v1";
    const urlParams = new URLSearchParams(window.location.search);
    const requestedMode = urlParams.get("mode");
    const defaultAccessMode = requestedMode === "admin" ? "admin" : "user";

    const defaults = [
      {
        id: crypto.randomUUID(),
        nombre: "Smartwatch X10",
        precio: 2450,
        precioAnterior: 3100,
        imagenes: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Electronica",
        descripcion: "Pantalla tactil, monitoreo de salud y bateria de 5 dias.",
        rating: 4.8,
        ventas: 380
      },
      {
        id: crypto.randomUUID(),
        nombre: "Auriculares Pro Bass",
        precio: 1850,
        precioAnterior: 2400,
        imagenes: [
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Electronica",
        descripcion: "Sonido envolvente y cancelacion pasiva de ruido.",
        rating: 4.6,
        ventas: 890
      },
      {
        id: crypto.randomUUID(),
        nombre: "Mochila Travel Max",
        precio: 1300,
        precioAnterior: 1690,
        imagenes: [
          "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1622560480605-d83c661b4a6d?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Moda",
        descripcion: "Impermeable, ligera y con espacio para laptop 15 pulgadas.",
        rating: 4.5,
        ventas: 560
      }
    ];

    const $nombre = document.getElementById("nombre");
    const $categoria = document.getElementById("categoria");
    const $precio = document.getElementById("precio");
    const $precioAnterior = document.getElementById("precioAnterior");
    const $rating = document.getElementById("rating");
    const $imagenesArchivos = document.getElementById("imagenesArchivos");
    const $videoArchivo = document.getElementById("videoArchivo");
    const $imagenesUrls = document.getElementById("imagenesUrls");
    const $descripcion = document.getElementById("descripcion");
    const $agregar = document.getElementById("agregar");
    const $cancelarEdicion = document.getElementById("cancelarEdicion");
    const $formTitulo = document.getElementById("formTitulo");
    const $productos = document.getElementById("productos");
    const $conteo = document.getElementById("conteo");
    const $adminApp = document.getElementById("adminApp");
    const $adminLoginPanel = document.getElementById("adminLoginPanel");
    const $adminLoginForm = document.getElementById("adminLoginForm");
    const $adminEmail = document.getElementById("adminEmail");
    const $adminPassword = document.getElementById("adminPassword");
    const $adminAuthMsg = document.getElementById("adminAuthMsg");
    const $adminLogoutBtn = document.getElementById("adminLogoutBtn");
    const $modoUserBtn = document.getElementById("modoUserBtn");
    const $modoAdminBtn = document.getElementById("modoAdminBtn");
    const $userAccessBox = document.getElementById("userAccessBox");
    const $adminAccessBox = document.getElementById("adminAccessBox");
    const $userRegisterForm = document.getElementById("userRegisterForm");
    const $userRegisterNombre = document.getElementById("userRegisterNombre");
    const $userRegisterEmail = document.getElementById("userRegisterEmail");
    const $userRegisterPassword = document.getElementById("userRegisterPassword");
    const $userLoginForm = document.getElementById("userLoginForm");
    const $userLoginEmail = document.getElementById("userLoginEmail");
    const $userLoginPassword = document.getElementById("userLoginPassword");
    const $userGoToLogin = document.getElementById("userGoToLogin");
    const $userGoToRegister = document.getElementById("userGoToRegister");

    function parsePrecio(value) {
      if (typeof value === "number") return value;
      const num = String(value || "").replace(/[^\d.]/g, "");
      return Number(num) || 0;
    }

    function money(value) {
      return `RD$ ${Math.round(value).toLocaleString("es-DO")}`;
    }

    function clampRating(value) {
      const n = Number(value);
      if (!n) return 4;
      if (n < 1) return 1;
      if (n > 5) return 5;
      return n;
    }

    function normalize(producto) {
      const precio = parsePrecio(producto.precio);
      const precioAnteriorRaw = parsePrecio(producto.precioAnterior || producto.precio);
      const precioAnterior = precioAnteriorRaw < precio ? precio : precioAnteriorRaw;
      const legacy = producto.imagen ? [producto.imagen] : [];
      const imagenes = (Array.isArray(producto.imagenes) ? producto.imagenes : legacy)
        .filter(Boolean)
        .slice(0, MAX_IMAGES);

      if (!imagenes.length) imagenes.push(PLACEHOLDER_IMG);

      return {
        id: producto.id || crypto.randomUUID(),
        nombre: producto.nombre || "Producto sin nombre",
        precio,
        precioAnterior,
        imagenes,
        video: producto.video || "",
        categoria: producto.categoria || "General",
        descripcion: producto.descripcion || "Sin descripcion",
        rating: clampRating(producto.rating),
        ventas: Number(producto.ventas) || 0
      };
    }

    function mapSupabaseProducto(row) {
      const imgs = Array.isArray(row.imagenes) ? row.imagenes : [];
      const fallback = row.imagen ? [row.imagen] : [PLACEHOLDER_IMG];
      return {
        id: row.id,
        nombre: row.nombre,
        precio: row.precio,
        precioAnterior: row.precio_anterior ?? row.precio,
        imagenes: (imgs.length ? imgs : fallback),
        video: row.video || "",
        categoria: row.categoria || "General",
        descripcion: row.descripcion || "",
        rating: Number(row.rating) || 4.5,
        ventas: Number(row.ventas) || 0
      };
    }

    function toSupabaseProducto(producto) {
      return {
        nombre: producto.nombre,
        precio: producto.precio,
        precio_anterior: producto.precioAnterior ?? producto.precio,
        imagen: (producto.imagenes && producto.imagenes[0]) || PLACEHOLDER_IMG,
        imagenes: (producto.imagenes && producto.imagenes.length ? producto.imagenes : [PLACEHOLDER_IMG]),
        video: producto.video || "",
        categoria: producto.categoria || "General",
        descripcion: producto.descripcion || "",
        rating: Number(producto.rating) || 4.5,
        ventas: Number(producto.ventas) || 0
      };
    }

    async function cargarProductosSupabase() {
      if (!supabaseClient) return null;
      const { data, error } = await supabaseClient
        .from("productos")
        .select("*");
      if (error) return null;
      return Array.isArray(data) ? data.map(mapSupabaseProducto) : [];
    }

    async function guardarProductoSupabase(producto) {
      if (!supabaseClient) return false;
      const { data, error } = await supabaseClient
        .from("productos")
        .insert(toSupabaseProducto(producto))
        .select("*")
        .single();
      if (error) return false;
      return mapSupabaseProducto(data);
    }

    async function actualizarProductoSupabase(producto) {
      if (!supabaseClient) return false;
      const { data, error } = await supabaseClient
        .from("productos")
        .update(toSupabaseProducto(producto))
        .eq("id", producto.id)
        .select("*")
        .single();
      if (error) return false;
      return mapSupabaseProducto(data);
    }

    async function eliminarProductoSupabase(productId) {
      if (!supabaseClient) return false;
      const { error } = await supabaseClient
        .from("productos")
        .delete()
        .eq("id", productId);
      return !error;
    }

    function cargar() {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaults.map(normalize);
      try {
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) return defaults.map(normalize);
        return parsed.map(normalize);
      } catch {
        return defaults.map(normalize);
      }
    }

    let catalogo = cargar();
    let editingProductId = null;

    function guardar() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo));
    }

    function setAdminAuthUI(isAuth) {
      $adminApp.classList.toggle("hidden", !isAuth);
      $adminLoginPanel.classList.toggle("hidden", isAuth);
      $adminLogoutBtn.classList.toggle("hidden", !isAuth);
      if (isAuth) render();
    }

    function isAdminAuthenticated() {
      return localStorage.getItem(ADMIN_SESSION_KEY) === "ok";
    }

    function setAuthMessage(msg, isError = false) {
      $adminAuthMsg.textContent = msg || "";
      $adminAuthMsg.style.color = isError ? "#c82f2f" : "";
    }

    function setAccessMode(mode) {
      const isAdminMode = mode === "admin";
      $adminAccessBox.classList.toggle("hidden", !isAdminMode);
      $userAccessBox.classList.toggle("hidden", isAdminMode);
      $modoAdminBtn.classList.toggle("active-mode", isAdminMode);
      $modoUserBtn.classList.toggle("active-mode", !isAdminMode);
      setAuthMessage("");
    }

    function setUserAuthMode(mode) {
      const toRegister = mode === "register";
      $userLoginForm.classList.toggle("hidden", toRegister);
      $userRegisterForm.classList.toggle("hidden", !toRegister);
      setAuthMessage("");
    }

    async function adminHasSupabaseSession() {
      if (!supabaseClient) return false;
      const { data } = await supabaseClient.auth.getSession();
      const email = data?.session?.user?.email?.toLowerCase();
      return Boolean(data?.session && email === ADMIN_EMAIL);
    }

    async function initData() {
      const remoteProductos = await cargarProductosSupabase();
      if (Array.isArray(remoteProductos) && remoteProductos.length) {
        catalogo = remoteProductos.map(normalize);
        guardar();
      }
      render();
    }

    function fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
        reader.readAsDataURL(file);
      });
    }

    async function buildImagenes() {
      const files = Array.from($imagenesArchivos.files || []).slice(0, MAX_IMAGES);
      const fileImgs = await Promise.all(files.map(fileToDataURL));

      const urlImgs = $imagenesUrls.value
        .split(/\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);

      const all = [...fileImgs, ...urlImgs].filter(Boolean).slice(0, MAX_IMAGES);
      return all;
    }

    async function buildVideo() {
      const file = $videoArchivo.files?.[0];
      if (!file) return "";
      if (file.size > MAX_VIDEO_BYTES) {
        throw new Error("El video supera 3 MB.");
      }
      return fileToDataURL(file);
    }

    function crearCard(producto) {
      const card = document.createElement("article");
      card.className = "admin-card";
      card.innerHTML = `
        <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
        <div>
          <h3>${producto.nombre}</h3>
          <p class="sub">${producto.categoria} | ${producto.rating.toFixed(1)} stars | ${producto.imagenes.length} imagen(es)${producto.video ? " | video" : ""}</p>
          <p><strong>${money(producto.precio)}</strong> <span style="text-decoration:line-through;color:#888;">${money(producto.precioAnterior)}</span></p>
          <p class="sub">${producto.descripcion}</p>
        </div>
        <div class="actions-inline" style="justify-content:flex-end;align-items:start;">
          <button class="btn secondary" data-edit-id="${producto.id}">Editar</button>
          <button class="btn danger" data-id="${producto.id}">Quitar</button>
        </div>
      `;
      return card;
    }

    function render() {
      $productos.innerHTML = "";
      $conteo.textContent = `${catalogo.length} producto${catalogo.length === 1 ? "" : "s"}`;

      if (!catalogo.length) {
        $productos.innerHTML = '<div class="vacio">No hay productos cargados.</div>';
        return;
      }

      catalogo.forEach((producto) => $productos.appendChild(crearCard(producto)));
    }

    function limpiarFormulario() {
      $nombre.value = "";
      $categoria.value = "";
      $precio.value = "";
      $precioAnterior.value = "";
      $rating.value = "";
      $imagenesArchivos.value = "";
      $videoArchivo.value = "";
      $imagenesUrls.value = "";
      $descripcion.value = "";
    }

    function setEditMode(producto = null) {
      editingProductId = producto ? producto.id : null;
      const isEditing = Boolean(producto);
      $formTitulo.textContent = isEditing ? "Editar producto" : "Agregar producto";
      $agregar.textContent = isEditing ? "Guardar cambios del articulo" : "Agregar articulos de venta";
      $cancelarEdicion.classList.toggle("hidden", !isEditing);
      if (!isEditing) {
        limpiarFormulario();
        return;
      }
      $nombre.value = producto.nombre || "";
      $categoria.value = producto.categoria || "";
      $precio.value = Number(producto.precio) || 0;
      $precioAnterior.value = Number(producto.precioAnterior) || Number(producto.precio) || 0;
      $rating.value = Number(producto.rating) || 4.5;
      $imagenesArchivos.value = "";
      $videoArchivo.value = "";
      $imagenesUrls.value = Array.isArray(producto.imagenes) ? producto.imagenes.join("\n") : "";
      $descripcion.value = producto.descripcion || "";
      $nombre.focus();
    }

    $agregar.addEventListener("click", async () => {
      const nombre = $nombre.value.trim();
      const categoria = $categoria.value.trim();
      const precio = Number($precio.value);
      const precioAnterior = Number($precioAnterior.value || $precio.value);
      const rating = Number($rating.value || 4.5);
      const descripcion = $descripcion.value.trim();

      if (!nombre || !categoria || !precio) {
        alert("Completa nombre, categoria y precio.");
        return;
      }

      let imagenes = [];
      let video = "";
      try {
        imagenes = await buildImagenes();
        video = await buildVideo();
      } catch {
        alert("No se pudo procesar una imagen o el video (recuerda: video maximo 3 MB).");
        return;
      }

      if (!imagenes.length && !editingProductId) {
        alert("Agrega al menos una imagen (archivo o URL).");
        return;
      }

      const currentEditing = editingProductId ? catalogo.find((p) => String(p.id) === String(editingProductId)) : null;
      const imagenesFinales = imagenes.length
        ? imagenes
        : (currentEditing?.imagenes && currentEditing.imagenes.length ? currentEditing.imagenes : []);
      const videoFinal = video || currentEditing?.video || "";

      const nuevoProducto = normalize({
        id: currentEditing?.id || crypto.randomUUID(),
        nombre,
        categoria,
        imagenes: imagenesFinales,
        video: videoFinal,
        precio,
        precioAnterior,
        rating,
        descripcion,
        ventas: currentEditing?.ventas || 0
      });

      if (editingProductId) {
        catalogo = catalogo.map((p) => (String(p.id) === String(editingProductId) ? nuevoProducto : p));
        guardar();
        const remoteUpdated = await actualizarProductoSupabase(nuevoProducto);
        if (remoteUpdated) {
          catalogo = catalogo.map((p) => (String(p.id) === String(editingProductId) ? remoteUpdated : p));
          guardar();
        }
      } else {
        catalogo.unshift(nuevoProducto);
        guardar();
        const remoteProducto = await guardarProductoSupabase(nuevoProducto);
        if (remoteProducto && remoteProducto.id !== undefined && remoteProducto.id !== null) {
          nuevoProducto.id = remoteProducto.id;
          guardar();
        }
      }

      setEditMode(null);
      render();
    });

    $productos.addEventListener("click", async (e) => {
      const editBtn = e.target.closest("button[data-edit-id]");
      if (editBtn) {
        const productId = editBtn.dataset.editId;
        const producto = catalogo.find((p) => String(p.id) === String(productId));
        if (producto) setEditMode(producto);
        return;
      }

      const deleteBtn = e.target.closest("button[data-id]");
      if (!deleteBtn) return;
      const productId = deleteBtn.dataset.id;
      catalogo = catalogo.filter((p) => String(p.id) !== String(productId));
      guardar();
      await eliminarProductoSupabase(productId);
      if (String(editingProductId) === String(productId)) setEditMode(null);
      render();
    });

    $cancelarEdicion.addEventListener("click", () => {
      setEditMode(null);
    });

    window.addEventListener("storage", () => {
      catalogo = cargar();
      render();
    });

    $adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = $adminEmail.value.trim().toLowerCase();
      const password = $adminPassword.value;
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        setAuthMessage("Credenciales admin incorrectas.", true);
        return;
      }

      if (supabaseClient) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });
        if (error) {
          setAuthMessage(`No se pudo autenticar en Supabase: ${error.message}`, true);
          return;
        }
      }

      localStorage.setItem(ADMIN_SESSION_KEY, "ok");
      setAuthMessage("");
      $adminLoginForm.reset();
      setAdminAuthUI(true);
      await initData();
    });

    $adminLogoutBtn.addEventListener("click", async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      localStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminAuthUI(false);
      setAccessMode(defaultAccessMode);
    });

    $modoUserBtn.addEventListener("click", () => setAccessMode("user"));
    $modoAdminBtn.addEventListener("click", () => setAccessMode("admin"));
    $userGoToRegister.addEventListener("click", () => setUserAuthMode("register"));
    $userGoToLogin.addEventListener("click", () => setUserAuthMode("login"));

    $userRegisterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!supabaseClient) {
        setAuthMessage("Supabase Auth no esta disponible.", true);
        return;
      }

      const nombre = $userRegisterNombre.value.trim();
      const email = $userRegisterEmail.value.trim().toLowerCase();
      const password = $userRegisterPassword.value;

      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { nombre } }
      });

      if (error) {
        setAuthMessage(error.message, true);
        return;
      }

      $userRegisterForm.reset();
      setUserAuthMode("login");
      setAuthMessage("Cuenta creada. Inicia sesion para entrar a la tienda.");
    });

    $userLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!supabaseClient) {
        setAuthMessage("Supabase Auth no esta disponible.", true);
        return;
      }

      const email = $userLoginEmail.value.trim().toLowerCase();
      const password = $userLoginPassword.value;
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthMessage(error.message, true);
        return;
      }

      setAuthMessage("Sesion iniciada. Redirigiendo...");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 350);
    });

    const bootAdmin = async () => {
      const uiAuth = isAdminAuthenticated();
      const apiAuth = await adminHasSupabaseSession();
      if (uiAuth && apiAuth) {
        setAdminAuthUI(true);
        initData();
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminAuthUI(false);
        setAccessMode(defaultAccessMode);
        setUserAuthMode("login");
      }
    };

    setAdminAuthUI(false);
    setAccessMode(defaultAccessMode);
    setUserAuthMode("login");
    bootAdmin();
