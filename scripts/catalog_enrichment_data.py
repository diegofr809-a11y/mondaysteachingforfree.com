# Catalog enrichment mappings for all 104 artists
import re

ARTIST_DISCOGRAPHIES = {
  # --- POPULAR / INTERNATIONAL ---
  "Drake": {
    "albums": [
      { "title": "For All The Dogs", "year": 2023, "tracks": ["Virginia Beach", "Amen", "First Person Shooter", "IDGAF", "Slime You Out", "Bahamas Promises", "Rich Baby Daddy", "Daylight", "Fear of Heights", "8am in Charlotte", "Drew A Picasso", "Members Only", "What Would Pluto Do", "Another Late Night", "Polar Opposites"] },
      { "title": "Her Loss", "year": 2022, "tracks": ["Rich Flex", "Major Distribution", "On BS", "BackOutsideBoyz", "Privileged Rappers", "Spin Bout U", "Hours In Silence", "Treacherous Twins", "Circo Loco", "Pussy & Millions", "Broke Boys", "Middle of the Ocean", "Jumbotron Shit Poppin", "More M’s", "3AM on Glenwood", "I Guess It’s Fuck Me"] },
      { "title": "Certified Lover Boy", "year": 2021, "tracks": ["Champagne Poetry", "Papi's Home", "Girls Want Girls", "In the Bible", "Love All", "Fair Trade", "Way 2 Sexy", "TSU", "N 2 Deep", "Pipe Down", "Yebba's Heartbreak", "No Friends In The Industry", "Knife Talk", "7am on Bridle Path", "Race My Mind", "Fountains", "Get Along Better", "You Only Live Twice", "IMY2", "Fucking Fans", "The Remorse"] },
      { "title": "Scorpion", "year": 2018, "tracks": ["Survival", "Nonstop", "Elevate", "Emotionless", "God's Plan", "I'm Upset", "8 Out of 10", "Mob Ties", "Can't Take a Joke", "Sandra's Rose", "Talk Up", "Is There More", "Peak", "Summer Games", "Jaded", "Nice For What", "Finesse", "Ratchet Happy Birthday", "That's How You Feel", "Blue Tint", "In My Feelings", "Don't Matter To Me", "After Dark", "Final Fantasy", "March 14"] },
      { "title": "Views", "year": 2016, "tracks": ["Keep the Family Close", "9", "U With Me?", "Feel No Ways", "Hype", "Weston Road Flows", "Redemption", "With You", "Faithful", "Still Here", "Controlla", "One Dance", "Grammys", "Childs Play", "Pop Style", "Too Good", "Summers Over Interlude", "Fire & Desire", "Views", "Hotline Bling"] },
      { "title": "Nothing Was the Same", "year": 2013, "tracks": ["Tuscan Leather", "Furthest Thing", "Started From the Bottom", "Wu-Tang Forever", "Own It", "Worst Behavior", "From Time", "Hold On, We're Going Home", "Connect", "The Language", "305 to My City", "Too Much", "Pound Cake / Paris Morton Music 2", "Come Thru", "All Me"] },
      { "title": "Take Care", "year": 2011, "tracks": ["Over My Dead Body", "Shot for Me", "Headlines", "Crew Love", "Take Care", "Marvins Room", "Buried Alive Interlude", "Under Ground Kings", "We'll Be Fine", "Make Me Proud", "Lord Knows", "Cameras / Good Ones Go Interlude", "Doing It Wrong", "The Real Her", "Look What You've Done", "HYFR (Hell Ya Fucking Right)", "Practice", "The Ride", "The Motto"] }
    ],
    "singles": [
      { "title": "Search & Rescue", "year": 2023 },
      { "title": "Laugh Now Cry Later", "year": 2020 },
      { "title": "Toosie Slide", "year": 2020 },
      { "title": "0 to 100 / The Catch Up", "year": 2014 },
      { "title": "Best I Ever Had", "year": 2009 }
    ],
    "collaborations": [
      { "title": "First Person Shooter", "withArtist": "J. Cole", "year": 2023 },
      { "title": "Rich Flex", "withArtist": "21 Savage", "year": 2022 },
      { "title": "Fair Trade", "withArtist": "Travis Scott", "year": 2021 },
      { "title": "Knife Talk", "withArtist": "21 Savage & Project Pat", "year": 2021 },
      { "title": "One Dance", "withArtist": "Wizkid & Kyla", "year": 2016 },
      { "title": "Take Care", "withArtist": "Rihanna", "year": 2011 }
    ]
  },

  "Kanye West": {
    "albums": [
      { "title": "VULTURES 1", "year": 2024, "tracks": ["STARS", "KEYS TO MY LIFE", "PAID", "TALKING", "BACK TO ME", "HOODRAT", "DO IT", "PAPERWORK", "BURN", "FUK SUMN", "VULTURES", "CARNIVAL", "BEG FORGIVENESS", "GOOD (DON'T DIE)", "PROBLEMATIC", "KING"] },
      { "title": "VULTURES 2", "year": 2024, "tracks": ["SLIDE", "TIME MOVING SLOW", "FIELD TRIP", "FRIED", "ISABELLA", "PROMOTION", "HUSBAND", "LIFESTYLE", "FOREVER", "BOMB", "RIVER", "530", "DEAD", "FOREVER ROLLING", "SKY CITY", "MY SOUL"] },
      { "title": "DONDA", "year": 2021, "tracks": ["Donda Chant", "Jail", "God Breathed", "Off The Grid", "Hurricane", "Praise God", "Jonah", "Ok Ok", "Junya", "Believe What I Say", "24", "Remote Control", "Moon", "Heaven and Hell", "Donda", "Keep My Spirit Alive", "Jesus Lord", "New Again", "Tell the Vision", "Lord I Need You", "Pure Souls", "Come to Life", "No Child Left Behind"] },
      { "title": "The Life of Pablo", "year": 2016, "tracks": ["Ultralight Beam", "Father Stretch My Hands Pt. 1", "Pt. 2", "Famous", "Feedback", "Low Lights", "Highlights", "Freestyle 4", "I Love Kanye", "Waves", "FML", "Real Friends", "Wolves", "Frank's Track", "Sシlvеr Surfer Intermission", "30 Hours", "No More Parties in LA", "Facts (Charlie Heat Version)", "Fade", "Saint Pablo"] },
      { "title": "Yeezus", "year": 2013, "tracks": ["On Sight", "Black Skinhead", "I Am a God", "New Slaves", "Hold My Liquor", "I'm in It", "Blood on the Leaves", "Guilt Trip", "Send It Up", "Bound 2"] },
      { "title": "My Beautiful Dark Twisted Fantasy", "year": 2010, "tracks": ["Dark Fantasy", "Gorgeous", "Power", "All of the Lights (Interlude)", "All of the Lights", "Monster", "So Appalled", "Devil in a New Dress", "Runaway", "Hell of a Life", "Blame Game", "Lost in the World", "Who Will Survive in America"] },
      { "title": "Graduation", "year": 2007, "tracks": ["Good Morning", "Champion", "Stronger", "I Wonder", "Good Life", "Can't Tell Me Nothing", "Barry Bonds", "Drunk and Hot Girls", "Flashing Lights", "Everything I Am", "The Glory", "Homecoming", "Big Brother"] },
      { "title": "The College Dropout", "year": 2004, "tracks": ["Intro", "We Don't Care", "Graduation Day", "All Falls Down", "I'll Fly Away", "Spaceship", "Jesus Walks", "Never Let Me Down", "Get Em High", "Workout Plan", "The New Workout Plan", "Slow Jamz", "Breathe in Breathe Out", "School Spirit", "Two Words", "Through the Wire", "Family Business", "Last Call"] }
    ],
    "singles": [
      { "title": "CARNIVAL", "year": 2024 },
      { "title": "Eazy", "year": 2022 },
      { "title": "Wash Us In The Blood", "year": 2020 },
      { "title": "Gold Digger", "year": 2005 }
    ],
    "collaborations": [
      { "title": "CARNIVAL", "withArtist": "Ty Dolla $ign, Playboi Carti & Rich The Kid", "year": 2024 },
      { "title": "Off The Grid", "withArtist": "Playboi Carti & Fivio Foreign", "year": 2021 },
      { "title": "Hurricane", "withArtist": "The Weeknd & Lil Baby", "year": 2021 },
      { "title": "Monster", "withArtist": "Nicki Minaj, Rick Ross & Jay-Z", "year": 2010 }
    ]
  },

  "Future": {
    "albums": [
      { "title": "WE DON'T TRUST YOU", "year": 2024, "tracks": ["We Don't Trust You", "Young Metro", "Ice Attack", "Type Shit", "Claustrophobic", "Like That", "Slimed In", "Magic Don Juan (Princess Diana)", "Cinderella", "Runnin Outta Time", "Fried (She a Vibe)", "Ain't No Love", "Everyday Hustle", "GTA", "Seen it All", "WTFYM", "Where My Twin @"] },
      { "title": "WE STILL DON'T TRUST YOU", "year": 2024, "tracks": ["We Still Don't Trust You", "Drink N Dance", "Out of My Hands", "Jealous", "All to Myself", "Nights Like This", "Came to the Party", "Right 4 You", "Show of Hands", "Gracious", "Beat It", "Always Be My Fault", "Overload", "Streets Made Me a King", "Red Leather"] },
      { "title": "I NEVER LIKED YOU", "year": 2022, "tracks": ["712PM", "I'M DAT N****", "KEEP IT BURNOUTE", "FOR A NUT", "PUFFIN ON ZOOTIEZ", "GOLD STACKS", "WAIT FOR U", "LOVE YOU BETTER", "MASSAGING ME", "CHICKEN LEMON RICE", "VOODOO", "HOLY GHOST", "THE WAY THINGS GOING", "I'M ON ONE", "BACK TO THE BASICS"] },
      { "title": "High Off Life", "year": 2020, "tracks": ["Trapped in the Sun", "HiTek Tek", "Touch the Sky", "Solitaires", "Ridin Strikers", "One of My", "Posted with Demons", "Hard to Choose One", "Trillionaire", "Harlem Shake", "Up the River", "Pray for a Key", "Too Comfortable", "All Bad", "Life Is Good", "Last Name", "Tycoon"] },
      { "title": "DS2 (Dirty Sprite 2)", "year": 2015, "tracks": ["Thought It Was a Drought", "I Serve the Base", "Where Ya At", "Groupies", "Lil One", "Stick Talk", "Freak Hoe", "Rotation", "Slave Master", "Blow a Bag", "Colossal", "Rich $ex", "Blood on the Money", "Trap Niggas", "The Percocet & Stripper Joint", "Real Sisters", "Fuck Up Some Commas"] },
      { "title": "FUTURE", "year": 2017, "tracks": ["Rent Money", "Good Dope", "Zoom", "Draco", "Super Trapper", "POA", "Mask Off", "High Demand", "Outta Time", "Scrape", "I'm so Groovy", "Might as Well", "Poppin' Tags", "Massage In My Room", "Feds Did a Sweep"] }
    ],
    "singles": [
      { "title": "March Madness", "year": 2015 },
      { "title": "Codeine Crazy", "year": 2014 },
      { "title": "Low Life", "year": 2016 },
      { "title": "Worst Day", "year": 2022 }
    ],
    "collaborations": [
      { "title": "Like That", "withArtist": "Metro Boomin & Kendrick Lamar", "year": 2024 },
      { "title": "WAIT FOR U", "withArtist": "Drake & Tems", "year": 2022 },
      { "title": "Life Is Good", "withArtist": "Drake", "year": 2020 }
    ]
  },

  "Travis Scott": {
    "albums": [
      { "title": "UTOPIA", "year": 2023, "tracks": ["HYAENA", "THANK GOD", "MODERN JAM", "MY EYES", "GOD'S COUNTRY", "SIRENS", "MELTDOWN", "FE!N", "DELRESTO (ECHOES)", "I KNOW ?", "TOPIA TWINS", "CIRCUS MAXIMUS", "PARASITE", "SKITZO", "LOST FOREVER", "LOOVED", "TELEKINESIS", "TIL FURTHER NOTICE"] },
      { "title": "ASTROWORLD", "year": 2018, "tracks": ["STARGAZING", "CAROUSEL", "SICKO MODE", "R.I.P. SCREW", "STOP TRYING TO BE GOD", "NO BYSTANDERS", "SKELETONS", "WAKE UP", "5% TINT", "NC-17", "ASTROTHUNDER", "YOSEMITE", "CAN'T SAY", "BUTTERFLY EFFECT", "HOUSTONFORNICATION", "COFFEE BEAN"] },
      { "title": "Birds in the Trap Sing McKnight", "year": 2016, "tracks": ["the ends", "way back", "coordinate", "through the late night", "bebs in the trap", "sdp interlude", "sweet sweet", "outside", "goosebumps", "first take", "pick up the phone", "lose", "guidance", "wonderful"] },
      { "title": "Rodeo", "year": 2015, "tracks": ["Pornography", "Oh My Dis Side", "3500", "Wasted", "90210", "Pray 4 Love", "Nightcrawler", "Piss On Your Grave", "Antidote", "Impossible", "Maria I'm Drunk", "Flying High", "I Can Tell", "Apple Pie", "Ok Alright", "Never Catch Me"] },
      { "title": "Days Before Rodeo", "year": 2014, "tracks": ["The Prayer", "Mamacita", "Quintana Pt. 2", "Drugs You Should Try It", "Don't Play", "Skyfall", "Zombies", "Sloppy Toppy", "Basement Freestyle", "Backyard", "Grey", "Bacc"] }
    ],
    "singles": [
      { "title": "HIGHEST IN THE ROOM", "year": 2019 },
      { "title": "THE SCOTTS", "year": 2020 },
      { "title": "FRANCHISE", "year": 2020 },
      { "title": "Butterfly Effect", "year": 2017 }
    ],
    "collaborations": [
      { "title": "FE!N", "withArtist": "Playboi Carti", "year": 2023 },
      { "title": "MELTDOWN", "withArtist": "Drake", "year": 2023 },
      { "title": "SICKO MODE", "withArtist": "Drake", "year": 2018 },
      { "title": "goosebumps", "withArtist": "Kendrick Lamar", "year": 2016 }
    ]
  },

  "Playboi Carti": {
    "albums": [
      { "title": "Whole Lotta Red", "year": 2020, "tracks": ["Rockstar Made", "Go2DaMoon", "Stop Breathing", "Beno!", "JumpOutTheHouse", "M3tamorphosis", "Slay3r", "No Sl33p", "New N3on", "Control", "Punk Monk", "On That Time", "King Vamp", "Place", "Sky", "Over", "ILoveUIHateU", "Die4Guy", "Not PLaying", "F33l Lik3 Dyin"] },
      { "title": "Die Lit", "year": 2018, "tracks": ["Long Time - Intro", "R.I.P.", "Lean 4 Real", "Old Money", "Love Hurts", "Shoota", "Right Now", "Poke it Out", "Fell in Luv", "Foreign", "Pull Up", "Mileage", "FlatBed Freestyle", "No Time", "Middle of the Summer", "Choppa Won't Miss", "R.I.P. Fredo (Notice Me)", "Top"] },
      { "title": "Playboi Carti", "year": 2017, "tracks": ["Location", "Magnolia", "Lookin", "wokeuplikethis*", "Let It Go", "Half & Half", "New Choppa", "Other Shit", "NO. 9", "dothatshit!", "Lame Niggas", "Yah Mean", "Flex", "Kelly K", "Had 2"] }
    ],
    "singles": [
      { "title": "ALL RED", "year": 2024 },
      { "title": "2024", "year": 2023 },
      { "title": "H00DBYAIR", "year": 2023 },
      { "title": "BACKR00MS", "year": 2024 },
      { "title": "EVILJ0RDAN", "year": 2024 },
      { "title": "KETAMINE", "year": 2024 },
      { "title": "@ MEH", "year": 2020 }
    ],
    "collaborations": [
      { "title": "CARNIVAL", "withArtist": "Kanye West & Ty Dolla $ign", "year": 2024 },
      { "title": "FE!N", "withArtist": "Travis Scott", "year": 2023 },
      { "title": "Type Shit", "withArtist": "Future, Metro Boomin & Travis Scott", "year": 2024 },
      { "title": "Shoota", "withArtist": "Lil Uzi Vert", "year": 2018 },
      { "title": "wokeuplikethis*", "withArtist": "Lil Uzi Vert", "year": 2017 }
    ]
  },

  "Taylor Swift": {
    "albums": [
      { "title": "THE TORTURED POETS DEPARTMENT", "year": 2024, "tracks": ["Fortnight", "The Tortured Poets Department", "My Boy Only Breaks His Favorite Toys", "Down Bad", "So Long, London", "But Daddy I Love Him", "Fresh Out the Slammer", "Florida!!!", "Guilty as Sin?", "Who's Afraid of Little Old Me?", "I Can Fix Him (No Really I Can)", "loml", "I Can Do It With a Broken Heart", "The Smallest Man Who Ever Lived", "The Alchemy", "Clara Bow"] },
      { "title": "Midnights", "year": 2022, "tracks": ["Lavender Haze", "Maroon", "Anti-Hero", "Snow On The Beach", "You're On Your Own, Kid", "Midnight Rain", "Question...?", "Vigilante Shit", "Bejeweled", "Karma", "Mastermind", "Karma (feat. Ice Spice)", "Hits Different"] },
      { "title": "1989 (Taylor's Version)", "year": 2023, "tracks": ["Blank Space", "Style", "Out of the Woods", "Shake It Off", "Wildest Dreams", "Bad Blood", "Clean", "Now That We Don't Talk", "Say Don't Go", "Is It Over Now?", "Slut!"] },
      { "title": "folklore", "year": 2020, "tracks": ["the 1", "cardigan", "the last great american dynasty", "exile", "my tears ricochet", "mirrorball", "seven", "august", "this is me trying", "illicit affairs", "invisible string", "betty", "peace", "hoax", "the lakes"] },
      { "title": "Lover", "year": 2019, "tracks": ["Cruel Summer", "Lover", "The Man", "The Archer", "I Think He Knows", "Paper Rings", "Cornelia Street", "Death By A Thousand Cuts", "London Boy", "Soon You'll Get Better", "False God", "You Need To Calm Down", "ME!", "Daylight"] },
      { "title": "reputation", "year": 2017, "tracks": ["...Ready For It?", "End Game", "I Did Something Bad", "Don't Blame Me", "Delicate", "Look What You Made Me Do", "Gorgeous", "Getaway Car", "King of My Heart", "Dancing With Our Hands Tied", "Dress", "Call It What You Want", "New Year's Day"] },
      { "title": "Red (Taylor's Version)", "year": 2021, "tracks": ["State of Grace", "Red", "All Too Well (10 Minute Version)", "22", "I Knew You Were Trouble", "We Are Never Ever Getting Back Together", "Nothing New", "Message In A Bottle", "I Bet You Think About Me"] }
    ],
    "singles": [
      { "title": "Cruel Summer", "year": 2019 },
      { "title": "Anti-Hero", "year": 2022 },
      { "title": "Fortnight", "year": 2024 },
      { "title": "Shake It Off", "year": 2014 },
      { "title": "Blank Space", "year": 2014 },
      { "title": "Love Story", "year": 2008 }
    ],
    "collaborations": [
      { "title": "Fortnight", "withArtist": "Post Malone", "year": 2024 },
      { "title": "exile", "withArtist": "Bon Iver", "year": 2020 },
      { "title": "Snow On The Beach", "withArtist": "Lana Del Rey", "year": 2022 },
      { "title": "Bad Blood", "withArtist": "Kendrick Lamar", "year": 2015 }
    ]
  },

  "The Weeknd": {
    "albums": [
      { "title": "After Hours", "year": 2020, "tracks": ["Alone Again", "Too Late", "Hardest to Love", "Scared to Live", "Snowchild", "Escape from LA", "Heartless", "Faith", "Blinding Lights", "In Your Eyes", "Save Your Tears", "Repeat After Me", "After Hours", "Until I Bleed Out"] },
      { "title": "Dawn FM", "year": 2022, "tracks": ["Dawn FM", "Gasoline", "How Do I Make You Love Me?", "Take My Breath", "Sacrifice", "A Tale By Quincy", "Out of Time", "Here We Go... Again", "Best Friends", "Is There Someone Else?", "Starry Eyes", "Every Angel is Terrifying", "Don't Break My Heart", "I Heard You're Married", "Less Than Zero", "Phantom Regret by Jim"] },
      { "title": "Starboy", "year": 2016, "tracks": ["Starboy", "Party Monster", "False Alarm", "Reminder", "Rockin'", "Secrets", "True Colors", "Stargirl Interlude", "Sidewalks", "Six Feet Under", "Love to Lay", "A Lonely Night", "Attention", "Ordinary Life", "Nothing Without You", "All I Know", "Die for You", "I Feel It Coming"] },
      { "title": "Beauty Behind the Madness", "year": 2015, "tracks": ["Real Life", "Losers", "Tell Your Friends", "Often", "The Hills", "Acquainted", "Can't Feel My Face", "Shameless", "Earned It", "In the Night", "As You Are", "Dark Times", "Prisoner", "Angel"] },
      { "title": "Trilogy", "year": 2012, "tracks": ["High for This", "What You Need", "House of Balloons / Glass Table Girls", "The Morning", "Wicked Games", "The Party & The After Party", "Coming Down", "Loft Music", "The Knowing", "Twenty Eight", "Lonely Star", "Life of the Party", "Trust Issues", "Rolling Stone", "Montreal", "Outside", "XO / The Host", "Initiation", "Same Old Song", "The Fall", "Next", "Till Dawn (Here Comes the Sun)"] }
    ],
    "singles": [
      { "title": "Blinding Lights", "year": 2019 },
      { "title": "Starboy", "year": 2016 },
      { "title": "The Hills", "year": 2015 },
      { "title": "Can't Feel My Face", "year": 2015 },
      { "title": "Die For You", "year": 2016 },
      { "title": "Heartless", "year": 2019 },
      { "title": "Save Your Tears", "year": 2020 }
    ],
    "collaborations": [
      { "title": "Save Your Tears (Remix)", "withArtist": "Ariana Grande", "year": 2021 },
      { "title": "Die For You (Remix)", "withArtist": "Ariana Grande", "year": 2023 },
      { "title": "Creepin'", "withArtist": "Metro Boomin & 21 Savage", "year": 2022 },
      { "title": "Starboy", "withArtist": "Daft Punk", "year": 2016 }
    ]
  },

  "Kendrick Lamar": {
    "albums": [
      { "title": "GNX", "year": 2024, "tracks": ["wacced out murals", "squabble up", "luther", "man at the garden", "heydad", "tv off", "dodge him", "reincarnated", "peekaboo", "heart pt. 6", "gnx", "gloria"] },
      { "title": "Mr. Morale & The Big Steppers", "year": 2022, "tracks": ["United in Grief", "N95", "Worldwide Steppers", "Die Hard", "Father Time", "Rich (Interlude)", "Rich Spirit", "We Cry Together", "Purple Hearts", "Count Me Out", "Crown", "Silent Hill", "Savior (Interlude)", "Savior", "Auntie Diaries", "Mr. Morale", "Mother I Sober", "Mirror"] },
      { "title": "DAMN.", "year": 2017, "tracks": ["BLOOD.", "DNA.", "YAH.", "ELEMENT.", "FEEL.", "LOYALTY.", "PRIDE.", "HUMBLE.", "LUST.", "LOVE.", "XXX.", "FEAR.", "GOD.", "DUCKWORTH."] },
      { "title": "To Pimp a Butterfly", "year": 2015, "tracks": ["Wesley's Theory", "For Free? (Interlude)", "King Kunta", "Institutionalized", "These Walls", "u", "Alright", "For Sale? (Interlude)", "Momma", "Hood Politics", "How Much a Dollar Cost", "Complexion (A Zulu Love)", "The Blacker the Berry", "You Ain't Gotta Lie", "i", "Mortal Man"] },
      { "title": "good kid, m.A.A.d city", "year": 2012, "tracks": ["Sherane a.k.a Master Splinter's Daughter", "Bitch, Don't Kill My Vibe", "Backseat Freestyle", "The Art of Peer Pressure", "Money Trees", "Poetic Justice", "good kid", "m.A.A.d city", "Swimming Pools (Drank)", "Sing About Me, I'm Dying of Thirst", "Real", "Compton"] },
      { "title": "Section.80", "year": 2011, "tracks": ["Fuck Your Ethnicity", "Hol' Up", "A.D.H.D", "No Make-Up (Her Vice)", "Tammy's Song (Her Evils)", "Chapter Six", "Ronald Reagan Era", "Poe Mans Dreams", "The Spiteful Chant", "Chapter Ten", "Keisha's Song (Her Pain)", "Rigamortis", "Kush & Corinthians", "Members Only", "Ab-Soul's Outro", "HiiiPoWeR"] }
    ],
    "singles": [
      { "title": "Not Like Us", "year": 2024 },
      { "title": "HUMBLE.", "year": 2017 },
      { "title": "Alright", "year": 2015 },
      { "title": "Swimming Pools (Drank)", "year": 2012 },
      { "title": "The Heart Part 5", "year": 2022 },
      { "title": "meet the grahams", "year": 2024 },
      { "title": "Euphoria", "year": 2024 }
    ],
    "collaborations": [
      { "title": "Like That", "withArtist": "Future & Metro Boomin", "year": 2024 },
      { "title": "Money Trees", "withArtist": "Jay Rock", "year": 2012 },
      { "title": "All The Stars", "withArtist": "SZA", "year": 2018 },
      { "title": "Family Ties", "withArtist": "Baby Keem", "year": 2021 }
    ]
  },

  "Billie Eilish": {
    "albums": [
      { "title": "HIT ME HARD AND SOFT", "year": 2024, "tracks": ["SKINNY", "LUNCH", "CHIHIRO", "BIRDS OF A FEATHER", "WILDFLOWER", "THE GREATEST", "L’AMOUR DE MA VIE", "THE DINER", "BITTERSUITE", "BLUE"] },
      { "title": "Happier Than Ever", "year": 2021, "tracks": ["Getting Older", "I Didn't Change My Number", "Billie Bossa Nova", "my future", "Oxytocin", "GOLDWING", "Lost Cause", "Halley's Comet", "Not My Responsibility", "OverHeated", "Everybody Dies", "Your Power", "NDA", "Therefore I Am", "Happier Than Ever", "Male Fantasy"] },
      { "title": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "year": 2019, "tracks": ["!!!!!!!", "bad guy", "xanny", "you should see me in a crown", "all the good girls go to hell", "wish you were gay", "when the party's over", "8", "my strange addiction", "bury a friend", "ilomilo", "listen before i go", "i love you", "goodbye"] },
      { "title": "dont smile at me", "year": 2017, "tracks": ["COPYCAT", "idontwannabeyouanymore", "my boy", "watch", "party favor", "bellyache", "ocean eyes", "hostage"] }
    ],
    "singles": [
      { "title": "BIRDS OF A FEATHER", "year": 2024 },
      { "title": "LUNCH", "year": 2024 },
      { "title": "bad guy", "year": 2019 },
      { "title": "ocean eyes", "year": 2016 },
      { "title": "What Was I Made For?", "year": 2023 },
      { "title": "everything i wanted", "year": 2019 }
    ],
    "collaborations": [
      { "title": "lovely", "withArtist": "Khalid", "year": 2018 },
      { "title": "GUESS featuring Billie Eilish", "withArtist": "Charli xcx", "year": 2024 }
    ]
  },

  "Sabrina Carpenter": {
    "albums": [
      { "title": "Short n' Sweet", "year": 2024, "tracks": ["Taste", "Please Please Please", "Good Graces", "Sharpest Tool", "Coincidence", "Bed Chem", "Espresso", "Dumb & Poetic", "Slim Pickins", "Juno", "Lie to Girls", "Don't Smile"] },
      { "title": "emails i can't send", "year": 2022, "tracks": ["emails i can't send", "Vicious", "Read your Mind", "Tornado Warnings", "because i liked a boy", "Already Over", "how many things", "bet u wanna", "Nonsense", "Fast Times", "skinny dipping", "Bad for Business", "decode", "Feather"] },
      { "title": "Singular: Act I", "year": 2018, "tracks": ["Almost Love", "Paris", "Hold Tight", "Sue Me", "prfct", "Bad Time", "Mona Lisa", "Diamonds Are a Girl's Best Friend"] }
    ],
    "singles": [
      { "title": "Espresso", "year": 2024 },
      { "title": "Please Please Please", "year": 2024 },
      { "title": "Taste", "year": 2024 },
      { "title": "Feather", "year": 2023 },
      { "title": "Nonsense", "year": 2022 }
    ],
    "collaborations": [
      { "title": "Taste (Live)", "withArtist": "Short n' Sweet Band", "year": 2024 }
    ]
  },

  "Post Malone": {
    "albums": [
      { "title": "F-1 Trillion", "year": 2024, "tracks": ["Wrong Ones", "Finer Things", "I Had Some Help", "Pour Me a Drink", "Have a Little Faith in Me", "Goes Without Saying", "Guy For That", "Nosedive", "Devil I've Been", "Never Love You Again", "Missin' You Like This", "California Sober", "Hide My Gun", "Right About You", "M-E-X-I-C-O", "Yours"] },
      { "title": "AUSTIN", "year": 2023, "tracks": ["Don't Understand", "Something Real", "Chemical", "Novacandy", "Mourning", "Too Cool to Die", "Sign Me Up", "Socialite", "Overdrive", "Speedometer", "Hold My Breath", "Enough Is Enough", "Texas Tea", "Buyer Beware", "Landmine", "Green Thumb", "Laugh It Off"] },
      { "title": "Twelve Carat Toothache", "year": 2022, "tracks": ["Reputation", "Cooped Up", "Lemon Tree", "Wrapped Around Your Finger", "I Like You (A Happier Song)", "I Cannot Be (A Sadder Song)", "Insane", "Love/Hate Letter to Alcohol", "Wasting Angels", "Euthanasia", "When I'm Alone", "Waiting for a Miracle", "One Right Now", "New Recording 12, Jan 3, 2020"] },
      { "title": "Hollywood's Bleeding", "year": 2019, "tracks": ["Hollywood's Bleeding", "Saint-Tropez", "Enemies", "Allergic", "A Thousand Bad Times", "Circles", "Die for Me", "On the Road", "Take What You Want", "I'm Gonna Be", "Staring at the Sun", "Sunflower", "Internet", "Goodbyes", "Myself", "I Know", "Wow."] },
      { "title": "beerbongs & bentleys", "year": 2018, "tracks": ["Paranoid", "Spoil My Night", "Rich & Sad", "Zack and Codeine", "Takin' Shots", "rockstar", "Over Now", "Psycho", "Better Now", "Ball for Me", "Otherside", "Stay", "Blame It on Me", "Same Bitches", "Jonestown (Interlude)", "92 Explorer", "Candy Paint", "Sugar Wraith"] },
      { "title": "Stoney", "year": 2016, "tracks": ["Broken Whiskey Glass", "Big Lie", "Deja Vu", "No Option", "Cold", "White Iverson", "I Fall Apart", "Patient", "Go Flex", "Feel", "Too Young", "Congratulations", "Up There", "Yours Truly, Austin Post"] }
    ],
    "singles": [
      { "title": "I Had Some Help", "year": 2024 },
      { "title": "Sunflower", "year": 2018 },
      { "title": "Circles", "year": 2019 },
      { "title": "rockstar", "year": 2017 },
      { "title": "Congratulations", "year": 2016 },
      { "title": "White Iverson", "year": 2015 },
      { "title": "Chemical", "year": 2023 }
    ],
    "collaborations": [
      { "title": "I Had Some Help", "withArtist": "Morgan Wallen", "year": 2024 },
      { "title": "Sunflower", "withArtist": "Swae Lee", "year": 2018 },
      { "title": "rockstar", "withArtist": "21 Savage", "year": 2017 },
      { "title": "Fortnight", "withArtist": "Taylor Swift", "year": 2024 }
    ]
  },

  # --- LATIN URBAN ---
  "Bad Bunny": {
    "albums": [
      { "title": "nadie sabe lo que va a pasar mañana", "year": 2023, "tracks": ["NADIE SABE", "MONACO", "FINA", "HIBIKI", "MR. OCTOBER", "CYBERTRUCK", "VOU 787", "SEDA", "GRACIAS POR NADA", "TELEFONO NUEVO", "BABY NUEVA", "MERCEDES CAROTA", "LOS PITS", "VUELVE CANDY B", "BATICANO", "NO ME QUIERO CASAR", "WHERE SHE GOES", "THUNDER Y LIGHTNING", "PERRO NEGRO", "EUROPA :(", "ACHO PR", "UN PREVIEW"] },
      { "title": "Un Verano Sin Ti", "year": 2022, "tracks": ["Moscow Mule", "Después de la Playa", "Me Porto Bonito", "Tití Me Preguntó", "Un Ratito", "Yo No Soy Celoso", "Tarot", "Neverita", "La Corriente", "Efecto", "Party", "Aguacero", "Enséñame a Bailar", "Ojitos Lindos", "Dos Mil 16", "El Apagón", "Otro Atardecer", "Un Coco", "Andrea", "Me Fui de Vacaciones", "Un Verano Sin Ti", "Agosto", "Callaíta"] },
      { "title": "EL ÚLTIMO TOUR DEL MUNDO", "year": 2020, "tracks": ["El Mundo es Mío", "Te Mudaste", "Hoy Cobré", "Maldita Pobreza", "La Noche de Anoche", "Sorry Papi", "120", "Antes Que Se Acabe", "Yo Visto Así", "HÁBLAME DE TI", "TE DESEO LO MEJOR", "MANUEL", "TRELLAS", "VOY A COBRAR", "CANTARES DE NAVIDAD"] },
      { "title": "YHLQMDLG", "year": 2020, "tracks": ["Si Veo a Tu Mamá", "La Difícil", "Pero Ya No", "La Santa", "Yo Perreo Sola", "Bichiyal", "Soliá", "La Zona", "Que Malo", "Vete", "Ignorantes", "A Tu Merced", "Una Vez", "Safaera", "25/8", "Está Cabrón Ser Yo", "Puesto Pa' Guerreal", "P FKN R", "Hablamos Mañana", "<3"] },
      { "title": "X 100PRE", "year": 2018, "tracks": ["Ni Bien Ni Mal", "200 MPH", "¿Quién Tú Eres?", "Caro", "Tenemos Que Hablar", "Otra Noche en Miami", "Ser Bichote", "Si Estuviésemos Juntos", "Solo de Mí", "Cuando Perriabas", "La Romana", "Como Antes", "RLNDT", "Estamos Bien", "MIA"] }
    ],
    "singles": [
      { "title": "MONACO", "year": 2023 },
      { "title": "WHERE SHE GOES", "year": 2023 },
      { "title": "Tití Me Preguntó", "year": 2022 },
      { "title": "Me Porto Bonito", "year": 2022 },
      { "title": "Dakiti", "year": 2020 },
      { "title": "Safaera", "year": 2020 },
      { "title": "Yonaguni", "year": 2021 },
      { "title": "Soy Peor", "year": 2016 }
    ],
    "collaborations": [
      { "title": "un x100to", "withArtist": "Grupo Frontera", "year": 2023 },
      { "title": "PERRO NEGRO", "withArtist": "Feid", "year": 2023 },
      { "title": "Me Porto Bonito", "withArtist": "Chencho Corleone", "year": 2022 },
      { "title": "La Jumpa", "withArtist": "Arcángel", "year": 2022 },
      { "title": "Ojitos Lindos", "withArtist": "Bomba Estéreo", "year": 2022 },
      { "title": "MIA", "withArtist": "Drake", "year": 2018 }
    ]
  },

  "Karol G": {
    "albums": [
      { "title": "MAÑANA SERÁ BONITO (BICHOTA SEASON)", "year": 2023, "tracks": ["BICHOTAG", "OKI DOKI", "MI EX TENÍA RAZÓN", "S91", "QLONA", "UNA NOCHE EN MEDELLÍN (REMIX)", "ME TENGO QUE IR", "GATITA GANGSTER", "DISPO", "PROVENZA (REMIX)"] },
      { "title": "MAÑANA SERÁ BONITO", "year": 2023, "tracks": ["MIENTRAS ME CURO DEL CORA", "X SI VOLVEMOS", "PERO TÚ", "BESTIES", "GUCCI LOS PAÑOS", "TQG", "TUS GAFITAS", "OJOS FERRARI", "MERCURIO", "GATÚBELA", "KÁRMIKA", "PROVENZA", "CAROLINA", "DAÑAMOS LA AMISTAD", "AMARGURA", "CAIRO", "MAÑANA SERÁ BONITO"] },
      { "title": "KG0516", "year": 2021, "tracks": ["Déjalos Que Miren", "El Makinon", "Poblado (Remix)", "Contigo Voy a Muerte", "DVD", "200 Copas", "Bichota", "Sola Es Mejor", "Arranca Pal Carajo", "Ay, DiOs Mío!", "Gato Malo", "Odisea", "Tusa", "Location", "Leyendas", "Beautiful Boy"] },
      { "title": "Ocean", "year": 2019, "tracks": ["Ocean", "Punto G", "Love With a Quality", "Baby", "Sin Corazón", "Dices Que Te Vas", "Pineapple", "La Vida Continuó", "Bebesita", "Culpables", "Mi Cama", "Créeme", "Go Karo"] }
    ],
    "singles": [
      { "title": "Si Antes Te Hubiera Conocido", "year": 2024 },
      { "title": "PROVENZA", "year": 2022 },
      { "title": "TQG", "year": 2023 },
      { "title": "Tusa", "year": 2019 },
      { "title": "Bichota", "year": 2020 },
      { "title": "MI EX TENÍA RAZÓN", "year": 2023 },
      { "title": "QLONA", "year": 2023 },
      { "title": "Amargura", "year": 2023 }
    ],
    "collaborations": [
      { "title": "TQG", "withArtist": "Shakira", "year": 2023 },
      { "title": "QLONA", "withArtist": "Peso Pluma", "year": 2023 },
      { "title": "Tusa", "withArtist": "Nicki Minaj", "year": 2019 },
      { "title": "MAMIII", "withArtist": "Becky G", "year": 2022 }
    ]
  },

  "Feid": {
    "albums": [
      { "title": "FERXXOCALIPSIS", "year": 2023, "tracks": ["ALAKRAN", "50 PALOS", "LA BABY", "LUNA", "ESQUIRLAS", "DESQUITATE", "YO AK", "CLASSY 101", "INTERLUDE"] },
      { "title": "MOR, No Le Temas a la Oscuridad", "year": 2023, "tracks": ["VOL 2", "VENTE CONMIGO", "NINJA", "BUBONAL", "LUCES DE TECNO", "EY CHORRO", "VELOCIDAD CRUCERO", "ROMÁNTICOS DE LUNES", "GANGSTERS Y PISTOLAS", "FERXXO 151", "ATALAYA", "PRIVILEGIOS"] },
      { "title": "Feliz Cumpleaños Ferxxo Te Pirateamos El Álbum", "year": 2022, "tracks": ["Intro Feid", "Castigo", "Feliz Cumpleaños Ferxxo", "Nieve", "Ferxxo 100", "Belixe", "XQ Te Pones Así", "Aguante", "Lady Mi Amor", "Quemando Calorías", "Prohibidox", "Lady", "Normal", "La Buena Fai"] },
      { "title": "INTER SHIBUYA - LA MAFIA", "year": 2021, "tracks": ["Si Tú Supieras", "Fumeteo", "Chimbita", "Tengo Fe", "Como Cuando", "Jordan IV", "HNDX", "Purrito APA", "Vacaxiones", "14 de Febrero", "Pantysito"] }
    ],
    "singles": [
      { "title": "LUNA", "year": 2023 },
      { "title": "CLASSY 101", "year": 2023 },
      { "title": "Feliz Cumpleaños Ferxxo", "year": 2022 },
      { "title": "Normal", "year": 2022 },
      { "title": "Yandel 150", "year": 2022 },
      { "title": "Chorrito Pa Las Animas", "year": 2022 }
    ],
    "collaborations": [
      { "title": "PERRO NEGRO", "withArtist": "Bad Bunny", "year": 2023 },
      { "title": "CLASSY 101", "withArtist": "Young Miko", "year": 2023 },
      { "title": "Yandel 150", "withArtist": "Yandel", "year": 2022 },
      { "title": "Hey Mor", "withArtist": "Ozuna", "year": 2022 }
    ]
  },

  "Rauw Alejandro": {
    "albums": [
      { "title": "COSA NUESTRA", "year": 2024, "tracks": ["PASAPORTE", "TOUCHING THE SKY", "DÉJAME ENTRAR", "QUÉ PASARÍA...", "SE FUE", "AMAR DE NUEVO", "REVOLÚ", "MIL MUJERES", "KHÉ?"] },
      { "title": "PLAYA SATURNO", "year": 2023, "tracks": ["PLAYA SATURNO INTRO", "BABY HELLO", "NO ME LA MOLESTE", "AL CALLAO", "POPOXE", "CELEBRANDO", "NO ME SORPRENDE", "DILUVIO", "HOY AQUÍ", "PICARDÍA", "TIERRA ZAPATILLA"] },
      { "title": "SATURNO", "year": 2022, "tracks": ["SATURNO", "PUNTO 40", "MÁS DE UNA VEZ", "LEJOS DEL CIELO", "DE CAROLINA", "DIME QUIÉN????", "CORAZÓN DESPEINADO", "DEJAU'", "GATAS", "LOKERA", "VERDE MENTA", "RON COLA"] },
      { "title": "VICE VERSA", "year": 2021, "tracks": ["2/Catorce", "Todo de Ti", "Sexo Virtual", "Nubes", "La Old Skul", "Aquel Nap ZzZ", "Cúrame", "Cuentas Claras", "Tengo Un Pal", "Desesperados", "2/14"] },
      { "title": "Afrodisíaco", "year": 2020, "tracks": ["Afrodisíaco", "Reloj", "No Te Creo", "Soy Una Gárgola", "Pensándote", "Perreo Pesau'", "Elegí", "Ponte Pa' Mí", "Algo Mágico", "De Cora <3", "Enchule"] }
    ],
    "singles": [
      { "title": "Todo de Ti", "year": 2021 },
      { "title": "PUNTO 40", "year": 2022 },
      { "title": "LOKERA", "year": 2022 },
      { "title": "Desesperados", "year": 2021 },
      { "title": "2/Catorce", "year": 2021 },
      { "title": "BABY HELLO", "year": 2023 },
      { "title": "Tattoo", "year": 2020 }
    ],
    "collaborations": [
      { "title": "Beso", "withArtist": "Rosalía", "year": 2023 },
      { "title": "Desesperados", "withArtist": "Chencho Corleone", "year": 2021 },
      { "title": "Reloj", "withArtist": "Anuel AA", "year": 2020 },
      { "title": "Party", "withArtist": "Bad Bunny", "year": 2022 },
      { "title": "BABY HELLO", "withArtist": "Bizarrap", "year": 2023 }
    ]
  }
}
