const { Videogame, Genre } = require('../db')
const { Op } = require("sequelize");
const { Router } = require('express');
const router = Router();
require('dotenv').config();
const axios = require("axios")
const { API_KEY } = process.env
const getAllApiGames = require('../services/services');

//---------Query---------//

router.get('/', async (req, res) => {
  try {
  const testGames = await Videogame.findAll()
  if (!testGames.length) 
  {
    console.log('creando juegos en la base de datos')
    let juego = getAllApiGames()
    let copi = juego
    juego.map((e) => {
      let ftp = e.tags.filter(j => j.name === "Free to Play").length ? true : false
      Videogame.findOrCreate({
        where: {
          id: e.id,
          name: e.name,
          release_date: e.released,
          image: e.background_image,
          description: e.slug,
          rating: e.rating,
          price: ftp ? 0 : ((Math.random() * 10).toFixed(2)),
          on_sale: (Math.random() * 10) < 7 ? false : true,
          free_to_play: ftp,
          short_screenshots: e.short_screenshots.map(s => s.image),
          tags: e.tags.map(t => t.name),
          esrb_rating: e.esrb_rating !== null ? e.esrb_rating.name : "Rating Pending",
          requirements: (e.platforms.map(p => p.platform.name === "PC" && JSON.stringify(p.requirements_en)).filter(b => b != false)),
          contador: 0
        },
      })
    })
    await Promise.all(juego)
    console.log('añadiendo generos a videojuegos')
    let genre = juego.map(e => e.genres.map(g => g.name))
    for (let i = 0; i < copi.length; i++) {
      let genreDb = await Genre.findAll({
        where: {
          name: genre[i]
        }
      });
      Videogame.findByPk(copi[i].id)
        .then(response => response.addGenre(genreDb))
    }
    console.log('Todos los juegos han sido cargados,⭐️ ¡Ya puedes comprar juegos en la tienda! ⭐️')
    let totalData = await Videogame.findAll(
      {
        include: [{
          model: Genre,
          attributes: ["name"],
          through: {
            attributes: []
          }
        }]
      }
    )
    res.send(totalData);
  }
  /////////////////////////////////////////llamado a BD
  else 
  {
    const { name, gen, tag, esrb, limit, page, sort, order } = req.query;

    //let videogames = gen?await Videogame.findAll().filter(e => e.genres.find(e => e.name === gen)):await Videogame.findAll()

    let condition = {}
    let where = {}
    if (name && name.length > 2) {
      where.name = { [Op.iLike]: `${name}%` }
    }
    if (esrb) {
      where.esrb_rating = esrb
    }
    if (tag) {
      where.tags = { [Op.contains]: [tag] }
    }
    condition.where = where;
    limit?condition.limit=limit:!condition.limit;
    page?condition.offset=page:!condition.offset;
    sort&&order?condition.order=[[sort, order]]:!condition.order;
    condition.include = [{
      model: Genre,
      attributes: ["name"],
      through: {
        attributes: [],
      }
    }]

    //let conVideogames = await videogames.findAll(condition)
    //res.send(conVideogames)

    //let videogames = gen?await Videogame.findAll(condition).filter(e => e.genres.find(e => e.name === gen)):await Videogame.findAll(condition)
    //res.send(videogames)

    let videogames = await Videogame.findAll(condition)
    let gameGenre = videogames.filter(e => e.genres.find(e => e.name === gen));
    gen?res.send(gameGenre):res.send(videogames)

    //-A
  }
  // {
  //   const { sort, order } = req.query;
  //   let condition = {}
  //   let where = {}
  //   condition.where = where;
  //   sort&&order?condition.order=[[sort, order]]:!condition.order;
  //   condition.include = {
  //     model: Genre,
  //     attributes: ["name"],
  //     through: {
  //       attributes: [],
  //     }
  //   }
  //   let videogames = await Videogame.findAll(condition)
  //   res.send(videogames)
  // }
} catch (error) {
    console.log("CATCH")
  }
})

//-B

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const videogames = await Videogame.findByPk(id)
    if (videogames.db_created === false) {
      const videogames = await Videogame.findByPk(
        id,
        {
          include: [{
            model: Genre,
            attributes: ['name'],
            through: {
              attributes: [],
            }
          }]
        }
      )
      console.log('cargando descripcion del juego')
      const gameDetail = await axios(`https://api.rawg.io/api/games/${videogames.id}?key=${API_KEY}`);
      videogames.dataValues.description = gameDetail.data.description_raw
      console.log('juego cargado exitosamente')
      res.send(videogames)
    } else {
      const videogames = await Videogame.findByPk(
        id,
        {
          include: [{
            model: Genre,
            attributes: ['name'],
            through: {
              attributes: [],
            }
          }]
        }
      )
      console.log('juego cargado exitosamente')
      res.send(videogames)
    }
  } catch (error) {
    console.log("El juego no se encontro u ocurrio un error!")
  }
})

module.exports = router;

//A- 
    // const { name, page, limit, order, sort } = req.query
    // if (name && (name.length > 2) && !(sort && order)) {
    //   const videogames = await Videogame.findAll({
    //     where: {
    //       name: { [Op.iLike]: `${name}%` },
    //     },
    //     limit: limit,
    //     offset: page,
    //     include: [{
    //       model: Genre,
    //       attributes: ['name'],
    //       through: {
    //         attributes: [],
    //       }
    //     }],
    //   })
    //   res.send(videogames);
    // }
    // else if ((sort && order) && !name) {
    //   const videogames = await Videogame.findAll({
    //     limit: limit, // cantidad de videogames por página
    //     offset: page, // índice del primer videogame que se muestra en la página
    //     order: [[sort, order]], // sort (ordenamiento por) y order (ordenamiento ASC o DESC)
    //     include: [{
    //       model: Genre,
    //       attributes: ['name'],
    //       through: {
    //         attributes: [],
    //       }
    //     }],
    //   })
    //   res.send(videogames);
    // }
    // else if (name && (name.length > 2) && sort && order) {
    //   const videogames = await Videogame.findAll({
    //     where: {
    //       name: { [Op.iLike]: `${name}%` },
    //     },
    //     limit: limit,
    //     offset: page,
    //     order: [[sort, order]],
    //     include: [{
    //       model: Genre,
    //       attributes: ['name'],
    //       through: {
    //         attributes: [],
    //       }
    //     }],
    //   })
    //   res.send(videogames);
    // }
    // else {
    //   const videogames = await Videogame.findAll({
    //     limit: limit || 200,
    //     offset: page,
    //     include: [{
    //       model: Genre,
    //       attributes: ['name'],
    //       through: {
    //         attributes: [],
    //       }
    //     }]
    //   })
    //   res.send(videogames);
    // }

//B-
    // router.get('/filter', async (req, res) => {
    //   try {
    //     const { name, gen, tag, esrb, limit, page, sort, order } = req.query;
    //     let condition = {}
    //     let where = {}
    //     if (name && name.length > 2) {
    //       where.name = { [Op.iLike]: `${name}%` }
    //     }
    //     if (esrb) {
    //       where.esrb_rating = esrb
    //     }
    //     if (tag) {
    //       where.tags = { [Op.contains]: [tag] }
    //     }
    //     condition.where = where;
    //     condition.limit = limit;
    //     page?condition.offset=page:!condition.offset;
    //     sort&&order?condition.order=[[sort, order]]:!condition.order;
    //     condition.include = {
    //       model: Genre,
    //       attributes: ["name"],
    //       through: {
    //         attributes: [],
    //       }
    //     }
    //     let videogames = await Videogame.findAll(condition)
    //     let gameGenre = videogames.filter(e => e.genres.find(e => e.name === gen));
    //     gen?res.send(gameGenre):res.send(videogames)
    //   } catch (error) {
    //     console.log("catch filter")
    //   }
    // })


  // (elena)  const allVideogames = await Videogame.findAll({
  //     // limit: 10,
  //     // offset: 10,
  //     include: [{
  //         model: Genero,
  //         where: {
  //             id: {
  //                 [Op.in]: [3,4],
  //             },
  //         } // conditions
  //     }]
  // });

  // https://www.youtube.com/watch?v=2-LISBTczQE
