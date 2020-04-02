function renderEmployees (items) {
  return `
    <ul> 
        ${items.reduce((a, i) => (a += `<li>${i.name}</li>`), '')}
    </ul>
  `;
}

function renderEditableEmployee (e, tag) {
  return `
    <li/>
      <span><b>Id: ${e.id}</b> - Name: ${e.name}</span>
      <button id="${e.id}" class="${tag}-btn" type="button">Edit</button>
    </li>
  `;
};

export { renderEmployees, renderEditableEmployee };
