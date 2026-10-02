# Fresh Express

**Try the live app:** [freshexpress.tompuig.com](https://freshexpress.tompuig.com)

This project started as a class assignment and has been lightly adapted so it can be published and run publicly.

## What this project is

- A full-stack web application for ordering and delivering groceries.
- A REST API that serves product, cart, order, and user data.
- A data-broker layer that handles syncing product images, stats and updates between services and the database.
- An optional AI/ML component that is not part of the website deployment.

## Main features

- Browse and search products.
- Add products to a cart and complete checkout.
- User accounts for clients and delivery staff.
- Admin dashboard to manage products, orders and configuration.
- Order tracking for clients and delivery personnel.
- Image processing and bulk image update scripts in `scripts/`.

## Database configuration

The deployed app runs with a private MySQL container and two databases: `freshexpress_operacional` for users, companies, products and orders, and `freshexpress_databroker` for analytics. The web app connects through `src/lib/db.ts` using CA-verified TLS; the database port is not exposed publicly.

For the Docker deployment, runtime variables are loaded from `/root/freshexpress-web/.env` (permissions `600`):

```dotenv
DB_HOST=db
DB_PORT=3306
DB_USER=freshexpress
DB_PASSWORD=<private-password>
DB_NAME_OPERACIONAL=freshexpress_operacional
DB_NAME_BROKER=freshexpress_databroker
JWT_SECRET=<private-signing-secret>
```

Never commit actual passwords or secrets. The server's private `.env` is outside the Git checkout; the repository only provides `.env.example`. **Previously committed `.env` values remain in Git history and must be treated as exposed until rotated.**

For a **new, empty** database, the curated initialization scripts are `sql/freshexpress_completa.sql` (two schemas, six companies and 58 products), `sql/02-local-images.sql` (images from `public/img/`), and `sql/03-runtime-tables.sql` (auxiliary tables and restricted application privileges). The scripts are applied once by the Docker MySQL initialization process. Do not re-run them against existing data.

## Notes

- The ML component is not installed or required for the website.
- Password recovery by email is not implemented yet; the site does not pretend to send reset emails.
- Deployment notes: [DEPLOYMENT.md](DEPLOYMENT.md).
