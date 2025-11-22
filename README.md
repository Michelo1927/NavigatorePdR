# 🗺️ Mall Nav

Sistema di navigazione intelligente per centri commerciali che permette di trovare il percorso più breve tra i negozi.

## ✨ Caratteristiche Principali

### 🏢 Multi-Centro Commerciale
- **Selezione Centro**: Gli utenti possono scegliere tra diversi centri commerciali
- **Dati Dinamici**: Ogni centro ha i propri negozi, piani e scale mobili
- **Espandibile**: Facile aggiungere nuovi centri commerciali

### 🎯 Navigazione Intelligente
- **Algoritmo Dijkstra**: Calcola il percorso più breve tra due negozi
- **Multi-Piano**: Gestisce percorsi tra piani diversi con scale mobili
- **Zone Multiple**: Supporta anelli esterni e isole interne

### 💾 Persistenza
- Salva l'ultimo centro commerciale selezionato in localStorage
- Riapre automaticamente l'ultimo centro utilizzato

## 🏗️ Struttura Dati

### Centri Commerciali (`MALLS_CONFIG`)
```javascript
{
    id: 'porta_di_roma',
    name: 'Porta di Roma',
    location: 'Roma, Italia',
    description: 'Il più grande centro commerciale di Roma',
    floors: 2,
    escalators: 4,
    totalShops: 199,
    logo: '🏛️'
}
```

### Negozi (`MALLS_DATA`)
```javascript
{
    id: 'p0_outer_1',
    name: 'Nitò',
    floor: 0,
    zone: 'OUTER',
    position: 1
}
```

## 🚀 Come Aggiungere un Nuovo Centro Commerciale

### 1. Aggiungi la Configurazione
In `data.js`, aggiungi un nuovo elemento in `MALLS_CONFIG`:

```javascript
{
    id: 'nuovo_centro',
    name: 'Nome Centro',
    location: 'Città, Italia',
    description: 'Descrizione del centro',
    floors: 2,
    escalators: 4,
    totalShops: 150,
    logo: '🏬'
}
```

### 2. Aggiungi i Dati dei Negozi
In `data.js`, aggiungi i negozi in `MALLS_DATA`:

```javascript
'nuovo_centro': [
    { id: 'nc_p0_1', name: 'Zara', floor: 0, zone: 'OUTER', position: 1 },
    { id: 'nc_p0_2', name: 'H&M', floor: 0, zone: 'OUTER', position: 2 },
    // ... altri negozi
]
```

### 3. Personalizza le Connessioni (opzionale)
In `navigation.js`, se il layout del nuovo centro è diverso, puoi personalizzare:
- Pesi delle connessioni
- Posizioni delle scale mobili
- Connessioni isola-anello nella funzione `getIslandConnections()`

## 📁 Struttura File

```
WebApp/
├── index.html          # Interfaccia utente con selezione mall
├── styles.css          # Stili CSS responsive
├── data.js            # Configurazione centri e negozi
├── navigation.js      # Algoritmo di pathfinding (Dijkstra)
├── app.js            # Logica applicazione e gestione UI
├── cookie-consent.js  # Gestione cookie GDPR
├── privacy.html       # Privacy policy
└── README.md         # Documentazione
```

## 🎨 Design

- Design moderno e responsive
- Material Design inspired
- Animazioni fluide
- Card interattive per selezione centro
- Supporto mobile ottimizzato
- Dark mode friendly

## 🧮 Algoritmo di Navigazione

Il navigatore utilizza l'**algoritmo di Dijkstra** con grafo pesato:

### Pesi Percorso
- **Stesso anello**: 1 (percorso ottimale)
- **Attraversamento isola**: 3 (percorso medio)
- **Verso scale**: 2 (avvicinamento scale)
- **Salire/scendere scale**: 10 (cambio piano)

### Zone Supportate
- `OUTER`: Anello esterno
- `ISLAND_SX`: Isola sinistra (Piano 0)
- `ISLAND_DX`: Isola destra (Piano 0)
- `ISLAND_CENTER`: Isola centrale (Piano 1)

## 🔮 Centri Commerciali Disponibili

### ✅ Porta di Roma
- 199 negozi mappati
- 2 piani
- 4 scale mobili
- Completamente operativo

### 🔜 Centro Sicilia (In Sviluppo)
- Dati di esempio presenti
- Da popolare con negozi reali

### 🔜 Altri Centri (Prossimamente)
- Sistema pronto per espansione
- Placeholder per nuovi centri

## 📱 Compatibilità

- ✅ Chrome, Edge, Firefox, Safari
- ✅ Mobile e Desktop
- ✅ Progressive Web App ready
- ✅ Funziona offline (dopo primo caricamento)
- ✅ SEO ottimizzato

## 🔧 Configurazione

### Local Storage
L'app salva automaticamente:
- Centro commerciale selezionato
- Preferenze cookie (GDPR)

### Cookie Policy
- Cookie tecnici per funzionalità base
- Google AdSense per monetizzazione (opzionale)
- Banner GDPR compliant

## 🚀 Deploy

### Hosting Statico
Il progetto è 100% statico e può essere hostato su:
- Netlify
- Vercel
- GitHub Pages
- Qualsiasi hosting HTML/CSS/JS

### Configurazione SEO
Tutti i meta tag sono già configurati in `index.html`:
- Open Graph (Facebook)
- Twitter Cards
- Meta description dinamici per ogni centro

## 📱 Versione App Mobile

Il sistema è progettato per essere facilmente convertibile in un'app mobile nativa:
- Struttura dati pronta
- Logica separata da UI
- API ready per backend futuro

## 🔐 Privacy & GDPR

- Privacy policy inclusa
- Cookie consent banner
- Compliant con normativa europea
- Dati salvati solo in localStorage (client-side)

## 🎯 Roadmap

- [x] Sistema multi-centro commerciale
- [x] Selezione dinamica centri
- [x] Persistenza scelta utente
- [ ] Aggiungere più centri commerciali
- [ ] Mappe visive interattive
- [ ] App mobile nativa (iOS/Android)
- [ ] Sistema feedback utenti
- [ ] Supporto multilingua
- [ ] Integrazione con servizi del centro (eventi, offerte)
- [ ] AR navigation (Realtà Aumentata)

## 🤝 Contribuire

Per aggiungere un nuovo centro commerciale:

1. Raccogli i dati dei negozi (nome, piano, posizione)
2. Mappa le zone (anelli, isole)
3. Identifica le scale mobili
4. Aggiungi i dati in `data.js`
5. Testa il pathfinding

## 📞 Supporto

Per segnalazioni o richieste:
- Apri una issue su GitHub
- Contatta via email

---

**Sviluppato con ❤️ per facilitare lo shopping nei centri commerciali**

© 2025 Mall Nav - Tutti i diritti riservati
