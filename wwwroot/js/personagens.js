/* =====================================================
   personagens.js: aliados e inimigos (dados vêm do C#)
   ===================================================== */
(function () {
  const grade = $("#grade-personagens");
  if (!grade) return;

  async function carregar(tipo) {
    const caminho = tipo ? `/api/personagens?tipo=${encodeURIComponent(tipo)}` : "/api/personagens";
    try {
      const personagens = await api(caminho);
      grade.innerHTML = "";

      personagens.forEach((p) => {
        const cartao = criar("article", "cartao personagem");
        cartao.append(
          criar("span", "icone", p.icone),
          criar("span", `tag ${p.tipo}`, p.tipo),
          criar("h3", "", p.nome),
          criar("p", "", p.descricao)
        );
        grade.appendChild(cartao);
      });
    } catch (erro) {
      grade.textContent = erro.message;
    }
  }

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.toggle("ativo", c === chip));
      carregar(chip.dataset.tipo);
    });
  });

  carregar("");
})();
