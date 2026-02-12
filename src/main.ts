/**
 * Råtthjälpen Comprehensive Portal Logic
 * Fetches Countries, Handles View Toggling, Autocomplete, and Score Updates
 */

const scriptURL = 'https://script.google.com/macros/s/AKfycbz-ldqxzQVJV9etyGN6zqIvNx2sUhjrPFz93Mu22r3lW7PUC-8hdn7sVXtV3VoCO2bI/exec';

// --- View Navigation Selectors ---
const views = {
    members: document.querySelector('#membershipForm'),
    stats: document.querySelector('#statsForm'),
    board: document.querySelector('#leaderboardView'),
    success: document.querySelector('#successMsg')
};

const navBtns = {
    members: document.querySelector('#viewMembers'),
    stats: document.querySelector('#viewStats'),
    board: document.querySelector('#viewBoard')
};

// --- View Switching Logic ---
function switchView(target: keyof typeof navBtns) {
    Object.values(views).forEach(v => v?.classList.add('hidden'));
    Object.values(navBtns).forEach(b => {
        b?.classList.remove('text-custom', 'border-custom');
        b?.classList.add('text-slate-400', 'border-transparent');
    });

    if (target === 'board') {
        views.board?.classList.remove('hidden');
        refreshLeaderboard();
    } else {
        views[target]?.classList.remove('hidden');
    }

    navBtns[target]?.classList.add('text-custom', 'border-custom');
    navBtns[target]?.classList.remove('text-slate-400', 'border-transparent');
}

navBtns.members?.addEventListener('click', () => switchView('members'));
navBtns.stats?.addEventListener('click', () => switchView('stats'));
navBtns.board?.addEventListener('click', () => switchView('board'));

// --- Leaderboard Fetch ---
async function refreshLeaderboard() {
    const list = document.querySelector('#leaderboardList');
    if (!list) return;
    list.innerHTML = `<div class="py-10 text-center text-slate-400 italic animate-pulse">Fetching the Hall of Fame...</div>`;

    try {
        const res = await fetch(scriptURL);
        const data = await res.json();

        if (data.length === 0) {
            list.innerHTML = `<p class="text-center text-slate-400 py-10">No scores yet!</p>`;
            return;
        }

        list.innerHTML = data.map((p: any, i: number) => `
      <div class="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
        <div class="flex items-center gap-4">
          <span class="flex items-center justify-center w-8 h-8 ${i === 0 ? 'bg-yellow-400 text-white' : 'bg-white text-slate-400'} rounded-full font-black text-xs">
            ${i === 0 ? '👑' : i + 1}
          </span>
          <div>
            <p class="font-bold text-slate-800">${p.name}</p>
            <p class="text-[10px] text-slate-400 uppercase">F: ${p.flappy} | N: ${p.nut} | T: ${p.toss}</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-2xl font-black text-custom leading-none">${p.total}</p>
        </div>
      </div>
    `).join('');
    } catch (e) {
        list.innerHTML = `<p class="text-center text-red-400 py-10">Error loading scores.</p>`;
    }
}

// --- Form Submission Logic ---
const handleSub = async (e: SubmitEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const btn = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    const original = btn.innerText;

    btn.disabled = true;
    btn.innerText = "SYNCING...";

    try {
        await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: new FormData(form) });
        form.classList.add('hidden');
        views.success?.classList.remove('hidden');
    } catch (err) {
        alert("Connection error. Check your Google Script deployment.");
        btn.disabled = false;
        btn.innerText = original;
    }
};

[views.members, views.stats].forEach(f => f?.addEventListener('submit', handleSub as any));