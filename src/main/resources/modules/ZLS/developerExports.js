let functionExports = {}
export const SetFunctionExports = (exports) => {
    functionExports = exports
}
export const GetFunctionExports = () => {
    return functionExports
}

/**
 * Updates some skins names to better reflect what they are.
 * (e.g. "GUARDIAN" -> "WATCHER_GUARDAN")
 *
 * @param {string} petSkinID - Original pet skin ID
 * @returns {string} The output pet skin ID
 */
export const UpdateSkinName = (petSkinID) => {
    return functionExports.UpdateSkinName(petSkinID)
}

/**
 * Updates some item IDs to better reflect their actual item type.
 * (e.g. "BARDING" -> "HORSE_ARMOR")
 *
 * @param {string} itemID - Original item ID
 * @returns {string} The output item ID
 */
export const UpdateItemID = (itemID) => {
    return functionExports.UpdateItemID(itemID)
}

/**
 * Removes legacy prefixes from item IDs.
 * (e.g. "GODLY_UNSTABLE_HELMET" -> "UNSTABLE_HELMET")
 *
 * @param {string} itemID - Original item ID
 * @param {boolean} [removeModifiers = true] - If true, also removes rune and frostwalker prefixes
 * @returns {string} The output item ID
 */
export const RemoveReforgeFromItemID = (itemID, removeModifiers = true) => {
    return functionExports.RemoveReforgeFromItemID(itemID, removeModifiers)
}

/**
 * Converts interal legacy reforge names to their actual names.
 * (e.g. "rich_sword" → "rich")
 *
 * @param {string} legacyReforgeName - Original legacy reforge name
 * @returns {string} Output reforge name
 */
export const UpdateLegacyReforgeName = (legacyReforgeName) => {
    return functionExports.UpdateLegacyReforgeName(legacyReforgeName)
}

/**
 * Returns a formatted string for the SkyBlock profile name.
 * (e.g. "blueberry" -> "&9Blueberry")
 *
 * @param {string} profileCuteName - The profile name (e.g. "Blueberry").
 * @returns {string} The formatted profile name
 */
export const FormatProfileCuteName = (profileCuteName) => {
    return functionExports.FormatProfileCuteName(profileCuteName)
}

/**
 * Determines an item's category, such as "armor", "weapon", or "accessory".
 * (e.g. "leather_helmet" -> "armor")
 *
 * @param {string} itemType - The Minecraft item type (e.g. "leather_helmet").
 * @param {string} itemName - Item display name
 * @param {string[]} [itemLore = []] - Item lore list
 * @returns {"armor"|"weapon"|"accessory"|null} The output item category, or null
 */
export const GetItemCategoryFromItemType = (itemType, itemName, itemLore = []) => {
    return functionExports.GetItemCategoryFromItemType(itemType, itemName, itemLore)
}

/**
 * Decodes a Base64 string into the list of nbt items.
 *
 * @param {string} rawNBTString - A Base64 string of compressed NBT data
 * @returns {*} A list of nbt compound items, or an empty array
 */
export const GetItemListFromEncodedNBT = (rawNBTString) => {
    return functionExports.GetItemListFromEncodedNBT(rawNBTString)
}

/**
 * Decodes a byte array into the list of nbt items.
 *
 * @param {number[]|Int8Array} byteArray - Raw bytes of compressed NBT data.
 * @returns {*} A list of nbt compound items, or an empty array
 */
export const GetItemListFromNBT = (byteArray) => {
    return functionExports.GetItemListFromNBT(byteArray)
}

/**
 * Gets the valuable items from a list of items, also returns a list of all Seymour items.
 * (Seymour isn't scanned here, requires a separate call to `GetValuableSeymourFromList` to get the actual Seymour value data for each item).
 *
 * @param {object[]} playerItems - List of item data objects
 * @param {string} playerUUID - Player UUID
 * @param {boolean} worldScan - Whether the player was scanned from the world (worn items)
 * @returns {{ ValuableItemList: object[], SeymourItemList: object[] }}
 *   An object containing the list of valuable items and the list of Seymour items.
 */
export const GetValuablePlayerItems = (playerItems, playerUUID, worldScan) => {
    return functionExports.GetValuablePlayerItems(playerItems, playerUUID, worldScan)
}

/**
 * Returns a list of item data objects from a tag list of nbt compound items.
 *
 * @param {number[]|Int8Array} rawNBT - Raw bytes of compressed NBT data.
 * @returns {object[]} Array of item data objects.
 */
export const GetAllPlayerItemsFromNBT = (rawNBT) => {
    return functionExports.GetAllPlayerItemsFromNBT(rawNBT)
}

/**
 * Returns a list of item data objects from a tag list of nbt compound items.
 *
 * @param {number[]|Int8Array} rawNBT - Raw bytes of compressed NBT data.
 * @returns {object[]} Array of item data objects.
 */
export const GetAllPlayerItemsEncodedFromNBT = (rawNBT) => {
    return functionExports.GetAllPlayerItemsEncodedFromNBT(rawNBT)
}

/**
 * Returns a list of item data objects from a list of nbt items.
 *
 * @param {*} nbtItemList - A list of nbt compound items.
 * @returns {object[]} Array of item data objects.
 */
export const GetAllPlayerItems = (nbtItemList) => {
    return functionExports.GetAllPlayerItems(nbtItemList)
}

// AI from here down
/**
 * Converts a NBT compound into a JSON item data object.
 *
 * @param {object} itemJSONNBTObject - Deserialized NBT compound tag for one item slot.
 * @returns {object|null} Structured item data object, or null if the item is empty/invalid.
 */
export const GetItemDataFromNBTObject = (itemJSONNBTObject) => {
    return functionExports.GetItemDataFromNBTObject(itemJSONNBTObject)
}

/**
 * Computes scuffed-state flags for an item based on its applied modifications.
 *
 * @param {object} itemData - A structured item data object as returned by {@link GetItemDataFromNBTObject}.
 * @returns {{
 *   isReforged: boolean,
 *   isDungeonized: boolean,
 *   isRecombed: boolean,
 *   hotPotatoBooks: number,
 *   fumingPotatoBoots: number,
 *   starCount: number,
 *   artOfPeaceApplied: boolean,
 *   isHyperclean: boolean,
 *   isReforgeOnly: boolean,
 *   isScuffed: boolean
 * }} Modification state of the item.
 */
export const GetItemScuffedData = (itemData) => {
    return functionExports.GetItemScuffedData(itemData)
}

/**
 * Looks up the default dye hex color for an item ID.
 *
 * @param {string} itemID - The full item ID.
 * @returns {string|null} Uppercase hex color string (no leading "#"), or null if no default exists.
 */
export const GetDefaultArmorHexCode = (itemID) => {
    return functionExports.GetDefaultArmorHexCode(itemID)
}

/**
 * Returns a ZTextComponent with the notable item properties.
 *
 * @param {object} itemData - A structured item data object from {@link GetItemDataFromNBTObject}.
 * @param {boolean} worldScan - Whether the item was scanned from the world (Worn by a player).
 * @returns {ZTextComponent} Rich text component for chat display, or an empty component if nothing notable.
 */
export const GetItemPrettyName = (itemData, worldScan) => {
    return functionExports.GetItemPrettyName(itemData, worldScan)
}

/**
 * Retrieves the item stack displayed in an item frame entity.
 *
 * Returns index -1 to indicate the item originates from an item frame.
 *
 * @param {*} mcEntity - The Minecraft item frame entity (Java object).
 * @returns {Array<{item: *, index: -1}>} Single-entry array with the displayed item stack.
 */
export const GetItemFrameItems = (mcEntity) => {
    return functionExports.GetItemFrameItems(mcEntity)
}

/**
 * Retrieves the item stack from a dropped item entity.
 *
 * Returns index -2 to indicate the item originates from a dropped item entity.
 *
 * @param {*} mcEntity - The Minecraft dropped item entity (Java object).
 * @returns {Array<{item: *, index: -2}>} Single-entry array with the item stack.
 */
export const GetDroppedItemItems = (mcEntity) => {
    return functionExports.GetDroppedItemItems(mcEntity)
}

/**
 * Retrieves all equipment item stacks from an armor stand entity.
 *
 * Index mapping: 0 = main hand, 1 = boots, 2 = leggings, 3 = chestplate, 4 = helmet.
 * Supports both legacy and modern Minecraft entity APIs.
 *
 * @param {*} mcEntity - The Minecraft armor stand entity (Java object).
 * @returns {Array<{item: *, index: number}>} Five-entry array, one per equipment slot.
 */
export const GetArmorStandItems = (mcEntity) => {
    return functionExports.GetArmorStandItems(mcEntity)
}

/**
 * Clears all in-memory item scan caches to force a fresh scan on the next pass.
 *
 * If `fullClear` is true, also resets player equipment caches, entity location
 * tracking, tracer lists, sign location maps, island state, and leather armor hex caches.
 * Always fires `onCacheClearedTrigger` after clearing.
 *
 * @param {boolean} fullClear - If true, performs a full reset of all caches including entity tracking.
 */
export const ClearCaches = (fullClear) => {
    return functionExports.ClearCaches(fullClear)
}

/**
 * Associates a custom display name and/or lore entry with an item by hash and/or UUID.
 *
 * Multiple lore entries are accumulated across successive calls. If `newItemName` is
 * null, any previously stored name is retained.
 *
 * @param {string|null} [itemHash=null] - Hash key for the item (secondary lookup key).
 * @param {string|null} [itemUUID=null] - UUID of the item (primary lookup key).
 * @param {string|null} [newItemName=null] - Custom display name, or null to keep existing.
 * @param {*|null} [newLoreData=null] - Lore entry to append, or null to add none.
 */
export const AddCustomNameAndLoreToItem = (itemHash = null, itemUUID = null, newItemName = null, newLoreData = null) => {
    return functionExports.AddCustomNameAndLoreToItem(itemHash, itemUUID, newItemName, newLoreData)
}

/**
 * Builds a rich text component displaying Seymour hex analysis results for an item.
 *
 * @param {object|null} seymourItemData - Seymour analysis result object for the item.
 * @param {boolean} inLore - If true, formats for multi-line lore injection with extra detail.
 *                           If false, formats for compact chat display.
 * @returns {ZTextComponent} Assembled Seymour marker component, or an empty component if `seymourItemData` is falsy.
 */
export const GetSeymourHexMarker = (seymourItemData, inLore) => {
    return functionExports.GetSeymourHexMarker(seymourItemData, inLore)
}

/**
 * Looks up the estimated occurrence count of a hex color on an item ID in the crystal armor database.
 *
 * @param {string} itemID - SkyBlock item ID (without reforge prefix).
 * @param {string} hexCode - Uppercase hex color string (no leading "#").
 * @returns {number} Count for this item/hex pair, 0 if hex exists but not for this item,
 *                   or -1 if the hex isn't in the database.
 */
export const GetCrystalDatabaseCount = (itemID, hexCode) => {
    return functionExports.GetCrystalDatabaseCount(itemID, hexCode)
}

/**
 * Retrieves estimated occurrence counts for a hex color on an item ID from the exotic armor database(s).
 *
 * Databases queried depend on `Settings.toggleExoticDatabaseCountsDatabaseSelector`:
 * 0 = no-dupes only, 1 = dupes only, 2 = both.
 *
 * @param {string} itemID - SkyBlock item ID (without reforge prefix).
 * @param {string} hexCode - Uppercase hex color string (no leading "#").
 * @returns {number[]} Count per queried database. Each value is the count for this item/hex pair,
 *                     0 if hex exists but not for this item, or -1 if the item isn't in the database.
 */
export const GetExoticDatabaseCounts = (itemID, hexCode) => {
    return functionExports.GetExoticDatabaseCounts(itemID, hexCode)
}

/**
 * Evaluates a list of armor data objects against the Seymour detection system
 * and invokes a callback with all results.
 *
 * Items with a cached UUID are resolved immediately; the rest are submitted for fresh evaluation.
 * Each fresh result is cached and fires `onSeymourArmorScannedTrigger`.
 *
 * @param {object[]} armorList - Array of item data objects to evaluate.
 * @param {function(object[]): void} callback - Called with the combined array of Seymour result objects.
 *   Each result contains `armorData` and `valueData` fields.
 */
export const GetValuableSeymourFromList = (armorList, callback) => {
    return functionExports.GetValuableSeymourFromList(armorList, callback)
}
