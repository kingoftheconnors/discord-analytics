var dayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

var dayNameMap = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};

function getDayNumber(dayName) {
  var dayName = dayName.toLowerCase();
  if (!dayMap.hasOwnProperty(dayName)) {
    return false;
  }
  return dayMap[dayName];
}

function getDayName(dayNumber) {
  var dayNumber = dayName.toLowerCase();
  if (!dayMap.hasOwnProperty(dayName)) {
    return false;
  }
  return dayMap[dayName];
}

module.exports = { getDayNumber, getDayName };
