const parrafoDevcoins = document.querySelector("#devcoins");
const checkboxInputs = document.querySelectorAll("input[name='cantidad']");
const comprarBoton = document.querySelector("button");
const saldoDevcoins = document.querySelector("#saldo");
const reels = document.querySelectorAll(".reel");
const botonSlot = document.querySelector("#boton-slot");
const doors = document.querySelectorAll('.door');


function actualizarCantidadMonedas() {
    let totalDevcoins = 0;

    checkboxInputs.forEach(function(checkbox) {
        if (checkbox.checked) {
            totalDevcoins = parseInt(checkbox.value);

            checkboxInputs.forEach(function(checkbox) {
                checkbox.disabled = true; 
            });
        }
    });

    parrafoDevcoins.textContent = totalDevcoins;
    actualizarCantidadSaldo(totalDevcoins);
}

function actualizarCantidadSaldo(devcoins) {
    saldoEnPesos = devcoins * 50; 
    saldoDevcoins.textContent = "$ " + saldoEnPesos;
}

(function () {
    const items = [
      '🍎',
      '🍒',
      '🦁',
      '🍊',
      '7️⃣',
      '🐘',
      '🍋',
      '🐴',
      '🍇',
      '💎',
      '🍦',
    ];
    
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
  const devcoins = parseInt(parrafoDevcoins.textContent);
  const saldoActual = parseFloat(saldoDevcoins.textContent.replace('$ ', ''));

  if (devcoins > 0) {
    init(false, 1, 2);

    for (const door of doors) {
      const boxes = door.querySelector('.boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = 'translateY(0)';
      await new Promise((resolve) => setTimeout(resolve, duration * 100));
    }

    // Restar una Devcoin y $50 del saldo
    parrafoDevcoins.textContent = devcoins - 1;
    saldoDevcoins.textContent = "$ " + (saldoActual - 50).toFixed(2);
    
    setTimeout(init, 3000);
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



  
































