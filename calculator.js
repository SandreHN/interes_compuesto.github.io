(() => {
  const vaInput = document.getElementById('va-input');
  const rRange = document.getElementById('r-range');
  const rNumber = document.getElementById('r-number');
  const nRange = document.getElementById('n-range');
  const nNumber = document.getElementById('n-number');

  const vaError = document.getElementById('va-error');
  const rError = document.getElementById('r-error');
  const nError = document.getElementById('n-error');

  const resultDiv = document.getElementById('result');
  const formulaDisplay = document.getElementById('formula-display');

  function validateInput(input, min, max, isInteger = false) {
    const val = input.value.trim();
    if (val === '') return { valid: false, message: 'Campo requerido' };
    let num = isInteger ? parseInt(val, 10) : parseFloat(val);
    if (isNaN(num)) return { valid: false, message: 'Debe ser un número válido' };
    if (num < min || num > max) return { valid: false, message: `Debe ser entre ${min} y ${max}` };
    return { valid: true, value: num };
  }

  function syncInputs(source, target) {
    target.value = source.value;
  }

  rRange.addEventListener('input', () => {
    syncInputs(rRange, rNumber);
    calculateVF();
  });
  rNumber.addEventListener('input', () => {
    let val = parseFloat(rNumber.value);
    if (isNaN(val)) return;
    val = Math.min(Math.max(val, 0), 1);
    rNumber.value = val.toFixed(3);
    syncInputs(rNumber, rRange);
    calculateVF();
  });

  nRange.addEventListener('input', () => {
    syncInputs(nRange, nNumber);
    calculateVF();
  });
  nNumber.addEventListener('input', () => {
    let val = parseInt(nNumber.value, 10);
    if (isNaN(val)) return;
    val = Math.min(Math.max(val, 0), 100);
    nNumber.value = val;
    syncInputs(nNumber, nRange);
    calculateVF();
  });

  vaInput.addEventListener('input', () => {
    calculateVF();
  });

  function clearErrors() {
    vaError.textContent = '';
    rError.textContent = '';
    nError.textContent = '';
  }

  function calculateVF() {
    clearErrors();
    const vaVal = validateInput(vaInput, 0, Infinity);
    const rVal = validateInput(rNumber, 0, 1);
    const nVal = validateInput(nNumber, 0, 100, true);

    if (!vaVal.valid) {
      vaError.textContent = vaVal.message;
      updateResultText('Por favor corrige los errores.');
      return;
    }
    if (!rVal.valid) {
      rError.textContent = rVal.message;
      updateResultText('Por favor corrige los errores.');
      return;
    }
    if (!nVal.valid) {
      nError.textContent = nVal.message;
      updateResultText('Por favor corrige los errores.');
      return;
    }

    const VA = vaVal.value;
    const r = rVal.value;
    const n = nVal.value;

    const VF = VA * Math.pow(1 + r, n);

    updateResultText(
      `Valor Futuro (VF): $${VF.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })} MXN`
    );

    formulaDisplay.textContent = `Cálculo: $${VA.toLocaleString('es-MX')} × (1 + ${r.toFixed(3)})^${n}`;
  }

  function updateResultText(text) {
    resultDiv.textContent = text;
  }

  // Initial calculation on load
  calculateVF();
})();
