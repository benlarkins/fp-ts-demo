import * as E from 'fp-ts/Either';
import { validateLogin, validatePassword } from '@/utils/validation';
import { NonEmptyArray } from 'fp-ts/NonEmptyArray';

describe('validatePassword', () => {
    test('should return Right for valid password', () => {
        const password = 'validpassword!';
        const result = validatePassword(password);
        expect(E.isRight(result)).toBe(true);
        E.fold(
            () => {}, 
            (valid: string) => expect(valid).toBe(password)
        )(result);
    });

    test('should return Left with length error for password too short even if has special character', () => {
        const password = 'short!';
        const result = validatePassword(password);
        expect(E.isLeft(result)).toBe(true);
        E.fold(
            (errors: NonEmptyArray<string>) => {
                expect(errors).toContain('Password must be at least 8 characters');
            },
            () => {}
        )(result);
    });

    test('should return Left with special character error for password with no special characters', () => {
        const password = 'longpassword';
        const result = validatePassword(password);
        expect(E.isLeft(result)).toBe(true);
        E.fold(
            (errors: NonEmptyArray<string>) => {
                expect(errors).toContain('Password must contain at least one special character');
            },
            () => {}
        )(result);
    });

    test('should return Left with both errors for password failing both validations', () => {
        const password = 'short';
        const result = validatePassword(password);
        expect(E.isLeft(result)).toBe(true);
        E.fold(
            (errors: NonEmptyArray<string>) => {
                expect(errors).toContain('Password must be at least 8 characters');
                expect(errors).toContain('Password must contain at least one special character');
            },
            () => {}
        )(result);
    });
});

describe('validateLogin', () => {
    test('should return a Right with email when given a valid email', () => {
      const input = 'test@example.com';
      const result = validateLogin(input);
  
      expect(E.isRight(result)).toBe(true);
      E.fold(
        (err) => fail(`Expected right but received left ${JSON.stringify(err)}`),
        (value) => {
          // Expect value to conform to an Email object
          expect(value).toEqual({ type: 'email', value: input });
        }
      )(result);
    });
  
    test('should return a Right with phone number when given a valid phone number', () => {
      const input = '1234567890';
      const result = validateLogin(input);
  
      expect(E.isRight(result)).toBe(true);
      E.fold(
        (err) => fail(`Expected right but received left ${JSON.stringify(err)}`),
        (value) => {
          // Expect value to conform to a PhoneNumber object
          expect(value).toEqual({ type: 'phone', value: input });
        }
      )(result);
    });
  
    test('should return a Left with a "Malformed email" error when given an email with a malformed domain', () => {
      // Input contains '@' but does not have a proper domain (e.g. missing dot)
      const input = 'test@com';
      const result = validateLogin(input);
  
      expect(E.isLeft(result)).toBe(true);
      E.fold(
        (err) => {
          // Expect the error to be of type "Malformed email"
          expect(err).toMatchObject({ type: 'Malformed email' });
        },
        () => fail('Expected left but received right')
      )(result);
    });
  
    test('should return a Left with a "Not a phone number" error when given an invalid login input', () => {
      // Input that is neither a valid email nor a valid phone number
      const input = 'invalid';
      const result = validateLogin(input);
  
      expect(E.isLeft(result)).toBe(true);
      E.fold(
        (err) => {
          // Expect the error to be of type "Not a phone number"
          expect(err).toMatchObject({ type: 'Not a phone number' });
        },
        () => fail('Expected left but received right')
      )(result);
    });
});
