import * as E from 'fp-ts/Either'
import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    Icon,
    Input,
    Presence,
    Text,
    VStack,
} from '@chakra-ui/react';
import { LogIn } from 'lucide-react';

import { Field } from '@/components/ui/field';
import { PasswordInput, PasswordStrengthMeter } from '@/components/ui/password-input';
import { toaster } from '@/components/ui/toaster';
import { validateLogin, validatePassword, validatePasswordLength } from '@/utils/validation';

type ErrorState = {
    identifier?: string;
    password?: string[];
}

export const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasValidLogin, setHasValidLogin] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({ identifier: '', password: [] });
    console.log(errors.password?.length);

    // const validateForm = () => {
    //     const newErrors: { identifier?: string; password?: string } = {};

    //     if (!identifier) {
    //         newErrors.identifier = 'Email or phone number is required';
    //     } else if (!isValidIdentifier(identifier)) {
    //         newErrors.identifier = 'Please enter a valid email or phone number';
    //     }

    //     if (!password) {
    //         newErrors.password = 'Password is required';
    //     } else if (password.length < 8) {
    //         newErrors.password = 'Password must be at least 8 characters';
    //     }

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    function validateLoginIdentifier(errState: ErrorState): ErrorState {
        let updatedErrorState = { ...errState };
        const isValidLogin = validateLogin(identifier);

        E.match(() => {
            updatedErrorState = { ...updatedErrorState, identifier: 'Please enter a valid email or phone number' };
        },
        () => {
            updatedErrorState = { ...updatedErrorState, identifier: '' };
            setHasValidLogin(true);
        })(isValidLogin);

        return updatedErrorState;
    }

    function validatePasswordInput(errState: ErrorState): ErrorState {
        let updatedErrorState = { ...errState };
        const isValidPassword = validatePassword(password);

        E.match((e: string[]) => {
            console.log('error', e);
            updatedErrorState = { ...updatedErrorState, password: [...e] };
        },
        () => {
            setErrors({ ...errors, password: [] });
        })(isValidPassword);

        return updatedErrorState;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        let updatedErrors = { ...errors };
        e.preventDefault();

        if (hasValidLogin) {
            updatedErrors = validatePasswordInput(updatedErrors);
        }
        
        updatedErrors = validateLoginIdentifier(updatedErrors);
        console.log('updatedErrors', updatedErrors);
        setErrors(updatedErrors);

        console.log('validate password', validatePassword(password));
        // pipe(
        //     isValidLogin,
        //     E.match(
        //         (error) => {
        //             if (error.type === 'Malformed email') {
        //                 setErrors({ identifier: 'Invalid email' });
        //                 setHasValidLogin(false);
        //             }
                    
        //             if (error.type === 'Not a phone number') {
        //                 setErrors({ identifier: 'Invalid phone number/email' });
        //                 setHasValidLogin(false);
        //             }
        //         },
        //         (valid) => {
        //             setHasValidLogin(true);
        //             setErrors({});
        //         }
        //     )
        // );
        // pipe(
        //     passwordIsCorrectLength,
        //     E.match(
        //         (error) => error.message,
        //         () => '',
        //     )
        // );
        // pipe(
        //     passwordHasSpecialCharacter,
        //     E.match(
        //         (error) => {
        //             setErrors({ password: error.message });
        //         },
        //         () => {
        //             setErrors({});
        //         }
        //     )
        // );

        // console.log('isValid', isValidLogin);
        // if (!validateForm()) return;

        // if (E.isRight(isValidLogin) && E.isRight(passwordHasSpecialCharacter)) {
        //     setHasValidLogin(true);
        //     setIsLoading(true);

        //     try {
        //         // TODO: Implement actual login logic here
        //         await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

        //         toaster.create({
        //             title: 'Login Successful',
        //             type: 'success',
        //             duration: 3000,
        //             // isClosable: true,
        //         });
        //     } catch (error) {
        //         toaster.create({
        //             title: 'Login Failed',
        //             description: 'Please check your credentials and try again.',
        //             type: 'error',
        //             duration: 3000,
        //             // isClosable: true,
        //         });
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <Box
                p={8}
                borderWidth={2}
                borderRadius="lg"
                boxShadow="lg"
                maxWidth="700px"
                justifySelf="center"
                width="100%"
            >
                <VStack spaceX={6} align="stretch">
                    <Box textAlign="center">
                        <Icon fontSize="40px">
                            <LogIn />
                        </Icon>
                        <Heading size="lg" mb={2}>Welcome Back</Heading>
                        <Text color="gray.300">Sign in to continue</Text>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <VStack spaceY={4}>
                            {/* <FormControl isInvalid={!!errors.identifier}>
                                <FormLabel>Email or Phone Number</FormLabel> */}
                            <Field
                                label="Email or Phone Number"
                                invalid={!!errors.identifier}
                                errorText={errors.identifier}
                            >
                                <Input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Enter your email or phone number"
                                    variant="outline"
                                />
                            </Field>

                            <Presence
                                present={hasValidLogin}
                                width="100%"
                            >
                                <Field
                                    label="Password"
                                    invalid={Boolean(errors.password?.length)}
                                    errorText={
                                        errors.password?.map((v, i) => <Text style={{ display: 'flex' }} key={i}>
                                            {i > 0 ? v.replace('Password must', ' and') : v}
                                        </Text>)
                                    }
                                >
                                    <PasswordInput
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        value={password}
                                    />
                                    {/* <PasswordStrengthMeter value={passwordStrength} /> */}

                                </Field>
                            </Presence>

                            <Button
                                // colorScheme="blue"
                                loading={isLoading}
                                loadingText="Signing in..."
                                // mt={4}
                                type="submit"
                                variant="solid"
                                width="full"
                            >
                                Sign In
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};
