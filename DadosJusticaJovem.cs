// Guia de episódios de Justiça Jovem (Young Justice).
// Aqui ficam só informações: títulos originais dos episódios e resumos curtos, sem spoilers.
// Títulos conferidos em duas fontes (epguides.com e TheTVDB) em novembro de 2026.
// Ordem dos campos: Numero, Nome, Ano, Resumo, Nightwing, Episodios

public static class DadosJusticaJovem
{
    public static readonly List<Temporada> Temporadas = new()
    {
        new(1, "Young Justice", 2010,
            "Robin, Kid Flash e Aqualad cansam de ser apenas ajudantes e ganham uma equipe secreta, que faz missões discretas para a Liga da Justiça. Com a chegada de novos integrantes, o grupo aprende a confiar uns nos outros.",
            "Dick Grayson ainda é o Robin e é um dos três primeiros integrantes da equipe.",
            new[]
            {
                "Independence Day", "Fireworks", "Welcome to Happy Harbor", "Drop-Zone", "Schooled",
                "Infiltrator", "Denial", "Downtime", "Bereft", "Targets",
                "Terrors", "Homefront", "Alpha Male", "Revelation", "Humanity",
                "Failsafe", "Disordered", "Secrets", "Misplaced", "Coldhearted",
                "Image", "Agendas", "Insecurity", "Performance", "Usual Suspects",
                "Auld Acquaintance"
            }),

        new(2, "Invasion", 2012,
            "A história avança alguns anos. A equipe volta com novos rostos e enfrenta uma ameaça que vem de fora da Terra.",
            "Dick agora é o Nightwing e assume a liderança do grupo.",
            new[]
            {
                "Happy New Year", "Earthlings", "Alienated", "Salvage", "Beneath",
                "Bloodlines", "Depths", "Satisfaction", "Darkest", "Before the Dawn",
                "Cornered", "True Colors", "The Fix", "Runaways", "War",
                "Complications", "The Hunt", "Intervention", "Summit", "Endgame"
            }),

        new(3, "Outsiders", 2019,
            "O foco muda para uma nova equipe, que atua em segredo contra um crime que envolve pessoas com poderes. A série ganha um tom mais sério.",
            "Nightwing coordena as operações do grupo.",
            new[]
            {
                "Princes All", "Royal We", "Eminent Threat", "Private Security", "Away Mission",
                "Rescue Op", "Evolution", "Triptych", "Home Fires", "Exceptional Human Beings",
                "Another Freak", "Nightmare Monkeys", "True Heroes", "Influence", "Leverage",
                "Illusion of Control", "First Impression", "Early Warning", "Elder Wisdom", "Quiet Conversations",
                "Unknown Factors", "Antisocial Pathologies", "Terminus", "Into the Breach", "Overwhelmed",
                "Nevermore"
            }),

        new(4, "Phantoms", 2021,
            "A história das temporadas anteriores continua, com novos desafios para o grupo e para os seus aliados.",
            "Nightwing segue como um dos personagens centrais da série.",
            new[]
            {
                "Inhospitable", "Needful", "Volatile", "Involuntary", "Tale of Two Sisters",
                "Artemis Through the Looking-Glass", "The Lady, or the Tigress?", "I Know Why the Caged Cat Sings", "Odnu!", "Nomed Esir!",
                "Teg Ydaer!", "Og Htrof Dna Reuqnoc!", "Kaerb Ym Traeh!", "Nautical Twilight", "Ebb Tide",
                "Emergency Dive", "Leviathan Wakes", "Beyond the Grip of the Gods!", "Encounter Upon the Razor's Edge!", "Forbidden Secrets of Civilizations Past!",
                "Odyssey of Death!", "Rescue and Search", "Ego and Superego", "Zenith and Abyss", "Over and Out",
                "Death and Rebirth"
            }),
    };
}
