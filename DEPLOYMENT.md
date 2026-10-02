# Desplegament de FreshExpress

La instància pública és [freshexpress.tompuig.com](https://freshexpress.tompuig.com). Aquest repositori conté el codi i els scripts SQL; la configuració de Docker Compose i de Caddy del servidor es manté a `/root/freshexpress-web/` i `/root/caddy/config/Caddyfile` respectivament. No cal instal·lar PM2, Nginx ni el component ML.

## Estructura i seguretat

- Astro/Node.js i MySQL 8.4 funcionen en contenidors separats. El port de MySQL no està publicat; l'aplicació es connecta per una xarxa interna amb TLS i verificació de CA.
- Les variables d'execució són a `/root/freshexpress-web/.env` (`chmod 600`), carregades amb `env_file`. No reutilitzeu el `.env` que havia estat publicat al repositori: els secrets històrics s'han de considerar exposats.
- Les dades de MySQL es conserven al directori del servidor `/root/freshexpress-web/data/mysql`. No esborreu aquest directori en una actualització.
- Caddy serveix HTTPS i fa de proxy cap al contenidor web. El DNS ha d'apuntar al servidor.

## Inicialització d'una base de dades **buida**

El procés d'inicialització de la imatge de MySQL executa, **una única vegada i en aquest ordre**:

1. `sql/freshexpress_completa.sql`: crea les bases de dades operacional i de data broker, les taules, sis empreses i 58 productes; no crea usuaris de prova ni esborra bases de dades.
2. `sql/02-local-images.sql`: assigna els logotips i les imatges locals de `public/img/` al catàleg.
3. `sql/03-runtime-tables.sql`: crea les taules auxiliars i limita els permisos de l'usuari de l'aplicació.

**No torneu a executar aquests scripts en una instància que ja tingui dades.** Per a futures modificacions de l'esquema, creeu migracions no destructives i feu una còpia de seguretat abans d'aplicar-les. L'usuari d'aplicació no té permisos per crear o esborrar taules.

## Actualització de la instància

1. Reviseu els canvis del repositori i la compatibilitat amb els ajustos locals de desplegament abans de fer un `git pull`: l'adaptador Node, la connexió TLS i altres proteccions de la instància encara tenen canvis locals al servidor.
2. Feu una còpia de seguretat: `/root/freshexpress-web/backup.sh` (també s'executa cada nit; conserveu una còpia externa xifrada).
3. Valideu Compose: `cd /root/freshexpress-web && docker compose config --quiet`.
4. Reconstruïu i reinicieu **només** el web: `docker compose build web && docker compose up -d --no-deps web`.
5. Comproveu `docker compose ps`, les rutes públiques, el registre i les imatges del catàleg. Si canvia Caddy, valideu-lo abans de recarregar-lo: `docker exec caddy caddy validate --config /etc/caddy/Caddyfile`.

No publiqueu contrasenyes, claus, arxius `.env`, còpies de seguretat o dades personals a GitHub. El registre públic crea comptes de client, mai d'administrador; l'assignació del rol d'administrador és una operació manual i restringida.
