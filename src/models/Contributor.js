/**
 * A class representing a single person who has contributed towards a livery/manifest.
 *
 * @class Contributor
 */
export default class Contributor {
  #name;
  #twitter;
  #discord;
  #github;
  #msfsforums;

  /**
   * Creates a new Contributor.
   *
   * @param {Object} params
   *
   * @param {string} params.name User name or nickname
   * @param {string} params.twitter User twitter handle (with the '@')
   * @param {string} params.discord User Discord handle (with the '#xxxx')
   * @param {string} params.github User GitHub username
   * @param {string} params.msfsforums User MSFS Forums username
   *
   * @memberof Contributor
   */
  constructor(params) {
    const { name, twitter, discord, github, msfsforums } = params;

    this.#name = name;
    this.#twitter = twitter;
    this.#discord = discord;
    this.#github = github;
    this.#msfsforums = msfsforums;
  }

  /**
   * User's name or nickname
   *
   * @type {string}
   *
   * @readonly
   * @memberof Contributor
   */
  get name() {
    return this.#name;
  }

  /**
   * User's twitter handle (with the '@')
   *
   * @type {string}
   *
   * @readonly
   * @memberof Contributor
   */
  get twitter() {
    return this.#twitter;
  }

  /**
   * User's Discord handle (with the '#xxxx')
   *
   * @type {string}
   *
   * @readonly
   * @memberof Contributor
   */
  get discord() {
    return this.#discord;
  }

  /**
   * User's GitHub username
   *
   * @type {string}
   *
   * @readonly
   * @memberof Contributor
   */
  get github() {
    return this.#github;
  }

  /**
   * User's MSFS Forums username
   *
   * @type {string}
   *
   * @readonly
   * @memberof Contributor
   */
  get msfsforums() {
    return this.#msfsforums;
  }
}
