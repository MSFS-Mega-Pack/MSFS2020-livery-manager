/**
 * Checks if a livery is in the specified array of livery.
 *
 * We only check the airplane and filename, and these are checked
 * case-insensitively. Other fields are NOT checked as these may
 * change between livery version.
 *
 * @param {object} livery Livery to find
 * @param {object} arr Array to check in
 * @return {[number, "differentHash"|null]}
 */
export default function GetIndexOfLiveryInArray(livery, arr) {
  /*
  We can't check against the full item, as there's other key/values
  that get returned by the GetInstalledLiveries helper, and because
  the hash changes between versions.
  */
  const index = arr.findIndex(
    o =>
      JSON.stringify({
        airplane: o.airplane.toLowerCase(),
        fileName: o.fileName.toLowerCase(),
      }) ===
      JSON.stringify({
        airplane: livery.airplane.toLowerCase(),
        fileName: livery.fileName.toLowerCase(),
      })
  );

  // If the livery was found in the list of installed, but the hash
  // is different, report that. An update is probably available!
  if (index !== -1 && arr[index].checkSum !== livery.checkSum) {
    return [index, 'differentHash'];
  } else {
    return [index, null];
  }
}
