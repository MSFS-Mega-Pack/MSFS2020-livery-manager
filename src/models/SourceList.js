import Manifest from './Manifest';

export default class SourceList extends Manifest {
  #name;
  #description;
  #contributors;
  #mods;

  /**
   * Creates a new SourceList.
   *
   * @param {object} params
   *
   * @param {number} params.formatVersion For internal use. Used to dictate the manifest version used for backwards-compatibility.
   * @param {"sourceList"|"liverySource"|"aircraftManifest"|"liveryManifest"} params.formatType Declares the type of Manifest.
   * @param {string} params.humanVersion A humanised version string showed to users. Don't use any comparisons with this as it could be anything (semver, big chungus, a base64 PNG of your mother).
   * @param {number} params.versionCode A numeric version code that should be incremented upon every update of a manifest.
   *
   * @param {string} params.name The name of the source list shown to users.
   * @param {string} params.description The description of the source list shown to users.
   * @param {import('./Contributor').default[]} params.contributors A list of all contributors.
   *
   * @param {object[]} params.mods A list of all mods in the source list
   * @param {object} params.mods.name Mod name
   * @param {object} params.mods.description Mod name
   * @param {import('./Contributor').default[]} params.mods.contributors Mod contributors
   * @param {string} params.mods.modManifestUrl Mod manifest URL
   *
   * @readonly
   *
   * @memberof SourceList
   */
  constructor(params) {
    const { formatVersion, formatType, humanVersion, versionCode, name, description, contributors, mods } = params;

    if (formatType !== 'sourceList') throw "You can't create a source list with a type different to sourceList... that's just stupid!";

    super(formatVersion, 'sourceList', humanVersion, versionCode);

    this.#name = name;
    this.#description = description;
    this.#contributors = contributors;
    this.#mods = mods;
  }

  /**
   * The name of the source list shown to users.
   *
   * @type {string}
   *
   * @readonly
   * @memberof SourceList
   */
  get name() {
    return this.#name;
  }

  /**
   * The description of the source list shown to users.
   *
   * @type {string}
   *
   * @readonly
   * @memberof SourceList
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
   * @memberof SourceList
   */
  get contributors() {
    return this.#contributors;
  }

  /**
   * A list of all the mods in the SourceList
   *
   * @type {object[]}
   *
   * @readonly
   * @memberof SourceList
   */
  get mods() {
    return this.#mods;
  }
}
