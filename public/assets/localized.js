const DESTINATION_URL = 'https://dailysource.online/';

const COPY = {
    PL: ["Ustawienia plików cookie", "Używamy plików cookie, aby zapamiętać Twoje preferencje i ulepszać korzystanie ze strony.", "Akceptuj", "Odrzuć"],
    DE: ["Cookie-Einstellungen", "Wir verwenden Cookies, um Ihre Einstellungen zu speichern und Ihr Nutzungserlebnis zu verbessern.", "Akzeptieren", "Ablehnen"],
    DK: ["Cookieindstillinger", "Vi bruger cookies til at huske dine indstillinger og forbedre din oplevelse.", "Accepter", "Afvis"],
    PT: ["Preferências de cookies", "Utilizamos cookies para guardar as suas preferências e melhorar a sua experiência.", "Aceitar", "Rejeitar"],
    HU: ["Cookie-beállítások", "Cookie-kat használunk a beállítások megjegyzéséhez és a felhasználói élmény javításához.", "Elfogadás", "Elutasítás"],
    IT: ["Preferenze cookie", "Utilizziamo i cookie per ricordare le tue preferenze e migliorare la tua esperienza.", "Accetta", "Rifiuta"],
    AU: ["Cookie preferences", "We use cookies to remember your preferences and improve your experience.", "Accept", "Decline"],
    NO: ["Innstillinger for informasjonskapsler", "Vi bruker informasjonskapsler for å huske innstillingene dine og forbedre opplevelsen.", "Godta", "Avvis"]
};

const MAP = {
    pl: 'PL',
    de: 'DE',
    da: 'DK',
    pt: 'PT',
    hu: 'HU',
    it: 'IT',
    en: 'AU',
    no: 'NO',
    nb: 'NO',
    nn: 'NO'
};

async function detect() {

    // Manual country test
    const q = new URLSearchParams(window.location.search)
        .get('country')
        ?.toUpperCase();

    if (q && COPY[q]) {
        return q;
    }

    // IP detection
    try {
        const response = await fetch('https://ipwho.is/');
        const data = await response.json();

        if (
            data.success &&
            data.country_code &&
            COPY[data.country_code]
        ) {
            return data.country_code;
        }
    } catch (error) {
        console.log('IP detection failed:', error);
    }

    // Browser language fallback
    const lang = (navigator.language || 'en')
        .split('-')[0]
        .toLowerCase();

    return MAP[lang] || 'AU';
}

(async function () {

    const country = await detect();
    const text = COPY[country];

    console.log('Detected country:', country);

    // IMPORTANT FOR BACKGROUND IMAGE
    document.body.setAttribute('data-country', country);

    const titleEl = document.getElementById('title');
    const messageEl = document.getElementById('message');
    const acceptEl = document.getElementById('accept');
    const declineEl = document.getElementById('decline');

    if (titleEl) titleEl.textContent = text[0];
    if (messageEl) messageEl.textContent = text[1];
    if (acceptEl) acceptEl.textContent = text[2];
    if (declineEl) declineEl.textContent = text[3];

    // Buttons
    document.querySelectorAll('[data-choice]').forEach(button => {

        button.addEventListener('click', function () {

            const choice = this.dataset.choice;

            localStorage.setItem(
                'vlabel_cookie_choice',
                choice
            );

            if (DESTINATION_URL && DESTINATION_URL !== '#') {
                window.location.href = DESTINATION_URL;
            }
        });

    });

})();