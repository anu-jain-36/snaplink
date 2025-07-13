import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";


// import './homePage.css';
// import '../App.css';
import {Box, Button, Card, CardBody, Flex, HStack, Image, Input, Spacer, VStack} from "@chakra-ui/react";

const SigninPage = () => {
    const [inputUrl, setInputUrl] = useState('');
    const [customized, setCustomized] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const navigate = useNavigate()
    const handleGenerate = () => {
        // Implement the logic to generate the URL
        // Placeholder logic:
        setGeneratedUrl(`original/snaplk/${customized || inputUrl}`);
    };

    const GoogleAuthCallback = () => {
        const [searchParams] = useSearchParams();
        const navigate = useNavigate();
        const code = searchParams.get('code');

        useEffect(() => {
            if (code) {
                // Optionally send the code back to the backend or handle it directly depending on your security setup
                fetch('https://your-backend.com/api/handle-google-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                })
                    .then(response => response.json())
                    .then(data => {
                        // Handle data received from backend, e.g., user info, tokens, etc.
                        navigate('/dashboard'); // Redirect to dashboard or another page
                    })
                    .catch(error => {
                        console.error('Error processing login data:', error);
                        navigate('/login'); // Redirect back to login on error
                    });
            } else {
                navigate('/login'); // No code present, redirect back to login
            }
        }, [code, navigate]);

        return <div>Loading...</div>;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedUrl);
        // You might want to implement some feedback to the user that the text was copied.
    };

    const handleLogin = () => {
        // to-do: integrate backend login api
        // console.log("test")
        localStorage.setItem('userEmail', "wl86111@rice.edu");
        localStorage.setItem('isLoggedin', 'true');
        navigate('/'); // Navigate to HomePage after login
    };

    const backendUrl = 'https://comp539-team2-backend-dot-rice-comp-539-spring-2022.uk.r.appspot.com';

    const handleLoginWithGoogle = async () => {
        // This function will be triggered when the user clicks the button
        const response = await fetch(`${backendUrl}/login/getGoogleAuthUrl`, { redirect: 'manual' });
        if (response.type === 'opaqueredirect') {
             // Or handle the location in a different way
            window.location.href = response.url;
        } else {
            throw new Error('Failed to retrieve Google login URL');
        }


    };

    function SigninCard() {
        return (
            <Box>
                <Card width="200" boxShadow="xl" w="480px" style={{ backgroundColor: 'rgb(190, 219, 245)' }} rounded='2xl'>
                    <HStack>
                        <CardBody>
                            <Spacer height='25px'></Spacer>
                            <Flex spacing="4">
                                <VStack spacing="18px" flex={1}>
                                    <Input maxWidth={"400px"} placeholder='Username' backgroundColor="white" borderColor={"black"}/>
                                    <Input maxWidth={"400px"} placeholder='Password' backgroundColor="white" borderColor={"black"} type={"password"}/>
                                    <Flex>
                                        <Button style={{ width: '160px' }} colorScheme={"whatsapp"} onClick={handleLogin}>Register / Login</Button>
                                        <Spacer width={"10px"}/>
                                        <Button leftIcon={<FcGoogle />} onClick={handleLoginWithGoogle}>Login With Google</Button>
                                    </Flex>
                                </VStack>
                            </Flex>
                            <Spacer height='12px'></Spacer>
                        </CardBody>
                    </HStack>
                </Card>
            </Box>
        )
    }

    function Footer() {
        return (
            <Box>
                <Flex
                    style={{ backgroundColor: 'rgb(190, 219, 245)' }}
                    bg={"gray.200"}
                    color={"white"}
                    minH={'60px'}
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
        return (
            <Flex display={"flex"} flex={1}>
                <Flex style={{backgroundColor: 'rgb(190, 219, 245)'}}
                     minH={'80px'} flex={1} w="100vw"
                     position="fixed" top={0} left={0} right={0}
                     alignItems={"center"}
                     justifyContent={"flex-end"}
                     px={4}>
                    <Button colorScheme="messenger" onClick={() => {navigate("/");}}>Home</Button>
                </Flex>
            </Flex>
        )
    }

    return (
        <div style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
            <div className="Container">
                <VStack>
                    <Header/>
                    <Flex spacing="4">
                        <Box mt="-50px">
                            <Image src="/snaplink_logo_no_background.png" height="145"></Image>
                        </Box>
                    </Flex>
                    <SigninCard/>
                    <Footer/>
                </VStack>
            </div>
        </div>
    );
}

export default SigninPage;