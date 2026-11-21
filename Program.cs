using System.Globalization;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// 1) Entrega o index.html e os arquivos (css, js, img) da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

// 2) Prepara a pasta "dados", onde ficam comentários, ranking e visitas
var pastaDados = Path.Combine(app.Environment.ContentRootPath, "dados");
Directory.CreateDirectory(pastaDados);

var comentarios = new ArmazenamentoJson<Comentario>(Path.Combine(pastaDados, "comentarios.json"));
var ranking = new ArmazenamentoJson<RegistroRanking>(Path.Combine(pastaDados, "ranking.json"));
var visitas = new ContadorVisitas(Path.Combine(pastaDados, "visitas.txt"));

// Procura um trecho ignorando maiúsculas e acentos ("bludhaven" encontra "Blüdhaven")
bool Contem(string texto, string trecho) =>
    CultureInfo.InvariantCulture.CompareInfo.IndexOf(
        texto, trecho, CompareOptions.IgnoreCase | CompareOptions.IgnoreNonSpace) >= 0;

// ---------------------------------------------------------------
// HQs: lista (com busca e filtro de era) e detalhe de uma HQ
// Exemplo de uso: /api/hqs?busca=circo&era=Era%20Moderna
// ---------------------------------------------------------------
app.MapGet("/api/hqs", (string? busca, string? era) =>
{
    IEnumerable<Hq> resultado = Dados.Hqs;

    if (!string.IsNullOrWhiteSpace(era))
        resultado = resultado.Where(h => h.Era.Equals(era, StringComparison.OrdinalIgnoreCase));

    if (!string.IsNullOrWhiteSpace(busca))
        resultado = resultado.Where(h =>
            Contem(h.Titulo, busca) || Contem(h.Resumo, busca) ||
            Contem(h.Contexto, busca) || Contem(h.Autores, busca));

    return Results.Ok(resultado.OrderBy(h => h.Ano).ToList());
});

app.MapGet("/api/hqs/{id}", (string id) =>
{
    var hq = Dados.Hqs.FirstOrDefault(h => h.Id == id);
    return hq is null
        ? Results.NotFound(new { erro = "HQ não encontrada." })
        : Results.Ok(hq);
});

// ---------------------------------------------------------------
// PERSONAGENS (filtro opcional: ?tipo=aliado ou ?tipo=inimigo)
// ---------------------------------------------------------------
app.MapGet("/api/personagens", (string? tipo) =>
{
    IEnumerable<Personagem> resultado = Dados.Personagens;

    if (!string.IsNullOrWhiteSpace(tipo))
        resultado = resultado.Where(p => p.Tipo.Equals(tipo, StringComparison.OrdinalIgnoreCase));

    return Results.Ok(resultado.ToList());
});

// ---------------------------------------------------------------
// JOGO: missões e ranking
// ---------------------------------------------------------------
app.MapGet("/api/missoes", () => Dados.Missoes);

app.MapGet("/api/ranking", () =>
    ranking.Ler()
        .OrderByDescending(r => r.Pontos)
        .ThenBy(r => r.Data)
        .Take(10)
        .ToList());

// O navegador pode ser enganado por quem sabe mexer nele, então o servidor
// confere tudo de novo e só aceita pontuações possíveis de verdade.
const int PontuacaoMaxima = 3000;

app.MapPost("/api/ranking", (NovoRanking novo) =>
{
    var nome = (novo.Nome ?? "").Trim();

    if (nome.Length < 2 || nome.Length > 20)
        return Results.BadRequest(new { erro = "O nome precisa ter entre 2 e 20 caracteres." });

    if (novo.Pontos < 1 || novo.Pontos > PontuacaoMaxima)
        return Results.BadRequest(new { erro = "Essa pontuação não é válida." });

    var registro = new RegistroRanking(nome, novo.Pontos, DateTime.UtcNow);
    ranking.Adicionar(registro);
    return Results.Created("/api/ranking", registro);
});

// ---------------------------------------------------------------
// QUIZ: o servidor envia as perguntas SEM a resposta certa e corrige depois
// ---------------------------------------------------------------
app.MapGet("/api/quiz", () =>
    Dados.Perguntas.Select((p, i) => new { id = i, pergunta = p.Texto, opcoes = p.Opcoes }));

app.MapPost("/api/quiz/corrigir", (RespostasQuiz r) =>
{
    var respostas = r.Respostas ?? Array.Empty<int>();
    var corretas = Dados.Perguntas.Select(p => p.Correta).ToList();
    var acertos = 0;

    for (var i = 0; i < corretas.Count; i++)
    {
        if (i < respostas.Length && respostas[i] == corretas[i]) acertos++;
    }

    return Results.Ok(new { acertos, total = corretas.Count, corretas });
});

// ---------------------------------------------------------------
// MURAL DE COMENTÁRIOS
// ---------------------------------------------------------------
app.MapGet("/api/comentarios", () =>
    comentarios.Ler()
        .OrderByDescending(c => c.Data)
        .Take(50)
        .ToList());

app.MapPost("/api/comentarios", (NovoComentario novo) =>
{
    var nome = (novo.Nome ?? "").Trim();
    var texto = (novo.Texto ?? "").Trim();

    if (nome.Length < 2 || nome.Length > 30)
        return Results.BadRequest(new { erro = "O nome precisa ter entre 2 e 30 caracteres." });

    if (texto.Length < 3 || texto.Length > 300)
        return Results.BadRequest(new { erro = "O comentário precisa ter entre 3 e 300 caracteres." });

    var comentario = new Comentario(Guid.NewGuid(), nome, texto, DateTime.UtcNow);
    comentarios.Adicionar(comentario);
    return Results.Created($"/api/comentarios/{comentario.Id}", comentario);
});

// ---------------------------------------------------------------
// CONTADOR DE VISITAS
// ---------------------------------------------------------------
app.MapGet("/api/visitas", () => Results.Ok(new { total = visitas.Ler() }));
app.MapPost("/api/visitas", () => Results.Ok(new { total = visitas.Registrar() }));

// ---------------------------------------------------------------
// JUSTIÇA JOVEM: guia de episódios (só informação, sem vídeos)
// ---------------------------------------------------------------
app.MapGet("/api/justica-jovem", () => DadosJusticaJovem.Temporadas);

app.Run();
