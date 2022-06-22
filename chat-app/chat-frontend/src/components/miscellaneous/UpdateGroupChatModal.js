import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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

          await axios.put(`/chat/pulluser`,{
           chatId:selectedChat._id,
           userId:user1._id,
          },config).then((response)=>{
                user1._id === user._id ? setSelectedChat() : setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                fetchMessages();
                setLoading(false);
                // toast({
                //     title:"User removed from group!",
                //     status:"success",
                //     duration:5000,
                //     isClosable:true,
                //     position:"top-right"
                //   });
          })
      } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRename = async()=>{
    if(!groupChatName) return;

    try {
        setRenameLoading(true);
        const config = {
            headers:{
              Authorization:`Bearer ${user.token}`,
            },
          };

          await axios.put(`/chat/renamegroup`,{
            chatId:selectedChat._id,
            chatName:groupChatName
          },config).then((response)=>{
                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                toast({
                    title:"GroupName Updated Successfully!",
                    status:"success",
                    duration:5000,
                    isClosable:true,
                    position:"top-right"
                  });
                setRenameLoading(false);
          })
    } catch (error) {
        toast({
            title:"Error Occured",
            status:error.message,
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          });
          setRenameLoading(false);
    }
    setGroupChatName("");
  };
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
  const handleAddUser = async(user1)=>{
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
          title: "User Already in group!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      if (selectedChat.groupAdmin._id !== user._id) {
        toast({
          title: "Only admins can add someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
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

          await axios.put(`/chat/addtogroup`,{
           chatId:selectedChat._id,
           userId:user1._id,
          },config).then((response)=>{
                setSelectedChat(response.data);
                setFetchAgain(!fetchAgain);
                setLoading(false)
                // toast({
                //     title:"User added to group!",
                //     status:"success",
                //     duration:5000,
                //     isClosable:true,
                //     position:"top-right"
                //   });
          })
      } catch (error) {
        toast({
            title:"Error Occured!",
            description:"Failed to add user",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left"
          }); 
      }
      
  };

  return (
    <>
      <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily="Work sans"
            dispaly="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pg={3}>
                {selectedChat.users.map((u,index)=>(
                    <UserBadgeItem key={index}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={()=>handleRemove(u)}/>
                ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )} 
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal