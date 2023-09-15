const paragraphDevcoins = document.querySelector("#devcoins");
const checkboxInputs = document.querySelectorAll("input[name='cantidad']");
const buyBoton = document.querySelector("button");
const balanceDevcoins = document.querySelector("#saldo");
const reels = document.querySelectorAll(".reel");
const botonSlot = document.querySelector("#boton-slot");
const doors = document.querySelectorAll('.door');
const profitsElement = document.querySelector("#ganancias");

const FIRST_MINOR = 750;
const JACKPOT = 4500;

let profits = 0;

function actualizarCantidadMonedas() {
  
  let totalDevcoins = 0;

  checkboxInputs.forEach(function (checkbox) {
    if (checkbox.checked) {
      totalDevcoins = parseInt(checkbox.value);
    }
  });

  if (totalDevcoins > 0) {
    checkboxInputs.forEach(function (checkbox) {
      checkbox.disabled = true;
    });

    buyBoton.disabled = true;

    paragraphDevcoins.textContent = totalDevcoins;
    actualizarCantidadSaldo(totalDevcoins);
  }
}


function actualizarCantidadSaldo(devcoins) {
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

  async function spin() {
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
        document.getElementById("ganancias").textContent = "$ " + profits.toFixed(2);
      }
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
  
  if (parseInt(paragraphDevcoins.textContent) === 0) {
    checkboxInputs.forEach(function (checkbox) {
      checkbox.disabled = false; 
    });
    buyBoton.disabled = false; 
  }
}



















































