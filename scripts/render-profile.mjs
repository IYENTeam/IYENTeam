import fs from 'node:fs/promises';

const owner = 'IYENTeam';
const projects = [
  { repo: 'Hent-ai', title: 'HENT-AI', role: 'EMOTION LAYER', desc: 'Intent becomes visible.', icon: '◈' },
  { repo: 'gajae-code', title: 'GAJAE-CODE', role: 'CODING HARNESS', desc: 'Interview. Plan. Execute. Verify.', icon: '⌁' },
  { repo: 'clawhip', title: 'CLAWHIP', role: 'EVENT ROUTER', desc: 'Hooks in. Signals out.', icon: '⌁' },
  { repo: 'oh-my-openagent', title: 'OPENAGENT', role: 'ORCHESTRATOR', desc: 'Specialists in relentless motion.', icon: '◇' },
];

const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const api = async path => {
  try {
    const r = await fetch(`https://api.github.com${path}`, { headers: { 'Accept':'application/vnd.github+json', 'User-Agent':'IYENTeam-profile-renderer' } });
    if (!r.ok) throw new Error(`${r.status}`);
    return await r.json();
  } catch { return null; }
};

await fs.mkdir('assets', { recursive: true });
const repos = await Promise.all(projects.map(async p => ({ ...p, data: await api(`/repos/${owner}/${p.repo}`) })));
const events = (await api(`/users/${owner}/events/public?per_page=12`)) || [];
const now = new Date();
const latest = events.slice(0,5).map(e => ({
  time: new Date(e.created_at).toISOString().slice(5,16).replace('T',' '),
  type: e.type.replace('Event','').toLowerCase(),
  repo: e.repo?.name?.replace(`${owner}/`,'') || 'unknown'
}));
const totalStars = repos.reduce((n,p)=>n+(p.data?.stargazers_count||0),0);

const css = `
  .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
  .label{font-size:11px;letter-spacing:2px;fill:#a76b80}
  .muted{fill:#8d6a77}.white{fill:#fce7f3}.pink{fill:#ff4d8d}.red{fill:#c72c61}
  @keyframes blink{0%,48%{opacity:1}49%,100%{opacity:0}}
  @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
  @keyframes scan{0%{transform:translateY(-30px)}100%{transform:translateY(370px)}}
  @keyframes boot1{0%,8%{opacity:0}10%,100%{opacity:1}}
  @keyframes boot2{0%,22%{opacity:0}24%,100%{opacity:1}}
  @keyframes boot3{0%,36%{opacity:0}38%,100%{opacity:1}}
  @keyframes boot4{0%,50%{opacity:0}52%,100%{opacity:1}}
  @keyframes boot5{0%,64%{opacity:0}66%,100%{opacity:1}}
  @keyframes glow{0%,100%{filter:drop-shadow(0 0 2px #902040)}50%{filter:drop-shadow(0 0 10px #ff4d8d)}}
`;
const shell = (w,h,body,extra='') => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">\n<style>${css}${extra}</style>\n<rect width="100%" height="100%" rx="14" fill="#09090b"/><rect x="1" y="1" width="${w-2}" height="${h-2}" rx="13" fill="none" stroke="#41111f"/>${body}</svg>`;

const hero = shell(900,420,`
<defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#ff4d8d"/><stop offset="1" stop-color="#902040"/></linearGradient></defs>
<circle cx="28" cy="25" r="5" fill="#ff4d8d"/><circle cx="47" cy="25" r="5" fill="#902040"/><circle cx="66" cy="25" r="5" fill="#41111f"/>
<text x="450" y="30" text-anchor="middle" class="mono label">IYEN://AGENT-OS/BOOT</text>
<line x1="0" y1="48" x2="900" y2="48" stroke="#271018"/>
<g class="mono" font-size="15">
 <text x="42" y="88" class="muted" style="animation:boot1 8s infinite">[00:00:01] mounting emotion layer<tspan x="820" class="pink">OK</tspan></text>
 <text x="42" y="121" class="muted" style="animation:boot2 8s infinite">[00:00:02] spawning tmux workers<tspan x="795" class="pink">04 ONLINE</tspan></text>
 <text x="42" y="154" class="muted" style="animation:boot3 8s infinite">[00:00:03] connecting event router<tspan x="820" class="pink">OK</tspan></text>
 <text x="42" y="187" class="muted" style="animation:boot4 8s infinite">[00:00:04] arming verification loop<tspan x="820" class="pink">OK</tspan></text>
 <text x="42" y="220" class="muted" style="animation:boot5 8s infinite">[00:00:05] containing personality<tspan x="788" fill="#ff315f">FAILED</tspan></text>
</g>
<g style="animation:glow 3s ease-in-out infinite">
 <path d="M450 265l20 21 31-4-10 29 17 26-30 6-14 28-24-20-31 3 10-29-17-26 30-6z" fill="none" stroke="url(#g)" stroke-width="2"/>
 <circle cx="450" cy="319" r="12" fill="#ff4d8d"><animate attributeName="r" values="8;14;8" dur="1.8s" repeatCount="indefinite"/></circle>
</g>
<text x="450" y="390" text-anchor="middle" class="mono white" font-size="17" letter-spacing="5">WELCOME, HUMAN<tspan style="animation:blink 1s infinite">_</tspan></text>
<rect x="0" y="48" width="900" height="2" fill="#ff4d8d" opacity=".18" style="animation:scan 5s linear infinite"/>
`);
await fs.writeFile('assets/iyen-bios.svg', hero);

const projectCards = repos.map((p,i) => {
  const x=24+(i%2)*426, y=70+Math.floor(i/2)*150;
  const stars=p.data?.stargazers_count ?? 0, lang=p.data?.language || 'SYSTEM';
  return `<g transform="translate(${x} ${y})">
   <rect width="402" height="126" rx="10" fill="#100b0e" stroke="#41111f"/>
   <rect width="5" height="126" rx="2" fill="${i%2?'#902040':'#ff4d8d'}"/>
   <text x="25" y="28" class="mono label">NODE 0${i+1} // ${esc(p.role)}</text>
   <text x="25" y="59" class="mono white" font-size="21" font-weight="700">${esc(p.title)}</text>
   <text x="25" y="83" class="mono muted" font-size="12">${esc(p.desc)}</text>
   <text x="25" y="108" class="mono pink" font-size="11">${esc(lang.toUpperCase())}  ·  ★ ${stars}  ·  ONLINE</text>
   <circle cx="369" cy="28" r="5" fill="#ff4d8d" style="animation:pulse ${1.8+i*.3}s infinite"/>
  </g>`;
}).join('');
const board = shell(900,390,`
<text x="24" y="31" class="mono label">MISSION CONTROL</text>
<text x="876" y="31" text-anchor="end" class="mono pink" font-size="11">4 AGENTS // ${totalStars} STARS // NOMINAL</text>
${projectCards}
<text x="450" y="371" text-anchor="middle" class="mono muted" font-size="10">CLICK A CONTROL PANEL TO INSPECT THE BUILD</text>
`);
await fs.writeFile('assets/mission-control.svg', board);

const feed = latest.length ? latest : [
 {time:'-- -- --:--',type:'awaiting_signal',repo:'agent-runtime'},
 {time:'-- -- --:--',type:'router_online',repo:'clawhip'}
];
const panes = [
 ['PLANNER','decomposing mission','context locked'],
 ['CODER','implementing runtime','tests armed'],
 ['VERIFIER','checking artifacts','no trust assumed'],
 ['REPORTER','preparing handoff','signal ready']
].map((p,i)=>{const x=24+(i%2)*426,y=65+Math.floor(i/2)*105;return `<g transform="translate(${x} ${y})"><rect width="402" height="82" rx="7" fill="#0d0a0c" stroke="#32121d"/><text x="16" y="22" class="mono pink" font-size="11">${p[0]}@iyen</text><text x="16" y="48" class="mono white" font-size="13">$ ${p[1]}<tspan style="animation:blink 1s infinite">_</tspan></text><text x="16" y="68" class="mono muted" font-size="10">${p[2]} // ACTIVE</text></g>`}).join('');
const log = feed.slice(0,4).map((e,i)=>`<text x="28" y="${310+i*24}" class="mono" font-size="11"><tspan class="muted">${esc(e.time)}</tspan><tspan x="135" class="pink">${esc(e.type)}</tspan><tspan x="300" class="white">→ ${esc(e.repo)}</tspan><tspan x="815" class="muted">ROUTED</tspan></text>`).join('');
const ops = shell(900,410,`
<text x="24" y="31" class="mono label">TMUX ORCHESTRATION // LIVE SIGNAL</text>
<text x="876" y="31" text-anchor="end" class="mono pink" font-size="11">HEARTBEAT ${now.toISOString().slice(0,16).replace('T',' ')} UTC</text>
${panes}
<line x1="24" y1="277" x2="876" y2="277" stroke="#41111f"/>
${log}
`);
await fs.writeFile('assets/agent-ops.svg', ops);
console.log('Rendered IYEN Agent OS assets');
