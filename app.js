(() => {
"use strict";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const fmt = (n,d=3) => Number.isFinite(n) ? Number(n).toPrecision(d) : "—";
const e = 1.602176634e-19;
const c = 299792458;
const eps0 = 8.8541878128e-12;
const uKg = 1.66053906660e-27;
const ln2 = Math.log(2);

const lessons = [
  {
    code:"3.8.1.1", title:"Rutherford scattering", sim:"rutherford",
    lead:"Alpha-particle scattering showed that almost all atomic mass and all positive charge are concentrated in a tiny nucleus.",
    core:["Most alpha particles pass through with little or no deflection.","A small number are deflected through large angles.","Very rare backward scattering requires a concentrated positive nucleus.","The nuclear model replaced the plum-pudding model."],
    remember:"Large-angle scattering is evidence for a tiny, massive, positively charged centre — not evidence that the atom is solid.",
    mistake:"Do not say most alpha particles hit the nucleus. Most pass through because atoms are mostly empty space.",
    formulas:["Electrostatic potential energy at closest approach ≈ initial kinetic energy"]
  },
  {
    code:"3.8.1.2", title:"Alpha, beta and gamma radiation", sim:"radiation",
    lead:"The three radiations differ in charge, mass, ionising ability, penetration and behaviour in fields.",
    core:["Alpha is a helium nucleus: charge +2e and high ionising ability.","Beta radiation is a fast electron or positron from a nuclear transformation.","Gamma is an electromagnetic photon from a nuclear energy transition.","Background count rate must be allowed for when analysing measurements.","For a point-like source, gamma intensity follows an inverse-square relationship."],
    remember:"Penetrating power and ionising power are not the same thing.",
    mistake:"Gamma is not a particle with rest mass and charge; it is electromagnetic radiation.",
    formulas:["I ∝ 1/r²","corrected count rate = measured rate − background rate"]
  },
  {
    code:"3.8.1.3", title:"Radioactive decay", sim:"decay",
    lead:"Individual nuclear decays are random, but a large sample follows a predictable exponential law.",
    core:["Each undecayed nucleus has a constant probability of decay per unit time.","Decay constant λ is the probability per unit time for a nucleus.","Activity A is the rate of decay.","Half-life is the time for N or A to fall to half its value.","Exponential and log graphs can be used to determine λ and half-life."],
    remember:"Random does not mean unpredictable at sample level: large populations produce a smooth exponential trend.",
    mistake:"Half-life is not the time for every nucleus to decay.",
    formulas:["N = N₀e^(−λt)","A = λN","A = A₀e^(−λt)","T½ = ln2/λ"]
  },
  {
    code:"3.8.1.4", title:"Nuclear instability", sim:"stability",
    lead:"Stable nuclei occupy a band on an N–Z graph. Unstable nuclei can move toward greater stability through alpha, beta or electron-capture processes.",
    core:["Alpha decay reduces A by 4 and Z by 2.","Beta-minus converts a neutron to a proton, so Z increases by 1 while A is unchanged.","Beta-plus converts a proton to a neutron, so Z decreases by 1 while A is unchanged.","Electron capture also reduces Z by 1 while A is unchanged.","Gamma emission changes nuclear energy, not A or Z."],
    remember:"Track proton number Z and neutron number N separately before writing the daughter nuclide.",
    mistake:"Beta-minus emission does not remove a pre-existing orbital electron from the atom.",
    formulas:["A = N + Z","α: ΔZ = −2, ΔN = −2","β⁻: ΔZ = +1, ΔN = −1","β⁺ / EC: ΔZ = −1, ΔN = +1"]
  },
  {
    code:"3.8.1.5", title:"Nuclear radius", sim:"radius",
    lead:"Scattering and diffraction show that nuclear radius increases approximately with the cube root of nucleon number.",
    core:["Closest approach of alpha particles gives an estimate of nuclear size.","Electron diffraction provides a more direct measure of nuclear radius.","R = r₀A^(1/3) describes the observed dependence.","Because volume is proportional to R³, nuclear density is approximately constant."],
    remember:"If R ∝ A^(1/3), then volume ∝ A, so mass/volume is roughly constant.",
    mistake:"The nuclear radius is around 10⁻¹⁵ m, not the atomic radius around 10⁻¹⁰ m.",
    formulas:["R = r₀A^(1/3)","ρ = mass / ((4/3)πR³)"]
  },
  {
    code:"3.8.1.6", title:"Mass and energy", sim:"massEnergy",
    lead:"Changes in nuclear binding are accompanied by tiny mass changes and much larger energy changes through E = mc².",
    core:["A bound nucleus has less mass than its separated nucleons.","Mass defect corresponds to binding energy.","1 u corresponds to 931.5 MeV/c² in mass-energy calculations.","Binding energy per nucleon is a useful measure of nuclear stability.","Energy can be released by fusion of light nuclei and fission of heavy nuclei."],
    remember:"Use the difference between initial and final total mass; the sign tells you whether energy is released or required.",
    mistake:"Do not confuse total binding energy with binding energy per nucleon.",
    formulas:["ΔE = Δmc²","1 u → 931.5 MeV","BE per nucleon = BE/A"]
  },
  {
    code:"3.8.1.7", title:"Induced fission", sim:"fission",
    lead:"Absorption of a neutron can make a heavy nucleus split, releasing energy and additional neutrons that may continue a chain reaction.",
    core:["A thermal neutron can induce fission in a suitable heavy nucleus.","Fission products have greater binding energy per nucleon than the original heavy nucleus.","Released neutrons may cause further fissions.","A chain reaction can decrease, remain steady or increase depending on neutron balance.","In a thermal reactor, moderator, control rods and coolant have different functions."],
    remember:"The energy comes from an increase in total binding energy, corresponding to a reduction in mass.",
    mistake:"The moderator does not absorb neutrons as its main job; it slows them by collisions.",
    formulas:["energy released = (initial mass − final mass)c²"]
  },
  {
    code:"3.8.1.8", title:"Safety aspects of nuclear power", sim:"reactor",
    lead:"Nuclear power requires engineered systems for control, cooling, shielding, shutdown and management of radioactive material.",
    core:["Control systems manage the neutron population and therefore reactor power.","Cooling transfers thermal energy away from the reactor core.","Shielding reduces exposure outside controlled regions.","Shutdown systems are designed to reduce the chain reaction rapidly.","Radioactive waste requires secure handling and storage appropriate to its activity and half-life.","Benefits and risks should be evaluated using evidence."],
    remember:"A safety explanation should link each engineering feature to the specific hazard or physical process it controls.",
    mistake:"Do not describe control rods, moderator and coolant as interchangeable; each has a distinct function.",
    formulas:["Qualitative section: focus on function, risk reduction and evidence."]
  }
];

const sims = [
  {
    id:"rutherford", code:"3.8.1.1", title:"Rutherford scattering",
    subtitle:"Vary impact parameter and alpha energy to see how electrostatic repulsion changes the path.",
    controls:[
      {key:"impact",label:"Impact parameter",type:"range",min:-80,max:80,step:2,value:28,unit:" px"},
      {key:"energy",label:"Relative alpha energy",type:"range",min:2,max:9,step:.5,value:5,unit:" MeV"}
    ],
    simple:"A closer pass means a stronger repulsive force, so the alpha particle changes direction more.",
    exam:"Large-angle deflections show that positive charge and most atomic mass are concentrated in a very small nucleus. Most particles pass through because the atom is mostly empty space.",
    mistake:"Do not describe the alpha particle as being attracted to the nucleus; both are positively charged.",
    check:{q:"Which observation most strongly supports a tiny concentrated nucleus?",opts:["Most alpha particles pass straight through","A very small number scatter through very large angles","The foil is thin"],a:1}
  },
  {
    id:"radiation", code:"3.8.1.2", title:"Radiation and absorption",
    subtitle:"Compare alpha, beta and gamma behaviour through idealised absorbing layers.",
    controls:[
      {key:"radType",label:"Radiation",type:"select",value:"gamma",options:[["alpha","Alpha"],["beta","Beta"],["gamma","Gamma"]]},
      {key:"thickness",label:"Absorber thickness (relative)",type:"range",min:0,max:100,step:1,value:35,unit:" %"}
    ],
    simple:"Alpha is stopped most easily, beta penetrates further, and gamma is the most penetrating of the three.",
    exam:"Different radiations can be distinguished by their penetrating properties and ionising effects. Gamma intensity is reduced by absorption but gamma does not have a single fixed stopping thickness.",
    mistake:"Do not say a particular sheet always stops all gamma radiation; attenuation is probabilistic.",
    check:{q:"Which is generally the most ionising?",opts:["Alpha","Beta","Gamma"],a:0}
  },
  {
    id:"decay", code:"3.8.1.3", title:"Random decay and half-life",
    subtitle:"Watch a population decay and compare the random-looking nuclei with the smooth exponential prediction.",
    controls:[
      {key:"halfLife",label:"Half-life",type:"range",min:2,max:20,step:1,value:8,unit:" s"},
      {key:"decayTime",label:"Elapsed time",type:"range",min:0,max:40,step:.5,value:0,unit:" s"}
    ],
    simple:"You cannot predict which nucleus decays next, but the fraction left after many trials follows an exponential pattern.",
    exam:"Radioactive decay is random for an individual nucleus and has a constant probability per unit time. Therefore a large sample obeys N = N₀e^(−λt).",
    mistake:"A nucleus does not become more likely to decay just because it has existed for a long time.",
    check:{q:"After two half-lives, what fraction of the original nuclei remains?",opts:["1/2","1/3","1/4"],a:2}
  },
  {
    id:"stability", code:"3.8.1.4", title:"N–Z stability map",
    subtitle:"Apply a decay mode and see how proton and neutron numbers move on an N–Z plot.",
    controls:[
      {key:"Z",label:"Proton number Z",type:"range",min:10,max:90,step:1,value:50,unit:""},
      {key:"N",label:"Neutron number N",type:"range",min:10,max:145,step:1,value:75,unit:""},
      {key:"decayMode",label:"Decay mode",type:"select",value:"betaMinus",options:[["alpha","Alpha"],["betaMinus","Beta minus"],["betaPlus","Beta plus"],["ec","Electron capture"],["gamma","Gamma"]]}
    ],
    simple:"Each decay mode moves a nucleus in a specific direction on the neutron-number versus proton-number map.",
    exam:"Beta processes change a neutron into a proton or a proton into a neutron, so A remains constant while Z changes by one. Alpha decay reduces A by four and Z by two.",
    mistake:"Gamma emission does not move the nuclide on an N–Z plot because N and Z are unchanged.",
    check:{q:"What happens to Z in beta-minus decay?",opts:["Decreases by 1","Increases by 1","Decreases by 2"],a:1}
  },
  {
    id:"radius", code:"3.8.1.5", title:"Nuclear radius and density",
    subtitle:"Change nucleon number and see why R ∝ A^(1/3) implies nearly constant nuclear density.",
    controls:[
      {key:"A",label:"Nucleon number A",type:"range",min:4,max:240,step:1,value:56,unit:""},
      {key:"r0",label:"r₀",type:"range",min:1.15,max:1.30,step:.01,value:1.20,unit:" fm"}
    ],
    simple:"A bigger nucleus contains more nucleons, but its radius grows only as the cube root of A.",
    exam:"Since R = r₀A^(1/3), nuclear volume is proportional to R³ and therefore proportional to A. Nuclear mass is also approximately proportional to A, so nuclear density is approximately constant.",
    mistake:"Doubling A does not double nuclear radius.",
    check:{q:"If A becomes 8 times larger, the radius becomes approximately…",opts:["2 times larger","4 times larger","8 times larger"],a:0}
  },
  {
    id:"massEnergy", code:"3.8.1.6", title:"Mass defect and binding energy",
    subtitle:"Convert a mass defect in atomic mass units into binding energy.",
    controls:[
      {key:"massDefect",label:"Mass defect",type:"range",min:.001,max:.300,step:.001,value:.100,unit:" u"},
      {key:"massA",label:"Nucleon number",type:"range",min:2,max:240,step:1,value:16,unit:""}
    ],
    simple:"A small missing mass corresponds to the energy needed to separate the nucleus into free nucleons.",
    exam:"The binding energy is the energy equivalent of the mass defect: ΔE = Δmc². Using atomic mass units, 1 u corresponds to 931.5 MeV.",
    mistake:"Mass is not destroyed; mass-energy is conserved.",
    check:{q:"A larger binding energy per nucleon generally indicates…",opts:["A more tightly bound nucleus","A larger atomic radius","A larger charge"],a:0}
  },
  {
    id:"binding", code:"3.8.1.6", title:"Binding-energy curve",
    subtitle:"Explore why light nuclei can release energy by fusion and heavy nuclei by fission.",
    controls:[
      {key:"bindA",label:"Nucleon number A",type:"range",min:2,max:240,step:1,value:56,unit:""}
    ],
    simple:"Nuclei release energy when the products move higher on the binding-energy-per-nucleon curve.",
    exam:"Fusion of light nuclei and fission of heavy nuclei can release energy because the products have a greater average binding energy per nucleon, so total mass decreases.",
    mistake:"The peak of the curve does not mean iron nuclei contain the most total binding energy; it refers to average binding energy per nucleon.",
    check:{q:"Why can fission release energy?",opts:["Products have higher binding energy per nucleon","Products have more nucleons","Neutrons have no mass"],a:0}
  },
  {
    id:"fission", code:"3.8.1.7", title:"Fission chain reaction",
    subtitle:"Use a conceptual neutron-balance control to compare a decreasing, steady and increasing chain reaction.",
    controls:[
      {key:"k",label:"Effective neutron multiplication",type:"range",min:.6,max:1.4,step:.05,value:1.0,unit:""},
      {key:"generation",label:"Generation",type:"range",min:0,max:6,step:1,value:3,unit:""}
    ],
    simple:"If each generation causes fewer fissions, the chain dies away; if it replaces itself, it stays steady; if it grows, the chain increases.",
    exam:"A chain reaction depends on the balance between neutrons produced by fission and neutrons lost by escape or absorption without causing fission.",
    mistake:"This model is conceptual; k is not determined by a single control or material property.",
    check:{q:"For a steady chain reaction, the neutron population should be approximately…",opts:["falling each generation","constant each generation","doubling each generation"],a:1}
  },
  {
    id:"reactor", code:"3.8.1.7–8", title:"Thermal reactor systems",
    subtitle:"See the distinct roles of moderator, control system, coolant, shielding and shutdown.",
    controls:[
      {key:"control",label:"Control insertion (conceptual)",type:"range",min:0,max:100,step:1,value:50,unit:" %"},
      {key:"cooling",label:"Cooling effectiveness (conceptual)",type:"range",min:20,max:100,step:1,value:75,unit:" %"}
    ],
    simple:"A reactor combines separate systems: one manages neutron balance, one slows neutrons, one removes heat, and shielding reduces radiation outside the core.",
    exam:"The moderator slows neutrons by collisions; control rods absorb neutrons; coolant transfers thermal energy; shielding reduces exposure; shutdown systems reduce the chain reaction rapidly.",
    mistake:"Do not say the coolant controls the chain reaction directly.",
    check:{q:"What is the main role of a moderator in a thermal reactor?",opts:["Slow neutrons","Absorb all neutrons","Produce gamma rays"],a:0}
  },
  {
    id:"energyLevels", code:"3.8.1.4", title:"Nuclear energy levels and gamma emission",
    subtitle:"Move between nuclear excited states and see the gamma photon energy set by the level spacing.",
    controls:[
      {key:"upperLevel",label:"Upper nuclear level",type:"range",min:1,max:4,step:1,value:3,unit:""},
      {key:"lowerLevel",label:"Lower nuclear level",type:"range",min:0,max:3,step:1,value:1,unit:""}
    ],
    simple:"An excited nucleus can move to a lower nuclear energy state by emitting a gamma photon.",
    exam:"Gamma emission changes the energy state of the nucleus but does not change proton number Z or nucleon number A. The photon energy equals the difference between the nuclear energy levels.",
    mistake:"Do not confuse nuclear gamma transitions with electron transitions between atomic energy levels.",
    check:{q:"During gamma emission, which nuclear quantities stay unchanged?",opts:["A and Z","Energy only","Z only"],a:0}
  },
  {
    id:"closestApproach", code:"3.8.1.5", title:"Alpha closest approach",
    subtitle:"Use a head-on alpha particle to connect kinetic energy with electrostatic potential energy at minimum separation.",
    controls:[
      {key:"targetZ",label:"Target proton number Z",type:"range",min:20,max:92,step:1,value:79,unit:""},
      {key:"alphaMeV",label:"Alpha kinetic energy",type:"range",min:3,max:10,step:.25,value:5.0,unit:" MeV"}
    ],
    simple:"A head-on alpha particle slows as electrostatic potential energy increases. At closest approach its initial kinetic energy has been converted into electrostatic potential energy in the ideal model.",
    exam:"For a head-on closest-approach estimate, set the initial alpha kinetic energy equal to the Coulomb potential energy between charges +2e and +Ze.",
    mistake:"Use both nuclear charges in the Coulomb expression and convert MeV to joules if working fully in SI units.",
    check:{q:"Increasing alpha kinetic energy makes the closest approach distance…",opts:["smaller","larger","unchanged"],a:0}
  },
  {
    id:"electronDiffraction", code:"3.8.1.5", title:"Electron diffraction by nuclei",
    subtitle:"Change nuclear radius and electron wavelength to see how the diffraction pattern shifts.",
    controls:[
      {key:"diffRadius",label:"Nuclear radius",type:"range",min:3,max:8,step:.1,value:5.0,unit:" fm"},
      {key:"wavelength",label:"Electron wavelength (relative)",type:"range",min:.4,max:1.2,step:.05,value:.7,unit:" fm"}
    ],
    simple:"Short-wavelength electrons can diffract from a nucleus. The angular positions of minima contain information about nuclear size.",
    exam:"Electron diffraction provides a nuclear-radius measurement because the de Broglie wavelength can be comparable with nuclear dimensions. A larger scattering object shifts diffraction features to smaller angles for the same wavelength.",
    mistake:"Do not treat the intensity pattern as Rutherford scattering; this is wave diffraction.",
    check:{q:"For the same electron wavelength, a larger nucleus moves the first diffraction minimum to…",opts:["a smaller angle","a larger angle","exactly 90°"],a:0}
  },
  {
    id:"moderation", code:"3.8.1.7", title:"Neutron moderation by collisions",
    subtitle:"Compare how effectively different target-nucleus masses reduce a fast neutron's kinetic energy in a simple collision model.",
    controls:[
      {key:"massRatio",label:"Moderator nucleus mass / neutron mass",type:"range",min:1,max:20,step:1,value:2,unit:""},
      {key:"collisionCount",label:"Number of collisions",type:"range",min:1,max:12,step:1,value:5,unit:""}
    ],
    simple:"A moderator reduces neutron kinetic energy through collisions. Energy transfer is most effective when the colliding masses are not extremely different.",
    exam:"A moderator should slow neutrons efficiently while having a low tendency to absorb them. A simple mechanical collision model helps explain energy transfer during moderation.",
    mistake:"Moderation means slowing neutrons, not removing them from the chain reaction.",
    check:{q:"What is the primary purpose of a moderator?",opts:["Reduce neutron kinetic energy","Absorb every neutron","Cool the fuel directly"],a:0}
  }
];

const formulas = [
  {id:"decay",name:"Number remaining",eq:"N = N₀e^(−λt)",inputs:[["N0","Initial nuclei N₀",1000],["lambda","Decay constant λ / s⁻¹",0.02],["t","Time t / s",50]],calc:v => {
    const N=v.N0*Math.exp(-v.lambda*v.t);
    return ["N = "+v.N0+" × e^(−"+v.lambda+" × "+v.t+")","N = "+fmt(N,5),"Fraction remaining = "+fmt(N/v.N0,4)];
  }},
  {id:"activity",name:"Activity",eq:"A = λN",inputs:[["lambda","Decay constant λ / s⁻¹",0.015],["N","Number of undecayed nuclei",2000000]],calc:v => {
    const A=v.lambda*v.N;
    return ["A = "+v.lambda+" × "+v.N,"A = "+fmt(A,5)+" Bq","1 Bq = 1 decay s⁻¹"];
  }},
  {id:"half",name:"Half-life and decay constant",eq:"T½ = ln2 / λ",inputs:[["lambda","Decay constant λ / s⁻¹",0.005]],calc:v => {
    const T=ln2/v.lambda;
    return ["T½ = 0.693 / "+v.lambda,"T½ = "+fmt(T,5)+" s","A larger λ means a shorter half-life."];
  }},
  {id:"inverse",name:"Inverse-square intensity",eq:"I₂ = I₁(r₁/r₂)²",inputs:[["I1","Intensity/count rate I₁",800],["r1","Distance r₁ / m",0.2],["r2","Distance r₂ / m",0.5]],calc:v => {
    const I=v.I1*Math.pow(v.r1/v.r2,2);
    return ["I₂ = "+v.I1+" × ("+v.r1+"/"+v.r2+")²","I₂ = "+fmt(I,5),"Valid for point-like emission in the idealised inverse-square model."];
  }},
  {id:"radius",name:"Nuclear radius",eq:"R = r₀A^(1/3)",inputs:[["r0","r₀ / fm",1.2],["A","Nucleon number A",56]],calc:v => {
    const R=v.r0*Math.cbrt(v.A);
    return ["R = "+v.r0+" × "+v.A+"^(1/3) fm","R = "+fmt(R,5)+" fm","R = "+fmt(R*1e-15,5)+" m"];
  }},
  {id:"density",name:"Nuclear density",eq:"ρ = m / ((4/3)πR³)",inputs:[["A","Nucleon number A",56],["r0","r₀ / fm",1.2]],calc:v => {
    const R=v.r0*Math.cbrt(v.A)*1e-15, m=v.A*uKg, rho=m/((4/3)*Math.PI*Math.pow(R,3));
    return ["m ≈ A u = "+fmt(m,4)+" kg","R = "+fmt(R,4)+" m","ρ ≈ "+fmt(rho,5)+" kg m⁻³"];
  }},
  {id:"mass",name:"Mass–energy",eq:"ΔE = Δmc²",inputs:[["du","Mass difference / u",0.1]],calc:v => {
    const MeV=v.du*931.5, J=MeV*1e6*e;
    return ["ΔE = "+v.du+" × 931.5 MeV","ΔE = "+fmt(MeV,5)+" MeV","ΔE = "+fmt(J,5)+" J"];
  }},
  {id:"bind",name:"Binding energy per nucleon",eq:"BE/A",inputs:[["du","Mass defect / u",0.12],["A","Nucleon number A",16]],calc:v => {
    const BE=v.du*931.5, per=BE/v.A;
    return ["BE = "+v.du+" × 931.5 = "+fmt(BE,5)+" MeV","BE/A = "+fmt(BE,5)+" / "+v.A,"BE per nucleon = "+fmt(per,5)+" MeV"];
  }},
  {id:"nuclei",name:"Number of nuclei from sample mass",eq:"N = (m/M)N_A",inputs:[["m","Sample mass m / g",0.5],["M","Molar mass M / g mol⁻¹",60]],calc:v => {
    const NA=6.02214076e23, n=v.m/v.M, N=n*NA;
    return ["n = m/M = "+v.m+"/"+v.M+" = "+fmt(n,5)+" mol","N = nN_A = "+fmt(N,5)+" nuclei","Use the number of radioactive nuclei in A = λN."];
  }},
  {id:"sampleActivity",name:"Activity from mass and half-life",eq:"A = (ln2/T½)(m/M)N_A",inputs:[["m","Sample mass m / g",0.001],["M","Molar mass M / g mol⁻¹",60],["T","Half-life T½ / s",3600]],calc:v => {
    const NA=6.02214076e23, N=(v.m/v.M)*NA, lambda=ln2/v.T, A=lambda*N;
    return ["N = (m/M)N_A = "+fmt(N,5),"λ = 0.693/T½ = "+fmt(lambda,5)+" s⁻¹","A = λN = "+fmt(A,5)+" Bq"];
  }},
  {id:"closest",name:"Alpha closest approach",eq:"E_k = (1/4πε₀)(2Ze²/r)",inputs:[["Z","Target proton number Z",79],["E","Alpha kinetic energy / MeV",5]],calc:v => {
    const k=8.9875517923e9, Ej=v.E*1e6*e, r=k*(2*v.Z*e*e)/Ej;
    return ["E_k = "+v.E+" MeV = "+fmt(Ej,5)+" J","r = k(2Ze²)/E_k","r = "+fmt(r,5)+" m = "+fmt(r/1e-15,5)+" fm"];
  }},
  {id:"gamma",name:"Gamma photon from level spacing",eq:"ΔE = hf",inputs:[["dE","Nuclear level spacing / MeV",0.14]],calc:v => {
    const h=6.62607015e-34, Ej=v.dE*1e6*e, freq=Ej/h;
    return ["ΔE = "+v.dE+" MeV = "+fmt(Ej,5)+" J","f = ΔE/h","f = "+fmt(freq,5)+" Hz"];
  }}
];

const quiz = [
  ["3.8.1.1","Which Rutherford observation requires a very concentrated positive charge?",["Most alpha particles pass straight through","Some alpha particles scatter through very large angles","The source emits alpha particles"],1,"Think about what could reverse the direction of a positive alpha particle.","Large-angle scattering requires a strong repulsive force in a very small region."],
  ["3.8.1.2","Which radiation has the greatest ionising ability in typical comparisons?",["Alpha","Beta","Gamma"],0,"Consider charge and interaction frequency.","Alpha particles ionise strongly over a short range."],
  ["3.8.1.2","If corrected gamma count rate follows the inverse-square law, doubling distance changes it by a factor of…",["1/2","1/4","1/8"],1,"Use 1/r².","Doubling r makes 1/r² four times smaller."],
  ["3.8.1.3","What does the decay constant represent?",["Energy per decay","Probability per unit time that a nucleus decays","Half the activity"],1,"It has units of inverse time.","λ describes the constant decay probability per unit time."],
  ["3.8.1.3","A sample has a half-life of 6 h. What fraction remains after 18 h?",["1/4","1/8","1/16"],1,"18 h is three half-lives.","After three half-lives the fraction is (1/2)³ = 1/8."],
  ["3.8.1.3","Which equation links activity and number of undecayed nuclei?",["A = λN","A = N/λ","A = λ/t"],0,"Activity is proportional to N.","A = λN."],
  ["3.8.1.4","In beta-minus decay, proton number Z…",["increases by 1","decreases by 1","decreases by 2"],0,"A neutron changes into a proton.","The daughter has one more proton and one fewer neutron."],
  ["3.8.1.4","Gamma emission changes…",["A only","Z only","nuclear energy state but not A or Z"],2,"A gamma photon carries energy.","Gamma de-excitation does not change nucleon composition."],
  ["3.8.1.5","The relation R = r₀A^(1/3) implies nuclear volume is proportional to…",["A","A²","A^(1/3)"],0,"Volume is proportional to R³.","R³ is proportional to A."],
  ["3.8.1.5","Which experiment gives information about nuclear size using a diffraction pattern?",["Electron diffraction","Young double slit","Photoelectric effect"],0,"Very short wavelengths probe nuclear dimensions.","Electron diffraction can determine nuclear radius."],
  ["3.8.1.6","What is the mass defect?",["Mass of one proton","Difference between separated nucleon mass and bound nucleus mass","Mass of emitted gamma radiation only"],1,"Binding reduces the total mass-energy of the bound system.","Mass defect corresponds to binding energy."],
  ["3.8.1.6","1 u corresponds to approximately…",["931.5 eV","931.5 keV","931.5 MeV"],2,"This is a standard nuclear conversion.","1 u corresponds to 931.5 MeV of mass-energy."],
  ["3.8.1.6","Why can fusion of light nuclei release energy?",["Products have greater binding energy per nucleon","Products have lower charge","Nucleons disappear"],0,"Use the binding-energy curve.","Moving upward on the BE-per-nucleon curve releases energy."],
  ["3.8.1.6","Why can fission of heavy nuclei release energy?",["Products are closer to the BE-per-nucleon peak","Neutrons have zero rest mass","Charge is destroyed"],0,"Compare average binding before and after.","Medium-mass fission products are more tightly bound per nucleon."],
  ["3.8.1.7","What is the main role of a moderator?",["Slow neutrons","Absorb gamma rays","Remove radioactive waste"],0,"It changes neutron kinetic energy.","A moderator slows neutrons by collisions."],
  ["3.8.1.7","What is the main role of control rods?",["Absorb neutrons","Increase fuel temperature","Create neutrons"],0,"They change neutron population.","Control rods absorb neutrons and therefore influence the chain reaction."],
  ["3.8.1.7","A steady chain reaction means the neutron population is approximately…",["constant from generation to generation","zero","doubling each generation"],0,"Think balance of production and loss.","A steady reaction replaces the neutrons that are lost."],
  ["3.8.1.8","Which system transfers thermal energy away from a reactor core?",["Coolant","Moderator only","Shielding"],0,"It transports heat.","Coolant carries thermal energy away."],
  ["3.8.1.8","Why is shielding used?",["To reduce radiation exposure outside controlled regions","To increase fission rate","To increase neutron speed"],0,"It is a protection system.","Shielding attenuates ionising radiation."],
  ["RP12","Why subtract background count rate?",["To estimate the count associated with the source/model signal","To make the distance smaller","To change the half-life"],0,"Background contributes even without the source signal.","Subtracting background isolates the measured contribution of interest."],
  ["3.8.1.3","A sample contains n moles of a radioactive isotope. Which expression gives the number of nuclei?",["N = nN_A","N = n/N_A","N = N_A/n"],0,"Use the definition of the Avogadro constant.","N = nN_A."],
  ["3.8.1.4","A nucleus emits a gamma photon. What happens to A and Z?",["Both decrease","A unchanged and Z unchanged","A unchanged and Z increases"],1,"Gamma emission is a nuclear energy transition.","The nucleus changes energy state, not its nucleon composition."],
  ["3.8.1.4","A nuclear energy-level transition has energy difference ΔE. Which equation gives the gamma frequency?",["f = h/ΔE","f = ΔE/h","f = hc/ΔE"],1,"Start with E = hf.","f = ΔE/h."],
  ["3.8.1.5","In a head-on closest-approach estimate, the initial alpha kinetic energy is equated to…",["gravitational potential energy","electrostatic potential energy","binding energy per nucleon"],1,"Both the alpha and target nucleus are positively charged.","The ideal head-on estimate uses Coulomb potential energy."],
  ["3.8.1.5","For the same electron wavelength, increasing nuclear radius moves diffraction minima generally toward…",["smaller angles","larger angles","unchanged angles"],0,"Think of diffraction angle versus object size.","A larger diffracting object gives narrower angular features."],
  ["3.8.1.7","Critical mass is linked most directly to whether…",["enough neutrons remain available to sustain the chain reaction","gamma photons escape the reactor","all nuclei have the same mass"],0,"Compare neutron production with losses.","Critical conditions depend on sustaining the neutron chain against losses."],
  ["3.8.1.7","A good moderator should primarily…",["slow neutrons efficiently without strongly absorbing them","absorb as many neutrons as possible","increase neutron kinetic energy"],0,"Moderation and control are different jobs.","The moderator slows neutrons; control rods are used for neutron absorption."],
  ["3.8.1.7","Why can low-mass moderator nuclei transfer neutron kinetic energy effectively?",["Their masses are relatively comparable to a neutron","They have no nucleus","They always absorb the neutron"],0,"Think about mechanical collision energy transfer.","Comparable masses can exchange a large fraction of kinetic energy in a collision."],
  ["3.8.1.8","Why is remote handling useful for radioactive fuel or waste?",["It increases distance and reduces direct exposure","It increases the activity","It makes half-life shorter"],0,"Consider reducing exposure.","Remote handling increases separation from the radiation source."],
  ["3.8.1.8","Which statement best links waste storage to half-life?",["Half-life helps determine how activity changes over long times","All waste becomes safe after one half-life","Half-life changes when shielding is added"],0,"Half-life describes the rate of activity decrease.","Storage decisions depend partly on how long significant activity persists."]
];

let completed = new Set(JSON.parse(localStorage.getItem("nuclearCompleted") || "[]"));
let activeLesson = 0;
let activeSim = 0;
let running = true;
let slow = false;
let startTime = performance.now();
let lastTime = startTime;
let simClock = 0;
let params = {};
let atomRandom = Array.from({length:120},(_,i)=> {
  const x = Math.sin((i+1)*12.9898)*43758.5453;
  return x-Math.floor(x);
});
let practicalData = [];
let backgroundRate = null;
let quizIndex = 0, quizScore = 0, quizStreak = 0, quizLocked = false;

function saveProgress(){
  localStorage.setItem("nuclearCompleted", JSON.stringify(Array.from(completed)));
  updateProgress();
}
function updateProgress(){
  $("#progressText").textContent = completed.size+" / "+lessons.length+" complete";
  $("#progressFill").style.width = (100*completed.size/lessons.length)+"%";
}

function showView(name){
  $$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-"+name));
  if(name==="practical") drawPracticalGraph();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-button").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.jump)));
$("#resetProgress").addEventListener("click",()=>{completed.clear();saveProgress();renderCourse();renderSpec();});

function renderCourse(){
  const list=$("#courseList");
  list.innerHTML="";
  lessons.forEach((l,i)=>{
    const b=document.createElement("button");
    b.className="course-button"+(i===activeLesson?" active":"")+(completed.has(l.code)?" complete":"");
    b.innerHTML='<span class="course-code">AQA '+l.code+'</span><span class="course-title">'+l.title+'</span>';
    b.addEventListener("click",()=>{activeLesson=i;renderCourse();});
    list.appendChild(b);
  });
  const l=lessons[activeLesson];
  $("#lessonPanel").innerHTML=
    '<span class="eyebrow">AQA '+l.code+'</span>'+
    '<h2>'+l.title+'</h2>'+
    '<p class="lesson-lead">'+l.lead+'</p>'+
    '<div class="lesson-grid">'+
      '<section class="lesson-block"><h3>Core knowledge</h3><ul>'+l.core.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
      '<section class="lesson-block remember"><h3>Remember</h3><p>'+l.remember+'</p></section>'+
      '<section class="lesson-block warning"><h3>Common exam mistake</h3><p>'+l.mistake+'</p></section>'+
      '<section class="lesson-block worked-block"><h3>Key equations / relationships</h3>'+l.formulas.map(x=>'<span class="formula-chip">'+x+'</span>').join("")+'</section>'+
    '</div>'+
    '<div class="lesson-actions"><button class="button primary" id="lessonSim">Open simulation</button><button class="button" id="markLesson">'+(completed.has(l.code)?"Mark incomplete":"Mark complete")+'</button></div>';
  $("#lessonSim").addEventListener("click",()=>{
    const idx=sims.findIndex(s=>s.id===l.sim); if(idx>=0) selectSim(idx);
    showView("lab");
  });
  $("#markLesson").addEventListener("click",()=>{
    if(completed.has(l.code)) completed.delete(l.code); else completed.add(l.code);
    saveProgress();renderCourse();renderSpec();
  });
}

function initSimTabs(){
  const nav=$("#simTabs"); nav.innerHTML="";
  sims.forEach((s,i)=>{
    const b=document.createElement("button"); b.className="sim-tab"+(i===activeSim?" active":"");
    b.textContent=s.title;b.addEventListener("click",()=>selectSim(i));nav.appendChild(b);
  });
}
function selectSim(i){
  activeSim=i; simClock=0; startTime=performance.now(); lastTime=startTime;
  const s=sims[i]; params={};
  s.controls.forEach(c=>params[c.key]=c.value);
  initSimTabs(); buildSimPanel(); renderSim(performance.now());
}
function buildSimPanel(){
  const s=sims[activeSim];
  $("#simSpec").textContent="AQA "+s.code; $("#simCode").textContent="AQA "+s.code;
  $("#simTitle").textContent=s.title; $("#simSubtitle").textContent=s.subtitle;
  $("#simpleExplain").innerHTML="<p>"+s.simple+"</p>";
  $("#examExplain").innerHTML="<p>"+s.exam+"</p>";
  $("#mistakeExplain").innerHTML="<p>"+s.mistake+"</p>";
  const controls=$("#simControls"); controls.innerHTML="";
  s.controls.forEach(c=>{
    const lab=document.createElement("label");lab.className="field";
    const title=document.createElement("span");title.textContent=c.label;lab.appendChild(title);
    let input;
    if(c.type==="select"){
      input=document.createElement("select");
      c.options.forEach(o=>{const op=document.createElement("option");op.value=o[0];op.textContent=o[1];input.appendChild(op);});
      input.value=params[c.key];
    }else{
      input=document.createElement("input");input.type="range";input.min=c.min;input.max=c.max;input.step=c.step;input.value=params[c.key];
    }
    input.dataset.key=c.key; lab.appendChild(input);
    const out=document.createElement("output");out.textContent=String(params[c.key])+(c.unit||"");lab.appendChild(out);
    input.addEventListener("input",()=>{
      params[c.key]=c.type==="select"?input.value:Number(input.value);
      out.textContent=String(params[c.key])+(c.unit||"");
      renderSim(performance.now());
    });
    controls.appendChild(lab);
  });
  const chk=s.check;
  $("#simCheck").innerHTML='<p>'+chk.q+'</p><div class="quick-options">'+chk.opts.map((o,j)=>'<button class="quick-option" data-answer="'+j+'">'+o+'</button>').join("")+'</div><div class="small muted" id="quickFeedback"></div>';
  $$(".quick-option",$("#simCheck")).forEach(b=>b.addEventListener("click",()=>{
    $$(".quick-option",$("#simCheck")).forEach(x=>x.disabled=true);
    const ok=Number(b.dataset.answer)===chk.a;b.classList.add(ok?"correct":"wrong");
    if(!ok) $$(".quick-option",$("#simCheck"))[chk.a].classList.add("correct");
    $("#quickFeedback").textContent=ok?"Correct.":"Check the highlighted answer and the exam wording above.";
  }));
}
$("#playPause").addEventListener("click",()=>{running=!running;$("#playPause").textContent=running?"Pause":"Play";$("#simState").textContent=running?"Running":"Paused";});
$("#slowMotion").addEventListener("click",()=>{slow=!slow;$("#slowMotion").textContent=slow?"Normal speed":"Slow motion";});
$("#resetSim").addEventListener("click",()=>selectSim(activeSim));

function sizeCanvas(canvas){
  const r=canvas.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(1,Math.round(r.width*dpr)), h=Math.max(1,Math.round(r.height*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height};
}
function clearCanvas(ctx,w,h){
  ctx.clearRect(0,0,w,h);
  const g=ctx.createRadialGradient(w*.5,h*.44,20,w*.5,h*.44,Math.max(w,h)*.7);
  g.addColorStop(0,"#153456");g.addColorStop(1,"#07131f");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(140,180,220,.08)";ctx.lineWidth=1;
  for(let x=20;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=20;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
}
function circle(ctx,x,y,r,fill,stroke){
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
}
function label(ctx,text,x,y,color="#eaf3ff",size=13,align="left"){
  ctx.fillStyle=color;ctx.font="700 "+size+"px system-ui";ctx.textAlign=align;ctx.fillText(text,x,y);
}
function drawNucleus(ctx,x,y,r,Z=10,N=10){
  const total=Math.min(30,Z+N), golden=2.399963;
  for(let i=0;i<total;i++){
    const rr=r*.72*Math.sqrt((i+.5)/total), a=i*golden;
    const isP=i%2===0;
    circle(ctx,x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(4,r*.12),isP?"#ff7777":"#72a9ff","rgba(255,255,255,.25)");
  }
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle="rgba(210,235,255,.35)";ctx.lineWidth=2;ctx.stroke();
}
function readout(text){$("#simReadout").innerHTML=text;}

function renderRutherford(ctx,w,h,t){
  const nx=w*.72, ny=h*.5, nr=Math.min(w,h)*.075;
  drawNucleus(ctx,nx,ny,nr,12,14);
  label(ctx,"positive nucleus",nx,ny+nr+26,"#ffd3d3",12,"center");
  const b=params.impact, E=params.energy;
  const phase=(t*.16)%1;
  for(let j=-2;j<=2;j++){
    const y0=ny+b+j*24;
    ctx.beginPath();
    for(let i=0;i<=100;i++){
      const x=w*.06+(nx-w*.08)*i/100;
      const dx=nx-x, dy=y0-ny;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const sign=(y0>=ny?1:-1);
      const def=sign*(21000/(E*E))*Math.exp(-Math.max(0,dist-nr)/75)/(Math.abs(dy)+24);
      const y=y0+def*(i/100)*(i/100)*35;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=j===0?"#ffe98a":"rgba(255,233,138,.30)";ctx.lineWidth=j===0?3:1.3;ctx.stroke();
  }
  const x=w*.06+(nx-w*.08)*phase, dx=nx-x, dy=(ny+b)-ny;
  const dist=Math.sqrt(dx*dx+dy*dy), sign=(b>=0?1:-1);
  const def=sign*(21000/(E*E))*Math.exp(-Math.max(0,dist-nr)/75)/(Math.abs(dy)+24);
  const y=ny+b+def*phase*phase*35;
  circle(ctx,x,y,8,"#ffe98a","#fff7c2");
  const approx=clamp(140/(Math.abs(b)+18)*(5/E),2,150);
  readout("Relative deflection angle ≈ <strong>"+approx.toFixed(1)+"°</strong><br>Smaller impact parameter → stronger Coulomb repulsion.");
}
function renderRadiation(ctx,w,h,t){
  const type=params.radType, thick=params.thickness/100;
  const benchY=h*.70, sourceX=w*.10, colX=w*.22, absorberX=w*.47, detectorX=w*.80;

  // laboratory bench
  const benchGrad=ctx.createLinearGradient(0,benchY,0,h);
  benchGrad.addColorStop(0,"#31465b");benchGrad.addColorStop(1,"#111b27");
  ctx.fillStyle=benchGrad;ctx.fillRect(w*.04,benchY,w*.90,h*.10);
  ctx.fillStyle="#73869a";ctx.fillRect(w*.04,benchY,w*.90,3);

  // sealed teaching source holder
  const sg=ctx.createRadialGradient(sourceX-6,h*.47,4,sourceX,h*.48,34);
  sg.addColorStop(0,"#7c91a8");sg.addColorStop(.55,"#30445a");sg.addColorStop(1,"#111d2b");
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sourceX,h*.48,31,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#99abc0";ctx.lineWidth=2;ctx.stroke();
  label(ctx,"virtual source",sourceX,h*.31,"#d8e9fa",11,"center");
  label(ctx,type==="alpha"?"α":type==="beta"?"β":"γ",sourceX,h*.54,"#fff",20,"center");

  // collimator
  ctx.fillStyle="#4d5968";ctx.fillRect(colX-18,h*.35,36,h*.13);ctx.fillRect(colX-18,h*.54,36,h*.13);
  ctx.fillStyle="#1c2734";ctx.fillRect(colX-18,h*.48,36,h*.06);
  label(ctx,"collimator",colX,h*.30,"#cfe8ff",11,"center");

  // absorber cassette
  const absorberW=14+thick*40;
  const ag=ctx.createLinearGradient(absorberX-absorberW/2,0,absorberX+absorberW/2,0);
  ag.addColorStop(0,"#7d8a99");ag.addColorStop(.5,"#d4dde6");ag.addColorStop(1,"#64717f");
  ctx.fillStyle=ag;ctx.fillRect(absorberX-absorberW/2,h*.31,absorberW,h*.38);
  ctx.strokeStyle="#e6eef6";ctx.strokeRect(absorberX-absorberW/2,h*.31,absorberW,h*.38);
  label(ctx,"absorber",absorberX,h*.26,"#cfe8ff",11,"center");

  // Geiger-style detector tube
  const dg=ctx.createLinearGradient(detectorX-45,0,detectorX+45,0);
  dg.addColorStop(0,"#66798d");dg.addColorStop(.5,"#d3dde7");dg.addColorStop(1,"#53677a");
  ctx.fillStyle=dg;ctx.beginPath();ctx.roundRect(detectorX-48,h*.43,96,40,18);ctx.fill();
  ctx.strokeStyle="#a8bbcd";ctx.stroke();
  ctx.fillStyle="#182532";ctx.fillRect(detectorX-57,h*.455,12,22);
  label(ctx,"detector",detectorX,h*.36,"#cfe8ff",11,"center");

  const transmission=type==="alpha"?Math.max(0,1-thick*8):type==="beta"?Math.exp(-thick*4):Math.exp(-thick*1.3);
  const ph=(t*.24)%1;
  const beamY=h*.50;
  ctx.strokeStyle="rgba(130,205,255,.16)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(sourceX+31,beamY);ctx.lineTo(detectorX-58,beamY);ctx.stroke();

  for(let j=0;j<12;j++){
    const p=(ph+j/12)%1;
    const survives=j/12 < transmission || p < .48;
    const x=sourceX+32+(detectorX-sourceX-90)*p;
    if(x>absorberX+absorberW/2 && !survives) continue;
    const y=beamY+(j%3-1)*8;
    if(type==="gamma"){
      ctx.strokeStyle="rgba(255,232,128,.88)";ctx.lineWidth=2;ctx.beginPath();
      for(let k=0;k<14;k++){const xx=x-20+k*3.2,yy=y+Math.sin(k*1.4)*4;if(k===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke();
    }else circle(ctx,x,y,type==="alpha"?6:4,type==="alpha"?"#ff9b72":"#7ee8ff","#fff");
  }

  // detector count display
  const meterX=w*.69,meterY=h*.15,meterW=w*.22;
  ctx.fillStyle="#07121e";ctx.fillRect(meterX,meterY,meterW,46);
  ctx.strokeStyle="#38536d";ctx.strokeRect(meterX,meterY,meterW,46);
  ctx.fillStyle="#68dca6";ctx.fillRect(meterX+8,meterY+31,(meterW-16)*transmission,7);
  label(ctx,"relative count rate "+(100*transmission).toFixed(0)+"%",meterX+meterW/2,meterY+22,"#bff4d6",11,"center");

  readout("Virtual source → absorber → detector · relative transmission: <strong>"+(100*transmission).toFixed(1)+"%</strong><br>Alpha is stopped most readily; beta is intermediate; gamma is attenuated progressively rather than having one fixed stopping thickness.");
}
function renderDecay(ctx,w,h,t){
  if(running){params.decayTime=clamp(params.decayTime+(slow?.006:.018),0,40);const input=$('[data-key="decayTime"]');if(input){input.value=params.decayTime;input.nextElementSibling.textContent=params.decayTime.toFixed(1)+" s";}}
  const T=params.halfLife, time=params.decayTime, lambda=ln2/T, survival=Math.exp(-lambda*time);
  const left=w*.07, top=h*.16, cols=12, gap=Math.min((w*.53)/cols,(h*.64)/10);
  let alive=0;
  atomRandom.forEach((r,i)=>{
    const survives=r<survival;if(survives)alive++;
    const x=left+(i%cols)*gap, y=top+Math.floor(i/cols)*gap;
    circle(ctx,x,y,Math.max(3,gap*.24),survives?"#72a9ff":"rgba(110,130,150,.18)",survives?"rgba(255,255,255,.2)":null);
  });
  const gx=w*.66, gy=h*.76, gw=w*.28, gh=h*.50;
  ctx.strokeStyle="#7b93ad";ctx.beginPath();ctx.moveTo(gx,gy-gh);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();
  ctx.beginPath();for(let i=0;i<=80;i++){const tt=40*i/80, yy=Math.exp(-lambda*tt);const x=gx+gw*i/80,y=gy-gh*yy;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.stroke();
  circle(ctx,gx+gw*time/40,gy-gh*survival,5,"#ffe98a");
  label(ctx,"N/N₀",gx-8,gy-gh-8,"#cfe8ff",11,"right");label(ctx,"time",gx+gw,gy+18,"#cfe8ff",11,"right");
  readout("λ = "+lambda.toFixed(4)+" s⁻¹ · predicted fraction remaining = <strong>"+survival.toFixed(3)+"</strong><br>Displayed surviving nuclei: "+alive+" / 120");
}
function decayDelta(mode,Z,N){
  if(mode==="alpha")return [Z-2,N-2];
  if(mode==="betaMinus")return [Z+1,N-1];
  if(mode==="betaPlus"||mode==="ec")return [Z-1,N+1];
  return [Z,N];
}
function renderStability(ctx,w,h){
  const ox=w*.12, oy=h*.84, gw=w*.70, gh=h*.67;
  ctx.strokeStyle="#7990a8";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox,oy-gh);ctx.lineTo(ox,oy);ctx.lineTo(ox+gw,oy);ctx.stroke();
  label(ctx,"N",ox-15,oy-gh,"#cfe8ff",12,"right");label(ctx,"Z",ox+gw,oy+20,"#cfe8ff",12,"right");
  ctx.beginPath();
  for(let z=10;z<=90;z++){
    const stable=z<20?z:Math.round(z*(1.05+.0055*z));
    const x=ox+gw*(z-10)/80,y=oy-gh*(stable-10)/135;
    if(z===10)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle="rgba(99,217,164,.55)";ctx.lineWidth=16;ctx.stroke();ctx.lineWidth=2;
  const Z=params.Z,N=params.N,[z2,n2]=decayDelta(params.decayMode,Z,N);
  const x1=ox+gw*(Z-10)/80,y1=oy-gh*(N-10)/135,x2=ox+gw*(z2-10)/80,y2=oy-gh*(n2-10)/135;
  circle(ctx,x1,y1,9,"#ffe98a","#fff");ctx.strokeStyle="#ff8fa0";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();circle(ctx,x2,y2,7,"#ff8fa0","#fff");
  label(ctx,"stable band",ox+gw*.72,oy-gh*.58,"#8ff0bf",12);
  readout("Parent: Z="+Z+", N="+N+", A="+(Z+N)+" → daughter: Z="+z2+", N="+n2+", A="+(z2+n2));
}
function renderRadius(ctx,w,h){
  const A=params.A,r0=params.r0,R=r0*Math.cbrt(A),scale=Math.min(w,h)*.022;
  const x=w*.34,y=h*.5,r=R*scale;
  drawNucleus(ctx,x,y,r,Math.round(A*.45),Math.round(A*.55));
  ctx.strokeStyle="#9fddff";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+r,y);ctx.stroke();label(ctx,"R",x+r/2,y-8,"#9fddff",12,"center");
  const x2=w*.72,y2=h*.50,r2=r0*Math.cbrt(Math.min(240,A*8))*scale;
  drawNucleus(ctx,x2,y2,r2,14,18);label(ctx,"If A × 8",x2,y2+r2+25,"#cfe8ff",12,"center");
  readout("R = "+r0.toFixed(2)+" × "+A+"^(1/3) = <strong>"+R.toFixed(2)+" fm</strong> = "+fmt(R*1e-15,4)+" m");
}
function renderMassEnergy(ctx,w,h){
  const dm=params.massDefect,A=params.massA,BE=dm*931.5,per=BE/A;
  const x=w*.10,barY=h*.52,barW=w*.76;
  const max=300;ctx.fillStyle="#12273f";ctx.fillRect(x,barY,barW,34);
  ctx.fillStyle="#67c7ff";ctx.fillRect(x,barY,barW*clamp(BE/max,0,1),34);
  label(ctx,"binding energy",x,barY-12,"#cfe8ff",12);label(ctx,BE.toFixed(1)+" MeV",x+barW*clamp(BE/max,0,1),barY+24,"#fff",12,"right");
  drawNucleus(ctx,w*.5,h*.28,55,Math.round(A*.45),Math.round(A*.55));
  readout("ΔE = "+dm.toFixed(3)+" u × 931.5 MeV/u = <strong>"+BE.toFixed(2)+" MeV</strong><br>Binding energy per nucleon = "+per.toFixed(3)+" MeV");
}
function beCurve(A){
  if(A<4)return 1.1+1.8*A;
  if(A<16)return 4.4+4.0*(1-Math.exp(-(A-4)/5));
  if(A<56)return 8.1+.75*(1-Math.exp(-(A-16)/15));
  return 8.8-.0019*(A-56);
}
function renderBinding(ctx,w,h){
  const ox=w*.10,oy=h*.82,gw=w*.80,gh=h*.62;
  ctx.strokeStyle="#7990a8";ctx.beginPath();ctx.moveTo(ox,oy-gh);ctx.lineTo(ox,oy);ctx.lineTo(ox+gw,oy);ctx.stroke();
  ctx.beginPath();
  for(let A=2;A<=240;A++){const x=ox+gw*(A-2)/238,y=oy-gh*(beCurve(A)/10);if(A===2)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.stroke();
  const A=params.bindA,be=beCurve(A),x=ox+gw*(A-2)/238,y=oy-gh*(be/10);circle(ctx,x,y,7,"#ffe98a","#fff");
  label(ctx,"fusion region",ox+gw*.10,oy-gh*.46,"#8ff0bf",12);label(ctx,"peak",ox+gw*.24,oy-gh*.90,"#ffe98a",12);label(ctx,"fission region",ox+gw*.67,oy-gh*.70,"#ffb1bd",12);
  label(ctx,"A",ox+gw,oy+20,"#cfe8ff",12,"right");label(ctx,"BE / nucleon",ox-8,oy-gh,"#cfe8ff",11,"right");
  readout("At A = "+A+", schematic average binding energy ≈ <strong>"+be.toFixed(2)+" MeV per nucleon</strong>.");
}
function renderFission(ctx,w,h,t){
  const k=params.k,gen=params.generation;
  const levels=Math.min(6,gen+1),cx=w*.50,top=h*.13;
  for(let g=0;g<levels;g++){
    const count=Math.min(18,Math.max(1,Math.round(Math.pow(k,g)*Math.pow(1.7,g))));
    const yy=top+g*(h*.70/6);
    for(let i=0;i<count;i++){
      const spread=Math.min(w*.82,80+g*95),xx=cx+(i-(count-1)/2)*(spread/Math.max(1,count-1));
      if(g>0){ctx.strokeStyle="rgba(126,232,255,.22)";ctx.beginPath();ctx.moveTo(cx,yy-h*.70/6+18);ctx.lineTo(xx,yy-12);ctx.stroke();}
      circle(ctx,xx,yy,Math.max(5,13-g*.8),g===levels-1?"#ffe98a":"#72a9ff","rgba(255,255,255,.25)");
    }
  }
  const status=k<.95?"decreasing":k>1.05?"increasing":"approximately steady";
  readout("Conceptual k = <strong>"+k.toFixed(2)+"</strong> → chain is <strong>"+status+"</strong>.<br>This is a teaching model of neutron balance, not a real reactor calculation.");
}
function renderReactor(ctx,w,h,t){
  const control=params.control,cooling=params.cooling;
  const vesselX=w*.12,vesselY=h*.16,vesselW=w*.42,vesselH=h*.62;

  // containment/shielding shell
  ctx.fillStyle="rgba(255,233,138,.08)";ctx.strokeStyle="rgba(255,233,138,.38)";ctx.lineWidth=14;
  ctx.beginPath();ctx.roundRect(vesselX-16,vesselY-16,vesselW+32,vesselH+32,28);ctx.fill();ctx.stroke();ctx.lineWidth=2;
  label(ctx,"biological shielding",vesselX+vesselW/2,vesselY+vesselH+38,"#ffe98a",11,"center");

  // reactor vessel
  const vg=ctx.createLinearGradient(vesselX,0,vesselX+vesselW,0);
  vg.addColorStop(0,"#53687a");vg.addColorStop(.45,"#a8bac9");vg.addColorStop(.55,"#71879a");vg.addColorStop(1,"#43596d");
  ctx.fillStyle=vg;ctx.beginPath();ctx.roundRect(vesselX,vesselY,vesselW,vesselH,24);ctx.fill();ctx.strokeStyle="#b9c8d4";ctx.stroke();
  label(ctx,"reactor vessel",vesselX+vesselW/2,vesselY-28,"#d6e7f4",12,"center");

  // moderator/coolant region
  ctx.fillStyle="rgba(70,150,205,.20)";ctx.fillRect(vesselX+24,vesselY+42,vesselW-48,vesselH-74);
  label(ctx,"moderator region",vesselX+vesselW-32,vesselY+62,"#a8dcff",9,"right");

  // fuel assemblies and control rods
  for(let i=0;i<6;i++){
    const x=vesselX+46+i*(vesselW-92)/5;
    const fuel=ctx.createLinearGradient(x-6,0,x+6,0);fuel.addColorStop(0,"#8b6a2c");fuel.addColorStop(.5,"#e7b866");fuel.addColorStop(1,"#6e4f1e");
    ctx.fillStyle=fuel;ctx.fillRect(x-6,vesselY+92,12,vesselH-130);
    const rodH=(vesselH-108)*(control/100);
    ctx.fillStyle="#313d49";ctx.fillRect(x-9,vesselY+45,18,rodH);
  }
  label(ctx,"fuel",vesselX+42,vesselY+vesselH-30,"#ffd493",10);
  label(ctx,"control rods",vesselX+vesselW/2,vesselY+36,"#d4dde4",10,"center");

  // neutrons
  for(let i=0;i<20;i++){
    const p=(t*.10+i/20)%1;
    const x=vesselX+35+p*(vesselW-70),y=vesselY+110+(i%5)*(vesselH-180)/4;
    circle(ctx,x,y,3,"#7ee8ff");
  }

  // primary coolant loop and heat exchanger
  const loopX=w*.68,loopTop=h*.28,loopBottom=h*.68;
  ctx.strokeStyle="#5dcfff";ctx.lineWidth=13;ctx.beginPath();
  ctx.moveTo(vesselX+vesselW,vesselY+vesselH*.34);
  ctx.bezierCurveTo(loopX-50,loopTop,loopX-20,loopTop,loopX,loopTop);
  ctx.lineTo(loopX,loopBottom);
  ctx.bezierCurveTo(loopX-20,loopBottom,loopX-50,loopBottom,vesselX+vesselW,vesselY+vesselH*.72);ctx.stroke();ctx.lineWidth=2;
  ctx.fillStyle="#586c7e";ctx.beginPath();ctx.roundRect(loopX-28,h*.38,56,h*.20,12);ctx.fill();
  label(ctx,"heat exchanger",loopX,h*.36,"#cfe8ff",10,"center");
  label(ctx,"coolant transfers heat",loopX+55,h*.50,"#9fddff",10);

  // heat flow arrow to generator side (conceptual)
  arrowLine(ctx,loopX+34,h*.48,w*.90,h*.48,"rgba(255,180,95,.8)");
  label(ctx,"useful thermal energy",w*.89,h*.44,"#ffd5a5",10,"right");

  const neutronFactor=1-control/125,power=clamp(100*neutronFactor,0,100),thermal=power*(1-cooling/120);
  readout("Conceptual neutron population indicator: <strong>"+power.toFixed(0)+"%</strong> · heat-removal load: "+thermal.toFixed(0)+"%.<br>Moderator slows neutrons · control rods absorb neutrons · coolant transfers heat · shielding reduces radiation outside the core.");
}
function renderEnergyLevels(ctx,w,h,t){
  const levels=[0,0.14,0.39,0.82,1.42];
  let up=Math.round(params.upperLevel), low=Math.round(params.lowerLevel);
  if(low>=up) low=Math.max(0,up-1);
  const left=w*.18,right=w*.76,base=h*.79,scale=h*.43/1.5;
  levels.forEach((E,i)=>{
    const y=base-E*scale;
    ctx.strokeStyle=i===up?"#ffe98a":i===low?"#67c7ff":"rgba(190,215,240,.45)";
    ctx.lineWidth=(i===up||i===low)?3:1.5;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
    label(ctx,"E"+i+"  "+E.toFixed(2)+" MeV",right+12,y+4,"#cfe8ff",11);
  });
  const y1=base-levels[up]*scale,y2=base-levels[low]*scale,x=w*.46;
  arrowLine(ctx,x,y1+8,x,y2-8,"#ffe98a");
  const dE=Math.max(0,levels[up]-levels[low]);
  const ph=(t*.55)%1, gx=x+(w*.30)*ph, gy=y1+(y2-y1)*ph;
  ctx.strokeStyle="#ffe98a";ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<18;i++){const xx=gx-35+i*4,yy=gy+Math.sin(i*1.6)*6;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();
  readout("ΔE = <strong>"+dE.toFixed(2)+" MeV</strong> · A and Z unchanged during gamma emission.");
}
function arrowLine(ctx,x1,y1,x2,y2,color){
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  const a=Math.atan2(y2-y1,x2-x1),q=8;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-Math.cos(a-.55)*q,y2-Math.sin(a-.55)*q);ctx.lineTo(x2-Math.cos(a+.55)*q,y2-Math.sin(a+.55)*q);ctx.closePath();ctx.fill();
}
function renderClosestApproach(ctx,w,h,t){
  const Z=params.targetZ,E=params.alphaMeV;
  const k=8.9875517923e9, Ej=E*1e6*e, r=k*(2*Z*e*e)/Ej, rfm=r/1e-15;
  const nx=w*.69,ny=h*.49,nr=Math.min(w,h)*.095;

  // electric field rings
  for(let q=1;q<=4;q++){
    ctx.strokeStyle="rgba(255,120,140,"+(0.20/q+.04)+")";ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(nx,ny,nr+q*32,0,Math.PI*2);ctx.stroke();
  }
  drawNucleus(ctx,nx,ny,nr,18,23);
  label(ctx,"target nucleus  +"+Z+"e",nx,ny+nr+27,"#ffd1d8",12,"center");

  const cycle=(Math.sin(t*.9)+1)/2;
  const minX=nx-nr-48;
  const x=w*.10+(minX-w*.10)*(cycle<.5?cycle*2:(1-cycle)*2);
  circle(ctx,x,ny,9,"#ffe98a","#fff7c2");
  label(ctx,"α  +2e",x,ny+30,"#ffe98a",12,"center");

  // force arrow, stronger near nucleus
  const strength=clamp(1-(nx-x)/(nx-w*.10),0,1);
  const arrowLen=24+50*strength;
  arrowLine(ctx,x-12,ny-30,x-arrowLen,ny-30,"rgba(255,176,98,.9)");
  label(ctx,"repulsive force",x-arrowLen/2,ny-39,"#ffd0a0",10,"center");

  // energy bars
  const barX=w*.10,barY=h*.16,barW=w*.32;
  ctx.fillStyle="#102337";ctx.fillRect(barX,barY,barW,14);ctx.fillRect(barX,barY+28,barW,14);
  const pe=strength,ke=1-pe;
  ctx.fillStyle="#67c7ff";ctx.fillRect(barX,barY,barW*ke,14);
  ctx.fillStyle="#ff9e73";ctx.fillRect(barX,barY+28,barW*pe,14);
  label(ctx,"kinetic energy",barX,barY-7,"#9fe0ff",10);label(ctx,"electrostatic PE",barX,barY+25,"#ffc0a5",10);

  // closest-approach marker
  ctx.strokeStyle="#ffe98a";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(minX,ny-62);ctx.lineTo(minX,ny+62);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"closest approach ≈ "+rfm.toFixed(1)+" fm",minX,ny-72,"#ffe98a",11,"center");

  readout("Head-on energy model: Eₖ = k(2e)(Ze)/r → <strong>r ≈ "+rfm.toFixed(1)+" fm</strong>.<br>Higher alpha energy gives a smaller closest-approach distance; larger target Z gives a larger distance.");
}
function renderElectronDiffraction(ctx,w,h){
  const R=params.diffRadius,lam=params.wavelength;
  const split=w*.43;

  // apparatus side
  ctx.fillStyle="#0b1826";ctx.fillRect(w*.04,h*.12,split-w*.06,h*.70);
  ctx.strokeStyle="#35516d";ctx.strokeRect(w*.04,h*.12,split-w*.06,h*.70);
  label(ctx,"electron diffraction apparatus",w*.23,h*.17,"#cfe8ff",11,"center");

  // electron gun
  ctx.fillStyle="#53677b";ctx.beginPath();ctx.roundRect(w*.075,h*.42,w*.10,h*.12,8);ctx.fill();
  ctx.fillStyle="#dce8f2";ctx.fillRect(w*.165,h*.455,w*.025,h*.05);
  label(ctx,"electron gun",w*.13,h*.59,"#bcd8ec",10,"center");

  // beam/wavefronts
  ctx.strokeStyle="rgba(126,232,255,.55)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(w*.19,h*.48);ctx.lineTo(w*.31,h*.48);ctx.stroke();
  for(let n=0;n<5;n++){ctx.strokeStyle="rgba(126,232,255,.35)";ctx.beginPath();ctx.arc(w*.20+n*w*.022,h*.48,10,Math.PI*.5,Math.PI*1.5);ctx.stroke()}

  // target nucleus and detector arc
  drawNucleus(ctx,w*.315,h*.48,18,8,10);label(ctx,"nucleus",w*.315,h*.57,"#ffd4d8",10,"center");
  ctx.strokeStyle="#79d7a8";ctx.lineWidth=5;ctx.beginPath();ctx.arc(w*.315,h*.48,w*.095,-Math.PI*.72,Math.PI*.72);ctx.stroke();
  label(ctx,"detector",w*.39,h*.29,"#aef0c9",10,"center");

  // diffracted rays
  [-.55,-.28,0,.28,.55].forEach((a,i)=>{
    ctx.strokeStyle=i===2?"rgba(126,232,255,.7)":"rgba(126,232,255,.35)";
    ctx.lineWidth=i===2?2.5:1.4;ctx.beginPath();ctx.moveTo(w*.315,h*.48);ctx.lineTo(w*.315+Math.cos(a)*w*.10,h*.48+Math.sin(a)*w*.10);ctx.stroke();
  });

  // graph side
  const left=w*.50,base=h*.78,gw=w*.44,gh=h*.58;
  ctx.strokeStyle="#7890aa";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(left,base-gh);ctx.lineTo(left,base);ctx.lineTo(left+gw,base);ctx.stroke();
  const first=clamp(18*(lam/.7)*(5/R),4,55);
  ctx.beginPath();
  for(let i=0;i<=240;i++){
    const ang=65*i/240;
    const x=ang/(first||1)*Math.PI;
    const sinc=Math.abs(x)<.04?1:Math.sin(x)/x;
    const intensity=Math.pow(sinc,2)*(0.96+0.04*Math.cos(x*.7));
    const px=left+gw*i/240,py=base-gh*intensity;
    if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.stroke();
  const minX=left+gw*(first/65);ctx.strokeStyle="#ffe98a";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(minX,base-gh*.05);ctx.lineTo(minX,base);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"intensity",left-6,base-gh,"#cfe8ff",10,"right");label(ctx,"scattering angle",left+gw,base+20,"#cfe8ff",10,"right");
  label(ctx,"first minimum ≈ "+first.toFixed(1)+"°",minX,base-12,"#ffe98a",10,"center");

  readout("Electron wavelength ≈ <strong>"+lam.toFixed(2)+" fm</strong> · nuclear radius = <strong>"+R.toFixed(1)+" fm</strong>.<br>At fixed wavelength, a larger nucleus shifts diffraction minima to smaller angles.");
}
function renderModeration(ctx,w,h,t){
  const M=params.massRatio,n=Math.round(params.collisionCount);
  const retain=Math.pow((M-1)/(M+1),2);
  const energies=[1];for(let i=1;i<=n;i++)energies.push(energies[i-1]*(.5+.5*retain));

  const left=w*.08,right=w*.90,trackY=h*.43,step=(right-left)/Math.max(1,n);
  label(ctx,"fast neutron",left,trackY-55,"#9fe8ff",11,"center");
  label(ctx,"moderator nuclei",w*.50,h*.76,"#b9ccff",11,"center");

  // material background
  ctx.fillStyle="rgba(80,110,145,.08)";ctx.fillRect(w*.04,h*.22,w*.90,h*.58);
  for(let i=0;i<n;i++){
    const x=left+(i+1)*step;
    const rad=12+Math.min(18,Math.sqrt(M)*3);
    const g=ctx.createRadialGradient(x-4,h*.62-5,3,x,h*.62,rad);
    g.addColorStop(0,"#a7c7ff");g.addColorStop(1,"#3c5f91");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,h*.62,rad,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(220,235,255,.45)";ctx.stroke();
  }

  // neutron path with decreasing speed/energy indicated by spacing and size
  for(let i=0;i<=n;i++){
    const x=left+i*step, Erel=energies[i],rad=5+8*Math.sqrt(Erel);
    const y=trackY+Math.sin(i*1.65)*18;
    if(i>0){
      const px=left+(i-1)*step,py=trackY+Math.sin((i-1)*1.65)*18;
      ctx.strokeStyle="rgba(126,232,255,.45)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();
    }
    circle(ctx,x,y,rad,"#7ee8ff","#fff");
    if(i>0)label(ctx,"collision "+i,x,h*.70,"#a8bdd3",9,"center");
  }

  // energy meter
  const bx=w*.08,by=h*.14,bw=w*.42;
  ctx.fillStyle="#102337";ctx.fillRect(bx,by,bw,14);ctx.fillStyle="#7ee8ff";ctx.fillRect(bx,by,bw*energies[n],14);
  label(ctx,"relative neutron kinetic energy",bx,by-7,"#bfefff",10);
  label(ctx,(100*energies[n]).toFixed(1)+"% remaining",bx+bw,by+12,"#d8f5ff",10,"right");

  readout("After "+n+" model collisions, neutron kinetic energy ≈ <strong>"+energies[n].toFixed(3)+"</strong> of its initial value.<br>Moderation slows neutrons by collisions; it is not the same as absorbing them.");
}
function renderSim(now){
  const canvas=$("#simCanvas"); if(!canvas)return;
  const {ctx,w,h}=sizeCanvas(canvas);clearCanvas(ctx,w,h);
  const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;if(running)simClock+=dt*(slow?.3:1);
  const t=simClock;
  const id=sims[activeSim].id;
  if(id==="rutherford")renderRutherford(ctx,w,h,t);
  else if(id==="radiation")renderRadiation(ctx,w,h,t);
  else if(id==="decay")renderDecay(ctx,w,h,t);
  else if(id==="stability")renderStability(ctx,w,h);
  else if(id==="energyLevels")renderEnergyLevels(ctx,w,h,t);
  else if(id==="closestApproach")renderClosestApproach(ctx,w,h,t);
  else if(id==="electronDiffraction")renderElectronDiffraction(ctx,w,h);
  else if(id==="radius")renderRadius(ctx,w,h);
  else if(id==="massEnergy")renderMassEnergy(ctx,w,h);
  else if(id==="binding")renderBinding(ctx,w,h);
  else if(id==="fission")renderFission(ctx,w,h,t);
  else if(id==="moderation")renderModeration(ctx,w,h,t);
  else if(id==="reactor")renderReactor(ctx,w,h,t);
}
function animationLoop(now){renderSim(now);requestAnimationFrame(animationLoop);}

function initFormula(){
  const sel=$("#formulaSelect");sel.innerHTML=formulas.map(f=>'<option value="'+f.id+'">'+f.name+' — '+f.eq+'</option>').join("");
  sel.addEventListener("change",renderFormula);
  $("#formulaCards").innerHTML=formulas.map(f=>'<article class="formula-card"><strong>'+f.name+'</strong><code>'+f.eq+'</code><p>'+formulaNote(f.id)+'</p></article>').join("");
  renderFormula();
}
function formulaNote(id){
  return {
    decay:"Exponential number-decay relationship.",
    activity:"Activity is decay rate, measured in Bq.",
    half:"Connect half-life and decay probability.",
    inverse:"Ideal inverse-square scaling with distance.",
    radius:"Cube-root dependence of nuclear radius.",
    density:"Shows why nuclear density is nearly constant.",
    mass:"Convert mass difference into energy.",
    bind:"Compare stability using binding energy per nucleon.",
    nuclei:"Convert sample mass into number of nuclei using molar mass and Avogadro constant.",
    sampleActivity:"Combine sample composition, half-life and A = λN.",
    closest:"Use electrostatic potential energy for a head-on alpha closest-approach estimate.",
    gamma:"Convert a nuclear level spacing into gamma-photon frequency."
  }[id]||"";
}
function renderFormula(){
  const f=formulas.find(x=>x.id===$("#formulaSelect").value)||formulas[0],box=$("#formulaInputs");box.innerHTML="";
  f.inputs.forEach(inp=>{
    const lab=document.createElement("label");lab.className="field";lab.innerHTML='<span>'+inp[1]+'</span><input type="number" step="any" data-fkey="'+inp[0]+'" value="'+inp[2]+'">';
    box.appendChild(lab);$("input",lab).addEventListener("input",updateFormulaWorking);
  });updateFormulaWorking();
}
function updateFormulaWorking(){
  const f=formulas.find(x=>x.id===$("#formulaSelect").value)||formulas[0],v={};
  $$("[data-fkey]",$("#formulaInputs")).forEach(i=>v[i.dataset.fkey]=Number(i.value));
  let lines;try{lines=f.calc(v);}catch(err){lines=["Check the entered values."];}
  $("#formulaWorking").innerHTML=lines.map(x=>'<span class="step">'+x+'</span>').join("");
}

function updateDistanceUI(){
  const r=Number($("#distanceSlider").value)/100;
  $("#distanceOutput").textContent=r.toFixed(2)+" m";$("#distanceLabel").textContent=r.toFixed(2)+" m";
}
$("#distanceSlider").addEventListener("input",updateDistanceUI);
$("#measureBackground").addEventListener("click",()=>{
  backgroundRate=0.8+Math.random()*.35;
  $("#backgroundReadout").textContent="Measured virtual background ≈ "+backgroundRate.toFixed(2)+" counts s⁻¹";
});
$("#takeReading").addEventListener("click",()=>{
  const r=Number($("#distanceSlider").value)/100, bg=backgroundRate==null?1.0:backgroundRate;
  const signal=15/(r*r), expected=(signal+bg)*30;
  const noisy=Math.max(0,Math.round(expected + (Math.random()-.5)*2*Math.sqrt(expected)));
  const corrected=Math.max(0,noisy/30-bg);
  practicalData.push({r,inv:1/(r*r),count:noisy,corrected});
  renderPracticalTable();drawPracticalGraph();
});
$("#clearPractical").addEventListener("click",()=>{practicalData=[];backgroundRate=null;renderPracticalTable();drawPracticalGraph();$("#backgroundReadout").textContent="Background not measured yet.";});
function renderPracticalTable(){
  $("#practicalRows").innerHTML=practicalData.map(d=>'<tr><td>'+d.r.toFixed(2)+'</td><td>'+d.inv.toFixed(2)+'</td><td>'+d.count+'</td><td>'+d.corrected.toFixed(2)+'</td></tr>').join("");
}
function drawPracticalGraph(){
  const canvas=$("#practicalCanvas");if(!canvas)return;const {ctx,w,h}=sizeCanvas(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle="#071522";ctx.fillRect(0,0,w,h);
  const pad={l:58,r:18,t:20,b:42};ctx.strokeStyle="#7690aa";ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
  label(ctx,"corrected count rate / s⁻¹",pad.l-12,pad.t+6,"#cfe8ff",11,"right");label(ctx,"1/r² / m⁻²",w-pad.r,h-14,"#cfe8ff",11,"right");
  if(!practicalData.length){$("#fitReadout").textContent="Collect at least 3 distances";return;}
  const maxX=Math.max(...practicalData.map(d=>d.inv))*1.12,maxY=Math.max(...practicalData.map(d=>d.corrected))*1.12;
  const px=d=>pad.l+(w-pad.l-pad.r)*d.inv/maxX,py=d=>h-pad.b-(h-pad.t-pad.b)*d.corrected/maxY;
  practicalData.forEach(d=>circle(ctx,px(d),py(d),5,"#ffe98a","#fff"));
  if(practicalData.length>=2){
    const sx=practicalData.reduce((a,d)=>a+d.inv,0),sy=practicalData.reduce((a,d)=>a+d.corrected,0),sxx=practicalData.reduce((a,d)=>a+d.inv*d.inv,0),sxy=practicalData.reduce((a,d)=>a+d.inv*d.corrected,0),n=practicalData.length;
    const m=(n*sxy-sx*sy)/(n*sxx-sx*sx||1),b=(sy-m*sx)/n;
    ctx.strokeStyle="#67c7ff";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(pad.l,h-pad.b-(h-pad.t-pad.b)*b/maxY);ctx.lineTo(w-pad.r,h-pad.b-(h-pad.t-pad.b)*(m*maxX+b)/maxY);ctx.stroke();
    const mean=sy/n,ssTot=practicalData.reduce((a,d)=>a+Math.pow(d.corrected-mean,2),0),ssRes=practicalData.reduce((a,d)=>a+Math.pow(d.corrected-(m*d.inv+b),2),0),r2=ssTot?1-ssRes/ssTot:1;
    $("#fitReadout").textContent="Linear fit R² ≈ "+clamp(r2,0,1).toFixed(3);
  } else $("#fitReadout").textContent="Collect at least 3 distances";
}

function renderQuiz(){
  const q=quiz[quizIndex];quizLocked=false;
  $("#quizProgress").textContent=(quizIndex+1)+" / "+quiz.length;$("#quizProgressFill").style.width=(100*(quizIndex+1)/quiz.length)+"%";
  $("#quizScore").textContent=quizScore;$("#quizStreak").textContent=quizStreak;$("#quizSpec").textContent="AQA "+q[0];$("#quizQuestion").textContent=q[1];
  $("#quizHint").classList.add("hidden");$("#quizHint").textContent=q[3]===undefined?"":q[4];$("#quizFeedback").className="feedback hidden";$("#nextQuestion").classList.add("hidden");
  $("#quizChoices").innerHTML=q[2].map((x,i)=>'<button class="choice-button" data-qans="'+i+'">'+x+'</button>').join("");
  $$("[data-qans]",$("#quizChoices")).forEach(b=>b.addEventListener("click",()=>answerQuiz(Number(b.dataset.qans))));
}
function answerQuiz(i){
  if(quizLocked)return;quizLocked=true;const q=quiz[quizIndex],ok=i===q[3];
  $$("[data-qans]",$("#quizChoices")).forEach((b,j)=>{b.disabled=true;if(j===q[3])b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong");});
  if(ok){quizScore++;quizStreak++;}else quizStreak=0;
  $("#quizScore").textContent=quizScore;$("#quizStreak").textContent=quizStreak;
  $("#quizFeedback").className="feedback "+(ok?"good":"bad");$("#quizFeedback").textContent=(ok?"Correct. ":"Not quite. ")+q[5];
  $("#nextQuestion").classList.remove("hidden");
}
$("#showHint").addEventListener("click",()=>$("#quizHint").classList.remove("hidden"));
$("#nextQuestion").addEventListener("click",()=>{quizIndex=(quizIndex+1)%quiz.length;renderQuiz();});
$("#restartQuiz").addEventListener("click",()=>{quizIndex=0;quizScore=0;quizStreak=0;renderQuiz();});

function renderSpec(){
  $("#specGrid").innerHTML=lessons.map((l,i)=>
    '<article class="spec-card"><div class="status"><span class="eyebrow">'+l.code+'</span><span class="status-dot '+(completed.has(l.code)?"done":"")+'"></span></div><h3>'+l.title+'</h3><p>'+l.lead+'</p><button class="button" data-spec-open="'+i+'">Open lesson</button></article>'
  ).join("");
  $$("[data-spec-open]").forEach(b=>b.addEventListener("click",()=>{activeLesson=Number(b.dataset.specOpen);renderCourse();showView("course");}));
}

window.addEventListener("resize",()=>{renderSim(performance.now());drawPracticalGraph();});
updateProgress();renderCourse();renderSpec();initFormula();updateDistanceUI();renderPracticalTable();renderQuiz();selectSim(0);requestAnimationFrame(animationLoop);
})();