function renderEmployees (items) {
  return `
    <ul> 
        ${items.reduce((a, i) => (a += `<li>${i.name}</li>`), '')}
    </ul>
  `;
}

export { renderEmployees };
