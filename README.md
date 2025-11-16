# Party Pack TV

A lightweight, Jackbox-inspired lobby and party screen built with vanilla HTML, CSS, and JavaScript. The experience includes a host lobby, live scoreboard, event log, and three playable mini-games that all run inside a single page.

## Getting started

No build tools are needed—simply open `index.html` in any modern browser.

```bash
# From the project root
open index.html   # macOS
# or
xdg-open index.html  # Linux
```

If you prefer to serve the files locally, any static file server (such as `python -m http.server`) will work.

## How to test the experience

Because everything runs client-side, testing is just a matter of loading the page in a
browser and walking through a few manual flows. The steps below mirror how we
smoke-test new changes:

1. **Launch the app** – Open `index.html` (or start a static server) and verify the
   lobby shows a generated room code.
2. **Add players** – Use the lobby form to add at least three players. Confirm the
   list updates and that the scoreboard now shows matching entries with zero points.
3. **Game swap sanity check** – Click each "Load Game" button in the game hub and
   ensure the Party Screen swaps to the selected game's UI.
4. **Run each mini-game** –
   - *Trivia Blitz*: Trigger a question, pick an answer, and confirm the correct
     player receives 100 points.
   - *Word Forge*: Enter a player name, submit a word, and verify points equal to
     the number of letters are added.
   - *Story Chain*: Add a sentence for a player and award style points from the
     host controls, checking the scoreboard update.
5. **Event log + reset** – Confirm each action produces a new log entry and that
   "Reset Session" clears players, scores, logs, and the current game.

If anything looks off, open the browser dev tools console for descriptive error
messages—`app.js` logs every major state change to help with debugging.

## Included games

| Game | Description |
| --- | --- |
| Trivia Blitz | Rapid-fire trivia with automatic scoring for correct answers. |
| Word Forge | Build the longest word from a shared set of letters. Points are awarded per letter. |
| Story Chain | Players add sentences to a silly prompt and earn host-selected style bonuses. |

Each game includes custom UI on the party screen, integrates with the shared scoreboard, and logs major events so the host can narrate the action.
