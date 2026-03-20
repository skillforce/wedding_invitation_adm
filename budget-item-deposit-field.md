# Budget Item: `deposit` Field

## Overview

A new optional `deposit` field has been added to budget items. It represents a partial prepayment made for a budget item.

## API Changes

### GET `/budget`

The budget item object now includes a `deposit` field:

```json
{
  "id": 1,
  "name": "Аренда зала",
  "estimatedCost": 50000,
  "actualCost": null,
  "deposit": null,
  "priority": "must",
  "paid": false
}
```

| Field     | Type             | Default |
|-----------|------------------|---------|
| `deposit` | `number \| null` | `null`  |

### POST `/budget/items` — Create item

`deposit` can now be passed on creation (optional):

```json
{
  "sectionId": 1,
  "name": "Ведущий",
  "deposit": 10000
}
```

### PATCH `/budget/items/:id` — Update item

`deposit` can be updated or cleared:

```json
{ "deposit": 10000 }
```

To clear the value, send `null`:

```json
{ "deposit": null }
```

## Validation

- Must be an integer (`422` returned otherwise)
- Must be `>= 0`
- Optional — omitting the field leaves the current value unchanged