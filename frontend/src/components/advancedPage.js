import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Box, Button, Flex, Spacer, VStack, Grid, GridItem, SimpleGrid, Text, Table,
    Thead, Tbody, Tr, Th, Td, Image, Input
} from "@chakra-ui/react";
import * as api from '../api/featureApi';


const AdvancedPage = () => {
    const navigate = useNavigate();
    const email = localStorage.getItem('userEmail');
    // const email = 'tk57@rice.edu';
    // const email = 'aj103@rice.edu';
    // const tokens = 'XXXX'; // Replace with your logic to get the tokens

    const [tokens, setTokens] = useState('Loading tokens...');


    const handleLogout = () => {
        localStorage.removeItem('isLoggedin');
        navigate('/');
    };

    // API Integration
    const [infoData, setInfoData] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    const handleInfoReceived = (data) => {
        // console.log('Received info data:', data)
        setInfoData(data);

        setHistoryData([]);  // Clear history data when new info data is received
    };

    const handleHistoryReceived = (history) => {
        setHistoryData(history);
        setInfoData(null);  // Clear info data when new history data is received
    };

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const tokenResponse = await api.getTokens(email); // Assuming getTokens API needs email
                console.log('Tokens:', tokenResponse)
                setTokens(tokenResponse); // Update the tokens state with the fetched tokens
            } catch (error) {
                console.error('Failed to fetch tokens:', error);
                setTokens('Failed to load tokens');
            }
        };

        fetchTokens();
    }, []); 

    const fetchTokens = async () => {
        try {
            const tokenResponse = await api.getTokens(email);
            setTokens(tokenResponse);
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
            setTokens('Failed to load tokens');
        }
    };

    function Header() {
        return (
            <Flex display={"flex"} flex={1}>
                <Flex style={{ backgroundColor: 'rgb(190, 219, 245)' }}
                    minH={'80px'} flex={1} w="100vw"
                    position="fixed" top={0} left={0} right={0}
                    alignItems={"center"}
                    justifyContent={"flex-end"}
                    px={4}>
                    <Button colorScheme="messenger" onClick={() => { navigate("/"); }}>Home</Button>
                    <Button colorScheme="red" onClick={handleLogout} marginLeft={4}>Logout</Button>

                </Flex>
            </Flex>
        )
    }

    const Footer = () => (
        <Flex
            backgroundColor='rgb(190, 219, 245)'
            minHeight='60px'
            alignItems="center"
            justifyContent="center"
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            zIndex={1}
        >
            {/* You can add footer content here */}
        </Flex>
    );

    const GreetingCard = ({ onInfoReceived, onHistoryReceived }) => {
        const [url, setUrl] = useState(''); // State to hold the input URL

        const [apiResponse, setApiResponse] = useState(null);

        const handleUrlChange = (event) => {
            setUrl(event.target.value);
        };

        // Unique function for each button
        const handleGetInfoClick = () => {
            const fetchData = async () => {
                try {
                    const response = await api.getInfo(email, url);
                    console.log('Response:', response);
                    onInfoReceived(response)
                } catch (error) {
                    console.error('Error fetching information:', error);
                } finally {
                    fetchTokens();  // Update tokens after the API call
                }
            };
            fetchData();
        };

        const handleGetHistoryClick = () => {
            const fetchData = async () => {
                try {
                    const response = await api.getHistory(email);
                    onHistoryReceived(response)
                } catch (error) {
                    console.error('Error fetching information:', error);
                } finally {
                    fetchTokens();  // Update tokens after the API call
                }
            };
            fetchData();
        };

        const handleRenewClick = () => {
            console.log('Renew');
            const fetchData = async () => {
                try {
                    const response = await api.renewExpiration(email);
                    console.log(response)
                } catch (error) {
                    console.error('Error renewing', error);
                }
            };
            fetchData();
        };

        const handleReportClick = () => {
            console.log('Mark as spam');
            const fetchData = async () => {
                try {
                    const response = await api.markSpam(email, url);
                    console.log(response)
                } catch (error) {
                    console.error('Error marking as spam:', error);
                }
            };
            fetchData();
        };

        const handleResetTokenClick = () => {
            console.log('Reset Token');
            const fetchData = async () => {
                try {
                    const response = await api.resetTokens(email);
                    console.log(response)
                } catch (error) {
                    console.error('Error reseting tokens:', error);
                } finally {
                    fetchTokens();  // Update tokens after the API call
                }
            };
            fetchData();
        };

        const handleRemoveSpamClick = () => {
            console.log('Remove Spam');
            const fetchData = async () => {
                try {
                    const response = await api.removeSpam(email, url);
                    console.log(response)
                } catch (error) {
                    console.error('Error removing spam:', error);
                }
            };
            fetchData();
            // window.location.reload();
        };

        const handleDeleteClick = () => {
            console.log('Delete');
            const fetchData = async () => {
                try {
                    const response = await api.deleteShortUrl(email, url);
                    console.log(response)
                } catch (error) {
                    console.error('Error deleting', error);
                } finally {
                    fetchTokens();  // Update tokens after the API call
                }
            };
            fetchData();
        };

        return (
            <VStack
                backgroundColor='white'
                padding={5}
                borderRadius='lg'
                boxShadow='base'
                alignItems='flex-start'
                width="full"
            >
                <Text fontSize='lg'>Hi, {email}</Text>
                <Text>Your Tokens: {tokens}</Text>
                <Input
                    placeholder="Enter your URL here"
                    size="md"
                    mt={3}
                    value={url}
                    onChange={handleUrlChange}
                />
                <SimpleGrid columns={2} spacing={2} width="full">
                    <Button colorScheme='blue' onClick={handleGetInfoClick}>Get Info</Button>
                    <Button colorScheme='blue' onClick={handleGetHistoryClick}>Get History</Button>
                </SimpleGrid>
                <Box width="full" textAlign="center" my={4}>
                    <Text fontSize='xl' fontWeight='bold'>Advanced Features</Text>
                </Box>

                <SimpleGrid columns={2} spacing={2} width="full">
                    <Button colorScheme='green' onClick={handleRenewClick}>Renew</Button>
                    <Button colorScheme='red' onClick={handleReportClick}>Report</Button>
                    <Button colorScheme='green' onClick={handleResetTokenClick}>Reset Token</Button>
                    <Button colorScheme='red' onClick={handleRemoveSpamClick}>Remove Spam</Button>
                </SimpleGrid>
                <Button colorScheme='red' width="full" marginTop={4} onClick={handleDeleteClick}>Delete</Button>
            </VStack>
        );
    };



    const Scoreboard = ({ infoData, historyData }) => {
        console.log("Rendering Scoreboard with", { infoData, historyData });

        let hasHistoryData = historyData && historyData.length > 0;
        let hasInfoData = infoData && Object.keys(infoData).length > 0;

        const tdStyle = {
            wordBreak: 'break-word',  // Breaks the word at any character to prevent overflow
            maxWidth: '150px'         // Adjust maxWidth as needed to fit your design
        };

        return (
            <VStack backgroundColor='white' padding={5} borderRadius='lg' boxShadow='base' alignItems='flex-start' width="full">
                <Text fontSize='lg'>Scoreboard</Text>
                <Table variant='simple' width="full">
                    <Thead>
                        <Tr>
                            <Th>Tag</Th>
                            <Th>Value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {hasInfoData && !hasHistoryData && (
                            <>
                                <Tr>
                                    <Td>Spam Status</Td>
                                    <Td style={tdStyle}>{infoData.spam_status || 'N/A'}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Expires At</Td>
                                    <Td style={tdStyle}>{infoData.expires_at || 'N/A'}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Created At</Td>
                                    <Td style={tdStyle}>{infoData.created_at || 'N/A'}</Td>
                                </Tr>
                                <Tr>
                                    <Td>Long URL</Td>
                                    <Td style={tdStyle}>{infoData.long_url || 'N/A'}</Td>
                                </Tr>
                            </>
                        )}
                        {hasHistoryData && !hasInfoData && (
                            historyData.map((url, index) => (
                                <Tr key={index}>
                                    <Td>URL {index + 1}</Td>
                                    <Td style={tdStyle}>{url}</Td>
                                </Tr>
                            ))
                        )}
                        {!hasHistoryData && !hasInfoData && (
                            <Tr>
                                <Td colSpan={2}>No data available</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </VStack>
        );
    };



    return (
        <Box bg='rgb(245, 245, 245)' minHeight="100vh">
            <Header />
            <VStack spacing={8} paddingY={20} alignItems="center" width="full">
                <Image src="/snaplink_logo_no_background.png" height="145px" mt="100px" />
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} paddingX={4} width="full" maxW="4xl">
                    <GreetingCard onInfoReceived={handleInfoReceived} onHistoryReceived={handleHistoryReceived} />
                    <Scoreboard infoData={infoData} historyData={historyData} />
                </SimpleGrid>
            </VStack>
            <Spacer />
            <Footer />
        </Box>
    );
};

export default AdvancedPage;
