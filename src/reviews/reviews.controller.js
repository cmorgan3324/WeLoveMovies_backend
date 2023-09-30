const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reviewsService = require("./reviews.service");
const { addCriticsObject } = require("./reviews.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("content");

// Validation for valid properties 

const VALID_PROPERTIES = ["content", "score", "movie_id", "critic_id"];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// Validation for /:reviewId exists
async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

async function list(req, res) {
    const { movieId } = req.params;
    const data = await reviewsService.list(movieId);
    res.json({ data });
  }

async function read(req, res, next) {
  const { review: data } = res.locals;
  res.json({ data });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  await reviewsService.update(updatedReview);
  const { review_id } = res.locals.review
  const data = await reviewsService.read(review_id);
  const dataWithCriticsObject = await reviewsService.addCriticsObject(data);
  res.json({ data: dataWithCriticsObject });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await reviewsService.delete(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reviewExists), read],
  update: [
    asyncErrorBoundary(reviewExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(update),
    asyncErrorBoundary(addCriticsObject),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};