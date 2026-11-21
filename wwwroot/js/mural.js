/* =====================================================
   mural.js: comentários dos fãs (salvos pelo servidor C#)
   ===================================================== */
(function () {
  const form = $("#form-mural");
  if (!form) return;

  const campoNome = $("#nome");
  const campoTexto = $("#texto");
  const contador = $("#contador");
  const aviso = $("#mural-aviso");
  const lista = $("#lista-comentarios");

  campoTexto.addEventListener("input", () => {
    contador.textContent = `${campoTexto.value.length} / 300`;
  });

  function mostrarAviso(texto, tipo) {
    aviso.textContent = texto;
    aviso.className = `aviso ${tipo}`;
  }

  async function carregar() {
    try {
      const comentarios = await api("/api/comentarios");
      lista.innerHTML = "";

      if (comentarios.length === 0) {
        lista.appendChild(criar("li", "", "Ainda não há comentários. Seja a primeira pessoa!"));
        return;
      }

      comentarios.forEach((c) => {
        const item = criar("li");
        // textContent é seguro: não executa HTML digitado por outras pessoas
        item.append(
          criar("strong", "", c.nome),
          criar("time", "", new Date(c.data).toLocaleString("pt-BR")),
          criar("p", "", c.texto)
        );
        lista.appendChild(item);
      });
    } catch (erro) {
      lista.textContent = erro.message;
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const texto = campoTexto.value.trim();

    // Validação rápida no navegador (o C# valida de novo)
    if (nome.length < 2 || texto.length < 3) {
      mostrarAviso("Preencha o nome (mín. 2 letras) e o comentário (mín. 3).", "erro");
      return;
    }

    try {
      await api("/api/comentarios", enviarJson({ nome, texto }));
      form.reset();
      contador.textContent = "0 / 300";
      mostrarAviso("Comentário publicado!", "ok");
      carregar();
    } catch (erro) {
      mostrarAviso(erro.message, "erro");
    }
  });

  carregar();
})();
