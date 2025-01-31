export const combineClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ')
}
