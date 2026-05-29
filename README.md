# German Genre API

A lightweight Express + PostgreSQL API for serving German vocabulary data.

The API supports:

* Random word generation
* Daily rotating word selection
* Search endpoints
* Cooldown system preventing recent daily word repetition
* TypeScript + ESM architecture

---

# Stack

* TypeScript
* Express
* PostgreSQL
* node-postgres (`pg`)
* express-rate-limit
* CORS

---

# Project Structure

```txt
.
├── app.ts
├── index.ts
├── package.json
├── tsconfig.json
├── pool
│   └── pool.ts
└── routes
    ├── dailyWord.ts
    ├── random.ts
    ├── search.ts
    └── words.ts
```

---

# Installation

## Clone the repository

```bash
git clone <repository-url>
cd german-genre-api
```

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_postgres_connection_string
PORT=3000
```

Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/german_api
```

---

# Database Schema

## `dictionary`

Expected structure:

```sql
CREATE TABLE dictionary (
    id uuid PRIMARY KEY,
    lemma text NOT NULL,
    forms text,
    genres text,
    english text
);
```

---

## `daily_words`

```sql
CREATE TABLE daily_words (
    day date NOT NULL,
    word_id uuid NOT NULL,
    created_at timestamp DEFAULT now(),

    PRIMARY KEY (day, word_id),

    FOREIGN KEY (word_id)
        REFERENCES dictionary(id)
        ON DELETE CASCADE
);
```

---

# Running the API

## Development

```bash
npm run dev
```

## Production Build

```bash
npm run build
```
