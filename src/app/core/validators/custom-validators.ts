import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { APP_CONSTANTS } from '../constants/app.constants';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate <= today) {
      return { futureDate: true };
    }

    return null;
  };
}

export function alphanumericWithSpacesAndHyphensValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const valid = APP_CONSTANTS.REGEX.LETTERS_SPACES_HYPHENS.test(control.value);

    if (!valid) {
      return { alphanumericWithSpacesAndHyphens: true };
    }

    return null;
  };
}

export function lettersSpacesHyphensValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const valid = APP_CONSTANTS.REGEX.LETTERS_SPACES_HYPHENS.test(control.value);

    if (!valid) {
      return { lettersSpacesHyphens: true };
    }

    return null;
  };
}

export function trackingIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const valid = APP_CONSTANTS.REGEX.TRACKING_ID.test(control.value.trim());

    if (!valid) {
      return { trackingIdFormat: true };
    }

    return null;
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const valid = APP_CONSTANTS.REGEX.EMAIL.test(control.value);

    if (!valid) {
      return { email: true };
    }

    return null;
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    if (control.value.length < 6) {
      return { passwordLength: true };
    }

    return null;
  };
}

export function asyncTrackingIdValidator(): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return Promise.resolve(null);
  };
}

export function getTrackingIdErrorMessage(error: ValidationErrors | null): string {
  if (!error) return '';
  if (error['required']) return APP_CONSTANTS.VALIDATION_MESSAGES.TRACKING_ID.REQUIRED;
  if (error['trackingIdFormat'])
    return APP_CONSTANTS.VALIDATION_MESSAGES.TRACKING_ID.INVALID_FORMAT;
  return 'Invalid Tracking ID';
}

export function getDateErrorMessage(error: ValidationErrors | null): string {
  if (!error) return '';
  if (error['required']) return APP_CONSTANTS.VALIDATION_MESSAGES.DATE.REQUIRED;
  if (error['futureDate']) return APP_CONSTANTS.VALIDATION_MESSAGES.DATE.FUTURE_DATE;
  return APP_CONSTANTS.VALIDATION_MESSAGES.DATE.INVALID;
}

export function getLocationErrorMessage(error: ValidationErrors | null): string {
  if (!error) return '';
  if (error['required']) return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.REQUIRED;
  if (error['minlength']) return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.MIN_LENGTH;
  if (error['maxlength']) return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.MAX_LENGTH;
  if (error['lettersSpacesHyphens'])
    return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.INVALID_CHARACTERS;
  if (error['alphanumericWithSpacesAndHyphens'])
    return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.INVALID_CHARACTERS;
  return APP_CONSTANTS.VALIDATION_MESSAGES.LOCATION.INVALID;
}

export function getEmailErrorMessage(error: ValidationErrors | null): string {
  if (!error) return '';
  if (error['required']) return APP_CONSTANTS.VALIDATION_MESSAGES.EMAIL.REQUIRED;
  if (error['email']) return APP_CONSTANTS.VALIDATION_MESSAGES.EMAIL.INVALID_FORMAT;
  return APP_CONSTANTS.VALIDATION_MESSAGES.EMAIL.INVALID;
}

export function getPasswordErrorMessage(error: ValidationErrors | null): string {
  if (!error) return '';
  if (error['required']) return APP_CONSTANTS.VALIDATION_MESSAGES.PASSWORD.REQUIRED;
  if (error['passwordLength']) return APP_CONSTANTS.VALIDATION_MESSAGES.PASSWORD.MIN_LENGTH;
  return APP_CONSTANTS.VALIDATION_MESSAGES.PASSWORD.INVALID;
}

export function getOriginDestinationErrorMessage(
  error: ValidationErrors | null,
  fieldName: string = 'Field'
): string {
  if (!error) return '';

  const messages =
    fieldName === 'Origin'
      ? APP_CONSTANTS.VALIDATION_MESSAGES.ORIGIN
      : APP_CONSTANTS.VALIDATION_MESSAGES.DESTINATION;

  if (error['required']) return messages.REQUIRED;
  if (error['minlength']) return messages.MIN_LENGTH;
  if (error['maxlength']) return messages.MAX_LENGTH;
  if (error['lettersSpacesHyphens']) return messages.INVALID_CHARACTERS;
  if (error['alphanumericWithSpacesAndHyphens']) return messages.INVALID_CHARACTERS;
  return messages.INVALID;
}
