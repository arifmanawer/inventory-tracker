'use client'

import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { signInWithPopup, auth, provider} from '@/app/firebase/firebase'
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

  console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
  
  console.log('Firebase Config:', firebaseConfig);
  
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