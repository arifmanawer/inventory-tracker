import { Box, Button, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const page = () => {
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
      <Link href="/inventory">
        <Button variant="contained" color="primary">Log In</Button>
      </Link>
    </Box>
  )
}

export default page