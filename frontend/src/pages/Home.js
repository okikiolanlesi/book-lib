import React, { useContext, useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { UserContext } from "../contexts/userContext";
import CreateBook from "../components/CreateBook";
import axios from "../axiosLib";
import Alert from "../components/Alert";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const [bookList, setBookList] = useState("all");
  const [createBook, setCreateBook] = useState(false);
  const [alert, setAlert] = useState({
    showAlert: false,
    type: "",
    message: "",
  });
  const [totalBooks, setTotalBooks] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await axios.get(
        `${
          bookList === "all"
            ? `/books?page=${page}&limit=10`
            : `/books/mybooks?page=${page}&limit=10`
        }`,
        {
          withCredentials: true,
        }
      );
      setBooks(res.data.data.books);
      setTotalBooks(parseInt(res.data.data.totalBooks));
    };
    fetchBooks();
  }, [bookList, page]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser) {
      setUser(localUser);
    } else {
      // window.location.href = "/auth";
    }
  }, [setUser]);
  const fakeUser = {
    id: 1,
  };
  // const [user, setUser] = useState(null);
  const booksMap = books.map((book) => {
    return (
      <BookCard
        key={book.id}
        user={user ? user : fakeUser}
        book={book}
        openMyBooks={() => setBookList("my")}
      />
    );
  });
  const logout = async () => {
    try {
      await axios.get("/users/logout", {
        withCredentials: true,
      });

      await setAlert({
        showAlert: true,
        type: "success",
        message: "Logged out successfully",
      });

      await setTimeout(() => {
        setAlert({ showAlert: false, type: "", message: "" });
      }, 15000);

      await localStorage.removeItem("user");

      setUser(null);

      window.location.href = "/auth";
    } catch (err) {
      console.log(err);
      setAlert({
        showAlert: true,
        type: "error",
        message: "Unable to logout",
      });
      await setTimeout(() => {
        setAlert({ showAlert: false, type: "", message: "" });
      }, 1500);
    }
  };
  return (
    <div>
      {alert.showAlert && <Alert type={alert.type} message={alert.message} />}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center border-2 px-4 py-6 sm:px-10">
        <div className="flex space-x-4 ">
          <h2
            className={`${
              bookList === "all" ? "border-b-4 border-blue-800" : null
            } cursor-pointer h-10`}
            onClick={() => {
              setBookList("all");
              setPage(1);
            }}
          >
            All Books
          </h2>
          {user ? (
            <h2
              className={`${
                bookList === "my" ? "border-b-4 border-blue-800" : null
              } cursor-pointer h-10`}
              onClick={() => {
                setBookList("my");
                setPage(1);
              }}
            >
              My Books
            </h2>
          ) : null}
        </div>
        <div>
          {user ? (
            <div className="flex space-x-2">
              <div
                className="cursor-pointer mb-4 sm:mb-0 text-sm sm:text-md sm:px-4 px-3 py-3 border-2 transition ease-in-out duration-200 text-blue-800 hover:bg-blue-800 hover:text-white border-blue-800 rounded-md"
                onClick={() => setCreateBook(true)}
              >
                Create New Book
              </div>
              <div
                className="cursor-pointer mb-4 sm:mb-0 text-sm sm:text-md sm:px-4 px-3 py-3 border-2 transition ease-in-out duration-200 text-blue-800 hover:bg-blue-800 hover:text-white border-blue-800 rounded-md"
                onClick={logout}
              >
                Log Out
              </div>
            </div>
          ) : (
            <div
              className="cursor-pointer mb-4 sm:mb-0 px-6 py-4 border-2 transition ease-in-out duration-200 text-blue-800 hover:bg-blue-800 hover:text-white border-blue-800 rounded-md"
              onClick={() => (window.location.href = "/auth")}
            >
              Sign In
            </div>
          )}
        </div>
      </div>
      {createBook && (
        <CreateBook
          close={() => setCreateBook(false)}
          openMyBooks={() => setBookList("my")}
        />
      )}
      <div className="my-4 sm:my-8 mx-2 sm:mx-10 ">
        {books.length > 0 ? (
          booksMap
        ) : (
          <h1 className=" text-4xl text-gray-700 font-semibold">No Books</h1>
        )}
      </div>
      <div className="mb-8">
        {totalBooks > 0 && (
          <div className="flex justify-center items-center space-x-4">
            {page > 1 && (
              <div
                className="cursor-pointer  px-2 py-1 text-sm sm:text-lg sm:px-4 sm:py-2 border-2 transition ease-in-out duration-200 text-blue-800 hover:bg-blue-800 hover:text-white border-blue-800 rounded-md"
                onClick={() => setPage(page - 1)}
              >
                Previous
              </div>
            )}
            <div className="text-sm sm:text-xl  ">
              Page {page} of {Math.ceil(totalBooks / 10)}
            </div>
            {page < totalBooks / 10 && (
              <div
                className="cursor-pointer px-2 py-1 text-sm sm:text-lg sm:px-4 sm:py-2 border-2 transition ease-in-out duration-200 text-blue-800 hover:bg-blue-800 hover:text-white border-blue-800 rounded-md"
                onClick={() => setPage(page + 1)}
              >
                Next
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
