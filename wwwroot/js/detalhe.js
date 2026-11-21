/* =====================================================
   detalhe.js: página de detalhes de uma HQ (detail.html?hq=...)
   ===================================================== */
(async function () {
  const caixa = $("#detalhe");
  if (!caixa) return;

  function cartaoTexto(titulo, texto) {
    const cartao = criar("article", "cartao");
    cartao.append(criar("h3", "", titulo), criar("p", "", texto));
    return cartao;
  }

  function naoEncontrada() {
    caixa.innerHTML = "";
    const cartao = criar("div", "cartao");
    cartao.append(criar("h2", "", "HQ não encontrada"), criar("p", "", "Volte para a lista e escolha um card."));
    caixa.appendChild(cartao);
  }

  const id = new URLSearchParams(location.search).get("hq");
  if (!id) {
    naoEncontrada();
    return;
  }

  try {
    const [hq, todas] = await Promise.all([
      api("/api/hqs/" + encodeURIComponent(id)),
      api("/api/hqs"),
    ]);

    document.title = `${hq.titulo} | Nightwing`;
    const posicao = todas.findIndex((h) => h.id === hq.id);
    const anterior = todas[posicao - 1];
    const proxima = todas[posicao + 1];

    caixa.innerHTML = "";

    /* topo: capa + informações */
    const capa = midia(`img/${hq.id}.jpg`, hq.icone, `Capa de ${hq.titulo}`);
    capa.style.setProperty("--h", hq.cor);

    const info = criar("div");
    const btnLida = criar("button", "btn btn-contorno");
    btnLida.type = "button";
    const jaLida = () => lerLidas().includes(hq.id);
    const atualizarBotao = () => { btnLida.textContent = jaLida() ? "✓ Lida" : "Marcar como lida"; };
    atualizarBotao();
    btnLida.addEventListener("click", () => { alternarLida(hq.id); atualizarBotao(); });

    const autores = criar("p");
    autores.append(criar("b", "", "Criadores: "), hq.autores);

    info.append(
      criar("small", "era", `${hq.era} • ${hq.ano}`),
      criar("h1", "", hq.titulo),
      criar("p", "lead", hq.resumo),
      autores,
      (() => { const botoes = criar("div", "botoes"); botoes.appendChild(btnLida); return botoes; })()
    );

    const topo = criar("div", "detalhe-topo");
    topo.append(capa, info);

    /* três cartões */
    const grade = criar("div", "grade g3");
    grade.append(
      cartaoTexto("Contexto", hq.contexto),
      cartaoTexto("Por que ler", hq.porque),
      cartaoTexto("E depois?", hq.depois)
    );

    /* anterior / próxima */
    const pager = criar("div", "pager");
    if (anterior) {
      const a = criar("a", "btn btn-contorno", `‹ ${anterior.titulo}`);
      a.href = `detail.html?hq=${encodeURIComponent(anterior.id)}`;
      pager.appendChild(a);
    } else {
      pager.appendChild(criar("span"));
    }
    if (proxima) {
      const a = criar("a", "btn btn-principal", `${proxima.titulo} ›`);
      a.href = `detail.html?hq=${encodeURIComponent(proxima.id)}`;
      pager.appendChild(a);
    }

    caixa.append(topo, grade, pager);
  } catch (erro) {
    if (erro.message === "HQ não encontrada.") naoEncontrada();
    else caixa.textContent = erro.message;
  }
})();
