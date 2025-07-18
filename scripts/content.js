console.log("Hello Friend!")

const observer = new MutationObserver(() => {
    const footerActionsDiv = document.querySelector('[data-testid="composer-footer-actions"]');
    const promptDiv = document.querySelector('#prompt-textarea');


    if (footerActionsDiv && !document.getElementById('my-custom-button')) {

        const improveButton = document.createElement('button');
        improveButton.type = 'button';
        improveButton.id = 'my-custom-button';
        improveButton.className = 'composer-btn';
        improveButton.setAttribute('aria-label', 'promptr-improve');
        improveButton.innerHTML = `
            <span class="ms-1.5 me-0.5">Improve ✨</span>`;
        improveButton.setAttribute('style', `
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 6px 10px;
            background-color: transparent;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;`);

        const ratingTab = document.createElement('button');
        ratingTab.type = 'button';
        ratingTab.id = 'my-custom-button';
        ratingTab.className = 'composer-btn';
        ratingTab.setAttribute('aria-label', 'promptr-rating');
        ratingTab.innerHTML = `
            <span class="ms-1.5 me-0.5">Rating</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="10" cy="10" r="6" />
            </svg>`;
        ratingTab.setAttribute('style', `
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 6px 10px;
            background-color: transparent;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;`);

        improveButton.onclick = () => {
            const paragraphs = promptDiv?.querySelectorAll('p') || [];
            const texts = Array.from(paragraphs).map(p => p.innerText);
            let newPrompt;

            const userPrompt = texts.map(item => item === '\n' ? '' : item).join('\n');

            fetch('http://localhost:8080/improve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: userPrompt
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Response from server:', data['improvedPrompt']);

                    newPrompt = data['improvedPrompt'];
                    const newP = document.createElement('p');
                    newP.innerText = newPrompt;

                    paragraphs.forEach(p => p.remove());
                    promptDiv.appendChild(newP);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
        ratingTab.onclick = () => console.log('Clicked Rating button!');

        footerActionsDiv.appendChild(improveButton);
        footerActionsDiv.appendChild(ratingTab);
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
