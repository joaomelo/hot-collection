function getById (id) {
  return document.getElementById(id);
}

function getAll (selector) {
  return document.querySelectorAll(selector);
}

function resetAllInputs () {
  const inputs = getAll('input');
  inputs.forEach(i => { i.value = ''; });
}

export { getById, getAll, resetAllInputs };
