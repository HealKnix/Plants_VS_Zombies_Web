import { rel } from '/src/models/Relation'

let showCoinbankTimeout = null

export const coinbank = rel(0, '', value => {
  clearTimeout(showCoinbankTimeout)
  document.querySelector('.coinbank__value').innerText = '$' + value
  document.querySelector('.coinbank').style.bottom = '0'
  showCoinbankTimeout = setTimeout(() => {
    document.querySelector('.coinbank').style.bottom = '-6vh'
  }, 3500)
})
