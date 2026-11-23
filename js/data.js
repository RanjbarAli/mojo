/* Mojo Equestrian — content & reference data */
window.MOJO = (() => {
  const contact = {
    phone: "+968 9776 0221",
    phoneRaw: "+96897760221",
    whatsapp: "https://wa.me/96897760221",
    email: "info@mojoequestrian.com",
    address: "Rumays, Barka, Oman",
    instagram: "https://www.instagram.com/mojo_equestrian_centre/",
    facebook: "https://www.facebook.com/share/TfaRGUmuyfY1tM6r/",
    // Sat–Thu, Oman time (UTC+4). 0 = Sunday ... 6 = Saturday
    hours: { open: 8, close: 21, closedDays: [5] },
  };

  const programs = [
    { id: "riding-school", title: "Riding School", cat: "riding", icon: "graduation-cap", img: "assets/img/riding-school.webp", duration: "45 min", level: "All levels",
      short: "Structured lessons from first steps to advanced competition.",
      body: "A structured path for every rider — beginners build balance, safety and confidence, while experienced riders refine position, aids and feel. Lessons are matched to your level and to a horse that suits you.",
      points: ["Private & group lessons", "Matched horse for your level", "Kids & adults"] },
    { id: "show-jumping", title: "Show Jumping", cat: "training", icon: "trophy", img: "assets/img/masters-2.webp", duration: "45 min", level: "Intermediate+",
      short: "Precision, rhythm and courage over fences.",
      body: "Gridwork, course riding and competition preparation, coached by trainers with international show experience. Build the precision, agility and connection with your horse that clear rounds are made of.",
      points: ["Gridwork & course riding", "Competition preparation", "Video feedback"] },
    { id: "dressage", title: "Dressage", cat: "training", icon: "sparkles", img: "assets/img/hero.webp", duration: "45 min", level: "All levels",
      short: "Harmony, balance and precise communication.",
      body: "Develop suppleness, rhythm and a quiet, effective seat. From basic school figures to lateral work, dressage lessons sharpen communication between horse and rider.",
      points: ["Flatwork foundations", "Lateral work", "Test riding"] },
    { id: "theory", title: "Theoretical Classes", cat: "riding", icon: "book-open", img: "assets/img/theory.webp", duration: "15 min", level: "All levels",
      short: "Horsemanship knowledge that supports every ride.",
      body: "Short, focused classes on horse care, behaviour, anatomy, tack and riding theory — complementing practical training with a deeper understanding of horsemanship.",
      points: ["Horse care & anatomy", "Tack & equipment", "Riding theory"] },
    { id: "young-horses", title: "Young Horse Training", cat: "training", icon: "sprout", img: "assets/img/stall.webp", duration: "Programme", level: "Horses",
      short: "A calm, solid foundation for future athletes.",
      body: "Groundwork, starting under saddle and responsiveness training for young horses — patient, consistent work that builds a confident and willing partner.",
      points: ["Groundwork", "Starting under saddle", "Progress reports"] },
    { id: "leasing", title: "Horse Leasing", cat: "riding", icon: "key-round", img: "assets/img/bond.webp", duration: "Monthly", level: "Intermediate+",
      short: "Ride a talented horse without the full commitment.",
      body: "Lease one of our well-schooled horses for regular riding and training — a great step between lessons and ownership.",
      points: ["Full or part lease", "Includes care & stabling", "Coach support"] },
    { id: "events", title: "Events & Parties", cat: "leisure", icon: "party-popper", img: "assets/img/team.webp", duration: "On request", level: "Everyone",
      short: "Birthdays, corporate days and celebrations.",
      body: "A unique venue for birthdays, corporate gatherings and celebrations — with pony rides, arena demos and catering from our café.",
      points: ["Pony rides", "Arena demos", "Catering available"] },
    { id: "cafe", title: "Restaurant & Café", cat: "leisure", icon: "coffee", img: "assets/img/cafe.webp", duration: "Daily", level: "Everyone",
      short: "Coffee, snacks and arena views.",
      body: "Relax with coffee, fresh drinks and snacks — indoor and outdoor seating with a view over the arena. No riding required.",
      points: ["Indoor & outdoor seating", "Arena view", "Family friendly"] },
  ];

  const gallery = [
    { src: "assets/img/night-jump.webp", tag: "Show jumping", ar: "4/5.4" },
    { src: "assets/img/masters-1.webp", tag: "Oman Masters", ar: "4/3" },
    { src: "assets/img/young-rider.webp", tag: "Young riders", ar: "4/5" },
    { src: "assets/img/stable-lamp.webp", tag: "Stables", ar: "4/5.2" },
    { src: "assets/img/masters-3.webp", tag: "Competition", ar: "4/3" },
    { src: "assets/img/stall.webp", tag: "Facilities", ar: "4/5" },
    { src: "assets/img/arena-jump.webp", tag: "Training", ar: "4/5.2" },
    { src: "assets/img/media.webp", tag: "Media day", ar: "4/3" },
    { src: "assets/img/night-ride.webp", tag: "Evening rides", ar: "4/5.4" },
    { src: "assets/img/cafe.webp", tag: "Café", ar: "4/3" },
    { src: "assets/img/team.webp", tag: "Team", ar: "4/3" },
    { src: "assets/img/masters-2.webp", tag: "CSI 1*", ar: "4/3.2" },
  ];

  const testimonials = [
    { text: "Good environment, no bad smell at all, a good café to stay and enjoy the view, professional coaches. A very good place overall — the best in Muscat.", name: "Esraa Taha", role: "Visitor & rider", color: "#0F4A5B" },
    { text: "Excellent facilities, excellent training. Good horses.", name: "Anthony Langrish", role: "Rider", color: "#F06520" },
  ];

  const faqs = [
    { q: "What types of riding lessons do you offer?", a: "Show jumping and dressage, for riders of every level — plus riding school lessons, theoretical classes and young horse training." },
    { q: "Do you offer lessons for beginners?", a: "Yes. Beginner lessons focus on safety, balance and basic riding skills, on calm, experienced horses." },
    { q: "Can I lease a horse at Mojo Equestrian?", a: "Yes, we run a horse leasing programme — full or part lease, with care and coaching included." },
    { q: "Do you provide training for young horses?", a: "Yes. We focus on groundwork, starting under saddle and responsiveness to build a solid foundation." },
    { q: "Can I relax at Mojo even if I'm not riding?", a: "Of course. Our café serves coffee, drinks and snacks with indoor and outdoor seating overlooking the arena." },
    { q: "Do you offer packages for multiple lessons?", a: "Yes, discounted multi-lesson packages are available. Contact us for current pricing." },
  ];

  const achievements = [
    { year: "2021 – 22", title: "Oman Masters — first season", text: "Hosted the first season of Oman Masters with more than 100 national riders." },
    { year: "2022 – 23", title: "First international season", text: "The first private stable in Oman to host an international competition season — and the first international female competition in the country." },
    { year: "2023", title: "Gold & silver", text: "Gold and silver medals in the female international competition, Oman Masters CSI 1*." },
  ];

  const sponsors = [
    { src: "assets/img/sponsors/oman-masters.png", name: "Oman Masters" },
    { src: "assets/img/sponsors/hashimani.png", name: "Hashimani Furniture" },
    { src: "assets/img/sponsors/best-solution.png", name: "Best Solution" },
    { src: "assets/img/sponsors/zahr-el-laymoun.png", name: "Zahr El-Laymoun" },
  ];

  const posts = [
    { id: 1, cat: "Riding tips", title: "Your first riding lesson: what to expect", img: "assets/img/pony.webp", date: "Nov 12, 2026", read: "4 min",
      excerpt: "From helmet fitting to your first walk and trot — a calm walkthrough of lesson one.",
      body: ["Your first lesson starts on the ground. Your coach will fit your helmet, introduce you to your horse and show you how to approach, lead and mount safely.", "Once in the saddle, you'll focus on balance and a relaxed position at walk. Most riders try a little trot by the end of the first session.", "Wear long trousers and boots with a small heel. We provide helmets and body protectors."] },
    { id: 2, cat: "Show jumping", title: "Five grid exercises for a better rhythm", img: "assets/img/arena-jump.webp", date: "Oct 28, 2026", read: "6 min",
      excerpt: "Simple gymnastic lines that teach horse and rider to find the same stride.",
      body: ["Grids take the guesswork out of distances, so you can focus on position and rhythm.", "Start with trot poles to a cross-pole, then add a bounce and a one-stride. Keep fences low — the goal is rhythm, not height.", "Finish every session on a good jump and let your horse stretch."] },
    { id: 3, cat: "Horse care", title: "Keeping horses comfortable in Oman's summer", img: "assets/img/stall.webp", date: "Oct 9, 2026", read: "5 min",
      excerpt: "Hydration, ride timing and stable routines for the hot months.",
      body: ["In summer we ride early and late, avoiding the hottest hours entirely.", "Fresh water and electrolytes are always available, and horses are hosed down after work.", "Stables are shaded and ventilated, with routines adjusted to keep everyone cool."] },
    { id: 4, cat: "Events", title: "Looking back at Oman Masters CSI 1*", img: "assets/img/masters-1.webp", date: "Sep 18, 2026", read: "3 min",
      excerpt: "Highlights from hosting international show jumping in Barka.",
      body: ["Hosting an international CSI 1* was a milestone for Mojo and for private stables in Oman.", "Riders from across the region competed over courses built in our main arena.", "Our riders brought home gold and silver in the female international class."] },
    { id: 5, cat: "Riding tips", title: "Dressage basics: finding a quiet seat", img: "assets/img/hero.webp", date: "Aug 30, 2026", read: "5 min",
      excerpt: "Why less movement in the saddle means clearer communication.",
      body: ["A quiet seat lets your horse hear your aids clearly.", "Work on breathing, a long leg and following the movement with your hips rather than your hands.", "Lunge lessons without stirrups are one of the fastest ways to improve."] },
    { id: 6, cat: "Horse care", title: "Starting young horses the patient way", img: "assets/img/young-rider.webp", date: "Aug 11, 2026", read: "7 min",
      excerpt: "Our approach to groundwork and building trust before the saddle.",
      body: ["Every young horse moves at its own pace. We begin with groundwork: leading, yielding and desensitising.", "Short, positive sessions build confidence and curiosity.", "Only when the horse is relaxed and responsive on the ground do we introduce tack and a rider."] },
    { id: 7, cat: "Riding tips", title: "What to wear for your riding lesson", img: "assets/img/riding-school.webp", date: "Jul 24, 2026", read: "3 min",
      excerpt: "Simple, safe clothing choices for comfortable first rides.",
      body: ["Choose long, stretchy trousers and boots with a small heel so your foot can't slip through the stirrup.", "We provide helmets and body protectors — bring gloves if you have them.", "Avoid loose scarves or jewellery that could catch on tack."] },
    { id: 8, cat: "Show jumping", title: "Walking a course like a pro", img: "assets/img/masters-3.webp", date: "Jul 6, 2026", read: "5 min",
      excerpt: "How to plan lines, strides and turns before you ride.",
      body: ["Walk every line twice: once to learn the route, once to count strides.", "Note where you will land and turn, and where the course asks for more or less pace.", "Visualise the round from start to finish before you mount."] },
    { id: 9, cat: "Horse care", title: "Daily grooming, step by step", img: "assets/img/care.webp", date: "Jun 19, 2026", read: "4 min",
      excerpt: "A simple routine that keeps coats healthy and builds trust.",
      body: ["Start with a curry comb in circles to lift dirt, then a hard brush in the direction of the coat.", "Finish with a soft brush on the face and legs, and pick out all four hooves.", "Grooming is also the best time to check for small cuts or heat in the legs."] },
    { id: 10, cat: "Events", title: "Hosting a birthday at the stables", img: "assets/img/pony.webp", date: "Jun 2, 2026", read: "3 min",
      excerpt: "Pony rides, café treats and photos — how our parties work.",
      body: ["Every party starts with a meet-and-greet so children can get comfortable around the horses.", "Pony rides are led by our team, with helmets for every rider.", "The café handles food and drinks, so families can simply enjoy the day."] },
    { id: 11, cat: "Riding tips", title: "Building confidence after a fall", img: "assets/img/bond.webp", date: "May 15, 2026", read: "6 min",
      excerpt: "Small steps that help nervous riders feel safe again.",
      body: ["Go back to basics on a calm, familiar horse and keep sessions short.", "Set small, achievable goals for every lesson and celebrate them.", "Talk to your coach — confidence grows fastest with a clear plan."] },
    { id: 12, cat: "Show jumping", title: "Behind the scenes at a CSI event", img: "assets/img/media.webp", date: "Apr 28, 2026", read: "4 min",
      excerpt: "What it takes to host an international show in Barka.",
      body: ["Course building, stabling for visiting horses and veterinary checks all start weeks in advance.", "On show days, the arena team resets fences between every class.", "Our café and media teams keep riders, families and spectators looked after."] },
  ];

  // Countries: [ISO2, name, dial code]
  const countries = `AF|Afghanistan|93;AL|Albania|355;DZ|Algeria|213;AD|Andorra|376;AO|Angola|244;AG|Antigua and Barbuda|1268;AR|Argentina|54;AM|Armenia|374;AU|Australia|61;AT|Austria|43;AZ|Azerbaijan|994;BS|Bahamas|1242;BH|Bahrain|973;BD|Bangladesh|880;BB|Barbados|1246;BY|Belarus|375;BE|Belgium|32;BZ|Belize|501;BJ|Benin|229;BT|Bhutan|975;BO|Bolivia|591;BA|Bosnia and Herzegovina|387;BW|Botswana|267;BR|Brazil|55;BN|Brunei|673;BG|Bulgaria|359;BF|Burkina Faso|226;BI|Burundi|257;KH|Cambodia|855;CM|Cameroon|237;CA|Canada|1;CV|Cape Verde|238;CF|Central African Republic|236;TD|Chad|235;CL|Chile|56;CN|China|86;CO|Colombia|57;KM|Comoros|269;CG|Congo|242;CD|Congo (DRC)|243;CR|Costa Rica|506;CI|Côte d'Ivoire|225;HR|Croatia|385;CU|Cuba|53;CY|Cyprus|357;CZ|Czechia|420;DK|Denmark|45;DJ|Djibouti|253;DM|Dominica|1767;DO|Dominican Republic|1809;EC|Ecuador|593;EG|Egypt|20;SV|El Salvador|503;GQ|Equatorial Guinea|240;ER|Eritrea|291;EE|Estonia|372;SZ|Eswatini|268;ET|Ethiopia|251;FJ|Fiji|679;FI|Finland|358;FR|France|33;GA|Gabon|241;GM|Gambia|220;GE|Georgia|995;DE|Germany|49;GH|Ghana|233;GR|Greece|30;GD|Grenada|1473;GT|Guatemala|502;GN|Guinea|224;GW|Guinea-Bissau|245;GY|Guyana|592;HT|Haiti|509;HN|Honduras|504;HK|Hong Kong|852;HU|Hungary|36;IS|Iceland|354;IN|India|91;ID|Indonesia|62;IR|Iran|98;IQ|Iraq|964;IE|Ireland|353;IL|Israel|972;IT|Italy|39;JM|Jamaica|1876;JP|Japan|81;JO|Jordan|962;KZ|Kazakhstan|7;KE|Kenya|254;KI|Kiribati|686;KW|Kuwait|965;KG|Kyrgyzstan|996;LA|Laos|856;LV|Latvia|371;LB|Lebanon|961;LS|Lesotho|266;LR|Liberia|231;LY|Libya|218;LI|Liechtenstein|423;LT|Lithuania|370;LU|Luxembourg|352;MO|Macau|853;MG|Madagascar|261;MW|Malawi|265;MY|Malaysia|60;MV|Maldives|960;ML|Mali|223;MT|Malta|356;MH|Marshall Islands|692;MR|Mauritania|222;MU|Mauritius|230;MX|Mexico|52;FM|Micronesia|691;MD|Moldova|373;MC|Monaco|377;MN|Mongolia|976;ME|Montenegro|382;MA|Morocco|212;MZ|Mozambique|258;MM|Myanmar|95;NA|Namibia|264;NR|Nauru|674;NP|Nepal|977;NL|Netherlands|31;NZ|New Zealand|64;NI|Nicaragua|505;NE|Niger|227;NG|Nigeria|234;KP|North Korea|850;MK|North Macedonia|389;NO|Norway|47;OM|Oman|968;PK|Pakistan|92;PW|Palau|680;PS|Palestine|970;PA|Panama|507;PG|Papua New Guinea|675;PY|Paraguay|595;PE|Peru|51;PH|Philippines|63;PL|Poland|48;PT|Portugal|351;PR|Puerto Rico|1787;QA|Qatar|974;RO|Romania|40;RU|Russia|7;RW|Rwanda|250;KN|Saint Kitts and Nevis|1869;LC|Saint Lucia|1758;VC|Saint Vincent and the Grenadines|1784;WS|Samoa|685;SM|San Marino|378;ST|São Tomé and Príncipe|239;SA|Saudi Arabia|966;SN|Senegal|221;RS|Serbia|381;SC|Seychelles|248;SL|Sierra Leone|232;SG|Singapore|65;SK|Slovakia|421;SI|Slovenia|386;SB|Solomon Islands|677;SO|Somalia|252;ZA|South Africa|27;KR|South Korea|82;SS|South Sudan|211;ES|Spain|34;LK|Sri Lanka|94;SD|Sudan|249;SR|Suriname|597;SE|Sweden|46;CH|Switzerland|41;SY|Syria|963;TW|Taiwan|886;TJ|Tajikistan|992;TZ|Tanzania|255;TH|Thailand|66;TL|Timor-Leste|670;TG|Togo|228;TO|Tonga|676;TT|Trinidad and Tobago|1868;TN|Tunisia|216;TR|Türkiye|90;TM|Turkmenistan|993;TV|Tuvalu|688;UG|Uganda|256;UA|Ukraine|380;AE|United Arab Emirates|971;GB|United Kingdom|44;US|United States|1;UY|Uruguay|598;UZ|Uzbekistan|998;VU|Vanuatu|678;VA|Vatican City|379;VE|Venezuela|58;VN|Vietnam|84;YE|Yemen|967;ZM|Zambia|260;ZW|Zimbabwe|263`
    .split(";").map((r) => { const [iso, name, dial] = r.split("|"); return { iso, name, dial }; });

  const gcc = ["OM", "AE", "SA", "QA", "KW", "BH"];

  // Phone masks per country (# = digit). Fallback is generic grouping.
  const phoneMasks = {
    OM: "#### ####", AE: "## ### ####", SA: "## ### ####", QA: "#### ####", KW: "#### ####", BH: "#### ####",
    US: "(###) ###-####", CA: "(###) ###-####", GB: "#### ######", IN: "##### #####", IR: "### ### ####",
    EG: "### ### ####", PK: "### #######", DE: "### ########", FR: "# ## ## ## ##", JO: "# #### ####", LB: "## ### ###",
  };

  return { contact, programs, gallery, testimonials, faqs, achievements, sponsors, posts, countries, gcc, phoneMasks };
})();
