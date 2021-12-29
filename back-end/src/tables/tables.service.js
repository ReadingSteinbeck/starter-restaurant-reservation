const knex = require("../db/connection");

//GET
function list() {
  return knex("tables").select("*");
}
function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}
function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

//PUT
function updateReservation(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status });
}

//POST
function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((tables) => tables[0]);
}

//DELETE
function setOccupied(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id, status: "occupied" });
}
function setFree(table_id) {
  return knex("tables")
    .where({ table_id })
    .update({ reservation_id: null, status: "free" });
}

module.exports = {
  list,
  read,
  create,
  updateReservation,
  readReservation,
  setOccupied,
  setFree,
};
