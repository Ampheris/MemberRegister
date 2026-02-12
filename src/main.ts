const form = document.querySelector<HTMLFormElement>('#membershipForm');
const successMsg = document.querySelector<HTMLDivElement>('#successMsg');
const submitBtn = document.querySelector<HTMLButtonElement>('#submitBtn');

// Replace with your actual Google Deployment URL
const scriptURL = 'https://script.google.com/macros/s/AKfycbz-ldqxzQVJV9etyGN6zqIvNx2sUhjrPFz93Mu22r3lW7PUC-8hdn7sVXtV3VoCO2bI/exec';

form?.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    if (!submitBtn || !form || !successMsg) {
        console.error("Elements missing!");
        return;
    }

    // Loading State
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        </span>
    `;

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            body: new FormData(form)
        });

        if (response.ok) {
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Error!', error);
        alert('Something went wrong. Please check your connection and try again.');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Application';
    }
});