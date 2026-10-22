export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface SubjectQuiz {
  subject: string;
  chapters: {
    name: string;
    questions: QuizQuestion[];
  }[];
}

export const QUIZZES: SubjectQuiz[] = [
  {
    subject: "Science",
    chapters: [
      {
        name: "Gravitation",
        questions: [
          { question: "What is the SI unit of gravitational force?", options: ["Newton", "Joule", "Pascal", "Watt"], correct: 0, explanation: "The SI unit of force, including gravitational force, is Newton (N)." },
          { question: "What is the value of acceleration due to gravity on Earth's surface?", options: ["9.8 m/s²", "8.9 m/s²", "10.8 m/s²", "6.67 m/s²"], correct: 0, explanation: "The standard value of g near Earth's surface is approximately 9.8 m/s²." },
          { question: "Who discovered the law of gravitation?", options: ["Einstein", "Newton", "Galileo", "Kepler"], correct: 1, explanation: "Sir Isaac Newton gave the universal law of gravitation." },
          { question: "The gravitational force between two objects depends on:", options: ["Their masses and distance", "Their color and shape", "Their temperature", "Their speed"], correct: 0, explanation: "It depends on the product of their masses and the square of the distance between them." },
          { question: "What is the value of universal gravitational constant G?", options: ["6.67 × 10⁻¹¹ Nm²/kg²", "9.8 Nm²/kg²", "6.67 × 10¹¹ Nm²/kg²", "3.14 Nm²/kg²"], correct: 0, explanation: "The universal gravitational constant is 6.67 × 10⁻¹¹ Nm²/kg²." },
          { question: "Weight of an object is:", options: ["Always constant everywhere", "Mass × gravity", "Same as density", "Measured in kilograms only"], correct: 1, explanation: "Weight is the force with which gravity pulls an object, so W = mg." },
          { question: "Why do astronauts feel weightless in orbit?", options: ["There is no gravity in space", "They are in free fall", "Their mass becomes zero", "Air resistance supports them"], correct: 1, explanation: "Astronauts feel weightless because they are continuously falling around Earth in orbit." },
        ],
      },
      {
        name: "Periodic Classification",
        questions: [
          { question: "How many groups are there in the modern periodic table?", options: ["8", "16", "18", "7"], correct: 2, explanation: "The modern periodic table has 18 groups." },
          { question: "Who proposed the modern periodic law?", options: ["Mendeleev", "Moseley", "Dobereiner", "Newlands"], correct: 1, explanation: "Henry Moseley proposed the modern periodic law based on atomic number." },
          { question: "Elements in the same group have:", options: ["Same atomic mass", "Same number of valence electrons", "Same number of shells", "Same color"], correct: 1, explanation: "Elements in the same group have the same number of valence electrons." },
          { question: "Which element has atomic number 1?", options: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correct: 2, explanation: "Hydrogen has atomic number 1." },
          { question: "Mendeleev arranged elements by:", options: ["Atomic number", "Atomic mass", "Density", "Melting point"], correct: 1, explanation: "Mendeleev arranged elements in increasing order of atomic mass." },
          { question: "Across a period, the atomic size generally:", options: ["Increases", "Decreases", "Stays the same", "Becomes zero"], correct: 1, explanation: "Atomic size usually decreases across a period due to increasing nuclear charge." },
          { question: "Which group contains noble gases?", options: ["Group 1", "Group 17", "Group 18", "Group 2"], correct: 2, explanation: "Noble gases are placed in Group 18." },
        ],
      },
      {
        name: "Chemical Reactions",
        questions: [
          { question: "What is a chemical equation?", options: ["A representation of a chemical reaction using symbols", "A mathematical equation", "A physics formula", "A biological process"], correct: 0, explanation: "A chemical equation is the symbolic representation of a chemical reaction." },
          { question: "In a balanced chemical equation, the number of atoms of each element on both sides are:", options: ["Different", "Equal", "Double", "Half"], correct: 1, explanation: "The law of conservation of mass requires equal number of atoms on both sides." },
          { question: "What type of reaction is: 2H₂ + O₂ → 2H₂O?", options: ["Decomposition", "Combination", "Displacement", "Double displacement"], correct: 1, explanation: "This is a combination reaction because two reactants combine to form one product." },
          { question: "Rusting of iron is an example of:", options: ["Reduction", "Oxidation", "Neutralization", "Evaporation"], correct: 1, explanation: "Rusting occurs due to oxidation of iron in presence of oxygen and moisture." },
          { question: "An exothermic reaction:", options: ["Absorbs heat", "Releases heat", "Has no energy change", "Only occurs at night"], correct: 1, explanation: "Exothermic reactions release heat to the surroundings." },
          { question: "When calcium carbonate is heated, it forms calcium oxide and carbon dioxide. This is:", options: ["Combination", "Decomposition", "Displacement", "Precipitation"], correct: 1, explanation: "A single compound breaking down into simpler substances is a decomposition reaction." },
          { question: "Which process is an example of reduction?", options: ["Addition of oxygen", "Removal of hydrogen", "Removal of oxygen", "Formation of rust"], correct: 2, explanation: "Reduction can be defined as removal of oxygen from a substance." },
        ],
      },
      {
        name: "Life Processes",
        questions: [
          { question: "Which process provides energy by breaking down food in cells?", options: ["Respiration", "Transpiration", "Excretion", "Photosynthesis"], correct: 0, explanation: "Respiration releases energy from food inside cells." },
          { question: "The green pigment in leaves is:", options: ["Hemoglobin", "Chlorophyll", "Melanin", "Insulin"], correct: 1, explanation: "Chlorophyll traps sunlight for photosynthesis." },
          { question: "Which organ pumps blood throughout the body?", options: ["Lungs", "Liver", "Heart", "Kidney"], correct: 2, explanation: "The heart is the pumping organ of the circulatory system." },
          { question: "Transport of water in plants mainly occurs through:", options: ["Xylem", "Phloem", "Stomata", "Roots only"], correct: 0, explanation: "Xylem carries water and minerals from roots to other plant parts." },
          { question: "The process of removal of waste products from the body is called:", options: ["Nutrition", "Circulation", "Excretion", "Digestion"], correct: 2, explanation: "Excretion removes metabolic waste from the body." },
        ],
      },
    ],
  },
  {
    subject: "Mathematics",
    chapters: [
      {
        name: "Linear Equations",
        questions: [
          { question: "A linear equation in two variables has how many solutions?", options: ["One", "Two", "Infinite", "None"], correct: 2, explanation: "A linear equation in two variables has infinitely many solutions." },
          { question: "The graph of a linear equation in two variables is:", options: ["A circle", "A straight line", "A parabola", "A curve"], correct: 1, explanation: "Its graph is always a straight line." },
          { question: "If 2x + 3y = 12 and x = 3, what is y?", options: ["1", "2", "3", "4"], correct: 1, explanation: "2(3) + 3y = 12 gives y = 2." },
          { question: "The standard form of a linear equation is:", options: ["ax² + bx + c = 0", "ax + by + c = 0", "ax³ + b = 0", "a/x + b = 0"], correct: 1, explanation: "The standard form is ax + by + c = 0." },
          { question: "Two lines are parallel if they have:", options: ["Same slope", "Different slopes", "Same y-intercept", "Perpendicular slopes"], correct: 0, explanation: "Parallel lines have equal slopes." },
          { question: "If a line cuts the y-axis at 5, its y-intercept is:", options: ["0", "1", "5", "-5"], correct: 2, explanation: "The y-intercept is the point where the line crosses the y-axis." },
          { question: "A pair of equations with one common solution are called:", options: ["Inconsistent", "Dependent", "Intersecting", "Parallel"], correct: 2, explanation: "Intersecting lines meet at one point, giving one common solution." },
        ],
      },
      {
        name: "Quadratic Equations",
        questions: [
          { question: "The degree of a quadratic equation is:", options: ["1", "2", "3", "0"], correct: 1, explanation: "A quadratic equation has degree 2." },
          { question: "The quadratic formula is:", options: ["x = -b/2a", "x = (-b ± √(b²-4ac))/2a", "x = b² - 4ac", "x = a + b + c"], correct: 1, explanation: "This formula gives the roots of ax² + bx + c = 0." },
          { question: "If discriminant (b²-4ac) = 0, the roots are:", options: ["Real and distinct", "Real and equal", "Imaginary", "No roots"], correct: 1, explanation: "A zero discriminant means the roots are real and equal." },
          { question: "How many roots does a quadratic equation have?", options: ["1", "2", "3", "Infinite"], correct: 1, explanation: "It has two roots, which may be equal or complex." },
          { question: "x² - 5x + 6 = 0 has roots:", options: ["2 and 3", "1 and 6", "-2 and -3", "5 and 1"], correct: 0, explanation: "It factorizes to (x - 2)(x - 3) = 0." },
          { question: "If one root of x² - 9 = 0 is 3, the other root is:", options: ["-3", "0", "9", "1/3"], correct: 0, explanation: "x² - 9 = 0 gives roots 3 and -3." },
          { question: "The graph of a quadratic polynomial is usually a:", options: ["Straight line", "Parabola", "Circle", "Hyperbola"], correct: 1, explanation: "Quadratic functions are represented by parabolas." },
        ],
      },
      {
        name: "Trigonometry",
        questions: [
          { question: "sin 30° = ?", options: ["1/2", "√3/2", "1", "0"], correct: 0, explanation: "sin 30° = 1/2." },
          { question: "cos 0° = ?", options: ["0", "1/2", "1", "√2"], correct: 2, explanation: "cos 0° = 1." },
          { question: "tan 45° = ?", options: ["0", "1", "√3", "1/√3"], correct: 1, explanation: "tan 45° = 1." },
          { question: "sin²θ + cos²θ = ?", options: ["0", "1", "2", "sin θ"], correct: 1, explanation: "This is the basic trigonometric identity." },
          { question: "If sin θ = 3/5, what is cos θ?", options: ["4/5", "3/4", "5/3", "5/4"], correct: 0, explanation: "Using sin²θ + cos²θ = 1, cos θ = 4/5." },
          { question: "sec θ is the reciprocal of:", options: ["sin θ", "cos θ", "tan θ", "cot θ"], correct: 1, explanation: "sec θ = 1 / cos θ." },
          { question: "Which ratio equals opposite/hypotenuse?", options: ["cos θ", "tan θ", "sin θ", "cot θ"], correct: 2, explanation: "sin θ = opposite / hypotenuse." },
        ],
      },
      {
        name: "Statistics",
        questions: [
          { question: "The average of observations is called:", options: ["Mode", "Median", "Mean", "Range"], correct: 2, explanation: "Mean is the arithmetic average of the observations." },
          { question: "The most frequently occurring value is:", options: ["Median", "Mode", "Mean", "Class mark"], correct: 1, explanation: "Mode is the value with highest frequency." },
          { question: "Median represents the:", options: ["Largest value", "Middle value", "Smallest value", "Difference of values"], correct: 1, explanation: "Median is the middle value of an ordered data set." },
          { question: "A bar graph is useful for showing:", options: ["Only angles", "Categorical comparisons", "Chemical bonds", "Temperature scale"], correct: 1, explanation: "Bar graphs compare quantities across categories." },
          { question: "If all observations are equal, then mean, median and mode are:", options: ["Different", "Zero", "Equal", "Undefined"], correct: 2, explanation: "When every value is the same, mean = median = mode." },
        ],
      },
    ],
  },
  {
    subject: "Physics",
    chapters: [
      {
        name: "Light - Reflection",
        questions: [
          { question: "The angle of incidence equals the angle of:", options: ["Refraction", "Reflection", "Diffraction", "Polarization"], correct: 1, explanation: "This is the first law of reflection." },
          { question: "A plane mirror forms what type of image?", options: ["Real and inverted", "Virtual and erect", "Real and erect", "Virtual and inverted"], correct: 1, explanation: "A plane mirror forms a virtual, erect image of same size." },
          { question: "The focal length of a concave mirror is:", options: ["Positive", "Negative", "Zero", "Infinite"], correct: 1, explanation: "By sign convention, the focal length of a concave mirror is negative." },
          { question: "Concave mirrors are used in:", options: ["Car headlights", "Rear-view mirrors", "Kaleidoscopes", "Periscopes"], correct: 0, explanation: "They help produce a strong parallel beam in headlights." },
          { question: "The mirror formula is:", options: ["1/v + 1/u = 1/f", "1/v - 1/u = 1/f", "v + u = f", "v × u = f"], correct: 0, explanation: "The mirror formula is 1/v + 1/u = 1/f." },
          { question: "A convex mirror always forms an image that is:", options: ["Real and large", "Virtual and diminished", "Real and inverted", "Same size"], correct: 1, explanation: "Convex mirrors always form virtual, erect and diminished images." },
          { question: "The image formed by a concave mirror when the object is at focus is:", options: ["At infinity", "At the mirror", "Virtual and small", "Behind the mirror"], correct: 0, explanation: "When object is at focus, reflected rays become parallel and image forms at infinity." },
        ],
      },
      {
        name: "Electricity",
        questions: [
          { question: "Ohm's Law states:", options: ["V = IR", "V = I/R", "V = I + R", "V = I × R²"], correct: 0, explanation: "Ohm's Law is V = IR." },
          { question: "The SI unit of electric current is:", options: ["Volt", "Ohm", "Ampere", "Watt"], correct: 2, explanation: "Current is measured in ampere (A)." },
          { question: "In a series circuit, the current is:", options: ["Different at each point", "Same at every point", "Zero", "Infinite"], correct: 1, explanation: "Current remains same in all components of a series circuit." },
          { question: "Electric power is measured in:", options: ["Ampere", "Volt", "Watt", "Ohm"], correct: 2, explanation: "Power is measured in watts." },
          { question: "1 kilowatt-hour equals:", options: ["3.6 × 10⁶ J", "3.6 × 10³ J", "1000 J", "360 J"], correct: 0, explanation: "1 kWh = 3.6 × 10⁶ joules." },
          { question: "Resistance of a conductor depends on:", options: ["Length, material and area", "Color only", "Temperature only", "Mass only"], correct: 0, explanation: "Resistance depends on length, cross-sectional area, material and temperature." },
          { question: "In a parallel circuit, the potential difference across branches is:", options: ["Always zero", "Different", "Same", "Infinite"], correct: 2, explanation: "Each branch in a parallel circuit has the same potential difference." },
        ],
      },
      {
        name: "Electromagnetic Induction",
        questions: [
          { question: "Electromagnetic induction is the production of:", options: ["Heat", "Current by changing magnetic field", "Sound", "Pressure"], correct: 1, explanation: "A changing magnetic field can induce current in a conductor." },
          { question: "The device used to increase or decrease AC voltage is:", options: ["Motor", "Transformer", "Generator", "Resistor"], correct: 1, explanation: "A transformer works on electromagnetic induction." },
          { question: "A generator converts:", options: ["Electrical energy to mechanical", "Mechanical energy to electrical", "Light to heat", "Heat to sound"], correct: 1, explanation: "Generators convert mechanical energy into electrical energy." },
          { question: "The faster the magnetic flux changes, the induced current is generally:", options: ["Smaller", "Larger", "Zero", "Constant"], correct: 1, explanation: "More rapid change in magnetic flux induces greater emf." },
          { question: "Household mains supply in India is:", options: ["DC", "AC", "Only battery current", "No current"], correct: 1, explanation: "Domestic electricity supply in India is alternating current." },
        ],
      },
    ],
  },
  {
    subject: "Chemistry",
    chapters: [
      {
        name: "Acids, Bases and Salts",
        questions: [
          { question: "Which turns blue litmus red?", options: ["Base", "Salt", "Acid", "Water"], correct: 2, explanation: "Acids turn blue litmus red." },
          { question: "pH of pure water is:", options: ["0", "7", "14", "1"], correct: 1, explanation: "Pure water is neutral with pH 7." },
          { question: "NaOH is a:", options: ["Acid", "Base", "Salt", "Indicator"], correct: 1, explanation: "NaOH is sodium hydroxide, a strong base." },
          { question: "What is formed when an acid reacts with a base?", options: ["Only salt", "Salt and water", "Only water", "Gas"], correct: 1, explanation: "This is a neutralization reaction producing salt and water." },
          { question: "HCl is a:", options: ["Weak acid", "Strong acid", "Base", "Salt"], correct: 1, explanation: "Hydrochloric acid is a strong acid." },
          { question: "Phenolphthalein in a basic solution becomes:", options: ["Colorless", "Red", "Pink", "Blue"], correct: 2, explanation: "Phenolphthalein turns pink in basic medium." },
          { question: "A substance with pH 2 is likely to be:", options: ["Strongly acidic", "Neutral", "Strongly basic", "A metal"], correct: 0, explanation: "Lower pH values indicate stronger acidity." },
        ],
      },
      {
        name: "Carbon Compounds",
        questions: [
          { question: "Carbon has a valency of:", options: ["2", "4", "6", "1"], correct: 1, explanation: "Carbon forms four covalent bonds, so its valency is 4." },
          { question: "Methane's formula is:", options: ["CH₄", "C₂H₆", "C₃H₈", "CO₂"], correct: 0, explanation: "Methane is CH₄." },
          { question: "Ethanol's formula is:", options: ["CH₃OH", "C₂H₅OH", "C₃H₇OH", "HCHO"], correct: 1, explanation: "Ethanol has the molecular formula C₂H₅OH." },
          { question: "Organic compounds primarily contain:", options: ["Carbon and hydrogen", "Iron and oxygen", "Sodium and chlorine", "Gold and silver"], correct: 0, explanation: "Organic compounds mainly contain carbon and hydrogen." },
          { question: "The IUPAC name for CH₃CHO is:", options: ["Methanol", "Ethanal", "Propanal", "Ethanol"], correct: 1, explanation: "CH₃CHO is ethanal, an aldehyde." },
          { question: "Compounds with the same molecular formula but different structures are called:", options: ["Allotropes", "Isomers", "Alloys", "Ions"], correct: 1, explanation: "Such compounds are structural isomers." },
          { question: "Soap molecules help cleaning because they have:", options: ["Only acidic ends", "Hydrophobic and hydrophilic ends", "Only metallic ions", "No charge at all"], correct: 1, explanation: "Soap has both water-attracting and oil-attracting parts." },
        ],
      },
      {
        name: "Periodic Table",
        questions: [
          { question: "Elements are arranged in the modern periodic table on the basis of:", options: ["Atomic mass", "Atomic number", "Density", "Valency only"], correct: 1, explanation: "Modern periodic classification is based on atomic number." },
          { question: "Halogens are placed in:", options: ["Group 1", "Group 17", "Group 18", "Group 2"], correct: 1, explanation: "Halogens are Group 17 elements." },
          { question: "Sodium belongs to which period?", options: ["1", "2", "3", "4"], correct: 2, explanation: "Sodium has electronic configuration 2,8,1, so it is in period 3." },
          { question: "Metals are usually found on the:", options: ["Right side", "Left side and center", "Bottom only", "Top right only"], correct: 1, explanation: "Most metals are placed on the left and center of the periodic table." },
          { question: "Valency of elements in Group 18 is usually:", options: ["1", "2", "0", "4"], correct: 2, explanation: "Noble gases are generally stable and have valency zero." },
        ],
      },
    ],
  },
  {
    subject: "Biology",
    chapters: [
      {
        name: "Genetics and Heredity",
        questions: [
          { question: "The basic unit of heredity is:", options: ["Cell", "Tissue", "Gene", "Organ"], correct: 2, explanation: "Genes carry hereditary information from parents to offspring." },
          { question: "Who is known as the father of genetics?", options: ["Darwin", "Mendel", "Linnaeus", "Pasteur"], correct: 1, explanation: "Gregor Mendel is called the father of genetics." },
          { question: "A trait that appears in the first generation is called:", options: ["Recessive", "Dominant", "Hybrid", "Mutated"], correct: 1, explanation: "Dominant traits express themselves in the first filial generation." },
          { question: "Chromosomes are mainly present in the:", options: ["Cell wall", "Nucleus", "Cytoplasm", "Mitochondria only"], correct: 1, explanation: "Chromosomes are found inside the nucleus." },
          { question: "Variation in species is important because it helps in:", options: ["Extinction", "Adaptation", "No change", "Loss of genes"], correct: 1, explanation: "Variation helps organisms adapt better to changing environments." },
        ],
      },
      {
        name: "Evolution",
        questions: [
          { question: "Evolution explains:", options: ["Instant creation only", "Gradual change in organisms over time", "Only plant growth", "Weather change"], correct: 1, explanation: "Evolution is the gradual change in living organisms over generations." },
          { question: "Fossils give evidence about:", options: ["Current weather", "Past life", "Only rocks", "Ocean currents"], correct: 1, explanation: "Fossils preserve remains or impressions of ancient organisms." },
          { question: "Natural selection was proposed by:", options: ["Newton", "Charles Darwin", "Mendel", "Bohr"], correct: 1, explanation: "Charles Darwin explained evolution through natural selection." },
          { question: "Structures with common origin but different functions are called:", options: ["Analogous organs", "Homologous organs", "Vestigial organs", "Artificial organs"], correct: 1, explanation: "Homologous organs share origin but may perform different functions." },
          { question: "The survival of the fittest means:", options: ["Only strongest survive", "Best adapted survive", "Largest animals survive", "Youngest survive"], correct: 1, explanation: "Fitness in evolution refers to better adaptation to environment." },
        ],
      },
    ],
  },
  {
    subject: "Geography",
    chapters: [
      {
        name: "Climate",
        questions: [
          { question: "Climate refers to:", options: ["Daily weather", "Long-term weather pattern", "Only rainfall", "Only temperature"], correct: 1, explanation: "Climate is the long-term average pattern of weather in a region." },
          { question: "The instrument used to measure rainfall is:", options: ["Thermometer", "Barometer", "Rain gauge", "Hygrometer"], correct: 2, explanation: "Rainfall is measured using a rain gauge." },
          { question: "Sea breeze usually blows during:", options: ["Day", "Night", "Winter only", "Monsoon only"], correct: 0, explanation: "During the day, land heats faster and cooler air moves from sea to land." },
          { question: "The monsoon in India is important mainly for:", options: ["Tourism only", "Agriculture", "Mining only", "Road building only"], correct: 1, explanation: "Monsoon rains are crucial for Indian agriculture." },
          { question: "A place with very low rainfall is likely to have:", options: ["Humid climate", "Desert climate", "Mountain climate", "Polar climate only"], correct: 1, explanation: "Desert regions generally receive very little rainfall." },
        ],
      },
      {
        name: "Resources and Agriculture",
        questions: [
          { question: "Anything in the environment that can satisfy human needs is called a:", options: ["Tool", "Resource", "Soil profile", "Contour"], correct: 1, explanation: "A resource is anything useful that satisfies human needs." },
          { question: "The type of farming common in India is:", options: ["Shifting cultivation only", "Mixed and subsistence farming", "Only plantation farming", "Only commercial dairy"], correct: 1, explanation: "Many Indian regions practice mixed and subsistence farming." },
          { question: "Black soil is especially suitable for:", options: ["Tea", "Cotton", "Coffee", "Jute"], correct: 1, explanation: "Black soil retains moisture and is ideal for cotton cultivation." },
          { question: "Terrace farming is useful in:", options: ["Flat plains", "Hilly areas", "Deserts", "Coastal lagoons"], correct: 1, explanation: "Terrace farming helps farming on hill slopes and reduces soil erosion." },
          { question: "Irrigation helps farmers by:", options: ["Reducing crop growth", "Supplying water to crops", "Increasing salinity only", "Stopping sunlight"], correct: 1, explanation: "Irrigation provides water when rainfall is insufficient." },
        ],
      },
    ],
  },
  {
    subject: "Social Science",
    chapters: [
      {
        name: "Indian National Movement",
        questions: [
          { question: "Who started the Non-Cooperation Movement?", options: ["Subhas Chandra Bose", "Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel"], correct: 2, explanation: "Mahatma Gandhi launched the Non-Cooperation Movement in 1920." },
          { question: "When did India gain independence?", options: ["1945", "1946", "1947", "1950"], correct: 2, explanation: "India became independent on 15 August 1947." },
          { question: "The Quit India Movement was launched in:", options: ["1940", "1942", "1944", "1946"], correct: 1, explanation: "The Quit India Movement began in 1942." },
          { question: "Who gave the slogan 'Do or Die'?", options: ["Nehru", "Tilak", "Gandhi", "Bose"], correct: 2, explanation: "Gandhi gave the slogan during the Quit India Movement." },
          { question: "The Salt March was in the year:", options: ["1928", "1930", "1932", "1934"], correct: 1, explanation: "The Dandi Salt March took place in 1930." },
          { question: "The Indian National Congress was founded in:", options: ["1857", "1885", "1905", "1919"], correct: 1, explanation: "The Indian National Congress was founded in 1885." },
          { question: "Jallianwala Bagh massacre took place in:", options: ["Amritsar", "Delhi", "Mumbai", "Kolkata"], correct: 0, explanation: "The massacre took place at Jallianwala Bagh in Amritsar." },
        ],
      },
      {
        name: "Indian Democracy",
        questions: [
          { question: "India is a:", options: ["Monarchy", "Federal Republic", "Dictatorship", "Communist state"], correct: 1, explanation: "India is a sovereign democratic republic with a federal system." },
          { question: "How many members are in the Lok Sabha (max)?", options: ["245", "545", "552", "500"], correct: 2, explanation: "The maximum strength of Lok Sabha is 552." },
          { question: "The President of India is elected by:", options: ["Citizens directly", "Electoral college", "Prime Minister", "Parliament alone"], correct: 1, explanation: "The President is elected by an electoral college." },
          { question: "Who is the constitutional head of the state government?", options: ["President", "Governor", "Chief Minister", "Speaker"], correct: 1, explanation: "The Governor is the constitutional head of the state." },
          { question: "The Indian Constitution was adopted on:", options: ["26 Jan 1950", "15 Aug 1947", "26 Nov 1949", "2 Oct 1950"], correct: 2, explanation: "It was adopted on 26 November 1949." },
          { question: "Universal adult franchise means:", options: ["Only educated people vote", "All adults have the right to vote", "Only men vote", "Only taxpayers vote"], correct: 1, explanation: "Every adult citizen meeting legal conditions can vote." },
          { question: "The lower house of Parliament is called:", options: ["Rajya Sabha", "Lok Sabha", "Vidhan Sabha", "Legislative Council"], correct: 1, explanation: "Lok Sabha is the lower house of the Indian Parliament." },
        ],
      },
    ],
  },
  {
    subject: "English",
    chapters: [
      {
        name: "Grammar - Tenses",
        questions: [
          { question: "Which is in simple past tense?", options: ["I go", "I went", "I will go", "I am going"], correct: 1, explanation: "'I went' is in simple past tense." },
          { question: "'She has been reading for 2 hours' is:", options: ["Present Perfect", "Present Perfect Continuous", "Past Perfect", "Simple Present"], correct: 1, explanation: "This is present perfect continuous tense." },
          { question: "The future tense uses:", options: ["was/were", "shall/will", "had", "has/have"], correct: 1, explanation: "Future tense commonly uses shall or will." },
          { question: "'They are playing cricket' is:", options: ["Simple Present", "Present Continuous", "Past Continuous", "Future"], correct: 1, explanation: "It is in present continuous tense." },
          { question: "Which sentence is in passive voice?", options: ["She writes a letter", "A letter was written by her", "She is writing", "She wrote"], correct: 1, explanation: "The object becomes the subject in passive voice." },
          { question: "Choose the correct simple present sentence:", options: ["She go to school", "She goes to school", "She going to school", "She gone to school"], correct: 1, explanation: "In simple present, third-person singular takes 'goes'." },
          { question: "'I had finished my homework before dinner' is:", options: ["Simple past", "Past perfect", "Future perfect", "Present perfect"], correct: 1, explanation: "'Had + past participle' forms past perfect tense." },
        ],
      },
      {
        name: "Figures of Speech",
        questions: [
          { question: "A simile uses:", options: ["Exaggeration", "'Like' or 'as' for comparison", "Human qualities for objects", "Opposite meaning"], correct: 1, explanation: "A simile compares using 'like' or 'as'." },
          { question: "'The wind howled' is an example of:", options: ["Simile", "Metaphor", "Personification", "Alliteration"], correct: 2, explanation: "It gives a human-like action to wind." },
          { question: "'Peter Piper picked a peck' is:", options: ["Metaphor", "Simile", "Alliteration", "Irony"], correct: 2, explanation: "Repeating the same starting consonant sound is alliteration." },
          { question: "'He is as brave as a lion' is a:", options: ["Metaphor", "Simile", "Hyperbole", "Onomatopoeia"], correct: 1, explanation: "It uses 'as' for comparison." },
          { question: "Hyperbole is:", options: ["Understatement", "Exaggeration", "Comparison", "Contradiction"], correct: 1, explanation: "Hyperbole means deliberate exaggeration." },
          { question: "'Time is a thief' is a:", options: ["Simile", "Metaphor", "Irony", "Oxymoron"], correct: 1, explanation: "It directly compares time to a thief without using like/as." },
          { question: "Words like 'buzz' and 'bang' are examples of:", options: ["Onomatopoeia", "Metaphor", "Allusion", "Pun"], correct: 0, explanation: "Onomatopoeia imitates natural sounds." },
        ],
      },
      {
        name: "Writing Skills",
        questions: [
          { question: "A formal letter should usually begin with:", options: ["Yo!", "Respected Sir/Madam", "Dear buddy", "Hey there"], correct: 1, explanation: "Formal letters use polite and proper greetings." },
          { question: "The main purpose of a report is to:", options: ["Entertain only", "Present factual information clearly", "Tell jokes", "Write poetry"], correct: 1, explanation: "Reports are structured to present facts and observations." },
          { question: "A notice should be:", options: ["Very long", "Clear and brief", "Only decorative", "Written in verse"], correct: 1, explanation: "Notices should be concise and informative." },
          { question: "The subject line in a formal letter tells:", options: ["The writer's hobby", "The main topic of the letter", "The date only", "The receiver's address"], correct: 1, explanation: "The subject line tells the purpose of the letter." },
          { question: "A speech should mostly use language that is:", options: ["Confusing", "Clear and engaging", "Silent", "Only technical"], correct: 1, explanation: "Good speeches are easy to follow and engaging." },
        ],
      },
    ],
  },
  {
    subject: "Hindi",
    chapters: [
      {
        name: "व्याकरण - संज्ञा",
        questions: [
          { question: "संज्ञा किसे कहते हैं?", options: ["क्रिया का नाम", "किसी व्यक्ति, वस्तु, स्थान का नाम", "विशेषण का रूप", "सर्वनाम का भेद"], correct: 1, explanation: "संज्ञा किसी व्यक्ति, वस्तु, स्थान या भाव के नाम को कहते हैं।" },
          { question: "संज्ञा के कितने भेद होते हैं?", options: ["3", "5", "4", "2"], correct: 1, explanation: "संज्ञा के पाँच प्रमुख भेद माने जाते हैं।" },
          { question: "'दूध' कौन सी संज्ञा है?", options: ["व्यक्तिवाचक", "जातिवाचक", "द्रव्यवाचक", "भाववाचक"], correct: 2, explanation: "'दूध' पदार्थ का नाम है, इसलिए द्रव्यवाचक संज्ञा है।" },
          { question: "'ईमानदारी' कौन सी संज्ञा है?", options: ["व्यक्तिवाचक", "भाववाचक", "जातिवाचक", "समूहवाचक"], correct: 1, explanation: "यह एक भाव को प्रकट करती है, इसलिए भाववाचक संज्ञा है।" },
          { question: "'गंगा' कौन सी संज्ञा है?", options: ["व्यक्तिवाचक", "जातिवाचक", "भाववाचक", "समूहवाचक"], correct: 0, explanation: "'गंगा' एक विशेष नदी का नाम है, इसलिए व्यक्तिवाचक संज्ञा है।" },
          { question: "'झुंड' कौन सी संज्ञा है?", options: ["समूहवाचक", "द्रव्यवाचक", "व्यक्तिवाचक", "भाववाचक"], correct: 0, explanation: "समूह को बताने वाली संज्ञा समूहवाचक कहलाती है।" },
          { question: "जो संज्ञा किसी जाति या वर्ग का बोध कराए, उसे क्या कहते हैं?", options: ["व्यक्तिवाचक", "जातिवाचक", "भाववाचक", "समूहवाचक"], correct: 1, explanation: "जातिवाचक संज्ञा किसी वर्ग या जाति का सामान्य नाम बताती है।" },
        ],
      },
      {
        name: "व्याकरण - सर्वनाम",
        questions: [
          { question: "सर्वनाम किसके स्थान पर आता है?", options: ["क्रिया", "संज्ञा", "विशेषण", "अव्यय"], correct: 1, explanation: "सर्वनाम संज्ञा के स्थान पर प्रयोग होता है।" },
          { question: "'मैं' कौन सा सर्वनाम है?", options: ["पुरुषवाचक", "निजवाचक", "निश्चयवाचक", "सम्बन्धवाचक"], correct: 0, explanation: "'मैं' पुरुषवाचक सर्वनाम है।" },
          { question: "'जो मेहनत करता है, वही सफल होता है' में 'जो' क्या है?", options: ["प्रश्नवाचक सर्वनाम", "सम्बन्धवाचक सर्वनाम", "निजवाचक सर्वनाम", "अनिश्चयवाचक सर्वनाम"], correct: 1, explanation: "'जो' यहाँ सम्बन्ध स्थापित कर रहा है, इसलिए सम्बन्धवाचक सर्वनाम है।" },
          { question: "'कोई' किस प्रकार का सर्वनाम है?", options: ["निश्चयवाचक", "अनिश्चयवाचक", "पुरुषवाचक", "सम्बन्धवाचक"], correct: 1, explanation: "'कोई' अनिश्चित व्यक्ति या वस्तु को दर्शाता है।" },
          { question: "'आप' का प्रयोग सामान्यतः किसके लिए होता है?", options: ["अनादर", "सम्मान", "संदेह", "आश्चर्य"], correct: 1, explanation: "'आप' आदर या सम्मान प्रकट करने के लिए प्रयुक्त होता है।" },
        ],
      },
    ],
  },
  {
    subject: "Marathi",
    chapters: [
      {
        name: "व्याकरण - नाम",
        questions: [
          { question: "नाम म्हणजे काय?", options: ["क्रियापदाचे रूप", "व्यक्ती, वस्तू, ठिकाणाचे नाव", "विशेषणाचा प्रकार", "सर्वनामाचा भेद"], correct: 1, explanation: "नाम म्हणजे व्यक्ती, वस्तू, ठिकाण किंवा भावनेचे नाव." },
          { question: "नामाचे किती प्रकार आहेत?", options: ["2", "3", "4", "5"], correct: 1, explanation: "शालेय पातळीवर नामाचे तीन मुख्य प्रकार शिकवले जातात." },
          { question: "'मुंबई' हे कोणते नाम आहे?", options: ["सामान्यनाम", "विशेषनाम", "भाववाचक नाम", "सर्वनाम"], correct: 1, explanation: "विशिष्ट शहराचे नाव असल्याने ते विशेषनाम आहे." },
          { question: "'पुस्तक' हे कोणते नाम आहे?", options: ["विशेषनाम", "सामान्यनाम", "भाववाचक नाम", "क्रियापद"], correct: 1, explanation: "हे एखाद्या सामान्य वस्तूचे नाव आहे, म्हणून सामान्यनाम आहे." },
          { question: "अलंकार म्हणजे:", options: ["वाक्याचा प्रकार", "भाषेला सौंदर्य देणारे साधन", "लिंगाचा भेद", "वचनाचा प्रकार"], correct: 1, explanation: "अलंकार भाषेला सौंदर्य आणि परिणामकारकता देतात." },
          { question: "'प्रामाणिकपणा' हे कोणते नाम आहे?", options: ["भाववाचक नाम", "विशेषनाम", "सामान्यनाम", "सर्वनाम"], correct: 0, explanation: "भाव किंवा गुण दर्शवणारे शब्द भाववाचक नाम असतात." },
          { question: "'विद्यार्थी' हा शब्द कोणत्या प्रकारात येतो?", options: ["सामान्यनाम", "विशेषनाम", "भाववाचक नाम", "क्रियापद"], correct: 0, explanation: "तो एखाद्या वर्गातील व्यक्तीचे सामान्य नाव आहे." },
        ],
      },
      {
        name: "व्याकरण - सर्वनाम",
        questions: [
          { question: "सर्वनाम कोणाच्या जागी येते?", options: ["क्रियापद", "नाम", "विशेषण", "उभयान्वयी अव्यय"], correct: 1, explanation: "सर्वनाम हे नामाच्या जागी येते." },
          { question: "'तो' हा कोणता शब्दप्रकार आहे?", options: ["विशेषण", "सर्वनाम", "क्रियापद", "नाम"], correct: 1, explanation: "'तो' हा सर्वनाम आहे." },
          { question: "'मी' कोणते सर्वनाम आहे?", options: ["पुरुषवाचक", "संकेतवाचक", "प्रश्नार्थक", "अनिश्चित"], correct: 0, explanation: "'मी' हे प्रथमपुरुषवाचक सर्वनाम आहे." },
          { question: "'कोण' हे कोणत्या प्रकारात मोडते?", options: ["प्रश्नार्थक सर्वनाम", "पुरुषवाचक सर्वनाम", "दर्शक सर्वनाम", "निजवाचक सर्वनाम"], correct: 0, explanation: "प्रश्न विचारण्यासाठी वापरले जाणारे सर्वनाम म्हणजे प्रश्नार्थक सर्वनाम." },
          { question: "'आपण' हा शब्द सामान्यतः कशासाठी वापरतात?", options: ["आदर किंवा समावेशक उल्लेख", "राग", "भीती", "उपहास"], correct: 0, explanation: "'आपण' हा शब्द आदराने किंवा सामूहिक संदर्भात वापरतात." },
        ],
      },
    ],
  },
];
