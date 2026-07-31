# Bug & polish list

Reported by Rakel, to tackle later. Newest build when filed: **v0.17.1**.

Fixed so far (easy wins / clear bugs): #3, #10, #14 (verified), #18, #22.

Status key: 🔴 open · 🟡 in progress · ✅ done

---

## 1. 🟡 Ships feel identical on the same route
Sailing the coastal run with a færing vs a knarr shows no difference.

**Surfacing done (v0.17.8):** each sail button now shows *that ship's* actual voyage
time (`voyMs`, ÷ her speed), so a knarr visibly beats a færing at the point of
decision; the fleet card lists each ship's perks (more hold · quicker · wears
slower). **Still open (balance/decision):** making `fit` scale with ship tier,
widening the speed/cargo gaps, and letting `cargo` raise the rare-find chance.

**Reality under the hood:** ships *do* differ — `voyMs` divides the voyage time by
`ship.speed` (knarr ×1.15, longship ×1.35) and `rollHaul` multiplies silver by
`ship.cargo` (knarr ×1.7, longship ×2.5). So a knarr's run *is* shorter and richer.
The problems are that it isn't **surfaced**, the deltas may be **too small to feel**,
and **`fit` doesn't scale with the ship** (fitting a knarr costs the same as a færing,
which is odd — a bigger ship takes a bigger crew).

**Proposed (open for discussion):**
- Make `fit` scale with ship tier (bigger ship → bigger félag to fit out).
- Surface per-ship numbers on the sail button/row: actual voyage time (÷ speed),
  this ship's fit cost, and expected haul (× cargo) — right now the row shows the
  *base* port numbers, so the ship's advantage is invisible.
- Consider widening the speed/cargo gaps so they're felt, and letting `cargo` also
  raise the rare-component find chance (bigger hold = more room for everything),
  so a bigger boat genuinely "holds more rewards".

## 2. 🔴 No way to destroy / scrap a ship
You can only lose a ship at sea; there's no way to deliberately retire one. Either
add a "break her up" action (probably returns a fraction of her hull), or decide the
intended design is that you must run a ship to the ground before building a new one
(and make that legible). **Decision needed:** scrap action vs. run-to-ground-only.

## 3. ✅ "Set the table" copy is stale
The board text says "one pot for every mouth" — no longer true since the table cost
was changed to scale by appetite (`tableCost` uses `potShare`, so a strong hand eats
more than one). Wording-only fix in `view_work`'s board card.

**Fixed:** copy now reads "more for a full hall and stronger hands", matching the
appetite-scaled `tableCost`.

## 4. 🔴 Crew hiring cost curve is too steep
Hiring gets expensive too fast. Balance pass on the offer/replace cost
(`replaceCost` / `seek` / offer pricing).

## 5. 🔴 "Put word out for a craft" is broken / gameable
Currently biases the gate offers toward a craft but the three offers aren't all that
craft, and the top-tier (expensive) one shows up and is unaffordable, so the feature
is effectively mute. It's exploitable: put the word out for a craft you *don't* want,
to raise the odds of a mid-tier one you *do* want appearing.

**Requested design:**
- Putting the word out should **cost silver** and have a **cooldown**.
- All **three** offers that come should be of that profession.
- The **cost and cooldown increase every time** you use it.

## 6. ✅ Missing inputs for a work aren't clearly color-coded
On the Work tab, a work you can't currently run for lack of inputs should be
color-coded so it's obvious at a glance. There's a partial `.pick.want` rust style
already, but it's not clear enough / doesn't call out *which* input is short —
ideally the "uses ore, charcoal" line reds the specific missing resource(s).

**Fixed (v0.17.9):** the "uses …" line on each work now reds the specific input(s)
you're short on (alongside the existing `.pick.want` whole-button cue). The player's
work line on the Crew tab reds its short inputs the same way.

## 7. ✅ Tool unlock order should follow the tier chain
Tools for raw-material crafts (forage, fish, wood, mine, herd) should become
available before tools for processed crafts (smith, weave, keep), before products
(cook, sail, ship). Right now tool recipes unlock purely by their own `learn.sk`
level (`REC` tier-1 tools), independent of tier, so a product-craft tool can be
worked out before a raw-craft one. Gate/order them so raw → processed → product,
matching the chain (and the dependency order the road already teaches in).

**Fixed (v0.17.11):** added a `craftTier(sk)` helper (0 raw · 1 processed · 2 product)
and a gate in `learnCheck` — a **tool** recipe of tier > 0 won't unlock until you
already know a tool of the tier below it. So a processed-craft tool waits on a
raw-craft tool, a product-craft tool on a processed one; the chain holds by
induction. Only affects future unlocks (never removes a known recipe), so old saves
are unharmed. Non-tool gear (garment/rune/amulet) is unaffected.

## 8. 🟡 Market overhaul (naming, refresh behaviour, per-market rules)
Bigger pass on the kaupstefna markets.

**Naming slice done (v0.17.8):** the market is now labelled "Kaupstefna — <port>" (and
the open/close log lines match), using the kaupstefna term over the port's own name.
The refresh-behaviour rules and per-market offer rules below are still open.

**Naming.** They're generically labelled "Market — <port>". Should use the
kaupstefna terminology and each market should have a proper name (design.md §9 has
real names: Kaupang, Hedeby/Ribe, Dublin, York, Staraya Ladoga/Novgorod,
Miklagarðr). Decide how port name vs. market name relate.

**A ship returns while that market is already open — what happens?** (decision needed)
- Returning from the **same** water/destination → add to the timer? refresh it?
- Returning from a **different** one → open a second market, or extend/replace?
Current behaviour: `openMarket` resets the timer *and* regenerates the offers for
that port; different ports open separate markets. Needs a deliberate rule.

**Per-market offer rules.**
- **First market (home / Kaupang):**
  - Always **two base-material** sell offers + occasionally **one rare** (a rare
    gathered at sea) — i.e. the rare slot only shows up sometimes.
  - A sell offer should take **¾ of what your store currently holds** of that
    material, with the silver reward scaled to that amount (offers sized to your
    stock, not flat).
- **The other three markets:** similar shape but richer — they should let you sell
  **more than 3–4 different things** (more offers / more variety the farther out).

(Ties into #1's "bigger boat holds more" and the existing `marketWealth` scaling —
keep them coherent.)

## 9. ✅ Flow panel: show time-to-empty for negative flows
Under "What is moving", tapping a resource whose net flow is **negative** should
also show how long until it runs out (time-to-empty), the mirror of the "full in
Xm" shown for positive flows.

**Fixed (v0.17.9):** ordinary resources already showed "empty in Xm" when draining;
the gap was **silver**, whose note was hard-coded to the wages explanation. It now
appends "· purse empty in Xm" (red) whenever silver is running down — the one flow
that actually goes negative in normal play.

## 10. ✅ Times shown as decimal minutes instead of m/s
Some times render like "2.8 minutes" (seen in Lore, possibly elsewhere) — should be
minutes-and-seconds, e.g. "2m 48s". Likely the lore mins values (`loreMins`) printed
raw instead of going through `dur()`. Audit for other decimal-minute displays.

**Fixed:** the Lore row footer was the one raw `${loreMins(s,r)} min` display; it now
goes through `dur(loreMins(s,r)*60000)` → "2m 48s". Audited the rest — every other
`loreMins` use already multiplies to ms before display (e.g. `loreMins(s,r)*60000`),
so this was the only offender.

## 11. 🔴 Unify luck; rebalance amulets
Byproducts, rare mats at sea, market offers, and sea charts should all be driven by
a single **luck** stat. Luck comes from amulets; the first (Amber bead) is **18%**,
probably too high. Design a coherent luck system and rebalance the amulet line.

## 12. ✅ Crew tab should show what each hand is working on
The Crew tab doesn't say what each person (and you) is currently working on. Add it.

**Fixed (v0.17.9):** the crew cards already named each hand's work and output; the gap
was the **You** card, which showed only equipment. It now shows your current work,
its output/rate, and its inputs (reddened when short) — or a prompt to pick one.

## 13. ✅ Remove quick-equip popups; highlight in-slot instead
The shortcut equip popups (crew equipment, and the player's on the Work panel)
**undermine the "tools to hand" ørlǫg line** — remove them. Instead, tapping a slot
should highlight/show the equipment **inside the slot**, not open a picker popup.

**Resolved as (Rakel's calls):**
- **Work panel (v0.17.11):** dropped the "take up the <tool>" quick-equip shortcut
  (and its `takeTool` handler). The player's tool now comes to hand only through the
  ørlǫg line (`hand` auto) or by fitting it on the Crew tab; the notice still *names*
  the better tool waiting in the pile.
- **Crew picker (v0.17.12):** kept (crew have no auto-equip), but the best fitting
  option is now flagged with a gold **best** mark — and its "put on" is the only
  highlighted button — so the right pick is obvious at a glance. Only shows when it's
  an upgrade over what's worn; player's own picker is unmarked (it mixes crafts, so
  no single best).

## 14. ✅ Market "sell one" (rare) doesn't consume / can keep selling
Selling a rare at a market: the row doesn't disappear and you can keep selling past
what you hold. Real bug — check `sellRare` guard + the market section redraw (stateSig
now uses COMP counts, but the row may not be updating / the guard may not bite).

**Verified fixed:** with `stateSig` now including `COMP.map(k=>s.res[k]||0)`, selling a
rare changes the signature and forces a redraw; the rare rows are built from
`COMP.filter(k=>s.res[k]>0)`, so the row drops out at zero. The `sellRare` guard
(`if((s.res[k]||0)<1)`) bites on integer counts, so you can't sell past what you hold —
a repeat tap during the ~1.2s touch-freeze window just shows "You have none to sell".
No code change needed beyond the earlier stateSig fix.

## 15. 🔴 Season's work rewards: no recipes or sea mats
The season's-work band should not reward recipes or materials that come from the sea.
Reward should be a choice between **silver / a raw material / a rare raw material**.

## 16. ✅ Surface the skill level cap (for Elder counsel)
Elder counsel is opaque without knowing the current level cap. Show the `softCap` in
the Hall description (e.g. "raising the hall lifts the skill cap to 50 (now 40)") so
the lore's value is legible.

**Fixed (v0.17.10):** the Hall card now has a **Skill cap** row (with the hall + counsel
breakdown once Elder counsel is read), and the "raise the hall" line spells out the
lift — "lifts the skill cap to 56 (now 48)". (The Skills card already showed the cap.)

## 17. ✅ A ship that can't be sent out must say why
When a ship can't sail (not enough stores, too worn, etc.), say why — colour-code the
missing input (e.g. stores) like the Work tab should for missing craft inputs (#6).

**Fixed (v0.17.8):** the port row now reds the short requirement (stores / silver to
fit) and prints a reason line — "wants N stores, M in hand", "wants N silver to fit,
M in the purse", or "every free ship is too worn — mend one first".

## 18. ✅ Sea-tab indicator when a market is open
Add a marker to the Sea tab when a market is up (an "M" in the corner is fine for now).

**Fixed:** `draw()` now appends a gold **M** to the Sea tab label whenever
`s.markets.length` is non-zero, and clears it when the last market closes. Updates on
the same signature change (`s.markets`) that already triggers redraws.

## 19. ✅ Flow panel should include meals/pots when auto-table is on
"What is moving" is confusing when the standing board (auto set table) is on because
the meals/pots being consumed aren't shown. Add meals to the flow.

**Fixed (v0.17.10):** `flows()` now adds a meals outflow — `tableCost / tableMinutes`,
credited to "the standing board" — whenever the board is set to fill itself, so the
meal drain shows in "What is moving" like food and wages.

## 20. 🔴 Crew wages feel very high (esp. idle/sleeping)
You lose a lot of silver while hands sleep/idle. Balance pass on `WAGE_CYCLE` / when
wages are charged. (Note: we decided food-foraging ignores wages, but this is the
broader wage economy.)

## 21. ✅ Way on: "Sail the east way" step should cover all waters
Step ~34 "Sail the east way" no longer fits now that waters unlock in sequence —
rework it to be about sailing/charting all the waters.

**Fixed (v0.17.10):** the step is now **"Sail every water"** — progress is the number of
distinct seas you've put a keel into (home / west / north / east), completing at all
four. Reward unchanged (silk); say-line reworked to name the sequence.

## 22. ✅ Crew don't stop when out of silver
Crew are supposed to stop working when the purse is empty (`doCycle` has an unpaid
check), but they keep going. Investigate — real bug.

**Fixed:** the unpaid check ran *after* inputs were already deducted, so an unpaid
crew's cycle burned raw materials (timber, ore, …) every tick and returned before
producing anything — they looked like they were "still working". Reordered `doCycle`
so the purse is checked (and the `unpaid` flag set) *before* any inputs are spent:
now an unpaid hand consumes nothing and produces nothing until there's silver again.

## 23. 🔴 Processor/gatherer ratio breaks across levels
Burning charcoal (kiln) at level 19 consumes **less** timber than a level-16 crew
brings in felling old timber. The intended ~1.5–1.8 processor:gatherer ratio doesn't
hold as levels diverge. Rework how processing input rates scale with level.

## 24. 🔴 Tasks should scale scope + reward with skill level
Errands (and the other task bands) should scale their quantities and rewards by the
player's skill level, instead of fixed amounts.

## 25. ✅ Fully tap-free updates (service worker) + offline play
v0.17.4 added an on-launch update check that fetches the live `BUILD` and offers a
one-tap refresh bar — good enough that a home-screen hall never sticks on an old
build, but it still costs a tap and needs a network reachable at launch.

**Done (v0.17.13):** added `sw.js` — a **network-first** service worker registered from
`index.html` with a relative path (scope = the Pages project path). On every launch it
fetches the app fresh (`fetch('./',{cache:'no-store'})`, raced against a 4s timeout),
stashes a copy, and serves that copy only when the network can't be reached — so the
home-screen app updates itself with **no tap** and still plays offline. `skipWaiting` +
`clients.claim` + old-cache cleanup on activate, so a new SW takes over at once and can
never strand you on stale content while online. The in-page `checkFresh()` bar is kept
as a fallback for a build that lands while you're already in. **Bootstrap caveat holds:**
the SW installs only once a build containing its registration is loaded, so getting onto
v0.17.13 still needs the one manual re-add — the last one.

For **transparent** updates (fresh build loads silently on launch) and **offline
play**, add a small service worker (`sw.js`) doing **network-first for navigations**:
fetch the page fresh each launch, fall back to a cached copy when offline. Registered
from `index.html` with a relative path so its scope matches the Pages project path
(`/husfreyjashall/`).

Trade-offs / notes:
- It's a **second file**, which breaks the "one file you drag onto a host" ethos — the
  in-page checker was kept self-contained on purpose. Decide if that's worth it.
- **Bootstrap:** the SW only installs once a build containing its registration is
  loaded fresh, so the very first hop onto it still needs a manual re-add (same as
  #—the current checker). After that, updates are transparent.
- Keep the in-page `checkFresh()` bar as a safety net / fallback if the SW ever fails
  to update.
- iOS standalone SW support is real but quirky across versions — test on-device.

---

*Add new bugs above this line as they come in.*
