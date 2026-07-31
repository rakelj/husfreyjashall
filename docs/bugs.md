# Bug & polish list

Reported by Rakel, to tackle later. Nothing here is fixed yet. Newest build when
filed: **v0.17.1**.

Status key: 🔴 open · 🟡 in progress · ✅ done

---

## 1. 🔴 Ships feel identical on the same route
Sailing the coastal run with a færing vs a knarr shows no difference.

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

## 3. 🔴 "Set the table" copy is stale
The board text says "one pot for every mouth" — no longer true since the table cost
was changed to scale by appetite (`tableCost` uses `potShare`, so a strong hand eats
more than one). Wording-only fix in `view_work`'s board card.

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

## 6. 🔴 Missing inputs for a work aren't clearly color-coded
On the Work tab, a work you can't currently run for lack of inputs should be
color-coded so it's obvious at a glance. There's a partial `.pick.want` rust style
already, but it's not clear enough / doesn't call out *which* input is short —
ideally the "uses ore, charcoal" line reds the specific missing resource(s).

## 7. 🔴 Tool unlock order should follow the tier chain
Tools for raw-material crafts (forage, fish, wood, mine, herd) should become
available before tools for processed crafts (smith, weave, keep), before products
(cook, sail, ship). Right now tool recipes unlock purely by their own `learn.sk`
level (`REC` tier-1 tools), independent of tier, so a product-craft tool can be
worked out before a raw-craft one. Gate/order them so raw → processed → product,
matching the chain (and the dependency order the road already teaches in).

## 8. 🔴 Market overhaul (naming, refresh behaviour, per-market rules)
Bigger pass on the kaupstefna markets.

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

## 9. 🔴 Flow panel: show time-to-empty for negative flows
Under "What is moving", tapping a resource whose net flow is **negative** should
also show how long until it runs out (time-to-empty), the mirror of the "full in
Xm" shown for positive flows.

## 10. 🔴 Times shown as decimal minutes instead of m/s
Some times render like "2.8 minutes" (seen in Lore, possibly elsewhere) — should be
minutes-and-seconds, e.g. "2m 48s". Likely the lore mins values (`loreMins`) printed
raw instead of going through `dur()`. Audit for other decimal-minute displays.

## 11. 🔴 Unify luck; rebalance amulets
Byproducts, rare mats at sea, market offers, and sea charts should all be driven by
a single **luck** stat. Luck comes from amulets; the first (Amber bead) is **18%**,
probably too high. Design a coherent luck system and rebalance the amulet line.

## 12. 🔴 Crew tab should show what each hand is working on
The Crew tab doesn't say what each person (and you) is currently working on. Add it.

## 13. 🔴 Remove quick-equip popups; highlight in-slot instead
The shortcut equip popups (crew equipment, and the player's on the Work panel)
**undermine the "tools to hand" ørlǫg line** — remove them. Instead, tapping a slot
should highlight/show the equipment **inside the slot**, not open a picker popup.

## 14. 🐛 Market "sell one" (rare) doesn't consume / can keep selling
Selling a rare at a market: the row doesn't disappear and you can keep selling past
what you hold. Real bug — check `sellRare` guard + the market section redraw (stateSig
now uses COMP counts, but the row may not be updating / the guard may not bite).

## 15. 🔴 Season's work rewards: no recipes or sea mats
The season's-work band should not reward recipes or materials that come from the sea.
Reward should be a choice between **silver / a raw material / a rare raw material**.

## 16. 🔴 Surface the skill level cap (for Elder counsel)
Elder counsel is opaque without knowing the current level cap. Show the `softCap` in
the Hall description (e.g. "raising the hall lifts the skill cap to 50 (now 40)") so
the lore's value is legible.

## 17. 🔴 A ship that can't be sent out must say why
When a ship can't sail (not enough stores, too worn, etc.), say why — colour-code the
missing input (e.g. stores) like the Work tab should for missing craft inputs (#6).

## 18. 🔴 Sea-tab indicator when a market is open
Add a marker to the Sea tab when a market is up (an "M" in the corner is fine for now).

## 19. 🔴 Flow panel should include meals/pots when auto-table is on
"What is moving" is confusing when the standing board (auto set table) is on because
the meals/pots being consumed aren't shown. Add meals to the flow.

## 20. 🔴 Crew wages feel very high (esp. idle/sleeping)
You lose a lot of silver while hands sleep/idle. Balance pass on `WAGE_CYCLE` / when
wages are charged. (Note: we decided food-foraging ignores wages, but this is the
broader wage economy.)

## 21. 🔴 Way on: "Sail the east way" step should cover all waters
Step ~34 "Sail the east way" no longer fits now that waters unlock in sequence —
rework it to be about sailing/charting all the waters.

## 22. 🐛 Crew don't stop when out of silver
Crew are supposed to stop working when the purse is empty (`doCycle` has an unpaid
check), but they keep going. Investigate — real bug.

## 23. 🔴 Processor/gatherer ratio breaks across levels
Burning charcoal (kiln) at level 19 consumes **less** timber than a level-16 crew
brings in felling old timber. The intended ~1.5–1.8 processor:gatherer ratio doesn't
hold as levels diverge. Rework how processing input rates scale with level.

## 24. 🔴 Tasks should scale scope + reward with skill level
Errands (and the other task bands) should scale their quantities and rewards by the
player's skill level, instead of fixed amounts.

---

*Add new bugs above this line as they come in.*
