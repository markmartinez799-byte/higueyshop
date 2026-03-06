    const STORAGE_KEY = "catalogo_articulos_v1";
    const REVIEW_STORAGE_KEY = "catalogo_resenas_v1";
    const SUPABASE_URL = "https://khnfwiumfxpqzmwoyhbx.supabase.co";
    const SUPABASE_KEY = "sb_publishable_1Dc2DB9h1p3bKm4yrm6SVA_qA693feK";
    const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
    const PLACEHOLDER_IMG = "https://dummyimage.com/800x600/f0f0f0/777&text=Sin+imagen";
    const MAX_IMAGES = 50;
    const PAYPAL_CURRENCY = "USD";
    const FREE_SHIPPING_TARGET = 3000;

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
    const $metodoPago = document.getElementById("metodoPago");
    const $whatsappPagoBtn = document.getElementById("whatsappPagoBtn");
    const $cartResumen = document.getElementById("cartResumen");
    const $cartShippingMsg = document.getElementById("cartShippingMsg");
    const $paypalCheckoutWrap = document.getElementById("paypalCheckoutWrap");
    const $paypalCheckoutMsg = document.getElementById("paypalCheckoutMsg");
    const $paypalButtonsContainer = document.getElementById("paypalButtonsContainer");
    const $paypalButtonApplePay = document.getElementById("paypalButtonApplePay");
    const $paypalButtonGooglePay = document.getElementById("paypalButtonGooglePay");
    const $paypalButtonMain = document.getElementById("paypalButtonMain");
    const $facturaModal = document.getElementById("facturaModal");
    const $facturaNumero = document.getElementById("facturaNumero");
    const $facturaFecha = document.getElementById("facturaFecha");
    const $facturaCliente = document.getElementById("facturaCliente");
    const $facturaMetodo = document.getElementById("facturaMetodo");
    const $facturaItems = document.getElementById("facturaItems");
    const $facturaSubtotal = document.getElementById("facturaSubtotal");
    const $facturaEnvio = document.getElementById("facturaEnvio");
    const $facturaTotal = document.getElementById("facturaTotal");
    const $facturaCancelar = document.getElementById("facturaCancelar");
    const $facturaConfirmar = document.getElementById("facturaConfirmar");
    const $trackingCodeInput = document.getElementById("trackingCodeInput");
    const $trackingSearchBtn = document.getElementById("trackingSearchBtn");
    const $trackingResult = document.getElementById("trackingResult");
    const $detallePaypalCheckoutWrap = document.getElementById("detallePaypalCheckoutWrap");
    const $detallePaypalCheckoutMsg = document.getElementById("detallePaypalCheckoutMsg");
    const $detallePaypalButtonsContainer = document.getElementById("detallePaypalButtonsContainer");
    const $detallePaypalButtonApplePay = document.getElementById("detallePaypalButtonApplePay");
    const $detallePaypalButtonGooglePay = document.getElementById("detallePaypalButtonGooglePay");
    const $detallePaypalButtonMain = document.getElementById("detallePaypalButtonMain");
    const $authUserBadge = document.getElementById("authUserBadge");
    const $btnAuthOpen = document.getElementById("btnAuthOpen");
    const $btnAuthLogout = document.getElementById("btnAuthLogout");

    const $detalleProducto = document.getElementById("detalleProducto");
    const $cerrarDetalle = document.getElementById("cerrarDetalle");
    const $detalleImagenWrap = document.getElementById("detalleImagenWrap");
    const $detalleImagenPrincipal = document.getElementById("detalleImagenPrincipal");
    const $detalleVideoWrap = document.getElementById("detalleVideoWrap");
    const $detalleVideo = document.getElementById("detalleVideo");
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
      instantCheckoutItem: null,
      selectedId: null,
      selectedImage: 0,
      user: null,
      zoomScale: 1,
      panX: 0,
      panY: 0,
      isDraggingZoom: false,
      dragStartX: 0,
      dragStartY: 0,
      lightboxTouchStartX: 0,
      paypalButtonsRendered: false,
      detallePaypalButtonsRendered: false,
      pendingInvoice: null
    };
    const warnedSupabaseTables = new Set();
    let estadoSyncTimer = null;

    function parsePrecio(value) {
      if (typeof value === "number") return value;
      const num = String(value || "").replace(/[^\d.]/g, "");
      return Number(num) || 0;
    }

    function money(value) {
      return `RD$ ${Math.round(value).toLocaleString("es-DO")}`;
    }

    function getCarritoTotal() {
      return state.carrito.reduce((acc, item) => acc + item.precio, 0);
    }

    function getCheckoutTotal() {
      if (state.instantCheckoutItem) {
        return Number(state.instantCheckoutItem.precio) || 0;
      }
      return getCarritoTotal();
    }

    function getShippingCost(subtotal) {
      if (!subtotal) return 0;
      return subtotal >= FREE_SHIPPING_TARGET ? 0 : 250;
    }

    function warnSupabaseTable(table, error) {
      if (!error || warnedSupabaseTables.has(table)) return;
      warnedSupabaseTables.add(table);
      console.warn(`Supabase table issue (${table}):`, error.message || error);
    }

    function sanitizeCart(items) {
      if (!Array.isArray(items)) return [];
      return items
        .map((item) => ({
          id: item?.id || crypto.randomUUID(),
          nombre: String(item?.nombre || "Articulo"),
          precio: Number(item?.precio) || 0
        }))
        .filter((item) => item.precio > 0);
    }

    function hasMetodoPagoOption(value) {
      if (!$metodoPago || !value) return false;
      return Array.from($metodoPago.options).some((opt) => opt.value === value);
    }

    async function guardarEstadoClienteSupabase() {
      if (!supabaseClient || !state.user?.id) return false;
      const payload = {
        user_id: state.user.id,
        carrito: state.carrito,
        metodo_pago: $metodoPago?.value || "",
        instant_checkout_item: state.instantCheckoutItem || null,
        filtros: {
          q: state.q,
          categoria: state.categoria,
          orden: state.orden
        },
        updated_at: new Date().toISOString()
      };
      const { error } = await supabaseClient
        .from("cliente_estado")
        .upsert(payload, { onConflict: "user_id" });
      if (error) {
        warnSupabaseTable("cliente_estado", error);
        return false;
      }
      return true;
    }

    function scheduleGuardarEstadoCliente() {
      if (!state.user?.id) return;
      if (estadoSyncTimer) clearTimeout(estadoSyncTimer);
      estadoSyncTimer = setTimeout(() => {
        void guardarEstadoClienteSupabase();
      }, 350);
    }

    async function restaurarEstadoClienteSupabase() {
      if (!supabaseClient || !state.user?.id) return;
      const { data, error } = await supabaseClient
        .from("cliente_estado")
        .select("*")
        .eq("user_id", state.user.id)
        .maybeSingle();
      if (error) {
        warnSupabaseTable("cliente_estado", error);
        return;
      }
      if (!data) return;

      state.carrito = sanitizeCart(data.carrito);
      state.instantCheckoutItem = data.instant_checkout_item && typeof data.instant_checkout_item === "object"
        ? data.instant_checkout_item
        : null;
      const filtros = data.filtros && typeof data.filtros === "object" ? data.filtros : {};
      if (typeof filtros.q === "string") state.q = filtros.q;
      if (typeof filtros.categoria === "string") state.categoria = filtros.categoria;
      if (typeof filtros.orden === "string") state.orden = filtros.orden;
      if ($busqueda && typeof filtros.q === "string") $busqueda.value = filtros.q;
      if ($orden && typeof filtros.orden === "string") $orden.value = filtros.orden;
      if (hasMetodoPagoOption(data.metodo_pago)) {
        $metodoPago.value = data.metodo_pago;
      }
    }

    function buildPedidoPayload(metodoPago = "WhatsApp", canal = "whatsapp") {
      const trackingCode = `HGS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      const isDirect = Boolean(state.instantCheckoutItem);
      const items = isDirect
        ? [{
          id: state.instantCheckoutItem.id,
          nombre: state.instantCheckoutItem.nombre,
          qty: 1,
          precio: Number(state.instantCheckoutItem.precio) || 0,
          total: Number(state.instantCheckoutItem.precio) || 0
        }]
        : groupCartItems().map((item) => ({
          id: item.id,
          nombre: item.nombre,
          qty: item.qty,
          precio: item.precio,
          total: item.total
        }));
      const subtotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);
      const envio = getShippingCost(subtotal);
      const total = subtotal + envio;
      return {
        user_id: state.user?.id || null,
        cliente: authName(state.user),
        canal,
        metodo_pago: metodoPago,
        items,
        subtotal,
        envio,
        total,
        tracking_code: trackingCode,
        tracking_status: "pendiente",
        tracking_history: [
          {
            status: "pendiente",
            note: "Pedido registrado",
            at: new Date().toISOString()
          }
        ],
        estado: "pendiente",
        created_at: new Date().toISOString()
      };
    }

    async function guardarPedidoSupabase(payload) {
      if (!supabaseClient) return false;
      const { data, error } = await supabaseClient
        .from("pedidos")
        .insert(payload)
        .select("tracking_code, tracking_status, created_at")
        .single();
      if (error) {
        warnSupabaseTable("pedidos", error);
        return false;
      }
      return data || true;
    }

    async function buscarRastreoSupabase(code) {
      if (!supabaseClient || !state.user?.id) return null;
      const { data, error } = await supabaseClient
        .from("pedidos")
        .select("tracking_code, tracking_status, created_at, total, tracking_history")
        .eq("tracking_code", code)
        .eq("user_id", state.user.id)
        .maybeSingle();
      if (error) {
        warnSupabaseTable("pedidos", error);
        return null;
      }
      return data;
    }

    function groupCartItems() {
      const grouped = new Map();
      state.carrito.forEach((item) => {
        const current = grouped.get(item.id);
        if (current) {
          current.qty += 1;
          current.total += item.precio;
        } else {
          grouped.set(item.id, {
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            qty: 1,
            total: item.precio
          });
        }
      });
      return [...grouped.values()];
    }

    function openInvoiceModal(metodoPago) {
      const groupedItems = groupCartItems();
      const subtotal = groupedItems.reduce((acc, item) => acc + item.total, 0);
      const envio = getShippingCost(subtotal);
      const total = subtotal + envio;

      const now = new Date();
      const invoiceNumber = `FAC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getTime()).slice(-5)}`;
      if ($facturaNumero) $facturaNumero.textContent = invoiceNumber;
      if ($facturaFecha) $facturaFecha.textContent = now.toLocaleString("es-DO");
      if ($facturaCliente) $facturaCliente.textContent = authName(state.user);
      if ($facturaMetodo) $facturaMetodo.textContent = metodoPago;
      if ($facturaSubtotal) $facturaSubtotal.textContent = money(subtotal);
      if ($facturaEnvio) $facturaEnvio.textContent = money(envio);
      if ($facturaTotal) $facturaTotal.textContent = money(total);

      if ($facturaItems) {
        $facturaItems.innerHTML = "";
        groupedItems.forEach((item) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${esc(item.nombre)}</td>
            <td>${item.qty}</td>
            <td>${money(item.precio)}</td>
            <td>${money(item.total)}</td>
          `;
          $facturaItems.appendChild(tr);
        });
      }

      state.pendingInvoice = { metodoPago, subtotal, envio, total };
      $facturaModal?.classList.remove("hidden");
    }

    function closeInvoiceModal() {
      state.pendingInvoice = null;
      $facturaModal?.classList.add("hidden");
    }

    function confirmInvoicePurchase() {
      if (!state.pendingInvoice) return;
      const { metodoPago, total } = state.pendingInvoice;
      const pedido = buildPedidoPayload(metodoPago, "manual");
      void guardarPedidoSupabase(pedido).then((saved) => {
        if (saved && typeof saved === "object" && saved.tracking_code) {
          alert(`Codigo de rastreo: ${saved.tracking_code}`);
        }
      });
      alert(`Compra realizada por ${authName(state.user)}\nTotal final: ${money(total)}\nPago: ${metodoPago}`);
      closeInvoiceModal();
      state.carrito = [];
      if ($metodoPago) $metodoPago.value = "";
      renderCarrito();
      scheduleGuardarEstadoCliente();
    }

    function openWhatsAppPayment() {
      const isDirect = Boolean(state.instantCheckoutItem);
      const total = isDirect ? Number(state.instantCheckoutItem.precio || 0) : getCarritoTotal();
      const items = isDirect ? 1 : state.carrito.length;
      const detalle = isDirect
        ? `Producto: ${state.instantCheckoutItem.nombre}. `
        : "";
      const text = `Hola, quiero pagar mi pedido de ${items} articulo(s) en higueyshop. ${detalle}Total aproximado: ${money(total)}.`;
      const url = `https://wa.me/18492842191?text=${encodeURIComponent(text)}`;
      const pedido = buildPedidoPayload("WhatsApp", "whatsapp");
      void guardarPedidoSupabase(pedido).then((saved) => {
        if ($trackingResult && saved && typeof saved === "object" && saved.tracking_code) {
          $trackingResult.textContent = `Pedido creado. Codigo de rastreo: ${saved.tracking_code} | Estado: ${saved.tracking_status || "pendiente"}`;
        }
      });
      scheduleGuardarEstadoCliente();
      window.open(url, "_blank", "noopener,noreferrer");
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
      if (!user) return "Visita";
      const metaName = user.user_metadata?.nombre || user.user_metadata?.name;
      if (metaName) return metaName;
      if (user.email) return user.email.split("@")[0];
      return "Cliente";
    }

    function renderAuthUI() {
      const logged = Boolean(state.user);
      $authUserBadge.textContent = logged ? authName(state.user) : "Visita";
      $btnAuthLogout.classList.toggle("hidden", !logged);
      $btnAuthOpen.classList.toggle("hidden", logged);
      if (logged) {
        $reviewNombre.value = authName(state.user);
      }
    }

    function requireAuth() {
      if (state.user) return true;
      alert("Debes iniciar sesión como cliente para continuar.");
      window.location.href = "user.html";
      return false;
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
        video: row.video || "",
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
      await restaurarEstadoClienteSupabase();
      renderCarrito();
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        state.user = session?.user || null;
        renderAuthUI();
        scheduleGuardarEstadoCliente();
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

    function stockStatus(producto) {
      const base = Number(producto.ventas) || 0;
      if (base >= 700) return { cls: "hot", label: "Alta demanda" };
      if (base >= 250) return { cls: "ok", label: "Disponible" };
      return { cls: "low", label: "Pocas unidades" };
    }

    function crearCard(producto) {
      const off = descuento(producto);
      const stock = stockStatus(producto);
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = String(producto.id);
      card.innerHTML = `
        <div class="card-media">
          <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
          ${off ? `<span class="badge-offer">-${off}%</span>` : ""}
        </div>
        <div class="card-body">
          <h3>${producto.nombre}</h3>
          <div class="meta">
            <span>${producto.categoria}</span>
            <span>${producto.rating.toFixed(1)} ★</span>
          </div>
          <span class="stock-pill ${stock.cls}">${stock.label}</span>
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
      state.instantCheckoutItem = null;
      toggleDetallePaypalCheckout();
      state.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio });
      renderCarrito();
      scheduleGuardarEstadoCliente();
    }

    function renderCarrito() {
      $carritoLista.innerHTML = "";

      if (!state.carrito.length) {
        $carritoLista.innerHTML = '<li class="vacio">Tu carrito esta vacio.</li>';
        $carritoTotal.textContent = money(0);
        if ($cartResumen) $cartResumen.textContent = "0 articulos en carrito.";
        if ($cartShippingMsg) $cartShippingMsg.textContent = "Agrega articulos para calcular envio.";
        togglePaypalCheckout();
        scheduleGuardarEstadoCliente();
        return;
      }

      state.carrito.forEach((item, idx) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
          <p><strong>${item.nombre}</strong></p>
          <p>${money(item.precio)}</p>
          <button class="btn danger" data-remove="${idx}">Quitar</button>
        `;
        $carritoLista.appendChild(li);
      });

      const total = getCarritoTotal();
      const items = state.carrito.length;
      const remaining = Math.max(0, FREE_SHIPPING_TARGET - total);

      $carritoTotal.textContent = money(total);
      if ($cartResumen) {
        $cartResumen.textContent = `${items} articulo${items === 1 ? "" : "s"} en carrito.`;
      }
      if ($cartShippingMsg) {
        $cartShippingMsg.textContent = remaining === 0
          ? "Envio gratis aplicado en esta compra."
          : `Te faltan ${money(remaining)} para envio gratis.`;
      }
      togglePaypalCheckout();
      scheduleGuardarEstadoCliente();
    }

    function initPaypalButtons() {
      if (state.paypalButtonsRendered) return;
      if (!$paypalButtonsContainer || !window.paypal?.Buttons) {
        return;
      }
      const isDesktopCheckout = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const buildConfig = () => ({
        style: { layout: "vertical", shape: "rect" },
        createOrder(_data, actions) {
          const value = Math.max(getCheckoutTotal(), 1).toFixed(2);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: PAYPAL_CURRENCY,
                  value
                }
              }
            ]
          });
        },
        onApprove(_data, actions) {
          return actions.order.capture().then((details) => {
            const nombre = details?.payer?.name?.given_name || authName(state.user);
            alert(`Pago aprobado por ${nombre}. Gracias por tu compra.`);
            const wasInstantCheckout = Boolean(state.instantCheckoutItem);
            state.instantCheckoutItem = null;
            if (!wasInstantCheckout) {
              state.carrito = [];
            }
            if ($metodoPago) $metodoPago.value = "";
            renderCarrito();
          });
        },
        onError() {
          alert("No se pudo completar el pago. Intenta nuevamente.");
        }
      });

      const renderFundingButton = (fundingSource, container) => {
        if (!fundingSource || !container) return false;
        const btn = window.paypal.Buttons({
          ...buildConfig(),
          fundingSource
        });
        if (!btn || typeof btn.isEligible !== "function" || !btn.isEligible()) return false;
        btn.render(`#${container.id}`);
        return true;
      };

      const renderDefaultPaypalFallback = () => {
        if (!$paypalButtonMain) return false;
        const btn = window.paypal.Buttons({
          ...buildConfig(),
          style: { layout: "vertical", shape: "rect", label: "paypal" }
        });
        if (!btn || typeof btn.isEligible !== "function" || !btn.isEligible()) return false;
        btn.render("#paypalButtonMain");
        return true;
      };

      const renderedApple = isDesktopCheckout ? false : renderFundingButton(window.paypal.FUNDING?.APPLEPAY, $paypalButtonApplePay);
      const renderedGoogle = isDesktopCheckout ? false : renderFundingButton(window.paypal.FUNDING?.GOOGLEPAY, $paypalButtonGooglePay);
      let renderedPaypal = renderFundingButton(window.paypal.FUNDING?.PAYPAL, $paypalButtonMain);
      if (!renderedPaypal) renderedPaypal = renderDefaultPaypalFallback();

      if ($paypalCheckoutMsg) {
        if (isDesktopCheckout) {
          $paypalCheckoutMsg.textContent = "Pago por PC: usa el enlace directo de PayPal.";
        } else {
          $paypalCheckoutMsg.textContent = (renderedApple || renderedGoogle)
            ? "Elige Apple Pay, Google Pay o PayPal."
            : "Apple Pay y Google Pay no están disponibles aquí. Puedes pagar con PayPal.";
        }
      }

      if (!renderedPaypal && !renderedApple && !renderedGoogle) return;
      state.paypalButtonsRendered = true;
    }

    function togglePaypalCheckout() {
      if (!$paypalCheckoutWrap) return;
      $paypalCheckoutWrap.classList.add("hidden");
    }

    function initDetallePaypalButtons() {
      if (state.detallePaypalButtonsRendered) return;
      if (!$detallePaypalButtonsContainer || !window.paypal?.Buttons) {
        return;
      }
      const isDesktopCheckout = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      const buildConfig = () => ({
        style: { layout: "vertical", shape: "rect" },
        createOrder(_data, actions) {
          const value = Math.max(getCheckoutTotal(), 1).toFixed(2);
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: PAYPAL_CURRENCY,
                  value
                }
              }
            ]
          });
        },
        onApprove(_data, actions) {
          return actions.order.capture().then((details) => {
            const nombre = details?.payer?.name?.given_name || authName(state.user);
            alert(`Pago aprobado por ${nombre}. Gracias por tu compra.`);
            const wasInstantCheckout = Boolean(state.instantCheckoutItem);
            state.instantCheckoutItem = null;
            if (!wasInstantCheckout) {
              state.carrito = [];
            }
            if ($metodoPago) $metodoPago.value = "";
            $detallePaypalCheckoutWrap?.classList.add("hidden");
            renderCarrito();
          });
        },
        onError() {
          alert("No se pudo completar el pago. Intenta nuevamente.");
        }
      });

      const renderFundingButton = (fundingSource, container) => {
        if (!fundingSource || !container) return false;
        const btn = window.paypal.Buttons({
          ...buildConfig(),
          fundingSource
        });
        if (!btn || typeof btn.isEligible !== "function" || !btn.isEligible()) return false;
        btn.render(`#${container.id}`);
        return true;
      };

      const renderDefaultPaypalFallback = () => {
        if (!$detallePaypalButtonMain) return false;
        const btn = window.paypal.Buttons({
          ...buildConfig(),
          style: { layout: "vertical", shape: "rect", label: "paypal" }
        });
        if (!btn || typeof btn.isEligible !== "function" || !btn.isEligible()) return false;
        btn.render("#detallePaypalButtonMain");
        return true;
      };

      const renderedApple = isDesktopCheckout ? false : renderFundingButton(window.paypal.FUNDING?.APPLEPAY, $detallePaypalButtonApplePay);
      const renderedGoogle = isDesktopCheckout ? false : renderFundingButton(window.paypal.FUNDING?.GOOGLEPAY, $detallePaypalButtonGooglePay);
      let renderedPaypal = renderFundingButton(window.paypal.FUNDING?.PAYPAL, $detallePaypalButtonMain);
      if (!renderedPaypal) renderedPaypal = renderDefaultPaypalFallback();

      if ($detallePaypalCheckoutMsg) {
        if (isDesktopCheckout) {
          $detallePaypalCheckoutMsg.textContent = "Pago directo por PC con PayPal.";
        } else {
          $detallePaypalCheckoutMsg.textContent = (renderedApple || renderedGoogle)
            ? "Paga este producto con Apple Pay, Google Pay o PayPal."
            : "Apple Pay y Google Pay no están disponibles aquí. Puedes pagar con PayPal.";
        }
      }

      if (!renderedPaypal && !renderedApple && !renderedGoogle) return;
      state.detallePaypalButtonsRendered = true;
    }

    function toggleDetallePaypalCheckout() {
      if (!$detallePaypalCheckoutWrap) return;
      $detallePaypalCheckoutWrap.classList.add("hidden");
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
        card.dataset.id = String(p.id);
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

    function renderDetalleVideo(producto) {
      const hasVideo = Boolean(producto.video);
      $detalleVideoWrap.classList.toggle("hidden", !hasVideo);
      if (!hasVideo) {
        $detalleVideo.removeAttribute("src");
        $detalleVideo.load();
        return;
      }
      if ($detalleVideo.src !== producto.video) {
        $detalleVideo.src = producto.video;
        $detalleVideo.load();
      }
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
      $detalleMeta.textContent = `${producto.categoria} | ${producto.rating.toFixed(1)}★ | Entrega estimada 24-72h`;
      $detallePrecio.textContent = money(producto.precio);
      $detallePrecioAnterior.textContent = money(producto.precioAnterior);
      $detalleDescripcion.textContent = producto.descripcion;

      renderDetalleImagenes(producto);
      renderDetalleVideo(producto);
      renderRecomendaciones(producto);
      renderResenas(producto);

      $detalleProducto.classList.remove("hidden");
      $detalleProducto.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function closeDetalle() {
      state.selectedId = null;
      resetZoom();
      closeLightbox();
      $detalleVideo.pause();
      $detallePaypalCheckoutWrap?.classList.add("hidden");
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
      scheduleGuardarEstadoCliente();
    });

    $busqueda.addEventListener("input", () => {
      state.q = $busqueda.value.trim();
      renderProductos();
      scheduleGuardarEstadoCliente();
    });

    $orden.addEventListener("change", () => {
      state.orden = $orden.value;
      renderProductos();
      scheduleGuardarEstadoCliente();
    });

    $metodoPago?.addEventListener("change", () => {
      const isWhatsapp = ($metodoPago?.value || "") === "WhatsApp";
      $whatsappPagoBtn?.classList.toggle("hidden", !isWhatsapp);
      $paypalCheckoutWrap?.classList.add("hidden");
      $detallePaypalCheckoutWrap?.classList.add("hidden");
      scheduleGuardarEstadoCliente();
    });

    $categorias.addEventListener("click", (e) => {
      const btn = e.target.closest(".cat-btn");
      if (!btn) return;
      state.categoria = btn.dataset.categoria;
      renderAll();
      scheduleGuardarEstadoCliente();
    });

    $productos.addEventListener("click", (e) => {
      const addBtn = e.target.closest(".btn-add");
      if (addBtn) {
        const producto = productoById(addBtn.dataset.id);
        if (!producto) return;
        addToCart(producto);
        return;
      }

      const openBtn = e.target.closest(".btn-open");
      if (openBtn) {
        openDetalle(openBtn.dataset.id);
        return;
      }

      const card = e.target.closest(".card");
      if (!card?.dataset.id) return;
      openDetalle(card.dataset.id);
    });

    $recomendaciones.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".btn-open");
      if (openBtn) {
        openDetalle(openBtn.dataset.id);
        return;
      }
      const card = e.target.closest(".card");
      if (!card?.dataset.id) return;
      openDetalle(card.dataset.id);
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
      openLightbox();
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
    $lightboxImage.addEventListener("click", (e) => {
      const rect = $lightboxImage.getBoundingClientRect();
      const clickOnLeftSide = (e.clientX - rect.left) < (rect.width / 2);
      moveLightbox(clickOnLeftSide ? -1 : 1);
    });
    $imageLightbox.addEventListener("click", (e) => {
      if (e.target === $imageLightbox) closeLightbox();
    });
    window.addEventListener("keydown", (e) => {
      if ($imageLightbox.classList.contains("hidden")) return;
      if (e.key === "ArrowLeft") moveLightbox(-1);
      if (e.key === "ArrowRight") moveLightbox(1);
      if (e.key === "Escape") closeLightbox();
    });
    $imageLightbox.addEventListener("touchstart", (e) => {
      if (!e.touches || !e.touches.length) return;
      state.lightboxTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    $imageLightbox.addEventListener("touchend", (e) => {
      if (!e.changedTouches || !e.changedTouches.length) return;
      const endX = e.changedTouches[0].clientX;
      const delta = endX - state.lightboxTouchStartX;
      if (Math.abs(delta) < 35) return;
      moveLightbox(delta < 0 ? 1 : -1);
    }, { passive: true });

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
      state.instantCheckoutItem = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio
      };
      if ($metodoPago) $metodoPago.value = "WhatsApp";
      $whatsappPagoBtn?.classList.remove("hidden");
      openWhatsAppPayment();
    });

    $cerrarDetalle.addEventListener("click", closeDetalle);

    $carritoLista.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-remove]");
      if (!btn) return;
      const idx = Number(btn.dataset.remove);
      state.carrito.splice(idx, 1);
      renderCarrito();
      scheduleGuardarEstadoCliente();
    });

    $vaciarCarrito.addEventListener("click", () => {
      state.carrito = [];
      renderCarrito();
      scheduleGuardarEstadoCliente();
    });

    $btnAuthLogout.addEventListener("click", async () => {
      if (!supabaseClient) return;
      await guardarEstadoClienteSupabase();
      await supabaseClient.auth.signOut();
      state.carrito = [];
      renderCarrito();
      renderAuthUI();
    });

    $comprarTodo.addEventListener("click", () => {
      if (!requireAuth()) return;
      state.instantCheckoutItem = null;
      if (!state.carrito.length) {
        alert("Agrega productos al carrito antes de comprar.");
        return;
      }
      const metodoPago = $metodoPago?.value || "";
      if (!metodoPago) {
        alert("Selecciona un método de pago. Por ahora solo WhatsApp está disponible.");
        $metodoPago?.focus();
        return;
      }
      if (metodoPago !== "WhatsApp") {
        alert("Este método estará disponible próximamente. Usa WhatsApp para pagar por ahora.");
        return;
      }
      openWhatsAppPayment();
    });

    $facturaCancelar?.addEventListener("click", () => {
      closeInvoiceModal();
    });

    $facturaConfirmar?.addEventListener("click", () => {
      confirmInvoicePurchase();
    });

    $facturaModal?.addEventListener("click", (e) => {
      if (e.target === $facturaModal) closeInvoiceModal();
    });

    $trackingSearchBtn?.addEventListener("click", async () => {
      if (!requireAuth()) return;
      const code = ($trackingCodeInput?.value || "").trim().toUpperCase();
      if (!code) {
        if ($trackingResult) $trackingResult.textContent = "Ingresa un codigo de rastreo valido.";
        return;
      }
      if ($trackingResult) $trackingResult.textContent = "Consultando rastreo...";
      const pedido = await buscarRastreoSupabase(code);
      if (!pedido) {
        if ($trackingResult) $trackingResult.textContent = "No encontramos un pedido con ese codigo en tu cuenta.";
        return;
      }
      const fecha = pedido.created_at ? new Date(pedido.created_at).toLocaleString("es-DO") : "Sin fecha";
      const total = money(Number(pedido.total) || 0);
      const estado = pedido.tracking_status || "pendiente";
      if ($trackingResult) {
        $trackingResult.textContent = `Codigo ${pedido.tracking_code} | Estado: ${estado} | Fecha: ${fecha} | Total: ${total}`;
      }
    });

    window.addEventListener("storage", () => {
      catalogo = cargar();
      reviewsByProduct = cargarResenas();
      renderAll();
    });

    initAuth();
    initData();
