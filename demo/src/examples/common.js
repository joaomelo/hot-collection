function renderEmployees (employees, example) {
  return `
    <ul> 
        ${employees.reduce((a, e) => a + renderEmployee(e, example), '')}
    </ul>
  `;
}

function renderEmployee (employee, example = 'read') {
  const justName = employee.name;
  const plusId = `${employee.id}: <b>${justName}</b>`;
  const plusDpto = `<b>${justName}</b> - ${employee.dpto}`;
  const plusDelBtn = `${plusId} <button data-id="${employee.id}" class="${example}-delbtn" type="button">Del</button>`;
  const plusEditBtn = `${plusDpto} <button data-id="${employee.id}" class="${example}-editbtn" type="button">Edit</button>`;

  const examples = {
    read: justName,
    add: plusDpto,
    del: plusDelBtn,
    set: plusEditBtn
  };

  const liHtml = `<li>${examples[example]}</li>`;
  return liHtml;
}

export { renderEmployees };
