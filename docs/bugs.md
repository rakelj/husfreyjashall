# Bug & polish list

Reported by Rakel, to tackle later. Newest build when filed: **v0.17.1**.

Fixed so far (easy wins / clear bugs): #3, #10, #14 (verified), #18, #22.

Status key: 🔴 open · 🟡 in progress · ✅ done

---

## 1. ✅ Ships feel identical on the same route
Sailing the coastal run with a færing vs a knarr shows no difference.

**Surfacing done (v0.17.8):** each sail button shows *that ship's* actual voyage time
(`voyMs`, ÷ her speed); the fleet card lists each ship's perks (more hold · quicker ·
wears slower).

**Balance tail done (v0.17.21)** — values reviewed and kept by Rakel, to be felt in play:
- **`fit` scales with the ship** — added `fitx` (færing 1.0 · knarr 1.7 · longship 2.6);
  `fitOf(s,p,sh)` multiplies by it. The port row shows the fit as a range across your
  free ships (`cheapest–dearest`) and each ship's affordability gates its own button.
- **Wider speed/cargo gaps** so they're felt: knarr speed 1.15→**1.25**, cargo 1.7→**2.1**;
  longship speed 1.35→**1.55**, cargo 2.5→**3.4** (wear a touch better too).
- **`cargo` raises the rare-find chance** in `rollHaul` (`×(0.8 + 0.2·cargo)`) — a bigger
  hold has more room for rare things to ride home, so a longship finds ~48% more often
  than a færing.

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

## 2. ✅ No way to destroy / scrap a ship
You can only lose a ship at sea; there's no way to deliberately retire one. Either
add a "break her up" action (probably returns a fraction of her hull), or decide the
intended design is that you must run a ship to the ground before building a new one
(and make that legible). **Decision needed:** scrap action vs. run-to-ground-only.

**Done (v0.17.14) — scrap action:** an idle ship (on the sand, not at sea) now has a
low-profile **"break her up"** button in the fleet card. It returns **40% of her build
hull, scaled by condition** (`scrapHull = round(build.hull · 0.4 · cond/100)`) — so a
sound færing gives 8 hull, a knarr 32, a longship 80, less the more worn she is. It's
irreversible, so it asks twice (first tap arms "sure? — break her up", second within
~4s does it), mirroring the task-swap / reset confirms. Frees a slot on the strand
without having to run her to the ground.

## 3. ✅ "Set the table" copy is stale
The board text says "one pot for every mouth" — no longer true since the table cost
was changed to scale by appetite (`tableCost` uses `potShare`, so a strong hand eats
more than one). Wording-only fix in `view_work`'s board card.

**Fixed:** copy now reads "more for a full hall and stronger hands", matching the
appetite-scaled `tableCost`.

## 4. ✅ Crew hiring cost curve is too steep
Hiring gets expensive too fast. Balance pass on the offer/replace cost
(`replaceCost` / `seek` / offer pricing).

**Fixed (v0.17.15):** the dominant "too fast" term was the per-crew multiplier —
each hand you already kept raised every new ask by **+75%**, so a 5th hire cost ~4×
base and an 8th ~6.25×. Softened to **+40%** (5th ≈ 2.6×, 8th ≈ 3.8×). Pulled the
formula into a shared `hireCost(s,L)` so the gate offer and the `replaceCost` display
can't drift apart. Per-level pricing (`13·L^1.6`) left as-is — that rise is intended.

## 5. ✅ "Put word out for a craft" is broken / gameable
Currently biases the gate offers toward a craft but the three offers aren't all that
craft, and the top-tier (expensive) one shows up and is unaffordable, so the feature
is effectively mute. It's exploitable: put the word out for a craft you *don't* want,
to raise the odds of a mid-tier one you *do* want appearing.

**Requested design:**
- Putting the word out should **cost silver** and have a **cooldown**.
- All **three** offers that come should be of that profession.
- The **cost and cooldown increase every time** you use it.

**Fixed (v0.17.15):** reworked exactly to the requested design. The old free `s.want`
toggle (which only biased the dear slot — the gameable part) is gone. Tapping a craft
now calls `putWord(k)`: it **costs silver** (`wantCost = 55·1.9^wantN` → 55, 105, 198,
377 …), re-rolls the gate so **all three places are that trade** at the three price
bands (`rollOffers(forceK)`), and starts a **cooldown** (`wantCd = 120 + 90·wantN` s →
2m, 3.5m, 5m …) during which the buttons are disabled and show "settles in Xm". Both
climb every use; they reset only on a reckoning. `wantN`/`wantT` added to state and
the tick counts the cooldown down (even while away).

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

## 8. ✅ Market overhaul (naming, refresh behaviour, per-market rules)
Bigger pass on the kaupstefna markets.

**Naming slice done (v0.17.8):** the market is now labelled "Kaupstefna — <port>" (and
the open/close log lines match), using the kaupstefna term over the port's own name.

**Ivory sink done (v0.17.16):** walrus ivory piled up from the northern water with only
the slow one-at-a-time `sellRare` rows to shift it. The home kaupstefna (any home-sea
port, `reach 0`) now carries a **bulk ivory sell offer** whenever you hold ≥3 — sized to
your stock up to **15**, at a **modest 50 silver each** (vs ~70 for singles), so you can
dump a batch for a fair price. Fresh offer each time a home market opens.

**Refresh rule done (v0.17.17), per Rakel's call — "add, don't wipe":** landing at a port
whose kaupstefna is still open now **adds to the timer** (`ex.left += marketMins`) and
**appends the fresh offers** (`ex.offers = ex.offers.concat(...)`) instead of resetting the
timer and regenerating. Different ports still open their own separate markets. (Note:
repeated landings grow both without bound — fine for hand play; revisit if an auto-tiller
fleet makes a home market effectively permanent.)

**Offer rules done (v0.17.18):** `marketOffers` rewritten. Sell offers are now sized to
**¾ of what your stores hold** of a material (`qty ≈ res·0.75`, min 5, capped at what you
have), priced to that amount — a surplus sink instead of flat random quantities. Markets
grow **richer the farther out**: sell stalls scale by reach (home **2** · west/north **4**
· east **5**) and buy stalls likewise (home 2 · +1 per reach), and the lower spread far out
means better pay both ways. The home ivory sink and the ¾ rule together cover the "two
base sells + a rare slot" shape for the first market.

**Minor nuance left (optional):** the doc's "occasionally *any* rare (a rare gathered at
sea)" for the home market is implemented specifically as the reliable **ivory** sink rather
than an occasional generic rare slot — a deliberate simplification; easy to generalise later.

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

## 11. ✅ Unify luck; rebalance amulets
Byproducts, rare mats at sea, market offers, and sea charts should all be driven by
a single **luck** stat. Luck comes from amulets; the first (Amber bead) is **18%**,
probably too high. Design a coherent luck system and rebalance the amulet line.

**Fixed (v0.17.20), to Rakel's design:**

- **Fortune can never reach 100%.** Each amulet is an independent *charm*, so the hall's
  luck is the chance at least one favours you — `1 − ∏(1−each)`. It climbs toward 100%
  but never arrives (the miss-chance is floored just above 0 so floating-point can't
  round it to 1), so **adding another charm or hand always helps** — no dead ceiling that
  would block new items or crew later. 1 hammer 20% · 3 → 49% · a full hall of 9 → 87%.
- **Player-facing explanation, no maths:** "each charm is its own chance at fortune — the
  more in the hall, the likelier one favours you." The Crew tab's *You* card shows one
  combined **fortune X%** that always rises when a charm is added.
- **A hand's own work follows her own charm.** Land byproducts use only that person's
  amulet (`amuletLuck`), not the hall total. The hall's fortune governs what the *sea*
  gives up, what a market pays, and charts.
- **Luck sways each rare thing differently** (`LUCK_SENS`, effective = base·(1+sens·luck)):
  common finds swing most, the rarest least but never nothing — herbs/bark/clay/horn
  **2.0**, amber 1.5, whetstone 1.25, ivory 1.0, glass 0.9, **silk 0.8** (kept generous
  on Rakel's call rather than a token amount).
- Amulets rebalanced: **Amber bead 18% → 10%**, **Thor's hammer 34% → 20%** (+5% all kept).

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

## 15. ✅ Season's work rewards: no recipes or sea mats
The season's-work band should not reward recipes or materials that come from the sea.
Reward should be a choice between **silver / a raw material / a rare raw material**.

**Fixed (v0.17.19):** `seasonChoices` rewritten. It no longer offers a **way of making**
(recipe) or a **sea rare** (COMP). The three choices are now **silver**, **a raw material**
(`RAW_COMMON` = timber / ore / wool) and **a rarer raw material** (`RAW_RARE` = herbs /
bark / clay / horn) — all land-gathered, so the sea rares stay the sea's alone. New
choice kind `res` handled in `choiceLabel` and `collect` (legacy `way`/`comp` branches
kept so a season task already in flight on an old save still pays out).

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

## 20. ✅ Crew wages feel very high (esp. idle/sleeping)
You lose a lot of silver while hands sleep/idle. Balance pass on `WAGE_CYCLE` / when
wages are charged. (Note: we decided food-foraging ignores wages, but this is the
broader wage economy.)

**Fixed (v0.17.15):** balance pass on the wage. `WAGE_CYCLE` cut **0.044 → 0.030**
(~32% lower) and the per-age ramp softened **0.25 → 0.15**, so late-age halls aren't
punished as hard. (On "when charged": wages are already only taken on a *completed
work cycle* — resting / away / roofless / input-starved hands aren't charged at all;
verified in `doCycle` and the tick loop.) Numbers are easy to tune further if it still
feels steep in play.

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

## 23. ✅ Processor/gatherer ratio breaks across levels
Burning charcoal (kiln) at level 19 consumes **less** timber than a level-16 crew
brings in felling old timber. The intended ~1.5–1.8 processor:gatherer ratio doesn't
hold as levels diverge. Rework how processing input rates scale with level.

**Fixed (v0.17.22):** the root cause — a gatherer's **output** scaled with yield (∝ level)
but a processor's **input** was flat per cycle, so it scaled only with speed and fell
behind as levels rose. Now a craft's per-cycle input is **scaled by the same yield as its
output** (`eUse(a, yld, k) = a.use[k]·yld·oreMod`), so a leveled kiln eats timber as fast
as it makes charcoal and the throughput ratio holds across levels (and equalises when a
processor and gatherer are the same level). Routed **every** input read through `eUse` so
consumption, the tick's run/stall gates, the flow panel, and the "uses N" labels all
agree — the labels now show the real per-cycle amount (via a `yldFor(s, sk)` helper for
the Work-tab buttons, which have no live runner). At level 1 `yld ≈ 1`, so early play is
unchanged. `doCycle` still checks before it consumes, so nothing can go negative.
**Confirmed with Rakel (^1.0, input scales exactly like output).** Spec: a processor should
out-consume a gatherer at the same level, and still do so when the gatherer is higher.
Measured on the timber chain (feller `3.2/6.5s` → kiln `4.5/5.5s`), consumption ÷ one
gatherer's output:

| case | old (broken) | now (^1.0) |
|---|---|---|
| equal levels, any L | 1.66 → **0.53** by L40 | **1.66, held at every level** |
| reported bug: L16 feller vs L19 kiln | **1.01** (break-even) | **2.00** |
| gatherer 14 levels above processor | 0.43 | 0.78 |

Steeper options (`yield^1.3` / `^1.6`) were weighed and rejected: they'd cover bigger level
gaps but push the late game to 2.3–3.3 gatherers per processor, away from the intended
1.5–1.8. Note no exponent can guarantee "always more" for an *arbitrary* gap — a large
enough one always wins; a novice kiln failing to keep up with a master feller is accepted
as correct. _Levelling a processor makes it faster, not more input-efficient._

## 24. ✅ Tasks should scale scope + reward with skill level
Errands (and the other task bands) should scale their quantities and rewards by the
player's skill level, instead of fixed amounts.

**Fixed (v0.17.19):** `qScale` now takes the task's track and folds in **skill level**, not
just age: `(1 + 0.5·age) · (1 + 0.045·(L−1))`, where **L** is your level in the craft that
*makes* what the task asks for (via a `PROD_SK` resource→craft map), or your best skill for
deeds / season rewards. It drives the task **quantity** and every band's **reward** —
errand goods (`errandPay(s, mult)`) and silver, the day's silver, and the season choice
amounts. At age 0 / level 1 it's ×1 (unchanged), so early play is untouched; a task in a
craft you're skilled at now grows in scope and pay to match.

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

## 26. ✅ Husbandry 15 but the Horn comb never unlocked (while the weaving tool did)

**Reported:** Husbandry at level 15, its tool still locked; Weaving's tool unlocked.

**Cause.** `learnCheck` refused to work out a recipe until every material in its `cost`
had been produced at least once (`s.tot[k] > 0`). The intent was sensible — you
shouldn't work out how a wrap is cut before you've woven any cloth — but three tier-1
tools list a **byproduct** in their cost:

| tool | craft | cost | byproduct gate |
|---|---|---|---|
| Horn comb | Husbandry | 12 timber + **3 horn** | horn |
| Bark basket | Foraging | 10 timber + **3 bark** | bark |
| Clay weights | Weaving | 6 cloth + **3 clay** | clay |

Byproducts only fall out of *one specific action*: horn from **Tend the flock** (18%),
never from **Shear the flock**. Shearing gives more wool (1.6 vs 1.1), so anyone
working wool sensibly sits on *Shear* and never sees a single horn — and the comb stays
invisible forever, at any level. Weaving's tool unlocked because clay comes from
**Work the scree**, which players do reach while digging for ore.

The panel made this worse by stating the opposite: *"still unknown — worked out by
getting good at the craft"*. Getting good at the craft was exactly what didn't work.

**Fix (v0.17.24).**
- Byproducts (`herbs, bark, clay, horn`) are **exempt from the material gate**, the same
  as rare sea things already were. Staples still gate normally — no cloth, no wrap.
  The recipe is now the reason to go looking for horn, not the other way round.
- `RAW_RARE` moved up beside the other resource lists so the rule has one definition.
- The unknown-recipe note now names what the next one actually waits on — *"The next
  comes at Husbandry 10 — yours is 7."* It names no recipe (discovery is the point) but
  a craft that has gone quiet can be told from one you're still climbing toward. It
  reads **your own** level, which also makes clear that a crew member's 15 is not yours.

**Verified** against simulated saves: Husbandry 15 with zero horn now learns the comb;
below 10 still doesn't; missing the *timber* staple still blocks; bark/clay tools fixed
alike; wrap-needs-cloth and shears-needs-comb chains still hold. Existing saves pick it
up on next load — `learnCheck` runs every tick, so no migration is needed.

---

## 27. ✅ Every chance find said "from the water" (and crew names read ungrammatically)

**Reported:** the Annal showing *"Herborg brings up clay from the water"*, *"Þórunn brings
up horn from the water"*, *"Gyða brings up bark from the water"* — none of which come
from water — plus *"Vigdís turn up herbs"* instead of *turns*.

**Cause.** One hardcoded line served every byproduct:

```js
`${c?c.name:"You"} ${k==="herbs"?"turn up herbs among the grass"
  :"bring"+(c?"s":"")+" up "+CN[k].toLowerCase()+" from the water"}.`
```

*"from the water"* was written for the **walrus ivory** — true of that one and nothing
else — then applied to bark, clay and horn as well. The herbs branch was special-cased
to escape it, but that branch dropped the `+"s"`, so a named hand always read
*"Vigdís turn up"*. Only the player, whose verb is bare, read correctly.

**Fix (v0.17.25).** A `FIND` table gives each byproduct its own line, split into verb and
remainder so agreement is handled in one place for both you and a named hand:

| find | comes from | reads |
|---|---|---|
| herbs | Walk the woods | Gyða **turns** up herbs among the grass |
| bark | Fell old timber | Gyða **strips** bark from the felled trunk |
| clay | Work the scree | Gyða **digs** clay out of the scree |
| horn | Tend the flock | Gyða **brings** in horn from the flock |
| ivory | Fish the deeps | Gyða **brings** up walrus ivory from the deep water |

**Verified:** every `rare` an action can drop has its own line, no unused lines, and both
the *You* and named-hand forms read correctly; a fallback covers any byproduct added
later without a line.

**Left alone, worth a decision:** the toast rule is still `k !== "herbs"`, so bark, clay
and horn each pop a "Rare:" toast at ~18–20% — as frequent as herbs, which is excluded.
Reserving the toast for genuine sea finds (ivory and rarer) would cut the noise, but it
changes how the game *feels*, so it stays as-is until asked for.

---

## 28. ✅ The one-tap "give her the tool" button on the crew card (#13 was never finished)

**Reported:** *"Still get the button to give the crew equipment."*

**Cause.** #13 asked for the shortcut equips to go — *"crew equipment, and the player's on
the Work panel"*. Two were dealt with:

- Work panel quick-equip — **removed** (v0.17.11)
- Crew slot picker — **kept** deliberately, with a gold `best` mark (v0.17.12)

But a **third** one was never touched: the crew card's own gold notice carried a one-tap
`give her the horn comb` button, which fits the item without ever opening the slot. It
predates the whole bug list, so nothing in the #13 work went near it — it was simply
missed.

**Fix (v0.17.26).** Button removed; the notice now *names* what is waiting, exactly the
resolution used for the player's Work panel. The fitting is done in the slot, where the
`best` mark already points at the right pick:

| case | reads |
|---|---|
| empty slot | Her tool slot is empty — a horn comb lies in the pile, ready to fit. |
| better available | A broad axe in the pile would better what he holds. |
| wrong craft | She is holding an antler pick, which is no use to her — a horn comb lies in the pile. |

**Verified:** no one-tap give buttons remain; `data-eq` now has a single entry point (the
picker), so its handler is still needed and still works. Article and pronoun agreement
checked across slots and both genders.

**Note on the report:** the screenshot was **v0.17.4** (31 Jul) on a second, fresh hall —
a build old enough to predate the service worker (#25, v0.17.13), so that install has no
way to update itself and is stuck. The button was genuinely still on `main` too, so the
report stands on its own; but that device needs a manual re-add before it sees any of
this.

---

## 29. ✅ Nothing could be sheltered through the fire — every "take" was swallowed

**Reported:** *"Cant take a crew when prestiging."* Screenshot showed the reckoning at
`0 of 1 chosen` with the take buttons doing nothing.

**Cause.** `data-pick` was doing **two unrelated jobs**:

| emitter | meaning |
|---|---|
| slot picker's **done** button (`data-pick=""`) | close `S.pick` — a cursor for which slot's picker is open |
| shelter list's **take/keep** (`data-pick="c0"`) | toggle membership of `s.picks` — the list carried through the fire |

The tap dispatcher tested them in this order:

```js
else if(d.pick!==undefined){ S.pick=null; … }   // line 2541 — matches BOTH
…
else if(d.pick)togglePick(d.pick);              // line 2570 — unreachable
```

`!==undefined` is true for `"c0"` as much as for `""`, so the first branch caught every
shelter tap, set an already-null cursor to null, redrew, and returned. `togglePick` was
**dead code**. Not a crew problem — items, lore and ways were equally unpickable, so a
reckoning could only ever be taken with nothing saved.

The two state fields are `S.pick` (a cursor) and `s.picks` (a list) — near-identical
names for unrelated things, which is how one attribute came to serve both.

**Fix (v0.17.28).** The picker's done button now emits `data-pickoff`; the branch tests
`d.pickoff`. `data-pick` means sheltering and nothing else. CSS tap-target rule updated
so the done button keeps its pointer affordance.

**Verified:**
- Reproduced against shipped `main` first — all four shelter taps landed on
  `d.pick!==undefined`; after the fix each reaches its intended branch.
- Audited every `data-*` the markup emits against the dispatcher: **no attribute name is
  tested twice**, and nothing emitted goes undispatched.
- The selection rules themselves were never broken, only unreachable — confirmed once
  routed: one person max ("Only one of your people can be hidden in the tree"), the
  overall cap from age + Long memory, and tapping an entry again deselects it.

---

## 30. ✅ "Mend her" offered itself, then refused — the notice counted only the hull

**Reported:** *"Somethings wrong with mending ships, sailcloths."* Screenshot: *"Mending
wants 2 hull — you have 111"* with a live **mend her** button, which on tapping only
answered *"4 sailcloth to mend her"* — and Sailcloth was 0.

**Cause.** Mending wants three things:

```js
const want=Math.min(8,Math.ceil((100-sh.cond)/5));      // hull
const cloth=Math.max(2,Math.round(want*2.2));            // sailcloth
const stone=want>=6?1:0;                                 // Eidsborg hone
```

The panel worked the hull out **a second time, on its own**, and knew nothing of the
other two — so the notice named only the hull and the button's `disabled` test was
`s.res.hull>=want`. Everything the hall was short of only surfaced as a toast *after* the
tap. Exactly the "two heuristics answering the same question" trap in handover §3.

**Fix (v0.17.29).** One `mendNeed(sh)` returns all three; `mendShip`, the notice and the
button all read it. The notice names each want and reddens what is short:

| her state | reads | button |
|---|---|---|
| 91/100, no sailcloth | Mending wants 2 hull · **4 sailcloth — you have 0** | disabled |
| 60/100, no sailcloth | Mending wants 8 hull · **18 sailcloth — you have 0** · 1 eidsborg hone | disabled |
| 60/100, stocked | Mending wants 8 hull · 18 sailcloth · 1 eidsborg hone | enabled |

`stateSig` also now carries what each ship lacks — neither sailcloth nor the hone was
tracked in it, so the notice would have sat stale until something unrelated forced a
redraw.

## 32. ✅ The Sea dot was drawn and wiped again in the same breath (real cause of #31)

**Reported:** *"Still no dot for unloading"* — on v0.17.29, with a Longship plainly
**Home from the skerries** and its *unload her* button showing. #31's contrast fix was
real but was not the whole story.

**Cause — two writers to one element, one of them behind the cache.** `#ts` was written
from both:

```js
// draw(), direct — never touches set()'s cache
if(seaBtn) seaBtn.innerHTML = s.markets.length ? `Sea <span …>M</span>` : "Sea";
// paint(), through set(), which skips the write when _c[id] matches
set("ts","Sea"+(s.trips.some(t=>t.home)?'<span class="dot"></span>':…));
```

`set` returns early when its cache says the value is unchanged — but the cache only knows
what `set` itself wrote. So the moment a ship made the sand:

| frame | what happened |
|---|---|
| she arrives | `set` writes the dot, caches it |
| next frame | `draw` overwrites with `Sea M` · `set` sees cache == dot, **writes nothing** |

The dot appeared for a single frame and was then gone for good — with the kaupstefna mark
also flickering against it. Same shape as #29: one thing answering to two owners.

**Fix (v0.17.30).** The Sea tab's whole label is written in **one place**, in `paint()`.
`draw()`'s direct write is gone; the mark is folded into the same `set` call.

**Also, as asked:** the kaupstefna **M sits on its own line above the name** rather than
beside it, and it is darkened on the active tab like the dot — it was gold-on-gold too.

**Verified** by replaying frames against both builds: on shipped `main` the dot survives
one frame then is wiped; with the fix the mark and the dot hold together across frames.
All dot conditions re-checked — home (including one of several), home in preference to
the rust stalled dot, and nothing while all are at sea.

## 31. ✅ The tab dot is invisible on the tab you are on

**Reported alongside:** *"add a dot to the sea tab when a ship is back and ready for
unloading."*

**Already there, and correct** — `paint()` sets a gold dot on Sea whenever
`s.trips.some(t=>t.home)`. Verified against the real expression: gold dot when a ship is
home (including when one of several is home, and in preference to the rust stalled-ship
dot), nothing while all are at sea.

**The real defect** is that `.dot` is gold and `#tabs button.on` is *also* gold — so the
dot cannot be seen on whichever tab is open. That hides it on every tab, not just Sea.
Fixed by darkening the dot on the active tab. The rust variant sets its colour inline, so
it was always visible and is unaffected.

Two other reasons a home ship might show no dot, both working as intended: **a hand on
the tiller** lands her automatically (`land(ti)` the same tick she arrives), and the dot
clears the moment she is unloaded.

---

*Add new bugs above this line as they come in.*
