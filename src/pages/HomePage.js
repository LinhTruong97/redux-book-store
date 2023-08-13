import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import SearchForm from "../components/SearchForm";
import { FormProvider } from "../form";
import { useForm } from "react-hook-form";
import { Container, Alert, Box, Card, Stack, CardMedia, Typography, CardContent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../features/book/bookSlice";



const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const HomePage = () => {

  const dispatch = useDispatch();
  const status = useSelector((state) => state.books.status);
  const books = useSelector((state) => state.books.books);
  const errorMessage = useSelector((state) => state.books.error);

  const [pageNum, setPageNum] = useState(1);
  const [query, setQuery] = useState("");

  const totalPage = 10;
  const limit = 10;

  useEffect(() => {
    dispatch(fetchBooks({ pageNum, limit: 10, query }))
  }, [dispatch, pageNum, limit, query]);

  const navigate = useNavigate()
  const handleClickBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  //--------------form
  const defaultValues = {
    searchQuery: ""
  };
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    setQuery(data.searchQuery);
  };

  return (
    <Container>
      <Stack sx={{ display: "flex", alignItems: "center", m: "2rem" }}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>Book Store</Typography>
        {status === "Failed" && <Alert severity="error">{errorMessage}</Alert>}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <SearchForm />
          </Stack>
        </FormProvider>
        <PaginationBar
          pageNum={pageNum}
          setPageNum={setPageNum}
          totalPageNum={totalPage}
        />
      </Stack>
      <div>
        {status === "loading" ? (
          <Box sx={{ textAlign: "center", color: "primary.main" }} >
            <ClipLoader color="inherit" size={150} loading={true} />
          </Box>
        ) : (
          <Stack direction="row" spacing={2} justifyContent="space-around" flexWrap="wrap" rowGap={4} sx={{ marginBottom: '20px' }}>
            {books.map((book) => (
              <Card
                key={book.id} onClick={() => handleClickBook(book.id)}
                sx={{
                  width: "12rem",
                  height: "25rem",

                }}>
                <CardMedia
                  component="img"
                  image={`${BACKEND_API}/${book.imageLink}`}
                  alt={`${book.title}`}
                  sx={{ height: '300px', objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h7" component="div">
                    {`${book.title}`}
                  </Typography>

                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
