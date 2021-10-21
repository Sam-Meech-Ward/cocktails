const express = require('express')
const axios = require('axios')
const morgan = require('morgan')

const app = express()
app.set("view engine", "ejs")
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
)

function ingredients(cocktail) {
  let ing = []
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail[`strIngredient${i}`]
    const measure = cocktail[`strMeasure${i}`]
    if (!ingredient) {
      break
    }
    ing.push({
      ingredient, measure
    })
  }
  return ing 
}

function cocktailData(cocktail) {
  return {
    name: cocktail.strDrink,
    glass: cocktail.strGlass,
    instructions: cocktail.strInstructions,
    image: cocktail.strDrinkThumb,
    ingredients: ingredients(cocktail),
  };
}

app.get('/', async (req, res) => {
  try {
  const result = await axios.get(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  )
  const drink = cocktailData(result.data.drinks[0])
  res.render('index.ejs', drink)
  }
  catch (error) {
    console.error(error)
    res.send(error)
  }
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))