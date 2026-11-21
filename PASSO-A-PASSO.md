# Site do Nightwing: passo a passo no VS Code

## O que tem no site

| Aba | O que faz | Quem trabalha |
|---|---|---|
| Principal | História, propósito, habilidades, equipamentos, família DC | HTML + CSS |
| Jogo | Missões por turno, estrelas, kits médicos e **ranking** | JS (jogo) + C# (missões e ranking) |
| Quadrinhos | HQs em ordem, **busca**, **filtro por era**, **marcar como lida** e página de detalhes | JS + C# (dados e filtro) |
| Justiça Jovem | Guia das 4 temporadas (98 episódios) com resumo, **marcar como assistido** e barra de progresso | JS + C# (`DadosJusticaJovem.cs`) |
| Personagens | Aliados e inimigos com filtro | JS + C# |
| Quiz | 8 perguntas corrigidas pelo servidor | JS + C# |
| Mural | Comentários dos fãs, salvos em arquivo | JS + C# |

Também tem modo claro/escuro, menu para celular e **contador de visitas** no rodapé.

## Como as peças conversam

```
Navegador (HTML + CSS + JS)  <-- fetch("/api/...") -->  Servidor C# (Program.cs)
        |                                                       |
  o que você vê                                  Dados.cs (conteúdo) + pasta dados/ (arquivos salvos)
```

Regra para lembrar: **o JavaScript cuida do que aparece e do que você clica; o C# cuida do que precisa ser guardado ou conferido** (o navegador pode ser enganado, o servidor não).

## Passo 1: instalar o que precisa (só uma vez)

1. **.NET SDK**: https://dotnet.microsoft.com/download
2. **VS Code**: https://code.visualstudio.com
3. No VS Code, abra as extensões (Ctrl+Shift+X) e instale **C# Dev Kit**.
4. Abra um terminal e confira: `dotnet --version`
   - Se aparecer, por exemplo, `10.0.100`, abra o `NightwingSite.csproj` e troque `net8.0` por `net10.0`.

## Passo 2: montar a pasta

```
nightwing-site/
├── NightwingSite.csproj   (configuração do projeto)
├── Program.cs             (as rotas da API: o "cardápio" do servidor)
├── Dados.cs               (HQs, missões, personagens e quiz)
├── Modelos.cs             (o formato dos dados)
├── Servicos.cs            (salvar em arquivo e contar visitas)
├── DadosJusticaJovem.cs   (temporadas e títulos dos episódios)
└── wwwroot/
    ├── index.html         (página principal com as abas)
    ├── detail.html        (detalhes de uma HQ)
    ├── css/style.css
    ├── js/
    │   ├── comum.js       (tema, abas, menu, funções compartilhadas)
    │   ├── jogo.js
    │   ├── hqs.js
    │   ├── justica-jovem.js
    │   ├── personagens.js
    │   ├── quiz.js
    │   ├── mural.js
    │   └── detalhe.js
    └── img/               (suas imagens)
```

No VS Code: **Arquivo > Abrir Pasta** e escolha `nightwing-site`.

## Passo 3: suas imagens

Copie a sua pasta `img` para dentro de `wwwroot`. Os nomes que o site procura são:

- **Principal:** `asa.jpg`, `acrobacia.jpg`, `luta.jpg`, `detetive.jpg`, `lider.jpg`, `escrima.jpg`, `rapel.jpg`, `moto.jpg`, `traje.jpg`
- **Jogo:** `pfp.jpg` (seu herói) e os inimigos `blockbuster.jpg`, `tony-zucco.jpg`, `coracao-de-pedra.jpg`, `torque.jpg`, `exterminador.jpg`
- **Capas das HQs:** `detective-38.jpg`, `brave-bold-54.jpg`, `judas-contract.jpg`, `death-in-family.jpg`, `nightwing-1996.jpg`, `infinite-crisis.jpg`, `batman-robin-2009.jpg`, `nightwing-2011.jpg`, `grayson-2014.jpg`, `nightwing-2016.jpg`, `nightwing-2021.jpg`

Se uma imagem não existir, aparece um emoji no lugar, então nada quebra.

## Passo 4: rodar

1. No VS Code: **Terminal > Novo Terminal**.
2. Digite: `dotnet run`
3. Procure a linha `Now listening on: http://localhost:5000` (o número pode mudar) e abra no navegador.
4. Para parar: `Ctrl + C`.

## Passo 5: fazer mudanças

- Mudou **HTML, CSS ou JS**: salve e aperte **F5** no navegador.
- Mudou **qualquer arquivo .cs**: pare (`Ctrl + C`) e rode `dotnet run` de novo.

## Experimentos para aprender (do mais fácil ao mais difícil)

1. **Cores:** no `style.css`, mude `--destaque: #3aa0ff;`.
2. **Texto:** edite a história na seção Principal do `index.html`.
3. **Nova pergunta no quiz:** no `Dados.cs`, copie uma pergunta e troque os textos. O último número é a posição da resposta certa (começa em 0).
4. **Novo personagem:** no `Dados.cs`, copie uma linha de `Personagens` e troque o `Tipo` para `"aliado"` ou `"inimigo"`.
5. **Nova HQ:** no `Dados.cs`, copie um bloco de `Hqs`. Ele aparece sozinho na lista, na busca e no filtro.
6. **Nova missão:** copie uma linha de `Missoes` com mais vida e mais dano.
7. **Novo episódio ou temporada:** no `DadosJusticaJovem.cs`, acrescente o título na lista `Episodios` (ou copie um bloco `new(...)` para uma temporada nova).
8. **Cenário do topo:** no `comum.js`, a função `desenharCidade()` desenha os prédios. Mude `semente = 7` para ver outra cidade, ou as cores nas camadas.
9. **Nova rota no C#:** crie um `app.MapGet("/api/algo", ...)` no `Program.cs` e use `api("/api/algo")` no JS.

## Se algo der errado

| Sintoma | O que fazer |
|---|---|
| `dotnet` não é reconhecido | Feche e abra o VS Code depois de instalar o .NET |
| Erro falando de `net8.0` | Ajuste o número no `.csproj` (Passo 1, item 4) |
| "Sem conexão com o servidor C#" | Você abriu o `index.html` direto? Use o endereço do `dotnet run` |
| Mudei o C# e nada mudou | Pare (`Ctrl + C`) e rode `dotnet run` de novo |
| Ranking/comentários sumiram | Eles ficam na pasta `dados/`, criada ao rodar o servidor |

## Observações

- Use imagens que você tem direito de usar. Imagens oficiais da DC têm direitos autorais.
- A aba Justiça Jovem é só um guia de informações. Para assistir, use os serviços oficiais (o botão da aba leva ao JustWatch, que mostra onde a série está no momento).
- Se existir `img/asa.jpg`, ela aparece em um quadro no topo da página Principal. Sem a imagem, o quadro some sozinho.
- Para publicar na internet, a hospedagem precisa aceitar .NET. Muitas hospedagens gratuitas só aceitam arquivos estáticos e PHP, então confira antes.
- As datas e os créditos das HQs foram escritos para estudo. Confira em fontes oficiais antes de usar em trabalhos.
