# Checklist Feature — Backend Specification

## Data Model

### SQL Schema

```sql
-- A user already exists in the system.
-- Each user has exactly one checklist (created automatically on registration or first access).

CREATE TABLE checklists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE checklist_phases (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id    UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    name            VARCHAR(50),
    timeline        VARCHAR(50),
    icon            VARCHAR(50) NOT NULL DEFAULT 'pi pi-sparkles',
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (checklist_id, sort_order)
);

CREATE TABLE checklist_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id        UUID NOT NULL REFERENCES checklist_phases(id) ON DELETE CASCADE,
    title           VARCHAR(50) NOT NULL,
    note            VARCHAR(50),
    comment         VARCHAR(200),
    completed       BOOLEAN NOT NULL DEFAULT FALSE,
    priority        VARCHAR(6) NOT NULL DEFAULT 'normal'
                        CHECK (priority IN ('high', 'normal')),
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (phase_id, sort_order)
);

CREATE INDEX idx_phases_checklist ON checklist_phases(checklist_id);
CREATE INDEX idx_items_phase ON checklist_items(phase_id);
```

### Entity Relationships

```
User (1) ——> (1) Checklist ——> (N) Phase ——> (N) Item
```

### Notes on Default Data

When a checklist is created for a new user, the backend must create:
- one empty checklist
- five default phases
- zero default items

The seeded phases should use the existing wedding planning date ranges currently used on the FE:
- `12–10 months before`
- `9–7 months before`
- `6–4 months before`
- `3–1 months before`
- `Last 7 days`

For those seeded phases:
- `timeline` should be prefilled with the values above
- `name` may be `NULL` / empty by default
- `icon` should be prefilled with sensible defaults
- `items` must start as an empty array

Phase and item names are fully custom user content. The backend does not provide i18n keys for checklist names/titles/notes.

The old FE dictionary structure like:
- `checklist.phase.first_steps`
- `checklist.phase.building_team`
- `checklist.task.set_date`
- `checklist.task.budget`

should be treated as legacy and should not be part of the new checklist data contract.
Only generic UI labels such as `Expand`, `Collapse`, `Done`, and filter labels remain localized on the FE.

### Default Checklist Seeding

This seeding is backend responsibility, not frontend responsibility.

The FE should be able to call `GET /api/checklist` for a brand-new user and immediately receive a checklist with:
- 5 phases already present
- each phase collapsed by default on the FE side
- each phase containing only timeline/icon metadata initially
- no tasks/items until the user creates them

---

## Validation Rules

| Entity | Field      | Type       | Required | Max Length | Notes                          |
|--------|------------|------------|----------|------------|--------------------------------|
| Phase  | name       | string     | no       | 50         | May be empty for seeded phases |
| Phase  | timeline   | string     | no       | 50         |                                |
| Phase  | icon       | string     | yes      | 50         | PrimeIcons class, e.g. `pi pi-heart` |
| Item   | title      | string     | yes      | 50         |                                |
| Item   | note       | string     | no       | 50         |                                |
| Item   | comment    | string     | no       | 200        |                                |
| Item   | completed  | boolean    | yes      | —          | Default `false`                |
| Item   | priority   | enum       | yes      | —          | `'high'` or `'normal'`         |

All string fields must be trimmed. Empty strings should be stored as `NULL` for optional fields.

### Limits

| Constraint                | Value |
|---------------------------|-------|
| Max phases per checklist  | 20    |
| Max items per phase       | 20    |

---

## API Endpoints

All endpoints require authentication (`Authorization: Bearer <token>`). The checklist is resolved from the authenticated user (no checklist ID in URL).

Base path: `/api/checklist`

---

### 1. Get Full Checklist

```
GET /api/checklist
```

Returns the user's entire checklist with all phases and items, ordered by `sort_order`.

**Response `200 OK`:**

```json
{
  "id": "uuid",
  "phases": [
    {
      "id": "uuid",
      "name": null,
      "timeline": "12–10 months before",
      "icon": "pi pi-sparkles",
      "sortOrder": 0,
      "items": []
    }
  ]
}
```

---

### 2. Phases

#### 2.1 Create Phase

```
POST /api/checklist/phases
```

**Request Body:**

```json
{
  "name": "After-party",
  "icon": "pi pi-star",
  "timeline": "1 week before"
}
```

**Validation:**
- `name`: required for user-created phases, max 50 chars, trimmed
- `icon`: required, max 50 chars
- `timeline`: optional, max 50 chars, trimmed
- Total phases must not exceed 20

Seeded phases created automatically by the backend are the only case where `name` may be `NULL`.

**Response `201 Created`:** returns the created phase object (with empty `items` array).

#### 2.2 Update Phase

```
PATCH /api/checklist/phases/:phaseId
```

**Request Body (all fields optional):**

```json
{
  "name": "Updated Name",
  "timeline": "6-4 months before",
  "icon": "pi pi-heart"
}
```

**Validation:**
- `name`: max 50 chars, trimmed
- `timeline`: max 50 chars, trimmed
- `icon`: max 50 chars
- Phase must belong to the authenticated user's checklist

**Response `200 OK`:** returns the updated phase object.

#### 2.3 Delete Phase

```
DELETE /api/checklist/phases/:phaseId
```

Deletes the phase and all its items. Remaining phases keep their `sort_order` (no re-index required, but gaps are fine).

**Response `204 No Content`**

#### 2.4 Reorder Phases

```
PATCH /api/checklist/phases/reorder
```

**Request Body:**

```json
{
  "orderedIds": ["uuid-3", "uuid-1", "uuid-2"]
}
```

**Validation:**
- `orderedIds` must contain exactly all phase IDs belonging to the user's checklist (no extras, no missing)
- All IDs must belong to the user

**Response `200 OK`:** returns the reordered phases array.

---

### 3. Items

#### 3.1 Create Item

```
POST /api/checklist/phases/:phaseId/items
```

**Request Body:**

```json
{
  "title": "Book DJ",
  "note": "Check reviews first",
  "priority": "normal"
}
```

**Validation:**
- `title`: required, max 50 chars, trimmed
- `note`: optional, max 50 chars, trimmed
- `priority`: optional, default `'normal'`, must be `'high'` or `'normal'`
- Phase must belong to user's checklist
- Total items in phase must not exceed 30

**Response `201 Created`:** returns the created item.

#### 3.2 Update Item

```
PATCH /api/checklist/phases/:phaseId/items/:itemId
```

**Request Body (all fields optional):**

```json
{
  "title": "Updated title",
  "note": "Updated note",
  "comment": "Don't forget to call vendor",
  "completed": true,
  "priority": "high"
}
```

**Validation:**
- `title`: max 50 chars, trimmed
- `note`: max 50 chars, trimmed
- `comment`: max 200 chars, trimmed
- `completed`: boolean
- `priority`: `'high'` or `'normal'`
- Item must belong to the specified phase, which belongs to the user's checklist

**Response `200 OK`:** returns the updated item.

#### 3.3 Toggle Item Completion (convenience)

```
PATCH /api/checklist/phases/:phaseId/items/:itemId/toggle
```

Toggles `completed` field. No request body needed.

**Response `200 OK`:**

```json
{
  "id": "uuid",
  "completed": true
}
```

#### 3.4 Delete Item

```
DELETE /api/checklist/phases/:phaseId/items/:itemId
```

**Response `204 No Content`**

#### 3.5 Move / Reorder Items

Supports both reordering within a phase and moving an item to a different phase.

```
PATCH /api/checklist/items/move
```

**Request Body:**

```json
{
  "itemId": "uuid",
  "targetPhaseId": "uuid",
  "targetIndex": 2
}
```

**Validation:**
- `itemId` must belong to the user's checklist
- `targetPhaseId` must belong to the user's checklist
- `targetIndex` must be `>= 0` and `<= number of items in target phase` (after removal from source if same phase)
- If moving to a different phase, target phase must not exceed 20 items after the move

**Behavior:**
1. Remove item from its current phase at its current `sort_order`
2. Insert item into `targetPhaseId` at position `targetIndex`
3. Re-index `sort_order` for affected phases

**Response `200 OK`:** returns both affected phases with their updated items.

```json
{
  "sourcePhase": { "id": "uuid", "items": [...] },
  "targetPhase": { "id": "uuid", "items": [...] }
}
```

If source and target are the same phase, both fields reference the same phase.

---

### 4. Reset Checklist

```
POST /api/checklist/reset
```

Deletes all user's phases/items and re-seeds the checklist with the 5 default phases only.

**Response `200 OK`:** returns the full fresh checklist (same shape as `GET /api/checklist`).

---

## Error Responses

All errors follow a standard format:

```json
{
  "statusCode": 422,
  "error": "Validation Error",
  "message": "name must be at most 50 characters"
}
```

| Status | When                                                    |
|--------|---------------------------------------------------------|
| 400    | Malformed request body / invalid JSON                   |
| 401    | Missing or invalid auth token                           |
| 403    | Attempting to access another user's checklist data      |
| 404    | Phase or item not found                                 |
| 422    | Validation failure (field length, invalid enum, limits) |

---

## FE Integration Notes

### Drag & Drop

The FE uses `useDragSort` composable (Sortable.js wrapper) with `group: 'checklist-tasks'` which enables:

1. **Reorder within phase** — drag a task up/down within the same phase
2. **Move across phases** — drag a task from one phase's list into another

Both operations should call `PATCH /api/checklist/items/move` with:
- `itemId` — the dragged item
- `targetPhaseId` — the phase it was dropped into (same or different)
- `targetIndex` — the position in the target list

### Phase Expand / Collapse State

- Phase expanded/collapsed state is **frontend-only UI state**
- It is **not stored in the backend** and there is no DB column or API field for it
- The FE persists expanded phase IDs in browser `localStorage` under `wedding-checklist-expanded-phases`
- Default behavior is **all phases collapsed** until the user expands them
- The FE should prune removed phase IDs from that local state when phases are deleted

### Input Length Limits (FE enforcement)

The FE should enforce `maxlength` attributes on all inputs to match backend validation:

| Input                      | maxlength |
|----------------------------|-----------|
| Phase name                 | 50        |
| Phase timeline             | 50        |
| Task title                 | 50        |
| Task note                  | 50        |
| Task comment (textarea)    | 200       |
| Phase section name (add)   | 50        |
| New task title (add)       | 50        |

### Naming / Content Ownership

- Phase names are fully custom and should come directly from backend `name`
- Item titles, notes, and comments are fully custom and should come directly from backend fields
- FE should not depend on checklist-specific i18n keys for phase names, item titles, or item notes
- Seeded phases are distinguished by their initial timeline ranges and default icons, not by translation keys
- The user is expected to fill phase names and tasks manually; backend seeding should not create predefined checklist content beyond empty default phases with timeline/icon metadata
