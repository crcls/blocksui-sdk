export function hasProp(obj: any, prop: string): boolean {
  if (obj === null || typeof obj !== "object") {
    return false
  }
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function isPojo(obj: any): boolean {
  if (obj === null || typeof obj !== "object") {
    return false
  }
  return Object.getPrototypeOf(obj) === Object.prototype
}

