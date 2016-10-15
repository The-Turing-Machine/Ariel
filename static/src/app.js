class Ariel {
  constructor() {
    this.setListeners();
  }
  setListeners() {
    const microphone = document.querySelector('.message__speech');
    const container = document.querySelector('.screen__container--listen');

    window.addEventListener('touchstart', (event) => {
      event.preventDefault();

      if (event.target === microphone) {
        container.style.cssText = 'display: table';
        this.getSpeech();
      }
    });

    window.addEventListener('touchend', (event) => {
      event.preventDefault();

      if (event.target === microphone) {
        container.style.cssText = 'display: none';
      }
    });
  }
  getSpeech() {
    const speechBubbles = document.querySelectorAll('.screen__container--listen > span');

    speechBubbles[0].style.cssText = 'animation: sound-1 1.4s infinite';
    speechBubbles[1].style.cssText = 'animation: sound-2 1.4s infinite';
    speechBubbles[2].style.cssText = 'animation: sound-1 1.4s infinite';
    speechBubbles[3].style.cssText = 'animation: sound-2 1.4s infinite';

    let recognition = new webkitSpeechRecognition(),
    		selfie = this;
    recognition.onresult = function(event) {
      selfie.sendSpeech(event.results[0][0]['transcript']);
    }
    recognition.start();

  }
  sendSpeech(msg) {
    const json = JSON.stringify('{ "response":' + msg + '}');
    console.log(json);

    let xhr = new XMLHttpRequest(),
      url = 'https://10.1.1.142:5000/';

    xhr.open('POST', url, true);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    }

    xhr.send();
  }
}


(function() {
  var ariel = new Ariel;
})();
