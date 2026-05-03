import { useState, useEffect, useRef } from "react";

const DATA_POINTS = [
  { id: 1, category: "Identity & Classification", point: "LP legal entity type", rationale: "Determines regulatory constraints, reporting cadence, and commitment capacity (family office vs. pension vs. endowment)" },
  { id: 2, category: "Identity & Classification", point: "Geographic domicile", rationale: "Drives applicable securities law, tax treaty access, and FATCA/FBAR compliance posture" },
  { id: 3, category: "Identity & Classification", point: "AUM or investable assets", rationale: "Anchors realistic commitment size — LPs with <$50M AUM rarely write >$1M checks into first-time managers" },
  { id: 4, category: "Identity & Classification", point: "Accredited/QIB/QP classification", rationale: "Gate condition for fund subscription eligibility under Reg D / 3(c)(7)" },
  { id: 5, category: "Identity & Classification", point: "Beneficial ownership structure", rationale: "Identifies pass-through complexity and UBTI exposure for tax-exempt LPs" },
  { id: 6, category: "Identity & Classification", point: "Primary decision-maker and title", rationale: "Determines who signs the subscription doc — CIO, managing partner, board chair" },
  { id: 7, category: "Identity & Classification", point: "Secondary decision-maker", rationale: "Identifies the internal champion who will shepherd the allocation through IC" },
  { id: 8, category: "Identity & Classification", point: "Investment committee structure", rationale: "Informs how many stakeholders require cultivation and what supporting materials are needed" },
  { id: 9, category: "Identity & Classification", point: "Year of institutional formation", rationale: "Younger institutions are more open to emerging managers; legacy institutions move slower" },
  { id: 10, category: "Identity & Classification", point: "Prior relationship with BGI principals", rationale: "Warm intros convert at 4–7x higher rate than cold outreach in private fund formation" },

  { id: 11, category: "Allocation Mandate", point: "Target private equity allocation %", rationale: "Validates room in portfolio for a new PE commitment" },
  { id: 12, category: "Allocation Mandate", point: "Current deployed PE allocation %", rationale: "LPs over-allocated to PE are near-term non-starters regardless of interest" },
  { id: 13, category: "Allocation Mandate", point: "Vintage year concentration", rationale: "LPs heavy in 2019–2022 vintages may be paused pending distributions" },
  { id: 14, category: "Allocation Mandate", point: "Lower middle market allocation history", rationale: "Direct evidence of appetite for the $25M–$100M EV control buyout strategy" },
  { id: 15, category: "Allocation Mandate", point: "Emerging manager program existence", rationale: "Institutional programs specifically designed for first/second fund managers are highest-probability targets" },
  { id: 16, category: "Allocation Mandate", point: "First-time manager prior investments", rationale: "Historical behavior predicts future behavior — identify LPs who have backed debut funds" },
  { id: 17, category: "Allocation Mandate", point: "Minimum fund size threshold", rationale: "Eliminates LPs with fund size floors that exclude BGI Fund I" },
  { id: 18, category: "Allocation Mandate", point: "Maximum fund size ceiling", rationale: "Some LPs cap at managers raising <$150M — confirms fit" },
  { id: 19, category: "Allocation Mandate", point: "Diversification requirement (max % per fund)", rationale: "Establishes check size ceiling as % of LP’s total PE allocation" },
  { id: 20, category: "Allocation Mandate", point: "Sector restriction list", rationale: "Flags ESG exclusion screens, alcohol/tobacco blocks, or defense restrictions vs. BGI’s Experiential Economy focus" },

  { id: 21, category: "Strategy Alignment", point: "Control buyout strategy fit", rationale: "Core mandate alignment — LP must understand and underwrite control-oriented transactions" },
  { id: 22, category: "Strategy Alignment", point: "Operational value creation thesis receptivity", rationale: "BGI’s Moorish OS model requires LPs who believe professionalization > financial engineering" },
  { id: 23, category: "Strategy Alignment", point: "Experiential Economy sector conviction", rationale: "Consumer, F&B, hospitality, tech-enabled services — LP must have appetite for cyclical sensitivity tradeoff" },
  { id: 24, category: "Strategy Alignment", point: "MENA / Sub-Saharan Africa exposure appetite", rationale: "Cross-border expansion modules require LPs comfortable with emerging market risk overlay" },
  { id: 25, category: "Strategy Alignment", point: "DEI / diverse manager commitment", rationale: "Many public pensions and foundations have mandated diverse GP allocation targets — BGI is a qualifying manager" },
  { id: 26, category: "Strategy Alignment", point: "Impact or governance-oriented mandate", rationale: "Moorish OS governance philosophy aligns with impact LP theses around community wealth and accountability" },
  { id: 27, category: "Strategy Alignment", point: "U.S. lower middle market prior exposure", rationale: "LPs already educated on the LMM segment shorten diligence cycle significantly" },
  { id: 28, category: "Strategy Alignment", point: "Add-on / platform build strategy appetite", rationale: "BGI’s programmatic M&A model requires LP comfort with deployment over buy-and-hold" },
  { id: 29, category: "Strategy Alignment", point: "GP co-investment interest", rationale: "Identifies LPs who want direct deal access — high-value relationship multiplier and fee offset tool" },
  { id: 30, category: "Strategy Alignment", point: "SMA or separately managed account interest", rationale: "Opens door to larger single-LP vehicles if fund formation proves slow" },

  { id: 31, category: "Financial Fit", point: "Target net IRR expectation", rationale: "Validates that LP’s 20–25% net IRR threshold aligns with BGI’s underwriting math" },
  { id: 32, category: "Financial Fit", point: "Target MOIC expectation", rationale: "2.5–3.5x net MOIC target range must match LP’s return hurdle" },
  { id: 33, category: "Financial Fit", point: "Preferred carry / fee structure", rationale: "1.5% / 20% with preferred return is market for LMM — LP must confirm fit" },
  { id: 34, category: "Financial Fit", point: "Liquidity and hold period tolerance", rationale: "5–7 year hold with potential 8-year extension — LP must have long-duration capital capacity" },
  { id: 35, category: "Financial Fit", point: "J-curve tolerance", rationale: "Year 1–3 drag before distributions — institutional LPs are trained; family offices often are not" },
  { id: 36, category: "Financial Fit", point: "Distribution reinvestment preference", rationale: "Some LPs require distributions back vs. recycling — impacts fund deployment model" },
  { id: 37, category: "Financial Fit", point: "Unfunded commitment management capacity", rationale: "Capital call structures require LP treasury to manage drawdowns — not all smaller LPs have infrastructure" },
  { id: 38, category: "Financial Fit", point: "Target commitment size range", rationale: "Anchors capital raise model — need mix of $500K, $1M, $2.5M, $5M commitments" },
  { id: 39, category: "Financial Fit", point: "Prior fund performance benchmarks required", rationale: "First-time funds must substitute GP track record and co-invest history for fund-level IRR data" },
  { id: 40, category: "Financial Fit", point: "Leverage / debt comfort level", rationale: "BGI uses moderate leverage — LP must accept 3–4x EBITDA debt structures in target acquisitions" },

  { id: 41, category: "Process & Timeline", point: "Current capital formation cycle status", rationale: "LPs mid-cycle on other commitments cannot move fast — timing matters for close sequencing" },
  { id: 42, category: "Process & Timeline", point: "Diligence turnaround speed", rationale: "Sophisticated LPs with dedicated PE teams move faster than boards that meet quarterly" },
  { id: 43, category: "Process & Timeline", point: "Reference check protocol", rationale: "Understanding who they call and how many references they require shapes GP relationship management" },
  { id: 44, category: "Process & Timeline", point: "LP DDQ scope and complexity", rationale: "Institutional DDQs require 80–150 question responses — resource planning for fund formation team" },
  { id: 45, category: "Process & Timeline", point: "LPAC participation interest", rationale: "Identifies potential advisory board members — high-influence LPs who become advocates" },
  { id: 46, category: "Process & Timeline", point: "Side letter requirements", rationale: "MFN, fee discounts, co-invest rights, FOIA transparency — scope determines legal complexity at close" },
  { id: 47, category: "Process & Timeline", point: "First close commitment readiness", rationale: "LPs who can commit to first close are highest priority — creates momentum signal for subsequent LPs" },
  { id: 48, category: "Process & Timeline", point: "Board or trustee approval required", rationale: "Multi-layer approval processes require longer lead time — must be in pipeline 6–9 months early" },
  { id: 49, category: "Process & Timeline", point: "Annual vs. quarterly commitment cycle", rationale: "Some institutions only make PE commitments annually — maps LP to target close window" },
  { id: 50, category: "Process & Timeline", point: "Relationship warm-up period needed", rationale: "Best-in-class LPs rarely invest cold — maps cultivation timeline before formal ask" },

  { id: 51, category: "Source & Discovery", point: "Placement agent referral source", rationale: "Identifies which capital introduction channels are producing qualified LP introductions" },
  { id: 52, category: "Source & Discovery", point: "Industry conference attendance history", rationale: "EMPEA, iConnections, Milken, NEXUS — shared event history creates context for warm approach" },
  { id: 53, category: "Source & Discovery", point: "LP database source (Preqin / PitchBook)", rationale: "Validates data freshness and cross-references self-reported LP data against third-party records" },
  { id: 54, category: "Source & Discovery", point: "Form D / regulatory filing cross-reference", rationale: "Public SEC filings confirm prior fund investments and validate LP’s stated activity level" },
  { id: 55, category: "Source & Discovery", point: "LinkedIn connection proximity", rationale: "1st/2nd degree connections through BGI principal network — maps warm intro path" },
  { id: 56, category: "Source & Discovery", point: "Portfolio company relationship overlap", rationale: "LP may already be a customer, vendor, or board member of a BGI target company" },
  { id: 57, category: "Source & Discovery", point: "Alumni / institutional network overlap", rationale: "Shared universities, fraternities, military service, or faith community creates deep affinity signal" },
  { id: 58, category: "Source & Discovery", point: "Diverse manager ecosystem membership", rationale: "NAIC, AAAIM, Robert Toigo Foundation — active members are pre-educated on diverse GP value" },
  { id: 59, category: "Source & Discovery", point: "HBCU endowment or foundation classification", rationale: "BGI’s Moorish OS mission aligns with HBCU institutional mandates around economic sovereignty" },
  { id: 60, category: "Source & Discovery", point: "Community development finance institution tie", rationale: "CDFI-adjacent LPs have governance + community alignment mandates that map directly to BGI thesis" },

  { id: 61, category: "Risk & Compliance", point: "ERISA plan asset status", rationale: "Significant participation by ERISA plans triggers plan asset rules — requires 25% cap or VCOC election" },
  { id: 62, category: "Risk & Compliance", point: "FOIA exposure (public pension)", rationale: "Public pensions are subject to FOIA — determines confidentiality structure and portfolio company disclosure limits" },
  { id: 63, category: "Risk & Compliance", point: "Pay-to-play policy", rationale: "Political contribution restrictions affect GP ability to participate in public pension fundraising" },
  { id: 64, category: "Risk & Compliance", point: "Anti-money laundering / KYC clearance", rationale: "Required for all fund subscriptions — assesses expected diligence burden before solicitation" },
  { id: 65, category: "Risk & Compliance", point: "Sanctioned jurisdiction exposure", rationale: "OFAC screening for MENA-based LPs — mandatory before any engagement" },
  { id: 66, category: "Risk & Compliance", point: "Currency risk tolerance (non-USD LP)", rationale: "MENA and African LPs investing in USD-denominated fund must model FX drag into return expectations" },
  { id: 67, category: "Risk & Compliance", point: "Tax reporting infrastructure (K-1 readiness)", rationale: "Some smaller LPs lack tax preparation capacity for complex partnership K-1s — creates post-close friction" },
  { id: 68, category: "Risk & Compliance", point: "UBTI sensitivity (tax-exempt LP)", rationale: "Debt-financed income generates UBTI — tax-exempt LPs may require blocker entity structures" },
  { id: 69, category: "Risk & Compliance", point: "Prior fund litigation history", rationale: "LPs with active litigation against prior managers create adversarial risk in fund governance" },
  { id: 70, category: "Risk & Compliance", point: "Concentration limit per manager", rationale: "Some LPs cap exposure at 10% of PE allocation per manager — defines hard check size ceiling" },

  { id: 71, category: "LP Archetype Signals", point: "Family office — single family", rationale: "Highest flexibility, fastest decisions, most relationship-driven — priority outreach segment" },
  { id: 72, category: "LP Archetype Signals", point: "Family office — multi-family", rationale: "Pool of accredited capital with institutional process — mid-tier speed, mid-tier flexibility" },
  { id: 73, category: "LP Archetype Signals", point: "HNWI / individual accredited investor", rationale: "Relationship-based commitments, typically $250K–$1M, important for first close momentum" },
  { id: 74, category: "LP Archetype Signals", point: "Public pension fund", rationale: "Largest check sizes but longest timelines — target if emerging manager program exists" },
  { id: 75, category: "LP Archetype Signals", point: "Corporate pension / DB plan", rationale: "Declining pool but still active in PE — ERISA compliance required" },
  { id: 76, category: "LP Archetype Signals", point: "University or college endowment", rationale: "Active in PE allocation; HBCU endowments are mission-aligned with BGI’s community thesis" },
  { id: 77, category: "LP Archetype Signals", point: "Foundation — private", rationale: "Mission-aligned if investing mandate touches governance, economic empowerment, or community" },
  { id: 78, category: "LP Archetype Signals", point: "Foundation — community / public", rationale: "PRI-eligible structures possible — patient capital with impact overlay" },
  { id: 79, category: "LP Archetype Signals", point: "Sovereign wealth fund", rationale: "MENA SWFs are high-priority for BGI’s cross-border thesis — relationship-driven, large check potential" },
  { id: 80, category: "LP Archetype Signals", point: "Fund of funds", rationale: "Diversification-driven, process-oriented — useful for anchoring but typically carry fee-on-fee sensitivity" },

  { id: 81, category: "Relationship Capital", point: "Number of prior touchpoints with BGI team", rationale: "Measures relationship depth — 0 touchpoints = cold, 5+ = warm, 10+ = ready for ask" },
  { id: 82, category: "Relationship Capital", point: "Shared advisory board or board membership", rationale: "Structural overlap creates trust and accountability beyond transactional LP/GP dynamic" },
  { id: 83, category: "Relationship Capital", point: "Operating company customer overlap", rationale: "LP already engaged with BGI’s portfolio ecosystem — converts business relationship to capital relationship" },
  { id: 84, category: "Relationship Capital", point: "Anchor LP introduction source", rationale: "Introductions from anchor LPs carry highest credibility signal for undecided prospects" },
  { id: 85, category: "Relationship Capital", point: "BGI principal personal network depth", rationale: "Maps direct relationship strength between BGI GP and LP decision-maker" },
  { id: 86, category: "Relationship Capital", point: "Referral from operator or portfolio CEO", rationale: "CEO who benefited from BGI governance model becomes highest-credibility GP advocate" },
  { id: 87, category: "Relationship Capital", point: "Shared faith / cultural community affinity", rationale: "BGI’s Moorish OS philosophy has resonance in Muslim, African diaspora, and sovereignty-oriented communities" },
  { id: 88, category: "Relationship Capital", point: "Prior fund investment alongside BGI principals", rationale: "Co-investment history in prior vehicles is the strongest predictor of fund commitment" },
  { id: 89, category: "Relationship Capital", point: "Speaking / media presence as LP signal", rationale: "LPs who publicly discuss PE allocation are signaling openness and providing outreach context" },
  { id: 90, category: "Relationship Capital", point: "Philanthropic or community mission overlap", rationale: "Shared alignment on community wealth building creates multi-dimensional relationship beyond returns" },

  { id: 91, category: "Scoring & Pipeline", point: "BGI mandate fit score (0–100)", rationale: "Composite of strategy, financial, archetype, and compliance fit — primary pipeline prioritization signal" },
  { id: 92, category: "Scoring & Pipeline", point: "Relationship warmth score (0–10)", rationale: "Operationalizes relationship depth into pipeline stage assignment" },
  { id: 93, category: "Scoring & Pipeline", point: "Estimated commitment size", rationale: "Revenue-weighted pipeline model — $500K vs. $5M commitment shapes close sequence" },
  { id: 94, category: "Scoring & Pipeline", point: "Probability of close (%)", rationale: "Bayesian-updated close probability based on engagement signals and prior behavior" },
  { id: 95, category: "Scoring & Pipeline", point: "Target close window (Q)", rationale: "Maps LP to first close, second close, or final close based on process timeline" },
  { id: 96, category: "Scoring & Pipeline", point: "Next action type", rationale: "Specifies exact next step: intro call, DDQ send, reference check, IC deck delivery, legal docs" },
  { id: 97, category: "Scoring & Pipeline", point: "Blocking issues identified", rationale: "Flags known objections: fee sensitivity, first-time manager risk, size, geography — drives response prep" },
  { id: 98, category: "Scoring & Pipeline", point: "Last contact date", rationale: "CRM hygiene — LPs not touched in 60+ days require re-engagement before they go cold" },
  { id: 99, category: "Scoring & Pipeline", point: "Materials delivered to LP", rationale: "Tracks which documents LP has received — teaser, PPM, DDQ, IC deck, reference list" },
  { id: 100, category: "Scoring & Pipeline", point: "LP status label", rationale: "PROSPECT → QUALIFIED → ENGAGED → DILIGENCE → COMMITTED → CLOSED" },
];

const CATEGORIES = [...new Set(DATA_POINTS.map(d => d.category))];

const CAT_COLORS = {
  "Identity & Classification": { bg: "#0f1a2e", accent: "#c9a84c", badge: "#1a2d4a" },
  "Allocation Mandate": { bg: "#0f1a2e", accent: "#e8734a", badge: "#2a1a14" },
  "Strategy Alignment": { bg: "#0f1a2e", accent: "#4a9e8c", badge: "#0f2420" },
  "Financial Fit": { bg: "#0f1a2e", accent: "#8b6cc4", badge: "#1e1530" },
  "Process & Timeline": { bg: "#0f1a2e", accent: "#4a7fc4", badge: "#0f1e38" },
  "Source & Discovery": { bg: "#0f1a2e", accent: "#c4844a", badge: "#2a1c0f" },
  "Risk & Compliance": { bg: "#0f1a2e", accent: "#c44a4a", badge: "#2a0f0f" },
  "LP Archetype Signals": { bg: "#0f1a2e", accent: "#4ac44a", badge: "#0f2a0f" },
  "Relationship Capital": { bg: "#0f1a2e", accent: "#c44a8b", badge: "#2a0f1e" },
  "Scoring & Pipeline": { bg: "#0f1a2e", accent: "#c9a84c", badge: "#2a220a" },
};

const STATUS_COLORS = {
  "PROSPECT": "#4a7fc4",
  "QUALIFIED": "#c9a84c",
  "ENGAGED": "#4a9e8c",
  "DILIGENCE": "#8b6cc4",
  "COMMITTED": "#4ac44a",
  "CLOSED": "#c9a84c",
};

export default function BGILPPilot() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [animIn, setAnimIn] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  const filtered = DATA_POINTS.filter(d => {
    const catMatch = activeCategory === "All" || d.category === activeCategory;
    const searchMatch = search === "" ||
      d.point.toLowerCase().includes(search.toLowerCase()) ||
      d.rationale.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const catCount = (cat) => DATA_POINTS.filter(d => d.category === cat).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070d1a",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#d4c9a8",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Courier+Prime:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070d1a; }
        ::-webkit-scrollbar-thumb { background: #c9a84c44; border-radius: 2px; }

        .header-entry { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .header-entry.in { opacity: 1; transform: translateY(0); }

        .dp-row { transition: background 0.2s, border-color 0.2s; cursor: pointer; }
        .dp-row:hover { background: #0f1e38 !important; }
        .dp-row.expanded { background: #0d1a30 !important; }

        .cat-tab { transition: all 0.18s ease; cursor: pointer; border-bottom: 2px solid transparent; }
        .cat-tab:hover { border-bottom-color: #c9a84c88; }
        .cat-tab.active { border-bottom-color: #c9a84c; }

        input::placeholder { color: #4a5a6a; }
        input:focus { outline: none; }

        .rationale-expand { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .rationale-expand.open { max-height: 120px; }

        .gold-line { position: relative; }
        .gold-line::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 0;
          background: linear-gradient(90deg, #c9a84c, transparent);
          transition: width 1.2s ease;
        }
        .gold-line.in::after { width: 60%; }

        .mono { font-family: 'Courier Prime', monospace; }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid #1a2d4a",
        padding: "48px 40px 36px",
        background: "linear-gradient(180deg, #0a1220 0%, #070d1a 100%)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0,
          width: "400px", height: "400px",
          background: "radial-gradient(circle at center, #c9a84c08 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className={`header-entry ${animIn ? "in" : ""}`} style={{ transitionDelay: "0ms" }}>
          <div className="mono" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#c9a84c88", marginBottom: "16px" }}>
            BGI FUND I — SOVEREIGN CAPITAL INTELLIGENCE LAYER
          </div>
        </div>

        <div className={`header-entry gold-line ${animIn ? "in" : ""}`} style={{ transitionDelay: "120ms", paddingBottom: "20px", marginBottom: "20px" }}>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 300,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
            color: "#e8dcc4",
          }}>
            LP Identification Pilot
            <span style={{ color: "#c9a84c", fontStyle: "italic" }}> — 100 Data Points</span>
          </h1>
        </div>

        <div className={`header-entry ${animIn ? "in" : ""}`} style={{ transitionDelay: "240ms", maxWidth: "680px" }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "17px",
            lineHeight: 1.75,
            color: "#8a9aaa",
            fontStyle: "italic",
          }}>
            A systematic intelligence framework for identifying, qualifying, and converting
            100 limited partners aligned with BGI's control-oriented lower-middle-market mandate.
            Every data point is underwritten to the fund thesis — not generic LP sourcing logic.
          </p>
        </div>

        {/* STATS ROW */}
        <div className={`header-entry ${animIn ? "in" : ""}`} style={{
          transitionDelay: "360ms",
          display: "flex", gap: "32px", marginTop: "32px", flexWrap: "wrap"
        }}>
          {[
            { label: "Data Points", value: "100" },
            { label: "Categories", value: "10" },
            { label: "Target LPs", value: "100" },
            { label: "Pipeline Stages", value: "6" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span className="mono" style={{ fontSize: "28px", fontWeight: 700, color: "#c9a84c", lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#4a5a6a", textTransform: "uppercase" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{
        padding: "36px 40px",
        borderBottom: "1px solid #1a2d4a",
        background: "#08101e",
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "13px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#c9a84c",
          marginBottom: "20px",
        }}>
          System Architecture
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {[
            { step: "01", title: "Ingest", desc: "LP data entered via database, Preqin export, placement agent brief, or Form D scrape" },
            { step: "02", title: "Score", desc: "100-point framework auto-scores mandate fit, relationship warmth, financial alignment, and compliance posture" },
            { step: "03", title: "Prioritize", desc: "Composite score assigns pipeline stage and next action — system surfaces top 20 for immediate outreach" },
            { step: "04", title: "Track", desc: "Every touchpoint, document sent, and commitment signal updates probability and close window estimates" },
            { step: "05", title: "Close", desc: "Agent generates tailored DDQ responses, side letter drafts, and IC deck customizations per LP archetype" },
          ].map(s => (
            <div key={s.step} style={{
              background: "#0f1a2e",
              border: "1px solid #1a2d4a",
              padding: "20px",
              position: "relative",
            }}>
              <div className="mono" style={{ fontSize: "11px", color: "#c9a84c44", marginBottom: "8px" }}>{s.step}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", color: "#e8dcc4", marginBottom: "8px" }}>{s.title}</div>
              <div style={{ fontSize: "13px", color: "#5a6a7a", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{
        padding: "24px 40px",
        borderBottom: "1px solid #1a2d4a",
        background: "#070d1a",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search data points..."
            style={{
              background: "#0f1a2e",
              border: "1px solid #1a2d4a",
              color: "#d4c9a8",
              padding: "8px 16px",
              fontSize: "13px",
              width: "240px",
              fontFamily: "'Courier Prime', monospace",
            }}
          />
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: "none",
                  border: "none",
                  color: activeCategory === cat ? "#c9a84c" : "#4a5a6a",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "4px 8px",
                  cursor: "pointer",
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                {cat === "All" ? `All (100)` : `${cat.split(" ")[0]} (${catCount(cat)})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA POINTS TABLE */}
      <div style={{ padding: "0 40px 60px" }}>
        <div style={{ marginTop: "24px" }}>
          {/* Table Header */}
          <div className="mono" style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr 160px",
            gap: "16px",
            padding: "10px 16px",
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "#2a3a4a",
            textTransform: "uppercase",
            borderBottom: "1px solid #1a2d4a",
          }}>
            <span>#</span>
            <span>Data Point</span>
            <span>Category</span>
          </div>

          {filtered.map((dp, idx) => {
            const colors = CAT_COLORS[dp.category] || CAT_COLORS["Identity & Classification"];
            const isExp = expandedId === dp.id;
            return (
              <div key={dp.id}>
                <div
                  className={`dp-row ${isExp ? "expanded" : ""}`}
                  onClick={() => setExpandedId(isExp ? null : dp.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 160px",
                    gap: "16px",
                    padding: "14px 16px",
                    borderBottom: "1px solid #0f1a2e",
                    background: isExp ? "#0d1a30" : "transparent",
                    alignItems: "start",
                  }}
                >
                  <span className="mono" style={{ fontSize: "11px", color: "#2a3a4a", paddingTop: "2px" }}>
                    {String(dp.id).padStart(3, "0")}
                  </span>
                  <div>
                    <div style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "16px",
                      color: "#d4c9a8",
                      lineHeight: 1.4,
                    }}>
                      {dp.point}
                    </div>
                    <div className={`rationale-expand ${isExp ? "open" : ""}`}>
                      <div style={{
                        fontSize: "13px",
                        color: "#6a7a8a",
                        lineHeight: 1.65,
                        marginTop: "8px",
                        paddingLeft: "12px",
                        borderLeft: `2px solid ${colors.accent}`,
                        fontStyle: "italic",
                      }}>
                        {dp.rationale}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: colors.badge,
                    border: `1px solid ${colors.accent}22`,
                    padding: "3px 8px",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    color: colors.accent,
                    textTransform: "uppercase",
                    fontFamily: "'Courier Prime', monospace",
                    lineHeight: 1.6,
                    alignSelf: "start",
                    marginTop: "2px",
                  }}>
                    {dp.category}
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div style={{
              padding: "60px 16px",
              textAlign: "center",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "18px",
              color: "#2a3a4a",
              fontStyle: "italic",
            }}>
              No data points match your filter.
            </div>
          )}
        </div>
      </div>

      {/* PIPELINE LEGEND */}
      <div style={{
        padding: "36px 40px",
        borderTop: "1px solid #1a2d4a",
        background: "#08101e",
      }}>
        <div className="mono" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#c9a84c88", marginBottom: "20px", textTransform: "uppercase" }}>
          LP Pipeline Status Flow
        </div>
        <div style={{ display: "flex", gap: "0", flexWrap: "wrap" }}>
          {Object.entries(STATUS_COLORS).map(([status, color], i, arr) => (
            <div key={status} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                padding: "8px 20px",
                background: color + "18",
                border: `1px solid ${color}44`,
                borderRight: i < arr.length - 1 ? "none" : `1px solid ${color}44`,
              }}>
                <span className="mono" style={{ fontSize: "11px", color, letterSpacing: "0.12em" }}>
                  {status}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className="mono" style={{ fontSize: "14px", color: "#1a2d4a", padding: "0 2px" }}>→</div>
              )}
            </div>
          ))}
        </div>
        <div style={{
          marginTop: "32px",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "14px",
          color: "#3a4a5a",
          fontStyle: "italic",
          maxWidth: "600px",
          lineHeight: 1.7,
        }}>
          Each of the 100 target LPs receives a composite score derived from these 100 data points.
          The system auto-assigns pipeline stage, next action, and probability of close.
          Memory layer updates score on every engagement — deal flow teaches LP fit, LP behavior teaches deal flow.
        </div>
      </div>
    </div>
  );
}