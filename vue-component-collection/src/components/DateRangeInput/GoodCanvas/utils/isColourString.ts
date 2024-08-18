function isColourString(subject: unknown): boolean {
  if (typeof subject !== "string") {
    return false;
  }
  if (
    (subject.startsWith("rgb(") ||
      subject.startsWith("hsl(") ||
      subject.startsWith("cmyk(") ||
      subject.startsWith("g(")) &&
    subject.endsWith(")")
  ) {
    return true;
  }
  if (
    subject.startsWith("#") &&
    subject.length === 7 &&
    !isNaN(Number(subject.slice(1)))
  ) {
    return true;
  }
  return false;
}

export { isColourString };
