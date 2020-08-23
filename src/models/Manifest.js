/**
 * The base class of all manifests.
 *
 *
 *
 * @class Manifest
 */
export default class Manifest {
  #formatVersion;
  #formatType;
  #humanVersion;
  #versionCode;

  /**
   * Creates a new Manifest.
   *
   * @param {number} formatVersion For internal use. Used to dictate the manifest version used for backwards-compatibility.
   * @param {"sourceList"|"liverySource"|"aircraftManifest"|"liveryManifest"} formatType Declares the type of Manifest.
   * @param {string} humanVersion A humanised version string showed to users. Don't use any comparisons with this as it could be anything (semver, big chungus, a base64 PNG of your mother).
   * @param {number} versionCode A numeric version code that should be incremented upon every update of a manifest.
   *
   * @memberof Manifest
   */
  constructor(formatVersion, formatType, humanVersion, versionCode) {
    this.#formatVersion = formatVersion;
    this.#formatType = formatType;
    this.#humanVersion = humanVersion;
    this.#versionCode = versionCode;
  }

  /**
   * For internal use. Used to dictate the manifest version used for backwards-compatibility.
   *
   * This does NOT reflect the version of the JSON file. [versionCode] should be used for that.
   *
   * @type {number}
   *
   * @memberof Manifest
   * @readonly
   */
  get formatVersion() {
    return this.#formatVersion;
  }

  /**
   * Declares the type of manifest.
   *
   * @type {"sourceList"|"liverySource"|"aircraftManifest"|"liveryManifest"}
   *
   * @memberof Manifest
   * @readonly
   */
  get formatType() {
    return this.#formatType;
  }

  /**
   * A humanised version string showed to users.
   *
   * Don't use any comparisons with this as it could be anything (semver, big chungus, a base64 PNG of your mother).
   *
   * @type {string}
   *
   * @memberof Manifest
   * @readonly
   */
  get humanVersion() {
    return this.#humanVersion;
  }

  /**
   * A numeric version code that should be incremented upon every update of a manifest.
   *
   * @type {number}
   *
   * @memberof Manifest
   * @readonly
   */
  get versionCode() {
    return this.#versionCode;
  }

  set formatVersion(x) {
    throw "Can't set a read-only property";
  }

  set formatType(x) {
    throw "Can't set a read-only property";
  }

  set humanVersion(x) {
    throw "Can't set a read-only property";
  }

  set versionCode(x) {
    throw "Can't set a read-only property";
  }
}
