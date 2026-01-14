# API del Data Broker - Documentació Tècnica

## 📊 Visió General

El Data Broker és un sistema d'analítica que recopila, procesa i visualitza dades d'ús de la plataforma FreshExpress. Utilitza una arquitectura de **dues bases de dades** separades per mantenir les dades operacionals i les dades analítiques aïllades.

---

## 🏗️ Arquitectura de Bases de Dades

### **Base de Dades 1: freshexpress_operacional**

- **Propòsit**: Dades transaccionals de l'aplicació principal
- **Contingut**: Usuaris, productes, comandes, empreses, repartidors
- **Ús**: Operacions CRUD del negoci diari

### **Base de Dades 2: freshexpress_data_broker**

- **Propòsit**: Dades analítiques i tracking d'esdeveniments
- **Contingut**: Sessions web, esdeveniments de navegació, mètriques d'ús
- **Ús**: Anàlisi de comportament d'usuaris, business intelligence

---

## 🔄 Sistema de Recopilació de Dades

### **Client-Side Tracking**

El sistema utilitza JavaScript al navegador per capturar esdeveniments d'usuari en temps real. Els esdeveniments es capturen mitjançant:

1. **Event Listeners**: Escolten clics, navegació, interaccions amb formularis
2. **Beacons**: Envien dades de forma no bloquejant al servidor
3. **Session Management**: Gestiona identificadors únics de sessió per usuari

### **Tipus d'Esdeveniments Capturats**

El sistema registra diversos tipus d'esdeveniments classificats per categoria:

- **Navegació**: Visites a pàgines, temps de permanència, rutes
- **Productes**: Clics en productes, visualitzacions, comparacions
- **Transaccions**: Afegir al carret, inici de checkout, compres completades
- **Interaccions**: Cerca, filtratge, ordenació, zoom d'imatges
- **Sistema**: Temps de càrrega, errors, warnings del navegador

---

## 🛠️ Estructura de l'API REST

### **Organització per Endpoints**

L'API del Data Broker està organitzada per dominis funcionals:

- **General**: Estadístiques globals de la plataforma
- **Productes**: Mètriques relacionades amb catàleg i inventari
- **Usuaris**: Anàlisi de comportament i demografia
- **Tracking**: Dades detallades d'esdeveniments individuals

### **Autenticació i Autorització**

Tots els endpoints del Data Broker requereixen:

1. **Token JWT**: Verificació d'identitat mitjançant cookie
2. **Rol d'Administrador**: Només usuaris amb rol `admin` poden accedir
3. **Validació de Sessions**: Comprovació que la sessió està activa

### **Filtres Temporals**

L'API permet filtrar dades per períodes de temps:

- Últimes 24 hores
- Últims 7 dies
- Últims 30 dies
- Últims 90 dies
- Tot l'històric

Aquests filtres s'apliquen tant a la base de dades operacional com a la de tracking.

---

## 📈 Processament de Dades

### **Agregació i Càlculs**

L'API realitza diversos càlculs estadístics:

- **Sumes**: Ingressos totals, unitats venudes, nombre de sessions
- **Mitjanes**: Temps mitjà de sessió, valor mitjà de comanda
- **Comptes**: Usuaris únics, productes visualitzats, esdeveniments registrats
- **Percentatges**: Taxa de conversió, percentatge per categoria
- **Creixements**: Comparació de períodes anteriors

### **Joins de Bases de Dades**

L'API combina informació de les dues bases de dades:

- Esdeveniments de tracking amb dades de productes reals
- Sessions web amb informació d'usuaris registrats
- Mètriques de navegació amb dades de vendes

Això permet obtenir una visió completa del comportament d'usuaris relacionant accions amb resultats de negoci.

---

## 🔒 Privacitat i Seguretat

### **Anonimització de Dades**

El sistema implementa mesures de privacitat:

- Sessions generades amb IDs únics no reversibles
- No es guarden dades personals identificables al tracking
- Consentiment d'usuari per participar al Data for Good
- Aggregació de dades abans de mostrar-les

### **Control d'Accés**

L'API implementa múltiples capes de seguretat:

- Validació de tokens a cada petició
- Verificació de rols d'usuari
- Rate limiting per evitar abusos
- Logs d'accés a dades sensibles

---

## 📊 Format de Resposta

### **Estructura JSON Estandarditzada**

Totes les respostes de l'API segueixen un format consistent:

- **success**: Booleà indicant si la petició ha tingut èxit
- **data**: Objecte o array amb les dades sol·licitades
- **metadata**: Informació addicional (període, filtres aplicats)
- **error**: Missatge d'error en cas de fallada

### **Paginació**

Els endpoints que retornen llistes implementen:

- Límit màxim de resultats per pàgina
- Ordenació per criteris rellevants (més venuts, més recents)
- Filtres opcionals per afinar resultats

---

## 🚀 Rendiment i Optimització

### **Caching**

L'API utilitza estratègies de caching per millorar el rendiment:

- Resultats de consultes complexes es guarden temporalment
- Invalidació automàtica quan hi ha noves dades
- Cache a nivell de base de dades per queries freqüents

### **Queries Optimitzades**

Les consultes SQL estan optimitzades per:

- Utilitzar índexs en columnes freqüentment cercades
- Limitar resultats amb LIMIT per evitar sobrecàrrega
- Agregacions al servidor en lloc del client
- Subqueries eficients per joins complexes

---

## 📡 Comunicació Client-Servidor

### **Tracking Asíncron**

L'enviament d'esdeveniments utilitza:

- Beacons per no bloquejar la navegació
- Cua local per enviar en batch
- Retry automàtic en cas de fallada de xarxa
- Envío just abans de tancar la pàgina

### **Actualització de Dashboard**

El dashboard de Data Broker:

- Carrega dades de forma asíncrona per secció
- Mostra loaders mentre processa
- Actualitza gràfics de forma reactiva
- Permet refresc manual amb botó d'actualització

---

## 🎯 Casos d'Ús

### **Anàlisi de Comportament**

L'API permet respondre preguntes com:

- Quins productes es visualitzen més però no es compren?
- Quin és el recorregut típic d'un usuari abans de comprar?
- A quina hora del dia hi ha més activitat?
- Quins navegadors i dispositius utilitzen els usuaris?

### **Business Intelligence**

Les dades permeten prendre decisions basades en:

- Rendiment de categories de productes
- Eficàcia de campanyes i promocions
- Patrons estacionals de vendes
- Identificació de productes populars

### **Data for Good**

Els usuaris que consenten compartir dades contribueixen a:

- Investigació sobre hàbits alimentaris sostenibles
- Anàlisi de preferències per productes ecològics
- Estudis sobre reducció de malbaratament alimentari
- Millora de la plataforma basada en ús real

---

## 🔧 Manteniment i Escalabilitat

### **Gestió de Volum de Dades**

El sistema està dissenyat per escalar:

- Particionament de taules per dates
- Arxivat automàtic de dades antigues
- Compressió de registres històrics
- Purga configurable de sessions anònimes

### **Monitorització**

L'API inclou mecanismes de:

- Logs estructurats per debugging
- Mètriques de rendiment de queries
- Alertes per errors crítics
- Comprovació de salut de connexions

---

## 📝 Conclusions

L'API del Data Broker proporciona una infraestructura robusta per:

- Recopilar dades d'ús de forma no invasiva
- Processar grans volums d'esdeveniments
- Generar insights accionables per al negoci
- Respectar la privacitat dels usuaris
- Escalar amb el creixement de la plataforma

El sistema separa clarament les responsabilitats entre dades operacionals i analítiques, permetent evolucionar cada part de forma independent mentre manté la integritat de les dades.
