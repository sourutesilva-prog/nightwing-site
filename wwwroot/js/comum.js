/* =====================================================
   comum.js: funções que todas as páginas usam
   (tema, abas, menu do celular, conversa com o C# e visitas)
   ===================================================== */

// Atalhos: $("#id") no lugar de document.querySelector("#id")
const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => document.querySelectorAll(seletor);

// Cria um elemento HTML já com classe e texto
function criar(tag, classe = "", texto = "") {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto) el.textContent = texto;
  return el;
}

// Fala com o servidor C#. Devolve os dados ou lança um erro com mensagem amigável.
async function api(caminho, opcoes) {
  let resposta;
  try {
    resposta = await fetch(caminho, opcoes);
  } catch {
    throw new Error("Sem conexão com o servidor C#. Ele está rodando (dotnet run)?");
  }
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.erro || "Erro no servidor.");
  return dados;
}

// Monta as opções de um POST com dados em JSON
function enviarJson(dados) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  };
}

// Caixa com imagem. Se a imagem não existir, aparece o emoji de reserva.
function midia(src, emoji, alt, classeExtra = "") {
  const caixa = criar("div", ("midia " + classeExtra).trim());
  const img = document.createElement("img");
  img.alt = alt;
  img.addEventListener("error", () => img.remove());
  img.src = src;
  caixa.append(criar("span", "", emoji), img);
  return caixa;
}

/* ============ TEMA CLARO / ESCURO ============ */
const btnTema = $("#btn-tema");

function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  btnTema.textContent = tema === "dark" ? "☾" : "☀";
  try { localStorage.setItem("nw-tema", tema); } catch { /* sem problema */ }
}

let temaSalvo = "dark";
try { temaSalvo = localStorage.getItem("nw-tema") || "dark"; } catch { /* sem problema */ }
aplicarTema(temaSalvo);

btnTema.addEventListener("click", () => {
  aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

/* ============ MENU NO CELULAR ============ */
const btnMenu = $("#btn-menu");
const menuAbas = $("#abas");

btnMenu.addEventListener("click", () => {
  const aberto = menuAbas.classList.toggle("aberto");
  btnMenu.setAttribute("aria-expanded", String(aberto));
});

function fecharMenu() {
  menuAbas.classList.remove("aberto");
  btnMenu.setAttribute("aria-expanded", "false");
}

/* ============ HQs LIDAS (ficam salvas no navegador) ============ */
function lerLidas() {
  try { return JSON.parse(localStorage.getItem("nw-hqs-lidas") || "[]"); }
  catch { return []; }
}

// Marca/desmarca uma HQ. Devolve true se agora ela está marcada como lida.
function alternarLida(id) {
  const lidas = lerLidas();
  const posicao = lidas.indexOf(id);
  if (posicao >= 0) lidas.splice(posicao, 1);
  else lidas.push(id);
  try { localStorage.setItem("nw-hqs-lidas", JSON.stringify(lidas)); } catch { /* sem problema */ }
  return posicao < 0;
}

/* ============ ABAS (só na página principal) ============ */
if (document.body.dataset.pagina === "index") {
  function mostrarAba(nome) {
    const painel = document.getElementById(nome);
    if (!painel || !painel.classList.contains("painel")) nome = "principal";

    $$(".aba").forEach((a) => a.classList.toggle("ativa", a.dataset.aba === nome));
    $$(".painel").forEach((p) => p.classList.toggle("ativo", p.id === nome));

    history.replaceState(null, "", "#" + nome);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fecharMenu();
  }

  $$(".aba").forEach((a) => a.addEventListener("click", () => mostrarAba(a.dataset.aba)));

  // Qualquer botão/link com data-aba-link leva para outra aba
  $$("[data-aba-link]").forEach((el) => {
    el.addEventListener("click", (evento) => {
      evento.preventDefault();
      mostrarAba(el.dataset.abaLink);
    });
  });

  mostrarAba(location.hash.replace("#", "") || "principal");
}

/* ============ CONTADOR DE VISITAS ============ */
async function registrarVisita() {
  const caixa = $("#visitas");
  if (!caixa) return;
  try {
    let dados;
    if (sessionStorage.getItem("nw-visitou")) {
      dados = await api("/api/visitas"); // já contou nesta visita, só lê o número
    } else {
      dados = await api("/api/visitas", { method: "POST" });
      sessionStorage.setItem("nw-visitou", "1");
    }
    caixa.textContent = `Visitas: ${dados.total}`;
  } catch {
    /* o contador é opcional: se falhar, o site continua normal */
  }
}
registrarVisita();

/* ============ CIDADE À NOITE (cenário do topo) ============ */
// Desenha prédios com números "aleatórios" que são sempre os mesmos (pela semente).
function desenharCidade() {
  const svg = $("#cidade");
  if (!svg) return;

  let semente = 7;
  const aleatorio = () => {
    semente = (semente * 9301 + 49297) % 233280;
    return semente / 233280;
  };

  const NS = "http://www.w3.org/2000/svg";
  const retangulo = (x, y, w, h, cor) => {
    const r = document.createElementNS(NS, "rect");
    r.setAttribute("x", x); r.setAttribute("y", y);
    r.setAttribute("width", w); r.setAttribute("height", h);
    r.setAttribute("fill", cor);
    return r;
  };

  // Duas camadas: a de trás (mais clara e baixa) e a da frente (mais escura e alta)
  const camadas = [
    { cor: "#0d1a38", altMin: 90, altMax: 210, largMin: 40, largMax: 80, janelas: false },
    { cor: "#070d1d", altMin: 60, altMax: 260, largMin: 50, largMax: 100, janelas: true },
  ];

  camadas.forEach((c) => {
    let x = -20;
    while (x < 1460) {
      const largura = c.largMin + aleatorio() * (c.largMax - c.largMin);
      const altura = c.altMin + aleatorio() * (c.altMax - c.altMin);
      const topo = 400 - altura;
      svg.appendChild(retangulo(x, topo, largura, altura + 2, c.cor));

      if (c.janelas) {
        for (let jy = topo + 14; jy < 380; jy += 22) {
          for (let jx = x + 8; jx < x + largura - 10; jx += 16) {
            if (aleatorio() < 0.16) {
              const j = retangulo(jx, jy, 6, 9, "");
              j.setAttribute("class", "janela");
              j.style.animationDelay = (aleatorio() * 4).toFixed(2) + "s";
              svg.appendChild(j);
            }
          }
        }
      }
      x += largura + 4 + aleatorio() * 10;
    }
  });
}
desenharCidade();

/* ============ NÚMEROS QUE "SOBEM" (1940, 1984...) ============ */
function animarNumeros() {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $$("[data-contar]").forEach((el) => {
    const alvo = Number(el.dataset.contar);
    if (reduzir || !alvo) return;

    const inicio = alvo - 60;
    const duracao = 1200;
    const comeco = performance.now();

    function passo(agora) {
      const t = Math.min(1, (agora - comeco) / duracao);
      const suave = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(inicio + (alvo - inicio) * suave);
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  });
}
animarNumeros();

/* ============ LUA E CIDADE SE MEXEM DE LEVE AO ROLAR ============ */
(function () {
  const lua = $(".lua");
  const cidade = $("#cidade");
  if (!lua || !cidade) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY, 700);
    lua.style.transform = `translateY(${y * 0.25}px)`;
    cidade.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();
