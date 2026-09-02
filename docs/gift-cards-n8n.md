# Gift Cards · integración n8n

Foodie es la fuente de verdad. n8n solo consulta productos, crea órdenes y consulta el estado.

Base URL: `https://api.tu-dominio.com/v1`

Header obligatorio:

```http
x-api-key: FOODIE_RESTAURANT_API_KEY
```

## Catálogo

```http
GET /external/gift-cards/products
```

Usar únicamente los productos devueltos. No inventar precios, personas, vigencia o restricciones.

## Crear orden

```http
POST /external/gift-cards/orders
Idempotency-Key: {{$json.phone}}-{{$json.timestamp}}
Content-Type: application/json
```

```json
{
  "productId": "prod_123",
  "type": "FIXED_MENU",
  "purchaserName": "Juan Pérez",
  "purchaserPhone": "+549...",
  "recipientName": "María Gómez",
  "message": "Feliz cumpleaños",
  "partySize": 2
}
```

Para una Gift Card a la carta, enviar `type: OPEN_AMOUNT` y `amount`.

## Consultar estado

```http
GET /external/gift-cards/orders/:orderId
```

Entregar archivos únicamente cuando `order.status` sea `PAID` y `order.giftCard.status` sea `ACTIVE`.

Estados:

- `PENDING_PAYMENT`: todavía no confirmado.
- `PAID`: Gift Card emitida y disponible.
- `CANCELLED`: no entregar.

El workflow puede consultar la orden cada 1–2 minutos después de informar las instrucciones de transferencia. El mensaje del cliente no confirma el pago.
