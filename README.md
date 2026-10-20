# Claude Code Starter Kit

A full Claude Code setup for e-commerce, marketing, ads and engineering work:
**599 skills**, 42 plugins, 10 extra agents, coding rules and a guide of lessons learned
in the field.

## What's inside

| Folder | What it is |
|---|---|
| `skills/` | 94 personal skills: ads, Instagram, marketing, SEO, sales, content, `watch`, `unlazy` |
| `marketplace/` | A local plugin marketplace with 42 plugins and 505 more skills (table below) |
| `agents/` | 10 ad-audit and creative sub-agents (Meta, Google, budget, tracking, copywriter, visual designer…) |
| `commands/` | Slash commands (`/babyzuly-reel`) |
| `rules/ecc/` | Coding standards: common, TypeScript, Python, web |
| `knowledge/LESSONS.md` | **Start here.** Hard-won lessons on Shopify, Meta ads, AI creative, video and working with Claude |
| `plugins/settings.example.json` | What the installer adds to your settings, for reference |

### Plugins in the marketplace

| Plugin | Skills | What it covers |
|---|---|---|
| `ecc` | 292 | Engineering: TDD, code review, security, every major language and framework, plus agents, research, content and ops workflows ([github.com/affaan-m/ECC](https://github.com/affaan-m/ECC), MIT). Its hooks are left out. |
| `small-business` | 44 | Running a small business: cash flow, invoices, payroll, inventory, leads, reviews, content |
| `sales` | 36 | Pipeline, forecasting, call prep, outreach, account plans, objection handling |
| `engineering`, `data` | 10 each | Architecture, debugging, deploys, incidents · SQL, dashboards, statistics |
| `account-skills` | 10 | Art, canvas and theme design, brand guidelines, MCP builder, Seedance realistic reels |
| `legal`, `operations`, `human-resources` | 9 each | Contracts and NDAs · process docs, risk, vendors · hiring, reviews, comp |
| `marketing`, `finance`, `product-management` | 8 each | Campaigns, SEO, email · close, reconciliation · specs, roadmaps, research |
| `design`, `plugin-dev` | 7 each | Design critique, UX copy, accessibility · building Claude plugins |
| `bio-research`, `customer-support`, `enterprise-search`, `productivity`, `brand-voice`, `mcp-server-dev`, `cwc-makers` | 2–6 | Smaller specialist sets |
| Official Claude plugins | 1–7 each | `frontend-design`, `skill-creator`, `claude-security`, `hookify`, `playground`, `code-review`, `feature-dev`, `pr-review-toolkit`, `commit-commands`, `ralph-loop`, output styles and more. Several of these add commands and agents instead of skills. |

## Install

1. Install Claude Code: https://claude.com/claude-code
2. Unzip this folder anywhere and run the installer:
   - **Windows (PowerShell):** `powershell -ExecutionPolicy Bypass -File install.ps1`
   - **macOS / Linux:** `bash install.sh` (needs `python3`)
3. Restart Claude Code. Type `/` to see the skills, or `/plugin` to manage plugins.

The installer:
- copies `skills`, `agents`, `commands` and `rules` into `~/.claude/` (existing folders
  are backed up as `*.bak-<date>`);
- copies the marketplace to `~/.claude/student-kit/marketplace`;
- registers it in `~/.claude/settings.json` (backed up first) and enables all 42
  plugins. Your other settings are kept;
- `install.sh` also installs the 42 plugins with the `claude` CLI. Enabling a plugin in
  `settings.json` does not install it.

### Claude Code on the web

Cloud sessions start in a fresh container, so install the kit from the environment's
**Setup script** (cloud environment menu in the session title bar → Edit):

```bash
K=$(mktemp -d) && git clone --depth 1 https://github.com/numanebay2006-lab/claude-starter-kit "$K" && bash "$K/install.sh"
```

It adds about a minute to each session start. The clone needs no login while this repo is
public.

**Too many skills?** With 599 skills loaded, each session spends more context listing
them. Turn off plugins you don't need with `/plugin`, or by setting them to `false` under
`enabledPlugins` in `settings.json`.

**Output styles:** the `explanatory-output-style` and `learning-output-style` plugins
make Claude add teaching notes and ask you to write small pieces of code. That's great
for learning. Turn them off when you just want answers.

## Not included

- Anthropic's own document and computer skills (`docx`, `pdf`, `pptx`, `xlsx`, browser
  and computer use, docs, schedule…). Their licence doesn't allow redistribution, and
  they come built into Claude when you sign in with a Claude account.
- Logins, API keys, session history and private project memory.

## Optional API keys

Set these as environment variables, never inside skill files:
- `watch`: `GROQ_API_KEY` or `OPENAI_API_KEY` in `~/.config/watch/.env` (Whisper
  transcripts for videos that have no captions). It also needs Python, `ffmpeg` and
  `yt-dlp`.
- Firecrawl: `FIRECRAWL_API_KEY`.
- Many business plugins (sales, marketing, legal…) connect to tools like HubSpot,
  Slack or Ahrefs. Each plugin's `CONNECTORS.md` lists what it can use. They work
  without connectors too, just with less data.

## Tips

- Read `knowledge/LESSONS.md` before your first real project.
- For the Instagram skills, copy `skills/_instagram-agent-templates/voice.md` to
  `~/.claude/instagram/voice.md` and fill it in first.
- `babyzuly-real-reels`, `social-post` and `seedance-realistic-baby-reels` were built for
  specific brands. Read them as examples, then make your own with `skill-creator`.
- Don't run Claude Code in "bypass permissions" mode until you know what it's doing.
