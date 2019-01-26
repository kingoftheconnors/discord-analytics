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

// e.g. Saturday -> 6
function getDayNumber(dayName) {
  var lowerDay = dayName.toLowerCase();
  if (!dayMap.hasOwnProperty(lowerDay)) {
    return false;
  }
  return dayMap[lowerDay];
}

// e.g. 6 -> Saturday
function getDayName(dayNumber) {
  if (!dayNameMap.hasOwnProperty(dayNumber)) {
    return false;
  }
  return dayNameMap[dayNumber];
}

module.exports = { getDayNumber, getDayName };
