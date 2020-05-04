function byId (id) {
  return document.getElementById(id);
}

function byName (name) {
  return document.getElementsByName(name);
}

function query (selector) {
  const els = document.querySelectorAll(selector);
  return els;
}

function resetAllTextInputs () {
  const inputs = query('input[type=text]');
  inputs.forEach(i => { i.value = ''; });
}

export { byId, byName, query, resetAllTextInputs };
