(function () {
  const h = React.createElement;
  const { useEffect, useMemo, useState } = React;

  const STORE_NAME = "HigueyShop";
  const WHATSAPP_NUMBER = "18492842191";
  const SUPABASE_URL = "https://pmnxjnnhfvtexbcayzkj.supabase.co";
  const SUPABASE_KEY = "sb_publishable_REEMPLAZAR_POR_ANON_KEY";
  const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

  const CATEGORIES = ["Todas", "Electronica", "Moda", "Hogar", "Belleza", "Deportes"];
  const PRODUCTS = [
    {
      id: "p-001",
      name: "Smartwatch Pro X",
      category: "Electronica",
      brand: "Nova",
      price: 2490,
      oldPrice: 3200,
      rating: 4.8,
      sold: 931,
      freeShipping: true,
      stock: 19,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      desc: "Pantalla AMOLED, monitoreo de salud y bateria de larga duracion."
    },
    {
      id: "p-002",
      name: "Audifonos Bass One",
      category: "Electronica",
      brand: "Vibe",
      price: 1890,
      oldPrice: 2250,
      rating: 4.7,
      sold: 1270,
      freeShipping: true,
      stock: 34,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80",
      desc: "Audio inmersivo, cancelacion de ruido y estuche de carga."
    },
    {
      id: "p-003",
      name: "Mochila Travel Max",
      category: "Moda",
      brand: "UrbanGo",
      price: 1390,
      oldPrice: 1790,
      rating: 4.5,
      sold: 763,
      freeShipping: false,
      stock: 22,
      image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80",
      desc: "Impermeable con compartimento para laptop y bolsillos antirrobo."
    },
    {
      id: "p-004",
      name: "Set Cocina Chef 12",
      category: "Hogar",
      brand: "CocinaPro",
      price: 3550,
      oldPrice: 4300,
      rating: 4.6,
      sold: 342,
      freeShipping: true,
      stock: 10,
      image: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1200&q=80",
      desc: "Set premium antiadherente con acabado profesional."
    },
    {
      id: "p-005",
      name: "Kit Cuidado Facial",
      category: "Belleza",
      brand: "PureSkin",
      price: 980,
      oldPrice: 1250,
      rating: 4.4,
      sold: 520,
      freeShipping: false,
      stock: 40,
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      desc: "Rutina completa para limpieza, hidratacion y proteccion."
    },
    {
      id: "p-006",
      name: "Mancuernas Ajustables",
      category: "Deportes",
      brand: "FitCore",
      price: 4200,
      oldPrice: 5100,
      rating: 4.9,
      sold: 417,
      freeShipping: true,
      stock: 8,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
      desc: "Ajuste rapido de peso para entrenamientos completos en casa."
    }
  ];

  function money(v) {
    return `RD$ ${Math.round(v).toLocaleString("es-DO")}`;
  }

  function slugOrderNumber() {
    const stamp = new Date().toISOString().replace(/[^\d]/g, "").slice(0, 14);
    return `HGS-${stamp}`;
  }

  function App() {
    const [view, setView] = useState("home");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Todas");
    const [sort, setSort] = useState("relevancia");
    const [selectedId, setSelectedId] = useState(PRODUCTS[0].id);
    const [cart, setCart] = useState([]);
    const [checkoutStep, setCheckoutStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("paypal");
    const [trackingCode, setTrackingCode] = useState("");
    const [lastOrder, setLastOrder] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [user, setUser] = useState(null);
    const [authMsg, setAuthMsg] = useState("");
    const [authError, setAuthError] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authForm, setAuthForm] = useState({
      nombre: "",
      telefono: "",
      email: "",
      password: ""
    });

    useEffect(() => {
      if (!supabaseClient) {
        setAuthMsg("No se pudo conectar con el sistema de acceso.");
        setAuthError(true);
        return undefined;
      }

      supabaseClient.auth.getSession().then(({ data }) => {
        setUser(data?.session?.user || null);
      });

      const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }, []);

    function setMessage(msg, isError = false) {
      setAuthMsg(msg);
      setAuthError(isError);
    }

    async function signInWithProvider(provider) {
      if (!supabaseClient) {
        setMessage("No se pudo conectar con el sistema de acceso.", true);
        return;
      }

      setAuthLoading(true);
      setMessage("");
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`
        }
      });
      if (error) {
        setMessage(error.message, true);
      }
      setAuthLoading(false);
    }

    async function signInWithEmail() {
      if (!supabaseClient) {
        setMessage("No se pudo conectar con el sistema de acceso.", true);
        return;
      }
      if (!authForm.email || !authForm.password) {
        setMessage("Completa correo y contrasena para continuar.", true);
        return;
      }

      setAuthLoading(true);
      setMessage("");
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password
      });
      setAuthLoading(false);

      if (error) {
        setMessage(error.message, true);
        return;
      }
      setMessage("Sesion iniciada correctamente.");
      setView("panel");
    }

    async function signUpWithEmail() {
      if (!supabaseClient) {
        setMessage("No se pudo conectar con el sistema de acceso.", true);
        return;
      }
      if (!authForm.email || !authForm.password || !authForm.nombre) {
        setMessage("Completa nombre, correo y contrasena para registrarte.", true);
        return;
      }

      setAuthLoading(true);
      setMessage("");
      const { error } = await supabaseClient.auth.signUp({
        email: authForm.email.trim().toLowerCase(),
        password: authForm.password,
        options: {
          data: {
            nombre: authForm.nombre.trim(),
            telefono: authForm.telefono.trim()
          }
        }
      });
      setAuthLoading(false);
      if (error) {
        setMessage(error.message, true);
        return;
      }
      setAuthMode("login");
      setMessage("Cuenta creada. Revisa tu correo para verificar tu acceso.");
    }

    async function recoverPassword() {
      if (!supabaseClient) {
        setMessage("No se pudo conectar con el sistema de acceso.", true);
        return;
      }
      if (!authForm.email) {
        setMessage("Ingresa tu correo para recuperar la contrasena.", true);
        return;
      }
      const { error } = await supabaseClient.auth.resetPasswordForEmail(authForm.email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}${window.location.pathname}`
      });
      if (error) {
        setMessage(error.message, true);
        return;
      }
      setMessage("Te enviamos un correo para restablecer tu contrasena.");
    }

    async function signOut() {
      if (!supabaseClient) return;
      await supabaseClient.auth.signOut();
      setView("home");
      setMessage("Sesion cerrada.");
    }

    function openView(nextView) {
      if ((nextView === "admin" || nextView === "panel") && !user) {
        setMessage("Inicia sesion para entrar a esta seccion.");
        setAuthError(false);
        setView("auth");
        return;
      }
      setView(nextView);
    }

    const selected = useMemo(
      () => PRODUCTS.find((p) => p.id === selectedId) || PRODUCTS[0],
      [selectedId]
    );

    const filtered = useMemo(() => {
      let rows = PRODUCTS.filter((p) => {
        const inCategory = category === "Todas" || p.category === category;
        const inQuery = `${p.name} ${p.brand} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase().trim());
        return inCategory && inQuery;
      });
      if (sort === "precio_asc") rows = [...rows].sort((a, b) => a.price - b.price);
      if (sort === "precio_desc") rows = [...rows].sort((a, b) => b.price - a.price);
      if (sort === "rating") rows = [...rows].sort((a, b) => b.rating - a.rating);
      if (sort === "nuevos") rows = [...rows].reverse();
      return rows;
    }, [query, category, sort]);

    const cartTotal = useMemo(
      () => cart.reduce((acc, row) => acc + row.price * row.qty, 0),
      [cart]
    );
    const shipping = cartTotal >= 3000 || cartTotal === 0 ? 0 : 250;
    const grandTotal = cartTotal + shipping;

    function openProduct(id) {
      setSelectedId(id);
      setView("product");
    }

    function addToCart(product) {
      setCart((prev) => {
        const idx = prev.findIndex((row) => row.id === product.id);
        if (idx === -1) return [...prev, { ...product, qty: 1 }];
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      });
    }

    function updateQty(id, nextQty) {
      setCart((prev) =>
        prev
          .map((row) => (row.id === id ? { ...row, qty: Math.max(1, nextQty) } : row))
          .filter((row) => row.qty > 0)
      );
    }

    function removeFromCart(id) {
      setCart((prev) => prev.filter((row) => row.id !== id));
    }

    function completeOrder() {
      const order = {
        id: slugOrderNumber(),
        date: new Date().toLocaleString("es-DO"),
        method: paymentMethod,
        items: cart,
        total: grandTotal
      };
      setLastOrder(order);
      setCart([]);
      setCheckoutStep(1);
      setView("confirm");
      setTrackingCode(order.id);
    }

    const payLabel = paymentMethod === "whatsapp" ? "Coordinar por WhatsApp" : "Finalizar compra";
    const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20quiero%20pagar%20mi%20pedido%20en%20${STORE_NAME}.`;

    return h(
      "div",
      { className: "mp-app" },
      h(Header, {
        storeName: STORE_NAME,
        query,
        setQuery,
        setView: openView,
        user,
        cartCount: cart.reduce((acc, row) => acc + row.qty, 0)
      }),
      h(
        "main",
        { className: "mp-main" },
        view === "home" &&
          h(HomeView, {
            products: PRODUCTS,
            setView,
            openProduct
          }),
        view === "catalog" &&
          h(CatalogView, {
            filtered,
            category,
            setCategory,
            sort,
            setSort,
            openProduct
          }),
        view === "product" &&
          h(ProductView, {
            product: selected,
            addToCart,
            setView
          }),
        view === "cart" &&
          h(CartView, {
            cart,
            updateQty,
            removeFromCart,
            cartTotal,
            shipping,
            grandTotal,
            setView
          }),
        view === "checkout" &&
          h(CheckoutView, {
            cart,
            checkoutStep,
            setCheckoutStep,
            paymentMethod,
            setPaymentMethod,
            cartTotal,
            shipping,
            grandTotal,
            payLabel,
            completeOrder,
            whatsappHref
          }),
        view === "confirm" && h(ConfirmView, { order: lastOrder, setView }),
        view === "tracking" &&
          h(TrackingView, {
            trackingCode,
            setTrackingCode,
            order: lastOrder
          }),
        view === "panel" && h(UserPanelView),
        view === "admin" &&
          h(AdminPanelView, {
            user,
            setView: openView,
            signInWithProvider,
            signOut,
            authLoading
          }),
        view === "auth" &&
          h(AuthView, {
            authMode,
            setAuthMode,
            authForm,
            setAuthForm,
            signInWithEmail,
            signUpWithEmail,
            signInWithProvider,
            recoverPassword,
            authMsg,
            authError,
            authLoading,
            user,
            signOut
          }),
        h(TrustView)
      )
    );
  }

  function Header({ storeName, query, setQuery, setView, cartCount, user }) {
    const userLabel = user?.user_metadata?.nombre || user?.email || "Invitado";
    return h(
      "header",
      { className: "mp-header" },
      h(
        "div",
        { className: "mp-topbar" },
        h(
          "button",
          {
            className: "mp-logo",
            onClick: () => setView("home"),
            type: "button"
          },
          storeName
        ),
        h("input", {
          className: "mp-search",
          placeholder: "Busca productos, marcas o categorias...",
          value: query,
          onChange: (e) => setQuery(e.target.value)
        }),
        h(
          "nav",
          { className: "mp-nav" },
          h("span", { className: "mp-user-pill" }, userLabel),
          navBtn("Inicio", () => setView("home")),
          navBtn("Tienda", () => setView("catalog")),
          navBtn("Rastreo", () => setView("tracking")),
          navBtn("Mi cuenta", () => setView("panel")),
          navBtn("Gestion", () => setView("admin")),
          navBtn("Acceso", () => setView("auth")),
          h(
            "button",
            { className: "mp-nav-btn mp-cart-btn", onClick: () => setView("cart"), type: "button" },
            `Carrito (${cartCount})`
          )
        )
      )
    );
  }

  function navBtn(label, onClick) {
    return h("button", { className: "mp-nav-btn", onClick, type: "button" }, label);
  }

  function HomeView({ products, setView, openProduct }) {
    const deals = products.slice(0, 3);
    const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
    const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);
    return h(
      "section",
      { className: "mp-section" },
      h(
        "div",
        { className: "mp-hero" },
        h("h1", null, "Todo lo que necesitas, en un solo lugar"),
        h("p", null, "Descubre ofertas del dia, recomendados y productos favoritos con una experiencia clara y rapida."),
        h(
          "div",
          { className: "mp-row" },
          h("button", { className: "mp-btn", onClick: () => setView("catalog"), type: "button" }, "Explorar tienda"),
          h("button", { className: "mp-btn mp-btn-alt", onClick: () => setView("auth"), type: "button" }, "Iniciar sesion")
        )
      ),
      h("h2", { className: "mp-title" }, "Ofertas del dia"),
      h(ProductGrid, { items: deals, openProduct }),
      h("h2", { className: "mp-title" }, "Productos recomendados"),
      h(ProductGrid, { items: recommended, openProduct }),
      h("h2", { className: "mp-title" }, "Mas vendidos"),
      h(ProductGrid, { items: bestSellers, openProduct }),
      h(
        "div",
        { className: "mp-promo" },
        h("strong", null, "Promocion semanal"),
        h("p", null, "Envio gratis desde RD$ 3,000 y descuentos extra para clientes frecuentes.")
      )
    );
  }

  function CatalogView({ filtered, category, setCategory, sort, setSort, openProduct }) {
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Tienda"),
      h(
        "div",
        { className: "mp-filters" },
        h(
          "select",
          { value: category, onChange: (e) => setCategory(e.target.value) },
          CATEGORIES.map((c) => h("option", { key: c, value: c }, c))
        ),
        h(
          "select",
          { value: sort, onChange: (e) => setSort(e.target.value) },
          h("option", { value: "relevancia" }, "Relevancia"),
          h("option", { value: "precio_asc" }, "Precio menor"),
          h("option", { value: "precio_desc" }, "Precio mayor"),
          h("option", { value: "rating" }, "Mejor valoracion"),
          h("option", { value: "nuevos" }, "Nuevos")
        )
      ),
      h("p", { className: "mp-muted" }, `${filtered.length} productos encontrados`),
      h(ProductGrid, { items: filtered, openProduct })
    );
  }

  function ProductGrid({ items, openProduct }) {
    return h(
      "div",
      { className: "mp-grid" },
      items.map((p) =>
        h(
          "article",
          { className: "mp-card", key: p.id },
          h("img", { src: p.image, alt: p.name, className: "mp-card-img", loading: "lazy" }),
          h("span", { className: "mp-chip" }, p.category),
          h("h3", null, p.name),
          h("p", { className: "mp-muted" }, `${p.brand} | ${p.rating} estrellas`),
          h(
            "p",
            { className: "mp-pricing" },
            h("strong", null, money(p.price)),
            h("span", { className: "mp-old" }, money(p.oldPrice))
          ),
          h("button", { className: "mp-btn", onClick: () => openProduct(p.id), type: "button" }, "Ver producto")
        )
      )
    );
  }

  function ProductView({ product, addToCart, setView }) {
    return h(
      "section",
      { className: "mp-section mp-product" },
      h("img", { src: product.image, alt: product.name, className: "mp-product-img" }),
      h(
        "div",
        null,
        h("h2", { className: "mp-title" }, product.name),
        h("p", { className: "mp-muted" }, `${product.category} | ${product.brand} | ${product.rating} estrellas`),
        h("p", null, product.desc),
        h("p", { className: "mp-pricing" }, h("strong", null, money(product.price))),
        h("p", { className: "mp-muted" }, `Disponibilidad: ${product.stock} unidades`),
        h(
          "div",
          { className: "mp-row" },
          h("button", { className: "mp-btn", onClick: () => addToCart(product), type: "button" }, "Agregar al carrito"),
          h(
            "button",
            {
              className: "mp-btn mp-btn-alt",
              onClick: () => {
                addToCart(product);
                setView("checkout");
              },
              type: "button"
            },
            "Comprar ahora"
          )
        )
      )
    );
  }

  function CartView({ cart, updateQty, removeFromCart, cartTotal, shipping, grandTotal, setView }) {
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Carrito de compras"),
      cart.length === 0 &&
        h(
          "div",
          { className: "mp-empty" },
          h("p", null, "Tu carrito esta vacio."),
          h("button", { className: "mp-btn", onClick: () => setView("catalog"), type: "button" }, "Ir al catalogo")
        ),
      cart.length > 0 &&
        h(
          React.Fragment,
          null,
          h(
            "div",
            { className: "mp-cart-list" },
            cart.map((row) =>
              h(
                "article",
                { className: "mp-cart-item", key: row.id },
                h("img", { src: row.image, alt: row.name }),
                h(
                  "div",
                  null,
                  h("h4", null, row.name),
                  h("p", { className: "mp-muted" }, money(row.price)),
                  h(
                    "div",
                    { className: "mp-row" },
                    h("button", { className: "mp-mini-btn", onClick: () => updateQty(row.id, row.qty - 1), type: "button" }, "-"),
                    h("strong", null, row.qty),
                    h("button", { className: "mp-mini-btn", onClick: () => updateQty(row.id, row.qty + 1), type: "button" }, "+"),
                    h("button", { className: "mp-mini-btn mp-danger", onClick: () => removeFromCart(row.id), type: "button" }, "Eliminar")
                  )
                )
              )
            )
          ),
          h(
            "div",
            { className: "mp-summary" },
            h("p", null, h("span", null, "Subtotal"), h("strong", null, money(cartTotal))),
            h("p", null, h("span", null, "Envio"), h("strong", null, money(shipping))),
            h("p", { className: "mp-grand" }, h("span", null, "Total"), h("strong", null, money(grandTotal))),
            h("button", { className: "mp-btn", onClick: () => setView("checkout"), type: "button" }, "Proceder al pago")
          )
        )
    );
  }

  function CheckoutView({
    cart,
    checkoutStep,
    setCheckoutStep,
    paymentMethod,
    setPaymentMethod,
    cartTotal,
    shipping,
    grandTotal,
    payLabel,
    completeOrder,
    whatsappHref
  }) {
    const isDesktop = window.matchMedia("(min-width: 960px)").matches;
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Finalizar compra"),
      h(
        "div",
        { className: "mp-stepper" },
        [
          { id: 1, label: "Datos" },
          { id: 2, label: "Entrega" },
          { id: 3, label: "Pago" }
        ].map((s) =>
          h(
            "button",
            {
              key: s.id,
              className: `mp-step ${checkoutStep === s.id ? "active" : ""}`,
              onClick: () => setCheckoutStep(s.id),
              type: "button"
            },
            s.label
          )
        )
      ),
      checkoutStep === 1 &&
        h(
          "div",
          { className: "mp-pane" },
          h("h3", null, "Direccion de envio"),
          h("input", { placeholder: "Nombre completo" }),
          h("input", { placeholder: "Telefono" }),
          h("input", { placeholder: "Direccion" }),
          h("input", { placeholder: "Provincia / Ciudad" })
        ),
      checkoutStep === 2 &&
        h(
          "div",
          { className: "mp-pane" },
          h("h3", null, "Metodo de envio"),
          h(
            "label",
            { className: "mp-option" },
            h("input", { type: "radio", name: "shipping", defaultChecked: true }),
            " Estandar (2-4 dias)"
          ),
          h(
            "label",
            { className: "mp-option" },
            h("input", { type: "radio", name: "shipping" }),
            " Express (24h)"
          )
        ),
      checkoutStep === 3 &&
        h(
          "div",
          { className: "mp-pane" },
          h("h3", null, "Metodo de pago"),
          h(
            "label",
            { className: "mp-option" },
            h("input", {
              type: "radio",
              name: "payment",
              checked: paymentMethod === "paypal",
              onChange: () => setPaymentMethod("paypal")
            }),
            " PayPal"
          ),
          h(
            "label",
            { className: "mp-option" },
            h("input", {
              type: "radio",
              name: "payment",
              checked: paymentMethod === "applepay",
              onChange: () => setPaymentMethod("applepay")
            }),
            " Apple Pay (via PayPal)"
          ),
          h(
            "label",
            { className: "mp-option" },
            h("input", {
              type: "radio",
              name: "payment",
              checked: paymentMethod === "googlepay",
              onChange: () => setPaymentMethod("googlepay")
            }),
            " Google Pay (via PayPal)"
          ),
          h(
            "label",
            { className: "mp-option" },
            h("input", {
              type: "radio",
              name: "payment",
              checked: paymentMethod === "whatsapp",
              onChange: () => setPaymentMethod("whatsapp")
            }),
            " WhatsApp"
          ),
          isDesktop &&
            paymentMethod === "paypal" &&
            h(
              "a",
              {
                className: "mp-btn mp-btn-alt",
                href: "https://www.paypal.com/",
                target: "_blank",
                rel: "noreferrer noopener"
              },
              "Ir a pago PayPal en navegador"
            ),
          paymentMethod === "whatsapp" &&
            h(
              "a",
              { className: "mp-btn mp-wa", href: whatsappHref, target: "_blank", rel: "noreferrer noopener" },
              "Pagar por WhatsApp"
            )
        ),
      h(
        "div",
        { className: "mp-summary" },
        h("p", null, h("span", null, "Items"), h("strong", null, String(cart.length))),
        h("p", null, h("span", null, "Subtotal"), h("strong", null, money(cartTotal))),
        h("p", null, h("span", null, "Envio"), h("strong", null, money(shipping))),
        h("p", { className: "mp-grand" }, h("span", null, "Total"), h("strong", null, money(grandTotal))),
        h("button", { className: "mp-btn", onClick: completeOrder, type: "button", disabled: cart.length === 0 }, payLabel)
      )
    );
  }

  function ConfirmView({ order, setView }) {
    if (!order) {
      return h("section", { className: "mp-section" }, h("p", null, "No hay una compra confirmada aun."));
    }
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Compra confirmada"),
      h(
        "div",
        { className: "mp-confirm" },
        h("p", null, h("strong", null, "Numero de pedido: "), order.id),
        h("p", null, h("strong", null, "Fecha: "), order.date),
        h("p", null, h("strong", null, "Metodo de pago: "), order.method),
        h("p", null, h("strong", null, "Total: "), money(order.total)),
        h("p", null, "Te enviamos notificacion por correo y podras rastrear este pedido en tiempo real."),
        h("button", { className: "mp-btn", onClick: () => setView("tracking"), type: "button" }, "Rastrear pedido")
      )
    );
  }

  function TrackingView({ trackingCode, setTrackingCode, order }) {
    const hasMatch = order && trackingCode && trackingCode.trim() === order.id;
    const states = ["Pedido recibido", "Procesando", "Enviado", "En camino", "Entregado"];
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Sistema de rastreo"),
      h(
        "div",
        { className: "mp-pane" },
          h("input", {
          value: trackingCode,
          onChange: (e) => setTrackingCode(e.target.value),
          placeholder: "Escribe tu numero de pedido"
        }),
        h(
          "p",
          { className: "mp-muted" },
          hasMatch ? `Pedido encontrado: ${order.id}` : "Ingresa un codigo valido para consultar."
        ),
        hasMatch &&
          h(
            "ol",
            { className: "mp-track" },
            states.map((s, idx) => h("li", { key: s, className: idx < 3 ? "done" : "" }, s))
          )
      )
    );
  }

  function UserPanelView() {
    const cards = ["Perfil", "Direcciones", "Pedidos", "Pagos", "Favoritos", "Devoluciones"];
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Mi cuenta"),
      h(
        "div",
        { className: "mp-grid mp-grid-small" },
        cards.map((title) =>
          h(
            "article",
            { className: "mp-panel-card", key: title },
            h("h4", null, title),
            h("p", { className: "mp-muted" }, "Gestiona esta seccion desde un solo lugar.")
          )
        )
      )
    );
  }

  function AdminPanelView({ user, setView, signInWithProvider, signOut, authLoading }) {
    if (!user) {
      return h(
        "section",
        { className: "mp-section" },
        h("h2", { className: "mp-title" }, "Gestion de tienda"),
        h(
          "div",
          { className: "mp-pane" },
          h("p", { className: "mp-muted" }, "Para entrar en esta seccion, inicia sesion primero."),
          h("button", { className: "mp-btn mp-btn-alt", onClick: () => signInWithProvider("google"), type: "button", disabled: authLoading }, "Entrar con Google"),
          h("button", { className: "mp-btn mp-btn-alt", onClick: () => signInWithProvider("apple"), type: "button", disabled: authLoading }, "Entrar con Apple"),
          h("button", { className: "mp-link", onClick: () => setView("auth"), type: "button" }, "Usar correo y contrasena")
        )
      );
    }

    const blocks = [
      "Agregar productos",
      "Gestionar vendedores",
      "Ver pedidos",
      "Gestionar pagos",
      "Estadisticas"
    ];
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Gestion de tienda"),
      h(
        "div",
        { className: "mp-row", style: { marginBottom: "10px" } },
        h("span", { className: "mp-muted" }, `Sesion activa: ${user.email || "usuario"}`),
        h("button", { className: "mp-link", onClick: signOut, type: "button" }, "Cerrar sesion")
      ),
      h(
        "div",
        { className: "mp-grid mp-grid-small" },
        blocks.map((title) =>
          h(
            "article",
            { className: "mp-panel-card", key: title },
            h("h4", null, title),
            h("p", { className: "mp-muted" }, "Control rapido para mantener la tienda actualizada.")
          )
        )
      )
    );
  }

  function AuthView({
    authMode,
    setAuthMode,
    authForm,
    setAuthForm,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    recoverPassword,
    authMsg,
    authError,
    authLoading,
    user,
    signOut
  }) {
    const register = authMode === "register";
    const setField = (field) => (e) => setAuthForm((prev) => ({ ...prev, [field]: e.target.value }));
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, register ? "Registro de usuario" : "Inicio de sesion"),
      user &&
        h(
          "div",
          { className: "mp-auth-msg" },
          h("strong", null, "Sesion activa: "),
          user.email || "Usuario",
          " ",
          h("button", { className: "mp-link", onClick: signOut, type: "button" }, "Cerrar sesion")
        ),
      h(
        "div",
        { className: "mp-pane" },
        register && h("input", { placeholder: "Nombre completo", value: authForm.nombre, onChange: setField("nombre") }),
        h("input", { placeholder: "Correo electronico", value: authForm.email, onChange: setField("email") }),
        h("input", { placeholder: "Contrasena", type: "password", value: authForm.password, onChange: setField("password") }),
        register && h("input", { placeholder: "Telefono", value: authForm.telefono, onChange: setField("telefono") }),
        register && h("input", { placeholder: "Direccion (opcional)" }),
        h(
          "button",
          {
            className: "mp-btn",
            type: "button",
            onClick: register ? signUpWithEmail : signInWithEmail,
            disabled: authLoading
          },
          authLoading ? "Procesando..." : register ? "Crear cuenta" : "Ingresar"
        ),
        h(
          "div",
          { className: "mp-row" },
          h(
            "button",
            {
              className: "mp-btn mp-btn-alt",
              type: "button",
              onClick: () => signInWithProvider("google"),
              disabled: authLoading
            },
            "Continuar con Google"
          ),
          h(
            "button",
            {
              className: "mp-btn mp-btn-alt",
              type: "button",
              onClick: () => signInWithProvider("apple"),
              disabled: authLoading
            },
            "Continuar con Apple"
          )
        ),
        !register &&
          h(
            "div",
            { className: "mp-row" },
            h("button", { className: "mp-link", type: "button", onClick: recoverPassword }, "Recuperar contrasena")
          ),
        authMsg && h("p", { className: authError ? "mp-auth-msg mp-auth-error" : "mp-auth-msg" }, authMsg),
        h(
          "button",
          { className: "mp-link", onClick: () => setAuthMode(register ? "login" : "register"), type: "button" },
          register ? "Ya tengo cuenta" : "Crear cuenta nueva"
        )
      )
    );
  }

  function TrustView() {
    const points = [
      "Compras seguras",
      "Entrega confiable",
      "Atencion personalizada",
      "Soporte por WhatsApp",
      "Pagos rapidos",
      "Ofertas semanales"
    ];
    return h(
      "section",
      { className: "mp-section" },
      h("h2", { className: "mp-title" }, "Por que comprar en HigueyShop"),
      h(
        "div",
        { className: "mp-schema" },
        h("p", null, "Ofrecemos una experiencia de compra simple, visual y confiable para que encuentres lo que buscas mas rapido."),
        h("h4", null, "Beneficios"),
        h(
          "div",
          { className: "mp-tags" },
          points.map((t) => h("span", { className: "mp-tag", key: t }, t))
        )
      )
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(h(App));
})();
