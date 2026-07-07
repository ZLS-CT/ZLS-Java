import * as ZCore from "../../ZCore"

export const CielabVersion = {
    CIE_76: "CIE_76",
    CIEDE_2000: "CIEDE_2000",
}
export const cielabVersionOptions = [
    ["§fCIE 76", "CIE_76"],
    ["§bCIEDE 2000", "CIEDE_2000"],
]

export const seymourTierColors = {
    0: "§b§l",
    1: "§5§l",
    2: "§6§l",
    3: "§f",
    4: "§7",
}
export const seymourVisualDistanceTierThresholds = {
    [CielabVersion.CIE_76]: {
        0: 1,
        1: 2,
        2: 5,
        3: 10,
    },
    [CielabVersion.CIEDE_2000]: {
        0: 0.5,
        1: 1,
        2: 3,
        3: 6,
    },
}
export const seymourAbsoluteDistanceTierThresholds = {
    0: 5,
    1: 10,
    2: 15,
    3: 25,
}

const fadeDyesMap = {
    "great_spook": "§aGreat Spook",
    "ghostly_boots": "§aGhostly Boots",
    "aurora": "§aAurora",
    "black_ice": "§aBlack Ice",
    "frog": "§aFrog",
    "lava": "§aLava",
    "lucky": "§aLucky",
    "marine": "§aMarine",
    "oasis": "§aOasis",
    "ocean": "§aOcean",
    "pastel_sky": "§aPastel Sky",
    "portal": "§aPortal",
    "red_tulip": "§aRed Tulip",
    "rose": "§aRose",
    "snowflake": "§aSnowflake",
    "spooky": "§aSpooky",
    "sunflower": "§aSunflower",
    "sunset": "§aSunset",
    "warden": "§aWarden",
    "hellebore": "§aHellebore",
    "kingfisher": "§aKingfisher",
    "dusk": "§aDusk",
    "forest": "§aForest",
    "black_opal": "§aBlack Opal",
    "jerry": "§aJerry",
    "beach": "§aBeach",
    "charcoal": "§aCharcoal",
    "1.4_pure_dyes": "§a1.4 Pure Dyes",
}
export const fadeDyesList = Object.entries(fadeDyesMap).map(([key, value]) => [value, key])

export const wordTypeOptions = [
    ["Real Words", "realWords"],
    ["Other Words", "otherWords"],
    ["Extra Letter Words", "extraLetterWords"],
]

const GAMMA_LUT = new Array(256)
const XYZ_FACTORS = [
    0.4124, 0.3576, 0.1805,
    0.2126, 0.7152, 0.0722,
    0.0193, 0.1192, 0.9505,
]
const CIE_E = 216.0 / 24389.0
const CIE_K = 24389.0 / 27.0
const REF_X = 0.95047
const REF_Y = 1.0
const REF_Z = 1.08883

for (let i = 0; i < 256; i++) {
    let value = i / 255
    GAMMA_LUT[i] = (value <= 0.04045)
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4)
}

export const RGBToXYZ = (rgb) => {
    const rLinear = GAMMA_LUT[rgb[0]]
    const gLinear = GAMMA_LUT[rgb[1]]
    const bLinear = GAMMA_LUT[rgb[2]]

    return [
        XYZ_FACTORS[0] * rLinear + XYZ_FACTORS[1] * gLinear + XYZ_FACTORS[2] * bLinear,
        XYZ_FACTORS[3] * rLinear + XYZ_FACTORS[4] * gLinear + XYZ_FACTORS[5] * bLinear,
        XYZ_FACTORS[6] * rLinear + XYZ_FACTORS[7] * gLinear + XYZ_FACTORS[8] * bLinear,
    ]
}
export const ConvertToLab = (value) => {
    if (value > CIE_E) {
        return Math.cbrt(value)
    }
    return (CIE_K * value + 16) / 116.0
}
export const XYZToCielab = (x, y, z) => {
    x /= REF_X
    y /= REF_Y
    z /= REF_Z

    return [
        116 * ConvertToLab(y) - 16,
        500 * (ConvertToLab(x) - ConvertToLab(y)),
        200 * (ConvertToLab(y) - ConvertToLab(z)),
    ]
}
export const HexToRGB = (hexCode) => {
    return [
        parseInt(hexCode.slice(0, 2), 16),
        parseInt(hexCode.slice(2, 4), 16),
        parseInt(hexCode.slice(4, 6), 16),
    ]
}

export const GetSignature = (hexCode) => {
    return `${hexCode[0]}${hexCode[2]}${hexCode[4]}`
}
export const GetPrettySignature = (hexCode) => {
    const xChars = ["x", "X"]
    return hexCode
        .toUpperCase()
        .split('')
        .map((char, index) => {
            if (!xChars.includes(char)) return char
            const shouldBeUpper = index % 2 == 0
            return shouldBeUpper ? char.toUpperCase() : char.toLowerCase()
        })
        .join('')
}

export const GetVisualDistanceTier = (visualDistance, cielabVersion) => {
    const thresholds = seymourVisualDistanceTierThresholds[cielabVersion]
    if (visualDistance <= thresholds[0]) return 0
    else if (visualDistance <= thresholds[1]) return 1
    else if (visualDistance <= thresholds[2]) return 2
    else if (visualDistance <= thresholds[3]) return 3
    else return 4
}
export const GetAbsoluteDistanceTier = (absoluteDistance) => {
    const thresholds = seymourAbsoluteDistanceTierThresholds
    if (absoluteDistance <= thresholds[0]) return 0
    else if (absoluteDistance <= thresholds[1]) return 1
    else if (absoluteDistance <= thresholds[2]) return 2
    else if (absoluteDistance <= thresholds[3]) return 3
    else return 4
}

export const GetVisualDifference_CIE76 = (hexCode1, hexCode2) => {
    const colorData1 = GetColorDataFromHex(hexCode1)
    const colorData2 = GetColorDataFromHex(hexCode2)
    return _GetVisualDifference_CIE76(colorData1.c, colorData2.c)
}
export const _GetVisualDifference_CIE76 = (lab1, lab2) => {
    return Math.hypot(
        lab1[0] - lab2[0],
        lab1[1] - lab2[1],
        lab1[2] - lab2[2],
    )
}
export const GetVisualDifference_CIEDE2000 = (hexCode1, hexCode2) => {
    const colorData1 = GetColorDataFromHex(hexCode1)
    const colorData2 = GetColorDataFromHex(hexCode2)
    return _GetVisualDifference_CIEDE2000(colorData1.c, colorData2.c)
}
export const _GetVisualDifference_CIEDE2000 = (lab1, lab2) => {
    const [L1, a1, b1] = lab1;
    const [L2, a2, b2] = lab2;
    const Lp = (L1 + L2) / 2.0;

    const C1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2));
    const C2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2));
    const C = (C1 + C2) / 2.0;

    const G = 0.5 * (1.0 - Math.sqrt(Math.pow(C, 7.0) / (Math.pow(C, 7.0) + Math.pow(25.0, 7.0))));

    const a1p = a1 * (1.0 + G);
    const a2p = a2 * (1.0 + G);

    const C1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2));
    const C2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2));
    const Cp = (C1p + C2p) / 2.0;

    let h1p = Math.atan2(b1, a1p) * (180 / Math.PI);
    h1p += (h1p >= 0 ? 1 : 0) * 360;

    let h2p = Math.atan2(b2, a2p) * (180 / Math.PI);
    h2p += (h2p < 0 ? 1 : 0) * 360;

    let HaP = h1p + h2p;
    HaP += (Math.abs(h1p - h2p) > 180 ? 1 : 0) * 360;
    const Hp = HaP / 2.0;

    const T = (
        1
        - 0.17 * Math.cos((Hp - 30) * Math.PI / 180)
        + 0.24 * Math.cos((2 * Hp) * Math.PI / 180)
        + 0.32 * Math.cos((3 * Hp + 6) * Math.PI / 180)
        - 0.2 * Math.cos((4 * Hp - 63) * Math.PI / 180)
    );

    const dh_1 = h2p - h1p;
    let dhp = dh_1 + (Math.abs(dh_1) > 180 ? 1 : 0) * 360;
    dhp -= (h2p > h1p ? 1 : 0) * 720;

    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    const dHp = 2 * Math.sqrt(C2p * C1p) * Math.sin((dhp * Math.PI / 180) / 2.0);

    const SL = 1 + (
        (0.015 * Math.pow(Lp - 50, 2))
        / Math.sqrt(20 + Math.pow(Lp - 50, 2.0))
    );
    const SC = 1 + 0.045 * Cp;
    const SH = 1 + 0.015 * Cp * T;

    const d0 = 30 * Math.exp(-(Math.pow(((Hp - 275) / 25), 2.0)));
    const RC = Math.sqrt(
        (Math.pow(Cp, 7.0))
        / (Math.pow(Cp, 7.0) + Math.pow(25.0, 7.0))
    );
    const RT = -RC * Math.sin(2 * (2 * d0) * Math.PI / 180);

    const KL = 1;
    const KC = 1;
    const KH = 1;

    return Math.sqrt(
        Math.pow(dLp / (SL * KL), 2) +
        Math.pow(dCp / (SC * KC), 2) +
        Math.pow(dHp / (SH * KH), 2) +
        RT * (dCp / (SC * KC)) * (dHp / (SH * KH))
    );
}

export const _GetVisualDifferenceFromColorData = (colorData1, colorData2, cielabVersion) => {
    return _GetVisualDifference(colorData1.c, colorData2.c, cielabVersion)
}
export const GetVisualDifference = (hexCode1, hexCode2, cielabVersion) => {
    const colorData1 = GetColorDataFromHex(hexCode1)
    const colorData2 = GetColorDataFromHex(hexCode2)
    return _GetVisualDifference(colorData1.c, colorData2.c, cielabVersion)
}
export const _GetVisualDifference = (lab1, lab2, cielabVersion) => {
    if (cielabVersion == CielabVersion.CIE_76) {
        return _GetVisualDifference_CIE76(lab1, lab2)
    } else if (cielabVersion == CielabVersion.CIEDE_2000) {
        return _GetVisualDifference_CIEDE2000(lab1, lab2)
    }
    return -1
}

export const GetVisualDistanceColor = (visualDistance, cielabVersion) => {
    return GetVisualTierColor(GetVisualDistanceTier(visualDistance, cielabVersion))
}
export const GetVisualTierColor = (armorTier) => {
    return seymourTierColors[armorTier]
}

export const GetAbsoluteDifferenceFromColorData = (colorData1, colorData2) => {
    return GetAbsoluteDifference(colorData1.r, colorData2.r)
}
export const GetAbsoluteDifference = (rgb1, rgb2) => {
    const [r1, g1, b1] = rgb1
    const [r2, g2, b2] = rgb2

    const diffR = (r1 > r2 ? r1 - r2 : r2 - r1)
    const diffG = (g1 > g2 ? g1 - g2 : g2 - g1)
    const diffB = (b1 > b2 ? b1 - b2 : b2 - b1)

    return diffR + diffG + diffB
}
export const GetAbsoluteDifferenceColor = (absoluteDistance) => {
    return GetAbsoluteTierColor(GetAbsoluteDistanceTier(absoluteDistance))
}
export const GetAbsoluteTierColor = (armorTier) => {
    return seymourTierColors[armorTier]
}

export const GetColorDifferenceFromColorData = (colorData1, colorData2, cielabVersion) => {
    const absoluteDifference = GetAbsoluteDifferenceFromColorData(colorData1, colorData2)
    const visualDifference = _GetVisualDifferenceFromColorData(colorData1, colorData2, cielabVersion)

    return {
        absoluteDifference: absoluteDifference,
        visualDifference: visualDifference,
    }
}

export const GetColorDataFromHex = (hexCode) => {
    const rgb = HexToRGB(hexCode)
    const cielab = XYZToCielab(...RGBToXYZ(rgb))
    return {
        "hex": hexCode,
        "r": rgb,
        "c": cielab,
        "s": GetSignature(hexCode),
    }
}

export const GetValueDataFromArmorData = (armorData, options) => {
    return GetValueData(armorData.hexCode.replace("#", "").toUpperCase(), armorData.ItemID, armorData.itemUUID || null, options)
}
export const GetValueData = (hexCode, itemID, itemUUID = null, options) => {
    const armorType = GetArmorType(itemID)
    const signature = GetSignature(hexCode)
    const hexCodeLower = hexCode.toLowerCase()
    const tierMap = {}

    let isPerfectMatch = false
    let isMatchingStyle = false
    let isValuablePossible = false
    let isOwnedHex = false
    let isMatchingWord = false
    let isOwnedSignature = false
    let isValuableNotPossible = false
    let isCustomHex = false
    let isCustomWildcardHex = false
    let isCustomWord = false
    let isFadeDye = false

    const matchingSignatureList = []
    if (options.seymourMarkMatchingSignatures) {
        if (options.allSeymourSignatures["helmet"].has(signature)) matchingSignatureList.push("helmet")
        if (options.allSeymourSignatures["chestplate"].has(signature)) matchingSignatureList.push("chestplate")
        if (options.allSeymourSignatures["leggings"].has(signature)) matchingSignatureList.push("leggings")
        if (options.allSeymourSignatures["boots"].has(signature)) matchingSignatureList.push("boots")
    }
    if (matchingSignatureList.length >= options.seymourMinimumMatchingSignatureCount) {
        isOwnedSignature = true
    }

    let customSeymourWildcardMatchList = []
    if (options.toggleCustomSeymourHexScanning) {
        Object.keys(options.customSeymourWildcardHexes).forEach((wildcardHex) => {
            let wildcardHexU = wildcardHex.toLowerCase()
            let customHexData = options.customSeymourWildcardHexes[wildcardHex]
            if (!customHexData.allTypes && !customHexData.armorTypeList.includes(armorType)) return

            let indexMultiplier = wildcardHex.length == 3 ? 2 : 1
            let isWildcardMatch = true
            for (let index = 0; index < wildcardHex.length; index++) {
                const char = wildcardHexU[index]
                if (char == "x") continue
                if (char != hexCodeLower[index * indexMultiplier]) {
                    isWildcardMatch = false
                    break
                }
            }

            if (!isWildcardMatch) return
            customSeymourWildcardMatchList.push(wildcardHex)
            isCustomWildcardHex = true
        })
    }

    const similarHexList = []
    const shouldProcessAllNotPossible = !options.onlyMarkPossibleSeymourPieces
    const shouldProcessPerfectNotPossible = options.seymourAlwaysMarkWrongPiecePerfectMatches
    const shouldProcessAllFadeDyes = options.seymourToggleFadeDyeScanning
    const shouldProcessPerfectFadeDyes = options.seymourAlwaysMarkFadeDyePerfectMatches
    options.cielabVersionList.forEach(cielabVersion => {
        const similarHexData = FindSimilarColors(hexCode, armorType, {
            ...options,
            cielabVersion: cielabVersion,
        })
        similarHexData.possible.forEach(similarData => {
            similarHexList.push(similarData)
            tierMap["rightPiece"] = Math.min(tierMap["rightPiece"] || Infinity, GetVisualDistanceTier(similarData.difference.visualDifference, cielabVersion))
            if (similarData.isPerfectMatch) {
                isPerfectMatch = true
            }
        })
        if (similarHexData.possible.length > 0) {
            isValuablePossible = true
        }

        if (similarHexData.customHexes.length > 0) {
            isCustomHex = true
            similarHexData.customHexes.forEach(similarData => {
                similarHexList.push(similarData)
                tierMap["customHexes"] = Math.min(tierMap["customHexes"] || Infinity, GetVisualDistanceTier(similarData.difference.visualDifference, cielabVersion))
                if (similarData.isPerfectMatch) {
                    isPerfectMatch = true
                }
            })
        }

        if (shouldProcessAllNotPossible || shouldProcessPerfectNotPossible) {
            similarHexData.notPossible.forEach(similarData => {
                if (!shouldProcessAllNotPossible && !similarData.isPerfectMatch) return
                isValuableNotPossible = true
                similarHexList.push(similarData)
                tierMap["wrongPiece"] = Math.min(tierMap["wrongPiece"] || Infinity, GetVisualDistanceTier(similarData.difference.visualDifference, cielabVersion))
                if (similarData.isPerfectMatch) {
                    isPerfectMatch = true
                }
            })
        }

        if (shouldProcessAllFadeDyes || shouldProcessPerfectFadeDyes) {
            if (similarHexData.fadeDyes.length > 0) {
                isFadeDye = true
            }

            similarHexData.fadeDyes.forEach(similarData => {
                if (!shouldProcessAllFadeDyes && !similarData.isPerfectMatch) return
                similarHexList.push(similarData)
                tierMap["fadeDyes"] = Math.min(tierMap["fadeDyes"] || Infinity, GetVisualDistanceTier(similarData.difference.visualDifference, cielabVersion))
                if (similarData.isPerfectMatch) {
                    isPerfectMatch = true
                }
            })
        }
    })

    const sameCharacterStyleList = []
    if (options.seymourMarkMatchingStyles) {
        if (hexCode.length == 6) {
            const firstChar = hexCode[0]
            const split = hexCode.split("")
            const fullRepeat = [split.every(char => char == firstChar), "AAAAAA"]
            const twoPairRepeat = [(split[0] == split[2] && split[0] == split[4] && split[1] == split[3] && split[1] == split[5]), "ABABAB"]
            const threeRepeat = [hexCode.slice(0, 3) == hexCode.slice(3, 6), "ABCABC"]
            const mirroredRepeat = [(split[0] == split[5] && split[1] == split[4] && split[2] == split[3]), "ABCCBA"]
            const dualChunkRepeat = [(split[0] == split[1] && split[2] == split[3] && split[4] == split[5]), "AABBCC"]
            const tripleRepeat = [(split[0] == split[1] && split[1] == split[2] && split[3] == split[4] && split[4] == split[5]), "AAABBB"]
            const repeatList = [fullRepeat, twoPairRepeat, threeRepeat, mirroredRepeat, dualChunkRepeat, tripleRepeat]

            repeatList.forEach(repeatData => {
                if (repeatData[0]) {
                    sameCharacterStyleList.push(repeatData[1])
                    return
                }
            })
        }
        if (sameCharacterStyleList.length > 0) {
            isMatchingStyle = true
        }
    }

    let matchingWordMap = { realWords: {}, customWords: {} }
    if (options.seymourWordTypeSelection?.length > 0) {
        const blacklistedSet = new Set(options.blacklistedSeymourWords)

        const normalWords = {}
        Object.entries(options.seymourWordMap).forEach(([wordType, wordMap]) => {
            if (options.seymourWordTypeSelection.includes(wordType)) {
                Object.entries(wordMap).forEach(([hexWord, realWord]) => {
                    normalWords[hexWord] = realWord
                })
            }
        })
        const customWords = options.toggleCustomSeymourWordScanning
            ? options.customSeymourWords
            : {}

        const combinedWords = { ...normalWords, ...customWords }
        Object.entries(combinedWords).forEach(([hexWord, realWord]) => {
            if (!blacklistedSet.has(hexWord)
                && hexWord.length >= options.seymourMinimumMatchingWordLength
                && hexCode.includes(hexWord)) {
                if (customWords.hasOwnProperty(hexWord)) {
                    matchingWordMap.customWords[hexWord] = realWord
                } else {
                    matchingWordMap.realWords[hexWord] = realWord
                }
            }
        })

        if (Object.keys(matchingWordMap.customWords).length > 0) {
            isCustomWord = true
        }

        if (Object.keys(matchingWordMap.realWords).length > 0 || Object.keys(matchingWordMap.customWords).length > 0) {
            isMatchingWord = true
        }
    }

    for (let armorType in options.allOwnedSeymourArmor) {
        if (isOwnedHex) break
        options.allOwnedSeymourArmor[armorType].forEach(itemData => {
            if (hexCode == itemData["hex"]) {
                if ((itemUUID != null && itemData["itemUUID"] != null) && itemData["itemUUID"] == itemUUID) return
                isOwnedHex = true
                return
            }
        })
    }

    return {
        hexCode: hexCode,
        signature: signature,
        armorType: armorType,

        isPerfectMatch: isPerfectMatch,
        isMatchingStyle: isMatchingStyle,
        isValuablePossible: isValuablePossible,
        isOwnedHex: isOwnedHex,
        isMatchingWord: isMatchingWord,
        isOwnedSignature: isOwnedSignature,
        isValuableNotPossible: isValuableNotPossible,
        isCustomHex: isCustomHex,
        isCustomWildcardHex: isCustomWildcardHex,
        isCustomWord: isCustomWord,
        isFadeDye: isFadeDye,

        matchingSignatureList: matchingSignatureList,
        similarHexList: similarHexList,
        sameCharacterStyleList: sameCharacterStyleList,
        matchingWordMap: matchingWordMap,
        tierMap: tierMap,
        cielabVersionList: options.cielabVersionList,

        customSeymourWildcardMatchList: customSeymourWildcardMatchList,
    }
}

export const IsValuable = (valueData) => {
    if (valueData.isPerfectMatch) return true
    if (valueData.isMatchingStyle) return true
    if (valueData.isValuablePossible) return true
    if (valueData.isOwnedHex) return true
    if (valueData.isMatchingWord) return true
    if (valueData.isOwnedSignature) return true
    if (valueData.isValuableNotPossible) return true
    if (valueData.isCustomHex) return true
    if (valueData.isCustomWildcardHex) return true
    if (valueData.isCustomWord) return true
    if (valueData.isFadeDye) return true
    return false
}

export const FindSimilarColors = (targetHexCode, armorType, options) => {
    const colorData1 = GetColorDataFromHex(targetHexCode)
    const resultsData = {
        possible: [],
        notPossible: [],
        fadeDyes: [],
        customHexes: [],
    }

    const latch = new CountDownLatch(1)
    new Thread(() => {
        const fullListList = {}
        Object.entries(options.defaultSeymourArmorColors).forEach(([armorName, armorInfo]) => {
            if (armorInfo.hasOwnProperty("f")) {
                if (!options.seymourToggleFadeDyeScanning) return
                let fadeDyeName = null
                if (armorName.includes("STAGE")) {
                    let split = armorName.split("_DYE_STAGE")
                    fadeDyeName = RemoveFormatting(split[0]).toLowerCase().trim()
                } else if (armorName.includes("1.4")) {
                    fadeDyeName = "1.4_pure_dyes"
                } else {
                    let split = armorName.split("_")
                    delete split[split.length - 1]
                    let join = split.join("_")
                    if (join.endsWith("_")) {
                        join = join.slice(0, -1)
                    }
                    fadeDyeName = RemoveFormatting(join).toLowerCase().trim()
                }
                if (!options.seymourFadeDyeSelection.includes(fadeDyeName)) return
            }
            fullListList[armorName] = [armorInfo]
        })

        Object.keys(fullListList).forEach(locationName => {
            let isPossible = true
            let defaultArmorInfo = options.defaultSeymourArmorColors[locationName]
            if (defaultArmorInfo.t[0] != "a") {
                let armorTypeFirstCharacter = armorType[0].toLowerCase()
                if (!defaultArmorInfo.t.includes(armorTypeFirstCharacter)) {
                    isPossible = false
                }
            }

            fullListList[locationName].forEach(colorData => {
                let absoluteTolerance = options.seymourScanningAbsoluteDifferenceTolerance
                let visualTolerance = options[`seymourScanningVisualDistanceTolerance${options.cielabVersion}`]
                let isFadeDye = false
                if (colorData.hasOwnProperty("f")) {
                    absoluteTolerance = options.seymourFadeDyeAbsoluteDifferenceTolerance
                    visualTolerance = options[`seymourFadeDyeVisualDistanceTolerance${options.cielabVersion}`]
                    isFadeDye = true
                }

                let difference = GetColorDifferenceFromColorData(colorData1, colorData, options.cielabVersion)
                if (
                    difference.absoluteDifference <= absoluteTolerance ||
                    difference.visualDifference <= visualTolerance
                ) {
                    let result = {
                        locationName: locationName,
                        cielabVersion: options.cielabVersion,
                        colorData: colorData,
                        difference: difference,
                        isPossible: isPossible,
                        isPerfectMatch: difference.absoluteDifference == 0,
                        isFadeDye: isFadeDye,
                        isCustomHex: false,
                    }

                    if (isFadeDye) {
                        resultsData.fadeDyes.push(result)
                        return
                    }
                    if (isPossible) {
                        resultsData.possible.push(result)
                        return
                    }
                    resultsData.notPossible.push(result)
                }
            })
        })

        if (options.toggleCustomSeymourHexScanning) {
            Object.keys(options.customSeymourHexes).forEach((customHex) => {
                let colorData = GetColorDataFromHex(customHex)
                let customName = `Custom #${customHex}`
                let hexData = options.customSeymourHexes[customHex]
                if (!hexData.allTypes && !hexData.armorTypeList.includes(armorType)) return

                let difference = GetColorDifferenceFromColorData(colorData1, colorData, options.cielabVersion)
                let absoluteTolerance = options.customSeymourHexAbsoluteDifferenceTolerance
                let visualTolerance = options[`customSeymourHexVisualDistanceTolerance${options.cielabVersion}`]
                if (
                    difference.absoluteDifference <= absoluteTolerance ||
                    difference.visualDifference <= visualTolerance
                ) {
                    let result = {
                        locationName: customName,
                        cielabVersion: options.cielabVersion,
                        colorData: colorData,
                        difference: difference,
                        isPossible: true,
                        isPerfectMatch: difference.absoluteDifference == 0,
                        isFadeDye: false,
                        isCustomHex: true,
                    }
                    resultsData.customHexes.push(result)
                }
            })
        }

        latch.countDown()
    }).start()

    latch.await()
    return resultsData
}

export const GetValuableSeymourFromList = (armorList, callback, options = {
    seymourMarkMatchingSignatures: false,
    seymourMinimumMatchingSignatureCount: 4,
    toggleCustomSeymourHexScanning: false,
    onlyMarkPossibleSeymourPieces: true,
    seymourAlwaysMarkWrongPiecePerfectMatches: true,
    seymourToggleFadeDyeScanning: false,
    seymourAlwaysMarkFadeDyePerfectMatches: true,
    seymourMarkMatchingStyles: true,
    seymourWordTypeSelection: [],
    toggleCustomSeymourWordScanning: false,
    seymourMinimumMatchingWordLength: 4,
    seymourFadeDyeSelection: [],
    seymourScanningAbsoluteDifferenceTolerance: 5,
    seymourScanningVisualDistanceTolerance: 2.00,
    seymourFadeDyeAbsoluteDifferenceTolerance: 3,
    seymourFadeDyeVisualDistanceTolerance: 1.00,
    customSeymourHexAbsoluteDifferenceTolerance: 5,
    customSeymourHexVisualDistanceTolerance: 2.00,
    defaultSeymourArmorColors: {},
    allSeymourSignatures: {},
    customSeymourWildcardHexes: {},
    blacklistedSeymourWords: [],
    seymourWordMap: {},
    customSeymourWords: {},
    customSeymourHexes: {},
    allOwnedSeymourArmor: {},
    cielabVersionList: [CielabVersion.CIE_76],
}) => {
    const timer = new Timer()
    const results = []
    let index = 0

    const task = new TimerTask({
        run: function() {
            if (index >= armorList.length) {
                timer.cancel()
                Client.scheduleTask(() =>{
                    callback(results)
                })
                return
            }

            try {
                const armorData = armorList[index]
                const valueData = GetValueDataFromArmorData(armorData, options)

                if (IsValuable(valueData)) {
                    valueData["isValuable"] = true
                    results.push({
                        armorData: armorData,
                        valueData: valueData,
                    })
                }

                index++
            } catch (e) {
                LogDebug("&cError processing hex", e, e.stack)
                timer.cancel()
                return
            }
        }
    })

    timer.scheduleAtFixedRate(task, 0, 1)
}

function LogDebug(...args) {
    ZCore.ChatDebug(...args)
}
function GetArmorType(itemID) {
    return ZCore.GetArmorType(itemID)
}
function RemoveFormatting(text) {
    return ChatLib.removeFormatting(text)
}
