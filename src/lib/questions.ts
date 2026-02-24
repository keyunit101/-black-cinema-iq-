export const CIRCUMFERENCE = 2 * Math.PI * 20; // r=20 → 125.66

export const TIMER_SECS: Record<number, number> = { 1: 20, 2: 18, 3: 15, 4: 12, 5: 10 };

export interface Movie {
  id: string;
  title: string;
  year: number;
  color: string;
}

export const MOVIES: Record<string, Movie> = {
  boyz:    { id: 'boyz',    title: "Boyz N the Hood",      year: 1991, color: '#FF2D55' },
  setitoff:{ id: 'setitoff',title: "Set It Off",           year: 1996, color: '#FFB800' },
  friday:  { id: 'friday',  title: "Friday",               year: 1995, color: '#00E676' },
  america: { id: 'america', title: "Coming to America",    year: 1988, color: '#9C27B0' },
  newjack: { id: 'newjack', title: "New Jack City",        year: 1991, color: '#2196F3' },
  exhale:  { id: 'exhale',  title: "Waiting to Exhale",    year: 1995, color: '#FF6B9D' },
  love:    { id: 'love',    title: "Love Jones",           year: 1997, color: '#FF6B00' },
  players: { id: 'players', title: "The Players Club",     year: 1998, color: '#00BCD4' },
  belly:   { id: 'belly',   title: "Belly",                year: 1998, color: '#E91E63' },
  sugar:   { id: 'sugar',   title: "Brown Sugar",          year: 2002, color: '#CD853F' },
  baps:    { id: 'baps',    title: "B.A.P.S.",             year: 1997, color: '#FF9800' },
  player2: { id: 'player2', title: "How to Be a Player",   year: 1997, color: '#8BC34A' },
};

export interface Question {
  id: number;
  cat: string;
  diff: number;
  type: string;
  q: string;
  opts: string[];
  ans: number;
  explain: string;
}

export const ALL_QUESTIONS: Question[] = [
  // ── BOYZ N THE HOOD ──────────────────────────────────────────────
  {
    id: 1, cat: 'boyz', diff: 1, type: 'Character Check',
    q: "What is Tre's father's name in Boyz N the Hood?",
    opts: ['Jason Styles', 'Furious Styles', 'Marcus Styles', 'Raymond Styles'],
    ans: 1,
    explain: "Furious Styles (Laurence Fishburne) is Tre's father — a mentor figure whose name mirrors his parenting style."
  },
  {
    id: 2, cat: 'boyz', diff: 2, type: 'Plot Detail',
    q: "What sport did Ricky Baker play, drawing recruitment interest from USC?",
    opts: ['Basketball', 'Track', 'Football', 'Baseball'],
    ans: 2,
    explain: "Ricky was a gifted football player being recruited by USC, making his death all the more tragic."
  },
  {
    id: 3, cat: 'boyz', diff: 3, type: 'Deep Cut',
    q: "What statistic appears on screen at the very opening of Boyz N the Hood?",
    opts: [
      '1 in 10 Black men will be murdered',
      '1 in 21 Black men will be murdered',
      '1 in 5 Black men will be incarcerated',
      '2 in 3 Black youth live in poverty'
    ],
    ans: 1,
    explain: "'1 in 21 Black American males will be murdered in their lifetime' — a sobering stat John Singleton placed before a single frame of film."
  },
  {
    id: 4, cat: 'boyz', diff: 2, type: 'Behind the Lens',
    q: "How old was John Singleton when he received his Oscar nomination for Boyz N the Hood, making him the youngest nominee ever at the time?",
    opts: ['21', '23', '25', '27'],
    ans: 1,
    explain: "At 23, Singleton became the youngest Best Director nominee and the first Black filmmaker nominated in that category."
  },
  {
    id: 5, cat: 'boyz', diff: 3, type: 'Character Check',
    q: "What is Doughboy's real name?",
    opts: ['DeShawn Baker', 'Damon Baker', 'Darren Baker', 'Derrick Baker'],
    ans: 2,
    explain: "Doughboy's government name is Darren Baker — Ice Cube's breakout film role in a career-defining performance."
  },
  {
    id: 6, cat: 'boyz', diff: 4, type: 'Iconic Moment',
    q: "Who plays Brandi, Tre's girlfriend in Boyz N the Hood?",
    opts: ['Regina King', 'Nia Long', 'Thandiwe Newton', 'Jada Pinkett'],
    ans: 1,
    explain: "Nia Long played Brandi — she would later appear in Friday as Debbie, making her a queen of 90s Black cinema."
  },

  // ── SET IT OFF ────────────────────────────────────────────────────
  {
    id: 7, cat: 'setitoff', diff: 1, type: 'Character Check',
    q: "Who is the mastermind of the bank robberies in Set It Off, and why is she fired from the bank?",
    opts: [
      'Stony — her brother was killed',
      'Frankie — suspected of being an inside man on a robbery at her bank',
      'Cleo — caught stealing from the register',
      'T.T. — fired for missing shifts'
    ],
    ans: 1,
    explain: "Frankie (Vivica A. Fox) is fired from her bank job after being falsely accused of helping rob it — sparking her path to crime."
  },
  {
    id: 8, cat: 'setitoff', diff: 2, type: 'Plot Detail',
    q: "What motivates Stony to join the crew in Set It Off?",
    opts: [
      'She loses her apartment',
      'Her brother Stevie is killed by police',
      'She is fired from her job',
      'She wants to escape an abusive relationship'
    ],
    ans: 1,
    explain: "Stony's younger brother Stevie is wrongfully shot by police, sending her into a spiral of grief and rage that fuels the robbery plan."
  },
  {
    id: 9, cat: 'setitoff', diff: 1, type: 'Character Check',
    q: "Which character is the fearless getaway driver in Set It Off?",
    opts: ['Stony', 'Frankie', 'T.T.', 'Cleo'],
    ans: 3,
    explain: "Cleo (Queen Latifah) handles the wheel with reckless abandon — her arc is one of the most memorable in the film."
  },
  {
    id: 10, cat: 'setitoff', diff: 3, type: 'Deep Cut',
    q: "What is the name of the cleaning company where the women work in Set It Off?",
    opts: ['CleanPro Services', 'EZ Kleen', 'Sparkle & Shine', 'Metro Clean'],
    ans: 1,
    explain: "EZ Kleen is the janitorial company — their access to offices helps them case banks and fuels the robbery plans."
  },
  {
    id: 11, cat: 'setitoff', diff: 2, type: 'Behind the Lens',
    q: "Who directed Set It Off — and also directed Friday the same year?",
    opts: ['John Singleton', 'Mario Van Peebles', 'F. Gary Gray', 'Spike Lee'],
    ans: 2,
    explain: "F. Gary Gray directed both Friday and Set It Off in 1995-96, cementing himself as a pivotal voice in Black cinema."
  },

  // ── FRIDAY ────────────────────────────────────────────────────────
  {
    id: 12, cat: 'friday', diff: 1, type: 'Plot Detail',
    q: "Why is Smokey in serious trouble in Friday?",
    opts: [
      'He shot Big Worm',
      'He smoked $200 worth of Big Worm\'s product he was supposed to sell',
      'He owes rent money to Deebo',
      'He got fired from the same job as Craig'
    ],
    ans: 1,
    explain: "Smokey smoked the weed instead of selling it — now Big Worm wants his $200 back by 10pm or else."
  },
  {
    id: 13, cat: 'friday', diff: 1, type: 'Character Check',
    q: "What is the neighborhood bully's name in Friday?",
    opts: ['Big Worm', 'Deebo', 'Pastor Clever', 'Red'],
    ans: 1,
    explain: "Deebo (Tommy 'Tiny' Lister Jr.) terrorizes the block, stealing bikes and gold chains — until Craig finally stands up to him."
  },
  {
    id: 14, cat: 'friday', diff: 1, type: 'Who Said It?',
    q: "Who delivers the iconic line 'You got knocked the f*** out!' in Friday?",
    opts: ['Craig (Ice Cube)', 'Smokey (Chris Tucker)', 'Deebo (Tommy Lister)', 'Big Worm'],
    ans: 1,
    explain: "Smokey's commentary after Craig knocks out Deebo is one of the most quoted lines in 90s comedy history."
  },
  {
    id: 15, cat: 'friday', diff: 3, type: 'Deep Cut',
    q: "How quickly was the Friday script reportedly written?",
    opts: ['3 days', '3 weeks', '3 months', 'Over a weekend'],
    ans: 1,
    explain: "Ice Cube co-wrote Friday with DJ Pooh in about 3 weeks — the speed shows in its loose, improvisational energy."
  },
  {
    id: 16, cat: 'friday', diff: 2, type: 'Behind the Lens',
    q: "Who co-wrote the Friday screenplay with Ice Cube?",
    opts: ['F. Gary Gray', 'DJ Quik', 'DJ Pooh', 'Dr. Dre'],
    ans: 2,
    explain: "DJ Pooh (Mark Jordan) co-wrote Friday with Ice Cube — he also appeared in the film as a character."
  },
  {
    id: 17, cat: 'friday', diff: 2, type: 'Iconic Moment',
    q: "How much time does the entire story of Friday take place over?",
    opts: ['One full weekend', 'One Friday', 'One week', 'From Friday to Sunday'],
    ans: 1,
    explain: "The entire film unfolds on a single Friday — from morning hangouts to the climactic showdown with Deebo."
  },

  // ── COMING TO AMERICA ─────────────────────────────────────────────
  {
    id: 18, cat: 'america', diff: 1, type: 'Plot Detail',
    q: "What is the fictional African kingdom Prince Akeem comes from in Coming to America?",
    opts: ['Wakanda', 'Zamunda', 'Genovia', 'Sangala'],
    ans: 1,
    explain: "Zamunda is the opulent fictional kingdom — its luxury is a comedic contrast to the Queens, NY apartment Akeem ends up in."
  },
  {
    id: 19, cat: 'america', diff: 1, type: 'Plot Detail',
    q: "Why does Prince Akeem choose to go to Queens, New York specifically?",
    opts: [
      'His father the king suggested it',
      'He heard it had the best soul food',
      'A queen must come from Queens',
      'His friend Semmi had family there'
    ],
    ans: 2,
    explain: "'I seek a queen — so I shall go to Queens.' Akeem's reasoning is charmingly literal and perfectly absurd."
  },
  {
    id: 20, cat: 'america', diff: 2, type: 'Character Check',
    q: "Who plays Morris, Lisa's preppy boyfriend in Coming to America — notably NOT Eddie Murphy?",
    opts: ['Samuel L. Jackson', 'Eriq La Salle', 'Arsenio Hall', 'John Amos'],
    ans: 1,
    explain: "Eriq La Salle played the insufferable Morris — one of the few main characters Eddie Murphy did NOT play in this film."
  },
  {
    id: 21, cat: 'america', diff: 2, type: 'Deep Cut',
    q: "What is the name of the fast food restaurant in Coming to America that parodies McDonald's?",
    opts: ["King McDougal's", "McDowell's", "McBurger's", "Royal Burger"],
    ans: 1,
    explain: "McDowell's — owner Cleo McDowell insists the golden arches are just 'the golden arcs' and the Big Mac is the Big Mick."
  },
  {
    id: 22, cat: 'america', diff: 3, type: 'Iconic Moment',
    q: "The band 'Sexual Chocolate' performing at the charity ball parodies which legendary performer?",
    opts: ['Marvin Gaye', 'Al Green', 'James Brown', 'Wilson Pickett'],
    ans: 2,
    explain: "Sexual Chocolate's flamboyant lead singer is a direct parody of James Brown — complete with cape and shrieking falsetto."
  },

  // ── NEW JACK CITY ─────────────────────────────────────────────────
  {
    id: 23, cat: 'newjack', diff: 1, type: 'Character Check',
    q: "Who plays the ruthless drug lord Nino Brown in New Jack City?",
    opts: ['Ice-T', 'Chris Rock', 'Mario Van Peebles', 'Wesley Snipes'],
    ans: 3,
    explain: "Wesley Snipes delivered a chilling performance as Nino Brown — making him one of cinema's most stylish villains."
  },
  {
    id: 24, cat: 'newjack', diff: 2, type: 'Character Check',
    q: "Which future comedy star plays Pookie, the undercover addict in New Jack City?",
    opts: ['Dave Chappelle', 'Martin Lawrence', 'Chris Rock', 'Damon Wayans'],
    ans: 2,
    explain: "Chris Rock's Pookie is a tragic, darkly funny role — his performance showed dramatic range before his standup fame exploded."
  },
  {
    id: 25, cat: 'newjack', diff: 2, type: 'Plot Detail',
    q: "What is the name of the apartment complex Nino Brown takes over as his drug empire's headquarters?",
    opts: ['The Tower', 'The Carter', 'The Fortress', 'The Complex'],
    ans: 1,
    explain: "The Carter is Nino's fortress — his takeover of the entire building to run crack operations was inspired by real events."
  },
  {
    id: 26, cat: 'newjack', diff: 2, type: 'Behind the Lens',
    q: "Who directed New Jack City and also played a detective in the film?",
    opts: ['John Singleton', 'Spike Lee', 'Mario Van Peebles', 'Ernest Dickerson'],
    ans: 2,
    explain: "Mario Van Peebles directed AND starred as Detective Stone — a rare director-actor double for a Black filmmaker at that scale."
  },
  {
    id: 27, cat: 'newjack', diff: 3, type: 'Who Said It?',
    q: "Complete Nino Brown's iconic line: 'Sit your five-dollar ass down before I...'",
    opts: [
      '...put you in the ground',
      '...make change',
      '...send you home in a bag',
      '...end your whole career'
    ],
    ans: 1,
    explain: "'Sit your five-dollar ass down before I make change' — Wesley Snipes delivered this with such cold menace it became legendary."
  },

  // ── WAITING TO EXHALE ─────────────────────────────────────────────
  {
    id: 28, cat: 'exhale', diff: 1, type: 'Iconic Moment',
    q: "Which character burns her cheating husband's car and clothes in Waiting to Exhale?",
    opts: ['Gloria', 'Savannah', 'Robin', 'Bernadine'],
    ans: 3,
    explain: "Bernadine (Angela Bassett) torches her husband's BMW and designer wardrobe after he leaves her for a white woman — one of cinema's greatest revenge scenes."
  },
  {
    id: 29, cat: 'exhale', diff: 1, type: 'Who Said It?',
    q: "Who sang 'Exhale (Shoop Shoop)' and also starred in the film?",
    opts: ['Toni Braxton', 'Mary J. Blige', 'Whitney Houston', 'Mariah Carey'],
    ans: 2,
    explain: "Whitney Houston starred as Savannah AND sang the iconic theme song — her voice and presence defined the film's emotional core."
  },
  {
    id: 30, cat: 'exhale', diff: 2, type: 'Behind the Lens',
    q: "Waiting to Exhale is based on a novel by which author?",
    opts: ['Toni Morrison', 'Alice Walker', 'Terry McMillan', 'Zora Neale Hurston'],
    ans: 2,
    explain: "Terry McMillan's 1992 bestselling novel gave four Black women's love lives the same cinematic weight usually reserved for white stories."
  },
  {
    id: 31, cat: 'exhale', diff: 3, type: 'Deep Cut',
    q: "Who directed Waiting to Exhale?",
    opts: ['John Singleton', 'Forest Whitaker', 'Spike Lee', 'Carl Franklin'],
    ans: 1,
    explain: "Forest Whitaker directed Waiting to Exhale — proving his artistry extended far beyond acting."
  },

  // ── LOVE JONES ────────────────────────────────────────────────────
  {
    id: 32, cat: 'love', diff: 1, type: 'Character Check',
    q: "Who plays the leads Darius and Nina in Love Jones?",
    opts: [
      'Morris Chestnut and Nia Long',
      'Larenz Tate and Nia Long',
      'Larenz Tate and Jada Pinkett',
      'Omar Epps and Nia Long'
    ],
    ans: 1,
    explain: "Larenz Tate and Nia Long had undeniable chemistry as Darius and Nina — arguably the most soulful Black romance put on screen."
  },
  {
    id: 33, cat: 'love', diff: 2, type: 'Iconic Moment',
    q: "What is the name of the spoken word venue where Darius performs a poem for Nina in Love Jones?",
    opts: ['The Spot', 'The Drum', 'The Loft', 'The Stage'],
    ans: 1,
    explain: "The Drum is the Chicago spoken word venue where Darius improvises a poem about Nina — the film's most beloved scene."
  },
  {
    id: 34, cat: 'love', diff: 3, type: 'Behind the Lens',
    q: "Love Jones marked the directorial debut of which filmmaker?",
    opts: ['George Tillman Jr.', 'Theodore Witcher', 'Kasi Lemmons', 'Malcolm Lee'],
    ans: 1,
    explain: "Theodore Witcher wrote and directed Love Jones as his debut — its critical reception made his disappearance from Hollywood more puzzling."
  },

  // ── THE PLAYERS CLUB ─────────────────────────────────────────────
  {
    id: 35, cat: 'players', diff: 1, type: 'Behind the Lens',
    q: "The Players Club was written and directed by Ice Cube — and he also played what character?",
    opts: ['Club owner DJ Dollar Bill', 'Club owner DJ Ebony', 'Security guard Reggie', 'Club owner DJ Gold'],
    ans: 1,
    explain: "Ice Cube played DJ Ebony, the club owner — making The Players Club his directorial debut, a rare triple threat performance."
  },
  {
    id: 36, cat: 'players', diff: 1, type: 'Character Check',
    q: "Who plays Diana 'Diamond' Armstrong in The Players Club, in her film debut?",
    opts: ['Jada Pinkett Smith', 'Vivica A. Fox', 'LisaRaye McCoy', 'Meagan Good'],
    ans: 2,
    explain: "LisaRaye McCoy made her film debut as Diamond — the role launched her career and became her signature."
  },
  {
    id: 37, cat: 'players', diff: 3, type: 'Deep Cut',
    q: "Which comedian has a memorable early role in The Players Club as Clyde?",
    opts: ['Bernie Mac', 'Cedric the Entertainer', 'Steve Harvey', 'D.L. Hughley'],
    ans: 0,
    explain: "Bernie Mac brought his fierce comedic energy to The Players Club — his scenes are among the most quotable in the film."
  },

  // ── BELLY ─────────────────────────────────────────────────────────
  {
    id: 38, cat: 'belly', diff: 1, type: 'Behind the Lens',
    q: "Who directed Belly, making his feature film debut?",
    opts: ['Spike Jonze', 'Hype Williams', 'Michel Gondry', 'Dave Meyers'],
    ans: 1,
    explain: "Hype Williams, the legendary music video director known for his fish-eye lens style, made Belly his debut feature."
  },
  {
    id: 39, cat: 'belly', diff: 1, type: 'Character Check',
    q: "Which two rap legends star as Tommy and Sincere in Belly?",
    opts: [
      'Jay-Z and Nas',
      'DMX and Nas',
      'DMX and Method Man',
      'Ja Rule and DMX'
    ],
    ans: 1,
    explain: "DMX plays the volatile Tommy and Nas plays the more reflective Sincere — their dynamic drives the film's moral tension."
  },
  {
    id: 40, cat: 'belly', diff: 3, type: 'Iconic Moment',
    q: "What is distinctive about Belly's opening robbery scene that makes it visually iconic?",
    opts: [
      'Shot in slow motion with no music',
      'Filmed in infrared with a red night-vision style',
      'Entirely in black and white',
      'Shot entirely from a bird\'s-eye view'
    ],
    ans: 1,
    explain: "Hype Williams opened Belly with a stunning infrared red night-vision aesthetic — instantly establishing the film's unique visual identity."
  },
  {
    id: 41, cat: 'belly', diff: 3, type: 'Plot Detail',
    q: "What spiritual movement does Sincere become drawn to in Belly?",
    opts: ['Christianity', 'Islam (general)', 'Nation of Islam', 'Five-Percent Nation'],
    ans: 2,
    explain: "Sincere is drawn toward the Nation of Islam — representing the film's recurring theme of seeking purpose beyond street life."
  },

  // ── BROWN SUGAR ──────────────────────────────────────────────────
  {
    id: 42, cat: 'sugar', diff: 1, type: 'Character Check',
    q: "What is Sidney's profession in Brown Sugar?",
    opts: [
      'Music producer',
      'Hip-hop journalist and magazine editor',
      'Radio DJ',
      'Record label A&R'
    ],
    ans: 1,
    explain: "Sidney (Sanaa Lathan) is a hip-hop journalist who becomes editor of a magazine — her love of hip-hop mirrors her love for Dre."
  },
  {
    id: 43, cat: 'sugar', diff: 2, type: 'Behind the Lens',
    q: "Brown Sugar was directed by George Tillman Jr., who also directed which other classic Black film?",
    opts: ['Love Jones', 'Soul Food (1997)', 'The Wood', 'Love & Basketball'],
    ans: 1,
    explain: "George Tillman Jr. directed Soul Food (1997) before Brown Sugar — establishing him as a chronicler of Black family and romance."
  },
  {
    id: 44, cat: 'sugar', diff: 3, type: 'Deep Cut',
    q: "Which two hip-hop artists have cameos in Brown Sugar?",
    opts: [
      'Jay-Z and Alicia Keys',
      'Mos Def and Common',
      'Talib Kweli and Erykah Badu',
      'Q-Tip and De La Soul'
    ],
    ans: 1,
    explain: "Mos Def and Common both appear in Brown Sugar, lending the film authentic hip-hop credibility alongside its romantic storyline."
  },

  // ── B.A.P.S. ─────────────────────────────────────────────────────
  {
    id: 45, cat: 'baps', diff: 1, type: 'Deep Cut',
    q: "What does B.A.P.S. stand for?",
    opts: [
      'Black and Proud Sisters',
      'Bold and Powerful Sisters',
      'Black American Princesses',
      'Beautiful and Proud Sisters'
    ],
    ans: 2,
    explain: "B.A.P.S. = Black American Princesses — the title perfectly captures the film's mix of culture clash comedy and heart."
  },
  {
    id: 46, cat: 'baps', diff: 1, type: 'Character Check',
    q: "Who plays Nisi in B.A.P.S., in a role that predates her Oscar win by several years?",
    opts: ['Whoopi Goldberg', 'Angela Bassett', 'Halle Berry', 'Jada Pinkett Smith'],
    ans: 2,
    explain: "Halle Berry played Nisi in B.A.P.S. (1997) — years before she became the first Black woman to win the Best Actress Oscar in 2002."
  },
  {
    id: 47, cat: 'baps', diff: 3, type: 'Behind the Lens',
    q: "B.A.P.S. was directed by Robert Townsend, who also directed which 1987 Hollywood satire?",
    opts: ['She\'s Gotta Have It', 'Hollywood Shuffle', 'I\'m Gonna Git You Sucka', 'Boomerang'],
    ans: 1,
    explain: "Robert Townsend's Hollywood Shuffle (1987) — which he financed on credit cards — was a sharp satire of Black Hollywood stereotypes."
  },

  // ── HOW TO BE A PLAYER ───────────────────────────────────────────
  {
    id: 48, cat: 'player2', diff: 1, type: 'Character Check',
    q: "Who plays Dray, the smooth-talking player at the center of How to Be a Player?",
    opts: ['Morris Chestnut', 'Bill Bellamy', 'Jamie Foxx', 'Bokeem Woodbine'],
    ans: 1,
    explain: "Bill Bellamy starred as Dray — the role cemented his transition from MTV VJ to leading man."
  },
  {
    id: 49, cat: 'player2', diff: 2, type: 'Plot Detail',
    q: "How does Dray's sister Lisa ultimately expose his player lifestyle in How to Be a Player?",
    opts: [
      'She calls each woman individually',
      'She outs him on live radio',
      'She gets all his women to show up at the same party',
      'She posts his phone book in the neighborhood'
    ],
    ans: 2,
    explain: "Lisa orchestrates the ultimate takedown: getting ALL of Dray's women to show up at the same party simultaneously."
  },
  {
    id: 50, cat: 'player2', diff: 3, type: 'Behind the Lens',
    q: "How to Be a Player was produced by the Hudlin Brothers (Warrington & Reginald). Which two earlier classic Black films did they also produce?",
    opts: [
      'Do the Right Thing and Jungle Fever',
      'House Party and Boomerang',
      'Menace II Society and Friday',
      'New Jack City and Juice'
    ],
    ans: 1,
    explain: "The Hudlin Brothers produced House Party (1990) and Boomerang (1992) — establishing themselves as architects of Black 90s comedy."
  },

  // ── CROSS-FILM BONUS ──────────────────────────────────────────────
  {
    id: 51, cat: 'all', diff: 2, type: 'Hidden Detail',
    q: "Nia Long appeared in two films on this list. Which ones?",
    opts: [
      'Boyz N the Hood and Set It Off',
      'Boyz N the Hood and Friday',
      'Friday and Love Jones',
      'Love Jones and Brown Sugar'
    ],
    ans: 1,
    explain: "Nia Long played Brandi in Boyz N the Hood (1991) and Debbie in Friday (1995) — two iconic 90s Black films, two iconic roles."
  },
  {
    id: 52, cat: 'all', diff: 3, type: 'Behind the Lens',
    q: "Ice Cube has a remarkable connection to three films on this list. Which three?",
    opts: [
      'Wrote Boyz N the Hood + starred in Friday + directed Belly',
      'Wrote Boyz N the Hood + wrote/starred in Friday + wrote/directed/starred in The Players Club',
      'Starred in Friday + directed Set It Off + produced New Jack City',
      'Co-wrote New Jack City + starred in Friday + directed B.A.P.S.'
    ],
    ans: 1,
    explain: "Ice Cube wrote Boyz N the Hood (tho he didn't direct), co-wrote/starred in Friday, then wrote/directed/starred in The Players Club — a legendary triple threat run."
  },
  {
    id: 53, cat: 'all', diff: 2, type: 'Deep Cut',
    q: "Which film on this list had the highest US box office gross, earning over $128 million in 1988?",
    opts: ['Boyz N the Hood', 'New Jack City', 'Coming to America', 'Friday'],
    ans: 2,
    explain: "Coming to America grossed over $128M domestically in 1988 — a blockbuster that proved Black-led films could dominate the mainstream."
  },
  {
    id: 54, cat: 'all', diff: 4, type: 'Who Said It?',
    q: "Match the quote to the film: 'You got knocked the f*** out' vs. 'Sit your five-dollar ass down before I make change' — which films are these from, respectively?",
    opts: [
      'New Jack City / Friday',
      'Friday / New Jack City',
      'Set It Off / Belly',
      'Boyz N the Hood / New Jack City'
    ],
    ans: 1,
    explain: "'You got knocked out' = Smokey in Friday. 'Five-dollar ass' = Nino Brown in New Jack City. Two of the most quoted lines of 90s Black cinema."
  },
];
