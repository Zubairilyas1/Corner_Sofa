# Storefront browser check

Start the production site with `npm run build` and `npm start`, then run `npm run test:storefront` in another terminal.

The check uses installed Google Chrome and the live local catalogue. It covers desktop and mobile layouts, search, filters, category navigation, basket changes, checkout navigation, keyboard menu dismissal and reduced motion. It does not submit an order. Screenshots are saved in `frontend/artifacts/` (ignored by Git).

Run existing unit tests with `npm test`.

Run the admin UI check with `npm run test:dashboard`. It verifies responsive layouts, chart periods, keyboard tooltips, filters, navigation, sign-in display and sign-out. Authentication responses and the populated-chart scenario are intercepted in an isolated browser; no backend records or real credentials are changed. The `admin-dashboard-populated-fixture.png` screenshot uses test data. Other admin screenshots show the existing local catalogue.
