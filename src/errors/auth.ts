export class SignInError extends Error {
  constructor(message: string = 'Unable to sign in. Please try again.') {
    super(message);
    this.name = 'SignInError';
  }
}

export class SignOutError extends Error {
  constructor(message: string = 'Unable to sign out. Please try again.') {
    super(message);
    this.name = 'SignOutError';
  }
}

export class ReCaptchaError extends Error {
  constructor(message: string = 'reCAPTCHA verification failed. Please try again.') {
    super(message);
    this.name = 'ReCaptchaError';
  }
}

export class ReCaptchaLoadError extends Error {
  constructor(
    message: string = 'reCAPTCHA has failed to load. Please reload the page and try again.'
  ) {
    super(message);
    this.name = 'ReCaptchaError';
  }
}
