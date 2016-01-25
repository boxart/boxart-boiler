/**
 * @file Auto-binds class methods to an object
 * @module util/dates-range
 */

/**
 * Auto-bind methods to the passed-in object
 * @alias bindMethods
 * @param {object} thisValue - The object to bind as method context
 * @param {array} [methodNames] - The list of methods to bind. Defaults to all.
 * @returns {void}
 */
export default function(thisValue, methodNames) {
  const protoObj = Object.getPrototypeOf(thisValue);
  let methods = methodNames;

  if (!methods) {
    methods = Object.getOwnPropertyNames(protoObj).filter(
      name => typeof protoObj[name] === 'function'
    );
  }

  methods.forEach(name => {
    thisValue[name] = protoObj[name].bind(thisValue);
  });
}
