# Contribuir a FreshExpress

Gràcies pel teu interès en contribuir a FreshExpress! 🌱

## Com contribuir

### Reportar bugs

Si trobes un bug, si us plau obre una issue amb:

- Descripció clara del problema
- Passos per reproduir-lo
- Comportament esperat vs comportament actual
- Captures de pantalla si és aplicable
- Informació del sistema (navegador, SO, etc.)

### Suggerir funcionalitats

Les idees noves són benvingudes! Obre una issue amb:

- Descripció de la funcionalitat
- Cas d'ús / problema que resol
- Possibles implementacions (opcional)

### Enviar Pull Requests

1. **Fork** el repositori
2. **Clona** el teu fork:
   ```bash
   git clone https://github.com/putxifonti/freshexpress-web-publicado
   ```
3. **Crea una branca** per la teva feature:
   ```bash
   git checkout -b feature/la-meva-funcionalitat
   ```
4. **Fes els canvis** i assegura't que:
   - El codi segueix l'estil del projecte
   - Has afegit tests si és necessari
   - La documentació està actualitzada
5. **Commit** els canvis:
   ```bash
   git commit -m "feat: afegeix nova funcionalitat X"
   ```
6. **Push** a la teva branca:
   ```bash
   git push origin feature/la-meva-funcionalitat
   ```
7. **Obre una Pull Request** amb una descripció clara dels canvis

## Estil de codi

### Convencions generals

- Utilitza TypeScript sempre que sigui possible
- Segueix les convencions d'Astro per als components
- Utilitza Tailwind CSS per als estils
- Els noms de variables i funcions en anglès
- Els comentaris i UI en català

### Format de commits

Seguim [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalitat
- `fix:` - Correcció de bugs
- `docs:` - Canvis en documentació
- `style:` - Format (no afecta el codi)
- `refactor:` - Refactorització de codi
- `test:` - Afegir o modificar tests
- `chore:` - Manteniment general

### Exemples:

```
feat: afegeix sistema de valoracions per repartidors
fix: corregeix error en el càlcul del total de la cistella
docs: actualitza README amb noves instruccions
```

## Estructura del projecte

```
src/
├── components/     # Components reutilitzables
├── layouts/        # Layouts de pàgina
├── lib/            # Utilitats i helpers
├── pages/          # Pàgines i API routes
│   ├── api/        # Endpoints REST
│   ├── admin/      # Pàgines d'administrador
│   └── repartidor/ # Pàgines de repartidor
└── styles/         # Estils globals
```

## Desenvolupament local

1. Instal·la dependències:

   ```bash
   npm install
   ```

2. Configura les variables d'entorn:

   ```bash
   cp .env.example .env
   ```

3. Executa el servidor de desenvolupament:

   ```bash
   npm run dev
   ```

4. Obre http://localhost:4321

## Tests

```bash
# Executar tots els tests
npm run test

# Tests amb watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Base de dades

Per a desenvolupament local, necessites MySQL 8.0+:

```bash
# Crear la base de dades
mysql -u root -p < sql/freshexpress_completa.sql
```

## Preguntes?

Si tens dubtes, pots:

- Obrir una issue amb l'etiqueta `question`
- Contactar amb l'equip a info@freshexpress.cat

Gràcies per contribuir! 💚
