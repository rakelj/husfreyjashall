# The hall — design notes

Working document. Records what is decided, what is deliberately deferred, and why.
The build is a single HTML file; content lives in §1 of that file, and anything here
that describes numbers is a statement of intent, not the source of truth.

Current build: **v12.2**

---

## 1. What it is

An idle game about keeping a hall in Norway. You run one work at a time in real
seconds; named hands run theirs whether you are watching or not. Everything is
built on three tiers of craft, a hall that caps what you can hold, and a reckoning
you call yourself when you are ready to begin again.

It is not about raiding. The sea is how rare things arrive and how far you can
reach, not a source of plunder.

**The measure of success:** a year of play for an ordinary player, more for a
completionist, more again if it finds an audience and gets content.

---

## 2. The premise

The hall is held by a **húsfreyja** — the woman of the house, who carried the keys
to the stores and decided what was spent. This is the historically accurate holder
of exactly the authority the game models: provisioning, keeping, deciding who eats.

**The men are gone.** Away on a voyage that did not return, or at war, or dead.
This is ordinary for the period — women ran farms through long absences — and it
explains the whole shape of the game at once. The hall is what is left. Someone has
to work the bloomery whether or not she was trained to it. The sea is the water
that took them, which is why sailing carries the weight it does.

**The cast is female.** Not as a twist and not as a correction — a hall of women
tending, provisioning and keeping is the accurate version of this subject. The
shield-maiden is the interesting exception in a hall of smiths and seeresses,
never the default picture.

A player who does not care about any of this still gets a good game. A player who
does should find the history holds up.

---

## 3. Thralldom — the decided stance

This needs writing down because the current design already implies an answer
without saying so, and doing nothing is itself a choice.

**The problem.** As built, you pay silver once for a person, they work
indefinitely, they receive nothing, and you may dismiss them. That is not
employment — employment has wages. Structurally it is a purchase, and the phrase
"take someone on" is the only thing making it comfortable.

**The stance, in two parts:**

**Inside the hall — free labour, properly paid.** Wage-work existed: day-labourers,
cottars, people with no land of their own. The gate fee becomes an advance against
work. Hands cost ongoing **silver upkeep** as well as food. This is a small
mechanical change that makes the relationship honest, and it gives silver the
permanent sink it needs.

The premise carries it: a hall whose men are gone has likely lost its thralls too —
taken, or sold to survive a winter. **The hall hires because it has nothing.**
Starting with no one and paying for what you can afford *is* the story.

**Outside the hall — present, acknowledged, not yours.** Thralldom exists in the
world. The annal may note it. The eastern markets deal in it, and the wealth of the
river routes is built on it. Your hall does not — not from virtue, but because it
cannot afford to. That is honest about the period without making the player a
slaver.

**Explicitly rejected:** selling people as a dismissal mechanic. Historically
accurate and it would recolour everything else in a game whose feel is tending and
keeping.

**The other game.** A thrall's-eye story is a separate project. It would swallow
this one.

**To encode:** silver upkeep per hand, added when the flow panel is built — same
system, same pass. World-level acknowledgement is dressing, and comes with the
naming and art direction.

---

## 4. Decided and built

- **Three tiers of craft.** Raw → processed → product. Eleven crafts, nineteen
  works.
- **Two works to most crafts**, trading rate against a byproduct that cannot be got
  any other way. This is the answer to "every skill does one thing".
- **Ratios are not 1:1.** A processor eats faster than one gatherer can feed it —
  one lit bloom wants nearly two at the bog. The hall is a ratio puzzle.
- **Everyone eats.** Appetite scales exactly as production does, so the share of
  the hall that must forage stays constant at level 5 and level 50. Run out and
  everything stops but foraging.
- **The sea costs weaving.** Mending wants hull, sailcloth and a hone. One
  sailcloth is about six wool off the flock.
- **Voyages are commitments** — 24 minutes to 2h40 — not buttons.
- **She can be lost.** You may sail her worn; the odds are written on the route.
- **Nine at the board, eleven crafts.** Even a full hall leaves two unmanned, and
  the ratios mean you are always the swing hand.
- **Level 100 cap.** Hall to ten. Reaching 100 wants the tenth hall *and* four
  tiers of Elder counsel.
- **Marks count, and the way on is a spine** of 35 steps that carries across ages.

---

## 5. Next, in order

1. **Toggle hands on and off.** A resting hand still eats, at about a third.
   Benching your smith in a food shortage becomes a real trade.
2. **The flow panel.** Per resource: in, out, net, time to empty or full. Tap a
   resource for provenance — *"Ore +12/min · the bloom −21/min · Yrsa idle 40%"*.
   Without this the ratio puzzle is invisible. It also lets you tune rather than
   taking my word for the numbers.
3. **Silver upkeep per hand** (see §3), same pass as the flow panel.
4. **Keys.** See §6.
5. **Tab regrouping.** See §7. Not started — the reskin was cosmetic and left the
   seven tabs alone.
6. **Light and dark, following the device.** See §7.
7. **Setting the table should weigh level.** A pot costs one per mouth regardless
   of who is at the board. It ought to cost more to feed a hall of high-level
   hands, the way appetite already does — otherwise the table gets cheaper in real
   terms the further you go. Match it to the same curve as `appetite()`.
8. **Reorder the crafts on the Work tab.** They are in declaration order, which is
   raw/processed/product but scrambled within — Cooking and Sailmaking sit among
   the gatherers. Group them by tier, in the order the chain runs, so the tab reads
   the way the production table in §4 does.

### Waiting on a test

**iOS taps (v14.6).** Diagnosed but unconfirmed: Safari does not bubble clicks from
plain divs unless they look interactive. Added `cursor:pointer` to every tap
target, put slots and work buttons back in the hit list, disabled double-tap zoom,
and pinned text-size-adjust. Works on Android; needs checking on iPhone. If it is
still wrong, the next suspect is the freeze/thaw layer, which was written against
Chrome.

---

## 6. Keys

**What a key buys is the right to delegate, never the craft itself.** You can
always work any craft with your own hands. A key licenses putting *someone else* on
it. This is the húsfreyja exactly — not the only one who can card wool, the one who
decides who may. It also avoids the Melvor problem of locking a skill away
entirely: nothing is ever unavailable, only unmanned.

**Cut at the forge, after you have done the work yourself.** A key wants iron, a
token of its own craft, and your own level in that craft at about 5. Smithing gets
a job beyond gear; the order of unlocking is genuinely yours; and the first hour is
you working every craft in turn, which the road already teaches.

**Free from the start:** Foraging and Woodcraft.

**Open questions:**

- **How many at once?** Accumulating all eleven is the safe version. A limited
  ring — five places, give one up to take another — makes hall composition a
  standing choice rather than a collection. Riskier, more interesting. *Undecided.*
- **Through the fire?** Leaning no: a new hall means new keys, cut cheaper the
  second time. Then an ørlǫg line — *the ring at her belt* — carries a couple
  through.

**Caution:** keys, food upkeep and ratios are three constraints landing close
together, none of them played yet.

---

## 7. Interface, planned

A phone bottom bar holds five destinations comfortably, six at a squeeze. There are
seven tabs now and more categories coming, so the answer is regrouping, not more
tabs.

| destination | holds |
|---|---|
| **Hall** | your work, the board, flow, annal, stores |
| **Folk** | crew, the gate, feasts, keys |
| **Craft** | gear, inventory, lore |
| **Sea** | boat, routes, charts, markets |
| **Tasks** | four bands, marks, the way on, events |
| **Þing** | *reserved: clans, leaderboards* |

**Not in the bar:** settings, saves, help, credits — a gear icon in the top bar
opening a full-screen overlay, as the shelter screen already works. The reckoning
takes over the screen too; it is ceremonial and rare.

**Two moves that make this landing easier, worth doing early:** fold Lore into
Craft, and pull settings out of the Hall tab into an overlay. That is six tabs
today with the Þing slot free.

**Status:** none of this is built. The v14 reskin changed the look — planks and
grooves, an old-style serif, tallow gold — and left the architecture alone.

### Light and dark

Follow `prefers-color-scheme` by default, with a manual override in settings.

**The caveat worth recording:** the current identity is a smoke-blackened hall lit
by one lamp. A light theme cannot be an inversion of that — inverted, tallow gold
on white is illegible and the whole metaphor collapses. The light version has to be
its own idea drawn from the same world: **limewash and daylight** — a bright
plastered wall, ink-brown text, and the same tallow gold used sparingly as an
accent rather than as the light source. That is a second design pass, not a token
swap, and it is worth knowing before it is promised.

Both themes share one token set; only the values change.

---

## 8. The sea, planned

**Ships as tiers.** Færing → knarr → longship, each a real build in hull and
sailcloth. Routes unlock by ship, so the east way is not available on day one in a
rowing boat.

**Charts, not repetition.** Sailing a route many times should not unlock a better
one — that rewards farming the cheapest water. A **chart** is found at sea, rarely,
and only on the longest route you can currently sail. Charting within a category
opens more of that category.

**Route categories** — four, with four or five destinations each, so twenty-odd
waters rather than four. Each carries its own component bias: the northern waters
for ivory, the eastern for silk.

---

## 9. The kaupstefna

A market you **sail to**, open for a few hours after you arrive. Separate from
seasonal events, which arrive on their own.

**Barter, not shopping.** Silver was weighed for large transactions; a market was
mostly goods for goods. This makes the market the sink for everything you are
capped on — full of timber and short of wool is a trade. Overflow becomes currency,
which is a better answer than raising storage again.

**Rules that keep it from breaking the ratio puzzle:**

- **Limited stock per visit.** An unlimited buyer for timber collapses the hall
  into a woodcutting engine. You convert a surplus; you do not run a conversion
  business.
- **A real spread.** You give more than you get, narrowing with reputation or a
  Trading skill. The market is a place you get better at.
- **Rates that move.** Iron dear this time, wool cheap; reversed next time.
- **Rare components cannot be bought — only spent.** If a hone can be purchased the
  sea stops being the only source and the finer gear stops meaning anything. But
  spending a silk on a market-only recipe is a real decision.
- **Market-only recipes go sideways, not up** — a tool trading speed for yield,
  a garment with an odd bonus. Otherwise the market becomes mandatory.

**Markets, by water:**

| market | water | character |
|---|---|---|
| Kaupang, Skiringssal | home | takes anything, small spread, modest prices |
| Hedeby / Ribe | the Danish gate | Frankish glass, wine, quernstones |
| Dublin | the west | silver by weight, Insular metalwork |
| York | the west | English silver, lead, textiles |
| Staraya Ladoga / Novgorod | the eastern rivers | furs and honey out, silk and eastern silver in |
| Miklagarðr | far east | weeks away; things that exist nowhere else |

The reward for a bigger ship is **access**, not a bigger number: the reason to
build a longship is that Miklagarðr exists and a færing cannot reach it.

**On gambling.** Dice and hnefatafl are historically exact — both turn up in
graves. But store classification reads *randomised reward for a wagered stake* as
gambling regardless of setting, which affects age rating and, in some markets,
listing. The version that keeps the flavour: the stake is goods and the outcome is
never nothing — a hidden bundle worth roughly what you paid, contents unknown.
That is a merchant's lot, not a wager. Or a dice game against a named trader for a
fixed prize, once per market, no stake.

---

## 10. Seasonal events

Six a year, two weeks each, drawn from the Norse calendar. Each shifts what the
task board asks and what the hall looks like.

| when | event | leans on |
|---|---|---|
| late January | **Þorrablót** | the hard month — preserving, stores, the board |
| February | **Dísablót** | the ancestral spirits — charges and ørlǫg |
| mid-April | **Sumarmál** | summer nights — keels in the water, charts |
| June | **Miðsumar** | the long light — everything runs longer |
| mid-October | **Vetrnætr / Álfablót** | a household rite led by the woman of the house, strangers turned from the door — the hall itself |
| late December | **Jól** | the great feast — cooking, guests, folk at the gate |

July to September is deliberately empty: that is the working season, and the game
is already busy.

**These work single-player and offline.** A solstice is a date; the client knows
the date. No server needed. **The game is set in Norway** — seasons are the
setting's, not the player's, as a game set in 1940 does not ask what year you are
in. The dressing carries it: *jól* and *miðsumar* by name, the annal noting the
days shortening.

**Sources are late and reconstructed.** Treat as grounded, not documented.

Use a **fixed in-game calendar**, not the device clock, so no one's event depends
on a timezone.

---

## 11. Community — deliberately parked

Clans and leaderboards are the only features here that change what this project is.
Everything else is a file you drag onto a host. These need a server, accounts,
storage, moderation, and someone to fix it at 2am — against a full-time job and no
team. That is an obligation, not a feature.

**And they need players to be any good.** A leaderboard with nine names looks
abandoned. A clan tab with no active clans is a graveyard on day one. You build
these *because* people came, not to make them come.

**Design so they slot in, at nearly no cost:** keep the Þing tab reserved; make
sure the numbers a leaderboard would rank — ørlǫg, age, marks — are already
meaningful and already stored; keep the save exportable, since accounts eventually
mean uploading exactly that blob.

**The honest trigger to build them:** when there are enough players that their
absence is the complaint.

**If they ever exist**, the donation design:

- **Donate what overflows** — raw materials you are capped on. Full stores become a
  contribution; a small hall and a large one both have something to give.
- **Personal tiers cap low.** Everyone reaches most of them by playing normally
  that week; the top tier is for enthusiasts. Otherwise it is a grind wall dressed
  as a festival.
- **The shared reward is flat, not multiplicative**, so a hall of nine does not
  extract ten times the value from a goal a hall of two helped fill.

---

## 12. Further out

- **Runecraft** — carving a rune onto finished gear for a second bonus, consuming a
  rare component each time, re-carvable. This is the permanent component sink; at
  present total lifetime demand for rare things is 14–40 against unlimited supply.
- **Marks derived rather than authored.** Every axis in §1 emits its own ladder —
  each craft, the hall, lore, crew, the sea, ages. Adding a craft would add its
  marks by itself. Charges then become the small authored layer: a dozen specific
  deeds where hand-writing is the point.
- **Gear variety**, once there is somewhere for it to go.
- **Farming** as a sixth raw craft — grain and flax.
- **Leatherwork**, using horn and hide.
- **Spá** — the völva; consumes rare things rather than producing, to read a voyage
  before you commit or reveal what a hand will become.
- **Brewing**, mead for feasts.
- **Capacitor and a real APK**, when there is a desktop and a reason.

---

## 13. Naming — unresolved

Ruled out: **Orlog** (Assassin's Creed Valhalla's dice game; also a Norwegian naval
term), **Everhall** (clear on Play, but sits in the Everdell/Everholm/Everwild
family), **Hall of Ages** (the "…of Ages" pattern is worn out).

Live: **Keyhold** — the keys are the mark of who runs the stores, and it is already
what the game is about. **The Ones Who Stayed** — states the premise in four words.
Something built on **húsfreyja** — right word, undiscoverable, and nobody can spell
it.

**Check Play search, not Google**, before committing: Play's fuzzy matching is what
actually buries a name.

---

## 14. Standing constraints

- One HTML file. Content in §1, derived readings in §2, working parts in §3.
  The view is one function per tab.
- The save version is a hash of the shape of a fresh state, so a structural change
  invalidates old saves by itself.
- No wear on gear — rejected as a hassle.
- Offline runs at full rate. Caps do the limiting; XP is uncapped, so a night away
  always pays something.
- No ads, no pay-to-win. Monetisation, if ever, is paid expansions and named
  runestones.
