window.addEventListener('load', () => {             //Evenement lors du chargement complet du navigateur

    const localisation = document.querySelector('.localisation');
    const temperatureActuelle = document.querySelector('.temperature');
    const description = document.querySelector('.description');
    const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const joursDiv = document.querySelectorAll('.joursSem');
    const heure = document.querySelectorAll('.heure');
    const tempsPourHeure = document.querySelectorAll('.tempsPourHeure');
    const loader = document.querySelector('.loader');
    const erreur = document.querySelector('.erreur');

    //Date
    let newDate = new Date();
    let options = {weekday: 'long'};  
    let jourActuel = newDate.toLocaleDateString('fr-FR', options);
    jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);


    //donne les 7 jours de la semaine en fonction du jour actuel
    let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));

    for(i = 0; i < tabJoursEnOrdre.length; i++) {

        joursDiv[i].innerHTML = tabJoursEnOrdre[i].slice(0,3);

    };



    //les heures par tranche de 3

    let heureActuelle = newDate.getHours();
    

    for(j = 0; j < heure.length; j++) {

        // l'heure toute les 3h 
        let hTrue = heureActuelle + j * 3;

        if(hTrue > 24) {
            heure[j].innerHTML = `${hTrue - 24} h`;
        } else if(hTrue === 24){
            heure[j].innerHTML = `0 h`;
        } else {
            heure[j].innerHTML = `${hTrue} h`;
        }

    };



    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {      
            
        
            longi = position.coords.longitude;  
            lati = position.coords.latitude;    

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.darksky.net/forecast/ebe6776ff3e3b504f0a78e6dd7ceabc8/${lati},${longi}?lang=fr`;
            
            fetch(api) 
            .then(reponse => {
                console.log(reponse);

                return reponse.json();  
                                       
            })                         
            .then(data => {
                console.log(data);
                
                const {temperature, summary, icon} = data.currently;          
                description.textContent = summary;
                temperatureActuelle.textContent = `${Math.trunc((temperature - 32) * 5 / 9)}°`;     
                localisation.textContent = data.timezone;

                setIcons(icon, document.querySelector('#icone'));

                //mise en place des icones de previsions
                for(n = 0; n < 7; n++) {
                    setIcons(data.daily.data[n].icon, document.querySelector(`#icone${n+2}`));
                };


                // temperatures toutes les 3h
                for(m = 0; m < tempsPourHeure.length; m++){
                    tempsPourHeure[m].innerHTML = `${Math.trunc((data.hourly.data[m * 3].temperature - 32) * 5 / 9)}°`;
                };

                // cacher l'icone
                // Rajoute la classe hidden
                loader.className += ' hidden';

            });

        }, function(){
            erreur.innerHTML = 'Vous avez refusé la géolocalisation, l\'application ne peut pas fonctionner, veuillez l\'activer.';
        });
    }

    function setIcons(icon, iconID) {

        const skycons = new Skycons({color: 'white'});
        const currentIcon = icon.replace(/-/g, '_').toUpperCase(); 
        skycons.play();

        return skycons.set(iconID, Skycons[currentIcon]);

    }

});

