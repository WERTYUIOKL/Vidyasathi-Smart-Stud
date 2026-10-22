import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Key topics from Indian SSC (10th) and HSC (12th) textbooks
const TEXTBOOK_DATA = [
  // === SSC 10th - Science ===
  {
    board: "SSC", grade: "10", subject: "Science",
    title: "Maharashtra State Board Science Part 1 & 2 - Class 10",
    chapters: [
      { chapter: "Gravitation", content: "Gravitation is the force of attraction between any two objects in the universe. Newton's Law of Universal Gravitation states that every particle attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of the distance between them. F = G × (m1 × m2) / r². The gravitational constant G = 6.674 × 10⁻¹¹ N·m²/kg². Weight is the force exerted on an object due to gravity: W = mg. On Earth, g ≈ 9.8 m/s². Free fall occurs when the only force acting on an object is gravity. The acceleration during free fall equals g. Kepler's Laws: 1) Planets orbit in ellipses with the Sun at one focus. 2) A line from planet to Sun sweeps equal areas in equal times. 3) T² ∝ r³ (square of period proportional to cube of average distance)." },
      { chapter: "Periodic Classification of Elements", content: "Mendeleev arranged elements by increasing atomic mass and observed periodic recurrence of properties. The Modern Periodic Table arranges elements by increasing atomic number (Moseley's contribution). The table has 7 periods (horizontal rows) and 18 groups (vertical columns). Periods represent the number of electron shells. Groups represent similar valence electron configurations. Alkali metals (Group 1) are highly reactive, have 1 valence electron. Noble gases (Group 18) have complete octets and are largely unreactive. Trends: Atomic radius decreases across a period (left to right) due to increasing nuclear charge. Ionization energy increases across a period. Electronegativity increases across a period. Metallic character decreases across a period. Down a group: atomic radius increases, ionization energy decreases, electronegativity decreases." },
      { chapter: "Chemical Reactions and Equations", content: "A chemical reaction involves transformation of reactants into products with new chemical properties. Types: Combination (A + B → AB), Decomposition (AB → A + B), Displacement (A + BC → AC + B), Double Displacement (AB + CD → AD + CB), Oxidation-Reduction (transfer of electrons). Balancing equations: ensure equal number of atoms on both sides. Exothermic reactions release heat (e.g., combustion). Endothermic reactions absorb heat (e.g., photosynthesis). Oxidation is loss of electrons or gain of oxygen. Reduction is gain of electrons or loss of oxygen. Corrosion: metal surface is attacked by substances like oxygen and water (e.g., rusting of iron). Rancidity: oxidation of fats and oils in food, making it taste and smell bad." },
      { chapter: "Life Processes", content: "Nutrition: Autotrophic (photosynthesis in plants using CO₂ + H₂O + sunlight → glucose + O₂) and Heterotrophic (animals depend on others for food). Human digestive system: mouth (salivary amylase breaks starch), stomach (HCl + pepsin breaks proteins), small intestine (bile + pancreatic juice, absorption of nutrients through villi), large intestine (water absorption). Respiration: Aerobic (with O₂, in mitochondria, 36 ATP) and Anaerobic (without O₂, in cytoplasm, 2 ATP, produces ethanol/lactic acid). Human respiratory system: nostrils → pharynx → larynx → trachea → bronchi → bronchioles → alveoli (gas exchange). Circulation: Heart is a four-chambered pump. Double circulation: pulmonary (heart-lungs-heart) and systemic (heart-body-heart). Blood components: RBC, WBC, platelets, plasma. Excretion: Kidneys filter blood, produce urine. Nephron is the functional unit. Steps: filtration, reabsorption, secretion." },
      { chapter: "Heredity and Evolution", content: "Heredity is the transmission of traits from parents to offspring. Mendel's Laws using pea plants: Law of Dominance (one allele dominates), Law of Segregation (alleles separate during gamete formation), Law of Independent Assortment (genes for different traits assort independently). Genotype vs Phenotype. Monohybrid cross ratio: 3:1. Dihybrid cross ratio: 9:3:3:1. Sex determination in humans: XX (female), XY (male). Father determines sex of child. Evolution: Darwin's theory of natural selection - organisms better adapted survive and reproduce. Evidence: fossils, homologous organs (same structure, different function), analogous organs (different structure, same function), vestigial organs. Speciation occurs through geographical isolation, genetic drift, and natural selection." },
      { chapter: "Light - Reflection and Refraction", content: "Reflection: angle of incidence = angle of reflection. Concave mirrors converge light (used in torches, headlights). Convex mirrors diverge light (used as rear-view mirrors). Mirror formula: 1/f = 1/v + 1/u. Magnification m = -v/u. Refraction: bending of light when passing between media of different densities. Snell's law: n₁ sin i = n₂ sin r. Refractive index n = speed in vacuum / speed in medium. Convex lens converges light (used in magnifying glass). Concave lens diverges light (used in spectacles for myopia). Lens formula: 1/f = 1/v - 1/u. Power of lens P = 1/f (in dioptres). Total internal reflection occurs when light travels from denser to rarer medium at angle > critical angle." },
      { chapter: "Electricity", content: "Electric current is the flow of electric charges. I = Q/t (ampere = coulomb/second). Potential difference V = W/Q (volt = joule/coulomb). Ohm's Law: V = IR. Resistance R = ρl/A where ρ is resistivity, l is length, A is cross-sectional area. Series combination: R_total = R₁ + R₂ + R₃. Parallel combination: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Electric power P = VI = I²R = V²/R. Energy E = Pt. 1 kWh = 3.6 × 10⁶ J. Heating effect of current: H = I²Rt (Joule's law). Applications: electric heater, iron, fuse. Fuse protects circuits from overloading." },
      { chapter: "Magnetic Effects of Electric Current", content: "A current-carrying conductor produces a magnetic field around it. Right-hand thumb rule: if thumb points in direction of current, fingers curl in direction of magnetic field. Solenoid behaves like a bar magnet. Electromagnet: soft iron core inside a solenoid. Fleming's Left Hand Rule: for force on current-carrying conductor in magnetic field (thumb=force, index=field, middle=current). Electric motor converts electrical energy to mechanical energy. Electromagnetic induction: changing magnetic field induces EMF (Faraday's law). Fleming's Right Hand Rule for induced current direction. Electric generator converts mechanical to electrical energy. AC vs DC generators." },
    ]
  },
  // === SSC 10th - Mathematics ===
  {
    board: "SSC", grade: "10", subject: "Mathematics",
    title: "Maharashtra State Board Mathematics Part 1 & 2 - Class 10",
    chapters: [
      { chapter: "Linear Equations in Two Variables", content: "A linear equation in two variables is of the form ax + by + c = 0. A pair of linear equations can be solved by: Graphical method (lines intersect at solution point), Substitution method (express one variable and substitute), Elimination method (add/subtract to eliminate one variable), Cross-multiplication method. Consistent system: has at least one solution (lines intersect or are coincident). Inconsistent system: no solution (parallel lines). If a₁/a₂ ≠ b₁/b₂: unique solution (intersecting). If a₁/a₂ = b₁/b₂ ≠ c₁/c₂: no solution (parallel). If a₁/a₂ = b₁/b₂ = c₁/c₂: infinite solutions (coincident)." },
      { chapter: "Quadratic Equations", content: "Standard form: ax² + bx + c = 0 where a ≠ 0. Solutions by factorization, completing the square, or quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Discriminant D = b² - 4ac. If D > 0: two distinct real roots. If D = 0: two equal real roots. If D < 0: no real roots. Sum of roots = -b/a. Product of roots = c/a. Nature of roots determines the graph of parabola: opens upward if a > 0, downward if a < 0. Vertex at x = -b/2a." },
      { chapter: "Arithmetic Progressions", content: "An Arithmetic Progression (AP) is a sequence where each term differs from the previous by a constant called common difference (d). General term: aₙ = a + (n-1)d where a is the first term. Sum of first n terms: Sₙ = n/2 × [2a + (n-1)d] = n/2 × (a + l) where l is the last term. If three numbers a, b, c are in AP then 2b = a + c. The nth term can also be found as: aₙ = Sₙ - Sₙ₋₁. Applications include finding missing terms, sum of natural numbers (n(n+1)/2), and word problems involving installments, savings, etc." },
      { chapter: "Triangles", content: "Similar triangles have the same shape but may differ in size. AA similarity: if two angles of one triangle equal two angles of another. SSS similarity: if sides are in proportion. SAS similarity: if one angle is equal and including sides are proportional. Basic Proportionality Theorem (Thales): A line parallel to one side of a triangle divides the other two sides proportionally. Pythagoras Theorem: In a right triangle, hypotenuse² = base² + perpendicular². Converse: If the square of one side equals the sum of squares of other two, triangle is right-angled. Area ratio of similar triangles = (ratio of corresponding sides)²." },
      { chapter: "Coordinate Geometry", content: "Distance formula: d = √[(x₂-x₁)² + (y₂-y₁)²]. Section formula: point dividing (x₁,y₁) and (x₂,y₂) in ratio m:n is ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)). Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2). Area of triangle with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃) = ½|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)|. Slope of line = (y₂-y₁)/(x₂-x₁). Equation of line: y - y₁ = m(x - x₁). Collinear points: area of triangle = 0." },
      { chapter: "Trigonometry", content: "In a right triangle: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Reciprocal ratios: cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ. Standard values: sin 0° = 0, sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1. Identities: sin²θ + cos²θ = 1, 1 + tan²θ = sec²θ, 1 + cot²θ = cosec²θ. Applications: height and distance problems using angle of elevation and angle of depression." },
      { chapter: "Statistics", content: "Mean of grouped data: Direct method x̄ = Σfᵢxᵢ/Σfᵢ. Assumed mean method: x̄ = a + Σfᵢdᵢ/Σfᵢ. Step deviation: x̄ = a + (Σfᵢuᵢ/Σfᵢ) × h. Median of grouped data: M = l + [(n/2 - cf)/f] × h where l=lower boundary, cf=cumulative frequency of class before median class, f=frequency of median class, h=class width. Mode = l + [(f₁-f₀)/(2f₁-f₀-f₂)] × h. Relationship: Mode = 3 Median - 2 Mean (approximately). Ogive: cumulative frequency curve, median is at n/2 on the curve." },
      { chapter: "Probability", content: "Probability of an event P(E) = number of favorable outcomes / total number of outcomes. 0 ≤ P(E) ≤ 1. P(sure event) = 1, P(impossible event) = 0. P(E) + P(not E) = 1. For a die: P(getting 6) = 1/6. For a coin: P(head) = 1/2. For a deck of cards: total 52 cards, 4 suits of 13 each. P(ace) = 4/52 = 1/13. P(red card) = 26/52 = 1/2. Compound probability: P(A and B) = P(A) × P(B) for independent events. P(A or B) = P(A) + P(B) - P(A and B)." },
    ]
  },
  // === HSC 12th - Physics ===
  {
    board: "HSC", grade: "12", subject: "Physics",
    title: "Maharashtra State Board Physics - Class 12",
    chapters: [
      { chapter: "Rotational Dynamics", content: "Moment of Inertia (I): rotational analog of mass. I = Σmᵢrᵢ². For continuous body: I = ∫r²dm. Parallel axis theorem: I = I_cm + Md². Perpendicular axis theorem (for planar bodies): I_z = I_x + I_y. Common moments: solid sphere = 2/5 MR², hollow sphere = 2/3 MR², solid cylinder = 1/2 MR², rod about center = 1/12 ML². Torque τ = r × F = Iα. Angular momentum L = Iω. Conservation: if τ = 0, L = constant. Rolling motion: v = rω, KE = 1/2 mv² + 1/2 Iω². For pure rolling, acceleration on incline: a = g sinθ / (1 + I/MR²)." },
      { chapter: "Electromagnetic Induction", content: "Faraday's Law: EMF induced equals the negative rate of change of magnetic flux. e = -dΦ/dt. For N turns: e = -N dΦ/dt. Lenz's Law: induced current opposes the change causing it. Motional EMF: e = Bvl for conductor moving perpendicular to field. Self-inductance: e = -L di/dt. Inductance of solenoid: L = μ₀n²Al. Energy stored in inductor: U = 1/2 LI². Mutual inductance: e₁ = -M di₂/dt. Eddy currents: induced in bulk conductors, used in braking and induction furnaces. AC generator: e = NBA ω sin(ωt). Transformers: V₁/V₂ = N₁/N₂ = I₂/I₁." },
      { chapter: "Current Electricity", content: "Ohm's Law: V = IR. Drift velocity: vd = eEτ/m = I/(neA). Resistivity ρ = m/(ne²τ). Temperature dependence: R = R₀(1 + αΔT). Kirchhoff's Laws: Junction rule (ΣI = 0), Loop rule (ΣV = 0). Wheatstone bridge: balanced when P/Q = R/S. Meter bridge for finding unknown resistance. Potentiometer: measures EMF without drawing current. Internal resistance of cell: V = E - Ir. Cells in series: E_total = E₁ + E₂, r_total = r₁ + r₂. Cells in parallel: E_total = E, 1/r_total = 1/r₁ + 1/r₂." },
      { chapter: "Dual Nature of Radiation and Matter", content: "Photoelectric effect: electrons emitted when light of sufficient frequency hits metal. Einstein's equation: KE_max = hν - φ (work function). Threshold frequency: ν₀ = φ/h. Stopping potential: eV₀ = hν - φ. Properties: instantaneous, depends on frequency not intensity for emission, intensity affects number of electrons. de Broglie wavelength: λ = h/p = h/(mv). Electron wavelength: λ = 1.226/√V nm. Davisson-Germer experiment confirmed wave nature of electrons. Wave-particle duality: radiation and matter exhibit both wave and particle properties." },
      { chapter: "Atoms and Nuclei", content: "Bohr's model: electrons orbit in stationary states with quantized angular momentum (L = nh/2π). Energy levels: Eₙ = -13.6/n² eV. Radius: rₙ = 0.529n² Å. Spectral series: Lyman (n→1, UV), Balmer (n→2, visible), Paschen (n→3, IR). Nuclear composition: protons (Z) + neutrons (N) = mass number (A). Nuclear force: strong, short-range, charge-independent. Mass defect: Δm = [Zm_p + Nm_n] - M. Binding energy: BE = Δmc². BE per nucleon curve: maximum at Fe-56 (most stable). Radioactive decay: N = N₀e^(-λt). Half-life: T½ = 0.693/λ. Alpha, beta, gamma decay. Nuclear fission: heavy nucleus splits (used in reactors). Nuclear fusion: light nuclei combine (powers the sun)." },
      { chapter: "Semiconductors", content: "Intrinsic semiconductors: pure Si/Ge, equal electrons and holes. Extrinsic: n-type (pentavalent dopant, majority carriers = electrons) and p-type (trivalent dopant, majority carriers = holes). p-n junction: depletion region forms at junction. Forward bias: reduces barrier, current flows. Reverse bias: increases barrier, negligible current. Diode as rectifier: half-wave and full-wave rectification. Zener diode: operates in reverse breakdown for voltage regulation. Transistor: npn or pnp, three regions (emitter, base, collector). CE configuration: current gain β = I_C/I_B. Transistor as amplifier and switch. Logic gates: AND, OR, NOT, NAND, NOR, XOR." },
    ]
  },
  // === HSC 12th - Chemistry ===
  {
    board: "HSC", grade: "12", subject: "Chemistry",
    title: "Maharashtra State Board Chemistry - Class 12",
    chapters: [
      { chapter: "Solid State", content: "Crystalline solids have long-range order; amorphous solids have short-range order. Unit cells: simple cubic (1 atom, 52.4% packing), BCC (2 atoms, 68%), FCC (4 atoms, 74%). Coordination number: SC=6, BCC=8, FCC=12. Packing efficiency: FCC and HCP are closest packed. Tetrahedral void: radius ratio 0.225-0.414. Octahedral void: 0.414-0.732. Defects: Schottky (missing ions, density decreases), Frenkel (ion displaced to interstitial, density unchanged). Electrical properties: conductors, semiconductors (n-type, p-type), insulators. Band theory explains electrical properties." },
      { chapter: "Solutions", content: "Molarity M = moles of solute / volume of solution in L. Molality m = moles of solute / mass of solvent in kg. Raoult's law: partial vapor pressure of each component is proportional to its mole fraction. P = P° × x. Ideal solutions obey Raoult's law (ΔH_mix = 0, ΔV_mix = 0). Non-ideal: positive deviation (weaker interactions, e.g., ethanol-acetone) and negative deviation (stronger interactions, e.g., chloroform-acetone). Colligative properties depend on number of solute particles: relative lowering of vapor pressure, boiling point elevation (ΔTb = Kb × m), freezing point depression (ΔTf = Kf × m), osmotic pressure (π = CRT). Van't Hoff factor i accounts for dissociation/association." },
      { chapter: "Electrochemistry", content: "Electrochemical cells convert chemical energy to electrical (galvanic) or vice versa (electrolytic). Galvanic cell: anode (oxidation, negative) and cathode (reduction, positive). Salt bridge maintains electrical neutrality. Standard electrode potential: measured vs SHE. EMF = E°cathode - E°anode. Nernst equation: E = E° - (RT/nF) ln Q = E° - (0.0592/n) log Q at 25°C. Gibbs energy: ΔG° = -nFE°. Conductivity κ = 1/ρ. Molar conductivity Λm = κ/c. Kohlrausch's law: Λ°m = λ°₊ + λ°₋. Faraday's laws: m = (M × I × t)/(n × F). Applications: batteries, fuel cells, corrosion prevention." },
      { chapter: "Chemical Kinetics", content: "Rate of reaction = change in concentration per unit time. Rate law: Rate = k[A]ⁿ[B]ᵐ. Order = n + m (determined experimentally). Zero order: [A] = [A]₀ - kt, t½ = [A]₀/2k. First order: ln[A] = ln[A]₀ - kt, t½ = 0.693/k (independent of concentration). Second order: 1/[A] = 1/[A]₀ + kt, t½ = 1/k[A]₀. Arrhenius equation: k = Ae^(-Ea/RT). ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂). Activation energy Ea: minimum energy needed for reaction. Catalyst lowers Ea without being consumed. Collision theory: rate depends on collision frequency, proper orientation, and sufficient energy." },
      { chapter: "Organic Chemistry - Aldehydes, Ketones and Carboxylic Acids", content: "Aldehydes (RCHO) and Ketones (RCOR'): Nucleophilic addition reactions at C=O. Preparation: oxidation of alcohols, ozonolysis of alkenes. Reactions: with HCN (cyanohydrins), with NH₂OH (oximes), with 2,4-DNP (used for identification). Aldol condensation: aldehyde with alpha-H + base → β-hydroxy aldehyde. Cannizzaro reaction: no alpha-H aldehydes + strong base → alcohol + salt of acid. Tollens' test: Ag mirror (aldehydes only). Fehling's test: red precipitate (aldehydes only). Carboxylic acids (RCOOH): acidic due to resonance stabilization of carboxylate ion. Reactions: with PCl₅/SOCl₂ (acyl chlorides), with alcohols (esters, Fischer esterification), decarboxylation." },
      { chapter: "Polymers", content: "Polymers are large molecules made of repeating monomer units. Addition polymers: formed by chain polymerization. Examples: polyethylene (ethylene), PVC (vinyl chloride), polystyrene, Teflon (PTFE), polyacrylonitrile. Condensation polymers: formed with loss of small molecules. Examples: Nylon 6,6 (hexamethylenediamine + adipic acid), Nylon 6 (caprolactam), polyester/terylene (ethylene glycol + terephthalic acid), Bakelite (phenol + formaldehyde). Natural polymers: starch, cellulose, proteins, nucleic acids, natural rubber (cis-polyisoprene). Vulcanization: cross-linking rubber with sulfur for hardness. Biodegradable polymers: PHBV, Nylon-2-Nylon-6." },
    ]
  },
  // === HSC 12th - Mathematics ===
  {
    board: "HSC", grade: "12", subject: "Mathematics",
    title: "Maharashtra State Board Mathematics - Class 12",
    chapters: [
      { chapter: "Differentiation", content: "Derivative of f(x) is f'(x) = lim(h→0) [f(x+h) - f(x)]/h. Rules: d/dx(xⁿ) = nxⁿ⁻¹, d/dx(eˣ) = eˣ, d/dx(ln x) = 1/x, d/dx(sin x) = cos x, d/dx(cos x) = -sin x. Product rule: (uv)' = u'v + uv'. Quotient rule: (u/v)' = (u'v - uv')/v². Chain rule: d/dx[f(g(x))] = f'(g(x)) × g'(x). Implicit differentiation: differentiate both sides with respect to x. Logarithmic differentiation: take ln of both sides for products/quotients of functions. Parametric differentiation: dy/dx = (dy/dt)/(dx/dt). Higher order derivatives: f''(x), f'''(x) etc." },
      { chapter: "Integration", content: "Integration is the reverse of differentiation. ∫xⁿdx = xⁿ⁺¹/(n+1) + C (n≠-1). ∫(1/x)dx = ln|x| + C. ∫eˣdx = eˣ + C. ∫sin x dx = -cos x + C. ∫cos x dx = sin x + C. Methods: substitution (∫f(g(x))g'(x)dx, let u=g(x)), integration by parts (∫udv = uv - ∫vdu, LIATE rule for choosing u). Partial fractions for rational functions. Definite integral: ∫ₐᵇf(x)dx = F(b) - F(a). Properties: ∫ₐᵇf(x)dx = -∫ᵇₐf(x)dx. Area under curve = ∫ₐᵇf(x)dx. Area between curves = ∫ₐᵇ|f(x)-g(x)|dx." },
      { chapter: "Differential Equations", content: "Order: highest derivative present. Degree: power of highest order derivative (when polynomial in derivatives). First order, first degree: dy/dx = f(x,y). Variable separable: dy/dx = g(x)h(y) → ∫dy/h(y) = ∫g(x)dx + C. Homogeneous: dy/dx = f(y/x), substitute y = vx. Linear: dy/dx + P(x)y = Q(x). Integrating factor: IF = e^∫P(x)dx. Solution: y × IF = ∫Q(x) × IF dx + C. Applications: growth/decay problems (dN/dt = kN → N = N₀eᵏᵗ), Newton's law of cooling, electrical circuits (LR, RC)." },
      { chapter: "Probability Distributions", content: "Random variable X: assigns numerical value to each outcome. Probability distribution: P(X = xᵢ) = pᵢ where Σpᵢ = 1. Mean (expected value): E(X) = ΣxᵢP(xᵢ). Variance: Var(X) = E(X²) - [E(X)]². Standard deviation: σ = √Var(X). Bernoulli trial: exactly two outcomes (success/failure). Binomial distribution: P(X=r) = ⁿCᵣ pʳ qⁿ⁻ʳ where q=1-p. Mean = np, Variance = npq. Poisson distribution: P(X=r) = (e⁻λ × λʳ)/r! for rare events. Mean = Variance = λ. Normal distribution: continuous, bell-shaped, symmetric about mean. 68-95-99.7 rule." },
      { chapter: "Matrices", content: "A matrix is a rectangular array of numbers. Order: m × n (m rows, n columns). Types: row, column, square, diagonal, scalar, identity, null, symmetric (A = Aᵀ), skew-symmetric (A = -Aᵀ). Operations: Addition (same order), Scalar multiplication, Matrix multiplication (columns of first = rows of second). Properties: AB ≠ BA (generally), (AB)C = A(BC), A(B+C) = AB + AC. Transpose: (Aᵀ)ᵀ = A, (AB)ᵀ = BᵀAᵀ. Determinant (square matrices): |A|. For 2×2: ad-bc. Cofactor expansion for 3×3. Properties: |AB| = |A||B|, |Aᵀ| = |A|. Inverse: A⁻¹ = adj(A)/|A| (exists iff |A| ≠ 0). Solving systems: AX = B → X = A⁻¹B. Cramer's rule using determinants." },
      { chapter: "Vectors", content: "Vector: quantity with magnitude and direction. Position vector: r = xî + yĵ + zk̂. Magnitude: |r| = √(x²+y²+z²). Unit vector: â = a/|a|. Addition: triangle law, parallelogram law. Dot product: a·b = |a||b|cosθ = a₁b₁+a₂b₂+a₃b₃. Properties: commutative, distributive. a·b = 0 iff perpendicular. Cross product: a×b = |a||b|sinθ n̂. |a×b| = area of parallelogram. Properties: anti-commutative (a×b = -b×a). a×b = 0 iff parallel. Scalar triple product: [a b c] = a·(b×c) = volume of parallelepiped. Coplanar vectors: [a b c] = 0." },
    ]
  },
  // === SSC 10th - Social Science ===
  {
    board: "SSC", grade: "10", subject: "Social Science",
    title: "Maharashtra State Board History and Political Science - Class 10",
    chapters: [
      { chapter: "Indian National Movement", content: "The Indian National Congress was founded in 1885 by A.O. Hume. Moderates (1885-1905): Dadabhai Naoroji, Gopal Krishna Gokhale - used petitions and prayers. Extremists (1905-1920): Bal Gangadhar Tilak ('Swaraj is my birthright'), Bipin Chandra Pal, Lala Lajpat Rai. Partition of Bengal (1905) by Lord Curzon led to Swadeshi Movement. Home Rule Movement (1916) by Tilak and Annie Besant. Gandhi's movements: Non-Cooperation (1920-22, Chauri Chaura incident), Civil Disobedience (1930, Salt March/Dandi March), Quit India (1942, 'Do or Die'). Subhas Chandra Bose and INA. Important acts: Rowlatt Act (1919), Government of India Act (1935). Independence: August 15, 1947. Partition into India and Pakistan." },
      { chapter: "The Union Government", content: "India is a sovereign, socialist, secular, democratic republic. The Constitution was adopted on 26 January 1950. Three branches: Legislature (Parliament), Executive (President, PM, Council of Ministers), Judiciary (Supreme Court). Parliament: Lok Sabha (House of People, 545 members, 5-year term) and Rajya Sabha (Council of States, 250 members, 6-year term with 1/3 retiring every 2 years). President: head of state, elected by electoral college. Prime Minister: head of government, leader of majority party. Fundamental Rights (Articles 14-32): equality, freedom, religion, culture, constitutional remedies. Directive Principles: guidelines for governance. Fundamental Duties: responsibilities of citizens. Amendment process: Article 368." },
      { chapter: "Political Parties", content: "Political parties are essential for democracy. Functions: contest elections, form government, make policies, represent public opinion. Types: National parties (recognized in 4+ states) and State/Regional parties. National parties: BJP (founded 1980, Hindutva ideology), INC (oldest party, 1885), BSP (Kanshi Ram, Dalit empowerment), CPI(M) (communist ideology), NCP. Multi-party system in India. Coalition governments: alliance of parties. Anti-defection law (52nd Amendment): prevents elected members from switching parties. Election Commission of India: independent body conducting elections. EVM (Electronic Voting Machine) usage. One person, one vote principle." },
    ]
  },
  // === SSC 10th - English ===
  {
    board: "SSC", grade: "10", subject: "English",
    title: "Maharashtra State Board English - Class 10",
    chapters: [
      { chapter: "Grammar - Tenses", content: "Simple Present: Subject + V1 (He plays). Used for habits, facts, schedules. Present Continuous: Subject + is/am/are + V-ing (She is reading). Used for ongoing actions. Present Perfect: Subject + has/have + V3 (They have finished). Used for completed actions with present relevance. Past Simple: Subject + V2 (I walked). Used for completed past actions. Past Continuous: Subject + was/were + V-ing. Past Perfect: Subject + had + V3. Used for action before another past action. Future Simple: Subject + will + V1. Future Continuous: Subject + will be + V-ing. Future Perfect: Subject + will have + V3. Active to Passive: Object becomes subject, verb becomes 'be + V3', subject becomes agent (by...)." },
      { chapter: "Grammar - Clauses and Sentence Types", content: "Simple sentence: one independent clause (The boy runs). Compound sentence: two independent clauses joined by coordinating conjunction (FANBOYS: for, and, nor, but, or, yet, so). Complex sentence: one independent + one or more dependent clauses. Noun clause: acts as noun ('What he said was true'). Adjective clause: modifies noun ('The book that I read was interesting'). Adverb clause: modifies verb/adjective/adverb ('I will go when it stops raining'). Reported speech: Direct to indirect. Present → Past, Past → Past Perfect. Said → told (with object). Pronouns and time expressions change. Conditional sentences: Zero (if + present, present), First (if + present, will + V1), Second (if + past, would + V1), Third (if + had + V3, would have + V3)." },
      { chapter: "Writing Skills", content: "Letter writing: Formal letters (to editor, complaint, application) follow format: sender's address, date, receiver's address, subject, salutation (Sir/Madam), body (3 paragraphs: introduction, details, conclusion), complimentary close (Yours faithfully). Informal letters: casual tone, Yours sincerely/lovingly. Essay writing: Introduction (thesis statement), Body (3 paragraphs with topic sentences, examples, evidence), Conclusion (summary, final thought). Paragraph writing: topic sentence + supporting details + concluding sentence. Notice writing: heading, date, body, signature, designation. Report writing: headline, byline, dateline, opening paragraph (5W1H), body, conclusion." },
    ]
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already seeded
    const { count } = await supabase.from("textbooks").select("*", { count: "exact", head: true });
    if (count && count > 0) {
      return new Response(
        JSON.stringify({ success: true, message: `Already seeded with ${count} textbooks.` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    let embeddingsAvailable = !!LOVABLE_API_KEY;

    const results: string[] = [];

    for (const textbook of TEXTBOOK_DATA) {
      // Insert textbook
      const { data: tb, error: tbError } = await supabase
        .from("textbooks")
        .insert({ title: textbook.title, board: textbook.board, grade: textbook.grade, subject: textbook.subject })
        .select()
        .single();

      if (tbError) {
        results.push(`Error inserting ${textbook.title}: ${tbError.message}`);
        continue;
      }

      // Insert chunks with optional embeddings
      for (const chapter of textbook.chapters) {
        let embedding = null;

        if (embeddingsAvailable) {
          try {
            const embResponse = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${LOVABLE_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "text-embedding-3-small",
                input: `${chapter.chapter}: ${chapter.content.substring(0, 500)}`,
                dimensions: 768,
              }),
            });

            if (embResponse.ok) {
              const embData = await embResponse.json();
              embedding = embData.data?.[0]?.embedding || null;
            } else {
              console.error("Embedding failed for", chapter.chapter);
              embeddingsAvailable = false; // Skip further embedding attempts
            }
          } catch (e) {
            console.error("Embedding error:", e);
            embeddingsAvailable = false;
          }
        }

        const { error: chunkError } = await supabase.from("textbook_chunks").insert({
          textbook_id: tb.id,
          chapter: chapter.chapter,
          content: chapter.content,
          embedding: embedding,
        });

        if (chunkError) {
          results.push(`Error inserting chunk ${chapter.chapter}: ${chunkError.message}`);
        }
      }

      results.push(`✅ ${textbook.title} - ${textbook.chapters.length} chapters`);
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("seed error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
