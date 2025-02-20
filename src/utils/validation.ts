import { sequenceT } from 'fp-ts/Apply'
import { flow, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { getSemigroup, NonEmptyArray } from 'fp-ts/NonEmptyArray'

type Email = Readonly<{
    type: 'email';
    value: string;
}>

type PhoneNumber = Readonly<{
    type: 'phone';
    value: string;
}>

type MalformedEmail = Readonly<{
    error: Error;
    type: 'Malformed email';
}>

type NotAnEmail = Readonly<{
    error: Error;
    type: 'Not an email';
}>

type InvalidPhoneNumber = Readonly<{
    error: Error;
    type: 'Not a phone number';
}>

// Checks if the input is a valid email address
const validateEmail = flow(
    E.fromPredicate(
        (input: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input),
        (invalidEmail): MalformedEmail | NotAnEmail => invalidEmail.includes('@')
            ? { error: new Error('Malformed email'), type: 'Malformed email' }
            : { error: new Error('Not an email'), type: 'Not an email' }
    ),
    E.map((email): Email => ({ type: 'email', value: email })), 
);

// This function checks if the input is a "valid" phone number (just a 10 digit number)
const validatePhoneNumber = flow(
    E.fromPredicate(
        (input: string) => /^\d{10}$/.test(input),
        (): InvalidPhoneNumber => ({ error: new Error('Not a phone number'), type: 'Not a phone number' })
    ),
    E.map((phone): PhoneNumber => ({ type: 'phone', value: phone })),
);

// This is a simple check to see if the password has a special character
const validatePasswordHasSpecialCharacter = (password: string): boolean => {
    return /[\d!@#$%^&*()_+?",.<>]/.test(password);
}

// This is a simple check to see if the password is at least 8 characters long
const validatePasswordLength = (password: string): boolean => password.length >= 8;

// Check a user's login input. If it's an email then run email validation, otherwise check if it's a phone number
export const validateLogin = (loginInput: string) => pipe(
    loginInput,
    validateEmail,
    E.orElseW((e): E.Either<InvalidPhoneNumber | MalformedEmail, PhoneNumber> =>
        // If the email validation fails, check if it's a phone number
        e.type === 'Malformed email'
            ? E.left(e)
            : validatePhoneNumber(loginInput)
    )
);

// The applicativeValidation function is used to combine multiple validations into a single Either
// This is useful for validating multiple conditions at once
// Otherwise the Either will return the first left it encounters
const applicativeValidation = E.getApplicativeValidation(getSemigroup<string>());

// Perform a validation check and return an Either
// If the check fails, return a NonEmptyArray of errors
function lift<E, A>(check: (a: A) => E.Either<E, A>): (a: A) => E.Either<NonEmptyArray<E>, A> {
    return (a) => pipe(
        check(a),
        E.mapLeft((e) => [e])
    );
}

// Lift the password length validation to return a non-empty array of errors
const liftedPasswordLength = lift((password: string) => pipe(
    password,
    E.of,
    E.filterOrElse(validatePasswordLength, () => 'Password must be at least 8 characters')
));

// Lift the password special character validation to return a non-empty array of errors
const liftedPasswordHasSpecialCharacters = lift((password: string) => pipe(
    password,
    E.of,
    E.filterOrElse(validatePasswordHasSpecialCharacter, () => 'Password must contain at least one special character')
));

// Validate the password using the lifted validations
// This will return an Either with a NonEmptyArray of errors if any of the validations fail
// This is important for UX so that we can show the user all the errors at once 
export function validatePassword(password: string): E.Either<NonEmptyArray<string>, string> {
    return pipe(
        sequenceT(applicativeValidation)(
            liftedPasswordLength(password),
            liftedPasswordHasSpecialCharacters(password),
        ),
        E.map(() => password),
    );
}
