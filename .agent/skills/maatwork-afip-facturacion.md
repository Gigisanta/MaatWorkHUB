---
name: maatwork-afip-facturacion
description: Workflows for AFIP billing integration.
---

# Facturación AFIP

1. Keep billing strictly separated by `app_id`.
2. We prepare the structures for `pyafipws` or `FacturaScripts`.
3. Invoices must be immutable once "paid" or "submitted to AFIP".
4. Generate PDFs on the fly using headless chromium or React-PDF.
