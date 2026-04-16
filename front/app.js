const API_BASE = "http://127.0.0.1:8000";

const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const resultsBodyEl = document.getElementById("results-body");
const resultsTitleEl = document.getElementById("results-title");
const resultsCountEl = document.getElementById("results-count");

const btnHombres = document.getElementById("btn-hombres");
const btnMujer = document.getElementById("btn-mujer");
const btnCustom = document.getElementById("btn-custom");
const urlInput = document.getElementById("url-input");
const urlHistorySelectEl = document.getElementById("url-history-select");

const CUSTOM_URL_HISTORY_KEY = "customUrlHistory";
let urlHistoryFallback = [];

function readStorageHistory() {
	try {
		const saved = JSON.parse(localStorage.getItem(CUSTOM_URL_HISTORY_KEY) || "[]");
		if (Array.isArray(saved)) {
			return saved;
		}
	} catch {
		// Ignore localStorage read failures and try session/fallback.
	}

	try {
		const savedSession = JSON.parse(sessionStorage.getItem(CUSTOM_URL_HISTORY_KEY) || "[]");
		if (Array.isArray(savedSession)) {
			return savedSession;
		}
	} catch {
		// Ignore sessionStorage failures.
	}

	return urlHistoryFallback;
}

function writeStorageHistory(urls) {
	urlHistoryFallback = urls;

	try {
		localStorage.setItem(CUSTOM_URL_HISTORY_KEY, JSON.stringify(urls));
		return;
	} catch {
		// Fallback to session storage.
	}

	try {
		sessionStorage.setItem(CUSTOM_URL_HISTORY_KEY, JSON.stringify(urls));
	} catch {
		// If all storage fails, keep in-memory fallback only.
	}
}

function getSavedUrls() {
	return readStorageHistory()
		.filter((item) => typeof item === "string")
		.map((item) => item.trim())
		.filter(Boolean);
}

function renderUrlHistorySelect() {
	const savedUrls = getSavedUrls();
	const currentUrl = urlInput.value.trim();
	urlHistorySelectEl.innerHTML = "";

	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.textContent = "URLs consultadas anteriormente...";
	urlHistorySelectEl.appendChild(placeholder);

	if (currentUrl && !savedUrls.includes(currentUrl)) {
		const currentOption = document.createElement("option");
		currentOption.value = currentUrl;
		currentOption.textContent = `${currentUrl} (actual)`;
		urlHistorySelectEl.appendChild(currentOption);
	}

	savedUrls.forEach((url) => {
		const option = document.createElement("option");
		option.value = url;
		option.textContent = url;
		urlHistorySelectEl.appendChild(option);
	});
}

function saveUrlToHistory(url) {
	const normalizedUrl = url.trim();
	if (!normalizedUrl) {
		return;
	}

	const nextUrls = [normalizedUrl, ...getSavedUrls().filter((item) => item !== normalizedUrl)].slice(0, 12);
	writeStorageHistory(nextUrls);
	renderUrlHistorySelect();
}

function persistInputUrl() {
	const typedUrl = urlInput.value.trim();
	if (typedUrl) {
		saveUrlToHistory(typedUrl);
	}
}

function setStatus(message, isError = false) {
	statusEl.textContent = message;
	statusEl.style.borderLeftColor = isError ? "#b91c1c" : "#155e75";
	statusEl.style.color = isError ? "#7f1d1d" : "#655a4f";
}

function showResults(title, bodyHtml, countText) {
	resultsTitleEl.textContent = title;
	resultsBodyEl.innerHTML = bodyHtml;
	resultsCountEl.textContent = countText;
	resultsEl.classList.remove("hidden");
}

function escapeHtml(text) {
	const div = document.createElement("div");
	div.textContent = text ?? "";
	return div.innerHTML;
}

function renderProducts(title, products) {
	if (!Array.isArray(products)) {
		showResults(title, "<p>La respuesta no fue una lista.</p>", "0");
		return;
	}

	if (products.length === 0) {
		showResults(title, "<p>No se encontraron productos.</p>", "0");
		return;
	}

	const cardsHtml = products
		.map((product) => {
			const nombre = escapeHtml(product.nombre || "Sin nombre");
			const precio = escapeHtml(product.precio || "Sin precio");
			const colores = escapeHtml(product.mas_colores || "No");
			return `
				<article class="product-card">
					<h3>${nombre}</h3>
					<div class="meta"><span>Precio</span><strong>${precio}</strong></div>
					<div class="meta"><span>Más colores</span><strong>${colores}</strong></div>
				</article>
			`;
		})
		.join("");

	showResults(title, `<div class="products-grid">${cardsHtml}</div>`, String(products.length));
}

function renderStock(stockObj) {
	if (!stockObj || typeof stockObj !== "object" || Array.isArray(stockObj)) {
		showResults("Stock Personalizado", "<p>La respuesta no fue válida.</p>", "0");
		return;
	}

	const entries = Object.entries(stockObj);
	const itemsHtml = entries
		.map(([key, value]) => `<li><span>${escapeHtml(key)}</span><strong>${escapeHtml(String(value ?? ""))}</strong></li>`)
		.join("");

	showResults("Stock Personalizado", `<ul class="stock-list">${itemsHtml}</ul>`, String(entries.length));
}

async function fetchJson(endpoint) {
	const response = await fetch(`${API_BASE}${endpoint}`);
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Error ${response.status}: ${body || "fallo de servidor"}`);
	}
	return response.json();
}

async function cargarProductosHombres() {
	setStatus("Consultando productos de hombres...");
	try {
		const data = await fetchJson("/productoshombres");
		renderProducts("Productos Hombres", data);
		setStatus("Consulta completada.");
	} catch (error) {
		setStatus(error.message, true);
	}
}

async function cargarProductosMujer() {
	setStatus("Consultando productos de mujeres...");
	try {
		const data = await fetchJson("/productosmujer");
		renderProducts("Productos Mujeres", data);
		setStatus("Consulta completada.");
	} catch (error) {
		setStatus(error.message, true);
	}
}

async function consultarPersonalizado() {
	const url = urlInput.value.trim();
	if (!url) {
		setStatus("Ingresa una URL para consultar el stock.", true);
		return;
	}

	saveUrlToHistory(url);
	setStatus("Consultando stock personalizado...");
	try {
		const endpoint = `/personalizado?url=${encodeURIComponent(url)}`;
		const data = await fetchJson(endpoint);
		renderStock(data);
		setStatus("Consulta completada.");
	} catch (error) {
		setStatus(error.message, true);
	}
}

btnHombres.addEventListener("click", cargarProductosHombres);
btnMujer.addEventListener("click", cargarProductosMujer);
btnCustom.addEventListener("click", consultarPersonalizado);

urlInput.addEventListener("change", persistInputUrl);

urlInput.addEventListener("blur", persistInputUrl);

urlInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		consultarPersonalizado();
	}
});

urlInput.addEventListener("input", () => {
	renderUrlHistorySelect();
});

urlHistorySelectEl.addEventListener("change", () => {
	const selectedUrl = urlHistorySelectEl.value;
	if (!selectedUrl) {
		return;
	}

	urlInput.value = selectedUrl;
	urlInput.focus();
});

renderUrlHistorySelect();
