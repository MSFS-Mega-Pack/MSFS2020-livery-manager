import Manifest from './Manifest';

export default class LiverySource extends Manifest {
  #name;
  #description;
  #contributors;
  #aircraftManifests;

  /**
   * Creates a new SourceList.
   *
   * @param {Object} params
   *
   * @param {number} params.formatVersion For internal use. Used to dictate the manifest version used for backwards-compatibility.
   * @param {"sourceList"|"liverySource"|"aircraftManifest"|"liveryManifest"} params.formatType Declares the type of Manifest.
   * @param {string} params.humanVersion A humanised version string showed to users. Don't use any comparisons with this as it could be anything (semver, big chungus, a base64 PNG of your mother).
   * @param {number} params.versionCode A numeric version code that should be incremented upon every update of a manifest.
   *
   * @param {string} params.name The name of the livery source shown to users.
   * @param {string} params.description The description of the livery source shown to users.
   * @param {import('./Contributor').default[]} params.contributors A list of all contributors.
   * @param {string[]} params.sources A list of all livery set URLs
   *
   * @readonly
   *
   * @memberof LiverySource
   */
  constructor(params) {
    const { formatVersion, formatType, humanVersion, versionCode, name, description, contributors, sources } = params;

    if (formatType !== 'liverySource') throw "You can't create a livery source with a type different to liverySource... that's just stupid!";

    super(formatVersion, 'liverySource', humanVersion, versionCode);

    this.#name = name;
    this.#description = description;
    this.#contributors = contributors;
    this.#aircraftManifests = sources;
  }

  /**
   * The name of the livery source shown to users.
   *
   * @type {string}
   *
   * @readonly
   * @memberof LiverySource
   */
  get name() {
    return this.#name;
  }

  /**
   * The description of the livery source shown to users.
   *
   * @type {string}
   *
   * @readonly
   * @memberof LiverySource
   */
  get description() {
    return this.#description;
  }

  /**
   * A list of all contributors
   *
   * @type {import('./Contributor').default[]}
   *
   * @readonly
   * @memberof LiverySource
   */
  get contributors() {
    return this.#contributors;
  }

  /**
   * A list of all aircraft manifests in the livery source
   *
   * @type {string[]}
   *
   * @readonly
   * @memberof LiverySource
   */
  get aircraftManifests() {
    return this.#aircraftManifests;
  }
}
