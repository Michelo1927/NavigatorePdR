// Algoritmo di navigazione con Dijkstra
class NavigationService {
    constructor(shops) {
        this.shops = shops;
        this.WEIGHT_SAME_RING = 1;
        this.WEIGHT_CROSS_ISLAND = 3;
        this.WEIGHT_TO_STAIRS = 2;
        this.WEIGHT_STAIRS = 10;
    }

    buildGraph() {
        const graph = {};

        // Inizializza tutti i negozi
        this.shops.forEach(shop => {
            graph[shop.id] = {};
        });

        // Inizializza nodi virtuali scale
        graph['stairs_left_p0'] = {};
        graph['stairs_left_p1'] = {};
        graph['stairs_right_p0'] = {};
        graph['stairs_right_p1'] = {};

        // Helper per aggiungere connessioni bidirezionali
        const addConnection = (id1, id2, weight) => {
            if (!graph[id1]) graph[id1] = {};
            if (!graph[id2]) graph[id2] = {};
            
            const currentWeight = graph[id1][id2] || Infinity;
            if (weight < currentWeight) {
                graph[id1][id2] = weight;
                graph[id2][id1] = weight;
            }
        };

        // 1. ANELLI - Connessioni negozi consecutivi
        const groupedByZone = {};
        this.shops.forEach(shop => {
            const key = `${shop.floor}_${shop.zone}`;
            if (!groupedByZone[key]) groupedByZone[key] = [];
            groupedByZone[key].push(shop);
        });

        Object.values(groupedByZone).forEach(shopsInZone => {
            const sorted = shopsInZone.sort((a, b) => a.position - b.position);
            for (let i = 0; i < sorted.length - 1; i++) {
                addConnection(sorted[i].id, sorted[i + 1].id, this.WEIGHT_SAME_RING);
            }
            // Chiudi l'anello
            if (sorted.length > 2) {
                addConnection(sorted[0].id, sorted[sorted.length - 1].id, this.WEIGHT_SAME_RING);
            }
        });

        // 2. ISOLE - Attraversamenti verso anello esterno
        const islandConnections = this.getIslandConnections();
        islandConnections.forEach(({ islandShop, outerShops }) => {
            const island = this.shops.find(s => s.name === islandShop);
            if (island) {
                outerShops.forEach(outerName => {
                    const outer = this.shops.find(s => s.name === outerName && s.floor === island.floor);
                    if (outer) {
                        addConnection(island.id, outer.id, this.WEIGHT_CROSS_ISLAND);
                    }
                });
            }
        });

        // 3. SCALE MOBILI
        // Scala SX Piano 0
        const scalaSxP0Neighbors = ['Pull&Bear', 'MiRaggi', 'Nyx Professional Makeup', 'Liu-Jo'];
        scalaSxP0Neighbors.forEach(name => {
            const shop = this.shops.find(s => s.name === name && s.floor === 0);
            if (shop) addConnection('stairs_left_p0', shop.id, this.WEIGHT_TO_STAIRS);
        });

        // Scala SX Piano 1
        const scalaSxP1Neighbors = ["McDonald's", 'Foot Locker', 'Jack & Jones', 'Dispensa Emilia'];
        scalaSxP1Neighbors.forEach(name => {
            const shop = this.shops.find(s => s.name === name && s.floor === 1);
            if (shop) addConnection('stairs_left_p1', shop.id, this.WEIGHT_TO_STAIRS);
        });

        // Scala DX Piano 0
        const scalaDxP0Neighbors = ['Talco', 'Jean Louis David', 'Kasanova'];
        scalaDxP0Neighbors.forEach(name => {
            const shop = this.shops.find(s => s.name === name && s.floor === 0);
            if (shop) addConnection('stairs_right_p0', shop.id, this.WEIGHT_TO_STAIRS);
        });

        // Scala DX Piano 1
        const scalaDxP1Neighbors = ['Timberland', 'Oltre', 'The Bridge', 'Melluso'];
        scalaDxP1Neighbors.forEach(name => {
            const shop = this.shops.find(s => s.name === name && s.floor === 1);
            if (shop) addConnection('stairs_right_p1', shop.id, this.WEIGHT_TO_STAIRS);
        });

        // Connessioni verticali scale
        addConnection('stairs_left_p0', 'stairs_left_p1', this.WEIGHT_STAIRS);
        addConnection('stairs_right_p0', 'stairs_right_p1', this.WEIGHT_STAIRS);

        return graph;
    }

    getIslandConnections() {
        // Connessioni isola-anello per Piano 0 e Piano 1
        return [
            // Piano 0 - Isola SX
            { islandShop: 'Piquadro', outerShops: ['Tezenis', 'MAC'] },
            { islandShop: 'GIOVANNI RASPINI', outerShops: ['MAC', 'MiRaggi'] },
            { islandShop: 'Nyx Professional Makeup', outerShops: ['MiRaggi'] },
            { islandShop: 'Liu-Jo', outerShops: ['Pull&Bear'] },
            { islandShop: 'Motivi', outerShops: ['Pull&Bear'] },
            { islandShop: 'Clayton', outerShops: ['AppleStore'] },
            { islandShop: 'Bata', outerShops: ['AppleStore'] },
            { islandShop: 'Nuna Lie', outerShops: ['Alcott'] },
            { islandShop: 'Okaidi', outerShops: ['Alcott', 'Bershka'] },
            { islandShop: 'Vicolo', outerShops: ['Bershka'] },
            { islandShop: 'Bottega Verde', outerShops: ['JD', 'Starbucks'] },
            { islandShop: "Claire's", outerShops: ['Burger King'] },
            { islandShop: 'Goldenpoint', outerShops: ['Burger King'] },
            { islandShop: 'Thun', outerShops: ['Burger King', 'Conad'] },
            { islandShop: 'La Casa de las Carcasas', outerShops: ['Conad'] },
            { islandShop: 'Centri Unico', outerShops: ['Conad'] },
            { islandShop: 'Via Condotti', outerShops: ['Conad'] },
            { islandShop: 'Solo Tempo', outerShops: ['Conad'] },
            { islandShop: 'Windtre', outerShops: ['Conad'] },
            { islandShop: '7 Camicie', outerShops: ['Conad'] },
            { islandShop: 'Yves Rocher', outerShops: ['Conad', "D'Amante"] },
            { islandShop: 'Calzedonia', outerShops: ['IUMAN-Intimissimi Uomo'] },
            { islandShop: 'Intimissimi', outerShops: ['Lush'] },
            { islandShop: 'KIKO Milano', outerShops: ['GrandVision by Avanzi'] },
            { islandShop: 'Douglas', outerShops: ['Miriade'] },
            { islandShop: 'Sandro Ferrone', outerShops: ['Carpisa'] },
            { islandShop: 'Zuiki', outerShops: ['Artigli'] },
            { islandShop: 'Nuvolari', outerShops: ['O Mai'] },
            { islandShop: 'Yamamay uomo', outerShops: ['illy Caffè', 'Dr. Martens', 'United Colors of Benetton'] },
            { islandShop: 'Yamamay', outerShops: ['Dr. Martens'] },
            { islandShop: 'Original Marines', outerShops: ['H&M'] },
            { islandShop: 'Parfois', outerShops: ['H&M'] },
            { islandShop: 'Lovable', outerShops: ['H&M'] },
            { islandShop: 'Bluespirit', outerShops: ['H&M'] },
            { islandShop: 'Fielmann', outerShops: ['Lego'] },
            { islandShop: 'Vestopazzo', outerShops: ['Lego', 'Tezenis'] },

            // Piano 0 - Isola DX
            { islandShop: 'illy Caffè', outerShops: ['Yamamay uomo', 'Rituals'] },
            { islandShop: 'Bijou Brigitte', outerShops: ['Rituals'] },
            { islandShop: 'Nespresso', outerShops: ['Barca'] },
            { islandShop: 'Swatch', outerShops: ['Snipes'] },
            { islandShop: 'Raggi', outerShops: ['Normal', 'Mediaworld', 'Flying Tiger'] },
            { islandShop: 'Machapokè', outerShops: ['Flying Tiger', 'Pasticceria Bellavia'] },
            { islandShop: 'Heikos', outerShops: ['Bialetti'] },
            { islandShop: 'Re Sole', outerShops: ['1A Clean Lavasecco'] },
            { islandShop: 'Medi Market', outerShops: ['Chic Accent Samsonite Group'] },
            { islandShop: 'Kasanova', outerShops: ['È qui Parafarmacia'] },
            { islandShop: 'Talco', outerShops: ['Jean Louis David'] },
            { islandShop: 'Douglas DX', outerShops: ['Poste Italiane'] },
            { islandShop: 'La Casa del Tabacco', outerShops: ['Poste Italiane', 'Juneco'] },
            { islandShop: 'Marlù', outerShops: ['Farinella', 'Juneco'] },
            { islandShop: 'Primadonna Collection', outerShops: ['Conad'] },
            { islandShop: 'Vodafone', outerShops: ['Conad'] },
            { islandShop: 'Gamelife', outerShops: ['Conad'] },
            { islandShop: 'Doppelganger piano 0', outerShops: ['Conad'] },
            { islandShop: 'TIM Gruppo Distribuzione Spa (piano 0)', outerShops: ['Conad'] },
            { islandShop: 'Iliad', outerShops: ['Conad'] },
            { islandShop: 'Capello point', outerShops: ['Conad'] },
            { islandShop: "D'Amante", outerShops: ['Conad', 'Yves Rocher'] },
            { islandShop: 'IUMAN-Intimissimi Uomo', outerShops: ['Calzedonia'] },
            { islandShop: 'Lush', outerShops: ['Intimissimi'] },
            { islandShop: 'GrandVision by Avanzi', outerShops: ['KIKO Milano'] },
            { islandShop: 'Miriade', outerShops: ['Douglas'] },
            { islandShop: 'Carpisa', outerShops: ['Sandro Ferrone'] },
            { islandShop: 'Artigli', outerShops: ['Zuiki'] },
            { islandShop: 'O Mai', outerShops: ['Nuvolari'] },

            // Piano 1 - Isola Center
            { islandShop: 'Guess Accessories', outerShops: ['Michael Kors', 'Poke House'] },
            { islandShop: 'Dixie', outerShops: ['Kebhouze'] },
            { islandShop: 'Solaris', outerShops: ['Kebhouze'] },
            { islandShop: 'Nike', outerShops: ['Milos Greek Food', 'Toast House'] },
            { islandShop: 'New Balance', outerShops: ['Menodiciotto'] },
            { islandShop: 'Foot Locker', outerShops: ["McDonald's"] },
            { islandShop: 'Jack & Jones', outerShops: ['Dispensa Emilia'] },
            { islandShop: 'La Piadineria', outerShops: ['Flunch'] },
            { islandShop: 'Grom', outerShops: ['Flunch', 'Foodie'] },
            { islandShop: 'Camicissima', outerShops: ['Visionottica'] },
            { islandShop: 'Legami', outerShops: ['Cisalfa Sport'] },
            { islandShop: 'Dyson', outerShops: ['Cisalfa Sport', 'Upim'] },
            { islandShop: 'Primor', outerShops: ['Upim'] },
            { islandShop: 'Stroili', outerShops: ['Upim', 'Ovs'] },
            { islandShop: 'Imperial', outerShops: ['Ovs'] },
            { islandShop: 'GrandVision by Optissimo', outerShops: ['Ovs'] },
            { islandShop: 'Funside', outerShops: ['Ovs'] },
            { islandShop: 'AS Roma', outerShops: ['Unieuro'] },
            { islandShop: 'Sottotono', outerShops: ['Unieuro'] },
            { islandShop: 'Tim piano 1', outerShops: ['Unieuro'] },
            { islandShop: 'Caporiccio', outerShops: ['Unieuro', 'Skechers', 'Prénatal'] },
            { islandShop: 'Equivalenza', outerShops: ['Prénatal', 'Chicco'] },
            { islandShop: "L'Erbolario", outerShops: ['Chicco'] },
            { islandShop: 'Cotton&Silk', outerShops: ['Chicco'] },
            { islandShop: 'Harmont & Blaine', outerShops: ['Tommy Hilfiger'] },
            { islandShop: 'Calvin Klein Jeans', outerShops: ['Alviero Martini 1A Classe'] },
            { islandShop: 'The North Face', outerShops: ['Fiorella Rubino'] },
            { islandShop: 'Geox', outerShops: ['Two Way'] },
            { islandShop: 'Timberland', outerShops: ['Oltre'] },
            { islandShop: 'Melluso', outerShops: ['The Bridge'] },
            { islandShop: 'Gioielli di Valenza', outerShops: ['Toys con te', 'MediaWorld piano 1', 'Zara Home'] },
            { islandShop: 'Dan John', outerShops: ['Oysho'] },
            { islandShop: 'Noikika', outerShops: ['Zara'] },
            { islandShop: 'Pennyblack', outerShops: ['Zara'] },
            { islandShop: "Victoria's Secret", outerShops: ['Zara'] },
            { islandShop: 'Armani Exchange', outerShops: ['Desigual'] },
            { islandShop: 'Stradivarius', outerShops: ['Max&Co.', 'Luisa Spagnoli'] },
            { islandShop: 'Coccinelle', outerShops: ['Pellizzari', 'Luisa Spagnoli'] },
            { islandShop: 'Lacoste', outerShops: ['Pellizzari'] },
            { islandShop: 'Marella', outerShops: ['Pellizzari'] },
            { islandShop: 'Camper', outerShops: ['Guess'] },
            { islandShop: 'David Naman', outerShops: ['Paul Taylor'] },
            { islandShop: 'Doppelganger piano 1', outerShops: ['Mango', 'Paul Taylor'] },
            { islandShop: 'Windtre (piano 1)', outerShops: ['Mango'] }
        ];
    }

    dijkstra(startId, endId, graph) {
        const distances = {};
        const previous = {};
        const queue = new PriorityQueue();
        const visited = new Set();

        // Inizializza distanze
        Object.keys(graph).forEach(id => {
            distances[id] = Infinity;
        });
        distances[startId] = 0;
        queue.enqueue(startId, 0);

        while (!queue.isEmpty()) {
            const { element: currentId, priority: currentDist } = queue.dequeue();

            if (visited.has(currentId)) continue;
            visited.add(currentId);

            if (currentId === endId) {
                return this.reconstructPath(previous, endId);
            }

            const neighbors = graph[currentId] || {};
            Object.entries(neighbors).forEach(([neighborId, weight]) => {
                const newDist = currentDist + weight;
                if (newDist < distances[neighborId]) {
                    distances[neighborId] = newDist;
                    previous[neighborId] = currentId;
                    queue.enqueue(neighborId, newDist);
                }
            });
        }

        return null;
    }

    reconstructPath(previous, endId) {
        const path = [];
        let current = endId;

        while (current !== undefined) {
            path.unshift(current);
            current = previous[current];
        }

        return path;
    }

    findShortestPath(startShopName, endShopName) {
        const startShop = this.shops.find(s => 
            s.name.toLowerCase() === startShopName.toLowerCase()
        );
        const endShop = this.shops.find(s => 
            s.name.toLowerCase() === endShopName.toLowerCase()
        );

        if (!startShop) {
            return { error: `Negozio di partenza non trovato: ${startShopName}` };
        }
        if (!endShop) {
            return { error: `Negozio di destinazione non trovato: ${endShopName}` };
        }
        if (startShop.id === endShop.id) {
            return { error: 'Sei già alla destinazione!' };
        }

        const graph = this.buildGraph();
        const path = this.dijkstra(startShop.id, endShop.id, graph);

        if (!path) {
            return { error: 'Nessun percorso trovato tra i due negozi' };
        }

        // Converti il percorso in steps con istruzioni
        const steps = [];
        let skipNextStair = false;

        for (let i = 0; i < path.length; i++) {
            const id = path[i];

            if (id.startsWith('stairs_')) {
                if (!skipNextStair) {
                    // Trova negozi prima e dopo le scale
                    const prevShop = i > 0 && !path[i - 1].startsWith('stairs_') 
                        ? this.shops.find(s => s.id === path[i - 1])
                        : null;

                    let nextShop = null;
                    for (let j = i + 1; j < path.length; j++) {
                        if (!path[j].startsWith('stairs_')) {
                            nextShop = this.shops.find(s => s.id === path[j]);
                            break;
                        }
                    }

                    const isGoingUp = prevShop?.floor === 0 && nextShop?.floor === 1;
                    const stairType = id.includes('left') ? 'Scale Mobili SINISTRA' : 'Scale Mobili DESTRA';
                    const instruction = isGoingUp 
                        ? `🔼 Sali con le ${stairType} verso il Piano 1`
                        : `🔽 Scendi con le ${stairType} verso il Piano 0`;

                    steps.push({
                        type: 'stair',
                        instruction,
                        isGoingUp
                    });

                    skipNextStair = true;
                } else {
                    skipNextStair = false;
                }
            } else {
                const shop = this.shops.find(s => s.id === id);
                if (shop) {
                    steps.push({
                        type: 'shop',
                        shop
                    });
                }
            }
        }

        return {
            success: true,
            startShop,
            endShop,
            steps,
            stepsCount: steps.length - 1
        };
    }
}

// Priority Queue implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;

        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }

        if (!added) {
            this.items.push(queueElement);
        }
    }

    dequeue() {
        return this.items.shift();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
