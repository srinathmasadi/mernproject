import { useDisclosure } from '@chakra-ui/hooks';
import {Button} from '@chakra-ui/button';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    Input,
    Box,
    useToast
  } from '@chakra-ui/react'
import React,{useState} from 'react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const[loading, setLoading] = useState(false);

    const toast = useToast();

    const {user, chats, setChats} =ChatState();

    const handleSearch = async(search) => {
        if(!search){
          toast({
            title:"Please Enter Something",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top-left"
          });
          return;
        }
        try {
          setLoading(true);
          const config = {
            headers:{
              Authorization:`Bearer ${user.token}`,
            },
          };
          axios.get(`/user/getallusers?search=${search}`,config)
          .then((response)=>{
            if(response.status===200){
              setLoading(false);
              setSearchResult(response.data);
            }
          })
        } catch (error) {  
          toast({
            title:"Error Occured!",
            description:"Failed to Load the Search Results",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          }); 
        }
      };

    const handleSubmit = async()=>{
        if(!groupChatName || !selectedUsers) {
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }

        try {
            setLoading(true);
          const config = {
            headers:{
              Authorization:`Bearer ${user.token}`,
            },
          };

          await axios.post(`/chat/groupchat`,{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map(u=>u._id))
          },config).then((response)=>{
            setChats([response.data,...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
          })
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        }
    }
    const handleGroup = async(userToAdd)=>{
        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
          }

          setSelectedUsers([...selectedUsers,userToAdd])
    }

    const handleDelete = async(delUser)=>{
        setSelectedUsers(
            selectedUsers.filter((sel)=>sel._id !== delUser._id)
        );
    }
  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"
        >
          Create Group Chat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input 
                placeholder='Chat Name' 
                mb={3}
                onChange={(e)=>setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
          <Input 
                placeholder='Add Users eg:Srinath, Sarvesh, Priyanka' 
                mb={1}
                onChange={(e)=>handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u,index)=>(
                    <UserBadgeItem key={index} user={u}
                        handleFunction={()=>handleDelete(u)}
                    />
                ))}
           </Box>
         
            {loading?<div>loading</div>:(
                searchResult?.slice(0,4).map((user,index)=>(
                    <UserListItem key={index} user={user}
                    handleFunction={()=>handleGroup(user)}/>
                ))
            )}          
        </ModalBody>
        <ModalFooter>
          <Button  colorScheme="blue" onClick={handleSubmit}>
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal