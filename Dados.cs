// Aqui ficam os "conteúdos" do site: HQs, missões do jogo, personagens e quiz.
// Para adicionar algo novo, copie uma linha, cole logo abaixo e troque os textos.

public static class Dados
{
    // ---------------------------------------------------------------
    // HQs (em ordem cronológica)
    // Ordem dos campos: Id, Ano, Titulo, Era, Autores, Icone, Cor (0-360),
    //                   Resumo, Contexto, Porque, Depois
    // ---------------------------------------------------------------
    public static readonly List<Hq> Hqs = new()
    {
        new("detective-38", 1940, "Detective Comics #38", "Era de Ouro",
            "Bill Finger, Bob Kane, Jerry Robinson", "🎪", 40,
            "A estreia do primeiro Robin.",
            "Dick Grayson aparece pela primeira vez como Robin. Depois de perder os pais durante uma apresentação de circo, ele é acolhido por Bruce Wayne e treinado para combater o crime.",
            "É o ponto de partida da dupla Batman e Robin.",
            "A parceria cresce e, com o tempo, é colocada à prova."),

        new("brave-bold-54", 1964, "The Brave and the Bold #54", "Era de Prata",
            "Bob Haney, Bruno Premiani", "🤝", 210,
            "Nascem os Jovens Titãs.",
            "Robin se une a Kid Flash e Aqualad numa missão, e dessa união surge a equipe dos Jovens Titãs, a primeira família escolhida de Dick.",
            "Marca o começo da vida de Dick fora da sombra do Batman.",
            "A equipe cresce e Dick se torna o líder natural do grupo."),

        new("judas-contract", 1984, "Tales of the Teen Titans #42–44 (O Contrato de Judas)", "Era Moderna",
            "Marv Wolfman, George Pérez", "🌙", 225,
            "Dick vira Nightwing.",
            "A infiltração de Terra e a traição do Exterminador (Deathstroke) abalam os Titãs. No fim, Dick deixa o manto de Robin e assume a identidade de Nightwing.",
            "É a HQ que apresenta o Nightwing e o vilão que o perseguiria por anos.",
            "Dick começa a construir uma identidade própria."),

        new("death-in-family", 1988, "Batman #426–429 (Morte em Família)", "Era Moderna",
            "Jim Starlin, Jim Aparo", "🕯️", 350,
            "A tragédia de Jason Todd.",
            "Jason Todd, o segundo Robin, morre pelas mãos do Coringa. A perda abala profundamente a família do Batman e muda a dinâmica entre os heróis ao redor dele.",
            "Ajuda a entender o peso emocional que a Bat-Família carrega.",
            "Abre espaço para a chegada de Tim Drake como novo Robin."),

        new("nightwing-1996", 1996, "Nightwing (volume 2) #1", "Era Moderna",
            "Chuck Dixon, Scott McDaniel", "🏙️", 200,
            "O Nightwing solo em Blüdhaven.",
            "Dick se muda para Blüdhaven e enfrenta crime, corrupção e inimigos próprios, como o Blockbuster. É aqui que ele constrói rotina e amizades longe de Gotham.",
            "É a série clássica para conhecer a personalidade do Nightwing.",
            "Prepara os acontecimentos que mudariam Blüdhaven para sempre."),

        new("infinite-crisis", 2005, "Crise Infinita", "Era Moderna",
            "Geoff Johns, Phil Jimenez, George Pérez", "💥", 270,
            "Blüdhaven destruída.",
            "A cidade de Blüdhaven é destruída por um ataque de supervilões, e Dick enfrenta um dos momentos mais difíceis da sua trajetória.",
            "Mostra que o herói alegre também lida com perdas profundas.",
            "Leva Dick a assumir novos papéis dentro da Bat-Família."),

        new("batman-robin-2009", 2009, "Batman & Robin #1", "Era Moderna",
            "Grant Morrison, Frank Quitely", "🦇", 195,
            "Dick assume o manto do Batman.",
            "Com Bruce desaparecido, Dick se torna o Batman de Gotham e Damian Wayne vira o seu Robin. O tom é mais leve e cheio de acrobacias.",
            "Prova que ele consegue carregar um dos legados mais pesados da DC.",
            "Mais tarde Dick volta a ser Nightwing, agora mais seguro de si."),

        new("nightwing-2011", 2011, "Nightwing (2011) #1", "Os Novos 52",
            "Kyle Higgins, Eddy Barrows", "🎡", 215,
            "De volta ao circo.",
            "Dick retorna ao Haly’s Circus, onde cresceu, e revisita o próprio passado enquanto protege o lugar.",
            "Boa porta de entrada para entender a ligação dele com o circo.",
            "A história segue para um momento em que a identidade secreta dele fica em risco."),

        new("grayson-2014", 2014, "Grayson #1", "Os Novos 52",
            "Tim Seeley, Tom King, Mikel Janín", "🕵️", 185,
            "Dick vira espião.",
            "Dick finge a própria morte e se torna o Agente 37 da organização Spyral. A série mistura espionagem, humor e ação acrobática.",
            "Mostra uma faceta nova do herói, longe da identidade de Nightwing.",
            "No fim, ele retorna às suas raízes como herói."),

        new("nightwing-2016", 2016, "Nightwing: Rebirth", "DC Renascimento",
            "Tim Seeley, Javier Fernandez", "🕊️", 205,
            "O retorno do Nightwing.",
            "Dick volta ao traje de Nightwing, encontra novos aliados e enfrenta o Parlamento das Corujas. É um recomeço para o personagem.",
            "Boa leitura para ver o Nightwing renovado, pronto para novas histórias.",
            "Prepara o caminho para a fase mais recente em Blüdhaven."),

        new("nightwing-2021", 2021, "Nightwing (2016) #78 em diante", "Infinite Frontier",
            "Tom Taylor, Bruno Redondo", "⭐", 220,
            "A fase queridinha dos fãs.",
            "Dick volta a Blüdhaven e enfrenta o Coração de Pedra (Heartless), além de novos amigos e velhos inimigos. A fase é elogiada pelo carisma e pelas cenas de ação.",
            "É uma ótima porta de entrada para quem quer ler algo atual.",
            "Mostra o Nightwing de hoje: seguro e inspirador."),
    };

    // ---------------------------------------------------------------
    // MISSÕES DO JOGO
    // Ordem: Nome, Local, Inimigo, Imagem (img/<nome>.jpg), Icone,
    //        Vida do inimigo, Dano mínimo, Dano máximo, Cena
    // ---------------------------------------------------------------
    public static readonly List<Missao> Missoes = new()
    {
        new("Assalto no porto", "Porto de Blüdhaven", "Capangas de Blockbuster", "blockbuster", "📦",
            60, 6, 11, "Contêineres roubados e homens armados. Hora de limpar o cais."),

        new("Circo em chamas", "Haly’s Circus", "Tony Zucco", "tony-zucco", "🎪",
            80, 8, 13, "O mafioso que arruinou a vida de Dick voltou ao circo."),

        new("Coração gelado", "Hospital abandonado", "Coração de Pedra", "coracao-de-pedra", "🧊",
            100, 9, 15, "Um vilão que não sente dor ameaça toda a cidade."),

        new("Perseguição na estrada", "Rodovia de Blüdhaven", "Torque", "torque", "🏍️",
            115, 10, 17, "Torque corre em velocidade absurda. Acompanhe-o com a moto."),

        new("Duelo final", "Telhado do prédio mais alto", "Exterminador", "exterminador", "⚔️",
            150, 12, 20, "O mestre mercenário quer terminar o que começou no passado."),
    };

    // ---------------------------------------------------------------
    // PERSONAGENS (Tipo: "aliado" ou "inimigo")
    // ---------------------------------------------------------------
    public static readonly List<Personagem> Personagens = new()
    {
        new("Batman", "aliado", "🦇", "Bruce Wayne, mentor e figura paterna de Dick desde que o acolheu."),
        new("Alfred Pennyworth", "aliado", "🍵", "O mordomo da família Wayne, sempre por perto para cuidar de todos."),
        new("Barbara Gordon", "aliado", "💻", "Foi a Batgirl e depois virou a Oráculo. Amiga e parceira de longa data de Dick."),
        new("Estelar (Starfire)", "aliado", "🌟", "Alienígena de Tamaran e integrante dos Titãs. Tem uma ligação especial com Dick."),
        new("Jason Todd", "aliado", "🔴", "O segundo Robin. Anos depois, volta como o Capuz Vermelho."),
        new("Tim Drake", "aliado", "🐦", "O terceiro Robin, conhecido pela inteligência e pela habilidade de detetive."),
        new("Damian Wayne", "aliado", "⚔️", "Filho de Bruce Wayne e Talia al Ghul. Também foi Robin."),
        new("Superman", "aliado", "🦸", "Aliado da Liga da Justiça. Foi numa história com ele que Dick conheceu a lenda que inspirou o nome Nightwing."),

        new("Exterminador (Deathstroke)", "inimigo", "🗡️", "Slade Wilson, mercenário de elite e um dos maiores rivais dos Titãs."),
        new("Blockbuster", "inimigo", "💪", "Vilão ligado ao crime em Blüdhaven e inimigo clássico da série solo do Nightwing."),
        new("Torque", "inimigo", "🏍️", "Vilão ligado a velocidade e motos, que aparece nas aventuras em Blüdhaven."),
        new("Coração de Pedra (Heartless)", "inimigo", "🧊", "Antagonista da fase mais recente do Nightwing, famoso por não sentir dor."),
        new("Tony Zucco", "inimigo", "🎩", "O mafioso responsável pela morte dos pais de Dick no circo."),
        new("Coringa", "inimigo", "🃏", "O maior inimigo do Batman e uma sombra constante sobre a Bat-Família."),
    };

    // ---------------------------------------------------------------
    // QUIZ (o último número é a posição da resposta certa, começando em 0)
    // ---------------------------------------------------------------
    public static readonly List<Pergunta> Perguntas = new()
    {
        new("Qual é o nome civil de Nightwing?",
            new[] { "Jason Todd", "Dick Grayson", "Tim Drake", "Bruce Wayne" }, 1),

        new("Em que ano Dick Grayson estreou nos quadrinhos como Robin?",
            new[] { "1940", "1964", "1984", "1996" }, 0),

        new("Em que ano surgiu a identidade de Nightwing?",
            new[] { "1940", "1964", "1984", "2011" }, 2),

        new("Em que ambiente Dick cresceu antes de ser acolhido por Bruce Wayne?",
            new[] { "Numa fazenda", "Num circo", "Num laboratório", "Num navio" }, 1),

        new("Qual cidade Nightwing ficou conhecido por proteger?",
            new[] { "Metrópolis", "Central City", "Blüdhaven", "Star City" }, 2),

        new("Qual arma ele costuma usar?",
            new[] { "Bastões de escrima", "Martelo", "Escudo", "Arco e flecha" }, 0),

        new("Qual equipe Dick liderou depois de deixar de ser Robin?",
            new[] { "Liga da Justiça Sombria", "Jovens Titãs", "Esquadrão Suicida", "Lanternas Verdes" }, 1),

        new("Em Batman & Robin (2009), quem é o Robin ao lado do Batman Dick Grayson?",
            new[] { "Damian Wayne", "Tim Drake", "Jason Todd", "Alfred" }, 0),
    };
}
