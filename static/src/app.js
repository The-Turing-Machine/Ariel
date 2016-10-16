class Ariel {
  constructor() {
    this.setListeners();
  }
  setListeners() {
  	const screen = document.querySelector('.screen');
    const message = document.querySelector('.message');
    const input = document.querySelector('.message__input');
    const microphone = document.querySelector('.message__speech');
    const container = document.querySelector('.screen__container--listen');

    let selfie = this;

    window.addEventListener('touchstart', (event) => {
      event.preventDefault();

      if (event.target === microphone) {
      	screen.style.cssText = 'background: linear-gradient(#1EC7AC, #3AB8C8)';
        container.style.cssText = 'display: table';
        selfie.getSpeech();
      }
    });

    window.addEventListener('touchend', (event) => {
      event.preventDefault();

      if (event.target === microphone) {
      	screen.style.cssText = 'background: #EBEDF1';
        container.style.cssText = 'display: none';
      }
    
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
    	selfie.sendMessage(event.results[0][0]['transcript']);
      selfie.sendSpeech(event.results[0][0]['transcript']);
    }
    recognition.start();

  }
  sendMessage(msg) {
  	const listNode = document.querySelector('.screen__container--messages');
  	const li = document.createElement("li");

  	li.appendChild(document.createTextNode(msg));

  	listNode.appendChild(li);
  }
  sendSpeech(msg) {
    const json = JSON.stringify({ "response":  msg });
    console.log(json);

    let xhr = new XMLHttpRequest(),
      	url = 'https://127.0.0.1:5000/';

    xhr.open('POST', url, true);

    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    }

    xhr.send(json);
  }
}


(function() {
  var ariel = new Ariel;
})();
