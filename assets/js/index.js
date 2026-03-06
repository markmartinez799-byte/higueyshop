    const STORAGE_KEY = "catalogo_articulos_v1";
    const REVIEW_STORAGE_KEY = "catalogo_resenas_v1";
    const SUPABASE_URL = "https://khnfwiumfxpqzmwoyhbx.supabase.co";
    const SUPABASE_KEY = "sb_publishable_1Dc2DB9h1p3bKm4yrm6SVA_qA693feK";
    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    const PLACEHOLDER_IMG = "https://dummyimage.com/800x600/f0f0f0/777&text=Sin+imagen";

    const defaults = [
      {
        id: crypto.randomUUID(),
        nombre: "Smartwatch X10",
        precio: 2450,
        precioAnterior: 3100,
        imagenes: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Electronica",
        descripcion: "Pantalla tactil, monitoreo de salud, notificaciones y bateria de 5 dias.",
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
        descripcion: "Sonido envolvente, microfono integrado y estuche de carga compacto.",
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
        descripcion: "Impermeable, ligera y con compartimento para laptop de 15 pulgadas.",
        rating: 4.5,
        ventas: 560
      },
      {
        id: crypto.randomUUID(),
        nombre: "Mini Proyector HD",
        precio: 4800,
        precioAnterior: 6200,
        imagenes: [
          "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Hogar",
        descripcion: "Ideal para peliculas en casa, entrada HDMI/USB y conectividad movil.",
        rating: 4.7,
        ventas: 210
      },
      {
        id: crypto.randomUUID(),
        nombre: "Set Cocina Premium",
        precio: 3550,
        precioAnterior: 4300,
        imagenes: [
          "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80"
        ],
        categoria: "Hogar",
        descripcion: "Utensilios resistentes al calor con acabado profesional y antideslizante.",
        rating: 4.4,
        ventas: 155
      }
    ];

    const $productos = document.getElementById("productos");
    const $conteo = document.getElementById("conteo");
    const $busqueda = document.getElementById("busqueda");
    const $orden = document.getElementById("orden");
    const $categorias = document.getElementById("categorias");
    const $carritoLista = document.getElementById("carritoLista");
    const $carritoTotal = document.getElementById("carritoTotal");
    const $vaciarCarrito = document.getElementById("vaciarCarrito");
    const $comprarTodo = document.getElementById("comprarTodo");
    const $authUserBadge = document.getElementById("authUserBadge");
    const $btnAuthOpen = document.getElementById("btnAuthOpen");
    const $btnAuthLogout = document.getElementById("btnAuthLogout");

    const $detalleProducto = document.getElementById("detalleProducto");
    const $cerrarDetalle = document.getElementById("cerrarDetalle");
    const $detalleImagenWrap = document.getElementById("detalleImagenWrap");
    const $detalleImagenPrincipal = document.getElementById("detalleImagenPrincipal");
    const $detalleGaleria = document.getElementById("detalleGaleria");
    const $zoomBtn = document.getElementById("zoomBtn");
    const $detalleNombre = document.getElementById("detalleNombre");
    const $detalleMeta = document.getElementById("detalleMeta");
    const $detallePrecio = document.getElementById("detallePrecio");
    const $detallePrecioAnterior = document.getElementById("detallePrecioAnterior");
    const $detalleDescripcion = document.getElementById("detalleDescripcion");
    const $detalleAgregarCarrito = document.getElementById("detalleAgregarCarrito");
    const $detalleComprar = document.getElementById("detalleComprar");
    const $recomendaciones = document.getElementById("recomendaciones");
    const $reviewPromedio = document.getElementById("reviewPromedio");
    const $reviewStars = document.getElementById("reviewStars");
    const $reviewTotal = document.getElementById("reviewTotal");
    const $reviewForm = document.getElementById("reviewForm");
    const $reviewNombre = document.getElementById("reviewNombre");
    const $reviewRating = document.getElementById("reviewRating");
    const $reviewTexto = document.getElementById("reviewTexto");
    const $reviewFoto = document.getElementById("reviewFoto");
    const $reviewList = document.getElementById("reviewList");
    const $imageLightbox = document.getElementById("imageLightbox");
    const $lightboxImage = document.getElementById("lightboxImage");
    const $lightboxClose = document.getElementById("lightboxClose");
    const $lightboxPrev = document.getElementById("lightboxPrev");
    const $lightboxNext = document.getElementById("lightboxNext");

    const state = {
      q: "",
      categoria: "Todas",
      orden: "relevancia",
      carrito: [],
      selectedId: null,
      selectedImage: 0,
      user: null,
      zoomScale: 1,
      panX: 0,
      panY: 0,
      isDraggingZoom: false,
      dragStartX: 0,
      dragStartY: 0
    };

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

    function clampReviewRating(value) {
      const n = Number(value);
      if (!n) return 0;
      if (n < 1) return 1;
      if (n > 5) return 5;
      return Math.round(n);
    }

    function fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
        reader.readAsDataURL(file);
      });
    }

    function esc(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    function stars(n) {
      const val = clampReviewRating(n);
      return "★★★★★".slice(0, val) + "☆☆☆☆☆".slice(0, 5 - val);
    }

    function authName(user) {
      if (!user) return "Invitado";
      const metaName = user.user_metadata?.nombre || user.user_metadata?.name;
      return metaName || user.email || "Cliente";
    }

    function renderAuthUI() {
      const logged = Boolean(state.user);
      $authUserBadge.textContent = logged ? authName(state.user) : "Invitado";
      $btnAuthLogout.classList.toggle("hidden", !logged);
      $btnAuthOpen.classList.toggle("hidden", logged);
      if (logged) {
        $reviewNombre.value = authName(state.user);
      }
    }

    function requireAuth() {
      if (state.user) return true;
      alert("Debes iniciar sesión como cliente para continuar.");
      window.location.href = "admin.html";
      return false;
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
        descripcion: producto.descripcion || "Sin descripcion disponible.",
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

    function mapSupabaseResena(row) {
      return {
        id: row.id,
        nombre: row.nombre,
        texto: row.texto,
        rating: row.rating,
        foto: row.foto,
        approvals: row.approvals,
        createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now()
      };
    }

    async function cargarProductosSupabase() {
      if (!supabaseClient) return null;
      const { data, error } = await supabaseClient
        .from("productos")
        .select("*")
        .order("id", { ascending: false });
      if (error) return null;
      return Array.isArray(data) ? data.map(mapSupabaseProducto) : [];
    }

    async function cargarResenasSupabase() {
      if (!supabaseClient) return null;
      const { data, error } = await supabaseClient
        .from("resenas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return null;

      const grouped = {};
      (Array.isArray(data) ? data : []).forEach((row) => {
        const pid = row.producto_id;
        if (!grouped[pid]) grouped[pid] = [];
        grouped[pid].push(mapSupabaseResena(row));
      });
      return grouped;
    }

    async function crearResenaSupabase(productId, review) {
      if (!supabaseClient) return false;
      const { error } = await supabaseClient.from("resenas").upsert({
        id: review.id,
        producto_id: productId,
        nombre: review.nombre,
        texto: review.texto,
        rating: review.rating,
        foto: review.foto,
        approvals: review.approvals,
        created_at: new Date(review.createdAt).toISOString()
      });
      return !error;
    }

    async function aprobarResenaSupabase(reviewId, approvals) {
      if (!supabaseClient) return false;
      const { error } = await supabaseClient
        .from("resenas")
        .update({ approvals })
        .eq("id", reviewId);
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
    let reviewsByProduct = cargarResenas();

    function cargarResenas() {
      const data = localStorage.getItem(REVIEW_STORAGE_KEY);
      if (!data) return {};
      try {
        const parsed = JSON.parse(data);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    }

    function guardarResenas() {
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewsByProduct));
    }

    async function initData() {
      const remoteProductos = await cargarProductosSupabase();
      if (Array.isArray(remoteProductos) && remoteProductos.length) {
        catalogo = remoteProductos.map(normalize);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo));
      }

      const remoteResenas = await cargarResenasSupabase();
      if (remoteResenas && typeof remoteResenas === "object") {
        reviewsByProduct = remoteResenas;
        localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewsByProduct));
      }

      renderAll();
    }

    async function initAuth() {
      if (!supabaseClient) {
        return;
      }
      const { data } = await supabaseClient.auth.getSession();
      state.user = data?.session?.user || null;
      renderAuthUI();
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        state.user = session?.user || null;
        renderAuthUI();
      });
    }

    function getResenas(productId) {
      const list = Array.isArray(reviewsByProduct[productId]) ? reviewsByProduct[productId] : [];
      return list
        .map((r) => ({
          id: r.id || crypto.randomUUID(),
          nombre: r.nombre || "Cliente",
          texto: r.texto || "",
          rating: clampReviewRating(r.rating),
          foto: r.foto || "",
          approvals: Number(r.approvals) || 0,
          createdAt: r.createdAt || Date.now()
        }))
        .filter((r) => r.rating >= 1);
    }

    function guardarResenasProducto(productId, list) {
      reviewsByProduct[productId] = list;
      guardarResenas();
    }

    function getCategorias() {
      return ["Todas", ...new Set(catalogo.map((p) => p.categoria))];
    }

    function filtrarYOrdenar() {
      const query = state.q.toLowerCase();
      const filtrados = catalogo.filter((p) => {
        const matchCategoria = state.categoria === "Todas" || p.categoria === state.categoria;
        const matchQuery =
          !query ||
          p.nombre.toLowerCase().includes(query) ||
          p.descripcion.toLowerCase().includes(query) ||
          p.categoria.toLowerCase().includes(query);
        return matchCategoria && matchQuery;
      });

      if (state.orden === "precioAsc") filtrados.sort((a, b) => a.precio - b.precio);
      else if (state.orden === "precioDesc") filtrados.sort((a, b) => b.precio - a.precio);
      else if (state.orden === "rating") filtrados.sort((a, b) => b.rating - a.rating);
      else filtrados.sort((a, b) => b.ventas - a.ventas);

      return filtrados;
    }

    function renderCategorias() {
      $categorias.innerHTML = "";
      getCategorias().forEach((categoria) => {
        const btn = document.createElement("button");
        btn.className = `cat-btn${categoria === state.categoria ? " active" : ""}`;
        btn.type = "button";
        btn.textContent = categoria;
        btn.dataset.categoria = categoria;
        $categorias.appendChild(btn);
      });
    }

    function descuento(producto) {
      if (!producto.precioAnterior || producto.precioAnterior <= producto.precio) return 0;
      return Math.round(((producto.precioAnterior - producto.precio) / producto.precioAnterior) * 100);
    }

    function crearCard(producto) {
      const off = descuento(producto);
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-media">
          <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
          ${off ? `<span class="badge-offer">-${off}%</span>` : ""}
        </div>
        <div class="card-body">
          <h3>${producto.nombre}</h3>
          <div class="meta">
            <span>${producto.categoria}</span>
            <span>${producto.rating.toFixed(1)} stars</span>
          </div>
          <div class="price-row">
            <p class="precio">${money(producto.precio)}</p>
            <p class="precio-anterior">${money(producto.precioAnterior)}</p>
          </div>
          <p class="desc">${producto.descripcion}</p>
          <div class="actions-inline">
            <button class="btn secondary btn-open" data-id="${producto.id}">Ver articulo</button>
            <button class="btn btn-add" data-id="${producto.id}">Agregar</button>
          </div>
        </div>
      `;
      return card;
    }

    function renderProductos() {
      const lista = filtrarYOrdenar();
      $productos.innerHTML = "";
      $conteo.textContent = `${lista.length} producto${lista.length === 1 ? "" : "s"}`;

      if (!lista.length) {
        $productos.innerHTML = '<div class="vacio">No encontramos productos con ese filtro.</div>';
        return;
      }

      lista.forEach((producto) => $productos.appendChild(crearCard(producto)));
    }

    function addToCart(producto) {
      state.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio });
      renderCarrito();
    }

    function renderCarrito() {
      $carritoLista.innerHTML = "";

      if (!state.carrito.length) {
        $carritoLista.innerHTML = '<li class="vacio">Tu carrito esta vacio.</li>';
        $carritoTotal.textContent = money(0);
        return;
      }

      let total = 0;
      state.carrito.forEach((item, idx) => {
        total += item.precio;
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
          <p><strong>${item.nombre}</strong></p>
          <p>${money(item.precio)}</p>
          <button class="btn danger" data-remove="${idx}">Quitar</button>
        `;
        $carritoLista.appendChild(li);
      });

      $carritoTotal.textContent = money(total);
    }

    function productoById(id) {
      return catalogo.find((p) => p.id === id);
    }

    function renderRecomendaciones(actual) {
      const recs = catalogo
        .filter((p) => p.id !== actual.id)
        .sort((a, b) => {
          const sameA = a.categoria === actual.categoria ? 1 : 0;
          const sameB = b.categoria === actual.categoria ? 1 : 0;
          if (sameA !== sameB) return sameB - sameA;
          return b.rating - a.rating;
        })
        .slice(0, 4);

      $recomendaciones.innerHTML = "";
      if (!recs.length) {
        $recomendaciones.innerHTML = '<div class="vacio">No hay recomendaciones disponibles.</div>';
        return;
      }

      recs.forEach((p) => {
        const off = descuento(p);
        const card = document.createElement("article");
        card.className = "card rec-card";
        card.innerHTML = `
          <div class="card-media">
            <img src="${p.imagenes[0]}" alt="${p.nombre}">
            ${off ? `<span class="badge-offer">-${off}%</span>` : ""}
          </div>
          <div class="card-body">
            <h3>${p.nombre}</h3>
            <p class="precio">${money(p.precio)}</p>
            <button class="btn secondary btn-open" data-id="${p.id}">Ver articulo</button>
          </div>
        `;
        $recomendaciones.appendChild(card);
      });
    }

    function renderResenas(producto) {
      const list = getResenas(producto.id)
        .sort((a, b) => (b.approvals - a.approvals) || (b.createdAt - a.createdAt));

      if (!list.length) {
        $reviewPromedio.textContent = producto.rating.toFixed(1);
        $reviewStars.textContent = stars(Math.round(producto.rating));
        $reviewTotal.textContent = "Sin reseñas aún";
        $reviewList.innerHTML = '<div class="vacio">Sé el primero en dejar una reseña.</div>';
        return;
      }

      const avg = list.reduce((acc, r) => acc + r.rating, 0) / list.length;
      $reviewPromedio.textContent = avg.toFixed(1);
      $reviewStars.textContent = stars(Math.round(avg));
      $reviewTotal.textContent = `${list.length} reseña${list.length === 1 ? "" : "s"}`;

      $reviewList.innerHTML = "";
      list.forEach((r) => {
        const item = document.createElement("article");
        item.className = "review-item";
        item.innerHTML = `
          <div class="review-head">
            <strong>${esc(r.nombre)}</strong>
            <span class="review-stars">${stars(r.rating)}</span>
          </div>
          <p class="review-text">${esc(r.texto)}</p>
          ${r.foto ? `<img class="review-photo" src="${r.foto}" alt="Foto de reseña">` : ""}
          <div class="review-actions">
            <button class="btn secondary btn-approve" data-review-id="${r.id}">Aprobar útil</button>
            <span class="sub">${r.approvals} aprobación${r.approvals === 1 ? "" : "es"}${r.approvals >= 3 ? " | Reseña destacada" : ""}</span>
          </div>
        `;
        $reviewList.appendChild(item);
      });
    }

    function renderDetalleImagenes(producto) {
      const index = Math.max(0, Math.min(state.selectedImage, producto.imagenes.length - 1));
      state.selectedImage = index;
      $detalleImagenPrincipal.src = producto.imagenes[index];
      resetZoom();
      $detalleGaleria.innerHTML = "";

      producto.imagenes.forEach((src, i) => {
        const btn = document.createElement("button");
        btn.className = `thumb-btn${i === index ? " active" : ""}`;
        btn.type = "button";
        btn.dataset.index = String(i);
        btn.innerHTML = `<img src="${src}" alt="Miniatura ${i + 1}">`;
        $detalleGaleria.appendChild(btn);
      });
    }

    function applyZoomTransform() {
      $detalleImagenPrincipal.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoomScale})`;
      $detalleImagenWrap.style.cursor = state.zoomScale > 1 ? "grab" : "zoom-in";
    }

    function resetZoom() {
      state.zoomScale = 1;
      state.panX = 0;
      state.panY = 0;
      applyZoomTransform();
    }

    function toggleZoom() {
      if (state.zoomScale > 1) {
        resetZoom();
      } else {
        state.zoomScale = 2;
        applyZoomTransform();
      }
    }

    function openLightbox() {
      if (!state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto) return;
      $lightboxImage.src = producto.imagenes[state.selectedImage] || producto.imagenes[0];
      $imageLightbox.classList.remove("hidden");
    }

    function closeLightbox() {
      $imageLightbox.classList.add("hidden");
    }

    function moveLightbox(step) {
      if (!state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto || !producto.imagenes.length) return;
      state.selectedImage = (state.selectedImage + step + producto.imagenes.length) % producto.imagenes.length;
      renderDetalleImagenes(producto);
      $lightboxImage.src = producto.imagenes[state.selectedImage];
    }

    function openDetalle(id) {
      const producto = productoById(id);
      if (!producto) return;
      state.selectedId = id;
      state.selectedImage = 0;

      $detalleNombre.textContent = producto.nombre;
      $detalleMeta.textContent = `${producto.categoria} | ${producto.rating.toFixed(1)} stars | ${producto.imagenes.length} imagen(es)`;
      $detallePrecio.textContent = money(producto.precio);
      $detallePrecioAnterior.textContent = money(producto.precioAnterior);
      $detalleDescripcion.textContent = producto.descripcion;

      renderDetalleImagenes(producto);
      renderRecomendaciones(producto);
      renderResenas(producto);

      $detalleProducto.classList.remove("hidden");
      $detalleProducto.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeDetalle() {
      state.selectedId = null;
      resetZoom();
      closeLightbox();
      $detalleProducto.classList.add("hidden");
    }

    function renderAll() {
      renderCategorias();
      renderProductos();
      renderCarrito();
      if (state.selectedId) {
        const exists = productoById(state.selectedId);
        if (exists) openDetalle(state.selectedId);
        else closeDetalle();
      }
    }

    document.getElementById("btnBuscar").addEventListener("click", () => {
      state.q = $busqueda.value.trim();
      renderProductos();
    });

    $busqueda.addEventListener("input", () => {
      state.q = $busqueda.value.trim();
      renderProductos();
    });

    $orden.addEventListener("change", () => {
      state.orden = $orden.value;
      renderProductos();
    });

    $categorias.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      state.categoria = btn.dataset.categoria;
      renderAll();
    });

    $productos.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".btn-open");
      if (openBtn) {
        openDetalle(openBtn.dataset.id);
        return;
      }

      const addBtn = e.target.closest(".btn-add");
      if (!addBtn) return;
      const producto = productoById(addBtn.dataset.id);
      if (!producto) return;
      addToCart(producto);
    });

    $recomendaciones.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".btn-open");
      if (!openBtn) return;
      openDetalle(openBtn.dataset.id);
    });

    $reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!requireAuth()) return;
      if (!state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto) return;

      const nombre = $reviewNombre.value.trim() || authName(state.user);
      const texto = $reviewTexto.value.trim();
      const rating = clampReviewRating($reviewRating.value);
      const fotoFile = $reviewFoto.files[0];

      if (!nombre || !texto || !rating) {
        alert("Completa nombre, calificación y reseña.");
        return;
      }

      let foto = "";
      if (fotoFile) {
        try {
          foto = await fileToDataURL(fotoFile);
        } catch {
          alert("No se pudo procesar la foto de la reseña.");
          return;
        }
      }

      const current = getResenas(producto.id);
      current.unshift({
        id: crypto.randomUUID(),
        nombre,
        texto,
        rating,
        foto,
        approvals: 0,
        createdAt: Date.now()
      });

      guardarResenasProducto(producto.id, current);
      await crearResenaSupabase(producto.id, current[0]);
      renderResenas(producto);
      $reviewForm.reset();
    });

    $reviewList.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-approve");
      if (!btn || !state.selectedId) return;
      const productId = state.selectedId;
      const reviewId = btn.dataset.reviewId;
      const current = getResenas(productId);
      const target = current.find((r) => r.id === reviewId);
      if (!target) return;
      target.approvals += 1;
      guardarResenasProducto(productId, current);
      await aprobarResenaSupabase(target.id, target.approvals);
      const producto = productoById(productId);
      if (producto) renderResenas(producto);
    });

    $detalleGaleria.addEventListener("click", (e) => {
      const btn = e.target.closest(".thumb-btn");
      if (!btn || !state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto) return;
      state.selectedImage = Number(btn.dataset.index || 0);
      renderDetalleImagenes(producto);
    });

    $zoomBtn.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        openLightbox();
        return;
      }
      toggleZoom();
    });

    $detalleImagenPrincipal.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        openLightbox();
      }
    });

    $detalleImagenWrap.addEventListener("wheel", (e) => {
      if (window.matchMedia("(max-width: 900px)").matches) return;
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.2 : -0.2;
      state.zoomScale = Math.max(1, Math.min(4, state.zoomScale + step));
      if (state.zoomScale === 1) {
        state.panX = 0;
        state.panY = 0;
      }
      applyZoomTransform();
    }, { passive: false });

    $detalleImagenWrap.addEventListener("mousedown", (e) => {
      if (state.zoomScale <= 1) return;
      state.isDraggingZoom = true;
      state.dragStartX = e.clientX - state.panX;
      state.dragStartY = e.clientY - state.panY;
      $detalleImagenWrap.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!state.isDraggingZoom) return;
      state.panX = e.clientX - state.dragStartX;
      state.panY = e.clientY - state.dragStartY;
      applyZoomTransform();
    });

    window.addEventListener("mouseup", () => {
      if (!state.isDraggingZoom) return;
      state.isDraggingZoom = false;
      applyZoomTransform();
    });

    $lightboxClose.addEventListener("click", closeLightbox);
    $lightboxPrev.addEventListener("click", () => moveLightbox(-1));
    $lightboxNext.addEventListener("click", () => moveLightbox(1));
    $imageLightbox.addEventListener("click", (e) => {
      if (e.target === $imageLightbox) closeLightbox();
    });

    $detalleAgregarCarrito.addEventListener("click", () => {
      if (!state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto) return;
      addToCart(producto);
    });

    $detalleComprar.addEventListener("click", () => {
      if (!requireAuth()) return;
      if (!state.selectedId) return;
      const producto = productoById(state.selectedId);
      if (!producto) return;
      addToCart(producto);
      alert(`Producto agregado y listo para compra: ${producto.nombre}`);
    });

    $cerrarDetalle.addEventListener("click", closeDetalle);

    $carritoLista.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-remove]");
      if (!btn) return;
      const idx = Number(btn.dataset.remove);
      state.carrito.splice(idx, 1);
      renderCarrito();
    });

    $vaciarCarrito.addEventListener("click", () => {
      state.carrito = [];
      renderCarrito();
    });

    $btnAuthLogout.addEventListener("click", async () => {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
      state.carrito = [];
      renderCarrito();
      renderAuthUI();
    });

    $comprarTodo.addEventListener("click", () => {
      if (!requireAuth()) return;
      if (!state.carrito.length) {
        alert("Agrega productos al carrito antes de comprar.");
        return;
      }
      alert(`Compra realizada por ${$carritoTotal.textContent}`);
      state.carrito = [];
      renderCarrito();
    });

    window.addEventListener("storage", () => {
      catalogo = cargar();
      reviewsByProduct = cargarResenas();
      renderAll();
    });

    initAuth();
    initData();
