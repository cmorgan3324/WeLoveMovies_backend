const knex = require("../db/connection")

function list(){
    return knex("movies")
    .select("*")
}

function listNowShowing(){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .where("mt.is_showing", true)
    .groupBy("m.movie_id")
    .select("m.*")
}

function listTheatersPlayingMovie(){
    return knex("movies as m")
    .join("movie_theaters as mt", "m.movie_id", "mt.movie_id")
    ,join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where("mt.is_showing", true)
    .groupBy("mt.movie_id")
}
function read(movie_id){
    return knex("movies")
    .where({ movie_id })
    .first();
}


module.exports = {
    list,
    listNowShowing,
    listTheatersPlayingMovie,
    read, 
}