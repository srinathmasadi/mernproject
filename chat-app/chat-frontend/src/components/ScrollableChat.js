import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/ChatLogics';
import { Avatar, Tooltip } from '@chakra-ui/react';

const ScrollableChat = ({messages}) => {
    const { user }=ChatState()
  return (
    <ScrollableFeed>
        {messages && messages.map((m,index)=>(
            <div style={{display:"flex"}} key={index}>
               {
                (
                    isSameSender(messages,m,index,user._id)
                    || isLastMessage(messages,index,user._id)
                ) && (
                    <Tooltip
                        label={m.sender.name}
                        placement="bottom-start"
                        hasArrow 
                    >
                        <Avatar 
                            mt="7px"
                            mr={1}
                            size='sm'
                            cursor="pointer"
                            name={m.sender.name}
                            src={m.sender.pic}
                        />
                    </Tooltip>
                )
               } 
               <span style={{backgroundColor:`${
                    m.sender._id===user._id ? "#B9F5D0":"#BEE3F8"
                }`,
                borderRadius:"20px",
                paddin:"5px 15px",
                maxWidth:"75%",
                marginLeft:isSameSenderMargin(messages, m, index, user._id),
                marginTop:isSameUser(messages, m, index, user._id) ? 3:10,
                }}>
                    {m.content}
               </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat