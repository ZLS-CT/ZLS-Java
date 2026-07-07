# Features

## API Scanning

Automatically scans players with the Hypixel API to find rare and valuable items.

- **Lobby Scanning** - Scans players for valuable items when joining lobbies, with a configurable SkyBlock level cutoff to filter out low-level profiles.
- **Old Profile Scanning** - Flags profiles created before a configurable date cutoff.
- **Museum Scanning** - Optionally Scan player museums *(doubles API key usage)*.
- **Exotic Database Scanning** - Shows historical database items when scanning players.
- **Ironman Profile Scanning** - Toggle whether ironman profiles appear in scan results.

### World Scanning

- **Equipped Item Scanning** - Scans player equipped armor and held items.
- **Private Island Scanning** - Scans armor stands, item frames, and showcase blocks on private islands.
- **Sign Scanning** - Scans signs for marked keywords such as *exotic*, *fairy*, and *dyed*.
- **Scanned Item Tracers** - Renders tracers, hitboxes, and display names to scanned items and players.

---

## Tracked Items

A list of valuable, and rare items the mod detects.

### Armor & Dyes
- **Exotic Armor**
- **Glitched Armor**
- **OG Fairy Armor**
- **Fairy Armor**
- **Crystal Armor**
- **Spook-Dyed Fairy Armor**
- **Bleached Items**
- **Hidden Dyes** - Items that were once dyed but had their dye replaced by another SkyBlock dye or skin.
- **Old Colors** - Items with non-default hex colors, including Crystal, Fairy, Great Spook, Adaptive, Ghostly Boots, Rancher Boots, and Mastiff.

### Skins & Collectibles
- **Applied & Unapplied Skins** - With a configurable minimum price threshold.
- **New Year's Cakes** - With a configurable year cap and custom year list.

### Reforges
- **Legacy Reforges** - Demonic, Strong, Hurtful, Forceful, Rich Swords, and Odd Bows.
- **Ghost Reforges** - Godly, Unpleasant, Superior, Zealous, Keen, and Bloodshot.
- **Accessory Reforges** - Itchy, Shaded, Pretty, Ominous, Pleasant, Simple, Bloody, Silky, Bizarre, and Sweet.
- **Farming Tool Reforges** - Double-Bit, Great, Lumberjack's, Lush, Rugged, Toil, Moil, Moonglade, Earthy, Blessed, and Bountiful.
- **Ghost Farming Tool Reforges** - Robust, Blessed, Pleasant, Green Thumb, Zooming, and Bountiful.

### Misc Collectibles
A large and growing list of obscure, legacy, and admin-related items:

| Item | Item |
|------|------|
| Midas' Weapons | OG Salmon Armor |
| Ember Rods | Hyperclean Dungeon Items |
| Ghost Recombed Items | Frostwalker Enchant |
| French Bread | Bag of Cash |
| Enrager | Legacy Repelling Candles |
| 2020 Crab Hats | 2019 Salmon Hats |
| Splash Dungeon Potions | Loreless Blindness Potions |
| Garden Space Helmets | Rift Ancient Elevators |
| Spawned-For Dragon Fragments | Blaze Hat |
| Stat Boosted Items | Power Scrolled Items |
| Admin Spawned Tag | Item Stash Tag |
| Damaged Pickonimbus' | Smite 7 Books |
| Invalid Runes | Mathematical Hoes |
| Legacy Farming For Dummies | Wrong Year Anniversary Hats |
| Special Edition Great Spook Gear | Special Edition Mementos |

**Always Soulbound Items** *(disabled by default)*: Null Boots, Dyed Null Boots, Horse Armor, Legacy God Potion, Gemstone Items, Monster Spawn Eggs, Rare Nulls, Mob Skulls, Mystery & Unknown Pets, Ember Ash Armor & Silex, Empty Map, Extra Large Gemstone Sack, Potatoes & Carrots.

*...and many more!*

- **Soulbound Item Toggle** - Toggle soulbound items in scan results.

---

## Seymour Armor

Analyze and find valuable hex colors on Seymour armor pieces.

- **Color Difference Versions** - Choose between **CIE 76** and **CIEDE 2000** for color matching accuracy.
- **Visual Distance Tolerance** - Configurable per color difference version; controls how visually similar a hex must be to be flagged as valuable.
- **Absolute Difference Tolerance** - Sets the maximum raw hex difference allowed.
- **Matching Styles** - Detects special hex patterns such as `AAABBB`, `ABCABC`, `AABBCC`, and more.
- **Matching Words** - Finds real words in hex codes (e.g. `F4CE`, `B0LD`), with a configurable minimum word length.
- **Owned Signature Detection** - Marks pieces that match hex signatures found in your local item database (e.g. `AxBxCx`), with a configurable required match count.
- **Fade Dyes** - Detects fade dyes (Rose, Lucky, Ocean, etc.) with per-dye selection and independent tolerances.
- **Custom Hex Scanning** - Scan for user-defined target hexes with independent tolerances.
- **Custom Word Scanning** - Scan for user-defined words embedded in hex codes.
- **Correct Piece Limit** - Optionally restricts valuable marks to pieces in the correct armor slot.

---

## Tooltips & Lore

Modify item tooltips with useful information.

- **Hex Code Display** - Shows the hex code in the lore for every item.
- **Database Counts Display** - Shows exotic, crystal/fairy, and bleached database counts in item lore, each with configurable thresholds.
- **Scanned Item Reforge** - Displays legacy and ghost reforges on scanned items.
- **Dye Type Tags** - Shows the dye type in lore (e.g. `GLITCHED`, `CRYSTAL`, `OG FAIRY`).
- **Pure/True Color Hints** - Displays pure or true color matches (e.g. `PURE RED`, `TRUE MINT`).
- **Hex Color Recipe Hints** - Shows simple hex mix recipes in lore (e.g. `#7F7FFF (+1 WHITE)`).
- **Skin Price Display** - Shows skin prices in lore.
- **Cake Value Display** - Shows cake values in lore.
- **Item Timestamp Display** - Shows the item's creation date in lore, with an optional Unix timestamp.
- **Dark Hex Readability** - Adds a configurable background highlight behind dark hex colors for visibility.
- **Close Seymour Matches** - Shows close Seymour armor matches in item lore, with configurable max display count and priority ordering.
- **Misc Collectable Reasons** - Explains why a misc collectable is flagged as valuable.
- **Scanned Item Scuffness** - Displays the scuffness level of a scanned item (e.g. `Scuff`, `Reforge`, `Hyperclean`).

---

## Item Highlighting

All highlight colors are **fully customizable**.

- **Valuable Items**
- **Legacy Reforge Items**
- **Ghost Reforge Items**
- **Marked Player Profiles**
- **Perfect Match Seymour**
- **Matching Style Seymour**
- **Duplicate Hex Seymour**
- **Custom Hex Seymour** (Tiers 0-2)
- **Custom Wildcard Hex Seymour**
- **Valuable Right Piece Seymour** (Tiers 0-2)
- **Valuable Wrong Piece Seymour** (Tiers 0-2)
- **Custom Word Seymour**
- **Matching Word Seymour**
- **Owned Signature Seymour**
- **Fade Dye Seymour** (Tiers 0-2)

---

## Auction House Scanner

- **Auction Scanning** - Scans the auction house for valuable items.
- **Auction Type Filtering** - Toggle BIN/BID auctions independently.
- **Max Item Price Filter** - Set a maximum price cap for scanned items.
- **Decay Timer** - Configure how long scanned auctions remain visible in the HUD.
- **Item Whitelist/Blacklist** - Fine-grained control over which items are included or excluded from scanning.

---

## Player Tracker

- **Online Status Monitoring** - Track a custom list of players and receive alerts when they come online, go offline, or join your lobby.
- **Configurable Alert Types** - Choose between title, chat message, or both for each alert type.
- **Lobby Join Detection** - Optionally alerts when a tracked player joins your current lobby, with clickable chat action links.

---

## HUD Displays

- **Item Display** - Shows scanned player items in a configurable HUD, with decay timer, scroll controls, and max item count.
- **Island Item Display** - Shows scanned island items in a configurable HUD.
- **Worn Item Display**- Shows worn items of scanned players in a configurable HUD.
- **Old Profiles Display** - Shows old profile scan results with decay timer and profile navigation keybinds.
- **Auction Scanner Display** - Shows auction house scanner results in a configurable HUD with decay timer.
- **Player Tracker Display** - Shows tracked player online statuses in a configurable HUD with decay timer and online-only filter.

---

## Keybinds

Fully configurable keybinds for:
- Scanning & rendering toggles
- All HUD displays
- Auction navigation
- Warp hotkeys (x9 slots + cycling)
