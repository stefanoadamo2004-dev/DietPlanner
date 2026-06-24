import { useState } from "react";
import { Activity, Wallet, MapPin, ChevronRight, Flame, Beef, Wheat, Droplet } from "lucide-react";
 
// --- Database alimenti: kcal/macro per 100g + prezzo per fascia (EUR/kg), raggruppati per categoria ---
// "tags" = parole chiave usate per il riconoscimento del testo libero (nome, sinonimi, categoria allergenica)
const FOODS = [
  // Fonti proteiche — carni bianche
  { id: "petto_pollo", name: "Petto di pollo", cat: "proteina", kcal: 165, p: 31, c: 0, f: 3.6, price: { discount: 6.5, standard: 8.9, premium: 13 }, tags: ["pollo", "carne bianca", "carne"] },
  { id: "coscia_pollo", name: "Coscia di pollo", cat: "proteina", kcal: 184, p: 26, c: 0, f: 8.5, price: { discount: 5, standard: 7, premium: 10 }, tags: ["coscia di pollo", "pollo", "carne bianca", "carne"] },
  { id: "tacchino", name: "Petto di tacchino", cat: "proteina", kcal: 109, p: 24, c: 0, f: 1, price: { discount: 7.5, standard: 9.9, premium: 14 }, tags: ["tacchino", "carne bianca", "carne"] },
  { id: "coniglio", name: "Coniglio", cat: "proteina", kcal: 136, p: 21, c: 0, f: 5.5, price: { discount: 8, standard: 11, premium: 16 }, tags: ["coniglio", "carne bianca", "carne"] },
  { id: "petto_anatra", name: "Petto d'anatra", cat: "proteina", kcal: 135, p: 19, c: 0, f: 6.5, price: { discount: 13, standard: 18, premium: 26 }, tags: ["anatra", "petto d'anatra", "carne"] },
  { id: "quaglia", name: "Quaglia", cat: "proteina", kcal: 134, p: 21, c: 0, f: 5, price: { discount: 15, standard: 21, premium: 30 }, tags: ["quaglia", "carne bianca", "carne"] },
 
  // Fonti proteiche — carni rosse
  { id: "manzo", name: "Manzo magro", cat: "proteina", kcal: 158, p: 26, c: 0, f: 6, price: { discount: 9, standard: 13, premium: 19 }, tags: ["manzo", "carne rossa", "carne", "vitello"] },
  { id: "filetto_manzo", name: "Filetto di manzo", cat: "proteina", kcal: 143, p: 21, c: 0, f: 6, price: { discount: 19, standard: 26, premium: 38 }, tags: ["filetto", "filetto di manzo", "carne rossa", "carne"] },
  { id: "maiale", name: "Lonza di maiale", cat: "proteina", kcal: 143, p: 22, c: 0, f: 6, price: { discount: 7, standard: 10, premium: 15 }, tags: ["maiale", "carne", "carne suina"] },
  { id: "agnello", name: "Agnello", cat: "proteina", kcal: 206, p: 25, c: 0, f: 11, price: { discount: 14, standard: 19, premium: 28 }, tags: ["agnello", "carne rossa", "carne"] },
  { id: "prosciutto_crudo", name: "Prosciutto crudo magro", cat: "proteina", kcal: 145, p: 25, c: 0.3, f: 5, price: { discount: 16, standard: 22, premium: 32 }, tags: ["prosciutto crudo", "prosciutto", "salumi"] },
  { id: "bresaola", name: "Bresaola", cat: "proteina", kcal: 151, p: 32, c: 0.6, f: 2, price: { discount: 22, standard: 30, premium: 42 }, tags: ["bresaola", "salumi"] },
  { id: "vitello", name: "Scaloppine di vitello", cat: "proteina", kcal: 172, p: 27, c: 0, f: 6.5, price: { discount: 13, standard: 18, premium: 26 }, tags: ["vitello", "scaloppine", "carne rossa", "carne"] },
  { id: "cinghiale", name: "Cinghiale", cat: "proteina", kcal: 160, p: 28, c: 0, f: 5, price: { discount: 12, standard: 17, premium: 25 }, tags: ["cinghiale", "carne rossa", "carne"] },
 
  // Fonti proteiche — pesce e crostacei
  { id: "tonno", name: "Tonno al naturale (sgocciolato)", cat: "proteina", kcal: 116, p: 26, c: 0, f: 1, price: { discount: 9, standard: 12, premium: 18 }, tags: ["tonno", "pesce"] },
  { id: "tonno_fresco", name: "Tonno fresco", cat: "proteina", kcal: 144, p: 23, c: 0, f: 5, price: { discount: 16, standard: 22, premium: 32 }, tags: ["tonno fresco", "tonno", "pesce"] },
  { id: "merluzzo", name: "Merluzzo / nasello", cat: "proteina", kcal: 82, p: 18, c: 0, f: 0.7, price: { discount: 10, standard: 14, premium: 20 }, tags: ["merluzzo", "nasello", "pesce"] },
  { id: "salmone", name: "Salmone", cat: "proteina", kcal: 208, p: 20, c: 0, f: 13, price: { discount: 14, standard: 19, premium: 27 }, tags: ["salmone", "pesce"] },
  { id: "branzino", name: "Branzino / orata", cat: "proteina", kcal: 97, p: 18, c: 0, f: 2.5, price: { discount: 13, standard: 18, premium: 26 }, tags: ["branzino", "orata", "pesce"] },
  { id: "sgombro", name: "Sgombro", cat: "proteina", kcal: 205, p: 19, c: 0, f: 14, price: { discount: 8, standard: 11, premium: 16 }, tags: ["sgombro", "pesce"] },
  { id: "sogliola", name: "Sogliola / platessa", cat: "proteina", kcal: 86, p: 17, c: 0, f: 1.5, price: { discount: 14, standard: 19, premium: 28 }, tags: ["sogliola", "platessa", "pesce"] },
  { id: "trota", name: "Trota", cat: "proteina", kcal: 119, p: 20, c: 0, f: 3.5, price: { discount: 11, standard: 15, premium: 22 }, tags: ["trota", "pesce"] },
  { id: "gamberi", name: "Gamberi", cat: "proteina", kcal: 99, p: 21, c: 0.9, f: 1.4, price: { discount: 14, standard: 19, premium: 28 }, tags: ["gamberi", "pesce", "crostacei", "molluschi"] },
  { id: "calamari", name: "Calamari / totani", cat: "proteina", kcal: 92, p: 16, c: 1.5, f: 1.4, price: { discount: 12, standard: 16, premium: 24 }, tags: ["calamari", "totani", "pesce", "molluschi"] },
  { id: "cozze", name: "Cozze / vongole", cat: "proteina", kcal: 86, p: 12, c: 3.4, f: 2, price: { discount: 6, standard: 9, premium: 14 }, tags: ["cozze", "vongole", "molluschi", "pesce"] },
  { id: "polpo", name: "Polpo / seppia", cat: "proteina", kcal: 82, p: 15, c: 2.2, f: 1, price: { discount: 13, standard: 18, premium: 26 }, tags: ["polpo", "seppia", "pesce", "molluschi"] },
  { id: "pesce_spada", name: "Pesce spada", cat: "proteina", kcal: 144, p: 20, c: 0, f: 6.7, price: { discount: 16, standard: 22, premium: 32 }, tags: ["pesce spada", "pesce"] },
  { id: "alici", name: "Alici / sardine", cat: "proteina", kcal: 131, p: 20, c: 0, f: 5, price: { discount: 6, standard: 9, premium: 14 }, tags: ["alici", "sardine", "pesce"] },
  { id: "aringa", name: "Aringa / acciughe", cat: "proteina", kcal: 158, p: 18, c: 0, f: 9, price: { discount: 9, standard: 13, premium: 19 }, tags: ["aringa", "acciughe", "pesce"] },
 
  // Fonti proteiche — vegetali e uova
  { id: "uova", name: "Uova (al pezzo, ~50g)", cat: "proteina", kcal: 78, p: 6.5, c: 0.5, f: 5.5, price: { discount: 0.22, standard: 0.30, premium: 0.45 }, perEgg: true, tags: ["uova", "uovo"] },
  { id: "tofu", name: "Tofu", cat: "proteina", kcal: 76, p: 8, c: 1.9, f: 4.8, price: { discount: 5.5, standard: 7.5, premium: 11 }, tags: ["tofu", "soia"] },
  { id: "tempeh", name: "Tempeh", cat: "proteina", kcal: 192, p: 20, c: 7.6, f: 11, price: { discount: 8, standard: 11, premium: 16 }, tags: ["tempeh", "soia"] },
  { id: "seitan", name: "Seitan", cat: "proteina", kcal: 120, p: 21, c: 4, f: 1.9, price: { discount: 8, standard: 11, premium: 16 }, tags: ["seitan", "glutine"] },
  { id: "lenticchie", name: "Lenticchie secche", cat: "proteina", kcal: 116, p: 9, c: 20, f: 0.4, price: { discount: 2.8, standard: 3.8, premium: 6 }, tags: ["lenticchie", "legumi"] },
  { id: "ceci", name: "Ceci secchi", cat: "proteina", kcal: 120, p: 8, c: 21, f: 1.5, price: { discount: 2.6, standard: 3.6, premium: 5.5 }, tags: ["ceci", "legumi"] },
  { id: "fagioli", name: "Fagioli secchi", cat: "proteina", kcal: 127, p: 8.7, c: 23, f: 0.5, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["fagioli", "legumi"] },
  { id: "fave", name: "Fave secche", cat: "proteina", kcal: 110, p: 7.6, c: 19, f: 0.6, price: { discount: 2.7, standard: 3.7, premium: 5.8 }, tags: ["fave", "legumi"] },
  { id: "piselli", name: "Piselli", cat: "proteina", kcal: 81, p: 5.4, c: 14, f: 0.4, price: { discount: 2.2, standard: 3.2, premium: 5 }, tags: ["piselli", "legumi"] },
  { id: "edamame", name: "Edamame", cat: "proteina", kcal: 121, p: 11, c: 9, f: 5, price: { discount: 8, standard: 11, premium: 16 }, tags: ["edamame", "soia", "legumi"] },
  { id: "lupini", name: "Lupini", cat: "proteina", kcal: 119, p: 16, c: 9, f: 3.4, price: { discount: 6, standard: 8.5, premium: 12 }, tags: ["lupini", "legumi"] },
 
  // Carboidrati
  { id: "riso", name: "Riso", cat: "carbo", kcal: 130, p: 2.7, c: 28, f: 0.3, price: { discount: 1.4, standard: 2.1, premium: 3.5 }, tags: ["riso"] },
  { id: "riso_basmati", name: "Riso basmati", cat: "carbo", kcal: 121, p: 2.5, c: 25, f: 0.4, price: { discount: 2, standard: 2.8, premium: 4.5 }, tags: ["riso basmati", "riso"] },
  { id: "riso_integrale", name: "Riso integrale", cat: "carbo", kcal: 123, p: 2.7, c: 26, f: 1, price: { discount: 2.2, standard: 3, premium: 4.8 }, tags: ["riso integrale", "riso"] },
  { id: "pasta", name: "Pasta", cat: "carbo", kcal: 158, p: 5.8, c: 31, f: 1.3, price: { discount: 1.1, standard: 1.6, premium: 3.2 }, tags: ["pasta", "glutine"] },
  { id: "pasta_integrale", name: "Pasta integrale", cat: "carbo", kcal: 124, p: 5, c: 25, f: 1.1, price: { discount: 1.4, standard: 2, premium: 3.6 }, tags: ["pasta integrale", "pasta", "glutine"] },
  { id: "patate", name: "Patate", cat: "carbo", kcal: 77, p: 2, c: 17, f: 0.1, price: { discount: 1, standard: 1.5, premium: 2.5 }, tags: ["patate"] },
  { id: "patate_dolci", name: "Patate dolci", cat: "carbo", kcal: 86, p: 1.6, c: 20, f: 0.1, price: { discount: 2, standard: 2.8, premium: 4.5 }, tags: ["patate dolci", "patate americane"] },
  { id: "pane_integrale", name: "Pane integrale", cat: "carbo", kcal: 224, p: 9, c: 41, f: 2.5, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["pane", "glutine"] },
  { id: "pane_segale", name: "Pane di segale", cat: "carbo", kcal: 219, p: 7, c: 43, f: 1.6, price: { discount: 3, standard: 4.2, premium: 6.5 }, tags: ["pane di segale", "pane", "glutine"] },
  { id: "avena", name: "Fiocchi d'avena", cat: "carbo", kcal: 389, p: 13, c: 67, f: 7, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["avena", "fiocchi d'avena"] },
  { id: "quinoa", name: "Quinoa", cat: "carbo", kcal: 120, p: 4.4, c: 21, f: 1.9, price: { discount: 6, standard: 8, premium: 12 }, tags: ["quinoa"] },
  { id: "farro", name: "Farro", cat: "carbo", kcal: 127, p: 4.7, c: 26, f: 1, price: { discount: 3, standard: 4, premium: 6 }, tags: ["farro", "glutine"] },
  { id: "orzo", name: "Orzo", cat: "carbo", kcal: 123, p: 4.5, c: 28, f: 0.4, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["orzo", "glutine"] },
  { id: "cous_cous", name: "Cous cous", cat: "carbo", kcal: 112, p: 3.8, c: 23, f: 0.2, price: { discount: 3, standard: 4.2, premium: 6.5 }, tags: ["cous cous", "couscous", "glutine"] },
  { id: "polenta", name: "Polenta", cat: "carbo", kcal: 70, p: 1.7, c: 15, f: 0.4, price: { discount: 1.5, standard: 2.2, premium: 3.5 }, tags: ["polenta"] },
  { id: "grano_saraceno", name: "Grano saraceno", cat: "carbo", kcal: 132, p: 4.7, c: 25, f: 1.2, price: { discount: 5, standard: 7, premium: 11 }, tags: ["grano saraceno"] },
  { id: "pane_di_segale_integrale", name: "Pane multicereali", cat: "carbo", kcal: 230, p: 9.5, c: 42, f: 3, price: { discount: 3.2, standard: 4.5, premium: 7 }, tags: ["pane multicereali", "pane", "glutine"] },
  { id: "crackers_integrali", name: "Crackers integrali", cat: "carbo", kcal: 408, p: 10, c: 67, f: 12, price: { discount: 3, standard: 4.2, premium: 6.5 }, tags: ["crackers", "crackers integrali", "glutine"] },
 
  // Verdure
  { id: "spinaci", name: "Spinaci", cat: "verdura", kcal: 23, p: 2.9, c: 3.6, f: 0.4, price: { discount: 2.5, standard: 3.5, premium: 5 }, tags: ["spinaci"] },
  { id: "zucchine", name: "Zucchine", cat: "verdura", kcal: 17, p: 1.2, c: 3.1, f: 0.3, price: { discount: 1.8, standard: 2.5, premium: 4 }, tags: ["zucchine"] },
  { id: "broccoli", name: "Broccoli", cat: "verdura", kcal: 34, p: 2.8, c: 7, f: 0.4, price: { discount: 2, standard: 3, premium: 4.5 }, tags: ["broccoli"] },
  { id: "cavolfiore", name: "Cavolfiore", cat: "verdura", kcal: 25, p: 1.9, c: 5, f: 0.3, price: { discount: 2, standard: 3, premium: 4.5 }, tags: ["cavolfiore"] },
  { id: "insalata_mista", name: "Insalata mista", cat: "verdura", kcal: 15, p: 1.4, c: 2.9, f: 0.2, price: { discount: 3, standard: 4, premium: 6 }, tags: ["insalata", "lattuga"] },
  { id: "rucola", name: "Rucola", cat: "verdura", kcal: 25, p: 2.6, c: 3.7, f: 0.7, price: { discount: 4, standard: 5.5, premium: 8 }, tags: ["rucola"] },
  { id: "pomodori", name: "Pomodori", cat: "verdura", kcal: 18, p: 0.9, c: 3.9, f: 0.2, price: { discount: 1.8, standard: 2.6, premium: 4 }, tags: ["pomodori", "pomodoro"] },
  { id: "carote", name: "Carote", cat: "verdura", kcal: 41, p: 0.9, c: 10, f: 0.2, price: { discount: 1.2, standard: 1.8, premium: 3 }, tags: ["carote"] },
  { id: "melanzane", name: "Melanzane", cat: "verdura", kcal: 25, p: 1, c: 6, f: 0.2, price: { discount: 1.8, standard: 2.6, premium: 4.2 }, tags: ["melanzane"] },
  { id: "peperoni", name: "Peperoni", cat: "verdura", kcal: 31, p: 1, c: 6, f: 0.3, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["peperoni"] },
  { id: "asparagi", name: "Asparagi", cat: "verdura", kcal: 20, p: 2.2, c: 3.9, f: 0.1, price: { discount: 4, standard: 5.5, premium: 8 }, tags: ["asparagi"] },
  { id: "funghi", name: "Funghi champignon", cat: "verdura", kcal: 22, p: 3.1, c: 3.3, f: 0.3, price: { discount: 3, standard: 4.5, premium: 7 }, tags: ["funghi", "champignon"] },
  { id: "cavolo", name: "Cavolo / verza", cat: "verdura", kcal: 27, p: 1.5, c: 5.8, f: 0.2, price: { discount: 1.5, standard: 2.2, premium: 3.5 }, tags: ["cavolo", "verza"] },
  { id: "finocchi", name: "Finocchi", cat: "verdura", kcal: 16, p: 1.2, c: 3.1, f: 0.2, price: { discount: 1.8, standard: 2.6, premium: 4 }, tags: ["finocchi"] },
  { id: "cetrioli", name: "Cetrioli", cat: "verdura", kcal: 15, p: 0.7, c: 3.6, f: 0.1, price: { discount: 1.6, standard: 2.3, premium: 3.6 }, tags: ["cetrioli"] },
  { id: "cipolle", name: "Cipolle", cat: "verdura", kcal: 40, p: 1.1, c: 9.3, f: 0.1, price: { discount: 1, standard: 1.5, premium: 2.5 }, tags: ["cipolle"] },
  { id: "barbabietole", name: "Barbabietole", cat: "verdura", kcal: 43, p: 1.6, c: 9.6, f: 0.2, price: { discount: 1.8, standard: 2.6, premium: 4 }, tags: ["barbabietole"] },
  { id: "cavoletti_bruxelles", name: "Cavoletti di Bruxelles", cat: "verdura", kcal: 43, p: 3.4, c: 9, f: 0.3, price: { discount: 3, standard: 4.2, premium: 6.5 }, tags: ["cavoletti di bruxelles", "cavoletti"] },
  { id: "radicchio", name: "Radicchio", cat: "verdura", kcal: 23, p: 1.4, c: 4.5, f: 0.2, price: { discount: 2.8, standard: 4, premium: 6 }, tags: ["radicchio"] },
  { id: "bietole", name: "Bietole", cat: "verdura", kcal: 19, p: 1.8, c: 3.7, f: 0.2, price: { discount: 2.2, standard: 3.2, premium: 5 }, tags: ["bietole"] },
  { id: "porri", name: "Porri", cat: "verdura", kcal: 61, p: 1.5, c: 14, f: 0.3, price: { discount: 2.5, standard: 3.5, premium: 5.5 }, tags: ["porri"] },
  { id: "sedano", name: "Sedano", cat: "verdura", kcal: 16, p: 0.7, c: 3, f: 0.2, price: { discount: 1.8, standard: 2.6, premium: 4 }, tags: ["sedano"] },
 
  // Grassi e condimenti
  { id: "olio_oliva", name: "Olio d'oliva", cat: "grasso", kcal: 884, p: 0, c: 0, f: 100, price: { discount: 6, standard: 9, premium: 16 }, tags: ["olio", "olio d'oliva"] },
  { id: "frutta_secca", name: "Mandorle / noci", cat: "grasso", kcal: 600, p: 20, c: 16, f: 52, price: { discount: 9, standard: 13, premium: 19 }, tags: ["mandorle", "noci", "frutta secca", "frutta a guscio"] },
  { id: "nocciole", name: "Nocciole / pistacchi", cat: "grasso", kcal: 628, p: 15, c: 17, f: 58, price: { discount: 12, standard: 17, premium: 25 }, tags: ["nocciole", "pistacchi", "frutta secca", "frutta a guscio"] },
  { id: "avocado", name: "Avocado", cat: "grasso", kcal: 160, p: 2, c: 9, f: 15, price: { discount: 5, standard: 7, premium: 11 }, tags: ["avocado"] },
  { id: "semi_chia", name: "Semi di chia", cat: "grasso", kcal: 486, p: 17, c: 42, f: 31, price: { discount: 14, standard: 19, premium: 27 }, tags: ["semi di chia", "chia"] },
  { id: "semi_lino", name: "Semi di lino / zucca", cat: "grasso", kcal: 534, p: 18, c: 29, f: 42, price: { discount: 10, standard: 14, premium: 21 }, tags: ["semi di lino", "semi di zucca", "semi"] },
  { id: "anacardi", name: "Anacardi", cat: "grasso", kcal: 553, p: 18, c: 30, f: 44, price: { discount: 13, standard: 18, premium: 27 }, tags: ["anacardi", "frutta secca", "frutta a guscio"] },
  { id: "olio_semi_lino", name: "Olio di semi di lino", cat: "grasso", kcal: 884, p: 0, c: 0, f: 100, price: { discount: 12, standard: 17, premium: 25 }, tags: ["olio di semi di lino", "olio di lino"] },
  { id: "burro_arachidi", name: "Burro di arachidi", cat: "grasso", kcal: 588, p: 25, c: 20, f: 50, price: { discount: 8, standard: 11, premium: 16 }, tags: ["burro di arachidi", "arachidi"] },
 
  // Spuntini / fuori pasti
  { id: "yogurt_greco", name: "Yogurt greco 0%", cat: "spuntino", kcal: 59, p: 10, c: 3.6, f: 0.4, price: { discount: 4.5, standard: 6.5, premium: 9 }, tags: ["yogurt", "latticini", "lattosio"] },
  { id: "yogurt_soia", name: "Yogurt di soia", cat: "spuntino", kcal: 64, p: 3.5, c: 4, f: 3, price: { discount: 5, standard: 7, premium: 10 }, tags: ["yogurt di soia", "soia"] },
  { id: "skyr", name: "Skyr", cat: "spuntino", kcal: 63, p: 11, c: 4, f: 0.2, price: { discount: 5, standard: 7, premium: 10 }, tags: ["skyr", "latticini", "lattosio"] },
  { id: "frutta", name: "Frutta (a tua scelta)", cat: "spuntino", kcal: 70, p: 0.6, c: 17, f: 0.2, price: { discount: 1.3, standard: 1.9, premium: 3 }, perPiece: true, tags: ["frutta", "banana", "mela", "arancia", "pera", "pesca", "kiwi", "albicocca", "agrumi"] },
  { id: "frutti_bosco", name: "Frutti di bosco", cat: "spuntino", kcal: 50, p: 0.8, c: 11, f: 0.4, price: { discount: 8, standard: 12, premium: 18 }, tags: ["frutti di bosco", "mirtilli", "lamponi", "fragole"] },
  { id: "fiocchi_latte", name: "Fiocchi di latte / ricotta magra", cat: "spuntino", kcal: 98, p: 12, c: 3.4, f: 4.3, price: { discount: 5, standard: 7, premium: 10 }, tags: ["fiocchi di latte", "ricotta", "latticini", "lattosio"] },
  { id: "barretta_proteica", name: "Barretta proteica", cat: "spuntino", kcal: 380, p: 30, c: 35, f: 12, price: { discount: 25, standard: 32, premium: 45 }, tags: ["barretta proteica", "barretta"] },
  { id: "latte_parzialmente_scremato", name: "Latte parzialmente scremato", cat: "spuntino", kcal: 46, p: 3.4, c: 5, f: 1.5, price: { discount: 1.2, standard: 1.8, premium: 2.8 }, tags: ["latte", "latticini", "lattosio"] },
  { id: "kefir", name: "Kefir", cat: "spuntino", kcal: 55, p: 3.5, c: 4.5, f: 2, price: { discount: 4.5, standard: 6.5, premium: 9.5 }, tags: ["kefir", "latticini", "lattosio"] },
  { id: "uva_passa_datteri", name: "Uva passa / datteri", cat: "spuntino", kcal: 282, p: 2.5, c: 70, f: 0.4, price: { discount: 6, standard: 8.5, premium: 13 }, tags: ["uva passa", "datteri", "frutta secca disidratata"] },
];
 
const FOOD_CATEGORIES = { proteina: "fonte proteica", carbo: "carboidrato", verdura: "verdura", grasso: "grasso/condimento", spuntino: "spuntino" };
 
// Trova gli alimenti del database che corrispondono a una parola/frase scritta dall'utente,
// confrontando con nome e tag di ciascun alimento (case-insensitive, match parziale)
function matchFoodsFromText(word) {
  const w = word.trim().toLowerCase();
  if (!w) return [];
  return FOODS.filter((f) => {
    const haystack = [f.name.toLowerCase(), ...(f.tags || [])];
    return haystack.some((tag) => tag.includes(w) || w.includes(tag));
  }).map((f) => f.id);
}
 
// Parsa il testo libero (separato da virgole) e restituisce l'elenco di id alimenti da escludere
function parseExclusions(text) {
  const words = text.split(",").map((w) => w.trim()).filter(Boolean);
  const ids = new Set();
  words.forEach((w) => {
    matchFoodsFromText(w).forEach((id) => ids.add(id));
  });
  return { ids: Array.from(ids), words };
}
 
// kcal/kg/ora medie per sport specifico (intensità moderata di riferimento, basati su valori MET standard)
// "tags" = parole chiave per riconoscere lo sport scritto a testo libero
const SPORT_LIST = {
  corsa: { label: "Corsa / running", kcalKgOra: 9, tags: ["corsa", "running", "jogging", "corsetta"] },
  camminata_sportiva: { label: "Camminata sportiva", kcalKgOra: 5, tags: ["camminata", "camminata sportiva", "passeggiata sportiva", "nordic walking"] },
  trekking: { label: "Trekking / escursionismo", kcalKgOra: 7, tags: ["trekking", "escursionismo", "hiking", "montagna"] },
  calcio: { label: "Calcio", kcalKgOra: 9, tags: ["calcio", "calcetto", "football"] },
  basket: { label: "Pallacanestro", kcalKgOra: 9.5, tags: ["basket", "pallacanestro"] },
  pallavolo: { label: "Pallavolo", kcalKgOra: 6, tags: ["pallavolo", "volley", "beach volley"] },
  nuoto: { label: "Nuoto", kcalKgOra: 10, tags: ["nuoto", "piscina"] },
  acquagym: { label: "Acquagym / nuoto sincronizzato", kcalKgOra: 6, tags: ["acquagym", "nuoto sincronizzato", "aquafitness"] },
  ciclismo: { label: "Ciclismo", kcalKgOra: 9, tags: ["ciclismo", "bici", "bicicletta", "mtb", "mountain bike"] },
  spinning: { label: "Spinning / indoor cycling", kcalKgOra: 10, tags: ["spinning", "indoor cycling"] },
  pesi: { label: "Pesi / bodybuilding", kcalKgOra: 6, tags: ["pesi", "bodybuilding", "palestra", "sala pesi", "powerlifting"] },
  crossfit: { label: "CrossFit / functional", kcalKgOra: 11, tags: ["crossfit", "functional", "hiit", "circuit training"] },
  tennis: { label: "Tennis / padel", kcalKgOra: 8, tags: ["tennis", "padel"] },
  badminton: { label: "Badminton", kcalKgOra: 7, tags: ["badminton"] },
  squash: { label: "Squash", kcalKgOra: 11, tags: ["squash"] },
  danza: { label: "Danza", kcalKgOra: 6.5, tags: ["danza", "ballo", "hip hop", "danza moderna", "balletto"] },
  arti_marziali: { label: "Arti marziali / boxe", kcalKgOra: 11, tags: ["boxe", "arti marziali", "karate", "judo", "kickboxing", "mma", "muay thai", "taekwondo", "jujitsu", "krav maga"] },
  atletica: { label: "Atletica leggera", kcalKgOra: 10, tags: ["atletica", "salto", "lancio", "velocità"] },
  rugby: { label: "Rugby", kcalKgOra: 10, tags: ["rugby"] },
  pallamano: { label: "Pallamano", kcalKgOra: 9, tags: ["pallamano"] },
  hockey: { label: "Hockey", kcalKgOra: 9.5, tags: ["hockey"] },
  baseball: { label: "Baseball / softball", kcalKgOra: 5, tags: ["baseball", "softball"] },
  arrampicata: { label: "Arrampicata", kcalKgOra: 9, tags: ["arrampicata", "climbing", "bouldering"] },
  sci: { label: "Sci / snowboard", kcalKgOra: 8, tags: ["sci", "snowboard", "sci alpino", "sci di fondo"] },
  canottaggio: { label: "Canottaggio / canoa", kcalKgOra: 9, tags: ["canottaggio", "canoa", "voga", "kayak"] },
  vela: { label: "Vela / windsurf", kcalKgOra: 5, tags: ["vela", "windsurf", "kitesurf"] },
  surf: { label: "Surf", kcalKgOra: 6, tags: ["surf", "bodyboard"] },
  triathlon: { label: "Triathlon", kcalKgOra: 11, tags: ["triathlon"] },
  yoga_pilates: { label: "Yoga / Pilates", kcalKgOra: 3.5, tags: ["yoga", "pilates", "stretching"] },
  ginnastica: { label: "Ginnastica artistica / ritmica", kcalKgOra: 7, tags: ["ginnastica artistica", "ginnastica ritmica", "ginnastica"] },
  pattinaggio: { label: "Pattinaggio", kcalKgOra: 8, tags: ["pattinaggio", "skating", "roller", "ghiaccio"] },
  golf: { label: "Golf", kcalKgOra: 4, tags: ["golf"] },
  scherma: { label: "Scherma", kcalKgOra: 8, tags: ["scherma"] },
  equitazione: { label: "Equitazione", kcalKgOra: 5, tags: ["equitazione", "cavallo"] },
  bowling: { label: "Bowling", kcalKgOra: 3, tags: ["bowling"] },
 
  // Restanti sport olimpici estivi
  tiro_arco: { label: "Tiro con l'arco", kcalKgOra: 3.5, tags: ["tiro con l'arco", "tiro arco", "arco"] },
  tiro_segno: { label: "Tiro a segno / tiro sportivo", kcalKgOra: 2.5, tags: ["tiro a segno", "tiro sportivo", "tiro a volo"] },
  pesistica: { label: "Pesistica olimpica", kcalKgOra: 8, tags: ["pesistica", "pesistica olimpica", "sollevamento pesi"] },
  lotta: { label: "Lotta", kcalKgOra: 11, tags: ["lotta", "wrestling", "lotta greco romana", "lotta libera"] },
  skateboard: { label: "Skateboard", kcalKgOra: 6, tags: ["skateboard", "skate"] },
  bmx: { label: "BMX", kcalKgOra: 9, tags: ["bmx"] },
  tuffi: { label: "Tuffi", kcalKgOra: 6, tags: ["tuffi"] },
  pallanuoto: { label: "Pallanuoto", kcalKgOra: 10, tags: ["pallanuoto"] },
  pentathlon: { label: "Pentathlon moderno", kcalKgOra: 9, tags: ["pentathlon", "pentathlon moderno"] },
  ginnastica_artistica_attrezzi: { label: "Ginnastica agli attrezzi", kcalKgOra: 7.5, tags: ["ginnastica agli attrezzi", "anelli", "parallele", "trave", "cavallo con maniglie"] },
  ginnastica_aerobica: { label: "Ginnastica aerobica / fitness", kcalKgOra: 7, tags: ["aerobica", "fitness", "step", "zumba"] },
  canoa_slalom: { label: "Canoa slalom / velocità", kcalKgOra: 9, tags: ["canoa slalom", "canoa velocità"] },
  vela_olimpica: { label: "Vela olimpica (classi)", kcalKgOra: 5, tags: ["vela olimpica", "optimist", "laser", "470"] },
  beach_volley: { label: "Beach volley", kcalKgOra: 7, tags: ["beach volley"] },
  nuoto_artistico: { label: "Nuoto artistico", kcalKgOra: 8, tags: ["nuoto artistico"] },
 
  // Sport olimpici invernali
  bob: { label: "Bob", kcalKgOra: 9, tags: ["bob"] },
  skeleton: { label: "Skeleton", kcalKgOra: 9, tags: ["skeleton"] },
  slittino: { label: "Slittino", kcalKgOra: 8, tags: ["slittino", "luge"] },
  salto_sci: { label: "Salto con gli sci", kcalKgOra: 7, tags: ["salto con gli sci", "ski jumping"] },
  biathlon: { label: "Biathlon", kcalKgOra: 11, tags: ["biathlon"] },
  curling: { label: "Curling", kcalKgOra: 4, tags: ["curling"] },
  short_track: { label: "Short track / pattinaggio velocità", kcalKgOra: 10, tags: ["short track", "pattinaggio velocità", "pattinaggio di velocità"] },
  hockey_ghiaccio: { label: "Hockey su ghiaccio", kcalKgOra: 9.5, tags: ["hockey su ghiaccio", "hockey ghiaccio"] },
  combinata_nordica: { label: "Combinata nordica", kcalKgOra: 9, tags: ["combinata nordica"] },
  freestyle_sci: { label: "Freestyle / sci acrobatico", kcalKgOra: 8, tags: ["freestyle", "sci acrobatico", "halfpipe", "slopestyle"] },
};
 
const SPORT_FALLBACK_KCAL = 8; // usato quando lo sport scritto non viene riconosciuto
 
// Cerca una corrispondenza tra il testo scritto dall'utente e gli sport noti (nome o tag)
function matchSport(text) {
  const w = text.trim().toLowerCase();
  if (!w) return null;
  const entries = Object.entries(SPORT_LIST);
  const found = entries.find(([, sport]) => {
    const haystack = [sport.label.toLowerCase(), ...(sport.tags || [])];
    return haystack.some((tag) => tag.includes(w) || w.includes(tag));
  });
  return found ? { id: found[0], ...found[1] } : { id: "altro", label: text.trim(), kcalKgOra: SPORT_FALLBACK_KCAL, riconosciuto: false };
}
 
// Modificatore in base al livello/intensità con cui si pratica lo sport scelto
const INTENSITY_FACTORS = {
  ricreativo: 0.85,
  amatoriale: 1,
  agonistico: 1.25,
};
 
const INTENSITY_LABELS = {
  ricreativo: "Ricreativo / per divertimento",
  amatoriale: "Amatoriale regolare",
  agonistico: "Agonistico competitivo",
};
 
const TIER_LABELS = { discount: "Discount", standard: "Supermercato standard", premium: "Negozio specializzato / premium" };
const TIER_COLORS = { discount: "#2D6A4F", standard: "#B08A2E", premium: "#9D4B3C" };
 
// --- Catalogo mascotte: 3 categorie tra cui scegliere, scelta definitiva (non sostituibile dopo) ---
const MASCOT_CATALOG = {
  animali: {
    label: "Animali",
    options: [
      { id: "volpe", img: "/assets/animals/volpe.png", name: "Volpe" },
      { id: "koala", img: "/assets/animals/koala.png", name: "Koala" },
      { id: "giraffa", img: "/assets/animals/giraffa.png", name: "Giraffa" },
      { id: "ornitorinco", img: "/assets/animals/ornitorinco.png", name: "Ornitorinco" },
      { id: "gufo", img: "/assets/animals/gufo.png", name: "Gufo" },
      { id: "bradipo", img: "/assets/animals/bradipo.png", name: "Bradipo" },
      { id: "panda_rosso", img: "/assets/animals/panda_rosso.png", name: "Panda rosso" },
      { id: "elefante", img: "/assets/animals/elefante.png", name: "Elefante" },
      { id: "lemure", img: "/assets/animals/lemure.png", name: "Lemure" },
    ],
  },
};
 
// Quanti passi servono per salire di un livello
const STEPS_PER_LEVEL = 10000;
 
// Calcola il livello attuale e i passi rimanenti per il prossimo livello, a partire dal totale passi accumulati
function calcMascotLevel(totalSteps) {
  const level = Math.floor(totalSteps / STEPS_PER_LEVEL);
  const stepsInCurrentLevel = totalSteps % STEPS_PER_LEVEL;
  const stepsToNextLevel = STEPS_PER_LEVEL - stepsInCurrentLevel;
  const progressPercent = (stepsInCurrentLevel / STEPS_PER_LEVEL) * 100;
  return { level, stepsInCurrentLevel, stepsToNextLevel, progressPercent };
}
 
function calcBMR({ peso, altezza, eta, sesso }) {
  const base = 10 * peso + 6.25 * altezza - 5 * eta;
  return sesso === "uomo" ? base + 5 : base - 161;
}
 
// Formula US Navy per stimare la % di massa grassa da circonferenze corporee (in cm).
// Uomini: serve collo e vita. Donne: serve anche i fianchi.
// Fonte: Hodgdon & Beckett (1984), formula standard usata anche dall'esercito USA.
function calcBodyFatPercent({ sesso, altezza, collo, vita, fianchi }) {
  if (!collo || !vita || (sesso === "donna" && !fianchi)) return null;
  if (sesso === "uomo") {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(vita - collo) + 0.15456 * Math.log10(altezza)) - 450;
    return clampBodyFat(bf);
  }
  const bf = 495 / (1.29579 - 0.35004 * Math.log10(vita + fianchi - collo) + 0.22100 * Math.log10(altezza)) - 450;
  return clampBodyFat(bf);
}
 
// Limita la % di massa grassa a un range fisiologicamente plausibile, per evitare risultati assurdi
// se le misure inserite sono imprecise (es. errori di battitura nel metro da sarta)
function clampBodyFat(bf) {
  if (!Number.isFinite(bf)) return null;
  return Math.min(Math.max(bf, 4), 55);
}
 
// Calcola la massa magra (LBM, Lean Body Mass) a partire dal peso totale e dalla % di massa grassa.
// Se la % di massa grassa non è disponibile (misure non inserite), usa una stima media di fallback
// per sesso, così i calcoli restano comunque ragionevoli anche senza misure precise.
function calcLeanMass(peso, bodyFatPercent, sesso) {
  const bf = bodyFatPercent != null ? bodyFatPercent : sesso === "uomo" ? 18 : 26; // medie plausibili di fallback
  return peso * (1 - bf / 100);
}
 
function calcTDEE({ peso, altezza, eta, sesso, lavoro, sportTesto, intensita, oreSettimanali }) {
  const bmr = calcBMR({ peso, altezza, eta, sesso });
  const neat = lavoro === "sedentario" ? 1.2 : 1.35;
  const sportMatch = sportTesto && sportTesto.trim() ? matchSport(sportTesto) : null;
  const kcalKgOra = sportMatch ? sportMatch.kcalKgOra : 0;
  const intensityFactor = sportMatch ? INTENSITY_FACTORS[intensita] || 1 : 1;
  const sportKcalPerWeek = kcalKgOra * intensityFactor * peso * oreSettimanali;
  const sportKcalPerDay = sportKcalPerWeek / 7;
  return { bmr, tdee: bmr * neat + sportKcalPerDay, sportKcalPerDay, sportMatch };
}
 
// I target di proteine sono calcolati sulla massa magra (non sul peso totale): a parità di peso,
// chi ha più massa grassa non deve assumere proteine come se quel peso fosse tutto muscolo.
function calcTargets(tdee, obiettivo, peso, leanMass) {
  let kcalTarget = tdee;
  if (obiettivo === "dimagrimento") kcalTarget = tdee * 0.825; // -17.5% medio
  if (obiettivo === "massa") kcalTarget = tdee * 1.125;
 
  // g di proteine per kg di MASSA MAGRA (non peso totale) — range standard per dimagrimento/massa
  const proteine_g = obiettivo === "dimagrimento" ? leanMass * 2.2 : leanMass * 2.0;
  const grassi_g = peso * 0.9;
  const kcalDaProteine = proteine_g * 4;
  const kcalDaGrassi = grassi_g * 9;
  const kcalDaCarbo = Math.max(kcalTarget - kcalDaProteine - kcalDaGrassi, 0);
  const carbo_g = kcalDaCarbo / 4;
 
  return { kcalTarget, proteine_g, grassi_g, carbo_g };
}
 
// Stima l'acqua giornaliera consigliata: base 32 ml/kg di peso corporeo (range standard 30-35 ml/kg),
// più un'aggiunta per ogni ora di sport praticato, per compensare le perdite da sudorazione
// (stima prudenziale di 500-700 ml/ora di attività, qui usiamo 600 ml/ora come valore medio)
function calcHydration(peso, oreSettimanali, sportMatch) {
  const baseMl = peso * 32;
  const oreAlGiorno = sportMatch ? oreSettimanali / 7 : 0;
  const extraMl = oreAlGiorno * 600;
  return { baseMl, extraMl, totalMl: baseMl + extraMl };
}
 
// Stima le kcal bruciate camminando, a partire dai passi: ~0.0005 kcal per passo per kg di peso corporeo
// (approssimazione standard usata anche da molti contapassi/smartwatch, varia con lunghezza del passo e ritmo)
function kcalFromSteps(steps, peso) {
  return steps * 0.0005 * peso;
}
 
// Genera un suggerimento di timing pre/post allenamento in base allo sport praticato.
// Pre-workout: privilegia carboidrati facilmente digeribili per energia immediata, pochi grassi/fibre
// (che rallentano la digestione), entro 1-2 ore prima.
// Post-workout: privilegia proteine + carboidrati per il recupero muscolare e il reintegro di glicogeno,
// idealmente entro 30-60 minuti dalla fine dell'allenamento.
function workoutNutritionTips(sportMatch, intensita) {
  if (!sportMatch) return null;
  const isIntenso = intensita === "agonistico" || sportMatch.kcalKgOra >= 9;
  return {
    pre: {
      timing: "1-2 ore prima dell'allenamento",
      suggerimento: isIntenso
        ? "Pasto a base di carboidrati a rapido/medio assorbimento (es. riso bianco, pane, banana), pochi grassi e poche fibre per non appesantire la digestione."
        : "Uno spuntino leggero a base di carboidrati (es. frutta, fette biscottate) è sufficiente per attività non troppo intense.",
    },
    post: {
      timing: "entro 30-60 minuti dalla fine dell'allenamento",
      suggerimento: isIntenso
        ? "Pasto con proteine + carboidrati (es. pollo o tonno con riso, o yogurt greco con frutta) per favorire il recupero muscolare e ripristinare le riserve di energia."
        : "Uno spuntino proteico (es. yogurt greco, uova, una manciata di frutta secca) aiuta comunque il recupero anche per allenamenti più leggeri.",
    },
  };
}
 
const WEEK_DAYS = [
  "Lunedì (sett. 1)", "Martedì (sett. 1)", "Mercoledì (sett. 1)", "Giovedì (sett. 1)", "Venerdì (sett. 1)", "Sabato (sett. 1)", "Domenica (sett. 1)",
  "Lunedì (sett. 2)", "Martedì (sett. 2)", "Mercoledì (sett. 2)", "Giovedì (sett. 2)", "Venerdì (sett. 2)", "Sabato (sett. 2)", "Domenica (sett. 2)",
];
 
// Struttura "scheletro" dei pasti: quante porzioni di ciascuna categoria entrano in colazione/pranzo/cena/spuntini,
// e quanto pesano in proporzione sul totale calorico giornaliero
const MEAL_TEMPLATE = {
  colazione: { proteina: 0, carbo: 1, verdura: 0, spuntino: 1, grasso: 0, shareKcal: 0.2 },
  spuntino_mattina: { proteina: 0, carbo: 0, verdura: 0, spuntino: 1, grasso: 0, shareKcal: 0.06 },
  pranzo: { proteina: 1, carbo: 1, verdura: 1, spuntino: 0, grasso: 1, shareKcal: 0.34 },
  spuntino_pomeriggio: { proteina: 0, carbo: 0, verdura: 0, spuntino: 1, grasso: 0, shareKcal: 0.06 },
  cena: { proteina: 1, carbo: 1, verdura: 1, spuntino: 0, grasso: 1, shareKcal: 0.34 },
};
 
// Spuntini semplici e leggeri usati per gli "spuntini fuori pasto" (solo 1 alimento facile, niente combinazioni)
const SIMPLE_SNACK_IDS = ["frutta", "yogurt_greco", "yogurt_soia", "skyr", "fiocchi_latte", "frutti_bosco", "uva_passa_datteri"];
 
// Carboidrati adatti alla colazione (dolci/leggeri) — esclude pasta, riso, patate e altri carboidrati "da pasto principale"
const BREAKFAST_CARB_IDS = ["avena", "pane_integrale", "pane_segale", "pane_di_segale_integrale", "crackers_integrali"];
 
// Prezzo "medio" di un alimento (tra le 3 fasce), usato per stimarne il costo relativo
function avgPrice(food) {
  return (food.price.discount + food.price.standard + food.price.premium) / 3;
}
 
// Sceglie un alimento a caso da una categoria, dando più probabilità a quelli economici
// se il budget giornaliero è basso, e più probabilità a quelli costosi se il budget è alto.
// budgetLevel va da 0 (budget minimo) a 1 (budget alto/illimitato).
// recentlyUsed = alimenti già usati nei giorni precedenti (per evitare ripetizioni troppo vicine nella settimana)
// allowedIds = se fornito, restringe la scelta solo a questi id (usato per colazione/spuntini, dove non tutti gli
// alimenti della categoria hanno senso — es. niente pasta a colazione)
function weightedPick(category, excluded, budgetLevel, alreadyUsedToday, recentlyUsed = [], allowedIds = null) {
  let pool = FOODS.filter((f) => f.cat === category && !excluded.includes(f.id));
  if (allowedIds) {
    const restrictedPool = pool.filter((f) => allowedIds.includes(f.id));
    if (restrictedPool.length > 0) pool = restrictedPool;
  }
  if (pool.length === 0) pool = FOODS.filter((f) => f.cat === category); // fallback se categoria svuotata dalle esclusioni
 
  // Prova prima ad evitare sia i ripetuti di oggi sia quelli usati nei giorni recenti
  const fresh = pool.filter((f) => !alreadyUsedToday.includes(f.id) && !recentlyUsed.includes(f.id));
  const unusedToday = pool.filter((f) => !alreadyUsedToday.includes(f.id));
  if (fresh.length > 0) pool = fresh;
  else if (unusedToday.length > 0) pool = unusedToday;
 
  const prices = pool.map(avgPrice);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;
 
  // Calcola un peso per ciascun alimento: con budgetLevel basso pesano più gli economici,
  // con budgetLevel alto pesano più i costosi. Aggiunge sempre un minimo di varietà casuale.
  const weights = pool.map((f) => {
    const normalizedPrice = (avgPrice(f) - minP) / range; // 0 = più economico, 1 = più costoso
    const affinity = 1 - Math.abs(normalizedPrice - budgetLevel); // quanto è "in target" col budget
    return Math.max(affinity, 0.08); // un minimo per non escludere mai del tutto un alimento
  });
 
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < pool.length; i++) {
    r -= weights[i];
    if (r <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}
 
// Calcola le kcal/macro di una porzione (gestendo uova/frutta a pezzi)
function rawItemValues(food, qty) {
  const grams = food.perEgg ? qty * 50 : food.perPiece ? qty * 150 : qty;
  const factor = grams / 100;
  return { kcal: food.kcal * factor, p: food.p * factor, c: food.c * factor, f: food.f * factor };
}
 
// Stima una quantità di partenza "sensata" per un alimento di una data categoria (prima dello scaling sui target)
function baseQtyFor(food) {
  if (food.perEgg) return 2;
  if (food.perPiece) return 1;
  if (food.cat === "grasso") return 8; // condimento, porzione di servizio fissa
  if (food.cat === "proteina") return 150;
  if (food.cat === "carbo") return 80;
  if (food.cat === "verdura") return 150;
  if (food.cat === "spuntino") return 150;
  return 100;
}
 
// Costruisce dinamicamente il piano di un giorno, pescando alimenti diversi per ogni pasto
// (pesati sul budget), poi scala le quantità sui target di calorie della persona.
function buildDayPlan(excluded, kcalTarget, budgetLevel, recentlyUsed = []) {
  const usedToday = [];
  const rawPortions = [];
 
  Object.entries(MEAL_TEMPLATE).forEach(([pasto, template]) => {
    const isSnackMeal = pasto === "spuntino_mattina" || pasto === "spuntino_pomeriggio";
    const isColazione = pasto === "colazione";
    Object.entries(template).forEach(([cat, count]) => {
      if (cat === "shareKcal" || count === 0) return;
      for (let i = 0; i < count; i++) {
        // Determina la lista di alimenti ammessi in base al pasto e alla categoria:
        // - spuntini fuori pasto: sempre alimenti semplici e veloci (frutta, yogurt...)
        // - colazione, categoria "spuntino": stesso discorso, niente combinazioni elaborate
        // - colazione, categoria "carbo": solo carboidrati da colazione (avena, pane), niente pasta/riso/patate
        let allowedIds = null;
        if (isSnackMeal) allowedIds = SIMPLE_SNACK_IDS;
        else if (isColazione && cat === "spuntino") allowedIds = SIMPLE_SNACK_IDS;
        else if (isColazione && cat === "carbo") allowedIds = BREAKFAST_CARB_IDS;
 
        const food = weightedPick(cat, excluded, budgetLevel, usedToday, recentlyUsed, allowedIds);
        usedToday.push(food.id);
        rawPortions.push({ food, qty: baseQtyFor(food), pasto, mealShare: template.shareKcal });
      }
    });
  });
 
  // Scala le quantità (tranne i condimenti) per centrare il target calorico di ciascun pasto
  const items = rawPortions.map((portion) => {
    const { food, qty, pasto, mealShare } = portion;
    const isFixed = food.cat === "grasso";
 
    // kcal totali "grezze" già presenti negli alimenti scalabili dello stesso pasto, per stimare il fattore di scala
    const sameMealScalable = rawPortions.filter((p) => p.pasto === pasto && p.food.cat !== "grasso");
    const sameMealFixed = rawPortions.filter((p) => p.pasto === pasto && p.food.cat === "grasso");
    const rawScalableKcal = sameMealScalable.reduce((s, p) => s + rawItemValues(p.food, p.qty).kcal, 0);
    const rawFixedKcal = sameMealFixed.reduce((s, p) => s + rawItemValues(p.food, p.qty).kcal, 0);
 
    const mealKcalTarget = kcalTarget * mealShare;
    const targetScalableKcal = Math.max(mealKcalTarget - rawFixedKcal, rawScalableKcal * 0.4);
    const scaleFactor = rawScalableKcal > 0 ? targetScalableKcal / rawScalableKcal : 1;
    const clampedScale = Math.min(Math.max(scaleFactor, 0.5), 2.4);
 
    let scaledQty = isFixed ? qty : qty * clampedScale;
    if (!food.perEgg && !food.perPiece) {
      scaledQty = Math.round(scaledQty / 5) * 5;
    } else {
      scaledQty = Math.max(1, Math.round(scaledQty));
    }
 
    const { kcal, p, c, f } = rawItemValues(food, scaledQty);
    return { food, qty: scaledQty, pasto, kcal, p, c, f };
  });
 
  const totals = items.reduce(
    (acc, i) => ({
      kcal: acc.kcal + i.kcal,
      p: acc.p + i.p,
      c: acc.c + i.c,
      f: acc.f + i.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 }
  );
 
  return { items, totals, usedToday };
}
 
// Traduce il budget settimanale in un "livello" da 0 a 1, usato per orientare la scelta degli alimenti.
// Sotto i 25€/sett. = budget minimo (solo economici), sopra i 100€/sett. = budget alto (via libera ai costosi)
function budgetToLevel(budgetSettimanale) {
  const min = 25;
  const max = 100;
  return Math.min(Math.max((budgetSettimanale - min) / (max - min), 0), 1);
}
 
// Costruisce la lista della spesa aggregando le quantità totali di ciascun alimento usato
// nei 14 giorni del ciclo, raggruppata per categoria (proteine, carboidrati, verdure...)
function buildShoppingList(weekPlan) {
  const totals = {}; // foodId -> quantità totale (in unità "naturali": grammi, pezzi, ecc.)
 
  weekPlan.days.forEach(({ plan }) => {
    plan.items.forEach((item) => {
      const id = item.food.id;
      if (!totals[id]) totals[id] = { food: item.food, qty: 0 };
      totals[id].qty += item.qty;
    });
  });
 
  const list = Object.values(totals);
  const byCategory = {};
  list.forEach((entry) => {
    const cat = entry.food.cat;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(entry);
  });
 
  // Ordina alfabeticamente dentro ogni categoria per facilitare la lettura della lista
  Object.values(byCategory).forEach((arr) => arr.sort((a, b) => a.food.name.localeCompare(b.food.name)));
 
  return byCategory;
}
// evitando di ripetere gli stessi alimenti usati nei 3 giorni precedenti per dare più varietà nel ciclo
function buildWeekPlan(excluded, kcalTarget, budgetSettimanale) {
  const budgetLevel = budgetToLevel(budgetSettimanale);
  const history = []; // array di "usedToday" degli ultimi giorni generati
 
  const days = WEEK_DAYS.map((day) => {
    const recentlyUsed = history.slice(-3).flat(); // alimenti usati negli ultimi 3 giorni
    const plan = buildDayPlan(excluded, kcalTarget, budgetLevel, recentlyUsed);
    history.push(plan.usedToday);
    return { day, label: "Generato in base al tuo budget", plan };
  });
 
  // Usa il primo giorno come riferimento per i totali/costi mostrati nel resoconto principale
  return { days, referencePlan: days[0].plan };
}
 
function priceForTier(item, tier) {
  const food = item.food;
  if (food.perEgg) return food.price[tier] * item.qty;
  if (food.perPiece) return (food.price[tier] / 1000) * item.qty * 150;
  return (food.price[tier] / 1000) * item.qty;
}
 
// Calcola il costo medio SETTIMANALE a partire dal ciclo di 14 giorni (totale diviso 2),
// così resta confrontabile con il budget settimanale inserito dalla persona
function avgWeeklyCostByTier(weekPlan, tier) {
  const totalCost = weekPlan.days.reduce(
    (sum, { plan }) => sum + plan.items.reduce((s, item) => s + priceForTier(item, tier), 0),
    0
  );
  return totalCost / 2;
}
 
export default function DietPlanner() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    sesso: "uomo",
    eta: 20,
    peso: 75,
    altezza: 178,
    lavoro: "sedentario",
    sportTesto: "",
    intensita: "amatoriale",
    oreSettimanali: 4,
    obiettivo: "dimagrimento",
    budgetSettimanale: 40,
    collo: "",
    vita: "",
    fianchi: "",
  });
  const [result, setResult] = useState(null);
  const [nonMiPiaceTesto, setNonMiPiaceTesto] = useState("");
  const [allergieTesto, setAllergieTesto] = useState("");
 
  const riconosciutiGusti = parseExclusions(nonMiPiaceTesto);
  const riconosciutiAllergie = parseExclusions(allergieTesto);
  const riconosciuti = {
    ids: Array.from(new Set([...riconosciutiGusti.ids, ...riconosciutiAllergie.ids])),
    words: [...riconosciutiGusti.words, ...riconosciutiAllergie.words],
  };
 
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
 
  const generate = () => {
    const { bmr, tdee, sportKcalPerDay, sportMatch } = calcTDEE(form);
    const bodyFatPercent = calcBodyFatPercent({
      sesso: form.sesso,
      altezza: form.altezza,
      collo: parseFloat(form.collo),
      vita: parseFloat(form.vita),
      fianchi: parseFloat(form.fianchi),
    });
    const leanMass = calcLeanMass(form.peso, bodyFatPercent, form.sesso);
    const targets = calcTargets(tdee, form.obiettivo, form.peso, leanMass);
    const weekPlan = buildWeekPlan(riconosciuti.ids, targets.kcalTarget, form.budgetSettimanale);
    const costs = {
      discount: avgWeeklyCostByTier(weekPlan, "discount"),
      standard: avgWeeklyCostByTier(weekPlan, "standard"),
      premium: avgWeeklyCostByTier(weekPlan, "premium"),
    };
    const hydration = calcHydration(form.peso, form.oreSettimanali, sportMatch);
    const workoutTips = workoutNutritionTips(sportMatch, form.intensita);
    setResult({ bmr, tdee, sportKcalPerDay, targets, weekPlan, costs, bodyFatPercent, leanMass, hydration, workoutTips, peso: form.peso });
    setStep(2);
  };
 
  return (
    <div style={{ fontFamily: "'Fraunces', Georgia, serif", background: "#D2BD9B", minHeight: "100vh", color: "#1F2A1E" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Space+Grotesk:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        .sans { font-family: 'Space Grotesk', sans-serif; }
        .field { width: 100%; padding: 10px 12px; border: 1.5px solid #B39E7C; border-radius: 8px; background: #FBF6EC; font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: #1F2A1E; }
        .field:focus { outline: none; border-color: #3E5C3A; }
        .btn-primary { background: #3E5C3A; color: #F7F4ED; border: none; padding: 12px 22px; border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-weight: 500; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity .15s; }
        .btn-primary:hover { opacity: 0.88; }
        .chip { padding: 8px 14px; border-radius: 20px; border: 1.5px solid #B39E7C; cursor: pointer; font-family: 'Space Grotesk', sans-serif; font-size: 13px; transition: all .15s; }
        .chip.active { background: #3E5C3A; color: #F7F4ED; border-color: #3E5C3A; }
        .chip.excluded { background: #F5E6E0; color: #9D4B3C; border-color: #9D4B3C; text-decoration: line-through; }
        .card { background: #FBF6EC; border: 1px solid #C2A87F; border-radius: 14px; padding: 20px; }
      `}</style>
 
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" }}>
        <header style={{ marginBottom: 36 }}>
          <div className="sans" style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#7A8A6E", marginBottom: 8 }}>
            Prototipo — Scienze Motorie
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>
            DietPlanner
          </h1>
        </header>
 
        {step === 0 && (
          <div className="card" style={{ display: "grid", gap: 18 }}>
            <Section title="Chi sei" icon={<Activity size={16} />}>
              <Row>
                <Field label="Sesso">
                  <div style={{ display: "flex", gap: 8 }}>
                    {["uomo", "donna"].map((v) => (
                      <span key={v} className={`chip ${form.sesso === v ? "active" : ""}`} onClick={() => update("sesso", v)}>
                        {v === "uomo" ? "Uomo" : "Donna"}
                      </span>
                    ))}
                  </div>
                </Field>
                <Field label="Età">
                  <input className="field" type="number" value={form.eta} onChange={(e) => update("eta", +e.target.value)} />
                </Field>
              </Row>
              <Row>
                <Field label="Peso (kg)">
                  <input className="field" type="number" value={form.peso} onChange={(e) => update("peso", +e.target.value)} />
                </Field>
                <Field label="Altezza (cm)">
                  <input className="field" type="number" value={form.altezza} onChange={(e) => update("altezza", +e.target.value)} />
                </Field>
              </Row>
 
              <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginTop: 4 }}>
                Opzionale ma consigliato: con queste 2-3 misure (prese con un metro da sarta) calcoliamo la tua % di massa grassa, rendendo i target di proteine molto più precisi. Senza, usiamo una stima media.
              </div>
              <Row>
                <Field label="Circonferenza collo (cm)">
                  <input className="field" type="number" placeholder="es. 38" value={form.collo} onChange={(e) => update("collo", e.target.value)} />
                </Field>
                <Field label="Circonferenza vita (cm)">
                  <input className="field" type="number" placeholder="es. 85" value={form.vita} onChange={(e) => update("vita", e.target.value)} />
                </Field>
              </Row>
              {form.sesso === "donna" && (
                <Field label="Circonferenza fianchi (cm)">
                  <input className="field" type="number" placeholder="es. 98" value={form.fianchi} onChange={(e) => update("fianchi", e.target.value)} />
                </Field>
              )}
            </Section>
 
            <Section title="Quanto ti muovi" icon={<Flame size={16} />}>
              <Field label="Lavoro / giornata tipo">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["sedentario", "Sedentario"], ["attivo", "In piedi / manuale leggero"]].map(([v, l]) => (
                    <span key={v} className={`chip ${form.lavoro === v ? "active" : ""}`} onClick={() => update("lavoro", v)}>
                      {l}
                    </span>
                  ))}
                </div>
              </Field>
              <Field label="Sport praticato (lascia vuoto se non ne fai)">
                <input
                  className="field"
                  type="text"
                  placeholder="es. calcio, corsa, nuoto, pesi..."
                  value={form.sportTesto}
                  onChange={(e) => update("sportTesto", e.target.value)}
                />
                {form.sportTesto.trim() && (() => {
                  const match = matchSport(form.sportTesto);
                  return (
                    <div className="sans" style={{ fontSize: 12, color: match.riconosciuto === false ? "#9D4B3C" : "#5B6651", marginTop: 6 }}>
                      {match.riconosciuto === false
                        ? `Sport non riconosciuto, uso una stima generica (${SPORT_FALLBACK_KCAL} kcal/kg/ora)`
                        : `Riconosciuto: ${match.label}`}
                    </div>
                  );
                })()}
              </Field>
              {form.sportTesto.trim() && (
                <Field label="Livello con cui lo pratichi">
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.entries(INTENSITY_LABELS).map(([v, l]) => (
                      <span key={v} className={`chip ${form.intensita === v ? "active" : ""}`} onClick={() => update("intensita", v)}>
                        {l}
                      </span>
                    ))}
                  </div>
                </Field>
              )}
              <Field label={`Ore di allenamento a settimana: ${form.oreSettimanali}`}>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={form.oreSettimanali}
                  onChange={(e) => update("oreSettimanali", +e.target.value)}
                  style={{ width: "100%" }}
                />
              </Field>
            </Section>
 
            <Section title="Obiettivo e budget" icon={<Wallet size={16} />}>
              <Field label="Obiettivo">
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["dimagrimento", "Dimagrimento"], ["mantenimento", "Mantenimento"], ["massa", "Massa"]].map(([v, l]) => (
                    <span key={v} className={`chip ${form.obiettivo === v ? "active" : ""}`} onClick={() => update("obiettivo", v)}>
                      {l}
                    </span>
                  ))}
                </div>
              </Field>
              <Field label={`Budget settimanale per il cibo: €${form.budgetSettimanale}`}>
                <input
                  type="range"
                  min={15}
                  max={120}
                  value={form.budgetSettimanale}
                  onChange={(e) => update("budgetSettimanale", +e.target.value)}
                  style={{ width: "100%" }}
                />
              </Field>
            </Section>
 
            <Section title="Cosa non vuoi mangiare" icon={<Wallet size={16} />}>
              <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginBottom: 4 }}>
                Scrivi gli alimenti che semplicemente non ti piacciono o preferisci evitare, separati da virgola (es. "broccoli, agnello"). Il sistema li esclude dal piano, sostituendoli con un'alternativa equivalente.
              </div>
              <textarea
                className="field"
                rows={2}
                placeholder="es. broccoli, agnello, funghi"
                value={nonMiPiaceTesto}
                onChange={(e) => setNonMiPiaceTesto(e.target.value)}
                style={{ resize: "vertical", fontFamily: "'Space Grotesk', sans-serif" }}
              />
              {riconosciutiGusti.words.length > 0 && (
                <div className="sans" style={{ fontSize: 12, color: "#5B6651" }}>
                  {riconosciutiGusti.ids.length > 0 ? (
                    <span>
                      Riconosciuti: {riconosciutiGusti.ids.map((id) => FOODS.find((f) => f.id === id)?.name).join(", ")}
                    </span>
                  ) : (
                    <span style={{ color: "#9D4B3C" }}>Nessun alimento riconosciuto per ora — controlla l'ortografia o prova un termine più generico (es. "pesce", "latticini").</span>
                  )}
                </div>
              )}
            </Section>
 
            <Section title="Intolleranze e allergie" icon={<Wallet size={16} />}>
              <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginBottom: 4 }}>
                Scrivi gli alimenti a cui sei allergico o intollerante, separati da virgola (es. "latticini, glutine"). Anche questi vengono esclusi e sostituiti automaticamente con un'alternativa equivalente.
              </div>
              <textarea
                className="field"
                rows={2}
                placeholder="es. latticini, glutine, crostacei"
                value={allergieTesto}
                onChange={(e) => setAllergieTesto(e.target.value)}
                style={{ resize: "vertical", fontFamily: "'Space Grotesk', sans-serif" }}
              />
              {riconosciutiAllergie.words.length > 0 && (
                <div className="sans" style={{ fontSize: 12, color: "#5B6651" }}>
                  {riconosciutiAllergie.ids.length > 0 ? (
                    <span>
                      Riconosciuti: {riconosciutiAllergie.ids.map((id) => FOODS.find((f) => f.id === id)?.name).join(", ")}
                    </span>
                  ) : (
                    <span style={{ color: "#9D4B3C" }}>Nessun alimento riconosciuto per ora — controlla l'ortografia o prova un termine più generico (es. "pesce", "latticini").</span>
                  )}
                </div>
              )}
            </Section>
 
            <button className="btn-primary" style={{ justifySelf: "start" }} onClick={generate}>
              Genera il piano <ChevronRight size={16} />
            </button>
          </div>
        )}
 
        {step === 2 && result && (
          <ResultView result={result} budget={form.budgetSettimanale} onBack={() => setStep(0)} />
        )}
      </div>
    </div>
  );
}
 
function Section({ title, icon, children }) {
  return (
    <div>
      <div className="sans" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#3E5C3A", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {icon} {title}
      </div>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
    </div>
  );
}
 
function Row({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 14 }}>{children}</div>;
}
 
function Field({ label, children }) {
  return (
    <div>
      <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}
 
function ResultView({ result, budget, onBack }) {
  const { bmr, tdee, targets, costs, bodyFatPercent, leanMass, hydration, workoutTips, peso } = result;
  const [weekPlan, setWeekPlan] = useState(result.weekPlan);
  const cheapestTier = Object.entries(costs).sort((a, b) => a[1] - b[1])[0][0];
  const fitsTier = Object.entries(costs).find(([, cost]) => cost <= budget);
  const [selectedDay, setSelectedDay] = useState(0);
  const activeDay = weekPlan.days[selectedDay];
  const [editingItem, setEditingItem] = useState(null); // { dayIdx, itemIdx } o null
  const [showShoppingList, setShowShoppingList] = useState(true);
  const [checkedItems, setCheckedItems] = useState({}); // { foodId: true/false }
  const [activeTab, setActiveTab] = useState("dieta"); // "dieta" | "spesa" | "passi"
  const [stepsLog, setStepsLog] = useState({}); // { "2026-06-20": 8000, ... } inserimento manuale
 
  const toggleChecked = (foodId) =>
    setCheckedItems((prev) => ({ ...prev, [foodId]: !prev[foodId] }));
 
  // Sostituisce un alimento con un altro della stessa categoria, mantenendo i grammi/pezzi
  // e ricalcolando kcal/macro in base ai valori nutrizionali del nuovo alimento scelto
  const swapItem = (dayIdx, itemIdx, newFood) => {
    setWeekPlan((prev) => {
      const days = [...prev.days];
      const day = { ...days[dayIdx], plan: { ...days[dayIdx].plan } };
      const items = [...day.plan.items];
      const oldItem = items[itemIdx];
      const grams = newFood.perEgg ? oldItem.qty * 50 : newFood.perPiece ? oldItem.qty * 150 : oldItem.qty;
      const factor = grams / 100;
      items[itemIdx] = {
        food: newFood,
        qty: oldItem.qty,
        pasto: oldItem.pasto,
        kcal: newFood.kcal * factor,
        p: newFood.p * factor,
        c: newFood.c * factor,
        f: newFood.f * factor,
      };
      const totals = items.reduce(
        (acc, i) => ({ kcal: acc.kcal + i.kcal, p: acc.p + i.p, c: acc.c + i.c, f: acc.f + i.f }),
        { kcal: 0, p: 0, c: 0, f: 0 }
      );
      day.plan.items = items;
      day.plan.totals = totals;
      days[dayIdx] = day;
      return { ...prev, days };
    });
    setEditingItem(null);
  };
 
  const TABS = [
    { key: "dieta", label: "Dieta", icon: <Flame size={20} /> },
    { key: "spesa", label: "Spesa", icon: <Wallet size={20} /> },
    { key: "passi", label: "Passi", icon: <Activity size={20} /> },
    { key: "mascotte", label: "Mascotte", icon: <span style={{ fontSize: 18 }}>🏆</span> },
  ];
 
  // Mascotte: una volta scelta (mascotData.chosen = true) non si può più cambiare
  const [mascotData, setMascotData] = useState({
    chosen: false,
    catalogKey: null, // "animali"
    optionId: null, // id dell'opzione scelta nel catalogo
    name: "",
  });
 
  return (
    <div style={{ paddingBottom: 90 }}>
      {activeTab === "dieta" && (
        <DietaTab
          bmr={bmr}
          tdee={tdee}
          targets={targets}
          bodyFatPercent={bodyFatPercent}
          leanMass={leanMass}
          hydration={hydration}
          workoutTips={workoutTips}
          weekPlan={weekPlan}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          activeDay={activeDay}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
          swapItem={swapItem}
          onBack={onBack}
        />
      )}
 
      {activeTab === "spesa" && (
        <SpesaTab
          weekPlan={weekPlan}
          showShoppingList={showShoppingList}
          setShowShoppingList={setShowShoppingList}
          checkedItems={checkedItems}
          toggleChecked={toggleChecked}
          costs={costs}
          budget={budget}
          cheapestTier={cheapestTier}
          fitsTier={fitsTier}
        />
      )}
 
      {activeTab === "passi" && <PassiTab stepsLog={stepsLog} setStepsLog={setStepsLog} peso={peso} />}
 
      {activeTab === "mascotte" && (
        <MascotteTab
          mascotData={mascotData}
          setMascotData={setMascotData}
          totalSteps={Object.values(stepsLog).reduce((sum, s) => sum + s, 0)}
        />
      )}
 
      {/* Barra di navigazione in basso, stile app con tab fisse */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#FBF6EC",
          borderTop: "1px solid #C2A87F",
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0 calc(10px + env(safe-area-inset-bottom))",
          zIndex: 50,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="sans"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isActive ? "#3E5C3A" : "#9A937F",
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                padding: "4px 18px",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
 
// --- TAB 1: Dieta — fabbisogno, timing allenamento, programma 14 giorni ---
function DietaTab({ bmr, tdee, targets, bodyFatPercent, leanMass, hydration, workoutTips, weekPlan, selectedDay, setSelectedDay, activeDay, editingItem, setEditingItem, swapItem, onBack }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="card">
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 4 }}>
          Il tuo fabbisogno
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 10, rowGap: 18 }}>
          <Stat label="BMR (metabolismo basale)" value={`${Math.round(bmr)} kcal`} />
          <Stat label="TDEE (dispendio energetico totale)" value={`${Math.round(tdee)} kcal`} />
          <Stat label="Target giornaliero" value={`${Math.round(targets.kcalTarget)} kcal`} highlight />
        </div>
        <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginTop: 14, padding: "10px 12px", background: "#F0EDE0", borderRadius: 8 }}>
          {bodyFatPercent != null ? (
            <span>Massa grassa stimata: <b>{bodyFatPercent.toFixed(1)}%</b> · Massa magra: <b>{leanMass.toFixed(1)} kg</b> — calcolata dalle tue misure (formula US Navy)</span>
          ) : (
            <span>Massa magra stimata: <b>{leanMass.toFixed(1)} kg</b> — nessuna misura inserita, uso una media generica. Inserisci collo/vita (e fianchi se donna) per un calcolo più preciso delle proteine.</span>
          )}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 18, flexWrap: "wrap" }}>
          <Macro icon={<Beef size={15} />} label="Proteine" value={`${Math.round(targets.proteine_g)} g`} color="#9D4B3C" />
          <Macro icon={<Wheat size={15} />} label="Carboidrati" value={`${Math.round(targets.carbo_g)} g`} color="#B08A2E" />
          <Macro icon={<Droplet size={15} />} label="Grassi" value={`${Math.round(targets.grassi_g)} g`} color="#3E5C3A" />
          <Macro icon={<Droplet size={15} />} label="Acqua" value={`${(hydration.totalMl / 1000).toFixed(1)} L`} color="#2E6B8A" />
        </div>
        {hydration.extraMl > 0 && (
          <div className="sans" style={{ fontSize: 12, color: "#9A937F", marginTop: 8 }}>
            Di cui ~{(hydration.extraMl / 1000).toFixed(1)} L extra per compensare il sudore dell'attività sportiva.
          </div>
        )}
      </div>
 
      {workoutTips && (
        <div className="card">
          <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 14 }}>
            Cosa mangiare prima e dopo l'allenamento
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Prima — {workoutTips.pre.timing}</div>
              <div className="sans" style={{ fontSize: 13.5, color: "#5B6651" }}>{workoutTips.pre.suggerimento}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Dopo — {workoutTips.post.timing}</div>
              <div className="sans" style={{ fontSize: 13.5, color: "#5B6651" }}>{workoutTips.post.suggerimento}</div>
            </div>
          </div>
        </div>
      )}
 
      <div className="card">
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 14 }}>
          Programma su ciclo di 14 giorni
        </div>
 
        {[0, 1].map((weekIdx) => (
          <div key={weekIdx} style={{ marginBottom: weekIdx === 0 ? 14 : 18 }}>
            <div className="sans" style={{ fontSize: 11, color: "#9A937F", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Settimana {weekIdx + 1}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {weekPlan.days.slice(weekIdx * 7, weekIdx * 7 + 7).map((d, i) => {
                const idx = weekIdx * 7 + i;
                const dayNumber = idx + 1;
                const dayName = d.day.split(" (")[0].slice(0, 3);
                const isSelected = selectedDay === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className="sans"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 4px",
                      borderRadius: 10,
                      border: isSelected ? "1.5px solid #3E5C3A" : "1.5px solid #C9B89A",
                      background: isSelected ? "#3E5C3A" : "#FBF6EC",
                      color: isSelected ? "#F7F4ED" : "#1F2A1E",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    <span style={{ fontSize: 10, opacity: 0.75, textTransform: "uppercase" }}>{dayName}</span>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{dayNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
 
        <div className="sans" style={{ fontSize: 12, color: "#9A937F", marginBottom: 12, paddingTop: 4, borderTop: "1px solid #E5DFD0" }}>
          {activeDay.day} — piano generato in base al tuo budget, diverso ogni giorno nel ciclo di 14 giorni
        </div>
 
        <div style={{ display: "grid", gap: 22 }}>
          {[
            { key: "colazione", label: "Colazione" },
            { key: "spuntino_mattina", label: "Spuntino di metà mattina" },
            { key: "pranzo", label: "Pranzo" },
            { key: "spuntino_pomeriggio", label: "Spuntino del pomeriggio" },
            { key: "cena", label: "Cena" },
          ].map(({ key, label }) => {
            const mealItems = activeDay.plan.items.filter((i) => i.pasto === key);
            const mealKcal = mealItems.reduce((s, i) => s + i.kcal, 0);
            const mainItems = mealItems.filter((i) => i.food.cat !== "grasso");
            const condimenti = mealItems.filter((i) => i.food.cat === "grasso");
            return (
              <div key={key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{label}</div>
                  <div className="sans" style={{ fontSize: 12, color: "#9A937F" }}>{Math.round(mealKcal)} kcal</div>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {mainItems.map((item) => {
                    const realIdx = activeDay.plan.items.indexOf(item);
                    const isEditing = editingItem && editingItem.dayIdx === selectedDay && editingItem.itemIdx === realIdx;
                    const alternatives = FOODS.filter((f) => f.cat === item.food.cat && f.id !== item.food.id);
                    return (
                      <div key={realIdx}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, padding: "6px 0", borderBottom: !isEditing ? "1px solid #EFE9DA" : "none" }}>
                          <span>{item.food.name} — {item.food.perEgg || item.food.perPiece ? `${item.qty} pz` : `${item.qty} g`}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span className="sans" style={{ color: "#7A8A6E" }}>{Math.round(item.kcal)} kcal</span>
                            <button
                              onClick={() => setEditingItem(isEditing ? null : { dayIdx: selectedDay, itemIdx: realIdx })}
                              className="sans"
                              style={{ fontSize: 11, color: "#3E5C3A", background: "none", border: "1px solid #3E5C3A", borderRadius: 6, padding: "3px 8px", cursor: "pointer" }}
                            >
                              {isEditing ? "Annulla" : "Cambia"}
                            </button>
                          </div>
                        </div>
                        {isEditing && (
                          <div style={{ padding: "8px 0 12px", borderBottom: "1px solid #EFE9DA", display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {alternatives.map((alt) => (
                              <span
                                key={alt.id}
                                className="chip"
                                style={{ fontSize: 12 }}
                                onClick={() => swapItem(selectedDay, realIdx, alt)}
                              >
                                {alt.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {condimenti.length > 0 && (
                  <div className="sans" style={{ fontSize: 12.5, color: "#9A937F", marginTop: 8, fontStyle: "italic" }}>
                    Condito con {condimenti.map((c) => `${c.food.name.toLowerCase()} (${c.qty}g, ${Math.round(c.kcal)} kcal)`).join(" + ")} — già incluso nel totale del pasto, da usare per cucinare/condire, non da mangiare a parte.
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="sans" style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid #E5DFD0", fontSize: 13, color: "#5B6651" }}>
          Totale giornata: {Math.round(activeDay.plan.totals.kcal)} kcal · P {Math.round(activeDay.plan.totals.p)}g · C {Math.round(activeDay.plan.totals.c)}g · G {Math.round(activeDay.plan.totals.f)}g
        </div>
      </div>
 
      <button className="btn-primary" style={{ justifySelf: "start", background: "transparent", color: "#3E5C3A", border: "1.5px solid #3E5C3A" }} onClick={onBack}>
        ← Modifica dati
      </button>
    </div>
  );
}
 
// --- TAB 2: Spesa — lista della spesa con checkbox + costi per fascia di negozio ---
function SpesaTab({ weekPlan, showShoppingList, setShowShoppingList, checkedItems, toggleChecked, costs, budget, cheapestTier, fitsTier }) {
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showShoppingList ? 14 : 0 }}>
          <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E" }}>
            Lista della spesa (ciclo di 14 giorni)
          </div>
          <button
            className="sans"
            onClick={() => setShowShoppingList((v) => !v)}
            style={{ fontSize: 12, color: "#3E5C3A", background: "none", border: "1px solid #3E5C3A", borderRadius: 6, padding: "5px 10px", cursor: "pointer" }}
          >
            {showShoppingList ? "Nascondi" : "Mostra"}
          </button>
        </div>
        {showShoppingList && (() => {
          const shoppingList = buildShoppingList(weekPlan);
          return (
            <div style={{ display: "grid", gap: 18 }}>
              {Object.entries(FOOD_CATEGORIES).map(([catKey, catLabel]) => {
                const entries = shoppingList[catKey];
                if (!entries || entries.length === 0) return null;
                return (
                  <div key={catKey}>
                    <div className="sans" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: "#9A937F", marginBottom: 6 }}>
                      {catLabel}
                    </div>
                    <div style={{ display: "grid", gap: 5 }}>
                      {entries.map(({ food, qty }) => {
                        const isChecked = !!checkedItems[food.id];
                        return (
                          <div
                            key={food.id}
                            onClick={() => toggleChecked(food.id)}
                            style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, cursor: "pointer", padding: "2px 0" }}
                          >
                            <div
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: 5,
                                border: "1.5px solid #3E5C3A",
                                background: isChecked ? "#3E5C3A" : "transparent",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: "#F7F4ED",
                                fontSize: 12,
                              }}
                            >
                              {isChecked ? "✓" : ""}
                            </div>
                            <span style={{ flex: 1, textDecoration: isChecked ? "line-through" : "none", color: isChecked ? "#9A937F" : "#1F2A1E" }}>
                              {food.name}
                            </span>
                            <span className="sans" style={{ color: "#7A8A6E" }}>
                              {food.perEgg || food.perPiece ? `${Math.round(qty)} pz` : `${(qty / 1000).toFixed(2)} kg`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="sans" style={{ fontSize: 12, color: "#9A937F", paddingTop: 8, borderTop: "1px solid #E5DFD0" }}>
                Quantità totali per tutto il ciclo di 14 giorni — utile per fare la spesa in una o due volte.
              </div>
            </div>
          );
        })()}
      </div>
 
      <div className="card">
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 14 }}>
          <MapPin size={13} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />
          Costo settimanale medio stimato per fascia di negozio (calcolato sul ciclo di 14 giorni)
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {Object.entries(costs).map(([tier, cost]) => (
            <div key={tier} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: TIER_COLORS[tier], flexShrink: 0 }} />
              <div style={{ flex: 1 }} className="sans">{TIER_LABELS[tier]}</div>
              <div className="sans" style={{ fontWeight: 600 }}>€{cost.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 14, background: "#F0EDE0", borderRadius: 10 }} className="sans">
          {fitsTier ? (
            <span>Con un budget di €{budget}/sett. il tuo piano rientra nella fascia <b>{TIER_LABELS[fitsTier[0]]}</b> (~€{fitsTier[1].toFixed(2)}). La fascia più economica resta <b>{TIER_LABELS[cheapestTier]}</b>.</span>
          ) : (
            <span>Anche nella fascia più economica (<b>{TIER_LABELS[cheapestTier]}</b>, ~€{costs[cheapestTier].toFixed(2)}/sett.) il piano supera il tuo budget di €{budget}. Valuta di alzare leggermente il budget o ridurre alcune porzioni più costose (es. tonno, petto di pollo).</span>
          )}
        </div>
        <div className="sans" style={{ marginTop: 10, fontSize: 12, color: "#9A937F" }}>
          Nota: prezzi medi indicativi, non in tempo reale. Geolocalizzazione dei punti vendita reali non ancora disponibile in questo prototipo.
        </div>
      </div>
    </div>
  );
}
 
// --- TAB 3: Passi — inserimento manuale dei passi quotidiani (in attesa di integrazione con Google Health/Apple Health) ---
function PassiTab({ stepsLog, setStepsLog, peso }) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const todaySteps = stepsLog[todayKey] || 0;
  const todayKcal = kcalFromSteps(todaySteps, peso);
  const [inputValue, setInputValue] = useState("");
 
  const saveSteps = () => {
    const val = parseInt(inputValue, 10);
    if (!Number.isNaN(val) && val >= 0) {
      setStepsLog((prev) => ({ ...prev, [todayKey]: val }));
      setInputValue("");
    }
  };
 
  const history = Object.entries(stepsLog)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 14);
 
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="card">
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 4 }}>
          Contapassi (inserimento manuale)
        </div>
        <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginTop: 6, marginBottom: 16 }}>
          Per ora i passi si inseriscono a mano. In futuro questa sezione potrà collegarsi automaticamente a Google Health o Apple Health, per leggere in automatico dal telefono passi, battito cardiaco, minuti attivi e tutto ciò che quei servizi già misurano.
        </div>
 
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", rowGap: 18 }}>
          <Stat label="Passi registrati oggi" value={todaySteps.toLocaleString("it-IT")} highlight />
          <Stat label="Kcal bruciate camminando" value={`${Math.round(todayKcal)} kcal`} />
        </div>
 
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <input
            className="field"
            type="number"
            placeholder="es. 8000"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={saveSteps}>
            Salva
          </button>
        </div>
        {todaySteps > 0 && (
          <div className="sans" style={{ fontSize: 12, color: "#9A937F", marginTop: 8 }}>
            Salvando di nuovo per oggi, il valore di oggi viene sovrascritto (non somma). Stima kcal calcolata sul tuo peso attuale ({peso} kg).
          </div>
        )}
      </div>
 
      {history.length > 0 && (
        <div className="card">
          <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 14 }}>
            Storico recente
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {history.map(([date, steps]) => (
              <div key={date} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "6px 0", borderBottom: "1px solid #EFE9DA" }}>
                <span className="sans">{date}</span>
                <span style={{ fontWeight: 600 }}>
                  {steps.toLocaleString("it-IT")} passi
                  <span className="sans" style={{ fontWeight: 400, color: "#9A937F", marginLeft: 8, fontSize: 13 }}>
                    ~{Math.round(kcalFromSteps(steps, peso))} kcal
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
 
// --- TAB 4: Mascotte — scelta definitiva del personaggio, livelli basati sui passi, accessori sbloccabili ---
function MascotteTab({ mascotData, setMascotData, totalSteps }) {
  const { level, stepsToNextLevel, progressPercent } = calcMascotLevel(totalSteps);
 
  if (!mascotData.chosen) {
    return <MascotPicker setMascotData={setMascotData} />;
  }
 
  const selectedAnimal = MASCOT_CATALOG[mascotData.catalogKey]?.options.find((o) => o.id === mascotData.optionId);
 
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="card" style={{ textAlign: "center" }}>
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 14 }}>
          La tua mascotte
        </div>
 
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          {selectedAnimal && <img src={selectedAnimal.img} alt={selectedAnimal.name} style={{ width: 150, height: "auto" }} />}
        </div>
 
        <div style={{ fontSize: 22, fontWeight: 700 }}>{mascotData.name || "Senza nome"}</div>
        <div className="sans" style={{ fontSize: 13, color: "#7A8A6E", marginTop: 2 }}>Livello {level}</div>
 
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 10, background: "#E5DFD0", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPercent}%`, background: "#3E5C3A", borderRadius: 6, transition: "width .3s" }} />
          </div>
          <div className="sans" style={{ fontSize: 12, color: "#9A937F", marginTop: 6 }}>
            {stepsToNextLevel.toLocaleString("it-IT")} passi al prossimo livello
          </div>
        </div>
 
        <div className="sans" style={{ fontSize: 12, color: "#9A937F", marginTop: 16, paddingTop: 14, borderTop: "1px solid #E5DFD0" }}>
          Si sale di livello ogni {STEPS_PER_LEVEL.toLocaleString("it-IT")} passi totali registrati. Quando il contapassi sarà collegato a Google Health/Apple Health, i livelli saliranno automaticamente.
        </div>
      </div>
    </div>
  );
}
 
// Schermata di scelta iniziale della mascotte (scelta definitiva, da fare una sola volta)
function MascotPicker({ setMascotData }) {
  const [catalogKey, setCatalogKey] = useState("animali");
  const [optionId, setOptionId] = useState(null);
  const [name, setName] = useState("");
  const [confirming, setConfirming] = useState(false);
 
  const canConfirm = optionId && name.trim();
 
  const confirm = () => {
    setMascotData({ chosen: true, catalogKey, optionId, name: name.trim() });
  };
 
  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div className="card">
        <div className="sans" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "#7A8A6E", marginBottom: 6 }}>
          Scegli la tua mascotte
        </div>
        <div className="sans" style={{ fontSize: 12.5, color: "#5B6651", marginBottom: 16 }}>
          Attenzione: questa scelta è <b>definitiva</b>. Non potrai cambiare mascotte in futuro, ma potrai sempre decorarla con accessori sbloccati salendo di livello.
        </div>
 
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {MASCOT_CATALOG[catalogKey].options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setOptionId(opt.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "12px 4px",
                borderRadius: 10,
                border: optionId === opt.id ? "2px solid #3E5C3A" : "1.5px solid #C9B89A",
                background: optionId === opt.id ? "#F0EDE0" : "#FBF6EC",
                cursor: "pointer",
              }}
            >
              <img src={opt.img} alt={opt.name} style={{ width: 48, height: 48, objectFit: "contain" }} />
              <span className="sans" style={{ fontSize: 10, textAlign: "center", color: "#5B6651" }}>{opt.name}</span>
            </button>
          ))}
        </div>
 
        <div style={{ marginTop: 20 }}>
          <Field label="Dai un nome alla tua mascotte">
            <input className="field" type="text" placeholder="es. Scatto, Forza, Bolide..." value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>
 
        {!confirming ? (
          <button
            className="btn-primary"
            style={{ marginTop: 18, opacity: canConfirm ? 1 : 0.5, cursor: canConfirm ? "pointer" : "default" }}
            disabled={!canConfirm}
            onClick={() => canConfirm && setConfirming(true)}
          >
            Scegli questa mascotte
          </button>
        ) : (
          <div style={{ marginTop: 18, padding: 14, background: "#F5E6E0", borderRadius: 10 }}>
            <div className="sans" style={{ fontSize: 13, color: "#9D4B3C", marginBottom: 10 }}>
              Sei sicuro? Questa scelta non si potrà cambiare in seguito.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={confirm}>Confermo, è definitiva</button>
              <button
                className="sans"
                onClick={() => setConfirming(false)}
                style={{ background: "transparent", border: "1px solid #9D4B3C", color: "#9D4B3C", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
 
 
function Stat({ label, value, highlight }) {
  return (
    <div style={{ minWidth: 140 }}>
      <div className="sans" style={{ fontSize: 11, color: "#9A937F" }}>{label}</div>
      <div style={{ fontSize: highlight ? 26 : 20, fontWeight: 700, color: highlight ? "#3E5C3A" : "#1F2A1E" }}>{value}</div>
    </div>
  );
}
 
function Macro({ icon, label, value, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ color }}>{icon}</div>
      <div>
        <div className="sans" style={{ fontSize: 11, color: "#9A937F" }}>{label}</div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>{value}</div>
      </div>
    </div>
  );
}
