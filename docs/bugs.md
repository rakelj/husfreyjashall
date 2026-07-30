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

---

*Add new bugs above this line as they come in.*
