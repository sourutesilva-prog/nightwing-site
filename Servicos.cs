using System.Text.Json;

// Guarda uma lista de qualquer tipo (T) em um arquivo .json.
// Usamos a mesma classe para comentários e para o ranking.
public class ArmazenamentoJson<T>
{
    private readonly string _caminho;
    private readonly object _trava = new();   // impede duas gravações ao mesmo tempo
    private static readonly JsonSerializerOptions Opcoes = new() { WriteIndented = true };

    public ArmazenamentoJson(string caminho)
    {
        _caminho = caminho;
    }

    public List<T> Ler()
    {
        lock (_trava)
        {
            return LerSemTrava();
        }
    }

    public void Adicionar(T item)
    {
        lock (_trava)
        {
            var lista = LerSemTrava();
            lista.Add(item);
            File.WriteAllText(_caminho, JsonSerializer.Serialize(lista, Opcoes));
        }
    }

    private List<T> LerSemTrava()
    {
        if (!File.Exists(_caminho)) return new List<T>();
        var json = File.ReadAllText(_caminho);
        return JsonSerializer.Deserialize<List<T>>(json) ?? new List<T>();
    }
}

// Conta as visitas e guarda o número em um arquivo de texto.
public class ContadorVisitas
{
    private readonly string _caminho;
    private readonly object _trava = new();

    public ContadorVisitas(string caminho)
    {
        _caminho = caminho;
    }

    public int Ler()
    {
        lock (_trava)
        {
            return LerSemTrava();
        }
    }

    public int Registrar()
    {
        lock (_trava)
        {
            var novo = LerSemTrava() + 1;
            File.WriteAllText(_caminho, novo.ToString());
            return novo;
        }
    }

    private int LerSemTrava()
    {
        if (!File.Exists(_caminho)) return 0;
        return int.TryParse(File.ReadAllText(_caminho), out var n) ? n : 0;
    }
}
