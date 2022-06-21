import { Box, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React,{useEffect, useState} from 'react'
import { ChatState } from '../context/ChatProvider';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FormControl } from '@chakra-ui/form-control';
import { getSender,getSenderFull } from '../Config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css';
import ScrollableChat from './ScrollableChat';

const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const {user, selectedChat, setSelectedChat}=ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState([]);

    const toast = useToast();

    const fetchMessages = async()=>{
        if(!selectedChat) return;

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            setLoading(true);
            await axios.get(`http://localhost:5000/message/allmessages/${selectedChat._id}`,config).then((response)=>{
                console.log(response.data);
                setMessages(response.data);
                setLoading(false);
            })

        } catch (error) {
            toast({
                title:"Error while fetching message",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
              });
        }
    }

    useEffect(()=>{
        fetchMessages();
    },[selectedChat]);

    const sendMessage = async(e)=>{
        if(e.key === "Enter" && newMessage){
            try {
                const config={
                    headers:{
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                await axios.post(`http://localhost:5000/message/send`,{
                    content:newMessage,
                    chatId:selectedChat._id
                },config).then((response)=>{
                    console.log(response.data);
                    setMessages([...messages,response.data]);
                })
            } catch (error) {
                toast({
                    title:"Error While sending message",
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom-left"
                  });
            }
        }
    };
    const typingHandler = async(e)=>{
        setNewMessage(e.target.value);
    };
  return (
    <>
        {
            selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            // display='flex' alignItems='space.nhu555\\'
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user,selectedChat.users).toUpperCase()}
                                    <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                                </>
                            ):
                                (   <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal 
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                                )
                        }
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading?(
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages}/>
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Enter a message..." 
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                        </FormControl>
                    </Box>
                </>
            ):(
                <Box display="flex" alignItems="center" justifyContent="center" h='100%'>
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )
        }
        
    </>
  )
}

export default SingleChat