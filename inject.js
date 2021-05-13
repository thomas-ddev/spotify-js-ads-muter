// Fix service worker issue
if (document.getElementById("browser-support-notice")) {
	navigator.serviceWorker.getRegistration().then(function (r) { r.unregister(); document.location.reload() });
}

window.addEventListener('load', function () {
    setTimeout(function() {
        // Show UD branding
        var img = new Image();
        img.src = 'https://www.culte-du-code.fr/wp-content/uploads/2020/12/unethical_division.png';
        img.width = 36;
        img.style = "margin-left: 15px;";

        img.onclick = function() {
             window.open('https://www.unethical-division.com', '_blank').focus();
        };

        var elements = document.querySelectorAll('.logo');

        Array.from(elements).forEach((element, index) => {
            element.appendChild(img);
        });
        
        Notification.requestPermission( function(status) {
            if(status === "granted") {
                var previousTitle = "";

                setInterval(function() {
                    var newTitle = document.querySelectorAll('[data-testid=nowplaying-track-link]')[0]['text'];
                    var newSubtitle = document.querySelectorAll('.Root__now-playing-bar > footer:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1) > span:nth-child(1) > a:nth-child(1)')[0]['text'];
                    var newCover = document.querySelectorAll('.cover-art-image')[0]['src'];

                    if(newTitle !== previousTitle) {
                        new Notification(newTitle, {
                            body: newSubtitle,
                            icon: newCover,
                        });
                        
                        previousTitle = newTitle;
                    }
                }, 2000);
            }
        });

        !async function () {
            async function queryAsync(query) {
                return new Promise(resolve => {
                    const interval = setInterval(() => {
                        const element = document.querySelector(query);
                        if (element) {
                            clearInterval(interval);
                            return resolve(element);
                        }
                    }, 250);
                });
            }

            const nowPlayingBar = await queryAsync('.Root__now-playing-bar');
            const volumeButton = await queryAsync('button.volume-bar__icon-button');
            const adQuerySelector = '.Root__now-playing-bar *[data-testid=track-info-advertiser]';

            let playInterval;
            new MutationObserver(() => {
                if (document.querySelector(adQuerySelector) &&
                    volumeButton.attributes['aria-label'].value.indexOf('Activer le son') == -1) {
                    volumeButton.click();
                
                    if (!playInterval) {
                        playInterval = setInterval(() => {
                            if (!document.querySelector(adQuerySelector)) {
                                clearInterval(playInterval);
                                playInterval = null;
                                volumeButton.click();
                            }
                        }, 500);
                    }
                }
            }).observe(nowPlayingBar, {
                characterData: true,
                childList: true,
                attributes: true,
                subtree: true
            });

            const style = document.createElement('style');
            style.innerHTML = `
                [aria-label="Passer à Premium"],
                body > div:not(#main) {
                    display: none !important;
                }
            `;

            document.body.appendChild(style);

            var elements = document.querySelectorAll('.Root__nav-bar div div div a span');

            Array.from(elements).forEach((element, index) => {
                if(element.innerText === "Installer l'appli") {
                    element.parentNode.style.display = "none"
                }
            });
        }();
    }, 10000);
});
