# Budget API — Frontend Reference

All endpoints require `Authorization: Bearer <accessToken>` header.
Base URL: `/api`

A default budget is automatically created for each user on registration (`budgetLimit: 0`, `currency: "BYN"`).

---

## Budget

### GET `/api/budget`

Returns the user's full budget with all sections and items.

**Response** `200 OK`

```json
{
  "id": 1,
  "budgetLimit": 500000,
  "currency": "BYN",
  "sections": [
    {
      "id": 1,
      "name": "Организация",
      "items": [
        {
          "id": 1,
          "name": "Ведущий",
          "estimatedCost": 50000,
          "actualCost": null,
          "priority": "must",
          "paid": false
        }
      ]
    }
  ]
}
```

---

### PATCH `/api/budget`

Updates budget limit and/or currency. All fields are optional.

**Request body**

| Field         | Type     | Required | Validation             |
|---------------|----------|----------|------------------------|
| `budgetLimit` | integer  | no       | >= 0                   |
| `currency`    | string   | no       | `"RUB"`, `"USD"`, `"BYN"` |

```json
{ "budgetLimit": 500000, "currency": "USD" }
```

**Response** `200 OK` — full budget object (same shape as GET).

---

## Sections

**Limits:** max 30 sections per budget.

### POST `/api/budget/sections`

Creates a new section.

**Request body**

| Field  | Type   | Required | Validation                    |
|--------|--------|----------|-------------------------------|
| `name` | string | yes      | 1–50 characters, trimmed      |

```json
{ "name": "Банкет" }
```

**Response** `201 Created` — full budget object.

**Errors:**
- `409 Conflict` — max 30 sections reached.

---

### PATCH `/api/budget/sections/:id`

Updates a section.

**Request body**

| Field  | Type   | Required | Validation                    |
|--------|--------|----------|-------------------------------|
| `name` | string | no       | 1–50 characters, trimmed      |

```json
{ "name": "Новое название" }
```

**Response** `200 OK` — full budget object.

**Errors:**
- `404 Not Found` — section does not exist.
- `403 Forbidden` — section belongs to another user.

---

### DELETE `/api/budget/sections/:id`

Deletes a section and all its items (cascade).

**Response** `204 No Content`

**Errors:**
- `404 Not Found` — section does not exist.
- `403 Forbidden` — section belongs to another user.

---

## Items

**Limits:** max 20 items per section.

### POST `/api/budget/items`

Creates a new item in a section.

**Request body**

| Field           | Type    | Required | Default   | Validation              |
|-----------------|---------|----------|-----------|-------------------------|
| `sectionId`     | integer | yes      | —         |                         |
| `name`          | string  | yes      | —         | 1–50 characters, trimmed |
| `estimatedCost` | integer | no       | `0`       | >= 0                    |
| `priority`      | string  | no       | `"must"`  | `"must"`, `"want"`, `"maybe"` |

```json
{
  "sectionId": 1,
  "name": "Аренда зала",
  "estimatedCost": 150000,
  "priority": "must"
}
```

**Response** `201 Created` — full budget object.

**Errors:**
- `404 Not Found` — section does not exist.
- `403 Forbidden` — section belongs to another user.
- `409 Conflict` — max 20 items in section reached.

---

### PATCH `/api/budget/items/:id`

Updates an item. All fields are optional.

**Request body**

| Field           | Type            | Required | Validation              |
|-----------------|-----------------|----------|-------------------------|
| `name`          | string          | no       | 1–50 characters, trimmed |
| `estimatedCost` | integer         | no       | >= 0                    |
| `actualCost`    | integer \| null | no       | >= 0, send `null` to clear |
| `priority`      | string          | no       | `"must"`, `"want"`, `"maybe"` |
| `paid`          | boolean         | no       |                         |

```json
{
  "name": "Ведущий",
  "estimatedCost": 50000,
  "actualCost": 45000,
  "priority": "want",
  "paid": true
}
```

**Response** `200 OK` — full budget object.

**Errors:**
- `404 Not Found` — item does not exist.
- `403 Forbidden` — item belongs to another user.

---

### DELETE `/api/budget/items/:id`

Deletes an item.

**Response** `204 No Content`

**Errors:**
- `404 Not Found` — item does not exist.
- `403 Forbidden` — item belongs to another user.

---

## Common Errors

| Status | Meaning                                   |
|--------|-------------------------------------------|
| `401`  | Missing or invalid access token           |
| `403`  | Resource belongs to another user          |
| `404`  | Resource not found                        |
| `409`  | Limit exceeded (sections or items)        |