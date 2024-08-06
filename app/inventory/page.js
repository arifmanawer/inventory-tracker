'use client'
import { useEffect, useState } from 'react'
import { Box, Button, Modal , Stack, TextField, Typography } from '@mui/material'
import { collection, getDocs, query, setDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { firestore, signOut, auth, onAuthStateChanged } from '@/app/firebase/firebase';

const style = {
  transform: 'translate(-50%, -50%)',
};

const hoverUp = {
  "&:hover": {
    transform: 'translateY(-5px)',
    transition: 'transform 0.3s',
  },
};

const buttonHover = {
  "&:hover": {
    backgroundColor: '#921A40',
    color: 'white',
  },
};

const removeButton = {
  "&:hover": {
    backgroundColor: '#921A40',
    color: 'white',
  },
};

const textfieldCustom = {
  width: {base:"50%",md:'80%'},
  color: 'white',
};

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItem] = useState('');
  const [filter, setFilter] = useState('');

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
        getInventory(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getInventory = async (uid) => {
    const snapshot = query(collection(firestore, 'users', uid, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (uid, item) => {
    const docRef = doc(firestore, 'users', uid, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1
      });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    getInventory(uid);
  };

  const removeItem = async (uid, item) => {
    const docRef = doc(firestore, 'users', uid, 'inventory', item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1
        });
      }
    }
    await getInventory(uid);
  };

  useEffect(() => {
    if (user) {
      getInventory(user.uid);
    }
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) => 
    name.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display='flex'
      justifyContent='center'
      alignItems='center'
      flexDirection="column"
      gap={2}
      bgcolor="#921A40"
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute" top="50%" left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display={"flex"}
          flexDirection={"column"}
          gap={3}
          sx={style}
        >
          <Typography variant='h5'>Add Item</Typography>
          <Stack direction="row" width="100%" spacing={2}>
            <TextField id="filled-basic" variant="filled" fullWidth
              value={item} onChange={(e) => {
                setItem(e.target.value);
              }}
            />
            <Button variant="outlined" color="primary" onClick={() => {
              if (user) {
                addItem(user.uid, item);
              }
              setItem('');
              handleClose();
            }}>Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        padding={4}
        width="80%"
        height="100px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        borderRadius={4}
      >
        <Typography variant='h3' color={"white"}>Inventory Tracker</Typography>
      </Box>
      <Box
        borderRadius={6}
        padding={4}
        width="80%"
        height="50px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        bgcolor={"#D9ABAB"}
      >
        <TextField 
          id="standard-basic" 
          label="Filter" 
          variant="standard" 
          sx={textfieldCustom} 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Box height={{md:"40px"}}>
          <Button variant='text' sx={buttonHover} onClick={handleOpen}>
            <Typography color={"white"} variant='h6'>Add Item</Typography>
          </Button>
        </Box>
      </Box>
      <Box
        width="80%"
        height="400px"
        bgcolor={"#D9ABAB"}
        borderRadius={3}
        overflow={"auto"}
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            display='flex'
            justifyContent='space-between'
            flexDirection="row"
            borderRadius={3}
            key={name}
            margin={2}
            boxShadow={3}
            sx={hoverUp}
            height="60px"
            bgcolor={"#C75B7A"}
            color={"white"}
          >
            <Box
              width="40%"
              display='flex'
              justifyContent="center"
              alignItems="center"
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="space-evenly" width="50%">
              <Box
                height="60px"
                width="100px"
                display='flex'
                justifyContent="center"
                alignItems="center"
              >
                {quantity}
              </Box>
              <Button 
                variant='text'
                sx={buttonHover}
                onClick={() => addItem(user.uid, name)}
                >
                <Box
                  display='flex'
                  justifyContent="center"
                  alignItems="center"
                  color={"white"}
                >
                  Add
                </Box>
              </Button>
              <Button 
                variant='text'
                sx={removeButton}
                onClick={() => removeItem(user.uid, name)}
                >
                <Box
                  display='flex'
                  justifyContent="center"
                  alignItems="center"
                  color={"white"}
                >
                  Remove
                </Box>
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
      <Button variant='contained' color='primary' onClick={handleSignOut}><Box>Log Out</Box></Button>
    </Box>
  );
}
