function formatMMSS(clock) {
    const totalSeconds = Math.floor(clock / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const milliseconds = String(Math.floor((clock % 1000) / 100));

    return `${minutes}:${seconds}.${milliseconds}`;
}

function createTimer(spanElement, startedAt = Date.now()) {
    let clock = 0;
    let offset = startedAt;

    function delta() {
        const now = Date.now();
        const d = now - offset;
        offset = now;
        return d;
    }

    const interval = setInterval(() => {
        clock += delta();
        spanElement.textContent = formatMMSS(clock);
    }, 1);

    return () => {
        clearInterval(interval);
    };
}