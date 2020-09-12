export default class Feed {
  #formatVersion;
  #formatType;
  #rootUrl;
  #history;
  #feed;
  #isMoreHistoryAvailable;

  /**
   * Creates a new instance of an Article Feed.
   *
   * @param {Number} formatVersion
   * @param {String} formatType
   * @param {String} rootUrl
   * @param {String} history
   * @param {Boolean} isMoreHistoryAvailable
   * @param {import('./Article').default[]} feed
   */
  constructor(formatVersion, formatType, rootUrl, history, isMoreHistoryAvailable, feed) {
    this.#formatVersion = formatVersion;
    this.#formatType = formatType;
    this.#rootUrl = rootUrl;
    this.#history = history;
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
   * @type {String}
   *
   * @readonly
   * @memberof Feed
   */
  get rootUrl() {
    return this.#rootUrl;
  }

  /**
   * @type {String}
   *
   * @readonly
   * @memberof Feed
   */
  get historyUrl() {
    return this.#history;
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
