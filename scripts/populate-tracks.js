import fs from 'fs';
import path from 'path';
import { cache, scCacheFile, resolveTrack, saveCache } from './scHelper.js';

// Artist avatars
const ARTIST_AVATARS = {
  "Junior H": "https://i1.sndcdn.com/artworks-HiqENlLH65c8-0-t500x500.jpg",
  "Peso Pluma": "https://i1.sndcdn.com/artworks-G3tAA094TcRd-0-t500x500.jpg",
  "Natanael Cano": "https://i1.sndcdn.com/artworks-9SETmQdpdzQb-0-t500x500.jpg",
  "Fuerza Regida": "https://i1.sndcdn.com/artworks-IzAqtZGswYwF-0-t500x500.jpg",
  "Oscar Maydon": "https://i1.sndcdn.com/artworks-zgwjUZzZfU7u51im-EA0P6g-t500x500.jpg",
  "Gabito Ballesteros": "https://i1.sndcdn.com/artworks-s1uJBSEhB11A-0-t500x500.jpg",
  "Tito Double P": "https://i1.sndcdn.com/artworks-6VyGWeiQ01w5-0-t500x500.jpg",
  "Xavi": "https://i1.sndcdn.com/artworks-DL3QtMpAhfsC-0-t500x500.jpg",
  "Eslabon Armado": "https://i1.sndcdn.com/artworks-T4yzIIA2Hulk-0-t500x500.jpg",
  "Grupo Frontera": "https://i1.sndcdn.com/artworks-ijyD5JEhv7DTGmkh-9cidEw-t500x500.jpg",
  "Carín León": "https://i1.sndcdn.com/artworks-r2QezpLYTmM9-0-t500x500.jpg",
  "Christian Nodal": "https://i1.sndcdn.com/artworks-47hWP3TSzj8j-0-t500x500.jpg",
  "Edén Muñoz": "https://i1.sndcdn.com/artworks-Y6h88NoCzPs2-0-t500x500.jpg",
  "Netón Vega": "https://i1.sndcdn.com/artworks-w715OFfZQpd2-0-t500x500.jpg",
  "DannyLux": "https://i1.sndcdn.com/artworks-yJvNuxw44DNb-0-t500x500.jpg",
  "Ivan Cornejo": "https://i1.sndcdn.com/artworks-wGnK1xXf6GQh-0-t500x500.jpg",
  "Marca MP": "https://i1.sndcdn.com/artworks-sqvkcClHpAzhYZNj-qJ4wwQ-t500x500.jpg",
  "Chino Pacas": "https://i1.sndcdn.com/artworks-xt1Nx13QOIqG-0-t500x500.jpg",
  "Luis R Conriquez": "https://i1.sndcdn.com/artworks-jDRezNNTbpH062Wy-45PXkg-t500x500.jpg",
  "Jasiel Nuñez": "https://i1.sndcdn.com/artworks-dNYbRRYFJEct-0-t500x500.jpg",
  "Herencia de Patrones": "https://i1.sndcdn.com/artworks-tzR2nRw9jvqa-0-t500x500.jpg",
  "Ovi": "https://i1.sndcdn.com/artworks-GyIAV4g9EzcA-0-t500x500.jpg",
  "El Komander": "https://i1.sndcdn.com/artworks-000201083902-6r51g9-t500x500.jpg",
  "Junior H & Peso Pluma": "https://i1.sndcdn.com/artworks-V02E0D4bM4p3-0-t500x500.jpg",
  "Fuerza Regida & Peso Pluma": "https://i1.sndcdn.com/artworks-oEbPJY9O4ri2-0-t500x500.jpg",
  "Grupo Marca Registrada": "https://i1.sndcdn.com/artworks-1Ue6kI0cWn1R-0-t500x500.jpg",
  "Fuerza Regida & Junior H": "https://i1.sndcdn.com/artworks-sEZLjIX5AaB6-0-t500x500.jpg"
};

for (const [k, v] of Object.entries(ARTIST_AVATARS)) {
  cache._artistAvatars[k] = v;
}

// Artist Banners (high resolution atmospheric banners)
const ARTIST_BANNERS = {
  "Junior H": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
  "Peso Pluma": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
  "Natanael Cano": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
  "Fuerza Regida": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
  "Oscar Maydon": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80",
  "Gabito Ballesteros": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
  "Tito Double P": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80",
  "Xavi": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&auto=format&fit=crop&q=80",
  "Eslabon Armado": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
  "Grupo Frontera": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop&q=80",
  "Carín León": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
  "Christian Nodal": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
  "Edén Muñoz": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
  "Netón Vega": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
  "DannyLux": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80",
  "Ivan Cornejo": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80",
  "Marca MP": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&auto=format&fit=crop&q=80",
  "Chino Pacas": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
  "Luis R Conriquez": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop&q=80",
  "Jasiel Nuñez": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
  "Herencia de Patrones": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80",
  "Ovi": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
  "El Komander": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
  "Grupo Marca Registrada": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",
};

// Priority list of all tracks to ensure indexed in soundcloudCache.json
const TRACKS_TO_INDEX = [
  // Junior H Catalog
  { title: "Y LLORO", artist: "Junior H" },
  { title: "Fin De Semana", artist: "Junior H" },
  { title: "El Azul", artist: "Junior H" },
  { title: "Miéntele", artist: "Junior H" },
  { title: "Se Amerita", artist: "Junior H" },
  { title: "Atrapado En Un Sueño", artist: "Junior H" },
  { title: "Las Noches", artist: "Junior H" },
  { title: "El Hijo Mayor", artist: "Junior H" },
  { title: "Más Alta Que Bajadas", artist: "Junior H" },
  { title: "No He Cambiado", artist: "Junior H" },
  { title: "160 Kilos", artist: "Junior H" },
  { title: "Como Jordan", artist: "Junior H" },
  { title: "Un Desperdicio", artist: "Junior H" },
  { title: "Disfruto Lo Malo", artist: "Junior H" },
  { title: "El Rescate", artist: "Junior H" },
  { title: "Los Botones Azules", artist: "Junior H" },
  { title: "Rompe La Dompe", artist: "Junior H" },
  { title: "Bipolar", artist: "Junior H" },
  { title: "Abcdario", artist: "Junior H" },
  { title: "Clave Ali", artist: "Junior H" },
  { title: "Cologne", artist: "Junior H" },
  { title: "El Patrocinador", artist: "Junior H" },
  { title: "Tres Botellas", artist: "Junior H" },
  { title: "Luna", artist: "Junior H" },
  { title: "Mi Vida En Un Cigarro", artist: "Junior H" },
  { title: "Mente Positiva", artist: "Junior H" },
  { title: "Ojos Colorados", artist: "Junior H" },
  { title: "Jueves 10", artist: "Junior H" },
  { title: "Si Mañana Muero", artist: "Junior H" },
  { title: "El F", artist: "Junior H" },
  { title: "Me Consume", artist: "Junior H" },
  { title: "Tu Dormida", artist: "Junior H" },
  { title: "Ojos Tumbados", artist: "Junior H" },
  { title: "Vamos Pa Arriba", artist: "Junior H" },
  { title: "El Cachorrito", artist: "Junior H" },
  { title: "La Bestia", artist: "Junior H" },

  // Peso Pluma Catalog
  { title: "Ella Baila Sola", artist: "Peso Pluma" },
  { title: "LADY GAGA", artist: "Peso Pluma" },
  { title: "PRC", artist: "Peso Pluma" },
  { title: "BELLAKEO", artist: "Peso Pluma" },
  { title: "LA PEOPLE II", artist: "Peso Pluma" },
  { title: "TULUM", artist: "Peso Pluma" },
  { title: "HOLLYWOOD", artist: "Peso Pluma" },
  { title: "Rosa Pastel", artist: "Peso Pluma" },
  { title: "Por Las Noches", artist: "Peso Pluma" },
  { title: "Nueva Vida", artist: "Peso Pluma" },
  { title: "Rubicon", artist: "Peso Pluma" },
  { title: "Igual Que Un Ángel", artist: "Peso Pluma" },
  { title: "Chanel", artist: "Peso Pluma" },
  { title: "QLONA", artist: "Peso Pluma" },
  { title: "AMG", artist: "Peso Pluma" },
  { title: "Igualito A Mi Apá", artist: "Peso Pluma" },

  // Natanael Cano Catalog
  { title: "Madonna", artist: "Natanael Cano" },
  { title: "Mi Bello Ángel", artist: "Natanael Cano" },
  { title: "AMG", artist: "Natanael Cano" },
  { title: "Ch y la Pizza", artist: "Natanael Cano" },
  { title: "Pacas De Billetes", artist: "Natanael Cano" },
  { title: "Amor Tumbado", artist: "Natanael Cano" },
  { title: "Soy El Diablo", artist: "Natanael Cano" },
  { title: "Cuerno Azulado", artist: "Natanael Cano" },
  { title: "O Me Voy O Te Vas", artist: "Natanael Cano" },
  { title: "Lou Lou", artist: "Natanael Cano" },
  { title: "Giza", artist: "Natanael Cano" },
  { title: "Entre Las De 20", artist: "Natanael Cano" },
  { title: "Diamantes", artist: "Natanael Cano" },

  // Fuerza Regida Catalog
  { title: "TQM", artist: "Fuerza Regida" },
  { title: "HARLEY QUINN", artist: "Fuerza Regida" },
  { title: "NEL", artist: "Fuerza Regida" },
  { title: "SABOR FRESA", artist: "Fuerza Regida" },
  { title: "QUE ONDA", artist: "Fuerza Regida" },
  { title: "Bebe Dame", artist: "Fuerza Regida" },
  { title: "CRAZYZ", artist: "Fuerza Regida" },
  { title: "Tu Boda", artist: "Fuerza Regida" },
  { title: "Tacata", artist: "Fuerza Regida" },
  { title: "Excesos", artist: "Fuerza Regida" },
  { title: "Se Logró", artist: "Fuerza Regida" },
  { title: "Radicamos En South Central", artist: "Fuerza Regida" },

  // Oscar Maydon Catalog
  { title: "Fin De Semana", artist: "Oscar Maydon" },
  { title: "Madonna", artist: "Oscar Maydon" },
  { title: "Rompe La Dompe", artist: "Oscar Maydon" },
  { title: "Tu Boda", artist: "Oscar Maydon" },
  { title: "Polvo Rosa", artist: "Oscar Maydon" },
  { title: "Elvira", artist: "Oscar Maydon" },
  { title: "Mercedes", artist: "Oscar Maydon" },
  { title: "Anda Bien El Nene", artist: "Oscar Maydon" },

  // Gabito Ballesteros Catalog
  { title: "Lou Lou", artist: "Gabito Ballesteros" },
  { title: "El Muchacho Alegre", artist: "Gabito Ballesteros" },
  { title: "A Puro Dolor", artist: "Gabito Ballesteros" },
  { title: "Fendi", artist: "Gabito Ballesteros" },
  { title: "Vamos Para Arriba", artist: "Gabito Ballesteros" },
  { title: "Presidente", artist: "Gabito Ballesteros" },

  // Tito Double P Catalog
  { title: "Linda", artist: "Tito Double P" },
  { title: "Primo", artist: "Tito Double P" },
  { title: "Gavilán II", artist: "Tito Double P" },
  { title: "Dos Días", artist: "Tito Double P" },
  { title: "Belicoso", artist: "Tito Double P" },
  { title: "Los Cuadros", artist: "Tito Double P" },
  { title: "Traigo Saliva", artist: "Tito Double P" },
  { title: "El Lokeron", artist: "Tito Double P" },

  // Xavi Catalog
  { title: "La Diabla", artist: "Xavi" },
  { title: "La Víctima", artist: "Xavi" },
  { title: "Corazón de Piedra", artist: "Xavi" },
  { title: "Poco a Poco", artist: "Xavi" },
  { title: "Modo DND", artist: "Xavi" },
  { title: "Rayando El Sol", artist: "Xavi" },
  { title: "Sin Pagar Renta", artist: "Xavi" },
  { title: "Amigos Con Derecho", artist: "Xavi" },

  // Eslabon Armado Catalog
  { title: "Jugaste y Sufrí", artist: "Eslabon Armado" },
  { title: "Con Tus Besos", artist: "Eslabon Armado" },
  { title: "Te Encontré", artist: "Eslabon Armado" },
  { title: "Regresa Mami", artist: "Eslabon Armado" },
  { title: "Baby", artist: "Eslabon Armado" },
  { title: "La Fresa", artist: "Eslabon Armado" },

  // Grupo Frontera Catalog
  { title: "un x100to", artist: "Grupo Frontera" },
  { title: "No Se Va", artist: "Grupo Frontera" },
  { title: "ALV", artist: "Grupo Frontera" },
  { title: "Que Vuelvas", artist: "Grupo Frontera" },
  { title: "Ojitos Rojos", artist: "Grupo Frontera" },
  { title: "Amor Propio", artist: "Grupo Frontera" },

  // Carín León Catalog
  { title: "Primera Cita", artist: "Carín León" },
  { title: "Según Quién", artist: "Carín León" },
  { title: "No Es Por Acá", artist: "Carín León" },
  { title: "Una Vida Pasada", artist: "Carín León" },
  { title: "La Boda del Huitlacoche", artist: "Carín León" },
  { title: "Te Lo Agradezco", artist: "Carín León" },
  { title: "Casi Oficial", artist: "Carín León" },
  { title: "Como Lo Hice Yo", artist: "Carín León" },

  // Christian Nodal Catalog
  { title: "Adiós Amor", artist: "Christian Nodal" },
  { title: "Botella Tras Botella", artist: "Christian Nodal" },
  { title: "De Los Besos Que Te Di", artist: "Christian Nodal" },
  { title: "Ya No Somos Ni Seremos", artist: "Christian Nodal" },
  { title: "No Te Contaron Mal", artist: "Christian Nodal" },
  { title: "Kbrón y Medio", artist: "Christian Nodal" },
  { title: "Vivo En El 6", artist: "Christian Nodal" },

  // Edén Muñoz Catalog
  { title: "Chale", artist: "Edén Muñoz" },
  { title: "Como En Los Viejos Tiempos", artist: "Edén Muñoz" },
  { title: "CCC", artist: "Edén Muñoz" },
  { title: "Consejos Gratis", artist: "Edén Muñoz" },
  { title: "Te Perdono", artist: "Edén Muñoz" },

  // Netón Vega Catalog
  { title: "Si No Quieres No", artist: "Netón Vega" },
  { title: "La Pantera", artist: "Netón Vega" },
  { title: "Me Dicen El V", artist: "Netón Vega" },
  { title: "El Chato", artist: "Netón Vega" },

  // DannyLux Catalog
  { title: "HOUSE OF LUX", artist: "DannyLux" },
  { title: "Mi Otra Mitad", artist: "DannyLux" },
  { title: "Amar y Perder", artist: "DannyLux" },
  { title: "Decir Adios", artist: "DannyLux" },
  { title: "AMBICION", artist: "DannyLux" },

  // Ivan Cornejo Catalog
  { title: "Está Dañada", artist: "Ivan Cornejo" },
  { title: "Aquí Te Espero", artist: "Ivan Cornejo" },
  { title: "La Curiosidad", artist: "Ivan Cornejo" },
  { title: "J.", artist: "Ivan Cornejo" },
  { title: "Baby Please", artist: "Ivan Cornejo" },
  { title: "Llamadas Perdidas", artist: "Ivan Cornejo" },

  // Marca MP Catalog
  { title: "El Güero", artist: "Marca MP" },
  { title: "Ya Acabó", artist: "Marca MP" },
  { title: "Recuerda", artist: "Marca MP" },
  { title: "Mil Gracias Por Existir", artist: "Marca MP" },
  { title: "Tu Eres Quien Me Domina", artist: "Marca MP" },

  // Chino Pacas Catalog
  { title: "El Gordo Trae El Mando", artist: "Chino Pacas" },
  { title: "Dijeron Que No La Iba Lograr", artist: "Chino Pacas" },
  { title: "Los Verdes", artist: "Chino Pacas" },
  { title: "Yo El Chino", artist: "Chino Pacas" },

  // Luis R Conriquez Catalog
  { title: "JGL", artist: "Luis R Conriquez" },
  { title: "Dembow Bélico", artist: "Luis R Conriquez" },
  { title: "Siempre Pendientes", artist: "Luis R Conriquez" },
  { title: "El Gavilán", artist: "Luis R Conriquez" },
  { title: "Sin Tanto Royo", artist: "Luis R Conriquez" },

  // Jasiel Nuñez Catalog
  { title: "Lagunas", artist: "Jasiel Nuñez" },
  { title: "Su Casa", artist: "Jasiel Nuñez" },
  { title: "Corazón Frío", artist: "Jasiel Nuñez" },
  { title: "0 Sentimientos", artist: "Jasiel Nuñez" },

  // Herencia de Patrones Catalog
  { title: "Cosas de la Clica", artist: "Herencia de Patrones" },
  { title: "Es Difícil Ser Un Santo", artist: "Herencia de Patrones" },
  { title: "Pa Las Vibras", artist: "Herencia de Patrones" },
  { title: "Clika Mierda", artist: "Herencia de Patrones" },
  { title: "Ladeando", artist: "Herencia de Patrones" },

  // Ovi Catalog
  { title: "Pacas Verdes", artist: "Ovi" },
  { title: "Día de Pago", artist: "Ovi" },
  { title: "Yo Ya Sé", artist: "Ovi" },

  // El Komander Catalog
  { title: "El Taquicardio", artist: "El Komander" },
  { title: "Soy de Rancho", artist: "El Komander" },
  { title: "Descansa Mi Amor", artist: "El Komander" },
  { title: "El Katch", artist: "El Komander" },
  { title: "Malditas Ganas", artist: "El Komander" },

  // Grupo Marca Registrada Catalog
  { title: "Si Fuera Fácil", artist: "Grupo Marca Registrada" },
  { title: "Di Que Sí", artist: "Grupo Marca Registrada" },
  { title: "Solo Me Dejaste", artist: "Grupo Marca Registrada" },
  { title: "Eres Mi Crush", artist: "Grupo Marca Registrada" }
];

async function main() {
  console.log(`Starting index of ${TRACKS_TO_INDEX.length} tracks...`);
  let resolvedCount = 0;
  let skippedCount = 0;

  // Process in chunks of 8 with saveCache after every chunk
  for (let i = 0; i < TRACKS_TO_INDEX.length; i += 8) {
    const chunk = TRACKS_TO_INDEX.slice(i, i + 8);
    await Promise.all(
      chunk.map(async (t) => {
        const key = `${t.artist} ${t.title}`.trim().toLowerCase();
        if (cache[key] && cache[key].trackUrl && cache[key].artworkUrl) {
          skippedCount++;
          return;
        }
        const res = await resolveTrack(t.title, t.artist);
        if (res && res.trackUrl) {
          resolvedCount++;
        }
      })
    );
    saveCache();
    process.stdout.write(`\rProgress: ${Math.min(i + 8, TRACKS_TO_INDEX.length)} / ${TRACKS_TO_INDEX.length} (resolved ${resolvedCount})`);
  }

  saveCache();
  console.log(`\nDone! Resolved ${resolvedCount} new tracks, kept ${skippedCount} existing. Total in cache: ${Object.keys(cache).length}`);
}

main();
