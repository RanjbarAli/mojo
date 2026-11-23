/* Mojo Equestrian — content & reference data */
window.MOJO = (() => {
  const { contact, programs = [], gallery = [], sponsors = [], achievements = [] } = MOJO_WP.content;
  contact.closed = contact.closedDays.split(",").map(day => day.trim()).filter(Boolean).map(Number);

  const faqs = [
    {
      "q": "What types of riding lessons do you offer?",
      "a": "Show Jumping: Focused on teaching riders how to guide their horses over obstacles with precision and agility. Dressage: Teaching riders the art of riding in harmony with their horses through controlled, graceful movements."
    },
    {
      "q": "Do you offer lessons for beginners?",
      "a": "Yes! We welcome riders of all levels. Our beginner lessons are designed to help you build a strong foundation, focusing on safety, balance, and basic riding techniques. Our experienced instructors provide personalized guidance to ensure you progress at your own pace."
    },
    {
      "q": "Can I lease a horse at Mojo Equestrian?",
      "a": "Yes, we offer a horse leasing program. Leasing allows you to ride and care for one of our well-trained horses without the long-term commitment of ownership. Our horses are chosen for their temperament and training, making them suitable for riders of different levels and disciplines."
    },
    {
      "q": "Do you provide training for young horses?",
      "a": "Yes! Our trainers specialize in developing young horses. We focus on establishing a strong foundation in groundwork and riding, helping young horses develop the skills they need to become reliable, well-rounded partners. We work patiently with each horse, ensuring steady progress in a supportive environment."
    },
    {
      "q": "Can I relax at Mojo Equestrian even if I'm not riding?",
      "a": "Absolutely! Our facilities include a cozy cafeteria where you can relax and enjoy a variety of beverages, coffee, and snacks. Both indoor and outdoor seating options are available, offering a peaceful retreat while you take in the beautiful surroundings."
    },
    {
      "q": "Do you offer packages for multiple lessons?",
      "a": "Yes, we offer discounted packages for riders who want to book multiple lessons. Contact us for details on the packages available, including pricing and schedules."
    }
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

  return { contact, programs, gallery, faqs, achievements, sponsors, countries, gcc, phoneMasks };
})();
