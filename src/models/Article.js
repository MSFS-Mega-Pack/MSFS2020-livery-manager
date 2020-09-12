import ThrowError from '../helpers/ThrowError';
import dayjs from 'dayjs';

/**
 * Article for use on the update feed on the home page.
 *
 * @export
 * @class Article
 */
export default class Article {
  #date;
  #title;
  #author;
  #content;

  /**
   * Creates a new instance of an Article.
   *
   * Either content or contentUrl MUST be provided.
   *
   * @param {Object} options
   * @param {String|Date|Number} options.date
   * @param {String} options.title
   * @param {String} options.author
   * @param {String} options.content
   */
  constructor(options) {
    const { date, title, author, content } = options;

    if (!content) {
      ThrowError('E007', 'Article content not specified');
    }

    // If the passed arg is instanceof Date, use that directly, else convert it to a Date
    this.#date = date instanceof Date ? date : new Date(date);
    this.#title = title;
    this.#author = author;
    this.#content = content;
  }

  /**
   * @type {Date}
   * @readonly
   * @memberof Article
   */
  get date() {
    return this.#date;
  }

  /**
   * Date, formatted nicely as a string
   *
   * @type {String}
   * @readonly
   * @memberof Article
   */
  get dateString() {
    return dayjs(this.#date).format('ddd D MMM YYYY, h:mm A');
  }

  /**
   * @type {String}
   * @readonly
   * @memberof Article
   */
  get title() {
    return this.#title;
  }

  /**
   * @type {String}
   * @readonly
   * @memberof Article
   */
  get author() {
    return this.#author;
  }

  /**
   * @type {String}
   * @readonly
   * @memberof Article
   */
  get content() {
    return this.#content;
  }
}
