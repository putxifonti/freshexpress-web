# Fresh Express

**Try the live app:** [freshexpress.tompuig.com](https://freshexpress.tompuig.com)

This project started as a class assignment and has been lightly adapted so it can be published and run publicly.

## What this project is

- A full-stack web application for ordering and delivering groceries.
- A REST API that serves product, cart, order, and user data.
- A data-broker layer that handles syncing product images, stats and updates between services and the database.
- A small AI/ML component (kept disabled in production) for sales predictions and product suggestions (see the `ML/` folder).

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

Never commit actual passwords or secrets. **Important:** the upstream repository currently tracks a `.env` file; do not use it for production credentials. The server's private `.env` is outside the Git checkout. Initial catalogue data and local product images are supplied by the SQL seeds and `public/img/`.

## Notes

- The AI/ML features are present under `ML/` but are disabled in production by default.
- If you need to run the ML scripts or models, follow the `ML/README.md` and install the dependencies listed in `ML/requirements.txt`.
