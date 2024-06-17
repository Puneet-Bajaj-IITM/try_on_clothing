"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "@/config/config";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  VStack,
  HStack,
  Image,
  useToast,
  useTheme,
  Heading,
  Flex,
  Stack,
  Checkbox,
  useColorModeValue,
  Divider,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import LoadingIndicator from "@/components/loadingIndicator";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import AppLayout from "@/Layout/appLayout";

export default function Page() {
    const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const theme = useTheme();

  const auth = getAuth(app);

 

  useEffect(() => {
    setIsEmailValid(email.includes("@") && email.includes(".com"));
    setIsPasswordValid(password.length > 7);
  }, [email, password]);

  const handleLogin = async () => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        setEmail("");
        setPassword("");
        toast({
            title: "Login successful",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
      
    } catch (error) {
      toast({
        title: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      
    } finally {
        setLoading(false)
    }
  };

  return (
    loading ? <LoadingIndicator /> :
    <AppLayout>
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          {/* <Image src="/senfengLogo.png" alt="Logo" boxSize="100px" /> */}
          <Heading
            fontSize={"4xl"}
            color={useColorModeValue("gray.700", "gray.300")}
          >
            Sign in to your account
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input value={email} onChange={(e => setEmail(e.target.value))} type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input value={password} onChange={(e)=> setPassword(e.target.value)} type={showPassword ? "text" : "password"} />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{ bg: "blue.500" }}
                isDisabled={!isEmailValid || !isPasswordValid}
                onClick={()=>{
                    setLoading(true)
                    handleLogin()
                }}
                isLoading={loading}
                size="lg"
                w="full"
              >
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Box>
        <Stack align={"center"}>
          <Text>
            Need an account?{" "}
            <Button
              variant="link"
              color={"blue.400"}
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Text>
        </Stack>
      </Stack>
    </Flex>
    </AppLayout>
  );
}
