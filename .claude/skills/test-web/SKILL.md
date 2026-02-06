---
name: test-web
description: Test the web application using the agent-browser CLI to ensure a feature is working as expected before making a commit.
argument-hint: [test-description]
---

1. Ensure the CMS is running locally, or the web app is connected to the remote CMS.

2. Start the web dev server in the background (if not already running):

   ```bash
   cd web && pnpm dev
   ```

3. Wait for port 4321 to be ready, use a different port if needed.

4. Use agent-browser to test:

   ```bash
   agent-browser open http://localhost:4321
   agent-browser snapshot -i  # Get interactive elements with refs
   agent-browser click @e2    # Click element by ref
   ```

   to see all available commands, run `agent-browser --help`

5. Stop the dev server when done
