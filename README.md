# Fresh Express

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

## Deployment

The application is deployed on a single Oracle VPS. The backend connects to a MySQL database hosted on the same VPS. SQL queries are executed from the backend code (see `src/lib/db.ts` for the connection helper). The production site is reachable at:

- https://www.fresh-express.tompuig.com

## Database configuration (example)

Do not commit real credentials. Put your real config in a file that is ignored (for example `.env`) and keep the repository one safe. Example configuration values (invented):

```
DB_HOST=db.fresh-express.internal
DB_PORT=3306
DB_USER=freshexpress_user
DB_PASSWORD=ExamplePass!234
DB_NAME=freshexpress_db
```

The project includes a database helper at `src/lib/db.ts` that reads these environment variables. In the repo the actual credentials file is ignored by `.gitignore`.

## Accounts for testing

- Client user: Yusleidy@gmail.com
- Delivery user: Wilmer@gmail.com
- Password for both accounts: QWer123$

## Notes

- The AI/ML features are present under `ML/` but are disabled in production by default.
- If you need to run the ML scripts or models, follow the `ML/README.md` and install the dependencies listed in `ML/requirements.txt`.

If you want, I can add setup steps, deployment scripts or a `.env.example` next.
