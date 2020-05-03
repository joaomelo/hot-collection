function byId (id) {
  return document.getElementById(id);
}

function byName (name) {
  return document.getElementsByName(name);
}

function getAll (selector) {
  return document.querySelectorAll(selector);
}

function resetAllTextInputs () {
  const inputs = getAll('input[type=text]');
  inputs.forEach(i => { i.value = ''; });
}

export { byId, byName, getAll, resetAllTextInputs };
