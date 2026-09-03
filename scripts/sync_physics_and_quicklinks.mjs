import fs from 'fs';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Read .env.local for Supabase credentials
const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const HODU_SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';

// SEO FAQs for all 25 Physics concepts
const PHYSICS_FAQS = {
  770: [
    { q: "What is the difference between accuracy and precision in physics?", a: "Accuracy refers to how close a measured value is to the true or standard value. Precision refers to the closeness of two or more measurements to each other (repeatability), regardless of whether they are close to the true value." },
    { q: "What are the three main types of errors in measurement?", a: "The three primary types are Systematic Errors (instrumental, zero error, environmental), Random Errors (unpredictable fluctuations, human observer variations), and Gross Errors (carelessness in taking readings or calculations)." },
    { q: "How do you calculate absolute error, relative error, and percentage error?", a: "Absolute Error = |True Value - Measured Value|. Relative Error = Absolute Error / True Value. Percentage Error = Relative Error × 100%." },
    { q: "Can a measurement be precise but not accurate?", a: "Yes. For example, if a faulty scale repeatedly weighs a 10 kg mass as 8.01 kg, 8.02 kg, and 8.01 kg, the readings are highly precise (consistent) but inaccurate (far from the true 10 kg value)." },
    { q: "What is least count error and how can it be minimized?", a: "Least count error is the error associated with the smallest division on a measuring instrument. It can be minimized by using higher-precision instruments (e.g., Vernier caliper instead of a standard ruler) and repeating readings to take an average." }
  ],
  771: [
    { q: "What are the main postulates of Dalton's Atomic Theory?", a: "1. All matter is composed of indivisible particles called atoms. 2. Atoms of a given element are identical in mass and properties. 3. Atoms cannot be created, divided, or destroyed in chemical reactions. 4. Compounds are formed by combinations of different atoms in fixed simple whole-number ratios." },
    { q: "What are the limitations of Dalton's atomic theory?", a: "Dalton's theory could not explain the existence of subatomic particles (electrons, protons, neutrons), isotopes (atoms of same element with different masses), or isobars (different elements with the same mass)." },
    { q: "How did Rutherford's Alpha Scattering Experiment change atomic theory?", a: "Rutherford discovered that most of an atom is empty space, with a tiny, dense, positively charged center called the nucleus, around which electrons revolve." },
    { q: "What were Bohr's major improvements to the atomic model?", a: "Bohr proposed that electrons revolve around the nucleus only in specific stationary, quantized orbits with fixed energies, and emit/absorb radiation only when jumping between energy levels." },
    { q: "Why is the Quantum Mechanical model of the atom used today?", a: "The modern model incorporates wave-particle duality (de Broglie) and Heisenberg's Uncertainty Principle, describing electrons not in fixed orbits, but in 3D probability clouds called orbitals." }
  ],
  772: [
    { q: "What is Avogadro's Hypothesis (Avogadro's Law)?", a: "Avogadro's Hypothesis states that equal volumes of all gases, at the same temperature and pressure, contain an equal number of molecules." },
    { q: "What is the mathematical formula for Avogadro's Law?", a: "V ∝ n (Volume is directly proportional to the number of moles of gas at constant temperature and pressure), which can be written as V₁/n₁ = V₂/n₂." },
    { q: "What is the molar volume of an ideal gas at STP?", a: "At Standard Temperature and Pressure (STP: 0°C and 1 atm), 1 mole of any ideal gas occupies exactly 22.4 liters (22.7 L under modern IUPAC standard pressure of 1 bar)." },
    { q: "What is the relationship between Vapor Density and Molecular Mass?", a: "Molecular Mass = 2 × Vapor Density (derived directly using Avogadro's hypothesis)." },
    { q: "How does Avogadro's law help in chemical stoichiometry?", a: "It allows chemists to determine reacting volume ratios of gases in chemical reactions directly from stoichiometric coefficients in balanced equations." }
  ],
  773: [
    { q: "What is Boyle's Law and its mathematical formula?", a: "Boyle's Law states that at constant temperature, the volume of a given mass of dry gas is inversely proportional to its pressure. Formula: P ∝ 1/V or P₁V₁ = P₂V₂ = constant." },
    { q: "What remains constant in Boyle's Law?", a: "The temperature (T) of the gas and the mass/number of moles (n) of the gas remain constant (isothermal condition)." },
    { q: "What is the shape of a Boyle's Law graph (P vs V)?", a: "The graph of Pressure vs Volume at constant temperature is a rectangular hyperbola called an Isotherm. A plot of P vs 1/V is a straight line passing through the origin." },
    { q: "What are real-life examples of Boyle's Law?", a: "1. Breathing (expansion of diaphragm decreases lung pressure so air rushes in). 2. Medical syringes (pulling the plunger increases volume and lowers pressure to draw liquid). 3. Scuba diving decompression." },
    { q: "Why do real gases deviate from Boyle's Law at high pressure?", a: "Real gases deviate because gas molecules occupy finite volume and experience intermolecular attraction forces, which are accounted for by the Van der Waals equation." }
  ],
  774: [
    { q: "What is the key difference between centripetal and centrifugal force?", a: "Centripetal force is a real inward force that pulls a body toward the center of curvature to maintain circular motion. Centrifugal force is a pseudo (fictitious) outward force observed only in a rotating (non-inertial) frame of reference." },
    { q: "What is the formula for centripetal force?", a: "F_c = (m · v²) / r = m · ω² · r, where m is mass, v is linear speed, r is radius of circular path, and ω is angular velocity." },
    { q: "Why is centrifugal force called a pseudo or fictitious force?", a: "It is called a pseudo force because it arises purely due to the inertia of the body when viewed from an accelerating/rotating frame of reference, rather than from any actual physical interaction like gravity or tension." },
    { q: "What provides centripetal force for a car turning on a road?", a: "On a flat road, static friction between tires and road provides centripetal force. On a banked road, the horizontal component of the normal reaction force (N sin θ) provides the necessary centripetal force." },
    { q: "What are common practical applications of centrifugal force?", a: "Centrifuges in blood testing laboratories, washing machine spin dryers, cream separators, and centrifugal water pumps." }
  ],
  775: [
    { q: "What are convection currents and what causes them?", a: "Convection currents are continuous circulating flows in liquids and gases caused by density differences resulting from temperature variations. Hotter, less dense fluid rises, while cooler, denser fluid sinks." },
    { q: "How do convection currents explain sea breeze and land breeze?", a: "During the day, land heats faster than the sea; hot air over land rises, drawing cooler air from the sea (Sea Breeze). At night, land cools faster; warm air over the sea rises, drawing cool air from the land (Land Breeze)." },
    { q: "What role do convection currents play in Earth's mantle?", a: "Thermal convection currents in the semi-fluid asthenosphere of Earth's mantle drive the movement of tectonic plates, causing continental drift, earthquakes, and volcanic activity." },
    { q: "Why can convection NOT occur in solids?", a: "In solids, particles are tightly bound in fixed lattice positions and cannot move freely from one place to another. Only conduction is possible in solids." },
    { q: "How do convection currents affect atmospheric weather?", a: "Convection currents create low and high pressure zones, forming clouds, rainstorms, cyclones, and global wind patterns like Trade Winds." }
  ],
  776: [
    { q: "What is the main difference between an Electric Field and a Magnetic Field?", a: "An electric field is created by static or moving electric charges and exerts force on any charged particle. A magnetic field is created only by moving electric charges or intrinsic magnetic dipoles and exerts force only on moving charges or other magnets." },
    { q: "Can magnetic monopoles exist in nature?", a: "No. Magnetic poles always exist in dipoles (North and South). Breaking a magnet always results in two smaller magnets. In contrast, electric monopoles (single positive or negative charges) exist freely." },
    { q: "What are the SI units of Electric Field and Magnetic Field?", a: "The SI unit of electric field is Newton per Coulomb (N/C) or Volt per meter (V/m). The SI unit of magnetic field is Tesla (T) or Weber per square meter (Wb/m²)." },
    { q: "What is the Lorentz Force formula?", a: "Lorentz Force combines electric and magnetic forces: F = q(E + v × B), where q is charge, E is electric field vector, v is velocity vector, and B is magnetic field vector." },
    { q: "Do electric and magnetic field lines form closed loops?", a: "Electric field lines start on positive charges and terminate on negative charges (non-closed loops). Magnetic field lines are continuous closed loops (Gauss's Law for Magnetism: ∇·B = 0)." }
  ],
  777: [
    { q: "What is the definition of one Ampere (A)?", a: "One Ampere is the constant electric current that, when flowing through two infinitely long, thin parallel conductors placed 1 meter apart in a vacuum, produces between them a force of 2 × 10⁻⁷ Newtons per meter of length." },
    { q: "How is Ampere related to Coulombs and time?", a: "1 Ampere = 1 Coulomb per second (1 A = 1 C/s). It represents the flow of 6.242 × 10¹⁸ electrons per second across a conductor cross-section." },
    { q: "How is an ammeter connected in an electrical circuit?", a: "An ammeter must always be connected in SERIES in a circuit because it has very low internal resistance and needs to measure the total current passing through the component." },
    { q: "What is the difference between Direct Current (DC) and Alternating Current (AC) in amperes?", a: "In DC, current flows in a single constant direction (e.g., batteries). In AC, current reverses direction periodically at a specific frequency, typically 50 Hz or 60 Hz (e.g., household electricity)." },
    { q: "What is the relationship between Ampere, Volt, and Ohm?", a: "By Ohm's Law: I = V / R (Current in Amperes = Voltage in Volts ÷ Resistance in Ohms)." }
  ],
  778: [
    { q: "What is the audible sound frequency range for human ears?", a: "The audible range for a healthy human ear is approximately 20 Hz to 20,000 Hz (20 kHz)." },
    { q: "What is Infrasonic sound and who can detect it?", a: "Infrasonic sound refers to frequencies below 20 Hz. Animals such as elephants, whales, and rhinoceroses use infrasound for long-distance communication, and earthquakes produce infrasonic waves." },
    { q: "What is Ultrasonic sound and what are its key applications?", a: "Ultrasonic sound refers to frequencies above 20,000 Hz. Key applications include medical ultrasound imaging (sonography), SONAR navigation, ultrasonic cleaning, and flaw detection in metals." },
    { q: "How do bats and dolphins use ultrasound?", a: "They emit high-frequency ultrasonic clicks and listen to the returning echoes to navigate and locate prey in complete darkness, a process called echolocation." },
    { q: "Why does human high-frequency hearing degrade with age?", a: "Exposure to loud noise and natural aging cause gradual damage to the delicate hair cells (cilia) in the cochlea of the inner ear, reducing perception of frequencies above 12-15 kHz (presbycusis)." }
  ],
  779: [
    { q: "What is the Azimuthal Quantum Number (l)?", a: "The Azimuthal Quantum Number (also called orbital angular momentum quantum number or subsidiary quantum number), denoted by 'l', specifies the three-dimensional shape of an electron orbital and its subshell." },
    { q: "What values can the azimuthal quantum number 'l' take?", a: "For a given principal quantum number 'n', 'l' can take integer values from 0 up to (n - 1). For example, if n = 3, l can be 0, 1, or 2." },
    { q: "What subshells correspond to l = 0, 1, 2, 3?", a: "l = 0 corresponds to s-orbital (spherical), l = 1 to p-orbital (dumbbell), l = 2 to d-orbital (double dumbbell), and l = 3 to f-orbital (complex)." },
    { q: "What is the formula for orbital angular momentum?", a: "L = √(l(l + 1)) · (h / 2π), where h is Planck's constant." },
    { q: "How many electrons can a subshell hold based on l?", a: "The maximum number of electrons in a subshell is given by 2(2l + 1). For example, s (l=0) holds 2, p (l=1) holds 6, d (l=2) holds 10, and f (l=3) holds 14 electrons." }
  ],
  780: [
    { q: "What is Buoyancy and Buoyant Force (Upthrust)?", a: "Buoyancy is the upward force exerted by a fluid on an object placed in or submerged in it, opposing the downward force of gravity." },
    { q: "State Archimedes' Principle.", a: "Archimedes' Principle states that when a body is immersed fully or partially in a fluid, it experiences an upward buoyant force equal to the weight of the fluid displaced by the body." },
    { q: "What is the mathematical formula for Buoyant Force?", a: "F_b = ρ · V · g, where ρ is fluid density, V is submerged volume of the body, and g is acceleration due to gravity." },
    { q: "Why does an iron ship float while an iron nail sinks in water?", a: "An iron ship is hollow and contains a large volume of air, making its average density much lower than water. It displaces a large volume of water whose weight exceeds the ship's total weight. A solid iron nail is denser than water and cannot displace enough water to balance its weight." },
    { q: "What are the three conditions for floating of an object?", a: "1. If Body Density < Fluid Density: Object floats with a portion above surface. 2. If Body Density = Fluid Density: Object floats fully submerged in neutral equilibrium. 3. If Body Density > Fluid Density: Object sinks." }
  ],
  781: [
    { q: "What is the fundamental difference between Heat and Temperature?", a: "Heat is the total thermal energy transferred between systems due to a temperature difference (measured in Joules). Temperature is a measure of the average kinetic energy of the molecules in a substance (measured in Kelvin or Celsius)." },
    { q: "Can two objects at the same temperature have different heat contents?", a: "Yes. A bucket of warm water at 40°C has much more heat energy than a teacup of water at 40°C because it has far more molecules." },
    { q: "What is the direction of spontaneous heat transfer?", a: "Heat always flows spontaneously from a body at higher temperature to a body at lower temperature until thermal equilibrium is reached (Zeroth & Second Laws of Thermodynamics)." },
    { q: "What are the standard units of heat and temperature?", a: "SI unit of Heat is Joule (J) (also measured in calories: 1 cal = 4.184 J). SI unit of Temperature is Kelvin (K) (°C = K - 273.15)." },
    { q: "How is heat measured versus temperature measured?", a: "Temperature is measured using a thermometer. Heat transfer is measured using a calorimeter (Q = m · c · ΔT)." }
  ],
  782: [
    { q: "What is Electrical Force (Electrostatic Force)?", a: "Electrical force is the fundamental attractive or repulsive force exerted between charged particles governed by Coulomb's Law." },
    { q: "What is Coulomb's Law formula for electric force?", a: "F = (1 / 4πε₀) · (|q₁ · q₂| / r²) = k · (|q₁ · q₂| / r²), where k ≈ 8.99 × 10⁹ N·m²/C², q₁ and q₂ are charges, and r is the separation distance." },
    { q: "What are the two basic types of electrical forces?", a: "1. Attractive Force: Occurs between unlike (opposite) charges (+ and -). 2. Repulsive Force: Occurs between like charges (+ and +, or - and -)." },
    { q: "How does the medium affect electrostatic force?", a: "When charges are placed in a dielectric medium of relative permittivity (dielectric constant) K, the electrostatic force decreases by a factor of K: F_medium = F_vacuum / K." },
    { q: "How does electrostatic force compare with gravitational force?", a: "Electrostatic force is roughly 10³⁶ times stronger than gravitational force between two protons, and can be both attractive and repulsive, whereas gravity is always attractive." }
  ],
  783: [
    { q: "What is Fluid Friction (Drag)?", a: "Fluid friction is the resistive force that opposes the motion of an object traveling through a fluid (liquid or gas), or between adjacent layers of fluid moving at different velocities." },
    { q: "What factors affect fluid friction on an object?", a: "1. Speed of the object relative to fluid. 2. Shape and surface area of the object. 3. Viscosity (thickness/nature) of the fluid. 4. Density of the fluid." },
    { q: "Why are airplanes, boats, and fish streamlined in shape?", a: "A streamlined shape (narrow at front and tapering at back) reduces drag and turbulence, allowing smooth fluid flow and minimizing energy loss due to fluid friction." },
    { q: "What is Stokes' Law in fluid mechanics?", a: "Stokes' Law gives the drag force on a small sphere moving through a viscous fluid: F = 6πηrv, where η is viscosity coefficient, r is sphere radius, and v is velocity." },
    { q: "How does temperature affect fluid friction in liquids vs gases?", a: "In liquids, increasing temperature decreases viscosity (lowers friction). In gases, increasing temperature increases molecular collisions, thereby increasing viscosity." }
  ],
  784: [
    { q: "State Bernoulli's Principle in fluid dynamics.", a: "Bernoulli's Principle states that for an incompressible, non-viscous fluid in streamline flow, the sum of pressure energy, kinetic energy per unit volume, and potential energy per unit volume remains constant along a streamline: P + ½ρv² + ρgh = constant." },
    { q: "How does Bernoulli's Principle explain airplane lift?", a: "Airplane wings (airfoils) are curved on top. Air travels faster over the upper surface, creating a region of lower pressure compared to the bottom surface. This pressure difference produces an upward lift force." },
    { q: "What is the Equation of Continuity for fluid flow?", a: "A₁ · v₁ = A₂ · v₂ (Area × Velocity = constant rate of volume flow for an incompressible fluid). When a pipe narrows, fluid speed increases." },
    { q: "What are common real-world devices based on Bernoulli's theorem?", a: "1. Venturimeter (measures flow rate). 2. Atomizer / Perfume sprayer. 3. Carburetor in internal combustion engines. 4. Bunsen burner air inlet." },
    { q: "What assumptions are made in deriving Bernoulli's Equation?", a: "The fluid is assumed to be ideal: non-viscous (zero friction), incompressible (constant density), irrotational, and in steady streamline flow." }
  ],
  785: [
    { q: "What is Amplitude Modulation (AM)?", a: "Amplitude Modulation is a modulation technique used in electronic communication where the amplitude of a high-frequency carrier wave is varied in accordance with the instantaneous amplitude of the modulating (message/audio) signal, while its frequency and phase remain constant." },
    { q: "What is the modulation index (m) in AM?", a: "Modulation index m = A_m / A_c (Ratio of message signal peak amplitude to carrier wave peak amplitude). For distortion-free transmission, m should be ≤ 1 (or ≤ 100%)." },
    { q: "What are the sideband frequencies produced in AM?", a: "AM generates two sideband frequencies: Upper Sideband (USB = f_c + f_m) and Lower Sideband (LSB = f_c - f_m). Bandwidth required is 2 × f_m." },
    { q: "What is the main difference between AM and FM?", a: "In AM, the amplitude varies with message signal while frequency is fixed. In FM (Frequency Modulation), the frequency varies while amplitude remains constant, providing superior noise immunity and audio fidelity." },
    { q: "What are the advantages and drawbacks of Amplitude Modulation?", a: "Advantages: Simple and low-cost transmitter and receiver circuits; longer transmission range via skywave propagation. Drawbacks: Low power efficiency (carrier consumes most power), narrow audio bandwidth, and high susceptibility to atmospheric electrical noise." }
  ],
  786: [
    { q: "What is an Anemometer?", a: "An anemometer is a scientific meteorological instrument used to measure wind speed, wind velocity, and wind direction in the atmosphere." },
    { q: "What are the primary types of anemometers?", a: "1. Cup Anemometers (rotational hemispherical cups). 2. Vane Anemometers (windmill propellers). 3. Hot-wire Anemometers (electric cooling). 4. Ultrasonic Anemometers (sound wave transit times) 5. Laser Doppler Anemometers." },
    { q: "How does a standard cup anemometer work?", a: "Three or four cups mounted on horizontal arms catch the wind. The rotational speed of the spindle is directly proportional to the wind velocity and is converted into km/h, m/s, or knots." },
    { q: "Why are anemometers essential in wind energy and aviation?", a: "In wind energy, anemometers monitor wind conditions to optimize turbine pitch and prevent damage during storm gusts. In aviation, they provide runway wind shear data critical for safe takeoff and landing." },
    { q: "What is the advantage of Ultrasonic Anemometers over mechanical ones?", a: "Ultrasonic anemometers have no moving parts, offer near-instantaneous response time, measure 3D wind vectors, and operate reliably in extreme icy conditions without mechanical wear." }
  ],
  787: [
    { q: "What is Angular Acceleration (α)?", a: "Angular acceleration is the rate of change of angular velocity with respect to time: α = dω/dt = (ω₂ - ω₁) / t. It is a vector quantity measured in radians per second squared (rad/s²)." },
    { q: "How is linear acceleration related to angular acceleration?", a: "Tangential acceleration a_t = r · α, where r is the radius of rotation and α is angular acceleration in rad/s²." },
    { q: "What are the rotational kinematic equations of motion?", a: "For constant angular acceleration: 1. ω = ω₀ + αt, 2. θ = ω₀t + ½αt², 3. ω² = ω₀² + 2αθ (analogous to linear v = u + at, s = ut + ½at², v² = u² + 2as)." },
    { q: "How does torque relate to angular acceleration?", a: "By Newton's second law for rotation: Torque τ = I · α, where I is the moment of inertia of the rotating body." },
    { q: "What is the difference between radial and tangential acceleration in circular motion?", a: "Radial (centripetal) acceleration (a_r = v²/r = ω²r) points toward the center and changes the direction of velocity. Tangential acceleration (a_t = rα) acts along the tangent and changes the magnitude (speed) of velocity." }
  ],
  788: [
    { q: "What is Instantaneous Velocity and how is it defined mathematically?", a: "Instantaneous velocity is the velocity of an object at a specific instant of time. Mathematically, it is the derivative of position with respect to time: v = lim (Δt→0) (Δx / Δt) = dx/dt." },
    { q: "How does instantaneous speed differ from instantaneous velocity?", a: "Instantaneous speed is the scalar magnitude of instantaneous velocity at that precise moment. Speed has no direction, whereas velocity has both magnitude and direction." },
    { q: "How do you determine instantaneous velocity from a graph?", a: "On a position-time (x vs t) graph, the slope of the tangent line drawn at any specific point represents the instantaneous velocity at that instant." },
    { q: "Does a vehicle's speedometer show average or instantaneous speed?", a: "A speedometer displays instantaneous speed—the exact speed at the current second." },
    { q: "Can a body have zero instantaneous velocity and non-zero acceleration?", a: "Yes! When a ball is thrown vertically upward, at the highest point of its trajectory its instantaneous velocity is zero, but its acceleration is 9.8 m/s² downward due to gravity." }
  ],
  789: [
    { q: "What is the difference between Average Speed and Average Velocity?", a: "Average speed is Total Distance divided by Total Time (scalar). Average velocity is Total Displacement divided by Total Time (vector). Average speed can never be negative or zero for a moving body, whereas average velocity can be zero or negative." },
    { q: "What is the formula for average speed for equal distances covered at speeds v₁ and v₂?", a: "Harmonic mean formula: Average Speed = (2 · v₁ · v₂) / (v₁ + v₂)." },
    { q: "What is the formula for average speed for equal time intervals at speeds v₁ and v₂?", a: "Arithmetic mean formula: Average Speed = (v₁ + v₂) / 2." },
    { q: "Can average velocity be zero while average speed is non-zero?", a: "Yes! If a runner completes one full lap of a 400m circular track in 50 seconds, total displacement is 0 (Average Velocity = 0 m/s), but total distance is 400m (Average Speed = 8 m/s)." },
    { q: "Is magnitude of average velocity always equal to average speed?", a: "No. Average speed is always greater than or equal to the magnitude of average velocity (Average Speed ≥ |Average Velocity|). They are equal only during unidirectional straight-line motion without turning." }
  ],
  790: [
    { q: "What is Average Velocity in physics?", a: "Average velocity is the displacement vector divided by the total time taken: v_avg = Δx / Δt = (x₂ - x₁) / (t₂ - t₁)." },
    { q: "What is the SI unit of Average Velocity?", a: "The SI unit of average velocity is meters per second (m/s). Other common units include kilometers per hour (km/h)." },
    { q: "How do you calculate average velocity in 2D and 3D coordinate motion?", a: "v_avg = (Δx î + Δy ĵ + Δz k̂) / Δt, where Δx, Δy, Δz are displacement components along the x, y, and z axes." },
    { q: "Why does average velocity depend only on initial and final positions?", a: "Because displacement is a state function that depends solely on the start and end coordinates, independent of the path trajectory traversed by the object." },
    { q: "When is average velocity equal to instantaneous velocity throughout motion?", a: "Average velocity equals instantaneous velocity at all times only when an object moves with uniform (constant) velocity along a straight line with zero acceleration." }
  ],
  791: [
    { q: "What is Avogadro's Number (N_A)?", a: "Avogadro's Number is a fundamental physical constant representing the number of constituent particles (atoms, molecules, ions, or electrons) in one mole of a substance. Its value is 6.02214076 × 10²³ mol⁻¹." },
    { q: "How is Avogadro's Number connected to atomic mass unit (u)?", a: "1 atomic mass unit (1 u or 1 Dalton) = 1 / N_A grams ≈ 1.660539 × 10⁻²⁴ grams. Thus, 1 mole of carbon-12 atoms (each 12 u) has a mass of exactly 12 grams." },
    { q: "How do you calculate the number of particles from moles?", a: "Number of Particles (N) = Number of Moles (n) × Avogadro's Number (N_A) = (Mass / Molar Mass) × 6.022 × 10²³." },
    { q: "Why was Avogadro's constant redefined in the 2019 SI redefinition?", a: "In 2019, CIPM defined Avogadro's number as an exact fixed numerical value (6.02214076 × 10²³) rather than tying it to the mass of a physical carbon-12 sample." },
    { q: "How many atoms are in 18 grams (1 mole) of water (H₂O)?", a: "1 mole of H₂O contains 1 × N_A water molecules. Since each H₂O molecule has 3 atoms (2 Hydrogen + 1 Oxygen), it contains 3 × 6.022 × 10²³ = 1.8066 × 10²⁴ atoms." }
  ],
  792: [
    { q: "What is a Balanced Force?", a: "A balanced force occurs when two or more forces acting on an object have a vector resultant sum of zero (ΣF = 0). The forces cancel each other out." },
    { q: "Can a balanced force change the state of motion of an object?", a: "No. A balanced force cannot change the speed or direction of motion of an object. According to Newton's First Law, an object at rest remains at rest, and an object in motion continues moving at constant velocity." },
    { q: "Can balanced forces change the shape of an object?", a: "Yes! Balanced forces can deform or change the shape/size of an object without accelerating it (e.g., compressing a sponge or stretching a spring with equal forces on both ends)." },
    { q: "What is the difference between Balanced and Unbalanced Forces?", a: "Balanced forces have Net Force = 0 and cause zero acceleration (constant velocity). Unbalanced forces have Net Force ≠ 0 and cause acceleration (change in speed or direction)." },
    { q: "Give three everyday examples of balanced forces.", a: "1. A book lying at rest on a desk (downward gravity balanced by upward normal reaction force). 2. A skydiver falling at terminal velocity (downward gravity balanced by upward air resistance). 3. A tied tug of war where neither team moves." }
  ],
  793: [
    { q: "What is a Bar Magnet?", a: "A bar magnet is a rectangular or cylindrical permanent magnet made of ferromagnetic material (such as steel, alnico, or neodymium) that possesses two equal and opposite magnetic poles: North (N) and South (S)." },
    { q: "What is Magnetic Dipole Moment (M) of a bar magnet?", a: "The magnetic dipole moment is M = m · 2l, where m is magnetic pole strength and 2l is the magnetic length (distance between poles). Its SI unit is Ampere-meter squared (A·m²) or Joule per Tesla (J/T)." },
    { q: "What happens when a bar magnet is cut into two equal halves?", a: "1. Cut perpendicular to length: Magnetic length becomes halved (l' = l/2), pole strength stays same (m' = m), and magnetic dipole moment becomes M' = M/2. 2. Cut along length: Pole strength becomes halved (m' = m/2), length stays same, and magnetic moment becomes M' = M/2. Monopoles never form!" },
    { q: "What is the magnetic field of a short bar magnet on its axial and equatorial lines?", a: "Axial Field: B_axial = (μ₀ / 4π) · (2M / r³). Equatorial Field: B_equatorial = (μ₀ / 4π) · (M / r³). Thus, B_axial = 2 × B_equatorial at the same distance r." },
    { q: "What are the key properties of magnetic field lines around a bar magnet?", a: "1. They emerge from the North pole and enter the South pole outside the magnet, and run from South to North inside, forming continuous closed loops. 2. Field lines never intersect. 3. Crowded lines indicate a stronger magnetic field." }
  ],
  794: [
    { q: "What is a Biconvex Lens?", a: "A biconvex lens (double convex lens) is a transparent optical lens with two outward-curving spherical surfaces having positive focal lengths. It is a converging lens that bends parallel light rays toward a focal point." },
    { q: "What is the Lens Maker's Formula for a biconvex lens?", a: "1/f = (μ - 1) · [ (1 / R₁) - (1 / R₂) ], where f is focal length, μ is the refractive index of the lens glass relative to the surrounding medium, R₁ is radius of curvature of the first surface (positive), and R₂ is radius of the second surface (negative)." },
    { q: "What type of images does a biconvex lens produce?", a: "For an object placed beyond the focus (F), it produces a Real and Inverted image. When an object is placed between optical center (O) and principal focus (F), it produces a Virtual, Erect, and Magnified image (magnifying glass principle)." },
    { q: "What is the Lens Formula and Magnification equation?", a: "Lens Formula: 1/f = 1/v - 1/u (where u is object distance, v is image distance). Linear Magnification: m = v / u = Height of Image / Height of Object." },
    { q: "What are the common optical applications of biconvex lenses?", a: "1. Simple and compound microscopes. 2. Astronomical refracting telescopes. 3. Camera optical assemblies. 4. Corrective lenses for Hypermetropia (farsightedness). 5. Human eye crystalline lens." }
  ]
};

// All specified Quick Link Pages + Guides + Concepts
const ALL_PAGES = [
  // NCERT Solutions Quick Links
  { id: 690, category: 'NCERT Solutions', label: 'NCERT Solutions Class 6' },
  { id: 689, category: 'NCERT Solutions', label: 'NCERT Solutions Class 7' },
  { id: 688, category: 'NCERT Solutions', label: 'NCERT Solutions Class 8' },
  { id: 685, category: 'NCERT Solutions', label: 'NCERT Solutions Class 9' },
  { id: 687, category: 'NCERT Solutions', label: 'NCERT Solutions Class 10' },

  // Important Formulas (CBSE)
  { id: 691, category: 'Important Formulas', label: 'Science (6-10) Formulas' },
  { id: 692, category: 'Important Formulas', label: 'Maths (6-10) Formulas' },
  { id: 696, category: 'Important Formulas', label: 'Physics (11-12) Formulas' },
  { id: 693, category: 'Important Formulas', label: 'Chemistry (11-12) Formulas' },
  { id: 695, category: 'Important Formulas', label: 'Maths (11-12) Formulas' },
  { id: 697, category: 'Important Formulas', label: 'Biology (11-12) Formulas' },

  // Important Formulas (IGCSE)
  { id: 698, category: 'Important Formulas', label: 'IGCSE Physics Formulas' },
  { id: 699, category: 'Important Formulas', label: 'IGCSE Chemistry Formulas' },
  { id: 700, category: 'Important Formulas', label: 'IGCSE Add Maths Formulas' },
  { id: 701, category: 'Important Formulas', label: 'IGCSE Maths Formulas' },

  // IGCSE Subject Guides
  { id: 702, category: 'IGCSE Subject Guides', label: 'IGCSE English First Language (0500/0990)' },
  { id: 703, category: 'IGCSE Subject Guides', label: 'English as a Second Language (0511/0991)' },
  { id: 704, category: 'IGCSE Subject Guides', label: 'IGCSE English Literature (0475/0992)' },
  { id: 705, category: 'IGCSE Subject Guides', label: 'IGCSE English as a Second Language (0510/0993)' },
  { id: 706, category: 'IGCSE Subject Guides', label: 'IGCSE Economics (0455/0987)' },

  // Complete Guides
  { id: 707, category: 'Complete Guides', label: 'IGCSE Complete Guide' },
  { id: 708, category: 'Complete Guides', label: 'CBSE Complete Guide' },
  { id: 710, category: 'Complete Guides', label: 'A levels Complete Guide' },
  { id: 712, category: 'Complete Guides', label: 'IBDP Complete Guide' },
  { id: 711, category: 'Complete Guides', label: 'O Level Complete Guide' },
  { id: 709, category: 'Complete Guides', label: 'JEE Complete Guide' },
  { id: 713, category: 'Complete Guides', label: 'NEET Complete Guide' },
  { id: 714, category: 'Complete Guides', label: 'CUET Complete Guide' },
  { id: 715, category: 'Complete Guides', label: 'Olympiads Complete Guide' },
  { id: 716, category: 'Complete Guides', label: 'AP Exams Complete Guide' },
  { id: 717, category: 'Complete Guides', label: 'ICSE Complete Guide' },
  { id: 718, category: 'Complete Guides', label: 'State Boards Complete Guide' },

  // Landing pages for learners hub
  { id: 719, category: 'Landing Pages', label: 'Important Concepts Main' },
  { id: 723, category: 'Landing Pages', label: 'Physics Concepts Main' },
  { id: 724, category: 'Landing Pages', label: 'Maths Concepts Main' },
  { id: 725, category: 'Landing Pages', label: 'Chemistry Concepts Main' },
  { id: 726, category: 'Landing Pages', label: 'Biology Concepts Main' },
  { id: 720, category: 'Landing Pages', label: 'NCERT Solutions Main' },
  { id: 721, category: 'Landing Pages', label: 'Important Formulas Main' },
  { id: 727, category: 'Landing Pages', label: 'CBSE Formulas Hub' },
  { id: 728, category: 'Landing Pages', label: 'IGCSE Formulas Hub' },
  { id: 722, category: 'Landing Pages', label: 'Book Solutions Main' },
  { id: 729, category: 'Landing Pages', label: 'RD Sharma Solutions' },
  { id: 730, category: 'Landing Pages', label: 'HC Verma Solutions' },
  { id: 731, category: 'Landing Pages', label: 'RS Aggarwal Solutions' },
  { id: 732, category: 'Landing Pages', label: 'Lakhmir Singh Solutions' },
  { id: 733, category: 'Landing Pages', label: 'Board Exams Main' },

  // Physics Concepts (770 - 794)
  { id: 770, category: 'Physics Concepts', label: 'Accuracy Precision and Error in Measurement' },
  { id: 771, category: 'Physics Concepts', label: 'Atomic Theory' },
  { id: 772, category: 'Physics Concepts', label: 'Avogadro’s Hypothesis' },
  { id: 773, category: 'Physics Concepts', label: 'Boyles Law' },
  { id: 774, category: 'Physics Concepts', label: 'Centripetal And Centrifugal Force' },
  { id: 775, category: 'Physics Concepts', label: 'Convection Currents' },
  { id: 776, category: 'Physics Concepts', label: 'Difference Between Electric Field and Magnetic Field' },
  { id: 777, category: 'Physics Concepts', label: 'Ampere' },
  { id: 778, category: 'Physics Concepts', label: 'Audible and Inaudible Sound' },
  { id: 779, category: 'Physics Concepts', label: 'Azimuthal Quantum Number' },
  { id: 780, category: 'Physics Concepts', label: 'Buoyancy' },
  { id: 781, category: 'Physics Concepts', label: 'Difference Between Heat and Temperature' },
  { id: 782, category: 'Physics Concepts', label: 'Electrical Force : Electric Forces and Their Types' },
  { id: 783, category: 'Physics Concepts', label: 'Fluid Friction : Types and Factors of Fluid Friction' },
  { id: 784, category: 'Physics Concepts', label: 'Fluid Flow : Bernoullis Equation Derivation and Fluid Mechanics' },
  { id: 785, category: 'Physics Concepts', label: 'Amplitude Modulation' },
  { id: 786, category: 'Physics Concepts', label: 'Anemometer - Measurement of Wind Speed' },
  { id: 787, category: 'Physics Concepts', label: 'Angular Acceleration' },
  { id: 788, category: 'Physics Concepts', label: 'Instantaneous Speed and Velocity' },
  { id: 789, category: 'Physics Concepts', label: 'Average Speed and Average Velocity' },
  { id: 790, category: 'Physics Concepts', label: 'Average Velocity' },
  { id: 791, category: 'Physics Concepts', label: 'Avogadro’s Number' },
  { id: 792, category: 'Physics Concepts', label: 'Balanced Force' },
  { id: 793, category: 'Physics Concepts', label: 'Bar Magnet' },
  { id: 794, category: 'Physics Concepts', label: 'Biconvex Lens' },
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (err) => resolve({ status: 500, error: err.message, data: '' }));
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCleanContent(rawHtml) {
  const mainMatch = rawHtml.match(/<div role="main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i) ||
                    rawHtml.match(/<div class="box py-3 generalbox">([\s\S]*?)<\/div>/i) ||
                    rawHtml.match(/<div id="region-main"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
  return mainMatch ? mainMatch[1].trim() : '';
}

function generateFaqHtml(faqs, topicTitle) {
  if (!faqs || faqs.length === 0) return '';

  const faqItemsHtml = faqs.map((f, i) => `
    <div style="margin-bottom: 16px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <div style="padding: 16px 20px; font-weight: 700; color: #1B2A44; background: #fdf5f5; font-size: 1.05rem; border-left: 4px solid #7E0D0D;">
        Q${i + 1}: ${f.q}
      </div>
      <div style="padding: 16px 20px; font-size: 0.98rem; color: #374151; line-height: 1.7; background: #ffffff;">
        ${f.a}
      </div>
    </div>
  `).join('');

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
  };

  return `
    <div class="seo-faq-section" style="margin-top: 48px; padding-top: 32px; border-top: 2px dashed #f3dcdc; font-family: 'Inter', system-ui, sans-serif;">
      <div style="text-align: center; margin-bottom: 28px;">
        <span style="background: #fdf5f5; color: #7e0d0d; border: 1px solid #f3dcdc; padding: 4px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Exam Prep & High-Intent Queries</span>
        <h2 style="color: #7E0D0D; font-size: 1.8rem; margin: 10px 0 6px 0; font-weight: 800;">Frequently Asked Questions (FAQs) — ${topicTitle}</h2>
        <p style="color: #6b7280; font-size: 0.95rem; margin: 0;">Detailed explanations and answers for CBSE, IGCSE, IB, JEE & NEET exams.</p>
      </div>

      <div class="faq-list">
        ${faqItemsHtml}
      </div>

      <script type="application/ld+json">
        ${JSON.stringify(schemaJson, null, 2)}
      </script>
    </div>
  `;
}

async function run() {
  console.log(`Starting prioritized sync of all ${ALL_PAGES.length} Quick Link & Physics Concept pages...`);

  let count = 0;
  for (let i = 0; i < ALL_PAGES.length; i++) {
    const item = ALL_PAGES[i];
    const url = `https://hoduacademy.com/mod/page/view.php?id=${item.id}`;

    console.log(`[${i + 1}/${ALL_PAGES.length}] Fetching ID: ${item.id} (${item.label})...`);
    const res = await fetchUrl(url);

    if (res.status !== 200 || !res.data) {
      console.log(`  Failed (status ${res.status}) for ID: ${item.id}`);
      continue;
    }

    const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);
    let pageTitle = titleMatch ? titleMatch[1].replace('Hodu Academy: ', '').replace(' | Hodu Academy', '').trim() : item.label;
    pageTitle = pageTitle.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&ndash;', '–').replaceAll('&mdash;', '—');

    let baseContent = extractCleanContent(res.data);
    if (!baseContent || baseContent.length < 50) {
      console.log(`  Skipping ID ${item.id}: content too short (${baseContent.length} chars)`);
      continue;
    }

    // Check if there are SEO FAQs to enrich
    const faqs = PHYSICS_FAQS[item.id];
    let fullContent = baseContent;
    if (faqs && faqs.length > 0) {
      const faqHtml = generateFaqHtml(faqs, pageTitle);
      fullContent = `${baseContent}\n\n${faqHtml}`;
    }

    let slug = slugify(pageTitle);
    if (!slug) slug = `page-${item.id}`;

    const stripped = baseContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = stripped.substring(0, 220) + '...';

    const pageRecord = {
      site_id: HODU_SITE_ID,
      title: pageTitle,
      slug: slug,
      category: item.category,
      secondary_link: `/mod/page/view.php?id=${item.id}`,
      content: fullContent,
      excerpt: excerpt,
      meta_title: `${pageTitle} | Notes, Formulas & FAQs | Hodu Academy`,
      meta_description: excerpt,
      published: true,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('site_id', HODU_SITE_ID)
      .eq('secondary_link', `/mod/page/view.php?id=${item.id}`)
      .maybeSingle();

    if (existing) {
      await supabase.from('cms_pages').update(pageRecord).eq('id', existing.id);
      console.log(`  ✓ Updated: "${pageTitle}" [${item.category}] (Enriched: ${faqs ? 'YES' : 'NO'})`);
    } else {
      await supabase.from('cms_pages').insert(pageRecord);
      console.log(`  + Inserted: "${pageTitle}" [${item.category}] (Enriched: ${faqs ? 'YES' : 'NO'})`);
    }

    count++;
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\n🎉 Successfully processed and enriched all ${count} Quick Link & Physics Concept pages!`);
}

run().catch(console.error);
