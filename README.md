# MyRenaultAndroid

## Debug app
Testing Renault API usage with [Tabris.js](https://tabris.com/) , to create a standalone app for Android and iOS using javascript.

Current status:
 - login to Gigya server **DONE** - It works properly, without need for proxy and without CORS errors
 - login to Kamereon server: **DONE**
 - retrieve PersonId: **DONE**
 - retrieve AccountId: **DONE**
 - retrieve VIN: **DONE**
 - run endpoint: **DONE** (first working version: 0.1.0)
 - [compile online with tabris.js](https://build.tabris.com/): **DONE** (first working version: 0.2.0)
 - test running in background: **DONE**
 - test timers: **DONE** (0.2.1)
 - simulate SoC increase/monitoring: **to do**
 - test notifications: **to do**  (cordova plugin needed?) 

Usage:

Replace any [Tabris.js playground example](https://playground.tabris.com/#) by this script, scan the QR code with [Tabris.js app](https://play.google.com/store/apps/details?id=com.eclipsesource.tabris.js) 3.8.0 (beware of other versions! Use only this link, the others are old:  tabris 3.x broke compatibility w.r.t tabris 2.x.), input credentials (as **user,name** , i.e. separated by comma) and click login button. 

If app works, it should end up showing your VIN.

Swipe left to see console output for debugging purpose.

NOTE: You may need to put your region-specific data in Settings page: 


### European values

- KAMEREON URL: https://api-wired-prod-1-euw1.wrd-aws.com
- KAMEREON KEY: `VAX7XYKGfa92yMvXculCkEFyfZbuM7Ss`
- GIGYA URL: https://accounts.eu1.gigya.com
- GIYGA KEY:
    - bg_BG: `3__3ER_6lFvXEXHTP_faLtq6eEdbKDXd9F5GoKwzRyZq37ZQ-db7mXcLzR1Jtls5sn`
    - cs_CZ: `3_oRlKr5PCVL_sPWUZdJ8c5NOl5Ej8nIZw7VKG7S9Rg36UkDszFzfHfxCaUAUU5or2`
    - da_DK: `3_5x-2C8b1R4MJPQXkwTPdIqgBpcw653Dakw_ZaEneQRkTBdg9UW9Qg_5G-tMNrTMc`
    - de_DE: `3_7PLksOyBRkHv126x5WhHb-5pqC1qFR8pQjxSeLB6nhAnPERTUlwnYoznHSxwX668`
    - de_AT: `3__B4KghyeUb0GlpU62ZXKrjSfb7CPzwBS368wioftJUL5qXE0Z_sSy0rX69klXuHy`
    - de_CH: `3_UyiWZs_1UXYCUqK_1n7l7l44UiI_9N9hqwtREV0-UYA_5X7tOV-VKvnGxPBww4q2`
    - en_GB: `3_e8d4g4SE_Fo8ahyHwwP7ohLGZ79HKNN2T8NjQqoNnk6Epj6ilyYwKdHUyCw3wuxz`
    - en_IE: `3_Xn7tuOnT9raLEXuwSI1_sFFZNEJhSD0lv3gxkwFtGI-RY4AgiePBiJ9EODh8d9yo`
    - es_ES: `3_DyMiOwEaxLcPdBTu63Gv3hlhvLaLbW3ufvjHLeuU8U5bx3zx19t5rEKq7KMwk9f1`
    - fi_FI: `3_xSRCLDYhk1SwSeYQLI3DmA8t-etfAfu5un51fws125ANOBZHgh8Lcc4ReWSwaqNY`
    - fr_FR: `3_4LKbCcMMcvjDm3X89LU4z4mNKYKdl_W0oD9w-Jvih21WqgJKtFZAnb9YdUgWT9_a`
    - fr_BE: `3_ZK9x38N8pzEvdiG7ojWHeOAAej43APkeJ5Av6VbTkeoOWR4sdkRc-wyF72HzUB8X`
    - fr_CH: `3_h3LOcrKZ9mTXxMI9clb2R1VGAWPke6jMNqMw4yYLz4N7PGjYyD0hqRgIFAIHusSn`
    - fr_LU: `3_zt44Wl_wT9mnqn-BHrR19PvXj3wYRPQKLcPbGWawlatFR837KdxSZZStbBTDaqnb`
    - hr_HR: `3_HcDC5GGZ89NMP1jORLhYNNCcXt7M3thhZ85eGrcQaM2pRwrgrzcIRWEYi_36cFj9`
    - hu_HU: `3_nGDWrkSGZovhnVFv5hdIxyuuCuJGZfNmlRGp7-5kEn9yb0bfIfJqoDa2opHOd3Mu`
    - it_IT: `3_js8th3jdmCWV86fKR3SXQWvXGKbHoWFv8NAgRbH7FnIBsi_XvCpN_rtLcI07uNuq`
    - it_CH: `3_gHkmHaGACxSLKXqD_uDDx415zdTw7w8HXAFyvh0qIP0WxnHPMF2B9K_nREJVSkGq`
    - nl_NL: `3_ZIOtjqmP0zaHdEnPK7h1xPuBYgtcOyUxbsTY8Gw31Fzy7i7Ltjfm-hhPh23fpHT5`
    - nl_BE: `3_yachztWczt6i1pIMhLIH9UA6DXK6vXXuCDmcsoA4PYR0g35RvLPDbp49YribFdpC`
    - no_NO: `3_QrPkEJr69l7rHkdCVls0owC80BB4CGz5xw_b0gBSNdn3pL04wzMBkcwtbeKdl1g9`
    - pl_PL: `3_2YBjydYRd1shr6bsZdrvA9z7owvSg3W5RHDYDp6AlatXw9hqx7nVoanRn8YGsBN8`
    - pt_PT: `3__afxovspi2-Ip1E5kNsAgc4_35lpLAKCF6bq4_xXj2I2bFPjIWxAOAQJlIkreKTD`
    - ro_RO: `3_WlBp06vVHuHZhiDLIehF8gchqbfegDJADPQ2MtEsrc8dWVuESf2JCITRo5I2CIxs`
    - ru_RU: `3_N_ecy4iDyoRtX8v5xOxewwZLKXBjRgrEIv85XxI0KJk8AAdYhJIi17LWb086tGXR`
    - sk_SK: `3_e8d4g4SE_Fo8ahyHwwP7ohLGZ79HKNN2T8NjQqoNnk6Epj6ilyYwKdHUyCw3wuxz`
    - sl_SI: `3_QKt0ADYxIhgcje4F3fj9oVidHsx3JIIk-GThhdyMMQi8AJR0QoHdA62YArVjbZCt`
    - sv_SE: `3_EN5Hcnwanu9_Dqot1v1Aky1YelT5QqG4TxveO0EgKFWZYu03WkeB9FKuKKIWUXIS`

### US values

- KAMEREON URL: https://api-wired-prod-1-usw2.wrd-aws.com
- KAMEREON KEY: `VAX7XYKGfa92yMvXculCkEFyfZbuM7Ss`  (same of EU)
- GIGYA URL: https://accounts.us1.gigya.com
- GIGYA KEY:
    - es_MX: `3_BFzR-2wfhMhUs5OCy3R8U8IiQcHS-81vF8bteSe8eFrboMTjEWzbf4pY1aHQ7cW0 `

([source](https://github.com/swamiller/openhab-addons-bondhome/blob/48925873c206cefa1ded9ec4025ce5c7082f919e/openhab-addons-bondhome/bundles/org.openhab.binding.renault/src/main/java/org/openhab/binding/renault/internal/api/Constants.java) for values)

----------
##  Actual app

Once this test app will be working, an "actual" app will be developed to perform these tasks:

- constant monitoring of charge level in background, stop charging at user-defined level  - to do
- show charging sessions - to do




# CHANGELOG

- 0.2.0 Implemented dropdown list for endpoint and version selection; implemented scrolling for output
- 0.1.1 Implemented user-specified endpoint
- 0.1.0 First version with working endpoint (tested: cockpit)
- 0.0.9 Added list to select vehicle
- 0.0.8 Interface split into Main and Settings pages; experimenting with drawer (opened by left swipe)
- 0.0.7 Introduced default params
- 0.0.6 tests with promises
- 0.0.5 All checks passed: successfully retrieved cookie, JWT token, personId, accountId, VIN and vehicles
- 0.0.4 Single user+pass input, cookievalue output on interface
- 0.0.3 Skipped
- 0.0.2: Cleaned up interface and source; no functions added, still just logging in to Gigya server.
- 0.0.1: First experiments
