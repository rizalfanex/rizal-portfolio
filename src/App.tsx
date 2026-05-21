import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Mail,
  MapPin,
  Newspaper,
} from "lucide-react";
import profilePhoto from "../Pas Foto 4x6.jpg.jpeg";
import "./style.css";

type Project = {
  id: string;
  title: string;
  label: string;
  period: string;
  oneLine: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
  highlights: string[];
};

type TimelineItem = {
  year: string;
  title: string;
  organization: string;
  description: string;
};

type MediaItem = {
  title: string;
  source: string;
  date: string;
  url: string;
  summary: string;
  tag: string;
};

const profile = {
  name: "Mochamad Rizal Fauzan",
  title: "AI Researcher & Computer Vision Engineer",
  location: "Bandung, Indonesia · Taipei, Taiwan",
  email: "rizalfauzan2002@gmail.com",
  current: "MSc Electrical Engineering and Computer Science · NTUT",
  summary:
    "I build applied AI systems across computer vision, language models, IoT, and electrical engineering. My work connects research, software, embedded systems, and real-world deployment.",
  linkedin: "https://www.linkedin.com/in/rizalfauzan2002/",
  scholar: "https://scholar.google.com/citations?user=wfTpQXgAAAAJ&hl=en",
  github: "https://github.com/rizalfanex",
};

const profileLinks = [
  {
    label: "LinkedIn",
    href: profile.linkedin,
    meta: "Professional profile",
    icon: BriefcaseBusiness,
  },
  {
    label: "Google Scholar",
    href: profile.scholar,
    meta: "Research footprint",
    icon: GraduationCap,
  },
  {
    label: "GitHub",
    href: profile.github,
    meta: "Code and projects",
    icon: GitBranch,
  },
];

const metrics = [
  ["4.0/4.0", "Current MSc GPA"],
  ["3.96/4.0", "Bachelor GPA"],
  ["#1", "Best Graduate"],
  ["9", "External Features"],
];

const focusAreas = [
  {
    title: "LLM Knowledge Assistant",
    caption: "Internal document retrieval and response generation",
  },
  {
    title: "AIoT Vision System",
    caption: "Wildlife detection and automated field alerts",
  },
  {
    title: "Embedded Intelligence",
    caption: "Sensors, microcontrollers, and hardware integration",
  },
];

const projects: Project[] = [
  {
    id: "wildlife-aiot",
    title: "AIoT-Based Wildlife Detection and Deterrence System",
    label: "Computer Vision · AIoT · Field Deployment",
    period: "Jan 2026 — Present",
    oneLine:
      "An AI-based monitoring system for detecting monkeys and triggering automated deterrence in tourism areas.",
    problem:
      "Tourism and forest recreation areas require real-time wildlife intrusion monitoring without relying only on manual supervision.",
    solution:
      "Designed an AIoT workflow that detects monkeys entering a defined area, activates sound deterrents, and sends alerts to field operators.",
    impact:
      "Deployed and tested at Wuling Farm and Alishan National Forest Recreation Area to support real-time monitoring.",
    stack: ["Computer Vision", "AIoT", "Sensor Workflow", "Field Monitoring"],
    highlights: [
      "Real-world outdoor deployment",
      "Automated sound deterrent response",
      "Operator alert workflow",
    ],
  },
  {
    id: "campus-automation",
    title: "Automated Lighting Control System for Campus Buildings",
    label: "IoT · Sensor Systems · Energy Efficiency",
    period: "Jul 2024 — Mar 2025",
    oneLine:
      "A large-scale sensor-based automation system for intelligent lighting control across campus buildings.",
    problem:
      "Campus buildings needed a more efficient lighting control system to reduce unnecessary energy usage.",
    solution:
      "Contributed to control logic that activates lighting only when human presence is detected under low-light conditions.",
    impact:
      "Supported deployment across 7 campus buildings with more than 2,100 installed units.",
    stack: ["IoT", "Sensors", "Control Logic", "Energy Systems"],
    highlights: [
      "2,100+ installed units",
      "7 campus buildings",
      "Human-presence and low-light logic",
    ],
  },
  {
    id: "hepix",
    title: "HEPIX Smart Air Filtration System",
    label: "IoT · Indoor Air Quality · Funded Innovation",
    period: "2023 — 2024",
    oneLine:
      "A biomimetic IoT air-filtration system for reducing indoor pollutants with automated control and Google Assistant integration.",
    problem:
      "Urban indoor spaces need practical, measurable, and low-friction air quality improvements.",
    solution:
      "Contributed programming and component integration for an IoT-based filtration system with automated controls and voice interaction.",
    impact:
      "Received PKM funding and public media coverage; reported around 55% pollutant reduction in field testing.",
    stack: ["IoT", "Air Quality Sensors", "Google Assistant", "Embedded Control"],
    highlights: [
      "PKM-funded innovation",
      "55% reported pollutant reduction",
      "Covered by UPI and FPTI media",
    ],
  },
  {
    id: "power-factor",
    title: "IoT-Based Power Factor Monitoring and Optimization System",
    label: "IoT · Energy Monitoring · Publication",
    period: "Jan 2024 — Mar 2024",
    oneLine:
      "A real-time electrical monitoring system for power factor tracking and optimization using IoT.",
    problem:
      "Electrical systems need real-time power factor visibility to support efficient energy management.",
    solution:
      "Developed an IoT-based system using PZEM-004T sensor for electrical parameter monitoring and optimization.",
    impact:
      "Resulted in a publication in a Q4-indexed international journal.",
    stack: ["IoT", "PZEM-004T", "Power Factor", "Electrical Monitoring"],
    highlights: [
      "Real-time parameter tracking",
      "Power quality monitoring",
      "Publication-oriented project",
    ],
  },
  {
    id: "solar-power",
    title: "Portable Solar Power System 150W",
    label: "Renewable Energy · Hardware Architecture",
    period: "Jun 2024 — Aug 2024",
    oneLine:
      "A portable off-grid solar power system for practical learning and small-scale energy applications.",
    problem:
      "Educational and field environments need compact, portable, and reliable off-grid power sources.",
    solution:
      "Designed system architecture covering solar panel, battery storage, inverter, and load management.",
    impact:
      "Presented through community deployment and public outreach on zero-carbon off-grid electricity.",
    stack: ["Solar Energy", "Battery Storage", "Inverter", "Load Management"],
    highlights: [
      "150W portable architecture",
      "Off-grid use case",
      "Covered by UPI news",
    ],
  },
];

const timeline: TimelineItem[] = [
  {
    year: "2026",
    title: "AI/LLM Research Project",
    organization: "Weltall Technology Corporation",
    description:
      "Developing an internal LLM-based knowledge assistant with document retrieval, backend processing, and local web interface.",
  },
  {
    year: "2025",
    title: "MSc EECS",
    organization: "National Taipei University of Technology",
    description:
      "Current GPA 4.0/4.0 with coursework in AI, deep learning, machine learning, computer vision, and NLP.",
  },
  {
    year: "2025",
    title: "Best Graduate, FPTI UPI",
    organization: "Indonesia University of Education",
    description:
      "Recognized as the best graduate of FPTI UPI for graduation period II with GPA 3.96/4.0.",
  },
  {
    year: "2024",
    title: "AI Innovation Presenter",
    organization: "RAVTE International Student Workshop · RMUTT Thailand",
    description:
      "Represented UPI in an international workshop on AI technologies and innovations with participants from nine countries.",
  },
  {
    year: "2024",
    title: "Large-Scale IoT Automation",
    organization: "Campus Building Automation",
    description:
      "Supported deployment of sensor-based lighting automation across 7 buildings with more than 2,100 installed units.",
  },
];

const skills: [string, string[]][] = [
  [
    "AI / ML",
    [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Computer Vision",
      "LLMs",
      "NLP",
    ],
  ],
  [
    "Engineering",
    [
      "Embedded Systems",
      "IoT",
      "Microcontrollers",
      "Sensors",
      "Power Electronics",
      "Control Systems",
    ],
  ],
  [
    "Programming",
    ["Python", "C/C++", "MATLAB", "JavaScript", "HTML/CSS", "React"],
  ],
  [
    "Execution",
    [
      "Hardware-Software Integration",
      "Testing",
      "Documentation",
      "UI Development",
      "Research Writing",
    ],
  ],
];

const recognition = [
  "Best Graduate, FPTI UPI Graduation Period II, GPA 3.96/4.0, 2025",
  "Top 10 National Finalist, Digital Poster Competition PIMNAS 37, 2024",
  "Funding Recipient, National Student Creativity Program, 2023 and 2024",
  "IEEE EDS STEM Workshop Instructor",
  "Featured in IEEE EDS Newsletter, April 2024",
  "Industrial Automation Junior Technician, BNSP",
  "Elements of AI, University of Helsinki",
];

const mediaCoverage: MediaItem[] = [
  {
    title:
      "Best Graduate of FPTI UPI Graduation Period II with GPA 3.96",
    source: "FPTI UPI",
    date: "20 Jun 2025",
    tag: "Best Graduate",
    url: "https://fpti.upi.edu/post-detail/1269-mochamad-rizal-fauzan-wisudawan-terbaik-gelombang-ii-fpti-upi-dengan-ipk-396-inspirasi-dari-disiplin-dan-rasa-ingin-tahu",
    summary:
      "Faculty profile recognizing academic excellence, research activity, IoT innovation, publications, HKI, PKM achievements, and international presentation experience.",
  },
  {
    title:
      "PLTS Off-Grid as Zero-Carbon Electricity for Community Education",
    source: "Kabar UPI",
    date: "15 Aug 2024",
    tag: "Solar · IoT",
    url: "https://berita.upi.edu/pengenalan-perangkat-plts-off-grid-sebagai-energi-listrik-zero-karbon-pada-pkm-mandiri-universitas-pendidikan-indonesia-di-kelurahan-cibadak-kecamatan-astana-anyar-kota-bandung/",
    summary:
      "Named as student coordinator for off-grid solar, inverter, and IoT automation outreach in Bandung.",
  },
  {
    title:
      "HEPIX Smart Air Filtration for Indoor Pollution Reduction",
    source: "Kabar UPI",
    date: "01 Aug 2024",
    tag: "IoT · Air Quality",
    url: "https://berita.upi.edu/mahasiswa-universitas-pendidikan-indonesia-berhasil-buat-hepix-untuk-reduksi-polusi-udara-indoor/",
    summary:
      "Covered as programming and component specialist for a PKM-funded IoT air-filtration innovation.",
  },
  {
    title:
      "RAVTE International Student Workshop: Exploring AI Technologies and Innovations",
    source: "FPTI UPI",
    date: "06 Dec 2024",
    tag: "AI · International",
    url: "https://fpti.upi.edu/post-detail/1154-empat-tim-menjadi-presenter-dalam-kegiatan-ravte-international-student-workshop-exploring-ai-technologies-and-innovations-yang-diselenggarakan-secara-hybrid-di-kampus-rmutt-thailand",
    summary:
      "UPI teams presented AI-related work in a hybrid workshop hosted by RMUTT Thailand with participants from nine countries.",
  },
  {
    title:
      "Inverter and AC Smart Home Powered by Solar Panel Electricity",
    source: "Kabar UPI",
    date: "15 Nov 2023",
    tag: "Solar · Embedded",
    url: "https://berita.upi.edu/prof-dr-tuti-suartini-m-pd-bersama-tim-mahasiswa-memperkenalkan-perangkat-inverter-dan-ac-smart-home-yang-menggunakan-sumber-energi-listrik-berbasis-panel-surya/",
    summary:
      "Recognized as student coordinator with IoT capability in a solar-powered inverter and smart-home outreach project.",
  },
  {
    title:
      "Energy Saving Practice, Capacitor Bank Training, and Grounding Safety",
    source: "FPTI UPI",
    date: "21 Aug 2024",
    tag: "Electrical · Community",
    url: "https://fpti.upi.edu/post-detail/1074-pengabdian-kepada-masyarakat-di-desa-cipada-cikalongwetan-kabupaten-bandung-barat-implementasi-praktik-hemat-energi-pelatihan-kapasitor-bank-dan-sistem-pengaman-grounding",
    summary:
      "Community engineering program focused on energy efficiency, capacitor bank practice, and electrical safety.",
  },
  {
    title:
      "HEPIX for Indoor Air Pollution Control",
    source: "FPTI UPI",
    date: "01 Aug 2024",
    tag: "IoT · Innovation",
    url: "https://fpti.upi.edu/post-detail/1069-mahasiswa-upi-mengembangkan-hepix-untuk-pengendalian-polusi-udara-dalam-ruangan",
    summary:
      "Faculty coverage highlighting HEPIX, Google Assistant control, and reported indoor pollutant reduction.",
  },
  {
    title:
      "Virtual Reality-Based Electromagnetic Field Learning at SMAN 6 Cirebon",
    source: "SMAN 6 Cirebon",
    date: "23 Jan 2024",
    tag: "VR · Education",
    url: "https://smanegeri6cirebon.sch.id/berita/dosen-teknik-elektro-upi-bandung-bersama-puluhan-mahasiswa-implementasi-vr-di-sman-6-cirebon",
    summary:
      "Public school implementation of VR-based learning for electromagnetic field education.",
  },
  {
    title:
      "PKM Funding for IoT-Based Healthy Breathing Innovation",
    source: "FPTI UPI",
    date: "03 Jul 2023",
    tag: "PKM · Funding",
    url: "https://fpti.upi.edu/post-detail/880-3-proposal-pkm-mahasiswa-prodi-pendidikan-teknik-bangunan-fptk-upi-lolos-pendanaan-pkm-8-bidang-tahun-2023",
    summary:
      "Funding announcement for the IoT-based air-quality innovation team involving Mochamad Rizal Fauzan.",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-header">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function App() {
  const [activeProjectId, setActiveProjectId] = useState(projects[0].id);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? projects[0],
    [activeProjectId]
  );

  return (
    <main className="app">
      <header className="navbar">
        <a className="brand" href="#top" aria-label="Back to top">
          MRF
        </a>

        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#case-study">Case Study</a>
          <a href="#timeline">Timeline</a>
          <a href="#proof">Proof</a>
          <a href="#skills">Skills</a>
        </nav>

        <a className="nav-button" href={`mailto:${profile.email}`}>
          <Mail size={16} aria-hidden="true" />
          Contact
        </a>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <div className="availability">
            <span className="availability-dot" aria-hidden="true" />
            <span className="availability-text">
              Open to AI Research, Computer Vision, and Research Engineering roles
            </span>
          </div>

          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <p>{profile.summary}</p>

          <div className="hero-actions">
            <a href={`mailto:${profile.email}`} className="primary-button">
              <Mail size={18} aria-hidden="true" />
              Contact for Opportunities
            </a>
            <a href="#case-study" className="secondary-button">
              View Case Studies
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>

          <div className="profile-links" aria-label="Professional links">
            {profileLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  href={link.href}
                  key={link.label}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${link.label}`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>
                    <strong>{link.label}</strong>
                    <small>{link.meta}</small>
                  </span>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        <aside className="hero-visual" aria-label="Profile snapshot">
          <div className="profile-photo-shell">
            <img src={profilePhoto} alt="Mochamad Rizal Fauzan formal portrait" />
          </div>

          <div className="profile-card">
            <span>Portfolio Snapshot</span>
            <h3>AI · Vision · IoT · Research Engineering</h3>
            <p>{profile.current}</p>
            <small>
              <MapPin size={15} aria-hidden="true" />
              {profile.location}
            </small>
          </div>

          <div className="focus-stack">
            {focusAreas.map((card) => (
              <article key={card.title}>
                <strong>{card.title}</strong>
                <span>{card.caption}</span>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <section className="metrics" aria-label="Career metrics">
        {metrics.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>

      <section id="work" className="section">
        <SectionHeader
          eyebrow="Professional Positioning"
          title="Applied AI profile with real engineering depth."
          description="Built for recruiters who need to quickly see academic strength, applied systems capability, measurable impact, and technical ownership."
        />

        <div className="position-grid">
          <article>
            <span>01</span>
            <h3>AI systems that connect research and implementation</h3>
            <p>
              Experience with LLM-based assistants, document retrieval, backend processing,
              user interfaces, and applied AI workflows.
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>Computer vision beyond static experiments</h3>
            <p>
              Project work includes AIoT detection, automated response, real-time alerts,
              and field-oriented monitoring.
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>Electrical engineering foundation</h3>
            <p>
              Strong background in embedded systems, sensors, microcontrollers, IoT,
              power electronics, and control systems.
            </p>
          </article>
        </div>
      </section>

      <section id="case-study" className="section case-section">
        <SectionHeader
          eyebrow="Selected Work"
          title="Projects I built, tested, and brought into real settings."
          description="Pick a project to see what I worked on, how I approached the build, and what came out of it."
        />

        <div className="case-layout">
          <div className="project-list">
            {projects.map((project) => (
              <button
                type="button"
                key={project.id}
                className={`project-selector ${
                  activeProject.id === project.id ? "active" : ""
                }`}
                onMouseEnter={() => setActiveProjectId(project.id)}
                onFocus={() => setActiveProjectId(project.id)}
                onClick={() => setActiveProjectId(project.id)}
                aria-pressed={activeProject.id === project.id}
              >
                <span>{project.label}</span>
                <strong>{project.title}</strong>
                <p>{project.oneLine}</p>
              </button>
            ))}
          </div>

          <article className="case-panel">
            <div className="case-panel-top">
              <span>{activeProject.period}</span>
              <strong>{activeProject.label}</strong>
            </div>

            <h3>{activeProject.title}</h3>
            <p className="case-intro">{activeProject.oneLine}</p>

            <div className="case-blocks">
              <div>
                <span>Problem</span>
                <p>{activeProject.problem}</p>
              </div>

              <div>
                <span>Solution</span>
                <p>{activeProject.solution}</p>
              </div>

              <div>
                <span>Impact</span>
                <p>{activeProject.impact}</p>
              </div>
            </div>

            <div className="case-stack">
              {activeProject.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="case-highlights">
              {activeProject.highlights.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section id="timeline" className="section">
        <SectionHeader
          eyebrow="Timeline"
          title="A visual path across AI research, engineering, and academic excellence."
        />

        <div className="timeline">
          {timeline.map((item, index) => (
            <article className="timeline-item" key={`${item.year}-${item.title}`}>
              <div className="timeline-node">
                <span>{index + 1}</span>
              </div>
              <div className="timeline-content">
                <small>{item.year}</small>
                <h3>{item.title}</h3>
                <strong>{item.organization}</strong>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="proof" className="section proof-section">
        <SectionHeader
          eyebrow="Verified Proof"
          title="Public coverage that backs the engineering story."
          description="Recruiters can verify projects, funding, outreach, and international activity through external university and school publications."
        />

        <div className="proof-layout">
          <aside className="proof-summary" aria-label="Proof summary">
            <article>
              <Newspaper size={22} aria-hidden="true" />
              <strong>9 public references</strong>
              <span>Coverage from UPI, FPTI UPI, and SMAN 6 Cirebon.</span>
            </article>
            <article>
              <Award size={22} aria-hidden="true" />
              <strong>Funded innovation</strong>
              <span>PKM-backed IoT and air-quality project activity.</span>
            </article>
            <article>
              <GraduationCap size={22} aria-hidden="true" />
              <strong>Research visibility</strong>
              <span>Scholar profile plus publication-oriented engineering work.</span>
            </article>
          </aside>

          <div className="media-grid">
            {mediaCoverage.map((item, index) => (
              <a
                className={`media-card ${index === 0 ? "featured" : ""}`}
                href={item.url}
                key={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="media-card-top">
                  <span>{item.tag}</span>
                  <ExternalLink size={16} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="media-meta">
                  <strong>{item.source}</strong>
                  <span>{item.date}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <SectionHeader
          eyebrow="Technical Stack"
          title="Balanced across AI, software, embedded systems, and electrical engineering."
        />

        <div className="skills-grid">
          {skills.map(([group, items]) => (
            <article key={group} className="skill-card">
              <h3>{group}</h3>
              <div>
                {items.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section recognition">
        <SectionHeader
          eyebrow="Recognition"
          title="Awards, certifications, and academic activities."
        />

        <div className="recognition-grid">
          {recognition.map((item) => (
            <article key={item}>{item}</article>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <div>
          <span>Contact</span>
          <h2>Interested in AI research, computer vision, and engineering roles.</h2>
          <p>
            Available for research collaboration, internship applications, and technical
            roles involving applied AI, LLM systems, computer vision, IoT, and
            hardware-software integration.
          </p>
        </div>

        <div className="contact-actions">
          <a href={`mailto:${profile.email}`}>
            <Mail size={18} aria-hidden="true" />
            {profile.email}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            <BriefcaseBusiness size={18} aria-hidden="true" />
            LinkedIn Profile
          </a>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Mochamad Rizal Fauzan</span>
        <span>AI Research · Computer Vision · Electrical Engineering</span>
      </footer>
    </main>
  );
}

export default App;
