# The Ideation Lab

The official digital identity for **The Ideation Lab — NEC 2026 × E-Cell IIT Bombay**.

## Run locally

This is a dependency-light static site. Open `index.html` directly, or serve the folder with any static server:

```bash
npx serve .
```

## Updating content

Team members, milestones, gallery items, events, contact details and social links live in `data.js`. Replace placeholders with verified content; keep photos and videos in the project and use their relative file paths.

- Add a member's image to `photo` and their verified profile details to the same team object.
- Add milestone details to `challengeActivities`, `necTasks`, `images`, `videos` and `certificates`.
- Set a gallery item's `image` or `video` path and select one of the predefined `galleryCategories`.
- Add events with a `category`, `status` (`UPCOMING` or `PAST`), and registration URL. Only `UPCOMING` items appear in the dedicated upcoming section; past items are filterable by activity category.

The supplied team, contact, event, photo and milestone details remain placeholders until verified information is available.
