---
description: Store change requests in specs folder with numbered naming scheme
---

# Store Change Request Workflow

When the user posts a change request to this chat, follow these steps:

1. **Determine the next spec number**: Check the `specs/` folder for existing files and find the highest number. The new file should use the next sequential number (e.g., if `009_*.md` exists, the next is `010`).

2. **Create the spec filename**: Use the format `NNN_short_description.md` where:
   - `NNN` is a 3-digit zero-padded number (e.g., `001`, `010`, `099`)
   - `short_description` is a brief snake_case description of the change request

3. **Write the spec file**: Create the file at `specs/NNN_short_description.md` with content:
   ```markdown
   # [Title of Change Request]

   ## Request
   [The exact or summarized change request from the user]

   ## Date
   [Current date in YYYY-MM-DD format]
   ```

4. **Confirm**: Let the user know the change request was stored and provide the filename.
