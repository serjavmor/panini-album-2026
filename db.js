// Base de datos del Álbum Panini Mundial 2026
// Contiene 48 equipos (12 grupos de 4) y la sección especial "FWC".

export const SPECIAL_SECTION = {
  id: "FWC",
  name: "FIFA World Cup",
  stickers: [
    { id: "FWC-01", name: "Logo Oficial Panini", position: "Especial" },
    { id: "FWC-02", name: "Trofeo del Mundial 2026", position: "Especial" },
    { id: "FWC-03", name: "Mascota Oficial", position: "Especial" },
    { id: "FWC-04", name: "Estadio Azteca (CDMX)", position: "Estadio" },
    { id: "FWC-05", name: "MetLife Stadium (NY/NJ)", position: "Estadio" },
    { id: "FWC-06", name: "SoFi Stadium (Los Angeles)", position: "Estadio" },
    { id: "FWC-07", name: "Mercedes-Benz Stadium (Atlanta)", position: "Estadio" },
    { id: "FWC-08", name: "Hard Rock Stadium (Miami)", position: "Estadio" },
    { id: "FWC-09", name: "BC Place (Vancouver)", position: "Estadio" },
    { id: "FWC-10", name: "Estadio BBVA (Monterrey)", position: "Estadio" },
    { id: "FWC-11", name: "Estadio Akron (Guadalajara)", position: "Estadio" },
    { id: "FWC-12", name: "Gillette Stadium (Boston)", position: "Estadio" },
    { id: "FWC-13", name: "AT&T Stadium (Dallas)", position: "Estadio" },
    { id: "FWC-14", name: "NRG Stadium (Houston)", position: "Estadio" },
    { id: "FWC-15", name: "Arrowhead Stadium (Kansas City)", position: "Estadio" },
    { id: "FWC-16", name: "Lincoln Financial Field (Philadelphia)", position: "Estadio" },
    { id: "FWC-17", name: "Lumen Field (Seattle)", position: "Estadio" },
    { id: "FWC-18", name: "Poster Oficial 2026", position: "Especial" }
  ]
};

// Plantillas de jugadores reales para selecciones principales
const REAL_ROSTERS = {
  ARG: [
    "Emiliano Martínez", "Nahuel Molina", "Cristian Romero", "Nicolás Otamendi", "Nicolás Tagliafico",
    "Rodrigo De Paul", "Enzo Fernández", "Alexis Mac Allister", "Lionel Messi", "Julián Álvarez",
    "Lautaro Martínez", "Ángel Di María", "Lisandro Martínez", "Gonzalo Montiel", "Leandro Paredes",
    "Alejandro Garnacho", "Franco Armani"
  ],
  MEX: [
    "Guillermo Ochoa", "César Montes", "Johan Vásquez", "Jesús Gallardo", "Jorge Sánchez",
    "Edson Álvarez", "Luis Chávez", "Orbelín Pineda", "Santiago Giménez", "Hirving Lozano",
    "Uriel Antuna", "Luis Romo", "Gerardo Arteaga", "Erick Sánchez", "César Huerta",
    "Henry Martín", "Luis Malagón"
  ],
  ESP: [
    "Unai Simón", "Dani Carvajal", "Robin Le Normand", "Aymeric Laporte", "Marc Cucurella",
    "Rodri", "Fabián Ruiz", "Dani Olmo", "Lamine Yamal", "Álvaro Morata",
    "Nico Williams", "Pedri", "Alejandro Grimaldo", "Martin Zubimendi", "Mikel Oyarzabal",
    "Ferran Torres", "David Raya"
  ],
  BRA: [
    "Alisson Becker", "Danilo", "Marquinhos", "Gabriel Magalhães", "Guilherme Arana",
    "Bruno Guimarães", "João Gomes", "Lucas Paquetá", "Vinícius Júnior", "Rodrygo",
    "Raphinha", "Endrick", "Gabriel Martinelli", "Douglas Luiz", "Éder Militão",
    "Yan Couto", "Ederson"
  ],
  USA: [
    "Matt Turner", "Antonee Robinson", "Tim Ream", "Chris Richards", "Sergiño Dest",
    "Tyler Adams", "Weston McKennie", "Yunus Musah", "Christian Pulisic", "Folarin Balogun",
    "Timothy Weah", "Gio Reyna", "Johnny Cardoso", "Cameron Carter-Vickers", "Ricardo Pepi",
    "Malik Tillman", "Ethan Horvath"
  ],
  FRA: [
    "Mike Maignan", "Jules Koundé", "William Saliba", "Dayot Upamecano", "Theo Hernandez",
    "Aurélien Tchouaméni", "N'Golo Kanté", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram",
    "Kylian Mbappé", "Olivier Giroud", "Eduardo Camavinga", "Adrien Rabiot", "Ibrahima Konaté",
    "Kingsley Coman", "Brice Samba"
  ],
  ENG: [
    "Jordan Pickford", "Kyle Walker", "John Stones", "Marc Guéhi", "Kieran Trippier",
    "Declan Rice", "Trent Alexander-Arnold", "Jude Bellingham", "Bukayo Saka", "Harry Kane",
    "Phil Foden", "Cole Palmer", "Kobbie Mainoo", "Ollie Watkins", "Ezri Konsa",
    "Anthony Gordon", "Aaron Ramsdale"
  ],
  COL: [
    "Camilo Vargas", "Daniel Muñoz", "Davinson Sánchez", "Carlos Cuesta", "Johan Mojica",
    "Jefferson Lerma", "Richard Ríos", "Jhon Arias", "James Rodríguez", "Luis Díaz",
    "Jhon Córdoba", "Rafael Santos Borré", "Luis Sinisterra", "Kevin Castaño", "Yerry Mina",
    "Juan Fernando Quintero", "David Ospina"
  ],
  POR: [
    "Diogo Costa", "João Cancelo", "Rúben Dias", "Pepe", "Nuno Mendes",
    "João Palhinha", "Vitinha", "Bruno Fernandes", "Bernardo Silva", "Cristiano Ronaldo",
    "Rafael Leão", "João Félix", "Gonçalo Ramos", "Rúben Neves", "Diogo Dalot",
    "Francisco Conceição", "Rui Patrício"
  ],
  URU: [
    "Sergio Rochet", "Nahitan Nández", "Ronald Araújo", "José María Giménez", "Mathías Olivera",
    "Federico Valverde", "Manuel Ugarte", "Nicolás de la Cruz", "Facundo Pellistri", "Darwin Núñez",
    "Maximiliano Araujo", "Luis Suárez", "Giorgian de Arrascaeta", "Rodrigo Bentancur", "Sebastián Cáceres",
    "Brian Rodríguez", "Franco Israel"
  ],
  GER: [
    "Manuel Neuer", "Joshua Kimmich", "Jonathan Tah", "Antonio Rüdiger", "David Raum",
    "Robert Andrich", "Toni Kroos", "İlkay Gündoğan", "Jamal Musiala", "Florian Wirtz",
    "Kai Havertz", "Niclas Füllkrug", "Thomas Müller", "Leroy Sané", "Nico Schlotterbeck",
    "Benjamin Henrichs", "Marc-André ter Stegen"
  ],
  ITA: [
    "Gianluigi Donnarumma", "Giovanni Di Lorenzo", "Alessandro Bastoni", "Riccardo Calafiori", "Federico Dimarco",
    "Nicolò Barella", "Jorginho", "Davide Frattesi", "Federico Chiesa", "Gianluca Scamacca",
    "Mateo Retegui", "Lorenzo Pellegrini", "Bryan Cristante", "Gianluca Mancini", "Matteo Darmian",
    "Mattia Zaccagni", "Guglielmo Vicario"
  ]
};

// Generador de nombres ficticios realistas por cultura para selecciones secundarias
const SURNAME_SEEDS = {
  latam: ["Gómez", "Rodríguez", "Fernández", "López", "Díaz", "Martínez", "Pérez", "Silva", "Flores", "Rojas", "Sánchez", "Castro", "Vargas", "Ortiz"],
  europe: ["Müller", "Schmidt", "Dubois", "Martin", "Smith", "Jones", "Novak", "Ivanov", "Hansen", "Petersen", "De Jong", "Van Dijk", "Rossi", "Bianchi"],
  asia: ["Tanaka", "Sato", "Watanabe", "Kim", "Lee", "Park", "Nguyen", "Tran", "Wang", "Li", "Zhang", "Al-Harbi", "Al-Dawsari", "Chen"],
  africa: ["Mensah", "Kouassi", "Diallo", "Traoré", "Sow", "Ndoye", "Okafor", "Obi", "Nguema", "Banda", "Keita", "Diop", "Toure", "Abubakar"],
  oceania: ["Smith", "Williams", "Brown", "Taylor", "McDonald", "Tuivasa", "Harris", "Wilson", "Martin", "Tevita", "Latu", "Kolo", "Manu", "Finau"]
};

const NAME_SEEDS = {
  latam: ["Carlos", "Luis", "Juan", "Jorge", "Andrés", "Santiago", "Mateo", "Sebastián", "Diego", "Gabriel", "Alejandro", "Felipe", "Manuel", "José"],
  europe: ["Thomas", "Michael", "Jean", "Pierre", "David", "John", "Jan", "Peter", "Marco", "Lucas", "Lukas", "Oliver", "Alexander", "Daniel"],
  asia: ["Kenji", "Hiroshi", "Yuki", "Min-jun", "Ji-hoon", "Sang-woo", "Anhn", "Minh", "Wei", "Jun", "Yong", "Fahad", "Salem", "Yasser"],
  africa: ["Kofi", "Kwame", "Sadio", "Moussa", "Mamadou", "Cheikh", "Emeka", "Chinedu", "Tunde", "Abdel", "Mohamed", "Mustapha", "Youssef", "Tariq"],
  oceania: ["Jack", "Liam", "Mason", "Noah", "Tevita", "Sione", "Kelepi", "Toby", "Ethan", "Samuel", "Ryan", "Joshua", "Logan", "Kaelan"]
};

function getCultureKey(teamId) {
  const latam = ["CRC", "ECU", "PER", "ARG", "BRA", "MEX", "COL", "URU", "CHI", "PAR"];
  const asia = ["JPN", "AUS", "IRN", "IRQ", "QAT", "UZB", "KOR"];
  const africa = ["CMR", "EGY", "MAR", "GHA", "SEN", "CIV", "NGA", "ALG", "MLI", "RSA"];
  const oceania = ["NZL"];
  
  if (latam.includes(teamId)) return "latam";
  if (asia.includes(teamId)) return "asia";
  if (africa.includes(teamId)) return "africa";
  if (oceania.includes(teamId)) return "oceania";
  return "europe"; // fallback default
}

function generateRoster(teamId, teamName) {
  const culture = getCultureKey(teamId);
  const names = NAME_SEEDS[culture];
  const surnames = SURNAME_SEEDS[culture];
  
  const roster = [];
  const usedNames = new Set();
  
  for (let i = 0; i < 17; i++) {
    let fullName = "";
    do {
      const name = names[Math.floor(Math.random() * names.length)];
      const surname = surnames[Math.floor(Math.random() * surnames.length)];
      fullName = `${name} ${surname}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    roster.push(fullName);
  }
  
  return roster;
}

// Configuración de los 48 equipos clasificados en sus 12 grupos
export const TEAMS_DATA = [
  // Grupo A
  { id: "USA", name: "Estados Unidos", group: "A", flag: "🇺🇸" },
  { id: "CRC", name: "Costa Rica", group: "A", flag: "🇨🇷" },
  { id: "JPN", name: "Japón", group: "A", flag: "🇯🇵" },
  { id: "CMR", name: "Camerún", group: "A", flag: "🇨🇲" },
  
  // Grupo B
  { id: "MEX", name: "México", group: "B", flag: "🇲🇽" },
  { id: "ECU", name: "Ecuador", group: "B", flag: "🇪🇨" },
  { id: "AUS", name: "Australia", group: "B", flag: "🇦🇺" },
  { id: "WAL", name: "Gales", group: "B", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  
  // Grupo C
  { id: "CAN", name: "Canadá", group: "C", flag: "🇨🇦" },
  { id: "PER", name: "Perú", group: "C", flag: "🇵🇪" },
  { id: "SCO", name: "Escocia", group: "C", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { id: "EGY", name: "Egipto", group: "C", flag: "🇪🇬" },
  
  // Grupo D
  { id: "ARG", name: "Argentina", group: "D", flag: "🇦🇷" },
  { id: "UKR", name: "Ucrania", group: "D", flag: "🇺🇦" },
  { id: "KSA", name: "Arabia Saudita", group: "D", flag: "🇸🇦" },
  { id: "MAR", name: "Marruecos", group: "D", flag: "🇲🇦" },
  
  // Grupo E
  { id: "BRA", name: "Brasil", group: "E", flag: "🇧🇷" },
  { id: "SUI", name: "Suiza", group: "E", flag: "🇨🇭" },
  { id: "KOR", name: "Corea del Sur", group: "E", flag: "🇰🇷" },
  { id: "GHA", name: "Ghana", group: "E", flag: "🇬🇭" },
  
  // Grupo F
  { id: "FRA", name: "Francia", group: "F", flag: "🇫🇷" },
  { id: "DEN", name: "Dinamarca", group: "F", flag: "🇩🇰" },
  { id: "TUN", name: "Túnez", group: "F", flag: "🇹🇳" },
  { id: "SEN", name: "Senegal", group: "F", flag: "🇸🇳" },
  
  // Grupo G
  { id: "ESP", name: "España", group: "G", flag: "🇪🇸" },
  { id: "GER", name: "Alemania", group: "G", flag: "🇩🇪" },
  { id: "IRN", name: "Irán", group: "G", flag: "🇮🇷" },
  { id: "CIV", name: "Costa de Marfil", group: "G", flag: "🇨🇮" },
  
  // Grupo H
  { id: "POR", name: "Portugal", group: "H", flag: "🇵🇹" },
  { id: "URU", name: "Uruguay", group: "H", flag: "🇺🇾" },
  { id: "POL", name: "Polonia", group: "H", flag: "🇵🇵" }, // Nota: Polonia es PL o🇵🇱
  { id: "NGA", name: "Nigeria", group: "H", flag: "🇳🇬" },
  
  // Grupo I
  { id: "NED", name: "Países Bajos", group: "I", flag: "🇳🇱" },
  { id: "COL", name: "Colombia", group: "I", flag: "🇨🇴" },
  { id: "IRQ", name: "Irak", group: "I", flag: "🇮🇶" },
  { id: "ALG", name: "Argelia", group: "I", flag: "🇩🇿" },
  
  // Grupo J
  { id: "ITA", name: "Italia", group: "J", flag: "🇮🇹" },
  { id: "CRO", name: "Croacia", group: "J", flag: "🇭🇷" },
  { id: "JAM", name: "Jamaica", group: "J", flag: "🇯🇲" },
  { id: "MLI", name: "Mali", group: "J", flag: "🇲🇱" },
  
  // Grupo K
  { id: "BEL", name: "Bélgica", group: "K", flag: "🇧🇪" },
  { id: "CHI", name: "Chile", group: "K", flag: "🇨🇱" },
  { id: "UZB", name: "Uzbekistán", group: "K", flag: "🇺🇿" },
  { id: "RSA", name: "Sudáfrica", group: "K", flag: "🇿🇦" },
  
  // Grupo L
  { id: "ENG", name: "Inglaterra", group: "L", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "PAR", name: "Paraguay", group: "L", flag: "🇵🇾" },
  { id: "QAT", name: "Catar", group: "L", flag: "🇶🇦" },
  { id: "NZL", name: "Nueva Zelanda", group: "L", flag: "🇳🇿" }
];

// Corregir bandera de Polonia (era PL 🇵🇱)
TEAMS_DATA.find(t => t.id === "POL").flag = "🇵🇱";

// Generar base de datos final unificada
export const getAlbumDatabase = () => {
  const database = {};
  
  // 1. Añadir Sección Especial FWC
  database[SPECIAL_SECTION.id] = {
    id: SPECIAL_SECTION.id,
    name: SPECIAL_SECTION.name,
    flag: "🏆",
    group: "Especial",
    stickers: SPECIAL_SECTION.stickers
  };
  
  // 2. Procesar cada Selección
  TEAMS_DATA.forEach(team => {
    const rosterNames = REAL_ROSTERS[team.id] || generateRoster(team.id, team.name);
    const stickers = [
      { id: `${team.id}-01`, name: "Escudo", position: "Escudo", number: 1 },
      { id: `${team.id}-02`, name: "Foto de Equipo", position: "Equipo", number: 2 }
    ];
    
    // Posiciones típicas de fútbol en orden de guardado en el álbum
    const positions = [
      "Portero", "Defensa", "Defensa", "Defensa", "Defensa",
      "Mediocampista", "Mediocampista", "Mediocampista", "Mediocampista",
      "Delantero", "Delantero", "Delantero", "Mediocampista", "Defensa",
      "Mediocampista", "Delantero", "Portero"
    ];
    
    rosterNames.forEach((name, idx) => {
      stickers.push({
        id: `${team.id}-${String(idx + 3).padStart(2, "0")}`,
        name: name,
        position: positions[idx] || "Jugador",
        number: idx + 3
      });
    });
    
    database[team.id] = {
      id: team.id,
      name: team.name,
      flag: team.flag,
      group: team.group,
      stickers: stickers
    };
  });
  
  return database;
};
