let timeOut = null

document.getElementById('search').addEventListener('input', () => {
  if (timeOut !== null) {
    clearTimeout(timeOut)
  }

  timeOut = setTimeout(() => {
    const searchTerm = document.getElementById('search').value
    startSearch(searchTerm)
    timeOut = null
  }, 1000)
})

function startSearch(searchTerm) {
  const lowerCase = searchTerm.toLowerCase()

  const result = recipes.filter(
    (rec) => rec.name.toLowerCase().search(lowerCase) !== -1
  )

  showRecipes(result)
}

document.getElementById('ingredients').addEventListener('input', (e) => {
  e.preventDefault()

  const inputElement = document.getElementById('ingredients')
  const text = inputElement.value
  const lastChar = text.charAt(text.length - 1)
  const secondLastChar = text.charAt(text.length - 2)

  if (text.length === 1 && text === ' ') {
    inputElement.value = ''
    return
  }

  if (lastChar === ' ' && secondLastChar !== ',') {
    inputElement.value = text.slice(0, -1) + ', '
  }
})

document.getElementById('recipeform').addEventListener('submit', (event) => {
  event.preventDefault()
  const name = document.getElementById('title').value

  // If not title
  if (!name) {
    document.getElementById('title').style.border = '4px solid red'
    document.getElementById('title').placeholder = 'Name is required'
    document.getElementById('title').focus()
    return
  }

  const ingredients = document.getElementById('ingredients').value.split(',')

   // If not ingredients
   if (!ingredients) {
    document.getElementById('ingredients').style.border = '4px solid red'
    document.getElementById('ingredients').placeholder = 'Name is required'
    document.getElementById('ingredients').focus()
    return
  }

  const instructions = document.getElementById('instructions').value

  // If not instructions
  if (!instructions) {
    document.getElementById('instructions').style.border = '4px solid red'
    document.getElementById('instructions').placeholder = 'Name is required'
    document.getElementById('instructions').focus()
    return
  }
  
  const cookingTime = document.getElementById('cookingTime').value

   // If not cookingTime
   if (!cookingTime) {
    document.getElementById('cookingTime').style.border = '4px solid red'
    document.getElementById('cookingTime').placeholder = 'Name is required'
    document.getElementById('cookingTime').focus()
    return
  }

  const difficulty = document.querySelector(
    'input[id = difficulty]:checked'
  ).value

  // add to recipes
  const newRecipe = {
    name,
    ingredients,
    instructions,
    difficulty,
    cookingTime,
  }

  saveRecipe(newRecipe)
})


function saveRecipe(newRecipe) {
  fetch('https://api.api-ninjas.com/v1/randomimage?category=food', {
    headers: {
      'X-Api-Key': 'fL5BnuMItBeJOUjkWAGRUg==mxfBQTdGkx4Aj2m2',
      Accept: 'image/jpg',
    },
  })
    .then((res) => {
      return res.blob()
    })
    .then((blob) => {
      const imgUrl = URL.createObjectURL(blob)
      newRecipe.Image = imgUrl
      recipes.unshift(newRecipe)
      showRecipes(recipes)

      // reset form
      document.getElementById('recipeform').reset()
    })
    .catch((err) => {
      console.error(err)
    })
}

window.startCookingTimer = function () {
  const cookingTimeInput = document.getElementById('cookingTime')
  const cookingTime = cookingTimeInput.value
  let cookingTimer

  if (isNaN(cookingTime) || cookingTime <= 0) {
    alert('Please enter a valid cooking time.')
    return
  }
  document.getElementById('cookingTime').value = ''

  // Set up a new timer
  cookingTimer = setTimeout(() => {
    alert('Cooking time is up! Your dish is ready!')
    document.getElementById('cookingTime').value = ''
  }, cookingTime * 60 * 1000)
}

function showRecipes(recipes) {
  const recipesElement = document.querySelectorAll('[id = recipe_id]')

  if (recipesElement.length) {
    recipesElement.forEach((el) => el.remove())
  }

  recipes.forEach((recipe) => {
    const mainDiv = document.createElement('div')
    mainDiv.setAttribute('id', 'recipe_id')
    mainDiv.classList.add('my-class')

    const title = document.createElement('h2')
    mainDiv.appendChild(title).innerText = recipe.name

    const ingredients = document.createElement('ul')
    const ul = mainDiv.appendChild(ingredients)

    recipe.ingredients.forEach((ingredient) => {
      const li = document.createElement('li')
      ul.appendChild(li).innerText = ingredient
    })

    const instructions = document.createElement('p')
    mainDiv.appendChild(instructions).innerText = recipe.instructions

    const difficulty = document.createElement('span')
    mainDiv.appendChild(difficulty).innerText = recipe.difficulty

    const image = document.createElement('img')
    mainDiv.appendChild(image).src = recipe.Image

    document.getElementById('body').appendChild(mainDiv)
  })
}

showRecipes(recipes)
