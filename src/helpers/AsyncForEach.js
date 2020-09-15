/**
 * Performs an action on all items in an array. This action happens in parallel so the function will not be called in the correct order.
 *
 * @param {Array} array
 * @param {Function} func
 * @return {Promise}
 */
export default async function AsyncForEach(array, func) {
  return Promise.all(array.map(func));
}
