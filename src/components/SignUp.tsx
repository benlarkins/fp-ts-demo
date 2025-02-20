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
import { PasswordInput } from '@/components/ui/password-input';
import { Toaster, toaster } from '@/components/ui/toaster';
import { validateLogin, validatePassword } from '@/utils/validation';

type ErrorState = {
    identifier?: string;
    password?: string[];
}

export const SignUp = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasValidLogin, setHasValidLogin] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({ identifier: '', password: [] });

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
            updatedErrorState = { ...errors, password: [] };
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
        setErrors(updatedErrors);

        if (!updatedErrors.identifier && !updatedErrors.password?.length && password.length) {
            setIsLoading(true);

            try {
                // TODO: Implement actual login logic here
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call

                toaster.create({
                    title: 'Sign Up Successful',
                    type: 'success',
                    duration: 3000,
                });
            } catch (error) {
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
