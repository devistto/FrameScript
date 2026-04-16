const fileInput = document.getElementById('video');
const fileNameInput = document.querySelector('.file-row input[type="text"]');
const selectLang = document.querySelector('select');
const checkboxes = document.querySelectorAll('.checkbox-row input');
const textarea = document.querySelector('textarea');
const submitBtn = document.querySelector('.submit-btn');
const jobsContainer = document.querySelector('.jobs');

const baseUrl = "http://localhost:8000";

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileNameInput.value = file ? file.name : 'No file selected.';
});

submitBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (!file) {
        alert('Selecione um arquivo');
        return;
    }

    const language = selectLang.value;
    const translate = checkboxes[0].checked ? true : false;
    const vadFilter = checkboxes[1].checked ? true : false;
    const prompt = textarea.value;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('lang', language);
    formData.append('translate', translate);
    formData.append('vad_filter', vadFilter);
    formData.append('initial_prompt', prompt);

    try {

        const res = await fetch(`${baseUrl}/videos/subtitles`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        createJob({
            id: data.jobId,
            name: file.name
        });

    } catch (err) {
        console.error(err);
        alert('Faield. Couldn`t send form.');
    }
});

function createJob({ id, name }) {
    const job = document.createElement('div');
    job.classList.add('job-card');
    job.dataset.id = id;

    job.innerHTML = `
        <div class="progress-bar"></div>
        <span>${name.length > 30 ? name.slice(0, 30) + "..." : name}</span>
        <span class="progress">0%</span>
        <button class="cancel-btn">cancel</button>
    `;

    job.querySelector('.cancel-btn').addEventListener('click', async (e) => {
        if (e.target.dataset.disabled === "true") return;

        await fetch(`${baseUrl}/videos/jobs/${id}`, {
            method: 'DELETE'
        });

        job.remove();
    });

    jobsContainer.prepend(job);
}

const jobs = {};

function updateJobProgress(id, progress) {
    const job = document.querySelector(`.job-card[data-id="${id}"]`);
    const bar = job.querySelector('.progress-bar');

    if (!job) return;

    const progressEl = job.querySelector('.progress');

    if (!jobs[id]) {
        jobs[id] = {
            current: 0,
            interval: null
        };
    }

    const state = jobs[id];

    if (state.current < progress) state.current = progress;

    let target;

    const map = { 0: 9, 10: 49, 50: 99 };

    target = map[progress] ?? 100;

    if (state.interval) clearInterval(state.interval);

    if (progress === 100) {
        state.current = 100;
        progressEl.textContent = `100%`;
        bar.style.width = `${state.current}%`;


        const btn = job.querySelector('.cancel-btn');

        if (btn) {
            btn.textContent = 'Save';
            btn.classList.remove('cancel-btn');
            btn.classList.add('save-btn');

            btn.dataset.disabled = "false";
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            btn.style.pointerEvents = "auto";

            const newBtn = btn.cloneNode(true);
            btn.replaceWith(newBtn);

            newBtn.addEventListener('click', () => {
                window.open(`${baseUrl}/videos/jobs/${id}`);

                job.remove();
            });
        }

        return;
    }

    state.interval = setInterval(() => {
        if (state.current >= target) {
            clearInterval(state.interval);
            return;
        }

        state.current++;
        console.log(state.current)
        progressEl.textContent = `${state.current}%`;
        bar.style.width = `${state.current}%`;
    }, 300);

    progressEl.textContent = `${state.current}%`;

    if (progress >= 50) {
        const btn = job.querySelector('.cancel-btn');

        btn.style.opacity = "0.6";
        btn.style.cursor = "none";
        btn.style.pointerEvents = "none";
        btn.dataset.disabled = "true";
    }
}

const socket = io(baseUrl);

socket.on("connect", () =>
    console.log("Connection stablished.")
);
socket.on('progress', (data) => {
    updateJobProgress(data.id, data.progress)
})