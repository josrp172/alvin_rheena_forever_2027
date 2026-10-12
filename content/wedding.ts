/**
 * ─────────────────────────────────────────────────────────────
 *  Everything on the site lives here. Edit this file and the
 *  whole website updates — no need to touch the components.
 *
 *  The couple's story comes from Rheena's interview. Anything marked
 *  TODO is still a placeholder (exact wedding day, venues, schedule,
 *  entourage, travel) — swap it in once it's confirmed.
 * ─────────────────────────────────────────────────────────────
 */

export const wedding = {
  couple: {
    partnerOne: "Alvin",
    partnerTwo: "Rheena",
    monogram: ["A", "R"] as const,
    /** A nod to the friend request she ignored at first. */
    hashtag: "#RheenaAcceptedAlvin",
  },

  /**
   * TODO: exact day — the couple is planning for October 2027.
   * ISO strings WITH timezone offset (Philippines is +08:00).
   */
  date: {
    ceremonyStart: "2027-10-16T15:00:00+08:00",
    receptionEnd: "2027-10-16T23:30:00+08:00",
    display: "Saturday, the sixteenth of October",
    year: "two thousand twenty-seven",
    short: "10 · 16 · 2027",
    /** TODO: venue city — matches the sample venues below until the real church is added. */
    city: "Tagaytay, Philippines",
    timezone: "Asia/Manila",
  },

  rsvp: {
    deadline: "August 31, 2027",
    /** Max people per RSVP, including the guest filling in the form. */
    maxPartySize: 2,
  },

  /** Opening letter shown right after the hero. */
  letter: {
    greeting: "To the people we love most,",
    paragraphs: [
      "Whether you’ve known us since we were little or met us somewhere along the way, you are part of our story. Your prayers, your advice, your laughter, and your quiet acts of love have shaped who we are today.",
      "You’ve cheered us on through every season and made us feel at home wherever you are. So when we imagined the day we promise each other forever before God, we couldn’t picture it without you.",
      "Come as you are. Rheena has planned every minute (yes, there’s an itinerary) — but the only thing on your schedule is to celebrate with us.",
    ],
    signOff: "With all our love,",
  },

  story: {
    intro:
      "A crush on the way to school, a friend request left on “seen” — and nine years of never once letting go.",
    milestones: [
      {
        year: "RTU",
        date: "College days",
        title: "The girl on the way to school",
        icon: "bus",
        photo: "/photos/y1.ec7f9c64.jpg",
        body: "Alvin and Rheena were neighbours in Taguig and both studied engineering at RTU — different courses, same building. Alvin kept seeing Rheena on her way to school, and somewhere between those commutes he quietly fell for her, long before he ever said hello.",
      },
      {
        year: "Request",
        date: "Facebook",
        title: "Friend request: pending",
        icon: "chat",
        photo: "/photos/silly.0f070725.jpg",
        body: "Alvin finally worked up the courage and sent Rheena a friend request. She ignored it. It took a real, face-to-face conversation before she finally pressed “Confirm” — and that one click opened the door to everything.",
      },
      {
        year: "2017",
        date: "The beginning of us",
        title: "From chats to “us”",
        icon: "heart",
        photo: "/photos/early.c557c6c2.jpg",
        body: "One chat turned into another, and another, until they became a couple. Both families welcomed the relationship from the start — and with personalities this alike, they just fit.",
      },
      {
        year: "Always",
        date: "Sundo at hatid",
        title: "The one who always shows up",
        icon: "car",
        photo: "/photos/birthday.fd0c7eb5.jpg",
        body: "Nine years, and not a single breakup. Alvin has been Rheena’s constant: the daily sundo at hatid, the name on her emergency contact, the steady presence just a few streets away. Rheena has the strong personality; Alvin has the patience — and it works.",
      },
      {
        year: "Aurora",
        date: "Our adventures",
        title: "Roads we’ve taken",
        icon: "wave",
        photo: "/photos/aurora.be23ef7a.jpg",
        body: "Over the years they’ve explored new places together — including the waves of Aurora — sometimes with Rheena’s sister Cass along for the ride. Every trip, of course, came with one of Rheena’s famously detailed itineraries.",
      },
      {
        year: "2026",
        date: "September · Hong Kong",
        title: "The question in Hong Kong",
        icon: "ring",
        photo: "/photos/s1.e4043c68.jpg",
        body: "Far from the streets where it all began, Alvin asked Rheena to spend forever with him — in Hong Kong, in September 2026. After nine years of showing up for her, he asked the one question that mattered most. She said yes.",
      },
      {
        year: "2027",
        date: "October",
        title: "Forever, before God",
        icon: "church",
        photo: "/photos/hk3.29ad6a7f.jpg",
        body: "This October, surrounded by both of our families and everyone who has cheered us on, we’ll make our promise in a Catholic church wedding. Rheena has the itinerary ready. All that’s left is you.",
      },
    ],
    numbers: [
      { value: 9, suffix: "", label: "years together" },
      { value: 2, suffix: "", label: "families becoming one" },
      { value: 1, suffix: "", label: "proposal in Hong Kong" },
      { value: 1, suffix: "", label: "very detailed wedding itinerary" },
    ],
  },

  /**
   * Videos are edited from the proposal footage with Remotion (see /video) and
   * served from /public/videos. Each has a first-frame poster beside it
   * (hero.mp4 → hero.jpg). `portrait` is the cut used on phones held upright.
   */
  media: {
    /** Sample soundtrack ("Beautiful Dream", mixkit.co). Starts softly when the envelope is opened. */
    music: "https://assets.mixkit.co/music/493/493.mp3",
    letterPhoto: "/photos/hk6.c2b4bcba.jpg",
    hero: { src: "/videos/hero.82051f42.mp4", portrait: "/videos/hero-portrait.586ff14c.mp4" },
    /** Placeholder until the prenup shoot: the proposal itself, edited as a short film. */
    film: {
      title: "The Proposal",
      subtitle: "Hong Kong, September 2026 — the day Alvin asked. Our prenup film is coming in 2027; until then, here’s where it all began.",
      credit: "Filmed in Hong Kong · September 2026",
      src: "/videos/film.522fb566.mp4",
      portrait: "/videos/film-portrait.203feffc.mp4",
      teaser: { src: "/videos/teaser.e7e4c6b8.mp4", portrait: "/videos/teaser-portrait.0e9525bc.mp4" },
      /** Start times in seconds — must match the chapters baked into the film (video/src/data.ts). */
      chapters: [
        { title: "Just an ordinary photoshoot", start: 0 },
        { title: "Something’s up", start: 21 },
        { title: "The question", start: 42 },
        { title: "Oo naman, yes!", start: 55 },
        { title: "May ring ka na!", start: 70 },
      ],
    },
    /** Shown beside the "behind the scenes" reel. */
    momentsPhoto: { src: "/photos/camera.5ce8a44a.jpg", caption: "Official photographer" },
    moments: [
      { caption: "Just an ordinary photoshoot…", src: "/videos/moment-1.ca675ec0.mp4" },
      { caption: "…or so she thought", src: "/videos/moment-2.896d6436.mp4" },
      { caption: "“Sabi ko na eh!”", src: "/videos/moment-3.af140b7f.mp4" },
      { caption: "“Will you marry me?”", src: "/videos/moment-4.aef92543.mp4" },
      { caption: "“Right? Left pala!”", src: "/videos/moment-5.3203a85d.mp4" },
      { caption: "“May ring ka na!!!”", src: "/videos/moment-6.b5000ca4.mp4" },
    ],
  },

  /** Photos live in /public/photos in two sizes (-700, -1400). After adding photos, run `node scripts/hash-media.mjs`. */
  gallery: [
    { src: "/photos/hk1.a19af93f.jpg", caption: "Hong Kong, September 2026" },
    { src: "/photos/boracay.1e633059.jpg", caption: "Sun-kissed in Boracay" },
    { src: "/photos/y2.b2b0bd91.jpg", caption: "The early days" },
    { src: "/photos/photobooth.605fc97f.jpg", caption: "Eight takes, zero regrets" },
    { src: "/photos/s2.b5c0b6e2.jpg", caption: "“Oo naman, yes!”" },
    { src: "/photos/waterfall.24e382c3.jpg", caption: "Chasing waterfalls" },
    { src: "/photos/fourth.db483288.jpg", caption: "Happy 4th to us — masks and all" },
    { src: "/photos/y8.17dc593c.jpg", caption: "Photo booth, four times over" },
    { src: "/photos/fries.9152ab47.jpg", caption: "Kain tayo, always" },
    { src: "/photos/s3.862ecc93.jpg", caption: "“May ring ka na!!!”" },
    { src: "/photos/y9.10d12336.jpg", caption: "Congratulations, Engineer!" },
    { src: "/photos/archery.93b9c297.jpg", caption: "Bullseye" },
    { src: "/photos/camera.5ce8a44a.jpg", caption: "Official photographer since day one" },
    { src: "/photos/beach-pose.53b6a4f9.jpg", caption: "Beach-day energy" },
    { src: "/photos/y7.356ae0a6.jpg", caption: "Canteen dates" },
    { src: "/photos/hk6.c2b4bcba.jpg", caption: "That look" },
    { src: "/photos/y3.ad575d1e.jpg", caption: "The arcade prize" },
    { src: "/photos/y6.21fef08d.jpg", caption: "Since forever, this silly" },
  ],

  /** The big scroll-to-reveal line between the letter and the story. */
  manifesto: "“We found love in each other, and a home in all of you.”",
  manifestoBy: "Alvin & Rheena",

  /** Shown on the wishes wall until real guest notes arrive. */
  sampleWishes: [
    { name: "Tita Lorna", message: "I watched you two grow up together. Mahal na mahal namin kayo!" },
    { name: "Bianca", message: "Maid of honour reporting for duty. Bringing tissues for everyone." },
    { name: "Paolo", message: "Bro, she finally accepted the friend request. Proud of you." },
    { name: "Lola Cion", message: "Have patience, laugh often, and always eat dinner together." },
    { name: "Carlo", message: "Saving my best dance moves for the reception. You’ve been warned." },
    { name: "Ninang Carmen", message: "May your home be full of love, laughter and good food." },
    { name: "Mika", message: "Nine years and still kilig. See you on the dance floor!" },
    { name: "Tito Ramon", message: "Alvin — nine years of sundo at hatid. Keep showing up, forever." },
  ],

  /** TODO: the couple already has a church — replace these SAMPLE venues with the real ones. */
  venues: [
    {
      kind: "The Ceremony",
      time: "3:00 in the afternoon",
      name: "Caleruega Church",
      address: "Batulao, Nasugbu, Batangas",
      note: "Our Catholic church ceremony. Please be seated by 2:40 PM — Rheena has planned this to the minute.",
      mapsQuery: "Caleruega Church Nasugbu Batangas",
      photo: "/photos/hk4.b8e94677.jpg",
    },
    {
      kind: "The Reception",
      time: "6:00 in the evening",
      name: "Hillcreek Gardens",
      address: "Tagaytay City, Cavite",
      note: "Dinner, dancing and string lights under the open sky. About 25 minutes from the church.",
      mapsQuery: "Hillcreek Gardens Tagaytay",
      photo: "/photos/hk8.7da93724.jpg",
    },
  ],

  schedule: [
    { time: "2:30 PM", title: "Guests arrive", detail: "Find your seat, take a breath, enjoy the view." },
    { time: "3:00 PM", title: "The ceremony", detail: "An unplugged moment — phones away, hearts open." },
    { time: "4:15 PM", title: "Family portraits", detail: "Stay close; we want you in the pictures." },
    { time: "5:00 PM", title: "Cocktail hour", detail: "Drinks, canapés and golden-hour light at the garden." },
    { time: "6:00 PM", title: "Reception doors open", detail: "Grand entrance of the entourage and the newlyweds." },
    { time: "6:45 PM", title: "Dinner is served", detail: "Filipino-Spanish feast, family style." },
    { time: "8:00 PM", title: "First dance & toasts", detail: "Tissues recommended. We warned you." },
    { time: "9:00 PM", title: "The dance floor opens", detail: "Your song requests, on repeat." },
    { time: "11:00 PM", title: "Sparkler send-off", detail: "One last glow before we say goodnight." },
  ],

  dressCode: {
    title: "Garden Formal",
    description:
      "Think soft colours, flowing fabrics and comfortable shoes for grass. Evenings in Tagaytay get cool — bring a shawl or light jacket.",
    gentlemen: "Barong Tagalog, or a suit in a light or earthy tone. Tie optional.",
    ladies: "Long or midi dresses, or elegant jumpsuits in the palette below.",
    avoid: "Kindly avoid white, ivory and cream — those belong to the bride.",
    /** Real outfits from the couple, shown as inspiration. */
    inspo: [
      { src: "/photos/garden-formal.ff0d356b.jpg", caption: "Garden formal" },
      { src: "/photos/twinning.042983f5.jpg", caption: "Twinning, always" },
    ],
    palette: [
      { name: "Blush", hex: "#E8B4BC" },
      { name: "Dusty Rose", hex: "#C98B96" },
      { name: "Mauve", hex: "#A47A92" },
      { name: "Champagne", hex: "#DDC3A0" },
      { name: "Sage", hex: "#9CAF88" },
      { name: "Dusty Blue", hex: "#94A9C0" },
    ],
  },

  entourage: {
    parents: [
      { role: "Parents of the Bride", names: ["Mr. Ramon Santos", "Mrs. Elena Santos"] },
      { role: "Parents of the Groom", names: ["Mr. Antonio Reyes", "Mrs. Lourdes Reyes"] },
    ],
    principalSponsors: [
      ["Mr. Eduardo Villanueva", "Mrs. Carmen Villanueva"],
      ["Mr. Roberto Cruz", "Mrs. Teresa Cruz"],
      ["Mr. Manuel Garcia", "Mrs. Rosario Garcia"],
      ["Dr. Fernando Lim", "Dr. Patricia Lim"],
      ["Atty. Jose Mendoza", "Mrs. Isabel Mendoza"],
      ["Mr. Ricardo Bautista", "Mrs. Angela Bautista"],
    ],
    honor: [
      { role: "Best Man", names: ["Paolo Reyes"] },
      { role: "Maid of Honor", names: ["Bianca Santos"] },
    ],
    secondarySponsors: [
      { role: "Candle", names: ["Marco Dela Cruz", "Andrea Lopez"] },
      { role: "Veil", names: ["Joaquin Ramos", "Sofia Navarro"] },
      { role: "Cord", names: ["Luis Fernandez", "Camille Torres"] },
    ],
    party: [
      { role: "Groomsmen", names: ["Carlo Mendoza", "Rafael Tan", "Enzo Aquino", "Daniel Ocampo"] },
      { role: "Bridesmaids", names: ["Patricia Gomez", "Nicole Herrera", "Julia Castillo", "Mika Rivera"] },
      { role: "Bearers", names: ["Ring · Lucas", "Coin · Mateo", "Bible · Gabriel"] },
      { role: "Flower Girls", names: ["Ava", "Sophia", "Mia"] },
    ],
  },

  travel: {
    /** Trips the couple has taken together. */
    getaways: [
      { src: "/photos/boracay.1e633059.jpg", caption: "Boracay" },
      { src: "/photos/waterfall.24e382c3.jpg", caption: "Chasing waterfalls" },
      { src: "/photos/beach-sunset.41f87d75.jpg", caption: "Golden hour" },
      { src: "/photos/beach-pose.53b6a4f9.jpg", caption: "Beach-day energy" },
      { src: "/photos/resort-sunset.1528f281.jpg", caption: "Slow weekends" },
    ],
    intro:
      "Tagaytay is about 1.5 to 2 hours from Metro Manila, depending on traffic. We recommend leaving early and making a day of it.",
    tips: [
      {
        title: "Getting there",
        body: "Take SLEX or CAVITEX → CALAX, then exit at Silang (Aguinaldo) or Sta. Rosa. Waze and Google Maps both work well.",
      },
      {
        title: "Shuttle service",
        body: "A complimentary shuttle leaves SM Mall of Asia (Entrance 2) at 12:00 NN sharp, and returns from the reception at 11:30 PM.",
      },
      {
        title: "Parking",
        body: "Free parking is available at both the church and the reception venue.",
      },
      {
        title: "The weather",
        body: "May afternoons are warm but evenings in the highlands can drop to 20°C. A light layer will be your best friend.",
      },
    ],
    stays: [
      { name: "Taal Vista Hotel", note: "Classic, with the iconic volcano view.", distance: "15 min to reception" },
      { name: "Escala Tagaytay", note: "Boutique and quiet, perfect for families.", distance: "10 min to reception" },
      { name: "Anya Resort", note: "For those who want to turn it into a weekend.", distance: "12 min to reception" },
    ],
  },

  gifts: {
    lead: "Your presence is the greatest gift we could ask for.",
    body: "Truly. But if you wish to bless us further, a contribution toward our first home together would be treasured. A gift box will be available at the reception, and you’re welcome to ask our coordinator for e-wallet details.",
    tradition:
      "We’ll also honour the money dance — pin a wish (and maybe a bill) on us during the reception.",
  },

  faq: [
    {
      q: "Is it a church wedding?",
      a: "Yes — we’ll be married in a Catholic ceremony, followed by the reception. Please arrive early so you can find your seat before we begin.",
    },
    {
      q: "Can I bring a plus-one?",
      a: "We’ve lovingly kept our celebration intimate, so we can only accommodate the guests named on your invitation. Your RSVP form shows how many seats we’ve reserved for you.",
    },
    {
      q: "Are children welcome?",
      a: "We adore your little ones, but our celebration is adults-only — with the exception of the children in our entourage. We hope this gives you a well-deserved night off!",
    },
    {
      q: "What does “unplugged ceremony” mean?",
      a: "We’d love for you to be fully present with us during the ceremony, so please keep phones and cameras tucked away. Our photographers will capture everything — and we’ll share it all with you. Snap away at the reception!",
    },
    {
      q: "What time should I arrive?",
      a: "Please arrive by 2:30 PM so you can find parking and be seated by 2:40 PM. The ceremony starts promptly at 3:00 PM.",
    },
    {
      q: "What if it rains?",
      a: "Both venues have covered areas, so the celebration goes on rain or shine. (Rheena has a backup plan. Of course she does.)",
    },
    {
      q: "I have a dietary restriction. Can you accommodate it?",
      a: "Of course. Just let us know in your RSVP and we’ll make sure the kitchen takes care of you.",
    },
    {
      q: "How do I share photos from the day?",
      a: "Post them with our hashtag so we can relive every moment through your eyes.",
    },
  ],

  footer: {
    closing: "We can’t wait to celebrate with you.",
    contact: "Questions? Message our coordinator, Ate Joy — 0917 000 0000",
  },

  /** Keep the site out of search engines (recommended for privacy). */
  allowIndexing: false,
} as const;

export type Wedding = typeof wedding;
export type MilestoneIcon = (typeof wedding.story.milestones)[number]["icon"];

export const coupleNames = `${wedding.couple.partnerOne} & ${wedding.couple.partnerTwo}`;
