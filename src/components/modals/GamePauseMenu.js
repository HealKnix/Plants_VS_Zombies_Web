import Menu from '/src/assets/js/Menu'

export function open() {
  document.querySelector('Modal').innerHTML = /*html*/ `
    <div class="pause_menu__wrapper">
      <div class="pause_menu">
        <div class="pause_menu__title">
          <p class="pause_menu__title_text">GAME PAUSED</p>
          <img src="/src/images/zombies/newspaper_zombie.png" width="25%" />
          <p class="pause_menu__title_help">Click to resume game</p>
        </div>
        <div class="pause_menu__button__shadow"></div>
        <button class="pause_menu__button">RESUME GAME</button>
      </div>
    </div>
  `

  document.querySelector('.pause_menu__button').onclick = Menu.closePauseMenu
}

export function close() {
  document.querySelector('Modal').innerHTML = ''
}
