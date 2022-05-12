const template = document.getElementById('todoapp');

const createNewApp = () => {
  return template.content.firstElementChild.cloneNode(true);
}

export const appView = ($target) => {
  const $app = $target.cloneNode(false);
  $app.appendChild(createNewApp());
  return $app;
}