# ALASHI operations

ALASHI is the Corner Sofa assistant. The owner strategy is `../reference-designs/rules-for-alashi.md`; its rules are implemented in `src/lib/alashi-rules.ts`. Existing green/cream storefront styling and sofa icon are reused. Reference HTML pages describe store pages rather than an AI chat design.

## Setup

Set these variables in the **server** environment (never NEXT_PUBLIC variables):

```
OPENAI_API_KEY=your-server-key
ALASHI_CHAT_MODEL=gpt-4.1-mini
```

Rebuild/restart after configuration. No API key is bundled. The connected OpenAI account must have access to the configured chat model and image generation tool, with billing enabled. The provider uses the Responses API with `store: false`; chat/photo/document requests and explicit image generation are separate. No real paid generation was performed during implementation.

Visit `/admin/alashi/`: add category ranges for all six sofa categories; add/edit/delete approved knowledge; answer the owner inbox. Product editor includes an independently saved AI range: new products use their category default, existing products can override it. Ranges do not change the checkout selling price. Without a custom range, the live catalogue selling price is used. Negotiation stays disabled unless a private minimum is configured. Generated designs are illustrative and use the selected real product's current range.

Learning means runtime access to owner-approved knowledge, not model weight training. Customer input never becomes approved knowledge automatically. Unknown text questions are stored in the admin inbox; no email or WhatsApp notification is sent automatically. Answers become available on the next request. Uploaded customer files are forwarded to the AI provider for that request and are not saved on this server. The browser keeps the last attachment in memory for a custom design. Clearing/reloading the page clears it. Owner knowledge documents support TXT/MD/CSV; customer documents support PDF/TXT/MD/CSV, and photos JPG/PNG/WebP, up to 5 MB.

Without an API key, fixed policy answers, simple catalogue matching, exact approved-question lookup and the owner inbox work. Photo understanding and custom images require the key. General AI replies are probabilistic: the business instructions constrain the model, and displayed price cards are computed by the server from approved ranges, not model output.

## Persistence and deployment

With DATABASE_URL, ALASHI creates `alashi_records` and `alashi_limits` tables. Otherwise records are atomic JSON files under `.local-data/alashi` (or ALASHI_DATA_DIR / PRODUCT_DATA_DIR). Use persistent storage or PostgreSQL in production. Back up this data. Admin APIs require the signed admin session cookie. Configure a strong ADMIN_PASSWORD and TOKEN_SECRET before public deployment.

Requests are limited to 30 chat and 3 image requests per hour per client IP. Configure your reverse proxy to replace untrusted x-forwarded-for headers. PostgreSQL limits are shared across instances; local fallback limits are per-process and reset on restart. Use provider spending limits and an edge rate limiter for a public deployment. Routes have request byte limits and decoded image pixel limits; uploads cannot modify policy or knowledge. Keep private information out of the customer-facing knowledge base.

## Business reference interpretation

Owner rules always take precedence. Imported principles are concise needs discovery, verified product visuals/details, transparent delivery, and explaining verified value while server code controls negotiated offers. Financing, unverified urgency and marketing promises are excluded. The newer owner rules explicitly authorize gradual negotiation down to a private minimum.

- [Cylindo: furniture marketing](https://blog.cylindo.com/furniture-marketing-strategies-to-drive-sales): visual presentation and product context.
- [Convertcart: furniture sales](https://www.convertcart.com/blog/increase-online-furniture-store-sales): concise product details and clear delivery information.
- [EasyApps: furniture ecommerce](https://easyappsecom.com/guides/shopify-furniture-ecommerce-guide): room visualization and buying confidence.
- [Apimio supplied link](https://apimio.com/furniture-marketing-ideas): redirected to its homepage; no missing article claims imported.
- [Richardson: consultative negotiation](https://www.richardson.com/blog/modern-sales-negotiations/): needs discovery and clear next steps. Trading/concession tactics excluded.
- [Vengreso: sales negotiation](https://vengreso.com/blog/sales-negotiation) and [BATD: retail negotiation](https://batdacademy.com/en/post/effective-negotiation-strategies-to-increase-sales-in-retail-management): reviewed as secondary context; no permission to negotiate imported.

API references: [Responses image tool](https://developers.openai.com/api/docs/guides/tools-image-generation), [file inputs](https://developers.openai.com/api/docs/guides/file-inputs).

## Updated rules implementation

- Admin supports private minimum offers, exact/outward postcode delivery charges, and product-specific warranty/material/colour details. Private minima never enter customer JSON, signed tokens or AI prompts.
- Offers use a server signature and expire after 24 hours. Set ALASHI_SIGNING_SECRET persistently. Modified prices, different variants, expired signatures and changed catalogue prices are rejected at checkout.
- /alashi-checkout combines basket items, validates prices and quantities, adds postcode delivery and £20 assembly, saves a pending Cash on Delivery order to the existing order store and produces a printable challan. No payment is collected online. Existing unrelated checkout routes are not rewritten.
- /alashi-appointment saves visit requests to the ALASHI admin inbox; owner confirmation is required. No automatic external message is sent.
- The chat keeps its current size and bottom-right launcher, uses the purple open-panel design, and shows a minimum three-second typing state. Explicit image requests use their own selected product, reference and latest instructions.
- Identity answers truthfully identify ALASHI as an AI assistant. Cancellation/return questions go to the owner without claiming statutory rights are removed.
- Config examples in the owner rules, including the example £600–£1000 range, are not seeded as real business prices. Postcode zones, warranties and private minima must be supplied by the owner.

## September 14 conversation update
Additional source: `reference-designs/newrequitment (1).md`.
Intent routing now precedes catalogue fallback. Signed conversation context tracks selected/shown products, offers, colour, summary/checkout stage, last answer and image hash. Confirmation produces a structured summary before checkout, not a repeated card. Only checkout creates an order; existing Orders dashboard receives it, while complaints go to the ALASHI owner inbox and appointments to its appointment list.
Negotiation halves the gap toward the owner-entered private floor and reaches the floor after repeated requests. No floor is invented. Current admin records and catalogue are read on each request. Clear resets context, requests, attachments and visible history; Save exports TXT. Tab-scoped session storage restores text/context after refresh (uploaded files and generated image bytes are not persisted). A synchronous request lock prevents double-click sends, and cancelled/reset responses cannot revive cleared state.
All 100 supplied phrases are exercised against a selected-product conversation in automated route tests, plus explicit checkout progression and mixed greeting regressions. These checks do not replace a paid-provider acceptance pass. OPENAI_API_KEY is still required for semantic photo interpretation and fresh generated concepts; local fallback replies use deterministic phrasing with consecutive-repeat avoidance. No model weights are trained.
