'use client'

import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { signInWithPopup, auth, provider} from '@/firebase'
import { useRouter } from 'next/navigation'
const page = () => {

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res.user);
      router.push('/inventory');
    } catch (e){
      console.error(e);
    }
  } 


  return (
    <Box
      width="100vw"
      height="100vh"
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection="column"
      gap={4}
      bgcolor="#921A40"
      >
      <Typography variant='h3' color={"white"}>Inventory Tracker</Typography>
        <Button variant="contained" color="primary" onClick={handleLogin}>Log In</Button>
    </Box>
  )
}

export default page