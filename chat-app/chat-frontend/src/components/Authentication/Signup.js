import React,{useState} from 'react';
import { Button } from "@chakra-ui/button";
import {VStack} from '@chakra-ui/layout';
import {Input, InputGroup, InputRightElement} from '@chakra-ui/input'
import {FormControl,FormLabel} from '@chakra-ui/form-control'
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/toast";
import axios from 'axios';
const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const history = useHistory();


    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);

    const postDetails=(pics)=>{
        setLoading(true);
        if(pics === undefined) {
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            })
            return;
        }
        if(pics.type==="image/jpeg"|| pics.type==="image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dwz1n2y8c");
            fetch("https://api.cloudinary.com/v1_1/dwz1n2y8c/upload",{
                method:'post',
                body:data,
            }).then((res)=>res.json())
            .then(data=>{
                setPic(data.url.toString());
                console.log(data.url.toString());
                setLoading(false);
            }).catch((e)=>{
                console.log(e);
                setLoading(false);
            }); 
        } else{
            toast({
                title:"Please Select an Image!",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            setLoading(false);
            return
        }
    }

    const submitHandler = () => {
      setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
           
          toast({
              title: "Please fill all the required fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast({
              title: "Passwords Do Not Match",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
            return;
        }
        axios.post("http://localhost:5000/user/register", {
          email,name,password,pic
        }).then((response)=> {
          if(response.status === 200) {
            toast({
                    title: "Registration Successful",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                localStorage.setItem("userInfo", JSON.stringify(response.data));
                setLoading(false);
                history.push("/chats");
          } 
          console.log(response.data);
        }).catch((e)=> {
          toast({
            title: "Error Occured",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        })
      }
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup