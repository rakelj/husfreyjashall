# Handover

For a session picking this up cold. Read `design.md` first for the *what* and the
*why*; this covers the *how* — the shape of the file, the numbers that were arrived
at by simulating rather than guessing, and the mistakes worth not repeating.

Build: **v15.0** · `index.html`, one file, ~158 KB, ~147 KB of it script.

---

## 1. Who you are working with

Rakel is a game designer at a narrative studio. She knows games, she plays this one
between sessions, and she is the source of nearly every good decision here — crew
locked to one craft, collect steps instead of silent payouts, tiered marks, the four
task bands, the craft-and-sell exploit, the félag. She works on a tablet and an
iPhone; there is no desktop in the loop.

**How to be useful:**

- **She tests; you cannot.** Every claim about feel is hers. Every claim about
  numbers should be simulated before it is made.
- **Push back before building.** She has said so directly, and the times it went
  wrong were times a number got shipped unchecked.
- **"Wait" means stop.** This was got wrong once and it cost her credits.
- **Credits are finite and sometimes paid for.** Do not iterate five times where one
  careful change would do. Ask which of three it is rather than guessing in turn.
- She is Norwegian; the game is set in Norway. Historical grounding matters to her,
  and she will catch a wrong claim.

---

## 2. The file

```
index.html
├── <style>          one stylesheet, no framework, no external fonts
└── <script>
    §1  CONTENT                 all data tables — change these to change the game
    §2  DERIVED FROM CONTENT    readings of those tables; no state changed
    §3  STATE, RULES, VIEW      the working parts
```

**§1 holds everything:** `SK` (11 crafts), `ACT` (19 works), `RES`, `COMP`, `REC`
(28 recipes), `RSCH` (13 lore lines), `HALL` (10 storeys), `ORL`, `MARK` (27
families), `PORTS`, `INTRO` (41 steps), the four task pools, `NAMES`.

**Nothing below §1 reads a number that is not declared in it.** Keep it that way.

**The view is one function per tab** — `view_work`, `view_crew`, `view_craft`,
`view_sea`, `view_lore`, `view_quest`, `view_hall` — dispatched from `draw()`
through `VIEWS`. Largest is `view_hall` at 9 KB. Before the split, `draw()` was a
single 33 KB function; do not let it become one again.

**104 functions.** The other big ones are `paint`, `fire` and `flows`.

### Rendering

- `draw()` rebuilds structure only when `stateSig()` changes.
- `paint()` runs every frame and only updates widths and numbers — never replaces
  elements.
- `freeze()` holds redraws from pointerdown until shortly after a tap resolves.
- Storage: `localStorage`, saved every 10 s and on hide. **The save version is a
  hash of the shape of a fresh state**, so adding or renaming a field invalidates
  old saves automatically. There is no manual version to bump.
- Offline: `advance(dt)` is split out of `tick()` so time can be replayed in bulk.
  Catch-up runs in 60 s chunks, 5 min chunks past six hours, capped at 14 h.

### Testing

There are no tests in the repo — they were built as throwaway Node harnesses that
extract the script, stub `document`/`localStorage`/`Date`, and drive the game
headlessly. **Rebuild them; do not work without them.** The pattern:

```js
// stub performance, localStorage, window, document, Date
const els={}; global.document={getElementById:id=>els[id]||(els[id]=mkEl()), ...};
// then paste the extracted <script> body, then drive it:
S.unlocked=Object.keys(ACT); setAct('woods','me');
for(let i=0;i<600;i++) advance(1000);
```

The three that earned their keep:

- **An end-to-end battery (18 checks)** — an hour of play, every tab drawn, hiring,
  crafting, lore, the sea, the tiller, cooking, tasks, marks, save/reload, offline
  catch-up, a full reckoning, ørlǫg, export/import.
- **A smoke test (38 checks)** calling every function once.
- **Draw every tab on a fully furnished hall**, plus the shelter screen. This is the
  one that catches view bugs, and it caught three during the view split.

---

## 3. Mistakes already made

Recorded because they are cheap to repeat.

**Slicing between anchors deleted whole functions, twice.** Replacing everything
between `function foo(` and the next `function ` swallowed `fresh`, `capOf`, `log`,
`give`, `eqBonus`, `$` and others, which then had to be rebuilt from memory. If you
slice, print the boundaries first and check the function list before and after.

**A version was stamped on a patch that had failed to apply.** v9.12 claimed a fix
it did not contain. Verify the change is in the file, then stamp.

**Numbers were shipped without simulating.** Wages were 4× income on release; the
first "worth making" rule marked everything at once; voyage wear was doubled and
made the east way a coin-flip at full condition. Every one was caught by measuring
afterwards. Measure first.

**Two heuristics that answered the same question disagreed.** `suits()` judged each
item independently while `spareItems()` computed a global allocation, and they
contradicted each other constantly. Fixed by computing **one** allocation that every
view reads. Do not add a second opinion.

**Skipping the tutorial road silently removed the craft unlocks**, because unlock
data lived inside tutorial data. Coupling like that is why §1 exists.

---

## 4. Numbers that were arrived at by simulating

Change them if the design changes, but know what they were tuned against.

| | value | why |
|---|---|---|
| `EAT_BASE` | 0.065 | appetite scales as production does — yield *and* speed — so the share of a hall that must forage is constant at level 5 and level 50 (~1.19 foragers per 10) |
| `WAGE_CYCLE` | 0.044, flat | paid per cycle, not per second: idle hands cost nothing, an empty purse stops them rather than running a debt. ~a third of income at every stage |
| `VOY_SCALE` | 16 | an overnight is ~10 voyages, not 160. This is what actually closed the auto-sail exploit; cost alone could not |
| ratios | 1.5–1.8 : 1 | a processor eats faster than one gatherer feeds it — the bloom wants 1.8 miners |
| `RARE_CAP` | 0.80 | no lore or charm makes a rare find certain |
| sea discovery | 14 % + luck, cap 35 % | was 45–85 %, which unlocked everything in an hour |
| crew shares | 18/24/30/36 % | longer water, bigger share; fitting out ~12 % of the return |
| soft cap | `hall × 8 + 5 × elder`, max 100 | 100 wants hall 10 **and** four tiers of Elder counsel |
| hall costs | see `HALL` | tuned so each late storey needs Wide eaves 3–4 — you physically cannot hold what it costs otherwise |

**Total lifetime demand for each rare component is 14–40** against unlimited supply.
This is unsolved. The intended answer is Runecraft as a permanent sink (see
`design.md` §12), plus the sea consuming what the sea gives.

---

## 5. Where it stands

**Done and playable:** eleven crafts in three tiers, two works to most of them,
non-1:1 ratios, food upkeep that stops the hall, wages by the cycle, a flow panel
with provenance, hands that can be set down, the félag, ships that can be lost, 41
steps of road across ages, tiered marks and lore, ørlǫg, the reckoning, save/export,
offline catch-up with a return panel, an opening screen, and a reskin.

**Next, in order** (`design.md` §5): keys, the tab regrouping, light and dark.

**Unconfirmed:** the iOS tap fix in v14.8. Taps now fire on `pointerup` against
whatever was pressed, tolerate 15 px of drift, and honour a cancelled touch that did
not move. Reported symptom was "have to tap multiple times, not always but often".
If it is still wrong, the next step is a debug line showing the last tap's target
and distance rather than another guess.

**Deployment:** GitHub Pages from the repo — push is deploy. Netlify was abandoned
after it turned out to charge per deploy. For testing, open the downloaded file
directly; `file://` works on Android with localStorage intact.

---

## 6. Things not to undo

- **No gear wear.** Considered and rejected as a hassle.
- **Offline runs at full rate.** Caps do the limiting; XP is uncapped so a night
  away always pays something.
- **No ads, no pay-to-win.**
- **Community features are parked**, deliberately, until their absence is the
  complaint. Keep the Þing tab slot free and the save exportable.
- **Rare components cannot be bought**, only spent. If a hone can be purchased the
  sea stops mattering.
- **The player never loses access to a craft** — keys license delegation, not the
  work itself.
- **The cast is women.** See `design.md` §2 and §3; the thralldom stance is written
  down and was decided deliberately.

---

## 7. Open questions she has not answered

- **Keys: collect all, or a limited ring?** The ring is more interesting and
  crueller. Current thinking is to tie it to the board — `crew places − 2` — so it
  does not care how many crafts exist. Crafts will be added both in the base game
  and as expansions.
- **Do keys survive a reckoning?** Leaning no, cut cheaper the second time, with an
  ørlǫg line — *the ring at her belt* — carrying a couple through.
- **The name.** Ruled out: Orlog, Everhall, Hall of Ages. Live: Keyhold, The Ones
  Who Stayed, something on *húsfreyja*. Check Play search, not Google.
