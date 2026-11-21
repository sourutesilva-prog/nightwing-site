/* =====================================================
   jogo.js: jogo de missões + ranking
   As missões e o ranking vêm do servidor C#.
   ===================================================== */
(async function () {
  if (!$("#jogo")) return;

  const CUSTOS = { gancho: 10, esquiva: 15, final: 50 };

  let missoes = [];
  let melhor = [];      // melhor pontuação de cada missão (só conta a melhor tentativa)
  let estrelas = [];
  let desbloqueadas = 1;
  let kits = 3;
  let luta = null;      // dados da luta atual (null = nenhuma luta começou)

  const sorteio = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pontosTotais = () => melhor.reduce((soma, p) => soma + p, 0);

  /* ---------- carregar as missões do C# ---------- */
  try {
    missoes = await api("/api/missoes");
  } catch (erro) {
    $("#lista-missoes").textContent = erro.message;
    return;
  }
  melhor = missoes.map(() => 0);
  estrelas = missoes.map(() => 0);

  /* ---------- desenhar a lista de missões ---------- */
  function desenharMissoes() {
    const lista = $("#lista-missoes");
    lista.innerHTML = "";

    missoes.forEach((m, i) => {
      const bloqueada = i >= desbloqueadas;
      const botao = criar("button", "missao");
      botao.type = "button";
      botao.disabled = bloqueada;
      if (bloqueada) botao.classList.add("bloqueada");
      if (luta && luta.indice === i) botao.classList.add("atual");

      botao.append(
        criar("b", "", `${i + 1}. ${m.nome}`),
        criar("small", "", bloqueada ? "Bloqueada" : m.local),
        criar("span", "estrelas", "★".repeat(estrelas[i]) + "☆".repeat(3 - estrelas[i]))
      );
      botao.addEventListener("click", () => comecar(i));
      lista.appendChild(botao);
    });
  }

  /* ---------- atualizar barras, textos e botões ---------- */
  function atualizarTela() {
    $("#pontos").textContent = pontosTotais();
    $("#kits").textContent = kits;
    $("#btn-ranking").disabled = pontosTotais() === 0;

    const vida = luta ? luta.vida : 100;
    const energia = luta ? luta.energia : 100;
    $("#barra-vida").style.width = vida + "%";
    $("#txt-vida").textContent = `${vida} / 100`;
    $("#barra-energia").style.width = energia + "%";
    $("#txt-energia").textContent = `${energia} / 100`;

    const vidaInimigo = luta ? luta.vidaInimigo : 0;
    const vidaMaxima = luta ? luta.missao.vida : 0;
    $("#barra-vida-inimigo").style.width = (vidaMaxima ? (vidaInimigo / vidaMaxima) * 100 : 0) + "%";
    $("#txt-vida-inimigo").textContent = `${vidaInimigo} / ${vidaMaxima}`;
    $("#status-inimigo").textContent = luta && luta.atordoado ? "Atordoado" : "";

    $$("#acoes .acao").forEach((botao) => {
      const acao = botao.dataset.acao;
      const custo = CUSTOS[acao] || 0;
      botao.disabled =
        !luta || !luta.ativa || luta.energia < custo ||
        (acao === "kit" && (kits <= 0 || luta.vida >= 100));
    });
  }

  function registrar(texto, classe = "") {
    const registro = $("#registro");
    registro.prepend(criar("li", classe, texto));
    while (registro.children.length > 8) registro.lastChild.remove();
  }

  function tremer(id) {
    const el = $(id);
    el.classList.remove("tremer");
    void el.offsetWidth; // reinicia a animação
    el.classList.add("tremer");
  }

  /* ---------- começar uma missão ---------- */
  function comecar(i) {
    const m = missoes[i];

    // Se você venceu a missão anterior, recupera um pouco de vida
    const bonus = luta && luta.venceu && luta.indice === i - 1;
    const vidaInicial = bonus ? Math.min(100, luta.vida + 30) : 100;

    luta = {
      indice: i, missao: m, vida: vidaInicial, energia: 100, vidaInimigo: m.vida,
      atordoado: false, esquiva: false, ativa: true, venceu: false, pontos: 0,
    };

    $("#registro").innerHTML = "";
    $("#titulo-missao").textContent = `Missão ${i + 1}: ${m.nome}`;
    $("#nome-inimigo").textContent = m.inimigo;
    $("#icone-inimigo").textContent = m.icone;
    $("#cena").textContent = m.cena;

    // Foto do inimigo (se existir a imagem img/<nome>.jpg)
    const avatar = $("#avatar-inimigo");
    avatar.querySelector("img")?.remove();
    const img = document.createElement("img");
    img.alt = m.inimigo;
    img.addEventListener("error", () => img.remove());
    img.src = `img/${m.imagem}.jpg`;
    avatar.appendChild(img);

    registrar("A missão começou. Escolha sua ação.");
    desenharMissoes();
    atualizarTela();
  }

  /* ---------- turno do inimigo ---------- */
  function turnoInimigo() {
    const nome = luta.missao.inimigo;

    if (luta.atordoado) {
      luta.atordoado = false;
      registrar(`${nome} está atordoado e perde o turno.`);
      return;
    }
    if (luta.esquiva) {
      luta.esquiva = false;
      registrar("Você esquivou do ataque com uma acrobacia!", "bom");
      return;
    }
    if (Math.random() < 0.12) {
      registrar(`${nome} errou o ataque.`);
      return;
    }

    let dano = sorteio(luta.missao.danoMin, luta.missao.danoMax);
    const critico = Math.random() < 0.15;
    if (critico) dano = Math.round(dano * 1.5);

    luta.vida = Math.max(0, luta.vida - dano);
    tremer("#caixa-jogador");
    registrar(`${nome} acerta${critico ? " um golpe crítico" : ""} e causa ${dano} de dano.`, "ruim");
  }

  /* ---------- verificar se a luta acabou ---------- */
  function terminou() {
    if (luta.vidaInimigo <= 0) {
      luta.ativa = false;
      luta.venceu = true;

      const estrelasGanhas = luta.vida >= 70 ? 3 : luta.vida >= 40 ? 2 : 1;
      estrelas[luta.indice] = Math.max(estrelas[luta.indice], estrelasGanhas);
      melhor[luta.indice] = Math.max(melhor[luta.indice], luta.pontos + 100 + luta.vida);

      if (luta.indice + 1 < missoes.length && luta.indice + 1 >= desbloqueadas) {
        desbloqueadas = luta.indice + 2;
      }

      $("#cena").textContent = luta.indice === missoes.length - 1
        ? "Você derrotou o último inimigo e salvou Blüdhaven! Todas as missões foram concluídas."
        : `Vitória! ${estrelasGanhas} estrela(s). A próxima missão foi liberada.`;
      registrar("Missão cumprida!", "bom");
      desenharMissoes();
      atualizarTela();
      return true;
    }

    if (luta.vida <= 0) {
      luta.ativa = false;
      $("#cena").textContent = "Você foi derrotado. Clique na missão para tentar de novo.";
      registrar("Nightwing caiu. Tente outra estratégia.", "ruim");
      atualizarTela();
      return true;
    }
    return false;
  }

  /* ---------- ações do jogador ---------- */
  function agir(acao) {
    if (!luta || !luta.ativa) return;

    if (acao === "golpe") {
      const dano = sorteio(12, 20);
      luta.vidaInimigo = Math.max(0, luta.vidaInimigo - dano);
      luta.energia = Math.min(100, luta.energia + 10);
      luta.pontos += dano;
      registrar(`Golpe de escrima: ${dano} de dano.`, "bom");
      tremer("#caixa-inimigo");
    }

    if (acao === "gancho") {
      const dano = sorteio(8, 12);
      luta.energia -= CUSTOS.gancho;
      luta.vidaInimigo = Math.max(0, luta.vidaInimigo - dano);
      luta.pontos += dano;
      tremer("#caixa-inimigo");
      if (Math.random() < 0.55) {
        luta.atordoado = true;
        registrar(`Gancho: ${dano} de dano e o inimigo ficou atordoado!`, "bom");
      } else {
        registrar(`Gancho: ${dano} de dano.`, "bom");
      }
    }

    if (acao === "esquiva") {
      luta.energia -= CUSTOS.esquiva;
      luta.esquiva = true;
      registrar("Você se prepara para esquivar do próximo golpe.");
    }

    if (acao === "final") {
      const dano = sorteio(35, 45);
      luta.energia -= CUSTOS.final;
      luta.vidaInimigo = Math.max(0, luta.vidaInimigo - dano);
      luta.pontos += dano * 2;
      registrar(`Voadora final: ${dano} de dano!`, "bom");
      tremer("#caixa-inimigo");
    }

    if (acao === "kit") {
      kits--;
      luta.vida = Math.min(100, luta.vida + 25);
      registrar("Você usou um kit médico e recuperou 25 de vida.", "bom");
    }

    if (!terminou()) {
      turnoInimigo();
      if (!terminou()) atualizarTela();
    }
  }

  $$("#acoes .acao").forEach((botao) => {
    botao.addEventListener("click", () => agir(botao.dataset.acao));
  });

  /* ---------- reiniciar ---------- */
  $("#btn-reiniciar").addEventListener("click", () => {
    melhor = missoes.map(() => 0);
    estrelas = missoes.map(() => 0);
    desbloqueadas = 1;
    kits = 3;
    luta = null;

    $("#registro").innerHTML = "";
    $("#titulo-missao").textContent = "Escolha uma missão";
    $("#nome-inimigo").textContent = "—";
    $("#icone-inimigo").textContent = "❔";
    $("#avatar-inimigo").querySelector("img")?.remove();
    $("#cena").textContent = "Selecione uma missão na lista para começar.";
    desenharMissoes();
    atualizarTela();
  });

  /* ---------- ranking (conversa com o C#) ---------- */
  async function carregarRanking() {
    const lista = $("#lista-ranking");
    try {
      const dados = await api("/api/ranking");
      lista.innerHTML = "";

      if (dados.length === 0) {
        lista.appendChild(criar("li", "", "Ninguém no ranking ainda. Seja a primeira pessoa!"));
        return;
      }
      dados.forEach((r) => {
        const item = criar("li");
        item.append(criar("span", "", r.nome), criar("b", "", `${r.pontos} pts`));
        lista.appendChild(item);
      });
    } catch (erro) {
      lista.textContent = erro.message;
    }
  }

  function avisoRanking(texto, tipo) {
    const aviso = $("#aviso-ranking");
    aviso.textContent = texto;
    aviso.className = `aviso ${tipo}`;
  }

  $("#form-ranking").addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const nome = $("#nome-ranking").value.trim();

    if (nome.length < 2) {
      avisoRanking("Digite um nome com pelo menos 2 letras.", "erro");
      return;
    }

    try {
      await api("/api/ranking", enviarJson({ nome, pontos: pontosTotais() }));
      avisoRanking("Pontuação enviada!", "ok");
      carregarRanking();
    } catch (erro) {
      avisoRanking(erro.message, "erro");
    }
  });

  /* ---------- início ---------- */
  desenharMissoes();
  atualizarTela();
  carregarRanking();
})();
