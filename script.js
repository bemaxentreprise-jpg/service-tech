// Remplace ce lien par ton lien Google Calendar Appointment Schedule.
// Exemple : const BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/XXXXXXXX";
const BOOKING_URL = "https://calendar.app.google/bWRd6SaJ76K9wb149";

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  const isOpen = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => links.classList.remove("open"));
});

const bookingLink = document.querySelector(".booking-link");
const bookingFrame = document.querySelector(".booking-embed iframe");
const placeholder = document.querySelector(".embed-placeholder");

if (BOOKING_URL && !BOOKING_URL.includes("PASTE_YOUR")) {
  bookingLink.href = BOOKING_URL;
  bookingFrame.src = BOOKING_URL;
  bookingFrame.style.display = "block";
  placeholder.style.display = "none";
} else {
  bookingLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Ajoute d’abord ton lien Google Calendar Appointment Schedule dans le fichier script.js.");
  });
}

// Assistant gratuit intégré au site
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector(".chatbot-panel");
const chatbotClose = document.querySelector(".chatbot-close");
const chatbotMessages = document.getElementById("chatbotMessages");
const chatbotForm = document.querySelector(".chatbot-form");
const chatbotInput = document.getElementById("chatbotInput");

const chatbotAnswers = {
  rdv: "Pour prendre rendez-vous, cliquez sur le bouton « Prendre rendez-vous ». Vous pourrez choisir directement un créneau disponible dans le calendrier.",
  electro: "Pour une panne électroménager, le diagnostic démarre à 49 € pour le gros électroménager et 29 € pour le petit électroménager. Le diagnostic est déduit si la réparation est effectuée.",
  tv: "Pour une TV, la pose libre est généralement entre 49 et 69 €. La pose murale est uniquement sur devis. Pour les consoles, l’installation démarre entre 39 et 69 €.",
  pc: "Pour un PC, l’installation démarre entre 49 et 79 €. L’antivirus dépend de la durée, des fonctions et du nombre d’appareils couverts.",
  mobile: "Pour téléphone ou tablette : mise en service de 29 à 59 €, transfert de données de 9 à 39 €, aide ou réglages de 29 à 49 €.",
  wifi: "Pour Wi‑Fi et câbles : extension Wi‑Fi de 49 à 79 €, arrangement câbles simple de 39 à 59 €, complet de 59 à 99 €.",
  tarifs: "Vous pouvez consulter la section « Tarifs » du site. Les pièces, licences, supports, câbles et accessoires sont toujours chiffrés séparément avant accord.",
  paiement: "Paiements acceptés : cash, carte bancaire sans contact uniquement et QR code Wero."
};

function addChatMessage(text, type = "bot") {
  const message = document.createElement("div");
  message.className = type === "user" ? "user-message" : "bot-message";
  message.textContent = text;
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9+\- ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const keywordGroups = {
  rdv: [
    "rdv", "rendez vous", "rendez-vous", "reservation", "reserver", "creneau", "disponible",
    "disponibilite", "agenda", "planning", "venir", "passage", "intervention", "intervenir",
    "venir chez moi", "prendre rendez vous", "prendre rdv", "date", "horaire", "quand",
    "demain", "aujourd hui", "cette semaine", "urgence", "urgent", "soir", "week end", "weekend"
  ],

  paiement: [
    "paiement", "payer", "paie", "cash", "liquide", "espece", "especes", "carte",
    "bancontact", "visa", "mastercard", "sans contact", "contactless", "terminal",
    "tpe", "qr", "qr code", "wero", "virement", "facture", "ticket", "recu"
  ],

  tarifs: [
    "tarif", "tarifs", "prix", "combien", "cout", "coût", "couter", "coûter", "devis",
    "diagnostic", "main d oeuvre", "main-d oeuvre", "main d'oeuvre", "forfait", "heure",
    "horaire", "distance", "deplacement", "déplacement", "supplement", "supplément",
    "cher", "pas cher", "estimation", "montant", "budget", "payer combien"
  ],

  grosElectro: [
    "gros electro", "gros electromenager", "gros électroménager", "electromenager", "électroménager",
    "machine a laver", "machine à laver", "lave linge", "lave-linge", "lessiveuse",
    "seche linge", "sèche linge", "sèche-linge", "sechoir", "séchoir",
    "lave vaisselle", "lave-vaisselle", "vaisselle",
    "four", "four encastrable", "four electrique", "four électrique", "taque", "plaque", "plaque induction",
    "induction", "vitro", "vitroceramique", "vitrocéramique", "cuisiniere", "cuisinière",
    "hotte", "hotte aspirante", "frigo", "refrigerateur", "réfrigérateur", "congelateur", "congélateur",
    "combi frigo", "congel", "ne refroidit plus", "ne chauffe plus", "ne vidange plus",
    "vidange", "essorage", "n essore plus", "fuite", "fuit", "eau au sol", "tambour",
    "pompe", "hublot", "joint", "resistance", "résistance", "courroie", "charbon", "moteur",
    "code erreur", "erreur", "programme bloque", "programme bloqué", "disjoncte", "ne demarre pas",
    "ne démarre pas", "ne s allume plus", "bruit", "vibration", "odeur", "entretien lave linge",
    "nettoyage lave linge", "entretien seche linge", "nettoyage filtre", "decrassage", "détartrage"
  ],

  petitElectro: [
    "petit electro", "petit electromenager", "petit électroménager", "aspirateur", "dyson",
    "rowenta", "miele", "robot aspirateur", "irobot", "roomba", "machine cafe", "machine café",
    "cafetiere", "cafetière", "delonghi", "nespresso", "senseo", "dolce gusto", "broyeur",
    "percolateur", "robot cuisine", "robot menager", "robot ménager", "cookeo", "thermomix",
    "micro onde", "micro-ondes", "micro onde", "air fryer", "airfryer", "friteuse", "grille pain",
    "bouilloire", "mixeur", "blender", "centrifugeuse", "tireuse", "detartrage", "détartrage",
    "nettoyage machine cafe", "entretien machine cafe", "ne coule plus", "ne chauffe plus",
    "perd de l eau", "fuit", "bouche", "bouché", "tartre", "calcaire", "filtre", "batterie aspirateur"
  ],

  tv: [
    "tv", "tele", "télé", "television", "télévision", "smart tv", "ecran", "écran",
    "oled", "qled", "led", "lcd", "samsung tv", "lg tv", "sony tv", "philips tv", "tcl",
    "hisense", "chaine", "chaînes", "chaines", "canaux", "antenne", "tnt", "voo", "proximus",
    "orange tv", "decodeur", "décodeur", "box tv", "hdmi", "arc", "earc", "barre de son",
    "home cinema", "chromecast", "apple tv", "fire tv", "application tv", "netflix", "youtube",
    "disney", "prime video", "mise en service tv", "installation tv", "pose libre", "pose murale",
    "support mural", "fixer au mur", "accrocher tv", "reglage image", "réglage image", "son",
    "pas d image", "pas de son", "image noire", "telecommande", "télécommande", "wifi tv"
  ],

  console: [
    "console", "console de jeux", "playstation", "ps4", "ps5", "xbox", "series x", "series s",
    "xbox one", "nintendo", "switch", "switch oled", "switch lite", "steam deck", "rog ally",
    "portable", "console portable", "manette", "joycon", "joy-con", "controleur", "contrôleur",
    "installation console", "configurer console", "compte psn", "playstation network",
    "xbox live", "game pass", "nintendo online", "connexion console", "wifi console",
    "hdmi console", "stockage console", "disque dur console", "ssd console", "transfert console",
    "sauvegarde console", "mise a jour console", "mise à jour console", "nettoyage console",
    "surchauffe", "ventilateur console", "bruit console", "poussiere console", "poussière console"
  ],

  pc: [
    "pc", "ordinateur", "ordi", "portable", "laptop", "tour", "desktop", "windows", "mac",
    "macbook", "imac", "chromebook", "linux", "installation pc", "configurer pc", "nouveau pc",
    "mise en service pc", "compte microsoft", "compte google", "mail", "email", "outlook",
    "gmail", "imprimante", "scanner", "scan", "pilote", "driver", "wifi pc", "bluetooth",
    "souris", "clavier", "ecran pc", "écran pc", "dual screen", "deux ecrans", "deux écrans",
    "transfert pc", "transferer fichier", "transférer fichier", "donnees pc", "données pc",
    "sauvegarde pc", "backup", "cloud", "onedrive", "google drive", "icloud", "nettoyage pc",
    "lent", "pc lent", "ram", "disque plein", "stockage plein", "virus", "pop up", "pub",
    "optimisation", "mise a jour", "mise à jour", "formatage", "reinitialisation", "réinitialisation"
  ],

  antivirus: [
    "antivirus", "virus", "malware", "spyware", "ransomware", "securite", "sécurité",
    "protection", "pirate", "piratage", "hacker", "compte pirate", "compte piraté",
    "alerte virus", "windows defender", "norton", "bitdefender", "mcafee", "kaspersky",
    "avast", "avg", "eset", "licence", "abonnement", "1 an", "2 ans", "3 ans", "multi appareil",
    "multi-appareil", "plusieurs appareils", "vpn", "pare feu", "firewall", "protection bancaire",
    "controle parental", "contrôle parental", "gestion mot de passe", "password", "nettoyage virus"
  ],

  mobile: [
    "telephone", "téléphone", "smartphone", "gsm", "iphone", "android", "samsung", "xiaomi",
    "oppo", "oneplus", "huawei", "google pixel", "tablette", "ipad", "galaxy tab",
    "mise en service telephone", "mise en service téléphone", "configurer telephone", "configurer téléphone",
    "configurer tablette", "compte apple", "identifiant apple", "icloud", "compte google",
    "play store", "app store", "whatsapp", "contact", "contacts", "photos", "videos", "vidéos",
    "sms", "messages", "transfert telephone", "transfert téléphone", "transfert tablette",
    "transferer donnees", "transférer données", "sauvegarde telephone", "sauvegarde téléphone",
    "nouveau telephone", "nouveau téléphone", "nouvelle tablette", "migration iphone",
    "migration android", "reinitialiser telephone", "réinitialiser téléphone", "code oublie",
    "code oublié", "mot de passe oublie", "mot de passe oublié"
  ],

  wifi: [
    "wifi", "wi fi", "wi-fi", "internet", "reseau", "réseau", "box", "routeur", "modem",
    "repetiteur", "répéteur", "repeteur wifi", "répéteur wifi", "extension wifi", "extender",
    "mesh", "cpl", "ethernet", "rj45", "cable reseau", "câble réseau", "connexion",
    "pas de wifi", "wifi faible", "signal faible", "mauvaise connexion", "deconnexion",
    "déconnexion", "perte internet", "debit", "débit", "lent", "couverture wifi",
    "wifi chambre", "wifi etage", "wifi étage", "installer wifi", "configurer wifi",
    "mot de passe wifi", "ssid", "imprimante wifi", "tv wifi", "console wifi"
  ],

  cables: [
    "cable", "câble", "cables", "câbles", "rangement cable", "rangement câble",
    "arrangement cable", "arrangement câble", "cable management", "meuble tv", "bureau",
    "coin tv", "coin multimedia", "coin multimédia", "prise", "multiprise", "goulotte",
    "serre cable", "serre-câble", "attache cable", "attache câble", "hdmi", "ethernet",
    "usb", "chargeur", "fil", "fils", "trop de cables", "cables visibles", "câbles visibles",
    "cables en vrac", "câbles en vrac", "installation propre", "rendre propre", "cacher cables",
    "cacher câbles", "cablage", "câblage"
  ],

  installation: [
    "installer", "installation", "mise en service", "configurer", "configuration", "parametrer",
    "paramétrer", "brancher", "raccorder", "connecter", "connexion", "mettre en route",
    "nouveau", "neuf", "premiere utilisation", "première utilisation"
  ],

  entretien: [
    "entretien", "nettoyage", "nettoyer", "depoussiere", "dépoussière", "depoussierage",
    "dépoussiérage", "optimisation", "maintenance", "controle", "contrôle", "verification",
    "vérification", "revision", "révision", "detartrage", "détartrage", "decrassage",
    "décrassage"
  ],

  reparation: [
    "reparer", "réparer", "reparation", "réparation", "depanner", "dépanner", "depannage",
    "dépannage", "panne", "casse", "cassé", "ne fonctionne plus", "ne marche plus",
    "ne s allume plus", "bloque", "bloqué", "erreur", "probleme", "problème", "souci",
    "diagnostiquer", "diagnostic"
  ],

  transfert: [
    "transfert", "transferer", "transférer", "migration", "copier", "recuperer", "récupérer",
    "sauvegarde", "backup", "donnees", "données", "fichiers", "photos", "videos", "vidéos",
    "contacts", "messages", "ancien", "nouveau", "ancien appareil", "nouvel appareil"
  ]
};

function containsAny(normalizedQuestion, keywords) {
  return keywords.some((keyword) => normalizedQuestion.includes(normalizeText(keyword)));
}

function scoreCategory(q, groupName) {
  return keywordGroups[groupName].reduce((score, keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    return q.includes(normalizedKeyword) ? score + Math.max(1, normalizedKeyword.split(" ").length) : score;
  }, 0);
}

function getIntentText(q) {
  const intents = [];
  if (containsAny(q, keywordGroups.installation)) intents.push("installation");
  if (containsAny(q, keywordGroups.entretien)) intents.push("entretien");
  if (containsAny(q, keywordGroups.reparation)) intents.push("réparation / diagnostic");
  if (containsAny(q, keywordGroups.transfert)) intents.push("transfert de données");
  return intents.length ? `Type d’intervention détecté : ${intents.join(", ")}. ` : "";
}

function getBestCategory(q) {
  const categories = [
    "paiement", "rdv", "tarifs", "grosElectro", "petitElectro", "tv", "console",
    "pc", "antivirus", "mobile", "wifi", "cables"
  ];

  const scored = categories
    .map((category) => ({ category, score: scoreCategory(q, category) }))
    .sort((a, b) => b.score - a.score);

  return scored[0].score > 0 ? scored[0].category : null;
}

function getBotReply(input) {
  const q = normalizeText(input);
  const category = getBestCategory(q);
  const intentText = getIntentText(q);

  const replies = {
    rdv: "Pour prendre rendez-vous, cliquez sur le bouton « Prendre rendez-vous ». Vous pourrez choisir directement un créneau disponible dans le calendrier.",
    paiement: "Paiements acceptés : cash, carte bancaire sans contact uniquement et QR code Wero.",
    tarifs: "Vous pouvez consulter la section « Tarifs » du site. Le diagnostic démarre à 49 € pour le gros électroménager et 29 € pour le petit électroménager. Les pièces, licences, supports, câbles et accessoires sont toujours chiffrés séparément avant accord.",
    grosElectro: "Pour le gros électroménager, le diagnostic est entre 49 et 69 € selon la distance. Le diagnostic est déduit si la réparation est effectuée. Réparation sur devis.",
    petitElectro: "Pour le petit électroménager, le diagnostic est à 29 €. L’entretien est entre 29 et 59 €. La réparation est réalisée sur devis.",
    tv: "Pour une TV ou du multimédia : pose libre entre 49 et 69 €, pose murale uniquement sur devis, réglages entre 39 et 79 €.",
    console: "Pour une console de jeux salon ou portable : installation entre 39 et 69 €, entretien/nettoyage entre 39 et 79 €, transfert ou réglages entre 29 et 59 €.",
    pc: "Pour un ordinateur : installation PC entre 49 et 79 €, entretien/optimisation entre 39 et 79 €, transfert de données entre 49 et 89 €.",
    antivirus: "Pour l’antivirus : installation seule entre 39 et 59 €. La licence dépend de la durée, des fonctions incluses et du nombre d’appareils couverts.",
    mobile: "Pour téléphone ou tablette : mise en service de 29 à 59 €, transfert de données de 9 à 39 €, aide ou réglages de 29 à 49 €.",
    wifi: "Pour Wi‑Fi et réseau : extension Wi‑Fi entre 49 et 79 €, entretien réseau entre 39 et 69 €. Le conseil couverture est inclus si diagnostic.",
    cables: "Pour câbles et rangement : arrangement simple de 39 à 59 € pour une zone, arrangement complet de 59 à 99 € pour un meuble TV ou bureau complet."
  };

  if (category) {
    return intentText + replies[category] + " Vous pouvez ensuite cliquer sur « Prendre rendez-vous ».";
  }

  return "Je peux vous aider pour un rendez-vous, une panne, une installation, un entretien, un transfert de données, l’électroménager, une TV, une console, un PC, un antivirus, un téléphone, une tablette, le Wi‑Fi, les câbles ou les paiements. Vous pouvez aussi cliquer sur « Prendre rendez-vous ».";
}

chatbotToggle?.addEventListener("click", () => {
  const open = chatbotPanel.classList.toggle("open");
  chatbotToggle.setAttribute("aria-expanded", String(open));
});

chatbotClose?.addEventListener("click", () => {
  chatbotPanel.classList.remove("open");
  chatbotToggle.setAttribute("aria-expanded", "false");
});

document.querySelectorAll(".chatbot-quick button").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.answer;
    addChatMessage(button.textContent, "user");
    addChatMessage(chatbotAnswers[key] || "Je peux vous aider à trouver le bon service.");
  });
});

chatbotForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = chatbotInput.value.trim();
  if (!value) return;
  addChatMessage(value, "user");
  addChatMessage(getBotReply(value));
  chatbotInput.value = "";
});
