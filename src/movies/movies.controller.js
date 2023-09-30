const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const moviesService = require("./movies.service");

// Validation /:movieId exists
async function movieExists(req, res, next) {
    const { movieId } = req.params;
    const movie = await moviesService.read(movieId)

    if (movie){
        res.locals.movie = movie;
        next();
    } else {
    next({
        status: 404,
        message: "Movie not found."
        });
    };
};

// GET /movies & /movies?is_showing=true
async function list(req, res, next) {
    const data = req.query.is_showing
    ? await moviesService.listNowShowing()
    : await moviesService.list()
    res.json({ data })
}

// GET /movies/:movieId 
async function read(req, res, next) {
    const { movie: data } = res.locals
    res.json({ data })
}



module.exports = { 
    movieExists,
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
};