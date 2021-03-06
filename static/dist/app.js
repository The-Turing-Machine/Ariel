'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ariel = function () {
  function Ariel() {
    _classCallCheck(this, Ariel);

    this.setListeners();
    this.getInputValue();
  }

  _createClass(Ariel, [{
    key: 'getInputValue',
    value: function getInputValue() {
      var input = document.querySelector('.message__input');
      var selfie = this;
      window.addEventListener('keydown', function (event) {
        event.preventDefault();

        if (event.keyCode === 13 || event.which === 13) {
          selfie.sendMessage(input.value);
        }
      });
    }
  }, {
    key: 'setListeners',
    value: function setListeners() {
      var _this = this;

      var screen = document.querySelector('.screen');
      var message = document.querySelector('.message');
      var input = document.querySelector('.message__input');
      var microphone = document.querySelector('.message__speech');
      var container = document.querySelector('.screen__container--listen');

      window.addEventListener('touchstart', function (event) {
        event.preventDefault();

        if (event.target === microphone) {
          screen.style.cssText = 'background: linear-gradient(#1EC7AC, #3AB8C8)';
          container.style.cssText = 'display: table';
          _this.getSpeech();
        }
      });

      window.addEventListener('touchend', function (event) {
        event.preventDefault();

        if (event.target === microphone) {
          screen.style.cssText = 'background: #EBEDF1';
          container.style.cssText = 'display: none';
        }
      });
    }
  }, {
    key: 'sendResponse',
    value: function sendResponse(msg) {
      msg = JSON.parse(msg);

      var listNode = document.querySelector('.screen__container--messages');

      msg = msg["data"][0];

      for (var i = 0; i < 4; ++i) {
        var li = document.createElement('LI'),
            img = document.createElement('IMG'),
            a = document.createElement('A'),
            p = document.createElement('P');

        p.innerHTML = msg[i][0];
        a.href = msg[i][1];
        img.src = msg[i][2];

        li.appendChild(img);
        li.appendChild(h3);
        li.appendChild(p);

        ul.appendChild(li);
      }
    }
  }, {
    key: 'getSpeech',
    value: function getSpeech() {
      var speechBubbles = document.querySelectorAll('.screen__container--listen > span');

      speechBubbles[0].style.cssText = 'animation: sound-1 1.4s infinite';
      speechBubbles[1].style.cssText = 'animation: sound-2 1.4s infinite';
      speechBubbles[2].style.cssText = 'animation: sound-1 1.4s infinite';
      speechBubbles[3].style.cssText = 'animation: sound-2 1.4s infinite';

      var recognition = new webkitSpeechRecognition(),
          selfie = this;
      recognition.onresult = function (event) {
        selfie.sendSpeech(event.results[0][0]['transcript']);
      };
      recognition.start();
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(msg) {
      var listNode = document.querySelector('.screen__container--messages');
      var li = document.createElement("li");

      li.appendChild(document.createTextNode(msg));

      listNode.appendChild(li);
    }
  }, {
    key: 'sendSpeech',
    value: function sendSpeech(msg) {
      var json = JSON.stringify({ "response": msg });
      console.log(json);

      var xhr = new XMLHttpRequest(),
          url = 'https://127.0.0.1:5000/',
          selfie = this;


      xhr.open('POST', url, true);

      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          selfie.sendResponse(xhr.responseText);
        }
      };

      xhr.send(json);
    }
  }]);

  return Ariel;
}();

(function () {
  var ariel = new Ariel();
})();
//# sourceMappingURL=app.js.map
