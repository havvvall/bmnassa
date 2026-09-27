import React, { useState, useMemo } from "react";


const APP_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkwAAAD0CAYAAABpYnnyAABehklEQVR42u29d5itWVHv/6mduvuciUQF5WIATKhXTAg/gkqQdL0gOacZhhmCZAZmCMMIXnQUkBwEJIqoKKDiBa94VTAgiulKFAGROMM5p8NO9ftjVZ23+p3d5+zdaaf6Ps9+dvfu7t37Xe9atb5Vq+pbkEgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIjF9qKrE50QikVh0pLFLJBJOghpA077t29cDsxMNe30ItAANP0NEBjmCiUQiCVMikVgW0uRkyJ8Rke6I32va7/QBFZFhjl4ikVhktHIIEomEkSChRJV6TpRUtamqNwCu5wQK+CrwRRE5rqptSqQpkUgkEolEYikIU1NVG6q6at/fTFX/SFW/oqo9Vd1Q1XVVvUpV/0FVf1ZVV1S1k7lMiUQikUgkloUwNSxihKo+UlW/rgX98Bio6pY9+qr6TlU9x/6mZc9JnhKJRCKRSCwsYXLCc/9AirZUdajb4aTpKvv+dyzK1FZVScKUSCQSiURiUclSw56/U1W/rKpdVf2GjkbfjugGqnrcXnuu/X3b3yuRSCQSiURi0QiTWJToPUaAjgVStBNp6hux6qnqf6nqNey9OkmaEonEoiGNWiKRZElERIFzgZ+gVMm1TmEjNPysCWwA1wTu47+QMgOJRCIJUyKRWFQ7cEMjQF1gxV7XU/yNywms2N/douJgmceUSCQWC6nDlEgsMYzYOLm5JtAhKHgzWtxWavbDv+/niCYSiUX3LBOJRGLAzhGlcZBRpUQikYQpkUgsPJLwJBKJRBKmRCKRSCQSiSRMiURib1CqIzmd8O/SniQSiSRMiUQiCdMYyCO9RCKRhCmRSCQSiUQiCVMikUgkEolEIglTIpFIJBKJxG6QwpWJRCIi85ASiURiBDLClEgkEolEIpGEKZFIJBKJRCIJUyKRSCQSiUQSpkQikUgkEokkTIlEIpFIJBJJmBKJRCKRSCSSMCUSiUQikUgkYUokEolEIpFIwpRIJBKJRCKRSMKUSCQSiUQikYQpkUgkEolEIglTIpFIJBKJRBKmRCKRSCQSiSRMiUQikUgkEkmYEolEIpFIJJIwJRKJRCKRSCRhSiQSiUQikUgkYUokEolEIpFIwpRIJHYHtUeiPjCq4s+q2qj/zH+eSCQWE60cgkRitjdoh4gkkZkuIilq2NcCDO0ZVR3mfUokkjAlEonD3J1z4521+zG0yJJQonBuPzUQp5aqDqhF6fJeJhJJmBKJxD4jRC62vZyb7lTug8OP4NpAX0T6wGDE3zSBZiBMSh5zJhJJmBKJxL5v0g0RGdY3WMuRadlGnTg8NIysOjka2P1YA24KrFIiSx3gUyLymRH3tK2qSXgTiSRMiURiQlIktvZihEJsY/ZjnxvZZt2gRCw+LSLHQgRjYJt0N2zm+wFZ4vvSBgZ2D1pOlIys3hi4DvCTwE8A3wzc0O4F9vxVVf0k8HngHcD/Az4rIsft/TtAz+6pH+GpiKhHs5JUJRKJRCJBFSmyr5shArFmz9+hqm9W1a+r6ldU9UuqekxVP6SqD1TVo7752u839/Hz3F5V1+0xUNWhjocte35zuB6Zs/vSVNVVe16x11ZV9YdV9R2qeqWNiapqz77u2bX3VHUz/NxxTFX/RlUfqarXsfds2b1rhfHP6rpEIpFIJHbYnJtOVlS1Yc+XqepXbbM9rqob9rxpr/VtA76pvc/RfSZwS0mYwn3oWJQJVb2Nqv4fVe3ata2r6lWqeiIQJCdLPk5de2yE+ze0x3+q6jNcjkBVV+P/z1WRSCQSicTVN2gnSW2LYrRV9Q226Z6wyETXSEvfNtwNizqpqv6Xqt5KVVf2utkmYTo5Dms2Fueo6ittvNUiSxuBOA1qj3742slT1whVz8bySruvA1X9iKreNYxTI9yHJE6JRCKRSITNuWEPP/p5aIgq9QNZGYRN2nGVff+Pqnptex/Zw2fJCFMVVfphVf27EC3aCKSoH6JFwzA2w3CvhoE8bYW/9WO8EyFSeGkkSqPEMBOJxGwhF2giccgIVXB9Vf0m4GKqJG5PCJawPv15CJwFrAPfC9zX3qudUYqJCFIrPFZEpKeqdwF+H/hBYNPGfJUq6b4Z7kuUfYj3yp8bdk/8b6Ek+R8BunYfn6Oqvw6caz+PUgSJRCIJUyKx9Ju1R3TaVt12V+A7gQ22CyHutF4HVBV297c8pl4gSs0kTaeFC0uKiGyp6t2Btxp5WQdW2Hu14E5/70RqE3gI8MZAlNMeJxJJmBKJBJwsGx9Qtdn47rAWY+RiFGkahmjEJvCjwM3tPZv+3lmaPhaZaVhk6fbAG2y8e0ZeBgdsGxtGejeAOwMvd9KUZDeRSMKUSCS2r7u+EZujtlm3x9zoxQiT/75HpaRoIyZZGnMc+6p6A+B1RlZalCM4x+AA/7frcHWArwMPBZ4oIr20yYlEEqZEIlFhyHbBQ+9NdjooVZSpH16rfmGPSeCLjJDjJcAZwGuA6xs5WgvjOao1zYF8JEpO2gbwdFW9kwllpkZTIpGEKZFI1KJAwxGb6E4btue5jEoI97/LFhw1Aunkw17y9jJPAm4HHKPkLEGJ+rSNxB6GbfT/07HHJap6Xfu8q4FUJxKJJEyJRCJxeFwVGKrq9YCHUXKWVkaQ1sNGk5Js/uPAA2qNfTPClEgkYUokEokDh6pq26JuHatMfDDwLcAW1ZHotAico0OJEt5TVc+wr5smG5FIJJIwJRKJxMGTEjua21LVNeBBlBwwL/HvM30NpDYll+nHgAdZlEn22iswkUgkYUrMn5vfrLWB8K9HJiln8vLphzSHYLxxsuozl134EUp0qU/JWerZ8yzMtSblKO6O9n3fImKzuqalvp5HrV3/eSqZJ5IwJRLjGVYtX2rHNi4XcFT7nZZ702ZYm0ArjezV4BvRQR3V6CKRMRFRr4yzuXRvSoXcgEqeQWbgfkIlSHpzVf1OEenPuNPgY9qiaEi1bE03gBXrk7hKEOa0tjkZNUvMJVo5BIlD3BiUSpW6FV4f2kbhpMk37SRLiX2JglAiSUeB21KiS51AEBsztEYGwDUpoqSfoFJ3n8Vx9TU9DA74wPKu+iP+pnXAZD+RSMKUWBgvH/PqWyKyOeJXezXj2s+k18Q+zsGzgW+qEaZZiuA0Apm4BfCWGR9WJ3ONMsTSVdXrqOptgW+lCIH2KLlZHwH+0qJmzVkkgYlEEqbErHijfswzFJFNVb0hcBvg58yjXjcy9X+A3xCRT3ouROoKJfbKl2z+fSvlOE5rm/2sYGifR4EbziChqxPQoYgMrYHxhqo+GHgC8P0j/uQq4P+o6pNF5OOq2khnKJGEKZGokSUzrlAaznZV9SHAZZTkW6jC+k3g1sB5qvp64DnWHNX7ew3dWC/iUM3IBrmIifYeuTmbqirOr9XJlMzQZ4WiFzXrR9JNW98bqno5cLG9HqPHfUqkaQX4H8APq+q9ROQvLIo8KEs6yVNiPgxJInEo5NzI0jOBVwPXA7qUkL0L9XWBE5Su8U8H3qaq59pmp0a4MtqUmCgSEr71/nuzKgrpxQ5R0X2W57vaEdvjjCxtGVlaDY8zqPrmbVBa0bxDVf87VeJ9Ou6JJEyJBJSqN4sU3Rt4lhnWoRnRtj28AapvGMeAnwWe5Zo0lIapOWcTk8y9SDo6c2ibZUbHtSkiPVW9sTk3G7amYwPjIdsTwldt7X8T8LxAZns5UxNJmBIJ85JV9VuBV5pXuUKVqxEfAyNNSqloOg48WlXvYHo0LVJ/KLG7OQjzlWg86/PcGwM/Abgu1dHbqHGPx80dShTqp1T11nZPOjlFE0mYEglomCd5D0oOyaC2GUh4OCFqmmcq9vXDwoaXYpaJ8Xd10/yyb/u1jXwWSdLJ4ghmWxNrQDk6v4cRoCMjPmu9ibT/vGVO05NtDxqkSG0iCVNiqVEzgj8WSJCL28kIAxu7xR+1Te4Oqvp9FmXKOZvYDREBuJLReUGzslm7HhnMWP5STbnbVdPPMqJ0UphyFGcN41snUNekan6chGmx94KG63B59XNQgF9V1Y6qrqnqij2a/je1DhEyTXKdm0/iQB388PURxk9klTA3FVgDzgmbSiIxtqEOc+nTFg1p1DbpWSEm3gh4AHzESMks22jXUxpOOIZNSt7St1HymRZKXT4xmmsEDS7HKqVl0aaIdEVkQ0S27BGV+BuBrzSmWfiT1QmJwzSuo7zMcT3vWSm7T8wncRLbpL9A0TgaziAZGYb18XdzMN+9rUyPq+cvnc4WdCm5T7cSkU9ZhKEHCysbstyecyFLrTDHmyZHIap6D+DmlNMEoRQG/JWIvJvSGaJhLbW60y76ScKUmHnPxAzyyWobE8xLo5oYy1ZTJSR/BXg/cD5FKHXWigiUcrz1OeBfAsmbaS5a+3ocgtcLY39PVX1TIFKDFKtdSIclRnUbVmF5S+BpwO2pJD9OzhFV/W3gVSLyAS2YuvOQR3IH69Ge9rVxfrYgGAajOokxdCOc5D6xFzvnCd9vNbI0Cz3a6mvBc5g+LCL/MmITmTXEfKtJcq48R7EL3A54rIh07e9XKIKY3oh7W95K/H4eH0vuuAB0jCzdC/gj4M42j9Yp0hQbFC2+HqVR9vtU9TwR6bG704l9RW5CBzhBjFV7ToJ36/ZKr2EwHkMzBk1K88pF9K6irkxjF4vNjfOiRpdGlWAn9oGoey9De/47yrHct1Pl37hg5DSdCI+ErQEfPjkpZnuub4W1PUm+Vfy9PvALqroK/JqIfCM4kW4bm+Vb1XlfF9bxQML9b4SvT17fAiqfDynixRuqegfg122ubxlJrts8J1Ed4EWqehx4G1M+YUjCdPAkYWgTomcs2aNJbbYnTDbCAsrGlInEPq9F23CPmWd7oRnk1Sl9niHb27IMbAP5O+D1gSwsMpphLC4Hbq2qbwD+A/ga8M+2MfYX6aJDpElMlNePrNbY3lZm0e71UFXPAa6gEjEd1QTb18QqlRr8JcBvU0nLJGFawIiBUjWbPaKq30EJQ39eRI7bQulQwo9CVoAlEgdJULyq68XA3SmyFZMmLO+3MzU058m96d8UkS+r6golj2PR83n8eG6dcjx3e3v9y8A/Gcl1h3LuI0y1vaGhql8Afg34GycQIrKIpKlhSdsXAN9DOXY7sgNZ8vVBmBs3Ac4TkReH5PEkTAvkQYhVBnyXqv4spfHkD5mB+GdVfRfwNhH5J5sAflSVxCmR2O8dqhzH+bHAv6nq8404rde82sNE30jSN4AzKUdxr7bokh/NLEPys0cTenYfuhSR29ssyfS8j0VPLgCuUtW2n0Ys0H7Yt+jSz1F1exh3vXVsrVykqm8Xkf+aliORhGkfJ4UZ5aaIDFR1oKq/CDwCuIaRoJ49vhu4qU2ANwNPIaNMicRBEaWTeSFWbdMGXgHcgZJ06g1jY1n/fssOjMpN8wrQlj1fLCJfNQeqH+3KrJq9WsRE9vA+DdsYvVJwEAhUzPOZ9whT/fP3zIm+u133vY1cSJy/c06cxdbeNW3v65/iPsqIudGj6ju6Ms0LScK0f2h40raqHgF+GXgUJfS4FQyBL/xNypHAhZQE1Hvaa5nsu6SceweDkdgH0lQjUF41dyHwAxTxxM1gDw9SMNKJRZTKOAI828qnG57XMmdzdi8EU0Z8vSx7k5PjDeAuwBNF5DIjzYMFyWXzeeL5SP4Yd250qI7Upxp5S1mB/ZgNxQDHHlAXGlnaCMzYFUsbtkhW7esTwM8Av2DfS/ZVSiQOFD3K0dy/U45BulTSA80DsouxZ6JvlJvmMb+VUik2b82lo3J/7iW7Q2wX1QXup6pnUPXUTD2qncl1EqY59WCH5Um6wA2Anzej7CTJ2fFwxPh3KBGoC4EfNu8yCVMicbDoW67Iu4HHBjLj0eCDWoPDEFE4G3g38Gi3DXN29OK5VsNaJCExGQFQI0xbwI2BJ9f6ZjamrXCdSMJ0EMYDSnL3N5u34GPsUgGjms02zdNsAvedBRadSCwqLHrrPapQ1SMi8lrgwVRlzlsHSJY8j/EIJdH3gSJyJdu1xubJ5imLU702TdLkTnUDuJdFGz2vVRdQl2m5CFNQXnVF1kboLtyx57Y9WuERVVxbpoA61+fVNhZu7O5Kla/k5Y9OmkYZFaVUyAyAO6rqdS1pvBm6OacxShzadN7DBjjzEQaL4CjQt0qkTVVdEZG3AncC/o2SW7hhxGkYyM5wF+Oo4W/diVqjaNHcR0Su9NzHOXJg66XfOi/3fwYxCGPpR7JNtgvZLpr9l138/kysjb18iBULaQ+s6mRVRIYi0rfOw30R6dmjHx4DIxleVigLNiE6tRvcPM0k8ZDsJvCdRpo80W1aCsSJJYm2BAIR5+KkRrquUj7TR0tui+zroYhsGWn6c+CWwOuMNK1QZAfWmaxCK1bbDYx4dan62d1NRJ5IORZsiMhARNRt4xwT7XTsJkcrrLtmbc+wKSqLJGS8204PTea8NcqQkqB8RETWKSJrN6Bk+l/XPLRGzdsaAl8F3mRGapWqJcD8zoBSebPbDSIKsglwo1DJE8t103tLHLTHJ2E+LhVxLE/aBK4SkYer6u8DTzQCBeV4pM94/d18vbqSf9v+/oXAy0Xk06raMtKmczxfBkmaEsvGbneLHkWVdF1Vv4dSFn8RcC3zpjqn+Nt7qeozRORvAmlaVniSt0vF301VX0ZpDZD5AYlpeH/DJdwET7YmsmjT76rqn1CE9m5DyU08Y4JxdAdRgM8BDxaRDxpBW2Mx2h8NawQqkVh4I7Hrv7Uo0c2A9wDPNoOyZcbgOCXK1A/eWddevz3wflV9hMnAz3XyuXmo9fP8Se6BG9c+RdDyBTYu7REbWCJxkIRp0Y7IT3/RVb8yzzXqWcuiDUsIv5jqWG2c9R2POFvAv4rIB6090or9r0WI4ikZ+U4sEcaKMEXxrJqa9U2AdwL/jUpT5HTGtmNE6iilDcD1gMssD+pkguU8ldfWjuRkQuIUj948Z+KBqvoZEbnUEuJb1tZBq38p2aB38chKfbOd1meY9HPILuf+LGFgC8sVtnu27lqUqtcjwcYx4Zh0zIZu+tpdkDLxevK37MN7cZq5NAtkfniaOS/7sA5bItJT1eES9BMcd35M/d63JpggUIkqenuBlxpZWqdqpDfOe61Qok4D4FmUssnLzPuC0tW4P2eTRPe4QHwyrFJ6S11iY/BcC+H3qSpphpYsmpGnRGKfnJ4RTtDQyI0fm7cnfNtGdHA8wdteWMS1K/v8HjqCvM/CnuCEqXkKArXX999xbiZmnDCZ8WjZhu3M947AbY0srXD6vKVoRDx50knAc61hzvOsrYgu4SSJxmEVuAp4jkXznmVksiUiG3Zc0Mvpm0jMjVNU3mCxogX7eXxbJ0qxc8Ks5dHF/LSDKHlvsF2sMgnTPBGm2oT257sTEiUnmDRxMbSpmixepqoDEXm+qq76sd+SGWEJRqJNCeFfagvn2baIkiwlEolZIUzRpu+1Ae+QKhneyUg9T2oWyIP3NPO8U6jkZNgHcjcABtawVvJIbj4JkzNqZ77XstdXgxfQGnORyYhFtkHppzQUkV+0I7/BkhohV3lt2bg8E+iGY8sGmXCZSCSmb6v2K/IzMHvnx1wbwH+wvfXKLB3JrQLXt2eC499m7731VoG2qrrivKhqHs3NE2EKgpNOYlZqi0Z28X9drGtI1UvnBZY//ctGmpRyRDdYUKYtIzytJttVX3uUY8u2JYI3KImk3mrBvZ7hDOdGjEqKn0QIcNEFPKeZ7F338ie9RzpD15A43EjLbhw3r0ZshCjNKvCfwP8G3g/8OUWzb9a06GKz4esAP0mRnfgp4FxKM/UW2yNOp1s7kVz1KJ0fbgR81H42SLI0Z4SpdoPrIdLdnuNK7bN4TtNlwBHL3VktPE2XpZ+OjFicTVuIl6hqzyJNBKI5YPb1chojNtjD9mITkxGfRGISZ29S0uTinivA3wIPEZF/nKPr/yrwL8BLVfXHgdcAN6GSjdjN+PQpTZlvLyIfsdSUXI8zuInNAmtvBw/3ElW91PSIvLRelvxeXUWJNF1KlWTvhGJecr5kF9edhOlwSVNGihKH4axvUiJLHwJuLSL/qKprqnqG5bHKjD+a1iv1iIh8CPhp4ANUIsS7cVY8kv6Tlq968v/llEnCNMrr8Ia1m5QqsWeIyAnmXNxyjwQjdlg/DjyHEoXzxMO2iHRnfFHJHq8/DcbBkqRIltKjTUy6Niddo31KZOkY8EQROWEpBxtm+2e5XVYj7Fd9YENVzxSRL1LyTa+aYA3JCCLZBX4M+C4R6QIrGWWaHZY/a16t56uIsfTnWa7OCykJ5ycFNJdsQ/MmjZ4QfrG9fomNy9UiTDOW87XXCpIkTIe3DnOsEwe5Lj2RexV4j4j8pap2zOlrMuM5OyZSXBes3LSWOn+tqn8F3I5y3Dhp7qXL7pwF/JKq/gzWpNn/V5Kn6TPlcSbJTsqmOoL07OZzNKmSnf25gVXPAU+23+1QjudWlihM6bIN7UCausAzgMvMC/ExaXuomNnTLvH5M+mmHBMjczPfr52u6KtJbU1H5flJ721jhL1ILM5caZzC5k9i/+P8ep/NFRf0nPkEZxEZhodrBg4ogsICvNd+tV8br+GYxHPFggW3o5wkNIA1s/8NVW0siFL84hKmKXkuThR6wOXAU0VkK3gozSU1zH5Etwk8Q1WfG8bFo1EDW1yLMD5DSth7ViplEonE3pynPnAl8BdGOIYLcE0e0f8XtlebTrrf+r63CTwdeLqlpRACCa2cRkmY6pskIarSpSQ8P9MiKm2WN68JqpLe45QE+cstQf6IGaOme4Zzfp3eDmY1Q9GJxEJgYHbq08DnF6QSLO5FX7P9ai8OXjxJeHbY9/z1fk6jJEz1CTMI5MBJ02Wq+iwRWV8QQrAXj8YfXeDJqvpcI1CuXzVcgAiT5zr8WJgLiURivm1X02zVBlWP0nm/JnfyPd+0ngg/7l7lebweRTpm+94V5hQ3yKrxJEwjJmArTMQ2lR7Rs620fmA97rBz3WWbQB3z1FwA7hnA821Rxeo65vjM24U5v8+uwc/wTxrZNByJxFzBUyoaLEg3h5pG4JC9VfZ6ZGoQbPwm8POq+jwLFojnlQU7mHlNB4xZPgdt7PBai9Lw9zk2MS83ccsh0FuivjtSu38epn2Kqh6zRsYrRjBawJYTDuZLOXbF7u31qJo7e37b0K5pmEt5Xx2VROIw7LuwvfXJoqydeiHFpIUujR3GahN4mok4X2L7Xo8SbWqa/U9beMikZNY/r1eLbQHPBS4JYco1FiO8u5cFu0EJ3z7NEsHVFtXJHn5zRijVDMWPAzcPQqZQtdXJY7pEIrHIznE7kMtnqurzw77nj3R2kjBdbeJ4lMn1Kp5jCXEudtZY4rwmz/s6ATxfVS+nUgT3SMy8EUo3BivA61XVWw80qcL5aSgSicSiwwt91imRpueJiIsXb4pIJoInYbpatAGq82+fPJep6nO8em6JI0xRimGdIm75XFPPVUr7lP6cEUonyH3gW4ArKEngnuPWTMKUSEzN3iQOZ9/rhX3PRZ1dUqZLkdjJSPsMEqZRfabkkD+zT5o21fHcpar6LPv6pLjXkvXhaVKOJVcpUaWuLarL/b6pasuELeP4NGZ8jnqVZA+4E/B2+949Kqklgc+DRsluGt3qiLWbm9ZswpvLDhkh7LkAGzi2/qKgcTouB0dMV8ymt6iqoPsUSZnnBfHiZuhzlwRqmoRpB+FAYe9tLyb5vBIiKZ747AlxzwaeaS1CWj65luyILlbHtYxAXgxcGkK2rXDv5yVC0wnXc2fgHVRaXCcja54EPssk8BTrSHcgRzuR44NYc9m3b3/GcJRwoSzQ9fma7JPtdA4bLaoo+4Y5xb9IFYHyrhkrWTk3RcI0o8TDNT3aFoF4tqpeYox7WPYnbS3x/XUphmfZuPSD0ZuXCrNYZeIK53cFfjOQBzGivGpfD+fgmiZdg0lm5jQiE9t/LBCatfWZm/PhE6eO2cOnAM+2nKZUAp8FwlQz2rOyOGJEpcF2RfA+lZbTMnq5jp55Is9V1Yutes7v/7wkyceEfzESeDfgZVTJ7CuuUTKn9ymJ04IQJKocywZwLUqke7hg0e4TgTQNyCO5w55jftzbMRt/sXV86BqJGuY9mRJhCgt91oz1kCohzkOSxymJ4JfYxFnmzUWwqIuRyctV9elUmh3zqAbuntVx4OHAK30uBCHTmb2mbPGyFJuZ2yaAawRisQhCq75v/IDZlsR09z8N+6CTJt8P07Ha541nfCtw6uanMsXF6+KG7TB5Nik6TQ0ReY6qtqMntESblp9nx0TNXwDOEZGn2hl3U1Wj19IEhjN8rBWvaRN4qM2/hxHy2+yaTh47ztg9rxdPNJiskCKPP2abUAzDPRpGGzpvticQvLaq9qmkSX6GSt4jE4wP3xFu1OzhkHKScLGqDkTkUlXtaDGEAxE56Ryn07Y3T2HeJ068Fi83F5s8lwS9ipOVdUsoPeCRwZaNy1NU9TIjRVGOoDEnnolSVUluAg8B3mzfuwGPOVqz1jqnTpjSE0z7OpuGo2yuLu3hTvMZwA+x/dgn5/Dh2/TmCBL1Ddv3LqfSrFuxqrkktsu+oHe4Jj+2cb2Ky0O3Z13ypr1ii+qZ1rB3WPNS2pZAPS9E2dvl3Bd4g30fNUs6dj0ZlUkk9mY3vOH3tezRMzubOUyzYROVcuJyglId/Su2B/re18roUhKm+sLeVlppE8bPdjcpVSvNXFicAC4Bnm+Gz+UYunNSjhqjZk0jgfc20uSl3R1Kj8F5IIGJxCzb1WFwPh4L3JBKVqBJRphmxSY2zO6dsPv0crtnAvRTamD+CJPu4I0MCcnI+/D+Hi5uOeO2MCXMT4sQv46Bjc1ePTknGKv2vAk8GXgelRBkaw7K8utoUUQ7NymRptdx9UhTIpGY1AAVO9mkdArYUNXzgEdTorpHuLpAZ2J6e0XMS27bPTpfVV9iaSlHyGO5PW0y00A/bNx9SrjQFUzjZ+oG8tQJG2BUzpUdog6RbXvppYs4Niyy0lbVYSBY0ziqGyX61guEsTVigg+pQqz+O/VE01MhnmWrjctTgVURebyqrpoX4uSsQUkCn+UIjecsNex6HmivP4LtelwaHo1pXFONqA8nnCs+r7PpcOKg5qc3eu2ZTUZEuqp6xBzOx5ndXgtrLzF9OLGV2n6wDlxkRTBPouRzrrqDnD3oZpswuaHvBnJwxL7/NPAXwJeB77HH9e1nW2EyDGwhD8NEOd1G41VVXYrIV1NEnqKqTsS6MzJx3FvbAs6yyf5F4K+BT1ASLb8fuDZV2HXUvZwkEdMTpx+nqk0ReYyqrtTIp85BhU88ots00tQGHkyVyB4regbzWLWUSBwSXN+nqap3AS4FfsRsUh7BzS4a4dm1CTeBiygpKhdRFc1sGkHupx2cTcLUCITnhJGC3wVeA/yZiHwjeOH/zQjCJcAPAsdsEa8YOx73qMU3Su+vNgCerKoYaWr4/5zypPH+QE6WXg+8CfhLE2R05nI94IfNgN0M+DqlaqW9R6Jx3DyRAfDzRmT79mhaSHcevCwngceB+5hxf4Bdh8+BDrMtnZBITGcBifTMYeoCZwIvAR5k62eTqqAmMfuITco3gEe6c2w/W7NgQZKlCZjoYd9AL/k/C/hFEfmfIvIe4Jiqti3qswJ8SUR+G/hZ4F22eD3jv7WL/6uBVGwZafpFSwRv7nU8jOTtxevy48GzgBeKyENF5P2UpOWmHZW1ROQLIvJ7wO2B3wbONa8vHmGOG12SmjeyCVwIXGHv52rp/TnJ+fJwtPfS+wZwT+CNNqe64Tk95ETi6nasZU7ltSjthx5kzodHZ13vLjH78L1gEJzix1DEfj0vtp2J4LNLmLytxVHg1ZRE7I6RJAkRjT6lWqsDfBb4OUoi71m22XUDEaoTo502UZ84XkWwTtEjer69vicVXmPp/V2MR4wudSgRt2cE8ui5RN3yEbVhr3tV2IuBsynh894EZKk+Pp4LNQAeDzwv5Pg4oTrtGFm37Hp/qeEp7s9BoWPzbMvG6VU2f3pUWl11wptI1OfCUrSisXXbsNSEo0aW7kCJ7B8xopT5SvOFmK/qunVbFml6mdnCPF4dE3s5khs3R8YJim+gQ0oY8BOURGMoRyP92ntHdVxXkz3fbu6DbRE3a9GjBjt3zm7WrtmP6LaAp9nfXAq07EjK9Zr64xgaIzLXBL4lTMJJPYGmkcNHW1j8pFjciKMjJ5MN4An2fJGRQCcLnrQpnL6jeF3UrG9ksikiT7J7sGJJ8t2ooj0inOt6Ti0blw6lPUScN4fR4dzng+c0PQC4DnB3SoSzbdcx8Gtw7zpD1EuPevHIopIkX/cDiv7apqpeG3gLcBuzJ22yf+GikCZvXv51209dIqJjtn1o9i9TFaYUYaobni3bwP5QRL7O9uTtnSI3HuUYiMhDgN+gHM+dCIRsUrXZqGy9aeTtMqqjmknygTz36UbAN1PlV41LPGNF3P8Vkf+0RDwnI7KDoXMJhraIPMYiKEeoji2btbHXCSI8DRvfJ6rq8+0ebFFVVoysKvSu7K4gbnlPN6fkoq3bNR52ZZrfzw3KMeZ7KLIKJ6/FSF2Txeson9jNhCnzd8W+vZl9vYh5O75JtowsXZOSN/nTlOObNUZEYxNzjRV7bFLkIV5BdTLRsKBBK4dpOoRpp//xpUmOQGxjbhpReDhFnPAsu+nHQ+RoXEKgbE+I61Oq5/6XbfKTtAdp2rXc2IyqMn65uP8PP2L8TDxPthD5YIfP77/XV9UjwAWU5Hk/dhqMIEnjjo/nUx0HnqaqL6SqQPMFtaOWlRM+u5afCpsPHG6xgRP2hpGmLnBL4L1GLp0sudRF9llKOPHftLlx/wWPNDVFZEtVzwLeZk7FujkV2SduAad3IMHHKdIrvyYi0dHOCNOUCFPEIBCKj9vGtDKBIfKjsiHwKEpO05l2g7dqJGKca4/5Od7I9Umq+r8sEbw1ZjKcR5hua9c3Cdmqk5mPm3fbtPcdnoJYxpwp/5vzgV+nVM11w7hE8jCWEQ0LZ4ui3/F8KvHMhojsdHTlVYnuqZ8V3nM4IaHcT9IkYaxuDbwduKZdU8eIcm4OCYKdOYcSOR4sKGFqUo7Yz6UU1vw0JbLsEdeMLi0eYl9Vz+U9X1VfTnUC0M6czukTJv+fVwEftO83Joh6tNiu4/QoizSt2SQYlXQ9PA3LphZp8uq5F1AlWTfN6zz5HKQI2ibq9kPAne3/rzD+0U48MrsK+EiY1HoqsmSRJycf3mSxLSIPA37NSBMjxmSc8XYye8QWVd9I0y8ZUeqq6sqIz+ffr1oe1i0peki+SJXpiS7GljnHKd3WX2L3vmfRBPWkdbvPskSGQ9hbUv5cR+asmEJsnTvB/h5bB71FIw4WJXZS+A5KzpIfwxFsWEZcDx+xo0Ps9uAFT14YFU8QxnVCO4EIe0X6hu2nvxLs5MmG5Ume9k6YZMLN13Nx+jXDM3aCmYj0RGRoTXR9gjyMold0BqVqrBkIR/8Um4Af00iYPK407srXLwFWRGSgqmcY6161/9FR1TUjBd9COQe+dohytXYxlr3aItlRedxfFxG1MXH9pqGRuMfY5Pew+iZVGek4G10jXIeEcXmcqr5JVa9lIdyOVfOtBbHLjoisq+r17TNcgyoJvMX0FOajEq63UbkX8E7giM0rL5tuBA98IUtuR+iONWprddL5O5jXcTCS1Kit3RbwSxTZjrknTMEJaNpaHRhZeifl2Py4OUiN2jrNzfJwcYIqt2zTyIxHvzuB8HhR0IY792Pux/WIu8/9dYqkzK/a3FihFPq0qNJhkjDNpStcSJYffT2Skgh+LpVeSKu2AYzrIftR3QYlJ+i9qnpzYEtENu3RtSO7nqrej5JEfDOb3O09eGV7NUwnE7uN2D3NIk0egety9RD7JD2gXNfo/jYut6MkpvdEZENEtiz6tKmqdzND/AMWOWvPYDSiZeNyF+DdRgK7NW9t2bqwNyZ0hvZz/k7LlsTek21zBFrAi2xdHzPHY97ngdvEFbvGc4A3U1IJjlOkBJSMKE0bq8H2NIzEfhF4P6Xv50MpkjwfsT3nSC3atJv7507iJiWt4yXmIPteqiRxZq4z4a26ySubvP2FSw54M9b+LqI93qplw4zJ7wIfVtV/o7RvaQHfDtyEcubvFWUrnF7e4ECdyJq3L9bmZJWS2HfCrqtd8zImIZRr5on8CCXn4X/buHzGrv+bbVxub57QlVQh/llZcDG6uGWbxa2At6jqA+wzu/fWpqogWXTstXRcaiRkbiIvtkk52b8pJV/vzjY3VliAzcKi4WsW/T2LInp7G3NojgaHKjfH6a/DbogiPRZ4K/D1UAD0elU9B7iukaf/z/a9NXbXbDwGGdYtCAHlmE5tfawnYZp/DMOm9nCqNhhODlz4sTnB+/nxUcdI09lmPO9a+12vptsygyNs152aRnQgJrJ76P18e+0RtgEI28PtMsHYeLXZpn191x1+97j9/hlcPRlfZ8Qo+RrwapHbUXLiHkSJpHWWiCxFIrnbyNK8brINW+dnqeqjgWdQigFcg8iLFeb9SK5Jqfy7FiX6eyu77iNUx9Weg5mYHrw46uvAQ0XkvXb/GqEx8gDYEJH/p6r3BJ5FORHZZHfyF54u06iRJjXS5Ed0m0mY5tcAeHSkG8jCI+xmn2eRgsaIKMlO1XSejNyoRVQ84W4QCFGD7W04HM1peWiWayWUCra+CZG5uut5tiAeRXVGXg/9nu4zt2sktRvGRGub7lF21sbaz7Gp/4+YgzNua5imfd4TwB0p1Zc/FzbJutbUtMQt5ZBJp+zxnsyy7fD5LrZWrkPRH7qd3fcN2yCawfuepPI1zpvGKNt1kPPH2zRZlW0j2IRrUiLDP2HX2Ga7sHBWiU5hOob15nlLZwKXi8h7TTJmk5LT2gvzd2C26Osi8mhVXQeeaM7fariX48zbVpgHYo7icds3hpTec9tsX5xjY87tKFcwl1HMuU5mtYTnQUh6xjbxC4HXUs7oj7Nd62jkJhhu6KgNoxGIxyrbk+4aI8iGTHtM7GuvnvNWB4+m9Ig7GiJj/R0m706J8hLGyUuPvdJihe0VGI0DirYNRxCj+veTCJj69azaJnInSm6Hf/Z2qKBqML0qv8M24It5cVUVnFcCfZOR5NvZ/SeQJbcLssdxnMaYNm2DaxlZOhf4HSNL3kS3WXP+8ihuuuvNI3yfAX7D7M2G7XEa7LzveQNKLm2bkt/0S5SovmsqTZJyEe+/O8dXmZP9EqperGthDemoPegUDtiQKp927rBQ1T81VewLKHpE55gR9D5twpKIcnm0KZDFNeBiSg+hI1SVhK3axJ/18Rl1BFQnTrtNum/bmNyDqvrS88HU59A4LXMSM2snPKI6sHXwesqR+8Y+EYd60vy01pMTe48svZOS67IZnJoUKJwNexZzTzvAH1NOSNqcQiDY7ZJryInIk4FfNqfYicluyfqaPU5YpOllIuJ7qfdjHYtn2Oe/CVW19Vyq5i9cubS35DBD8EjzHM+gHNNthmteeE/KNngfj4EtIETkQooiuJMB18KaJ+Pp0bOu3dcYLdvNhhejZ0NKAuV9KA1Iz7RFv2bVkalLMt+ORNvm/ZmUY7g72PxZoZLh2OvcjDZmWuuqYWv+HEqC921t82tTRWPzCG52HEANtvp9oXpTTxG18WbsDayzgog8iSLn4uLFk1b6+v/dojpdWQceoaqvosrdHY6x1sSInJpT0maOI5kLR5jsBnl+jojIw4FXUtSm/RhqmXqGaW1yN1T1qIg8ktJ7zpPV+7V5McsT2heyJ+av2mbnkbL1Xd7fSJpWKEmXt6NUSa5ScgY6jG44nJgP++CRpTMolUceWfKIy37eV19z06guctt+BvB7lATvE8GZnLSVVOJwbHUH+Arwl+H4f6f2U41IquzlpjVMfwLwQrv/wwnv80nxYX9Pe2xYEOJVFqVthd85JWlX1bMpFZl+ojGX+29jUSeeiJyg6mX2WIuoHKESAatrNA0X0XhYxE1D2LYXNv4LgJfbpN+kCt8OGS1wOS0jAlUulifjfgH4N7uvD6focH2CSnxvMyzKSa/H85rONnJ2a0rprs8RV3xvmGhnY1xRtxCZagZyP2r+6Wm8P80Nb7zxDortLVsP1wZ+i5LgHyvh2KeoSz2P7muU9iMHJrtg19d2YUrb0K5hZOkWtm5WKUcse83NSuy/jYs5mCeAL3F6PbQoXhzfY2hz/SnA5WYvT4TI0LjilrFBvTumPYs0vY6iWbbhNrC23pq2x/hcfybw3fb3c1tstnAdicPEIfRhG1ASntUYspe8xxYmCxuariUL9lXVN+gOcJHNg0fa5uE6TY0diItM0Zi4EvdLKWW03wi5RK8z0vI99rN7GGnyljGxuvF0aAYS42fu97ZrfwiwZf9rW5PKcSqf/OequmLtZXbTNFqSME1EXjyBtWsl9b9OiRyuUxUu1Oe27NP/BuiFarWDul/uta/YJnZtSiPdW1OOl48wWdVUYjqOYcSQUt2op7PrAV7BNrCj50tsn3uSkaZWWA/jzINR9rJPEc+8tqpeKCKfdZtGEH82+9ZU1cstaOGSB40QtJirudhY9FlYy+O5gHIMdYZdezdEExYywrRDhMMn9dA8zvMpiuCeCB4jcKeLeBwG+vZZj9jCe6yRXrF+dkdssSIiH6O0O3l68IiG7F5fyEnWcXvft5kBGlKO5vqUKqSxZQaMbHk11rIcDU/bxrkm229QegiuM3kLo70Sp4PEwDbCTRM09N5wrlLeYHaixokD2uu83N9sUb+8LE+mHM8dZXsPut3OZaEkpN8F+B1VvUhVv9c6PXgXjOuZPtQfUwqN3IY3zSa355G4t5ZlIpkmkRppalD0mo6FcRCWJBE8HA34wlk1RfAOpRrihBng1doimcb4eBnqUeAFIvJqUy7vByK3WXGR0kBXRF6gql1KxcgxKrmD3Wx0vrivAu5GOea4H/BVVV01dejWBJVzDaClqoPw2dPrP1jCvQa8hXIM5wnerpm2CMrWHZuH16DoLN2SIr56JlU1bCZ4L0u4ykiTpw2IyFOsUvJh5izsxqZ7OsKAkhN8nNL66iXAV1T1n0IQ4juAG9rfxUjuFlXRwdzZvdaSTJ5m2PgGIvJIVXURRz+eWw2RiEVHzMVxAbRVETlfVXsUHavNmicwrYntEcBPAi+0MHMviHTGI6rYS++oiFyh5fzxClu0Q3YnLOq/f9TG5acpuVP3pSQ0nuzsPWaUaUAl/vmTLICK9CxtFDXHwBvMvt7IbmwfMVwER8lyljZNT+qdFJ2lY5RIurf36S6LvU+idPLY/6Ryv9moRwNfpjSW39qlo+D7htvDgc2tcyjHvxGutRTlfJrhfeZur20syTzyo5MuJSFObPK8OhiVXiATdfXqRYsyDcNRZdcazg6tbP4iyvHcam1c/GjrsNG1z/IPlDCwBGFOtXs7sKiSJ3cPgHUjgb9COcLz/oAeVeub0Rg30uQ5S94W5m5Gmk4agGCoGp74eIr3U0q+1Q2pKjfHyaGJei2Jq5Ml163xe3UupUr2bpTIaSeM9VyWN4f51fKqTVW9LvB2KgXvVba3QNqpH56yXQg2vu7EPv48fp+YPduuta/7tve5rXwapU/iCpU+4bhHdPU14/OrHSJP/WCDO1SRfXd85/o0p7FMk8jOeKNGygUURfAz2C5aV2fCizouw5onvqWqa0YwXkrVkHNrh/lyGGPj/+OLdu8aO93bcI+dvHjk7CV2r91I9MJ7T1puK2YE1i3C9CZ7377lU3lS48j3Dpu6UvR/1jLCtJ9TWrpGjr2t0euAexpZWuXqIq3M4dif7INo13tdSm6dSwe0Ayk83eYUN8GoGxWbiFOLxiVZmr+9b2g2qknplfhKs+8bbG9Xstv5KIEQtdi5awZJmOZzEjUtKvAII01nUcLYfsa6U8uQhXXQbePvUfIhLjLSdCajy1GVwzGcLbsXf15xjtOLRga9naEZiVcCT7Dr6VJVA+5W4HKFktN0D0oi8VqYMyOJkpfe2kanlPL2FA/cRwfACP+6bQavBf5HIEux4GGer3MArIWcpXdSJXi398GZcZHbrfB1g5qsRmKOjHtlM50cPcGciTOpqqMXOkCQhGlvRqdH6RHWMtL0aiNN3oNn2YTdGsFAipW9XwS8ghKBcwM6ZLLmtvvxuTaBTwcSNC6x8Rytlm0wLzJDcZTRxxCTEKaGRTKuAu4OvJFS0t2jSpZvj7iWFRE5rqo/SinNHeQGtG+bworN0bOANxiZ/YaR2RhN0QW4zhNGln6Pcgzn17nb6iM/gnNRWFc99z6RsQ9YRkTncMsL96wjIuuUtJQXU/KPnCjnfT2N976sxtV1S5qmS3Shfe+J4DuNz6JGndzzOKlZZIb50RY5uciMaY+qD5Ac0udqhE1Px0mstqTw+FJfVTsi8iuqukWJnm2E+7ybqo2Gka9125xXVfXxIvIJm2N9m2cNqjy6vqre1Ly7c4wMrqQp2vN6bojIlikKvw74n1SJz1KbT4dp97S2ae3JCbME7y2rePpdiijlOlVLl8aEzoyyPV9pxcbtY/b4CiUP7HuAHzUn4YQ9C/tT7ZTHfAe4LsweRr0412jqAY+3+/l0s+/uaC7T6UoSpjE21H7YSL2y4ALbZB9FJfKltY174SZSFPt04mQLrW2Px9rPH2MRFTdwfSMMBzkmroPk4n/NCa5rECNSqorlNL3M7vMVVIngreA5tyeIYPlRZpfSZuNmqvpk4IMu6Bb+/w3sd15gUZBNI4JpmCbfCDxa5PNhYBGXN1D0YY6HTT0SiMOweTGRekhVaCKU6O3YxN/Woc+vViBL7zKydJX9vDPm5xpFbnohqvQW4AoR+dsRn+PHzQbch0rfqb6XyJhrJzpovQVtNSThWqdymhOJUs1p8PFuicjFdn+fynYJlkbapiRMIwmDG2ARucAmz3k2edwYzaVuxB7RCwTicTYW55mRPiNsCI3TGORZiqJ1LdL0MvOyfomqQWVrl4bNydM6JS/pDcDnVfWjwAdsY7kt8EPmrbuIWycN0p6JiQvQnkGRDrgLVZXYtFIO4kbZpNIM842qxfgiku6YOFm6DqWtyy1q63A3kRx/b3/tKSLyQiNI7fA5G5QGqn+hqh8GPgU8he1H84Nd7Ce9EBVb5KrPenPdWVg3vu/1LWr5NNsDn2LBgkkjlUmYlpA0uWbTo2wBX2CkqRsM0zKFKr1sVI00XWiRkftQ+mNdY4SxjhWGs0qMh5aj9SITNH2x3ecNi0p0Jhwjf3bpAow43dUe0VBtULUHGCwpEd8vdGxD7wBvNrLk0RI/cp+G0ZfgTHhPwvizwQQRFTGytFHTWTpBddy4Gy0dbzXkbZDuLyJvt6T5AaUcvWfEqWuRsTWLBj1DVc81+7hOVek5SSSlMWINLZLdHJUfORN7R02nCbOHbRF5qtnDpxkZX9uDE7mQyIG4+mbv0YLHAi+jVBF4P7Flq5oTtqsENyi91N5kZOm4GdNhzbOezQuqhC6HlByts0xy4HGUo8XdJgRHL7sdNqGubSjrVM0v1wIJbaYXt6dNaWD37Z1Glk7YmHqPyMGUbJyy/cj2u4Ab2/GIlKmokxCLTTuG+61AllbtvXtMLo2hgVhuBbK0YmSuS8nt9HYqHm3qUhTqW5Rj5S/YzyZ1ktxenGHX0ZtgPObFdsboncwwMTzZ/snu68WUAqizAwlOJGEaibj41UjTK21Rd9mem1Bf/IuIQYgudcNrjwTeSlU9F3WNGge0qPfNs7L727WNqCMiL6YktR+hEi6NHqJOuJ6cOHmH75UaURo1jxKnJ7zeEb1p5ONMm4d3MhKxEojUuLloB+l8edues4D/Xlsjeqpr9Ou0a1mj9Ia7hTkpK4Fot8dYc/W57OMzBB5qZKljr/escjgSsUEtKiXAfwEfsv/fm3Cdei/FbwGuMyraNm8Eyj6vX/8qM1yNaRIn4rqEluvZs/vSFJHzKD1XXby4H2xWEqbEyQ21axPIy+cRkUdRSuvPpKqei5GXhazwiAKQ1lQxkiellMS/KJCmwQEvqknJy6muq2fNcrvm7a+JyMst0tQ2Y+55TVsTXJNvYq1gPBshOucP4erK3olTG/iGRT1WzRu+LqUa7mdqEZcoJzHN8Y3yEw3g/zMCtLqT7fU8SlPyPmJr7puAd1Ny4I7V3nPS6xxSidA2gYeLyG8aAe2KSN/WR79mA/yIbuhJxGYj/3gPZHJIEdz8sdp1t8bRWZtBNC36JsCNGC3vMBPXFYR9669vYQUKInI+RRF81ebMJoenvZeEaR4Jg02eFiV351WUMOUmVVVVYwknURQ4eyKljYorpdfJhe7D+OwLUTqd922k6WVGmjyi6EeR2YZkBpYk1bHQGVSilOsWcfFk6ln6vI0Qybmtfe7BaaIP7pRsGCn8Lftbz69b2YXddvLm81mBB4nIW+wYblInx3//H8weNiYkBH6vFLh7TY16wGg19pkm9D7Gdi13niWCtIu54lHci4HLqHrG9ZedNCVhOj1pathCON8iTd6AdYNK/XZpevKxXbNFROQxwK/aZtA9AIJTX6D7bYT8mKEXSNOFVOKWnsORmO46dLJ0hKKsfmdKxLdTc15mYg8NX7fMXny3RXS2jJBvi6SETXfFfucs4DcpOUubVMc8u71Od3T6wEOMLK1Seknudtw+Q3X8PAnpalIdfd9KVb+TIgvRsfs9jzIDQqnA/W7gllw9f25eiIYG0tQWkUuBy7n6SUISpsRIDMy4tSkijq+0yYNFVFpLFIGIXvzQIjNHROTnKY1oz6ZSSh/UvNu9krSDhLfN2DIj8Sq7157T1MtlMFUP3h2Tsym5PHc2EnE0RCNmNXne9Y02gUtV9dEicsyOwNSOoNoeYRGRdVOB/0NKb7h1Ko2w7i7XQi+Q/4eKyFtV1ef2blXB/Xm4yzXteZHXoOihNe2IfMXGpDkP89I+pxd4tM15vCZV5G3PYqWHSfL92NWOYf2E5RLgubbvTTv3cqprPGUFxvQcgnd3kb1+PqUdwah2CwuZm2Ih825Qjx2o6jCQyT5FksF7WjWDgdyt6Ge9B9J+Ywhsmihmw0hgU0ReaR74L5nxw6IZg2DwEwezEcWqIrF5dl3KsfgdKTlLLvg5zpyqE4NhIDNxA3AV8NhzLso+jDt/ZURExV9/qareAvgT4H0ubqqqR1T1JynikBdSVOA3wnWeTrdr1GeLZL8FPMASvI/4nN5B2HDc62vucvNshevpUqQ3Xqeql4rIZ8I8aNXGXWfLHEovfNZvNrJ0eyrl9bmRTgiSKye/j+RWRJ6lqgPgOVSFB4dR5RtJuTvpTUrO24AgAGtq/8NR6uZJmA5vIrnA3MA3VDNoW5Qqur4tejdsUftlkYlT9F5dK+YCazvyOBsHJ057VY2VgzQU0bsyr6ptkaYXqepxSpntFpUg4jrbVaYT+2+8G05QVfUcynH4XWzsjzB+qbaTdc+/aNmcdamQTo3UDKikMiIpm+ToXU7xWg+4nz2+qqrvB75oRPDbQ8Rss0aQxqmEk9r3m4H0PVBE3mEVcOv7eLuauyQzsfBhC3gg8EOq+grgSkYo5c8gsf9e4OYWebk/8MPhvjVnKTIygS0cFXXqmj18rpGVS6nELdcOKaLka1BiBwez1Rr2aD/xOZDTsyRMExIFmzAKPBP4c0qo8iZUOk0rLEneS8i78MTpI5SeRB+mKMb+IKUX1Vk7ePyzrAiuJjnwWluPrzHPqlfbsBP7P6fcEK/bZvQ64G5sr4abRMKiHzbnkwTfCPCngH+25xtR+qVd29axN6Ldj7UcW5y4BMLZwL3CnBvaz9q165wkquWbh6cLdCyy9A7b9GbleDlGjtrmXH038BL7+SdV9R8p8gUr4b7NAvrADYwgXTsQYSfzC5HjY/ud2Nc9i7w/y/bAZ5g9jE7HQd6fAXAd4DdNbf7vgD8VkX83u9EJAYsDQxKm3W2mHWDLSnL/Bng2cG+2V4UtvMilRQKiB9+nhG/fqqp/ZovqUZSjy9YcRd3cSxmYIvhrzUi80jxIb1KaOJg51TbicDbwdsoxhzd8jQ1mxyUqvhajV/wBSgXQR0TkG4GwfTtwU0oU+XZ2v2PD6V1zQXt0qFotaXC0/Ag7NrWd1IZErSSPpN3P1qMnk8/U7Q7X5z0pPXr7bcB3zMFesEF1RL9GFb1cCPtv6/FkaoWRpmcakbqYSixWOBgpjyhX06RE9H7Uvv6cqr6ZUhzxUSN4neDAy34XDyRh2t0i71M0Yc4SkU8BD7Ly3HuZp+SGvbUk4+FHdB1bVKsi8jlKM+NzKK1U/Fx/VM7XrEU4olCf2PW8ysK9L6aqFMz1MzrKsdfx71N67r2RKiekEzYjJ03jRJgGVEKJ7oU+C3ihtRtp2tp1o/xZEfmUebFXAPdle7L1Xo6VZYRDFTdXrRGfxi7G3qNpAOcZWVqj5B7KjFefDc1GeAVdfw/k8aDtv8+/OHf8yHfWI+jjrsWGpymE62nYPHqGqvYpx3NbB2gLfa9YZftxeZcS3XuqOTfvVNXLROSTRpqaIZ0mCdMUGfcwGOKuecMD4AmUo7mbGus+c0nGw8+SG1TVON68Uy3CdBPgB+zn4ygTT9WjAvohAbIbSNPL7DpfRKU51Q4b1bImgsdjIMyoNsZJurTxbAR7tEWpnHojcAcb/5XgvUYNn5023Xjc0wxRnAbwKBF5jf1vP17vxv5adnT1RVW9ELghJRF7k/3J16hvpKciR6e7xvg+/UDkG8B9ReSdtnlsHZCDstuk+J3GxW1Gc78I+AEhCtN65KNZu5bGoqzrmOfp7aUsF+5Zlq5wKdv10Jo1At/Yw3jEXMV65G4QnKkHA3dU1UtE5NWW27RKdZQ7ABq+X+1lwif2tsH27EZ8Hvgbpq8wPDUiaerZGiZoU0SuAv4ozDUNnuMsX4+rHLuHNVDVM0Xk1yitYdqBJPgxSH/Jl8O3WrRmkiTgphnCphm3s4A3BLLUrBngUyV7O5HwCAVmUMWM+fki8hpXk7b5OoxRF1eCt6OHrwNPojQi9Yq6g4hYNMYkV6fa2Abhdx9iZKkZuhfoPkaXNGyG+1XFKrVrnmX7IKfZQxdiX91hvgwplWl9J01GmI5QorhOULxl1m4rKXca7/rYuzN1whytV1nhgEeiY9/OPc//JEz7ZECMeX/QjPwq2XcnRmo+O8LAzpvhGAAnLBfkdcBjqAT4+lRltssIF5X8PuBbLVdm3Oi1BBJ9lKJsfUcjojKhoYtCsm0qOYimkaXXWiJ/fxzyYHP301THebOypuv6Pt5Itw882HWW9upNj4Go/Jx9EZfDMT4Z4THS1BaRy4DnUQo0GuZgEGzAfvOMON8a9n/WqAoqzqc05D4a1sZuNceSMB3MPBIF/t6M9GDJB8M3raaNy59QqTL7vJu31gdeKjw0RfBXUOQT1mzjmKUqnmkR5DWK8KBMQC688ec5wNuAnzbD16FSkNYJPoOTCS+dX6Ecw73WctB6Y85hV7D+qhH+WYx6eGTTPf8HWCHKkUAWDzLCcg7bW65k5ejyBAga4XhuVUQuocpnOpuqyGJ4wPPQHa4tqmj1JqXH5NvNJu2bbl4Spv3BwPIh/gX4+B4iDYuQKCi2kJpUuhj/AfytTdp5PbbqhY3JjcRLgQuozu77tc1smdA1Q3nL0MrkVASUoGt2LUq7k58xYh21fSbJfxgEsuT6XxfYMZwbzIYL241jH019+s32/axUmcVqOB+n+9sx3JFDIO/+3v+N6sgj+y0eTDRnlmy75yZqOMoeUEmwXEY5Sn8b8HmqqsHuARGl+L1XmbqjdZxSMPJmqsrTPZ8AJGHax4ltxvU4k7VLGQYPLSrzNsL76jyNhT28skhE5ARFWsCvd67yvLxju/W4GtjG2TPS9EpKYnuTSsTUj0mWJadJQjToYlX9NqqCiEiQvOVF046MhhaleIORpWNsF/0bR5Qy9jb0pPGGvXaBJYC27N71PW9pzOtygvTn5i1PYx0OR3jpA7b3hru3kaU2sBHm6UFt3n5f1gIxzmO5/XHKTu4H5mxG5ftp28HhDmvHe3GuiMiHROS+FFX+5n4RlTHQMhvk/2/N1uz/AJ4iIpuU0wEZ0cMxCdO0oiuB+Eyy2XjOxb8Cn7JNZVFyoNyIznrly6Sbh6uCd6zq6nxK7lqPqjFzf4k2EW9zcQPgpcCZljzdsajOGlWFZNN6pt3AyJK3O/E8MJ1gXkUS7sdwbeBC18/aQ3lxIzxPa96Oijp7JG0APEhE3mXXeVhNazVslDt9xsRk4zkMUZIosDqkVOnO6vjGNdK3KNQPAY+nylmd5Ih+v9A0e7IOPEVV72B2oHEKRyAJ0yERpXhs8PkQWRjX6+rZ7301JMzqblnwjBOnRcLJ3kYi8gZKn0HXC9liuSomXXxxC/gp4A+siaz3g9uwR8/m9N2AP6a0OzlO1Xtr3ORMqf3f9eBdnicir7OIy3CXa3pW7pvUrrVbI0vvNDJ64BtSGBNfy1+mSs5fyurg/bIhVNFRJ8RDWyvt3Wzsh+g8DoCOP9t1PJuikRRlZKbBNaJo7TODGnjTot0Tf6bUYdq/zUJMFfUvKKrfxyhZ+qeLqnjS5Crwb2ERLRJZWlScDDfbsc9LVXWDEo5eZ/cNh+cRXsLrzz8BvN8ciD+0Nhdt4FYUpd4b2O+dsHUyZDL9Gg1kInaGP09Eft00WHadc2RrOV6be63TtDEus7BpZOl3LGdp65A2VKk5gV8Otivt1O439ZPSJTaeL7b55610miZbPatOp/ea21DVh1CaKR8L67o5xTXjOom3pPRTfG0gSjKpmGsSpv1h2d4iBOB3KInAN6YS3dOal1j31NwT/n0nTOEmygJHaOb9nvtidCn+tkU2+pSjJhdza7JdzXkRNxefwys2JhuUZMsbUYRL6+gZoTlKJbboG0fjNCSJ8Hvee00oOUu/Hqrh9rp2onhpj6p9x2HePyeSW8G5emgkS1Q5W4e+UdrcboRIyX5EEpbFyXAyLjaWRylpGW+ytIye2ZmZTagP/URdCPaBgVvolO9nXSD2PFV9o+2vuxrTPJLbn0nTNLa6AnwOeDKVWNZGuGG+uXpuS48qd+NpIvJ/bdMdhI15OEGSauJwSdO6iGxZMnGXSnLgjcB5VM1Wt6jK5w9KdXm3pE9qxlu5eouOcY2Ti0x2KEmXnruwZfN8K/yPNlU/vpgc2jrFJupEy9udbAUP8lExZymIUg73uLaFUrDwFSYr5tgLWah/vUEl7HlvEfkti2iuezHCYWyMYSxlB4d7L/vJkKv34ly0x6hrHITIUoPSsueY235fpzN8JKfAis3BOwK3oJIFqYvOToMwedXcFvD9wC1EZGDHc5n0PcXQn284bRF5N/ALVF3Hvatz3DDW7fkM4Bki8kKLWEgew831PBhYIvirgYcFg7hBOUqZF72a/Ujk9XYGKxZt6uzy+iNxc2K1Ht7nQs9ZOqDqsH5Yt3II4x7hFbSblEa6v2fXuWgVmPG4LxZMLNqDGoHq2tw6A3iRiLx+nop+XHPNjrl+ztb6LGnSuXOF7cUP8CM5328nebM8ktsfo+oTZhheu1RV/x54DvC94de3bFK1KfpEzwnnqmKRisQcEyagbZIDb1TVKyndtBu1xTurn78eVZI9vp/sw/vEY7gWlVZTC3ikHcM1DzDSMuTwKx41bKZCEaX8fTuG21ig9RLJgx+zdplvzbbTrQdXp1bKMVwXeCFFkqPF9pSMeYAfJ/53u6bOKezAtJw+Txm4eSB1E9uMJEz7x7LdsA1dP8MqWP6UUgl0Y+BHgOsD76OIXP6BiHw2ZO837EhnYw46iyeuDpeH6AIdI02/p6r3BN5EJTuwMuNGfT/I0n6+n2+qHmnxJq2PMI98Ddgat+HvLta2HrLH78rFXjRwbxF5t1/nAq6bvo3vWtjcPm/EcJGi7RIcJ8/b+1OKuOKf2e905owQN+yI60zb2/rhOoczcP8kEPGBfcbrA5/cTZS2tY8LXCb8/YUhA7HTuUWboByttShSAa+3n69QjuyOB4PsCaoehtUkS1ebK8MaKZnVJEgXHvUNr2Vibr9v1SNvMIPouTfRqMxi2439OJKrr3mZwD40aq9tBO/8kUaWPD/hILzYg05aHfW+MZ+lTzmGi2SpxfSPazTM9zj3J6lwHAQCfMT+/g3Ah4D/ooiFbjBnbZTGXBM+t9Wak/vxkHJ4FY/76SQOgNsA51KOys9k9hL3vXBiDfgJEfmEpU5MdKIzEWEKpbZ1wnOqwdERk2WblP6iEISQpDeseal+DNOjiHt5m4Z+YLmLrgotNePKmAZ2Ho6yInGOZK5nyrIrVtU0tEjTEaoKSidMs3B99TyL/Yoy7eZ9onhfkyqC2wiRpXpIfd9sSIgs+XwdZfP2Oj6jKmFjs9AHWYSyKSIedehOcW6P+txSG6NxCbFXOHYolWGPE5H3LZ03aPk0h5G4f8Dk+fpUSdb7aTf2w+7EIoUWJV8MilzDRNyjsYdBygjI+MZmEJJR1YhSb8miSIMdJvE4fzfcwaudG49SVY+KyLuAOwGfohzPuX5QM1fJjpuqN9Mc1iNL+53gPSXvPK6Drl1jD7iXHemvzOB1yoh9YNIKQtdv+iJwBxF5n6qu2KMd2uksVAFMvC4/kZjzKmi//+dSRQN1xtfc6og9aX8JU70HS2JXxGkYmhYuKybxRCO52tzvKMJh3XNbmFu2+f0ZpW/aRynh4Q0Wpw3OvpJMI5InqCJL54nIG4L+1SKRQ48cbQL3tWPcFaYUURoTzZoT05zgevuUI5InWR7nGVSSEVFWZaFsZewPuijXZsfFP7qDEzCL6OzW+W7tcnEn9snTWHDyFInRetgEZYK/XwE+Q+mxN3ftFyxHLSqCX8POz+8JfAC4DlUCaKLy/FzDrGPz4HyLLHUWiCzVe7L5Mdzvm1L5IJDHWfzcG8BVVDlI487hnu09fw38bqj8E0pez9BaVwwWfaLPs/13SQG7b2fNAT+oV+w2Jk38buzi5tbVc3cjcpcu9BJEmewa/Tr/lkqpeFQ+SOw875uHl1X/g4h8jfms6nSPuUtR7v2aVc99AvgNI4RbM2ZUDlvJuj4XGlRijVDlLHWoKqrmNdpd1+WJoqY/V1Pw1hk/rrkS+ARVQq2OuJ/xmv1a+kaE/6ZmD4ZWcSUmPqqL/lgA++498DZmOKhST+fo14jTwRCm3f6TxPKSJoqQYwN4B/AFqgTe+pxqhK/duPqm+Qc7bK5zcY/DUeyglpvxpVxTJwlaL2ycXh0lwMNE5DdM2brrR9oLkL/kx8zupd9HRN4bFLx1VsUprfjH1/FrqJLzfR1HDalBIEWuZ9WkyAb8iq/rmKqQFcJzBW8z8gGqY9ZZtWc+FzdDlGwiDpTHAInDIIUiIp8BXkElGtavRRliW46+bZrnAH8C/GaoWloEr6xvz39s17nC8uYx+T1thYiLhMjSmxZM2VpCRMaPF+8jIu+xHLd5us4GRUPoryj5eN+giv61A3kaBmK4Yb/7KhH5dyrdssT8zmeAr9tzZ4Y/o6dGHK/ZnyRMidnyQiwx8ApKc2Ivq98MEzbOxU2KlsfHgcdR8p+aCzRnh0YC/hn4S2ZDW2eam64f9Z+gqhp8qCmlL+LYbFEltJ8kS+ZIzM0cplQbNYDHAJ+klGu7B+8kaRCI8Jat67cAvxzy+3Ifmm+HB0rKBTO4Vofh2fMi/81fmzSamRM1cVgM349aHkZpFXLEDK7n92xQadCcSclvuIeIfMx+r2U/W5Q527Co2T+x3Pl/niy8Tmmv0AGeLCJvNZI9XLCx8Tm+xfZ2J0PmSF7CNhpXI/974M4UsUlvvOz9E51YtW3N/xrwUPtZe96uOzHS+RPgH4H/ZDaLFAhO2ZdtvsJBygokEnswrq6A3RCRK4H7Ubpav9O87Ji/8jHgAcBdRORjliuxSXWM11+gcVHbTITliDDVu7UTCLPjCSLy4nDf55UsjRIB3Qik6f6m4N0RkXXzdntzNn99PTZF5P8ZaXqgRRs8X6lHSQ7/A+CngScEW+CEqkdibh0/Ku2wfzXCHHPWmOIa9lw6LybqAJ8D1s2+NCeVSspeconDMq4DqEpRReQvVfUBwPdTSlI9NP9XIvJ1VW2a3k5/hIL23BNIl8xfQuM6rEUVBhapOJui9vxiq5Ia1AzfPCNGY9aNLL3HE9nj+phTZ2ho9+wY8CZVfRelEau3+7iKUunaM7mEoedqLUDy/rJjCLSs/+n7gduZY+DHrTCdJHC3Ge1AyhvAa122wuZjEqbEbEdVTAS1aWTor7bN8qK/clIQLytmFgpRFdorapqUI9gnGVlaxC71A7vmLiVn6Q9NWmJzwdZ10zalDRH5YG1dNy1Pa9GOWNOeqzbs3r8VeDTwTUZQXENtGoQpSth4XuRngXe7PMluesnlkVxiKovMDKcb0pa1Q4gGdSFbIyz7raeSEOhRqgNXgceKyC97A9IFIsl+1OoJ0C8wsuQ6S4sYbRiEdb1qrU6a8b7PeSuQxA5cQkQ+C7yLqvpz2g14m1QNnleB3xKRL0dCFfq6JmFKzM1m4v3iekao0qAuJly5ekAJlbeAnxeRl4bI0nCB5reTiDbwz8CLzbt1xftFdISieGU/ePkn13U6QYsDu5c9qiKW1wH/ZXPec9Om4QD5XHRV+c8CLzHdJQ1kbiJ705hwMez24qM6uLA9LJsVEsvIlkJfPY84xUaUpvQ7WOAjOb+u/h6NisYxneFr9bW/YdfcAC4SkV81QzuoKcMvAjnUcK1/ISJXhUjLcEHXtYZ1PAjruh9+nkdyi0WSvXCjJSIfBX6V6gi6T5V4vZMS/EFhnRLJXQHeLiKfc5vruXeT5tA19jBIk150JEvRwxjkAkrkHFhYDMJ690rHo8BjLLLU8E12AeeBk6YB8N4R47HwazrX9VLd54Edv74EeB9Fl2uLEm3ywMlh9wM9E/gz4DKPLu1FUX4iwlRrfjrpP5NAmmJIWjNEm0gsHOphbz9uOxO4UEReZjpLuqDX7nCxvH81I71Ix46JRCROQyMkJ4ALKJpHq4yWB9EDXHvupKwBxyg5kscoEbA9/d+xCZORGtmHC24BXwE2nSilF5JYcmIxjb89aHh+mksJuPDo40Xk5ap6lNDTaQHhzmUb+DTwKasOdeXytHmJhSRNVn32KeDBtsa9Qe/wkGyXH4NvAOeLyEdV9eikFXF7IkwjLnI44e8TPM4vUcLzmb+UWD6GtD1S62tgXGdEw+/PUmS2fkzvpbyu4K7AxSLyIkvw3pgH+8/25O1x71Psjq7Af1BpTyVRSiw6+kZQ/gA4n0o0cnOErdAxbUv9a93BSfMk7x7wSBF5m2l/be7HSdZEhMlDbvatG4FNRpcQRqPhYegte/2z4WuZtGNwIrEAcA20j7O96fCAU7dK6VGSKJsUBeXPHILHNglp6lLlKbqAnbc7uUJVmyLSqyX8z6KnrDWC4xGywRjOojfX7dnvSziuGGRuT2IJsGFaY28G7k5pm3KEImLqDtRwBHka9RhFjKjZS5cq6VBOsB5sZKkpIpv7VUC0mxwm/7C/x3Ylz80dvDPv/xWr4v5kwZR8E4mJvTB7/oytk9hgeKc1oZQjnj6l8uMDIvKvFrGZZl5MbIPg692VdVuUdidXmAGdJ2Xngd2TrwEfCkSoEQz1Tn+3QnUk98FgExOJRYeLRXZVdU1E/pCiAP4hiqK/8wU/so/l/VJ7UCNXLkvia9MdM19z/0jpQfp2U/Oenr2xM3h/NFT1j1S1r6rHVbWrqgNVHep29OyxYY+Pqep1XO3Z3yvnWGJprEm1fkRVr6uqf27r6Jitn4GORt/W0lWquqWqt7X3a8X33sVnadnXt1fVdXuMWsungn82teu4yv7+8fbezaDgPk/3qmVj9F1m575hdkzD9dYxVNUrVfWEqn5SVa8Z7Zzb0FwJiQW2cS2zcQ0TJEZVz1DV/2XrSM2GrdvzMKyd+loa1L7fUtVNW4fH7PXjqnqFqp5r/6szE2ssGPumql5fVT8XPvCWGZF40Vt2YT1V/Yqq/qi9z1rYNNJ4JJaNMDXDZvwDtvDdCPR3IE2DYGxeYe/Vrr/3FAhTNGob9veqqo/1z2jX25iz++QOXce+v9Su60qzZzuN0Wa4T09yAx7et5FOYmKB7VujxhNc9d27N9xMVd9szofbj2j/tiwA42usF+xKtC9de7xZVX8w/P/OpAreB0KSdvC8fkRVPx28zON28Sfswrr2s6+r6s3D3zZ3Y+ATiQWJLjXt2TfjJ5jh6NmGvGHfD20NHbc1par6IVX9FjMMrRkhTE4UNu3rRwXj5UZT5uk+1UjTmnnI7wnXesyM+yB4vutmB1VVX29ksT1izNPuJRbZxrXiXA8OYjP83veq6lNV9aNj2JY6PmR/G4lSO/CS5qwNSsM+oB8rXKiqnxpxYV9V1Reo6k3sd4/mlEoktq2ltj3fR1W/UFs/x2sRpter6nXs99f2ahj2+UjOydLT3UYs2H1aNdL0BFX9Wrj2rpElx1dU9Umqeob93dEkSInE9ghU+P4MVb2tqj7Aori/qKq/o6oftyPt99lR3nNU9X6qegvrx0hwag6FIMleLhoToHTZe1W9IfATlGSsIUU46sMi8jH7+QqlUqSb0yaR2BbNWBGRTVtDdwZ+ELglcB3gw8BfAX8tIu8xguOtB2QviY32v5si0lfV2wO/az/ypOVxbYRrn/wBcFf7fP1FqgazaGDPOrR/P3An4EeAW1GSwd8PfJSSjP/3ZiMbWHuQnOmJxDa707b1sTXKTqjqmRQDd2zEz7yx7kmhysOwNXslTLEKTk5x4atUjVUHOV0SiasZj5PRGF8jqnqOGYUTIrIZ1pLrjbTNUEybMKkRhg7wM8AfU7qXDxbwPrXsHvWC4T7X7sex0GB2jarsueFOZSKRuBqPaFE15PaKOK+ci9Vw7nS0zAnpmRPTPyyHpLUP79EPhGlNVb1XUtRl2rLnpqmAZoQpkbi689ICtmyzHYjIlR7ZsNfcgGwjWLNg9+yzf43SqVzMyC0UYbLI0oDSmb3jxl1EvhLuk9u+brhHbVXNnpmJxGhHrWcvd2vEqG12pWsK4m73hpS+dS5QeWho7cF4DMPFD80Y9MNrzcAU3Yhs+51EInESwxBF2gxGRSjHQF1rVDtq3c0CYVKKkOaV/pkX1MhjRl6MQHlBjNg9itp0buu2kiwlEtudD18fvo5CdFbs590Rfzdwu6equ26ie+iEacTFX+3CgjF15HFcIjF6/egO60lHOSmHbSjGIExt4GMi8u+LWjIf71Ot4/moezfyHiYSiVNziJ3sWm3NTcX+pRZIIpHYD8IEpTP4vjliiUQiMUtIwpRIJPYKjxw3awQqkUgkkjAlEomEoVUjTvVG3IlEIpGEKZFIzCdCcqXDdU2gKtQY661qxInUHUokEkmYEonEwnEne+7b17tVzT1ZIZbK1olEIglTIpFYdHswqfSHE66MKiUSiSRMiURiqWzCqPL4cYlTIpFIJGFKJBILiyspgpOrVOr9kxyteQ5THsclEomFQ+qlJBJLipDw7Udpn6Go624aYfIGl9TIk/d3Otn40t7j74M6+SRJ44lEIjHzyAhTIpFwXAn8JyXCNDTCE5trR7sxDL/TBK4C3mokbJhVcolEIglTIpFYKFhfpqaIbAHPN7twqsRvJ0tN4DjQAf4U+Jw3pc0quUQikUgkEgsJVW1aM9mXasGVqtpT1YE9HH1VHarqN+z586r6baratkczCVMikUgkEolFJkwtVT2iqm83crRlxGhTVTdUtauq66p63H7+BVW9pf19x96jkYQpkUgkEonEohKmTiA9q6r6FFX9UogsDcPXV6rq21T1++xv83g/kUgsNNILTCQSTpiiwreISF9Vbww8APh24BxgA/ga8A4R+d/2Nx0R2cgRTCQSSZgSicQyEKYoWtkGVER6p/h9r6brZ1VcIpFYdKQOUyKRGOVE9Sk94Vbs+yZVrzkolXRbZKVtIpFYMuOYSCSWHJao3RSRfvjeCZHLCAyBhh3XCWwTwEwkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIJBKJRCKRSCQSiUQikUgkEolEIpFIjI//H1MJh05ecSGgAAAAAElFTkSuQmCC";

/* ---------------- DATA ---------------- */

const INITIAL_CATEGORIES = [
  { id: "plumbing", name: "Plumbers", icon: "wrench" },
  { id: "electrical", name: "Electricians", icon: "bolt" },
  { id: "carpentry", name: "Carpenters", icon: "hammer" },
  { id: "civil-eng", name: "Civil Engineers", icon: "ruler" },
  { id: "architecture", name: "Architects", icon: "building" },
  { id: "interior", name: "Interior Designers", icon: "sofa" },
  { id: "painting", name: "Painters", icon: "brush" },
  { id: "hvac", name: "AC & Refrigeration", icon: "wind" },
  { id: "cleaning", name: "Home Cleaning", icon: "sparkles" },
  { id: "moving", name: "Movers & Packers", icon: "truck" },
  { id: "mechanics", name: "Car Mechanics", icon: "car" },
  { id: "carwash", name: "Car Wash & Detailing", icon: "drop" },
  { id: "photography", name: "Photographers", icon: "camera" },
  { id: "tailoring", name: "Tailors & Fashion", icon: "thread" },
  { id: "bakery", name: "Bakeries & Pastry", icon: "cake" },
  { id: "catering", name: "Restaurants & Catering", icon: "utensils" },
  { id: "beauty", name: "Beauty Salons", icon: "sparkle" },
  { id: "barber", name: "Barbershops", icon: "scissors" },
  { id: "legal", name: "Lawyers", icon: "scale" },
  { id: "accounting", name: "Accountants", icon: "calculator" },
  { id: "realestate", name: "Real Estate Agents", icon: "key" },
  { id: "it-repair", name: "IT & Computer Repair", icon: "monitor" },
  { id: "events", name: "Event Planners", icon: "confetti" },
  { id: "metalwork", name: "Blacksmiths & Metalwork", icon: "flame" },
  { id: "welding", name: "Welders", icon: "spark" },
];

const ICON_OPTIONS = [
  "wrench", "bolt", "hammer", "ruler", "building", "sofa", "brush", "wind",
  "sparkles", "truck", "car", "drop", "camera", "thread", "scissors", "cake",
  "utensils", "sparkle", "scale", "calculator", "key", "monitor", "confetti",
  "flame", "spark", "grid",
];

function buildQrSrc(biz, size = 200) {
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const qrData = encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${biz.name}\nTEL:${cleanPhone}\nADR:${biz.address}\nEND:VCARD`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=0f0f0f&color=ffffff&margin=10&data=${qrData}`;
}

const BUSINESSES = [
  {
    "id": 1,
    "name": "Halgurd Plumbing Services",
    "category": "plumbing",
    "owner": "Kawa Jaza",
    "phone": "0771 242 2679",
    "whatsapp": "0771 242 2679",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 143,
    "verified": true,
    "description": "Halgurd Plumbing Services offers reliable plumbers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 2,
    "name": "Zana Plumbing Services",
    "category": "plumbing",
    "owner": "Kawa Karim",
    "phone": "0771 617 1434",
    "whatsapp": "0771 617 1434",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 170,
    "verified": false,
    "description": "Zana Plumbing Services offers reliable plumbers in Zargata, Sulaymaniyah."
  },
  {
    "id": 3,
    "name": "Sardar Plumbing Est.",
    "category": "plumbing",
    "owner": "Hawre Ahmad",
    "phone": "0780 448 5552",
    "whatsapp": "0780 448 5552",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 90,
    "verified": true,
    "description": "Sardar Plumbing Est. offers reliable plumbers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 4,
    "name": "Ranj Plumbing Services",
    "category": "plumbing",
    "owner": "Bakhtiar Rashid",
    "phone": "0773 926 1711",
    "whatsapp": "0773 926 1711",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 141,
    "verified": true,
    "description": "Ranj Plumbing Services offers reliable plumbers in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 5,
    "name": "Payam Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Barzinji",
    "phone": "0775 691 4150",
    "whatsapp": "0775 691 4150",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 15,
    "verified": false,
    "description": "Payam Water & Pipe Works offers reliable plumbers in Ashty, Sulaymaniyah."
  },
  {
    "id": 6,
    "name": "Shene Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Salih",
    "phone": "0780 384 8428",
    "whatsapp": "0780 384 8428",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 97,
    "verified": true,
    "description": "Shene Water & Pipe Works offers reliable plumbers in Goizha, Sulaymaniyah."
  },
  {
    "id": 7,
    "name": "Bakhtiar Plumbing Services",
    "category": "plumbing",
    "owner": "Nazdar Jaza",
    "phone": "0770 646 5010",
    "whatsapp": "0770 646 5010",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 101,
    "verified": true,
    "description": "Bakhtiar Plumbing Services offers reliable plumbers in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 8,
    "name": "Payam Plumbing Est.",
    "category": "plumbing",
    "owner": "Snur Barzinji",
    "phone": "0775 963 1916",
    "whatsapp": "0775 963 1916",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 12,
    "verified": false,
    "description": "Payam Plumbing Est. offers reliable plumbers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 9,
    "name": "Ranj Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Qadir",
    "phone": "0775 317 9179",
    "whatsapp": "0775 317 9179",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 168,
    "verified": false,
    "description": "Ranj Water & Pipe Works offers reliable plumbers in Raparin, Sulaymaniyah."
  },
  {
    "id": 10,
    "name": "Hawre Plumbing Services",
    "category": "plumbing",
    "owner": "Bnar Barzinji",
    "phone": "0773 864 8019",
    "whatsapp": "0773 864 8019",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 106,
    "verified": false,
    "description": "Hawre Plumbing Services offers reliable plumbers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 11,
    "name": "Shvan Power Solutions",
    "category": "electrical",
    "owner": "Rekan Karim",
    "phone": "0751 256 3621",
    "whatsapp": "0751 256 3621",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 112,
    "verified": false,
    "description": "Shvan Power Solutions offers reliable electricians in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 12,
    "name": "Ranj Electrical Services",
    "category": "electrical",
    "owner": "Shorsh Mahmud",
    "phone": "0773 666 1188",
    "whatsapp": "0773 666 1188",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 33,
    "verified": false,
    "description": "Ranj Electrical Services offers reliable electricians in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 13,
    "name": "Dilshad Electrical Services",
    "category": "electrical",
    "owner": "Shene Sofi",
    "phone": "0773 545 3591",
    "whatsapp": "0773 545 3591",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 71,
    "verified": false,
    "description": "Dilshad Electrical Services offers reliable electricians in Goizha, Sulaymaniyah."
  },
  {
    "id": 14,
    "name": "Shene Electric Works",
    "category": "electrical",
    "owner": "Twana Rasul",
    "phone": "0771 256 7126",
    "whatsapp": "0771 256 7126",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 142,
    "verified": false,
    "description": "Shene Electric Works offers reliable electricians in Ashty, Sulaymaniyah."
  },
  {
    "id": 15,
    "name": "Payam Power Solutions",
    "category": "electrical",
    "owner": "Payam Ahmad",
    "phone": "0775 600 1319",
    "whatsapp": "0775 600 1319",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 96,
    "verified": false,
    "description": "Payam Power Solutions offers reliable electricians in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 16,
    "name": "Newroz Electrical Services",
    "category": "electrical",
    "owner": "Bnar Hussein",
    "phone": "0751 187 8962",
    "whatsapp": "0751 187 8962",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 140,
    "verified": false,
    "description": "Newroz Electrical Services offers reliable electricians in Andazyari, Sulaymaniyah."
  },
  {
    "id": 17,
    "name": "Rekan Power Solutions",
    "category": "electrical",
    "owner": "Diyar Jaza",
    "phone": "0780 316 9835",
    "whatsapp": "0780 316 9835",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 180,
    "verified": true,
    "description": "Rekan Power Solutions offers reliable electricians in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 18,
    "name": "Peshraw Electrical Services",
    "category": "electrical",
    "owner": "Nazdar Rashid",
    "phone": "0781 223 5061",
    "whatsapp": "0781 223 5061",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 90,
    "verified": true,
    "description": "Peshraw Electrical Services offers reliable electricians in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 19,
    "name": "Dilshad Electric Works",
    "category": "electrical",
    "owner": "Awat Salih",
    "phone": "0751 824 1964",
    "whatsapp": "0751 824 1964",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 12,
    "verified": false,
    "description": "Dilshad Electric Works offers reliable electricians in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 20,
    "name": "Hemin Power Solutions",
    "category": "electrical",
    "owner": "Bnar Jaza",
    "phone": "0771 652 3167",
    "whatsapp": "0771 652 3167",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 150,
    "verified": false,
    "description": "Hemin Power Solutions offers reliable electricians in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 21,
    "name": "Bnar Wood Works",
    "category": "carpentry",
    "owner": "Beston Aziz",
    "phone": "0751 199 8062",
    "whatsapp": "0751 199 8062",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 109,
    "verified": false,
    "description": "Bnar Wood Works offers reliable carpenters in Zargata, Sulaymaniyah."
  },
  {
    "id": 22,
    "name": "Chnur Carpentry Workshop",
    "category": "carpentry",
    "owner": "Nazdar Rasul",
    "phone": "0780 845 6559",
    "whatsapp": "0780 845 6559",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 31,
    "verified": true,
    "description": "Chnur Carpentry Workshop offers reliable carpenters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 23,
    "name": "Karwan Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Sardar Faraj",
    "phone": "0770 385 8579",
    "whatsapp": "0770 385 8579",
    "address": "Iskan, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 23,
    "verified": false,
    "description": "Karwan Furniture & Carpentry offers reliable carpenters in Iskan, Sulaymaniyah."
  },
  {
    "id": 24,
    "name": "Goran Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Aram Hussein",
    "phone": "0750 195 4872",
    "whatsapp": "0750 195 4872",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 128,
    "verified": false,
    "description": "Goran Furniture & Carpentry offers reliable carpenters in Empire Area, Sulaymaniyah."
  },
  {
    "id": 25,
    "name": "Goran Wood Works",
    "category": "carpentry",
    "owner": "Handren Hussein",
    "phone": "0780 102 7396",
    "whatsapp": "0780 102 7396",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 120,
    "verified": true,
    "description": "Goran Wood Works offers reliable carpenters in Salim Street, Sulaymaniyah."
  },
  {
    "id": 26,
    "name": "Snur Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Beston Barzinji",
    "phone": "0770 294 5861",
    "whatsapp": "0770 294 5861",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 18,
    "verified": false,
    "description": "Snur Furniture & Carpentry offers reliable carpenters in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 27,
    "name": "Dilshad Carpentry Workshop",
    "category": "carpentry",
    "owner": "Chnur Sofi",
    "phone": "0750 698 8811",
    "whatsapp": "0750 698 8811",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 139,
    "verified": true,
    "description": "Dilshad Carpentry Workshop offers reliable carpenters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 28,
    "name": "Twana Carpentry Workshop",
    "category": "carpentry",
    "owner": "Goran Amin",
    "phone": "0751 791 4853",
    "whatsapp": "0751 791 4853",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 149,
    "verified": true,
    "description": "Twana Carpentry Workshop offers reliable carpenters in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 29,
    "name": "Shorsh Carpentry Workshop",
    "category": "carpentry",
    "owner": "Shorsh Karim",
    "phone": "0775 367 4346",
    "whatsapp": "0775 367 4346",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 84,
    "verified": true,
    "description": "Shorsh Carpentry Workshop offers reliable carpenters in Iskan, Sulaymaniyah."
  },
  {
    "id": 30,
    "name": "Ranj Carpentry Workshop",
    "category": "carpentry",
    "owner": "Nazdar Baban",
    "phone": "0775 869 2188",
    "whatsapp": "0775 869 2188",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 163,
    "verified": false,
    "description": "Ranj Carpentry Workshop offers reliable carpenters in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 31,
    "name": "Aram Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Dilshad Qadir",
    "phone": "0773 235 6718",
    "whatsapp": "0773 235 6718",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 66,
    "verified": false,
    "description": "Aram Engineering Consultancy offers reliable civil engineers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 32,
    "name": "Diyar Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Newroz Barzinji",
    "phone": "0750 783 5905",
    "whatsapp": "0750 783 5905",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 30,
    "verified": false,
    "description": "Diyar Civil Engineering Office offers reliable civil engineers in Ashty, Sulaymaniyah."
  },
  {
    "id": 33,
    "name": "Shvan Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Aram Rasul",
    "phone": "0770 378 5616",
    "whatsapp": "0770 378 5616",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 91,
    "verified": true,
    "description": "Shvan Civil Engineering Office offers reliable civil engineers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 34,
    "name": "Halgurd Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Twana Sultan",
    "phone": "0750 194 7939",
    "whatsapp": "0750 194 7939",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 15,
    "verified": true,
    "description": "Halgurd Civil Engineering Office offers reliable civil engineers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 35,
    "name": "Shene Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Halgurd Jaza",
    "phone": "0781 664 8007",
    "whatsapp": "0781 664 8007",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 32,
    "verified": true,
    "description": "Shene Engineering Consultancy offers reliable civil engineers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 36,
    "name": "Handren Structural Consultants",
    "category": "civil-eng",
    "owner": "Handren Faraj",
    "phone": "0750 954 7049",
    "whatsapp": "0750 954 7049",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 41,
    "verified": false,
    "description": "Handren Structural Consultants offers reliable civil engineers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 37,
    "name": "Rebaz Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Bakhtiar Hussein",
    "phone": "0771 798 5088",
    "whatsapp": "0771 798 5088",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 94,
    "verified": false,
    "description": "Rebaz Civil Engineering Office offers reliable civil engineers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 38,
    "name": "Handren Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Shorsh Faraj",
    "phone": "0770 919 3900",
    "whatsapp": "0770 919 3900",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 10,
    "verified": true,
    "description": "Handren Civil Engineering Office offers reliable civil engineers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 39,
    "name": "Payam Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Beston Aziz",
    "phone": "0773 263 2771",
    "whatsapp": "0773 263 2771",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 13,
    "verified": false,
    "description": "Payam Civil Engineering Office offers reliable civil engineers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 40,
    "name": "Bnar Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Newroz Mahmud",
    "phone": "0773 940 4728",
    "whatsapp": "0773 940 4728",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 172,
    "verified": true,
    "description": "Bnar Engineering Consultancy offers reliable civil engineers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 41,
    "name": "Sherko Design & Architecture Office",
    "category": "architecture",
    "owner": "Goran Karim",
    "phone": "0775 756 9346",
    "whatsapp": "0775 756 9346",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 141,
    "verified": true,
    "description": "Sherko Design & Architecture Office offers reliable architects in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 42,
    "name": "Kawa Architecture Studio",
    "category": "architecture",
    "owner": "Handren Jaza",
    "phone": "0773 139 2776",
    "whatsapp": "0773 139 2776",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 92,
    "verified": false,
    "description": "Kawa Architecture Studio offers reliable architects in Salim Street, Sulaymaniyah."
  },
  {
    "id": 43,
    "name": "Shorsh Architects",
    "category": "architecture",
    "owner": "Aram Hama",
    "phone": "0771 360 1727",
    "whatsapp": "0771 360 1727",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 4,
    "verified": false,
    "description": "Shorsh Architects offers reliable architects in Raparin, Sulaymaniyah."
  },
  {
    "id": 44,
    "name": "Beston Architects",
    "category": "architecture",
    "owner": "Nazdar Qadir",
    "phone": "0780 171 6409",
    "whatsapp": "0780 171 6409",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 173,
    "verified": false,
    "description": "Beston Architects offers reliable architects in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 45,
    "name": "Chnur Design & Architecture Office",
    "category": "architecture",
    "owner": "Twana Baban",
    "phone": "0775 512 5844",
    "whatsapp": "0775 512 5844",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 53,
    "verified": false,
    "description": "Chnur Design & Architecture Office offers reliable architects in Iskan, Sulaymaniyah."
  },
  {
    "id": 46,
    "name": "Ranj Architects",
    "category": "architecture",
    "owner": "Chnur Amin",
    "phone": "0773 515 9977",
    "whatsapp": "0773 515 9977",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 81,
    "verified": true,
    "description": "Ranj Architects offers reliable architects in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 47,
    "name": "Zana Architects",
    "category": "architecture",
    "owner": "Shorsh Sofi",
    "phone": "0781 552 4501",
    "whatsapp": "0781 552 4501",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 47,
    "verified": false,
    "description": "Zana Architects offers reliable architects in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 48,
    "name": "Peshraw Architects",
    "category": "architecture",
    "owner": "Nazdar Kakei",
    "phone": "0751 938 4848",
    "whatsapp": "0751 938 4848",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 61,
    "verified": false,
    "description": "Peshraw Architects offers reliable architects in Qirga, Sulaymaniyah."
  },
  {
    "id": 49,
    "name": "Shvan Architecture Studio",
    "category": "architecture",
    "owner": "Rebaz Salih",
    "phone": "0751 566 7790",
    "whatsapp": "0751 566 7790",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 151,
    "verified": true,
    "description": "Shvan Architecture Studio offers reliable architects in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 50,
    "name": "Snur Design & Architecture Office",
    "category": "architecture",
    "owner": "Rekan Hama",
    "phone": "0770 771 1090",
    "whatsapp": "0770 771 1090",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 31,
    "verified": false,
    "description": "Snur Design & Architecture Office offers reliable architects in Andazyari, Sulaymaniyah."
  },
  {
    "id": 51,
    "name": "Bnar Interior Design Studio",
    "category": "interior",
    "owner": "Beston Sheikhani",
    "phone": "0750 670 5082",
    "whatsapp": "0750 670 5082",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 35,
    "verified": false,
    "description": "Bnar Interior Design Studio offers reliable interior designers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 52,
    "name": "Beston Home Interiors",
    "category": "interior",
    "owner": "Nazdar Sheikhani",
    "phone": "0775 873 8251",
    "whatsapp": "0775 873 8251",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 133,
    "verified": false,
    "description": "Beston Home Interiors offers reliable interior designers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 53,
    "name": "Payam Design House",
    "category": "interior",
    "owner": "Sardar Amin",
    "phone": "0781 365 5050",
    "whatsapp": "0781 365 5050",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 74,
    "verified": false,
    "description": "Payam Design House offers reliable interior designers in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 54,
    "name": "Twana Home Interiors",
    "category": "interior",
    "owner": "Halgurd Salih",
    "phone": "0781 179 5681",
    "whatsapp": "0781 179 5681",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 89,
    "verified": true,
    "description": "Twana Home Interiors offers reliable interior designers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 55,
    "name": "Dilshad Interior Design Studio",
    "category": "interior",
    "owner": "Shvan Faraj",
    "phone": "0780 810 3503",
    "whatsapp": "0780 810 3503",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 20,
    "verified": false,
    "description": "Dilshad Interior Design Studio offers reliable interior designers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 56,
    "name": "Sherko Design House",
    "category": "interior",
    "owner": "Sardar Aziz",
    "phone": "0771 952 7883",
    "whatsapp": "0771 952 7883",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 153,
    "verified": false,
    "description": "Sherko Design House offers reliable interior designers in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 57,
    "name": "Kawa Design House",
    "category": "interior",
    "owner": "Ranj Sultan",
    "phone": "0775 405 7389",
    "whatsapp": "0775 405 7389",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 111,
    "verified": false,
    "description": "Kawa Design House offers reliable interior designers in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 58,
    "name": "Chnur Design House",
    "category": "interior",
    "owner": "Beston Kakei",
    "phone": "0781 324 5471",
    "whatsapp": "0781 324 5471",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 11,
    "verified": false,
    "description": "Chnur Design House offers reliable interior designers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 59,
    "name": "Nazdar Design House",
    "category": "interior",
    "owner": "Beston Hama",
    "phone": "0781 230 9751",
    "whatsapp": "0781 230 9751",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 104,
    "verified": false,
    "description": "Nazdar Design House offers reliable interior designers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 60,
    "name": "Nazdar Interior Design Studio",
    "category": "interior",
    "owner": "Hemin Aziz",
    "phone": "0781 286 1823",
    "whatsapp": "0781 286 1823",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 87,
    "verified": true,
    "description": "Nazdar Interior Design Studio offers reliable interior designers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 61,
    "name": "Sherko Decor & Paint",
    "category": "painting",
    "owner": "Shene Hama",
    "phone": "0780 358 2341",
    "whatsapp": "0780 358 2341",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 142,
    "verified": true,
    "description": "Sherko Decor & Paint offers reliable painters in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 62,
    "name": "Bakhtiar Painting Services",
    "category": "painting",
    "owner": "Halgurd Karim",
    "phone": "0750 353 4266",
    "whatsapp": "0750 353 4266",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 163,
    "verified": true,
    "description": "Bakhtiar Painting Services offers reliable painters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 63,
    "name": "Shvan Decor & Paint",
    "category": "painting",
    "owner": "Nazdar Rasul",
    "phone": "0771 576 5198",
    "whatsapp": "0771 576 5198",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 46,
    "verified": false,
    "description": "Shvan Decor & Paint offers reliable painters in Raparin, Sulaymaniyah."
  },
  {
    "id": 64,
    "name": "Chnur Painting Contractors",
    "category": "painting",
    "owner": "Aram Amin",
    "phone": "0751 692 1420",
    "whatsapp": "0751 692 1420",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 151,
    "verified": false,
    "description": "Chnur Painting Contractors offers reliable painters in Ashty, Sulaymaniyah."
  },
  {
    "id": 65,
    "name": "Ranj Decor & Paint",
    "category": "painting",
    "owner": "Snur Qadir",
    "phone": "0771 204 5941",
    "whatsapp": "0771 204 5941",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 157,
    "verified": false,
    "description": "Ranj Decor & Paint offers reliable painters in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 66,
    "name": "Beston Painting Contractors",
    "category": "painting",
    "owner": "Beston Hussein",
    "phone": "0780 777 7071",
    "whatsapp": "0780 777 7071",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 169,
    "verified": true,
    "description": "Beston Painting Contractors offers reliable painters in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 67,
    "name": "Goran Decor & Paint",
    "category": "painting",
    "owner": "Newroz Sultan",
    "phone": "0780 470 8532",
    "whatsapp": "0780 470 8532",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 115,
    "verified": true,
    "description": "Goran Decor & Paint offers reliable painters in Goizha, Sulaymaniyah."
  },
  {
    "id": 68,
    "name": "Twana Painting Contractors",
    "category": "painting",
    "owner": "Hawre Kakei",
    "phone": "0781 576 8136",
    "whatsapp": "0781 576 8136",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 155,
    "verified": true,
    "description": "Twana Painting Contractors offers reliable painters in Empire Area, Sulaymaniyah."
  },
  {
    "id": 69,
    "name": "Goran Painting Services",
    "category": "painting",
    "owner": "Newroz Karim",
    "phone": "0781 349 8613",
    "whatsapp": "0781 349 8613",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 175,
    "verified": false,
    "description": "Goran Painting Services offers reliable painters in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 70,
    "name": "Kawa Decor & Paint",
    "category": "painting",
    "owner": "Goran Sofi",
    "phone": "0781 317 6813",
    "whatsapp": "0781 317 6813",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 91,
    "verified": true,
    "description": "Kawa Decor & Paint offers reliable painters in Salim Street, Sulaymaniyah."
  },
  {
    "id": 71,
    "name": "Shorsh Climate Systems",
    "category": "hvac",
    "owner": "Handren Jaza",
    "phone": "0750 629 4130",
    "whatsapp": "0750 629 4130",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 108,
    "verified": false,
    "description": "Shorsh Climate Systems offers reliable ac & refrigeration in Empire Area, Sulaymaniyah."
  },
  {
    "id": 72,
    "name": "Shene AC & Cooling Services",
    "category": "hvac",
    "owner": "Snur Sultan",
    "phone": "0781 911 1282",
    "whatsapp": "0781 911 1282",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 60,
    "verified": false,
    "description": "Shene AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 73,
    "name": "Bnar Refrigeration Technicians",
    "category": "hvac",
    "owner": "Nazdar Zangana",
    "phone": "0781 666 9698",
    "whatsapp": "0781 666 9698",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 144,
    "verified": true,
    "description": "Bnar Refrigeration Technicians offers reliable ac & refrigeration in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 74,
    "name": "Snur Refrigeration Technicians",
    "category": "hvac",
    "owner": "Hawre Baban",
    "phone": "0771 223 4155",
    "whatsapp": "0771 223 4155",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 141,
    "verified": false,
    "description": "Snur Refrigeration Technicians offers reliable ac & refrigeration in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 75,
    "name": "Snur AC & Cooling Services",
    "category": "hvac",
    "owner": "Karwan Qadir",
    "phone": "0773 841 9595",
    "whatsapp": "0773 841 9595",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 29,
    "verified": false,
    "description": "Snur AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 76,
    "name": "Peshraw AC & Cooling Services",
    "category": "hvac",
    "owner": "Bakhtiar Amin",
    "phone": "0750 825 9751",
    "whatsapp": "0750 825 9751",
    "address": "Ashty, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 15,
    "verified": false,
    "description": "Peshraw AC & Cooling Services offers reliable ac & refrigeration in Ashty, Sulaymaniyah."
  },
  {
    "id": 77,
    "name": "Dilshad Refrigeration Technicians",
    "category": "hvac",
    "owner": "Snur Faraj",
    "phone": "0751 993 1200",
    "whatsapp": "0751 993 1200",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 124,
    "verified": false,
    "description": "Dilshad Refrigeration Technicians offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 78,
    "name": "Sherko AC & Cooling Services",
    "category": "hvac",
    "owner": "Rebaz Jaza",
    "phone": "0751 941 2070",
    "whatsapp": "0751 941 2070",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 22,
    "verified": false,
    "description": "Sherko AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 79,
    "name": "Nazdar AC & Cooling Services",
    "category": "hvac",
    "owner": "Shvan Faraj",
    "phone": "0773 187 5066",
    "whatsapp": "0773 187 5066",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 110,
    "verified": false,
    "description": "Nazdar AC & Cooling Services offers reliable ac & refrigeration in Raparin, Sulaymaniyah."
  },
  {
    "id": 80,
    "name": "Beston Climate Systems",
    "category": "hvac",
    "owner": "Bnar Sheikhani",
    "phone": "0781 553 5871",
    "whatsapp": "0781 553 5871",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 113,
    "verified": true,
    "description": "Beston Climate Systems offers reliable ac & refrigeration in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 81,
    "name": "Shorsh Cleaning Services",
    "category": "cleaning",
    "owner": "Shorsh Rasul",
    "phone": "0771 370 2330",
    "whatsapp": "0771 370 2330",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 48,
    "verified": false,
    "description": "Shorsh Cleaning Services offers reliable home cleaning in Zargata, Sulaymaniyah."
  },
  {
    "id": 82,
    "name": "Diyar Cleaning Services",
    "category": "cleaning",
    "owner": "Zana Mahmud",
    "phone": "0781 398 1534",
    "whatsapp": "0781 398 1534",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 76,
    "verified": false,
    "description": "Diyar Cleaning Services offers reliable home cleaning in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 83,
    "name": "Sardar Cleaning Services",
    "category": "cleaning",
    "owner": "Nazdar Salih",
    "phone": "0771 535 2880",
    "whatsapp": "0771 535 2880",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 169,
    "verified": true,
    "description": "Sardar Cleaning Services offers reliable home cleaning in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 84,
    "name": "Hawre Cleaning Services",
    "category": "cleaning",
    "owner": "Hemin Hussein",
    "phone": "0773 709 5728",
    "whatsapp": "0773 709 5728",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 123,
    "verified": false,
    "description": "Hawre Cleaning Services offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 85,
    "name": "Snur Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Hawre Sheikhani",
    "phone": "0781 548 2317",
    "whatsapp": "0781 548 2317",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 114,
    "verified": false,
    "description": "Snur Home Cleaning Co. offers reliable home cleaning in Empire Area, Sulaymaniyah."
  },
  {
    "id": 86,
    "name": "Shorsh Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Kawa Karim",
    "phone": "0750 883 5415",
    "whatsapp": "0750 883 5415",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 48,
    "verified": false,
    "description": "Shorsh Home Cleaning Co. offers reliable home cleaning in Andazyari, Sulaymaniyah."
  },
  {
    "id": 87,
    "name": "Halgurd Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Payam Jaza",
    "phone": "0780 750 9056",
    "whatsapp": "0780 750 9056",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 124,
    "verified": true,
    "description": "Halgurd Home Cleaning Co. offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 88,
    "name": "Sherko Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Nazdar Rasul",
    "phone": "0775 521 9117",
    "whatsapp": "0775 521 9117",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 106,
    "verified": false,
    "description": "Sherko Home Cleaning Co. offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 89,
    "name": "Dilshad Cleaning Services",
    "category": "cleaning",
    "owner": "Sardar Karim",
    "phone": "0773 431 2899",
    "whatsapp": "0773 431 2899",
    "address": "Qirga, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 107,
    "verified": false,
    "description": "Dilshad Cleaning Services offers reliable home cleaning in Qirga, Sulaymaniyah."
  },
  {
    "id": 90,
    "name": "Newroz Cleaning Services",
    "category": "cleaning",
    "owner": "Nazdar Barzinji",
    "phone": "0780 155 4073",
    "whatsapp": "0780 155 4073",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 163,
    "verified": false,
    "description": "Newroz Cleaning Services offers reliable home cleaning in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 91,
    "name": "Halgurd Moving Services",
    "category": "moving",
    "owner": "Shene Hussein",
    "phone": "0773 662 3146",
    "whatsapp": "0773 662 3146",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 116,
    "verified": false,
    "description": "Halgurd Moving Services offers reliable movers & packers in Zargata, Sulaymaniyah."
  },
  {
    "id": 92,
    "name": "Rekan Movers & Packers",
    "category": "moving",
    "owner": "Kawa Kakei",
    "phone": "0770 418 1224",
    "whatsapp": "0770 418 1224",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 27,
    "verified": true,
    "description": "Rekan Movers & Packers offers reliable movers & packers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 93,
    "name": "Newroz Movers & Packers",
    "category": "moving",
    "owner": "Sardar Rasul",
    "phone": "0781 833 5781",
    "whatsapp": "0781 833 5781",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 73,
    "verified": false,
    "description": "Newroz Movers & Packers offers reliable movers & packers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 94,
    "name": "Rekan Moving Services",
    "category": "moving",
    "owner": "Bnar Mahmud",
    "phone": "0770 492 4122",
    "whatsapp": "0770 492 4122",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 134,
    "verified": false,
    "description": "Rekan Moving Services offers reliable movers & packers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 95,
    "name": "Shvan Movers & Packers",
    "category": "moving",
    "owner": "Hawre Aziz",
    "phone": "0773 940 1042",
    "whatsapp": "0773 940 1042",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": false,
    "description": "Shvan Movers & Packers offers reliable movers & packers in Qirga, Sulaymaniyah."
  },
  {
    "id": 96,
    "name": "Awat Cargo & Relocation",
    "category": "moving",
    "owner": "Rekan Faraj",
    "phone": "0781 453 6446",
    "whatsapp": "0781 453 6446",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 143,
    "verified": false,
    "description": "Awat Cargo & Relocation offers reliable movers & packers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 97,
    "name": "Payam Moving Services",
    "category": "moving",
    "owner": "Goran Qadir",
    "phone": "0780 339 7730",
    "whatsapp": "0780 339 7730",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 125,
    "verified": false,
    "description": "Payam Moving Services offers reliable movers & packers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 98,
    "name": "Beston Moving Services",
    "category": "moving",
    "owner": "Ranj Faraj",
    "phone": "0750 229 9229",
    "whatsapp": "0750 229 9229",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 88,
    "verified": false,
    "description": "Beston Moving Services offers reliable movers & packers in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 99,
    "name": "Goran Moving Services",
    "category": "moving",
    "owner": "Aram Sheikhani",
    "phone": "0750 839 3361",
    "whatsapp": "0750 839 3361",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 171,
    "verified": false,
    "description": "Goran Moving Services offers reliable movers & packers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 100,
    "name": "Hemin Moving Services",
    "category": "moving",
    "owner": "Beston Jaza",
    "phone": "0780 765 2315",
    "whatsapp": "0780 765 2315",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 176,
    "verified": false,
    "description": "Hemin Moving Services offers reliable movers & packers in Qirga, Sulaymaniyah."
  },
  {
    "id": 101,
    "name": "Ranj Car Service Center",
    "category": "mechanics",
    "owner": "Halgurd Sultan",
    "phone": "0750 732 2121",
    "whatsapp": "0750 732 2121",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 179,
    "verified": false,
    "description": "Ranj Car Service Center offers reliable car mechanics in Empire Area, Sulaymaniyah."
  },
  {
    "id": 102,
    "name": "Bnar Mechanics Workshop",
    "category": "mechanics",
    "owner": "Hemin Aziz",
    "phone": "0751 554 3725",
    "whatsapp": "0751 554 3725",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 11,
    "verified": true,
    "description": "Bnar Mechanics Workshop offers reliable car mechanics in Goizha, Sulaymaniyah."
  },
  {
    "id": 103,
    "name": "Beston Auto Repair Garage",
    "category": "mechanics",
    "owner": "Peshraw Rashid",
    "phone": "0780 249 5000",
    "whatsapp": "0780 249 5000",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 148,
    "verified": false,
    "description": "Beston Auto Repair Garage offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 104,
    "name": "Diyar Auto Repair Garage",
    "category": "mechanics",
    "owner": "Diyar Karim",
    "phone": "0780 734 4945",
    "whatsapp": "0780 734 4945",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 153,
    "verified": true,
    "description": "Diyar Auto Repair Garage offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 105,
    "name": "Sardar Mechanics Workshop",
    "category": "mechanics",
    "owner": "Hawre Mahmud",
    "phone": "0750 923 8622",
    "whatsapp": "0750 923 8622",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 177,
    "verified": false,
    "description": "Sardar Mechanics Workshop offers reliable car mechanics in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 106,
    "name": "Hemin Car Service Center",
    "category": "mechanics",
    "owner": "Bakhtiar Zangana",
    "phone": "0780 806 5097",
    "whatsapp": "0780 806 5097",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 81,
    "verified": true,
    "description": "Hemin Car Service Center offers reliable car mechanics in Ashty, Sulaymaniyah."
  },
  {
    "id": 107,
    "name": "Aram Auto Repair Garage",
    "category": "mechanics",
    "owner": "Ranj Zangana",
    "phone": "0773 816 5837",
    "whatsapp": "0773 816 5837",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 172,
    "verified": false,
    "description": "Aram Auto Repair Garage offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 108,
    "name": "Kawa Mechanics Workshop",
    "category": "mechanics",
    "owner": "Goran Hussein",
    "phone": "0781 952 5689",
    "whatsapp": "0781 952 5689",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 62,
    "verified": false,
    "description": "Kawa Mechanics Workshop offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 109,
    "name": "Bakhtiar Auto Repair Garage",
    "category": "mechanics",
    "owner": "Halgurd Qadir",
    "phone": "0773 794 3240",
    "whatsapp": "0773 794 3240",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 164,
    "verified": false,
    "description": "Bakhtiar Auto Repair Garage offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 110,
    "name": "Peshraw Car Service Center",
    "category": "mechanics",
    "owner": "Rebaz Zangana",
    "phone": "0770 192 5835",
    "whatsapp": "0770 192 5835",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 110,
    "verified": true,
    "description": "Peshraw Car Service Center offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 111,
    "name": "Shvan Shine Car Care",
    "category": "carwash",
    "owner": "Handren Rashid",
    "phone": "0773 950 3695",
    "whatsapp": "0773 950 3695",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 127,
    "verified": false,
    "description": "Shvan Shine Car Care offers reliable car wash & detailing in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 112,
    "name": "Peshraw Shine Car Care",
    "category": "carwash",
    "owner": "Goran Sofi",
    "phone": "0781 177 3306",
    "whatsapp": "0781 177 3306",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 61,
    "verified": false,
    "description": "Peshraw Shine Car Care offers reliable car wash & detailing in Goizha, Sulaymaniyah."
  },
  {
    "id": 113,
    "name": "Chnur Shine Car Care",
    "category": "carwash",
    "owner": "Ranj Barzinji",
    "phone": "0751 909 7464",
    "whatsapp": "0751 909 7464",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 141,
    "verified": true,
    "description": "Chnur Shine Car Care offers reliable car wash & detailing in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 114,
    "name": "Bakhtiar Shine Car Care",
    "category": "carwash",
    "owner": "Chnur Jaza",
    "phone": "0780 942 7086",
    "whatsapp": "0780 942 7086",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 63,
    "verified": false,
    "description": "Bakhtiar Shine Car Care offers reliable car wash & detailing in Raparin, Sulaymaniyah."
  },
  {
    "id": 115,
    "name": "Shorsh Shine Car Care",
    "category": "carwash",
    "owner": "Sherko Kakei",
    "phone": "0751 750 8606",
    "whatsapp": "0751 750 8606",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 81,
    "verified": false,
    "description": "Shorsh Shine Car Care offers reliable car wash & detailing in Andazyari, Sulaymaniyah."
  },
  {
    "id": 116,
    "name": "Aram Car Wash & Detailing",
    "category": "carwash",
    "owner": "Rebaz Hussein",
    "phone": "0781 218 2592",
    "whatsapp": "0781 218 2592",
    "address": "Ashty, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 141,
    "verified": true,
    "description": "Aram Car Wash & Detailing offers reliable car wash & detailing in Ashty, Sulaymaniyah."
  },
  {
    "id": 117,
    "name": "Sardar Auto Spa",
    "category": "carwash",
    "owner": "Nazdar Barzinji",
    "phone": "0770 524 2622",
    "whatsapp": "0770 524 2622",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 161,
    "verified": false,
    "description": "Sardar Auto Spa offers reliable car wash & detailing in Iskan, Sulaymaniyah."
  },
  {
    "id": 118,
    "name": "Hawre Car Wash & Detailing",
    "category": "carwash",
    "owner": "Snur Rashid",
    "phone": "0781 555 4868",
    "whatsapp": "0781 555 4868",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 29,
    "verified": false,
    "description": "Hawre Car Wash & Detailing offers reliable car wash & detailing in Zargata, Sulaymaniyah."
  },
  {
    "id": 119,
    "name": "Handren Shine Car Care",
    "category": "carwash",
    "owner": "Bakhtiar Hussein",
    "phone": "0773 294 3001",
    "whatsapp": "0773 294 3001",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 120,
    "verified": true,
    "description": "Handren Shine Car Care offers reliable car wash & detailing in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 120,
    "name": "Karwan Shine Car Care",
    "category": "carwash",
    "owner": "Halgurd Kakei",
    "phone": "0750 905 6464",
    "whatsapp": "0750 905 6464",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 36,
    "verified": false,
    "description": "Karwan Shine Car Care offers reliable car wash & detailing in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 121,
    "name": "Karwan Photography Studio",
    "category": "photography",
    "owner": "Newroz Barzinji",
    "phone": "0771 932 4817",
    "whatsapp": "0771 932 4817",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 41,
    "verified": false,
    "description": "Karwan Photography Studio offers reliable photographers in Zargata, Sulaymaniyah."
  },
  {
    "id": 122,
    "name": "Shorsh Photography Studio",
    "category": "photography",
    "owner": "Hawre Faraj",
    "phone": "0773 917 3858",
    "whatsapp": "0773 917 3858",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 10,
    "verified": true,
    "description": "Shorsh Photography Studio offers reliable photographers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 123,
    "name": "Bakhtiar Photography Studio",
    "category": "photography",
    "owner": "Awat Sofi",
    "phone": "0770 371 1858",
    "whatsapp": "0770 371 1858",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 111,
    "verified": false,
    "description": "Bakhtiar Photography Studio offers reliable photographers in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 124,
    "name": "Chnur Photography Studio",
    "category": "photography",
    "owner": "Rekan Mahmud",
    "phone": "0751 562 9254",
    "whatsapp": "0751 562 9254",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 161,
    "verified": true,
    "description": "Chnur Photography Studio offers reliable photographers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 125,
    "name": "Beston Studio",
    "category": "photography",
    "owner": "Twana Baban",
    "phone": "0750 162 8847",
    "whatsapp": "0750 162 8847",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 113,
    "verified": false,
    "description": "Beston Studio offers reliable photographers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 126,
    "name": "Rekan Studio",
    "category": "photography",
    "owner": "Payam Mahmud",
    "phone": "0751 429 3430",
    "whatsapp": "0751 429 3430",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 74,
    "verified": false,
    "description": "Rekan Studio offers reliable photographers in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 127,
    "name": "Awat Studio",
    "category": "photography",
    "owner": "Snur Sofi",
    "phone": "0773 564 9282",
    "whatsapp": "0773 564 9282",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 29,
    "verified": false,
    "description": "Awat Studio offers reliable photographers in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 128,
    "name": "Aram Studio",
    "category": "photography",
    "owner": "Halgurd Barzinji",
    "phone": "0780 562 4743",
    "whatsapp": "0780 562 4743",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 120,
    "verified": false,
    "description": "Aram Studio offers reliable photographers in Zargata, Sulaymaniyah."
  },
  {
    "id": 129,
    "name": "Sherko Photo & Video",
    "category": "photography",
    "owner": "Sherko Jaza",
    "phone": "0770 803 8770",
    "whatsapp": "0770 803 8770",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 25,
    "verified": true,
    "description": "Sherko Photo & Video offers reliable photographers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 130,
    "name": "Chnur Photo & Video",
    "category": "photography",
    "owner": "Beston Faraj",
    "phone": "0750 700 6400",
    "whatsapp": "0750 700 6400",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 109,
    "verified": false,
    "description": "Chnur Photo & Video offers reliable photographers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 131,
    "name": "Nazdar Fashion Atelier",
    "category": "tailoring",
    "owner": "Goran Hussein",
    "phone": "0773 460 2697",
    "whatsapp": "0773 460 2697",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 58,
    "verified": true,
    "description": "Nazdar Fashion Atelier offers reliable tailors & fashion in Ashty, Sulaymaniyah."
  },
  {
    "id": 132,
    "name": "Rekan Tailoring House",
    "category": "tailoring",
    "owner": "Goran Rasul",
    "phone": "0775 217 5564",
    "whatsapp": "0775 217 5564",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 113,
    "verified": false,
    "description": "Rekan Tailoring House offers reliable tailors & fashion in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 133,
    "name": "Shene Custom Tailors",
    "category": "tailoring",
    "owner": "Shorsh Barzinji",
    "phone": "0773 129 3955",
    "whatsapp": "0773 129 3955",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 83,
    "verified": false,
    "description": "Shene Custom Tailors offers reliable tailors & fashion in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 134,
    "name": "Bakhtiar Tailoring House",
    "category": "tailoring",
    "owner": "Diyar Faraj",
    "phone": "0780 171 3324",
    "whatsapp": "0780 171 3324",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 11,
    "verified": true,
    "description": "Bakhtiar Tailoring House offers reliable tailors & fashion in Raparin, Sulaymaniyah."
  },
  {
    "id": 135,
    "name": "Twana Tailoring House",
    "category": "tailoring",
    "owner": "Ranj Aziz",
    "phone": "0775 261 7062",
    "whatsapp": "0775 261 7062",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 87,
    "verified": false,
    "description": "Twana Tailoring House offers reliable tailors & fashion in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 136,
    "name": "Awat Custom Tailors",
    "category": "tailoring",
    "owner": "Hemin Hussein",
    "phone": "0770 872 1815",
    "whatsapp": "0770 872 1815",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 73,
    "verified": false,
    "description": "Awat Custom Tailors offers reliable tailors & fashion in Rapareen, Sulaymaniyah."
  },
  {
    "id": 137,
    "name": "Zana Fashion Atelier",
    "category": "tailoring",
    "owner": "Shorsh Mahmud",
    "phone": "0773 320 9394",
    "whatsapp": "0773 320 9394",
    "address": "Iskan, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 114,
    "verified": true,
    "description": "Zana Fashion Atelier offers reliable tailors & fashion in Iskan, Sulaymaniyah."
  },
  {
    "id": 138,
    "name": "Nazdar Custom Tailors",
    "category": "tailoring",
    "owner": "Awat Sultan",
    "phone": "0773 146 4612",
    "whatsapp": "0773 146 4612",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 157,
    "verified": true,
    "description": "Nazdar Custom Tailors offers reliable tailors & fashion in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 139,
    "name": "Karwan Fashion Atelier",
    "category": "tailoring",
    "owner": "Karwan Faraj",
    "phone": "0773 435 2965",
    "whatsapp": "0773 435 2965",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 114,
    "verified": true,
    "description": "Karwan Fashion Atelier offers reliable tailors & fashion in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 140,
    "name": "Ranj Custom Tailors",
    "category": "tailoring",
    "owner": "Snur Salih",
    "phone": "0775 173 7505",
    "whatsapp": "0775 173 7505",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 14,
    "verified": false,
    "description": "Ranj Custom Tailors offers reliable tailors & fashion in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 141,
    "name": "Sardar Bakery & Pastry",
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0780 687 7626",
    "whatsapp": "0780 687 7626",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 110,
    "verified": true,
    "description": "Sardar Bakery & Pastry offers reliable bakeries & pastry in Raparin, Sulaymaniyah."
  },
  {
    "id": 142,
    "name": "Ranj Bakery & Pastry",
    "category": "bakery",
    "owner": "Sherko Amin",
    "phone": "0781 951 6928",
    "whatsapp": "0781 951 6928",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 31,
    "verified": true,
    "description": "Ranj Bakery & Pastry offers reliable bakeries & pastry in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 143,
    "name": "Awat Sweets & Bakery",
    "category": "bakery",
    "owner": "Twana Karim",
    "phone": "0773 863 6562",
    "whatsapp": "0773 863 6562",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 47,
    "verified": true,
    "description": "Awat Sweets & Bakery offers reliable bakeries & pastry in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 144,
    "name": "Halgurd Bakery & Pastry",
    "category": "bakery",
    "owner": "Twana Sheikhani",
    "phone": "0775 459 3419",
    "whatsapp": "0775 459 3419",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 41,
    "verified": true,
    "description": "Halgurd Bakery & Pastry offers reliable bakeries & pastry in Zargata, Sulaymaniyah."
  },
  {
    "id": 145,
    "name": "Diyar Pastry Shop",
    "category": "bakery",
    "owner": "Shvan Karim",
    "phone": "0781 575 8354",
    "whatsapp": "0781 575 8354",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 148,
    "verified": false,
    "description": "Diyar Pastry Shop offers reliable bakeries & pastry in Salim Street, Sulaymaniyah."
  },
  {
    "id": 146,
    "name": "Shorsh Sweets & Bakery",
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0781 169 8682",
    "whatsapp": "0781 169 8682",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 81,
    "verified": false,
    "description": "Shorsh Sweets & Bakery offers reliable bakeries & pastry in Rapareen, Sulaymaniyah."
  },
  {
    "id": 147,
    "name": "Awat Bakery & Pastry",
    "category": "bakery",
    "owner": "Bakhtiar Sheikhani",
    "phone": "0773 572 8404",
    "whatsapp": "0773 572 8404",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 98,
    "verified": false,
    "description": "Awat Bakery & Pastry offers reliable bakeries & pastry in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 148,
    "name": "Hemin Pastry Shop",
    "category": "bakery",
    "owner": "Goran Karim",
    "phone": "0780 573 1672",
    "whatsapp": "0780 573 1672",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 150,
    "verified": false,
    "description": "Hemin Pastry Shop offers reliable bakeries & pastry in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 149,
    "name": "Sherko Pastry Shop",
    "category": "bakery",
    "owner": "Rekan Sheikhani",
    "phone": "0750 561 2695",
    "whatsapp": "0750 561 2695",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 91,
    "verified": false,
    "description": "Sherko Pastry Shop offers reliable bakeries & pastry in Rapareen, Sulaymaniyah."
  },
  {
    "id": 150,
    "name": "Rebaz Bakery & Pastry",
    "category": "bakery",
    "owner": "Snur Mahmud",
    "phone": "0770 472 7108",
    "whatsapp": "0770 472 7108",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 103,
    "verified": false,
    "description": "Rebaz Bakery & Pastry offers reliable bakeries & pastry in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 151,
    "name": "Sherko Kitchen & Events",
    "category": "catering",
    "owner": "Shorsh Hussein",
    "phone": "0751 437 2548",
    "whatsapp": "0751 437 2548",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 102,
    "verified": true,
    "description": "Sherko Kitchen & Events offers reliable restaurants & catering in Qirga, Sulaymaniyah."
  },
  {
    "id": 152,
    "name": "Chnur Kitchen & Events",
    "category": "catering",
    "owner": "Payam Kakei",
    "phone": "0775 183 3317",
    "whatsapp": "0775 183 3317",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 83,
    "verified": false,
    "description": "Chnur Kitchen & Events offers reliable restaurants & catering in Rapareen, Sulaymaniyah."
  },
  {
    "id": 153,
    "name": "Snur Kitchen & Events",
    "category": "catering",
    "owner": "Ranj Faraj",
    "phone": "0751 417 7171",
    "whatsapp": "0751 417 7171",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 88,
    "verified": false,
    "description": "Snur Kitchen & Events offers reliable restaurants & catering in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 154,
    "name": "Nazdar Kitchen & Events",
    "category": "catering",
    "owner": "Newroz Sheikhani",
    "phone": "0780 620 6928",
    "whatsapp": "0780 620 6928",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 83,
    "verified": true,
    "description": "Nazdar Kitchen & Events offers reliable restaurants & catering in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 155,
    "name": "Karwan Catering Services",
    "category": "catering",
    "owner": "Shene Sultan",
    "phone": "0771 240 3538",
    "whatsapp": "0771 240 3538",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 29,
    "verified": false,
    "description": "Karwan Catering Services offers reliable restaurants & catering in Zargata, Sulaymaniyah."
  },
  {
    "id": 156,
    "name": "Dilshad Kitchen & Events",
    "category": "catering",
    "owner": "Handren Sheikhani",
    "phone": "0775 997 3147",
    "whatsapp": "0775 997 3147",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 43,
    "verified": true,
    "description": "Dilshad Kitchen & Events offers reliable restaurants & catering in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 157,
    "name": "Newroz Kitchen & Events",
    "category": "catering",
    "owner": "Shene Kakei",
    "phone": "0781 144 7731",
    "whatsapp": "0781 144 7731",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 64,
    "verified": false,
    "description": "Newroz Kitchen & Events offers reliable restaurants & catering in Salim Street, Sulaymaniyah."
  },
  {
    "id": 158,
    "name": "Shorsh Catering Services",
    "category": "catering",
    "owner": "Shene Mahmud",
    "phone": "0771 416 8684",
    "whatsapp": "0771 416 8684",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 53,
    "verified": false,
    "description": "Shorsh Catering Services offers reliable restaurants & catering in Andazyari, Sulaymaniyah."
  },
  {
    "id": 159,
    "name": "Awat Catering Services",
    "category": "catering",
    "owner": "Sardar Baban",
    "phone": "0780 265 4271",
    "whatsapp": "0780 265 4271",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 39,
    "verified": false,
    "description": "Awat Catering Services offers reliable restaurants & catering in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 160,
    "name": "Rebaz Kitchen & Events",
    "category": "catering",
    "owner": "Rekan Rashid",
    "phone": "0751 828 9452",
    "whatsapp": "0751 828 9452",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 76,
    "verified": true,
    "description": "Rebaz Kitchen & Events offers reliable restaurants & catering in Empire Area, Sulaymaniyah."
  },
  {
    "id": 161,
    "name": "Diyar Beauty Center",
    "category": "beauty",
    "owner": "Sardar Sheikhani",
    "phone": "0780 193 4637",
    "whatsapp": "0780 193 4637",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 93,
    "verified": false,
    "description": "Diyar Beauty Center offers reliable beauty salons in Rapareen, Sulaymaniyah."
  },
  {
    "id": 162,
    "name": "Zana Beauty Salon",
    "category": "beauty",
    "owner": "Ranj Sheikhani",
    "phone": "0771 495 2337",
    "whatsapp": "0771 495 2337",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 11,
    "verified": true,
    "description": "Zana Beauty Salon offers reliable beauty salons in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 163,
    "name": "Aram Ladies Salon",
    "category": "beauty",
    "owner": "Halgurd Sofi",
    "phone": "0770 139 5700",
    "whatsapp": "0770 139 5700",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 124,
    "verified": false,
    "description": "Aram Ladies Salon offers reliable beauty salons in Rapareen, Sulaymaniyah."
  },
  {
    "id": 164,
    "name": "Shvan Ladies Salon",
    "category": "beauty",
    "owner": "Rekan Mahmud",
    "phone": "0750 181 1311",
    "whatsapp": "0750 181 1311",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 42,
    "verified": false,
    "description": "Shvan Ladies Salon offers reliable beauty salons in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 165,
    "name": "Chnur Ladies Salon",
    "category": "beauty",
    "owner": "Twana Aziz",
    "phone": "0773 343 5934",
    "whatsapp": "0773 343 5934",
    "address": "Goizha, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 65,
    "verified": false,
    "description": "Chnur Ladies Salon offers reliable beauty salons in Goizha, Sulaymaniyah."
  },
  {
    "id": 166,
    "name": "Beston Ladies Salon",
    "category": "beauty",
    "owner": "Sardar Karim",
    "phone": "0781 711 9782",
    "whatsapp": "0781 711 9782",
    "address": "Goizha, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 135,
    "verified": false,
    "description": "Beston Ladies Salon offers reliable beauty salons in Goizha, Sulaymaniyah."
  },
  {
    "id": 167,
    "name": "Snur Beauty Salon",
    "category": "beauty",
    "owner": "Peshraw Aziz",
    "phone": "0775 346 7825",
    "whatsapp": "0775 346 7825",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 175,
    "verified": true,
    "description": "Snur Beauty Salon offers reliable beauty salons in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 168,
    "name": "Bakhtiar Beauty Salon",
    "category": "beauty",
    "owner": "Twana Barzinji",
    "phone": "0750 499 8702",
    "whatsapp": "0750 499 8702",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 103,
    "verified": false,
    "description": "Bakhtiar Beauty Salon offers reliable beauty salons in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 169,
    "name": "Hawre Ladies Salon",
    "category": "beauty",
    "owner": "Kawa Rashid",
    "phone": "0775 346 2698",
    "whatsapp": "0775 346 2698",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 89,
    "verified": true,
    "description": "Hawre Ladies Salon offers reliable beauty salons in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 170,
    "name": "Bakhtiar Ladies Salon",
    "category": "beauty",
    "owner": "Sherko Amin",
    "phone": "0781 746 3986",
    "whatsapp": "0781 746 3986",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 20,
    "verified": false,
    "description": "Bakhtiar Ladies Salon offers reliable beauty salons in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 171,
    "name": "Sardar Barbershop",
    "category": "barber",
    "owner": "Peshraw Qadir",
    "phone": "0771 142 6170",
    "whatsapp": "0771 142 6170",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 135,
    "verified": false,
    "description": "Sardar Barbershop offers reliable barbershops in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 172,
    "name": "Newroz Gents Barber",
    "category": "barber",
    "owner": "Rekan Jaza",
    "phone": "0771 392 6848",
    "whatsapp": "0771 392 6848",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 16,
    "verified": false,
    "description": "Newroz Gents Barber offers reliable barbershops in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 173,
    "name": "Sherko Men's Salon",
    "category": "barber",
    "owner": "Aram Rashid",
    "phone": "0780 861 8204",
    "whatsapp": "0780 861 8204",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 102,
    "verified": true,
    "description": "Sherko Men's Salon offers reliable barbershops in Iskan, Sulaymaniyah."
  },
  {
    "id": 174,
    "name": "Diyar Men's Salon",
    "category": "barber",
    "owner": "Snur Sultan",
    "phone": "0773 920 2353",
    "whatsapp": "0773 920 2353",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 24,
    "verified": false,
    "description": "Diyar Men's Salon offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 175,
    "name": "Newroz Barbershop",
    "category": "barber",
    "owner": "Dilshad Baban",
    "phone": "0751 181 6372",
    "whatsapp": "0751 181 6372",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 82,
    "verified": false,
    "description": "Newroz Barbershop offers reliable barbershops in Qirga, Sulaymaniyah."
  },
  {
    "id": 176,
    "name": "Snur Men's Salon",
    "category": "barber",
    "owner": "Diyar Mahmud",
    "phone": "0781 143 6776",
    "whatsapp": "0781 143 6776",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 115,
    "verified": true,
    "description": "Snur Men's Salon offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 177,
    "name": "Beston Barbershop",
    "category": "barber",
    "owner": "Hemin Hama",
    "phone": "0770 131 3339",
    "whatsapp": "0770 131 3339",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 177,
    "verified": false,
    "description": "Beston Barbershop offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 178,
    "name": "Rebaz Barbershop",
    "category": "barber",
    "owner": "Hemin Salih",
    "phone": "0775 492 1530",
    "whatsapp": "0775 492 1530",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 177,
    "verified": false,
    "description": "Rebaz Barbershop offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 179,
    "name": "Bakhtiar Men's Salon",
    "category": "barber",
    "owner": "Sardar Karim",
    "phone": "0770 642 7012",
    "whatsapp": "0770 642 7012",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 170,
    "verified": true,
    "description": "Bakhtiar Men's Salon offers reliable barbershops in Raparin, Sulaymaniyah."
  },
  {
    "id": 180,
    "name": "Aram Barbershop",
    "category": "barber",
    "owner": "Chnur Amin",
    "phone": "0780 675 2929",
    "whatsapp": "0780 675 2929",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 70,
    "verified": false,
    "description": "Aram Barbershop offers reliable barbershops in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 181,
    "name": "Karwan Advocates",
    "category": "legal",
    "owner": "Peshraw Sultan",
    "phone": "0751 238 2213",
    "whatsapp": "0751 238 2213",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 117,
    "verified": false,
    "description": "Karwan Advocates offers reliable lawyers in Zargata, Sulaymaniyah."
  },
  {
    "id": 182,
    "name": "Beston Advocates",
    "category": "legal",
    "owner": "Goran Sofi",
    "phone": "0751 663 9882",
    "whatsapp": "0751 663 9882",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": false,
    "description": "Beston Advocates offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 183,
    "name": "Snur Advocates",
    "category": "legal",
    "owner": "Payam Amin",
    "phone": "0771 224 4292",
    "whatsapp": "0771 224 4292",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 64,
    "verified": false,
    "description": "Snur Advocates offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 184,
    "name": "Kawa Legal Consultancy",
    "category": "legal",
    "owner": "Dilshad Zangana",
    "phone": "0781 922 3126",
    "whatsapp": "0781 922 3126",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 26,
    "verified": true,
    "description": "Kawa Legal Consultancy offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 185,
    "name": "Ranj Advocates",
    "category": "legal",
    "owner": "Chnur Sultan",
    "phone": "0780 887 7708",
    "whatsapp": "0780 887 7708",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 22,
    "verified": true,
    "description": "Ranj Advocates offers reliable lawyers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 186,
    "name": "Sherko Advocates",
    "category": "legal",
    "owner": "Hemin Mahmud",
    "phone": "0775 231 3981",
    "whatsapp": "0775 231 3981",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 37,
    "verified": false,
    "description": "Sherko Advocates offers reliable lawyers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 187,
    "name": "Payam Law Office",
    "category": "legal",
    "owner": "Newroz Rasul",
    "phone": "0770 411 3697",
    "whatsapp": "0770 411 3697",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 61,
    "verified": true,
    "description": "Payam Law Office offers reliable lawyers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 188,
    "name": "Twana Legal Consultancy",
    "category": "legal",
    "owner": "Goran Karim",
    "phone": "0771 750 5496",
    "whatsapp": "0771 750 5496",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 81,
    "verified": false,
    "description": "Twana Legal Consultancy offers reliable lawyers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 189,
    "name": "Hemin Advocates",
    "category": "legal",
    "owner": "Halgurd Amin",
    "phone": "0770 275 6531",
    "whatsapp": "0770 275 6531",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 148,
    "verified": true,
    "description": "Hemin Advocates offers reliable lawyers in Raparin, Sulaymaniyah."
  },
  {
    "id": 190,
    "name": "Goran Law Office",
    "category": "legal",
    "owner": "Hemin Hussein",
    "phone": "0773 766 4453",
    "whatsapp": "0773 766 4453",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 110,
    "verified": false,
    "description": "Goran Law Office offers reliable lawyers in Raparin, Sulaymaniyah."
  },
  {
    "id": 191,
    "name": "Kawa Tax & Accounting Services",
    "category": "accounting",
    "owner": "Handren Barzinji",
    "phone": "0773 594 5012",
    "whatsapp": "0773 594 5012",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 179,
    "verified": false,
    "description": "Kawa Tax & Accounting Services offers reliable accountants in Ashty, Sulaymaniyah."
  },
  {
    "id": 192,
    "name": "Sardar Accounting Office",
    "category": "accounting",
    "owner": "Snur Hussein",
    "phone": "0781 525 8933",
    "whatsapp": "0781 525 8933",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 91,
    "verified": false,
    "description": "Sardar Accounting Office offers reliable accountants in Salim Street, Sulaymaniyah."
  },
  {
    "id": 193,
    "name": "Sherko Audit Services",
    "category": "accounting",
    "owner": "Sherko Rashid",
    "phone": "0770 878 7070",
    "whatsapp": "0770 878 7070",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 31,
    "verified": true,
    "description": "Sherko Audit Services offers reliable accountants in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 194,
    "name": "Hawre Tax & Accounting Services",
    "category": "accounting",
    "owner": "Bnar Faraj",
    "phone": "0750 397 7293",
    "whatsapp": "0750 397 7293",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 111,
    "verified": true,
    "description": "Hawre Tax & Accounting Services offers reliable accountants in Goizha, Sulaymaniyah."
  },
  {
    "id": 195,
    "name": "Goran Accounting Office",
    "category": "accounting",
    "owner": "Newroz Sofi",
    "phone": "0775 294 3610",
    "whatsapp": "0775 294 3610",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 135,
    "verified": false,
    "description": "Goran Accounting Office offers reliable accountants in Raparin, Sulaymaniyah."
  },
  {
    "id": 196,
    "name": "Handren Tax & Accounting Services",
    "category": "accounting",
    "owner": "Rekan Ahmad",
    "phone": "0780 617 8491",
    "whatsapp": "0780 617 8491",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 59,
    "verified": false,
    "description": "Handren Tax & Accounting Services offers reliable accountants in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 197,
    "name": "Rebaz Accounting Office",
    "category": "accounting",
    "owner": "Peshraw Sultan",
    "phone": "0781 392 9793",
    "whatsapp": "0781 392 9793",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 31,
    "verified": false,
    "description": "Rebaz Accounting Office offers reliable accountants in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 198,
    "name": "Chnur Tax & Accounting Services",
    "category": "accounting",
    "owner": "Shene Hama",
    "phone": "0750 510 1838",
    "whatsapp": "0750 510 1838",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 53,
    "verified": false,
    "description": "Chnur Tax & Accounting Services offers reliable accountants in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 199,
    "name": "Peshraw Accounting Office",
    "category": "accounting",
    "owner": "Ranj Sheikhani",
    "phone": "0773 945 2946",
    "whatsapp": "0773 945 2946",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 28,
    "verified": false,
    "description": "Peshraw Accounting Office offers reliable accountants in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 200,
    "name": "Beston Tax & Accounting Services",
    "category": "accounting",
    "owner": "Dilshad Rashid",
    "phone": "0771 716 9341",
    "whatsapp": "0771 716 9341",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 14,
    "verified": true,
    "description": "Beston Tax & Accounting Services offers reliable accountants in Rapareen, Sulaymaniyah."
  },
  {
    "id": 201,
    "name": "Shvan Real Estate Group",
    "category": "realestate",
    "owner": "Sherko Sultan",
    "phone": "0781 252 9446",
    "whatsapp": "0781 252 9446",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 160,
    "verified": true,
    "description": "Shvan Real Estate Group offers reliable real estate agents in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 202,
    "name": "Ranj Real Estate Group",
    "category": "realestate",
    "owner": "Chnur Baban",
    "phone": "0775 619 9351",
    "whatsapp": "0775 619 9351",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 148,
    "verified": true,
    "description": "Ranj Real Estate Group offers reliable real estate agents in Raparin, Sulaymaniyah."
  },
  {
    "id": 203,
    "name": "Newroz Real Estate Office",
    "category": "realestate",
    "owner": "Bakhtiar Sofi",
    "phone": "0780 697 6040",
    "whatsapp": "0780 697 6040",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 180,
    "verified": false,
    "description": "Newroz Real Estate Office offers reliable real estate agents in Goizha, Sulaymaniyah."
  },
  {
    "id": 204,
    "name": "Shorsh Property Agency",
    "category": "realestate",
    "owner": "Hawre Zangana",
    "phone": "0771 838 1841",
    "whatsapp": "0771 838 1841",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 47,
    "verified": false,
    "description": "Shorsh Property Agency offers reliable real estate agents in Raparin, Sulaymaniyah."
  },
  {
    "id": 205,
    "name": "Chnur Real Estate Group",
    "category": "realestate",
    "owner": "Shene Hama",
    "phone": "0771 132 2800",
    "whatsapp": "0771 132 2800",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 116,
    "verified": true,
    "description": "Chnur Real Estate Group offers reliable real estate agents in Rapareen, Sulaymaniyah."
  },
  {
    "id": 206,
    "name": "Shvan Property Agency",
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0781 993 2020",
    "whatsapp": "0781 993 2020",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 136,
    "verified": true,
    "description": "Shvan Property Agency offers reliable real estate agents in Iskan, Sulaymaniyah."
  },
  {
    "id": 207,
    "name": "Sherko Real Estate Group",
    "category": "realestate",
    "owner": "Rekan Sheikhani",
    "phone": "0775 277 8531",
    "whatsapp": "0775 277 8531",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 91,
    "verified": false,
    "description": "Sherko Real Estate Group offers reliable real estate agents in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 208,
    "name": "Nazdar Real Estate Group",
    "category": "realestate",
    "owner": "Nazdar Jaza",
    "phone": "0781 296 5038",
    "whatsapp": "0781 296 5038",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": true,
    "description": "Nazdar Real Estate Group offers reliable real estate agents in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 209,
    "name": "Peshraw Property Agency",
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0775 591 6714",
    "whatsapp": "0775 591 6714",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 74,
    "verified": true,
    "description": "Peshraw Property Agency offers reliable real estate agents in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 210,
    "name": "Awat Real Estate Group",
    "category": "realestate",
    "owner": "Dilshad Hama",
    "phone": "0775 891 3399",
    "whatsapp": "0775 891 3399",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 77,
    "verified": false,
    "description": "Awat Real Estate Group offers reliable real estate agents in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 211,
    "name": "Hemin IT Solutions",
    "category": "it-repair",
    "owner": "Payam Mahmud",
    "phone": "0781 319 4310",
    "whatsapp": "0781 319 4310",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 73,
    "verified": false,
    "description": "Hemin IT Solutions offers reliable it & computer repair in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 212,
    "name": "Snur IT Solutions",
    "category": "it-repair",
    "owner": "Shvan Rasul",
    "phone": "0771 348 1831",
    "whatsapp": "0771 348 1831",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 139,
    "verified": true,
    "description": "Snur IT Solutions offers reliable it & computer repair in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 213,
    "name": "Bnar Computer Repair Center",
    "category": "it-repair",
    "owner": "Aram Aziz",
    "phone": "0781 202 3252",
    "whatsapp": "0781 202 3252",
    "address": "Qirga, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 144,
    "verified": false,
    "description": "Bnar Computer Repair Center offers reliable it & computer repair in Qirga, Sulaymaniyah."
  },
  {
    "id": 214,
    "name": "Diyar IT Solutions",
    "category": "it-repair",
    "owner": "Halgurd Sultan",
    "phone": "0771 874 5706",
    "whatsapp": "0771 874 5706",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 169,
    "verified": true,
    "description": "Diyar IT Solutions offers reliable it & computer repair in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 215,
    "name": "Shene Computer Repair Center",
    "category": "it-repair",
    "owner": "Halgurd Zangana",
    "phone": "0750 279 7846",
    "whatsapp": "0750 279 7846",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 49,
    "verified": false,
    "description": "Shene Computer Repair Center offers reliable it & computer repair in Andazyari, Sulaymaniyah."
  },
  {
    "id": 216,
    "name": "Rebaz IT Solutions",
    "category": "it-repair",
    "owner": "Beston Sultan",
    "phone": "0773 997 1613",
    "whatsapp": "0773 997 1613",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 149,
    "verified": false,
    "description": "Rebaz IT Solutions offers reliable it & computer repair in Salim Street, Sulaymaniyah."
  },
  {
    "id": 217,
    "name": "Payam IT Solutions",
    "category": "it-repair",
    "owner": "Peshraw Mahmud",
    "phone": "0781 237 9261",
    "whatsapp": "0781 237 9261",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 53,
    "verified": false,
    "description": "Payam IT Solutions offers reliable it & computer repair in Empire Area, Sulaymaniyah."
  },
  {
    "id": 218,
    "name": "Sherko Computer Repair Center",
    "category": "it-repair",
    "owner": "Chnur Mahmud",
    "phone": "0770 114 6523",
    "whatsapp": "0770 114 6523",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 149,
    "verified": false,
    "description": "Sherko Computer Repair Center offers reliable it & computer repair in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 219,
    "name": "Karwan Computer Repair Center",
    "category": "it-repair",
    "owner": "Shorsh Hama",
    "phone": "0775 188 7567",
    "whatsapp": "0775 188 7567",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 51,
    "verified": false,
    "description": "Karwan Computer Repair Center offers reliable it & computer repair in Iskan, Sulaymaniyah."
  },
  {
    "id": 220,
    "name": "Rekan IT Solutions",
    "category": "it-repair",
    "owner": "Payam Salih",
    "phone": "0773 492 4858",
    "whatsapp": "0773 492 4858",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 72,
    "verified": false,
    "description": "Rekan IT Solutions offers reliable it & computer repair in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 221,
    "name": "Peshraw Occasions Planner",
    "category": "events",
    "owner": "Chnur Zangana",
    "phone": "0773 769 6890",
    "whatsapp": "0773 769 6890",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 19,
    "verified": false,
    "description": "Peshraw Occasions Planner offers reliable event planners in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 222,
    "name": "Sardar Weddings & Events",
    "category": "events",
    "owner": "Diyar Hama",
    "phone": "0773 806 2923",
    "whatsapp": "0773 806 2923",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 79,
    "verified": false,
    "description": "Sardar Weddings & Events offers reliable event planners in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 223,
    "name": "Bnar Event Planning",
    "category": "events",
    "owner": "Shvan Sultan",
    "phone": "0781 865 7121",
    "whatsapp": "0781 865 7121",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 144,
    "verified": false,
    "description": "Bnar Event Planning offers reliable event planners in Rapareen, Sulaymaniyah."
  },
  {
    "id": 224,
    "name": "Shene Occasions Planner",
    "category": "events",
    "owner": "Beston Qadir",
    "phone": "0751 638 8319",
    "whatsapp": "0751 638 8319",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 96,
    "verified": true,
    "description": "Shene Occasions Planner offers reliable event planners in Andazyari, Sulaymaniyah."
  },
  {
    "id": 225,
    "name": "Awat Event Planning",
    "category": "events",
    "owner": "Rebaz Barzinji",
    "phone": "0771 686 9792",
    "whatsapp": "0771 686 9792",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 87,
    "verified": false,
    "description": "Awat Event Planning offers reliable event planners in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 226,
    "name": "Sardar Event Planning",
    "category": "events",
    "owner": "Nazdar Qadir",
    "phone": "0781 193 9361",
    "whatsapp": "0781 193 9361",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 18,
    "verified": false,
    "description": "Sardar Event Planning offers reliable event planners in Raparin, Sulaymaniyah."
  },
  {
    "id": 227,
    "name": "Twana Weddings & Events",
    "category": "events",
    "owner": "Sardar Zangana",
    "phone": "0781 788 6049",
    "whatsapp": "0781 788 6049",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 105,
    "verified": true,
    "description": "Twana Weddings & Events offers reliable event planners in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 228,
    "name": "Kawa Occasions Planner",
    "category": "events",
    "owner": "Karwan Zangana",
    "phone": "0750 533 6644",
    "whatsapp": "0750 533 6644",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 142,
    "verified": false,
    "description": "Kawa Occasions Planner offers reliable event planners in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 229,
    "name": "Payam Event Planning",
    "category": "events",
    "owner": "Payam Sultan",
    "phone": "0773 518 3948",
    "whatsapp": "0773 518 3948",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 168,
    "verified": false,
    "description": "Payam Event Planning offers reliable event planners in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 230,
    "name": "Halgurd Weddings & Events",
    "category": "events",
    "owner": "Bakhtiar Hama",
    "phone": "0780 484 2314",
    "whatsapp": "0780 484 2314",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 173,
    "verified": false,
    "description": "Halgurd Weddings & Events offers reliable event planners in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 231,
    "name": "Shvan Iron & Steel Works",
    "category": "metalwork",
    "owner": "Goran Rashid",
    "phone": "0770 650 7439",
    "whatsapp": "0770 650 7439",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 61,
    "verified": false,
    "description": "Shvan Iron & Steel Works offers reliable blacksmiths & metalwork in Goizha, Sulaymaniyah."
  },
  {
    "id": 232,
    "name": "Shene Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Peshraw Mahmud",
    "phone": "0780 644 7214",
    "whatsapp": "0780 644 7214",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 67,
    "verified": false,
    "description": "Shene Blacksmith Workshop offers reliable blacksmiths & metalwork in Empire Area, Sulaymaniyah."
  },
  {
    "id": 233,
    "name": "Shvan Metal Works",
    "category": "metalwork",
    "owner": "Karwan Rasul",
    "phone": "0780 729 1256",
    "whatsapp": "0780 729 1256",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 21,
    "verified": true,
    "description": "Shvan Metal Works offers reliable blacksmiths & metalwork in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 234,
    "name": "Rebaz Metal Works",
    "category": "metalwork",
    "owner": "Shorsh Hussein",
    "phone": "0750 511 8191",
    "whatsapp": "0750 511 8191",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 59,
    "verified": false,
    "description": "Rebaz Metal Works offers reliable blacksmiths & metalwork in Andazyari, Sulaymaniyah."
  },
  {
    "id": 235,
    "name": "Peshraw Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Newroz Zangana",
    "phone": "0775 342 5944",
    "whatsapp": "0775 342 5944",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 173,
    "verified": false,
    "description": "Peshraw Blacksmith Workshop offers reliable blacksmiths & metalwork in Qirga, Sulaymaniyah."
  },
  {
    "id": 236,
    "name": "Zana Metal Works",
    "category": "metalwork",
    "owner": "Hawre Hussein",
    "phone": "0770 741 7999",
    "whatsapp": "0770 741 7999",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 16,
    "verified": false,
    "description": "Zana Metal Works offers reliable blacksmiths & metalwork in Empire Area, Sulaymaniyah."
  },
  {
    "id": 237,
    "name": "Halgurd Iron & Steel Works",
    "category": "metalwork",
    "owner": "Ranj Sheikhani",
    "phone": "0780 518 3444",
    "whatsapp": "0780 518 3444",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 51,
    "verified": false,
    "description": "Halgurd Iron & Steel Works offers reliable blacksmiths & metalwork in Qirga, Sulaymaniyah."
  },
  {
    "id": 238,
    "name": "Rekan Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Goran Salih",
    "phone": "0770 925 8586",
    "whatsapp": "0770 925 8586",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 147,
    "verified": false,
    "description": "Rekan Blacksmith Workshop offers reliable blacksmiths & metalwork in Ashty, Sulaymaniyah."
  },
  {
    "id": 239,
    "name": "Zana Iron & Steel Works",
    "category": "metalwork",
    "owner": "Twana Faraj",
    "phone": "0771 361 4331",
    "whatsapp": "0771 361 4331",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 24,
    "verified": false,
    "description": "Zana Iron & Steel Works offers reliable blacksmiths & metalwork in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 240,
    "name": "Goran Metal Works",
    "category": "metalwork",
    "owner": "Hemin Barzinji",
    "phone": "0750 374 7179",
    "whatsapp": "0750 374 7179",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 158,
    "verified": true,
    "description": "Goran Metal Works offers reliable blacksmiths & metalwork in Zargata, Sulaymaniyah."
  },
  {
    "id": 241,
    "name": "Hemin Welding Workshop",
    "category": "welding",
    "owner": "Beston Zangana",
    "phone": "0771 590 4422",
    "whatsapp": "0771 590 4422",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 89,
    "verified": true,
    "description": "Hemin Welding Workshop offers reliable welders in Empire Area, Sulaymaniyah."
  },
  {
    "id": 242,
    "name": "Payam Welding Workshop",
    "category": "welding",
    "owner": "Karwan Qadir",
    "phone": "0781 348 4350",
    "whatsapp": "0781 348 4350",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 65,
    "verified": false,
    "description": "Payam Welding Workshop offers reliable welders in Goizha, Sulaymaniyah."
  },
  {
    "id": 243,
    "name": "Shene Welding & Fabrication",
    "category": "welding",
    "owner": "Ranj Mahmud",
    "phone": "0775 415 5285",
    "whatsapp": "0775 415 5285",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 131,
    "verified": false,
    "description": "Shene Welding & Fabrication offers reliable welders in Empire Area, Sulaymaniyah."
  },
  {
    "id": 244,
    "name": "Beston Steel Welding Services",
    "category": "welding",
    "owner": "Rekan Sofi",
    "phone": "0775 420 7781",
    "whatsapp": "0775 420 7781",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 60,
    "verified": false,
    "description": "Beston Steel Welding Services offers reliable welders in Zargata, Sulaymaniyah."
  },
  {
    "id": 245,
    "name": "Kawa Welding & Fabrication",
    "category": "welding",
    "owner": "Dilshad Zangana",
    "phone": "0780 402 3497",
    "whatsapp": "0780 402 3497",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 62,
    "verified": false,
    "description": "Kawa Welding & Fabrication offers reliable welders in Raparin, Sulaymaniyah."
  },
  {
    "id": 246,
    "name": "Newroz Welding Workshop",
    "category": "welding",
    "owner": "Rekan Barzinji",
    "phone": "0773 881 9005",
    "whatsapp": "0773 881 9005",
    "address": "Qirga, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 168,
    "verified": false,
    "description": "Newroz Welding Workshop offers reliable welders in Qirga, Sulaymaniyah."
  },
  {
    "id": 247,
    "name": "Sardar Welding Workshop",
    "category": "welding",
    "owner": "Chnur Rashid",
    "phone": "0770 837 9954",
    "whatsapp": "0770 837 9954",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 142,
    "verified": false,
    "description": "Sardar Welding Workshop offers reliable welders in Salim Street, Sulaymaniyah."
  },
  {
    "id": 248,
    "name": "Rebaz Steel Welding Services",
    "category": "welding",
    "owner": "Rebaz Karim",
    "phone": "0750 522 3252",
    "whatsapp": "0750 522 3252",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 63,
    "verified": true,
    "description": "Rebaz Steel Welding Services offers reliable welders in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 249,
    "name": "Shvan Welding Workshop",
    "category": "welding",
    "owner": "Karwan Sheikhani",
    "phone": "0775 161 8916",
    "whatsapp": "0775 161 8916",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 8,
    "verified": true,
    "description": "Shvan Welding Workshop offers reliable welders in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 250,
    "name": "Dilshad Welding & Fabrication",
    "category": "welding",
    "owner": "Kawa Ahmad",
    "phone": "0773 648 5697",
    "whatsapp": "0773 648 5697",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 176,
    "verified": false,
    "description": "Dilshad Welding & Fabrication offers reliable welders in Shorsh Street, Sulaymaniyah."
  }
];


/* ---------------- ICONS (inline, no deps) ---------------- */

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "phone": return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/></svg>;
    case "whatsapp": return <svg {...common} strokeWidth="1.5"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 9.5c.3 2.5 2.5 4.7 5 5"/></svg>;
    case "pin": return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "star": return <svg {...common} fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "check": return <svg {...common}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>;
    case "back": return <svg {...common}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "plus": return <svg {...common}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "trash": return <svg {...common}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
    case "edit": return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case "shield": return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/></svg>;
    case "grid": return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "wrench": return <svg {...common}><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/><path d="M17 2l3 3-2 2-3-3z"/></svg>;
    case "bolt": return <svg {...common}><polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2"/></svg>;
    case "hammer": return <svg {...common}><path d="M15 12l-8.5 8.5a1.5 1.5 0 0 1-2-2L13 10"/><path d="M13 3l7 7-3 3-7-7z"/></svg>;
    case "ruler": return <svg {...common}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>;
    case "building": return <svg {...common}><rect x="4" y="3" width="16" height="18"/><path d="M9 21v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/></svg>;
    case "sofa": return <svg {...common}><path d="M4 13V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"/><path d="M3 13h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M5 19v2M19 19v2"/></svg>;
    case "brush": return <svg {...common}><path d="M9.5 14.5L18 6a2.1 2.1 0 0 0-3-3l-8.5 8.5"/><path d="M8 12l4 4-3 3.5A3 3 0 0 1 4.5 20 3 3 0 0 1 4 15.5z"/></svg>;
    case "wind": return <svg {...common}><path d="M3 8h9a2.5 2.5 0 1 0-2.4-3.2"/><path d="M3 12h13a2.5 2.5 0 1 1-2.4 3.2"/><path d="M3 16h7a2 2 0 1 1-1.9 2.6"/></svg>;
    case "sparkles": return <svg {...common}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.7 2.1L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.9z"/></svg>;
    case "truck": return <svg {...common}><rect x="1" y="7" width="13" height="10"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>;
    case "car": return <svg {...common}><path d="M4 16V11l2-5h12l2 5v5"/><path d="M4 16h16v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/></svg>;
    case "drop": return <svg {...common}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>;
    case "camera": return <svg {...common}><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg>;
    case "thread": return <svg {...common}><circle cx="7" cy="7" r="3"/><path d="M9.5 9.5C13 11 15 15 21 15"/><path d="M17 12c1 1 1 2.5 0 3.5"/></svg>;
    case "scissors": return <svg {...common}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M20 4L8.5 15.5"/></svg>;
    case "cake": return <svg {...common}><path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7z"/><path d="M4 17h16"/><path d="M9 12V8M12 12V6M15 12V8"/><path d="M12 3v1"/></svg>;
    case "utensils": return <svg {...common}><path d="M6 2v8a2 2 0 0 0 4 0V2M8 10v12"/><path d="M16 2c-1.5 0-3 2-3 5s1 5 3 5v10"/></svg>;
    case "sparkle": return <svg {...common}><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>;
    case "scale": return <svg {...common}><path d="M12 3v18M7 21h10"/><path d="M5 7l3.5-1.5L12 7"/><path d="M12 7l3.5-1.5L19 7"/><path d="M3 7l2 5a2.5 2.5 0 0 0 5 0L8 7"/><path d="M14 7l2 5a2.5 2.5 0 0 0 5 0L19 7"/></svg>;
    case "calculator": return <svg {...common}><rect x="5" y="2" width="14" height="20" rx="1"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01"/></svg>;
    case "key": return <svg {...common}><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5L21 21M17 17l2-2M14 14l2-2"/></svg>;
    case "monitor": return <svg {...common}><rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/></svg>;
    case "confetti": return <svg {...common}><path d="M4 20l5-15 11 11z"/><path d="M17 4l1 1M20 8l1 1M14 2l1 1"/></svg>;
    case "flame": return <svg {...common}><path d="M12 2c2 3-1 4-1 7a3 3 0 0 0 6 0c2 2 2 5 0 8a7 7 0 0 1-13 0c-1-3 0-5 2-7 0 2 1 3 2 3-1-3 1-6 4-11z"/></svg>;
    case "spark": return <svg {...common}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/></svg>;
    case "more": return <svg {...common} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>;
    case "share": return <svg {...common}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4"/></svg>;
    case "navigation": return <svg {...common}><polygon points="3 11 21 3 13 21 11 13 3 11"/></svg>;
    case "idcard": return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M6 16c.5-1.5 1.8-2 2-2s1.5.5 2 2"/><path d="M13 10h6M13 13h6M13 16h4"/></svg>;
    case "heart": return <svg {...common}><path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3 2.7-2.3 4.5-3.3 6.5-3C22 4.5 23.6 8 22 11.2c-2.5 4.7-10 9.3-10 9.3z"/></svg>;
    case "user": return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case "chevron": return <svg {...common}><polyline points="9 6 15 12 9 18"/></svg>;
    default: return null;
  }
};

/* ---------------- APP ---------------- */

export default function App() {
  const [activeTab, setActiveTab] = useState("search"); // search | favorites | account
  const [view, setView] = useState(null); // null | category | profile | admin
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [businesses, setBusinesses] = useState(BUSINESSES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [favorites, setFavorites] = useState(() => new Set());
  const [editing, setEditing] = useState(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return businesses.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      categories.find((c) => c.id === b.category)?.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  }, [businesses, categories, query]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    businesses.forEach((b) => { counts[b.category] = (counts[b.category] || 0) + 1; });
    return counts;
  }, [businesses]);

  const favoriteBusinesses = useMemo(
    () => businesses.filter((b) => favorites.has(b.id)),
    [businesses, favorites]
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openProfile = (b) => {
    setSelectedBiz(b);
    setView("profile");
  };

  const openProfileFromSearch = (b) => {
    setSelectedCategory(null);
    openProfile(b);
  };

  const openCategory = (catId) => {
    setSelectedCategory(catId);
    setView("category");
  };

  const saveBusiness = (biz) => {
    setBusinesses((prev) => {
      const exists = prev.some((b) => b.id === biz.id);
      if (exists) return prev.map((b) => (b.id === biz.id ? biz : b));
      return [...prev, { ...biz, id: Math.max(0, ...prev.map((b) => b.id)) + 1 }];
    });
    setEditing(null);
  };

  const deleteBusiness = (id) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const addCategory = (cat) => {
    setCategories((prev) => [...prev, cat]);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const showTabBar = view === null;

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>

      <div style={showTabBar ? styles.tabContent : undefined}>
        {view === null && activeTab === "search" && (
          <Home
            query={query} setQuery={setQuery}
            searchResults={searchResults}
            categoryCounts={categoryCounts}
            categories={categories}
            businesses={businesses}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            openProfile={openProfileFromSearch}
            openCategory={openCategory}
          />
        )}

        {view === null && activeTab === "favorites" && (
          <Favorites
            businesses={favoriteBusinesses}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            openProfile={openProfile}
          />
        )}

        {view === null && activeTab === "account" && (
          <Account
            businessCount={businesses.length}
            categoryCount={categories.length}
            favoriteCount={favorites.size}
            goAdmin={() => setView("admin")}
          />
        )}
      </div>

      {view === "category" && selectedCategory && (
        <CategoryView
          categoryId={selectedCategory}
          categories={categories}
          businesses={businesses.filter((b) => b.category === selectedCategory)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          openProfile={openProfile}
          onBack={() => { setView(null); setSelectedCategory(null); }}
        />
      )}

      {view === "profile" && selectedBiz && (
        <Profile
          biz={selectedBiz}
          categories={categories}
          isFavorite={favorites.has(selectedBiz.id)}
          onToggleFavorite={() => toggleFavorite(selectedBiz.id)}
          onBack={() => setView(selectedCategory ? "category" : null)}
        />
      )}

      {view === "admin" && (
        <Admin
          businesses={businesses}
          categories={categories}
          onBack={() => { setView(null); setEditing(null); }}
          onSave={saveBusiness}
          onDelete={deleteBusiness}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          editing={editing}
          setEditing={setEditing}
        />
      )}

      {showTabBar && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} favoriteCount={favorites.size} />
      )}
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, favoriteCount }) {
  const tabs = [
    { id: "search", label: "Search", icon: "search" },
    { id: "favorites", label: "Favorites", icon: "heart" },
    { id: "account", label: "Account", icon: "user" },
  ];
  return (
    <div style={styles.bottomNav} className="bm-bottom-nav">
      {tabs.map((t) => {
        const active = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="bm-nav-btn"
            style={{ ...styles.navBtn, ...(active ? styles.navBtnActive : {}) }}
          >
            <span style={styles.navIconWrap}>
              <Icon name={t.icon} size={20} />
              {t.id === "favorites" && favoriteCount > 0 && (
                <span style={styles.navBadge}>{favoriteCount}</span>
              )}
            </span>
            <span style={styles.navLabel}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ query, setQuery, searchResults, categoryCounts, categories, businesses, favorites, onToggleFavorite, openProfile, openCategory }) {
  const [focused, setFocused] = useState(false);
  const categoryCount = categories.length;
  const businessCount = businesses.length;
  const isSearching = query.trim().length > 0;

  return (
    <div>
      <div style={styles.hero} className="bm-hero">
        <div style={styles.heroBlobTeal} />
        <div style={styles.heroBlobCoral} />

        <div style={styles.heroTopRow}>
          <img src={APP_LOGO} alt="Bmnassa" style={styles.heroLogo} className="bm-hero-logo" />
        </div>

        <h1 style={styles.heroTitle} className="bm-hero-title">
          Find trusted craftsmen &amp; services in Kurdistan
        </h1>
        <p style={styles.heroSubtitle} className="bm-hero-sub">
          {businessCount}+ verified professionals across {categoryCount} categories
        </p>
      </div>

      <div
        style={{ ...styles.searchWrap, ...(focused ? styles.searchWrapFocus : {}) }}
        className="bm-search"
      >
        <Icon name="search" size={17} />
        <input
          style={styles.searchInput}
          placeholder="Search craftsmen, engineers, services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      {isSearching ? (
        <>
          <div style={styles.resultsMeta} className="bm-meta" key={`meta-${query}`}>
            {searchResults.length} results for "{query}"
          </div>
          <div style={styles.grid} key={`grid-${query}`}>
            {searchResults.map((b, i) => (
              <Card
                key={b.id} biz={b} categories={categories} index={i}
                isFavorite={favorites.has(b.id)}
                onToggleFavorite={() => onToggleFavorite(b.id)}
                onClick={() => openProfile(b)}
              />
            ))}
            {searchResults.length === 0 && (
              <div style={styles.empty} className="bm-empty">No listings match that search.</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.sectionTitle} className="bm-meta">Browse categories</div>
          <div style={styles.categoryGrid}>
            {categories.map((c, i) => (
              <CategoryTile
                key={c.id}
                category={c}
                count={categoryCounts[c.id] || 0}
                index={i}
                onClick={() => openCategory(c.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CategoryTile({ category, count, index, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bm-cat-tile"
      style={{ ...styles.categoryTile, "--i": index }}
    >
      <div style={styles.categoryTileInner}>
        <div style={styles.categoryTileIcon} className="bm-cat-icon">
          <Icon name={category.icon} size={26} />
        </div>
        <div style={styles.categoryTileName}>{category.name}</div>
        <div style={styles.categoryTileCount}>{count} places</div>
      </div>
    </button>
  );
}

function CategoryView({ categoryId, categories, businesses, favorites, onToggleFavorite, openProfile, onBack }) {
  const category = categories.find((c) => c.id === categoryId);
  return (
    <div style={styles.categoryViewWrap}>
      <button style={styles.backBtn} onClick={onBack}>
        <Icon name="back" size={18} /> Back
      </button>

      <div style={styles.categoryViewHeader} className="bm-bizcard">
        <div style={styles.categoryViewIcon}>
          <Icon name={category.icon} size={26} />
        </div>
        <div>
          <h1 style={styles.categoryViewTitle}>{category.name}</h1>
          <div style={styles.categoryViewSub}>{businesses.length} places in Sulaymaniyah</div>
        </div>
      </div>

      <div style={styles.grid}>
        {businesses.map((b, i) => (
          <Card
            key={b.id} biz={b} categories={categories} index={i}
            isFavorite={favorites.has(b.id)}
            onToggleFavorite={() => onToggleFavorite(b.id)}
            onClick={() => openProfile(b)}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ biz, categories, index, isFavorite, onToggleFavorite, onClick }) {
  const catName = categories.find((c) => c.id === biz.category)?.name;
  return (
    <div
      style={{ ...styles.card, "--i": index % 20 }}
      className="bm-card"
      onClick={onClick}
    >
      <div style={styles.cardCornerFold} className="bm-corner" />
      <button
        style={{ ...styles.favBtn, ...(isFavorite ? styles.favBtnActive : {}) }}
        className="bm-fav-btn"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Icon name="heart" size={14} />
      </button>
      <div style={styles.cardTop}>
        <div style={styles.cardAvatar} className="bm-avatar">{biz.name.charAt(0)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.cardNameRow}>
            <span style={styles.cardName}>{biz.name}</span>
            {biz.verified && (
              <span style={styles.verifiedBadge} className="bm-verified" title="Verified">
                <Icon name="check" size={12} />
              </span>
            )}
          </div>
          <div style={styles.cardCat}>{catName}</div>
        </div>
      </div>
      <div style={styles.cardMeta}>
        <span style={styles.rating}><Icon name="star" size={13} /> {biz.rating} <span style={styles.reviewCount}>({biz.reviews})</span></span>
        <span style={styles.address}><Icon name="pin" size={13} /> {biz.address.split(",")[0]}</span>
      </div>
    </div>
  );
}

/* ---------------- FAVORITES ---------------- */

function Favorites({ businesses, categories, favorites, onToggleFavorite, openProfile }) {
  return (
    <div style={styles.tabPageWrap}>
      <div style={styles.tabPageHeader} className="bm-meta">
        <h1 style={styles.tabPageTitle}>Favorites</h1>
        <div style={styles.tabPageSub}>{businesses.length} saved</div>
      </div>

      {businesses.length === 0 ? (
        <div style={styles.favEmptyWrap} className="bm-empty">
          <div style={styles.favEmptyIcon}><Icon name="heart" size={26} /></div>
          <div style={styles.favEmptyTitle}>No favorites yet</div>
          <div style={styles.favEmptySub}>Tap the heart on any listing to save it here.</div>
        </div>
      ) : (
        <div style={styles.grid}>
          {businesses.map((b, i) => (
            <Card
              key={b.id} biz={b} categories={categories} index={i}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
              onClick={() => openProfile(b)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- ACCOUNT ---------------- */

function Account({ businessCount, categoryCount, favoriteCount, goAdmin }) {
  return (
    <div style={styles.tabPageWrap}>
      <div style={styles.accountHero} className="bm-bizcard">
        <img src={APP_LOGO} alt="Bmnassa" style={styles.accountLogo} />
        <div style={styles.accountWelcome}>Welcome to Bmnassa</div>
        <div style={styles.accountSub}>Sulaymaniyah's directory of trusted craftsmen &amp; services</div>
      </div>

      <div style={styles.accountStatsRow}>
        <div style={styles.accountStat}>
          <div style={styles.accountStatNum}>{businessCount}</div>
          <div style={styles.accountStatLabel}>Listings</div>
        </div>
        <div style={styles.accountStat}>
          <div style={styles.accountStatNum}>{categoryCount}</div>
          <div style={styles.accountStatLabel}>Categories</div>
        </div>
        <div style={styles.accountStat}>
          <div style={styles.accountStatNum}>{favoriteCount}</div>
          <div style={styles.accountStatLabel}>Favorites</div>
        </div>
      </div>

      <div style={styles.accountList}>
        <button style={styles.accountRow} className="bm-account-row" onClick={goAdmin}>
          <div style={styles.accountRowIcon}><Icon name="grid" size={17} /></div>
          <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <div style={styles.accountRowTitle}>Admin Panel</div>
            <div style={styles.accountRowSub}>Manage listings & categories</div>
          </div>
          <Icon name="chevron" size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

function Profile({ biz, categories, isFavorite, onToggleFavorite, onBack }) {
  const catName = categories.find((c) => c.id === biz.category)?.name;
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const waLink = `https://wa.me/964${cleanPhone.replace(/^0/, "")}`;
  const establishedYear = 2024 - (biz.id % 12);
  const [expanded, setExpanded] = useState(false);

  const qrSrc = buildQrSrc(biz);

  const handleShare = async () => {
    const text = `${biz.name} — ${catName}\n${biz.address}\n${biz.phone}`;
    if (navigator.share) {
      try { await navigator.share({ title: biz.name, text }); } catch (e) {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address + ", Sulaymaniyah")}`, "_blank");
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${biz.name}\nORG:${biz.name}\nTEL;TYPE=CELL:${cleanPhone}\nADR:;;${biz.address};;;;\nNOTE:${catName}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${biz.name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.profileWrap}>
      <div style={styles.profileTopBar}>
        <button style={styles.backBtn} onClick={onBack}>
          <Icon name="back" size={18} /> Back
        </button>
        <span style={styles.profileTopTitle}>Service Detail</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            style={{ ...styles.favBtn, ...(isFavorite ? styles.favBtnActive : {}), position: "static" }}
            className="bm-fav-btn"
            onClick={onToggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Icon name="heart" size={15} />
          </button>
          <button style={styles.moreBtn} onClick={handleShare}>
            <Icon name="more" size={18} />
          </button>
        </div>
      </div>

      <div style={styles.eyebrow}>SERVICE PROFILE</div>

      <div style={styles.bizCardOuter} className="bm-bizcard">
        <div style={styles.bizCardInner}>
          <img src={APP_LOGO} alt="Bmnassa" style={styles.monogram} />
          <div style={styles.profileNameRow}>
            <h1 style={styles.profileName}>{biz.name}</h1>
            {biz.verified && (
              <span style={styles.verifiedBadgeLg} title="Verified">
                <Icon name="check" size={13} />
              </span>
            )}
          </div>
          <div style={styles.profileCat}>{catName}</div>
          <div style={styles.rating}><Icon name="star" size={14} /> {biz.rating} <span style={styles.reviewCount}>({biz.reviews} reviews)</span></div>
        </div>
      </div>

      <p style={styles.profileDesc}>{biz.description}</p>

      <div style={styles.infoBlock}>
        <div style={styles.infoRow}><Icon name="pin" size={16} /> {biz.address}</div>
        <div style={styles.infoRow}><Icon name="phone" size={16} /> {biz.phone}</div>
      </div>

      <div style={styles.socialRow}>
        <a style={styles.socialBtn} className="bm-social-btn" href={waLink} target="_blank" rel="noreferrer" title="WhatsApp">
          <Icon name="whatsapp" size={17} />
        </a>
        <button style={styles.socialBtn} className="bm-social-btn" onClick={handleShare} title="Share">
          <Icon name="share" size={17} />
        </button>
        <button style={styles.socialBtn} className="bm-social-btn" onClick={handleDirections} title="Directions">
          <Icon name="navigation" size={17} />
        </button>
        <button style={styles.socialBtn} className="bm-social-btn" onClick={handleSaveContact} title="Save contact">
          <Icon name="idcard" size={17} />
        </button>
      </div>

      <div style={styles.qrWrap}>
        <img src={qrSrc} alt={`QR code for ${biz.name}`} style={styles.qrImg} />
        <div style={styles.qrCaption}>Scan to save this contact</div>
      </div>

      <button style={styles.viewFullBtn} className="bm-view-full" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Hide details" : "View Full Profile"}
      </button>

      {expanded && (
        <div style={styles.expandedBlock} className="bm-expanded">
          <div style={styles.infoRow}><Icon name="shield" size={16} /> Verified since {establishedYear}</div>
          <div style={styles.infoRow}><Icon name="star" size={16} /> {biz.reviews} customer reviews on Bmnassa</div>
          <div style={styles.infoRow}><Icon name="grid" size={16} /> Category: {catName}</div>
        </div>
      )}

      <div style={styles.ctaRow}>
        <a style={styles.ctaCall} href={`tel:${cleanPhone}`}>
          <Icon name="phone" size={16} /> Call
        </a>
        <a style={styles.ctaWhatsapp} href={waLink} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={16} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

/* ---------------- ADMIN ---------------- */

const emptyBusinessForm = {
  id: null, name: "", category: "", owner: "", phone: "",
  address: "", rating: 5.0, reviews: 0, verified: false, description: "",
};

const emptyCategoryForm = { name: "", icon: ICON_OPTIONS[0] };

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Admin({ businesses, categories, onBack, onSave, onDelete, onAddCategory, onDeleteCategory, editing, setEditing }) {
  const [form, setForm] = useState(editing || { ...emptyBusinessForm, category: categories[0]?.id || "" });
  const [catForm, setCatForm] = useState(emptyCategoryForm);
  const [showCatForm, setShowCatForm] = useState(false);

  const startNew = () => { setForm({ ...emptyBusinessForm, category: categories[0]?.id || "" }); setEditing({}); };
  const startEdit = (b) => { setForm(b); setEditing(b); };
  const cancel = () => { setEditing(null); setForm({ ...emptyBusinessForm, category: categories[0]?.id || "" }); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave({ ...form, rating: Number(form.rating), reviews: Number(form.reviews) });
  };

  const submitCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    const id = slugify(catForm.name);
    if (categories.some((c) => c.id === id)) return;
    onAddCategory({ id, name: catForm.name.trim(), icon: catForm.icon });
    setCatForm(emptyCategoryForm);
    setShowCatForm(false);
  };

  const handleDeleteCategory = (cat, count) => {
    if (count > 0 && !window.confirm(`${count} business(es) use "${cat.name}". Delete this category anyway? Those listings will stay but won't be browsable by category.`)) {
      return;
    }
    onDeleteCategory(cat.id);
  };

  return (
    <div style={styles.adminWrap}>
      <button style={styles.backBtn} onClick={onBack}>
        <Icon name="back" size={18} /> Back to app
      </button>
      <h1 style={styles.adminTitle}>Admin — Listings</h1>
      <div style={styles.adminSub}>{businesses.length} businesses across {categories.length} categories</div>

      <div style={styles.adminSectionHeader}>
        <span>Categories</span>
        <button style={styles.smallGhostBtn} onClick={() => setShowCatForm((v) => !v)}>
          <Icon name="plus" size={13} /> {showCatForm ? "Close" : "Add category"}
        </button>
      </div>

      {showCatForm && (
        <form style={styles.form} onSubmit={submitCategory}>
          <input style={styles.input} placeholder="Category name (e.g. Locksmiths)" value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          <select style={styles.input} value={catForm.icon}
            onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}>
            {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <div style={styles.formBtnRow}>
            <button type="submit" style={styles.saveBtn}>Add category</button>
          </div>
        </form>
      )}

      <div style={styles.categoryAdminList}>
        {categories.map((c) => {
          const count = businesses.filter((b) => b.category === c.id).length;
          return (
            <div key={c.id} style={styles.categoryAdminRow}>
              <div style={styles.categoryAdminIcon}><Icon name={c.icon} size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.adminRowName}>{c.name}</div>
                <div style={styles.adminRowMeta}>{count} businesses</div>
              </div>
              <button style={styles.iconBtn} onClick={() => handleDeleteCategory(c, count)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.adminSectionHeader}>
        <span>Listings</span>
      </div>

      {!editing && (
        <button style={styles.addBtn} onClick={startNew}>
          <Icon name="plus" size={16} /> Add business
        </button>
      )}

      {editing !== null && (
        <form style={styles.form} onSubmit={submit}>
          <input style={styles.input} placeholder="Business name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select style={styles.input} value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={styles.input} placeholder="Owner name" value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input style={styles.input} placeholder="Phone (e.g. 0770 123 4567)" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input style={styles.input} placeholder="Address / neighborhood" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <textarea style={{ ...styles.input, minHeight: 70 }} placeholder="Short description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={form.verified}
              onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
            Verified business
          </label>
          {form.name.trim() && form.phone.trim() && (
            <div style={styles.qrPreviewRow}>
              <img src={buildQrSrc({ ...form, phone: form.phone }, 90)} alt="QR preview" style={styles.qrPreviewImg} />
              <span style={styles.qrPreviewLabel}>QR preview — generated automatically from name, phone &amp; address</span>
            </div>
          )}
          <div style={styles.formBtnRow}>
            <button type="submit" style={styles.saveBtn}>Save</button>
            <button type="button" style={styles.cancelBtn} onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}

      <div style={styles.adminList}>
        {businesses.map((b) => (
          <div key={b.id} style={styles.adminRow}>
            <img src={buildQrSrc(b, 90)} alt="" style={styles.adminRowQr} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.adminRowName}>{b.name} {b.verified && <Icon name="shield" size={13} />}</div>
              <div style={styles.adminRowMeta}>{categories.find((c) => c.id === b.category)?.name || "Uncategorized"} · {b.phone}</div>
            </div>
            <button style={styles.iconBtn} onClick={() => startEdit(b)}><Icon name="edit" size={15} /></button>
            <button style={styles.iconBtn} onClick={() => onDelete(b.id)}><Icon name="trash" size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const globalCss = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  input, select, textarea, button { font-family: inherit; }
  input:focus, select:focus, textarea:focus { outline: 1.5px solid #ffffff55; }

  @keyframes bmFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bmPopIn {
    from { opacity: 0; transform: scale(0.75); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes bmSpinIn {
    from { opacity: 0; transform: rotate(-8deg) scale(0.9); }
    to { opacity: 1; transform: rotate(0deg) scale(1); }
  }

  .bm-hero { animation: bmFadeUp 0.55s cubic-bezier(.2,.7,.3,1) both; }
  .bm-hero-logo { animation: bmSpinIn 0.6s cubic-bezier(.2,.7,.3,1) both; }
  .bm-hero-title { animation: bmFadeUp 0.55s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.08s; }
  .bm-hero-sub { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.15s; }
  .bm-search { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.2s; transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.2s ease; }
  .bm-chips { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.13s; }
  .bm-meta { animation: bmFadeUp 0.4s ease both; animation-delay: 0.18s; }
  .bm-empty { animation: bmFadeUp 0.4s ease both; }

  .bm-admin-btn { transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease; }
  .bm-admin-btn:hover { border-color: #666; }
  .bm-admin-btn:active { transform: scale(0.93); }

  .bm-chip { transition: transform 0.16s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
  .bm-chip:hover { border-color: #555; }
  .bm-chip:active { transform: scale(0.92); }
  .bm-chip.active { animation: bmPopIn 0.25s cubic-bezier(.3,1.4,.6,1) both; }

  .bm-cat-tile {
    animation: bmFadeUp 0.4s cubic-bezier(.16,.85,.3,1) both;
    animation-delay: calc(var(--i, 0) * 35ms);
    transition: transform 0.2s cubic-bezier(.2,.7,.3,1), border-color 0.2s ease, box-shadow 0.25s ease;
  }
  .bm-cat-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.4); }
  .bm-cat-tile:hover .bm-cat-icon { transform: scale(1.08) rotate(-3deg); }
  .bm-cat-tile:active { transform: translateY(-1px) scale(0.98); }
  .bm-cat-icon { transition: transform 0.22s ease; }

  .bm-card {
    animation: bmFadeUp 0.45s cubic-bezier(.16,.85,.3,1) both;
    animation-delay: calc(var(--i, 0) * 40ms);
    transition: transform 0.22s cubic-bezier(.2,.7,.3,1), border-color 0.22s ease, box-shadow 0.25s ease;
  }
  .bm-card:hover { transform: translateY(-5px); border-color: #3a3a3a; box-shadow: 0 14px 28px rgba(0,0,0,0.45); }
  .bm-card:hover .bm-corner { border-width: 0 28px 28px 0; }
  .bm-card:hover .bm-avatar { transform: scale(1.06); }
  .bm-card:active { transform: translateY(-1px) scale(0.99); }
  .bm-corner { transition: border-width 0.25s ease; }
  .bm-avatar { transition: transform 0.22s ease; }
  .bm-verified { animation: bmPopIn 0.3s cubic-bezier(.3,1.4,.6,1) both; animation-delay: 0.1s; }

  .bm-bizcard { animation: bmFadeUp 0.5s cubic-bezier(.16,.85,.3,1) both; }
  .bm-expanded { animation: bmFadeUp 0.35s ease both; }
  .bm-social-btn { transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease; }
  .bm-social-btn:hover { border-color: #2dd4bf88; transform: translateY(-2px); }
  .bm-social-btn:active { transform: scale(0.9); }
  .bm-view-full { transition: transform 0.15s ease, background 0.2s ease; }
  .bm-view-full:active { transform: scale(0.98); }

  .bm-fav-btn { transition: transform 0.18s cubic-bezier(.3,1.4,.6,1), background 0.2s ease, border-color 0.2s ease; }
  .bm-fav-btn:active { transform: scale(0.85); }
  .bm-fav-btn.pulse { animation: bmPopIn 0.3s cubic-bezier(.3,1.4,.6,1) both; }

  .bm-nav-btn { transition: color 0.2s ease, transform 0.15s ease; }
  .bm-nav-btn:active { transform: scale(0.92); }
  .bm-bottom-nav { animation: bmFadeUp 0.4s ease both; }

  .bm-account-row { transition: transform 0.15s ease, border-color 0.2s ease; }
  .bm-account-row:hover { border-color: #3a3a3a; }
  .bm-account-row:active { transform: scale(0.98); }

  @media (prefers-reduced-motion: reduce) {
    .bm-hero, .bm-hero-logo, .bm-hero-title, .bm-hero-sub, .bm-search, .bm-chips, .bm-meta, .bm-empty,
    .bm-card, .bm-chip.active, .bm-verified, .bm-bizcard, .bm-expanded, .bm-bottom-nav { animation: none !important; }
    .bm-card, .bm-chip, .bm-admin-btn, .bm-corner, .bm-avatar, .bm-search, .bm-social-btn, .bm-view-full,
    .bm-fav-btn, .bm-nav-btn, .bm-account-row { transition: none !important; }
  }
`;

const styles = {
  app: {
    background: "#0a0a0a", color: "#f5f5f5", minHeight: "100vh",
    fontFamily: "'Helvetica Neue', Arial, sans-serif", paddingBottom: 0,
  },
  tabContent: { paddingBottom: 90 },
  bottomNav: {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10,
    display: "flex", background: "rgba(15,15,15,0.92)", backdropFilter: "blur(14px)",
    borderTop: "1px solid #232323", padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
  },
  navBtn: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    background: "transparent", border: "none", color: "#777", padding: "4px 0", cursor: "pointer",
  },
  navBtnActive: { color: "#fff" },
  navIconWrap: { position: "relative", display: "flex" },
  navBadge: {
    position: "absolute", top: -5, right: -8, background: "#ff6b4a", color: "#fff",
    fontSize: 9.5, fontWeight: 700, borderRadius: 8, minWidth: 15, height: 15,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
  },
  navLabel: { fontSize: 10.5, fontWeight: 600 },

  tabPageWrap: { padding: "20px 20px 8px" },
  tabPageHeader: { marginBottom: 16 },
  tabPageTitle: { fontSize: 20, margin: 0, fontWeight: 700 },
  tabPageSub: { fontSize: 12.5, color: "#888", marginTop: 3 },

  favEmptyWrap: { textAlign: "center", padding: "50px 20px", color: "#888" },
  favEmptyIcon: {
    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
    background: "#161616", border: "1px solid #262626", color: "#555",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  favEmptyTitle: { fontSize: 15, fontWeight: 600, color: "#eee", marginBottom: 4 },
  favEmptySub: { fontSize: 13, color: "#888" },

  favBtn: {
    position: "absolute", top: 10, right: 10, zIndex: 2, width: 30, height: 30, borderRadius: "50%",
    background: "rgba(10,10,10,0.55)", border: "1px solid #333", color: "#ccc",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  favBtnActive: { background: "#ff6b4a", borderColor: "#ff6b4a", color: "#fff" },

  accountHero: { padding: "26px 20px", textAlign: "center" },
  accountLogo: { width: 68, height: "auto", margin: "0 auto 14px", display: "block", objectFit: "contain" },
  accountWelcome: { fontSize: 17, fontWeight: 700, color: "#fff" },
  accountSub: { fontSize: 12.5, color: "#9fb3af", marginTop: 6, lineHeight: 1.5 },
  accountStatsRow: { display: "flex", gap: 10, margin: "16px 0" },
  accountStat: {
    flex: 1, background: "#131313", border: "1px solid #232323", borderRadius: 12,
    padding: "14px 8px", textAlign: "center",
  },
  accountStatNum: { fontSize: 18, fontWeight: 700, color: "#fff" },
  accountStatLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  accountList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 6 },
  accountRow: {
    display: "flex", alignItems: "center", gap: 12, width: "100%",
    background: "#131313", border: "1px solid #232323", borderRadius: 12,
    padding: "13px 14px", cursor: "pointer", color: "#fff",
  },
  accountRowIcon: {
    width: 36, height: 36, borderRadius: 10, flexShrink: 0, color: "#fff",
    background: "linear-gradient(135deg, #2dd4bf, #ff6b4a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  accountRowTitle: { fontSize: 13.5, fontWeight: 600 },
  accountRowSub: { fontSize: 11.5, color: "#888", marginTop: 2 },

  hero: {
    position: "relative", overflow: "hidden", padding: "22px 20px 46px",
    background: "linear-gradient(180deg, #10201d 0%, #0d1614 55%, #0a0a0a 100%)",
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  heroBlobTeal: {
    position: "absolute", top: -60, left: -60, width: 220, height: 220, borderRadius: "50%",
    background: "#2dd4bf", opacity: 0.25, filter: "blur(60px)", pointerEvents: "none",
  },
  heroBlobCoral: {
    position: "absolute", bottom: -70, right: -50, width: 200, height: 200, borderRadius: "50%",
    background: "#ff6b4a", opacity: 0.22, filter: "blur(60px)", pointerEvents: "none",
  },
  heroTopRow: {
    position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  heroLogo: { width: 92, height: "auto", objectFit: "contain" },
  heroTitle: {
    position: "relative", fontSize: 20, fontWeight: 700, lineHeight: 1.3,
    margin: "24px 0 8px", letterSpacing: -0.2, maxWidth: 320,
  },
  heroSubtitle: { position: "relative", color: "#9fb3af", fontSize: 13.5, margin: 0 },
  adminBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)",
    border: "1px solid #333", color: "#ccc", padding: "7px 12px", borderRadius: 20,
    fontSize: 13, cursor: "pointer",
  },
  searchWrap: {
    position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 10,
    margin: "-26px 20px 14px", background: "#181818", border: "1px solid #2c2c2c",
    borderRadius: 14, padding: "14px 16px", color: "#888", boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
  },
  searchWrapFocus: {
    borderColor: "#2dd4bf88", boxShadow: "0 10px 30px rgba(0,0,0,0.45), 0 0 0 3px rgba(45,212,191,0.15)", transform: "translateY(-1px)",
  },
  searchInput: {
    flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 15,
  },
  sectionTitle: {
    padding: "18px 20px 10px", fontSize: 13, fontWeight: 700, color: "#eee",
    textTransform: "uppercase", letterSpacing: 0.6,
  },
  categoryGrid: {
    display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, padding: "0 20px 8px",
  },
  categoryTile: {
    borderRadius: 16, padding: 2, cursor: "pointer", border: "none",
    background: "linear-gradient(135deg, #2dd4bf 0%, #2dd4bf 35%, #ff6b4a 100%)",
  },
  categoryTileInner: {
    background: "#131313", borderRadius: 14, padding: "20px 14px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
  },
  categoryTileIcon: {
    width: 44, height: 44, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  categoryTileName: { fontSize: 14.5, fontWeight: 600, color: "#fff", lineHeight: 1.25 },
  categoryTileCount: { fontSize: 12, color: "#888" },

  categoryViewWrap: { padding: "20px" },
  categoryViewHeader: {
    display: "flex", alignItems: "center", gap: 14, background: "#131313",
    border: "1px solid #232323", borderRadius: 16, padding: 18, marginBottom: 18,
  },
  categoryViewIcon: {
    width: 52, height: 52, borderRadius: 14, color: "#fff", flexShrink: 0,
    background: "linear-gradient(135deg, #2dd4bf, #ff6b4a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  categoryViewTitle: { fontSize: 18, margin: 0 },
  categoryViewSub: { fontSize: 12.5, color: "#888", marginTop: 3 },

  resultsMeta: { padding: "0 20px 10px", fontSize: 12.5, color: "#777" },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 12, padding: "0 20px",
  },
  empty: { color: "#777", fontSize: 14, padding: "30px 0" },
  card: {
    position: "relative", background: "#131313", border: "1px solid #232323",
    borderRadius: 14, padding: 16, cursor: "pointer", overflow: "hidden",
  },
  cardCornerFold: {
    position: "absolute", top: 0, right: 0, width: 0, height: 0,
    borderStyle: "solid", borderWidth: "0 22px 22px 0", borderColor: "transparent #232323 transparent transparent",
  },
  cardTop: { display: "flex", gap: 10, alignItems: "center" },
  cardAvatar: {
    width: 42, height: 42, borderRadius: 10, background: "#232323",
    display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  cardNameRow: { display: "flex", alignItems: "center", gap: 6 },
  cardName: { fontSize: 15, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardCat: { fontSize: 12.5, color: "#888", marginTop: 2 },
  verifiedBadge: {
    background: "#fff", color: "#0a0a0a", borderRadius: "50%", width: 16, height: 16,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cardMeta: { display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12.5, color: "#999" },
  rating: { display: "flex", alignItems: "center", gap: 4, color: "#e8c547" },
  reviewCount: { color: "#777" },
  address: { display: "flex", alignItems: "center", gap: 4, color: "#999" },

  profileWrap: { padding: "20px 20px 32px" },
  profileTopBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
    color: "#ccc", fontSize: 14, cursor: "pointer", padding: 0,
  },
  profileTopTitle: { fontSize: 15, fontWeight: 600, color: "#fff" },
  moreBtn: {
    background: "transparent", border: "none", color: "#ccc", cursor: "pointer",
    padding: 6, display: "flex", alignItems: "center",
  },
  eyebrow: { color: "#777", fontSize: 11, letterSpacing: 1.2, fontWeight: 600, margin: "18px 0 10px" },

  bizCardOuter: {
    borderRadius: 18, padding: 2, background: "linear-gradient(135deg, #2dd4bf 0%, #2dd4bf 35%, #ff6b4a 100%)",
    position: "relative", overflow: "hidden",
  },
  bizCardInner: {
    background: "#141414", borderRadius: 16, padding: "26px 20px", textAlign: "center", position: "relative", overflow: "hidden",
  },
  monogram: {
    width: 132, height: "auto", margin: "0 auto 18px", display: "block",
    objectFit: "contain",
  },
  profileNameRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  profileName: { fontSize: 19, margin: 0 },
  verifiedBadgeLg: {
    background: "#2dd4bf", color: "#08201d", borderRadius: "50%", width: 19, height: 19,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  profileCat: { color: "#888", fontSize: 13.5, marginTop: 4 },
  profileDesc: { color: "#bbb", fontSize: 14, lineHeight: 1.6, marginTop: 18 },
  infoBlock: { marginTop: 14, display: "flex", flexDirection: "column", gap: 10 },
  infoRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#ddd" },

  socialRow: { display: "flex", gap: 10, marginTop: 18 },
  socialBtn: {
    width: 42, height: 42, borderRadius: "50%", background: "#161616", border: "1px solid #262626",
    color: "#ddd", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", textDecoration: "none",
  },

  qrWrap: { textAlign: "center", marginTop: 24 },
  qrImg: { width: 148, height: 148, borderRadius: 12, background: "#0f0f0f", border: "1px solid #232323" },
  qrCaption: { color: "#777", fontSize: 12, marginTop: 8 },

  viewFullBtn: {
    display: "block", width: "100%", background: "#1a4b45", color: "#5eead4", border: "1px solid #2dd4bf55",
    padding: "13px 0", borderRadius: 12, fontWeight: 600, fontSize: 13.5, marginTop: 18, cursor: "pointer",
  },
  expandedBlock: {
    display: "flex", flexDirection: "column", gap: 10, marginTop: 14, padding: 16,
    background: "#131313", border: "1px solid #232323", borderRadius: 12,
  },

  ctaRow: { display: "flex", gap: 10, marginTop: 22, position: "sticky", bottom: 12 },
  ctaCall: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "#fff", color: "#0a0a0a", padding: "13px 0", borderRadius: 12,
    fontWeight: 600, fontSize: 14, textDecoration: "none",
  },
  ctaWhatsapp: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "#161616", color: "#fff", border: "1px solid #333", padding: "13px 0",
    borderRadius: 12, fontWeight: 600, fontSize: 14, textDecoration: "none",
  },

  adminWrap: { padding: 20 },
  adminTitle: { fontSize: 20, margin: "4px 0 2px" },
  adminSub: { color: "#888", fontSize: 13, marginBottom: 16 },
  adminSectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontSize: 12.5, fontWeight: 700, color: "#999", textTransform: "uppercase",
    letterSpacing: 0.6, margin: "18px 0 10px",
  },
  smallGhostBtn: {
    display: "flex", alignItems: "center", gap: 5, background: "transparent",
    border: "1px solid #2dd4bf55", color: "#5eead4", padding: "5px 10px",
    borderRadius: 16, fontSize: 12, cursor: "pointer",
  },
  categoryAdminList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 },
  categoryAdminRow: {
    display: "flex", alignItems: "center", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 10, padding: "8px 10px",
  },
  categoryAdminIcon: {
    width: 30, height: 30, borderRadius: 8, flexShrink: 0, color: "#fff",
    background: "linear-gradient(135deg, #2dd4bf, #ff6b4a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#0a0a0a",
    border: "none", padding: "10px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13.5,
    cursor: "pointer", marginBottom: 18,
  },
  form: {
    display: "flex", flexDirection: "column", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 14, padding: 16, marginBottom: 20,
  },
  input: {
    background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff",
    padding: "10px 12px", fontSize: 13.5,
  },
  checkboxRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#ccc" },
  qrPreviewRow: { display: "flex", alignItems: "center", gap: 12, padding: "4px 0" },
  qrPreviewImg: { width: 72, height: 72, borderRadius: 8, border: "1px solid #232323", flexShrink: 0 },
  qrPreviewLabel: { fontSize: 11.5, color: "#888", lineHeight: 1.4 },
  formBtnRow: { display: "flex", gap: 10, marginTop: 4 },
  saveBtn: {
    flex: 1, background: "#fff", color: "#0a0a0a", border: "none", padding: "10px 0",
    borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
  },
  cancelBtn: {
    flex: 1, background: "transparent", color: "#ccc", border: "1px solid #333",
    padding: "10px 0", borderRadius: 8, fontSize: 13.5, cursor: "pointer",
  },
  adminList: { display: "flex", flexDirection: "column", gap: 8 },
  adminRow: {
    display: "flex", alignItems: "center", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 10, padding: "10px 12px",
  },
  adminRowQr: { width: 40, height: 40, borderRadius: 6, flexShrink: 0, border: "1px solid #232323" },
  adminRowName: { fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  adminRowMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  iconBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#ccc", borderRadius: 8,
    width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
};
