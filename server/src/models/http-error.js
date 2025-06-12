class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a "Message" Property
    this.code = errorCode; // Adds a "Code" Property
  }
}

module.exports = HttpError;
