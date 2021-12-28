/**
 * List handler for reservation resources
 */
const reservationsService = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Middleware

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function peopleIsANumber(req, res, next) {
  const { data = {} } = req.body;
  const { people } = data;
  if (Number.isInteger(people)) {
    return next();
  }
  next({
    status: 400,
    message: `The people property must be a postive number.`,
  });
}

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
function getDateAndTimeHelper() {
  const date = new Date();
  const currentDate = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ].join("");
  const currentTime = [
    date.getHours() < 10 ? 0 + date.getHours() : date.getHours(),
    date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes(),
  ].join("");

  return parseInt(currentDate + currentTime);
}

async function reservationExists(req, res, next) {
  const reservation = await reservationsService.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

function isInFuture(req, res, next) {
  const { data = {} } = req.body;
  let { reservation_time, reservation_date } = data;
  reservation_date = reservation_date.slice(0, 10).replaceAll("-", "");

  reservation_time = reservation_time.replaceAll(":", "");
  const reservationDateAndTime = parseInt(reservation_date + reservation_time);
  if (
    !Number.isInteger(parseInt(reservation_time)) ||
    !Number.isInteger(parseInt(reservation_date))
  ) {
    return next({
      status: 400,
      message: `Reservations must have valid reservation_date and reservation_time properties.`,
    });
  }
  const now = getDateAndTimeHelper();

  if (now < reservationDateAndTime) {
    return next();
  }

  next({
    status: 400,
    message: `Reservations must be made for a future time.`,
  });
}

function isNotTuesday(req, res, next) {
  const { data = {} } = req.body;
  let { reservation_date } = data;
  const date = new Date(reservation_date + "T22:00:00");
  if (date.getDay() !== 2) {
    return next();
  }
  next({ status: 400, message: `The restaurant is closed on tuesdays.` });
}

function isDuringWorkHours(req, res, next) {
  const { data = {} } = req.body;
  let { reservation_time } = data;
  reservation_time = parseInt(reservation_time.replaceAll(":", ""));

  if (reservation_time > 1030 && reservation_time < 2130) {
    return next();
  }
  next({
    status: 400,
    message: `Reservations must be made during working hours.`,
  });
}

//HTTP Verbs
async function list(req, res) {
  if (req.query.date) {
    res.json({
      data: await reservationsService.listByDate(req.query.date),
    });
  } else {
    res.json({
      data: await reservationsService.list(),
    });
  }
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function update(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    ...req.body.data,
  };
  res.json({ data: await reservationsService.update(updatedReservation) });
}

async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.delete(reservation.reservation_id);
  res.sendStatus(204);
}

async function create(req, res) {
  res
    .status(201)
    .json({ data: await reservationsService.create(req.body.data) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasOnlyValidProperties,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    peopleIsANumber,
    isInFuture,
    isDuringWorkHours,
    isNotTuesday,
    asyncErrorBoundary(create),
  ],
};
