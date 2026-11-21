/* =====================================================
   hqs.js: lista de quadrinhos com busca, filtro de era
   e marcação de "lida". Os dados vêm do servidor C#.
   ===================================================== */
(async function () {
  const lista = $("#lista-hqs");
  if (!lista) return;

  const campoBusca = $("#busca-hq");
  const seletorEra = $("#era-hq");
  const vazio = $("#hq-vazio");
  let todosIds = [];

  function atualizarProgresso() {
    const lidas = lerLidas().filter((id) => todosIds.includes(id)).length;
    const total = todosIds.length;
    $("#txt-progresso").textContent = `${lidas} de ${total} lidas`;
    $("#barra-progresso").style.width = (total ? (lidas / total) * 100 : 0) + "%";
  }

  // Busca todas as HQs uma vez para montar o filtro de eras e o progresso
  async function prepararFiltros() {
    const todas = await api("/api/hqs");
    todosIds = todas.map((h) => h.id);

    [...new Set(todas.map((h) => h.era))].forEach((era) => {
      const opcao = criar("option", "", era);
      opcao.value = era;
      seletorEra.appendChild(opcao);
    });
    atualizarProgresso();
  }

  function textoBotaoLida(lida) {
    return lida ? "✓ Lida" : "Marcar como lida";
  }

  function desenhar(hqs) {
    lista.innerHTML = "";
    vazio.hidden = hqs.length > 0;
    const lidas = lerLidas();

    hqs.forEach((h) => {
      const item = criar("article", "hq-item");
      const corpo = criar("div", "cartao hq-corpo");
      const jaLida = lidas.includes(h.id);
      if (jaLida) corpo.classList.add("lida");

      const capa = midia(`img/${h.id}.jpg`, h.icone, `Capa de ${h.titulo}`);
      capa.style.setProperty("--h", h.cor);

      const texto = criar("div");
      const detalhe = criar("a", "btn btn-principal", "Ver contexto completo");
      detalhe.href = `detail.html?hq=${encodeURIComponent(h.id)}`;

      const btnLida = criar("button", "btn btn-contorno", textoBotaoLida(jaLida));
      btnLida.type = "button";
      btnLida.addEventListener("click", () => {
        const agoraLida = alternarLida(h.id);
        btnLida.textContent = textoBotaoLida(agoraLida);
        corpo.classList.toggle("lida", agoraLida);
        atualizarProgresso();
      });

      texto.append(
        criar("small", "era", h.era),
        criar("h3", "", h.titulo),
        criar("p", "", `${h.resumo} ${h.contexto}`),
        (() => { const botoes = criar("div", "botoes"); botoes.append(detalhe, btnLida); return botoes; })()
      );

      corpo.append(capa, texto);
      item.append(criar("div", "hq-ano", String(h.ano)), corpo);
      lista.appendChild(item);
    });
  }

  async function carregar() {
    const params = new URLSearchParams();
    if (campoBusca.value.trim()) params.set("busca", campoBusca.value.trim());
    if (seletorEra.value) params.set("era", seletorEra.value);

    try {
      desenhar(await api("/api/hqs?" + params.toString()));
    } catch (erro) {
      lista.textContent = erro.message;
    }
  }

  // Espera 300 ms depois da última tecla antes de buscar
  let espera;
  campoBusca.addEventListener("input", () => {
    clearTimeout(espera);
    espera = setTimeout(carregar, 300);
  });
  seletorEra.addEventListener("change", carregar);

  try {
    await prepararFiltros();
  } catch (erro) {
    lista.textContent = erro.message;
    return;
  }
  carregar();
})();
