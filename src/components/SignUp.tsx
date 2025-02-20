import React, { useMemo, useState } from 'react';
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
import * as E from 'fp-ts/Either'
import { LogIn } from 'lucide-react';

import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Toaster, toaster } from '@/components/ui/toaster';
import { validateLogin, validatePassword } from '@/utils/validation';

function validateLoginIdentifier(identifier: string): string {
    return E.match(
        () => 'Please enter a valid email or phone number',
        () => ''
    )(validateLogin(identifier));
}

function validatePasswordInput(password: string): string[] {
    return E.match(
        (errors: string[]) => errors,
        () => []
    )(validatePassword(password));
}

export const SignUp = () => {
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
    const [hasSubmittedPassword, setHasSubmittedPassword] = useState<boolean>(false);
    const [hasSubmittedValidLogin, setHasSubmittedValidLogin] = useState<boolean>(false);
    const [identifier, setIdentifier] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');

    // These are derived states.
    const identifierError = useMemo<string>(() => validateLoginIdentifier(identifier), [identifier]);
    const passwordErrors = useMemo<string[]>(() => validatePasswordInput(password), [password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasSubmitted) {
            setHasSubmitted(true);
        }

        if (!hasSubmittedValidLogin && !identifierError) {
            setHasSubmittedValidLogin(true);
        }

        if (!hasSubmittedPassword && password.length) {
            setHasSubmittedPassword(true);
        }

        if (!identifierError && !passwordErrors?.length && password.length) {
            setIsLoading(true);

            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

                // Here you would typically handle the API call for signing up
                toaster.create({
                    title: 'Sign Up Successful',
                    type: 'success',
                    duration: 3000,
                });
            } catch (error) {
                // Handle error. Let the user know the sign up failed
                toaster.create({
                    title: 'Sign Up Failed',
                    description: 'Please check your credentials and try again.',
                    type: 'error',
                    duration: 3000,
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Container maxW="container.sm" py={10}>
            <Toaster />
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
                        <Heading size="lg" mb={2}>Welcome</Heading>
                        <Text color="gray.300">Sign up to continue</Text>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <VStack spaceY={4}>
                            <Field
                                label="Email or Phone Number"
                                invalid={hasSubmitted && identifierError.length > 0}
                                errorText={identifierError}
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
                                present={hasSubmittedValidLogin}
                                width="100%"
                            >
                                <Field
                                    label="Password"
                                    invalid={hasSubmittedPassword && Boolean(passwordErrors?.length)}
                                    errorText={
                                        passwordErrors?.map((v, i) => <Text style={{ display: 'flex' }} key={i}>
                                            {i > 0 ? v.replace('Password must', ' and') : v}
                                        </Text>)
                                    }
                                >
                                    <PasswordInput
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        value={password}
                                    />

                                </Field>
                            </Presence>

                            <Button
                                loading={isLoading}
                                loadingText="Signing up..."
                                type="submit"
                                variant="solid"
                                width="full"
                            >
                                Sign Up
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
};
