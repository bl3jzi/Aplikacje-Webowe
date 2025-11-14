setTimeout(() => {
 console.log('Test JS')
}, 4000)

function aktualizujZegar() {
    const teraz = new Date(); 
    
    let godziny = teraz.getHours();
    let minuty = teraz.getMinutes();
    let sekundy = teraz.getSeconds();

    godziny = godziny < 10 ? '0' + godziny : godziny;
    minuty = minuty < 10 ? '0' + minuty : minuty;
    sekundy = sekundy < 10 ? '0' + sekundy : sekundy;

    const czasSformatowany = `${godziny}:${minuty}:${sekundy}`;
    
    const elementZegara = document.getElementById('zegar-czas');
    if (elementZegara) {
        elementZegara.textContent = czasSformatowany;
    }
}

aktualizujZegar();
setInterval(aktualizujZegar, 1000);


document.addEventListener('DOMContentLoaded', () => {

    
    if (localStorage.getItem('cookieConsentGiven') === 'true') {
        return; 
    }

   
    const cookieBannerHTML = `
        <div id="cookie-consent-banner">
            <p>Ta strona wykorzystuje pliki cookies, aby zapewnić Ci najlepsze doświadczenie. Klikając "Akceptuj", zgadzasz się na ich używanie.</p>
            <button id="cookie-accept-btn" class="button-itself">Akceptuj</button>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);

    const cookieBanner = document.getElementById('cookie-consent-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');

    function giveConsent() {
    
        localStorage.setItem('cookieConsentGiven', 'true');
        
        
        cookieBanner.classList.add('hidden');
        
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.remove();
            }
        }, 600);
    }
    
    acceptBtn.addEventListener('click', giveConsent);
});