const paragraphDevcoins = document.querySelector("#devcoins");
const radioInputs = document.querySelectorAll("input[name='cantidad']");
const buyButton = document.querySelector("button");
const balanceDevcoins = document.querySelector("#balance");
const reels = document.querySelectorAll(".reel");
const botonSlot = document.querySelector("#spinner");
const doors = document.querySelectorAll('.door');
const profitsElement = document.querySelector("#profits");
const exitButton = document.querySelector("#button-leave");

const FIRST_MINOR = 750;
const JACKPOT = 4500;

let profits = 0;
let devcoins = 0;
let saldoActual = 0;

function saveDataToLocalStorage() {
  localStorage.setItem('balance', saldoActual);
  localStorage.setItem('devcoins', devcoins);
  localStorage.setItem('profits', profits);
}

function loadDataFromLocalStorage() {
  saldoActual = parseFloat(localStorage.getItem('balance')) || saldoActual;
  devcoins = parseInt(localStorage.getItem('devcoins')) || devcoins;
  profits = parseFloat(localStorage.getItem('profits')) || profits;
}


loadDataFromLocalStorage();


function updateCoins() {

  let totalDevcoins = 0;

  radioInputs.forEach(function (radio) {
    if (radio.checked) {
      totalDevcoins = parseInt(radio.value);
    }
  });

  if (totalDevcoins > 0) {
    radioInputs.forEach(function (radio) {
      radio.disabled = true;
    });

    buyButton.disabled = true;

    paragraphDevcoins.textContent = totalDevcoins;
    updateBalance(totalDevcoins);
  }
}


function updateBalance(devcoins) {
  saldoEnPesos = devcoins * 50;
  balanceDevcoins.textContent = "$ " + saldoEnPesos;
}

(function () {
  
  const items = ["🍎", "🍒", "🦁", "🍊", "🐘", "🍋", "🐴", "💎", "🍦", "🐒", "🦒", "🍐", "🍌", "🐊", "🍕"];

  document.querySelector('#spinner').addEventListener('click', spin);

  function init(firstInit = true, groups = 3, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('.boxes');
      const boxesClone = boxes.cloneNode(false);
      const pool = [];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 3); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          'transitionstart',
          function () {
            door.dataset.spinned = '1';
            this.querySelectorAll('.box').forEach((box) => {
              box.style.filter = 'blur(1px)';
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          'transitionend',
          function () {
            this.querySelectorAll('.box').forEach((box, index) => {
              box.style.filter = 'blur(0)';
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.style.width = door.clientWidth + 'px';
        box.style.height = door.clientHeight + 'px';
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)}px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  function disableSpinButton() {
    botonSlot.disabled = true; 
  }
  
  
  function enableButtonSpin() {
    botonSlot.disabled = false; 
  }

  async function spin() {

    disableSpinButton();

    let devcoins = parseInt(paragraphDevcoins.textContent);
    let saldoActual = parseFloat(balanceDevcoins.textContent.replace('$ ', ''));
    let premio = 0;

    if (devcoins > 0) {
      for (const door of doors) {
        door.dataset.spinned = '0';
      }

      init(false, 1, 2);

      for (const door of doors) {
        let boxes = door.querySelector('.boxes');
        let duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = 'translateY(0)';
        await new Promise((resolve) => setTimeout(resolve, duration * 100));
      }

      paragraphDevcoins.textContent = devcoins - 1;
      saldoActual -= 50;
      balanceDevcoins.textContent = "$ " + saldoActual.toFixed(2);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      let symbols = [
        doors[0].querySelector('.box').textContent.trim(),
        doors[1].querySelector('.box').textContent.trim(),
        doors[2].querySelector('.box').textContent.trim()
      ];

      if (symbols[0] === symbols[1] && symbols[0] === symbols[2]) {
        premio = JACKPOT;
      } else if (symbols[0] === symbols[1] || symbols[0] === symbols[2] || symbols[1] === symbols[2]) {
        premio = FIRST_MINOR;
      }

      if (premio > 0) {
        profits += premio;
        saldoActual += premio;
        balanceDevcoins.textContent = "$ " + saldoActual.toFixed(2);
        document.getElementById("profits").textContent = "$ " + profits.toFixed(2);
      }

      enableButtonSpin();
    }
  }

  
  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
})();


function continueGame() {
  
  let saldoActual = parseFloat(balanceDevcoins.textContent.replace('$ ', ''));

  if (saldoActual >= 50) {
    radioInputs.forEach(function (radio) {
      radio.disabled = false;
    });
    buyButton.disabled = false;

    buyButton.addEventListener("click", function () {
      
      let cantidadDevcoins = parseInt(paragraphDevcoins.textContent);
      let costoDevcoins = cantidadDevcoins * 50; 

      if (saldoActual >= costoDevcoins) {
        saldoActual -= costoDevcoins;

        balanceDevcoins.textContent = "$ " + saldoActual.toFixed(2);

        profits = 0;

        profitsElement.textContent = "$ " + profits.toFixed(2);

        devcoins = cantidadDevcoins;

        paragraphDevcoins.textContent = devcoins;

        radioInputs.forEach(function (radio) {
          radio.disabled = true;
        });
        buyButton.disabled = true;
        botonSlot.disabled = true; 
        botonSlot.disabled = false;
      } 
    });
  }
}

exitButton.addEventListener("click", function () {
  window.location.reload();
});


window.addEventListener('beforeunload', function () {
  saveDataToLocalStorage();
});































































