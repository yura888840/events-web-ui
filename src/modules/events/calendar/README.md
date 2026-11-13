# Advanced events calendar

Open **/events/calendar**. This integrates the existing styled calendar with local event creation, editing, deletion, week/month/list modes, search, category filters and month/year navigation.

The advanced UI currently uses browser localStorage as a demo persistence layer. It intentionally does **not** call the NestJS API or modify the existing CRUD pages at /events, /events/new and /events/[id]. Data is stored only in the current browser. A later step can swap the local store for the events API client.

Run the app via `npm run dev` once the sibling `events-contracts` package is installed as described in the main README.
