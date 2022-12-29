const dataPanel = document.querySelector('#data-panel')
const pagination = document.querySelector('.pagination')


// URL
const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

// general var
const movies = []
let filteredMovies = []
const dataPerPage = 12

// AJSA render movie list
axios.get(INDEX_URL)
  .then(res => {
    const data = res.data.results
    movies.push(...res.data.results)
    renderPaginator(movies.length)
    rednerMovieList(getMovieByPage(1))
  })
  .catch(err => {
    console.log(err)
  })

// 監聽器 點擊動作 掛在data-panel
dataPanel.addEventListener('click', function panelClicked(event) {
 const id = Number(event.target.dataset.id)
 //點到more時 show modal
 if (event.target.matches('.btn-show-modal')) {
  showMovieModal(id)
 }
 
 //點到+號, add to Favorite
 if (event.target.matches('.btn-add-Favorite')) {
  console.log(id)
  addToFavorite(id)
 }
})

//搜尋功能
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')

searchForm.addEventListener('submit', function searchMovie(event){
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))
  renderPaginator(filteredMovies.length)
  rednerMovieList(getMovieByPage(1))
})

//分頁器 監聽器
pagination.addEventListener('click', function onPaginatorClicked(event){
  if (event.target.tagName !== 'A') return
  const page = event.target.dataset.page
  rednerMovieList(getMovieByPage(page))
})


//Function Kit
  //渲染Movie List
  function  rednerMovieList (data){
    
    let rawHTML = ''
    data.forEach(item => {
      rawHTML += `
      <div class="col-sm-3 mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="footer">
          <button href="#" class="btn btn-primary btn-show-modal" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button href="#" class="btn btn-info btn-add-Favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>
      `
    })
    dataPanel.innerHTML = rawHTML
  }
  //跳出movie Modal
  function showMovieModal(id) {
    const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  
  modalTitle.textContent = '' 
  modalImage.src = ''
  modalDate.textContent = ''
  modalDescription.textContent = ''


  axios.get(INDEX_URL + id).then(res =>{
    const data = res.data.results
    modalTitle.textContent = `${data.title}`
    modalDate.textContent = `Release Date: ${data.release_date}`
    modalDescription.textContent = `${data.description}`
    modalImage.src = POSTER_URL + data.image
  })
  }
  //加到最愛
  function addToFavorite(id) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoraites')) || []
    const movie = movies.find(movie => movie.id === id)
    console.log(favoriteMovies)
    if (favoriteMovies.some(movie => movie.id === id)) {
      return alert('加了')
    }
    favoriteMovies.push(movie)
    localStorage.setItem('favoraites', JSON.stringify(favoriteMovies))
  }
  //render分頁器
  function renderPaginator(dataAmount) {
    const pageNumers = Math.ceil(dataAmount / dataPerPage)
    rawHTML=''
    for (let page = 1; page <= pageNumers; page++) {
      rawHTML +=`
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
      `
    }
    pagination.innerHTML = rawHTML
  }

// 依照分頁render movie
function getMovieByPage(page) {
  //movies = movies or filteredMovies

  //如果filteredMovies是有東西的, data就等於filteredMovies
  //如果是沒東西的, data就等於movies
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page-1) * dataPerPage
  //改成回傳data的分割
  return data.slice(startIndex, startIndex + dataPerPage)
}

// Q1.搜尋功能, 監聽器掛在form上的話. 點input bar也會觸發
// 加上有放空白警告, 這樣的話. 點兩下input Bar就會出跳警告耶
// 有辦法掛在 藍色按鈕上嗎