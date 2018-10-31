export function btnAnimation () {
  let btn = document.getElementById('btn')
  btn.classList.add('is-active')
  setTimeout(function () {
    btn.classList.remove('is-active')
  }, 2500)

}
