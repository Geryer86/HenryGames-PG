const { Router } = require('express')
const router = Router()
const userRouters = require('../controllers/userRouters')
const friendRouters = require('../controllers/friendRoutes')

//Importar todos los routers


const getVideogames = require('../controllers/getVideogames')
const routesVideogames = require('../controllers/routesVideogames')
const getTags = require ('../controllers/getTags')
const getEsrb = require('../controllers/getEsrb')
const getGenres = require('../controllers/getGenres')

router.use('/videogames', getVideogames)
router.use('/videogames/:id', getVideogames)
router.use('/users', userRouters)
router.use('/videogamesDev', routesVideogames)
router.use('/tags', getTags)
router.use('/esrb', getEsrb)
router.use('/genres', getGenres)
router.use('/friends', friendRouters)

module.exports = router