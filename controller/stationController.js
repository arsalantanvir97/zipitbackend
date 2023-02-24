const Station = require("../models/StationModel");
exports.getAllStations = async (req, res) => {
  const { page, limit, fieldname, order, from, to, keyword, selection, state } =
    req.query;
  const currentpage = page ? parseInt(page, 10) : 1;
  const per_page = limit ? parseInt(limit, 10) : 10;
  const CurrentField = fieldname ? fieldname : "createdAt";
  const currentOrder = order ? parseInt(order, 10) : -1;
  let offset = (currentpage - 1) * per_page;
  const sort = {};
  sort[CurrentField] = currentOrder;
  // return res.json(sort)
  let Datefilter = "";
  if (from && to) {
    Datefilter =
      from && to
        ? {
            createdAt: {
              $gte: moment(from).startOf("day").toDate(),
              $lte: moment(to).endOf("day").toDate(),
            },
          }
        : {};
    console.log("fromto", Datefilter);
  } else if (from) {
    console.log("from");
    Datefilter = from
      ? {
          createdAt: {
            $gte: moment(from).startOf("day").toDate(),
            $lte: moment(new Date()).endOf("day").toDate(),
          },
        }
      : {};
    console.log("from", Datefilter);
  } else if (to) {
    console.log.apply("to");
    Datefilter = to
      ? { createdAt: { $lte: moment(to).endOf("day").toDate() } }
      : {};
    console.log("to", Datefilter);
  }
  const search = keyword
    ? {
        $or: [
          { subscriptionname: { $regex: `${keyword}`, $options: "i" } },
          // { lastname: { $regex: `${keyword}`, $options: "i" } },
          // { phone_no: { $regex: `${keyword}`, $options: "i" } },

          // { email: { $regex: `${keyword}`, $options: "i" } },
          // { subject: { $regex: `${keyword}`, $options: "i" } },
          // { message: { $regex: `${keyword}`, $options: "i" } },
        ],
      }
    : {};
  const query = { State: state };
  try {
    const stations = await Station.paginate(
      {
        ...search,
        ...Datefilter,
        ...query,
      },
      {
        page: currentpage,
        limit: per_page,
        lean: true,
        sort: "-_id",
      }
    );
    res.status(200).json(stations);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};
exports.getStation = async (req, res) => {
  try {
    const station = await Station.find();
    return res.status(200).json({ station });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
};
