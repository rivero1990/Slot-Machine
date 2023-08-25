const parrafoDevcoins = document.querySelector("#devcoins");
const checkboxInputs = document.querySelectorAll("input[name='cantidad']");
const comprarBoton = document.querySelector("button");
const saldoDevcoins = document.querySelector("#saldo");


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
    let saldoEnPesos = devcoins * 50; 
    saldoDevcoins.textContent = "$ " + saldoEnPesos;
}
