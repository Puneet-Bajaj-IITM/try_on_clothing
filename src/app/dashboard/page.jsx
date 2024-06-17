"use client";
import AppLayout from "@/Layout/appLayout";
import LoadingIndicator from "@/components/loadingIndicator";
import { app } from "@/config/config";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaEye, FaFile } from "react-icons/fa";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth(app);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedModelImage, setSelectedModelImage] = useState(null);
  const [selectedGarmentImage, setSelectedGarmentImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [category, setCategory] = useState();
  const [resultImage, setResultImage] = useState();

  async function handleSignOut() {
    try {
      signOut(auth).then(() => {
        router.push("/login");
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e) => {
    setSelectedModelImage(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  const handleModelImageClick = (src) => {
    console.log(src);
    setSelectedModelImage(src);
  };

  const handleGarmentImageClick = (src) => {
    console.log(src);
    setSelectedGarmentImage(src);
  };

  const RenderButton = useCallback(() => {
    const inputRef = useRef();
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          mr={2}
          rounded={"md"}
          onClick={() => {
            console.log(inputRef.current);
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
          leftIcon={<FaFile />}
        >
          <Text fontSize={"14px"} fontWeight="400">
            Browse
          </Text>
          <input
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            onChange={(e) => handleFileChange(e)}
          ></input>
        </Button>
        {selectedFile && <Text>{selectedFile[0]?.name}</Text>}
      </div>
    );
  }, [selectedFile]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("category", Number(category));

    if (selectedModelImage instanceof File) {
      formData.append("model_image", selectedModelImage);
    } else {
      const response = await fetch(selectedModelImage);
      const blob = await response.blob();
      const file = new File([blob], "model_image.jpg", { type: "image/jpeg" });
      formData.append("model_image", file);
    }

    if (selectedGarmentImage) {
      const response = await fetch(selectedGarmentImage);
      const blob = await response.blob();
      const file = new File([blob], "garment_image.jpg", {
        type: "image/jpeg",
      });
      formData.append("cloth_image", file);
    }

    axios
      .post(process.env.NEXT_PUBLIC_BACKEND, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        console.log(response.data);
        console.log(url);
        setResultImage(url);
       setLoading(false)

      })
      .catch((error) => {
        console.error("There was an error uploading the files!", error);
        setLoading(false)
      });
  };

  return loading ? (
    <LoadingIndicator />
  ) : (
    <AppLayout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          alignItems: "flex-end",
          padding:'20px'
        }}
      >
        <Button colorScheme={"blue"} onClick={() => handleSignOut()}>
          Logout
        </Button>
        <Button mt={2} colorScheme={"blue"} onClick={onOpen}>
          Try Model
        </Button>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        {resultImage ? <Image width={"300px"} src={resultImage} /> : null}
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RenderButton />
            <Text>or select demo model from below list</Text>

            <HStack gap={2}>
              {[...Array(8).keys()].map((index) => (
                <Box
                  style={{
                    border:
                      selectedModelImage == `/model/model_${index + 1}.png`
                        ? "1px solid"
                        : "0px solid",
                  }}
                  key={index}
                  _hover={{ cursor: "pointer" }}
                  onClick={() =>
                    handleModelImageClick(`/model/model_${index + 1}.png`)
                  }
                >
                  <Image width={"70px"} src={`/model/model_${index + 1}.png`} />
                </Box>
              ))}
            </HStack>

            <Select mt={2} mb={2}
              placeholder="Select Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="0">Upper Body Dress</option>
              <option value="1">Lower Body Dress</option>
              <option value="2">Full Body Dress</option>
            </Select>
            {category && (
              <HStack gap={2}>
                {[...Array(8).keys()].map((index) => (
                  <Box
                    style={{
                      border:
                        selectedGarmentImage ==
                        `/garment/${
                          category == "0"
                            ? `upper (${index + 1})`
                            : category == "1"
                            ? `lower (${index + 1})`
                            : `full (${index + 1})`
                        }.jpg`
                          ? "1px solid"
                          : "0px solid",
                    }}
                    key={index}
                    _hover={{ cursor: "pointer" }}
                    onClick={() =>
                      handleGarmentImageClick(
                        `/garment/${
                          category == "0"
                            ? `upper (${index + 1})`
                            : category == "1"
                            ? `lower (${index + 1})`
                            : `full (${index + 1})`
                        }.jpg`
                      )
                    }
                  >
                    <Image
                      width={"100px"}
                      src={`/garment/${
                        category == "0"
                          ? `upper (${index + 1})`
                          : category == "1"
                          ? `lower (${index + 1})`
                          : `full (${index + 1})`
                      }.jpg`}
                    />
                  </Box>
                ))}
              </HStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                setLoading(true)
                onClose();
                handleUpload();
              }}
              variant="ghost"
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AppLayout>
  );
}
