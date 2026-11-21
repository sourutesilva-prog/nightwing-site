// Modelos = o "formato" dos dados que o servidor guarda e envia para o site.
// Cada "record" é uma ficha com campos fixos.

public record Hq(
    string Id, int Ano, string Titulo, string Era, string Autores, string Icone, int Cor,
    string Resumo, string Contexto, string Porque, string Depois);

public record Missao(
    string Nome, string Local, string Inimigo, string Imagem, string Icone,
    int Vida, int DanoMin, int DanoMax, string Cena);

public record Personagem(string Nome, string Tipo, string Icone, string Descricao);

public record Pergunta(string Texto, string[] Opcoes, int Correta);

public record Comentario(Guid Id, string Nome, string Texto, DateTime Data);
public record NovoComentario(string? Nome, string? Texto);

public record RegistroRanking(string Nome, int Pontos, DateTime Data);
public record NovoRanking(string? Nome, int Pontos);

public record RespostasQuiz(int[]? Respostas);

public record Temporada(int Numero, string Nome, int Ano, string Resumo, string Nightwing, string[] Episodios);
