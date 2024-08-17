import Year from "./Year";

export function _daysIn(year: number): number;
export function _daysIn(year: number, month: number): number;
export function _daysIn(arg0: number, arg1?: number): number {
  let firstDay: number;
  let lastDay: number;
  if (arg1) {
    if (arg1 >= 12 || arg1 < 0) {
      throw new Error(
        `month parameter is ${arg1}. It must be a non-negative integer less than 12.`
      );
    }
    firstDay = new Date(arg0, arg1).getTime();
    lastDay = new Date(arg0, arg1 + 1).getTime();
  } else {
    firstDay = new Date(Number(arg0), 0).getTime();
    lastDay = new Date(Number(arg0) + 1, 0).getTime();
  }
  return (lastDay - firstDay) / 86400000;
}

export function _dateAddition(
  date: Date,
  addend: `${number}${" " | ""}${"d" | "m" | "y"}`
): Date {
  if (addend.includes("d")) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + Number(addend.split(/sa-z/)[0])
    );
  }
  if (addend.includes("m")) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + Number(addend.split(/sa-z/)[0]),
      date.getDate()
    );
  }
  if (addend.includes("y")) {
    return new Date(
      date.getFullYear() + Number(addend.split(/sa-z/)[0]),
      date.getMonth(),
      date.getDate()
    );
  }
  throw new Error(
    `function: _dateAddition. addend must have a unit matching "d", "m", or "y"`
  );
}

export function _dateSubtraction(
  date: Date,
  subtrahend: `${number}${" " | ""}${"d" | "m" | "y"}`
): Date {
  if (subtrahend.includes("d")) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - Number(subtrahend.split(/[mdy ]/)[0])
    );
  }
  if (subtrahend.includes("m")) {
    return new Date(
      date.getFullYear(),
      date.getMonth() - Number(subtrahend.split(/[mdy ]/)[0]),
      date.getDate()
    );
  }
  if (subtrahend.includes("y")) {
    const NEW_YEAR = date.getFullYear() - Number(subtrahend.split(/[mdy ]/)[0]);
    return new Date(NEW_YEAR, date.getMonth(), date.getDate());
  }
  throw new Error(
    `function: _dateSubtraction. subtracted must have a unit matching "d", "m", or "y"`
  );
}

export function _monthString(monthNumber: number): string {
  switch (monthNumber) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      throw new Error(
        `_monthString: input must be a number more than or equal 1, and less than or equal 12. Input was "${monthNumber}"`
      );
  }
}

export function _getYearArray(
  firstDate: Date,
  lastDate: Date,
  unitSize: number,
  displayFineness: Array<"days" | "months" | "years">
): Array<Year> {
  const YEAR_ARRAY: Array<Year> = [];
  for (let y = firstDate.getFullYear(); y < lastDate.getFullYear(); y++) {
    YEAR_ARRAY.push(
      new Year(y, firstDate, lastDate, unitSize, displayFineness)
    );
  }
  return YEAR_ARRAY;
}
