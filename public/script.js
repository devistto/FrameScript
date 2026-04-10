const fileInput = document.getElementById('video');
const fileNameInput = document.querySelector('.file-row input[type="text"]');
const selectLang = document.querySelector('select');
const checkboxes = document.querySelectorAll('.checkbox-row input');
const textarea = document.querySelector('textarea');
const submitBtn = document.querySelector('.submit-btn');
const jobsContainer = document.querySelector('.jobs');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    fileNameInput.value = file ? file.name : 'Nenhum arquivo selecionado';
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

        const res = await fetch('http://localhost:8000/videos/subtitles', {
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
        alert('Erro ao enviar');
    }
});

function createJob({ id, name }) {
    const job = document.createElement('div');
    job.classList.add('job-card');
    job.dataset.id = id;

    job.innerHTML = `
        <span>${name.length > 30 ? name.slice(0, 30) + "..." : name}</span>
        <span class="progress">0%</span>
        <button class="cancel-btn">Cancel</button>
    `;

    job.querySelector('.cancel-btn').addEventListener('click', async () => {
        await fetch(`http://localhost:8000/videos/jobs/${id}`, {
            method: 'DELETE'
        });

        job.remove();
    });

    jobsContainer.prepend(job);
}

const jobs = {};

function updateJobProgress(id, progress) {
    const job = document.querySelector(`.job-card[data-id="${id}"]`);
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
    if (progress === 10) target = 49;
    else if (progress === 50) target = 99;
    else target = 100;

    if (state.interval) clearInterval(state.interval);

    if (progress === 100) {
        state.current = 100;
        progressEl.textContent = `100%`;
        return;
    }

    state.interval = setInterval(() => {
        if (state.current >= target) {
            clearInterval(state.interval);
            return;
        }

        state.current++;
        progressEl.textContent = `${state.current}%`;
    }, 300);

    progressEl.textContent = `${state.current}%`;
}

const socket = io("http://localhost:8000");

socket.on("connect", () =>
    console.log("Connection stablished.")
);

socket.on('update', (data) => {
    updateJobProgress(data.id, data.progress)
})