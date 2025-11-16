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

## Included games

| Game | Description |
| --- | --- |
| Trivia Blitz | Rapid-fire trivia with automatic scoring for correct answers. |
| Word Forge | Build the longest word from a shared set of letters. Points are awarded per letter. |
| Story Chain | Players add sentences to a silly prompt and earn host-selected style bonuses. |

Each game includes custom UI on the party screen, integrates with the shared scoreboard, and logs major events so the host can narrate the action.
