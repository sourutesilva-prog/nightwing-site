/* =====================================================
   quiz.js: perguntas e correção vêm do servidor C#
   ===================================================== */
(function () {
  const caixa = $("#quiz-perguntas");
  if (!caixa) return;

  const form = $("#form-quiz");
  const resultado = $("#quiz-resultado");
  const btnRefazer = $("#btn-refazer");
  let perguntas = [];

  function desenhar() {
    caixa.innerHTML = "";
    resultado.textContent = "";
    btnRefazer.hidden = true;

    perguntas.forEach((p) => {
      const grupo = criar("fieldset", "pergunta");
      grupo.appendChild(criar("legend", "", `${p.id + 1}. ${p.pergunta}`));

      p.opcoes.forEach((texto, indice) => {
        const rotulo = criar("label", "opcao");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `pergunta-${p.id}`;
        radio.value = indice;
        rotulo.append(radio, texto);
        grupo.appendChild(rotulo);
      });

      caixa.appendChild(grupo);
    });
  }

  async function carregar() {
    try {
      perguntas = await api("/api/quiz");
      desenhar();
    } catch (erro) {
      caixa.textContent = erro.message;
    }
  }

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Lista de respostas (-1 = não respondeu)
    const respostas = perguntas.map((p) => {
      const marcada = document.querySelector(`input[name="pergunta-${p.id}"]:checked`);
      return marcada ? Number(marcada.value) : -1;
    });

    try {
      const dados = await api("/api/quiz/corrigir", enviarJson({ respostas }));
      resultado.textContent = `Você acertou ${dados.acertos} de ${dados.total}.`;
      btnRefazer.hidden = false;

      // Verde na resposta certa, vermelho na errada que você marcou
      perguntas.forEach((p, i) => {
        document.querySelectorAll(`input[name="pergunta-${p.id}"]`).forEach((radio, indice) => {
          const rotulo = radio.parentElement;
          rotulo.classList.remove("certa", "errada");
          if (indice === dados.corretas[i]) rotulo.classList.add("certa");
          else if (radio.checked) rotulo.classList.add("errada");
        });
      });
    } catch (erro) {
      resultado.textContent = erro.message;
    }
  });

  btnRefazer.addEventListener("click", desenhar);

  carregar();
})();
