export default class Feed {
  #formatVersion;
  #formatType;
  #feed;
  #isMoreHistoryAvailable;

  /**
   * Creates a new instance of an Article Feed.
   *
   * @param {Number} formatVersion
   * @param {String} formatType
   * @param {Boolean=false} isMoreHistoryAvailable
   * @param {import('./Article').default[]} feed
   */
  constructor(formatVersion, formatType, feed, isMoreHistoryAvailable = false) {
    this.#formatVersion = formatVersion;
    this.#formatType = formatType;
    this.#feed = feed;
    this.#isMoreHistoryAvailable = isMoreHistoryAvailable;
  }

  /**
   * @type {Number}
   *
   * @readonly
   * @memberof Feed
   */
  get formatVersion() {
    return this.#formatVersion;
  }

  /**
   * @type {String}
   *
   * @readonly
   * @memberof Feed
   */
  get formatType() {
    return this.#formatType;
  }

  /**
   * @type {Article[]}
   *
   * @readonly
   * @memberof Feed
   */
  get feed() {
    return this.#feed;
  }

  /**
   * @type {Boolean}
   *
   * @readonly
   * @memberof Feed
   */
  get isMoreHistoryAvailable() {
    return this.#isMoreHistoryAvailable;
  }
}
