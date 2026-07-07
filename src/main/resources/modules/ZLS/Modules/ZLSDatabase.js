import { NormalizePlayerUUID, isNullOrUndefined, ChatDebug, defaultHeaders } from "../../ZCore"
import { fetch } from "../ZRequest/fetch"

export const SendPlayerData = (playerUUIDList, databaseUrl, dataMessageCallback) => {
    const playerDatabaseItems = {}
    fetch(databaseUrl, {
        method: "POST",
        headers: defaultHeaders,
        body: {
            "_0x21631d10": playerUUIDList,
        },
        json: true,
    })
    .then(response => {
        if (!response.body) return
        Object.keys(response.body).forEach(playerUUID => {
            const playerData = response.body[playerUUID]
            playerUUID = NormalizePlayerUUID(playerUUID)
            playerData.forEach(item => {
                if (isNullOrUndefined(item["itemID"])) return
                if (!playerDatabaseItems.hasOwnProperty(playerUUID)) {
                    playerDatabaseItems[playerUUID] = []
                }
                playerDatabaseItems[playerUUID].push(item)
            })
        })
        dataMessageCallback({
            success: true,
            isError: false,
            items: playerDatabaseItems,
        })
        return
    })
    .catch(e => {
        ChatDebug(`&c[ZLS] Error fetching player data from database: ${e} | ${e.stack}&6.`)
        dataMessageCallback({
            success: false,
            isError: true,
        })
        return
    })
}
