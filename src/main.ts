const countries: string[] = [
    "Sweden", "Norway", "Denmark", "Finland", "Iceland",
    "Germany", "France", "United Kingdom", "USA", "Canada",
    "Australia", "Netherlands", "Belgium", "Switzerland", "Austria"
].sort();

const countryInput = document.querySelector<HTMLInputElement>('#countryInput');
const countryList = document.querySelector<HTMLUListElement>('#countryList');
const form = document.querySelector<HTMLFormElement>('#membershipForm');
const scriptURL = 'YOUR_GOOGLE_WEB_APP_URL_HERE';

// --- Search & Dropdown Logic ---

countryInput?.addEventListener('input', (e) => {
    const val = (e.target as HTMLInputElement).value.toLowerCase();
    if (!countryList) return;

    // Clear previous list
    countryList.innerHTML = '';

    if (val.length > 0) {
        const filtered = countries.filter(c => c.toLowerCase().includes(val));

        if (filtered.length > 0) {
            filtered.forEach(country => {
                const li = document.createElement('li');
                li.className = "px-5 py-3 hover:bg-blue-50 cursor-pointer text-slate-700 transition-colors border-b border-slate-50 last:border-0";
                li.textContent = country;

                // When a country is clicked
                li.onclick = () => {
                    countryInput.value = country;
                    countryList.classList.add('hidden');
                };

                countryList.appendChild(li);
            });
            countryList.classList.remove('hidden');
        } else {
            countryList.classList.add('hidden');
        }
    } else {
        countryList.classList.add('hidden');
    }
});

// Hide dropdown if user clicks outside
document.addEventListener('click', (e) => {
    if (e.target !== countryInput) {
        countryList?.classList.add('hidden');
    }
});

// --- Form Submission Logic ---

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector<HTMLButtonElement>('#submitBtn');
    if (!btn) return;

    btn.disabled = true;
    btn.innerText = "Submitting...";

    try {
        // Note: 'no-cors' is used because Google Apps Script doesn't return CORS headers
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: new FormData(form)
        });

        // Show success message
        form.classList.add('hidden');
        document.querySelector('#successMsg')?.classList.remove('hidden');

    } catch (err) {
        console.error(err);
        alert("There was an error sending your application. Please try again.");
        btn.disabled = false;
        btn.innerText = "Submit Application";
    }
});