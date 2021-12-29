const knex = require("../db/connection");
//GET
function list() {
  return knex("reservations").select("*");
}
function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time", "asc");
}
function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}
//DELETE
function destroy(reservation_id) {
  return knex("reservations").where({ reservation_id }).del();
}
//PUT
function update(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update(updatedReservation, "*")
    .then((reservations) => reservations[0]);
}

function setStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status });
}

//POST
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((reservations) => reservations[0]);
}

module.exports = {
  list,
  listByDate,
  create,
  delete: destroy,
  read,
  update,
  setStatus,
};
