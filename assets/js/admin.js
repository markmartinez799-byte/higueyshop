    const STORAGE_KEY = "catalogo_articulos_v1";
    const SUPABASE_URL = "https://khnfwiumfxpqzmwoyhbx.supabase.co";
    const SUPABASE_KEY = "sb_publishable_1Dc2DB9h1p3bKm4yrm6SVA_qA693feK";
    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    const PLACEHOLDER_IMG = "https://dummyimage.com/800x600/f0f0f0/777&text=Sin+imagen";
    const ADMIN_EMAIL = "markmartinez799@gmail.com";
    const ADMIN_PASSWORD = "Marcos1807";
    const ADMIN_SESSION_KEY = "higueyshop_admin_session_v1";

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
    const $imagenesUrls = document.getElementById("imagenesUrls");
    const $descripcion = document.getElementById("descripcion");
    const $agregar = document.getElementById("agregar");
    const $productos = document.getElementById("productos");
    const $conteo = document.getElementById("conteo");
    const $adminApp = document.getElementById("adminApp");
    const $adminLoginPanel = document.getElementById("adminLoginPanel");
    const $adminLoginForm = document.getElementById("adminLoginForm");
    const $adminEmail = document.getElementById("adminEmail");
    const $adminPassword = document.getElementById("adminPassword");
    const $adminAuthMsg = document.getElementById("adminAuthMsg");
    const $adminLogoutBtn = document.getElementById("adminLogoutBtn");

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
        .slice(0, 10);

      if (!imagenes.length) imagenes.push(PLACEHOLDER_IMG);

      return {
        id: producto.id || crypto.randomUUID(),
        nombre: producto.nombre || "Producto sin nombre",
        precio,
        precioAnterior,
        imagenes,
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
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === "ok";
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
      const files = Array.from($imagenesArchivos.files || []).slice(0, 10);
      const fileImgs = await Promise.all(files.map(fileToDataURL));

      const urlImgs = $imagenesUrls.value
        .split(/\n|,/)
        .map((v) => v.trim())
        .filter(Boolean);

      const all = [...fileImgs, ...urlImgs].filter(Boolean).slice(0, 10);
      return all;
    }

    function crearCard(producto) {
      const card = document.createElement("article");
      card.className = "admin-card";
      card.innerHTML = `
        <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
        <div>
          <h3>${producto.nombre}</h3>
          <p class="sub">${producto.categoria} | ${producto.rating.toFixed(1)} stars | ${producto.imagenes.length} imagen(es)</p>
          <p><strong>${money(producto.precio)}</strong> <span style="text-decoration:line-through;color:#888;">${money(producto.precioAnterior)}</span></p>
          <p class="sub">${producto.descripcion}</p>
        </div>
        <div class="actions-inline" style="justify-content:flex-end;align-items:start;">
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
      try {
        imagenes = await buildImagenes();
      } catch {
        alert("No se pudo procesar una de las imagenes.");
        return;
      }

      if (!imagenes.length) {
        alert("Agrega al menos una imagen (archivo o URL).");
        return;
      }

      const nuevoProducto = normalize({
        id: crypto.randomUUID(),
        nombre,
        categoria,
        imagenes,
        precio,
        precioAnterior,
        rating,
        descripcion,
        ventas: 0
      });

      catalogo.unshift(nuevoProducto);

      guardar();
      const remoteProducto = await guardarProductoSupabase(nuevoProducto);
      if (remoteProducto && remoteProducto.id !== undefined && remoteProducto.id !== null) {
        nuevoProducto.id = remoteProducto.id;
        guardar();
      }
      render();

      $nombre.value = "";
      $categoria.value = "";
      $precio.value = "";
      $precioAnterior.value = "";
      $rating.value = "";
      $imagenesArchivos.value = "";
      $imagenesUrls.value = "";
      $descripcion.value = "";
      $nombre.focus();
    });

    $productos.addEventListener("click", async (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      const productId = btn.dataset.id;
      catalogo = catalogo.filter((p) => p.id !== productId);
      guardar();
      await eliminarProductoSupabase(productId);
      render();
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
        $adminAuthMsg.textContent = "Credenciales admin incorrectas.";
        $adminAuthMsg.style.color = "#c82f2f";
        return;
      }

      if (supabaseClient) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD
        });
        if (error) {
          $adminAuthMsg.textContent = `No se pudo autenticar en Supabase: ${error.message}`;
          $adminAuthMsg.style.color = "#c82f2f";
          return;
        }
      }

      sessionStorage.setItem(ADMIN_SESSION_KEY, "ok");
      $adminAuthMsg.textContent = "";
      $adminLoginForm.reset();
      setAdminAuthUI(true);
      await initData();
    });

    $adminLogoutBtn.addEventListener("click", async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setAdminAuthUI(false);
    });

    const bootAdmin = async () => {
      const uiAuth = isAdminAuthenticated();
      const apiAuth = await adminHasSupabaseSession();
      if (uiAuth && apiAuth) {
        setAdminAuthUI(true);
        initData();
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setAdminAuthUI(false);
      }
    };

    setAdminAuthUI(false);
    bootAdmin();
