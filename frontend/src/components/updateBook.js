import React, { useState, useEffect } from "react";
import axios from "../axiosLib";
import Alert from "./Alert";

const UpdateBook = ({ close, openMyBooks, book }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: book.title,
    body: book.body,
    isbn: book.isbn,
    category: book.category,
  });
  const [buttonText, setButtonText] = useState("Update Book");
  const [isbnValidation, setIsbnValidation] = useState({ valid: true });

  useEffect(() => {
    axios
      .get("/categories")
      .then((res) => setCategories(res.data.data.categories));
  }, []);

  const [alert, setAlert] = useState({
    showAlert: false,
    type: "",
    message: "",
  });
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isbnValidation.valid) {
        setButtonText("Updating Book...");
        await axios.patch(`/books/${book._id}`, formData, {
          withCredentials: true,
        });
        setAlert({
          showAlert: true,
          type: "success",
          message: "Book Updated successfully",
        });
        setButtonText("Done");
        setTimeout(() => {
          window.location.reload();
          // Not needed anymore
          // openMyBooks();
          // close();
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      setButtonText("Update Book");
      setAlert({
        showAlert: true,
        type: "error",
        message: err.response ? err.response.data.message : err.message,
      });
      setTimeout(() => {
        setAlert({ showAlert: false, type: "", message: "" });
      }, 1500);
    }
  }

  const categoriesInput =
    categories.length > 0 ? (
      <select
        className="px-4 py-2 border-slate-500 border-2 rounded-md mb-5"
        value={book.category}
        onChange={(e) => {
          return { ...formData, category: e.target.value };
        }}
      >
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    ) : null;

  const handleIsbn = (e) => {
    const isbn = e.target.value;
    console.log(isbn);
    if (isbn.length < 13 && isbn.length > 9) {
      setIsbnValidation((prev) => {
        return { ...prev, valid: true };
      });
      setFormData({ ...formData, isbn: parseInt(isbn) });
    } else {
      setIsbnValidation({ valid: false });
      setFormData({ ...formData, isbn: parseInt(isbn) });
    }
  };

  return (
    <div className=" overflow-y-scroll">
      {alert.showAlert && <Alert type={alert.type} message={alert.message} />}

      <div
        onClick={close}
        className="fixed z-10 top-0 left-0 bottom-0 right-0 bg-black bg-opacity-30"
      ></div>

      <div className=" max-w-screen-lg flex flex-col border-1 border-blue-200 bg-white p-10 rounded-lg w-screen z-20 fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <div className="flex justify-end">
          <button className="text-gray-700 text-2xl" onClick={close}>
            X
          </button>
        </div>
        <div className="flex justify-center">
          <h2 className="text-2xl font-medium">Update {book.title}</h2>
        </div>
        <form className="flex flex-col w-full mb-6" onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            className="px-4 py-2 border-slate-500 border-2 rounded-md mb-5"
            type="text"
            id="title"
            minLength={3}
            maxLength={50}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          <label htmlFor="body">Body</label>
          <textarea
            className="px-4 py-2 border-slate-500 border-2 rounded-md h-40 mb-5 min-h-max"
            type="text"
            id="body"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            required
          />
          <label htmlFor="isbn">ISBN</label>
          <input
            className="px-4 py-2 border-slate-500 border-2 rounded-md"
            type="number"
            id="isbn"
            minLength={5}
            value={parseInt(formData.isbn)}
            onChange={(e) => handleIsbn(e)}
            required
          />
          {!isbnValidation.valid ? (
            <div className="text-red-500 text-md mt-1 ">
              ISBN must be a number with min length of 10 and max length of 13
            </div>
          ) : null}
          <div className="mt-5">{categoriesInput}</div>

          <button
            className="transition ease-out duration-200 rounded-md bg-slate-600 text-white px-4 py-2 hover:bg-slate-700 hover:shadow-lg hover:cursor-pointer"
            type="submit"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBook;
