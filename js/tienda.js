// ==========================================
// 1. ARREGLO DE OBJETOS LITERALES (PRODUCTOS)
// ==========================================
const productos = [
  {
    id: 1,
    nombre: "Nevecon Inverter No Frost 450L",
    categoria: "Refrigeración",
    precio: 2800000,
    potenciaAntiguo: 350, // Watts del equipo viejo a reemplazar
    potenciaNuevo: 120,   // Watts del equipo nuevo
    horasUsoDia: 24,
    imagen: "🧊"
  },
  {
    id: 2,
    nombre: "Nevera Compacta Eficiente 250L",
    categoria: "Refrigeración",
    precio: 1450000,
    potenciaAntiguo: 220,
    potenciaNuevo: 80,
    horasUsoDia: 24,
    imagen: "❄️"
  },
  {
    id: 3,
    nombre: "Aire Acondicionado Inverter 12000 BTU",
    categoria: "Climatización",
    precio: 1650000,
    potenciaAntiguo: 1500,
    potenciaNuevo: 650,
    horasUsoDia: 8,
    imagen: "💨"
  },
  {
    id: 4,
    nombre: "Ventilador de Techo Motor DC",
    categoria: "Climatización",
    precio: 320000,
    potenciaAntiguo: 90,
    potenciaNuevo: 30,
    horasUsoDia: 10,
    imagen: "🌀"
  },
  {
    id: 5,
    nombre: "Kit 10 Bombillos LED 9W Ahorradores",
    categoria: "Iluminación",
    precio: 85000,
    potenciaAntiguo: 600, // Equivale a 10 bombillos tradicionales de 60W
    potenciaNuevo: 90,    // 10 bombillos de 9W
    horasUsoDia: 6,
    imagen: "💡"
  },
  {
    id: 6,
    nombre: "Reflector Solar LED 100W Exterior",
    categoria: "Iluminación",
    precio: 190000,
    potenciaAntiguo: 200,
    potenciaNuevo: 0, // Consume 0W de la red eléctrica por ser solar
    horasUsoDia: 10,
    imagen: "☀️"
  },
  {
    id: 7,
    nombre: "Aire Acondicionado Portable Eco 9000 BTU",
    categoria: "Climatización",
    precio: 1200000,
    potenciaAntiguo: 1200,
    potenciaNuevo: 550,
    horasUsoDia: 6,
    imagen: "🌬️"
  },
  {
    id: 8,
    nombre: "Congelador Horizontal Inverter 200L",
    categoria: "Refrigeración",
    precio: 1100000,
    potenciaAntiguo: 280,
    potenciaNuevo: 95,
    horasUsoDia: 24,
    imagen: "📦"
  }
];

// Constante para cálculo energético (Precio prom. kWh en Colombia El Niño 2026 ~ $950 COP)
const COSTO_KWH = 950; 

// Carrito de compras (Arreglo dinámico)
let carrito = [];

// Elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const listaCarrito = document.querySelector("#lista-carrito");
const totalCompraElem = document.querySelector("#total-compra");
const totalAhorroElem = document.querySelector("#total-ahorro");
const tiempoAmortizacionElem = document.querySelector("#tiempo-amortizacion");
const btnVaciar = document.querySelector("#btn-vaciar");
const buscadorInput = document.querySelector("#buscador");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

// ==========================================
// 2. FUNCIONES PROPIAS DE CÁLCULO Y FORMATO
// ==========================================

// Función 1: Calcular el ahorro en kWh por mes
function calcularAhorroKwhMes(potenciaVieja, potenciaNueva, horasDia) {
  const ahorroWatts = potenciaVieja - potenciaNueva;
  return (ahorroWatts * horasDia * 30) / 1000;
}

// Función 2: Calcular el ahorro en Pesos ($ COP) por mes
function calcularAhorroPesosMes(potenciaVieja, potenciaNueva, horasDia) {
  const kwhAhorrados = calcularAhorroKwhMes(potenciaVieja, potenciaNueva, horasDia);
  return kwhAhorrados * COSTO_KWH;
}

// Función 3: Formatear valores numéricos a Pesos Colombianos
function formatoPesos(valor) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor);
}

// ==========================================
// 3. RENDERIZADO DEL CATÁLOGO EN EL DOM
// ==========================================
function renderizarCatalogo(lista) {
  contenedorProductos.innerHTML = "";

  if (lista.length === 0) {
    contenedorProductos.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="fs-5 text-muted">No se encontraron productos con esos criterios.</p>
      </div>`;
    return;
  }

  lista.forEach((producto) => {
    const ahorroPesos = calcularAhorroPesosMes(
      producto.potenciaAntiguo,
      producto.potenciaNuevo,
      producto.horasUsoDia
    );

    const tarjeta = document.createElement("div");
    tarjeta.className = "col";
    tarjeta.innerHTML = `
      <div class="card tarjeta-producto h-100 p-3 border-0">
        <div class="display-4 text-center mb-2">${producto.imagen}</div>
        <div class="card-body d-flex flex-column p-0">
          <span class="badge bg-secondary mb-2 align-self-start">${producto.categoria}</span>
          <h3 class="h5 card-title fw-bold mb-2">${producto.nombre}</h3>
          <p class="text-success fw-bold fs-5 mb-1">${formatoPesos(producto.precio)}</p>
          <p class="small text-muted mb-3">
            🍃 Ahorras aprox: <strong>${formatoPesos(ahorroPesos)} / mes</strong>
          </p>
          <button class="btn btn-success w-100 mt-auto fw-bold btn-agregar" data-id="${producto.id}">
            Agregar al carrito
          </button>
        </div>
      </div>
    `;
    contenedorProductos.appendChild(tarjeta);
  });

  // Asignar evento click a los botones de agregar recién creados
  document.querySelectorAll(".btn-agregar").forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const idProducto = parseInt(e.target.dataset.id);
      agregarAlCarrito(idProducto);
    });
  });
}

// ==========================================
// 4. LÓGICA DEL CARRITO DE COMPRAS
// ==========================================
function agregarAlCarrito(id) {
  const productoEncontrado = productos.find((prod) => prod.id === id);
  if (productoEncontrado) {
    carrito.push(productoEncontrado);
    actualizarCarritoDOM();
  }
}

function actualizarCarritoDOM() {
  listaCarrito.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `<li class="list-group-item text-muted text-center py-3">El carrito está vacío.</li>`;
    totalCompraElem.textContent = formatoPesos(0);
    totalAhorroElem.textContent = formatoPesos(0);
    tiempoAmortizacionElem.innerHTML = `Se paga solo en: <strong>0 meses</strong>`;
    btnVaciar.disabled = true;
    return;
  }

  let totalPrecio = 0;
  let totalAhorroMensual = 0;

  carrito.forEach((prod, index) => {
    totalPrecio += prod.precio;
    totalAhorroMensual += calcularAhorroPesosMes(prod.potenciaAntiguo, prod.potenciaNuevo, prod.horasUsoDia);

    const item = document.createElement("li");
    item.className = "list-group-item d-flex justify-content-between align-items-center px-0";
    item.innerHTML = `
      <div>
        <small class="fw-bold d-block">${prod.nombre}</small>
        <small class="text-muted">${formatoPesos(prod.precio)}</small>
      </div>
      <button class="btn btn-sm btn-outline-danger btn-eliminar" data-index="${index}">&times;</button>
    `;
    listaCarrito.appendChild(item);
  });

  // Evento para eliminar ítem individual del carrito
  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.index);
      carrito.splice(idx, 1);
      actualizarCarritoDOM();
    });
  });

  // Cálculos finales del carrito
  totalCompraElem.textContent = formatoPesos(totalPrecio);
  totalAhorroElem.textContent = formatoPesos(totalAhorroMensual);
  
  const mesesAmortizacion = totalAhorroMensual > 0 ? (totalPrecio / totalAhorroMensual).toFixed(1) : 0;
  tiempoAmortizacionElem.innerHTML = `Se paga solo en: <strong>${mesesAmortizacion} meses</strong>`;
  
  btnVaciar.disabled = false;
}

// Vaciar carrito
btnVaciar.addEventListener("click", () => {
  carrito = [];
  actualizarCarritoDOM();
});

// ==========================================
// 5. EVENTOS DE FILTROS Y BUSCADOR
// ==========================================

// Buscador (Evento Input)
buscadorInput.addEventListener("input", (e) => {
  const textoBuscado = e.target.value.toLowerCase();
  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(textoBuscado)
  );
  renderizarCatalogo(productosFiltrados);
});

// Filtros por Categoría (Evento Click)
botonesFiltro.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    botonesFiltro.forEach((b) => {
      b.classList.remove("active", "btn-success");
      b.classList.add("btn-outline-success");
    });

    e.target.classList.add("active", "btn-success");
    e.target.classList.remove("btn-outline-success");

    const categoriaSeleccionada = e.target.dataset.categoria;
    if (categoriaSeleccionada === "todas") {
      renderizarCatalogo(productos);
    } else {
      const filtrados = productos.filter((prod) => prod.categoria === categoriaSeleccionada);
      renderizarCatalogo(filtrados);
    }
  });
});

// Inicialización de la vista
document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo(productos);
});