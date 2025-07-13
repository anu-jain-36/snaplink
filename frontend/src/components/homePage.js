import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// import './homePage.css';
// import '../App.css';
import { Box, Card, Flex, Input, HStack, Image, VStack, CardBody, Button, Spacer, Text } from "@chakra-ui/react";
import { EditIcon } from '@chakra-ui/icons';

const HomePage = () => {
    const [inputUrl, setInputUrl] = useState('');
    const [customized, setCustomized] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const navigate = useNavigate()
    const [inputValues, setInputValues] = useState({
        inputUrl: '',
        customized: '',
        generatedUrl: '' // Depending on your use case, this might not be necessary to handle here
    });

    const [latency, setLatency] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const checkEmail = localStorage.getItem('userEmail') || 'placeholder@rice.edu';
    const [isSubscribed, setIsSubscribed] = useState(true);


    const checkSubscriptionStatus = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/customizeUrl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    long_url: 'https://example.com', // Dummy URL for testing
                    short_url: 'https://snaplink.surge.sh/test', // Dummy customized URL for testing
                    email: checkEmail,
                }),
            });
            const result = await response.json();
            if (response.ok || result.data.includes("Please try a different URL.")) {
                setIsSubscribed(true);
            } else {
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Error checking subscription status:', error);
        }

    };

    useEffect(() => {
        checkSubscriptionStatus();
    }, [userEmail]);

    useEffect(() => {
        if (token) {
            // Decode the token to get user information
            const decodedToken = jwtDecode(token);
            // You can now use the decoded token to get the user's email
            const email = decodedToken.email;
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedin', 'true');
            setUserEmail(email)
            navigate('/');
        } else {
            setUserEmail(checkEmail);
        }
    }, [token]);

    const backendUrl = 'https://comp539-team2-backend-dot-rice-comp-539-spring-2022.uk.r.appspot.com';

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubscribe = async () => {
        try {
            const response = await fetch(`${backendUrl}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            if (response.ok) {
                // If the subscription was successful
                const result = await response.text(); // Or .json(), depending on your backend
                setIsSubscribed(true); // Update the state to reflect the new subscription status
            } else {
                // Handle errors, such as displaying a message to the user
                console.error('Failed to subscribe.');
            }
        } catch (error) {
            console.error('Error during subscription process:', error);
        }
    };


    const handleGenerate = async () => {
        setErrorMessage('');
        // Validate input URL
        if (!inputValues.inputUrl.trim()) {
            setGeneratedUrl('');
            setLatency('Please enter a URL.');
            return;
        }

        if (inputValues.inputUrl.startsWith('https://snaplink.surge.sh/')) {
            // Extract the part of the URL after the prefix to get the short_url without prefix
            const urlPrefixLength = 'https://snaplink.surge.sh/'.length;
            const shortUrlWithoutPrefix = inputValues.inputUrl.substring(urlPrefixLength);

            try {
                // Call the resolve API
                const resolveResponse = await fetch(`${backendUrl}/api/resolve/${shortUrlWithoutPrefix}`);
                const resolveResult = await resolveResponse.json();

                if (resolveResponse.ok && resolveResult.status === "success") {
                    setInputValues({ ...inputValues, generatedUrl: resolveResult.data });
                    setGeneratedUrl(resolveResult.data)
                    setLatency('');
                } else {
                    setErrorMessage(resolveResult.message || 'Failed to resolve URL.');
                }
            } catch (error) {
                console.error('Error during URL resolving:', error);
                setErrorMessage('An error occurred while resolving the URL. Please try again.');
            }
        } else {
            // Set up request body and API endpoint
            const requestBody = {
                long_url: inputValues.inputUrl,
                email: userEmail // Replace with actual user email
            };
            let apiUrl = `${backendUrl}/api/shorten`;

            // If the user has provided a customized alias, adjust requestBody and apiUrl
            if (inputValues.customized.trim() !== '') {
                requestBody.short_url = `https://snaplink.surge.sh/${inputValues.customized}`;
                apiUrl = `${backendUrl}/api/customizeUrl`;
            }

            try {
                // Make the API call
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                // Parse the JSON response
                const result = await response.json();

                // Check if the response is successful
                if (response.ok && result.status === "success") {
                    // ... successful response handling
                    setInputValues({ ...inputValues, generatedUrl: result.data.shortenedUrl });
                    setGeneratedUrl(result.data.shortenedUrl)
                    if (inputValues.customized.trim() === '') {
                        setLatency(`Latency: ${result.data.latency || ''} ms`);
                    }
                    else {
                        setGeneratedUrl(result.data)
                    }
                } else {
                    // If the response contains a custom error message
                    setErrorMessage(result.message || 'Failed to generate URL.');
                }
            } catch (error) {
                console.error('Error during URL generation:', error);
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };


    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        // You might want to implement some feedback to the user that the text was copied.
    };

    function Footer() {
        return (
            <Box>
                <Flex
                    style={{ backgroundColor: 'rgb(190, 219, 245)' }}
                    bg={"gray.200"}
                    color={"white"}
                    minH={'60px'}
                    h={50}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={"gray.300"}
                    alignItems={"center"}
                    justifyItems={"center"}
                    position="fixed" // or "sticky"
                    bottom={0} // Aligns to the top of the viewport
                    left={0}
                    right={0}
                    width="100vw">
                    <Spacer />
                </Flex>
            </Box>
        )
    }

    function Header() {
        const navigate = useNavigate();
        const isLoggedIn = localStorage.getItem('userEmail') !== null;


        const handleLogout = () => {
            localStorage.removeItem('userEmail'); // Remove the user email from local storage
            localStorage.removeItem('isLoggedin');
            setInputValues({ ...inputValues, customized: '' }); // Clear the customized input
            setGeneratedUrl(''); // Clear any generated URL
            setLatency(''); // Clear latency message
            setErrorMessage(''); // Clear any error message
            navigate('/'); // Optionally refresh the page or navigate as needed
        };


        return (
            <Flex style={{ backgroundColor: 'rgb(190, 219, 245)' }} minH={'80px'} flex={1} w="100vw"
                position="fixed" top={0} left={0} right={0} alignItems={"center"} justifyContent={"flex-end"} px={4}>
                {isLoggedIn ? (
                    <>
                        <Button colorScheme="yellow" onClick={handleSubscribe} isDisabled={isSubscribed}>Subscribe</Button>
                        <Button colorScheme="blue" onClick={() => navigate("/advanced")} isDisabled={!isSubscribed} ml={4}>Advanced</Button>
                        <Button colorScheme="red" onClick={handleLogout} ml={4}>Logout</Button>
                    </>
                ) : (
                    <Button colorScheme="whatsapp" onClick={() => navigate("/login")}>Login</Button>
                )}
            </Flex>
        );
    }


    return (
        <div>
            <Box style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
                <Header />
                <div className="Container">
                    <VStack align={"stretch"}>
                        <Flex spacing="4">
                            <Box mt="-50px">
                                <Image src="/snaplink_logo_no_background.png" height="145"></Image>
                            </Box>
                        </Flex>
                        <Box>
                            <Card width="200" boxShadow="xl" w="620px" style={{ backgroundColor: 'rgb(190, 219, 245)' }} rounded='2xl'>
                                <HStack>
                                    <Box width="14px"></Box>
                                    <CardBody>
                                        <Spacer height='25px'></Spacer>
                                        <Flex spacing="4">
                                            <VStack spacing="18px">
                                                <HStack>
                                                    <Input
                                                        name="inputUrl"
                                                        placeholder='Original/Snap Link Url'
                                                        backgroundColor="white"
                                                        borderColor={"black"}
                                                        type={"text"}
                                                        value={inputValues.inputUrl}
                                                        onChange={handleInputChange}
                                                    />
                                                    <Input
                                                        name="customized"
                                                        width='200px'
                                                        placeholder="Customized"
                                                        disabled={localStorage.getItem('isLoggedin') !== 'true'}
                                                        borderColor={"black"}
                                                        onChange={handleInputChange}
                                                        value={inputValues.customized}
                                                        backgroundColor={localStorage.getItem('isLoggedin') === 'true' ? "white" : "gray.200"}
                                                    />
                                                </HStack>
                                                <Input placeholder='Generated URL' value={generatedUrl} isReadOnly={true} backgroundColor="white" borderColor={"black"} />
                                            </VStack>
                                            <Box width='20px'></Box>
                                            <VStack spacing="18px">
                                                <Button
                                                    style={{ width: '100px' }}
                                                    colorScheme={"whatsapp"}
                                                    onClick={handleGenerate}
                                                >
                                                    {inputValues.inputUrl.startsWith('https://snaplink.surge.sh/') ? 'Resolve' : 'Generate'}
                                                </Button>

                                                <Box style={{ display: 'flex' }}>
                                                    <Button style={{ width: '100px' }} colorScheme={"whatsapp"} onClick={handleCopy}>Copy</Button>
                                                </Box>
                                            </VStack>
                                        </Flex>
                                        <Spacer height='25px'></Spacer>
                                    </CardBody>
                                </HStack>
                            </Card>
                        </Box>
                        <Text pl={"4"} color={errorMessage ? "red.500" : "black"} textAlign="left">
                            {errorMessage || latency}
                        </Text>


                    </VStack>
                </div>
            </Box>
            <Footer />
        </div>
    );
}

export default HomePage;