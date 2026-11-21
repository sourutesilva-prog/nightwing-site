/* =====================================================
   justica-jovem.js: guia de episódios de Justiça Jovem
   Os dados (temporadas e títulos) vêm do servidor C#.
   Os episódios que você marca como assistidos ficam salvos
   no seu navegador (localStorage).
   ===================================================== */
(async function () {
  const listaEpisodios = $("#jj-episodios");
  if (!listaEpisodios) return;

  const CHAVE = "nw-jj-vistos";
  let temporadas = [];
  let atual = 0; // posição da temporada escolhida

  // "T1E5" = temporada 1, episódio 5
  const codigo = (temporada, indice) => `T${temporada.numero}E${indice + 1}`;

  let vistos = [];
  try { vistos = JSON.parse(localStorage.getItem(CHAVE) || "[]"); } catch { vistos = []; }

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(vistos)); } catch { /* sem problema */ }
  }

  function contarVistos(temporada) {
    return temporada.episodios.filter((_, i) => vistos.includes(codigo(temporada, i))).length;
  }

  /* ---------- progresso geral e botões das temporadas ---------- */
  function atualizarResumo() {
    const total = temporadas.reduce((soma, t) => soma + t.episodios.length, 0);
    const assistidos = temporadas.reduce((soma, t) => soma + contarVistos(t), 0);
    $("#jj-progresso-txt").textContent = `${assistidos} de ${total} assistidos`;
    $("#jj-progresso-barra").style.width = (total ? (assistidos / total) * 100 : 0) + "%";

    $$("#jj-chips .chip").forEach((chip, i) => {
      const t = temporadas[i];
      chip.textContent = `T${t.numero} · ${t.nome} (${contarVistos(t)}/${t.episodios.length})`;
    });
  }

  function desenharChips() {
    const caixa = $("#jj-chips");
    caixa.innerHTML = "";
    temporadas.forEach((t, i) => {
      const chip = criar("button", "chip");
      chip.type = "button";
      chip.addEventListener("click", () => {
        atual = i;
        desenharTemporada();
      });
      caixa.appendChild(chip);
    });
  }

  /* ---------- desenhar a temporada escolhida ---------- */
  function desenharTemporada() {
    const t = temporadas[atual];

    $$("#jj-chips .chip").forEach((chip, i) => chip.classList.toggle("ativo", i === atual));

    const info = $("#jj-info");
    info.innerHTML = "";
    const aviso = criar("p");
    aviso.append(criar("b", "", "Dick Grayson: "), t.nightwing);
    info.append(
      criar("small", "era", `Temporada ${t.numero} • ${t.ano} • ${t.episodios.length} episódios`),
      criar("h3", "", t.nome),
      criar("p", "", t.resumo),
      aviso
    );

    listaEpisodios.innerHTML = "";
    t.episodios.forEach((titulo, i) => {
      const id = codigo(t, i);
      const item = criar("li", "episodio");
      const rotulo = criar("label");

      const caixa = document.createElement("input");
      caixa.type = "checkbox";
      caixa.checked = vistos.includes(id);
      item.classList.toggle("visto", caixa.checked);

      caixa.addEventListener("change", () => {
        if (caixa.checked) { if (!vistos.includes(id)) vistos.push(id); }
        else vistos = vistos.filter((v) => v !== id);
        item.classList.toggle("visto", caixa.checked);
        salvar();
        atualizarResumo();
      });

      rotulo.append(caixa, criar("span", "num", String(i + 1).padStart(2, "0")), criar("span", "titulo-ep", titulo));
      item.appendChild(rotulo);
      listaEpisodios.appendChild(item);
    });

    atualizarResumo();
  }

  /* ---------- marcar / limpar a temporada toda ---------- */
  $("#jj-marcar").addEventListener("click", () => {
    const t = temporadas[atual];
    t.episodios.forEach((_, i) => {
      const id = codigo(t, i);
      if (!vistos.includes(id)) vistos.push(id);
    });
    salvar();
    desenharTemporada();
  });

  $("#jj-limpar").addEventListener("click", () => {
    const t = temporadas[atual];
    const daTemporada = t.episodios.map((_, i) => codigo(t, i));
    vistos = vistos.filter((v) => !daTemporada.includes(v));
    salvar();
    desenharTemporada();
  });

  /* ---------- início ---------- */
  try {
    temporadas = await api("/api/justica-jovem");
    desenharChips();
    desenharTemporada();
  } catch (erro) {
    $("#jj-info").textContent = erro.message;
  }
})();
