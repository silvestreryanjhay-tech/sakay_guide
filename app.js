/* ============ TRAFFIC HEURISTIC ENGINE ============ */
function getTrafficMultiplier(departureMinutes) {
  const now = new Date();
  const day = now.getDay();
  const hour = departureMinutes / 60;
  if (day === 0 || day === 6) {
    if (hour >= 10 && hour < 20) return 1.15;
    return 0.9;
  }
  if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 20)) return 1.55;
  if (hour >= 9 && hour < 12) return 1.25;
  if (hour >= 12 && hour < 14) return 1.15;
  if (hour >= 14 && hour < 17) return 1.2;
  if (hour >= 20 && hour < 22) return 1.05;
  return 0.85;
}

function applyTrafficToRoute(route, departureMinutes) {
  const mult = getTrafficMultiplier(departureMinutes);
  let totalMin = 0;
  route.legs.forEach(leg => {
    const isRail = ["mrt3", "lrt1", "lrt2", "carousel"].includes(leg.m);
    const factor = isRail ? 1.0 : mult;
    leg.min = Math.round(leg.min * factor);
    totalMin += leg.min;
  });
  const transferTime = (route.legs.length - 1) * Math.round(6 * mult);
  route.min = totalMin + transferTime;
  route.trafficMultiplier = mult;
  return route;
}

/* ============ FULL METRO MANILA DATA ============ */
const Hubs = [
["north","SM North EDSA","Quezon City",14.6563,121.0306],["cubao","Cubao","Quezon City",14.62,121.053],
["ortigas","Ortigas Center","Pasig",14.5878,121.0567],["makati","Makati (Ayala)","Makati",14.5547,121.0244],
["taft","Taft Ave","Pasay",14.5378,121.0014],["monumento","Caloocan (Monumento)","Caloocan",14.654,120.9838],
["recto","Recto","Manila",14.6035,120.983],["pitx","PITX","Parañaque",14.51,120.991],
["baclaan","Baclaran","Pasay",14.537,120.997],["santolan","Marikina (Santolan)","Marikina",14.6228,121.086],
["shaw","MRT Shaw Blvd","Mandaluyong",14.581,121.053],["boni","MRT Boni Ave","Mandaluyong",14.573,121.048],
["rtu","RTU Mandaluyong","Mandaluyong",14.568,121.043],["lifehomes","Lifehomes Pasig (Rosario)","Pasig",14.580,121.077],
["parklea","Parklea Mandaluyong","Mandaluyong",14.575,121.045],["alabang","Alabang","Muntinlupa",14.42,121.04],
["divisoria","Divisoria","Manila",14.602,120.974],["novaliches","Novaliches (TP)","Quezon City",14.726,121.037],
["quiapo","Quiapo","Manila",14.598,120.985],["blumentritt","Blumentritt","Manila",14.619,120.984],
["libertad","Libertad","Pasay",14.545,121.010],["paco","Paco","Manila",14.579,120.996],
["pier_south","Pier South","Manila",14.586,120.972],["sta_cruz","Sta. Cruz","Manila",14.599,120.980],
["tm_kalaw","T.M. Kalaw","Manila",14.580,120.981],["pasig_tp","Pasig (TP)","Pasig",14.575,121.085],
["angono","Angono","Rizal",14.525,121.155],["antipolo","Antipolo","Rizal",14.585,121.176],
["taytay","Taytay","Rizal",14.570,121.135],["binangonan","Binangonan","Rizal",14.465,121.190],
["cainta","Cainta","Rizal",14.580,121.120],["marikina_tp","Marikina (TP)","Marikina",14.632,121.098],
["san_mateo","San Mateo","Rizal",14.695,121.120],["montalban","Rodriguez (Montalban)","Rizal",14.730,121.145],
["sucat","Sucat","Parañaque",14.455,121.024],["fti","FTI","Taguig",14.520,121.050],
["nichols","Nichols","Taguig",14.510,121.020],["signal_village","Signal Village","Taguig",14.510,121.065],
["pasay_rtda","Pasay Rotonda","Pasay",14.537,121.001],["edsa_shaw","EDSA/Shaw","Mandaluyong",14.581,121.053],
["edsa_north","EDSA/North Ave.","Quezon City",14.656,121.031],["lagro","Lagro","Quezon City",14.740,121.065],
["fairview","Fairview","Quezon City",14.733,121.058],["bagong_silang","Bagong Silang","Caloocan",14.750,121.020],
["camarin","Camarin","Caloocan",14.746,121.017],["malinta","Malinta","Valenzuela",14.700,120.990],
["karuhatan","Karuhatan","Valenzuela",14.690,120.980],["navotas","Navotas","Navotas",14.667,120.942],
["malabon","Malabon","Malabon",14.6625,120.957],["valenzuela","Valenzuela","Valenzuela",14.7011,120.983],
["pasig_caruncho","Pasig (Caruncho)","Pasig",14.573,121.085],["pasig_rosales","Pasig (P. Rosales)","Pasig",14.568,121.082],
["mandaluyong_cityhall","Mandaluyong City Hall","Mandaluyong",14.579,121.036],["one_ayala","One Ayala","Makati",14.553,121.028],
["makati_sanjose","Makati (San Jose St)","Makati",14.558,121.035],["makati_sierramadre","Makati (Sierra Madre)","Makati",14.567,121.042],
["shaw_crossing","Shaw Crossing","Mandaluyong",14.587,121.058],["pasig_ortigas_raymundo","Pasig (C. Raymundo)","Pasig",14.576,121.080],
["san_juan_ndomingo","San Juan (N. Domingo)","San Juan",14.605,121.035],["mandaluyong_mayflower","Mandaluyong (Mayflower)","Mandaluyong",14.578,121.047],
["pasig_dr_garcia","Pasig (Dr. Garcia)","Pasig",14.571,121.084],["pasig_mabini","Pasig (A. Mabini)","Pasig",14.572,121.087],
["muntinlupa","Muntinlupa","Muntinlupa",14.415,121.040],["laspinas","Las Piñas","Las Piñas",14.450,120.993],
["zapote","Zapote","Las Piñas",14.470,120.980],["bacoor","Bacoor","Cavite",14.460,120.940],
["dasmarinas","Dasmariñas","Cavite",14.330,120.940],["gma","GMA","Cavite",14.300,121.000],
["carmona","Carmona","Cavite",14.310,121.050],["binan","Binan","Laguna",14.330,121.080],
["sta_rosa","Sta. Rosa","Laguna",14.310,121.100],["calamba","Calamba","Laguna",14.210,121.170],
["san_pedro","San Pedro","Laguna",14.360,121.050],["pacita","Pacita","Laguna",14.340,121.050],
["ususan","Ususan (Taguig)","Taguig",14.535,121.068],["pasig_palengke","Pasig Palengke","Pasig",14.565,121.085],
["tagig_tp","Taguig (TP)","Taguig",14.520,121.070],["bicutan","Bicutan","Taguig",14.495,121.051],
["pateros","Pateros","Pateros",14.544,121.069],["upper_bicutan","Upper Bicutan","Taguig",14.505,121.060],
["western_bicutan","Western Bicutan","Taguig",14.515,121.035],["lower_bicutan","Lower Bicutan","Taguig",14.500,121.045],
["fti_taguig","FTI Taguig","Taguig",14.520,121.050],["tipas","Tipas (Taguig)","Taguig",14.530,121.075],
["sangandaan","Sangandaan","Caloocan",14.667,121.007],["balintawak","Balintawak","Quezon City",14.657,121.002],
["bagong_barrio","Bagong Barrio","Caloocan",14.658,120.996],["lawang_bato","Lawang Bato","Valenzuela",14.730,120.960],
["paso_de_blas","Paso de Blas","Valenzuela",14.705,120.980],["punturin","Punturin","Valenzuela",14.725,120.990],
["mapulang_lupa","Mapulang Lupa","Valenzuela",14.690,120.985],["bagbaguin","Bagbaguin","Valenzuela",14.710,120.990]
];

/* ============ BARANGAYS ============ */
const Barangays = {
  "Caloocan": Array.from({length: 188}, (_,i) => "Barangay " + (i+1)),
  "Las Piñas": ["Alonzo","CAA-BF International","Daniel Fajardo","Elias Aldana","Ilaya","Manuyo Uno","Manuyo Dos","Pamplona Uno","Pamplona Dos","Pamplona Tres","Pilar","Pulang Lupa Uno","Pulang Lupa Dos","Talon Uno","Talon Dos","Talon Tres","Talon Cuatro","Talon Singko","Zapote"],
  "Makati": ["Bangkal","Bel-Air","Carmona","Cembo","Comembo","Dasmariñas Village","East Rembo","Forbes Park","Guadalupe Nuevo","Guadalupe Viejo","Kasilawan","La Paz","Magallanes","Olympia","Palanan","Pembo","Pinagkaisahan","Pio del Pilar","Pitogo","Rizal","San Antonio","San Lorenzo","Santa Cruz","Singkamas","South Cembo","Tejeros","Urdaneta","Valenzuela","West Rembo"],
  "Malabon": ["Baritan","Bayan-bayanan","Catmon","Concepcion","Dampalit","Flores","Hulong Duhat","Ibaba","Longos","Maysilo","Muzon","Niugan","Panghulo","Potrero","San Agustin","Santolan","Tañong","Tinajeros","Tonsuya","Tugatog","Acacia"],
  "Mandaluyong": ["Addition Hills","Bagong Silang","Barangka Ilaya","Barangka Itaas","Barangka Kanluran","Barangka Drive","Buayang Bato","Burol","Daang Bakal","Hagdang Bato Itaas","Hagdang Bato Libis","Harapin Ang Bukas","Highway Hills","Hulo","Mabini-J. Rizal","Malamig","Mauway","Namayan","New Zañiga","Old Zañiga","Pag-asa","Plainview","Pleasant Hills","Poblacion","San Jose","Vergara","Wack-Wack Greenhills"],
  "Manila": Array.from({length: 896}, (_,i) => "Barangay " + (i+1)),
  "Marikina": ["Barangka","Calumpang","Concepcion Uno","Concepcion Dos","Fortune","Industrial Valley","Jesus de la Peña","Malanday","Marikina Heights","Nangka","Parang","San Roque","Santa Elena","Santo Niño","Tañong","Tumana"],
  "Muntinlupa": ["Alabang","Bayanan","Buli","Cupang","New Alabang Village (Ayala Alabang)","Poblacion","Putatan","Sucat","Tunasan"],
  "Navotas": ["Bagumbayan North","Bagumbayan South","Bangculasi","Daanghari","Navotas East","Navotas West","Northbay Boulevard North","Northbay Boulevard South","San Jose","San Roque","Tangos North","Tangos South","Tanza 1","Tanza 2","San Rafael Village","Sipac-Almacen","Tanza","NBBS Kaunlaran"],
  "Parañaque": ["Baclaran","Don Galo","La Huerta","Moonwalk","San Dionisio","San Isidro","Santo Niño","Tambo","BF Homes","Don Bosco","Marcelo Green","Merville","San Antonio","Sun Valley","Tatalon"],
  "Pasay": Array.from({length: 201}, (_,i) => "Barangay " + (i+1)),
  "Pasig": ["Bagong Ilog","Bagong Katipunan","Bambang","Buting","Caniogan","Dela Paz","Kalawaan","Kapasigan","Kapitolyo","Malinao","Manggahan","Maybunga","Oranbo","Palatiw","Pinagbuhatan","Pineda","Rosario","San Antonio","San Joaquin","San Jose","San Miguel","San Nicolas","Santa Cruz","Santa Lucia","Santa Rosa","Santolan","Santo Tomas","Sumilang","Ugong","Maybunga"],
  "Pateros": ["Aguho","Magtanggol","Martirez del 96","Poblacion","San Pedro","San Roque","Santa Ana","Santo Rosario-Kanluran","Santo Rosario-Silangan","Tabacalera"],
  "Quezon City": ["Alicia","Bagong Pag-asa","Bagong Silangan","Bahay Toro","Balingasa","Batasan Hills","Blue Ridge A","Blue Ridge B","Camp Aguinaldo","Central","Commonwealth","Crame","Cubao","Culiat","Damar","Damayan","Del Monte","Don Manuel","Doña Imelda","Fairview","Holy Spirit","Immaculate Conception","Kaligayahan","Kamuning","Katipunan","Libis","Loyola Heights","Maharlika","Malaya","Marilag","Masagana","Matandang Balara","Milagrosa","Novaliches Proper","North Olympia","Old Balara","Paang Bundok","Pag-ibig sa Nayon","Paligsahan","Paltok","Pansol","Pasong Tamo","Payatas","Pinyahan","Project 6","Roxas","Sacred Heart","San Bartolome","San Jose","San Roque","Santa Lucia","Santa Teresita","Santo Domingo","Santo Cristo","Socorro","South Triangle","Talayan","Talipapa","Tandang Sora","Tatalon","Teachers Village","Ugong Norte","Unang Sigaw","Up Campus","Up Village","Valencia","Vasra","West Triangle","White Plains"],
  "San Juan": ["Addition Hills","Balong-Bato","Batis","Corazon de Jesus","Ermitaño","Greenhills","Isabelita","Kabayanan","Little Baguio","Maytunas","Onse","Pasadena","Pedro Cruz","Progreso","Rivera","Salapan","San Perfecto","Santa Lucia","St. Joseph","Tibagan","West Crame"],
  "Taguig": ["Bagumbayan","Bambang","Calzada","Central Bicutan","Central Signal Village","Fort Bonifacio","Hagonoy","Ibayo-Tipas","Katuparan","Ligid-Tipas","Lower Bicutan","Maharlika Village","Napindan","New Lower Bicutan","North Daang Hari","North Signal Village","Palingon","Pinagsama","San Miguel","Santa Ana","South Daang Hari","South Signal Village","Tanyag","Tuktukan","Upper Bicutan","Ususan","Wawa","Western Bicutan"],
  "Valenzuela": ["Arkong Bato","Bagbaguin","Balangkas","Bignay","Bisig","Canumay East","Canumay West","Coloong","Dalandanan","Gen. T. de Leon","Isla","Karuhatan","Lawang Bato","Lingunan","Mabolo","Malanday","Malinta","Mapulang Lupa","Marulas","Maysan","Palasan","Parada","Pariancillo Villa","Paso de Blas","Pasolo","Poblacion","Punturin","Rincon","Tagalag","Ugong","Viente Reales","Wawang Pulo"]
};

const P={},C={},CitiesList=[];
let idCounter = 0;
for(const city in Barangays){
  CitiesList.push(city);
  Barangays[city].forEach(brgy => {
    const key = "brgy_"+idCounter++;
    let lat=14.6, lon=121.0;
    if(city==="Quezon City"){lat=14.67;lon=121.03}
    else if(city==="Manila"){lat=14.59;lon=120.98}
    else if(city==="Makati"){lat=14.55;lon=121.03}
    else if(city==="Pasig"){lat=14.58;lon=121.08}
    else if(city==="Mandaluyong"){lat=14.58;lon=121.04}
    else if(city==="Taguig"){lat=14.52;lon=121.05}
    else if(city==="Caloocan"){lat=14.65;lon=120.98}
    else if(city==="Pasay"){lat=14.53;lon=121.00}
    else if(city==="Parañaque"){lat=14.47;lon=121.01}
    else if(city==="Las Piñas"){lat=14.45;lon=120.99}
    else if(city==="Muntinlupa"){lat=14.41;lon=121.04}
    else if(city==="Marikina"){lat=14.63;lon=121.10}
    else if(city==="San Juan"){lat=14.60;lon=121.03}
    else if(city==="Valenzuela"){lat=14.70;lon=120.98}
    else if(city==="Malabon"){lat=14.66;lon=120.96}
    else if(city==="Navotas"){lat=14.66;lon=120.94}
    else if(city==="Pateros"){lat=14.54;lon=121.07}
    P[key] = brgy + ", " + city;
    C[key] = [lat + (Math.random()-0.5)*0.05, lon + (Math.random()-0.5)*0.05];
  });
}

Hubs.forEach(h=>{
  P[h[0]]=h[1]+", "+h[2];
  C[h[0]]=[h[3],h[4]];
});

const SearchData = [];
for(const city in Barangays){
  Barangays[city].forEach(brgy => {
    SearchData.push({ id: Object.keys(P).find(k => P[k] === brgy + ", " + city), name: brgy, city: city });
  });
}
Hubs.forEach(h=>{ SearchData.push({ id: h[0], name: h[1], city: h[2] }); });
SearchData.sort((a,b)=>a.name.localeCompare(b.name));

const BASE_JEEP = 14, BASE_MODERN = 17, BASE_TRICYCLE = 12;
function calcJeepFare(km, isModern = false) {
  const base = isModern ? BASE_MODERN : BASE_JEEP;
  const perKm = isModern ? 2.40 : 2.00;
  const minKm = 4;
  if (km <= minKm) return base;
  return Math.round(base + Math.ceil(km - minKm) * perKm);
}
function calcTricycleFare(km) { return BASE_TRICYCLE; }

/* ============ CUSTOM SVG ICONS ============ */
const iconSvg = {
  walk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M13 8l-2 5-3 4"/><path d="M13 8l3 4"/><path d="M11 13l-3 6"/></svg>`,
  jeep: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 12h18"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`,
  tricycle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h6l4-8h-4"/><path d="M9 9l4 8"/></svg>`,
  bus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/></svg>`,
  carousel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 12h18"/><circle cx="8" cy="16" r="1.5" fill="currentColor"/><circle cx="16" cy="16" r="1.5" fill="currentColor"/></svg>`,
  mrt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16"/><path d="M8 20l-2 2"/><path d="M16 20l2 2"/></svg>`,
  lrt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="16" rx="2"/><path d="M6 11h12"/><path d="M9 19l-2 3"/><path d="M15 19l2 3"/></svg>`
};

const M={
  walk:{n:"Lakad",c:"#9aa38a",i:iconSvg.walk},
  jeep:{n:"Jeep",c:"#ffc400",i:iconSvg.jeep},
  tricycle:{n:"Tricycle",c:"#a3e635",i:iconSvg.tricycle},
  bus:{n:"Bus",c:"#5b9bff",i:iconSvg.bus},
  carousel:{n:"EDSA Carousel",c:"#ff8a3d",i:iconSvg.carousel},
  mrt3:{n:"MRT-3",c:"#3b82f6",i:iconSvg.mrt},
  lrt1:{n:"LRT-1",c:"#34c77b",i:iconSvg.lrt},
  lrt2:{n:"LRT-2",c:"#b57bff",i:iconSvg.lrt}
};

const E=[
["north","cubao","mrt3",12,20],["cubao","ortigas","mrt3",7,16],["ortigas","makati","mrt3",13,20],["makati","taft","mrt3",10,16],
["monumento","recto","lrt1",25,25],["recto","taft","lrt1",20,25],["taft","baclaan","lrt1",5,12],["baclaan","pitx","lrt1",6,12],
["recto","cubao","lrt2",22,25],["cubao","santolan","lrt2",15,20],["santolan","marikina","lrt2",12,18],
["monumento","north","carousel",15,15],["north","makati","carousel",45,35],["makati","taft","carousel",15,15],["taft","pitx","carousel",25,20],
["alabang","baclaan","jeep",18],["alabang","pasay_rtda","jeep",20],["alabang","sucat","jeep",6],["alabang","muntinlupa","jeep",3],["alabang","signal_village","jeep",10],["alabang","fti","jeep",12],["alabang","laspinas","jeep",8],["alabang","zapote","jeep",9],["alabang","binan","jeep",15],["alabang","sta_rosa","jeep",18],["alabang","calamba","jeep",25],["alabang","san_pedro","jeep",12],["alabang","pacita","jeep",10],["alabang","gma","jeep",15],["alabang","carmona","jeep",12],["alabang","dasmarinas","jeep",18],
["baclaan","blumentritt","jeep",8],["baclaan","divisoria","jeep",10],["baclaan","sta_cruz","jeep",9],["baclaan","libertad","jeep",4],["baclaan","paco","jeep",7],["baclaan","quiapo","jeep",8],["baclaan","bacoor","jeep",10],["baclaan","zapote","jeep",8],["baclaan","laspinas","jeep",12],["baclaan","sucat","jeep",15],["baclaan","nichols","jeep",6],
["cubao","quiapo","jeep",10],["cubao","recto","jeep",12],["cubao","divisoria","jeep",14],["cubao","sta_cruz","jeep",11],["cubao","pier_south","jeep",15],["cubao","tm_kalaw","jeep",14],["cubao","fairview","jeep",12],["cubao","lagro","jeep",15],["cubao","novaliches","jeep",14],["cubao","angono","jeep",12],["cubao","antipolo","jeep",15],["cubao","taytay","jeep",12],["cubao","cainta","jeep",10],["cubao","marikina_tp","jeep",10],["cubao","san_mateo","jeep",12],["cubao","montalban","jeep",15],["cubao","pasig_tp","jeep",12],["cubao","santolan","jeep",6],
["divisoria","monumento","jeep",10],["divisoria","malinta","jeep",12],["divisoria","navotas","jeep",10],["divisoria","malabon","jeep",10],["divisoria","karuhatan","jeep",11],["divisoria","sangandaan","jeep",9],["divisoria","pier_south","jeep",5],["divisoria","sta_cruz","jeep",3],["divisoria","quiapo","jeep",4],["divisoria","blumentritt","jeep",5],["divisoria","tm_kalaw","jeep",5],["divisoria","sanjuan","jeep",8],
["monumento","navotas","jeep",8],["monumento","malabon","jeep",8],["monumento","valenzuela","jeep",10],["monumento","malinta","jeep",8],["monumento","karuhatan","jeep",7],["monumento","pasay_rtda","jeep",15],["monumento","baclaan","jeep",14],["monumento","pier_south","jeep",10],["monumento","tm_kalaw","jeep",11],["monumento","libertad","jeep",13],["monumento","recto","jeep",9],["monumento","blumentritt","jeep",7],
["novaliches","fairview","jeep",6],["novaliches","lagro","jeep",5],["novaliches","north","jeep",10],["novaliches","bagong_silang","jeep",8],["novaliches","camarin","jeep",7],["novaliches","montalban","jeep",12],["novaliches","san_mateo","jeep",10],
["pasig_tp","ortigas","jeep",5],["pasig_tp","shaw","jeep",6],["pasig_tp","quiapo","jeep",12],["pasig_tp","pateros","jeep",8],["pasig_tp","taytay","jeep",8],["pasig_tp","angono","jeep",10],["pasig_tp","ugong","jeep",4],["pasig_tp","cainta","jeep",7],["pasig_tp","marikina_tp","jeep",10],
["quiapo","sta_cruz","jeep",3],["quiapo","blumentritt","jeep",5],["quiapo","pier_south","jeep",5],["quiapo","tm_kalaw","jeep",4],["quiapo","paco","jeep",5],["quiapo","sanjuan","jeep",4],["quiapo","recto","jeep",3],["quiapo","divisoria","jeep",4],
["blumentritt","sta_cruz","jeep",3],["blumentritt","pier_south","jeep",6],["blumentritt","divisoria","jeep",5],["blumentritt","recto","jeep",4],["blumentritt","paco","jeep",5],["blumentritt","sanjuan","jeep",4],
["edsa_shaw","pasig_tp","jeep",6],["edsa_shaw","pateros","jeep",5],["edsa_shaw","taytay","jeep",7],["edsa_shaw","angono","jeep",9],["edsa_shaw","antipolo","jeep",10],["edsa_shaw","binangonan","jeep",12],["edsa_shaw","quiapo","jeep",10],["edsa_shaw","ortigas","jeep",3],["edsa_shaw","san_juan_ndomingo","jeep",5],
["mandaluyong_cityhall","one_ayala","jeep",6],["mandaluyong_cityhall","shaw","jeep",5],["mandaluyong_cityhall","boni","jeep",4],["mandaluyong_cityhall","sanjuan","jeep",6],["mandaluyong_mayflower","shaw","jeep",4],["mandaluyong_mayflower","pasig_mabini","jeep",6],["pasig_mabini","pasig_dr_garcia","jeep",2],["pasig_dr_garcia","pasig_caruncho","jeep",2],
["lifehomes","ortigas","jeep",3.5],["lifehomes","pasig_ortigas_raymundo","jeep",2],["lifehomes","pasig_caruncho","jeep",3],["lifehomes","pasig_sandoval","jeep",2.5],["lifehomes","pasig_rosales","jeep",2],["lifehomes","shaw","jeep",5.5],
["shaw","makati_sierramadre","jeep",5],["makati_sierramadre","makati","jeep",3],["shaw","san_juan_ndomingo","jeep",5],["shaw","ortigas","jeep",4],["shaw","pasig_tp","jeep",6],
["san_juan_ndomingo","sanjuan","jeep",2],["san_juan_ndomingo","cubao","jeep",6],["san_juan_ndomingo","quiapo","jeep",7],["san_juan_ndomingo","divisoria","jeep",8],
["fti","signal_village","jeep",5],["fti","sucat","jeep",8],["fti","pasay_rtda","jeep",10],["fti","baclaan","jeep",12],["signal_village","pasay_rtda","jeep",8],["nichols","pasay_rtda","jeep",5],["nichols","baclaan","jeep",6],["nichols","fti","jeep",4],
["malabon","navotas","jeep",5],["malabon","monumento","jeep",8],["navotas","monumento","jeep",8],["navotas","divisoria","jeep",10],["navotas","baclaan","jeep",12],
["valenzuela","monumento","jeep",10],["valenzuela","malinta","jeep",5],["malinta","monumento","jeep",8],["malinta","karuhatan","jeep",4],["karuhatan","monumento","jeep",7],["karuhatan","divisoria","jeep",11],
["marikina_tp","cubao","jeep",10],["marikina_tp","santolan","jeep",5],["marikina_tp","pasig_tp","jeep",10],["marikina_tp","antipolo","jeep",8],["marikina_tp","san_mateo","jeep",7],["marikina_tp","montalban","jeep",10],
["antipolo","cubao","jeep",15],["antipolo","edsa_shaw","jeep",10],["antipolo","pasig_tp","jeep",10],["antipolo","marikina_tp","jeep",8],["antipolo","cainta","jeep",6],["taytay","pasig_tp","jeep",8],["taytay","edsa_shaw","jeep",7],["taytay","cubao","jeep",12],["cainta","cubao","jeep",10],["cainta","ortigas","jeep",6],["cainta","pasig_tp","jeep",7],["angono","edsa_shaw","jeep",9],["angono","pasig_tp","jeep",10],["angono","cubao","jeep",12],["binangonan","edsa_shaw","jeep",12],["san_mateo","cubao","jeep",12],["montalban","cubao","jeep",15],
["lagro","fairview","jeep",3],["lagro","north","jeep",8],["fairview","north","jeep",7],["fairview","cubao","jeep",12],["fairview","novaliches","jeep",6],
["boni","rtu","walk",1,0],["boni","parklea","tricycle",1.2],["parklea","rtu","tricycle",1.5],["boni","shaw","mrt3",2,13],["boni","guadalupe","mrt3",2,13],["boni","mandaluyong_cityhall","jeep",3],
["pasig_sandoval","shaw","jeep",4.5],["pasig_sandoval","ortigas","jeep",3],["pasig_ortigas_raymundo","shaw_crossing","jeep",6.5],["pasig_ortigas_raymundo","ortigas","jeep",2.5],["pasig_caruncho","shaw_crossing","jeep",5.5],["pasig_caruncho","ortigas","jeep",4],["pasig_rosales","makati_sanjose","jeep",8],["pasig_rosales","pateros","jeep",4],["one_ayala","makati","walk",1,0],
["lifehomes","pasig_palengke","jeep",3.5],["pasig_palengke","ususan","jeep",6],["pasig_palengke","pasig_tp","jeep",1.5],["pasig_palengke","pasig_caruncho","jeep",2],["pasig_palengke","pateros","jeep",5],["pasig_palengke","tagig_tp","jeep",6],
["ususan","tagig_tp","jeep",3],["ususan","bicutan","jeep",4],["ususan","upper_bicutan","jeep",3],["ususan","western_bicutan","jeep",5],["ususan","lower_bicutan","jeep",4],["ususan","fti_taguig","jeep",5],["ususan","tipas","jeep",3],
["tagig_tp","bicutan","jeep",3],["tagig_tp","pateros","jeep",4],["tagig_tp","tipas","jeep",3],["bicutan","upper_bicutan","jeep",2],["bicutan","lower_bicutan","jeep",2],["upper_bicutan","western_bicutan","jeep",3],["lower_bicutan","western_bicutan","jeep",3],["western_bicutan","fti_taguig","jeep",3],["tipas","pateros","jeep",2],["tipas","pasig_palengke","jeep",4],
["karuhatan","bagbaguin","jeep",4],["karuhatan","mapulang_lupa","jeep",4],["karuhatan","paso_de_blas","jeep",5],["karuhatan","punturin","jeep",6],["karuhatan","lawang_bato","jeep",8],["bagbaguin","malinta","jeep",4],["bagbaguin","paso_de_blas","jeep",4],["punturin","lawang_bato","jeep",3],["punturin","paso_de_blas","jeep",3],
["monumento","sangandaan","jeep",6],["sangandaan","bagong_barrio","jeep",4],["bagong_barrio","balintawak","jeep",3],["balintawak","monumento","jeep",7],["sangandaan","divisoria","jeep",9],
["sta_cruz","libertad","jeep",6],["libertad","paco","jeep",5],["libertad","tm_kalaw","jeep",6],["libertad","pier_south","jeep",7],["paco","pier_south","jeep",6],["paco","tm_kalaw","jeep",4],
["mandaluyong_cityhall","pasig_palengke","jeep",8],["mandaluyong_cityhall","pasig_caruncho","jeep",7],["mandaluyong_mayflower","pasig_caruncho","jeep",7],["boni","pasig_caruncho","jeep",8],["cubao","mandaluyong_cityhall","jeep",10],["cubao","pasig_palengke","jeep",12],["bicutan","tagig_tp","jeep",4],["bicutan","pateros","jeep",5],["fti_taguig","pateros","jeep",5]
];

E.forEach(e => {
  if (e.length === 4) {
    const mode = e[2], km = parseFloat(e[3]);
    let fare = 0;
    if (mode === "jeep") fare = calcJeepFare(km);
    else if (mode === "tricycle") fare = calcTricycleFare(km);
    if (mode === "jeep" || mode === "tricycle") {
      e[4] = fare;
      e[3] = Math.round(km * 2.5);
    }
  }
});

const ADJ={};
E.forEach(e=>{(ADJ[e[0]]??=[]).push({to:e[1],e});(ADJ[e[1]]??=[]).push({to:e[0],e})});

const HubsKeys = Hubs.map(h=>h[0]);
for(const k in P){
  if(k.startsWith("brgy_")){
    const [lat,lon]=C[k];
    let best=HubsKeys[0], minDist=Infinity;
    HubsKeys.forEach(h=>{
      const dist=Math.hypot(C[h][0]-lat, C[h][1]-lon);
      if(dist<minDist){minDist=dist; best=h;}
    });
    E.push([k, best, "walk", Math.round(minDist*111), 0]);
    (ADJ[k]??=[]).push({to:best,e:E[E.length-1]});
    (ADJ[best]??=[]).push({to:k,e:E[E.length-1]});
  }
}

const $=s=>document.querySelector(s);
let disc=false,rush=false,cur=null,LANG=localStorage.getItem("sg_lang")||"fil";
const rail=m=>["mrt3","lrt1","lrt2","carousel"].includes(m);

function setupSearch(inputId, resId, hiddenId) {
  const input = $("#"+inputId), res = $("#"+resId), hidden = $("#"+hiddenId);
  let activeIndex = -1;

  const renderList = (query) => {
    res.innerHTML = "";
    activeIndex = -1;
    
    let matches = [];
    const q = query.trim().toLowerCase();
    
    if (q.length > 0) {
      matches = SearchData.filter(d => 
        d.name.toLowerCase().includes(q) || d.city.toLowerCase().includes(q)
      ).slice(0, 20);
    } else {
      const defaults = ["lifehomes","ususan","rtu","pasig_palengke","pitx","cubao","baclaan","north"];
      matches = SearchData.filter(d => defaults.includes(d.id));
    }

    if(matches.length === 0) {
      res.innerHTML = `<div class="search-item" style="color:var(--mut);cursor:default">Walang nahanap na lugar...</div>`;
      res.classList.add("on");
      return;
    }

    matches.forEach((m, i) => {
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `${m.name} <small>${m.city}</small>`;
      div.onclick = (e) => {
        e.stopPropagation();
        input.value = m.name + ", " + m.city;
        hidden.value = m.id;
        res.classList.remove("on");
        redo();
      };
      res.appendChild(div);
    });
    res.classList.add("on");
  };

  input.addEventListener("focus", () => {
    renderList(input.value);
    if (input.value) input.select();
  });

  input.addEventListener("input", () => {
    renderList(input.value);
  });

  input.addEventListener("keydown", (e) => {
    const items = res.querySelectorAll(".search-item");
    if (!items.length || !res.classList.contains("on")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      items.forEach((it, i) => it.classList.toggle("sel", i === activeIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle("sel", i === activeIndex));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    } else if (e.key === "Escape") {
      res.classList.remove("on");
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !res.contains(e.target)) {
      res.classList.remove("on");
    }
  });

  input.value = "";
  input.placeholder = LANG === "en" ? "Search place..." : "Mag-search ng lugar...";
  hidden.value = "";
}

setupSearch("from", "from-res", "from-val");
setupSearch("to", "to-res", "to-val");

/* ============ I18N ============ */
const I18N={
 fil:{
  heroH1:"Para po!<br>Saan ka pupunta?",heroP:"Planuhin ang byahe mo sa Metro Manila gamit ang jeep, bus, MRT, LRT at lakad. May malinaw na steps, tantiyang pamasahe at oras.",
  lf:"Saan ka galing?",lt:"Saan ka pupunta?",lgo:"HANAPIN ANG BYAHE →",start:"Pasok na lang sa dashboard ›",start2:"PASOK SA DASHBOARD →",
  how:"Paano gumagana?",s1:"Step 1",s1b:"Piliin ang simula at destinasyon",s1p:"Pumili ng lugar sa Metro Manila, tapos pindutin ang Hanapin.",
  s2:"Step 2",s2b:"Ihambing ang mga ruta",s2p:"Pinakamabilis, pinakamura, o pinakakaunting transfer. Ikaw ang bahala.",
  s3:"Step 3",s3b:"Sundan ang Biyahe Guide",s3p:"Isa-isang steps na may live na mapa, transfer points at pamasahe.",
  scope:"Sakop ang buong Metro Manila",daily:"Para sa araw-araw na commuter",f1:"Oras at pamasahe",f2:"Transfer points",f3:"Saved na ruta",f4:"Live na mapa",
  foot:"Estimate lang ang oras at pamasahe. Built-in na datos para sa Metro Manila.",tagline:"Para sa bawat commuter, \"Para po!\"",
  from:"Saan ka galing?",to:"Saan ka pupunta?",dep:"Anong oras aalis?",disc:"Student / PWD / Senior",rush:"Rush hour",loc:"Nasaan ako?",go:"HANAPIN ANG BYAHE",
  savedH:"Paboritong Ruta",faresH:"Pamasahe Guide",fareVeh:"Sakyan",fareEst:"Tantiya",
  truth:"<b>Katotohanan:</b> Ang Jeepney at Tricycle fares ay kinukuwenta base sa official LTFRB formula (base + per km) at sa fixed local rates. I-verify pa rin ang signboard.",
  fareNote:"Estimate lang ito para sa pagpaplano. Iba-iba ang aktuwal na pamasahe depende sa layo at operator.",
  tipsH:"Commuter Tips",tips:"• Maghanda ng barya at Beep card.<br>• Iwasan ang 7–9 AM at 5–8 PM kung kaya.<br>• Bantayan ang gamit sa siksikan.<br>• Sabihing \"Para po!\" nang maaga.",
  nav1:"Magplano",nav2:"Saved",nav3:"Pamasahe",chooseRoute:"Pumili ng ruta para buksan ang Biyahe Guide.",alis:"Alis",dating:"dating",transfer:"transfer",
  fastest:"Pinakamabilis",cheapest:"Pinakamura",fewest:"Pinakakaunting transfer",via:"Via ",
  prep:"Maghanda sa ",budget:"budget",sakay:"ang sakay mo papuntang",goStation:"Pumasok sa ",station:" station sa ",tapBeep:", i-tap ang Beep card at sumakay papuntang ",
  carousel:"Pumila sa EDSA Carousel stop sa ",sumakayPapuntang:" at sumakay papuntang ",jeepSign:"Humanap ng jeep sa ",jeepSign2:" na may signboard na \"",jeepSign3:"\". Iabot ang bayad at sabihing \"Para po!\" sa ",
  busGet:"Sumakay ng bus papuntang ",busGet2:" sa ",busGet3:". Sabihin sa konduktor kung saan ka bababa.",min:" min",
  transferWalk:" Bumaba sa ",transferWalk2:" (transfer point) at maglakad ng ~6 min papuntang ",arrived:"Nakarating ka na sa ",arrivedD:"Ingat sa paglakad at sa gamit mo.",
  travelTime:"TRAVEL TIME",pamasahe:"PAMASAHE",transferLbl:"TRANSFER",openGM:"Buksan sa Google Maps ↗",mapTitle:"Live na Mapa ng Byahe",mapTitleHome:"Mapa ng Metro Manila",
  popular:"Mga sikat na byahe",popularNote:"Pindutin para subukan agad, o ilagay ang sarili mong biyahe sa itaas.",tapMsg:"Pindutin ang pinagmumulan, tapos ang pupuntahan.",tapFrom:"Galing: ",tapNext:". Piliin na ang pupuntahan.",
  back:"‹ Mga ruta",save:"I-save",saved:"Saved",next:"Tapos na ang Step ",done:"Tapos na!",step:"Step",sameErr:"Pareho ang pinanggalingan at pupuntahan. Pumili ng ibang lugar.",
  noRoute:"Wala pang ruta para dito sa ngayon. Subukan ang kalapit na istasyon o terminal.",emptyFav:"Wala pang naka-save. Hanapin ang ruta at pindutin ang I-save.",
  viewBtn:"Tingnan",guideTitle:"Biyahe Guide: ",estimate:"Estimate lang ang oras at pamasahe. Built-in na datos ito para sa Metro Manila, hindi live na galing sa Google Maps.",locSearch:"Hinahanap ang location mo...",locNearest:"Pinakamalapit na lugar sa iyo: ",locFail:"Hindi makuha ang location. Paki-allow ang location permission.",locNo:"Hindi supported ang location sa device na ito.",
  people:"lugar sa ",citiesWord:" lungsod at bayan.",
  trafficHigh:"Mabigat ang traffic sa oras na ito (×1.55).",trafficMid:"Katamtaman ang traffic (×1.25).",trafficLow:"Magaan ang traffic (×0.9).",trafficLabel:"Traffic factor"
 },
 en:{
  heroH1:"Beep beep!<br>Where to?",heroP:"Plan your Metro Manila commute using jeepneys, buses, MRT, LRT and walking. Clear steps, estimated fare and time.",
  lf:"Where are you from?",lt:"Where are you going?",lgo:"FIND MY ROUTE →",start:"Go to dashboard ›",start2:"ENTER DASHBOARD →",how:"How it works",s1:"Step 1",s1b:"Pick start and destination",s1p:"Choose a place in Metro Manila, then tap Find.",s2:"Step 2",s2b:"Compare routes",s2p:"Fastest, cheapest, or fewest transfers. You decide.",
  s3:"Step 3",s3b:"Follow the Trip Guide",s3p:"Step-by-step with live map, transfer points and fare.",scope:"Covers all of Metro Manila",daily:"For the everyday commuter",f1:"Time and fare",f2:"Transfer points",f3:"Saved routes",f4:"Live map",
  foot:"Time and fare are estimates. Built-in data for Metro Manila.",tagline:"For every commuter, \"Para po!\"",from:"Where are you from?",to:"Where are you going?",dep:"What time do you leave?",disc:"Student / PWD / Senior",rush:"Rush hour",loc:"Where am I?",go:"FIND MY ROUTE",
  savedH:"Favorite Routes",faresH:"Fare Guide",fareVeh:"Ride",fareEst:"Estimate",truth:"<b>Fact:</b> Jeepney and Tricycle fares are calculated using the LTFRB formula (base + per km) and fixed local rates. Verify the signboard.",fareNote:"These are planning estimates. Actual fares vary by distance and operator.",tipsH:"Commuter Tips",tips:"• Prepare coins and a Beep card.<br>• Avoid 7–9 AM and 5–8 PM if you can.<br>• Watch your belongings in crowded rides.<br>• Say \"Para po!\" early.",
  nav1:"Plan",nav2:"Saved",nav3:"Fares",chooseRoute:"Choose a route to open the Trip Guide.",alis:"Leave",dating:"arrive",transfer:"transfer",fastest:"Fastest",cheapest:"Cheapest",fewest:"Fewest transfers",via:"Via ",
  prep:"Get ready at ",budget:"budget",sakay:"rides to reach",goStation:"Enter ",station:" station at ",tapBeep:", tap your Beep card and ride toward ",carousel:"Line up at the EDSA Carousel stop at ",sumakayPapuntang:" and ride toward ",
  jeepSign:"Look for a jeepney at ",jeepSign2:" with signboard \"",jeepSign3:"\". Pay and say \"Para po!\" at ",busGet:"Ride a bus to ",busGet2:" from ",busGet3:". Tell the conductor where to drop you.",min:" min",transferWalk:" Get off at ",transferWalk2:" (transfer point) and walk ~6 min to ",arrived:"You have arrived at ",arrivedD:"Stay safe and watch your belongings.",
  travelTime:"TRAVEL TIME",pamasahe:"FARE",transferLbl:"TRANSFER",openGM:"Open in Google Maps ↗",mapTitle:"Live Trip Map",mapTitleHome:"Metro Manila Map",popular:"Popular routes",popularNote:"Tap to try instantly, or enter your own trip above.",tapMsg:"Tap the origin, then the destination.",tapFrom:"From: ",tapNext:". Now pick the destination.",
  back:"‹ Routes",save:"Save",saved:"Saved",next:"Step Done ",done:"All Done!",step:"Step",sameErr:"Start and destination are the same. Pick a different place.",noRoute:"No route found yet. Try a nearby station or terminal.",emptyFav:"Nothing saved yet. Find a route and tap Save.",
  viewBtn:"View",guideTitle:"Trip Guide: ",estimate:"Time and fare are estimates. Built-in data for Metro Manila, not live from Google Maps.",locSearch:"Finding your location...",locNearest:"Nearest place to you: ",locFail:"Cannot get location. Please allow location permission.",locNo:"Location not supported on this device.",
  people:" places across ",citiesWord:" cities and municipalities.",
  trafficHigh:"Heavy traffic at this hour (×1.55).",trafficMid:"Moderate traffic (×1.25).",trafficLow:"Light traffic (×0.9).",trafficLabel:"Traffic factor"
 }
};
const T=k=>I18N[LANG][k]||I18N.fil[k]||k;

function applyLang(){
 document.documentElement.lang=LANG==="en"?"en":"fil";
 document.querySelectorAll(".lang button").forEach(b=>b.classList.toggle("on",b.dataset.lang===LANG));
 
 $("#from").placeholder = LANG === "en" ? "Search place..." : "Mag-search ng lugar...";
 $("#to").placeholder = LANG === "en" ? "Search place..." : "Mag-search ng lugar...";

 $("#t-hero-h1").innerHTML=T("heroH1");$("#t-hero-p").textContent=T("heroP");$("#t-lf").textContent=T("lf");$("#t-lt").textContent=T("lt");
 $("#t-lgo").textContent=T("lgo");$("#t-start").textContent=T("start");$("#t-start2").textContent=T("start2");$("#t-how").textContent=T("how");
 $("#t-s1").textContent=T("s1");$("#t-s1b").textContent=T("s1b");$("#t-s1p").textContent=T("s1p");$("#t-s2").textContent=T("s2");
 $("#t-s2b").textContent=T("s2b");$("#t-s2p").textContent=T("s2p");$("#t-s3").textContent=T("s3");$("#t-s3b").textContent=T("s3b");$("#t-s3p").textContent=T("s3p");
 $("#t-scope").textContent=T("scope");$("#t-daily").textContent=T("daily");$("#t-f1").textContent=T("f1");$("#t-f2").textContent=T("f2");$("#t-f3").textContent=T("f3");$("#t-f4").textContent=T("f4");
 $("#t-foot").textContent=T("foot");$("#t-tagline").textContent=T("tagline");$("#t-from").textContent=T("from");$("#t-to").textContent=T("to");$("#t-dep").textContent=T("dep");
 $("#t-disc").textContent=T("disc");$("#t-rush").textContent=T("rush");$("#t-loc").textContent=T("loc");$("#t-go").textContent=T("go");$("#t-saved-h").textContent=T("savedH");
 $("#t-fares-h").textContent=T("faresH");$("#t-fare-veh").textContent=T("fareVeh");$("#t-fare-est").textContent=T("fareEst");$("#t-truth").innerHTML=T("truth");
 $("#t-fare-note").textContent=T("fareNote");$("#t-tips-h").textContent=T("tipsH");$("#t-tips").innerHTML=T("tips");$("#t-nav1").textContent=T("nav1");$("#t-nav2").textContent=T("nav2");$("#t-nav3").textContent=T("nav3");
 
 drawFavs();
 if($("#results").innerHTML)render();
 if(searched&&view==="guide"&&curR)openGuideLast();
}
let lastGuideIdx=0;function openGuideLast(){if(RS[lastGuideIdx])openGuide(lastGuideIdx)}
document.querySelectorAll(".lang button").forEach(b=>b.onclick=()=>{LANG=b.dataset.lang;localStorage.setItem("sg_lang",LANG);applyLang()});

/* ============ BUILD & FIND LOGIC ============ */
function build(path){
 let legs=[];
 path.forEach(s=>{
  const m=s.e[2],l=legs[legs.length-1];
  if(l&&l.m===m&&rail(m)){l.to=s.to;l.min+=s.e[3];l.fare+=s.e[4]*.7;l.nodes.push(s.to)}
  else legs.push({m,from:s.from,to:s.to,min:s.e[3],fare:s.e[4],nodes:[s.from,s.to]});
 });
 legs.forEach(l=>l.fare=Math.round(l.fare));
 if(legs.length>2){
  legs = legs.filter((l,i)=>{
    if(l.m==="walk" && i>0 && i<legs.length-1){
      const prev=legs[i-1], next=legs[i+1];
      if(prev && next && prev.m!=="walk" && next.m!=="walk") return false;
    }
    return true;
  });
 }
 return legs;
}

function dijkstraFrom(a,b,costFn){
 const dist={},prev={},visited=new Set();
 for(const k in P)dist[k]=Infinity;dist[a]=0;const pq=[[0,a]];
 while(pq.length){
  pq.sort((x,y)=>x[0]-y[0]);const[d,n]=pq.shift();
  if(visited.has(n))continue;visited.add(n);if(n===b)break;
  for(const x of ADJ[n]||[]){const nd=d+costFn(x.e);if(nd<dist[x.to]){dist[x.to]=nd;prev[x.to]={from:n,e:x.e};pq.push([nd,x.to])}}
 }
 if(dist[b]===Infinity)return null;
 const path=[];let c=b;while(prev[c]){path.unshift({from:prev[c].from,to:c,e:prev[c].e});c=prev[c].from}return path;
}

function find(a,b,depMinutes){
 const fastestJeep = dijkstraFrom(a,b,e=>{
   const isRail = rail(e[2]);
   return isRail ? e[3] * 1.3 : e[3];
 });
 const cheapestJeep = dijkstraFrom(a,b,e=>{
   const isRail = rail(e[2]);
   return isRail ? e[4] * 1.2 : e[4];
 });
 const fewestTransfers = dijkstraFrom(a,b,e=>{
   const isRail = rail(e[2]);
   const isJeep = e[2]==="jeep";
   return isJeep ? 0.5 : (isRail ? 1.5 : 1);
 });

 const assemble=(path)=>{
  if(!path)return null;const legs=build(path);let min=legs.reduce((s,l)=>s+l.min,0)+(legs.length-1)*6;
  let fare=legs.reduce((s,l)=>s+l.fare,0);if(disc)fare=Math.round(fare*.8);
  const route = {legs,min,fare,x:legs.length-1,path,sig:legs.map(l=>l.m+l.to).join()};
  return applyTrafficToRoute(route, depMinutes);
 };
 const results=[],seen=new Set();const add=(path,tag)=>{const r=assemble(path);if(!r||seen.has(r.sig))return;seen.add(r.sig);results.push({r,tags:[tag]})};
 add(fastestJeep,T("fastest"));add(cheapestJeep,T("cheapest"));add(fewestTransfers,T("fewest"));
 if(results.length<2){
  const hubs=["north","cubao","ortigas","makati","taft","recto","monumento","pitx","shaw","boni","alabang","divisoria","quiapo","blumentritt","pasig_tp","edsa_shaw","mandaluyong_cityhall","pasig_palengke","ususan"];
  for(const h of hubs){
   if(h===a||h===b)continue;const l1=dijkstraFrom(a,h,e=>e[3]),l2=dijkstraFrom(h,b,e=>e[3]);
   if(l1&&l2){const merged=[...l1,...l2];const r=assemble(merged);if(r&&!seen.has(r.sig)){seen.add(r.sig);results.push({r,tags:[T("via")+P[h]]})}}
  }
 }
 results.sort((a,b)=>a.r.min - b.r.min);
 return results;
}

const hm=m=>m>=60?`${Math.floor(m/60)}h ${m%60}m`:`${m} min`;
const key=(a,b)=>a+">"+b;
const pad=n=>String(n).padStart(2,"0");
const fmt=m=>{m=(Math.round(m)%1440+1440)%1440;const h=Math.floor(m/60);return`${h%12||12}:${pad(m%60)} ${h<12?"AM":"PM"}`};
const t0=()=>{const v=($("#dep").value||"08:00").split(":");return+v[0]*60+ +v[1]};
const autoRush=()=>{const h=t0()/60;rush=(h>=7&&h<9)||(h>=17&&h<20);$("#rush").setAttribute("aria-pressed",rush)};

function favs(){try{return JSON.parse(localStorage.getItem("sg_fav")||"[]")}catch(e){return[]}}
function saveFavs(f){try{localStorage.setItem("sg_fav",JSON.stringify(f))}catch(e){}}
let mem=null;const getF=()=>mem??(mem=favs());
function drawFavs(){
 const f=getF(),box=$("#favs");
 box.innerHTML=f.length?f.map(k=>{const[a,b]=k.split(">");return`<div class="saved"><b>${P[a]} → ${P[b]}</b><span><button class="fav" data-o="${k}">${T("viewBtn")}</button> <button class="fav" data-d="${k}" aria-label="Remove">✕</button></span></div>`}).join(""):'<div class="empty">'+T("emptyFav")+'</div>';
 box.querySelectorAll("[data-o]").forEach(x=>x.onclick=()=>{const[a,b]=x.dataset.o.split(">");$("#from").value=P[a];$("#from-val").value=a;$("#to").value=P[b];$("#to-val").value=b;tab("plan");render()});
 box.querySelectorAll("[data-d]").forEach(x=>x.onclick=()=>{mem=getF().filter(z=>z!==x.dataset.d);saveFavs(mem);drawFavs();if(searched)render()})}

function tab(t){document.querySelectorAll(".panel").forEach(p=>p.classList.toggle("on",p.id===t));document.querySelectorAll("nav button").forEach(b=>b.setAttribute("aria-selected",b.dataset.t===t));scrollTo(0,0)}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>tab(b.dataset.t));

let view="list",sn=0,gsteps=[],ctx={},searched=false,legK=[],curR=null,arrive=0,pendingGo=false,RS=[],raf=0,me=null;

function render(){
 view="list";searched=true;cancelAnimationFrame(raf);$("#formcard").hidden=false;
 const a=$("#from-val").value, b=$("#to-val").value;
 const box=$("#results");ctx={a,b};
 if(!a || !b){box.innerHTML='<div class="card empty">Pumili muna ng simula at destinasyon.</div>';return}
 if(a===b){box.innerHTML='<div class="card empty">'+T("sameErr")+'</div>';return}
 const depM = t0();
 const rs=find(a,b,depM);
 if(!rs.length){box.innerHTML='<div class="card empty">'+T("noRoute")+'</div>';return}
 RS=rs;
 const firstTraffic = rs[0].r.trafficMultiplier;
 const trafficNote = firstTraffic >= 1.5 ? T("trafficHigh") : firstTraffic >= 1.2 ? T("trafficMid") : T("trafficLow");
 box.innerHTML=`<h2>${P[a]} → ${P[b]}</h2><p class="note" style="margin-bottom:8px">${T("alis")} ${fmt(depM)}. ${T("chooseRoute")}</p><p class="note" style="margin-bottom:20px;color:var(--r);font-weight:800">${trafficNote}</p>`+rs.map(({r,tags},i)=>`<button class="rc" data-i="${i}">${tags.map(t=>`<span class="tag">${t}</span>`).join("")}<div class="big"><b>${hm(r.min)}</b><b>₱${r.fare}</b><small>${T("dating")} ${fmt(depM+r.min)}</small></div><div class="bar">${r.legs.map(l=>`<i style="flex:${l.min};background:${M[l.m].c}"></i>`).join("")}</div><div>${r.legs.map(l=>`<span class="mc" style="--c:${M[l.m].c}">${M[l.m].i} ${M[l.m].n}</span>`).join("")}</div><span class="go2">${r.x} ${T("transfer")} · ${LANG==="en"?"Open guide ›":"Buksan ang guide ›"}</span></button>`).join("")+'<p class="note" style="margin-top:20px">'+T("estimate")+'</p>';
 box.querySelectorAll(".rc").forEach(c=>c.onclick=()=>openGuide(+c.dataset.i))}

const ORD={mrt3:["north","cubao","ortigas","makati","taft"],lrt1:["monumento","recto","taft","baclaan","pitx"],lrt2:["recto","cubao","santolan","marikina"],carousel:["monumento","north","makati","taft","pitx"]};
const ENDS={mrt3:["North Avenue","Taft Avenue"],lrt1:["Fernando Poe Jr.","PITX"],lrt2:["Recto","Antipolo"],carousel:["Monumento","PITX"]};
const dirOf=l=>{const o=ORD[l.m];if(!o)return P[l.to];return ENDS[l.m][o.indexOf(l.to)>o.indexOf(l.from)?1:0]};

function stepsFor(r,a,b,depM){
 const total=r.legs.reduce((s,l)=>s+l.min,0)+6*r.x,f=total?r.min/total:1;let t=depM;
 const S=[{i:iconSvg.bus,c:"#ffc400",n:a,at:t,t:`${T("prep")}${P[a]}`,d:`${T("alis")} ${fmt(t)}. ${LANG==="en"?"Prepare coins or Beep card":"Ihanda ang barya o Beep card"} (${T("budget")} ₱${r.fare}). ${r.legs.length} ${T("sakay")} ${P[b]}.`}];
 r.legs.forEach((l,k)=>{
  const m=M[l.m],nx=r.legs[k+1],dur=Math.round(l.min*f);
  let how;
  if(rail(l.m)){ how=l.m==="carousel"?`${T("carousel")}${P[l.from]}${T("sumakayPapuntang")}${dirOf(l)}.`:`${T("goStation")}${m.n}${T("station")}${P[l.from]}${T("tapBeep")}${dirOf(l)}.`; }
  else if(l.m==="jeep"){ how=`${T("jeepSign")}${P[l.from]}${T("jeepSign2")}${P[l.to]}${T("jeepSign3")}${P[l.to]}.`; }
  else if(l.m==="tricycle"){ how=(LANG==="en"?"Look for a tricycle at ":"Humanap ng tricycle sa ")+P[l.from]+(LANG==="en"?" going to ":" papuntang ")+P[l.to]+"."; }
  else if(l.m==="walk"){ how=(LANG==="en"?"Walk towards ":"Maglakad papuntang ")+P[l.to]+"."; }
  else { how=`${T("busGet")}${P[l.to]}${T("busGet2")}${P[l.from]}${T("busGet3")}`; }
  let mid="";
  if(rail(l.m)&&l.nodes&&l.nodes.length>2){ mid=(LANG==="en"?" Stops: ":" Dadaan sa ")+l.nodes.slice(1,-1).join(", ")+"."; }
  const transferTxt=nx?`${T("transferWalk")}${P[l.to]}${T("transferWalk2")}${M[nx.m].n}.`:"";
  S.push({i:m.i,c:m.c,k,at:t,t:`${m.n}: ${P[l.from]} → ${P[l.to]}`,d:`${how}${mid} ~${dur}${T("min")} · ₱${l.fare}.${transferTxt}`});
  t+=dur+(nx?Math.round(6*f):0)
 });
 arrive=t;
 S.push({i:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,c:"#d62828",n:b,at:t,t:`${T("arrived")}${P[b]}!`,d:T("arrivedD")});
 return S;
}

function openGuide(i){
 const{r,tags}=RS[i],{a,b}=ctx;view="guide";sn=0;curR=r;lastGuideIdx=i;$("#formcard").hidden=true;
 const L=[];r.path.forEach((s,k)=>{const m=s.e[2],z=L[L.length-1];if(z&&z.m===m&&rail(m))z.k.push(k);else L.push({m,k:[k]})});legK=L.map(z=>z.k);
 const depM = t0();
 gsteps=stepsFor(r,a,b,depM);const on=getF().includes(key(a,b));
 $("#results").innerHTML=`<div class="gtop"><button class="fav" id="back">${T("back")}</button><button class="fav ${on?"on":""}" id="fav">${on?T("saved"):T("save")}</button></div><h2>${T("guideTitle")}${P[a]} → ${P[b]}</h2><div>${tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div><p class="eta">${T("alis")} ${fmt(depM)} → ${T("dating")} ~${fmt(arrive)}</p><div class="sum"><div><b>${hm(r.min)}</b><span>${T("travelTime")}</span></div><div><b>₱${r.fare}</b><span>${T("pamasahe")}</span></div><div><b>${r.x}</b><span>${T("transferLbl")}</span></div></div><div class="card" id="mapcard" style="padding:0;overflow:hidden"></div><div class="card"><div class="prog"><i id="pg"></i></div><ol class="gs" id="gs"></ol></div><div class="gnav"><button class="fav" id="prev" aria-label="Previous step">‹</button><button class="go" id="nx"></button></div>`;
 drawMap(r);paint();scrollTo(0,0);
 $("#back").onclick=()=>{render();scrollTo(0,0)};
 $("#fav").onclick=e=>{const k=key(a,b);let f=getF();f=f.includes(k)?f.filter(x=>x!==k):[k,...f];mem=f;saveFavs(f);drawFavs();const o=f.includes(k);e.target.className="fav"+(o?" on":"");e.target.textContent=o?T("saved"):T("save")};
 $("#prev").onclick=()=>{sn--;paint()};
 $("#nx").onclick=()=>{if(sn===gsteps.length-1){render();scrollTo(0,0);return}sn++;paint()}}

function paint(){
 const n=gsteps.length;$("#pg").style.width=sn/(n-1)*100+"%";
 $("#gs").innerHTML=gsteps.map((s,k)=>`<li class="${k<sn?"done":k===sn?"cur":""}"><div class="ic" style="--c:${s.c}">${k<sn?"✓":s.i}</div><div class="gb"><span class="sn">${T("step")} ${k+1} · ${fmt(s.at)}</span><b>${s.t}</b><small>${s.d}</small></div></li>`).join("");
 $("#nx").textContent=sn===n-1?T("done"):`${T("next")}${sn+1} ✓`;$("#prev").disabled=sn===0;
 const c=$("#gs .cur");c&&c.scrollIntoView({block:"nearest",behavior:"smooth"})}

function drawMap(r){
 const a=r.path[0].from,b=r.path[r.path.length-1].to;
 const sAddr=encodeURIComponent(P[a]+", Metro Manila"),dAddr=encodeURIComponent(P[b]+", Metro Manila");
 $("#mapcard").innerHTML=`
  <div style="padding:16px 16px 0"><div class="top"><h2 style="margin:0;font-size:18px">${T("mapTitle")}</h2><span class="live"><i></i>LIVE</span></div></div>
  <div class="map-container" style="margin:12px;border-radius:12px;height:200px">
   <iframe src="https://maps.google.com/maps?saddr=${sAddr}&daddr=${dAddr}&output=embed" allowfullscreen loading="lazy"></iframe>
  </div>
  <div style="padding:0 16px 16px;text-align:center"><a class="chip gm" style="font-size:13px;display:inline-flex;align-items:center;gap:6px" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&travelmode=transit&origin=${sAddr}&destination=${dAddr}">${T("openGM")}</a></div>`;
}

const POP=[["lifehomes","ususan"],["lifehomes","rtu"],["monumento","bgc"],["rosario","naia"],["valenzuela","makati"]];

function home(){view="list";searched=false;tapA=null;cancelAnimationFrame(raf);$("#formcard").hidden=false;
 $("#from").value=""; $("#from-val").value="";
 $("#to").value=""; $("#to-val").value="";

 $("#results").innerHTML=`<div class="card"><h2>${T("popular")}</h2><p class="note">${T("popularNote")}</p>${POP.map(([a,b],i)=>`<button class="pop" data-i="${i}"><span>${P[a]}</span><i>→</i><span>${P[b]}</span></button>`).join("")}</div>`;
 document.querySelectorAll(".pop").forEach(x=>x.onclick=()=>{
   const[a,b]=POP[+x.dataset.i];
   $("#from").value=P[a];$("#from-val").value=a;
   $("#to").value=P[b];$("#to-val").value=b;
   render();
 })}

function route(){const app=location.hash==="#dashboard";$("#landing").hidden=app;$("#app").hidden=!app;scrollTo(0,0);if(app&&pendingGo){pendingGo=false;render()}}
addEventListener("hashchange",route);
$("#start").onclick=$("#start2").onclick=()=>{location.hash="dashboard"};
$("#home").onclick=()=>{location.hash=""};

const redo=()=>{if(view==="list"&&searched)render()};
$("#go").onclick=render;
$("#disc").onclick=e=>{disc=!disc;e.currentTarget.setAttribute("aria-pressed",disc);redo()};
$("#rush").onclick=e=>{rush=!rush;e.currentTarget.setAttribute("aria-pressed",rush);redo()};
$("#swap").onclick=()=>{
  const a=$("#from-val").value, b=$("#to-val").value;
  const aTxt=$("#from").value, bTxt=$("#to").value;
  $("#from-val").value=b; $("#from").value=bTxt;
  $("#to-val").value=a; $("#to").value=aTxt;
  redo();
};
$("#dep").onchange=()=>{autoRush();redo()};
{const d=new Date();$("#dep").value=pad(d.getHours())+":"+pad(d.getMinutes());autoRush()}

$("#loc").onclick=()=>{const m=$("#msg");if(!navigator.geolocation){m.textContent=T("locNo");return}
 m.textContent=T("locSearch");
 navigator.geolocation.getCurrentPosition(p=>{me=[p.coords.latitude,p.coords.longitude];let best,d=1e9;for(const k in C){const q=(C[k][0]-me[0])**2+(C[k][1]-me[1])**2;if(q<d){d=q;best=k}}
  $("#from").value=P[best]; $("#from-val").value=best; m.textContent=T("locNearest")+P[best];render()},()=>{m.textContent=T("locFail")},{timeout:8000})};

$("#cities").innerHTML=CitiesList.map(c=>`<span>${c}</span>`).join("");
$("#ccount").textContent=SearchData.length+T("people")+CitiesList.length+T("citiesWord");
drawFavs();home();route();applyLang();

// ====== SPLASH SCREEN LOADING LOGIC ======
let progress = 0;
const bar = document.getElementById('load-bar');
const percentText = document.getElementById('load-percent');

const interval = setInterval(() => {
  // Random na dagdag para magmukhang natural (5 to 15%)
  progress += Math.floor(Math.random() * 10) + 5;
  
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    
    // Pag 100%, hintayin ng 200ms bago i-hide
    setTimeout(() => {
      document.getElementById('splash').classList.add('hide');
    }, 200);
  }
  
  // I-update ang width at text
  bar.style.width = progress + '%';
  percentText.textContent = progress + '%';
}, 80); // Mabilis lang: 80ms bawat dagdag
