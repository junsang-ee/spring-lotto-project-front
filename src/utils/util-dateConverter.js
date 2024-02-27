import moment from "moment/moment";

const convertDate = (date) => moment(date).format("yyyy.MM.DD HH:mm:ss");
const convertDateOnlyDay = (date) => moment(date).format("yyyy.MM.DD");

export { convertDate, convertDateOnlyDay }