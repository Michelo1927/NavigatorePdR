# 🗺️ Navigatore Porta di Roma - Web App

Applicazione web per orientarsi facilmente all'interno del centro commerciale Porta di Roma.

## 🚀 Come usare

1. Apri il file `index.html` in un browser web moderno
2. Seleziona il negozio di partenza e destinazione
3. Clicca su "Calcola Percorso"
4. Visualizza il percorso step-by-step con indicazioni per le scale mobili

## 📁 Struttura File

```
WebApp/
├── index.html          # Interfaccia utente principale
├── styles.css          # Stili CSS con Material Design
├── data.js            # Database di 198 negozi
├── navigation.js      # Algoritmo di Dijkstra per pathfinding
├── app.js            # Logica applicazione e gestione UI
└── README.md         # Questo file
```

## ✨ Caratteristiche

- **199 negozi** mappati su 2 piani
- **Algoritmo di Dijkstra** con pesi per trovare il percorso ottimale
- **4 scale mobili** (2 sistemi: sinistra e destra)
- **Autocomplete intelligente** per ricerca negozi
- **Responsive design** ottimizzato per desktop e mobile
- **Nessuna dipendenza esterna** - funziona offline

## 🎨 Design

- Material Design 3
- Colori: Blu (#1976D2), Verde (#388E3C), Arancione (#F57C00)
- Icone emoji per una UI intuitiva
- Animazioni fluide

## 🧮 Algoritmo

Il navigatore utilizza l'**algoritmo di Dijkstra** con grafo pesato:

- **Peso 1**: negozi consecutivi sullo stesso anello
- **Peso 3**: attraversamento verso isola
- **Peso 2**: camminata verso scale mobili
- **Peso 10**: salire/scendere le scale (verticale)

## 📱 Compatibilità

- ✅ Chrome, Edge, Firefox, Safari
- ✅ Mobile e Desktop
- ✅ Funziona offline (no server richiesto)

## 🔧 Personalizzazione

Per modificare i negozi o le connessioni:

1. Modifica `data.js` per aggiornare la lista negozi
2. Modifica `navigation.js` nella funzione `getIslandConnections()` per le connessioni isola-anello
3. Modifica le scale mobili nella funzione `buildGraph()`

## 📝 Licenza

Creato per uso personale - Porta di Roma Shopping Center Navigation

---

**Sviluppato con ❤️ per facilitare lo shopping a Porta di Roma**

