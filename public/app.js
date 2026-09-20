// Sample content. Edit this array to add your own notes and CTF writeups.
const posts = [
  { id: 'trust-issues', type: 'writeup', date: '2026-09-14', title: 'Trust issues: when the JWT lies', description: 'A perfectly valid token. A very wrong assumption. Following the trust boundary all the way to the flag.', tags: ['web', 'jwt', 'authentication'], minutes: 8, featured: true,
    body: `<h3>01 / Start with the assumption</h3><p>In this fictional CTF challenge, the application accepts a signed token and uses its claims to decide which pages a user can access. The interesting question is simple: what exactly does the server trust?</p><p>I split the request path into three steps: parsing the token, verifying its signature, and checking authorization. A successful first step tells us nothing about the other two.</p><pre><code>request → parse → verify signature → authorize
                         ↑
                 the trust boundary</code></pre><h3>02 / Make a map before a payload</h3><p>For each claim, I wrote down its origin and which server-side decision depended on it. Issuer, audience, expiration, and role each answer a different question. None can replace signature verification.</p><blockquote>Decoded is not verified. Verified is not authorized.</blockquote><h3>03 / The useful takeaway</h3><p>The lasting note is a checklist: pin the expected algorithm, verify with a trusted key, validate the expected issuer and audience, and enforce permissions on the server. In a real writeup, this section would include the challenge files, the precise bug, and a reproducible solution.</p>` },
  { id: 'heap-notes', type: 'note', date: '2026-09-09', title: 'The heap is a state of mind', description: 'Making sense of chunks, bins, and the little details that turn a crash into a primitive.', tags: ['pwn', 'heap', 'glibc'], minutes: 6,
    body: `<h3>A notebook, not a universal memory map</h3><p>Allocator behavior depends on the implementation and version. Before drawing conclusions, record the binary architecture, runtime library, and allocator configuration from the challenge environment.</p><pre><code>My debugging loop:
  1. Allocate one object.
  2. Inspect its address and nearby metadata.
  3. Release it.
  4. Inspect again.
  5. Write down what actually changed.</code></pre><h3>Draw the lifetime</h3><p>A small table of allocations, frees, and live references often explains more than a wall of debugger output. I use a different label for an object and its address: the address may get reused, while the original object's lifetime has ended.</p><blockquote>Watch the state change. Don't just memorize the final diagram.</blockquote><h3>Next experiment</h3><p>Repeat the same sequence with several allocation sizes, keeping the runtime fixed. Save the observations next to the commands used to reproduce them.</p>` },
  { id: 'xor', type: 'writeup', date: '2026-09-02', title: 'XOR, rinse, repeat', description: 'A small crypto challenge about repeated keys and why patterns always leave a trace.', tags: ['crypto', 'xor', 'python'], minutes: 5,
    body: `<h3>The repeated-key observation</h3><p>This illustrative challenge uses a repeating XOR key. If two plaintext bytes use the same key byte, XORing their ciphertext bytes cancels that key byte. That relationship gives us a way to test a guess, rather than treating the output as random noise.</p><pre><code>c₁ = p₁ ⊕ k
c₂ = p₂ ⊕ k
c₁ ⊕ c₂ = p₁ ⊕ p₂</code></pre><h3>Keep guesses separate from facts</h3><p>A likely flag prefix is a hypothesis. Derive candidate key bytes from it, apply the candidate across the whole ciphertext, and check whether the result remains consistent. Readable output in one tiny region is not enough.</p><h3>What belongs in the final writeup</h3><p>Include the ciphertext, key-length reasoning, verification script, and the recovered plaintext. This template entry leaves those challenge-specific artifacts for your own solution.</p>` },
  { id: 'browser-boundaries', type: 'note', date: '2026-08-26', title: 'Things the browser remembers', description: 'A field guide to cookies, origins, and the boundaries I keep having to look up.', tags: ['web', 'browser', 'notes'], minutes: 7,
    body: `<h3>Separate the questions</h3><p>When a browser behaves unexpectedly, I first separate storage, request credentials, and whether a script can read a response. These are related concerns, but they are not the same permission check.</p><pre><code>Origin = scheme + host + port

For each request, record:
  initiating page
  destination URL
  credentials sent
  response visible to JavaScript</code></pre><h3>Build a tiny reproduction</h3><p>Two local origins and a single request are easier to reason about than an entire application. Inspect both the network panel and the server logs. A browser hiding a response from JavaScript does not mean the server never received the request.</p><blockquote>Observe the request and the response independently.</blockquote><h3>My working notes</h3><p>Record browser version and the exact cookie attributes alongside each experiment. This keeps a notebook useful when defaults and platform behavior change.</p>` },
  { id: 'strings-attached', type: 'writeup', date: '2026-08-18', title: 'No strings attached. Almost.', description: 'Peeling back a tiny binary, one suspicious function call at a time.', tags: ['reverse', 'binary', 'ghidra'], minutes: 10,
    body: `<h3>First, the boring inventory</h3><p>For this example reversing challenge, the first page of notes records the file format, architecture, imports, and visible strings. These observations guide the investigation without pretending to explain the entire binary.</p><h3>Find the decision</h3><p>Rather than renaming every function, I follow the path from user input to the success or failure message. I label transformations along the way and write down the conditions that control each branch.</p><pre><code>read input
    ↓
transform bytes
    ↓
compare with expected data
    ├── match → success
    └── otherwise → try again</code></pre><h3>Check the hypothesis</h3><p>A decompiler output is a useful interpretation. Verify the critical comparison against the disassembly and a debugger trace. Once the transformation is understood, a small independent implementation can confirm the candidate input.</p>` },
  { id: 'toolbox', type: 'note', date: '2026-08-11', title: 'A smaller toolbox, sharper tools', description: 'My CTF workspace: a terminal, a notebook, and just enough automation to stay curious.', tags: ['workflow', 'tools', 'terminal'], minutes: 4,
    body: `<h3>A directory for every question</h3><p>I start each challenge with a small structure. Original files stay separate from experiments, and a short journal captures the observations that would otherwise disappear into shell history.</p><pre><code>challenge/
├── original/       # provided files
├── scratch/        # experiments
├── solve.py        # reproducible solution
└── notes.md        # observations + dead ends</code></pre><h3>Write down the dead ends</h3><p>Record what you tried, what happened, and why you moved on. A failed approach is valuable when it rules out an assumption. It also saves a teammate from repeating the same experiment.</p><blockquote>The best tool is the one that helps you ask the next precise question.</blockquote><h3>Leave a clean trail</h3><p>Before turning a notebook into a public writeup, rerun the solution from a fresh directory and replace any local paths or credentials. Future you should be able to follow it without guessing.</p>` },
];

let currentFilter = 'all';
let query = '';
const list = document.querySelector('#post-list');
const searchInput = document.querySelector('#search-input');
const searchPanel = document.querySelector('#search-panel');
const reader = document.querySelector('#reader');
let previouslyFocused;
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function renderPosts() {
  const matches = posts.filter(post => (currentFilter === 'all' || post.type === currentFilter) && `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()));
  document.querySelector('#entry-count').textContent = String(matches.length).padStart(2, '0');
  list.innerHTML = matches.map(post => `<a class="post ${post.featured ? 'post-featured' : ''}" href="#post/${encodeURIComponent(post.id)}">
    <div class="post-meta"><span class="post-kind">${escapeHtml(post.type.toUpperCase())}</span><span>·</span><time datetime="${escapeHtml(post.date)}">${escapeHtml(post.date.replaceAll('-', '.'))}</time>${post.featured ? '<span class="featured-label">✳ FEATURED</span>' : ''}</div>
    <h3>${escapeHtml(post.title)}</h3><p>${escapeHtml(post.description)}</p><span class="post-arrow" aria-hidden="true">↗</span>
    <div class="post-tags">${post.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}<span class="post-time">${post.minutes} MIN READ</span></div>
  </a>`).join('');
  if (!matches.length) {
    list.innerHTML = '<div class="empty-state">No signals found.<br>Try another keyword or reset the filters.<br><button id="reset-filters">Show all entries ↗</button></div>';
    document.querySelector('#reset-filters').addEventListener('click', () => { searchInput.value = ''; query = ''; setFilter('all'); });
  }
}

function setFilter(value) {
  currentFilter = value;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === value;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-nav]').forEach(link => link.classList.toggle('active', link.dataset.nav === value));
  renderPosts();
}

function showSearch(show, focus = true) {
  searchPanel.hidden = !show;
  document.querySelector('#search-toggle').setAttribute('aria-expanded', String(show));
  if (show && focus) searchInput.focus();
}

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.querySelectorAll('[data-nav]').forEach(link => link.addEventListener('click', () => { query = ''; searchInput.value = ''; setFilter(link.dataset.nav); }));
document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => {
  query = button.dataset.topic;
  searchInput.value = query;
  setFilter('all');
  showSearch(true, false);
  document.querySelector('#entries').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));
document.querySelector('#search-toggle').addEventListener('click', () => showSearch(searchPanel.hidden));
searchInput.addEventListener('input', () => { query = searchInput.value.trim(); renderPosts(); });
document.querySelector('#clear-search').addEventListener('click', () => { query = ''; searchInput.value = ''; showSearch(false); renderPosts(); document.querySelector('#search-toggle').focus(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !reader.open && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    event.preventDefault(); showSearch(true);
  }
  if (event.key === 'Escape' && !reader.open && !searchPanel.hidden) document.querySelector('#clear-search').click();
});

function openReader(content) {
  document.querySelector('#reader-content').innerHTML = content;
  if (!reader.open) { previouslyFocused = document.activeElement; reader.showModal(); }
  reader.scrollTop = 0;
}

function route() {
  const post = posts.find(item => location.hash === `#post/${encodeURIComponent(item.id)}`);
  if (post) {
    document.title = `${post.title} — NULLBYTE`;
    // body is trusted HTML authored locally, not user-submitted content.
    openReader(`<span class="sample-label">TEMPLATE / SAMPLE ENTRY</span><div class="reader-kicker">${escapeHtml(post.type.toUpperCase())} · ${escapeHtml(post.date)} · ${post.minutes} MIN READ</div><h2 id="reader-title">${escapeHtml(post.title)}</h2><p class="reader-lede">${escapeHtml(post.description)}</p><div class="article-body">${post.body}</div><div class="reader-bottom">END OF TRANSMISSION / ${post.tags.map(tag => '#' + escapeHtml(tag)).join(' ')}<br>This is illustrative template content. Replace it with your own research and challenge solution.</div>`);
  } else if (location.hash === '#about') {
    document.title = 'About — NULLBYTE';
    openReader('<div class="reader-kicker">~/ABOUT ME</div><h2 id="reader-title">Curious by default.</h2><p class="reader-lede">Hey, I’m your_alias. This is my little corner of the internet for things I take apart and things I figure out.</p><div class="article-body"><h3>Why this blog exists</h3><p>CTFs make me ask better questions. Writing makes me check whether I actually understand the answers. This space brings the two together: writeups, unfinished observations, and notes I wish I had a week earlier.</p><h3>What you’ll find here</h3><p>Web exploitation, reversing, cryptography, and the occasional detour into building better tools. Some posts are carefully worked solutions. Others are just a useful idea worth keeping.</p><blockquote>Stay curious. Keep good notes. Share what you learn.</blockquote><h3>About this template</h3><p>NULLBYTE is a minimal personal blog concept. All entries are sample content for previewing the layout. The profile, dates, topics, and articles can be edited to make this space yours.</p></div>');
  } else {
    document.title = 'NULLBYTE — curiosity, dissected.';
    if (reader.open) reader.close();
  }
}

function closeReader() {
  if (location.hash.startsWith('#post/') || location.hash === '#about') history.replaceState(null, '', `${location.pathname}${location.search}#entries`);
  if (reader.open) reader.close();
  document.title = 'NULLBYTE — curiosity, dissected.';
}
document.querySelector('#close-reader').addEventListener('click', closeReader);
reader.addEventListener('cancel', event => { event.preventDefault(); closeReader(); });
reader.addEventListener('close', () => { if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true }); });
reader.addEventListener('click', event => { if (event.target === reader) { const rect = reader.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeReader(); } });
document.querySelectorAll('#about-button, #more-about').forEach(button => button.addEventListener('click', () => { location.hash = 'about'; }));
window.addEventListener('hashchange', route);

const themeButton = document.querySelector('#theme-button');
function setTheme(dark) {
  document.body.classList.toggle('dark', dark);
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#191d17' : '#f3f3eb';
}
try { setTheme(localStorage.getItem('nullbyte-theme') === 'dark'); } catch { /* Storage can be disabled in private browsers. */ }
themeButton.addEventListener('click', () => {
  const dark = !document.body.classList.contains('dark');
  setTheme(dark);
  try { localStorage.setItem('nullbyte-theme', dark ? 'dark' : 'light'); } catch { /* Theme still works without persistence. */ }
});
document.querySelectorAll('[data-filter]').forEach(button => {
  const count = button.dataset.filter === 'all' ? posts.length : posts.filter(post => post.type === button.dataset.filter).length;
  button.querySelector('span').textContent = String(count).padStart(2, '0');
});
renderPosts();
route();
