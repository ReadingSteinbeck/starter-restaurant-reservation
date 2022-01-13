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
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function peopleIsANumber(req, res, next) {
  const { people } = req.body.data;

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
  let month = date.getMonth() + 1;
  const currentDate = [
    date.getFullYear(),
    month < 10 ? "0" + month : month,
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
  ].join("");
  const currentTime = [
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
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
function reservationDateAndTimeAreValid(req, res, next) {
  let { reservation_time, reservation_date } = req.body.data;

  reservation_date = reservation_date.slice(0, 10).replace(/-/g, "");

  reservation_time = reservation_time.replace(/:/g, "");

  if (
    !Number.isInteger(parseInt(reservation_time)) ||
    !Number.isInteger(parseInt(reservation_date))
  ) {
    return next({
      status: 400,
      message: `Reservations must have valid reservation_date and reservation_time properties.`,
    });
  }
  res.locals.reservation_date = reservation_date;
  res.locals.reservation_time = reservation_time;
  next();
}

function isInFuture(req, res, next) {
  const { reservation_time, reservation_date } = res.locals;
  const reservationDateAndTime = parseInt(reservation_date + reservation_time);
  //When deployed to heroku now is now ~5hours ahead
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
  let { reservation_date } = req.body.data;

  const date = new Date(reservation_date + "T22:00:00");
  if (date.getDay() !== 2) {
    return next();
  }
  next({ status: 400, message: `The restaurant is closed on tuesdays.` });
}

function isDuringWorkHours(req, res, next) {
  let { reservation_time } = req.body.data;

  reservation_time = parseInt(reservation_time.replace(/:/g, ""));

  if (reservation_time > 1030 && reservation_time < 2130) {
    return next();
  }
  next({
    status: 400,
    message: `Reservations must be made during working hours.`,
  });
}

function checkStatusCreate(req, res, next) {
  const { status } = req.body.data;
  if (status === "booked" || !status) {
    return next();
  }
  next({
    status: 400,
    message: `Status: ${status} must be booked.`,
  });
}
function checkStatusUpdate(req, res, next) {
  const { status } = req.body.data;

  if (["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: `Status: ${status} must be booked, seated or finished.`,
  });
}
function checkCurrentStatus(req, res, next) {
  const currentStatus = res.locals.reservation.status;
  if (currentStatus === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated.`,
    });
  }
  next();
}

//HTTP Verbs
async function list(req, res) {
  if (req.query.date) {
    let reservations = await reservationsService.listByDate(req.query.date);
    const data = reservations.filter(
      (reservation) => reservation.status !== "finished"
    );
    res.json({
      data,
    });
  } else if (req.query.mobile_number) {
    res.json({
      data: await reservationsService.search(req.query.mobile_number),
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
  req.body.data.status = "booked";

  res
    .status(201)
    .json({ data: await reservationsService.create(req.body.data) });
}

async function updateStatus(req, res) {
  const { status } = req.body.data;
  const { reservation_id } = res.locals.reservation;
  await reservationsService.setStatus(reservation_id, status);
  res.status(200).json({ data: { status } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    reservationDateAndTimeAreValid,
    peopleIsANumber,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    hasOnlyValidProperties,
    checkStatusUpdate,
    asyncErrorBoundary(reservationExists),
    checkCurrentStatus,
    asyncErrorBoundary(updateStatus),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    checkStatusCreate,
    peopleIsANumber,
    reservationDateAndTimeAreValid,
    isInFuture,
    isDuringWorkHours,
    isNotTuesday,
    asyncErrorBoundary(create),
  ],
};
