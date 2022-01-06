const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasRequiredPropertiesUpdate = hasProperties("reservation_id");
//Middleware
async function tableExists(req, res, next) {
  const table = await tablesService.read(req.params.tableId);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${req.params.tableId} cannotbe found.`,
  });
}

function tableNameValidator(req, res, next) {
  const { data = {} } = req.body;
  const { table_name } = data;
  if (table_name.length > 1) {
    return next();
  }
  next({
    status: 400,
    message: `The table_name property must be greater than one character`,
  });
}

function capacityIsANumber(req, res, next) {
  const { data = {} } = req.body;
  const { capacity } = data;
  if (Number.isInteger(capacity)) {
    return next();
  }
  next({
    status: 400,
    message: `The capacity property must be a postive number.`,
  });
}
async function reservationExists(req, res, next) {
  const { data = {} } = req.body;
  const reservation = await tablesService.readReservation(data.reservation_id);
  if (reservation) {
    if (reservation.status !== "seated") {
      res.locals.reservation = reservation;
      return next();
    }
    next({
      status: 400,
      message: `Cannot change status property of a seated reservation.`,
    });
  }
  next({
    status: 404,
    message: `Reservation Id ${data.reservation_id} does not exist`,
  });
}

function capacityCheck(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;
  if (people <= capacity) {
    return next();
  }
  next({
    status: 400,
    message: `Table does not have sufficient capacity`,
  });
}

function occupiedCheckUpdate(req, res, next) {
  const { status } = res.locals.table;

  if (status !== "free") {
    return next({ status: 400, message: `This table is occupied.` });
  }
  next();
}
function notOccupiedCheckDelete(req, res, next) {
  const { status } = res.locals.table;

  if (status !== "occupied") {
    return next({
      status: 400,
      message: `Cannot delete a table that is not occupied.`,
    });
  }
  next();
}

//HTTP Verbs
async function list(req, res) {
  res.json({
    data: await tablesService.list(),
  });
}

function read(req, res) {
  const { table: data } = res.locals;
  res.json({ data });
}

async function create(req, res) {
  req.body.data.status = !req.body.data.reservation_id ? "free" : "occupied";
  res.status(201).json({ data: await tablesService.create(req.body.data) });
}

async function update(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  await tablesService.setOccupied(table_id, reservation_id);
  await tablesService.updateReservation(reservation_id, "seated");
  res.status(200).json({ data: { status: "seated" } });
}

async function destroy(req, res) {
  const { table_id, reservation_id } = res.locals.table;

  await tablesService.updateReservation(reservation_id, "finished");
  await tablesService.setFree(table_id);

  res.status(200).json({ data: { status: "finished" } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasRequiredProperties,
    tableNameValidator,
    capacityIsANumber,
    asyncErrorBoundary(create),
  ],
  update: [
    hasRequiredPropertiesUpdate,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    capacityCheck,
    occupiedCheckUpdate,
    asyncErrorBoundary(update),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    notOccupiedCheckDelete,
    asyncErrorBoundary(destroy),
  ],
};
