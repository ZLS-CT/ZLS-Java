<div align="center">

  <a href="https://github.com/ZLS-CT/ZLS-Java">
    <img src="https://raw.githubusercontent.com/ZLS-CT/ZLS-Java/main/ZLS-LogoTransparent.png" width="140" height="140" alt="ZLS Logo" />
  </a>

  <h1>ZLS - Hypixel SkyBlock Scanner</h1>

  <p>
    A <strong>Fabric mod</strong> for Hypixel SkyBlock that scans for rare and valuable items<br/>
    on players, in the world, and in the auction house.
  </p>

  <p>
    <a href="https://github.com/ZLS-CT/ZLS-Java/releases">
      <img src="https://img.shields.io/github/v/release/ZLS-CT/ZLS-Java.svg?include_prereleases&style=for-the-badge&color=5865F2" alt="Latest Release" />
    </a>
    <img src="https://img.shields.io/badge/Minecraft-26.1.2–26.2-62b47a?style=for-the-badge" alt="Supported Versions" />
    <img src="https://img.shields.io/badge/Loader-Fabric-b87333?style=for-the-badge" alt="Fabric" />
  </p>

  <blockquote>
    <strong>Supported versions</strong> mirror those used by Hypixel SkyBlock (<code>26.1.2</code> - <code>26.2</code>)
  </blockquote>

</div>

---

## Feature List

---

<details>
<summary><b>Profile Scanning</b></summary>

<br/>

Scans player profiles using the Hypixel API to find rare and valuable items.

| Option | Description |
|--------|-------------|
| **Old Profile Scanning** | Flags profiles created before a configurable date cutoff |
| **Exotic Database Scanning** | Shows historical database items when scanning players |
| **Museum Scanning** | Optionally scan player museums *(doubles API key usage)* |
| **Ironman Profile Scanning** | Toggle whether ironman profiles appear in scan results |

</details>

---

<details>
<summary><b>World Scanning</b></summary>

<br/>

Automatically scans the world for rare and valuable items.

| Option | Description |
|--------|-------------|
| **Equipped Item Scanning** | Scans player equipped armor and held items |
| **Private Island Scanning** | Scans armor stands, item frames, and showcase blocks on private islands |
| **Sign Scanning** | Scans signs for marked keywords such as *exotic*, *fairy*, and *dyed* |
| **Scanned Item Tracers** | Renders tracers, hitboxes, and display names to scanned items and players |

</details>

---

<details>
<summary><b>Tracked Items</b></summary>

<br/>

A complete list of rare and valuable items the mod detects.

<details>
<summary><b>Armor & Dyes</b></summary>

<br/>

- **Exotic Armor**
- **Glitched Armor**
- **OG Fairy Armor**
- **Fairy Armor**
- **Crystal Armor**
- **Spook-Dyed Fairy Armor**
- **Bleached Items**
- **Hidden Dyes** - Items that were once dyed but had their dye replaced by another SkyBlock dye or skin
- **Old Colors** - Items with non-default hex colors, including Crystal, Fairy, Great Spook, Adaptive, Ghostly Boots, Rancher Boots, and Mastiff

</details>

<details>
<summary><b>Skins & Collectibles</b></summary>

<br/>

- **Applied & Unapplied Skins** - With a configurable minimum price threshold
- **New Year's Cakes** - With a configurable year cap and custom year list

<details>
<summary><b>Misc Collectibles</b></summary>

<br/>

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

*...and many more!*

> **Always Soulbound Items** *(disabled by default)*: Null Boots, Dyed Null Boots, Horse Armor, Legacy God Potion, Gemstone Items, Monster Spawn Eggs, Rare Nulls, Mob Skulls, Mystery & Unknown Pets, Ember Ash Armor & Silex, Empty Map, Extra Large Gemstone Sack, Potatoes & Carrots.

</details>
</details>

<details>
<summary><b>Reforges</b></summary>

<br/>

| Category | Reforges |
|----------|----------|
| **Legacy Reforges** | Demonic, Strong, Hurtful, Forceful, Rich Swords, Odd Bows |
| **Ghost Reforges** | Godly, Unpleasant, Superior, Zealous, Keen, Bloodshot |
| **Accessory Reforges** | Itchy, Shaded, Pretty, Ominous, Pleasant, Simple, Bloody, Silky, Bizarre, Sweet |
| **Farming Tool Reforges** | Double-Bit, Great, Lumberjack's, Lush, Rugged, Toil, Moil, Moonglade, Earthy, Blessed, Bountiful |
| **Ghost Farming Tool Reforges** | Robust, Blessed, Pleasant, Green Thumb, Zooming, Bountiful |

</details>
</details>

---

<details>
<summary><b>Seymour Armor</b></summary>

<br/>

Analyze and find valuable hex colors on Seymour armor pieces.

| Option | Description |
|--------|-------------|
| **Color Difference Versions** | Choose between **CIE 76** and **CIEDE 2000** for color matching accuracy |
| **Visual Distance Tolerance** | Configurable per color difference version; controls how visually similar a hex must be to be flagged |
| **Absolute Difference Tolerance** | Sets the maximum absolute hex difference allowed |
| **Matching Styles** | Detects special hex patterns such as `AAABBB`, `ABCABC`, `AABBCC`, and more |
| **Matching Words** | Finds words in hex codes (e.g. `CAFE`, `DEAD`), with a configurable minimum word length |
| **Owned Signature Detection** | Marks pieces matching hex signatures found in your local item database (e.g. `AxBxCx`), with a configurable required match count |
| **Fade Dyes** | Detects fade dyes (Rose, Lucky, Ocean, etc.) with per-dye selection and independent tolerances |
| **Custom Hex Scanning** | Scan for user-defined target hexes with independent tolerances |
| **Custom Word Scanning** | Scan for user-defined words in hex codes |
| **Correct Piece Limit** | Optionally restricts valuable marks to pieces in the correct armor slots |

</details>

---

<details>
<summary><b>Tooltips & Lore</b></summary>

<br/>

Modify item tooltips with useful information.

| Option | Description |
|--------|-------------|
| **Hex Code Display** | Shows the hex code in the lore for every item |
| **Database Counts Display** | Shows exotic, crystal/fairy, and bleached database counts in item lore, each with configurable thresholds |
| **Scanned Item Reforge** | Displays legacy and ghost reforges on scanned items |
| **Dye Type Tags** | Shows the dye type in lore (e.g. `GLITCHED`, `CRYSTAL`, `OG FAIRY`) |
| **Pure/True Color Hints** | Displays pure or true color matches (e.g. `PURE RED`, `TRUE MINT`) |
| **Hex Color Recipe Hints** | Shows simple hex mix recipes in lore (e.g. `#7F7FFF (+1 WHITE)`) |
| **Skin Price Display** | Shows skin prices in lore |
| **Cake Value Display** | Shows cake values in lore |
| **Item Timestamp Display** | Shows the item's creation date in lore, with an optional Unix timestamp |
| **Dark Hex Readability** | Adds a configurable background highlight behind dark hex colors for visibility |
| **Close Seymour Matches** | Shows close Seymour armor matches in item lore, with configurable max display count and priority ordering |
| **Misc Collectable Reasons** | Explains why a misc collectable is flagged as valuable |
| **Scanned Item Scuffness** | Displays the scuffness level of a scanned item (e.g. `Scuff`, `Reforge`, `Hyperclean`) |

</details>

---

<details>
<summary><b>Item Highlighting</b></summary>

<br/>

> All highlight colors are **fully customizable**.

<table>
  <tr>
    <td>Valuable Items</td>
    <td>Legacy Reforge Items</td>
  </tr>
  <tr>
    <td>Ghost Reforge Items</td>
    <td>Marked Player Profiles</td>
  </tr>
  <tr>
    <td>Perfect Match Seymour</td>
    <td>Matching Style Seymour</td>
  </tr>
  <tr>
    <td>Duplicate Hex Seymour</td>
    <td>Custom Hex Seymour (Tiers 0-2)</td>
  </tr>
  <tr>
    <td>Custom Wildcard Hex Seymour</td>
    <td>Valuable Right Piece Seymour (Tiers 0-2)</td>
  </tr>
  <tr>
    <td>Valuable Wrong Piece Seymour (Tiers 0-2)</td>
    <td>Custom Word Seymour</td>
  </tr>
  <tr>
    <td>Matching Word Seymour</td>
    <td>Owned Signature Seymour</td>
  </tr>
  <tr>
    <td colspan="2">Fade Dye Seymour (Tiers 0-2)</td>
  </tr>
</table>

</details>

---

<details>
<summary><b>Auction House Scanner</b></summary>

<br/>

| Option | Description |
|--------|-------------|
| **Auction Scanning** | Scans the auction house for valuable items |
| **Auction Type Filtering** | Toggle BIN/BID auctions independently |
| **Max Item Price Filter** | Set a maximum price cap for scanned items |
| **Decay Timer** | Configure how long scanned auctions remain visible in the HUD |
| **Item Whitelist/Blacklist** | Fine-grained control over which items are included or excluded from scanning |

</details>

---

<details>
<summary><b>Player Tracker</b></summary>

<br/>

| Option | Description |
|--------|-------------|
| **Online Status Monitoring** | Track a custom list of players and receive alerts when they come online, go offline, or join your lobby |
| **Configurable Alert Types** | Choose between title, chat message, or both for each alert type |
| **Lobby Join Detection** | Optionally alerts when a tracked player joins your current lobby, with clickable chat action links |

</details>

---

<details>
<summary><b>HUD Displays</b></summary>

<br/>

| Display | Description |
|---------|-------------|
| **Item Display** | Shows scanned player items in a configurable HUD, with decay timer, scroll controls, and max item count |
| **Island Item Display** | Shows scanned island items in a configurable HUD |
| **Worn Item Display** | Shows worn items of scanned players in a configurable HUD |
| **Old Profiles Display** | Shows old profile scan results with decay timer and profile navigation keybinds |
| **Auction Scanner Display** | Shows auction house scanner results in a configurable HUD with decay timer |
| **Player Tracker Display** | Shows tracked player online statuses in a configurable HUD with decay timer and online-only filter |

</details>

---

<details>
<summary><b>Keybinds</b></summary>

<br/>

Fully configurable keybinds for:

- Scanning & rendering toggles
- All HUD displays
- Auction navigation
- Warp hotkeys (x9 slots + cycling)

</details>
