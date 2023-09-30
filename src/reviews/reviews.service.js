// const { KnexTimeoutError } = require("knex");
// const { select } = require("../db/connection");
const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

// mapProperties function configuration
const addCritic = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

// helper function -- adds a Critics object to list results
function addCriticsObject(review) {
    return knex("reviews as r")
      .select("*")
      .join("critics as c", "c.critic_id", "r.critic_id")
      .where({ "r.review_id": review.review_id })
      .first()
      .then(addCritic);
  }
  function list(movie_id) {
      return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({ movie_id })
      .then((data) => {
          return data.map((item) => {
              return addCritic(item)
          })
      })
  }

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview);
}

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  list,
  read,
  update,
  delete: destroy,
  addCriticsObject,
};