const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("./theaters.service");

async function list(req, res) {
    const { movieId } = req.params;
    const data = await theatersService.list(movieId);
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
}